"""Efsanenin Hikâyesi — dinamik, özgün sinematik müzik + efektler (tamamen sıfırdan sentez, telifsiz).
Kullanım: EPI=<slug> python3 audio.py  -> audio_<slug>.wav

Sahne alanları (episodes/<slug>.js):
  mood   : tension | hit | warm | dark | escape | rise | epic | sad | elegy | outro   -> tempo, armoni rengi, enstrüman seçimi
  energy : [[t, 0..1], ...]  sahne içi yoğunluk eğrisi (yoksa ruh halinin varsayılanı). Katmanlar enerjiye göre açılır/kapanır.
  duck   : [[t0, t1, seviye]] müziği geçici kısar (ör. büyük andan önce sessizlik)
  sfx    : [[t, ad]]  heart, hit, boom, riser, reverse, whoosh, ping, stamp, scratch, tick, tickroll, roar, plate, clang, buzz,
                      chime, murmur, plane, shutter, gasp
Müzik: Re minör ana tema (8 ölçü, özgün). Tempo ruh haline göre 66–104 BPM arasında yumuşakça değişir (accelerando/ritardando).
"""
import json, os
import numpy as np
from scipy.signal import butter, sosfilt
from scipy.io import wavfile

SR = 44100
HERE = os.path.dirname(os.path.abspath(__file__))
EPI = os.environ["EPI"]
rng = np.random.default_rng(5)

def lp(x, fc, o=2): return sosfilt(butter(o, min(fc, SR / 2 - 100), 'low', fs=SR, output='sos'), x)
def hp(x, fc, o=2): return sosfilt(butter(o, fc, 'high', fs=SR, output='sos'), x)
def bp(x, lo, hi, o=2): return sosfilt(butter(o, [lo, hi], 'band', fs=SR, output='sos'), x)
def midi(n): return 440.0 * 2 ** ((n - 69) / 12)
def saw(f, t, ph=0.0): return 2.0 * ((f * t + ph) % 1.0) - 1.0

ev = json.load(open(os.path.join(HERE, f"audio_events_{EPI}.json")))
END = ev["total"]; TOTAL = END + 2.5
N = int(TOTAL * SR); t_all = np.arange(N) / SR
def put(buf, s, at, g=1.0):
    i = int(at * SR)
    if i >= len(buf) or i + len(s) <= 0: return
    if i < 0: s = s[-i:]; i = 0
    m = min(len(s), len(buf) - i); buf[i:i + m] += s[:m] * g

# ---------- ruh hali tablosu: bpm, varsayılan enerji, melodi enstrümanı, arpej ----------
MOOD = {
    'tension': (70, .25, None, False), 'hit': (76, .5, None, False), 'warm': (78, .35, 'piano', True),
    'dark': (72, .4, None, True), 'escape': (98, .65, None, False), 'rise': (88, .8, 'strings', False),
    'epic': (104, .85, 'strings', False), 'sad': (66, .25, 'piano', True), 'elegy': (68, .4, 'piano', True),
    'outro': (86, .8, 'strings', False)}
mood_at = np.empty(N, dtype=object); bpm = np.zeros(N); energy = np.zeros(N); duck = np.ones(N)
for sc in ev["scenes"]:
    i0, i1 = int(sc["start"] * SR), int((sc["start"] + sc["dur"]) * SR)
    m = MOOD.get(sc["mood"], MOOD['warm']); mood_at[i0:i1] = sc["mood"]; bpm[i0:i1] = m[0]
    keys = sc.get("energy") or [[0, m[1]]]
    tt = t_all[i0:i1] - sc["start"]; energy[i0:i1] = np.interp(tt, [k[0] for k in keys], [k[1] for k in keys])
    for d0, d1, lvl in sc.get("duck", []): duck[int((sc["start"] + d0) * SR):int((sc["start"] + d1) * SR)] = lvl
