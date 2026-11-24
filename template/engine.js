// ===== Generic tactical preview engine. Match data comes from window.M (matches/*.js) =====
const W = 1080, H = 1920;
const cv = document.getElementById('c');
const ctx = cv.getContext('2d');
const DISP = '"Barlow Condensed"', BODY = 'Inter';
let MINTAG = 15;
const TH = M.theme;                       // TH.h / TH.a team themes
const ACC = TH.acc, DANGER = TH.danger;
const COL = { bg: '#05080F', white: '#F2F5F8', grey: '#8C9AB0', ink: '#0A0F1A' };
const tcol = c => c === 'acc' ? ACC : c === 'danger' ? DANGER : c;

// ---------- math ----------
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const lerp = (a, b, t) => a + (b - a) * t;
const eio = t => { t = clamp(t, 0, 1); return t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; };
const eout = t => { t = clamp(t, 0, 1); return 1 - Math.pow(1 - t, 3); };
const eexp = t => { t = clamp(t, 0, 1); return t === 1 ? 1 : 1 - Math.pow(2, -10 * t); };
const eback = t => { t = clamp(t, 0, 1); const c1 = 1.70158, c3 = c1 + 1; return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2); };
const seg = (t, a, b) => clamp((t - a) / (b - a), 0, 1);
function rgba(hex, a) { const n = parseInt(hex.slice(1), 16); return `rgba(${n >> 16 & 255},${n >> 8 & 255},${n & 255},${a})`; }
const mix = (c, k) => c; // placeholder

// ---------- camera ----------
function makeCam(c) {
  const T = [(c.x - .5) * 68, (c.y - .5) * 105, 0];
  const el = c.el * Math.PI / 180, yw = c.yaw * Math.PI / 180;
  const d = [Math.sin(yw) * Math.cos(el), Math.cos(yw) * Math.cos(el), Math.sin(el)];
  const C = [T[0] + d[0] * c.dist, T[1] + d[1] * c.dist, T[2] + d[2] * c.dist];
  const f = [-d[0], -d[1], -d[2]];
  const up = [0, 0, 1];
  let r = [up[1] * f[2] - up[2] * f[1], up[2] * f[0] - up[0] * f[2], up[0] * f[1] - up[1] * f[0]];
  const rl = Math.hypot(...r); r = r.map(v => v / rl);
  const u = [f[1] * r[2] - f[2] * r[1], f[2] * r[0] - f[0] * r[2], f[0] * r[1] - f[1] * r[0]];
  const F = c.F || 1500, cx = W / 2, cy = H * 0.5 + (c.oy || 0);
  return {
    pw(X, Y, Z = 0) {
      const p = [X - C[0], Y - C[1], Z - C[2]];
      const xc = p[0] * r[0] + p[1] * r[1] + p[2] * r[2];
      const yc = p[0] * u[0] + p[1] * u[1] + p[2] * u[2];
      const zc = p[0] * f[0] + p[1] * f[1] + p[2] * f[2];
      return { x: cx + F * xc / zc, y: cy - F * yc / zc, s: F / zc, z: zc };
    },
    cs(X, Y, Z = 0) { const p = [X - C[0], Y - C[1], Z - C[2]]; return [p[0] * r[0] + p[1] * r[1] + p[2] * r[2], p[0] * u[0] + p[1] * u[1] + p[2] * u[2], p[0] * f[0] + p[1] * f[1] + p[2] * f[2]]; },
    pr(c) { return { x: cx + F * c[0] / c[2], y: cy - F * c[1] / c[2], s: F / c[2], z: c[2] }; },
    pn(x, y, z = 0) { return this.pw((x - .5) * 68, (y - .5) * 105, z); }
  };
}
function camAt(keys, t) {
  if (t <= keys[0][0]) return keys[0][1];
  for (let i = 0; i < keys.length - 1; i++) {
    const [t0, a] = keys[i], [t1, b] = keys[i + 1];
    if (t >= t0 && t <= t1) { const u = eio((t - t0) / (t1 - t0)); const o = {}; for (const k in a) o[k] = lerp(a[k], b[k] ?? a[k], u); return o; }
  }
  return keys[keys.length - 1][1];
}

// ---------- post fx ----------
const grain = document.createElement('canvas'); grain.width = grain.height = 256;
{ const g = grain.getContext('2d'); const id = g.createImageData(256, 256);
  for (let i = 0; i < id.data.length; i += 4) { const v = Math.random() * 255; id.data[i] = id.data[i + 1] = id.data[i + 2] = v; id.data[i + 3] = 255; }
  g.putImageData(id, 0, 0); }
let FRAME = 0;
function postFX() {
  const g = ctx.createRadialGradient(W / 2, H * .48, H * .25, W / 2, H * .5, H * .75);
  g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(1, 'rgba(0,0,0,.55)');
  ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  ctx.save(); ctx.globalAlpha = .045; ctx.globalCompositeOperation = 'overlay';
  const p = ctx.createPattern(grain, 'repeat');
  ctx.translate((FRAME * 37) % 256, (FRAME * 91) % 256);
  ctx.fillStyle = p; ctx.fillRect(-256, -256, W + 512, H + 512);
  ctx.restore();
}

// ---------- pitch ----------
const NEAR = 3;
function polyPath(cam, pts, closed = false) {
  const C = pts.map(p => cam.cs(p[0], p[1], p[2] || 0));
  ctx.beginPath();
  const cut = (a, b) => { const u = (NEAR - a[2]) / (b[2] - a[2]); return [lerp(a[0], b[0], u), lerp(a[1], b[1], u), NEAR]; };
  if (closed) { // Sutherland–Hodgman against z >= NEAR
    const out = [];
    for (let i = 0; i < C.length; i++) {
      const a = C[i], b = C[(i + 1) % C.length], ain = a[2] >= NEAR, bin = b[2] >= NEAR;
      if (ain) out.push(a);
      if (ain !== bin) out.push(cut(a, b));
    }
    out.forEach((c, i) => { const q = cam.pr(c); i ? ctx.lineTo(q.x, q.y) : ctx.moveTo(q.x, q.y); });
    return;
  }
  let pen = false;
  for (let i = 0; i < C.length - 1; i++) {
    let a = C[i], b = C[i + 1];
    const ain = a[2] >= NEAR, bin = b[2] >= NEAR;
    if (!ain && !bin) { pen = false; continue; }
    if (!ain) { a = cut(a, b); pen = false; }
    if (!bin) b = cut(a, b);
    const qa = cam.pr(a), qb = cam.pr(b);
    if (!pen) ctx.moveTo(qa.x, qa.y);
    ctx.lineTo(qb.x, qb.y); pen = bin;
  }
}
function circlePts(cx, cy, r, a0 = 0, a1 = Math.PI * 2, n = 64) { const o = []; for (let i = 0; i <= n; i++) { const a = a0 + (a1 - a0) * i / n; o.push([cx + Math.cos(a) * r, cy + Math.sin(a) * r]); } return o; }
function drawPitch(cam, t, dim = 1) {
  const bg = ctx.createLinearGradient(0, 0, 0, H);
  bg.addColorStop(0, '#03060C'); bg.addColorStop(.5, '#07111C'); bg.addColorStop(1, '#03060C');
  ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);
  polyPath(cam, [[-48, -66], [48, -66], [48, 66], [-48, 66]], true); ctx.closePath(); ctx.fillStyle = '#0B2A17'; ctx.fill();
  const n = 14;
  for (let i = 0; i < n; i++) {
    const y0 = -52.5 + 105 * i / n, y1 = -52.5 + 105 * (i + 1) / n;
    polyPath(cam, [[-34, y0], [34, y0], [34, y1], [-34, y1]], true); ctx.closePath();
    ctx.fillStyle = i % 2 ? '#1F7A3C' : '#1B6E36'; ctx.fill();
  }
  const q0 = cam.pw(0, -52.5), q1 = cam.pw(0, 52.5);
  const lg = ctx.createLinearGradient(0, q0.y, 0, q1.y);
  lg.addColorStop(0, 'rgba(0,0,0,0.35)'); lg.addColorStop(.55, 'rgba(255,255,255,0.03)'); lg.addColorStop(1, 'rgba(0,0,0,0.25)');
  polyPath(cam, [[-48, -66], [48, -66], [48, 66], [-48, 66]], true); ctx.closePath(); ctx.fillStyle = lg; ctx.fill();
  ctx.save();
  ctx.strokeStyle = 'rgba(235,245,240,0.85)'; ctx.lineJoin = 'round';
  ctx.shadowColor = 'rgba(255,255,255,0.35)'; ctx.shadowBlur = 6;
  const lw = Math.max(1.5, cam.pw(0, 0).s * 0.14);
  ctx.lineWidth = lw;
  const L = pts => { polyPath(cam, pts); ctx.stroke(); };
  L([[-34, -52.5], [34, -52.5], [34, 52.5], [-34, 52.5], [-34, -52.5]]);
  L([[-34, 0], [34, 0]]);
  L(circlePts(0, 0, 9.15));
  for (const s of [-1, 1]) {
    const gy = 52.5 * s;
    L([[-20.15, gy], [-20.15, gy - 16.5 * s], [20.15, gy - 16.5 * s], [20.15, gy]]);
    L([[-9.16, gy], [-9.16, gy - 5.5 * s], [9.16, gy - 5.5 * s], [9.16, gy]]);
    const sy = gy - 11 * s, a = Math.acos(5.5 / 9.15);
    L(s > 0 ? circlePts(0, sy, 9.15, Math.PI + a, Math.PI * 2 - a, 24) : circlePts(0, sy, 9.15, a, Math.PI - a, 24));
    ctx.lineWidth = lw * 1.3;
    L([[-3.66, gy, 0], [-3.66, gy, 2.44], [3.66, gy, 2.44], [3.66, gy, 0]]);
    ctx.save(); ctx.globalAlpha = .35; ctx.lineWidth = lw * .6;
    L([[-3.66, gy, 2.44], [-3.66, gy + 2 * s, 1.6], [3.66, gy + 2 * s, 1.6], [3.66, gy, 2.44]]);
    L([[-3.66, gy + 2 * s, 1.6], [-3.66, gy + 2 * s, 0]]); L([[3.66, gy + 2 * s, 1.6], [3.66, gy + 2 * s, 0]]);
    ctx.restore(); ctx.lineWidth = lw;
  }
  ctx.restore();
  ctx.save(); ctx.globalCompositeOperation = 'lighter';
  for (const x of [-0.1, 1.1]) {
    const g = ctx.createRadialGradient(W * x, -100, 0, W * x, -100, 1300);
    g.addColorStop(0, 'rgba(190,215,255,.10)'); g.addColorStop(1, 'rgba(190,215,255,0)');
    ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  }
  ctx.restore();
  if (dim < 1) { ctx.fillStyle = `rgba(3,6,12,${1 - dim})`; ctx.fillRect(0, 0, W, H); }
}

