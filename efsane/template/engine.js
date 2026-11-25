// Efsanenin Hikâyesi — belgesel sahne motoru (1080x1920, canvas 2D)
// Bölüm verisi: episodes/<slug>.js içinde EP = { meta, theme, scenes:[...] }
const W = 1080, H = 1920;
const cv = document.getElementById('c');
var ctx = cv.getContext('2d');

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
  await document.fonts.ready; await loadSprites();
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

// ---------- sporcu figürü (ARKADAN, anatomik siluet) ----------
// İskelet birimi: piksel, s=1'de 1,47 m = 600 px (408 px/m). Pozlar sağ yarım (x>0); sol aynalanır, L/R ayrı verilebilir.
// Vücut: EP.body = { h: boy(m), sh: omuz genişliği çarpanı, th: kas kalınlığı, torso: gövde uzunluğu, head: kafa ölçeği,
//   neck, traps, skin, skinD, hair: 'short'|'curly'|'long'|'bald', hairCol, singlet }
const POSES = {
  stand: { foot: [62, 0], knee: [56, -160], hip: [46, -300], sh: [80, -478], el: [96, -362], ha: [100, -254], head: [0, -545], bar: null },
  setup: { foot: [72, 0], knee: [98, -112], hip: [56, -175], sh: [72, -330], el: [104, -210], ha: [112, -96], head: [0, -385], bar: -96 },
  pull: { foot: [64, 0], knee: [60, -150], hip: [48, -285], sh: [80, -462], el: [104, -372], ha: [112, -282], head: [0, -527], bar: -282 },
  catch: { foot: [78, 0], knee: [112, -122], hip: [60, -165], sh: [84, -352], el: [140, -312], ha: [104, -372], head: [0, -410], bar: -372 },
  rack: { foot: [62, 0], knee: [56, -160], hip: [46, -300], sh: [80, -478], el: [136, -440], ha: [102, -498], head: [0, -545], bar: -498 },
  dip: { foot: [62, 0], knee: [64, -138], hip: [46, -268], sh: [80, -446], el: [136, -408], ha: [102, -466], head: [0, -513], bar: -466 },
  split: { R: { foot: [56, -22], knee: [70, -150], hip: [46, -258], sh: [82, -436], el: [116, -562], ha: [140, -682] },
           L: { foot: [-48, 14], knee: [-44, -100], hip: [-46, -258], sh: [-82, -436], el: [-116, -562], ha: [-140, -682] }, head: [0, -500], bar: -682 },
  over: { foot: [64, 0], knee: [58, -160], hip: [46, -300], sh: [80, -478], el: [118, -600], ha: [140, -722], head: [0, -545], bar: -722 },
  snatch: { foot: [80, 0], knee: [112, -118], hip: [60, -168], sh: [84, -352], el: [170, -470], ha: [236, -560], head: [0, -410], bar: -560 },
  slump: { foot: [62, 0], knee: [58, -156], hip: [46, -294], sh: [74, -458], el: [86, -346], ha: [90, -240], head: [0, -508], bar: null },
  chalk: { foot: [62, 0], knee: [56, -160], hip: [46, -300], sh: [80, -478], el: [60, -380], ha: [8, -330], head: [0, -540], bar: null },
  arms: { foot: [66, 0], knee: [58, -160], hip: [46, -300], sh: [82, -480], el: [150, -580], ha: [190, -700], head: [0, -548], bar: null },
  // sarılma: R kolu yanındakinin sırtından omzuna
  hugR: { R: { foot: [62, 0], knee: [56, -160], hip: [46, -300], sh: [80, -478], el: [150, -420], ha: [235, -470] },
          L: { foot: [-62, 0], knee: [-56, -160], hip: [-46, -300], sh: [-80, -478], el: [-96, -362], ha: [-100, -254] }, head: [10, -540], bar: null },
  hugL: { L: { foot: [-62, 0], knee: [-56, -160], hip: [-46, -300], sh: [-80, -478], el: [-150, -420], ha: [-235, -470] },
          R: { foot: [62, 0], knee: [56, -160], hip: [46, -300], sh: [80, -478], el: [96, -362], ha: [100, -254] }, head: [-10, -540], bar: null }
};
function side(p, s) {
  if (s > 0 && p.R) return p.R; if (s < 0 && p.L) return p.L;
  const r = s > 0 ? p : (p.R || p); const m = k => [-r[k][0], r[k][1]];
  if (s > 0) return r;
  return { foot: m('foot'), knee: m('knee'), hip: m('hip'), sh: m('sh'), el: m('el'), ha: m('ha') };
}
function mixP(A, B, k) {
  const o = { R: {}, L: {} };
  for (const s of [1, -1]) { const sa = side(A, s), sb = side(B, s), d = s > 0 ? o.R : o.L;
    for (const j of ['foot', 'knee', 'hip', 'sh', 'el', 'ha']) d[j] = [lerp(sa[j][0], sb[j][0], k), lerp(sa[j][1], sb[j][1], k)]; }
  o.head = [lerp(A.head[0], B.head[0], k), lerp(A.head[1], B.head[1], k)];
  const ba = A.bar ?? null, bb = B.bar ?? null;
  o.bar = ba === null && bb === null ? null : (ba === null ? (k > .5 ? bb : null) : bb === null ? (k < .5 ? ba : null) : lerp(ba, bb, k));
  return o;
}
const mixPose = (a, b, k) => mixP(POSES[a], POSES[b], k);
function poseAt(track, t) {
  if (t <= track[0][0]) return mixPose(track[0][1], track[0][1], 0);
  for (let i = 0; i < track.length - 1; i++) { const [t0, p0] = track[i], [t1, p1] = track[i + 1];
    if (t <= t1) return mixPose(p0, p1, ease(ramp(t, t0, t1))); }
  const l = track[track.length - 1][1]; return mixPose(l, l, 0);
}
// arkadan yürüyüş döngüsü (uzaklaşan)
function walkPose(ph) {
  const s = Math.sin(ph), c = Math.cos(ph); const P = mixPose('stand', 'stand', 0);
  const lift = v => Math.max(0, v);
  P.R.foot = [60, -lift(s) * 34 + 4]; P.R.knee = [58, -158 - lift(s) * 22];
  P.L.foot = [-60, -lift(-s) * 34 + 4]; P.L.knee = [-58, -158 - lift(-s) * 22];
  P.R.el = [100, -362 + c * 8]; P.R.ha = [104 + c * 6, -256 - c * 22]; P.L.el = [-100, -362 - c * 8]; P.L.ha = [-104 - c * 6, -256 + c * 22];
  const bob = Math.abs(c) * 6; for (const sd of [P.L, P.R]) for (const j of ['hip', 'sh', 'el', 'ha']) sd[j] = [sd[j][0], sd[j][1] - bob];
  P.head = [Math.sin(ph) * 3, -545 - bob]; return P;
}
// konik uzuv: a->b, yarıçap ra->rb, ortada rm şişkinlik (f oranında)
function taper(a, b, ra, rb, rm = 0, f = .4) {
  const dx = b[0] - a[0], dy = b[1] - a[1], L = Math.hypot(dx, dy) || 1, nx = -dy / L, ny = dx / L; const n = 12; const pts = [], back = [];
  for (let i = 0; i <= n; i++) { const u = i / n; let r = lerp(ra, rb, u); if (rm) r += (rm - lerp(ra, rb, f)) * Math.exp(-Math.pow((u - f) / .28, 2));
    const x = a[0] + dx * u, y = a[1] + dy * u; pts.push([x + nx * r, y + ny * r]); back.push([x - nx * r, y - ny * r]); }
  ctx.beginPath(); ctx.moveTo(pts[0][0], pts[0][1]); for (const p of pts) ctx.lineTo(p[0], p[1]);
  for (let i = back.length - 1; i >= 0; i--) ctx.lineTo(back[i][0], back[i][1]); ctx.closePath(); ctx.fill();
  ctx.beginPath(); ctx.arc(a[0], a[1], ra, 0, Math.PI * 2); ctx.fill(); ctx.beginPath(); ctx.arc(b[0], b[1], rb, 0, Math.PI * 2); ctx.fill();
}
function drawBar(y, half, plateR, sag, opt = {}) {
  ctx.save();
  const g = ctx.createLinearGradient(0, y - 6, 0, y + 6); g.addColorStop(0, '#d8d2c6'); g.addColorStop(1, '#6d675e');
  ctx.strokeStyle = g; ctx.lineWidth = 10; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(-half, y + sag); ctx.quadraticCurveTo(0, y - sag * .6, half, y + sag); ctx.stroke();
  const plates = opt.plates || [[0, plateR, '#8f1f1f'], [30, plateR, '#8f1f1f'], [60, plateR * .92, '#22488a'], [86, plateR * .74, '#d1a92a'], [106, plateR * .5, '#2b6b3a']];
  for (const sgn of [1, -1]) {
    for (const [off, r, col] of plates) { const x = sgn * (half - 160 + off);
      ctx.fillStyle = col; rrect(x - 13, y + sag - r, 26, r * 2, 9); ctx.fill();
      ctx.fillStyle = 'rgba(255,230,180,.22)'; rrect(x - 13, y + sag - r, 7, r * 2, 4); ctx.fill();
      ctx.fillStyle = 'rgba(0,0,0,.25)'; rrect(x + 6, y + sag - r, 7, r * 2, 4); ctx.fill(); }
    ctx.fillStyle = '#c9c2b4'; rrect(sgn * (half - 162) - 9, y + sag - 24, 18, 48, 4); ctx.fill();
  }
  ctx.restore();
}
const FIG = document.createElement('canvas'); FIG.width = 1400; FIG.height = 1500; const RIM = document.createElement('canvas'); RIM.width = 1400; RIM.height = 1500; const fctx = FIG.getContext('2d');
function drawFigure(x, y, s, P, opt = {}) {
  const B = Object.assign({ h: 1.47, sh: 1, th: 1, torso: 1, head: 1, neck: 1, traps: 1, skin: '#9a6444', skinD: '#3a2418', hair: 'short', hairCol: '#16100c', singlet: T.singlet },
    (typeof EP !== 'undefined' && EP.body) || {}, opt.body || {});
  const hs = B.h / 1.47; const th = B.th; const O = opt.outfit || null; const skin = B.skin, skinD = B.skinD, sing = opt.singlet || B.singlet;
  // omuz genişliği ve gövde uzunluğu uyarlaması
  const Q = { L: {}, R: {}, head: P.head, bar: P.bar };
  for (const k of ['L', 'R']) for (const j of ['foot', 'knee', 'hip', 'sh', 'el', 'ha']) Q[k][j] = P[k][j].slice();
  for (const k of ['L', 'R']) { const dx = Q[k].sh[0] * (B.sh - 1); for (const j of ['sh', 'el', 'ha']) Q[k][j][0] += dx; }
  const main = ctx; const c = fctx; c.setTransform(1, 0, 0, 1, 0, 0); c.globalAlpha = 1; c.globalCompositeOperation = 'source-over'; c.clearRect(0, 0, FIG.width, FIG.height);
  c.translate(700, 1150); // ayak noktası
  window.ctx = c; // yardımcılar ctx kullanır
  const g = (fn) => fn();
  try {
    const L = Q.L, R = Q.R;
    // bacaklar
    c.fillStyle = O ? O.pants : skin;
    for (const sd of [L, R]) { taper(sd.hip, sd.knee, 38 * th, 21 * th, 44 * th, .32); taper(sd.knee, sd.foot, 20 * th, 11 * th, 26 * th, .28); }
    if (!O) c.fillStyle = skinD; if (!O) for (const sd of [L, R]) { c.globalAlpha = .35; taper([sd.knee[0], sd.knee[1] + 30], sd.foot, 10 * th, 6, 13 * th, .25); c.globalAlpha = 1; }
    for (const sd of [L, R]) { c.fillStyle = '#e9e2d4'; rrect(sd.foot[0] - 26, sd.foot[1] - 30, 52, 20, 6); c.fill(); c.fillStyle = '#1b1612'; rrect(sd.foot[0] - 30, sd.foot[1] - 14, 60, 26, 10); c.fill(); }
    // gövde (sırt): V şekli
    const nb = [(L.sh[0] + R.sh[0]) / 2, (L.sh[1] + R.sh[1]) / 2 - 8];
    const hipY = (L.hip[1] + R.hip[1]) / 2; const tl = (hipY - nb[1]);
    const lat = 1 + (B.sh - 1) * .8;
    c.fillStyle = O ? O.top : skin; c.beginPath();
    c.moveTo(L.sh[0] - 20 * th, L.sh[1] + 4);
    c.quadraticCurveTo(L.sh[0] - 34 * th * lat, nb[1] + tl * .32, lerp(L.sh[0], L.hip[0], .55) - 8, nb[1] + tl * .62);
    c.lineTo(L.hip[0] - 30, hipY + 30); c.lineTo(R.hip[0] + 30, hipY + 30);
    c.lineTo(lerp(R.sh[0], R.hip[0], .55) + 8, nb[1] + tl * .62);
    c.quadraticCurveTo(R.sh[0] + 34 * th * lat, nb[1] + tl * .32, R.sh[0] + 20 * th, R.sh[1] + 4);
    c.closePath(); c.fill();
    // trapez
    c.beginPath(); c.moveTo(nb[0] - 20 * B.neck, nb[1] - 44); c.quadraticCurveTo(L.sh[0] * .55, L.sh[1] - 26 * B.traps, L.sh[0] - 6, L.sh[1] - 4);
    c.lineTo(R.sh[0] + 6, R.sh[1] - 4); c.quadraticCurveTo(R.sh[0] * .55, R.sh[1] - 26 * B.traps, nb[0] + 20 * B.neck, nb[1] - 44); c.closePath(); c.fill();
    if (!O) {
    // kas gölgeleri: omurga, kürek kemikleri, lat çizgileri
    c.strokeStyle = skinD; c.lineCap = 'round'; c.globalAlpha = .55; c.lineWidth = 7;
    c.beginPath(); c.moveTo(nb[0], nb[1] + 10); c.quadraticCurveTo(nb[0] + 2, nb[1] + tl * .5, nb[0], hipY); c.stroke();
    c.lineWidth = 5; for (const sgn of [-1, 1]) { const sx = sgn > 0 ? R.sh[0] : L.sh[0];
      c.beginPath(); c.moveTo(sx * .35, nb[1] + 30); c.quadraticCurveTo(sx * .62, nb[1] + tl * .22, sx * .3, nb[1] + tl * .42); c.stroke();
      c.beginPath(); c.moveTo(sx * .92, nb[1] + tl * .2); c.quadraticCurveTo(sx * .78, nb[1] + tl * .5, sx * .45, nb[1] + tl * .7); c.stroke(); }
    c.globalAlpha = 1;
    // atlet: alt sırt + askılar (halter atleti sırtı açık)
    c.fillStyle = sing; c.beginPath();
    c.moveTo(L.sh[0] * .42, nb[1] + tl * .38); c.quadraticCurveTo(nb[0], nb[1] + tl * .5, R.sh[0] * .42, nb[1] + tl * .38);
    c.lineTo(lerp(R.sh[0], R.hip[0], .55) + 10, nb[1] + tl * .62); c.lineTo(R.hip[0] + 34, hipY + 62);
    c.quadraticCurveTo(R.hip[0] + 12, R.knee[1] * .2 + hipY * .8 + 30, R.hip[0] - 4, hipY + 70);
    c.lineTo(L.hip[0] + 4, hipY + 70); c.quadraticCurveTo(L.hip[0] - 12, hipY + 60, L.hip[0] - 34, hipY + 62);
    c.lineTo(lerp(L.sh[0], L.hip[0], .55) - 10, nb[1] + tl * .62); c.closePath(); c.fill();
    c.strokeStyle = sing; c.lineWidth = 15 * th; for (const sd of [L, R]) { c.beginPath(); c.moveTo(sd.sh[0] * .52, sd.sh[1] - 8); c.quadraticCurveTo(sd.sh[0] * .5, nb[1] + tl * .2, sd.sh[0] * .42, nb[1] + tl * .4); c.stroke(); }
    // kemer
    c.fillStyle = '#2a1f17'; rrect(L.hip[0] - 34, hipY - 26, R.hip[0] - L.hip[0] + 68, 30, 6); c.fill(); c.fillStyle = '#8c7a5c'; rrect(nb[0] - 18, hipY - 24, 36, 26, 4); c.fill();
    }
    if (opt.back) { c.fillStyle = 'rgba(255,255,255,.9)'; c.font = F.num(36); c.textAlign = 'center'; c.fillText(opt.back, nb[0], nb[1] + tl * .78); }
    // boyun + kafa
    c.fillStyle = skin; taper([Q.head[0], Q.head[1] + 20], [nb[0], nb[1] - 6], 20 * B.neck, 26 * B.neck);
    const hr = 37 * B.head; c.fillStyle = skin;
    for (const sgn of [-1, 1]) { c.beginPath(); c.ellipse(Q.head[0] + sgn * hr * .98, Q.head[1] + 4, 8, 15, 0, 0, Math.PI * 2); c.fill(); } // kulaklar
    c.beginPath(); c.ellipse(Q.head[0], Q.head[1], hr * .96, hr * 1.16, 0, 0, Math.PI * 2); c.fill();
    c.fillStyle = B.hairCol; c.beginPath();
    if (B.hair === 'bald') { c.globalAlpha = .25; c.ellipse(Q.head[0], Q.head[1] - hr * .3, hr * .8, hr * .7, 0, Math.PI, 0); c.fill(); c.globalAlpha = 1; }
    else if (B.hair === 'curly') { for (let i = 0; i < 14; i++) { const a = Math.PI * (1.05 + i / 13 * .9); c.moveTo(0, 0); c.arc(Q.head[0] + Math.cos(a) * hr * .8, Q.head[1] - hr * .1 + Math.sin(a) * hr * .9, hr * .32, 0, Math.PI * 2); } c.ellipse(Q.head[0], Q.head[1] - hr * .1, hr * .98, hr * 1.05, 0, Math.PI * .98, Math.PI * 2.02); c.fill(); }
    else { c.ellipse(Q.head[0], Q.head[1] - hr * .06, hr, hr * 1.12, 0, Math.PI * .92, Math.PI * 2.08); c.quadraticCurveTo(Q.head[0], Q.head[1] + hr * (B.hair === 'long' ? 1.6 : .62), Q.head[0] - hr * .92, Q.head[1] + hr * .3); c.fill(); }
    if (B.hair !== 'bald') { c.fillStyle = 'rgba(255,230,200,.10)'; c.beginPath(); c.ellipse(Q.head[0] - hr * .25, Q.head[1] - hr * .55, hr * .45, hr * .25, -.4, 0, Math.PI * 2); c.fill(); }
    // kollar (arkadan): deltoid, üst kol, ön kol, el
    for (const sd of [L, R]) {
      c.fillStyle = O ? O.top : skin; taper(sd.sh, sd.el, 28 * th, 19 * th, 33 * th, .42); taper(sd.el, sd.ha, 19 * th, 12 * th, 23 * th, .25);
      c.beginPath(); c.arc(sd.sh[0], sd.sh[1] + 4, 31 * th, 0, Math.PI * 2); c.fill();
      c.fillStyle = skin; c.beginPath(); c.arc(sd.ha[0], sd.ha[1], 14 * th, 0, Math.PI * 2); c.fill();
      if (!O) c.fillStyle = skinD; else continue; c.globalAlpha = .35; taper([lerp(sd.sh[0], sd.el[0], .25), lerp(sd.sh[1], sd.el[1], .25)], sd.el, 9 * th, 6, 13 * th, .5); c.globalAlpha = 1;
    }
    // ışık: üstten sıcak, alttan gölge (yalnız figür üzerinde)
    c.globalCompositeOperation = 'source-atop';
    if (opt.sil) { c.fillStyle = 'rgba(10,8,6,.94)'; c.fillRect(-700, -1150, 1400, 1500); }
    const lg = c.createLinearGradient(0, -780 , 0, 40); lg.addColorStop(0, 'rgba(255,214,160,.38)'); lg.addColorStop(.45, 'rgba(255,214,160,0)'); lg.addColorStop(1, 'rgba(0,0,0,.5)');
    c.fillStyle = lg; c.fillRect(-700, -1150, 1400, 1500);
    const sg = c.createLinearGradient(-200, 0, 200, 0); sg.addColorStop(0, 'rgba(0,0,0,.28)'); sg.addColorStop(.5, 'rgba(0,0,0,0)'); sg.addColorStop(1, 'rgba(0,0,0,.28)');
    c.fillStyle = sg; c.fillRect(-700, -1150, 1400, 1500);
    c.globalCompositeOperation = 'source-over';
  } finally { window.ctx = main; }
  main.save(); main.translate(x, y); main.scale(s * hs, s * hs);
  const glow = opt.glow ?? 1;
  if (glow > 0) { main.save(); main.shadowColor = `rgba(255,190,110,${.32 * glow})`; main.shadowBlur = 22; main.drawImage(FIG, -700, -1150); main.restore(); }
  // kenar ışığı: figürün amber kopyası yukarı-sola kaydırılıp alta çizilir
  RIM.getContext('2d').clearRect(0, 0, 1400, 1500); const rc = RIM.getContext('2d'); rc.globalCompositeOperation = 'source-over'; rc.drawImage(FIG, 0, 0);
  rc.globalCompositeOperation = 'source-in'; rc.fillStyle = `rgba(255,214,150,${.85 * Math.min(1, glow + .3)})`; rc.fillRect(0, 0, 1400, 1500); rc.globalCompositeOperation = 'source-over';
  main.globalAlpha = .75; main.drawImage(RIM, -704, -1155); main.globalAlpha = 1;
  main.drawImage(FIG, -700, -1150);
  const by = opt.barY ?? Q.bar;
  if (by !== null && by !== undefined && opt.bar !== false) { main.scale(1 / hs, 1 / hs); drawBar(by * hs, opt.barHalf || 450, opt.plateR || 92, opt.sag || 0, opt); }
  main.restore();
  return Q;
}

