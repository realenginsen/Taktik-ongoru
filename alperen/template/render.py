# Alperen maç analizi story v2 — yayın grafiği tarzı (1080x1920, 30 fps)
# Kullanım: python3 render.py mac.json <gorseller_dir> out.mp4 [preview t1 t2 ...]
import json, sys, math, subprocess, os
import numpy as np
from PIL import Image, ImageDraw, ImageFont, ImageFilter, ImageEnhance

W, H, FPS = 1080, 1920, 30
HERE = os.path.dirname(os.path.abspath(__file__))
BEBAS = os.path.join(HERE, 'fonts', 'BebasNeue-Regular.ttf')
IB = '/usr/share/fonts/opentype/inter/Inter-Bold.otf'
IK = '/usr/share/fonts/opentype/inter/Inter-Black.otf'
IM = '/usr/share/fonts/opentype/inter/Inter-Medium.otf'
BG = (13, 15, 20); PANEL = (24, 27, 35); LINE = (52, 57, 70); RED = (206, 17, 65); GOLD = (253, 185, 39)
GREEN = (46, 213, 115); MISS = (255, 77, 94); WHITE = (245, 246, 248); GREY = (150, 156, 168); DIM = (95, 100, 112)

cfg = json.load(open(sys.argv[1])); GDIR = sys.argv[2]; OUT = sys.argv[3]
PREVIEW = [float(x) for x in sys.argv[5:]] if len(sys.argv) > 4 and sys.argv[4] == 'preview' else None
BEAT = 60 / cfg.get('bpm', 120); JER = cfg.get('jersey', 'kirmizi')
M = cfg['match']; LN = cfg['line']
_f = {}
def F(p, s):
    if (p, s) not in _f: _f[(p, s)] = ImageFont.truetype(p, s)
    return _f[(p, s)]
def cl(x, a=0., b=1.): return max(a, min(b, x))
def eo(x): x = cl(x); return 1 - (1 - x) ** 3
def ebk(x): x = cl(x); c = 1.9; return 1 + (c + 1) * (x - 1) ** 3 + c * (x - 1) ** 2
def mix(c1, c2, k): return tuple(int(a + (b - a) * k) for a, b in zip(c1, c2))
def fade(c, a): return c + (int(255 * cl(a)),)