// ---------- players ----------
const P = M.players;           // id -> [NAME, 'h'|'a']
const side = pid => P[pid][1];
function drawToken(cam, pid, x, y, opt = {}) {
  const th = TH[side(pid)];
  const z = opt.z ?? 0;
  const g = cam.pn(x, y, 0), c = cam.pn(x, y, 1.05 + z);
  const s = c.s * (opt.big || 1), r = clamp(s * 0.95, 9, 60);
  ctx.save(); ctx.globalAlpha = opt.alpha ?? 1;
  ctx.fillStyle = 'rgba(0,0,0,0.45)';
  ctx.beginPath(); ctx.ellipse(g.x, g.y, r * 1.05, r * 0.42, 0, 0, Math.PI * 2); ctx.fill();
  if (opt.hl) {
    const k = opt.hl;
    ctx.save(); ctx.globalCompositeOperation = 'lighter';
    const beam = ctx.createLinearGradient(0, c.y - r * 7, 0, g.y);
    beam.addColorStop(0, rgba(ACC, 0)); beam.addColorStop(1, rgba(ACC, .35 * k));
    ctx.fillStyle = beam; ctx.fillRect(c.x - r * .9, c.y - r * 7, r * 1.8, g.y - c.y + r * 7);
    ctx.restore();
    const pr = 1 + .25 * Math.sin(opt.time * 6);
    ctx.strokeStyle = rgba(ACC, .9 * k); ctx.lineWidth = Math.max(2, s * .16);
    ctx.shadowColor = ACC; ctx.shadowBlur = 16;
    ctx.beginPath(); ctx.ellipse(g.x, g.y, r * 1.6 * pr, r * .65 * pr, 0, 0, Math.PI * 2); ctx.stroke();
    ctx.shadowBlur = 0;
  }
  const gr = ctx.createRadialGradient(c.x - r * .35, c.y - r * .4, r * .1, c.x, c.y, r);
  gr.addColorStop(0, th.tok[0]); gr.addColorStop(.6, th.tok[1]); gr.addColorStop(1, th.tok[2]);
  ctx.shadowColor = 'rgba(0,0,0,.5)'; ctx.shadowBlur = 10; ctx.shadowOffsetY = 3;
  ctx.fillStyle = gr; ctx.beginPath(); ctx.arc(c.x, c.y, r, 0, Math.PI * 2); ctx.fill();
  ctx.shadowBlur = 0; ctx.shadowOffsetY = 0;
  ctx.lineWidth = Math.max(2, r * .16); ctx.strokeStyle = th.tokRim; ctx.stroke();
  ctx.fillStyle = 'rgba(255,255,255,.35)';
  ctx.beginPath(); ctx.ellipse(c.x - r * .2, c.y - r * .45, r * .5, r * .22, -.3, 0, Math.PI * 2); ctx.fill();
  ctx.restore();
  return { x: c.x, y: c.y, r, s };
}
function drawTag(t, pid, hl, alpha = 1) {
  const name = P[pid][0], th = TH[side(pid)];
  const fs = Math.round(clamp(t.s * (hl ? 1.5 : 1.15), MINTAG, hl ? 40 : 30));
  ctx.save(); ctx.globalAlpha = alpha;
  ctx.font = `700 ${fs}px ${DISP}`; ctx.letterSpacing = '1px';
  const tw = ctx.measureText(name).width;
  const h = fs * 1.35, x = t.x - tw / 2 - 10, y = t.y - t.r - h - 8;
  ctx.fillStyle = hl ? ACC : 'rgba(6,10,18,.82)';
  ctx.beginPath(); ctx.roundRect(x, y, tw + 20, h, 5); ctx.fill();
  ctx.fillStyle = th.tagBar; ctx.fillRect(x, y, 4, h);
  ctx.fillStyle = hl ? COL.ink : COL.white; ctx.textBaseline = 'middle'; ctx.textAlign = 'left';
  ctx.fillText(name, x + 12, y + h / 2 + 1);
  ctx.restore();
}