i_end = int(END * SR); mood_at[i_end:] = 'outro'; bpm[i_end:] = bpm[i_end - 1]; energy[i_end:] = 0
def smooth(x, sec):
    k = max(1, int(sec * SR)); c = np.cumsum(np.concatenate([[0], x])); y = (c[k:] - c[:-k]) / k
    pad0 = k // 2; return np.concatenate([np.full(pad0, y[0]), y, np.full(len(x) - len(y) - pad0, y[-1])])
bpm = smooth(bpm, 3.0); energy = np.clip(smooth(energy, .9), 0, 1); duck = smooth(duck, .35)

# ---------- sabit tempo (72 BPM): dalgalanma yok; yoğunluk katmanlarla değişir ----------
BPM = 72.0; BEAT = 60 / BPM
nb = int(TOTAL / BEAT) + 2
beat_t = np.arange(nb) * BEAT
def at_beat(b): return b * BEAT
def samp(arr, tsec): return arr[min(N - 1, int(tsec * SR))]

# ---------- armoni ve ana tema (özgün) ----------
CH = [[50, 53, 57], [52, 57, 60], [50, 55, 58], [50, 53, 57], [50, 53, 58], [48, 53, 57], [48, 52, 55], [49, 52, 57]]  # Dm Am Gm Dm | Bb F C A
RT = [38, 33, 43, 38, 34, 41, 36, 33]
THEME = [
    [(0, 69, 1), (1, 74, 1), (2, 76, .5), (2.5, 77, 1.5)], [(0, 76, 1), (1, 74, 1), (2, 72, 1), (3, 69, 1)],
    [(0, 70, 1), (1, 69, 1), (2, 67, 1), (3, 65, .5), (3.5, 64, .5)], [(0, 62, 3), (3, 69, 1)],
    [(0, 77, 1), (1, 79, 1), (2, 81, 2)], [(0, 81, 1), (1, 79, .5), (1.5, 77, .5), (2, 76, 2)],
    [(0, 76, 1), (1, 77, 1), (2, 79, 1), (3, 76, 1)], [(0, 73, 2), (2, 76, 1), (3, 69, 1)]]

# ---------- tıklamasız, bant sınırlı enstrümanlar ----------
def fade(sig, a=.006, r=.06):
    n = len(sig); A = min(n, int(a * SR)); R = min(n, int(r * SR))
    if A: sig[:A] *= np.linspace(0, 1, A)
    if R: sig[-R:] *= np.linspace(1, 0, R) ** 2
    return sig
TBL = {}
def table(f, bright):  # tek periyot, aliasing olmayan testere/korno karışımı
    K = int(max(1, min(48, 11000 / f))); key = (K, round(bright, 2))
    if key in TBL: return TBL[key]
    ph = np.arange(4096) / 4096; t = np.zeros(4096)
    for k in range(1, K + 1): t += np.sin(2 * np.pi * k * ph) / k * (bright ** (k - 1))
    t /= np.max(np.abs(t)); TBL[key] = t; return t
def osc(f, n, bright, detune_cents=0.0, ph0=0.0):
    ff = f * 2 ** (detune_cents / 1200); phase = (ph0 + ff * np.arange(n) / SR) % 1.0
    return np.interp(phase * 4096, np.arange(4097), np.append(table(f, bright), table(f, bright)[0]))
def env_asr(n, a, r, curve=1.0):
    e = np.ones(n); A = min(n, int(a * SR)); R = min(n - A, int(r * SR))
    if A: e[:A] = np.linspace(0, 1, A) ** curve
    if R: e[-R:] = np.linspace(1, 0, R) ** 2
    return e
def strings(f, dur, v=1.0, bright=.5):
    n = int((dur + .9) * SR); s = np.zeros(n)
    for dc, ph in ((-3, .1), (0, .5), (3, .8)): s += osc(f, n, .55 + .35 * bright, dc, ph)
    return s * env_asr(n, .35, .9, 1.5) * v * .16
def horn(f, dur, v=1.0):
    n = int((dur + .5) * SR); tt = np.arange(n) / SR
    s = sum(np.sin(2 * np.pi * f * k * tt) * a for k, a in ((1, 1), (2, .55), (3, .35), (4, .18), (5, .1)))
    return s * env_asr(n, .12, .45, 1.2) * v * .16
