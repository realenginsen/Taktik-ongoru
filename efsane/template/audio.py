"""Efsanenin Hikâyesi — özgün, telifsiz sinematik müzik + efektler (sıfırdan sentez).
Kullanım: EPI=<slug> python3 audio.py  -> audio_<slug>.wav
Ruh halleri (scene.mood): tension, hit, warm, dark, escape, rise, epic, sad, elegy, outro
Efektler (scene.sfx): heart, hit, whoosh, ping, stamp, scratch, tick, tickroll, roar, plate, clang, buzz, chime
Sahne 'duck': [[t0,t1,seviye]] müziği geçici kısar (ör. kaldırış öncesi sessizlik)."""
import json, os, sys
import numpy as np
from scipy.signal import butter, sosfilt
from scipy.io import wavfile

SR = 44100
HERE = os.path.dirname(os.path.abspath(__file__))
EPI = os.environ["EPI"]
rng = np.random.default_rng(5)

def lp(x, fc, o=2): return sosfilt(butter(o, fc, 'low', fs=SR, output='sos'), x)
def hp(x, fc, o=2): return sosfilt(butter(o, fc, 'high', fs=SR, output='sos'), x)
def bp(x, lo, hi, o=2): return sosfilt(butter(o, [lo, hi], 'band', fs=SR, output='sos'), x)
def midi(n): return 440.0 * 2 ** ((n - 69) / 12)
def saw(f, t, ph=0.0): return 2.0 * ((f * t + ph) % 1.0) - 1.0

ev = json.load(open(os.path.join(HERE, f"audio_events_{EPI}.json")))
TOTAL = ev["total"] + 1.0
N = int(TOTAL * SR)
t_all = np.arange(N) / SR

def put(buf, s, at, g=1.0):
    i = int(at * SR)
    if i >= len(buf): return
    m = min(len(s), len(buf) - i); buf[i:i + m] += s[:m] * g

# ---------- ruh hali -> katman kazançları ----------
LAYERS = ['pad', 'piano', 'pulse', 'drums', 'drone']
MOOD = {
    'tension': dict(pad=0, piano=0, pulse=0, drums=0, drone=1.0),
    'hit':     dict(pad=.2, piano=0, pulse=0, drums=0, drone=.5),
    'warm':    dict(pad=.45, piano=.8, pulse=0, drums=0, drone=0),
    'dark':    dict(pad=.5, piano=.25, pulse=.45, drums=0, drone=.6),
    'escape':  dict(pad=.6, piano=.2, pulse=.8, drums=.35, drone=.2),
    'rise':    dict(pad=.75, piano=.3, pulse=.7, drums=.5, drone=0),
    'epic':    dict(pad=.9, piano=.2, pulse=.9, drums=.9, drone=0),
    'sad':     dict(pad=.35, piano=.7, pulse=0, drums=0, drone=.35),
    'elegy':   dict(pad=.55, piano=.75, pulse=0, drums=0, drone=.15),
    'outro':   dict(pad=.8, piano=.5, pulse=.3, drums=.25, drone=0),
}
gain = {k: np.zeros(N) for k in LAYERS}
duck = np.ones(N)
for sc in ev["scenes"]:
    i0, i1 = int(sc["start"] * SR), int((sc["start"] + sc["dur"]) * SR)
    for k in LAYERS: gain[k][i0:i1] = MOOD.get(sc["mood"], MOOD['warm'])[k]
for sc in ev["scenes"]:
    for d0, d1, lvl in sc.get("duck", []):
        i0, i1 = int((sc["start"] + d0) * SR), int((sc["start"] + d1) * SR); duck[i0:i1] = lvl