// ---------- illüstrasyon pozları (kullanıcının ürettiği, yeşil zeminden ayrılmış PNG'ler) ----------
// EP.sprites = { ad: { src: 'assets/naim/p3.png', s: ölçek (sahne 1 m ≈ 335 px olacak şekilde) } }
const IMG = {};
function loadSprites() {
  const S = (typeof EP !== 'undefined' && EP.sprites) || {};
  return Promise.all(Object.entries(S).map(([k, v]) => new Promise(res => { const im = new Image(); im.onload = () => { IMG[k] = im; res(); }; im.onerror = res; im.src = v.src; })));
}
function spriteTrack(track, t, fade = .16) {
  let i = 0; for (let j = 0; j < track.length; j++) if (t >= track[j][0]) i = j;
  const cur = track[i], nxt = track[i + 1]; const out = [];
  const k = ramp(t, cur[0], cur[0] + fade);
  if (i > 0 && k < 1) out.push([track[i - 1][1], 1 - k, 0]);
  out.push([cur[1], i > 0 ? k : 1, t - cur[0]]);
  return out;
}
function drawSprite(name, x, footY, scale, opt = {}) {
  const im = IMG[name]; if (!im) return; const meta = EP.sprites[name]; const s = scale * (meta.s || 1) * (opt.mul || 1);
  const c = fctx; c.setTransform(1, 0, 0, 1, 0, 0); c.globalAlpha = 1; c.globalCompositeOperation = 'source-over'; c.clearRect(0, 0, FIG.width, FIG.height);
  const w = im.width, h = im.height, ox = 700 - w / 2, oy = 1480 - h; c.drawImage(im, ox, oy);
  if (opt.grade === 'sad') { c.globalCompositeOperation = 'saturation'; c.fillStyle = 'rgba(128,128,128,.55)'; c.fillRect(0, 0, 1400, 1500); c.globalCompositeOperation = 'destination-in'; c.drawImage(im, ox, oy); }
  c.globalCompositeOperation = 'source-atop';
  const lg = c.createLinearGradient(0, oy, 0, oy + h); lg.addColorStop(0, 'rgba(255,210,150,.16)'); lg.addColorStop(.5, 'rgba(255,210,150,0)'); lg.addColorStop(1, `rgba(20,10,5,${opt.grade === 'sad' ? .55 : .38})`);
  c.fillStyle = lg; c.fillRect(0, 0, 1400, 1500);
  if (opt.sil) { c.fillStyle = 'rgba(10,8,6,.93)'; c.fillRect(0, 0, 1400, 1500); }
  c.globalCompositeOperation = 'source-over';
  const main = ctx; const a = opt.alpha ?? 1; main.save(); main.globalAlpha = a; main.translate(x, footY); main.scale(s, s);
  if ((opt.glow ?? 1) > 0) { main.save(); main.shadowColor = `rgba(255,190,110,${.35 * (opt.glow ?? 1)})`; main.shadowBlur = 30; main.drawImage(FIG, -700, -1480); main.restore(); }
  const rc = RIM.getContext('2d'); rc.globalCompositeOperation = 'source-over'; rc.clearRect(0, 0, 1400, 1500); rc.drawImage(FIG, 0, 0);
  rc.globalCompositeOperation = 'source-in'; rc.fillStyle = 'rgba(255,214,150,.9)'; rc.fillRect(0, 0, 1400, 1500); rc.globalCompositeOperation = 'source-over';
  main.globalAlpha = a * .55; main.drawImage(RIM, -703, -1483); main.globalAlpha = a; main.drawImage(FIG, -700, -1480);
  main.restore();
}
function drawSpriteTrack(track, t, x, footY, scale, opt = {}) {
  for (const [n, a, age] of spriteTrack(track, t, opt.fade || .16)) { const pop = 1 + .02 * (1 - ramp(age, 0, .25)); drawSprite(n, x, footY, scale * pop, Object.assign({}, opt, { alpha: a * (opt.alpha ?? 1) })); }
}

