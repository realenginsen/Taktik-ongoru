// Efsanenin Hikâyesi — belgesel sahne motoru (1080x1920, canvas 2D)
// Bölüm verisi: episodes/<slug>.js içinde EP = { meta, theme, scenes:[...] }
const W = 1080, H = 1920;
const cv = document.getElementById('c');
const ctx = cv.getContext('2d');

// ---------- yardımcılar ----------
const clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));
const lerp = (a, b, t) => a + (b - a) * t;
const ease = t => t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
const easeOut = t => 1 - Math.pow(1 - t, 3);
const ramp = (t, a, b) => clamp((t - a) / (b - a));
function rng(seed) { let s = seed >>> 0; return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296); }
const T = Object.assign({
  bg: '#0c0a08', bg2: '#1d1712', ink: '#f3e9d8', dim: '#a89a86', acc: '#d9a441', red: '#c0392b',
  blue: '#2f6db5', singlet: '#8e1616', skin: '#3b2a20', hair: '#120c08', rim: '#ffcf7a'
}, (typeof EP !== 'undefined' && EP.theme) || {});

const F = {
  title: n => `900 ${n}px "Playfair Display"`,
  titleI: n => `italic 700 ${n}px "Playfair Display"`,
  body: (n, w = 600) => `${w} ${n}px Inter`,
  num: n => `${n}px "Bebas Neue"`
};
async function fontsReady() {
  const fs = [F.title(80), F.titleI(60), F.body(40, 400), F.body(40, 600), F.body(40, 800), F.num(80)];
  await Promise.all(fs.map(f => document.fonts.load(f, 'ÇĞİÖŞÜçğıöşü$1')));
  await document.fonts.ready;
}

function wrap(text, maxW) {
  const words = text.split(' '); const lines = []; let cur = '';
  for (const w of words) { const t = cur ? cur + ' ' + w : w; if (ctx.measureText(t).width > maxW && cur) { lines.push(cur); cur = w; } else cur = t; }
  if (cur) lines.push(cur); return lines;
}
function spaced(text, x, y, sp, align = 'center') {
  // harf aralıklı metin
  const chars = [...text]; let w = 0; for (const c of chars) w += ctx.measureText(c).width + sp; w -= sp;
  let cx = align === 'center' ? x - w / 2 : align === 'right' ? x - w : x;
  const old = ctx.textAlign; ctx.textAlign = 'left';
  for (const c of chars) { ctx.fillText(c, cx, y); cx += ctx.measureText(c).width + sp; }
  ctx.textAlign = old; return w;
}
function rrect(x, y, w, h, r) { ctx.beginPath(); ctx.roundRect(x, y, w, h, r); }

// ---------- film greni (önceden hesaplanmış) ----------
const GRAIN = [];
(function () {
  const r = rng(7);
  for (let k = 0; k < 6; k++) {
    const c = document.createElement('canvas'); c.width = 360; c.height = 640;
    const g = c.getContext('2d'); const im = g.createImageData(360, 640);
    for (let i = 0; i < im.data.length; i += 4) { const v = r() * 255; im.data[i] = im.data[i + 1] = im.data[i + 2] = v; im.data[i + 3] = 255; }
    g.putImageData(im, 0, 0); GRAIN.push(c);
  }
})();
const VIG = (function () {
  const c = document.createElement('canvas'); c.width = W; c.height = H; const g = c.getContext('2d');
  const gr = g.createRadialGradient(W / 2, H * .46, H * .22, W / 2, H * .5, H * .72);
  gr.addColorStop(0, 'rgba(0,0,0,0)'); gr.addColorStop(1, 'rgba(0,0,0,.78)');
  g.fillStyle = gr; g.fillRect(0, 0, W, H); return c;
})();

function background(warm = 1) {
  ctx.fillStyle = T.bg; ctx.fillRect(0, 0, W, H);
  const g = ctx.createRadialGradient(W / 2, H * .42, 50, W / 2, H * .45, H * .7);
  g.addColorStop(0, `rgba(70,52,34,${.55 * warm})`); g.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
}
function post(frame) {
  ctx.drawImage(VIG, 0, 0);
  ctx.save(); ctx.globalAlpha = .07; ctx.globalCompositeOperation = 'overlay';
  ctx.drawImage(GRAIN[frame % GRAIN.length], 0, 0, W, H); ctx.restore();
  // ince sinema şeritleri
  ctx.fillStyle = 'rgba(0,0,0,.5)'; ctx.fillRect(0, 0, W, 14); ctx.fillRect(0, H - 14, W, 14);
}

// ---------- başlık / altyazı ----------
function seriesTag(a = 1) {
  ctx.save(); ctx.globalAlpha = .75 * a; ctx.fillStyle = T.dim; ctx.font = F.body(24, 600); ctx.textAlign = 'center';
  spaced(`EFSANENİN HİKÂYESİ · #${EP.meta.no}`, W / 2, 96, 5); ctx.restore();
}
function header(sc, t) {
  const hs = sc.header || []; let cur = null, t0 = 0, nxt = Infinity;
  for (let i = 0; i < hs.length; i++) if (t >= hs[i][0]) { cur = hs[i]; t0 = hs[i][0]; nxt = hs[i + 1] ? hs[i + 1][0] : Infinity; }
  if (!cur) return;
  const a = easeOut(ramp(t, t0, t0 + .6)) * (nxt < 1e9 ? 1 - ramp(t, nxt - .35, nxt) : 1);
  const dy = (1 - a) * 24;
  ctx.save(); ctx.globalAlpha = a; ctx.textAlign = 'center';
  if (cur[1]) { ctx.fillStyle = T.acc; ctx.font = F.body(28, 700); spaced(cur[1], W / 2, 210 + dy, 6); }
  ctx.fillStyle = T.ink; ctx.font = F.title(cur[3] || 92);
  ctx.fillText(cur[2], W / 2, 310 + dy);
  ctx.fillStyle = T.acc; ctx.fillRect(W / 2 - 40 * a, 345 + dy, 80 * a, 3);
  ctx.restore();
}
function subs(sc, t) {
  for (const [a, b, text] of (sc.subs || [])) {
    if (t < a || t > b) continue;
    const fadeOut = 1 - ramp(t, b - .3, b);
    ctx.save(); ctx.font = F.body(46, 600);
    const lines = wrap(text, 900);
    const total = [...text].length; const shown = Math.floor((t - a) * 42);
    const boxH = lines.length * 64 + 50, y0 = 1590 - boxH / 2;
    ctx.globalAlpha = fadeOut;
    const g = ctx.createLinearGradient(0, y0 - 80, 0, y0 + boxH + 80);
    g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(.3, 'rgba(0,0,0,.55)'); g.addColorStop(.7, 'rgba(0,0,0,.55)'); g.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = g; ctx.fillRect(0, y0 - 80, W, boxH + 160);
    ctx.fillStyle = T.acc; ctx.fillRect(70, y0 + 18, 5, boxH - 36);
    ctx.fillStyle = T.ink; ctx.textAlign = 'left'; ctx.textBaseline = 'alphabetic';
    let used = 0;
    lines.forEach((ln, i) => {
      const n = [...ln].length; const vis = clamp(shown - used, 0, n); used += n + 1;
      const part = [...ln].slice(0, vis).join('');
      ctx.fillText(part, 100, y0 + 70 + i * 64);
      if (vis > 0 && vis < n && shown < total) { const w = ctx.measureText(part).width; ctx.fillStyle = T.acc; ctx.fillRect(104 + w, y0 + 30 + i * 64, 4, 46); ctx.fillStyle = T.ink; }
    });
    ctx.restore();
  }
}