def piano(f, dur, v=1.0):
    n = int((dur + 2.2) * SR); tt = np.arange(n) / SR; s = np.zeros(n)
    for h, a in ((1, 1), (2, .45), (3, .2), (4, .1), (5, .05), (6, .025)):
        fh = f * h * np.sqrt(1 + .0004 * h * h)
        if fh > 12000: break
        s += a * np.sin(2 * np.pi * fh * tt) * (.7 * np.exp(-tt * (1.1 + .6 * h)) + .3 * np.exp(-tt * (.25 + .15 * h)))
    s += lp(rng.normal(0, 1, n), 2500) * np.exp(-tt * 60) * .05  # çekiç
    rel = np.ones(n); i = int((dur + .25) * SR)
    if i < n: rel[i:] = np.exp(-(tt[i:] - tt[i]) * 5)  # pedal bırakılınca yumuşak sönüm
    return fade(s * rel * v * .45, .002, .08)
def bassnote(f, dur, v=1.0):
    n = int((dur + .3) * SR); tt = np.arange(n) / SR
    s = np.sin(2 * np.pi * f * tt) + .3 * np.sin(2 * np.pi * 2 * f * tt) + .1 * np.sin(2 * np.pi * 3 * f * tt)
    return s * env_asr(n, .02, .25) * v * .5
def cello(f, dur, v=1.0):  # kısa legato yaylı (ostinato)
    n = int((dur + .15) * SR); s = osc(f, n, .6, 0, rng.random()) + osc(f, n, .6, 4, rng.random())
    return s * env_asr(n, .03, .12, 1) * v * .12
def taiko(v=1.0, f0=52):
    n = int(1.6 * SR); tt = np.arange(n) / SR; f = f0 * (1 + .5 * np.exp(-tt * 22))
    s = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-tt * 3.5) + .25 * lp(rng.normal(0, 1, n), 500) * np.exp(-tt * 25)
    return fade(s * v, .001, .2)
def choir(f, dur, v=1.0):  # "aah" formantlı koro, bant sınırlı
    n = int((dur + 1.2) * SR); tt = np.arange(n) / SR; s = np.zeros(n)
    for dc in (-4, 0, 4):
        ff = f * 2 ** (dc / 1200)
        for k in range(1, int(min(30, 6000 / ff)) + 1):
            fk = ff * k; w = np.exp(-((fk - 750) / 260) ** 2) + .6 * np.exp(-((fk - 1150) / 300) ** 2) + .25 * np.exp(-((fk - 2800) / 500) ** 2) + .15 / k
            s += w * np.sin(2 * np.pi * fk * tt + rng.random() * 6)
    return s / 3 * env_asr(n, .7, 1.1, 1.5) * v * .05
def cymswell(dur, v=1.0):
    n = int(dur * SR); tt = np.arange(n) / SR; return bp(rng.normal(0, 1, n), 3000, 9000) * (tt / dur) ** 2.5 * v * .25