// ---------- sahne öğeleri ----------
function spotlight(x, a = 1, w = 560) {
  ctx.save(); ctx.globalCompositeOperation = 'lighter';
  const g = ctx.createLinearGradient(0, 0, 0, 1550);
  g.addColorStop(0, `rgba(255,214,150,${.2 * a})`); g.addColorStop(1, `rgba(255,214,150,0)`);
  ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(x - 70, 0); ctx.lineTo(x + 70, 0); ctx.lineTo(x + w, 1550); ctx.lineTo(x - w, 1550); ctx.fill();
  const r = ctx.createRadialGradient(x, 1420, 10, x, 1420, 620); r.addColorStop(0, `rgba(255,200,130,${.3 * a})`); r.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = r; ctx.fillRect(x - 700, 1050, 1400, 700); ctx.restore();
}
// toz zerreleri (spot ışığında süzülen)
const MOTES = (function () { const r = rng(9); return Array.from({ length: 70 }, () => ({ x: r(), y: r(), s: .5 + r() * 1.8, sp: .2 + r() * .6, ph: r() * 6 })); })();
function motes(t, x0 = 540, a = 1) {
  ctx.save(); ctx.globalCompositeOperation = 'lighter';
  for (const m of MOTES) { const y = ((m.y - t * .012 * m.sp) % 1 + 1) % 1; const yy = 80 + y * 1350; const spread = 70 + yy * .33;
    const x = x0 + (m.x - .5) * 2 * spread + Math.sin(t * .6 + m.ph) * 14; const al = (.22 + .2 * Math.sin(t * 1.3 + m.ph)) * a;
    ctx.fillStyle = `rgba(255,225,180,${al})`; ctx.beginPath(); ctx.arc(x, yy, m.s * 1.6, 0, Math.PI * 2); ctx.fill(); }
  ctx.restore();
}
// gerçek ölçekli platform (4 m) — kenarları kadraj dışına taşar
function platform(yb = 1300, yf = 1575) {
  ctx.fillStyle = '#16110c'; ctx.fillRect(0, yb - 4, W, H - yb);
  const wb = 1250, wf = 1900;
  const g = ctx.createLinearGradient(0, yb, 0, yf); g.addColorStop(0, '#3b2a1a'); g.addColorStop(1, '#4e3822');
  ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(W / 2 - wb / 2, yb); ctx.lineTo(W / 2 + wb / 2, yb); ctx.lineTo(W / 2 + wf / 2, yf); ctx.lineTo(W / 2 - wf / 2, yf); ctx.fill();
  ctx.strokeStyle = 'rgba(255,210,150,.10)'; ctx.lineWidth = 2;
  for (let i = 1; i < 12; i++) { const k = i / 12; ctx.beginPath(); ctx.moveTo(W / 2 - wb / 2 + wb * k, yb); ctx.lineTo(W / 2 - wf / 2 + wf * k, yf); ctx.stroke(); }
  // orta lastik bölüm
  ctx.fillStyle = 'rgba(20,16,12,.35)'; ctx.beginPath(); ctx.moveTo(W / 2 - 330, yb); ctx.lineTo(W / 2 + 330, yb); ctx.lineTo(W / 2 + 500, yf); ctx.lineTo(W / 2 - 500, yf); ctx.fill();
  ctx.fillStyle = '#0f0b08'; ctx.fillRect(0, yf, W, 34); ctx.fillStyle = 'rgba(255,210,150,.12)'; ctx.fillRect(0, yf, W, 3);
}
// tribün: arkada, uzakta; reklam panosu (logosuz) ölçek verir
const CROWD = (function () { const r = rng(42); const a = []; for (let row = 0; row < 5; row++) for (let i = 0; i < 19; i++) a.push({ row, x: i * 60 + (row % 2) * 30 + r() * 16 - 8, h: r() * 10, flag: r() < .18, ph: r() * 6, tone: r() }); return a; })();
function crowd(t, y0 = 760, flagCol = '#c0392b', roar = 0) {
  for (const c of [...CROWD].reverse()) {
    const rowK = 1 - c.row * .07; const y = y0 + (4 - c.row) * 56 - c.h - (roar ? Math.abs(Math.sin(t * 7 + c.ph)) * 16 * roar * rowK : 0);
    const v = 9 + c.tone * 8 + (4 - c.row) * 3; ctx.fillStyle = `rgb(${v + 3},${v + 2},${v + 2})`;
    ctx.beginPath(); ctx.arc(c.x, y, 19 * rowK, 0, Math.PI * 2); ctx.fill(); rrect(c.x - 30 * rowK, y + 15, 60 * rowK, 60, 18); ctx.fill();
    if (roar > .3 && c.tone > .55) { const up = Math.abs(Math.sin(t * 6 + c.ph)); ctx.strokeStyle = ctx.fillStyle; ctx.lineWidth = 11 * rowK; ctx.lineCap = 'round';
      ctx.beginPath(); ctx.moveTo(c.x - 22, y + 24); ctx.lineTo(c.x - 34, y - 30 - up * 18); ctx.moveTo(c.x + 22, y + 24); ctx.lineTo(c.x + 34, y - 30 - up * 18); ctx.stroke(); }
    if (c.flag) { const wv = Math.sin(t * 4 + c.ph) * 7; ctx.strokeStyle = '#2a2420'; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(c.x + 22, y + 18); ctx.lineTo(c.x + 26, y - 62); ctx.stroke();
      ctx.fillStyle = flagCol; ctx.beginPath(); ctx.moveTo(c.x + 26, y - 62); ctx.quadraticCurveTo(c.x + 48, y - 66 + wv, c.x + 72, y - 58); ctx.lineTo(c.x + 72, y - 30); ctx.quadraticCurveTo(c.x + 48, y - 36 + wv, c.x + 26, y - 32); ctx.fill();
      if (flagCol === '#c0392b') { ctx.fillStyle = 'rgba(255,255,255,.85)'; ctx.beginPath(); ctx.arc(c.x + 44, y - 46 + wv * .5, 7, 0, Math.PI * 2); ctx.fill(); ctx.fillStyle = flagCol; ctx.beginPath(); ctx.arc(c.x + 46.5, y - 46 + wv * .5, 5.6, 0, Math.PI * 2); ctx.fill(); } }
  }
  // pano
  ctx.fillStyle = '#0d0a08'; ctx.fillRect(0, y0 + 300, W, 70); ctx.fillStyle = 'rgba(217,164,65,.18)'; ctx.fillRect(0, y0 + 300, W, 3);
}
// foto flaşları
function flashes(t, times, y0 = 760) {
  if (!times) return; const r = rng(77);
  for (const [a, b, n] of times) { for (let i = 0; i < n; i++) { const ft = a + r() * (b - a), x = r() * W, y = y0 + r() * 280; const k = 1 - ramp(t, ft, ft + .14);
      if (t < ft || k <= 0) continue; ctx.save(); ctx.globalCompositeOperation = 'lighter';
      const g = ctx.createRadialGradient(x, y, 0, x, y, 90); g.addColorStop(0, `rgba(255,255,255,${k})`); g.addColorStop(1, 'rgba(255,255,255,0)'); ctx.fillStyle = g; ctx.fillRect(x - 90, y - 90, 180, 180);
      ctx.strokeStyle = `rgba(255,255,255,${k * .8})`; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(x - 50, y); ctx.lineTo(x + 50, y); ctx.moveTo(x, y - 50); ctx.lineTo(x, y + 50); ctx.stroke(); ctx.restore(); } }
}
// tebeşir tozu bulutu
function chalkPuff(t, t0, pts) {
  if (t < t0 || t > t0 + 2.2) return; const r = rng(Math.floor(t0 * 100)); const k = ramp(t, t0, t0 + 2.2);
  ctx.save(); for (const [x, y] of pts) for (let i = 0; i < 26; i++) { const a = r() * Math.PI * 2, sp = 30 + r() * 120, d = sp * Math.pow(k, .45);
    ctx.fillStyle = `rgba(245,240,230,${(1 - k) * .5 * r()})`; ctx.beginPath(); ctx.arc(x + Math.cos(a) * d, y + Math.sin(a) * d * .6 - k * 60, 6 + k * 26 * r(), 0, Math.PI * 2); ctx.fill(); }
  ctx.restore();
}
// hakem karar ışıkları: states [[t,'www'|'rrr'|'---']]
function refLights(t, states, x = W - 230, y = 470, sz = 1) {
  if (!states) return; let st = null, t0 = 0; for (const s of states) if (t >= s[0]) { st = s[1]; t0 = s[0]; } if (!st) return;
  const a = ramp(t, t0, t0 + .15); ctx.save(); ctx.translate(x, y); ctx.scale(sz, sz);
  ctx.fillStyle = 'rgba(10,8,6,.85)'; rrect(-20, -50, 210, 100, 18); ctx.fill(); ctx.strokeStyle = 'rgba(255,255,255,.12)'; ctx.stroke();
  [...st].forEach((ch, i) => { const cx = 32 + i * 64; ctx.beginPath(); ctx.arc(cx, 0, 24, 0, Math.PI * 2);
    if (ch === '-') { ctx.fillStyle = '#2a2622'; ctx.fill(); return; }
    const col = ch === 'w' ? '255,255,255' : '235,60,45'; ctx.shadowColor = `rgba(${col},${a})`; ctx.shadowBlur = 30 * a; ctx.fillStyle = `rgba(${col},${.25 + .75 * a})`; ctx.fill(); ctx.shadowBlur = 0; });
  ctx.restore();
}
function plane(x, y, ang, s = 1) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(ang); ctx.scale(s, s); ctx.fillStyle = '#f3e9d8'; ctx.shadowColor = 'rgba(255,220,150,.8)'; ctx.shadowBlur = 18;
  ctx.beginPath(); ctx.moveTo(26, 0); ctx.quadraticCurveTo(22, -4, 8, -4); ctx.lineTo(-4, -22); ctx.lineTo(-11, -22); ctx.lineTo(-4, -4); ctx.lineTo(-18, -4); ctx.lineTo(-24, -11); ctx.lineTo(-28, -11); ctx.lineTo(-25, 0);
  ctx.lineTo(-28, 11); ctx.lineTo(-24, 11); ctx.lineTo(-18, 4); ctx.lineTo(-4, 4); ctx.lineTo(-11, 22); ctx.lineTo(-4, 22); ctx.lineTo(8, 4); ctx.quadraticCurveTo(22, 4, 26, 0); ctx.fill(); ctx.restore();
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
const FS = .82, FY = 1440; // sahnede figür ölçeği ve ayak çizgisi (gerçek ölçek: 1 m ≈ 335 px)
function stage(sc, t, o = {}) {
  background(.6);
  crowd(t, 760, sc.flag || T.red, o.roar || 0);
  flashes(t, sc.flashes, 760);
  spotlight(W / 2, o.spot ?? 1); platform(1300, 1575);
}
function handsWorld(Q, x, y, s) { const hs = ((EP.body && EP.body.h) || 1.47) / 1.47; return [Q.L.ha, Q.R.ha].map(h => [x + h[0] * s * hs, y + h[1] * s * hs]); }
DRAW.hook = (sc, t) => {
  stage(sc, t);
  if (sc.sprites) drawSpriteTrack(sc.sprites, t, W / 2, FY, FS * (sc.sScale || .85));
  else { const Q = drawFigure(W / 2, FY, FS, poseAt(sc.pose || [[0, 'setup']], t), { back: sc.back });
    if (sc.chalk) for (const ct of sc.chalk) chalkPuff(t, ct, handsWorld(Q, W / 2, FY, FS)); }
  motes(t);
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
  for (const r of sc.routes || []) { const k = ease(ramp(t, r.t0, r.t1)); route(cam, r.a, r.b, k, r.col);
    if (r.plane && k > 0 && k < 1) { const p1 = slerp(r.a, r.b, k), p2 = slerp(r.a, r.b, Math.min(1, k + .01)); const q1 = proj(cam, p1[0], p1[1]), q2 = proj(cam, p2[0], p2[1]);
      plane(q1[0], q1[1], Math.atan2(q2[1] - q1[1], q2[0] - q1[0]), 1.3); } }
  for (const p of sc.pins || []) pin(cam, p.lon, p.lat, p.label, ramp(t, p.t, p.t + .5) * (p.t1 ? 1 - ramp(t, p.t1, p.t1 + .4) : 1), t, p.below);
  const g = ctx.createLinearGradient(0, 0, 0, 480); g.addColorStop(0, 'rgba(12,10,8,.95)'); g.addColorStop(1, 'rgba(12,10,8,0)'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, 480);
};
const CHILD = { h: 1.32, th: .7, sh: .84, head: 1.14, neck: .75, traps: .3 };
DRAW.gym = (sc, t) => {
  background(.4);
  ctx.fillStyle = '#1a140f'; ctx.fillRect(0, 0, W, 1340);
  // tuğla duvar
  ctx.strokeStyle = 'rgba(255,220,170,.05)'; ctx.lineWidth = 2;
  for (let y = 420; y < 1340; y += 46) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); for (let x = ((y / 46) % 2) * 60; x < W; x += 120) { ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x, y + 46); ctx.stroke(); } }
  // yüksek pencere + ışık hüzmesi
  ctx.fillStyle = 'rgba(255,226,170,.5)'; for (let i = 0; i < 3; i++) rrect(700 + i * 100, 470, 70, 120, 4), ctx.fill();
  ctx.save(); ctx.globalCompositeOperation = 'lighter';
  for (let i = 0; i < 3; i++) { const x = 700 + i * 100; const g = ctx.createLinearGradient(x, 480, x - 420, 1400); g.addColorStop(0, 'rgba(255,220,160,.13)'); g.addColorStop(1, 'rgba(255,220,160,0)');
    ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(x, 520); ctx.lineTo(x + 70, 520); ctx.lineTo(x - 300, 1400); ctx.lineTo(x - 460, 1400); ctx.fill(); }
  ctx.restore();
  // ağırlık rafı
  for (let i = 0; i < 4; i++) { ctx.fillStyle = ['#3a2f28', '#33291f', '#2e261f', '#3a2f28'][i]; rrect(90 + i * 26, 1150 - i * 6, 22, 190 + i * 12, 8); ctx.fill(); }
  ctx.fillStyle = '#2b2016'; ctx.fillRect(0, 1340, W, 240); ctx.fillStyle = '#3a2b1d'; ctx.fillRect(250, 1340, 580, 200);
  const cyc = ((t + 1.2) % 4.4), tr = [[0, 'setup'], [1.1, 'pull'], [1.5, 'catch'], [2.2, 'rack'], [2.6, 'dip'], [2.85, 'split'], [3.4, 'over'], [4.0, 'over'], [4.4, 'setup']];
  const Q = drawFigure(W / 2, 1450, .8, poseAt(tr, cyc), { body: CHILD, singlet: '#5a524a', sil: true, glow: .8, barHalf: 300, plateR: 52, plates: [[0, 52, '#4a4038'], [26, 46, '#4a4038']] });
  motes(t, 600, .6);
  if (sc.big) { const a = easeOut(ramp(t, sc.big.t, sc.big.t + .6)); ctx.save(); ctx.globalAlpha = a; ctx.textAlign = 'center';
    ctx.fillStyle = T.acc; ctx.font = F.num(240); ctx.shadowColor = 'rgba(0,0,0,.8)'; ctx.shadowBlur = 30; ctx.fillText(sc.big.v, W / 2, 700 + (1 - a) * 40);
    ctx.fillStyle = T.ink; ctx.font = F.body(34, 700); spaced(sc.big.l, W / 2, 770, 5); ctx.restore(); }
};
// köy: Rodop dağları, alacakaranlık, parallaks; çocuk patikada yürür
const STARS = (function () { const r = rng(3); return Array.from({ length: 90 }, () => [r() * W, r() * 700, r() * 2 + .5, r() * 6]); })();
function ridge(seed, y, amp, col, shift) { const r = rng(seed); const pts = []; for (let x = -200; x <= W + 200; x += 40) pts.push([x, y - r() * amp - Math.sin(x / 210 + seed) * amp * .5]);
  ctx.fillStyle = col; ctx.beginPath(); ctx.moveTo(-200 + shift, H); for (const [x, yy] of pts) ctx.lineTo(x + shift, yy); ctx.lineTo(W + 200 + shift, H); ctx.fill(); }
