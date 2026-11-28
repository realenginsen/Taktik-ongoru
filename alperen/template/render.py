# Alperen maç story render'ı (1080x1920, 30 fps) — PIL kareleri ffmpeg'e borulanır.
# Kullanım: python3 render.py mac.json gorseller/ out.mp4 [preview t1 t2 ...]
import json, sys, math, subprocess, os
import numpy as np
from PIL import Image, ImageDraw, ImageFont, ImageFilter, ImageEnhance

W, H, FPS = 1080, 1920, 30
HERE = os.path.dirname(os.path.abspath(__file__))
FD = os.path.join(HERE, 'fonts')
BEBAS = os.path.join(FD, 'BebasNeue-Regular.ttf')
INTER_B = '/usr/share/fonts/opentype/inter/Inter-Bold.otf'
INTER_K = '/usr/share/fonts/opentype/inter/Inter-Black.otf'
RED = (206, 17, 65); GOLD = (253, 185, 39); INK = (12, 12, 16); WHITE = (255, 255, 255)

cfg = json.load(open(sys.argv[1])); GDIR = sys.argv[2]; OUT = sys.argv[3]
PREVIEW = [float(x) for x in sys.argv[5:]] if len(sys.argv) > 4 and sys.argv[4] == 'preview' else None
BPM = cfg.get('bpm', 120); BEAT = 60 / BPM
_fc = {}
def font(p, s):
    k = (p, s)
    if k not in _fc: _fc[k] = ImageFont.truetype(p, s)
    return _fc[k]
def clamp(x, a=0, b=1): return max(a, min(b, x))
def eo(x): x = clamp(x); return 1 - (1 - x) ** 3
def eob(x):  # hafif taşan
    x = clamp(x); c = 1.7; return 1 + (c + 1) * (x - 1) ** 3 + c * (x - 1) ** 2

# --- görseller ---
_img = {}
def load(name, grade=None):
    k = (name, grade)
    if k in _img: return _img[k]
    im = Image.open(os.path.join(GDIR, name + '.jpg')).convert('RGB')
    w, h = im.size; m = int(min(w, h) * .025)
    im = im.crop((m, m, w - m, h - m))
    im = im.filter(ImageFilter.UnsharpMask(2, 60, 2))
    if grade == 'cold':
        im = ImageEnhance.Color(im).enhance(.35)
        a = np.asarray(im).astype(np.float32); a[..., 2] *= 1.08; a[..., 0] *= .9
        im = Image.fromarray(a.clip(0, 255).astype(np.uint8))
    # ana görsel: 1080 genişlik kare (+%12 pay Ken Burns için)
    S = int(max(W * 1.12, 1180 * 1.12 * im.width / im.height))
    main = im.resize((S, int(S * im.height / im.width)), Image.LANCZOS)
    # arka plan: bulanık, karartılmış, tam ekran
    bh = H; bw = int(bh * im.width / im.height)
    bg = im.resize((max(bw, W), bh), Image.BILINEAR).filter(ImageFilter.GaussianBlur(40))
    bg = ImageEnhance.Brightness(bg).enhance(.35)
    bx = (bg.width - W) // 2; bg = bg.crop((bx, 0, bx + W, H))
    _img[k] = (main, bg)
    return _img[k]

# alt gradyan maskesi (görselin altını zemine eritir)
def make_fade(h):
    y = np.linspace(0, 1, h)
    a = np.clip((1 - y) / .35, 0, 1)  # alt %35 erir
    a = (a ** 1.3 * 255).astype(np.uint8)
    return Image.fromarray(np.repeat(a[:, None], W, 1), 'L')
FADE = make_fade(1180)
GRAD = None
def bottom_grad():
    y = np.linspace(0, 1, H)
    a = np.clip((y - .45) / .3, 0, 1) * 200
    return Image.fromarray(np.repeat(a[:, None], W, 1).astype(np.uint8), 'L')
