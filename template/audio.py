import json, wave, sys, os
from music import make_music
MATCH = os.environ.get('MATCH', 'ars_bvb')
import numpy as np
SR = 44100
rng = np.random.default_rng(7)

def lp(x, a):
    # one-pole lowpass, a in (0,1); vectorised via lfilter-like cumulative approach
    y = np.empty_like(x); acc = 0.0
    for i in range(len(x)):
        acc += a * (x[i] - acc); y[i] = acc
    return y

def env(n, att, dec):
    t = np.arange(n) / SR
    e = np.minimum(1, t / max(att, 1e-4)) * np.exp(-np.maximum(0, t - att) / dec)
    return e

def sfx_kick(strong=False):
    n = int(0.25 * SR); t = np.arange(n) / SR
    f = 140 * np.exp(-t * 18) + 55
    body = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * (14 if strong else 22))
    click = rng.normal(0, 1, n) * np.exp(-t * 300)
    return (body * 0.9 + click * 0.35) * (1.0 if strong else 0.6)

def sfx_whistle(d=0.7):
    n = int(d * SR); t = np.arange(n) / SR
    f = 2900 + 120 * np.sin(2 * np.pi * 28 * t)
    s = np.sin(2 * np.pi * np.cumsum(f) / SR) + 0.3 * rng.normal(0, 1, n)
    e = np.minimum(1, t / 0.02) * np.minimum(1, (d - t) / 0.08)
    return s * e * 0.25

def sfx_whoosh(d=0.5):
    n = int(d * SR); t = np.arange(n) / SR
    noise = rng.normal(0, 1, n)
    a = 0.02 + 0.25 * np.sin(np.pi * t / d) ** 2
    y = np.empty(n); acc = 0.0
    for i in range(n):
        acc += a[i] * (noise[i] - acc); y[i] = acc
    return y * np.sin(np.pi * t / d) ** 1.5 * 1.2

def sfx_impact():
    n = int(1.2 * SR); t = np.arange(n) / SR
    s = np.sin(2 * np.pi * (45 + 60 * np.exp(-t * 8)) * t) * np.exp(-t * 3.5)
    s += rng.normal(0, 1, n) * np.exp(-t * 25) * 0.4
    return s * 0.9

def sfx_roar(d=2.2, amt=1.0):
    n = int(d * SR); t = np.arange(n) / SR
    noise = rng.normal(0, 1, n)
    y = lp(noise, 0.08) - lp(noise, 0.008)
    e = np.minimum(1, t / 0.35) * np.minimum(1, (d - t) / 0.9)
    return y * e * 2.2 * amt

def sfx_tick():
    n = int(0.06 * SR); t = np.arange(n) / SR
    return np.sin(2 * np.pi * 1400 * t) * np.exp(-t * 90) * 0.25

def crowd_bed(total):
    n = int(total * SR)
    noise = rng.normal(0, 1, n)
    y = lp(noise, 0.05) - lp(noise, 0.004)
    t = np.arange(n) / SR
    mod = 0.75 + 0.25 * np.sin(2 * np.pi * 0.13 * t) * np.sin(2 * np.pi * 0.07 * t + 1)
    return y * mod * 0.55

def music_bed(total, bpm=112):
    n = int(total * SR)
    out = np.zeros(n)
    beat = 60 / bpm
    k = sfx_kick(True) * 0.5
    hat_n = int(0.05 * SR)
    hat = rng.normal(0, 1, hat_n) * np.exp(-np.arange(hat_n) / SR * 120) * 0.12
    bass_notes = [55.0, 55.0, 65.41, 49.0]
    b = 0
    while b * beat < total:
        i = int(b * beat * SR)
        out[i:i + len(k)] += k[:max(0, min(len(k), n - i))]
        j = int((b + 0.5) * beat * SR)
        if j < n: out[j:j + hat_n] += hat[:max(0, min(hat_n, n - j))]
        if b % 4 == 0:
            f = bass_notes[(b // 4) % 4]
            ln = int(4 * beat * SR); tt = np.arange(ln) / SR
            bs = np.sin(2 * np.pi * f * tt) * 0.18 * np.minimum(1, tt / 0.05) * np.exp(-tt * 0.6)
            out[i:i + ln] += bs[:max(0, min(ln, n - i))]
        b += 1
    return out


def add(buf, s, t, g=1.0):
    i = int(t * SR)
    if i < 0: s = s[-i:]; i = 0
    if i >= len(buf): return
    m = min(len(s), len(buf) - i)
    buf[i:i + m] += s[:m] * g

def sfx_riser(d=0.55):
    n = int(d * SR); t = np.arange(n) / SR
    noise = rng.normal(0, 1, n)
    a = 0.02 + 0.5 * (t / d) ** 2
    y = np.empty(n); acc = 0.0
    for i in range(n):
        acc += a[i] * (noise[i] - acc); y[i] = acc
    tone = np.sin(2 * np.pi * np.cumsum(200 + 900 * (t / d) ** 2) / SR) * 0.15
    return (y * 1.3 + tone) * (t / d) ** 1.5

ev = json.load(open(f'audio_events_{MATCH}.json'))
total = ev['total']
n = int(total * SR)
buf = np.zeros(n + SR)
buf[:n] += crowd_bed(total)[:n] * 0.22
pred_t = [d['t'] for d in ev.get('drops', []) if d['name'] == 'pred']
mus = make_music(total, drop_t=4.5, outro_t=(pred_t[0] + 4.0) if pred_t else total - 5)
buf[:n] += mus[:n] * 1.7
for e in ev['ev']:
    ty, t, g = e['type'], e['t'], e.get('g', 1)
    if ty == 'whoosh': add(buf, sfx_whoosh(0.45), t - 0.1, g)
    elif ty == 'riser': add(buf, sfx_riser(0.55), t, g)
    elif ty == 'whistle': add(buf, sfx_whistle(e.get('d', 0.8)), t, g)
    elif ty == 'impact': add(buf, sfx_impact(), t, g * 0.55)
    elif ty == 'roar': add(buf, sfx_roar(e.get('d', 2.2), 1.0), t, g * 0.55)
    elif ty == 'tick': add(buf, sfx_tick(), t, g)
    elif ty == 'kick': add(buf, sfx_kick(False), t, g)
    elif ty == 'shot': add(buf, sfx_kick(True), t, g)
buf = buf[:n]
fo = int(1.2 * SR); buf[-fo:] *= np.linspace(1, 0, fo)
fi = int(0.3 * SR); buf[:fi] *= np.linspace(0, 1, fi)
buf = np.tanh(buf / (np.max(np.abs(buf)) + 1e-9) * 1.6) * 0.89
pcm = (buf * 32767).astype(np.int16)
with wave.open(f'audio_{MATCH}.wav', 'wb') as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes(np.stack([pcm, pcm], 1).tobytes())
print('audio', total)