# ---------- yuvarlak foto rozeti ----------
_ph = {}
def photo(name, size):
    k = (name, size)
    if k in _ph: return _ph[k]
    p = os.path.join(GDIR, f'b_{JER}_{name}.jpg')
    if not os.path.exists(p):
        import glob; p = sorted(glob.glob(os.path.join(GDIR, f'*_{JER}_*_{name}.jpg')) or glob.glob(os.path.join(GDIR, f'*{name}*.jpg')))[0]
    im = Image.open(p).convert('RGB'); w, h = im.size; s = min(w, h)
    im = im.crop(((w - s) // 2, int((h - s) * .15), (w - s) // 2 + s, int((h - s) * .15) + s)).resize((size * 2, size * 2), Image.LANCZOS)
    im = im.filter(ImageFilter.UnsharpMask(2, 50, 2))
    m = Image.new('L', (size * 4, size * 4), 0); ImageDraw.Draw(m).ellipse([0, 0, size * 4 - 1, size * 4 - 1], fill=255)
    m = m.resize((size * 2, size * 2), Image.LANCZOS)
    ring = Image.new('RGBA', (size * 2 + 16, size * 2 + 16), (0, 0, 0, 0)); rd = ImageDraw.Draw(ring)
    rd.ellipse([0, 0, size * 2 + 15, size * 2 + 15], fill=RED + (255,))
    ring.paste(im, (8, 8), m)
    out = ring.resize((size + 8, size + 8), Image.LANCZOS)
    _ph[k] = out; return out
def badge(fr, name, cx, cy, size, a=1., sc=1.):
    if a <= 0: return
    b = photo(name, size)
    if sc != 1: b = b.resize((max(1, int(b.width * sc)), max(1, int(b.height * sc))), Image.BILINEAR)
    if a < 1:
        b = b.copy(); b.putalpha(b.getchannel('A').point(lambda v: int(v * a)))
    fr.alpha_composite(b, (int(cx - b.width / 2), int(cy - b.height / 2)))

# ---------- zemin ----------
def make_bg():
    y, x = np.mgrid[0:H, 0:W]
    g = np.exp(-(((x - 540) / 900) ** 2 + ((y - 700) / 1100) ** 2))
    a = np.zeros((H, W, 3), np.float32)
    for i, c in enumerate(BG): a[..., i] = c
    a += g[..., None] * np.array([14, 10, 14])
    # ince çapraz çizgi dokusu
    a += ((x + y) % 46 < 1)[..., None] * 4
    return Image.fromarray(a.clip(0, 255).astype(np.uint8)).convert('RGBA')
BGI = make_bg()
GRAIN = [Image.fromarray(np.random.default_rng(i).normal(128, 14, (H // 2, W // 2)).clip(0, 255).astype(np.uint8), 'L').resize((W, H)) for i in range(5)]

# ---------- saha (şut haritası) ----------
S = 19.2; CX0 = 60; CY0 = 520                      # ft→px; saha sol üst (dip çizgi)
def cp(x, y): return (CX0 + x * S, CY0 + (y + 5.25) * S)   # ESPN: pota (25,0), y = potadan uzaklık
CW, CHt = int(50 * S), int(33.5 * S)
def make_court():
    k = 3; im = Image.new('RGBA', (CW * k, CHt * k), (0, 0, 0, 0)); d = ImageDraw.Draw(im)
    def P(x, y): return ((x) * S * k, (y + 5.25) * S * k)
    lw = 3 * k; col = (120, 126, 140, 255)
    d.rectangle([0, 0, CW * k, CHt * k], fill=(20, 23, 30, 255))
    # boyalı alan
    d.rectangle([*P(17, -5.25), *P(33, 13.75)], fill=(36, 22, 30, 255), outline=col, width=lw)
    # serbest atış çemberi
    r = 6 * S * k; cx, cy = P(25, 13.75); d.arc([cx - r, cy - r, cx + r, cy + r], 0, 180, fill=col, width=lw)
    d.arc([cx - r, cy - r, cx + r, cy + r], 180, 360, fill=(90, 95, 108, 255), width=lw)
    # kısıtlı alan
    r = 4 * S * k; cx, cy = P(25, 0); d.arc([cx - r, cy - r, cx + r, cy + r], 0, 180, fill=col, width=lw)
    # üçlük çizgisi
    d.line([*P(3, -5.25), *P(3, 8.95)], fill=col, width=lw); d.line([*P(47, -5.25), *P(47, 8.95)], fill=col, width=lw)
    r = 23.75 * S * k; a0 = math.degrees(math.asin(8.95 / 23.75))
    d.arc([cx - r, cy - r, cx + r, cy + r], a0, 180 - a0, fill=col, width=lw)
    # pano + çember
    d.line([*P(22, -1.25), *P(28, -1.25)], fill=WHITE + (255,), width=lw + k)
    r = .75 * S * k; d.ellipse([cx - r, cy - r, cx + r, cy + r], outline=(255, 140, 60, 255), width=lw)
    d.rectangle([0, 0, CW * k - 1, CHt * k - 1], outline=col, width=lw)
    return im.resize((CW, CHt), Image.LANCZOS)
COURT = make_court()

def T(d, xy, s, f, fill=WHITE, anchor='la', a=1.):
    d.text(xy, s, font=f, fill=fade(fill, a), anchor=anchor)

def lay(): l = Image.new('RGBA', (W, H), (0, 0, 0, 0)); return l, ImageDraw.Draw(l)
def shift(l, dy): return l.transform(l.size, Image.AFFINE, (1, 0, 0, 0, 1, -dy)) if dy else l

# ---------- kalıcı üst bant ----------
def header(fr, a):
    if a <= 0: return
    l, d = lay()
    d.rounded_rectangle([60, 262, 1020, 350], 14, fill=fade(PANEL, a))
    d.rectangle([60, 262, 72, 350], fill=fade(RED, a))
    T(d, (100, 306), M['home'], F(BEBAS, 62), anchor='lm', a=a)
    T(d, (205, 306), str(M['hs']), F(BEBAS, 62), GOLD, 'lm', a)
    T(d, (300, 306), '–', F(BEBAS, 62), GREY, 'lm', a)
    T(d, (338, 306), str(M['as']), F(BEBAS, 62), GREY, 'lm', a)
    T(d, (440, 306), M['away'], F(BEBAS, 62), GREY, 'lm', a)
    T(d, (990, 290), M['comp'], F(IK, 26), GOLD, 'rm', a)
    T(d, (990, 322), M['date'], F(IB, 24), GREY, 'rm', a)
    fr.alpha_composite(l)

def section(t):
    for a, b, k in cfg['sections']:
        if a <= t < b: return k
    return 'outro'

# ---------- sahneler ----------
SHOT_T0 = cfg.get('shot_t0', 11.0); SHOT_DT = cfg.get('shot_dt', BEAT)
SHOT_END = SHOT_T0 + len(cfg['shots']) * SHOT_DT  # bölge özeti bundan sonra
ZT = cfg.get('zone_t', 20.0)
ST = {}
def sc_intro(fr, t):
    lt = t
    a = eo(lt / .5)
    l, d = lay()
    # büyük skor kartı
    y0 = 760
    d.rounded_rectangle([60, y0, 1020, y0 + 300], 22, fill=fade(PANEL, a))
    d.rectangle([60, y0, 1020, y0 + 10], fill=fade(RED, a))
    T(d, (540, y0 + 52), f"{M['comp']} · {M['date']}", F(IK, 32), GOLD, 'mm', a)
    hs = int(M['hs'] * eo((lt - .3) / 1.0)); as_ = int(M['as'] * eo((lt - .3) / 1.0))
    T(d, (110, y0 + 175), M['home'], F(BEBAS, 96), WHITE, 'lm', a)
    T(d, (970, y0 + 175), M['away'], F(BEBAS, 96), GREY, 'rm', a)
    T(d, (500, y0 + 175), str(hs), F(BEBAS, 150), GOLD, 'rm', a)
    T(d, (540, y0 + 175), '–', F(BEBAS, 110), GREY, 'mm', a)
    T(d, (580, y0 + 175), str(as_), F(BEBAS, 150), GREY, 'lm', a)
    T(d, (540, y0 + 262), M['venue'] + ' · MAÇ SONU', F(IB, 26), GREY, 'mm', a)
    fr.alpha_composite(shift(l, int(40 * (1 - a))))
    # başlık
    a2 = eo((lt - .9) / .5); l, d = lay()
    T(d, (540, 1200), 'ALPEREN', F(BEBAS, 190), WHITE, 'mm', a2)
    a3 = eo((lt - 1.4) / .4)
    d.rectangle([250, 1290, 830, 1380], fill=fade(RED, a3))
    T(d, (540, 1337), 'MAÇ ANALİZİ', F(BEBAS, 84), WHITE, 'mm', a3)
    fr.alpha_composite(shift(l, int(30 * (1 - a2))))
    badge(fr, '08_odak', 540, 560, 230, eo((lt - .1) / .4), .8 + .2 * ebk((lt - .1) / .5))

def stat_box(d, x, y, w, h, val, lab, a, hl=False, sub=None):
    d.rounded_rectangle([x, y, x + w, y + h], 16, fill=fade(PANEL, a), outline=fade(RED if hl else LINE, a), width=3)
    T(d, (x + w / 2, y + h * .46), val, F(BEBAS, 118 if len(val) < 4 else 96), GOLD if hl else WHITE, 'mm', a)
    T(d, (x + w / 2, y + h * .82), lab, F(IK, 26), GREY, 'mm', a)
    if sub: T(d, (x + w / 2, y + 26), sub, F(IB, 20), RED, 'mm', a)

def sc_card(fr, t):
    lt = t - ST['card']
    header(fr, 1)
    l, d = lay()
    a = eo(lt / .3)
    T(d, (80, 430), 'MAÇ KARTI', F(IK, 34), GOLD, 'lm', a)
    T(d, (80, 485), f"{LN['min']} DAKİKA · ARTI/EKSİ {LN['pm']}", F(IB, 30), GREY, 'lm', a)
    fr.alpha_composite(l)
    badge(fr, '01_kukreme', 900, 470, 170, a, .7 + .3 * ebk(lt / .4))
    boxes = [(f"{int(LN['pts'] * eo((lt - .2) / .6))}", 'SAYI', True, None), (f"{int(LN['reb'] * eo((lt - .45) / .6))}", 'RİBAUND', True, f"{LN['oreb']} HÜCUM"),
             (f"{int(LN['ast'] * eo((lt - .7) / .6))}", 'ASİST', True, None),
             (f"{LN['fgm']}/{LN['fga']}", 'SAHA İÇİ', False, None), (f"{LN['tpm']}/{LN['tpa']}", 'ÜÇLÜK', False, None), (f"{LN['ftm']}/{LN['fta']}", 'SERBEST ATIŞ', False, None)]
    for i, (v, lab, hl, sub) in enumerate(boxes):
        st = (i * BEAT / 2) if i < 3 else (1.5 + (i - 3) * BEAT / 2)
        ai = eo((lt - st) / .3)
        l, d = lay()
        col, row = i % 3, i // 3
        x = 60 + col * 327; y = 580 + row * 330
        stat_box(d, x, y, 306, 300, v, lab, ai, hl, sub)
        fr.alpha_composite(shift(l, int(50 * (1 - ai))))
    # triple-double rozeti
    ab = cl((lt - 2.5) / .25)
    if ab > 0:
        l, d = lay(); s = ebk((lt - 2.5) / .35)
        d.rounded_rectangle([540 - 300 * s, 1290 - 62 * s, 540 + 300 * s, 1290 + 62 * s], int(20 * s), fill=fade(RED, ab))
        if s > .6: T(d, (540, 1290), 'TRIPLE-DOUBLE', F(BEBAS, int(96 * s)), WHITE, 'mm', ab)
        fr.alpha_composite(l)
    a4 = eo((lt - 3.6) / .4); l, d = lay()
    T(d, (540, 1420), 'SEZONUN 3. · KARİYERİNİN 15.', F(IK, 36), GOLD, 'mm', a4)
    fr.alpha_composite(l)

def draw_marker(d, x, y, made, k, blk=False):
    """k: 0..1 animasyon ilerlemesi"""
    if k <= 0: return
    s = ebk(k / 1.0)
    if made:
        r = 17 * s
        d.ellipse([x - r, y - r, x + r, y + r], fill=GREEN + (255,), outline=(255, 255, 255, 255), width=3)
    else:
        r = 15 * s; w = 7
        d.line([x - r, y - r, x + r, y + r], fill=MISS + (255,), width=w); d.line([x - r, y + r, x + r, y - r], fill=MISS + (255,), width=w)
        if blk: d.ellipse([x - 24, y - 24, x + 24, y + 24], outline=MISS + (255,), width=3)

def sc_map(fr, t):
    lt = t - ST['map']
    header(fr, 1)
    shots = cfg['shots']
    a = eo(lt / .4)
    l, d = lay()
    T(d, (80, 430), 'ŞUT HARİTASI', F(BEBAS, 84), WHITE, 'lm', a)
    # periyot çipleri
    cur = None
    for i, s in enumerate(shots):
        if t >= SHOT_T0 + i * SHOT_DT: cur = s['q']
    for q in range(1, 5):
        x = 640 + (q - 1) * 96; on = (cur == q) and t < ZT
        d.rounded_rectangle([x, 400, x + 82, 460], 10, fill=fade(RED if on else PANEL, a), outline=fade(LINE, a), width=2)
        T(d, (x + 41, 430), f'Ç{q}', F(BEBAS, 44), WHITE if on else GREY, 'mm', a)
    fr.alpha_composite(shift(l, int(30 * (1 - a))))
    # saha
    ca = eo((lt - .2) / .5)
    c = COURT if ca >= 1 else COURT.copy()
    if ca < 1: c.putalpha(c.getchannel('A').point(lambda v: int(v * ca)))
    fr.alpha_composite(c, (CX0, CY0))
    zone = cl((t - ZT) / .5)           # bölge özeti aşaması
    # bölge vurguları
    if zone > 0:
        l, d = lay()
        za = zone
        # pota dibi
        cx, cy = cp(25, 0); r = 4.5 * S
        d.ellipse([cx - r, cy - r, cx + r, cy + r], fill=(46, 213, 115, int(60 * za)))
        d.rectangle([*cp(17, -5.25), *cp(33, 13.75)], outline=(253, 185, 39, int(200 * za)), width=4)
        fr.alpha_composite(l)
    # şutlar
    l, d = lay(); n = 0; made = 0; last = None
    for i, s in enumerate(shots):
        ts = SHOT_T0 + i * SHOT_DT
        if t < ts: continue
        n += 1; made += s['m']; last = (i, s)
        x, y = cp(s['x'], s['y'])
        k = cl((t - ts) / .3)
        if zone > 0 and not s.get('three'): pass
        draw_marker(d, x, y, s['m'], k, 'BLOK' in s['tip'])
        # yeni şutta halka dalgası
        rk = (t - ts) / .5
        if 0 < rk < 1:
            rr = 20 + 50 * rk; col = GREEN if s['m'] else MISS
            d.ellipse([x - rr, y - rr, x + rr, y + rr], outline=col + (int(200 * (1 - rk)),), width=4)
    fr.alpha_composite(l)
    # bölge etiketleri
    if zone > 0:
        l, d = lay(); za = eo((t - ZT) / .4)
        Z = cfg['zones']
        def tag(x, y, big, small, col, a_):
            w = 210; d.rounded_rectangle([x - w / 2, y - 52, x + w / 2, y + 52], 14, fill=(13, 15, 20, int(230 * a_)), outline=col + (int(255 * a_),), width=3)
            T(d, (x, y - 8), big, F(BEBAS, 72), col, 'mm', a_); T(d, (x, y + 34), small, F(IK, 20), GREY, 'mm', a_)
        x, y = cp(36.5, 1); tag(x, y, Z['rim'], 'POTA DİBİ', GREEN, za)
        x, y = cp(25, 21.5); tag(x, y, Z['paint'], 'BOYALI ALAN', GOLD, eo((t - ZT - .5) / .4))
        x, y = cp(7, 13); tag(x, y, Z['left'], 'SOL KANAT', GREEN, eo((t - ZT - 1) / .4))
        x, y = cp(43.5, 11); tag(x, y, Z['right'], 'SAĞ KANAT', MISS, eo((t - ZT - 1.5) / .4))
        a5 = eo((t - ZT - 2) / .4)
        for xx in (3, 47):
            x, y = cp(xx, -2.6)
            d.rounded_rectangle([x - 60 if xx < 25 else x - 70, y - 30, x + 70 if xx < 25 else x + 60, y + 30], 10, fill=(13, 15, 20, int(220 * a5)), outline=GREY + (int(200 * a5),), width=2)
            T(d, (x + (5 if xx < 25 else -5), y), 'KÖŞE 0', F(IK, 22), GREY, 'mm', a5)
        fr.alpha_composite(l)
    # alt bilgi paneli
    l, d = lay(); y0 = 1185
    pa = eo((lt - .5) / .4)
    d.rounded_rectangle([60, y0, 1020, y0 + 160], 18, fill=fade(PANEL, pa))
    T(d, (100, y0 + 58), 'SAHA İÇİ', F(IK, 26), GREY, 'lm', pa)
    T(d, (100, y0 + 112), f'{made}/{n}' if n else '0/0', F(BEBAS, 92), WHITE, 'lm', pa)
    tp = [s for s in cfg['shots'][:n] if s.get('three')]
    T(d, (370, y0 + 58), 'ÜÇLÜK', F(IK, 26), GREY, 'lm', pa)
    T(d, (370, y0 + 112), f"{sum(s['m'] for s in tp)}/{len(tp)}", F(BEBAS, 92), WHITE, 'lm', pa)
    if last and t < ZT:
        i, s = last
        d.line([600, y0 + 30, 600, y0 + 130], fill=fade(LINE, pa), width=2)
        T(d, (630, y0 + 50), f"Ç{s['q']} · {s['clk']}", F(IK, 26), GREY, 'lm', pa)
        T(d, (630, y0 + 92), s['tip'], F(IK, 30 if len(s['tip']) < 16 else 24), WHITE, 'lm', pa)
        T(d, (630, y0 + 132), f"{s['ft']} FT · " + ('İSABET' if s['m'] else 'KAÇTI'), F(IK, 26), GREEN if s['m'] else MISS, 'lm', pa)
    fr.alpha_composite(l)
    # içgörüler (bölge aşaması)
    if zone > 0:
        l, d = lay()
        for j, txt in enumerate(cfg['insights']['map']):
            aj = eo((t - (ZT + 2.5 + j * BEAT * 2)) / .4)
            y = 1400 + j * 82
            d.rounded_rectangle([60, y, 1020, y + 66], 12, fill=fade(PANEL, aj))
            d.rectangle([60, y, 70, y + 66], fill=fade(GOLD if j == 1 else (GREEN if j == 0 else RED), aj))
            T(d, (95, y + 33), txt, F(IK, 32), WHITE, 'lm', aj)
        fr.alpha_composite(shift(l, 0))
    else:
        # şut tipine göre küçük rozet
        if last:
            s = last[1]; nm = '02_smac' if s['tip'] in ('SMAÇ', 'TAMAMLAMA') else ('04_pas' if False else ('10_kanca' if 'KANCA' in s['tip'] else ('06_uc-parmak' if s.get('three') and s['m'] else ('07_eller-basta' if not s['m'] else '11_penetre'))))
            badge(fr, nm, 900, 1480, 170, eo((lt - .8) / .3))
            l, d = lay()
            T(d, (80, 1440), 'Ç1–Ç4 · ZAMAN SIRASIYLA', F(IK, 28), GREY, 'lm', 1)
            d.ellipse([80, 1477, 106, 1503], fill=GREEN + (255,)); T(d, (120, 1490), 'İSABET', F(IK, 30), GREEN, 'lm', 1)
            d.line([300, 1478, 324, 1502], fill=MISS + (255,), width=6); d.line([300, 1502, 324, 1478], fill=MISS + (255,), width=6)
            T(d, (340, 1490), 'KAÇAN', F(IK, 30), MISS, 'lm', 1)
            T(d, (80, 1545), 'Kaynak: ESPN şut koordinatları', F(IB, 22), DIM, 'lm', 1)
            fr.alpha_composite(l)

def sc_quarters(fr, t):
    lt = t - ST['quarters']
    header(fr, 1)
    Q = cfg['quarters']; mx = max(q['pts'] for q in Q)
    l, d = lay(); a = eo(lt / .3)
    T(d, (80, 430), 'ÇEYREK ÇEYREK', F(BEBAS, 84), WHITE, 'lm', a)
    T(d, (80, 492), 'ALPEREN SAYI · SAHA İÇİ · ROCKETS–SUNS', F(IB, 26), GREY, 'lm', a)
    base = 1150; top = 620; bw = 190
    d.line([60, base, 1020, base], fill=fade(LINE, a), width=3)
    for i, q in enumerate(Q):
        st = .3 + i * BEAT; k = eo((lt - st) / .5)
        x = 80 + i * 236; hgt = (base - top - 80) * q['pts'] / mx * k
        hl = q['pts'] == mx
        d.rounded_rectangle([x, base - hgt, x + bw, base], 12, fill=fade(RED if hl else (70, 76, 92), cl(k * 3)))
        if k > 0:
            T(d, (x + bw / 2, base - hgt - 50), str(int(round(q['pts'] * k))), F(BEBAS, 110), GOLD if hl else WHITE, 'mm', cl(k * 2))
        ak = eo((lt - st - .3) / .3)
        T(d, (x + bw / 2, base + 50), f"Ç{q['q']}", F(BEBAS, 60), WHITE, 'mm', ak)
        T(d, (x + bw / 2, base + 100), f"FG {q['fg']}", F(IK, 26), GREY, 'mm', ak)
        hs, as_ = q['team']; won = hs > as_
        d.rounded_rectangle([x + 10, base + 130, x + bw - 10, base + 186], 10, fill=fade(PANEL, ak), outline=fade(GREEN if won else MISS, ak), width=2)
        T(d, (x + bw / 2, base + 158), f"{hs}–{as_}", F(BEBAS, 44), GREEN if won else MISS, 'mm', ak)
    fr.alpha_composite(l)
    # içgörüler
    l, d = lay()
    txts = cfg['insights']['quarters']
    for j, s in enumerate(txts):
        aj = eo((lt - (3.0 + j * 1.5)) / .4); y = 1420 + j * 86
        d.rounded_rectangle([60, y, 1020, y + 68], 12, fill=fade(PANEL, aj)); d.rectangle([60, y, 70, y + 68], fill=fade(GOLD, aj))
        T(d, (95, y + 34), s, F(IK, 30), WHITE, 'lm', aj)
    fr.alpha_composite(l)

def sc_ft(fr, t):
    lt = t - ST['ft']
    header(fr, 1)
    l, d = lay(); a = eo(lt / .3)
    T(d, (80, 430), 'SERBEST ATIŞ', F(BEBAS, 84), WHITE, 'lm', a)
    fts = cfg['fts']
    for i, (q, clk, m) in enumerate(fts):
        st = .3 + i * BEAT / 2; k = cl((lt - st) / .3)
        nc = 3 if len(fts) <= 6 else (4 if len(fts) <= 8 else 5); gap = 900 / nc
        cx = 90 + gap / 2 + (i % nc) * gap; cy = 720 + (i // nc) * (300 if nc == 3 else 230)
        if k > 0:
            s = ebk(k); r = min(100, gap * .36) * s
            d.ellipse([cx - r, cy - r, cx + r, cy + r], fill=fade(GREEN if m else (60, 30, 38), 1), outline=fade(GREEN if m else MISS, 1), width=5)
            if m: T(d, (cx, cy), '✓', F(IK, int(90 * s) + 1), (13, 15, 20), 'mm', 1)
            else:
                rr = 40 * s; d.line([cx - rr, cy - rr, cx + rr, cy + rr], fill=MISS + (255,), width=10); d.line([cx - rr, cy + rr, cx + rr, cy - rr], fill=MISS + (255,), width=10)
            T(d, (cx, cy + 135), f'Ç{q} · {clk}', F(IK, 26), GREY, 'mm', k)
    ak = eo((lt - 2.0) / .3)
    T(d, (80, 1330), f"{LN['ftm']}/{LN['fta']}", F(BEBAS, 200), MISS, 'lm', ak)
    T(d, (380, 1300), f"%{round(100 * LN['ftm'] / LN['fta'])}", F(BEBAS, 120), WHITE, 'lm', ak)
    T(d, (380, 1375), cfg['insights'].get('ft_tag', ''), F(IK, 34), GOLD, 'lm', ak)
    aj = eo((lt - 2.6) / .4)
    d.rounded_rectangle([60, 1470, 1020, 1538], 12, fill=fade(PANEL, aj)); d.rectangle([60, 1470, 70, 1538], fill=fade(MISS, aj))
    T(d, (95, 1504), cfg['insights']['ft'], F(IK, 30), WHITE, 'lm', aj)
    fr.alpha_composite(l)
    badge(fr, '07_eller-basta', 920, 1320, 150, ak)

def sc_play(fr, t):
    lt = t - ST['play']
    header(fr, 1)
    l, d = lay(); a = eo(lt / .3)
    T(d, (80, 430), 'OYUN KURUCU PİVOT', F(BEBAS, 84), WHITE, 'lm', a)
    fr.alpha_composite(l)
    items = [('04_pas', str(LN['ast']), 'ASİST', f"{LN['to']} TOP KAYBI"), ('05_ribaund-smac', str(LN['oreb']), 'HÜCUM RİBAUNDU', 'ROCKETS POTADA 51–38')]
    for i, (ph, v, lab, sub) in enumerate(items):
        st = .3 + i * 1.0; k = eo((lt - st) / .35); y = 560 + i * 420
        l, d = lay()
        d.rounded_rectangle([60, y, 1020, y + 380], 20, fill=fade(PANEL, k))
        d.rectangle([60, y, 72, y + 380], fill=fade(RED, k))
        n = int(int(v) * eo((lt - st) / .7))
        T(d, (380, y + 175), str(n), F(BEBAS, 260), GOLD, 'mm', k)
        T(d, (720, y + 150), lab, F(BEBAS, 72), WHITE, 'mm', k)
        T(d, (720, y + 225), sub, F(IK, 28), GREY, 'mm', k)
        fr.alpha_composite(shift(l, int(40 * (1 - k))))
        badge(fr, ph, 160, y + 190, 150, k)

def sc_final(fr, t):
    lt = t - ST['final']
    header(fr, 1)
    l, d = lay(); a = eo(lt / .3)
    T(d, (540, 470), cfg['insights'].get('record_title', 'TARİHE NOT'), F(IK, 34), GOLD, 'mm', a)
    fr.alpha_composite(l)
    badge(fr, '06_uc-parmak', 540, 680, 260, a, .7 + .3 * ebk(lt / .4))
    l, d = lay()
    rec = cfg['insights']['record']
    for j, s in enumerate(rec):
        aj = eo((lt - (.5 + j * BEAT * 2)) / .35)
        f = F(BEBAS, 92 if j == 0 else 64)
        if j == 2:
            tw = d.textlength(s, font=f); d.rectangle([540 - tw / 2 - 30, 1085, 540 + tw / 2 + 30, 1170], fill=fade(RED, aj))
        T(d, (540, 920 + j * 110 + (18 if j == 2 else 0)), s, f, GOLD if j == 0 else WHITE, 'mm', aj)
    a4 = eo((lt - 2.6) / .4)
    d.rounded_rectangle([60, 1260, 1020, 1420], 18, fill=fade(PANEL, a4))
    T(d, (540, 1312), 'ALPEREN ŞENGÜN', F(BEBAS, 70), WHITE, 'mm', a4)
    T(d, (540, 1375), f"{LN['pts']} SAYI · {LN['reb']} RİBAUND · {LN['ast']} ASİST · FG {LN['fgm']}/{LN['fga']}", F(IK, 30), GOLD, 'mm', a4)
    a5 = eo((lt - 3.2) / .4)
    T(d, (540, 1490), '@demiralpgoals', F(IK, 40), WHITE, 'mm', a5)
    T(d, (540, 1545), 'Her Alperen maçından sonra analiz', F(IB, 28), GREY, 'mm', a5)
    fr.alpha_composite(l)
    fo = cl((t - (cfg['dur'] - .7)) / .7)
    if fo > 0: fr.alpha_composite(Image.new('RGBA', (W, H), (0, 0, 0, int(220 * fo))))

FN = {'intro': sc_intro, 'card': sc_card, 'map': sc_map, 'quarters': sc_quarters, 'ft': sc_ft, 'play': sc_play, 'final': sc_final}
SCENES = [(a, b, FN[n]) for a, b, n in cfg['scenes']]
ST.update({n: a for a, b, n in cfg['scenes']})

def frame(t):
    fr = BGI.copy()
    for a, b, fn in SCENES:
        if a <= t < b or (fn is sc_final and t >= b): fn(fr, t); break
    for h in cfg['hits']:
        dt = t - h
        if 0 <= dt < .25: fr.alpha_composite(Image.new('RGBA', (W, H), (255, 255, 255, int(150 * (1 - dt / .25) ** 2))))
    for w in cfg['whoosh']:
        dt = t - w
        if 0 <= dt < .1: fr.alpha_composite(Image.new('RGBA', (W, H), (255, 255, 255, int(70 * (1 - dt / .1)))))
    rgb = fr.convert('RGB'); g = GRAIN[int(t * FPS) % 5]
    return Image.blend(rgb, Image.merge('RGB', [g, g, g]), .03)

if PREVIEW:
    os.makedirs('prev', exist_ok=True)
    for t in PREVIEW: frame(t).save(f'prev/t{t:05.2f}.jpg', quality=88)
    print('preview ok'); sys.exit()
n = int(cfg['dur'] * FPS)
p = subprocess.Popen(['ffmpeg', '-y', '-loglevel', 'error', '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-s', f'{W}x{H}', '-r', str(FPS), '-i', '-',
                      '-c:v', 'libx264', '-preset', 'veryfast', '-crf', '17', '-pix_fmt', 'yuv420p', OUT], stdin=subprocess.PIPE)
for i in range(n):
    p.stdin.write(frame(i / FPS).tobytes())
    if i % 300 == 0: print(i, '/', n, flush=True)
p.stdin.close(); p.wait(); print('video ok', OUT)
