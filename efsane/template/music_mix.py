"""Dış (kullanıcının verdiği) müziği bölüme uyarlar.
Mod "story" (önerilen): şarkı hikâyenin dönüm noktasında girer, drop doruğa denk gelir, bir kez çalar; geri kalanda kendi bestemiz (audio_score_<slug>.wav), finalde kısa dönüş.
Kullanım: EPI=<slug> python3 music_mix.py   (önce: EPI=<slug> python3 audio.py  -> audio_sfx_<slug>.wav)
Yapılandırma: episodes/<slug>.music.json
  src: müzik dosyası · bpm, phase: vuruş ızgarası · drop: şarkıdaki drop anı (sn) · anchor: drop'un videoda denk geleceği an (doruk)
  body: döngülenecek gövde [başlangıç, bitiş] (ölçü katı) · outro: kapanış parçası · intro_at: şarkı girişinin videoda başladığı an (= anchor - drop)
  shape: [[video_sn, açıklık 0..1 (0 = boğuk/alçak geçiren), kazanç dB], ...] — müzik hikâyeyle açılıp kapanır
Sonuç: audio_<slug>.wav (müzik + efektler)"""
import json, os, subprocess
import numpy as np
from scipy.io import wavfile
from scipy.signal import butter, sosfilt
HERE = os.path.dirname(os.path.abspath(__file__)); EPI = os.environ["EPI"]; SR = 44100
cfg = json.load(open(os.path.join(HERE, "episodes", EPI + ".music.json")))
ev = json.load(open(os.path.join(HERE, f"audio_events_{EPI}.json"))); END = ev["total"]
tmp = "/tmp/_song.wav"; subprocess.run(["ffmpeg", "-loglevel", "error", "-y", "-i", os.path.join(HERE, cfg["src"]), "-ar", str(SR), "-ac", "2", tmp], check=True)
sr, song = wavfile.read(tmp); song = song.astype(np.float64) / 32768
N = int(END * SR); out = np.zeros((N, 2))
bar = 4 * 60 / cfg["bpm"]; b0, b1 = cfg["body"]; o0, o1 = cfg["outro"]; blen = b1 - b0
XF = int(.03 * SR)
def place(vt, st, length, fin=XF, fout=XF):
    i0 = int(vt * SR); s0 = int(st * SR); n = int(length * SR)
    seg = song[s0:s0 + n].copy(); n = len(seg)
    if i0 < 0: seg = seg[-i0:]; n = len(seg); i0 = 0
    if i0 >= N or n <= 0: return
    if fin: seg[:fin] *= np.linspace(0, 1, fin)[:, None]
    if fout: seg[-fout:] *= np.linspace(1, 0, fout)[:, None]
    m = min(n, N - i0); out[i0:i0 + m] += seg[:m]
def loop_body(v_start, v_end, phase0=0.0):
    t = v_start; pos = phase0
    while t < v_end:
        L = min(blen - pos, v_end - t) + XF / SR; place(t - XF / SR, b0 + pos, L); t += blen - pos; pos = 0.0
if cfg.get("mode") == "story":
    # şarkı: girişten sona bir kez, tekrarsız; drop = anchor
    place(cfg["song_in"], 0.0, len(song) / SR, fin=int(.3 * SR), fout=int(.5 * SR))
    rp = cfg["reprise"]; place(rp["at"], rp["src"], rp["len"], fin=int(.25 * SR), fout=int(1.4 * SR))
    songbus = out.copy()
    sr3, sc = wavfile.read(os.path.join(HERE, f"audio_score_{EPI}.wav")); sc = sc.astype(np.float64) / 32767
    sc = np.pad(sc, ((0, max(0, N - len(sc))), (0, 0)))[:N]
    gate = np.zeros(N)
    for a0, a1 in cfg["score_spans"]: gate[int(a0 * SR):int(a1 * SR)] = 1
    k = int(1.6 * SR); gate = np.convolve(gate, np.ones(k) / k, 'same')
    def rms(x): return np.sqrt((x[np.abs(x).sum(1) > 1e-4] ** 2).mean()) + 1e-9
    sc = sc * gate[:, None]; sc *= rms(songbus) / rms(sc) * 10 ** (cfg.get("score_rel_db", -3) / 20)
    mus = songbus + sc
    outro_at = cfg["song_in"] + len(song) / SR
else:
    intro_at = cfg["intro_at"]; anchor = cfg["anchor"]
    loop_body(0.0, intro_at)
    fade = int(1.5 * SR); i = int(intro_at * SR); out[i - fade:i] *= np.linspace(1, 0, fade)[:, None] ** 2; out[i:] = 0
    place(intro_at, 0.0, cfg["drop"] + XF / SR, fin=int(.3 * SR))
    n_bars = int(round((END - o1 + o0 - anchor) / bar)); outro_at = anchor + n_bars * bar
    loop_body(anchor, outro_at)
    place(outro_at - XF / SR, o0, o1 - o0 + XF / SR)
    t = np.arange(N) / SR; sh = np.array(cfg["shape"])
    opn = np.interp(t, sh[:, 0], sh[:, 1]); gdb = np.interp(t, sh[:, 0], sh[:, 2])
    k = int(.4 * SR); ker = np.ones(k) / k
    opn = np.convolve(opn, ker, 'same'); gdb = np.convolve(gdb, ker, 'same')
    lpf = sosfilt(butter(2, 700, 'low', fs=SR, output='sos'), out, axis=0)
    mus = (lpf * (1 - opn)[:, None] + out * opn[:, None]) * (10 ** (gdb / 20))[:, None]
mus[-int(1.2 * SR):] *= np.linspace(1, 0, int(1.2 * SR))[:, None]
# efektler
sr2, fx = wavfile.read(os.path.join(HERE, f"audio_sfx_{EPI}.wav")); fx = fx.astype(np.float64) / 32767; fx = np.pad(fx, (0, max(0, N - len(fx))))[:N]
mix = mus / (np.max(np.abs(mus)) + 1e-9) * .85 + fx[:, None] * cfg.get("sfx_gain", .38)
mix = np.tanh(mix / (np.max(np.abs(mix)) + 1e-9) * 1.2) / np.tanh(1.2) * .9
wavfile.write(os.path.join(HERE, f"audio_{EPI}.wav"), SR, (mix * 32767).astype(np.int16))
print("ok", END, "outro_at", round(outro_at, 2))
