"""Original, royalty-free sports-broadcast style track (124 BPM, A minor), synthesised from scratch."""
import numpy as np
from scipy.signal import butter, sosfilt

SR = 44100
rng = np.random.default_rng(11)

def lowpass(x, fc, order=2):
    return sosfilt(butter(order, fc, btype='low', fs=SR, output='sos'), x)
def highpass(x, fc, order=2):
    return sosfilt(butter(order, fc, btype='high', fs=SR, output='sos'), x)
def bandpass(x, lo, hi, order=2):
    return sosfilt(butter(order, [lo, hi], btype='band', fs=SR, output='sos'), x)

def saw(f, t, ph=0.0):
    return 2.0 * ((f * t + ph) % 1.0) - 1.0

def midi(n):
    return 440.0 * 2 ** ((n - 69) / 12)

# A minor: Am - F - C - G  (one chord per bar)
CHORDS = [[57, 60, 64], [53, 57, 60], [48, 52, 55], [55, 59, 62]]
ROOTS = [33, 29, 36, 31]  # A1 F1 C2 G1

def kick(n):
    t = np.arange(n) / SR
    f = 50 + 120 * np.exp(-t * 30)
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 7) + 0.25 * rng.normal(0, 1, n) * np.exp(-t * 400)

def clap(n):
    t = np.arange(n) / SR
    noise = bandpass(rng.normal(0, 1, n), 900, 5000)
    env = np.exp(-t * 18) + 0.6 * np.exp(-np.maximum(0, t - .012) * 60) * (t > .012) + 0.5 * np.exp(-np.maximum(0, t - .024) * 60) * (t > .024)
    return noise * env * 0.9

def hat(n, open_=False):
    t = np.arange(n) / SR
    return highpass(rng.normal(0, 1, n), 7000) * np.exp(-t * (14 if open_ else 70))

def crash(n):
    t = np.arange(n) / SR
    return highpass(rng.normal(0, 1, n), 4000) * np.exp(-t * 1.6) * 0.6