// ---------- sporcu figürü (ARKADAN, siluet) ----------
// Pozlar: sağ taraf (x>0) yarım iskelet; sol aynalanır. L/R ayrı verilebilir. Birim: piksel (s=1, boy ~600).
const POSES = {
  stand: { foot: [62, 0], knee: [56, -160], hip: [46, -300], sh: [80, -478], el: [92, -360], ha: [96, -250], head: [0, -545], bar: null },
  setup: { foot: [72, 0], knee: [98, -112], hip: [56, -175], sh: [72, -330], el: [104, -210], ha: [112, -96], head: [0, -385], bar: -96 },
  pull: { foot: [64, 0], knee: [60, -150], hip: [48, -285], sh: [80, -462], el: [104, -372], ha: [112, -282], head: [0, -527], bar: -282 },
  catch: { foot: [78, 0], knee: [112, -122], hip: [60, -165], sh: [84, -352], el: [140, -312], ha: [104, -372], head: [0, -410], bar: -372 },
  rack: { foot: [62, 0], knee: [56, -160], hip: [46, -300], sh: [80, -478], el: [136, -440], ha: [102, -498], head: [0, -545], bar: -498 },
  dip: { foot: [62, 0], knee: [64, -138], hip: [46, -268], sh: [80, -446], el: [136, -408], ha: [102, -466], head: [0, -513], bar: -466 },
  split: { R: { foot: [56, -22], knee: [70, -150], hip: [46, -258], sh: [82, -436], el: [116, -562], ha: [140, -682] },
           L: { foot: [-48, 14], knee: [-44, -100], hip: [-46, -258], sh: [-82, -436], el: [-116, -562], ha: [-140, -682] }, head: [0, -500], bar: -682 },
  over: { foot: [64, 0], knee: [58, -160], hip: [46, -300], sh: [80, -478], el: [118, -600], ha: [140, -722], head: [0, -545], bar: -722 },
  snatch: { foot: [80, 0], knee: [112, -118], hip: [60, -168], sh: [84, -352], el: [170, -470], ha: [236, -560], head: [0, -410], bar: -560 },
  slump: { foot: [62, 0], knee: [58, -156], hip: [46, -294], sh: [76, -462], el: [84, -350], ha: [86, -244], head: [0, -515], bar: null }
};
function side(p, s) { // s: 1 sağ, -1 sol
  const src = s > 0 ? (p.R || p) : (p.L || null);
  if (src) return src;
  const r = p.R || p; const m = k => [-r[k][0], r[k][1]];
  return { foot: m('foot'), knee: m('knee'), hip: m('hip'), sh: m('sh'), el: m('el'), ha: m('ha') };
}
function mixPose(a, b, k) {
  const A = POSES[a], B = POSES[b]; const o = { R: {}, L: {} };
  for (const s of [1, -1]) {
    const sa = side(A, s), sb = side(B, s), d = s > 0 ? o.R : o.L;
    for (const j of ['foot', 'knee', 'hip', 'sh', 'el', 'ha']) d[j] = [lerp(sa[j][0], sb[j][0], k), lerp(sa[j][1], sb[j][1], k)];
  }
  o.head = [lerp(A.head[0], B.head[0], k), lerp(A.head[1], B.head[1], k)];
  const ba = A.bar ?? null, bb = B.bar ?? null;
  o.bar = ba === null && bb === null ? null : (ba === null ? (k > .5 ? bb : null) : bb === null ? (k < .5 ? ba : null) : lerp(ba, bb, k));
  return o;
}
// zaman çizgisi: [[t, poz], ...] -> karışık poz
function poseAt(track, t) {
  if (t <= track[0][0]) return mixPose(track[0][1], track[0][1], 0);
  for (let i = 0; i < track.length - 1; i++) {
    const [t0, p0] = track[i], [t1, p1] = track[i + 1];
    if (t <= t1) return mixPose(p0, p1, ease(ramp(t, t0, t1)));
  }
  const l = track[track.length - 1][1]; return mixPose(l, l, 0);
}
function limb(a, b, w, col) { ctx.strokeStyle = col; ctx.lineWidth = w; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); ctx.stroke(); }
function drawBar(y, half, plateR, sag, opt = {}) {
  ctx.save();
  ctx.strokeStyle = '#9a9286'; ctx.lineWidth = 9; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(-half, y + sag); ctx.quadraticCurveTo(0, y - sag * .6, half, y + sag); ctx.stroke();
  const plates = opt.plates || [[0, plateR, '#7d1d1d'], [34, plateR, '#7d1d1d'], [64, plateR * .9, '#1e3f78'], [90, plateR * .7, '#c9a227']];
  for (const sgn of [1, -1]) {
    for (const [off, r, col] of plates) {
      const x = sgn * (half - 150 + off);
      ctx.fillStyle = col; rrect(x - 13, y + sag - r, 26, r * 2, 8); ctx.fill();
      ctx.fillStyle = 'rgba(255,220,160,.18)'; rrect(x - 13, y + sag - r, 8, r * 2, 4); ctx.fill();
    }
    ctx.fillStyle = '#b8b0a2'; rrect(sgn * (half - 152) - 8, y + sag - 22, 16, 44, 4); ctx.fill();
  }
  ctx.restore();
}
function drawFigure(x, y, s, pose, opt = {}) {
  const P = pose; const skin = opt.skin || T.skin, sing = opt.singlet || T.singlet;
  const glow = opt.glow ?? 1;
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  const body = () => {
    for (const sd of [P.L, P.R]) { limb(sd.foot, sd.knee, 40, skin); limb(sd.knee, sd.hip, 52, skin); }
    // ayakkabı
    for (const sd of [P.L, P.R]) { ctx.fillStyle = '#16120e'; rrect(sd.foot[0] - 26, sd.foot[1] - 14, 52, 26, 10); ctx.fill(); }
    // gövde (atlet)
    const L = P.L, R = P.R;
    ctx.fillStyle = sing; ctx.beginPath();
    ctx.moveTo(L.sh[0] - 6, L.sh[1]); ctx.lineTo(R.sh[0] + 6, R.sh[1]);
    ctx.quadraticCurveTo(R.hip[0] + 30, (R.sh[1] + R.hip[1]) / 2, R.hip[0] + 22, R.hip[1] + 26);
    ctx.lineTo(L.hip[0] - 22, L.hip[1] + 26);
    ctx.quadraticCurveTo(L.hip[0] - 30, (L.sh[1] + L.hip[1]) / 2, L.sh[0] - 6, L.sh[1]);
    ctx.fill();
    // kemer
    ctx.fillStyle = '#2a2018'; ctx.fillRect(Math.min(L.hip[0], R.hip[0]) - 26, (L.hip[1] + R.hip[1]) / 2 - 34, Math.abs(R.hip[0] - L.hip[0]) + 52, 26);
    // boyun + kafa
    ctx.fillStyle = skin; rrect(P.head[0] - 17, P.head[1] + 20, 34, (L.sh[1] + R.sh[1]) / 2 - P.head[1] - 10, 10); ctx.fill();
    ctx.beginPath(); ctx.ellipse(P.head[0], P.head[1], 38, 44, 0, 0, Math.PI * 2); ctx.fillStyle = T.hair; ctx.fill();
    ctx.beginPath(); ctx.ellipse(P.head[0], P.head[1] + 30, 30, 16, 0, 0, Math.PI); ctx.fillStyle = skin; ctx.fill();
    // kollar
    for (const sd of [P.L, P.R]) { limb(sd.sh, sd.el, 34, skin); limb(sd.el, sd.ha, 28, skin); }
    // omuz askısı
    for (const sd of [P.L, P.R]) limb([sd.sh[0] * .55, sd.sh[1] - 6], [sd.sh[0] * .5, sd.sh[1] + 60], 16, sing);
  };
  if (glow > 0) { ctx.save(); ctx.shadowColor = `rgba(255,190,110,${.55 * glow})`; ctx.shadowBlur = 46; body(); ctx.restore(); }
  body();
  // sırt yazısı
  if (opt.back) { ctx.fillStyle = 'rgba(255,255,255,.85)'; ctx.font = F.num(40); ctx.textAlign = 'center';
    ctx.fillText(opt.back, (P.L.sh[0] + P.R.sh[0]) / 2, (P.L.sh[1] + P.L.hip[1]) / 2 + 4); }
  const by = opt.barY ?? P.bar;
  if (by !== null && by !== undefined && opt.bar !== false) drawBar(by, opt.barHalf || 450, opt.plateR || 92, opt.sag || 0, opt);
  ctx.restore();
}