L = {k: np.zeros(N) for k in ('pad', 'arp', 'mel', 'bass', 'ost', 'perc', 'choir')}
for b in range(nb - 1):
    tb = beat_t[b]
    if tb >= END + .5: break
    bar, bi = divmod(b, 4); ci = bar % 8; ch = CH[ci]; md = samp(mood_at, tb) or 'outro'; E = samp(energy, tb); mspec = MOOD[md]
    if bi == 0:
        for n in ch + ([ch[0] + 12] if E > .55 else []): put(L['pad'], strings(midi(n), BEAT * 4, .5 + .5 * E, E), tb)
        if md in ('tension', 'dark', 'sad'): put(L['pad'], strings(midi(RT[ci] + 12), BEAT * 4, .5, .2), tb)
    if mspec[3] and E < .75:
        arp = [ch[0] + 12, ch[1] + 12, ch[2] + 12, ch[1] + 24]
        steps = 1 if md == 'dark' else 2
        for k in range(steps): put(L['arp'], piano(midi(arp[(bi * steps + k) % 4]), BEAT / steps, .45), tb + k * BEAT / steps)
        if bi == 0: put(L['arp'], piano(midi(RT[ci] + 12), BEAT * 4, .5), tb)
    if mspec[2] and bi == 0:
        for (ob, n, d) in THEME[ci]:
            st = at_beat(b + ob); dur = d * BEAT
            if mspec[2] == 'piano': put(L['mel'], piano(midi(n), dur, .8), st)
            else:
                put(L['mel'], strings(midi(n), dur, .8, .35 + .4 * E), st)
                if E > .75: put(L['mel'], horn(midi(n - 12), dur, .6 * E), st)
    if E > .3:
        if E > .6 or md == 'escape':
            for k in range(2): put(L['bass'], bassnote(midi(RT[ci]), BEAT / 2 * .85, .85), tb + k * BEAT / 2)
        elif bi in (0, 2): put(L['bass'], bassnote(midi(RT[ci]), BEAT * 1.9, .8), tb)
    if (E > .55 and md in ('escape', 'epic', 'rise', 'outro')) or md == 'escape':
        pat = [0, 2, 1, 2]
        for k in range(4): put(L['ost'], cello(midi(ch[pat[k]]), BEAT / 4 * .9, .8 + .2 * (k == 0)), tb + k * BEAT / 4)
    if E > .55:
        put(L['perc'], taiko(.9 if bi in (0, 2) else .45, 48 if bi == 0 else 58), tb)
        if E > .8:
            put(L['perc'], taiko(.3, 66), tb + BEAT / 2)
            if bi == 3 and bar % 2 == 1:
                for k in range(4): put(L['perc'], taiko(.2 + .08 * k, 72), tb + k * BEAT / 4)
        if bi == 3 and bar % 4 == 3 and E > .65: put(L['perc'], cymswell(BEAT), tb)
    if E > .8 and bi == 0:
        for n in ch: put(L['choir'], choir(midi(n + 12), BEAT * 4, E), tb)

for n in (38, 50, 57, 62, 65, 69): put(L['pad'], strings(midi(n), 3.0, .9, .5), END - .6)
put(L['perc'], taiko(1.1, 44), END - .6)

def norm(x): return x / (np.max(np.abs(x)) + 1e-9)
gE = energy
dry = (norm(L['pad']) * (.34 + .3 * gE) + norm(L['arp']) * .4 * (1 - .5 * gE) + norm(L['mel']) * (.4 + .2 * gE)
       + norm(L['bass']) * .42 * np.clip(gE * 1.4, 0, 1) + norm(L['ost']) * .24 + norm(L['perc']) * .5 * np.clip((gE - .45) * 2.5, 0, 1)
       + norm(L['choir']) * .28)
# konser salonu yankısı: sentetik dürtü yanıtı (2,8 sn), stereo
from scipy.signal import fftconvolve
def ir(seed):
    r = np.random.default_rng(seed); n = int(2.8 * SR); tt = np.arange(n) / SR
    x = r.normal(0, 1, n) * np.exp(-tt * 2.3); x = lp(x, 6000) * .6 + lp(x, 1800) * .4; x[:int(.012 * SR)] = 0; return x / np.sqrt((x ** 2).sum())
wetL = fftconvolve(dry, ir(1))[:N]; wetR = fftconvolve(dry, ir(2))[:N]
musL = dry * .75 + wetL * .55; musR = dry * .75 + wetR * .55
fadeout = np.clip((END + 2.2 - t_all) / 2.0, 0, 1)
musL *= duck * fadeout; musR *= duck * fadeout
m = max(np.max(np.abs(musL)), np.max(np.abs(musR))) + 1e-9; musL /= m; musR /= m

# ---------- efektler ----------
def S_hit():
    Ln = int(2.8 * SR); tt = np.arange(Ln) / SR; f = 40 + 90 * np.exp(-tt * 18)
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-tt * 2) * 1.2 + lp(rng.normal(0, 1, Ln), 2200) * np.exp(-tt * 5) * .55
def S_boom():
    Ln = int(3.5 * SR); tt = np.arange(Ln) / SR; return np.sin(2 * np.pi * (32 + 20 * np.exp(-tt * 6)) * tt) * np.exp(-tt * 1.2) * 1.3