def make_music(total, drop_t=4.5, outro_t=None, bpm=124):
    n = int(total * SR)
    t = np.arange(n) / SR
    beat = 60 / bpm
    bar = 4 * beat
    outro_t = outro_t or total - 6
    out = {k: np.zeros(n) for k in ('drums', 'bass', 'pad', 'arp', 'fx')}

    def put(buf, s, at, g=1.0):
        i = int(at * SR)
        if i >= n or i + len(s) <= 0: return
        if i < 0: s = s[-i:]; i = 0
        m = min(len(s), n - i); buf[i:i + m] += s[:m] * g

    # ---- grid positions ----
    tb = drop_t  # groove grid starts at the drop
    nbeats = int((total - tb) / beat) + 1
    # sidechain envelope
    sc = np.ones(n)
    for b in range(nbeats):
        at = tb + b * beat
        if at >= outro_t + 2 * bar: break
        i = int(at * SR); L = int(beat * SR)
        if i >= n: break
        tt = np.arange(min(L, n - i)) / SR
        sc[i:i + len(tt)] = np.minimum(sc[i:i + len(tt)], 1 - 0.75 * np.exp(-tt / 0.09))

    # ---- drums ----
    K, CL, HC, HO = kick(int(.45 * SR)), clap(int(.3 * SR)), hat(int(.06 * SR)), hat(int(.3 * SR), True)
    for b in range(nbeats):
        at = tb + b * beat
        if at >= total: break
        in_outro = at >= outro_t
        bar_i, bb = divmod(b, 4)
        if not in_outro:
            put(out['drums'], K, at, 1.0)
            if bb in (1, 3): put(out['drums'], CL, at, 0.55)
            put(out['drums'], HO, at + beat / 2, 0.16)
            for s16 in (1, 3): put(out['drums'], HC, at + s16 * beat / 4, 0.12)
            if bar_i % 4 == 3 and bb == 3:  # small fill
                for k in range(4): put(out['drums'], CL, at + k * beat / 4, 0.25 + 0.08 * k)
        if bb == 0 and bar_i % 4 == 0: put(out['fx'], crash(int(2.5 * SR)), at, 0.5)

    # ---- bass: driving off-beat 8ths ----
    for b in range(nbeats):
        at = tb + b * beat
        if at >= outro_t: break
        bar_i = b // 4
        f = midi(ROOTS[bar_i % 4])
        for k in (0.5,):
            L = int(beat * 0.45 * SR); tt = np.arange(L) / SR
            note = (saw(f, tt) + 0.6 * np.sin(2 * np.pi * f / 2 * tt)) * np.minimum(1, tt / .005) * np.exp(-tt * 5)
            put(out['bass'], note, at + k * beat, 0.5)
    out['bass'] = lowpass(out['bass'], 420, 4)

    # ---- pad (supersaw chords), plays from 0 ----
    pad = np.zeros(n)
    first_bar = -int(np.ceil(tb / bar))
    for bi in range(first_bar, int((total - tb) / bar) + 2):
        st = tb + bi * bar
        if st >= total: break
        s0 = max(0.0, st); s1 = min(total, st + bar)
        i0, i1 = int(s0 * SR), int(s1 * SR)
        tt = t[i0:i1]
        ch = CHORDS[bi % 4]
        sig = np.zeros(i1 - i0)
        for note in ch:
            f = midi(note)
            for d in (-0.012, -0.006, 0, 0.006, 0.012):
                sig += saw(f * (1 + d), tt, ph=rng.random())
        sig /= 15
        L = len(sig); env = np.minimum(1, np.arange(L) / (0.08 * SR)) * np.minimum(1, (L - np.arange(L)) / (0.05 * SR))
        pad[i0:i1] += sig * env
    # filter opens during the intro build
    lp_open = lowpass(pad, 2800, 2)
    lp_closed = lowpass(pad, 600, 2)
    mixk = np.clip((t - 0.0) / max(drop_t, .1), 0, 1) ** 2
    mixk[t >= drop_t] = 1.0
    out_k = np.clip((t - outro_t) / 4.0, 0, 1)
    pad = lp_closed * (1 - mixk) + lp_open * mixk
    pad = pad * (1 - 0.5 * out_k)
    out['pad'] = pad

    # ---- pluck arpeggio (16ths) ----
    sixteenth = beat / 4
    nst = int((outro_t - tb) / sixteenth)
    pattern = [0, 1, 2, 1, 0, 2, 1, 2]
    for k in range(nst):
        at = tb + k * sixteenth
        bar_i = int((at - tb) / bar)
        ch = CHORDS[bar_i % 4]
        note = ch[pattern[k % 8]] + 12 + (12 if (k // 8) % 4 == 3 and k % 2 else 0)
        f = midi(note)
        L = int(.18 * SR); tt = np.arange(L) / SR
        pl = (np.sign(np.sin(2 * np.pi * f * tt)) * .5 + saw(f * 1.003, tt) * .5) * np.exp(-tt * 22)
        put(out['arp'], pl, at, 0.22 + 0.06 * (k % 4 == 0))
    out['arp'] = lowpass(out['arp'], 3200, 2)
    # echo
    d = int(beat * .75 * SR); echo = np.zeros(n); echo[d:] = out['arp'][:-d] * .35; out['arp'] += echo

    # ---- intro riser into the drop + final hit ----
    L = int(drop_t * SR); tt = np.arange(L) / SR
    nz = rng.normal(0, 1, L)
    riser = bandpass(nz, 400, 6000) * (tt / drop_t) ** 3 * 0.5
    put(out['fx'], riser, 0)
    put(out['fx'], kick(int(1.2 * SR)) * 1.2, drop_t, 1.0)
    put(out['fx'], crash(int(3 * SR)), drop_t, 0.8)
    # outro: big sustained chord already in pad, final hit
    put(out['fx'], kick(int(1.5 * SR)), total - 2.0, 1.0)
    put(out['fx'], crash(int(2 * SR)), total - 2.0, 0.6)

    mix = (out['drums'] * 0.9 + out['bass'] * sc * 1.0 + out['pad'] * (0.35 + 0.65 * sc) * 0.55
           + out['arp'] * (0.5 + 0.5 * sc) * 0.9 + out['fx'] * 0.8)
    mix = highpass(mix, 30, 2)
    mix /= np.max(np.abs(mix)) + 1e-9
    return mix
