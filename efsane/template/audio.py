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

# ---------- değişken tempolu vuruş ızgarası ----------
phase = np.cumsum(bpm / 60 / SR)
nb = int(phase[-1]) + 1
beat_t = np.searchsorted(phase, np.arange(nb)) / SR
def at_beat(b):
    i = int(np.floor(b)); f = b - i
    if i + 1 >= len(beat_t): return beat_t[-1] + f * 60 / bpm[-1]
    return beat_t[i] + f * (beat_t[i + 1] - beat_t[i])
def samp(arr, tsec): return arr[min(N - 1, int(tsec * SR))]

# ---------- armoni ve ana tema (özgün) ----------
CH = [[50, 53, 57], [52, 57, 60], [50, 55, 58], [50, 53, 57], [50, 53, 58], [48, 53, 57], [48, 52, 55], [49, 52, 57]]  # Dm Am Gm Dm | Bb F C A
RT = [38, 33, 43, 38, 34, 41, 36, 33]
THEME = [
    [(0, 69, 1), (1, 74, 1), (2, 76, .5), (2.5, 77, 1.5)], [(0, 76, 1), (1, 74, 1), (2, 72, 1), (3, 69, 1)],
    [(0, 70, 1), (1, 69, 1), (2, 67, 1), (3, 65, .5), (3.5, 64, .5)], [(0, 62, 3), (3, 69, 1)],
    [(0, 77, 1), (1, 79, 1), (2, 81, 2)], [(0, 81, 1), (1, 79, .5), (1.5, 77, .5), (2, 76, 2)],
    [(0, 76, 1), (1, 77, 1), (2, 79, 1), (3, 76, 1)], [(0, 73, 2), (2, 76, 1), (3, 69, 1)]]

def env_adsr(Ln, a, d, s, r):
    e = np.ones(Ln) * s; A = min(Ln, int(a * SR)); D = int(d * SR); R = min(Ln, int(r * SR))
    if A: e[:A] = np.linspace(0, 1, A)
    seg = e[A:A + D]
    if len(seg): e[A:A + D] = np.linspace(1, s, len(seg))
    if R: e[-R:] *= np.linspace(1, 0, R)
    return e
def piano(f, dur, v=1.0):
    Ln = int((dur + 1.8) * SR); tt = np.arange(Ln) / SR; s = np.zeros(Ln)
    for h, a in ((1, 1), (2, .5), (3, .24), (4, .13), (5, .07), (6, .04)):
        s += a * np.sin(2 * np.pi * f * h * (1 + .00045 * h * h) * tt) * np.exp(-tt * (1.3 + h * .8))
    return s * np.minimum(1, tt / .003) * v * .5
def strings(f, dur, v=1.0, bright=.5):
    Ln = int((dur + .6) * SR); tt = np.arange(Ln) / SR; s = np.zeros(Ln)
    vib = 1 + .004 * np.sin(2 * np.pi * 5.3 * tt) * np.minimum(1, tt / .5)
    for d in (-.006, -.002, .002, .006): s += saw(f * (1 + d), tt * vib, rng.random())
    return lp(s, 900 + 3500 * bright, 2) * env_adsr(Ln, .18, .2, .85, .5) * v * .22
def brass(f, dur, v=1.0):
    Ln = int((dur + .4) * SR); tt = np.arange(Ln) / SR
    s = saw(f, tt) + .5 * saw(f * 1.003, tt) + .3 * np.sign(np.sin(2 * np.pi * f * .5 * tt))
    return lp(s, 1600, 2) * env_adsr(Ln, .06, .15, .8, .35) * v * .18
def bassnote(f, dur, v=1.0):
    Ln = int((dur + .2) * SR); tt = np.arange(Ln) / SR
    s = np.sin(2 * np.pi * f * tt) + .45 * saw(f, tt); return lp(s, 380, 3) * env_adsr(Ln, .005, .1, .7, .12) * v * .7
def pluck(f, v=1.0):
    Ln = int(.35 * SR); tt = np.arange(Ln) / SR; s = (saw(f, tt) * .6 + np.sin(2 * np.pi * f * tt)) * np.exp(-tt * 16)
    return lp(s, 2600) * v * .25
def taiko(v=1.0, f0=52):
    Ln = int(1.4 * SR); tt = np.arange(Ln) / SR; f = f0 * (1 + .6 * np.exp(-tt * 25))
    return (np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-tt * 4) + .4 * lp(rng.normal(0, 1, Ln), 700) * np.exp(-tt * 22)) * v
def snare(v=1.0):
    Ln = int(.4 * SR); tt = np.arange(Ln) / SR
    return (bp(rng.normal(0, 1, Ln), 1200, 6000) * np.exp(-tt * 14) + np.sin(2 * np.pi * 190 * tt) * np.exp(-tt * 20) * .5) * v * .6