// ---------- sahne öğeleri ----------
function spotlight(x, a = 1, w = 520) {
  ctx.save(); ctx.globalCompositeOperation = 'lighter';
  const g = ctx.createLinearGradient(0, 0, 0, 1500);
  g.addColorStop(0, `rgba(255,214,150,${.22 * a})`); g.addColorStop(1, `rgba(255,214,150,0)`);
  ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(x - 60, 0); ctx.lineTo(x + 60, 0); ctx.lineTo(x + w, 1500); ctx.lineTo(x - w, 1500); ctx.fill();
  const r = ctx.createRadialGradient(x, 1300, 10, x, 1300, 520); r.addColorStop(0, `rgba(255,200,130,${.28 * a})`); r.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = r; ctx.fillRect(x - 600, 1000, 1200, 600); ctx.restore();
}
function platform(y = 1330) {
  ctx.fillStyle = '#3a2a1b'; ctx.beginPath(); ctx.moveTo(140, y); ctx.lineTo(940, y); ctx.lineTo(1080, y + 150); ctx.lineTo(0, y + 150); ctx.fill();
  ctx.strokeStyle = 'rgba(255,210,150,.14)'; ctx.lineWidth = 2;
  for (let i = 1; i < 6; i++) { const k = i / 6; ctx.beginPath(); ctx.moveTo(lerp(140, 940, k), y); ctx.lineTo(lerp(0, 1080, k), y + 150); ctx.stroke(); }
  ctx.fillStyle = '#1c140d'; ctx.fillRect(0, y + 150, W, 30);
}
const CROWD = (function () { const r = rng(42); const a = []; for (let row = 0; row < 4; row++) for (let i = 0; i < 16; i++) a.push({ row, x: i * 72 + (row % 2) * 36 + r() * 20 - 10, h: r() * 14, flag: r() < .22, ph: r() * 6 }); return a; })();
function crowd(t, y0 = 760, flagCol = '#c0392b', roar = 0) {
  for (const c of CROWD) {
    const y = y0 + c.row * 62 - c.h - (roar ? Math.abs(Math.sin(t * 7 + c.ph)) * 18 * roar : 0);
    const sh = 1 - c.row * .08; ctx.fillStyle = `rgba(${18 + c.row * 6},${14 + c.row * 5},${11 + c.row * 4},1)`;
    ctx.beginPath(); ctx.arc(c.x, y, 22 * sh, 0, Math.PI * 2); ctx.fill();
    rrect(c.x - 34 * sh, y + 18, 68 * sh, 70, 20); ctx.fill();
    if (c.flag) { const wv = Math.sin(t * 4 + c.ph) * 8; ctx.strokeStyle = '#2a2420'; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(c.x + 26, y + 20); ctx.lineTo(c.x + 30, y - 70); ctx.stroke();
      ctx.fillStyle = flagCol; ctx.beginPath(); ctx.moveTo(c.x + 30, y - 70); ctx.quadraticCurveTo(c.x + 55, y - 74 + wv, c.x + 82, y - 66); ctx.lineTo(c.x + 82, y - 34); ctx.quadraticCurveTo(c.x + 55, y - 40 + wv, c.x + 30, y - 36); ctx.fill(); }
  }
}
function medal(x, y, r, a = 1, label = '') {
  ctx.save(); ctx.globalAlpha = a;
  ctx.fillStyle = '#7d1d1d'; ctx.beginPath(); ctx.moveTo(x - r * .5, y - r * 2.1); ctx.lineTo(x - r * .15, y - r * .8); ctx.lineTo(x + r * .15, y - r * .8); ctx.lineTo(x + r * .5, y - r * 2.1); ctx.fill();
  const g = ctx.createRadialGradient(x - r * .3, y - r * .3, r * .1, x, y, r); g.addColorStop(0, '#ffe9a3'); g.addColorStop(.6, '#d4a62a'); g.addColorStop(1, '#8a6512');
  ctx.shadowColor = 'rgba(255,200,90,.6)'; ctx.shadowBlur = 30; ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill(); ctx.shadowBlur = 0;
  ctx.strokeStyle = 'rgba(90,60,10,.6)'; ctx.lineWidth = 4; ctx.beginPath(); ctx.arc(x, y, r * .78, 0, Math.PI * 2); ctx.stroke();
  if (label) { ctx.fillStyle = '#5a3d08'; ctx.font = F.num(r * .62); ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(label, x, y + 3); ctx.textBaseline = 'alphabetic'; }
  ctx.restore();
}
function stamp(text, x, y, rot, k, col = T.red, size = 110) {
  if (k <= 0) return;
  const sc = 1 + (1 - easeOut(clamp(k * 3))) * 1.4;
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(sc, sc); ctx.globalAlpha = clamp(k * 3) * .92;
  ctx.font = F.num(size); const w = ctx.measureText(text).width;
  ctx.strokeStyle = col; ctx.lineWidth = 8; rrect(-w / 2 - 30, -size * .78, w + 60, size * 1.02, 12); ctx.stroke();
  ctx.fillStyle = col; ctx.textAlign = 'center'; ctx.fillText(text, 0, size * .06); ctx.restore();
}
function counterText(v, dec, sep = '.') {
  const s = v.toFixed(dec).split('.'); s[0] = s[0].replace(/\B(?=(\d{3})+(?!\d))/g, sep); return s.join(',');
}