GRAD = bottom_grad()
GRAIN = [Image.fromarray((np.random.default_rng(i).normal(128, 18, (H // 2, W // 2))).clip(0, 255).astype(np.uint8), 'L').resize((W, H)) for i in range(6)]

def beat_pulse(t, sec):
    if sec not in ('full', 'drop', 'outro', 'build'): return 0
    ph = (t % BEAT) / BEAT
    return math.exp(-ph * 6) * (.012 if sec != 'build' else .008)

def section(t):
    for a, b, k in cfg['sections']:
        if a <= t < b: return k
    return 'outro'

def text(d, xy, s, f, fill=WHITE, anchor='la', shadow=True, stroke=0):
    if shadow:
        d.text((xy[0] + 4, xy[1] + 6), s, font=f, fill=(0, 0, 0, 150), anchor=anchor)
    d.text(xy, s, font=f, fill=fill, anchor=anchor, stroke_width=stroke, stroke_fill=INK)

def layer_text(frame, draw_fn, scale=1.0, alpha=1.0, origin=(W // 2, 1400), dy=0):
    """Metni ayrı katmanda çizip ölçek/saydamlıkla bindirir."""
    lay = Image.new('RGBA', (W, H), (0, 0, 0, 0)); d = ImageDraw.Draw(lay)
    draw_fn(d)
    if scale != 1.0:
        sw, sh = int(W * scale), int(H * scale)
        big = lay.resize((sw, sh), Image.BILINEAR)
        ox, oy = origin
        x0 = int(ox - ox * scale); y0 = int(oy - oy * scale)
        lay = Image.new('RGBA', (W, H), (0, 0, 0, 0)); lay.paste(big, (x0, y0))
    if dy: lay = lay.transform(lay.size, Image.AFFINE, (1, 0, 0, 0, 1, -dy))
    if alpha < 1:
        a = lay.getchannel('A').point(lambda v: int(v * alpha)); lay.putalpha(a)
    frame.alpha_composite(lay)

def ribbon(d, y, h, col=RED, w=W, x=0, slant=40):
    d.polygon([(x, y + slant), (x + w, y), (x + w, y + h), (x, y + h + slant)], fill=col)

def base(frame, sc, t, lt, push=.06, ytop=0):
    main, bg = load(sc['img'], sc.get('grade'))
    frame.paste(bg, (0, 0))
    dur = sc['t1'] - sc['t0']
    z = 1 + push * (lt / dur) + beat_pulse(t, section(t))
    f = max(W / main.width, 1180 / main.height) * z
    sw = int(main.width * f); sh = int(main.height * f)
    m = main.resize((sw, sh), Image.BILINEAR)
    ox = (sw - W) // 2; oy = int(max(sh - 1180, 0) * .35)
    m = m.crop((ox, max(oy, 0), ox + W, max(oy, 0) + 1180))
    frame.paste(m, (0, ytop), FADE)

def draw_scene(sc, t):
    fr = Image.new('RGBA', (W, H), INK + (255,))
    lt = t - sc['t0']; dur = sc['t1'] - sc['t0']; ty = sc['type']
    if ty == 'intro':
        main, bg = load(sc['img'])
        # siluet tam ekran, yavaş itme
        z = 1.0 + .06 * lt / dur
        S = int(H * z); im = main.resize((S, S), Image.BILINEAR)
        x0 = (S - W) // 2; y0 = (S - H) // 2
        fr.paste(im.crop((x0, y0, x0 + W, y0 + H)), (0, 0))
        fr.alpha_composite(Image.merge('RGBA', [Image.new('L', (W, H), 0)] * 3 + [GRAD]))
        a1 = eo((lt - .2) / .6); a2 = eo((lt - 1.0) / .6); a3 = eo((lt - 2.0) / .5)
        def k(d): text(d, (W // 2, 1330), sc['kicker'], font(INTER_B, 40), fill=GOLD, anchor='mm')
        def ti(d): text(d, (W // 2, 1440), sc['title'], font(BEBAS, 150), anchor='mm')
        def su(d):
            ribbon(d, 1530, 90, slant=0, w=560, x=260)
            text(d, (W // 2, 1577), sc['sub'], font(BEBAS, 78), anchor='mm', shadow=False)
        layer_text(fr, k, alpha=a1, dy=int(30 * (1 - a1)))
        layer_text(fr, ti, alpha=a2, dy=int(40 * (1 - a2)))
        layer_text(fr, su, alpha=a3, scale=1 + .3 * (1 - eo((lt - 2) / .25)), origin=(W // 2, 1577))
    elif ty == 'slam':
        base(fr, sc, t, lt, push=.1)
        s1 = clamp(lt / .18); s2 = clamp((lt - BEAT) / .18)
        def b1(d): text(d, (W // 2, 1270), sc['big'], font(BEBAS, 330), anchor='mm', stroke=6)
        def b2(d): text(d, (W // 2, 1540), sc['big2'], font(BEBAS, 330), fill=GOLD, anchor='mm', stroke=6)
        if lt > 0: layer_text(fr, b1, scale=1 + 1.2 * (1 - s1), alpha=s1, origin=(W // 2, 1270))
        if lt > BEAT: layer_text(fr, b2, scale=1 + 1.2 * (1 - s2), alpha=s2, origin=(W // 2, 1540))
    elif ty == 'stat':
        base(fr, sc, t, lt)
        c = eo(lt / .7); n = int(round(sc['num'] * c))
        a = eo(lt / .25)
        def num(d):
            ribbon(d, 1120, 14, col=RED, w=420, x=80, slant=0)
            text(d, (70, 1110), str(n), font(BEBAS, 420), anchor='ls', stroke=4) if False else None
            text(d, (78, 1500), str(n), font(BEBAS, 440), anchor='ls', stroke=4)
        def lab(d):
            f = font(BEBAS, 440); nw = d.textlength(str(sc['num']), font=f)
            text(d, (78 + nw + 30, 1490), sc['label'], font(BEBAS, 130), fill=GOLD, anchor='ls')
        layer_text(fr, num, alpha=a, scale=1 + .25 * (1 - eo(lt / .2)), origin=(200, 1350))
        al = eo((lt - .35) / .3); layer_text(fr, lab, alpha=al, dy=int(30 * (1 - al)))
        for i, note in enumerate(sc.get('notes', [])):
            an = eo((lt - BEAT * (2 + i)) / .3)
            def nd(d, note=note, i=i):
                f = font(INTER_K, 46); tw = d.textlength(note, font=f)
                y = 1545 + i * 86
                d.rectangle([78, y, 78 + tw + 44, y + 70], fill=RED if i == 0 else (40, 40, 48))
                text(d, (100, y + 35), note, f, anchor='lm', shadow=False)
            layer_text(fr, nd, alpha=an, dy=int(-40 * (1 - an)))
    elif ty == 'story':
        base(fr, sc, t, lt, push=.08)
        ak = eo(lt / .3); at = eo((lt - .25) / .35); asu = eo((lt - BEAT * 3) / .4)
        def k(d):
            f = font(INTER_K, 44); tw = d.textlength(sc['kicker'], font=f)
            d.rectangle([78, 1150, 78 + tw + 44, 1220], fill=RED)
            text(d, (100, 1185), sc['kicker'], f, anchor='lm', shadow=False)
        def ti(d): text(d, (72, 1500), sc['title'], font(BEBAS, 300), anchor='ls', stroke=4)
        def su(d):
            f = font(INTER_K, 48); words = sc['sub'].split(' '); lines = []; cur = ''
            for w_ in words:
                if d.textlength((cur + ' ' + w_).strip(), font=f) > 900: lines.append(cur); cur = w_
                else: cur = (cur + ' ' + w_).strip()
            lines.append(cur)
            for i, ln in enumerate(lines): text(d, (80, 1560 + i * 64), ln, f, fill=GOLD if sc.get('grade') != 'cold' else (190, 205, 230))
        layer_text(fr, k, alpha=ak, dy=int(30 * (1 - ak)))
        layer_text(fr, ti, alpha=at, scale=1 + .15 * (1 - at), origin=(300, 1400))
        layer_text(fr, su, alpha=asu, dy=int(30 * (1 - asu)))
    elif ty == 'record':
        base(fr, sc, t, lt, push=.08)
        c = eo(lt / .9); n = max(1, int(round(sc['num'] * c)))
        ak = eo(lt / .3); an = eo(lt / .2); asu = eo((lt - BEAT * 3) / .4)
        def k(d): text(d, (W // 2, 1150), sc['kicker'], font(INTER_K, 50), fill=GOLD, anchor='mm')
        def nm(d):
            f1 = font(BEBAS, 380); f2 = font(BEBAS, 120)
            s1 = str(n) + '.'; w1 = d.textlength(s1, font=f1); w2 = d.textlength(sc['label'], font=f2)
            x = (W - (w1 + 16 + w2)) / 2
            text(d, (x, 1490), s1, f1, anchor='ls', stroke=4)
            text(d, (x + w1 + 16, 1470), sc['label'], f2, fill=GOLD, anchor='ls')
        def su(d):
            for i, ln in enumerate(sc['sub'].split('\n')):
                f = font(INTER_K, 50 if i == 0 else 44)
                if i == 1:
                    tw = d.textlength(ln, font=f); d.rectangle([(W - tw) / 2 - 24, 1608, (W + tw) / 2 + 24, 1680], fill=RED)
                text(d, (W // 2, 1560 + i * 84), ln, f, anchor='mm', shadow=(i == 0))
        layer_text(fr, k, alpha=ak)
        layer_text(fr, nm, alpha=an, scale=1 + .2 * (1 - eo(lt / .25)), origin=(W // 2, 1380))
        layer_text(fr, su, alpha=asu, dy=int(30 * (1 - asu)))
    elif ty == 'final':
        base(fr, sc, t, lt, push=.05)
        a1 = eo(lt / .3); a2 = eo((lt - BEAT) / .35); a3 = eo((lt - BEAT * 2) / .35); a4 = eo((lt - BEAT * 4) / .5)
        def sb(d):
            d.rectangle([60, 1150, W - 60, 1440], fill=(16, 16, 22, 235))
            d.rectangle([60, 1150, 76, 1440], fill=RED)
            text(d, (110, 1240), sc['home'], font(BEBAS, 110), anchor='lm', shadow=False)
            text(d, (110, 1360), sc['away'], font(BEBAS, 110), fill=(170, 170, 180), anchor='lm', shadow=False)
            text(d, (W - 110, 1240), str(int(sc['hs'] * eo(lt / .8))), font(BEBAS, 130), fill=GOLD, anchor='rm', shadow=False)
            text(d, (W - 110, 1360), str(int(sc['as'] * eo(lt / .8))), font(BEBAS, 130), fill=(170, 170, 180), anchor='rm', shadow=False)
            text(d, (W // 2, 1110), 'MAÇ SONU', font(INTER_K, 34), fill=GOLD, anchor='mm')
        def nm(d):
            ribbon(d, 1470, 96, slant=0, w=720, x=180)
            text(d, (W // 2, 1520), 'ALPEREN ŞENGÜN', font(BEBAS, 84), anchor='mm', shadow=False)
        def su(d): text(d, (W // 2, 1625), sc['sub'], font(INTER_K, 44), fill=GOLD, anchor='mm')
        def wm(d): text(d, (W // 2, 1700), '@demiralpgoals', font(INTER_B, 36), fill=(200, 200, 210), anchor='mm')
        layer_text(fr, sb, alpha=a1, dy=int(60 * (1 - a1)))
        layer_text(fr, nm, alpha=a2, scale=1 + .3 * (1 - a2), origin=(W // 2, 1520))
        layer_text(fr, su, alpha=a3)
        layer_text(fr, wm, alpha=a4)
        # sondaki yumuşak kararma (son 0.8 sn)
        fo = clamp((t - (sc['t1'] - .8)) / .8)
        if fo > 0: fr.alpha_composite(Image.new('RGBA', (W, H), (0, 0, 0, int(200 * fo))))
    return fr

def post(fr, t):
    # vuruş flaşı + sarsıntı
    for h in cfg['hits']:
        dt = t - h
        if 0 <= dt < .35:
            fr.alpha_composite(Image.new('RGBA', (W, H), (255, 255, 255, int(220 * (1 - dt / .35) ** 2))))
        if 0 <= dt < .5:
            amp = 18 * (1 - dt / .5); dx = int(amp * math.sin(dt * 90)); dy = int(amp * math.cos(dt * 70))
            fr = fr.transform(fr.size, Image.AFFINE, (1, 0, dx, 0, 1, dy))
    # sahne geçişi: kısa beyaz/kırmızı çizgi silme
    for sc in cfg['scenes'][1:]:
        dt = t - sc['t0']
        if 0 <= dt < .12 and sc['t0'] not in cfg['hits']:
            fr.alpha_composite(Image.new('RGBA', (W, H), (255, 255, 255, int(120 * (1 - dt / .12)))))
    g = GRAIN[int(t * FPS) % len(GRAIN)]
    rgb = fr.convert('RGB')
    rgb = Image.blend(rgb, Image.merge('RGB', [g, g, g]), .05)
    return rgb

def scene_at(t):
    for sc in cfg['scenes']:
        if sc['t0'] <= t < sc['t1']: return sc
    return cfg['scenes'][-1]

def frame(t): return post(draw_scene(scene_at(t), t), t)

if PREVIEW:
    os.makedirs('prev', exist_ok=True)
    for t in PREVIEW: frame(t).save(f'prev/t{t:05.2f}.jpg', quality=88)
    print('preview ok'); sys.exit()

n = int(cfg['dur'] * FPS)
p = subprocess.Popen(['ffmpeg', '-y', '-loglevel', 'error', '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-s', f'{W}x{H}', '-r', str(FPS), '-i', '-',
                      '-c:v', 'libx264', '-preset', 'veryfast', '-crf', '18', '-pix_fmt', 'yuv420p', OUT], stdin=subprocess.PIPE)
for i in range(n):
    p.stdin.write(frame(i / FPS).tobytes())
    if i % 150 == 0: print(i, '/', n, flush=True)
p.stdin.close(); p.wait(); print('video ok', OUT)