def cym_swell(dur, v=1.0):
    Ln = int(dur * SR); tt = np.arange(Ln) / SR; return hp(rng.normal(0, 1, Ln), 5000) * (tt / dur) ** 2.2 * v * .35
def choir(f, dur, v=1.0):
    Ln = int((dur + .8) * SR); tt = np.arange(Ln) / SR; s = np.zeros(Ln)
    for d in (-.004, 0, .004): s += saw(f * (1 + d), tt, rng.random())
    s = bp(s, 500, 1300) + .6 * bp(s, 2200, 3200)
    return s * env_adsr(Ln, .5, .2, .9, .8) * v * .25

L = {k: np.zeros(N) for k in ('pad', 'arp', 'mel', 'bass', 'ost', 'perc', 'choir')}
for b in range(nb - 1):
    tb = beat_t[b]
    if tb >= END + .5: break
    bar, bi = divmod(b, 4); ci = bar % 8; ch = CH[ci]; md = samp(mood_at, tb) or 'outro'; E = samp(energy, tb)
    beat_len = beat_t[b + 1] - tb; mspec = MOOD[md]
    if bi == 0:  # yaylı pad
        bar_len = beat_len * 4; br = .15 + .8 * E
        for n in ch + ([ch[0] + 12] if E > .5 else []): put(L['pad'], strings(midi(n), bar_len, .5 + .5 * E, br), tb)
        if md in ('tension', 'dark'): put(L['pad'], strings(midi(RT[ci]), bar_len, .6, .1), tb)
    if mspec[3] and E < .75:  # piyano arpej
        arp = [ch[0] + 12, ch[1] + 12, ch[2] + 12, ch[1] + 12]; steps = 1 if md == 'dark' else 2
        for k in range(steps):
            put(L['arp'], piano(midi(arp[(bi * steps + k) % 4] + (12 if k % 2 else 0)), beat_len, .55), tb + k * beat_len / steps)
        if bi == 0: put(L['arp'], piano(midi(RT[ci] + 12), beat_len * 4, .6), tb)
    if mspec[2] and bi == 0:  # ana tema
        for (ob, n, d) in THEME[ci]:
            st = at_beat(b + ob); dur = at_beat(b + ob + d) - st
            if mspec[2] == 'piano': put(L['mel'], piano(midi(n), dur, .85), st)
            else:
                put(L['mel'], strings(midi(n), dur, .9, .4 + .5 * E), st)
                if E > .75: put(L['mel'], strings(midi(n - 12), dur, .6, .5), st); put(L['mel'], brass(midi(n - 12), dur, .5 * E), st)
    if E > .3:  # bas
        if E > .6 or md == 'escape':
            for k in range(2): put(L['bass'], bassnote(midi(RT[ci]), beat_len / 2 * .8, .9), tb + k * beat_len / 2)
        elif bi in (0, 2): put(L['bass'], bassnote(midi(RT[ci]), beat_len * 1.9, .8), tb)
    if (E > .55 and md in ('escape', 'epic', 'rise', 'outro')) or md == 'escape':  # spiccato ostinato
        pat = [0, 2, 1, 2]
        for k in range(4): put(L['ost'], pluck(midi(ch[pat[k]] + 12), .7 + .3 * (k == 0)), tb + k * beat_len / 4)
    if E > .55:  # perküsyon
        put(L['perc'], taiko(.9 if bi in (0, 2) else .5, 50 if bi == 0 else 62), tb)
        if E > .78:
            if bi in (1, 3): put(L['perc'], snare(.7), tb)
            put(L['perc'], taiko(.35, 70), tb + beat_len / 2)
            if bi == 3 and bar % 2 == 1:
                for k in range(4): put(L['perc'], taiko(.25 + .1 * k, 80), tb + k * beat_len / 4)
        if bi == 3 and bar % 4 == 3 and E > .65: put(L['perc'], cym_swell(beat_len), tb)
    if E > .8 and bi == 0:
        for n in ch: put(L['choir'], choir(midi(n + 12), beat_len * 4, E), tb)

for n in (38, 50, 57, 62, 65, 69): put(L['pad'], strings(midi(n), 3.0, .9, .5), END - .6)
put(L['perc'], taiko(1.2, 46), END - .6)

def norm(x): return x / (np.max(np.abs(x)) + 1e-9)
gE = energy
music = (norm(L['pad']) * (.32 + .35 * gE) + norm(L['arp']) * .42 * (1 - .5 * gE) + norm(L['mel']) * (.38 + .25 * gE)
         + norm(L['bass']) * .45 * np.clip(gE * 1.4, 0, 1) + norm(L['ost']) * .26 + norm(L['perc']) * .55 * np.clip((gE - .45) * 2.5, 0, 1)
         + norm(L['choir']) * .3)