// ---------- harita ----------
const GEO_IDX = {}; if (typeof GEO !== 'undefined') for (const c of GEO) GEO_IDX[c.n] = c;
function camAt(keys, t) {
  if (t <= keys[0][0]) return keys[0].slice(1);
  for (let i = 0; i < keys.length - 1; i++) { const a = keys[i], b = keys[i + 1]; if (t <= b[0]) { const k = ease(ramp(t, a[0], b[0]));
    return [lerp(a[1], b[1], k), lerp(a[2], b[2], k), Math.exp(lerp(Math.log(a[3]), Math.log(b[3]), k))]; } }
  return keys[keys.length - 1].slice(1);
}
function proj(cam, lon, lat) { const [clon, clat, k] = cam; const c = Math.cos(clat * Math.PI / 180);
  let dl = lon - clon; if (dl > 180) dl -= 360; if (dl < -180) dl += 360; return [W / 2 + dl * k * c, 880 - (lat - clat) * k]; }
function drawMap(cam, hl = {}) {
  ctx.save();
  ctx.fillStyle = '#0e1418'; ctx.fillRect(0, 0, W, H); // deniz
  // enlem/boylam ızgarası
  ctx.strokeStyle = 'rgba(160,190,200,.06)'; ctx.lineWidth = 1;
  for (let lo = -180; lo <= 180; lo += 15) { const a = proj(cam, lo, 80), b = proj(cam, lo, -80); ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); ctx.stroke(); }
  for (let la = -75; la <= 75; la += 15) { const a = proj(cam, cam[0] - 179, la), b = proj(cam, cam[0] + 179, la); ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); ctx.stroke(); }
  for (const c of GEO) {
    const h = hl[c.n];
    ctx.fillStyle = h ? h : '#2a2620'; ctx.strokeStyle = h ? 'rgba(255,230,180,.5)' : 'rgba(255,240,220,.12)'; ctx.lineWidth = h ? 2 : 1;
    for (const p of c.p) {
      ctx.beginPath(); let prev = null, ok = true;
      for (let i = 0; i < p.length; i += 2) {
        const q = proj(cam, p[i], p[i + 1]);
        if (prev && Math.abs(q[0] - prev[0]) > W * .8) { ok = false; break; }
        i ? ctx.lineTo(q[0], q[1]) : ctx.moveTo(q[0], q[1]); prev = q;
      }
      if (!ok) continue; ctx.closePath(); ctx.fill(); ctx.stroke();
    }
  }
  ctx.restore();
}
function slerp(a, b, k) { // büyük daire
  const r = Math.PI / 180; const v = ([lo, la]) => [Math.cos(la * r) * Math.cos(lo * r), Math.cos(la * r) * Math.sin(lo * r), Math.sin(la * r)];
  const A = v(a), B = v(b); const d = Math.acos(clamp(A[0] * B[0] + A[1] * B[1] + A[2] * B[2], -1, 1)); if (d < 1e-6) return a;
  const s1 = Math.sin((1 - k) * d) / Math.sin(d), s2 = Math.sin(k * d) / Math.sin(d);
  const x = A[0] * s1 + B[0] * s2, y = A[1] * s1 + B[1] * s2, z = A[2] * s1 + B[2] * s2;
  return [Math.atan2(y, x) / r, Math.atan2(z, Math.hypot(x, y)) / r];
}
function route(cam, a, b, k, col = T.acc) {
  if (k <= 0) return; ctx.save(); ctx.strokeStyle = col; ctx.lineWidth = 5; ctx.setLineDash([16, 12]); ctx.shadowColor = col; ctx.shadowBlur = 16;
  ctx.beginPath(); let last; const n = 80;
  for (let i = 0; i <= n * k; i++) { const ll = slerp(a, b, i / n); const q = proj(cam, ll[0], ll[1]); i ? ctx.lineTo(q[0], q[1]) : ctx.moveTo(q[0], q[1]); last = q; }
  ctx.stroke(); ctx.setLineDash([]);
  if (k < 1 && last) { ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(last[0], last[1], 9, 0, Math.PI * 2); ctx.fill(); }
  ctx.restore();
}
function pin(cam, lon, lat, label, a, t, below = false) {
  if (a <= 0) return; const [x, y] = proj(cam, lon, lat);
  ctx.save(); ctx.globalAlpha = a;
  const pr = 14 + ((t * 1.2) % 1) * 40; ctx.strokeStyle = `rgba(217,164,65,${1 - ((t * 1.2) % 1)})`; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(x, y, pr, 0, Math.PI * 2); ctx.stroke();
  ctx.fillStyle = T.acc; ctx.beginPath(); ctx.arc(x, y, 12, 0, Math.PI * 2); ctx.fill(); ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(x, y, 5, 0, Math.PI * 2); ctx.fill();
  if (label) { ctx.font = F.body(34, 700); const w = ctx.measureText(label).width; const ly = below ? y + 64 : y - 34;
    ctx.fillStyle = 'rgba(10,8,6,.8)'; rrect(x - w / 2 - 16, ly - 38, w + 32, 52, 10); ctx.fill();
    ctx.fillStyle = T.ink; ctx.textAlign = 'center'; ctx.fillText(label, x, ly); }
  ctx.restore();
}

