# Özgün sentez müzik: 120 BPM, Re minör, trap/epik story beat.
# Kullanım: python3 music.py plan.json out.wav
# plan.json: {"dur": 40, "bpm": 120, "sections": [[t0, t1, "intro|drop|full|break|build|outro"]], "hits": [t,...], "whoosh": [t,...]}
import json, sys, numpy as np
from scipy.io import wavfile
from scipy.signal import butter, sosfilt
SR = 44100
rng = np.random.default_rng(28)
plan = json.load(open(sys.argv[1])); out = sys.argv[2]
DUR = plan['dur']; BPM = plan.get('bpm', 120); B = 60 / BPM
N = int(DUR * SR); L = np.zeros(N); R = np.zeros(N)

def add(sig, t, gain=1.0, pan=0.0):
    i = int(t * SR)
    if i >= N: return
    s = sig[:N - i] * gain
    L[i:i + len(s)] += s * (1 - max(pan, 0)); R[i:i + len(s)] += s * (1 + min(pan, 0))

def env(n, a=.005, d=.2):
    t = np.arange(n) / SR
    return np.minimum(t / a, 1) * np.exp(-t / d)

def lp(x, f):
    return sosfilt(butter(2, f, 'low', fs=SR, output='sos'), x)
def hp(x, f):
    return sosfilt(butter(2, f, 'high', fs=SR, output='sos'), x)

def kick():
    n = int(.5 * SR); t = np.arange(n) / SR
    f = 45 + 110 * np.exp(-t * 30)
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * env(n, .001, .22) * 1.1
def snare():
    n = int(.35 * SR); t = np.arange(n) / SR
    nz = hp(rng.standard_normal(n), 1500) * env(n, .001, .09)
    tone = np.sin(2 * np.pi * 190 * t) * env(n, .001, .05)
    return (nz * .7 + tone * .5)
def clap():
    n = int(.3 * SR); s = np.zeros(n)
    for k, o in enumerate([0, .01, .02]):
        i = int(o * SR); m = n - i
        s[i:] += hp(rng.standard_normal(m), 1200) * env(m, .001, .06 if k < 2 else .12)
    return s * .6
def hat(open_=False):
    n = int((.25 if open_ else .05) * SR)
    return hp(rng.standard_normal(n), 7000) * env(n, .001, .08 if open_ else .015) * .35
def sub808(freq, length):
    n = int(length * SR); t = np.arange(n) / SR
    f = freq * (1 + .5 * np.exp(-t * 40))
    s = np.sin(2 * np.pi * np.cumsum(f) / SR)
    s = np.tanh(s * 1.8) * np.minimum(t / .005, 1) * np.exp(-t / (length * .9))
    return s * .7
def saw(f, n):
    t = np.arange(n) / SR
    return sum(np.sin(2 * np.pi * f * k * t) / k for k in range(1, 9))
def pad(freqs, length):
    n = int(length * SR); t = np.arange(n) / SR
    s = sum(saw(f * d, n) for f in freqs for d in (1, 1.004, .996))
    a = np.minimum(t / .4, 1) * np.minimum((length - t) / .5, 1).clip(0, 1)
    return lp(s, 1800) * a * .05
def pluck(f, length=.4):
    n = int(length * SR); t = np.arange(n) / SR
    s = (np.sin(2 * np.pi * f * t) + .4 * np.sin(2 * np.pi * 2 * f * t) + .2 * np.sin(2 * np.pi * 3 * f * t))
    return s * env(n, .002, .18) * .22
def riser(length):
    n = int(length * SR); t = np.arange(n) / SR
    nz = rng.standard_normal(n)
    out = np.zeros(n); step = 2048
    for i in range(0, n, step):
        fc = 300 + 9000 * (i / n) ** 2
        out[i:i + step] = hp(nz[i:i + step], min(fc, 18000))
    sw = np.sin(2 * np.pi * np.cumsum(200 + 1600 * (t / length) ** 2) / SR) * .15
    return (out * .25 + sw) * (t / length) ** 1.6