// ---------- simulation ----------
function makeSim(spec) {
  const tracks = {};
  for (const pid in spec.base) tracks[pid] = [[0, spec.base[pid]]];
  [...spec.moves].sort((a, b) => a[0] - b[0]).forEach(([t0, t1, pid, tg]) => { const tr = tracks[pid]; const last = tr[tr.length - 1][1]; tr.push([t0, last]); tr.push([t1, tg]); });
  const pos = (pid, t) => {
    const tr = tracks[pid];
    if (t <= tr[0][0]) return tr[0][1];
    for (let i = 0; i < tr.length - 1; i++) {
      const [t0, a] = tr[i], [t1, b] = tr[i + 1];
      if (t >= t0 && t <= t1) { const u = t1 > t0 ? eio((t - t0) / (t1 - t0)) : 1; return [lerp(a[0], b[0], u), lerp(a[1], b[1], u)]; }
    }
    return tr[tr.length - 1][1];
  };
  const keys = spec.ball;
  const R = (k, t) => { if (typeof k[1] === 'string') { const p = pos(k[1], t); const dir = side(k[1]) === 'h' ? -1 : 1; return [p[0], p[1] + dir * 0.009]; } return k[1]; };
  const passes = [];
  for (let i = 0; i < keys.length - 1; i++) {
    const a = keys[i], b = keys[i + 1];
    if (typeof a[1] === 'string' && a[1] === b[1]) continue;
    const A = R(a, a[0]), B = R(b, b[0]);
    if (Math.hypot(A[0] - B[0], A[1] - B[1]) < 0.01) continue;
    const shot = B[1] <= 0.01 || B[1] >= 0.98;
    const dm = Math.hypot((A[0] - B[0]) * 68, (A[1] - B[1]) * 105);
    passes.push({ t0: a[0], t1: b[0], A, B, shot, h: b[2]?.h ?? (shot ? 1.3 : clamp(dm * 0.07, 0.25, 4)) });
  }
  const ff = (spec.flashes || []).map(f => f[0]);
  passes.forEach(p => { p.gold = p.shot || ff.some(f => p.t1 <= f + .05 && p.t1 >= f - 2.2) || (spec.goldAfter != null && p.t0 >= spec.goldAfter); });
  const ball = t => {
    if (t <= keys[0][0]) { const p = R(keys[0], t); return [p[0], p[1], 0.11]; }
    for (let i = 0; i < keys.length - 1; i++) {
      const a = keys[i], b = keys[i + 1];
      if (t >= a[0] && t <= b[0]) {
        if (typeof a[1] === 'string' && a[1] === b[1]) { const p = R(a, t); return [p[0], p[1], 0.11]; }
        const A = R(a, a[0]), B = R(b, b[0]);
        const u = b[0] > a[0] ? (t - a[0]) / (b[0] - a[0]) : 1;
        const pp = passes.find(p => p.t0 === a[0]);
        return [lerp(A[0], B[0], u), lerp(A[1], B[1], u), 0.11 + (pp ? 4 * pp.h * u * (1 - u) : 0)];
      }
    }
    const p = R(keys[keys.length - 1], t); return [p[0], p[1], 0.11];
  };
  return { spec, pos, ball, passes };
}
function groundArrowHead(cam, A, B, col, alpha, size = 1.6) {
  const dx = (B[0] - A[0]) * 68, dy = (B[1] - A[1]) * 105, L = Math.hypot(dx, dy) || 1;
  const ux = dx / L, uy = dy / L, X = (B[0] - .5) * 68, Y = (B[1] - .5) * 105;
  const pts = [[X, Y], [X - ux * size * 1.6 - uy * size, Y - uy * size * 1.6 + ux * size], [X - ux * size * 1.6 + uy * size, Y - uy * size * 1.6 - ux * size]];
  ctx.save(); ctx.globalAlpha = alpha; ctx.fillStyle = col; ctx.shadowColor = col; ctx.shadowBlur = 14;
  polyPath(cam, pts, true); ctx.closePath(); ctx.fill(); ctx.restore();
}
function drawArcPass(cam, p, t) {
  if (t < p.t0) return;
  const prog = clamp((t - p.t0) / (p.t1 - p.t0), 0, 1);
  const fade = 1 - seg(t, p.t1 + 2.2, p.t1 + 3.0);
  if (fade <= 0) return;
  const col = p.gold ? ACC : '#FFFFFF';
  const pts = [], n = 40;
  for (let i = 0; i <= n * prog; i++) { const u = i / n; pts.push(cam.pn(lerp(p.A[0], p.B[0], u), lerp(p.A[1], p.B[1], u), 0.11 + 4 * p.h * u * (1 - u))); }
  if (pts.length < 2) return;
  ctx.save(); ctx.globalAlpha = fade; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  const lw = clamp(pts[pts.length - 1].s * .32, 3, 12);
  ctx.shadowColor = col; ctx.shadowBlur = 22; ctx.strokeStyle = rgba(col, .45); ctx.lineWidth = lw * 2.2;
  ctx.beginPath(); pts.forEach((q, i) => i ? ctx.lineTo(q.x, q.y) : ctx.moveTo(q.x, q.y)); ctx.stroke();
  ctx.shadowBlur = 0; ctx.strokeStyle = col; ctx.lineWidth = lw * .8; ctx.stroke();
  ctx.globalAlpha = fade * .25; ctx.strokeStyle = '#000'; ctx.lineWidth = lw * .7; ctx.beginPath();
  for (let i = 0; i <= n * prog; i++) { const u = i / n; const q = cam.pn(lerp(p.A[0], p.B[0], u), lerp(p.A[1], p.B[1], u), 0); i ? ctx.lineTo(q.x, q.y) : ctx.moveTo(q.x, q.y); }
  ctx.stroke(); ctx.restore();
  if (prog >= 1) groundArrowHead(cam, p.A, p.B, col, fade, 1.8);
}
function drawRun(cam, sim, run, t) {
  const [pid, t0, t1, kind] = run;
  const a = seg(t, t0 - .35, t0) * (1 - seg(t, t1 + 1.6, t1 + 2.3));
  if (a <= 0) return;
  const pts = [], n = 30;
  for (let i = 0; i <= n; i++) pts.push(sim.pos(pid, lerp(t0, t1, i / n)));
  const col = kind === 'drib' ? ACC : TH[side(pid)].run;
  ctx.save(); ctx.globalAlpha = a; ctx.setLineDash(kind === 'drib' ? [2, 14] : [18, 12]);
  ctx.lineDashOffset = -t * 70; ctx.lineCap = 'round'; ctx.strokeStyle = col; ctx.lineWidth = kind === 'drib' ? 9 : 7; ctx.shadowColor = col; ctx.shadowBlur = 12;
  ctx.beginPath(); pts.forEach((p, i) => { const q = cam.pn(p[0], p[1], 0.05); i ? ctx.lineTo(q.x, q.y) : ctx.moveTo(q.x, q.y); }); ctx.stroke();
  ctx.restore();
  groundArrowHead(cam, pts[n - 3], pts[n], col, a, 1.5);
}
function drawZone(cam, z, t) {
  const [t0, t1, c, rx, ry] = z;
  const a = seg(t, t0, t0 + .5) * (1 - seg(t, t1, t1 + .5));
  if (a <= 0) return;
  const col = tcol(c[2] || 'acc');
  const pts = [], RX = rx * 68, RY = ry * 105, X = (c[0] - .5) * 68, Y = (c[1] - .5) * 105;
  for (let i = 0; i <= 64; i++) { const an = i / 64 * Math.PI * 2; pts.push([X + Math.cos(an) * RX, Y + Math.sin(an) * RY]); }
  const cc = cam.pw(X, Y), e = cam.pw(X + RX, Y);
  ctx.save(); ctx.globalAlpha = a;
  const g = ctx.createRadialGradient(cc.x, cc.y, 0, cc.x, cc.y, Math.abs(e.x - cc.x) * 1.1 + 1);
  g.addColorStop(0, rgba(col, .32)); g.addColorStop(1, rgba(col, .05));
  polyPath(cam, pts, true); ctx.closePath(); ctx.fillStyle = g; ctx.fill();
  ctx.setLineDash([14, 10]); ctx.lineDashOffset = t * 40; ctx.lineWidth = 4; ctx.strokeStyle = rgba(col, .9);
  ctx.shadowColor = col; ctx.shadowBlur = 12; ctx.stroke(); ctx.restore();
  if (z[5]) groundLabel(cam, c[0], c[1], z[5], col, a);
}
function groundLabel(cam, x, y, label, col, alpha) {
  const q = cam.pn(x, y, 0);
  const fs = Math.round(clamp(q.s * 1.1, 18, 34));
  ctx.save(); ctx.globalAlpha = alpha; ctx.font = `800 italic ${fs}px ${DISP}`; ctx.letterSpacing = '3px';
  const tw = ctx.measureText(label).width;
  skewRect(q.x - tw / 2 - 14, q.y - fs * .75, tw + 28, fs * 1.4, 8, 'rgba(5,8,15,.78)');
  ctx.fillStyle = col; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(label, q.x + 4, q.y);
  ctx.restore();
}
function drawDefLine(cam, sim, ln, t) {
  const [t0, t1, pids, label] = ln;
  const a = seg(t, t0, t0 + .4) * (1 - seg(t, t1, t1 + .4));
  if (a <= 0) return;
  const y = pids.reduce((acc, p) => acc + sim.pos(p, t)[1], 0) / pids.length;
  const Y = (y - .5) * 105;
  ctx.save(); ctx.globalAlpha = a;
  ctx.setLineDash([26, 14]); ctx.lineDashOffset = -t * 50; ctx.lineWidth = 6; ctx.strokeStyle = ACC; ctx.shadowColor = ACC; ctx.shadowBlur = 16;
  polyPath(cam, [[-34, Y, .05], [34, Y, .05]]); ctx.stroke();
  ctx.restore();
  groundLabel(cam, .2, y + .03, label, ACC, a);
}
function drawBall(cam, b, sim, t) {
  ctx.save(); ctx.lineCap = 'round';
  for (let k = 1; k <= 8; k++) {
    const q0 = cam.pn(...sim.ball(t - (k - 1) * .025)), q1 = cam.pn(...sim.ball(t - k * .025));
    if (Math.hypot(q0.x - q1.x, q0.y - q1.y) < 1) break;
    ctx.strokeStyle = `rgba(255,255,255,${.5 * (1 - k / 9)})`; ctx.lineWidth = clamp(q0.s * .35, 3, 14) * (1 - k / 10);
    ctx.beginPath(); ctx.moveTo(q0.x, q0.y); ctx.lineTo(q1.x, q1.y); ctx.stroke();
  }
  ctx.restore();
  const g = cam.pn(b[0], b[1], 0), q = cam.pn(b[0], b[1], b[2]);
  const r = clamp(q.s * .3, 6, 18);
  ctx.fillStyle = 'rgba(0,0,0,.5)'; ctx.beginPath(); ctx.ellipse(g.x, g.y, r, r * .4, 0, 0, Math.PI * 2); ctx.fill();
  const gr = ctx.createRadialGradient(q.x - r * .3, q.y - r * .3, r * .1, q.x, q.y, r); gr.addColorStop(0, '#fff'); gr.addColorStop(1, '#BFC7D1');
  ctx.save(); ctx.shadowColor = 'rgba(255,255,255,.9)'; ctx.shadowBlur = 18; ctx.fillStyle = gr; ctx.beginPath(); ctx.arc(q.x, q.y, r, 0, Math.PI * 2); ctx.fill(); ctx.restore();
}
function drawSimFrame(sim, cam, t, opt = {}) {
  const sp = sim.spec;
  (sp.zones || []).forEach(z => drawZone(cam, z, t));
  (sp.lines || []).forEach(l => drawDefLine(cam, sim, l, t));
  (sp.runs || []).forEach(r => drawRun(cam, sim, r, t));
  const list = Object.keys(sp.base).map(pid => { const p = sim.pos(pid, t); return { pid, p, d: cam.pn(p[0], p[1]).z }; }).sort((a, b) => b.d - a.d);
  const hlOf = pid => { let h = 0; (sp.hls || []).forEach(([a, b, id]) => { if (id === pid) h = Math.max(h, seg(t, a, a + .3) * (1 - seg(t, b, b + .3))); }); return h; };
  ctx.save();
  list.forEach(({ pid }) => {
    const p0 = sim.pos(pid, t), p1 = sim.pos(pid, t - .25);
    if (Math.hypot((p0[0] - p1[0]) * 68, (p0[1] - p1[1]) * 105) < .6) return;
    const q0 = cam.pn(p0[0], p0[1], 1), q1 = cam.pn(p1[0], p1[1], 1);
    const g = ctx.createLinearGradient(q1.x, q1.y, q0.x, q0.y); const c = TH[side(pid)].trail;
    g.addColorStop(0, rgba(c, 0)); g.addColorStop(1, rgba(c, .45));
    ctx.strokeStyle = g; ctx.lineWidth = clamp(q0.s * 1.4, 8, 60); ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(q1.x, q1.y); ctx.lineTo(q0.x, q0.y); ctx.stroke();
  });
  ctx.restore();
  sim.passes.forEach(p => { if (p.t1 <= t) drawArcPass(cam, p, t); });
  const toks = list.map(({ pid, p }) => ({ pid, hl: hlOf(pid), tok: drawToken(cam, pid, p[0], p[1], { big: opt.big, hl: hlOf(pid), time: t, z: opt.dropZ ? opt.dropZ(pid) : 0, alpha: opt.alphaOf ? opt.alphaOf(pid) : 1 }) }));
  sim.passes.forEach(p => { if (p.t1 > t) drawArcPass(cam, p, t); });
  if (!opt.noBall) drawBall(cam, sim.ball(t), sim, t);
  toks.forEach(o => { if (!o.hl) drawTag(o.tok, o.pid, false, opt.alphaOf ? opt.alphaOf(o.pid) : 1); });
  toks.forEach(o => { if (o.hl) drawTag(o.tok, o.pid, true); });
}