// ---------- sahne tipleri ----------
const DRAW = {};
DRAW.hook = (sc, t) => {
  background(.6); const z = 1 + t * .02;
  ctx.save(); ctx.translate(W / 2, 1100); ctx.scale(z, z); ctx.translate(-W / 2, -1100);
  crowd(t, 700); spotlight(W / 2, .9 + Math.sin(t * 2) * .05); platform();
  drawFigure(W / 2, 1400, .92, poseAt(sc.pose || [[0, 'setup']], t), { back: sc.back });
  ctx.restore();
};
DRAW.title = (sc, t) => {
  background(.5);
  const a = easeOut(ramp(t, .1, 1)); ctx.save(); ctx.textAlign = 'center';
  ctx.globalAlpha = a; ctx.fillStyle = T.acc; ctx.fillRect(W / 2 - 200 * a, 760, 400 * a, 3); ctx.fillRect(W / 2 - 200 * a, 1150, 400 * a, 3);
  ctx.fillStyle = T.ink; ctx.font = F.title(128); ctx.fillText('EFSANENİN', W / 2, 900 + (1 - a) * 30); ctx.fillText('HİKÂYESİ', W / 2, 1040 + (1 - a) * 30);
  ctx.globalAlpha = easeOut(ramp(t, .7, 1.5)); ctx.fillStyle = T.acc; ctx.font = F.num(64); spaced(`BÖLÜM ${EP.meta.no}`, W / 2, 1240, 14);
  ctx.globalAlpha = easeOut(ramp(t, 1.0, 1.8)) * .8; ctx.fillStyle = T.dim; ctx.font = F.body(30, 600); spaced(EP.meta.sport.toUpperCase(), W / 2, 1310, 8);
  ctx.restore();
};
DRAW.map = (sc, t) => {
  const cam = camAt(sc.cam, t); drawMap(cam, sc.hl || {});
  for (const r of sc.routes || []) route(cam, r.a, r.b, ease(ramp(t, r.t0, r.t1)), r.col);
  for (const p of sc.pins || []) pin(cam, p.lon, p.lat, p.label, ramp(t, p.t, p.t + .5) * (p.t1 ? 1 - ramp(t, p.t1, p.t1 + .4) : 1), t, p.below);
  const g = ctx.createLinearGradient(0, 0, 0, 480); g.addColorStop(0, 'rgba(12,10,8,.95)'); g.addColorStop(1, 'rgba(12,10,8,0)'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, 480);
};
DRAW.gym = (sc, t) => {
  background(.4);
  // pencere ışığı
  ctx.save(); ctx.globalCompositeOperation = 'lighter';
  for (let i = 0; i < 3; i++) { const x = 150 + i * 120; const g = ctx.createLinearGradient(x, 480, x + 420, 1400); g.addColorStop(0, 'rgba(255,220,160,.10)'); g.addColorStop(1, 'rgba(255,220,160,0)');
    ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(x, 480); ctx.lineTo(x + 70, 480); ctx.lineTo(x + 520, 1400); ctx.lineTo(x + 400, 1400); ctx.fill(); }
  ctx.restore();
    ctx.fillStyle = '#2b2016'; ctx.fillRect(0, 1340, W, 200);
  const cyc = (t % 4.2), tr = [[0, 'setup'], [1.1, 'pull'], [1.5, 'catch'], [2.2, 'rack'], [2.6, 'dip'], [2.85, 'split'], [3.4, 'over'], [4.0, 'over']];
  drawFigure(W / 2, 1360, .62, poseAt(tr, cyc), { singlet: '#4a4440', barHalf: 300, plateR: 60, plates: [[0, 60, '#3a3632'], [30, 52, '#3a3632']] });
  if (sc.big) { const a = easeOut(ramp(t, sc.big.t, sc.big.t + .6)); ctx.save(); ctx.globalAlpha = a; ctx.textAlign = 'center';
    ctx.fillStyle = T.acc; ctx.font = F.num(260); ctx.fillText(sc.big.v, W / 2, 760 + (1 - a) * 40);
    ctx.fillStyle = T.ink; ctx.font = F.body(34, 700); spaced(sc.big.l, W / 2, 830, 5); ctx.restore(); }
};
DRAW.board = (sc, t) => { // kalkış panosu + damga
  background(.4);
  const x0 = 110, y0 = 640, w = 860, bh = 140 + sc.rows.length * 120;
  ctx.fillStyle = '#16130f'; rrect(x0, y0, w, bh, 20); ctx.fill(); ctx.strokeStyle = 'rgba(255,230,190,.15)'; ctx.lineWidth = 2; ctx.stroke();
  ctx.fillStyle = T.acc; ctx.font = F.body(28, 700); ctx.textAlign = 'left'; spaced('KALKIŞ · DEPARTURES', x0 + 40, y0 + 70, 4, 'left');
  sc.rows.forEach((r, i) => { const y = y0 + 170 + i * 120; const a = ramp(t, .3 + i * .25, .6 + i * .25);
    ctx.globalAlpha = a; ctx.fillStyle = '#221d17'; rrect(x0 + 30, y - 70, w - 60, 96, 10); ctx.fill();
    ctx.fillStyle = r.hi ? T.ink : T.dim; ctx.font = F.num(64); ctx.fillText(r.city, x0 + 60, y);
    ctx.textAlign = 'right'; ctx.fillStyle = r.hi ? T.acc : T.dim; ctx.fillText(r.year, x0 + w - 60, y); ctx.textAlign = 'left'; ctx.globalAlpha = 1; });
  stamp(sc.stamp, W / 2, y0 + bh + 150, -.12, ramp(t, sc.stampT, sc.stampT + 1), T.red, 150);
};
DRAW.idcard = (sc, t) => {
  background(.4);
  const x0 = 130, y0 = 560, w = 820, h = 560, a = easeOut(ramp(t, 0, .7));
  ctx.save(); ctx.translate(W / 2, y0 + h / 2); ctx.rotate(-.03 + (1 - a) * .1); ctx.translate(-W / 2, -(y0 + h / 2)); ctx.globalAlpha = a;
  ctx.fillStyle = '#e8dcc3'; rrect(x0, y0, w, h, 18); ctx.fill();
  ctx.fillStyle = '#c9b892'; ctx.fillRect(x0, y0, w, 90); ctx.fillStyle = '#3d3326'; ctx.font = F.body(30, 800); ctx.textAlign = 'left'; spaced('KİMLİK KARTI', x0 + 40, y0 + 58, 6, 'left');
  ctx.fillStyle = '#b9a988'; rrect(x0 + 40, y0 + 130, 220, 280, 10); ctx.fill();
  ctx.fillStyle = '#8f8064'; ctx.beginPath(); ctx.arc(x0 + 150, y0 + 240, 60, 0, Math.PI * 2); ctx.fill(); rrect(x0 + 70, y0 + 310, 160, 100, 40); ctx.fill();
  ctx.fillStyle = '#6b5e48'; ctx.font = F.body(24, 700); ctx.fillText('ADI SOYADI', x0 + 300, y0 + 160);
  ctx.fillStyle = '#2a2219'; ctx.font = F.body(48, 700);
  const n1 = [...sc.old]; const v1 = Math.floor(clamp((t - .6) * 22, 0, n1.length)); ctx.fillText(n1.slice(0, v1).join(''), x0 + 300, y0 + 225);
  const sk = ramp(t, sc.strikeT, sc.strikeT + .5); if (sk > 0) { const ww = ctx.measureText(sc.old).width; ctx.strokeStyle = T.red; ctx.lineWidth = 7; ctx.beginPath(); ctx.moveTo(x0 + 292, y0 + 210); ctx.lineTo(x0 + 292 + (ww + 16) * sk, y0 + 206); ctx.stroke(); }
  ctx.fillStyle = '#6b5e48'; ctx.font = F.body(24, 700); ctx.fillText('DOĞUM', x0 + 300, y0 + 300); ctx.fillStyle = '#2a2219'; ctx.font = F.body(36, 600); ctx.fillText(sc.dob, x0 + 300, y0 + 348);
  ctx.restore();
  stamp(sc.neu, W / 2, y0 + h - 70, -.06, ramp(t, sc.newT, sc.newT + 1), T.red, 96);
};
DRAW.reveal = (sc, t) => {
  background(.7); spotlight(W / 2, .5);
  ctx.save(); ctx.globalAlpha = .35; drawFigure(W / 2, 1500, .9, poseAt([[0, 'over']], 0), { glow: 1.2 }); ctx.restore();
  const g = ctx.createLinearGradient(0, 600, 0, 1300); g.addColorStop(0, 'rgba(12,10,8,0)'); g.addColorStop(.5, 'rgba(12,10,8,.6)'); g.addColorStop(1, 'rgba(12,10,8,0)'); ctx.fillStyle = g; ctx.fillRect(0, 600, W, 700);
  ctx.save(); ctx.textAlign = 'center';
  sc.lines.forEach((ln, i) => { const a = easeOut(ramp(t, .2 + i * .35, .9 + i * .35)); ctx.globalAlpha = a; ctx.fillStyle = T.ink; ctx.font = F.title(ln[1]); ctx.fillText(ln[0], W / 2, ln[2] + (1 - a) * 30); });
  const a = easeOut(ramp(t, 1.4, 2.2)); ctx.globalAlpha = a; ctx.fillStyle = T.acc; ctx.font = F.titleI(70); ctx.fillText(sc.nick, W / 2, 1130);
  ctx.restore();
};
DRAW.counter = (sc, t) => {
  background(.5);
  const k = easeOut(ramp(t, sc.t0, sc.t1)); const v = sc.from + (sc.to - sc.from) * k;
  ctx.save(); ctx.textAlign = 'center'; ctx.fillStyle = T.acc; ctx.font = F.num(sc.size || 230);
  ctx.shadowColor = 'rgba(217,164,65,.5)'; ctx.shadowBlur = 40 * k;
  ctx.fillText((sc.pre || '') + counterText(v, sc.dec || 0) + (k >= 1 ? (sc.post || '') : ''), W / 2, 1000);
  ctx.shadowBlur = 0; ctx.fillStyle = T.ink; ctx.font = F.body(36, 700); ctx.globalAlpha = ramp(t, sc.t1 - .3, sc.t1 + .3); spaced(sc.label, W / 2, 1090, 6);
  ctx.restore();
};
// kaldırış sahnesi: figür + skor tablosu + büyük sayı
DRAW.lift = (sc, t) => {
  background(.6);
  const roar = sc.roar ? clamp(ramp(t, sc.roar[0], sc.roar[0] + .5) * (1 - ramp(t, sc.roar[1], sc.roar[1] + 1.5))) : 0;
  const z = 1 + (sc.zoom ? sc.zoom * ease(ramp(t, sc.zoomT[0], sc.zoomT[1])) : 0);
  ctx.save(); ctx.translate(W / 2, 1150); ctx.scale(z, z); ctx.translate(-W / 2, -1150);
  crowd(t, 820, sc.flag || T.red, roar); spotlight(W / 2, 1); platform(1360);
  let barY = null, sag = 0; const P = poseAt(sc.pose, t);
  if (sc.drop && t > sc.drop[0]) { // bar düşer
    const k = ramp(t, sc.drop[0], sc.drop[0] + .45); const b = Math.abs(Math.sin(clamp((t - sc.drop[0] - .45) * 9, 0, Math.PI))) * 30 * (1 - ramp(t, sc.drop[0] + .45, sc.drop[0] + 1.2));
    barY = lerp(sc.drop[1], -92, k * k) - b; }
  if (P.bar !== null && t > (sc.whip || [99])[0] && t < (sc.whip || [0, 0])[1]) sag = 14;
  drawFigure(W / 2, 1430, .88, P, { back: sc.back, sag, bar: barY === null });
  if (barY !== null) { ctx.save(); ctx.translate(W / 2, 1430); ctx.scale(.88, .88); drawBar(barY, 450, 92, 0); ctx.restore(); }
  ctx.restore();
  // deneme tablosu
  if (sc.attempts) {
    const x0 = 60, y0 = 430; ctx.save();
    sc.attempts.forEach((g, gi) => {
      const gy = y0 + gi * 150; const ga = ramp(t, g.t, g.t + .4) * (sc.attemptsOut ? 1 - ramp(t, sc.attemptsOut, sc.attemptsOut + .4) : 1); if (ga <= 0) return; ctx.globalAlpha = ga;
      ctx.fillStyle = T.dim; ctx.font = F.body(24, 700); ctx.textAlign = 'left'; spaced(g.name, x0, gy, 4, 'left');
      g.items.forEach((it, i) => { const a = ramp(t, it[0], it[0] + .35); if (a <= 0) return; ctx.globalAlpha = a * ga; const x = x0 + i * 200, y = gy + 20;
        ctx.fillStyle = it[2] === 'x' ? 'rgba(192,57,43,.25)' : it[2] === 'wr' ? 'rgba(217,164,65,.22)' : 'rgba(255,255,255,.08)'; rrect(x, y, 186, 86, 10); ctx.fill();
        ctx.fillStyle = it[2] === 'x' ? '#e06456' : T.ink; ctx.font = F.num(58); ctx.textAlign = 'center'; ctx.fillText(it[1], x + 93, y + 62);
        if (it[2] === 'wr') { ctx.fillStyle = T.acc; ctx.font = F.body(18, 800); ctx.fillText('DÜNYA REKORU', x + 93, y + 108); }
        if (it[2] === 'x') { ctx.strokeStyle = '#e06456'; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(x + 20, y + 18); ctx.lineTo(x + 166, y + 68); ctx.stroke(); }
        ctx.textAlign = 'left'; });
      ctx.globalAlpha = 1;
    });
    ctx.restore();
  }
  if (sc.big) for (const b of sc.big) { const a = easeOut(ramp(t, b.t, b.t + .5)) * (1 - ramp(t, b.t1 - .4, b.t1)); if (a <= 0) continue;
    ctx.save(); ctx.globalAlpha = a; ctx.textAlign = 'center'; const s = 1 + (1 - a) * .3;
    ctx.translate(W / 2, b.y || 760); ctx.scale(s, s); ctx.fillStyle = b.col || T.acc; ctx.shadowColor = 'rgba(0,0,0,.8)'; ctx.shadowBlur = 30; ctx.font = F.num(b.size || 210); ctx.fillText(b.v, 0, 0);
    if (b.l) { ctx.fillStyle = T.ink; ctx.font = F.body(32, 800); spaced(b.l, 0, 64, 5); } ctx.restore(); }
  if (sc.xs) sc.xs.forEach((xt, i) => { const a = easeOut(ramp(t, xt, xt + .3)); if (a <= 0) return; ctx.save(); ctx.globalAlpha = a; const x = W / 2 + (i - 1) * 190, y = sc.xsY || 620, s = 70 * (1.6 - .6 * a);
    ctx.strokeStyle = '#e06456'; ctx.lineWidth = 16; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(x - s / 2, y - s / 2); ctx.lineTo(x + s / 2, y + s / 2); ctx.moveTo(x + s / 2, y - s / 2); ctx.lineTo(x - s / 2, y + s / 2); ctx.stroke(); ctx.restore(); });
};
DRAW.medals = (sc, t) => {
  background(.6); spotlight(W / 2, .5, 400);
  sc.items.forEach((m, i) => { const a = easeOut(ramp(t, m.t, m.t + .6)); medal(W / 2 + (i - (sc.items.length - 1) / 2) * 280, 980 - (1 - a) * 60, 110, a, m.y);
    ctx.save(); ctx.globalAlpha = a; ctx.fillStyle = T.ink; ctx.font = F.body(30, 700); ctx.textAlign = 'center'; ctx.fillText(m.city, W / 2 + (i - (sc.items.length - 1) / 2) * 280, 1160); ctx.restore(); });
};
DRAW.duel = (sc, t) => {
  background(.5);
  const cols = [[sc.a, T.red], [sc.b, T.blue]];
  cols.forEach(([p, col], i) => { const x = 70 + i * 480, a = easeOut(ramp(t, .2 + i * .2, .8 + i * .2)); ctx.save(); ctx.globalAlpha = a;
    ctx.fillStyle = '#17130f'; rrect(x, 430, 460, 170, 16); ctx.fill(); ctx.fillStyle = col; ctx.fillRect(x, 430, 10, 170);
    ctx.fillStyle = T.ink; ctx.font = F.num(64); ctx.textAlign = 'left'; ctx.fillText(p.name, x + 36, 515); ctx.fillStyle = T.dim; ctx.font = F.body(26, 700); spaced(p.nat, x + 36, 565, 4, 'left'); ctx.restore(); });
  ctx.save(); ctx.fillStyle = T.dim; ctx.font = F.body(24, 700); ctx.textAlign = 'center'; ctx.globalAlpha = ramp(t, 1, 1.5); spaced('SİLKME', W / 2, 670, 6); ctx.restore();
  sc.rows.forEach((r, i) => { const a = easeOut(ramp(t, r.t, r.t + .4)); if (a <= 0) return; const y = 700 + i * 120, col = r.who === 'a' ? T.red : T.blue;
    ctx.save(); ctx.globalAlpha = a; ctx.translate((1 - a) * (r.who === 'a' ? -60 : 60), 0);
    ctx.fillStyle = '#17130f'; rrect(70, y, 940, 100, 14); ctx.fill(); ctx.fillStyle = col; ctx.fillRect(70, y, 10, 100);
    ctx.fillStyle = T.ink; ctx.font = F.body(34, 700); ctx.textAlign = 'left'; ctx.fillText(r.who === 'a' ? sc.a.short : sc.b.short, 110, y + 63);
    ctx.font = F.num(72); ctx.textAlign = 'right'; ctx.fillStyle = r.res === 'x' ? '#e06456' : T.ink; ctx.fillText(r.kg + ' KG', 760, y + 76);
    ctx.font = F.body(22, 800); ctx.fillStyle = r.res === 'wr' ? T.acc : r.res === 'x' ? '#e06456' : T.dim; ctx.fillText(r.res === 'wr' ? 'DÜNYA REKORU' : r.res === 'x' ? 'BAŞARISIZ' : 'GEÇERLİ', 985, y + 62);
    ctx.restore(); });
  if (sc.total) { const a = easeOut(ramp(t, sc.total.t, sc.total.t + .6)); ctx.save(); ctx.globalAlpha = a; ctx.textAlign = 'center';
    ctx.fillStyle = T.dim; ctx.font = F.body(26, 700); spaced('TOPLAM', W / 2, 1230, 6);
    ctx.font = F.num(120); ctx.fillStyle = T.red; ctx.fillText(sc.total.a, W / 2 - 230, 1350); ctx.fillStyle = T.dim; ctx.fillText('–', W / 2, 1350); ctx.fillStyle = '#6f95c9'; ctx.fillText(sc.total.b, W / 2 + 230, 1350);
    ctx.restore(); }
  if (sc.medals) { const a = easeOut(ramp(t, sc.medals.t, sc.medals.t + .6)); ctx.save(); ctx.fillStyle = `rgba(12,10,8,${.97 * a})`; ctx.fillRect(0, 380, W, 1060); ctx.restore();
    for (let i = 0; i < 3; i++) { const b = easeOut(ramp(t, sc.medals.t + i * .3, sc.medals.t + .6 + i * .3)); medal(W / 2 + (i - 1) * 270, 900 - (1 - b) * 60, 105, b, sc.medals.y[i]);
      ctx.save(); ctx.globalAlpha = b; ctx.fillStyle = T.ink; ctx.font = F.body(28, 700); ctx.textAlign = 'center'; ctx.fillText(sc.medals.c[i], W / 2 + (i - 1) * 270, 1070); ctx.restore(); } }
};
DRAW.memorial = (sc, t) => {
  background(.35); const dim = 1 - .45 * ramp(t, 0, sc.dur);
  spotlight(W / 2, .8 * dim, 420); platform(1330);
  ctx.save(); ctx.translate(W / 2, 1420); ctx.scale(.88, .88); drawBar(-92, 450, 92, 0); ctx.restore();
  for (const it of sc.items || []) { const a = easeOut(ramp(t, it.t, it.t + .7)) * (it.t1 ? 1 - ramp(t, it.t1 - .5, it.t1) : 1); if (a <= 0) continue;
    ctx.save(); ctx.globalAlpha = a;
    if (it.kind === 'sign') { const w = 760, x = W / 2 - w / 2, y = 600; ctx.fillStyle = '#1f4e9a'; rrect(x, y, w, 210, 16); ctx.fill(); ctx.strokeStyle = '#fff'; ctx.lineWidth = 6; rrect(x + 14, y + 14, w - 28, 182, 10); ctx.stroke();
      ctx.fillStyle = '#fff'; ctx.font = F.body(58, 800); ctx.textAlign = 'center'; ctx.fillText(it.l1, W / 2, y + 100); ctx.font = F.body(40, 700); ctx.fillText(it.l2, W / 2, y + 160);
      ctx.fillStyle = '#6b6b6b'; ctx.fillRect(W / 2 - 10, y + 210, 20, 330); }
    if (it.kind === 'order') { medal(W / 2, 820, 120, a, ''); ctx.fillStyle = T.ink; ctx.font = F.body(30, 700); ctx.textAlign = 'center'; spaced(it.l, W / 2, 1010, 5); }
    if (it.kind === 'years') { ctx.fillStyle = T.ink; ctx.font = F.title(110); ctx.textAlign = 'center'; ctx.fillText(it.l, W / 2, 880); ctx.fillStyle = T.acc; ctx.fillRect(W / 2 - 60, 930, 120, 3); }
    if (it.kind === 'film') { const x = 260, y = 640, w = 560, h = 300; ctx.fillStyle = '#111'; rrect(x, y, w, h, 12); ctx.fill(); ctx.fillStyle = '#333';
      for (let i = 0; i < 9; i++) { rrect(x + 20 + i * 60, y + 14, 34, 24, 4); ctx.fill(); rrect(x + 20 + i * 60, y + h - 38, 34, 24, 4); ctx.fill(); }
      ctx.fillStyle = T.ink; ctx.font = F.titleI(54); ctx.textAlign = 'center'; ctx.fillText(it.l1, W / 2, y + 160); ctx.fillStyle = T.dim; ctx.font = F.body(28, 700); ctx.fillText(it.l2, W / 2, y + 215); }
    ctx.restore(); }
};
DRAW.outro = (sc, t) => {
  background(.6);
  ctx.save(); ctx.textAlign = 'center';
  let a = easeOut(ramp(t, .1, .7)); ctx.globalAlpha = a; ctx.fillStyle = T.ink; ctx.font = F.title(74); ctx.fillText(sc.who, W / 2, 330); ctx.fillStyle = T.dim; ctx.font = F.body(30, 600); spaced(sc.years, W / 2, 390, 6);
  sc.stats.forEach((s, i) => { const x = W / 2 + (i % 2 ? 240 : -240), y = 560 + Math.floor(i / 2) * 300; const b = easeOut(ramp(t, .4 + i * .25, 1.2 + i * .25)); ctx.globalAlpha = b;
    ctx.fillStyle = '#17130f'; rrect(x - 220, y, 440, 260, 18); ctx.fill();
    const v = s.dec ? counterText(s.v * b, s.dec) : Math.round(s.v * b); ctx.fillStyle = T.acc; ctx.font = F.num(150); ctx.fillText(v + (s.suf || ''), x, y + 160);
    ctx.fillStyle = T.ink; ctx.font = F.body(26, 700); spaced(s.l, x, y + 215, 3); });
  a = easeOut(ramp(t, 2.6, 3.4)); ctx.globalAlpha = a; ctx.fillStyle = T.ink; ctx.font = F.title(58); ctx.fillText('Sıradaki efsane', W / 2, 1270); ctx.fillText('kim olsun?', W / 2, 1345);
  ctx.fillStyle = T.acc; ctx.font = F.body(38, 700); ctx.fillText('Yorumlara yaz', W / 2, 1430);
  ctx.strokeStyle = T.acc; ctx.lineWidth = 7; ctx.lineCap = 'round'; const by = 1475 + Math.sin(t * 5) * 10; ctx.beginPath(); ctx.moveTo(W / 2, by); ctx.lineTo(W / 2, by + 70); ctx.moveTo(W / 2 - 26, by + 44); ctx.lineTo(W / 2, by + 72); ctx.lineTo(W / 2 + 26, by + 44); ctx.stroke();
  ctx.globalAlpha = ramp(t, 3, 3.8) * .9; ctx.fillStyle = T.dim; ctx.font = F.body(26, 700); spaced('DEMIRALPGOALS · EFSANENİN HİKÂYESİ', W / 2, 1770, 6);
  ctx.restore();
};