def smooth(x, sec):
    k = int(sec * SR); c = np.cumsum(np.concatenate([[0], x])); y = (c[k:] - c[:-k]) / k
    return np.concatenate([np.full(k // 2, y[0]), y, np.full(len(x) - len(y) - k // 2, y[-1])])
for k in LAYERS: gain[k] = smooth(gain[k], 1.2)
duck = smooth(duck, .5)

# ---------- armoni: Re minör, i–VI–III–VII (Dm–Bb–F–C), 72 BPM ----------
BPM = 72; BEAT = 60 / BPM; BAR = 4 * BEAT
CH = [[50, 53, 57], [46, 50, 53], [53, 57, 60], [48, 52, 55]]
RT = [38, 34, 41, 36]
nbars = int(TOTAL / BAR) + 1
end_t = ev["total"]

pad = np.zeros(N)
for b in range(nbars):
    st = b * BAR; i0 = int(st * SR); i1 = min(N, int((st + BAR + .3) * SR))
    if i0 >= N: break
    tt = t_all[i0:i1] - st; ch = CH[b % 4]; sig = np.zeros(i1 - i0)
    for n in ch + [ch[0] + 12]:
        for d in (-.004, 0, .004): sig += saw(midi(n) * (1 + d), tt, rng.random())
    L = len(sig); env = np.minimum(1, tt / .6) * np.minimum(1, (L / SR - tt) / .4)
    pad[i0:i1] += sig * env / 12
pad = lp(pad, 1500, 2) * .9

piano = np.zeros(N)
def pnote(f, dur=2.6, v=1.0):
    L = int(dur * SR); tt = np.arange(L) / SR; s = np.zeros(L)
    for h, a in ((1, 1), (2, .45), (3, .22), (4, .12), (5, .06)):
        s += a * np.sin(2 * np.pi * f * h * (1 + .0004 * h * h) * tt) * np.exp(-tt * (1.6 + h * .9))
    return s * np.minimum(1, tt / .004) * v
for b in range(nbars):
    ch = CH[b % 4]; arp = [ch[0] + 12, ch[1] + 12, ch[2] + 12, ch[1] + 24, ch[2] + 12, ch[0] + 24, ch[1] + 12, ch[2] + 12]
    for k in range(8):
        at = b * BAR + k * BEAT / 2
        if at >= TOTAL: break
        put(piano, pnote(midi(arp[k]), 2.2, .5 + .25 * (k == 0)), at)
    put(piano, pnote(midi(RT[b % 4] + 12), 3.5, .55), b * BAR)
echo = np.zeros(N); d = int(BEAT * .75 * SR); echo[d:] = piano[:-d] * .28; piano = lp(piano + echo, 4200, 2)

pulse = np.zeros(N)
for b in range(nbars):
    for k in range(8):
        at = b * BAR + k * BEAT / 2; f = midi(RT[b % 4]); L = int(BEAT * .42 * SR); tt = np.arange(L) / SR
        s = (saw(f, tt) * .6 + np.sin(2 * np.pi * f * tt)) * np.exp(-tt * 6) * np.minimum(1, tt / .003)
        put(pulse, s, at, .55 + .2 * (k % 2 == 0))
pulse = lp(pulse, 520, 3)

def timp(dur=1.6, f0=55):
    L = int(dur * SR); tt = np.arange(L) / SR; f = f0 * (1 + .25 * np.exp(-tt * 18))
    return (np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-tt * 2.6) + .25 * lp(rng.normal(0, 1, L), 900) * np.exp(-tt * 25))
drums = np.zeros(N)
for b in range(nbars):
    put(drums, timp(1.8, midi(RT[b % 4] - 12)), b * BAR, 1.0)
    put(drums, timp(1.2, midi(RT[b % 4] - 12)), b * BAR + 2 * BEAT, .7)
    L = int(.25 * SR); tt = np.arange(L) / SR
    for k in (1, 3): put(drums, hp(rng.normal(0, 1, L), 2500) * np.exp(-tt * 30), b * BAR + k * BEAT, .25)
    if b % 4 == 3:
        for k in range(8): put(drums, timp(.4, midi(RT[b % 4] - 12)), b * BAR + 3 * BEAT + k * BEAT / 8, .25 + .07 * k)

drone = (np.sin(2 * np.pi * midi(38) * t_all) * .6 + np.sin(2 * np.pi * midi(45) * t_all) * .3) * (1 + .25 * np.sin(2 * np.pi * .12 * t_all))
drone += lp(rng.normal(0, 1, N), 300) * .35
drone *= .5

music = (pad * gain['pad'] + piano * gain['piano'] * .9 + pulse * gain['pulse'] * .8 + drums * gain['drums'] * .9 + drone * gain['drone']) * duck
# final: son akor ve kuyruk
fade = np.clip((end_t + .8 - t_all) / 2.5, 0, 1); music *= fade
music /= np.max(np.abs(music)) + 1e-9

# ---------- efektler ----------
def env_exp(L, k): return np.exp(-np.arange(L) / SR * k)
def S_hit():
    L = int(2.5 * SR); tt = np.arange(L) / SR; f = 42 + 90 * np.exp(-tt * 20)
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-tt * 2.2) * 1.2 + lp(rng.normal(0, 1, L), 2000) * np.exp(-tt * 6) * .5
def S_heart():
    out = np.zeros(int(7 * SR))
    for k in range(8):
        for off, g in ((0, 1), (.22, .7)):
            L = int(.3 * SR); tt = np.arange(L) / SR; s = np.sin(2 * np.pi * (50 + 30 * np.exp(-tt * 30)) * tt) * np.exp(-tt * 14)
            put(out, s, k * .85 + off, g)
    return out * 1.3
def S_whoosh():
    L = int(1.2 * SR); tt = np.arange(L) / SR; n = rng.normal(0, 1, L); e = np.sin(np.pi * tt / 1.2) ** 2
    return bp(n, 500, 4000) * e * .6
def S_ping():
    L = int(2 * SR); tt = np.arange(L) / SR
    return (np.sin(2 * np.pi * 1320 * tt) + .4 * np.sin(2 * np.pi * 2640 * tt)) * np.exp(-tt * 3) * .35
def S_stamp():
    L = int(.6 * SR); tt = np.arange(L) / SR
    return np.sin(2 * np.pi * (70 + 60 * np.exp(-tt * 40)) * tt) * np.exp(-tt * 12) * 1.1 + bp(rng.normal(0, 1, L), 200, 3000) * np.exp(-tt * 40) * .7
def S_scratch():
    L = int(.5 * SR); tt = np.arange(L) / SR
    return bp(rng.normal(0, 1, L), 1500, 6000) * (np.sin(np.pi * tt / .5) ** .5) * (1 + .5 * np.sin(2 * np.pi * 30 * tt)) * .4
def S_tick():
    L = int(.08 * SR); tt = np.arange(L) / SR
    return (np.sin(2 * np.pi * 1800 * tt) * np.exp(-tt * 80) + hp(rng.normal(0, 1, L), 4000) * np.exp(-tt * 200) * .3) * .5
def S_tickroll():
    out = np.zeros(int(2.5 * SR)); t = 0; gap = .16
    while t < 2.3: put(out, S_tick(), t, .6); t += gap; gap = max(.035, gap * .9)
    return out
def S_roar():
    L = int(6 * SR); tt = np.arange(L) / SR; n = bp(rng.normal(0, 1, L), 250, 2800, 2)
    e = np.minimum(1, tt / .35) * np.exp(-np.maximum(0, tt - 1.5) * .7) * (1 + .15 * np.sin(2 * np.pi * 1.7 * tt))
    return n * e * 1.4
def metal(L, parts, dk):
    tt = np.arange(L) / SR; s = np.zeros(L)
    for f, a in parts: s += a * np.sin(2 * np.pi * f * tt) * np.exp(-tt * dk * (1 + f / 3000))
    return s
def S_plate():
    L = int(.9 * SR); return metal(L, [(410, 1), (1133, .6), (2389, .35), (3770, .2)], 7) * .5 + np.pad(S_stamp(), (0, L - int(.6 * SR))) * .35
def S_clang():
    L = int(2.2 * SR); return metal(L, [(310, 1), (870, .7), (1710, .5), (2930, .3)], 3) * .7 + np.pad(S_stamp(), (0, L - int(.6 * SR))) * .9
def S_buzz():
    L = int(.55 * SR); tt = np.arange(L) / SR
    return lp(np.sign(np.sin(2 * np.pi * 110 * tt)), 900) * np.minimum(1, tt / .01) * np.minimum(1, (.55 - tt) / .05) * .35
def S_chime():
    L = int(2.5 * SR); tt = np.arange(L) / SR
    return sum(a * np.sin(2 * np.pi * 880 * r * tt) * np.exp(-tt * (2 + r)) for r, a in ((1, 1), (2.76, .5), (5.4, .25))) * .3
SFX = dict(hit=S_hit, heart=S_heart, whoosh=S_whoosh, ping=S_ping, stamp=S_stamp, scratch=S_scratch, tick=S_tick,
           tickroll=S_tickroll, roar=S_roar, plate=S_plate, clang=S_clang, buzz=S_buzz, chime=S_chime)
sfx = np.zeros(N)
for sc in ev["scenes"]:
    for at, k in sc["sfx"]: put(sfx, SFX[k](), at)
# küçük oda yankısı
rv = np.zeros(N)
for dly, g in ((.043, .3), (.071, .22), (.113, .15), (.167, .1)):
    dd = int(dly * SR); rv[dd:] += sfx[:-dd] * g
sfx = lp(sfx + rv, 9000)
sfx /= np.max(np.abs(sfx)) + 1e-9

mix = music * .62 + sfx * .55
mix = hp(mix, 28)
mix /= np.max(np.abs(mix)) + 1e-9
st = np.stack([mix, np.concatenate([np.zeros(int(.012 * SR)), mix[:-int(.012 * SR)]]) * .97 + mix * .03], 1) * .9
wavfile.write(os.path.join(HERE, f"audio_{EPI}.wav"), SR, (st * 32767).astype(np.int16))
print("ok", TOTAL)