// ---------- HUD ----------
function text(s, x, y, font, col, align = 'left', ls = '0px', base = 'alphabetic') { ctx.font = font; ctx.fillStyle = col; ctx.textAlign = align; ctx.letterSpacing = ls; ctx.textBaseline = base; ctx.fillText(s, x, y); }
function fitFont(s, weightStyle, size, maxw, ls = '0px') { let fs = size; ctx.letterSpacing = ls; while (fs > 20) { ctx.font = `${weightStyle} ${fs}px ${DISP}`; if (ctx.measureText(s).width <= maxw) break; fs -= 4; } return `${weightStyle} ${fs}px ${DISP}`; }
function wrapLines(s, font, maxw) { ctx.font = font; ctx.letterSpacing = '0px'; const words = s.split(' '), out = []; let cur = ''; for (const w of words) { const tt = cur ? cur + ' ' + w : w; if (ctx.measureText(tt).width <= maxw) cur = tt; else { out.push(cur); cur = w; } } if (cur) out.push(cur); return out; }
function skewRect(x, y, w, h, sk, fill) { ctx.beginPath(); ctx.moveTo(x + sk, y); ctx.lineTo(x + w + sk, y); ctx.lineTo(x + w, y + h); ctx.lineTo(x, y + h); ctx.closePath(); ctx.fillStyle = fill; ctx.fill(); }

function hudTop(t, chapter, kicker, title) {
  const g = ctx.createLinearGradient(0, 0, 0, 420); g.addColorStop(0, 'rgba(3,6,12,.95)'); g.addColorStop(.6, 'rgba(3,6,12,.6)'); g.addColorStop(1, 'rgba(3,6,12,0)');
  ctx.fillStyle = g; ctx.fillRect(0, 0, W, 420);
  const a = eout(seg(t, .15, .6));
  ctx.save(); ctx.globalAlpha = a; ctx.translate(0, (1 - a) * -30);
  skewRect(54, 56, 150, 54, 12, TH.h.col); text(TH.h.code, 135, 95, `800 italic 38px ${DISP}`, TH.h.ink, 'center', '2px');
  skewRect(214, 56, 72, 54, 12, 'rgba(10,16,28,.9)'); text('vs', 256, 93, `700 italic 30px ${DISP}`, COL.grey, 'center');
  skewRect(296, 56, 150, 54, 12, TH.a.col); text(TH.a.code, 377, 95, `800 italic 38px ${DISP}`, TH.a.ink, 'center', '2px');
  ctx.fillStyle = TH.a.stripe; ctx.fillRect(300, 104, 140, 6);
  text(M.hud.comp, 1026, 82, `700 28px ${DISP}`, COL.grey, 'right', '2px');
  text('TAKTİK ÖNGÖRÜ', 1026, 112, `800 italic 26px ${DISP}`, ACC, 'right', '3px');
  ctx.restore();
  const b = eexp(seg(t, .3, 1.0));
  ctx.save(); ctx.beginPath(); ctx.rect(0, 140, W, 220); ctx.clip();
  ctx.translate((1 - b) * -120, 0); ctx.globalAlpha = b;
  text(chapter, 54, 268, `900 italic 128px ${DISP}`, 'rgba(255,255,255,0.08)', 'left');
  ctx.lineWidth = 2; ctx.strokeStyle = rgba(ACC, .7); ctx.font = `900 italic 128px ${DISP}`; ctx.strokeText(chapter, 54, 268);
  skewRect(200, 176, 10, 100, 6, ACC);
  text(kicker, 236, 204, `800 30px ${DISP}`, ACC, 'left', '5px');
  wrapLines(title, `900 italic 66px ${DISP}`, 800).slice(0, 2).forEach((l, i) => text(l, 234, 268 + i * 66, `900 italic 66px ${DISP}`, COL.white, 'left', '1px'));
  ctx.restore();
}
function hudCaption(t, s, dur, y0 = 1560) {
  const g = ctx.createLinearGradient(0, y0 - 140, 0, H); g.addColorStop(0, 'rgba(3,6,12,0)'); g.addColorStop(.35, 'rgba(3,6,12,.85)'); g.addColorStop(1, 'rgba(3,6,12,.97)');
  ctx.fillStyle = g; ctx.fillRect(0, y0 - 140, W, H - y0 + 140);
  const a = eout(seg(t, .5, 1.0));
  ctx.save(); ctx.globalAlpha = a;
  ctx.fillStyle = ACC; ctx.fillRect(60, y0 + 18, 8, 150);
  const font = `600 36px ${BODY}`, lines = wrapLines(s, font, 900);
  const words = s.split(' ').length; let wi = 0;
  const reveal = seg(t, .6, Math.min(dur * .55, 3.6)) * words;
  lines.slice(0, 4).forEach((l, i) => {
    let x = 92; const y = y0 + 52 + i * 50;
    l.split(' ').forEach(w => { const k = clamp(reveal - wi, 0, 1); wi++; ctx.font = font; ctx.letterSpacing = '0px'; ctx.fillStyle = `rgba(242,245,248,${.15 + .85 * k})`; ctx.textAlign = 'left'; ctx.textBaseline = 'alphabetic'; ctx.fillText(w, x, y + (1 - k) * 6); x += ctx.measureText(w + ' ').width; });
  });
  ctx.restore();
}
function flashCallout(t, f) {
  const [t0, t1, s, c, sub] = f; const col = tcol(c);
  if (t < t0 || t > t1 + .4) return;
  const inn = eexp(seg(t, t0, t0 + .35)), out = eio(seg(t, t1, t1 + .4)), y = 720;
  ctx.save();
  const font = fitFont(s, '900 italic', 104, 860, '2px');
  ctx.font = font; const tw = ctx.measureText(s).width;
  const w = tw + 120, x = (W - w) / 2 + (1 - inn) * -W + out * W;
  skewRect(x - 20, y - 20, w + 40, 150, 30, 'rgba(3,6,12,.65)');
  skewRect(x, y, w, 118, 26, col);
  ctx.save(); ctx.beginPath(); ctx.moveTo(x + 26, y); ctx.lineTo(x + w + 26, y); ctx.lineTo(x + w, y + 118); ctx.lineTo(x, y + 118); ctx.closePath(); ctx.clip();
  const sx = x + lerp(-200, w + 200, seg(t, t0 + .2, t0 + .9));
  const sg = ctx.createLinearGradient(sx - 80, 0, sx + 80, 0); sg.addColorStop(0, 'rgba(255,255,255,0)'); sg.addColorStop(.5, 'rgba(255,255,255,.55)'); sg.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = sg; ctx.fillRect(x, y, w + 30, 118); ctx.restore();
  text(s, x + w / 2 + 13, y + 96, font, COL.ink, 'center', '2px');
  if (sub) {
    ctx.font = `700 italic 40px ${DISP}`; ctx.letterSpacing = '2px';
    const sw = ctx.measureText(sub).width + 50;
    const sx2 = (W - sw) / 2 + (1 - eexp(seg(t, t0 + .15, t0 + .5))) * W * .6 + out * W;
    skewRect(sx2, y + 132, sw, 58, 14, 'rgba(6,10,18,.92)');
    text(sub, sx2 + sw / 2 + 7, y + 175, `700 italic 40px ${DISP}`, COL.white, 'center', '2px');
  }
  ctx.restore();
}
function slabs(p, dir = 1) {
  if (p <= 0) return;
  [ACC, TH.h.col, '#0A1424'].forEach((c, i) => {
    const k = eio(clamp(p * 1.5 - i * .25, 0, 1)); if (k <= 0) return;
    const sk = 420, wTot = W + sk + 40; let x0, x1;
    if (dir > 0) { x0 = -sk - 20; x1 = x0 + wTot * k; } else { x1 = W + sk + 20; x0 = x1 - wTot * k; }
    ctx.beginPath(); ctx.moveTo(x0 + sk, 0); ctx.lineTo(x1 + sk, 0); ctx.lineTo(x1, H); ctx.lineTo(x0, H); ctx.closePath(); ctx.fillStyle = c; ctx.fill();
  });
}
function transitions(t, dur, first, last) { if (!first) slabs(1 - seg(t, 0, .5), -1); if (!last) slabs(seg(t, dur - .5, dur), 1); }