// ---------- ana giriş ----------
function sceneList() { return EP.scenes.map(s => ({ name: s.name, dur: s.dur })); }
function audioEvents() {
  let t = 0; const out = { scenes: [], total: 0 };
  for (const s of EP.scenes) { out.scenes.push({ name: s.name, start: t, dur: s.dur, mood: s.mood || 'warm', duck: s.duck || [], sfx: (s.sfx || []).map(([tt, k]) => [t + tt, k]) }); t += s.dur; }
  out.total = t; return out;
}
function renderScene(name, t, frame) {
  const sc = EP.scenes.find(s => s.name === name);
  ctx.save(); ctx.clearRect(0, 0, W, H);
  DRAW[sc.type](sc, t);
  header(sc, t); if (sc.type !== 'title' && sc.type !== 'outro') seriesTag(); subs(sc, t);
  post(frame || Math.floor(t * 30));
  const fi = sc.fadeIn ?? .35, fo = sc.fadeOut ?? .3;
  const a = Math.min(fi ? ramp(t, 0, fi) : 1, fo ? 1 - ramp(t, sc.dur - fo, sc.dur) : 1);
  if (a < 1) { ctx.fillStyle = `rgba(0,0,0,${1 - a})`; ctx.fillRect(0, 0, W, H); }
  if (sc.flash) for (const ft of sc.flash) { const k = 1 - ramp(t, ft, ft + .35); if (t >= ft && k > 0) { ctx.fillStyle = `rgba(255,240,215,${k * .7})`; ctx.fillRect(0, 0, W, H); } }
  ctx.restore();
  return cv.toDataURL('image/jpeg', 0.9);
}