def impact():
    n = int(2.5 * SR); t = np.arange(n) / SR
    boom = np.sin(2 * np.pi * np.cumsum(30 + 90 * np.exp(-t * 8)) / SR) * np.exp(-t / .7)
    nz = lp(rng.standard_normal(n), 3000) * np.exp(-t / .25) * .5
    return (boom + nz) * .9
def whoosh(length=.45):
    n = int(length * SR); t = np.arange(n) / SR
    nz = rng.standard_normal(n); out = np.zeros(n); step = 1024
    for i in range(0, n, step):
        x = i / n; fc = 400 + 5000 * np.sin(np.pi * x)
        out[i:i + step] = lp(nz[i:i + step], fc)
    return out * np.sin(np.pi * t / length) ** 2 * .35
def crowd(length):
    n = int(length * SR)
    s = lp(hp(rng.standard_normal(n), 300), 2500)
    t = np.arange(n) / SR
    return s * (1 + .3 * np.sin(2 * np.pi * .3 * t)) * .06

# Re minör: Dm - Bb - F - C (her biri 1 ölçü = 4 vuruş)
CH = [[146.83, 174.61, 220.0], [116.54, 146.83, 174.61], [174.61, 220.0, 261.63], [130.81, 164.81, 196.0]]
ROOT = [73.42, 58.27, 87.31, 65.41]
MEL = [[587.3, 698.5, 880.0, 698.5], [587.3, 698.5, 587.3, 466.2], [523.3, 698.5, 880.0, 1046.5], [784.0, 659.3, 523.3, 659.3]]

def kind_at(t):
    for a, b, k in plan['sections']:
        if a <= t < b: return k
    return None

bar = 4 * B
nbars = int(np.ceil(DUR / bar))
for bi in range(nbars):
    t0 = bi * bar; k = kind_at(t0 + .01)
    if k is None: continue
    ci = bi % 4
    add(pad(CH[ci], bar + .3), t0, 1.0 if k != 'intro' else .7, 0)
    if k in ('break', 'intro'):
        for j in range(4): add(pluck(MEL[ci][j] / 2), t0 + j * B, .7, .3 * (-1) ** j)
        continue
    if k == 'outro_tail':
        continue
    for st in range(8):  # 8'lik adımlar
        t = t0 + st * B / 2
        if kind_at(t + .001) != k: continue
        if k in ('drop', 'full', 'outro'):
            if st in (0, 3, 5) or (st == 7 and bi % 2): add(kick(), t, .9)
            if st in (2, 6): add(clap(), t, .8); add(snare(), t, .5)
            add(hat(st % 4 == 3), t, .6, .2)
            if k == 'full' and st % 2: add(hat(), t + B / 4, .4, -.2)
            if st in (0, 3, 5): add(sub808(ROOT[ci], B * 1.4), t, .8)
            add(pluck(MEL[ci][st // 2]), t, .45 if st % 2 == 0 else 0, .25)
        elif k == 'build':
            add(kick(), t, .7) if st % 2 == 0 else None
            add(hat(), t, .5)
            add(pluck(MEL[ci][st // 2]), t, .4, -.2)
    if k == 'build':
        # trampet rulosu: son yarı ölçüde 16'lıklar
        for j in range(8):
            add(snare(), t0 + bar / 2 + j * B / 4, .25 + .05 * j)

for a, b, k in plan['sections']:
    if k == 'intro':
        add(riser(b - a), a, .9)
        add(crowd(b - a + 1), a, 1.0)
    if k == 'build':
        add(riser(b - a), a, .7)
for t in plan.get('hits', []): add(impact(), t, .9); add(kick(), t, 1.0)
for t in plan.get('whoosh', []): add(whoosh(), max(t - .3, 0), .8, .3)

mix = np.stack([L, R], 1)
mix = np.tanh(mix * 1.2) * .8
fade = int(1.5 * SR); mix[-fade:] *= np.linspace(1, 0, fade)[:, None]
fi = int(.05 * SR); mix[:fi] *= np.linspace(0, 1, fi)[:, None]
mix /= np.abs(mix).max() + 1e-9
wavfile.write(out, SR, (mix * .89 * 32767).astype(np.int16))
print('ok', out, DUR)