// ---------- scenes ----------
function sceneIntro(t, dur) {
  const I = M.intro;
  ctx.fillStyle = COL.bg; ctx.fillRect(0, 0, W, H);
  ctx.save(); ctx.globalCompositeOperation = 'lighter';
  for (let i = 0; i < 7; i++) {
    const x = ((i * 173 + t * (60 + i * 25)) % (W + 600)) - 300;
    const g = ctx.createLinearGradient(x, 0, x + 120, 0); g.addColorStop(0, rgba(TH.h.col, 0)); g.addColorStop(.5, rgba(TH.h.col, .05 + .03 * (i % 3))); g.addColorStop(1, rgba(TH.h.col, 0));
    ctx.fillStyle = g; ctx.save(); ctx.translate(x, 0); ctx.transform(1, 0, -.35, 1, 0, 0); ctx.fillRect(0, 0, 120, H); ctx.restore();
  }
  ctx.restore();
  const a1 = eexp(seg(t, .15, .9)), a2 = eexp(seg(t, .35, 1.1));
  ctx.save(); ctx.translate((1 - a1) * -W, 0);
  let g = ctx.createLinearGradient(0, 420, 0, 960); g.addColorStop(0, TH.h.intro[0]); g.addColorStop(1, TH.h.intro[1]);
  ctx.beginPath(); ctx.moveTo(0, 470); ctx.lineTo(W, 380); ctx.lineTo(W, 900); ctx.lineTo(0, 990); ctx.closePath(); ctx.fillStyle = g; ctx.fill(); ctx.restore();
  ctx.save(); ctx.translate((1 - a2) * W, 0);
  g = ctx.createLinearGradient(0, 990, 0, 1500); g.addColorStop(0, TH.a.intro[0]); g.addColorStop(1, TH.a.intro[1]);
  ctx.beginPath(); ctx.moveTo(0, 1030); ctx.lineTo(W, 940); ctx.lineTo(W, 1460); ctx.lineTo(0, 1550); ctx.closePath(); ctx.fillStyle = g; ctx.fill();
  ctx.fillStyle = TH.a.stripe; ctx.beginPath(); ctx.moveTo(0, 1550); ctx.lineTo(W, 1460); ctx.lineTo(W, 1478); ctx.lineTo(0, 1568); ctx.closePath(); ctx.fill();
  ctx.restore();
  const k0 = eout(seg(t, .1, .6));
  ctx.save(); ctx.globalAlpha = k0;
  text('MAÇ ÖNGÖRÜSÜ', W / 2, 250, `800 44px ${DISP}`, ACC, 'center', '14px');
  text('TAKTİK SİMÜLASYON', W / 2, 310, `600 34px ${DISP}`, COL.grey, 'center', '10px');
  ctx.restore();
  const k1 = eexp(seg(t, .45, 1.1)), k2 = eexp(seg(t, .65, 1.3));
  ctx.save(); ctx.translate((1 - k1) * -200, 0); ctx.globalAlpha = k1;
  ctx.save(); ctx.translate(W / 2, 700); ctx.rotate(-0.083);
  if (I.hSmall) text(I.hSmall, 0, -40, `800 italic 104px ${DISP}`, rgba(TH.h.introText, .92), 'center', '6px');
  text(I.hBig, 0, I.hSmall ? 150 : 90, fitFont(I.hBig, '900 italic', 230, 940, '8px'), TH.h.introText, 'center', '8px');
  ctx.restore(); ctx.restore();
  ctx.save(); ctx.translate((1 - k2) * 200, 0); ctx.globalAlpha = k2;
  ctx.save(); ctx.translate(W / 2, 1290); ctx.rotate(-0.083);
  if (I.aSmall) text(I.aSmall, 0, -150, `800 italic 92px ${DISP}`, rgba(TH.a.introText, .92), 'center', '6px');
  text(I.aBig, 0, 60, fitFont(I.aBig, '900 italic', 230, 940, '8px'), TH.a.introText, 'center', '8px');
  ctx.restore(); ctx.restore();
  const kv = eback(seg(t, 1.0, 1.45));
  ctx.save(); ctx.translate(W / 2, 965); ctx.scale(kv, kv);
  ctx.shadowColor = ACC; ctx.shadowBlur = 40; ctx.fillStyle = COL.ink; ctx.beginPath(); ctx.arc(0, 0, 84, 0, Math.PI * 2); ctx.fill();
  ctx.shadowBlur = 0; ctx.lineWidth = 6; ctx.strokeStyle = ACC; ctx.stroke();
  text('VS', 0, 26, `900 italic 80px ${DISP}`, ACC, 'center', '2px'); ctx.restore();
  const k3 = eout(seg(t, 1.3, 1.9));
  ctx.save(); ctx.globalAlpha = k3; ctx.translate(0, (1 - k3) * 30);
  text(I.strip, W / 2, 1680, `700 38px ${DISP}`, COL.white, 'center', '4px');
  skewRect(W / 2 - 330, 1712, 660, 66, 14, ACC);
  text(I.date, W / 2 + 7, 1760, `900 italic 46px ${DISP}`, COL.ink, 'center', '3px');
  text(I.venue, W / 2, 1830, `600 30px ${DISP}`, COL.grey, 'center', '6px');
  ctx.restore();
  ctx.save(); ctx.globalCompositeOperation = 'lighter';
  const sx = lerp(-400, W + 400, seg(t, 1.6, 2.6));
  const sg = ctx.createLinearGradient(sx - 160, 0, sx + 160, 0); sg.addColorStop(0, 'rgba(255,255,255,0)'); sg.addColorStop(.5, 'rgba(255,255,255,.16)'); sg.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = sg; ctx.fillRect(0, 0, W, H); ctx.restore();
  const fb = 1 - seg(t, 0, .35); if (fb > 0) { ctx.fillStyle = `rgba(0,0,0,${fb})`; ctx.fillRect(0, 0, W, H); }
}
function backdropPitch(t, dim) { drawPitch(makeCam({ x: .5, y: .5 + t * .01, dist: 120, el: 40, yaw: -10 + t * 2, F: 1500, oy: 0 }), t, dim); }
function statRow(y, r, t, t0) {
  const k = eout(seg(t, t0, t0 + .7));
  ctx.save(); ctx.globalAlpha = eout(seg(t, t0, t0 + .3));
  text(r.label, W / 2, y - 22, `700 30px ${DISP}`, COL.grey, 'center', '4px');
  const bw = 380;
  ctx.fillStyle = 'rgba(255,255,255,.07)'; ctx.fillRect(W / 2 - 20 - bw, y, bw, 22); ctx.fillRect(W / 2 + 20, y, bw, 22);
  const lg = ctx.createLinearGradient(W / 2 - 20 - bw, 0, W / 2 - 20, 0); lg.addColorStop(0, TH.h.colD); lg.addColorStop(1, TH.h.col);
  ctx.fillStyle = lg; ctx.fillRect(W / 2 - 20 - bw * r.hw * k, y, bw * r.hw * k, 22);
  ctx.fillStyle = TH.a.col; ctx.fillRect(W / 2 + 20, y, bw * r.aw * k, 22);
  const fmt = v => typeof v === 'number' ? String(Math.round(v * k)) + (r.suffix || '') : v;
  text(fmt(r.h), 70, y + 26, `900 italic 76px ${DISP}`, TH.h.textCol, 'left');
  text(fmt(r.a), W - 70, y + 26, `900 italic 76px ${DISP}`, TH.a.textCol, 'right');
  ctx.restore();
}
function chip(x, y, w, h, title, body, col, t, t0) {
  const k = eexp(seg(t, t0, t0 + .6));
  ctx.save(); ctx.globalAlpha = k; ctx.translate((1 - k) * (x < W / 2 ? -80 : 80), 0);
  ctx.fillStyle = 'rgba(12,20,34,.92)'; ctx.beginPath(); ctx.roundRect(x, y, w, h, 18); ctx.fill();
  ctx.strokeStyle = rgba(col, .35); ctx.lineWidth = 2; ctx.stroke();
  ctx.fillStyle = col; ctx.fillRect(x, y + 18, 6, h - 36);
  text(title, x + 30, y + 46, `800 28px ${DISP}`, col, 'left', '3px');
  wrapLines(body, `600 30px ${BODY}`, w - 60).forEach((l, i) => text(l, x + 30, y + 92 + i * 40, `600 30px ${BODY}`, COL.white));
  ctx.restore();
}
function sceneContext(t, dur) {
  const C = M.context;
  backdropPitch(t, .18);
  hudTop(t, '01', 'MAÇ ÖNCESİ', 'FORM VE KADRO DURUMU');
  const k = eout(seg(t, .5, 1));
  ctx.save(); ctx.globalAlpha = k;
  skewRect(60, 400, 400, 70, 14, TH.h.col); text(TH.h.name, 267, 452, fitFont(TH.h.name, '900 italic', 52, 360, '3px'), TH.h.ink, 'center', '3px');
  skewRect(620, 400, 400, 70, 14, TH.a.col); text(TH.a.name, 827, 452, fitFont(TH.a.name, '900 italic', 52, 360, '3px'), TH.a.ink, 'center', '3px');
  ctx.restore();
  C.rows.forEach((r, i) => statRow(580 + i * 140, r, t, .8 + i * .2));
  C.chips.forEach((c, i) => chip(i % 2 ? 550 : 60, i < 2 ? 960 : 1210, 470, 230, c.title, c.body, TH[c.side].textCol, t, 1.6 + i * .2));
  const k2 = eexp(seg(t, 2.7, 3.2));
  ctx.save(); ctx.globalAlpha = k2;
  const ff = fitFont(C.footer, '700 italic', 34, 860, '3px');
  skewRect(W / 2 - 440, 1470, 880, 64, 14, rgba(ACC, .12));
  text(C.footer, W / 2 + 7, 1514, ff, ACC, 'center', '3px');
  ctx.restore();
  hudCaption(t, C.caption, dur, 1600);
}
function sceneLineups(t, dur) {
  const L = M.lineup;
  const cam = makeCam(camAt([[0, { x: .5, y: .57, dist: 112, el: 60, yaw: -7, F: 1430, oy: 20 }], [dur, { x: .5, y: .555, dist: 106, el: 58, yaw: 6, F: 1430, oy: 20 }]], t));
  drawPitch(cam, t);
  const sim = makeSim({ base: L.kickoff, moves: [], ball: [[0, [.5, .5]]] });
  const order = pid => { const ids = Object.keys(L.kickoff).filter(p => side(p) === side(pid)); const i = ids.indexOf(pid); return side(pid) === 'a' ? i * .07 + .35 : i * .07 + .55; };
  MINTAG = 21;
  drawSimFrame(sim, cam, t, { noBall: true, big: 1.8,
    dropZ: pid => { const k = seg(t, order(pid), order(pid) + .5); return k >= 1 ? 0 : (1 - eback(k)) * 14 + (k <= 0 ? 60 : 0); },
    alphaOf: pid => seg(t, order(pid), order(pid) + .2) });
  MINTAG = 15;
  const k = eexp(seg(t, 1.6, 2.2));
  ctx.save(); ctx.globalAlpha = k;
  skewRect(60, 312, 330, 56, 12, TH.a.col); text(L.formA, 231, 352, fitFont(L.formA, '800 italic', 38, 300, '2px'), TH.a.ink, 'center', '2px');
  skewRect(690, 312, 330, 56, 12, TH.h.col); text(L.formH, 861, 352, fitFont(L.formH, '800 italic', 38, 300, '2px'), TH.h.ink, 'center', '2px');
  ctx.restore();
  hudTop(t, '02', "MUHTEMEL 11'LER · KAYNAK TEYİTLİ", L.title || 'İKİ FARKLI PLAN');
  hudCaption(t, L.caption, dur, 1600);
}
function backFigure(cx, top, o) {
  const hx = cx, hy = top + 92, hr = 54, hry = 64;
  ctx.save();
  const sg = ctx.createLinearGradient(cx - 230, 0, cx + 230, 0);
  sg.addColorStop(0, o.shirtD); sg.addColorStop(.5, o.shirt); sg.addColorStop(1, o.shirtD);
  const torso = () => { ctx.beginPath(); ctx.moveTo(cx - 235, top + 430); ctx.bezierCurveTo(cx - 238, top + 260, cx - 205, top + 205, cx - 120, top + 182); ctx.bezierCurveTo(cx - 75, top + 170, cx - 48, top + 160, cx - 34, top + 150); ctx.lineTo(cx + 34, top + 150); ctx.bezierCurveTo(cx + 48, top + 160, cx + 75, top + 170, cx + 120, top + 182); ctx.bezierCurveTo(cx + 205, top + 205, cx + 238, top + 260, cx + 235, top + 430); ctx.closePath(); };
  ctx.fillStyle = sg; torso(); ctx.fill();
  if (o.stripes) {
    ctx.save(); torso(); ctx.clip(); ctx.fillStyle = o.stripes;
    for (let x = cx - 23 - 92 * 3; x < cx + 260; x += 92) ctx.fillRect(x, top + 140, 46, 320);
    ctx.restore();
  }
  if (o.sleeves) { // contrasting sleeves on the outer shoulders
    ctx.save(); torso(); ctx.clip();
    ctx.fillStyle = o.sleeves;
    ctx.beginPath(); ctx.moveTo(cx - 250, top + 200); ctx.lineTo(cx - 150, top + 175); ctx.quadraticCurveTo(cx - 175, top + 300, cx - 165, top + 440); ctx.lineTo(cx - 250, top + 440); ctx.closePath(); ctx.fill();
    ctx.beginPath(); ctx.moveTo(cx + 250, top + 200); ctx.lineTo(cx + 150, top + 175); ctx.quadraticCurveTo(cx + 175, top + 300, cx + 165, top + 440); ctx.lineTo(cx + 250, top + 440); ctx.closePath(); ctx.fill();
    ctx.restore();
  }
  const sh = ctx.createLinearGradient(0, top + 150, 0, top + 430); sh.addColorStop(0, 'rgba(255,255,255,.18)'); sh.addColorStop(1, 'rgba(0,0,0,.35)');
  ctx.fillStyle = sh; torso(); ctx.fill();
  ctx.strokeStyle = 'rgba(0,0,0,.12)'; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(cx, top + 175); ctx.lineTo(cx, top + 430); ctx.stroke();
  ctx.strokeStyle = o.rim; ctx.lineWidth = 3; ctx.shadowColor = o.rim; ctx.shadowBlur = 18;
  ctx.beginPath(); ctx.moveTo(cx - 235, top + 330); ctx.bezierCurveTo(cx - 238, top + 260, cx - 205, top + 205, cx - 120, top + 182); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(cx + 235, top + 330); ctx.bezierCurveTo(cx + 238, top + 260, cx + 205, top + 205, cx + 120, top + 182); ctx.stroke();
  ctx.shadowBlur = 0;
  const ng = ctx.createLinearGradient(0, top + 120, 0, top + 165); ng.addColorStop(0, o.skinD); ng.addColorStop(1, o.skin);
  ctx.fillStyle = ng; ctx.beginPath(); ctx.roundRect(cx - 34, top + 118, 68, 50, 14); ctx.fill();
  ctx.fillStyle = o.trim; ctx.beginPath(); ctx.ellipse(cx, top + 156, 46, 12, 0, Math.PI, 0); ctx.lineTo(cx + 46, top + 160); ctx.ellipse(cx, top + 160, 46, 9, 0, 0, Math.PI, false); ctx.fill();
  ctx.fillStyle = o.skinD;
  ctx.beginPath(); ctx.ellipse(hx - hr + 2, hy + 6, 10, 18, -.2, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.ellipse(hx + hr - 2, hy + 6, 10, 18, .2, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = o.skin; ctx.beginPath(); ctx.ellipse(hx, hy, hr, hry, 0, 0, Math.PI * 2); ctx.fill();
  ctx.save(); ctx.beginPath(); ctx.ellipse(hx, hy, hr + 1, hry + 1, 0, 0, Math.PI * 2); ctx.clip();
  const hg = ctx.createLinearGradient(0, hy - hry, 0, hy + hry); hg.addColorStop(0, o.hairL); hg.addColorStop(1, o.hair);
  ctx.fillStyle = hg;
  const hairLine = hy + hry * o.hairCover;
  ctx.beginPath(); ctx.moveTo(hx - hr - 5, hy - hry - 5); ctx.lineTo(hx + hr + 5, hy - hry - 5); ctx.lineTo(hx + hr + 5, hairLine - 10);
  if (o.curly) { for (let i = 0; i <= 10; i++) { const x = hx + hr + 5 - i * (2 * hr + 10) / 10; ctx.quadraticCurveTo(x + 5, hairLine + 6, x - 1, hairLine - 2); } }
  else ctx.quadraticCurveTo(hx, hairLine + 14, hx - hr - 5, hairLine - 10);
  ctx.closePath(); ctx.fill();
  ctx.strokeStyle = 'rgba(0,0,0,.12)'; ctx.lineWidth = 2;
  for (let i = -4; i <= 4; i++) { ctx.beginPath(); ctx.moveTo(hx + i * 11, hy - hry); ctx.quadraticCurveTo(hx + i * 13, hy - 10, hx + i * 12, hairLine - 6); ctx.stroke(); }
  ctx.restore();
  if (o.bun) {
    ctx.fillStyle = o.hairL; ctx.beginPath(); ctx.ellipse(hx, hy - hry - 4, 26, 22, 0, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = 'rgba(0,0,0,.25)'; ctx.lineWidth = 2; ctx.beginPath(); ctx.ellipse(hx, hy - hry - 4, 18, 14, 0, 0, Math.PI * 2); ctx.stroke();
    ctx.fillStyle = '#20232B'; ctx.fillRect(hx - 14, hy - hry + 12, 28, 6);
  }
  ctx.fillStyle = o.numCol; ctx.textAlign = 'center'; ctx.textBaseline = 'alphabetic';
  ctx.font = `700 34px ${DISP}`; ctx.letterSpacing = '6px'; ctx.fillText(o.shirtName, cx + 3, top + 232);
  ctx.font = `800 150px ${DISP}`; ctx.letterSpacing = '0px';
  if (o.numStroke) { ctx.lineWidth = 5; ctx.strokeStyle = o.numStroke; ctx.strokeText(o.num, cx, top + 375); }
  ctx.fillText(o.num, cx, top + 375);
  ctx.restore();
}
function sceneCards(t, dur) {
  backdropPitch(t + 6, .15);
  hudTop(t, '03', 'KİLİT İSİMLER', 'MAÇI BELİRLEYECEK DÖRTLÜ');
  const cw = 470, ch = 560, pos = [[60, 410], [550, 410], [60, 1000], [550, 1000]];
  M.cards.forEach((cd, i) => {
    const k = eexp(seg(t, .5 + i * .22, 1.1 + i * .22)); if (k <= 0) return;
    const [x0, y0] = pos[i], th = TH[cd.side];
    ctx.save(); ctx.globalAlpha = k; ctx.translate(0, (1 - k) * 120);
    ctx.save(); ctx.beginPath(); ctx.roundRect(x0, y0, cw, ch, 26); ctx.clip();
    const g = ctx.createLinearGradient(x0, y0, x0 + cw, y0 + ch); g.addColorStop(0, th.card[0]); g.addColorStop(.55, th.card[1]); g.addColorStop(1, '#070E1A');
    ctx.fillStyle = g; ctx.fillRect(x0, y0, cw, ch);
    ctx.strokeStyle = 'rgba(255,255,255,.04)'; ctx.lineWidth = 2;
    for (let d = -ch; d < cw; d += 22) { ctx.beginPath(); ctx.moveTo(x0 + d, y0 + ch); ctx.lineTo(x0 + d + ch, y0); ctx.stroke(); }
    const rg = ctx.createRadialGradient(x0 + cw / 2, y0 + 170, 10, x0 + cw / 2, y0 + 170, 300);
    rg.addColorStop(0, rgba(th.glow, .35)); rg.addColorStop(1, 'rgba(0,0,0,0)'); ctx.fillStyle = rg; ctx.fillRect(x0, y0, cw, ch);
    backFigure(x0 + cw / 2, y0 + 8, Object.assign({ shirt: th.shirt, shirtD: th.shirtD, trim: th.trim, rim: th.glow, numCol: th.numCol, numStroke: th.numStroke, sleeves: th.sleeves, stripes: th.stripes }, cd.fig));
    const bg2 = ctx.createLinearGradient(0, y0 + 340, 0, y0 + ch); bg2.addColorStop(0, 'rgba(5,8,15,0)'); bg2.addColorStop(.28, 'rgba(5,8,15,.93)'); bg2.addColorStop(1, 'rgba(5,8,15,.98)');
    ctx.fillStyle = bg2; ctx.fillRect(x0, y0 + 340, cw, ch - 340);
    text(cd.name, x0 + 30, y0 + 448, fitFont(cd.name, '900 italic', 58, cw - 60, '2px'), COL.white, 'left', '2px');
    text(cd.role, x0 + 30, y0 + 482, `700 24px ${DISP}`, th.textCol, 'left', '3px');
    wrapLines(cd.line, `500 22px ${BODY}`, cw - 60).forEach((l, j) => text(l, x0 + 30, y0 + 516 + j * 28, `500 22px ${BODY}`, 'rgba(242,245,248,.9)'));
    ctx.globalCompositeOperation = 'lighter';
    const sx = x0 + lerp(-300, cw + 300, seg(t, 1.3 + i * .25, 2.3 + i * .25));
    const sg = ctx.createLinearGradient(sx - 120, y0, sx + 120, y0 + 200); sg.addColorStop(0, 'rgba(255,255,255,0)'); sg.addColorStop(.5, 'rgba(255,255,255,.22)'); sg.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = sg; ctx.fillRect(x0, y0, cw, ch);
    ctx.restore();
    ctx.lineWidth = 2; ctx.strokeStyle = rgba(th.glow, .6); ctx.beginPath(); ctx.roundRect(x0, y0, cw, ch, 26); ctx.stroke();
    ctx.fillStyle = th.col; ctx.fillRect(x0 + 30, y0, 90, 6);
    ctx.restore();
  });
  hudCaption(t, M.cardsCaption, dur, 1640);
}
const SIMS = {};
function sceneSim(key, spec) {
  return (t, dur) => {
    const sim = SIMS[key] || (SIMS[key] = makeSim(spec));
    const c = camAt(spec.cam, t);
    let punch = 0; (spec.flashes || []).forEach(f => { const u = t - f[0]; if (u > 0 && u < .6) punch = Math.max(punch, Math.sin(u / .6 * Math.PI)); });
    const cam = makeCam({ ...c, dist: c.dist * (1 - .05 * punch), F: 1500, oy: 60 });
    drawPitch(cam, t); drawSimFrame(sim, cam, t);
    (spec.flashes || []).forEach(f => flashCallout(t, f));
    hudTop(t, spec.chapter, spec.kicker, spec.title);
    hudCaption(t, spec.cap, dur, 1600);
  };
}
function scenePred(t, dur) {
  const R = M.pred;
  backdropPitch(t + 12, .14);
  hudTop(t, String(4 + M.scen.length).padStart(2, '0'), 'SONUÇ', 'OYUNU OKUYALIM: İKİ İHTİMAL');
  const k = eout(seg(t, .6, 1.8));
  ctx.save(); ctx.globalAlpha = eout(seg(t, .5, .9));
  if (!R.probs) {
    text(R.consensusLabel || 'BASIN TAHMİNLERİ', 60, 430, `700 30px ${DISP}`, COL.grey, 'left', '3px');
    text(R.consensus, 60, 490, fitFont(R.consensus, '900 italic', 54, 960, '2px'), COL.white, 'left', '2px');
    ctx.restore();
  } else {
  text(R.probLabel, 60, 420, `700 30px ${DISP}`, COL.grey, 'left', '3px');
  let x = 60; const total = 960;
  R.probs.forEach((p, i) => {
    const w = total * p.v / 100 * k, col = p.side ? TH[p.side].col : '#5B6B82';
    ctx.fillStyle = col; ctx.fillRect(x, 440, Math.max(0, w - 4), 34);
    if (k > .6) { const lab = `${p.label} %${(p.v).toFixed(p.v % 1 ? 1 : 0).replace('.', ',')}`; text(lab, i === 0 ? x : i === R.probs.length - 1 ? x + w - 4 : x + w / 2, 510, `800 italic 30px ${DISP}`, p.side ? TH[p.side].textCol : COL.grey, i === 0 ? 'left' : i === R.probs.length - 1 ? 'right' : 'center', '2px'); }
    x += w;
  });
  ctx.restore();
  }
  function panel(y, P2, col, t0) {
    const a = eexp(seg(t, t0, t0 + .7)); if (a <= 0) return;
    ctx.save(); ctx.globalAlpha = a; ctx.translate((1 - a) * -140, 0);
    ctx.fillStyle = 'rgba(10,16,28,.94)'; ctx.beginPath(); ctx.roundRect(60, y, 960, 440, 26); ctx.fill();
    ctx.strokeStyle = rgba(col, .45); ctx.lineWidth = 2; ctx.stroke();
    skewRect(60, y, 330, 62, 16, col); text(P2.tag, 233, y + 45, `900 italic 38px ${DISP}`, COL.ink, 'center', '3px');
    const sy = y + 210;
    skewRect(110, sy - 90, 200, 110, 18, TH.h.col); text(TH.h.code, 219, sy - 10, `900 italic 74px ${DISP}`, TH.h.ink, 'center', '2px');
    text(P2.score, W / 2, sy, `900 italic 150px ${DISP}`, COL.white, 'center', '6px');
    skewRect(770, sy - 90, 200, 110, 18, TH.a.col); text(TH.a.code, 879, sy - 10, `900 italic 74px ${DISP}`, TH.a.ink, 'center', '2px');
    let yy = y + 300;
    wrapLines(P2.text, `500 29px ${BODY}`, 880).forEach(s => { text(s, 100, yy, `500 29px ${BODY}`, 'rgba(242,245,248,.92)'); yy += 40; });
    ctx.restore();
  }
  panel(560, R.main, TH.h.col, 1.2);
  panel(1030, R.alt, DANGER, 2.0);
  const kt = eexp(seg(t, 3.0, 3.8));
  ctx.save(); ctx.globalAlpha = kt;
  const x0 = 60, x1 = 1020, y = 1560;
  if (R.breakMin) {
  ctx.fillStyle = 'rgba(255,255,255,.12)'; ctx.fillRect(x0, y, x1 - x0, 10);
  ctx.fillStyle = ACC; ctx.shadowColor = ACC; ctx.shadowBlur = 18; ctx.fillRect(x0, y, (x1 - x0) * (R.breakMin / 90) * kt, 10); ctx.shadowBlur = 0;
  ["0'", "30'", "60'", "90'"].forEach((s, i) => text(s, x0 + (x1 - x0) * i / 3, y + 50, `700 28px ${DISP}`, i === 1 ? ACC : COL.grey, i === 0 ? 'left' : i === 3 ? 'right' : 'center', '2px'));
  }
  text(R.breakLabel, W / 2, y - 22, fitFont(R.breakLabel, '900 italic', 50, 940, '3px'), ACC, 'center', '3px');
  ctx.restore();
  const kd = eout(seg(t, 4.0, 4.6));
  ctx.save(); ctx.globalAlpha = kd;
  text('Bu bir tahmindir, bahis tavsiyesi değildir.', W / 2, 1740, `500 28px ${BODY}`, COL.grey, 'center');
  text('TAKİPTE KAL · HER MAÇTAN ÖNCE TAKTİK ÖNGÖRÜ', W / 2, 1815, `800 italic 34px ${DISP}`, COL.white, 'center', '3px');
  ctx.restore();
  const fo = seg(t, dur - .8, dur); if (fo > 0) { ctx.fillStyle = `rgba(0,0,0,${fo})`; ctx.fillRect(0, 0, W, H); }
}

const SCENES = [
  { name: 'intro', dur: 4.5, draw: sceneIntro },
  { name: 'context', dur: 7.0, draw: sceneContext },
  { name: 'lineups', dur: 6.5, draw: sceneLineups },
  { name: 'cards', dur: 7.0, draw: sceneCards },
  ...M.scen.map((sp, i) => { sp.chapter = sp.chapter || String(4 + i).padStart(2, '0'); return { name: 's' + (i + 1), dur: sp.dur || 8.5, draw: sceneSim('s' + (i + 1), sp), spec: sp }; }),
  { name: 'pred', dur: 8.5, draw: scenePred },
];
window.renderScene = (name, t, frame) => {
  FRAME = frame || 0;
  const i = SCENES.findIndex(s => s.name === name), sc = SCENES[i];
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = 1; ctx.globalCompositeOperation = 'source-over'; ctx.shadowBlur = 0; ctx.setLineDash([]);
  sc.draw(t, sc.dur); ctx.restore();
  ctx.save(); postFX(); ctx.restore();
  ctx.save(); transitions(t, sc.dur, i === 0, i === SCENES.length - 1); ctx.restore();
  return cv.toDataURL('image/jpeg', 0.92);
};
window.sceneList = () => SCENES.map(s => ({ name: s.name, dur: s.dur }));
window.audioEvents = () => {
  const ev = []; let t0 = 0; const bounds = [];
  SCENES.forEach((s, i) => {
    bounds.push(t0);
    if (i > 0) ev.push({ t: t0, type: 'whoosh', g: .8 });
    if (i < SCENES.length - 1) ev.push({ t: t0 + s.dur - .55, type: 'riser', g: .6 });
    if (s.name === 'intro') { ev.push({ t: t0 + .3, type: 'whistle', g: 1 }); [.5, .7, 1.0].forEach(x => ev.push({ t: t0 + x, type: 'impact', g: .8 })); ev.push({ t: t0 + 1.0, type: 'roar', g: .7, d: 3 }); }
    if (s.name === 'context') [.8, 1.0, 1.2, 1.6, 1.8, 2.1, 2.3, 2.7].forEach(x => ev.push({ t: t0 + x, type: 'tick', g: 1 }));
    if (s.name === 'lineups') { Object.keys(M.lineup.kickoff).forEach(pid => { const ids = Object.keys(M.lineup.kickoff).filter(p => side(p) === side(pid)); const o = side(pid) === 'a' ? ids.indexOf(pid) * .07 + .35 : ids.indexOf(pid) * .07 + .55; ev.push({ t: t0 + o + .35, type: 'tick', g: .7 }); }); }
    if (s.name === 'cards') [0, 1, 2, 3].forEach(j => { ev.push({ t: t0 + .5 + j * .22, type: 'whoosh', g: .5 }); ev.push({ t: t0 + .65 + j * .22, type: 'impact', g: .35 }); });
    if (s.spec) {
      const sim = SIMS[s.name] || (SIMS[s.name] = makeSim(s.spec));
      sim.passes.forEach(p => ev.push({ t: t0 + p.t0, type: p.shot ? 'shot' : 'kick', g: p.shot ? 1 : .8 }));
      (s.spec.runs || []).forEach(r => { if (r[3] === 'drib') for (let x = r[1]; x < r[2]; x += .3) ev.push({ t: t0 + x, type: 'kick', g: .35 }); });
      (s.spec.flashes || []).forEach(f => { const big = f[3] === 'danger' || /GOL/.test(f[2]); ev.push({ t: t0 + f[0], type: 'impact', g: .8 }); ev.push({ t: t0 + f[0] - .2, type: 'roar', g: big ? 1 : .55, d: big ? 2.6 : 1.5 }); if (f[5] === 'whistle') ev.push({ t: t0 + f[0], type: 'whistle', g: .5, d: .25 }); });
    }
    if (s.name === 'pred') { [1.2, 2.0].forEach(x => ev.push({ t: t0 + x, type: 'impact', g: .9 })); ev.push({ t: t0 + 3.0, type: 'riser', g: .5 }); ev.push({ t: t0 + 3.6, type: 'impact', g: .7 }); [0, .45, .9].forEach((x, j) => ev.push({ t: t0 + s.dur - 2.6 + x, type: 'whistle', g: .8, d: j < 2 ? .3 : 1.0 })); }
    t0 += s.dur;
  });
  return { total: t0, ev, bounds, drops: SCENES.map((s, i) => ({ name: s.name, t: bounds[i] })) };
};
window.fontsReady = async () => {
  const fams = [`600 30px ${DISP}`, `700 30px ${DISP}`, `800 30px ${DISP}`, `italic 700 30px ${DISP}`, `italic 800 30px ${DISP}`, `italic 900 30px ${DISP}`, `400 30px ${BODY}`, `500 30px ${BODY}`, `600 30px ${BODY}`, `700 30px ${BODY}`];
  await Promise.all(fams.map(f => document.fonts.load(f, 'ŞşĞğİıÖöÜüÇçØøÉéÁá AZaz09'))); await document.fonts.ready; return true;
};