def S_heart():
    out = np.zeros(int(7 * SR))
    for k in range(8):
        for off, g in ((0, 1), (.22, .7)):
            Ln = int(.3 * SR); tt = np.arange(Ln) / SR; put(out, np.sin(2 * np.pi * (48 + 30 * np.exp(-tt * 30)) * tt) * np.exp(-tt * 14), k * .82 + off, g)
    return out * 1.3
def S_riser():
    Ln = int(2.6 * SR); tt = np.arange(Ln) / SR; k = tt / 2.6
    n = bp(rng.normal(0, 1, Ln), 300, 7000) * k ** 2.5 * .7
    f = 120 * 2 ** (k * 3); tone = np.sin(2 * np.pi * np.cumsum(f) / SR) * k ** 2 * .3
    return fade(n + tone, .01, .05)
def S_reverse():
    Ln = int(1.6 * SR); tt = np.arange(Ln) / SR; return hp(rng.normal(0, 1, Ln), 3000) * (tt / 1.6) ** 3 * .8
def S_whoosh():
    Ln = int(1.2 * SR); tt = np.arange(Ln) / SR; return bp(rng.normal(0, 1, Ln), 500, 4000) * np.sin(np.pi * tt / 1.2) ** 2 * .6
def S_ping():
    Ln = int(2 * SR); tt = np.arange(Ln) / SR; return (np.sin(2 * np.pi * 1320 * tt) + .4 * np.sin(2 * np.pi * 2640 * tt)) * np.exp(-tt * 3) * .35
def S_stamp():
    Ln = int(.6 * SR); tt = np.arange(Ln) / SR
    return np.sin(2 * np.pi * (70 + 60 * np.exp(-tt * 40)) * tt) * np.exp(-tt * 12) * 1.1 + bp(rng.normal(0, 1, Ln), 200, 3000) * np.exp(-tt * 40) * .7
def S_scratch_unused():
    Ln = int(.5 * SR); tt = np.arange(Ln) / SR
    return bp(rng.normal(0, 1, Ln), 1500, 6000) * (np.sin(np.pi * tt / .5) ** .5) * (1 + .5 * np.sin(2 * np.pi * 30 * tt)) * .4
def S_tick():
    Ln = int(.08 * SR); tt = np.arange(Ln) / SR
    return (np.sin(2 * np.pi * 1800 * tt) * np.exp(-tt * 80) + hp(rng.normal(0, 1, Ln), 4000) * np.exp(-tt * 200) * .3) * .5
def S_tickroll():
    out = np.zeros(int(2.5 * SR)); t = 0; gap = .16
    while t < 2.3: put(out, S_tick(), t, .6); t += gap; gap = max(.035, gap * .9)
    return out
def S_roar():
    Ln = int(6 * SR); tt = np.arange(Ln) / SR; n = bp(rng.normal(0, 1, Ln), 250, 2800, 2)
    e = np.minimum(1, tt / .3) * np.exp(-np.maximum(0, tt - 1.6) * .6) * (1 + .15 * np.sin(2 * np.pi * 1.7 * tt))
    return n * e * 1.4
def S_gasp():
    Ln = int(1.5 * SR); tt = np.arange(Ln) / SR; return bp(rng.normal(0, 1, Ln), 300, 2000) * np.minimum(1, tt / .08) * np.exp(-tt * 2.5) * .9
def S_murmur():
    Ln = int(9 * SR); tt = np.arange(Ln) / SR; s = np.zeros(Ln)
    for k in range(10):
        f0 = 140 + rng.random() * 120; mod = (np.sin(2 * np.pi * (2 + rng.random() * 3) * tt + rng.random() * 6) > .2).astype(float)
        s += bp(rng.normal(0, 1, Ln), f0 * 2, f0 * 7) * lp(mod, 8) * .3
    return s * np.minimum(1, tt / .5) * np.clip((9 - tt) / 3, 0, 1) * .55