rv = np.zeros(N)
for dly, g in ((.061, .26), (.097, .2), (.149, .15), (.211, .11), (.293, .08)):
    d = int(dly * SR); rv[d:] += music[:-d] * g
music = (music + lp(rv, 5000)) * duck
music *= np.clip((END + 2.2 - t_all) / 2.0, 0, 1)
music = norm(music)

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
    f = 120 * 2 ** (k * 3); tone = saw(1, np.cumsum(f) / SR) * k ** 2 * .25
    return n + lp(tone, 3000)
def S_reverse():
    Ln = int(1.6 * SR); tt = np.arange(Ln) / SR; return hp(rng.normal(0, 1, Ln), 3000) * (tt / 1.6) ** 3 * .8
def S_whoosh():
    Ln = int(1.2 * SR); tt = np.arange(Ln) / SR; return bp(rng.normal(0, 1, Ln), 500, 4000) * np.sin(np.pi * tt / 1.2) ** 2 * .6
def S_ping():
    Ln = int(2 * SR); tt = np.arange(Ln) / SR; return (np.sin(2 * np.pi * 1320 * tt) + .4 * np.sin(2 * np.pi * 2640 * tt)) * np.exp(-tt * 3) * .35
def S_stamp():
    Ln = int(.6 * SR); tt = np.arange(Ln) / SR
    return np.sin(2 * np.pi * (70 + 60 * np.exp(-tt * 40)) * tt) * np.exp(-tt * 12) * 1.1 + bp(rng.normal(0, 1, Ln), 200, 3000) * np.exp(-tt * 40) * .7
def S_scratch():
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
    for k in range(6):
        Lc = int(.05 * SR); put(s, np.sin(2 * np.pi * 2400 * np.arange(Lc) / SR) * np.exp(-np.arange(Lc) / SR * 60) * .3, rng.random() * 8)
    return s * np.minimum(1, tt / .5) * np.clip((9 - tt) / 3, 0, 1) * .55
def S_plane():
    Ln = int(3.5 * SR); tt = np.arange(Ln) / SR; e = np.sin(np.pi * tt / 3.5) ** 2
    return (bp(rng.normal(0, 1, Ln), 200, 2500) * .7 + np.sin(2 * np.pi * 95 * tt) * .2) * e * .7
def S_shutter():
    out = np.zeros(int(2 * SR))
    for k in range(int(4 + rng.random() * 4)):
        Ln = int(.06 * SR); tt = np.arange(Ln) / SR; put(out, hp(rng.normal(0, 1, Ln), 3000) * np.exp(-tt * 90) * .6, rng.random() * 1.8)
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
    return lp(np.sign(np.sin(2 * np.pi * 110 * tt)), 900) * np.minimum(1, tt / .01) * np.minimum(1, (.55 - tt) / .05) * .35
def S_chime():
    Ln = int(2.5 * SR); tt = np.arange(Ln) / SR
    return sum(a * np.sin(2 * np.pi * 880 * r * tt) * np.exp(-tt * (2 + r)) for r, a in ((1, 1), (2.76, .5), (5.4, .25))) * .3
SFX = dict(hit=S_hit, boom=S_boom, heart=S_heart, riser=S_riser, reverse=S_reverse, whoosh=S_whoosh, ping=S_ping, stamp=S_stamp,
           scratch=S_scratch, tick=S_tick, tickroll=S_tickroll, roar=S_roar, gasp=S_gasp, murmur=S_murmur, plane=S_plane,
           shutter=S_shutter, plate=S_plate, clang=S_clang, buzz=S_buzz, chime=S_chime)
sfx = np.zeros(N)
for sc in ev["scenes"]:
    for at, k in sc["sfx"]: put(sfx, SFX[k](), at)
rv = np.zeros(N)
for dly, g in ((.043, .3), (.071, .22), (.113, .15), (.167, .1)):
    d = int(dly * SR); rv[d:] += sfx[:-d] * g
sfx = norm(lp(sfx + rv, 9000))

mix = norm(hp(music * .6 + sfx * .5, 28))
d1, d2 = int(.009 * SR), int(.011 * SR)
st = np.stack([mix * .98 + np.concatenate([np.zeros(d1), mix[:-d1]]) * .02, np.concatenate([np.zeros(d2), mix[:-d2]]) * .97 + mix * .03], 1) * .9
st = st[:int((END + .2) * SR)]
wavfile.write(os.path.join(HERE, f"audio_{EPI}.wav"), SR, (st * 32767).astype(np.int16))
print("ok", END, "beats", nb)