DRAW.village = (sc, t) => {
  const g = ctx.createLinearGradient(0, 0, 0, 1250); g.addColorStop(0, '#0a0e1c'); g.addColorStop(.6, '#2a2030'); g.addColorStop(1, '#8a4a26');
  ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  for (const [x, y, s, ph] of STARS) { ctx.fillStyle = `rgba(255,240,220,${.3 + .3 * Math.sin(t * 2 + ph)})`; ctx.beginPath(); ctx.arc(x, y, s, 0, Math.PI * 2); ctx.fill(); }
  ctx.fillStyle = 'rgba(255,230,190,.9)'; ctx.beginPath(); ctx.arc(820 - t * 3, 540, 34, 0, Math.PI * 2); ctx.fill(); // ay
  ridge(11, 1000, 160, '#1c1a26', -t * 3);
  ridge(23, 1120, 110, '#16131a', -t * 6);
  // maden kulesi
  ctx.save(); ctx.translate(820 - t * 6, 1010); ctx.strokeStyle = '#0e0c10'; ctx.lineWidth = 7;
  ctx.beginPath(); ctx.moveTo(-50, 0); ctx.lineTo(0, -150); ctx.lineTo(50, 0); ctx.moveTo(-30, -60); ctx.lineTo(30, -60); ctx.moveTo(0, -150); ctx.lineTo(60, -20); ctx.stroke();
  ctx.beginPath(); ctx.arc(0, -150, 22, 0, Math.PI * 2); ctx.stroke(); ctx.restore();
  ridge(37, 1260, 70, '#110e0c', -t * 10);
  // evler ve cami
  const hx = -t * 10; const r = rng(5);
  for (let i = 0; i < 9; i++) { const x = 60 + i * 115 + hx + r() * 30, y = 1210 + r() * 30, w = 70 + r() * 30, h = 50 + r() * 20;
    ctx.fillStyle = '#0d0a08'; ctx.fillRect(x, y - h, w, h); ctx.beginPath(); ctx.moveTo(x - 8, y - h); ctx.lineTo(x + w / 2, y - h - 30); ctx.lineTo(x + w + 8, y - h); ctx.fill();
    if (r() < .75) { const on = .6 + .4 * Math.sin(t * 3 + i); ctx.fillStyle = `rgba(255,200,110,${on})`; ctx.fillRect(x + 14, y - h + 14, 16, 18); if (w > 85) ctx.fillRect(x + w - 30, y - h + 14, 16, 18); } }
  ctx.fillStyle = '#0d0a08'; const mx = 640 + hx; ctx.beginPath(); ctx.arc(mx, 1160, 46, Math.PI, 0); ctx.fill(); ctx.fillRect(mx - 46, 1160, 92, 60); ctx.fillRect(mx + 70, 1010, 16, 210); ctx.beginPath(); ctx.moveTo(mx + 66, 1012); ctx.lineTo(mx + 78, 970); ctx.lineTo(mx + 90, 1012); ctx.fill();
  // patika
  ctx.fillStyle = '#2a2017'; ctx.beginPath(); ctx.moveTo(500, 1240); ctx.lineTo(580, 1240); ctx.lineTo(860, H); ctx.lineTo(220, H); ctx.fill();
  ctx.fillStyle = '#18120d'; ctx.fillRect(0, 1240, 500, H); ctx.beginPath(); ctx.moveTo(500, 1240); ctx.lineTo(220, H); ctx.lineTo(0, H); ctx.lineTo(0, 1240); ctx.fill();
  ctx.beginPath(); ctx.moveTo(580, 1240); ctx.lineTo(W, 1240); ctx.lineTo(W, H); ctx.lineTo(860, H); ctx.fill();
  // yürüyen çocuk (uzaklaşır)
  const k = ease(ramp(t, 0, sc.dur)); const y = lerp(1620, 1290, k), s = lerp(.62, .2, k);
  const Q = drawFigure(W / 2 + Math.sin(t * .5) * 6, y, s, walkPose(t * 5.2), { body: CHILD, singlet: '#4b4a44', glow: .4, sil: true });
};
// otel koridoru: tek kaçış noktalı perspektif; figür (takım elbise) uzaklaşır, kapı ışığa açılır
DRAW.corridor = (sc, t) => {
  const vx = 540, vy = 960; ctx.fillStyle = '#0b0908'; ctx.fillRect(0, 0, W, H);
  const P = z => { const s = 1 / z; return { l: vx - 760 * s, r: vx + 760 * s, t: vy - 900 * s, b: vy + 1100 * s }; };
  const near = P(1), far = P(7);
  const quad = (a, b, c, d, col) => { ctx.fillStyle = col; ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); ctx.lineTo(c[0], c[1]); ctx.lineTo(d[0], d[1]); ctx.fill(); };
  quad([near.l, near.t], [far.l, far.t], [far.l, far.b], [near.l, near.b], '#2a201a');
  quad([near.r, near.t], [far.r, far.t], [far.r, far.b], [near.r, near.b], '#241c16');
  quad([near.l, near.t], [near.r, near.t], [far.r, far.t], [far.l, far.t], '#1a1411');
  quad([near.l, near.b], [near.r, near.b], [far.r, far.b], [far.l, far.b], '#3b1f1c');
  // halı deseni ve kapılar, tavan lambaları
  for (let z = 1.5; z < 7; z += .9) { const a = P(z), b = P(z + .45);
    ctx.fillStyle = 'rgba(255,220,160,.05)'; ctx.beginPath(); ctx.moveTo(a.l, a.b); ctx.lineTo(a.r, a.b); ctx.lineTo(b.r, b.b); ctx.lineTo(b.l, b.b); ctx.fill();
    const lp = P(z + .2); ctx.fillStyle = 'rgba(255,226,170,.85)'; ctx.beginPath(); ctx.ellipse(vx, lp.t + 6, 60 / z * 3, 8 / z * 3, 0, 0, Math.PI * 2); ctx.fill();
    ctx.save(); ctx.globalCompositeOperation = 'lighter'; const gg = ctx.createRadialGradient(vx, lp.t, 0, vx, lp.t, 380 / z); gg.addColorStop(0, 'rgba(255,210,150,.16)'); gg.addColorStop(1, 'rgba(0,0,0,0)'); ctx.fillStyle = gg; ctx.fillRect(vx - 400, lp.t - 50, 800, 800 / z); ctx.restore();
    for (const sgn of [-1, 1]) { const d0 = P(z), d1 = P(z + .35); const x0 = sgn < 0 ? d0.l : d0.r, x1 = sgn < 0 ? d1.l : d1.r;
      const yT0 = lerp(d0.t, d0.b, .3), yT1 = lerp(d1.t, d1.b, .3);
      quad([x0, yT0], [x1, yT1], [x1, d1.b], [x0, d0.b], '#140f0c'); } }
  // sondaki kapı + ÇIKIŞ ışığı
  const op = ease(ramp(t, sc.doorT || 6, (sc.doorT || 6) + 1.5));
  ctx.fillStyle = `rgb(${60 + 195 * op},${50 + 185 * op},${40 + 150 * op})`; ctx.fillRect(vx - 60, far.b - 190, 120, 190);
  ctx.save(); ctx.globalCompositeOperation = 'lighter'; const dg = ctx.createRadialGradient(vx, far.b - 90, 10, vx, far.b - 90, 600 * (.3 + op)); dg.addColorStop(0, `rgba(255,240,210,${.5 * op + .1})`); dg.addColorStop(1, 'rgba(0,0,0,0)'); ctx.fillStyle = dg; ctx.fillRect(0, 0, W, H); ctx.restore();
  ctx.fillStyle = '#2bd36a'; ctx.shadowColor = '#2bd36a'; ctx.shadowBlur = 20; rrect(vx - 44, far.b - 240, 88, 34, 4); ctx.fill(); ctx.shadowBlur = 0;
  ctx.fillStyle = '#05240f'; ctx.font = F.body(22, 800); ctx.textAlign = 'center'; ctx.fillText('EXIT', vx, far.b - 215);
  // arkadan gelen ziyafet ışığı
  ctx.save(); ctx.globalCompositeOperation = 'lighter'; const bg = ctx.createLinearGradient(0, H, 0, 1100); bg.addColorStop(0, `rgba(255,170,90,${.22 * (1 - ramp(t, 0, 4))})`); bg.addColorStop(1, 'rgba(0,0,0,0)'); ctx.fillStyle = bg; ctx.fillRect(0, 1100, W, 820); ctx.restore();
  // figür
  const k = ramp(t, .3, (sc.doorT || 6) + 1.2); const z = lerp(1.15, 6.4, ease(k)); const pz = P(z);
  const s = .95 / z * 1.15; const fa = 1 - ramp(t, (sc.doorT || 6) + .9, (sc.doorT || 6) + 1.6);
  ctx.save(); ctx.globalAlpha = fa; drawFigure(vx + Math.sin(t * 2.6) * 4 / z, pz.b - 10 / z, s, walkPose(t * 5.6), { outfit: { top: '#23262e', pants: '#1b1d23' }, glow: .5, sil: true }); ctx.restore();
};
DRAW.family = (sc, t) => {
  background(.3); const g = ctx.createLinearGradient(0, 400, 0, 1500); g.addColorStop(0, '#0c1018'); g.addColorStop(1, '#16110d'); ctx.fillStyle = g; ctx.fillRect(0, 380, W, 1200);
  ctx.fillStyle = '#1e1813'; ctx.fillRect(0, 1380, W, 300);
  // sınır: tel örgü
  ctx.strokeStyle = 'rgba(200,200,210,.35)'; ctx.lineWidth = 3; ctx.setLineDash([14, 10]); ctx.beginPath(); ctx.moveTo(W / 2, 420); ctx.lineTo(W / 2, 1420); ctx.stroke(); ctx.setLineDash([]);
  for (let y = 440; y < 1420; y += 40) { ctx.beginPath(); ctx.moveTo(W / 2 - 10, y); ctx.lineTo(W / 2 + 10, y + 12); ctx.moveTo(W / 2 + 10, y); ctx.lineTo(W / 2 - 10, y + 12); ctx.stroke(); }
  ctx.fillStyle = T.dim; ctx.font = F.body(26, 800); ctx.textAlign = 'center'; spaced('BULGARİSTAN', W / 4, 520, 5); spaced('TÜRKİYE', W * .75, 520, 5);
  const fam = [[150, 1.62, { hair: 'short' }, '#2c2721'], [250, 1.55, { hair: 'long' }, '#3b2b2b'], [335, 1.3, { hair: 'short', th: .75 }, '#27303a'], [405, 1.2, { hair: 'curly', th: .7 }, '#2d3428']];
  for (const [x, h, b, col] of fam) drawFigure(x, 1420, .42, mixPose('stand', 'stand', 0), { body: Object.assign({ h, th: .85, sh: .9 }, b), outfit: { top: col, pants: '#1c1a18' }, glow: .35, sil: true });
  drawFigure(W * .75, 1420, .42, mixPose('stand', 'slump', .5 + .5 * Math.sin(t * .8)), { outfit: { top: '#8e1616', pants: '#1c1a18' }, glow: .7, sil: true });
  // kar
  const r = rng(21); ctx.fillStyle = 'rgba(240,240,250,.6)'; for (let i = 0; i < 120; i++) { const x = (r() * W + Math.sin(t + i) * 20) % W, y = 380 + ((r() * 1100 + t * (40 + r() * 50)) % 1100); ctx.beginPath(); ctx.arc(x, y, 1.5 + r() * 2.5, 0, Math.PI * 2); ctx.fill(); }
  if (sc.years) { let cur = sc.years[0][1]; for (const [yt, v] of sc.years) if (t >= yt) cur = v; ctx.fillStyle = 'rgba(243,233,216,.14)'; ctx.font = F.num(300); ctx.textAlign = 'center'; ctx.fillText(cur, W / 2, 900); }
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
  if (sc.portrait && IMG[sc.portrait]) { const k = easeOut(ramp(t, 0, 1.2)); drawSprite(sc.portrait, W / 2, 1130 + (1 - k) * 30, .95 + .04 * t / sc.dur, { alpha: k, glow: .6 });
    const g2 = ctx.createLinearGradient(0, 880, 0, 1140); g2.addColorStop(0, 'rgba(12,10,8,0)'); g2.addColorStop(1, 'rgba(12,10,8,1)'); ctx.fillStyle = g2; ctx.fillRect(0, 880, W, 262); }
  else { ctx.save(); ctx.globalAlpha = .35; drawFigure(W / 2, 1500, .9, poseAt([[0, 'over']], 0), { glow: 1.2 }); ctx.restore();
    const g = ctx.createLinearGradient(0, 600, 0, 1300); g.addColorStop(0, 'rgba(12,10,8,0)'); g.addColorStop(.5, 'rgba(12,10,8,.6)'); g.addColorStop(1, 'rgba(12,10,8,0)'); ctx.fillStyle = g; ctx.fillRect(0, 600, W, 700); }
  ctx.save(); ctx.textAlign = 'center';
  sc.lines.forEach((ln, i) => { const a = easeOut(ramp(t, .2 + i * .35, .9 + i * .35)); ctx.globalAlpha = a; ctx.fillStyle = T.ink; ctx.font = F.title(ln[1]); ctx.fillText(ln[0], W / 2, ln[2] + (1 - a) * 30); });
  const a = easeOut(ramp(t, 1.4, 2.2)); ctx.globalAlpha = a; ctx.fillStyle = T.acc; ctx.font = F.titleI(70); ctx.fillText(sc.nick, W / 2, sc.nickY || 1130);
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
  // para yağmuru
  { const r = rng(4); ctx.save(); for (let i = 0; i < 40; i++) { const st = sc.t0 + r() * 2, k = (t - st) / 2.4; if (k < 0 || k > 1) continue; const x = r() * W, y = 380 + k * 1100;
      ctx.globalAlpha = (1 - k) * .5; ctx.translate(x, y); ctx.rotate(k * 6 + i); ctx.fillStyle = '#6f8f5a'; ctx.fillRect(-36, -16, 72, 32); ctx.setTransform(1, 0, 0, 1, 0, 0); } ctx.restore(); }
  if (sc.quote) { const q = sc.quote, a = easeOut(ramp(t, q.t, q.t + .7)); if (a > 0) { ctx.save(); ctx.fillStyle = `rgba(12,10,8,${.88 * a})`; ctx.fillRect(0, 380, W, 1100);
      ctx.globalAlpha = a; ctx.textAlign = 'center'; ctx.fillStyle = T.acc; ctx.font = F.title(160); ctx.fillText('“', W / 2, 760);
      ctx.fillStyle = T.ink; ctx.font = F.titleI(68); wrap(q.text, 860).forEach((ln, i) => ctx.fillText(ln, W / 2, 880 + i * 86 + (1 - a) * 20));
      ctx.fillStyle = T.dim; ctx.font = F.body(30, 700); spaced('— ' + q.by, W / 2, 1120 + (wrap(q.text, 860).length - 2) * 86, 4); ctx.restore(); } }
};
// kaldırış sahnesi: gerçek ölçekli platform, hakem ışıkları, flaşlar, tebeşir, yavaş çekim pozlar
DRAW.lift = (sc, t) => {
  const roar = sc.roar ? clamp(ramp(t, sc.roar[0], sc.roar[0] + .5) * (1 - ramp(t, sc.roar[1], sc.roar[1] + 1.5))) : 0;
  const z = 1 + (sc.zoom ? sc.zoom * ease(ramp(t, sc.zoomT[0], sc.zoomT[1])) - (sc.zoomOut ? sc.zoom * ease(ramp(t, sc.zoomOut[0], sc.zoomOut[1])) : 0) : 0);
  ctx.save(); ctx.translate(W / 2, 1200); ctx.scale(z, z); ctx.translate(-W / 2, -1200);
  stage(sc, t, { roar });
  let barY = null, sag = 0; const P = sc.pose ? poseAt(sc.pose, t) : mixPose('stand', 'stand', 0);
  if (sc.drop && t > sc.drop[0]) { const k = ramp(t, sc.drop[0], sc.drop[0] + .45); const b = Math.abs(Math.sin(clamp((t - sc.drop[0] - .45) * 9, 0, Math.PI))) * 30 * (1 - ramp(t, sc.drop[0] + .45, sc.drop[0] + 1.2));
    barY = lerp(sc.drop[1], -92, k * k) - b; }
  if (P.bar !== null && sc.whip && t > sc.whip[0] && t < sc.whip[1]) sag = 16 * Math.sin(ramp(t, sc.whip[0], sc.whip[1]) * Math.PI);
  if (sc.sprites) { drawSpriteTrack(sc.sprites, t, W / 2, FY, FS * (sc.sScale || .85), { grade: sc.grade });
    if (barY !== null) { ctx.save(); ctx.translate(W / 2, FY); ctx.scale(FS * (sc.sScale || .85) / .85, FS * (sc.sScale || .85) / .85); drawBar(barY, 450, 92, 0); ctx.restore(); } }
  else { const Q = drawFigure(W / 2, FY, FS, P, { back: sc.back, sag, bar: barY === null });
    if (barY !== null) { ctx.save(); ctx.translate(W / 2, FY); ctx.scale(FS, FS); drawBar(barY, 450, 92, 0); ctx.restore(); }
    if (sc.chalk) for (const ct of sc.chalk) chalkPuff(t, ct, handsWorld(Q, W / 2, FY, FS)); }
  if (sc.dropDust && t > sc.drop[0] + .45) chalkPuff(t, sc.drop[0] + .45, [[W / 2 - 300, FY - 20], [W / 2 + 300, FY - 20]]);
  motes(t);
  ctx.restore();
  refLights(t, sc.lights);
  if (sc.attempts) {
    const x0 = 60, y0 = 430; ctx.save();
    sc.attempts.forEach((g, gi) => {
      const gy = y0 + gi * 150; const ga = ramp(t, g.t, g.t + .4) * (sc.attemptsOut ? 1 - ramp(t, sc.attemptsOut, sc.attemptsOut + .4) : 1); if (ga <= 0) return; ctx.globalAlpha = ga;
      ctx.fillStyle = T.dim; ctx.font = F.body(24, 700); ctx.textAlign = 'left'; spaced(g.name, x0, gy, 4, 'left');
      g.items.forEach((it, i) => { const a = ramp(t, it[0], it[0] + .35); if (a <= 0) return; ctx.globalAlpha = a * ga; const x = x0 + i * 200, y = gy + 20;
        const pop = 1 + (1 - easeOut(ramp(t, it[0], it[0] + .35))) * .25; ctx.save(); ctx.translate(x + 93, y + 43); ctx.scale(pop, pop); ctx.translate(-x - 93, -y - 43);
        ctx.fillStyle = it[2] === 'x' ? 'rgba(192,57,43,.3)' : it[2] === 'wr' ? 'rgba(217,164,65,.28)' : 'rgba(255,255,255,.1)'; rrect(x, y, 186, 86, 10); ctx.fill();
        ctx.fillStyle = it[2] === 'x' ? '#e06456' : T.ink; ctx.font = F.num(58); ctx.textAlign = 'center'; ctx.fillText(it[1], x + 93, y + 62);
        if (it[2] === 'wr') { ctx.fillStyle = T.acc; ctx.font = F.body(18, 800); ctx.fillText('DÜNYA REKORU', x + 93, y + 108); }
        ctx.restore(); ctx.textAlign = 'left'; });
      ctx.globalAlpha = 1;
    });
    ctx.restore();
  }
  if (sc.big) for (const b of sc.big) { const a = easeOut(ramp(t, b.t, b.t + .5)) * (1 - ramp(t, b.t1 - .4, b.t1)); if (a <= 0) continue;
    ctx.save(); ctx.globalAlpha = a; ctx.textAlign = 'center'; const s = 1 + (1 - a) * .3;
    ctx.translate(W / 2, b.y || 760); ctx.scale(s, s); ctx.fillStyle = b.col || T.acc; ctx.shadowColor = 'rgba(0,0,0,.85)'; ctx.shadowBlur = 34; ctx.font = F.num(b.size || 210);
    let v = b.v; if (b.count) { const k = easeOut(ramp(t, b.t, b.t + b.count)); v = counterText(b.from + (b.to - b.from) * k, b.dec || 0) + (b.suf || ''); }
    ctx.fillText(v, 0, 0);
    if (b.l) { ctx.fillStyle = T.ink; ctx.font = F.body(32, 800); spaced(b.l, 0, 64, 5); } ctx.restore(); }
  if (sc.xs) sc.xs.forEach((xt, i) => { const a = easeOut(ramp(t, xt, xt + .3)); if (a <= 0) return; ctx.save(); ctx.globalAlpha = a; const x = W / 2 + (i - 1) * 190, y = sc.xsY || 620, s = 70 * (1.6 - .6 * a);
    ctx.strokeStyle = '#e06456'; ctx.lineWidth = 16; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(x - s / 2, y - s / 2); ctx.lineTo(x + s / 2, y + s / 2); ctx.moveTo(x + s / 2, y - s / 2); ctx.lineTo(x - s / 2, y + s / 2); ctx.stroke(); ctx.restore(); });
};
DRAW.medals = (sc, t) => {
  background(.6); spotlight(W / 2, .5, 400); motes(t, 540, .6);
  sc.items.forEach((m, i) => { const a = easeOut(ramp(t, m.t, m.t + .6)); const x = W / 2 + (i - (sc.items.length - 1) / 2) * 280; const sw = Math.sin(t * 1.6 + i) * .04;
    ctx.save(); ctx.translate(x, 980); ctx.rotate(sw); medal(0, -(1 - a) * 60, 110, a, m.y); ctx.restore();
    ctx.save(); ctx.globalAlpha = a; ctx.fillStyle = T.ink; ctx.font = F.body(30, 700); ctx.textAlign = 'center'; ctx.fillText(m.city, x, 1160); ctx.restore(); });
};
DRAW.duel = (sc, t) => {
  background(.5);
  const cols = [[sc.a, T.red], [sc.b, T.blue]];
  cols.forEach(([p, col], i) => { const x = 70 + i * 480, a = easeOut(ramp(t, .2 + i * .2, .8 + i * .2)); ctx.save(); ctx.globalAlpha = a; ctx.translate((1 - a) * (i ? 80 : -80), 0);
    ctx.fillStyle = '#17130f'; rrect(x, 430, 460, 170, 16); ctx.fill(); ctx.fillStyle = col; ctx.fillRect(x, 430, 10, 170);
    ctx.fillStyle = T.ink; ctx.font = F.num(64); ctx.textAlign = 'left'; ctx.fillText(p.name, x + 36, 515); ctx.fillStyle = T.dim; ctx.font = F.body(26, 700); spaced(p.nat, x + 36, 565, 4, 'left'); ctx.restore(); });
  ctx.save(); ctx.fillStyle = T.dim; ctx.font = F.body(24, 700); ctx.textAlign = 'center'; ctx.globalAlpha = ramp(t, 1, 1.5); spaced('SİLKME', W / 2, 670, 6); ctx.restore();
  sc.rows.forEach((r, i) => { const a = easeOut(ramp(t, r.t, r.t + .4)); if (a <= 0) return; const y = 700 + i * 120, col = r.who === 'a' ? T.red : T.blue;
    ctx.save(); ctx.globalAlpha = a; ctx.translate((1 - a) * (r.who === 'a' ? -60 : 60), 0);
    ctx.fillStyle = '#17130f'; rrect(70, y, 940, 100, 14); ctx.fill(); ctx.fillStyle = col; ctx.fillRect(70, y, 10, 100);
    ctx.fillStyle = T.ink; ctx.font = F.body(34, 700); ctx.textAlign = 'left'; ctx.fillText(r.who === 'a' ? sc.a.short : sc.b.short, 110, y + 63);
    // hakem ışıkları (kaldırıştan .6 sn sonra yanar)
    const la = ramp(t, r.t + .6, r.t + .75); for (let k = 0; k < 3; k++) { ctx.beginPath(); ctx.arc(330 + k * 34, y + 50, 11, 0, Math.PI * 2);
      const on = r.res === 'x' ? '235,60,45' : '255,255,255'; ctx.fillStyle = la > 0 ? `rgba(${on},${.3 + .7 * la})` : '#2a2622'; ctx.shadowColor = `rgba(${on},${la})`; ctx.shadowBlur = 14 * la; ctx.fill(); ctx.shadowBlur = 0; }
    const k = easeOut(ramp(t, r.t, r.t + .5)); const kg = parseFloat(r.kg.replace(',', '.'));
    ctx.font = F.num(72); ctx.textAlign = 'right'; ctx.fillStyle = r.res === 'x' ? '#e06456' : T.ink; ctx.fillText(counterText(kg * (.9 + .1 * k), kg % 1 ? 1 : 0) + ' KG', 760, y + 76);
    ctx.font = F.body(22, 800); ctx.globalAlpha = a * la; ctx.fillStyle = r.res === 'wr' ? T.acc : r.res === 'x' ? '#e06456' : T.dim; ctx.fillText(r.res === 'wr' ? 'DÜNYA REKORU' : r.res === 'x' ? 'BAŞARISIZ' : 'GEÇERLİ', 985, y + 62);
    ctx.restore(); });
  if (sc.total) { const a = easeOut(ramp(t, sc.total.t, sc.total.t + .6)); ctx.save(); ctx.globalAlpha = a; ctx.textAlign = 'center';
    ctx.fillStyle = T.dim; ctx.font = F.body(26, 700); spaced('TOPLAM', W / 2, 1230, 6);
    ctx.font = F.num(120); ctx.fillStyle = T.red; ctx.fillText(sc.total.a, W / 2 - 230, 1350); ctx.fillStyle = T.dim; ctx.fillText('–', W / 2, 1350); ctx.fillStyle = '#6f95c9'; ctx.fillText(sc.total.b, W / 2 + 230, 1350);
    ctx.restore(); }
  if (sc.medals) { const a = easeOut(ramp(t, sc.medals.t, sc.medals.t + .6)); if (a > 0) { ctx.save(); ctx.fillStyle = `rgba(12,10,8,${a})`; ctx.fillRect(0, 380, W, 1100); ctx.restore(); spotlight(W / 2, .5 * a, 420); }
    for (let i = 0; i < 3; i++) { const b = easeOut(ramp(t, sc.medals.t + i * .3, sc.medals.t + .6 + i * .3)); medal(W / 2 + (i - 1) * 270, 900 - (1 - b) * 60, 105, b, sc.medals.y[i]);
      ctx.save(); ctx.globalAlpha = b; ctx.fillStyle = T.ink; ctx.font = F.body(28, 700); ctx.textAlign = 'center'; ctx.fillText(sc.medals.c[i], W / 2 + (i - 1) * 270, 1070); ctx.restore(); } }
};
// iki sporcu sarılır (arkadan)
DRAW.hug = (sc, t) => {
  const z = 1 + .05 * ease(ramp(t, 0, sc.dur)); ctx.save(); ctx.translate(W / 2, 1200); ctx.scale(z, z); ctx.translate(-W / 2, -1200);
  stage(Object.assign({}, sc, { flag: sc.flag }), t, { roar: .6 });
  const k = ease(ramp(t, .4, 1.6)); const ax = lerp(360, 445, k), bx = lerp(720, 635, k);
  drawFigure(bx, FY, FS, mixPose('stand', 'hugL', k), { body: sc.bodyB, singlet: '#1f4fa0', back: sc.backB, glow: 1, sil: true });
  drawFigure(ax, FY, FS, mixPose('stand', 'hugR', k), { glow: 1, sil: true });
  motes(t); ctx.restore();
};
// dergi kapağı (özgün çizim, gerçek logo yok) → Washington
DRAW.magazine = (sc, t) => {
  background(.5); const ph2 = sc.t2 || 3.4;
  const a1 = 1 - ramp(t, ph2 - .3, ph2 + .2), a2 = ramp(t, ph2, ph2 + .5);
  if (a1 > 0) { ctx.save(); ctx.globalAlpha = a1; const k = easeOut(ramp(t, 0, .9)); ctx.translate(W / 2, 980); ctx.rotate(-.05 + (1 - k) * .3); ctx.scale(.9 + .1 * k + t * .01, .9 + .1 * k + t * .01); ctx.translate(-W / 2, -980);
    ctx.shadowColor = 'rgba(0,0,0,.7)'; ctx.shadowBlur = 50; ctx.fillStyle = '#efe6d2'; rrect(220, 520, 640, 860, 8); ctx.fill(); ctx.shadowBlur = 0;
    ctx.fillStyle = '#1d2a44'; ctx.fillRect(250, 550, 580, 800);
    ctx.save(); ctx.beginPath(); ctx.rect(250, 550, 580, 800); ctx.clip(); spotlight(540, .9, 300);
    if (sc.portrait && IMG[sc.portrait]) { drawSprite(sc.portrait, 540, 1300, .74, { glow: .4 }); const hg = ctx.createLinearGradient(0, 1150, 0, 1350); hg.addColorStop(0, 'rgba(29,42,68,0)'); hg.addColorStop(1, 'rgba(29,42,68,1)'); ctx.fillStyle = hg; ctx.fillRect(250, 1150, 580, 200); } else drawFigure(540, 1330, .62, mixPose('over', 'over', 0), { back: 'TÜRKİYE', glow: 1 }); ctx.restore();
    ctx.fillStyle = 'rgba(239,230,210,.92)'; ctx.fillRect(250, 550, 580, 70);
    ctx.fillStyle = '#1d2a44'; for (let i = 0; i < 3; i++) ctx.fillRect(280 + i * 60, 572, 40, 26);
    ctx.fillStyle = '#efe6d2'; ctx.font = F.title(64); ctx.textAlign = 'center'; ctx.fillText(sc.headline, 540, 1300);
    ctx.font = F.body(22, 700); spaced(sc.date, 540, 660, 4); ctx.restore(); }
  if (a2 > 0) { ctx.save(); ctx.globalAlpha = a2; const zz = 1 + .04 * ramp(t, ph2, sc.dur); ctx.translate(W / 2, 1100); ctx.scale(zz, zz); ctx.translate(-W / 2, -1100);
    const g = ctx.createLinearGradient(0, 500, 0, 1400); g.addColorStop(0, '#1a2234'); g.addColorStop(1, '#3a2a20'); ctx.fillStyle = g; ctx.fillRect(0, 380, W, 1100);
    ctx.fillStyle = '#d8d2c4'; ctx.fillRect(170, 1000, 740, 260); ctx.fillStyle = '#c9c2b2'; ctx.fillRect(150, 990, 780, 22);
    ctx.beginPath(); ctx.moveTo(380, 990); ctx.lineTo(540, 900); ctx.lineTo(700, 990); ctx.fill();
    for (let i = 0; i < 6; i++) { ctx.fillStyle = '#eee8dc'; ctx.fillRect(395 + i * 56, 1012, 18, 220); }
    ctx.fillStyle = '#2a2a2e'; for (let i = 0; i < 4; i++) { ctx.fillRect(200 + i * 40, 1060, 22, 40); ctx.fillRect(800 + i * 30, 1060, 18, 40); }
    ctx.fillStyle = '#7a7466'; ctx.fillRect(536, 760, 6, 150); ctx.fillStyle = '#c0392b'; ctx.fillRect(542, 762, 60 + Math.sin(t * 3) * 4, 36);
    ctx.fillStyle = '#1a1612'; ctx.fillRect(0, 1260, W, 220);
    ctx.fillStyle = T.ink; ctx.font = F.body(30, 800); ctx.textAlign = 'center'; spaced('WASHINGTON', W / 2, 1360, 8); ctx.restore(); }
};
DRAW.memorial = (sc, t) => {
  background(.35); const dim = 1 - .45 * ramp(t, 0, sc.dur);
  spotlight(W / 2, .8 * dim, 420); platform(1300, 1575); motes(t, 540, .5);
  ctx.save(); ctx.translate(W / 2, FY); ctx.scale(FS, FS); drawBar(-92, 450, 92, 0); ctx.restore();
  for (const it of sc.items || []) { const a = easeOut(ramp(t, it.t, it.t + .7)) * (it.t1 ? 1 - ramp(t, it.t1 - .5, it.t1) : 1); if (a <= 0) continue;
    ctx.save(); ctx.globalAlpha = a;
    if (it.full) { ctx.fillStyle = '#0c0a08'; ctx.fillRect(0, 380, W, 1120); }
    if (it.kind === 'order') { medal(W / 2, 820, 120, a, ''); ctx.fillStyle = T.ink; ctx.font = F.body(30, 700); ctx.textAlign = 'center'; spaced(it.l, W / 2, 1010, 5); }
    if (it.kind === 'years') { ctx.fillStyle = T.ink; ctx.font = F.title(110); ctx.textAlign = 'center'; ctx.fillText(it.l, W / 2, 880); ctx.fillStyle = T.acc; ctx.fillRect(W / 2 - 60, 930, 120, 3);
      // mum
      const fl = Math.sin(t * 13) * 3 + Math.sin(t * 7) * 2; ctx.fillStyle = '#e9e0cc'; ctx.fillRect(W / 2 - 14, 1040, 28, 120);
      ctx.save(); ctx.globalCompositeOperation = 'lighter'; const g = ctx.createRadialGradient(W / 2, 1020, 0, W / 2, 1020, 160); g.addColorStop(0, 'rgba(255,190,90,.5)'); g.addColorStop(1, 'rgba(0,0,0,0)'); ctx.fillStyle = g; ctx.fillRect(W / 2 - 160, 860, 320, 320); ctx.restore();
      ctx.fillStyle = '#ffd37a'; ctx.beginPath(); ctx.ellipse(W / 2 + fl * .3, 1018, 9, 22 + fl, 0, 0, Math.PI * 2); ctx.fill(); }
    if (it.kind === 'metro') { const y = 860, k = ease(ramp(t, it.t, it.t + 1.6));
      ctx.strokeStyle = '#7c4dbd'; ctx.lineWidth = 22; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(80, y); ctx.lineTo(80 + 920 * k, y); ctx.stroke();
      ctx.strokeStyle = '#2f9e6e'; ctx.beginPath(); ctx.moveTo(540 - 300 * k, y - 330 * k); ctx.lineTo(540, y); ctx.lineTo(780, y - 260 * k); ctx.stroke();
      for (const x of [180, 340, 740, 900]) if (x < 80 + 920 * k) { ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(x, y, 16, 0, Math.PI * 2); ctx.fill(); }
      const b = ramp(t, it.t + 1.2, it.t + 1.8); ctx.globalAlpha = a * b; ctx.fillStyle = '#fff'; ctx.strokeStyle = '#111'; ctx.lineWidth = 8; ctx.beginPath(); ctx.arc(540, y, 30, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
      ctx.fillStyle = 'rgba(12,10,8,.92)'; rrect(110, y + 330, 860, 150, 16); ctx.fill(); ctx.strokeStyle = 'rgba(255,255,255,.4)'; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(540, y + 34); ctx.lineTo(540, y + 330); ctx.stroke(); ctx.fillStyle = T.ink; ctx.font = F.body(48, 800); ctx.textAlign = 'center'; ctx.fillText(it.l1, 540, y + 400); ctx.fillStyle = T.dim; ctx.font = F.body(26, 600); ctx.fillText(it.l2, 540, y + 450); }
    if (it.kind === 'house') { const zz = 1 + .05 * ramp(t, it.t, sc.dur); ctx.translate(W / 2, 1100); ctx.scale(zz, zz); ctx.translate(-W / 2, -1100);
      const g = ctx.createLinearGradient(0, 380, 0, 1400); g.addColorStop(0, '#141a2a'); g.addColorStop(1, '#4a2c1c'); ctx.fillStyle = g; ctx.fillRect(0, 380, W, 1120);
      ctx.fillStyle = '#100c0a'; ctx.fillRect(0, 1300, W, 200);
      const x0 = 250, y0 = 760, w = 580, h = 540; ctx.fillStyle = '#5a4c40'; ctx.fillRect(x0, y0, w, h);
      const r = rng(8); ctx.strokeStyle = 'rgba(30,22,16,.6)'; ctx.lineWidth = 3; for (let yy = y0; yy < y0 + h; yy += 34) for (let xx = x0 + (r() * 30); xx < x0 + w; xx += 50 + r() * 30) { ctx.strokeRect(xx, yy, 46 + r() * 20, 34); }
      ctx.fillStyle = '#2a1c14'; ctx.beginPath(); ctx.moveTo(x0 - 40, y0); ctx.lineTo(x0 + w / 2, y0 - 150); ctx.lineTo(x0 + w + 40, y0); ctx.fill();
      ctx.fillStyle = '#3a2618'; ctx.fillRect(x0 - 10, y0 + 240, w + 20, 18); for (let i = 0; i < 14; i++) ctx.fillRect(x0 + i * 43, y0 + 258, 8, 50);
      for (const [wx, wy] of [[x0 + 70, y0 + 70], [x0 + 250, y0 + 70], [x0 + 430, y0 + 70], [x0 + 70, y0 + 340], [x0 + 430, y0 + 340]]) { ctx.fillStyle = `rgba(255,196,110,${.75 + .15 * Math.sin(t * 2 + wx)})`; ctx.fillRect(wx, wy, 80, 110); ctx.fillStyle = '#2a1c14'; ctx.fillRect(wx + 37, wy, 6, 110); ctx.fillRect(wx, wy + 52, 80, 6); }
      ctx.fillStyle = '#2a1c14'; ctx.fillRect(x0 + 245, y0 + 360, 90, 180); ctx.fillStyle = '#d9a441'; rrect(x0 + 200, y0 + 300, 180, 46, 6); ctx.fill(); ctx.fillStyle = '#1a120c'; ctx.font = F.body(26, 800); ctx.textAlign = 'center'; ctx.fillText(it.l1, x0 + 290, y0 + 332);
      ctx.save(); ctx.globalCompositeOperation = 'lighter'; const lg = ctx.createRadialGradient(540, 1100, 50, 540, 1100, 600); lg.addColorStop(0, 'rgba(255,180,90,.16)'); lg.addColorStop(1, 'rgba(0,0,0,0)'); ctx.fillStyle = lg; ctx.fillRect(0, 500, W, 1000); ctx.restore(); }
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
  for (const s of EP.scenes) { out.scenes.push({ name: s.name, start: t, dur: s.dur, mood: s.mood || 'warm', energy: s.energy || null, duck: s.duck || [], sfx: (s.sfx || []).map(([tt, k]) => [t + tt, k]) }); t += s.dur; }
  out.total = t; return out;
}
function renderScene(name, t, frame) {
  const sc = EP.scenes.find(s => s.name === name);
  ctx.save(); ctx.clearRect(0, 0, W, H);
  // kamera: yavaş itme + sarsıntı
  ctx.save(); const push = 1 + (sc.push ?? .03) * ease(t / sc.dur); let sx = 0, sy = 0;
  for (const [st, amp] of sc.shake || []) { const k = 1 - ramp(t, st, st + .5); if (t >= st && k > 0) { sx += Math.sin(t * 90) * amp * k; sy += Math.cos(t * 77) * amp * k; } }
  ctx.translate(W / 2 + sx, H / 2 + sy); ctx.scale(push, push); ctx.translate(-W / 2, -H / 2);
  DRAW[sc.type](sc, t); ctx.restore();
  header(sc, t); if (sc.type !== 'title' && sc.type !== 'outro') seriesTag(); subs(sc, t);
  if (sc.sprites || sc.portrait) { ctx.save(); ctx.globalAlpha = .55; ctx.fillStyle = T.dim; ctx.font = F.body(20, 600); ctx.textAlign = 'right'; ctx.fillText('Temsili illüstrasyon', W - 40, 1800); ctx.restore(); }
  post(frame || Math.floor(t * 30));
  // ışık sızıntısı (sahne girişinde)
  if (sc.leak !== false && t < .9) { const k = 1 - ramp(t, 0, .9); ctx.save(); ctx.globalCompositeOperation = 'lighter';
    const g = ctx.createLinearGradient(-200 + t * 900, 0, 500 + t * 900, H); g.addColorStop(0, 'rgba(255,140,60,0)'); g.addColorStop(.5, `rgba(255,150,70,${.22 * k})`); g.addColorStop(1, 'rgba(255,140,60,0)');
    ctx.fillStyle = g; ctx.fillRect(0, 0, W, H); ctx.restore(); }
  const fi = sc.fadeIn ?? .35, fo = sc.fadeOut ?? .3;
  const a = Math.min(fi ? ramp(t, 0, fi) : 1, fo ? 1 - ramp(t, sc.dur - fo, sc.dur) : 1);
  if (a < 1) { ctx.fillStyle = `rgba(0,0,0,${1 - a})`; ctx.fillRect(0, 0, W, H); }
  if (sc.flash) for (const ft of sc.flash) { const k = 1 - ramp(t, ft, ft + .35); if (t >= ft && k > 0) { ctx.fillStyle = `rgba(255,240,215,${k * .7})`; ctx.fillRect(0, 0, W, H); } }
  ctx.restore();
  return cv.toDataURL('image/jpeg', 0.9);
}