def S_plane():
    Ln = int(3.5 * SR); tt = np.arange(Ln) / SR; e = np.sin(np.pi * tt / 3.5) ** 2
    return (bp(rng.normal(0, 1, Ln), 200, 2500) * .7 + np.sin(2 * np.pi * 95 * tt) * .2) * e * .7
def S_shutter():  # yumuşak deklanşör: kısa, tonlu, cızırtısız
    out = np.zeros(int(2 * SR))
    for k in range(3):
        Ln = int(.05 * SR); tt = np.arange(Ln) / SR; put(out, fade(bp(rng.normal(0, 1, Ln), 1500, 4000) * np.exp(-tt * 70) * .25 + np.sin(2 * np.pi * 900 * tt) * np.exp(-tt * 90) * .2, .001, .02), .3 + k * .55)
    return out
def metal(Ln, parts, dk):
    tt = np.arange(Ln) / SR; s = np.zeros(Ln)
    for f, a in parts: s += a * np.sin(2 * np.pi * f * tt) * np.exp(-tt * dk * (1 + f / 3000))
    return s
def S_plate():
    Ln = int(.9 * SR); return metal(Ln, [(410, 1), (1133, .6), (2389, .35), (3770, .2)], 7) * .5 + np.pad(S_stamp(), (0, Ln - int(.6 * SR))) * .35
def S_clang():
    Ln = int(2.2 * SR); return metal(Ln, [(310, 1), (870, .7), (1710, .5), (2930, .3)], 3) * .7 + np.pad(S_stamp(), (0, Ln - int(.6 * SR))) * .9
def S_buzz():
    Ln = int(.55 * SR); tt = np.arange(Ln) / SR
    return sum(np.sin(2 * np.pi * 110 * k * tt) / k for k in (1, 3, 5, 7)) * np.minimum(1, tt / .01) * np.minimum(1, (.55 - tt) / .06) * .25
def S_chime():
    Ln = int(2.5 * SR); tt = np.arange(Ln) / SR
    return sum(a * np.sin(2 * np.pi * 880 * r * tt) * np.exp(-tt * (2 + r)) for r, a in ((1, 1), (2.76, .5), (5.4, .25))) * .3
SFX = dict(hit=S_hit, boom=S_boom, heart=S_heart, riser=S_riser, reverse=S_reverse, whoosh=S_whoosh, ping=S_ping, stamp=S_stamp,
           scratch=S_whoosh, tick=S_tick, tickroll=S_tickroll, roar=S_roar, gasp=S_gasp, murmur=S_murmur, plane=S_plane,
           shutter=S_shutter, plate=S_plate, clang=S_clang, buzz=S_buzz, chime=S_chime)
sfx = np.zeros(N)
for sc in ev["scenes"]:
    for at, k in sc["sfx"]: put(sfx, SFX[k](), at)
sfx = norm(lp(sfx + .35 * fftconvolve(sfx, ir(3))[:N], 9000))

L_ = hp(musL * .6 + sfx * .5, 28); R_ = hp(musR * .6 + sfx * .5, 28)
st = np.stack([L_, R_], 1); st = np.tanh(st / (np.max(np.abs(st)) + 1e-9) * 1.3) / np.tanh(1.3) * .9  # yumuşak sınırlayıcı
st = st[:int((END + .2) * SR)]
wavfile.write(os.path.join(HERE, f"audio_{EPI}.wav"), SR, (st * 32767).astype(np.int16))
print("ok", END, "beats", nb)
# yalnız efekt izi (dış müzikle karıştırmak için: music_mix.py)
wavfile.write(os.path.join(HERE, f"audio_sfx_{EPI}.wav"), SR, (np.clip(sfx[:int((END + .2) * SR)], -1, 1) * 32767).astype(np.int16))
# yalnız sentez müzik izi (kullanıcı şarkısıyla birlikte "story" modunda kullanılır)
wavfile.write(os.path.join(HERE, f"audio_score_{EPI}.wav"), SR, (np.stack([musL, musR], 1)[:int((END + .2) * SR)] * .95 * 32767).astype(np.int16))
