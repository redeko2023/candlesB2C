'use strict';

const FONTS = [
  { id: 'Prata',            label: 'Prata — класична антиква',   css: '"Prata", Georgia, serif',               weight: 400 },
  { id: 'Manrope',          label: 'Manrope — сучасний гротеск', css: '"Manrope", Arial, sans-serif',          weight: 600 },
  { id: 'Oswald',           label: 'Oswald — вузький',           css: '"Oswald", "Arial Narrow", sans-serif',  weight: 500 },
  { id: 'Playfair Display', label: 'Playfair — контрастний',     css: '"Playfair Display", Georgia, serif',    weight: 500 },
  { id: 'Caveat',           label: 'Caveat — рукописний',        css: '"Caveat", "Comic Sans MS", cursive',    weight: 600 },
  { id: 'Marck Script',     label: 'Marck Script — каліграфія',  css: '"Marck Script", cursive',               weight: 400 },
  { id: 'Comfortaa',        label: 'Comfortaa — м’який',         css: '"Comfortaa", Arial, sans-serif',        weight: 600 }
];

/* Вбудована векторна графіка для шаблонів (одиничні координати 0..100 × 0..100·ar). */
function star4(c, x, y, r){ c.beginPath(); c.moveTo(x, y-r); c.quadraticCurveTo(x, y, x+r, y); c.quadraticCurveTo(x, y, x, y+r); c.quadraticCurveTo(x, y, x-r, y); c.quadraticCurveTo(x, y, x, y-r); c.fill(); }
function dot(c, x, y, r){ c.beginPath(); c.arc(x, y, r, 0, Math.PI*2); c.fill(); }
const GRAPHICS = {
  sprig: { name: 'Гілочка', ar: 1.25, draw(c){
    c.lineWidth = 1.5;
    c.beginPath(); c.moveTo(50, 125); c.bezierCurveTo(48, 92, 40, 58, 52, 10); c.stroke();
    c.beginPath(); c.moveTo(47, 88); c.quadraticCurveTo(28, 74, 22, 54); c.stroke();
    c.beginPath(); c.moveTo(47, 70); c.quadraticCurveTo(66, 56, 72, 38); c.stroke();
    const leaf = (x, y, a, l = 9) => { c.beginPath(); c.ellipse(x + Math.cos(a) * l * 0.8, y + Math.sin(a) * l * 0.8, l, l * 0.34, a, 0, Math.PI * 2); c.fill(); };
    [[48,108,-2.5],[49,100,-0.6],[45,82,-2.6],[47,62,-0.5],[46,50,-2.5],[49,36,-0.6],[50,24,-2.4],[30,76,-2.2,7],[25,64,-1.2,6],[60,60,-0.4,7],[67,48,-1.9,6]].forEach(([x,y,a,l]) => leaf(x, y, a, l || 9));
    const floret = (x, y, r) => { for (let k = 0; k < 5; k++){ const a = k / 5 * Math.PI * 2; c.beginPath(); c.arc(x + Math.cos(a) * r, y + Math.sin(a) * r, r * 0.62, 0, Math.PI * 2); c.fill(); } };
    floret(52, 8, 2.4); floret(21, 51, 2); floret(73, 35, 2); floret(16, 58, 1.6); floret(78, 42, 1.6);
  }},
  arches: { name: 'Арки й лінії', ar: 1.6, draw(c){
    c.lineWidth = 2;
    [8, 17, 26].forEach((x) => { c.beginPath(); c.moveTo(x, 0); c.lineTo(x, 160); c.stroke(); });
    c.beginPath(); c.moveTo(40, 160); c.lineTo(40, 70); c.arc(70, 70, 30, Math.PI, 0); c.lineTo(100, 160); c.stroke();
    c.beginPath(); c.moveTo(52, 160); c.lineTo(52, 92); c.arc(70, 92, 18, Math.PI, 0); c.lineTo(88, 160); c.stroke();
    c.beginPath(); c.arc(70, 160, 16, Math.PI, 0); c.closePath(); c.fill();
  }},
  flame: { name: 'Вогник', ar: 1.35, draw(c){
    c.beginPath(); c.moveTo(50, 2); c.bezierCurveTo(78, 40, 94, 70, 80, 106); c.bezierCurveTo(70, 130, 30, 130, 20, 106); c.bezierCurveTo(8, 76, 30, 46, 50, 2); c.fill();
  }},
  sparkle: { name: 'Зірочки', ar: 0.62, draw(c){
    star4(c,50,30,20); star4(c,21,40,9); star4(c,79,16,8); star4(c,84,47,6); star4(c,13,14,5);
    dot(c,34,9,2); dot(c,66,53,2.2); dot(c,94,29,1.8); dot(c,5,31,1.6); dot(c,60,4,1.4);
  }},
  wreath: { name: 'Вінок', ar: 1, draw(c){
    c.lineWidth = 1.6;
    const branch = (a0, a1, n, dir) => {
      c.beginPath(); c.arc(50, 50, 40, a0, a1, dir < 0); c.stroke();
      for (let i = 0; i <= n; i++){
        const a = a0 + (a1 - a0) * (i / n);
        const px = 50 + 40*Math.cos(a), py = 50 + 40*Math.sin(a);
        const tan = a + (dir > 0 ? Math.PI/2 : -Math.PI/2);
        for (const side of [-1, 1]){
          const rot = tan + side * 0.7 * dir;
          const off = 4.2;
          c.beginPath();
          c.ellipse(px + Math.cos(rot)*off, py + Math.sin(rot)*off, 5.2*(1 - i/(n*2.4)), 2.1, rot, 0, Math.PI*2);
          c.fill();
        }
      }
    };
    const d = Math.PI/180;
    branch(105*d, 250*d, 7, 1);
    branch(75*d, -70*d, 7, -1);
    dot(c, 50, 90.5, 2.2);
  }},
  heart: { name: 'Серце', ar: 0.9, draw(c){
    c.lineWidth = 4.2;
    c.beginPath(); c.moveTo(50,82); c.bezierCurveTo(12,57, 4,32, 22,17); c.bezierCurveTo(36,6, 48,14, 50,27); c.bezierCurveTo(52,14, 64,6, 78,17); c.bezierCurveTo(96,32, 88,57, 50,82); c.stroke();
  }},
  mark: { name: 'Знак-логотип', ar: 1, draw(c){
    c.lineWidth = 4.5; c.beginPath(); c.arc(50,50,44,0,Math.PI*2); c.stroke();
    c.beginPath(); c.moveTo(50,20); c.bezierCurveTo(68,40, 67,58, 50,72); c.bezierCurveTo(33,58, 32,40, 50,20); c.fill();
    c.lineWidth = 4; c.beginPath(); c.moveTo(33,80); c.lineTo(67,80); c.stroke();
  }},
  mountains: { name: 'Гори', ar: 0.5, draw(c){
    c.lineWidth = 2.4;
    c.beginPath(); c.arc(73,14,7,0,Math.PI*2); c.stroke();
    c.beginPath(); c.moveTo(2,47); c.lineTo(26,18); c.lineTo(37,30); c.lineTo(52,9); c.lineTo(75,40); c.lineTo(85,31); c.lineTo(98,47); c.stroke();
    c.beginPath(); c.moveTo(45,19); c.lineTo(52,23); c.lineTo(57,16); c.stroke();
    c.beginPath(); c.moveTo(0,47.5); c.lineTo(100,47.5); c.stroke();
  }}
};

/* ===================== Квіткова графіка для готових колекцій =====================
   Векторні ілюстрації: tint — колір квітів, tint2 — колір листя/стебел (або серцевини).
   Напівпрозорі шари дають м’який «акварельний» об’єм; у виробничий макет ідуть як вектор. */
const FL = {
  petal(c, x, y, a, l, w, top = 0.95){ c.save(); c.translate(x, y); c.rotate(a); c.beginPath(); c.moveTo(0, 0);
    c.bezierCurveTo(w * 0.95, -l * 0.12, w * 1.1, -l * top, 0, -l); c.bezierCurveTo(-w * 1.1, -l * top, -w * 0.95, -l * 0.12, 0, 0); c.closePath(); c.restore(); },
  leaf(c, x, y, a, l, w){ c.save(); c.translate(x, y); c.rotate(a); c.beginPath(); c.moveTo(0, 0);
    c.bezierCurveTo(w, -l * 0.2, w * 0.9, -l * 0.7, 0, -l); c.bezierCurveTo(-w * 0.9, -l * 0.7, -w, -l * 0.2, 0, 0); c.closePath(); c.restore(); },
  rib(c, x, y, a, l){ c.save(); c.translate(x, y); c.rotate(a); c.beginPath(); c.moveTo(0, 0); c.quadraticCurveTo(l * 0.04, -l * 0.5, 0, -l * 0.92); c.restore(); },
  k: 1,   // множник щільності: >1 для світлого друку на темному склі
  fill(c, al){ c.globalAlpha = Math.min(1, al * FL.k); c.fill(); c.globalAlpha = 1; },
  line(c, al, lw){ c.globalAlpha = al; c.lineWidth = lw; c.stroke(); c.globalAlpha = 1; },
  curve(c, x0, y0, cx, cy, x1, y1){ c.beginPath(); c.moveTo(x0, y0); c.quadraticCurveTo(cx, cy, x1, y1); },
  qpt(x0, y0, cx, cy, x1, y1, t){ const u = 1 - t; return [u * u * x0 + 2 * u * t * cx + t * t * x1, u * u * y0 + 2 * u * t * cy + t * t * y1]; },
  qang(x0, y0, cx, cy, x1, y1, t){ const dx = 2 * (1 - t) * (cx - x0) + 2 * t * (x1 - cx), dy = 2 * (1 - t) * (cy - y0) + 2 * t * (y1 - cy); return Math.atan2(dy, dx); },
  rnd(seed){ let s = seed; return () => { s = (s * 16807) % 2147483647; return (s - 1) / 2147483646; }; },
  /* лист із прожилкою */
  leafFull(c, col, x, y, a, l, w, al = 0.62){ c.fillStyle = c.strokeStyle = col; FL.leaf(c, x, y, a, l, w); FL.fill(c, al); FL.line(c, 0.9, 0.45); FL.rib(c, x, y, a, l); FL.line(c, 0.85, 0.4); },
  /* півонія анфас: кілька кіл широких пелюсток */
  peony(c, col, x, y, r, seed = 3){
    const R = FL.rnd(seed); c.fillStyle = c.strokeStyle = col;
    const ring = (n, l, w, al, off) => { for (let i = 0; i < n; i++){ const a = off + i / n * Math.PI * 2 + (R() - 0.5) * 0.3; FL.petal(c, x, y, a, l * (0.9 + R() * 0.18), w, 1.15); FL.fill(c, al); FL.line(c, 0.75, 0.42); } };
    ring(9, r, r * 0.62, 0.26, 0.2); ring(7, r * 0.72, r * 0.52, 0.3, 0.55); ring(5, r * 0.46, r * 0.4, 0.34, 0.1);
    for (let i = 0; i < 4; i++){ const a = i / 4 * Math.PI * 2 + R(); c.beginPath(); c.arc(x + Math.cos(a) * r * 0.08, y + Math.sin(a) * r * 0.08, r * (0.14 + R() * 0.08), a, a + 1.8); FL.line(c, 0.85, 0.45); }
    c.beginPath(); c.arc(x, y, r * 0.1, 0, Math.PI * 2); FL.fill(c, 0.7);
  },
  bud(c, col, leafCol, x, y, r, a = 0){
    c.fillStyle = c.strokeStyle = col;
    c.beginPath(); c.ellipse(x, y, r * 0.8, r, a, 0, Math.PI * 2); FL.fill(c, 0.45); FL.line(c, 0.85, 0.45);
    FL.petal(c, x, y + r * 0.3, a - 0.35, r * 1.05, r * 0.45); FL.fill(c, 0.3);
    c.fillStyle = c.strokeStyle = leafCol;
    FL.leaf(c, x, y + r * 0.9, a - 2.6, r * 0.9, r * 0.32); FL.fill(c, 0.75); FL.leaf(c, x, y + r * 0.9, a + 2.6, r * 0.9, r * 0.32); FL.fill(c, 0.75);
  },
  /* троянда: зовнішні пелюстки + спіраль */
  rose(c, col, x, y, r, seed = 5){
    const R = FL.rnd(seed); c.fillStyle = c.strokeStyle = col;
    for (let i = 0; i < 6; i++){ const a = i / 6 * Math.PI * 2 + R() * 0.3; FL.petal(c, x, y, a, r, r * 0.75, 1.2); FL.fill(c, 0.24); FL.line(c, 0.7, 0.42); }
    c.beginPath(); c.arc(x, y, r * 0.62, 0, Math.PI * 2); FL.fill(c, 0.28);
    for (let i = 0; i < 6; i++){ const rr = r * (0.58 - i * 0.085), a0 = i * 2.3 + R(), ox = Math.cos(a0 + 1.5) * r * 0.07, oy = Math.sin(a0 + 1.5) * r * 0.07; c.beginPath(); c.arc(x + ox, y + oy, Math.max(rr, r * 0.07), a0, a0 + 2.5 + R() * 0.6); FL.line(c, 0.85, 0.55 - i * 0.04); }
    c.beginPath(); c.arc(x, y, r * 0.16, 0, Math.PI * 2); FL.fill(c, 0.55);
  },
  floret(c, col, x, y, r, n = 5, al = 0.55, a0 = 0){
    c.fillStyle = c.strokeStyle = col;
    for (let k = 0; k < n; k++){ FL.petal(c, x, y, a0 + k / n * Math.PI * 2, r, r * 0.55, 1.15); FL.fill(c, al); FL.line(c, 0.85, 0.35); }
  },
  daisy(c, col, mid, x, y, r, n = 18, seed = 7){
    const R = FL.rnd(seed); c.fillStyle = c.strokeStyle = col;
    for (let k = 0; k < n; k++){ const a = k / n * Math.PI * 2 + (R() - 0.5) * 0.12; FL.petal(c, x, y, a, r * (0.88 + R() * 0.16), r * 0.13, 0.9); FL.fill(c, 0.92); }
    c.fillStyle = mid; c.beginPath(); c.arc(x, y, r * 0.24, 0, Math.PI * 2); c.fill();
    c.fillStyle = col; for (let k = 0; k < 9; k++){ const a = k * 2.4, d = Math.sqrt(k / 9) * r * 0.17; c.beginPath(); c.arc(x + Math.cos(a) * d, y + Math.sin(a) * d, r * 0.025, 0, Math.PI * 2); FL.fill(c, 0.5); }
  }
};
const FLORA = {
  peonies: { name: 'Півонії', ar: 0.9, tint2: '#6E7A5C', draw(c, el){
    FL.k = (el && el.dense) || 1;
    const L = (el && el.tint2) || this.tint2, F = c.fillStyle;
    c.strokeStyle = L; FL.curve(c, 50, 90, 44, 66, 38, 48); FL.line(c, 0.9, 0.9); FL.curve(c, 56, 90, 64, 70, 68, 56); FL.line(c, 0.9, 0.8); FL.curve(c, 58, 90, 80, 52, 84, 20); FL.line(c, 0.9, 0.7);
    [[46, 76, -1.25, 24, 8], [44, 66, -0.55, 18, 6.5], [62, 76, 1.2, 22, 7.5], [70, 62, 0.75, 16, 5.5], [78, 44, 1.5, 13, 4.5], [52, 86, -2.1, 16, 5.5], [56, 86, 2.2, 15, 5]].forEach(([x, y, a, l, w]) => FL.leafFull(c, L, x, y, a, l, w));
    FL.bud(c, F, L, 84, 15, 6, 0.15);
    FL.peony(c, F, 38, 40, 24, 3); FL.peony(c, F, 68, 50, 17, 11);
  }},
  rosebranch: { name: 'Троянда', ar: 1.05, tint2: '#6E7A5C', draw(c, el){
    FL.k = (el && el.dense) || 1;
    const L = (el && el.tint2) || this.tint2, F = c.fillStyle;
    c.strokeStyle = L; FL.curve(c, 50, 104, 46, 70, 50, 52); FL.line(c, 0.9, 0.9); FL.curve(c, 49, 70, 30, 52, 24, 30); FL.line(c, 0.9, 0.6);
    [[50, 78, 1.15, 20, 7], [49, 86, -1.2, 18, 6.5], [50, 66, 0.5, 16, 6], [34, 52, -0.9, 13, 5], [52, 96, 2.0, 15, 5]].forEach(([x, y, a, l, w]) => FL.leafFull(c, L, x, y, a, l, w));
    FL.bud(c, F, L, 24, 24, 6.5, -0.4);
    FL.rose(c, F, 54, 38, 22, 5);
  }},
  lavender: { name: 'Лаванда', ar: 1.55, tint2: '#7C8C6A', draw(c, el){
    FL.k = (el && el.dense) || 1;
    const L = (el && el.tint2) || this.tint2, F = c.fillStyle, B = [50, 152];
    const stems = [[18, 26, 34, 90], [34, 12, 42, 80], [52, 6, 50, 80], [68, 14, 58, 80], [84, 30, 66, 92]];
    c.strokeStyle = L; stems.forEach(([tx, ty, cx, cy]) => { FL.curve(c, B[0], B[1], cx, cy, tx, ty); FL.line(c, 0.9, 0.7); });
    [[46, 150, -0.45, 40, 2.4], [55, 150, 0.4, 36, 2.2], [50, 152, -0.12, 30, 2]].forEach(([x, y, a, l, w]) => { c.fillStyle = L; FL.leaf(c, x, y, a, l, w); FL.fill(c, 0.7); });
    stems.forEach(([tx, ty, cx, cy], si) => {
      c.fillStyle = c.strokeStyle = F;
      for (let t = 0.56; t <= 1.001; t += 0.035){
        const [px, py] = FL.qpt(B[0], B[1], cx, cy, tx, ty, t), a = FL.qang(B[0], B[1], cx, cy, tx, ty, t) + Math.PI / 2;
        const s = 1.9 + (1 - t) * 3.2, gap = (t - 0.56) * 100 % 7 < 3.5 ? 1 : 0.8;
        for (const side of [-1, 1]){ c.beginPath(); c.ellipse(px + Math.cos(a) * side * s * 0.55, py + Math.sin(a) * side * s * 0.55, s * 0.62 * gap, s * 0.36, a + side * 0.5, 0, Math.PI * 2); FL.fill(c, 0.62); FL.line(c, 0.85, 0.3); }
      }
    });
  }},
  eucalyptus: { name: 'Евкаліпт', ar: 1.3, draw(c, el){
    FL.k = (el && el.dense) || 1;
    const F = c.fillStyle;
    const branch = (x0, y0, cx, cy, x1, y1, n, s0) => {
      c.strokeStyle = F; FL.curve(c, x0, y0, cx, cy, x1, y1); FL.line(c, 0.9, 0.7);
      for (let i = 1; i <= n; i++){
        const t = i / (n + 0.6), [px, py] = FL.qpt(x0, y0, cx, cy, x1, y1, t), a = FL.qang(x0, y0, cx, cy, x1, y1, t), side = i % 2 ? 1 : -1;
        const r = s0 * (1 - t * 0.55), ox = px + Math.cos(a + side * Math.PI / 2) * r * 0.95, oy = py + Math.sin(a + side * Math.PI / 2) * r * 0.95;
        c.fillStyle = c.strokeStyle = F; c.beginPath(); c.ellipse(ox, oy, r, r * 0.86, a, 0, Math.PI * 2); FL.fill(c, 0.42); FL.line(c, 0.85, 0.42);
        c.beginPath(); c.moveTo(px, py); c.lineTo(ox, oy); FL.line(c, 0.6, 0.35);
      }
    };
    branch(46, 128, 38, 70, 58, 6, 9, 8.5); branch(50, 126, 80, 80, 88, 34, 6, 7); branch(44, 120, 16, 92, 10, 52, 5, 6.5);
  }},
  blossom: { name: 'Цвіт', ar: 0.62, tint2: '#6B4E3D', draw(c, el){
    FL.k = (el && el.dense) || 1;
    const L = (el && el.tint2) || this.tint2, F = c.fillStyle;
    c.strokeStyle = L; FL.curve(c, 0, 56, 40, 40, 100, 14); FL.line(c, 0.95, 1.5);
    FL.curve(c, 40, 41, 50, 20, 44, 6); FL.line(c, 0.95, 0.9); FL.curve(c, 66, 30, 76, 42, 86, 46); FL.line(c, 0.95, 0.8); FL.curve(c, 20, 49, 24, 58, 32, 60); FL.line(c, 0.9, 0.7);
    [[44, 8, 6, 0.2], [30, 40, 7, 0.9], [58, 34, 7.5, 0.4], [84, 45, 6.5, 1.3], [78, 18, 6, 0.7], [16, 48, 5.5, 0.2], [32, 59, 5, 1.1], [96, 13, 4.5, 0.5]].forEach(([x, y, r, a]) => {
      FL.floret(c, F, x, y, r, 5, 0.5, a); c.strokeStyle = c.fillStyle = L;
      for (let k = 0; k < 7; k++){ const b = a + k * 0.9; c.beginPath(); c.moveTo(x, y); c.lineTo(x + Math.cos(b) * r * 0.42, y + Math.sin(b) * r * 0.42); FL.line(c, 0.9, 0.3); dot(c, x + Math.cos(b) * r * 0.45, y + Math.sin(b) * r * 0.45, 0.45); }
    });
    [[52, 22, 2], [70, 26, 1.8], [12, 52, 1.6], [91, 50, 1.7]].forEach(([x, y, r]) => { c.fillStyle = c.strokeStyle = F; c.beginPath(); c.ellipse(x, y, r, r * 1.3, 0.3, 0, Math.PI * 2); FL.fill(c, 0.7); FL.line(c, 0.9, 0.3); });
  }},
  daisies: { name: 'Ромашки', ar: 1.2, tint2: '#C9A24E', draw(c, el){
    FL.k = (el && el.dense) || 1;
    const M = (el && el.tint2) || this.tint2, F = c.fillStyle;
    c.strokeStyle = M; [[30, 120, 26, 70, 28, 40], [52, 120, 54, 70, 60, 22], [74, 120, 80, 90, 82, 62]].forEach((p) => { FL.curve(c, ...p); FL.line(c, 0.9, 0.7); });
    [[40, 116, -0.5, 30, 2.6], [64, 116, 0.45, 28, 2.4], [52, 118, 0.05, 22, 2]].forEach(([x, y, a, l, w]) => { c.fillStyle = M; FL.leaf(c, x, y, a, l, w); FL.fill(c, 0.75); });
    FL.daisy(c, F, M, 28, 38, 15, 18, 3); FL.daisy(c, F, M, 60, 20, 17, 20, 9); FL.daisy(c, F, M, 82, 60, 12, 16, 13);
  }},
  meadow: { name: 'Польові квіти', ar: 0.5, tint2: '#6E7A5C', draw(c, el){
    FL.k = (el && el.dense) || 1;
    const L = (el && el.tint2) || this.tint2, F = c.fillStyle, R = FL.rnd(21), H = 50;
    c.strokeStyle = L;
    for (let i = 0; i < 34; i++){ const x = 1 + i * 2.9 + R() * 2, h = 8 + R() * 16, b = (R() - 0.5) * 9; FL.curve(c, x, H, x + b * 0.3, H - h * 0.6, x + b, H - h); FL.line(c, 0.7, 0.4); }
    const fl = [[6, 24, 'f', 5], [17, 13, 'd', 6.5], [29, 28, 'b', 5], [40, 17, 'f', 5.5], [52, 8, 'd', 7], [63, 24, 'f', 4.8], [73, 14, 'b', 5.5], [84, 22, 'd', 6], [94, 12, 'f', 5]];
    fl.forEach(([x, y], i) => { c.strokeStyle = L; FL.curve(c, x + (i % 2 ? 2 : -2), H, x + (i % 2 ? -2 : 2), (y + H) / 2, x, y); FL.line(c, 0.9, 0.55); FL.leafFull(c, L, x + (i % 2 ? 0.6 : -0.6), y + 12 + (i % 3) * 4, i % 2 ? 0.95 : -0.95, 8, 2.6); });
    fl.forEach(([x, y, t, r], i) => {
      if (t === 'f') FL.floret(c, F, x, y, r, 5, 0.55, i);
      else if (t === 'd') FL.daisy(c, F, L, x, y, r, 14, 31 + i);
      else { c.fillStyle = c.strokeStyle = F; for (let k = 0; k < 3; k++){ FL.petal(c, x + (k - 1) * r * 0.5, y + r * 0.9 + Math.abs(k - 1) * r * 0.25, Math.PI + (k - 1) * 0.4, r, r * 0.42, 1.1); FL.fill(c, 0.55); FL.line(c, 0.85, 0.35); } }
    });
    c.fillStyle = F; [[11, 32], [35, 36], [46, 30], [58, 36], [79, 33], [89, 38], [23, 38]].forEach(([x, y]) => { c.beginPath(); c.arc(x, y, 1.1, 0, Math.PI * 2); FL.fill(c, 0.75); });
  }}
};
Object.assign(GRAPHICS, FLORA);

/* ===================== Ботанічні ілюстрації в стилі прикладів робіт =====================
   Ромашки, бордові суцвіття, гіпсофіла, листя шавлії, півонії, троянди, рамка й вінок.
   tint — акцентний колір квітів (бордо), tint2 — колір листя. Решта тонів виводиться з них
   або береться з палітри BOT (вершковий, рум’яний, жовтий). flip:true — дзеркальна версія. */
const BOT = { line: '#5B4636', cream: '#FFFCF6', creamLine: '#A39282', yellow: '#DDAA45', yellowDeep: '#A8752B', blush: '#EBC0B6', blushDeep: '#C9787A', gyps: '#FBF7EF', gypsDot: '#CDB48A', accent: '#7A1F2B', leaf: '#7D8B6A' };
const hexRgb = (h) => { h = h.replace('#', ''); if (h.length === 3) h = h.split('').map((x) => x + x).join(''); const n = parseInt(h, 16); return [n >> 16 & 255, n >> 8 & 255, n & 255]; };
const mixHex = (a, b, t) => { const A = hexRgb(a), B = hexRgb(b); return '#' + A.map((v, i) => Math.round(v + (B[i] - v) * t).toString(16).padStart(2, '0')).join(''); };
const BT = {
  rnd(seed){ let s = seed % 2147483647 || 1; return () => { s = (s * 16807) % 2147483647; return (s - 1) / 2147483646; }; },
  q(x0, y0, cx, cy, x1, y1, t){ const u = 1 - t; return [u * u * x0 + 2 * u * t * cx + t * t * x1, u * u * y0 + 2 * u * t * cy + t * t * y1]; },
  qa(x0, y0, cx, cy, x1, y1, t){ return Math.atan2(2 * (1 - t) * (cy - y0) + 2 * t * (y1 - cy), 2 * (1 - t) * (cx - x0) + 2 * t * (x1 - cx)); },
  stroke(c, col, lw, al = 1){ c.strokeStyle = col; c.lineWidth = lw; c.globalAlpha = al; c.stroke(); c.globalAlpha = 1; },
  fill(c, col, al = 1){ c.fillStyle = col; c.globalAlpha = al; c.fill(); c.globalAlpha = 1; },
  stem(c, col, x0, y0, cx, cy, x1, y1, lw = 0.55){ c.beginPath(); c.moveTo(x0, y0); c.quadraticCurveTo(cx, cy, x1, y1); BT.stroke(c, col, lw); },
  /* лист шавлії: двотонний, з центральною і боковими жилками */
  leaf(c, P, x, y, a, l, w, seed = 1){
    const dark = mixHex(P.leaf, '#20281c', 0.35), light = mixHex(P.leaf, '#ffffff', 0.28);
    c.save(); c.translate(x, y); c.rotate(a);
    c.beginPath(); c.moveTo(0, 0); c.bezierCurveTo(w, -l * 0.22, w * 0.85, -l * 0.72, 0, -l); c.bezierCurveTo(-w * 0.85, -l * 0.72, -w, -l * 0.22, 0, 0); c.closePath();
    BT.fill(c, P.leaf); BT.stroke(c, dark, 0.32, 0.85);
    c.beginPath(); c.moveTo(0, 0); c.bezierCurveTo(-w, -l * 0.22, -w * 0.85, -l * 0.72, 0, -l); c.quadraticCurveTo(l * 0.03, -l * 0.5, 0, 0); c.closePath(); BT.fill(c, light, 0.85);
    c.beginPath(); c.moveTo(0, 0); c.quadraticCurveTo(l * 0.03, -l * 0.5, 0, -l * 0.95); BT.stroke(c, dark, 0.26, 0.8);
    for (let k = 1; k <= 3; k++){ const t = k / 4.2; c.beginPath(); c.moveTo(0, -l * t); c.quadraticCurveTo(w * 0.35, -l * (t + 0.06), w * 0.6, -l * (t + 0.15)); c.moveTo(0, -l * t); c.quadraticCurveTo(-w * 0.35, -l * (t + 0.06), -w * 0.6, -l * (t + 0.15)); BT.stroke(c, dark, 0.16, 0.6); }
    c.restore();
  },
  /* дрібні листочки вздовж стебла (папороть / пижмо) */
  leaflets(c, P, x0, y0, cx, cy, x1, y1, n, s, seed = 3){
    BT.stem(c, mixHex(P.leaf, '#20281c', 0.25), x0, y0, cx, cy, x1, y1, 0.4);
    for (let i = 1; i <= n; i++){ const t = 0.15 + 0.85 * i / n, [px, py] = BT.q(x0, y0, cx, cy, x1, y1, t), a = BT.qa(x0, y0, cx, cy, x1, y1, t) + Math.PI / 2, ss = s * (1.15 - t * 0.6);
      BT.leaf(c, P, px, py, a - 1.0, ss, ss * 0.32, seed + i); BT.leaf(c, P, px, py, a - Math.PI + 1.0, ss, ss * 0.32, seed + i * 7); }
    BT.leaf(c, P, x1, y1, BT.qa(x0, y0, cx, cy, x1, y1, 1) + Math.PI / 2, s * 0.7, s * 0.24);
  },
  /* ромашка; squash < 1 — квітка під кутом */
  daisy(c, P, x, y, r, a = 0, squash = 1, seed = 5){
    const R = BT.rnd(seed), n = 18 + Math.floor(R() * 4);
    c.save(); c.translate(x, y); c.rotate(a); c.scale(1, squash);
    for (let k = 0; k < n; k++){ const b = k / n * Math.PI * 2 + (R() - 0.5) * 0.1, l = r * (0.86 + R() * 0.18), w = r * 0.15;
      c.save(); c.rotate(b); c.beginPath(); c.moveTo(0, -r * 0.18); c.bezierCurveTo(w, -r * 0.3, w * 1.05, -l * 0.92, 0, -l); c.bezierCurveTo(-w * 1.05, -l * 0.92, -w, -r * 0.3, 0, -r * 0.18); c.closePath();
      BT.fill(c, P.cream); BT.stroke(c, P.creamLine, 0.22, 0.9); c.beginPath(); c.moveTo(0, -r * 0.35); c.lineTo(0, -l * 0.8); BT.stroke(c, P.creamLine, 0.12, 0.45); c.restore(); }
    const g = c.createRadialGradient(-r * 0.06, -r * 0.08, r * 0.02, 0, 0, r * 0.3); g.addColorStop(0, mixHex(P.yellow, '#ffffff', 0.3)); g.addColorStop(1, P.yellowDeep);
    c.beginPath(); c.arc(0, 0, r * 0.27, 0, Math.PI * 2); c.fillStyle = g; c.fill(); BT.stroke(c, P.yellowDeep, 0.2, 0.8);
    for (let k = 0; k < 14; k++){ const b = k * 2.4, d = Math.sqrt(k / 14) * r * 0.21; c.beginPath(); c.arc(Math.cos(b) * d, Math.sin(b) * d, r * 0.022, 0, Math.PI * 2); BT.fill(c, P.yellowDeep, 0.8); }
    c.restore();
  },
  floret(c, x, y, r, col, line, a = 0, n = 5){
    c.save(); c.translate(x, y); c.rotate(a);
    for (let k = 0; k < n; k++){ c.save(); c.rotate(k / n * Math.PI * 2); c.beginPath(); c.moveTo(0, 0); c.bezierCurveTo(r * 0.55, -r * 0.3, r * 0.5, -r, 0, -r); c.bezierCurveTo(-r * 0.5, -r, -r * 0.55, -r * 0.3, 0, 0); BT.fill(c, col); if (line) BT.stroke(c, line, 0.14, 0.7); c.restore(); }
    c.restore();
  },
  /* бордове суцвіття-колосок (астильба / вереск) */
  spike(c, P, x0, y0, cx, cy, x1, y1, len, wid, seed = 7, fs = 1){
    const R = BT.rnd(seed), deep = mixHex(P.accent, '#000000', 0.25), lite = mixHex(P.accent, '#ffffff', 0.22);
    BT.stem(c, mixHex(P.leaf, '#3a2a22', 0.35), x0, y0, cx, cy, x1, y1, 0.45);
    const t0 = 1 - len; let k = 0;
    for (let t = t0; t <= 1.0001; t += 0.035 * Math.max(0.8, fs)){ const [px, py] = BT.q(x0, y0, cx, cy, x1, y1, t), a = BT.qa(x0, y0, cx, cy, x1, y1, t) + Math.PI / 2, span = wid * (1 - (t - t0) / len * 0.75);
      for (let j = 0; j < 2; j++){ const off = (R() - 0.5) * 2 * span, fx = px + Math.cos(a) * off, fy = py + Math.sin(a) * off, r = (0.9 + R() * 0.9) * fs;
        c.beginPath(); c.moveTo(px, py); c.lineTo(fx, fy); BT.stroke(c, deep, 0.15, 0.6);
        BT.floret(c, fx, fy, r, [P.accent, deep, lite][k++ % 3], null, R() * 3); c.beginPath(); c.arc(fx, fy, r * 0.22, 0, Math.PI * 2); BT.fill(c, mixHex(P.yellow, P.accent, 0.4)); } }
  },
  /* гіпсофіла: розгалужені тонкі стебла з дрібними вершковими квіточками */
  gyps(c, P, x0, y0, x1, y1, seed = 11, depth = 3){
    const R = BT.rnd(seed), stemC = mixHex(P.leaf, '#5a4a36', 0.3);
    const br = (x, y, a, l, d) => { const ex = x + Math.cos(a) * l, ey = y + Math.sin(a) * l; c.beginPath(); c.moveTo(x, y); c.quadraticCurveTo(x + Math.cos(a + 0.2) * l * 0.5, y + Math.sin(a + 0.2) * l * 0.5, ex, ey); BT.stroke(c, stemC, 0.18 + d * 0.06, 0.85);
      if (d <= 0){ const r = 0.75 + R() * 0.55; c.beginPath(); c.arc(ex, ey, r, 0, Math.PI * 2); BT.fill(c, P.gyps); BT.stroke(c, P.creamLine, 0.14, 0.9); c.beginPath(); c.arc(ex, ey, r * 0.35, 0, Math.PI * 2); BT.fill(c, P.gypsDot, 0.9); return; }
      const n = 2 + Math.floor(R() * 2); for (let i = 0; i < n; i++) br(ex, ey, a + (R() - 0.5) * 1.15, l * (0.52 + R() * 0.16), d - 1); };
    const a = Math.atan2(y1 - y0, x1 - x0), L = Math.hypot(x1 - x0, y1 - y0);
    c.beginPath(); c.moveTo(x0, y0); c.lineTo(x0 + Math.cos(a) * L * 0.45, y0 + Math.sin(a) * L * 0.45); BT.stroke(c, stemC, 0.4, 0.9);
    br(x0 + Math.cos(a) * L * 0.45, y0 + Math.sin(a) * L * 0.45, a, L * 0.3, depth);
    br(x0 + Math.cos(a) * L * 0.3, y0 + Math.sin(a) * L * 0.3, a + 0.6, L * 0.25, depth - 1);
  },
  bud(c, P, x, y, r, a, col){
    c.save(); c.translate(x, y); c.rotate(a);
    c.beginPath(); c.ellipse(0, -r, r * 0.62, r, 0, 0, Math.PI * 2); const g = c.createLinearGradient(-r, 0, r, 0); g.addColorStop(0, mixHex(col, '#ffffff', 0.25)); g.addColorStop(1, mixHex(col, '#000000', 0.2)); c.fillStyle = g; c.fill(); BT.stroke(c, mixHex(col, '#000000', 0.35), 0.2, 0.7);
    c.beginPath(); c.moveTo(0, 0); c.quadraticCurveTo(-r * 0.9, -r * 0.3, -r * 0.5, -r * 1.1); c.quadraticCurveTo(-r * 0.2, -r * 0.4, 0, 0); c.moveTo(0, 0); c.quadraticCurveTo(r * 0.9, -r * 0.3, r * 0.5, -r * 1.1); c.quadraticCurveTo(r * 0.2, -r * 0.4, 0, 0); BT.fill(c, P.leaf);
    c.restore();
  },
  /* півонія з рюшевими пелюстками й градієнтом від серцевини */
  peony(c, P, x, y, r, base, seed = 13){
    const R = BT.rnd(seed), deep = mixHex(base, '#6b2030', 0.45), lite = mixHex(base, '#ffffff', 0.45), line = mixHex(base, '#4a1a22', 0.55);
    const petal = (a, l, w, ruf) => { c.save(); c.rotate(a); c.beginPath(); c.moveTo(-w * 0.3, 0); c.bezierCurveTo(-w * 1.1, -l * 0.25, -w * 1.05, -l * 0.85, -w * 0.5, -l * 0.95);
      for (let k = 0; k < 4; k++){ const xa = -w * 0.5 + w * (k + 0.5) / 4, xb = -w * 0.5 + w * (k + 1) / 4; c.quadraticCurveTo(xa, -l * (1.04 + (R() - 0.5) * ruf), xb, -l * (0.95 + (R() - 0.5) * ruf * 0.5)); }
      c.bezierCurveTo(w * 1.05, -l * 0.85, w * 1.1, -l * 0.25, w * 0.3, 0); c.closePath();
      const g = c.createLinearGradient(0, 0, 0, -l); g.addColorStop(0, deep); g.addColorStop(0.55, base); g.addColorStop(1, lite); c.fillStyle = g; c.fill(); BT.stroke(c, line, 0.22, 0.55);
      c.beginPath(); c.moveTo(0, -l * 0.15); c.lineTo((R() - 0.5) * w * 0.3, -l * 0.7); BT.stroke(c, line, 0.12, 0.35); c.restore(); };
    c.save(); c.translate(x, y);
    for (let i = 0; i < 8; i++) petal(i / 8 * Math.PI * 2 + R() * 0.3, r * (0.95 + R() * 0.1), r * 0.55, 0.12);
    for (let i = 0; i < 7; i++) petal(i / 7 * Math.PI * 2 + 0.4 + R() * 0.3, r * 0.72, r * 0.45, 0.14);
    for (let i = 0; i < 6; i++) petal(i / 6 * Math.PI * 2 + 0.1 + R() * 0.4, r * 0.48, r * 0.34, 0.16);
    for (let i = 0; i < 5; i++) petal(i / 5 * Math.PI * 2 + R(), r * 0.27, r * 0.24, 0.2);
    for (let k = 0; k < 9; k++){ const b = R() * Math.PI * 2, d = R() * r * 0.1; c.beginPath(); c.arc(Math.cos(b) * d, Math.sin(b) * d, r * 0.03, 0, Math.PI * 2); BT.fill(c, P.yellow, 0.9); }
    c.restore();
  },
  rose(c, P, x, y, r, base, seed = 17){
    const R = BT.rnd(seed), deep = mixHex(base, '#000000', 0.35), lite = mixHex(base, '#ffffff', 0.3), line = mixHex(base, '#000000', 0.55);
    c.save(); c.translate(x, y);
    for (let i = 0; i < 6; i++){ c.save(); c.rotate(i / 6 * Math.PI * 2 + R() * 0.3); c.beginPath(); c.moveTo(-r * 0.25, 0); c.bezierCurveTo(-r * 0.85, -r * 0.3, -r * 0.7, -r * 1.02, 0, -r); c.bezierCurveTo(r * 0.7, -r * 1.02, r * 0.85, -r * 0.3, r * 0.25, 0); c.closePath();
      const g = c.createLinearGradient(0, 0, 0, -r); g.addColorStop(0, deep); g.addColorStop(1, lite); c.fillStyle = g; c.fill(); BT.stroke(c, line, 0.22, 0.6); c.restore(); }
    for (let i = 0; i < 5; i++){ const rr = r * (0.66 - i * 0.12), a0 = i * 2.2 + R(); c.beginPath(); c.arc(Math.cos(a0) * r * 0.05, Math.sin(a0) * r * 0.05, rr, a0, a0 + 3.6); c.quadraticCurveTo(0, 0, Math.cos(a0) * rr, Math.sin(a0) * rr);
      const g = c.createRadialGradient(0, 0, 0, 0, 0, rr); g.addColorStop(0, deep); g.addColorStop(1, mixHex(base, '#ffffff', 0.12 + i * 0.04)); c.fillStyle = g; c.fill(); BT.stroke(c, line, 0.2, 0.6); }
    c.restore();
  },
  blossom(c, P, x, y, r, col, a = 0){
    const line = mixHex(col, '#4a1a22', 0.5);
    c.save(); c.translate(x, y); c.rotate(a);
    for (let k = 0; k < 5; k++){ c.save(); c.rotate(k / 5 * Math.PI * 2); c.beginPath(); c.moveTo(0, 0); c.bezierCurveTo(r * 0.75, -r * 0.25, r * 0.7, -r * 1.05, r * 0.08, -r * 0.92); c.lineTo(0, -r * 0.82); c.lineTo(-r * 0.08, -r * 0.92); c.bezierCurveTo(-r * 0.7, -r * 1.05, -r * 0.75, -r * 0.25, 0, 0);
      const g = c.createLinearGradient(0, 0, 0, -r); g.addColorStop(0, mixHex(col, '#000000', 0.18)); g.addColorStop(1, mixHex(col, '#ffffff', 0.25)); c.fillStyle = g; c.fill(); BT.stroke(c, line, 0.16, 0.6); c.restore(); }
    for (let k = 0; k < 8; k++){ const b = k / 8 * Math.PI * 2; c.beginPath(); c.moveTo(0, 0); c.lineTo(Math.cos(b) * r * 0.38, Math.sin(b) * r * 0.38); BT.stroke(c, line, 0.12, 0.8); c.beginPath(); c.arc(Math.cos(b) * r * 0.4, Math.sin(b) * r * 0.4, r * 0.05, 0, Math.PI * 2); BT.fill(c, P.yellow); }
    c.restore();
  },
  pal(el){ const P = Object.assign({}, BOT); if (el && el.tint) P.accent = el.tint; if (el && el.tint2) P.leaf = el.tint2; return P; }
};
const botanic = (name, ar, fn, extra = {}) => Object.assign({ name, ar, tint2: BOT.leaf, draw(c, el){ const P = BT.pal(el); c.save(); if (el && el.flip){ c.translate(100, 0); c.scale(-1, 1); } c.lineCap = c.lineJoin = 'round'; fn(c, P); c.restore(); } }, extra);
const BOTANICA = {
  /* висока гілка польових квітів (як на «Мамо, дякую за тепло») */
  wildspray: botanic('Польовий букет', 1.15, (c, P) => {
    const H = 115, sc = mixHex(P.leaf, '#3a2a22', 0.3);
    BT.gyps(c, P, 46, H, 10, 30, 31, 3); BT.gyps(c, P, 56, H, 90, 24, 41, 3); BT.gyps(c, P, 50, H, 40, 6, 47, 3); BT.gyps(c, P, 52, H, 72, 8, 43, 3); BT.gyps(c, P, 48, H, 4, 70, 37, 2); BT.gyps(c, P, 54, H, 96, 66, 39, 2);
    BT.leaflets(c, P, 48, H, 30, 96, 12, 74, 4, 8.5, 2); BT.leaflets(c, P, 54, H, 72, 96, 90, 80, 4, 8, 9); BT.leaflets(c, P, 52, H, 56, 80, 62, 40, 4, 7.5, 15);
    BT.spike(c, P, 50, H, 38, 60, 30, 12, 0.45, 5.2, 7, 1.25); BT.spike(c, P, 54, H, 62, 66, 60, 18, 0.42, 4.6, 19, 1.2); BT.spike(c, P, 49, H, 24, 84, 14, 48, 0.42, 4.2, 23, 1.15); BT.spike(c, P, 55, H, 80, 84, 86, 42, 0.42, 4.2, 29, 1.15); BT.spike(c, P, 53, H, 70, 96, 74, 64, 0.45, 3.6, 37, 1.1);
    [[47, H, 36, 98, 28, 82], [53, H, 60, 100, 66, 86], [52, H, 68, 78, 76, 58], [50, H, 44, 76, 40, 54], [51, H, 52, 84, 54, 68]].forEach((p) => BT.stem(c, sc, ...p, 0.55));
    BT.leaf(c, P, 48, H, -0.6, 28, 7.2); BT.leaf(c, P, 54, H, 0.55, 26, 6.8); BT.leaf(c, P, 51, H - 2, -0.08, 22, 5.8); BT.leaf(c, P, 40, 100, -1.25, 17, 4.6); BT.leaf(c, P, 62, 96, 1.15, 16, 4.4); BT.leaf(c, P, 30, 90, -0.8, 13, 3.6); BT.leaf(c, P, 72, 76, 0.9, 13, 3.6);
    BT.blossom(c, P, 86, 58, 5.5, P.blushDeep, 0.4); BT.blossom(c, P, 14, 62, 5, P.blush, 1.0); BT.blossom(c, P, 60, 50, 4.5, P.blush, 0.2);
    BT.daisy(c, P, 28, 82, 13, -0.3, 0.95, 5); BT.daisy(c, P, 66, 88, 10.5, 0.4, 0.72, 9); BT.daisy(c, P, 76, 58, 9, 0.2, 0.9, 13); BT.daisy(c, P, 40, 54, 7.5, -0.5, 0.62, 17); BT.daisy(c, P, 54, 68, 6.5, 0.1, 0.85, 19);
    BT.bud(c, P, 44, 32, 3, -0.3, P.accent); BT.bud(c, P, 88, 34, 2.6, 0.5, P.blushDeep); BT.bud(c, P, 12, 40, 2.6, -0.6, P.accent);
  }),
  /* низька смуга: гіпсофіла, дрібні ромашки й суцвіття */
  wildlow: botanic('Луговий бордюр', 0.45, (c, P) => {
    const H = 45;
    BT.gyps(c, P, 16, H, 6, 8, 51, 3); BT.gyps(c, P, 42, H, 40, 4, 53, 3); BT.gyps(c, P, 62, H, 66, 6, 55, 3); BT.gyps(c, P, 86, H, 96, 10, 57, 3);
    BT.spike(c, P, 28, H, 26, 30, 24, 10, 0.55, 3.4, 61, 1.15); BT.spike(c, P, 54, H, 54, 28, 52, 6, 0.5, 3.2, 63, 1.1); BT.spike(c, P, 76, H, 78, 30, 82, 12, 0.55, 3.2, 67, 1.1);
    BT.leaflets(c, P, 8, H, 6, 34, 2, 22, 2, 6, 64); BT.leaflets(c, P, 94, H, 96, 34, 99, 24, 2, 6, 66);
    BT.leaf(c, P, 22, H, -0.9, 16, 4.2); BT.leaf(c, P, 36, H, 0.8, 15, 4); BT.leaf(c, P, 50, H, -0.3, 14, 3.8); BT.leaf(c, P, 64, H, 0.7, 15, 4); BT.leaf(c, P, 82, H, -0.8, 15, 4); BT.leaf(c, P, 90, H, 0.6, 12, 3.4);
    BT.daisy(c, P, 16, 30, 8, -0.2, 0.75, 71); BT.daisy(c, P, 42, 28, 8.5, 0.1, 0.85, 73); BT.daisy(c, P, 66, 32, 7, 0.3, 0.7, 77); BT.daisy(c, P, 88, 28, 7.5, 0.3, 0.8, 79);
    BT.blossom(c, P, 30, 36, 3.6, P.blush, 0.5); BT.blossom(c, P, 76, 38, 3.4, P.blushDeep, 1.2);
  }),
  /* бічна квіткова гілка-рамка (як на «Твій найкращий рік») */
  vine: botanic('Квіткова гілка', 2.3, (c, P) => {
    const sc = mixHex(P.leaf, '#3a2a22', 0.3), A = [70, 228, 18, 172, 48, 114], B = [48, 114, 82, 56, 42, 6], Rr = BT.rnd(201);
    const along = (seg, t) => BT.q(...seg, t), ang = (seg, t) => BT.qa(...seg, t);
    c.beginPath(); c.moveTo(A[0], A[1]); c.quadraticCurveTo(A[2], A[3], A[4], A[5]); c.quadraticCurveTo(B[2], B[3], B[4], B[5]); BT.stroke(c, sc, 0.6);
    BT.leaflets(c, P, 34, 176, 14, 152, 8, 128, 3, 6.5, 81); BT.leaflets(c, P, 66, 76, 90, 66, 94, 48, 3, 6, 83); BT.leaflets(c, P, 40, 130, 70, 130, 86, 116, 3, 5.5, 85);
    BT.gyps(c, P, 50, 120, 86, 104, 87, 2); BT.gyps(c, P, 62, 40, 94, 26, 89, 2); BT.gyps(c, P, 30, 168, 6, 190, 93, 2);
    [A, B].forEach((seg, si) => { for (let i = 1; i < 9; i++){ const t = i / 9, [x, y] = along(seg, t), a = ang(seg, t) + Math.PI / 2, side = (i + si) % 2 ? 1 : -1; BT.leaf(c, P, x, y, a + side * 1.0 + (side > 0 ? 0 : Math.PI), 12 + Rr() * 5, 3.8 + Rr(), 210 + i); } });
    BT.spike(c, P, 56, 156, 74, 168, 92, 182, 0.62, 3, 91, 1.2); BT.spike(c, P, 60, 88, 36, 76, 16, 62, 0.6, 2.8, 95, 1.2); BT.daisy(c, P, 76, 172, 7, 0.4, 0.8, 97); BT.daisy(c, P, 20, 66, 6, -0.4, 0.75, 99);
    BT.blossom(c, P, 36, 200, 13.5, P.accent, 0.3); BT.blossom(c, P, 22, 186, 8.8, P.blushDeep, 1.0); BT.blossom(c, P, 70, 146, 10.8, P.blush, 1.1); BT.blossom(c, P, 36, 106, 12.2, P.accent, 0.6);
    BT.blossom(c, P, 56, 98, 8.1, P.blush, 0.2); BT.blossom(c, P, 78, 52, 10.1, P.blushDeep, 0.2); BT.blossom(c, P, 34, 24, 8.8, P.accent, 0.9);
    BT.gyps(c, P, 44, 70, 14, 50, 231, 2); BT.leaflets(c, P, 46, 150, 70, 150, 84, 136, 3, 6, 233); BT.leaflets(c, P, 60, 30, 76, 16, 82, 4, 3, 5.5, 235);
    BT.bud(c, P, 42, 6, 2.6, -0.4, P.accent); BT.bud(c, P, 10, 128, 2.2, -0.9, P.accent); BT.bud(c, P, 92, 112, 2.2, 0.8, P.blushDeep); BT.bud(c, P, 88, 40, 2, 0.6, P.accent);
  }),
  /* букет півоній і троянд (як на «Квітни») */
  peonybunch: botanic('Півонії й троянди', 1, (c, P) => {
    BT.leaflets(c, P, 40, 60, 14, 40, 4, 12, 3, 7, 101); BT.leaflets(c, P, 60, 56, 86, 86, 98, 92, 3, 6.5, 103);
    [[30, 64, -2.3, 20, 6], [44, 70, 3.0, 18, 5.2], [68, 40, 0.9, 18, 5.4], [74, 66, 2.2, 17, 5], [22, 40, -1.1, 15, 4.4], [58, 76, -2.9, 15, 4.4]].forEach(([x, y, a, l, w]) => BT.leaf(c, P, x, y, a, l, w));
    BT.gyps(c, P, 50, 50, 92, 14, 107, 3); BT.gyps(c, P, 48, 52, 8, 88, 109, 3);
    BT.gyps(c, P, 52, 48, 70, 2, 117, 3); BT.gyps(c, P, 46, 54, 34, 96, 119, 2); BT.leaflets(c, P, 46, 50, 30, 20, 26, 2, 3, 6, 121); BT.leaflets(c, P, 56, 54, 80, 64, 96, 66, 3, 6, 123);
    [[86, 30, 1.6, 14, 4], [12, 54, -1.7, 14, 4], [52, 84, 3.3, 14, 4], [36, 16, -0.5, 12, 3.4]].forEach(([x, y, a, l, w]) => BT.leaf(c, P, x, y, a, l, w));
    BT.spike(c, P, 56, 52, 62, 76, 56, 96, 0.6, 2.8, 125, 1.1); BT.daisy(c, P, 86, 22, 6, 0.4, 0.75, 127);
    BT.spike(c, P, 60, 50, 74, 30, 84, 14, 0.6, 3, 111); BT.spike(c, P, 40, 56, 26, 70, 12, 76, 0.55, 2.8, 113);
    BT.daisy(c, P, 18, 62, 7, -0.4, 0.8, 115); BT.blossom(c, P, 84, 76, 5, P.blushDeep, 0.3); BT.rose(c, P, 68, 58, 14, P.accent, 17); BT.peony(c, P, 40, 40, 22, P.blush, 13);
    BT.bud(c, P, 86, 40, 3.6, 1.1, P.blush); BT.bud(c, P, 20, 18, 3, -0.6, P.accent);
  }),
  /* вінок із зелені, білих квітів і бордових бутонів (як на «Анна & Максим») */
  greenwreath: botanic('Квітковий вінок', 1, (c, P) => {
    const R0 = 38, cx = 50, cy = 50, Rr = BT.rnd(121), sc = mixHex(P.leaf, '#3a2a22', 0.3), at = (a, d = 0) => [cx + Math.cos(a) * (R0 + d), cy + Math.sin(a) * (R0 + d)];
    c.beginPath(); c.arc(cx, cy, R0, 0, Math.PI * 2); BT.stroke(c, sc, 0.45, 0.9);
    for (let i = 0; i < 7; i++){ const a = i / 7 * Math.PI * 2 + 0.3, [px, py] = at(a), [qx, qy] = at(a + 0.35, 6 * (i % 2 ? 1 : -1)); BT.gyps(c, P, px, py, qx, qy, 140 + i, 2); }
    for (let i = 0; i < 40; i++){ const a = i / 40 * Math.PI * 2, [px, py] = at(a), side = i % 2 ? 1 : -1; BT.leaf(c, P, px, py, a + Math.PI / 2 + side * 0.95 + Math.PI, 9.5 + Rr() * 4, 3 + Rr() * 0.7, 130 + i); }
    for (let i = 0; i < 5; i++){ const a = i / 5 * Math.PI * 2 + 0.9, [px, py] = at(a), [qx, qy] = at(a + 0.32, i % 2 ? 4 : -4); BT.spike(c, P, px, py, (px + qx) / 2, (py + qy) / 2, qx, qy, 0.7, 2.2, 160 + i, 1.15); }
    [[0.2, 8], [1.2, 6.5], [2.1, 7.5], [3.0, 6.2], [3.85, 8], [4.7, 6.5], [5.55, 7.2]].forEach(([a, r], i) => { const [x, y] = at(a); BT.blossom(c, P, x, y, r, i % 3 === 1 ? P.blush : P.cream, a); });
    [0.7, 1.65, 2.55, 3.45, 4.25, 5.1, 5.95].forEach((a, i) => { const [x, y] = at(a, i % 2 ? 2 : -2); BT.bud(c, P, x, y, 2, a + Math.PI / 2, i % 2 ? P.accent : P.blushDeep); });
    [1.45, 4.0, 5.3].forEach((a, i) => { const [x, y] = at(a); BT.daisy(c, P, x, y, 6, a, 0.9, 150 + i); });
  })
};
Object.assign(GRAPHICS, BOTANICA);

const T = (o) => Object.assign({ type: 'text', align: 'center', rot: 0, lh: 1.18, weight: null }, o);
const G = (id, o) => Object.assign({ type: 'graphic', graphicId: id, rot: 0 }, o);
/* Координати шаблонів задані в кадрі 100 × 56 мм і центруються на фронтальній частині зони.
   Шаблони з abs: true отримують розміри зони й розкладають елементи по всьому колу. */
const TEMPLATES = [
  { id: 'pattern', chip: false, name: 'Візерунок по колу', colorId: 'clear', abs: true, els: (Z) => [
    ...[0.06, 0.18, 0.30, 0.70, 0.82, 0.94].map((f, i) => G('sparkle', { x: Z.widthMm * f, y: Z.heightMm * (i % 2 ? 0.32 : 0.64), w: 20, tint: '#B08443' })),
    T({ text: 'Світла тобі', font: 'Marck Script', size: 9.5, color: '#5E4420', x: Z.widthMm / 2, y: Z.heightMm * 0.47 }) ]},
  { id: 'minimal', chip: false, name: 'Мінімалістичний напис', colorId: 'white', els: () => [
    T({ text: 'Повільний вечір', font: 'Prata', size: 8.6, color: '#2B2724', x: 50, y: 25 }),
    T({ text: 'ДЛЯ ТЕБЕ', font: 'Manrope', size: 3.2, weight: 700, color: '#76695D', x: 50, y: 36 }) ]},
  { id: 'birthday', chip: false, name: 'З днем народження', colorId: 'white', els: () => [
    G('sparkle', { x: 50, y: 13, w: 30, tint: '#8C2F39' }),
    T({ text: 'З днем народження', font: 'Caveat', size: 9, color: '#7E2833', x: 50, y: 32 }),
    T({ text: 'ОЛЯ · 30', font: 'Manrope', size: 3.4, weight: 700, color: '#5A2A2F', x: 50, y: 44 }) ]},
  { id: 'wedding', chip: false, name: 'Весільна свічка', colorId: 'clear', els: () => [
    G('wreath', { x: 50, y: 24, w: 40, tint: '#6E7A5C' }),
    T({ text: 'А & М', font: 'Playfair Display', size: 8, color: '#3B3A33', x: 50, y: 24.5 }),
    T({ text: 'Анна і Максим · 12.06.2027', font: 'Manrope', size: 3, color: '#5C5A50', x: 50, y: 50 }) ]},
  { id: 'loved', chip: false, name: 'Подарунок близькій людині', colorId: 'white', els: () => [
    G('heart', { x: 50, y: 13, w: 13, tint: '#7A2E2E' }),
    T({ text: 'Мамі', font: 'Marck Script', size: 13, color: '#3D2B22', x: 50, y: 30 }),
    T({ text: 'з теплом і вдячністю', font: 'Manrope', size: 3.4, color: '#4F3C31', x: 50, y: 44 }) ]},
  { id: 'vows', chip: false, name: 'Назавжди разом', colorId: 'white', els: () => [
    T({ text: 'Назавжди разом', font: 'Marck Script', size: 10.5, color: '#6B3F6E', x: 50, y: 25 }),
    T({ text: 'ОЛЕНА + ТАРАС', font: 'Manrope', size: 3.2, weight: 700, color: '#7A607C', x: 50, y: 37 }),
    T({ text: '14.02.2027', font: 'Manrope', size: 3, weight: 600, color: '#7A607C', x: 50, y: 43 }) ]},
  { id: 'team', chip: false, name: 'Подяка команді', colorId: 'clear', els: () => [
    G('mark', { x: 50, y: 14, w: 14, tint: '#2F4A3A' }),
    T({ text: 'Дякуємо, що ви з нами', font: 'Playfair Display', size: 6, color: '#2F4A3A', x: 50, y: 31 }),
    T({ text: 'КОМАНДА ВАШОЇ КОМПАНІЇ', font: 'Manrope', size: 2.8, weight: 700, color: '#46604F', x: 50, y: 41 }) ]},
  { id: 'botanical', chip: false, name: 'Ботанічна колекція', colorId: 'clear', abs: true, els: (Z) => [
    ...[0.06, 0.17, 0.28, 0.39, 0.61, 0.72, 0.83, 0.94].map((f, i) => G('sprig', { x: Z.widthMm * f, y: Z.heightMm - 13, w: i % 2 ? 15 : 18, rot: i % 2 ? 10 : -10, tint: '#A57E45' })),
    T({ text: 'R', font: 'Prata', size: 7, color: '#A57E45', x: Z.widthMm / 2, y: Z.heightMm * 0.36 }) ]},
  { id: 'special', chip: false, name: 'Ти — особлива', colorId: 'clear', els: () => [
    T({ text: 'Ти —\nособлива', font: 'Marck Script', size: 10, lh: 1.05, color: '#8E2433', x: 50, y: 22 }),
    G('heart', { x: 50, y: 42, w: 7, tint: '#B4232F' }) ]},
  { id: 'deadline', chip: false, name: 'Дедлайни зачекають', colorId: 'clear', els: () => [
    T({ text: 'Горить свічка.\nДедлайни\nзачекають.', font: 'Manrope', weight: 800, size: 6.2, lh: 1.12, color: '#3E2A4A', x: 50, y: 22 }),
    G('flame', { x: 50, y: 43, w: 4.6, tint: '#3E2A4A' }) ]},
  { id: 'brand', chip: false, name: 'Логотип і орнамент', colorId: 'clear', abs: true, els: (Z) => [
    ...[0.08, 0.2, 0.33, 0.67, 0.8, 0.92].map((f, i) => G('sprig', { x: Z.widthMm * f, y: Z.heightMm - 13, w: i % 2 ? 15 : 18, rot: i % 2 ? 8 : -8, tint: '#2E3B30' })),
    T({ text: 'RDK', font: 'Playfair Display', size: 10, color: '#1F2A22', x: Z.widthMm / 2, y: Z.heightMm * 0.3 }),
    T({ text: 'FOR YOUR TEAM', font: 'Manrope', size: 2.6, weight: 600, color: '#1F2A22', x: Z.widthMm / 2, y: Z.heightMm * 0.46 }) ]},
  { id: 'mama', chip: false, name: 'Мамо, дякую за тепло', colorId: 'clear', abs: true, els: (Z) => [
    ...[0.08, 0.2, 0.31, 0.69, 0.8, 0.92].map((f, i) => G('sprig', { x: Z.widthMm * f, y: Z.heightMm - 13, w: i % 2 ? 15 : 18, rot: i % 2 ? 10 : -10, tint: i % 3 === 1 ? '#5F7058' : '#7A1F2B' })),
    T({ text: 'Мамо,\nдякую за тепло', font: 'Marck Script', size: 8, lh: 1.1, color: '#6E1A26', x: Z.widthMm / 2, y: Z.heightMm * 0.36 }) ]},
  { id: 'bestyear', chip: false, name: 'Твій найкращий рік', colorId: 'clear', els: () => [
    G('sprig', { x: 16, y: 30, w: 14, rot: -14, tint: '#7A1F2B' }), G('sprig', { x: 84, y: 30, w: 14, rot: 14, tint: '#7A1F2B' }),
    T({ text: 'Твій\nнайкращий рік', font: 'Marck Script', size: 8, lh: 1.05, color: '#6E1A26', x: 50, y: 20 }),
    T({ text: 'З днем народження', font: 'Prata', size: 3.2, color: '#6E1A26', x: 50, y: 34 }),
    G('heart', { x: 50, y: 41, w: 3.2, tint: '#6E1A26' }) ]},
  { id: 'kvitny', chip: false, name: 'Квітни', colorId: 'clear', abs: true, els: (Z) => [
    ...[0.05, 0.14, 0.23, 0.32, 0.41, 0.59, 0.68, 0.77, 0.86, 0.95].map((f, i) => G('sprig', { x: Z.widthMm * f, y: i % 2 ? Z.heightMm - 13 : 15, w: 17, rot: i % 2 ? 6 : 186, tint: i % 3 === 0 ? '#8E2433' : i % 3 === 1 ? '#C48A8F' : '#5F7058' })),
    T({ text: 'Квітни', font: 'Marck Script', size: 9, color: '#A57E45', x: Z.widthMm / 2, y: Z.heightMm / 2 }) ]},
  { id: 'anna', chip: false, name: 'Анна & Максим', colorId: 'clear', els: () => [
    G('wreath', { x: 50, y: 25, w: 42, tint: '#6E7A5C' }),
    T({ text: 'Анна\n&\nМаксим', font: 'Prata', size: 4.6, lh: 1.15, color: '#6E1A26', x: 50, y: 24 }),
    T({ text: '24.10.2026', font: 'Prata', size: 2.8, color: '#6E1A26', x: 50, y: 50 }) ]},
  { id: 'together', chip: false, name: 'Разом — назавжди', colorId: 'clear', els: () => [
    G('heart', { x: 50, y: 13, w: 6, tint: '#7A1F2B' }),
    T({ text: 'Разом — назавжди', font: 'Marck Script', size: 8, color: '#6E1A26', x: 50, y: 27 }),
    T({ text: '5 РОКІВ КОХАННЯ', font: 'Manrope', size: 2.8, weight: 600, color: '#6E1A26', x: 50, y: 36 }) ]},
  { id: 'onlyus', chip: false, name: 'Тільки ми', colorId: 'clear', els: () => [
    G('sprig', { x: 50, y: 17, w: 14, tint: '#F1E3C8' }),
    T({ text: 'Тільки ми', font: 'Prata', size: 5.5, color: '#F1E3C8', x: 50, y: 36 }) ]},
  { id: 'nova', chip: false, name: 'NOVA Partners', colorId: 'clear', els: () => [
    T({ text: 'NOVA', font: 'Playfair Display', size: 9, color: '#E9DCC2', x: 50, y: 18 }),
    T({ text: 'PARTNERS', font: 'Manrope', size: 2.6, weight: 600, color: '#E9DCC2', x: 50, y: 27 }),
    T({ text: 'Дякуємо за партнерство', font: 'Prata', size: 3.4, color: '#E9DCC2', x: 50, y: 37 }) ]},
  { id: 'forma', chip: false, name: 'FORMA', colorId: 'clear', abs: true, els: (Z) => [
    G('arches', { x: Z.widthMm * 0.33, y: Z.heightMm / 2, w: 22, tint: '#7A1F2B' }), G('arches', { x: Z.widthMm * 0.67, y: Z.heightMm / 2, w: 22, rot: 180, tint: '#7A1F2B' }),
    T({ text: 'FORMA', font: 'Manrope', size: 7, weight: 600, color: '#7A1F2B', x: Z.widthMm / 2, y: Z.heightMm * 0.4 }),
    T({ text: 'Разом створюємо більше', font: 'Manrope', size: 2.8, weight: 600, color: '#7A1F2B', x: Z.widthMm / 2, y: Z.heightMm * 0.54 }) ]},
  { id: 'logo', chip: false, name: 'Логотип компанії', colorId: 'black', els: () => [
    G('mark', { x: 50, y: 20, w: 22, tint: '#E9E2D6' }),
    T({ text: 'НАЗВА КОМПАНІЇ', font: 'Oswald', size: 5.4, color: '#E9E2D6', x: 50, y: 40 }) ]},
  { id: 'mountains', chip: false, name: 'Ілюстрація', colorId: 'black', els: () => [
    G('mountains', { x: 50, y: 20, w: 56, tint: '#EADFC8' }),
    T({ text: 'Карпати', font: 'Prata', size: 7.5, color: '#EADFC8', x: 50, y: 42 }) ]}
];

/* ===================== Утиліти ===================== */
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const uid = () => Math.random().toString(36).slice(2, 10);
const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
const DEG = Math.PI / 180;
const r1 = (v) => Math.round(v * 10) / 10;
const r2 = (v) => Math.round(v * 100) / 100;
const fmt = (v, d = 1) => Number(v).toLocaleString('uk-UA', { maximumFractionDigits: d, minimumFractionDigits: 0 });
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
function hexToRgb(h){ h = h.replace('#', ''); if (h.length === 3) h = h.split('').map((c) => c + c).join(''); const n = parseInt(h, 16); return [n >> 16 & 255, n >> 8 & 255, n & 255]; }
function rgbToHex(a){ return '#' + a.map((v) => clamp(Math.round(v), 0, 255).toString(16).padStart(2, '0')).join(''); }
function mix(a, b, t){ const x = hexToRgb(a), y = hexToRgb(b); return rgbToHex(x.map((v, i) => v + (y[i] - v) * t)); }
function lum(h){ const [r, g, b] = hexToRgb(h).map((v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; }); return 0.2126 * r + 0.7152 * g + 0.0722 * b; }
const colorById = (id) => {
  if (id === 'custom' && CONFIG.customColor.enabled) return { id: 'custom', name: CONFIG.customColor.name, hex: state.custom.hex || CONFIG.customColor.defaultPreviewHex, custom: true, finish: 'custom' };
  return CONFIG.colors.find((c) => c.id === id) || CONFIG.colors[0];
};
const allScents = () => CONFIG.scents.groups.flatMap((g) => g.items.map((i) => Object.assign({ group: g.id, groupName: g.name }, i)));
const scentById = (id) => {
  if (id === 'other' && CONFIG.scents.other && CONFIG.scents.other.enabled) return { id: 'other', group: 'other', groupName: 'за запитом', name: state.scentOther.trim() ? `За запитом: ${state.scentOther.trim()}` : 'Інший аромат за запитом' };
  return allScents().find((x) => x.id === id) || null;
};
const wickById = (id) => CONFIG.wicks.find((w) => w.id === id) || CONFIG.wicks[0];
const scentLabel = () => state.scentMode === 'scent' ? (scentById(state.scentId)?.name || 'аромат не обрано') : 'Без аромату';
const fontById = (id) => FONTS.find((f) => f.id === id) || FONTS[0];
let _zone = null;
/* Зона друку в мм. Для друку по колу ширина = довжина кола, шов ззаду (x = 0 і x = ширина). */
const ZONE = () => {
  if (_zone) return _zone;
  const V = CONFIG.vessel, P = V.printArea, C = Math.round(Math.PI * V.diameterMm * 10) / 10;
  _zone = { wrap: !!P.wrap, widthMm: P.wrap ? C : P.widthMm, heightMm: P.heightMm, offsetFromBottomMm: P.offsetFromBottomMm };
  return _zone;
};
function swatchBg(c){ return c.clear ? 'linear-gradient(90deg, rgba(255,255,255,.65), rgba(255,255,255,.08) 35%, rgba(255,255,255,.7) 72%, rgba(255,255,255,.12)), repeating-conic-gradient(#cfd5d1 0 25%, #f3f5f3 0 50%) 0 0/10px 10px' : c.hex; }
const frontU = () => { const Z = ZONE(); if (!Z.wrap) return Z.widthMm / 2; const R = CONFIG.vessel.diameterMm / 2; let u = state.spin * DEG * R + Z.widthMm / 2; return ((u % Z.widthMm) + Z.widthMm) % Z.widthMm; };
const MIN_TEXT = 1.8, MIN_IMG = 4;
const ICON = {
  up: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 15l6-6 6 6"/></svg>',
  down: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9l6 6 6-6"/></svg>',
  trash: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M4 7h16M10 11v6M14 11v6M6 7l1 12a2 2 0 002 2h6a2 2 0 002-2l1-12M9 7V4h6v3"/></svg>',
  ok: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>',
  warn: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M12 3l9.5 17h-19z"/><path d="M12 10v4.5M12 17.5v.3"/></svg>'
};

/* ===================== Геометрія елементів ===================== */
const mctx = document.createElement('canvas').getContext('2d');
function measureText(el){
  const f = fontById(el.font);
  mctx.font = `${el.weight || f.weight} 100px ${f.css}`;
  const lines = String(el.text || '').split('\n');
  let mw = 0; for (const l of lines) mw = Math.max(mw, mctx.measureText(l || ' ').width);
  return { w: Math.max(mw / 100 * el.size, el.size * 0.4), h: lines.length * el.size * (el.lh || 1.18), lines };
}
function elSize(el){
  if (el.type === 'text') return measureText(el);
  let ar = 1;
  if (el.type === 'image'){ const a = assets[el.assetId]; ar = a ? a.h / a.w : 1; }
  else ar = GRAPHICS[el.graphicId].ar;
  return { w: el.w, h: el.w * ar };
}
function aabb(el){ const { w, h } = elSize(el); const r = (el.rot || 0) * DEG; const c = Math.abs(Math.cos(r)), s = Math.abs(Math.sin(r)); return { W: w * c + h * s, H: w * s + h * c }; }
/* Утримує елемент повністю в межах зони друку: зменшує, якщо не вміщується, і зсуває до країв. */
function clampEl(el){
  const Z = ZONE();
  for (let i = 0; i < 4; i++){
    const { W, H } = aabb(el);
    if (W > Z.widthMm + 1e-6 || H > Z.heightMm + 1e-6){
      const f = Math.min(Z.widthMm / W, Z.heightMm / H) * 0.998;
      if (el.type === 'text'){ if (el.size <= MIN_TEXT) break; el.size = Math.max(MIN_TEXT, el.size * f); }
      else { if (el.w <= MIN_IMG) break; el.w = Math.max(MIN_IMG, el.w * f); }
      continue;
    }
    break;
  }
  const { W, H } = aabb(el);
  el.x = W >= Z.widthMm ? Z.widthMm / 2 : clamp(el.x, W / 2, Z.widthMm - W / 2);
  el.y = H >= Z.heightMm ? Z.heightMm / 2 : clamp(el.y, H / 2, Z.heightMm - H / 2);
}
function dpiOf(el){ const a = assets[el.assetId]; if (!a) return 0; return a.w / (el.w / 25.4); }
function qualityOf(el){
  if (el.type !== 'image') return null;
  const dpi = dpiOf(el), P = CONFIG.print, a = assets[el.assetId];
  const maxW = a ? (a.w / P.goodDpi) * 25.4 : 0, pct = Math.max(5, Math.floor(maxW / el.w * 100 / 5) * 5);
  if (dpi >= P.goodDpi) return { level: 'ok', dpi, maxW, text: 'Якість зображення достатня для цього розміру.' };
  if (dpi >= P.minDpi) return { level: 'warn', dpi, maxW, text: `Можлива легка розмитість. Для чіткого друку зменш зображення приблизно до ${pct}% поточного розміру або завантаж файл з більшою роздільністю.` };
  return { level: 'bad', dpi, maxW, text: `Недостатня якість для такого розміру. Зменш зображення приблизно до ${pct}% поточного розміру або завантаж файл з більшою роздільністю.` };
}

/* ===================== Рендер дизайну (виробничий шар) ===================== */
function drawElements(ctx, els, k){
  ctx.imageSmoothingEnabled = true; ctx.imageSmoothingQuality = 'high';
  for (const el of els){
    const sz = elSize(el);
    ctx.save();
    ctx.translate(el.x * k, el.y * k);
    ctx.rotate((el.rot || 0) * DEG);
    if (el.type === 'text'){
      const f = fontById(el.font);
      ctx.font = `${el.weight || f.weight} ${el.size * k}px ${f.css}`;
      ctx.fillStyle = el.color; ctx.textBaseline = 'middle'; ctx.textAlign = el.align || 'center';
      const ax = el.align === 'left' ? -sz.w / 2 : el.align === 'right' ? sz.w / 2 : 0;
      const lh = el.size * (el.lh || 1.18);
      sz.lines.forEach((ln, i) => ctx.fillText(ln, ax * k, (-sz.h / 2 + lh * (i + 0.5)) * k));
    } else if (el.type === 'image'){
      const a = assets[el.assetId];
      if (a && a.img) ctx.drawImage(a.img, -sz.w / 2 * k, -sz.h / 2 * k, sz.w * k, sz.h * k);
      else { ctx.fillStyle = 'rgba(0,0,0,.12)'; ctx.fillRect(-sz.w / 2 * k, -sz.h / 2 * k, sz.w * k, sz.h * k); }
    } else if (el.type === 'graphic'){
      const g = GRAPHICS[el.graphicId];
      ctx.translate(-sz.w / 2 * k, -sz.h / 2 * k);
      ctx.scale(sz.w * k / 100, sz.h * k / (100 * g.ar));
      ctx.fillStyle = ctx.strokeStyle = el.tint; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
      g.draw(ctx, el);
    }
    ctx.restore();
  }
}
function flatCanvas(els, k, reuse, bg){
  const Z = ZONE(); const c = reuse || document.createElement('canvas');
  const w = Math.max(1, Math.ceil(Z.widthMm * k)), h = Math.max(1, Math.ceil(Z.heightMm * k));
  if (c.width !== w || c.height !== h){ c.width = w; c.height = h; }
  const x = c.getContext('2d'); x.setTransform(1, 0, 0, 1, 0, 0); x.clearRect(0, 0, w, h);
  if (bg){ x.fillStyle = bg; x.fillRect(0, 0, w, h); }
  drawElements(x, els, k); return c;
}

/* ===================== Мокап склянки (2D, процедурний) =====================
   Склянка малюється з CONFIG.vessel, тому форма однакова на всіх зображеннях.
   Щоб замінити фотографією: підставте фото склянки як фон і залиште warp-друк. */
function candleGeom(W, H, o = {}){
  const V = CONFIG.vessel, R = V.diameterMm / 2, Hm = V.heightMm, PA = ZONE();
  const e = o.elev ?? V.ellipseTop ?? 0.17, eb = V.ellipseBottom ?? e, tp = V.taper ?? 1;
  const head = o.headMm ?? 18, fitW = o.fitW ?? 0.78, fitH = o.fitH ?? 0.84;
  const s = Math.min(W * fitW / (2 * R), H * fitH / (Hm + head + R * (e + eb) * 1.4));
  const Rp = R * s, b = Rp * e;
  const total = Hm * s + head * s + Rp * (e + eb) * 1.4;
  const topY = (H - total) / 2 + head * s + b + (o.dy || 0);
  const ztop = Hm - PA.offsetFromBottomMm - PA.heightMm;
  const g = { s, R, Rp, b, Rpb: Rp * tp, bb: Rp * eb, Hm, cx: W / 2 + (o.dx || 0), topY, bottomY: topY + Hm * s, zw: PA.widthMm, zh: PA.heightMm, ztop, wrap: PA.wrap, phi: o.phi || 0 };
  g.Rz = g.Rp + (g.Rpb - g.Rp) * (ztop + PA.heightMm / 2) / Hm;   // радіус на середині зони друку
  return g;
}
const bAt = (g, h) => g.b + (g.bb - g.b) * h / g.Hm;
function wrapAngle(t){ t = (t + Math.PI) % (2 * Math.PI); if (t < 0) t += 2 * Math.PI; return t - Math.PI; }
function uAt(g, t){ let u = (t + g.phi) * g.R + g.zw / 2; if (g.wrap) u = ((u % g.zw) + g.zw) % g.zw; return u; }
function gFwd(g, u, v){ const t = wrapAngle((u - g.zw / 2) / g.R - g.phi), h = g.ztop + v; return [g.cx + g.Rz * Math.sin(t), g.topY + h * g.s + bAt(g, h) * Math.cos(t), Math.cos(t)]; }
function gInv(g, x, y){
  const sn = clamp((x - g.cx) / g.Rz, -0.995, 0.995), t = Math.asin(sn), cs = Math.cos(t);
  const h = (y - g.topY - g.b * cs) / (g.s + (g.bb - g.b) * cs / g.Hm);
  return [uAt(g, t), h - g.ztop];
}
function bodyPath(ctx, g){
  ctx.beginPath(); ctx.moveTo(g.cx - g.Rp, g.topY); ctx.lineTo(g.cx - g.Rpb, g.bottomY);
  ctx.ellipse(g.cx, g.bottomY, g.Rpb, g.bb, 0, Math.PI, 0, true);
  ctx.lineTo(g.cx + g.Rp, g.topY);
  ctx.ellipse(g.cx, g.topY, g.Rp, g.b, 0, 0, Math.PI, false); ctx.closePath();
}
function zonePath(ctx, fwd, zw, zh){
  const N = 28; ctx.beginPath();
  const pts = [];
  for (let i = 0; i <= N; i++) pts.push(fwd(zw * i / N, 0));
  for (let i = 0; i <= 8; i++) pts.push(fwd(zw, zh * i / 8));
  for (let i = N; i >= 0; i--) pts.push(fwd(zw * i / N, zh));
  for (let i = 8; i >= 0; i--) pts.push(fwd(0, zh * i / 8));
  pts.forEach((p, i) => i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]));
  ctx.closePath();
}
const WAX_DEPTH = 4.5, WICK_H = 7, WALL_MM = 3, BASE_MM = 7;
/* Поведінка покриття: vMin — найтемніша частина світлотіні, refl — сила відображення вікна, edge — френелівський край. */
const FINISH = {
  clear:  { vMin: 0.64, refl: 0.50, edge: 0 },
  gloss:  { vMin: 0.40, refl: 0.62, edge: 0.16 },
  satin:  { vMin: 0.80, refl: 0.30, edge: -0.07 },
  custom: { vMin: 0.58, refl: 0.38, edge: 0.06 }
};
let NOISE = null;
function noiseCanvas(){
  if (NOISE) return NOISE;
  const c = document.createElement('canvas'); c.width = c.height = 128; const x = c.getContext('2d');
  const id = x.createImageData(128, 128); let seed = 7;
  for (let i = 0; i < id.data.length; i += 4){ seed = (seed * 16807) % 2147483647; const v = 128 + ((seed / 2147483647) - 0.5) * 120; id.data[i] = id.data[i + 1] = id.data[i + 2] = v; id.data[i + 3] = 255; }
  x.putImageData(id, 0, 0); return (NOISE = c);
}
function setBlur(ctx, r){ if ('filter' in ctx) ctx.filter = r > 0.3 ? `blur(${r}px)` : 'none'; }
function warpPrint(ctx, g, fl, k){
  const s = g.s, h0 = g.ztop, h1 = g.ztop + g.zh, x0 = Math.floor(g.cx - g.Rz), x1 = Math.ceil(g.cx + g.Rz);
  const bt = bAt(g, h0), bb = bAt(g, h1);
  for (let x = x0; x < x1; x++){
    const sn = (x + 0.5 - g.cx) / g.Rz; if (Math.abs(sn) >= 1) continue;
    const t = Math.asin(sn), u = uAt(g, t); if (u < 0 || u > g.zw) continue;
    const cs = Math.cos(t), sw = Math.min(fl.width, Math.max(1, k / (s * cs)));
    const sx = clamp(u * k - sw / 2, 0, fl.width - sw);
    const y0 = g.topY + h0 * s + bt * cs, y1 = g.topY + h1 * s + bb * cs;
    ctx.drawImage(fl, sx, 0, sw, fl.height, x, y0, 1.3, y1 - y0);
  }
}
const imgReady = (im) => !!(im && im.complete && im.naturalWidth);
function photoFor(col){ const ph = (CONFIG.mockup.photos && CONFIG.mockup.photos[col.id]) || CONFIG.mockup.photo; return ph && ph.imgs && imgReady(ph.imgs.base) ? ph : null; }
const PH_LAYER = document.createElement('canvas'), HL_LAYER = document.createElement('canvas');
/* Фотомокап: фото склянки → покриття (для непрозорих кольорів) → друк із тінню з фото → відблиски з фото. */
function drawPhotoCandle(ctx, g, o, ph, fin, hex, px){
  const I = ph.imgs, sc = g.Rp / ph.rimA, clear = fin === 'clear';
  const ix = g.cx - ph.cx * sc, iy = g.topY - ph.rimY * sc, iw = I.base.naturalWidth * sc, ih = I.base.naturalHeight * sc;
  Object.assign(g, { ph, phSc: sc, phX: ix, phY: iy });
  drawGround(ctx, g, clear);
  ctx.drawImage(I.base, ix, iy, iw, ih);
  if (o.wick === 'wood' && imgReady(I.patch)) ctx.drawImage(I.patch, ix + ph.patch.x * sc, iy + ph.patch.y * sc, I.patch.naturalWidth * sc, I.patch.naturalHeight * sc);
  if (!clear){
    // покриття зовнішньої стінки з об’ємом із фото
    ctx.save(); bodyPath(ctx, g); ctx.clip();
    ctx.fillStyle = hex; ctx.fillRect(ix, iy, iw, ih);
    if (imgReady(I.shade)){ ctx.globalCompositeOperation = 'multiply'; ctx.drawImage(I.shade, ix, iy, iw, ih); }
    ctx.restore();
    // вінця
    ctx.save(); ctx.beginPath();
    ctx.ellipse(g.cx, g.topY, ph.lipA * sc, ph.lipB * sc, 0, 0, Math.PI * 2);
    ctx.ellipse(g.cx, g.topY, ph.innerA * sc, ph.innerB * sc, 0, 0, Math.PI * 2, true);
    ctx.fillStyle = mix(hex, '#ffffff', fin === 'gloss' ? 0.12 : 0.04); ctx.fill('evenodd');
    ctx.restore();
    // внутрішня стінка над воском: крізь скло видно покриття
    ctx.save(); ctx.beginPath(); ctx.ellipse(g.cx, g.topY, ph.innerA * sc, ph.innerB * sc, 0, 0, Math.PI * 2); ctx.clip();
    ctx.beginPath(); ctx.rect(ix, iy, iw, ih); ctx.ellipse(g.cx, iy + ph.wax.cy * sc, ph.wax.a * sc, ph.wax.b * sc, 0, 0, Math.PI * 2, true);
    ctx.globalAlpha = 0.82; ctx.fillStyle = mix(hex, '#000000', fin === 'satin' ? 0.12 : 0.3); ctx.fill('evenodd');
    ctx.restore();
  }
  // друк: окремий шар, затінений картою світлотіні з фото
  if (o.flat){
    const Cv = ctx.canvas;
    if (PH_LAYER.width !== Cv.width || PH_LAYER.height !== Cv.height){ PH_LAYER.width = Cv.width; PH_LAYER.height = Cv.height; }
    const lx = PH_LAYER.getContext('2d');
    lx.setTransform(1, 0, 0, 1, 0, 0); lx.globalCompositeOperation = 'source-over'; lx.globalAlpha = 1; lx.clearRect(0, 0, Cv.width, Cv.height);
    lx.setTransform(ctx.getTransform());
    lx.save(); bodyPath(lx, g); lx.clip(); warpPrint(lx, g, o.flat, o.k); lx.restore();
    if (imgReady(I.dark)){ lx.globalCompositeOperation = 'source-atop'; lx.drawImage(I.dark, ix, iy, iw, ih); lx.globalCompositeOperation = 'source-over'; }
    ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.drawImage(PH_LAYER, 0, 0); ctx.restore();
  }
  // відблиски скла поверх покриття й друку
  if (imgReady(I.hl)){
    // відблиски через окремий шар з маскою силуету (інакше «screen» зафарбовує прозорий фон)
    const k = (ph.highlight && ph.highlight[fin]) ?? 0.7, Cv = ctx.canvas;
    if (HL_LAYER.width !== Cv.width || HL_LAYER.height !== Cv.height){ HL_LAYER.width = Cv.width; HL_LAYER.height = Cv.height; }
    const hx = HL_LAYER.getContext('2d');
    hx.setTransform(1, 0, 0, 1, 0, 0); hx.globalCompositeOperation = 'source-over'; hx.clearRect(0, 0, Cv.width, Cv.height);
    hx.setTransform(ctx.getTransform());
    hx.save();
    if (clear && o.flat){ zonePath(hx, (u, v) => gFwd(g, u, v), g.zw, g.zh); hx.clip(); }
    hx.drawImage(I.hl, ix, iy, iw, ih); hx.restore();
    hx.globalCompositeOperation = 'destination-in'; hx.drawImage(I.base, ix, iy, iw, ih); hx.globalCompositeOperation = 'source-over';
    ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalCompositeOperation = 'screen'; for (let a = k; a > 0.01; a -= 1){ ctx.globalAlpha = Math.min(1, a); ctx.drawImage(HL_LAYER, 0, 0); } ctx.restore();
  }
  if (o.wick === 'wood') drawWick(ctx, g, iy + ph.wickBase[1] * sc, 'wood');
  if (o.lit){
    const [bx, by] = [ix + ph.wickBase[0] * sc, iy + ph.wickBase[1] * sc];
    ctx.save(); ctx.beginPath(); ctx.ellipse(g.cx, iy + ph.wax.cy * sc, ph.wax.a * sc, ph.wax.b * sc, 0, 0, Math.PI * 2); ctx.clip();
    const rg = ctx.createRadialGradient(bx, by, 0, bx, by, ph.wax.a * sc * 0.9);
    rg.addColorStop(0, 'rgba(255,190,110,0.45)'); rg.addColorStop(1, 'rgba(255,190,110,0)');
    ctx.fillStyle = rg; ctx.fillRect(ix, iy, iw, ih); ctx.restore();
  }
  drawZone(ctx, g, o, hex, px);
  if (o.lit && !o.noFlame) drawFlame(ctx, g, o.t || 0, o.wick);
}
function drawGround(ctx, g, clear){
  const k = clear ? 0.72 : 1;
  const gb = g.bb || g.b;
  ctx.save(); ctx.translate(g.cx + g.Rp * 0.18, g.bottomY + gb * 0.4); ctx.scale(1, (gb * 1.8) / (g.Rp * 1.6));
  let rg = ctx.createRadialGradient(0, 0, 0, 0, 0, g.Rp * 1.6);
  rg.addColorStop(0, `rgba(70,48,30,${0.26 * k})`); rg.addColorStop(0.5, `rgba(70,48,30,${0.11 * k})`); rg.addColorStop(1, 'rgba(70,48,30,0)');
  ctx.fillStyle = rg; ctx.beginPath(); ctx.arc(0, 0, g.Rp * 1.6, 0, Math.PI * 2); ctx.fill(); ctx.restore();
  ctx.save(); ctx.translate(g.cx, g.bottomY + gb * 0.1); ctx.scale(1, (gb * 1.04) / ((g.Rpb || g.Rp) * 1.03));
  rg = ctx.createRadialGradient(0, 0, g.Rp * 0.75, 0, 0, g.Rp * 1.03);
  rg.addColorStop(0, `rgba(40,26,16,${0.36 * k})`); rg.addColorStop(1, 'rgba(40,26,16,0)');
  ctx.fillStyle = rg; ctx.beginPath(); ctx.arc(0, 0, g.Rp * 1.03, 0, Math.PI * 2); ctx.fill(); ctx.restore();
  if (clear){
    // світло, що пройшло крізь скло й віск, на поверхні
    ctx.save(); ctx.translate(g.cx + g.Rp * 0.55, g.bottomY + gb * 0.9); ctx.scale(1, 0.32);
    rg = ctx.createRadialGradient(0, 0, 0, 0, 0, g.Rp * 0.7);
    rg.addColorStop(0, 'rgba(255,224,170,0.30)'); rg.addColorStop(1, 'rgba(255,224,170,0)');
    ctx.fillStyle = rg; ctx.beginPath(); ctx.arc(0, 0, g.Rp * 0.7, 0, Math.PI * 2); ctx.fill(); ctx.restore();
  }
}
function drawCandle(ctx, g, o){
  const fin = o.clear ? 'clear' : (o.finish || 'custom'), F = FINISH[fin] || FINISH.custom, clear = fin === 'clear';
  const hex = o.hex, s = g.s, px = o.px || 1;
  const ri = 1 - WALL_MM / g.R, Rw = g.Rp * ri, bw = g.b * ri, wy0 = g.topY + WAX_DEPTH * s, iby = g.bottomY - BASE_MM * s;
  const L = g.cx - g.Rp - 2, Wd = g.Rp * 2 + 4, Tp = g.topY - g.b - 2, Hd = g.bottomY - g.topY + g.b * 2 + 4;

  // ---- фотомокап (основний режим)
  const ph = o.photo && o.photo.imgs && imgReady(o.photo.imgs.base) ? o.photo : null;
  if (ph){ drawPhotoCandle(ctx, g, o, ph, fin, hex, px); return; }
  drawGround(ctx, g, clear);

  // ---- корпус
  if (!clear){ bodyPath(ctx, g); ctx.fillStyle = hex; ctx.fill(); }
  else {
    bodyPath(ctx, g); ctx.fillStyle = 'rgba(214,224,219,0.30)'; ctx.fill();
    // віск крізь скло
    ctx.save(); ctx.beginPath(); ctx.moveTo(g.cx - Rw, wy0); ctx.lineTo(g.cx - Rw, iby);
    ctx.ellipse(g.cx, iby, Rw, bw, 0, Math.PI, 0, true); ctx.lineTo(g.cx + Rw, wy0);
    ctx.ellipse(g.cx, wy0, Rw, bw, 0, 0, Math.PI, false); ctx.closePath();
    const wl = ctx.createLinearGradient(g.cx - Rw, 0, g.cx + Rw, 0);
    wl.addColorStop(0, '#D9CBB0'); wl.addColorStop(0.22, '#F1E8D7'); wl.addColorStop(0.55, '#F6EEDF'); wl.addColorStop(0.85, '#E9DDC7'); wl.addColorStop(1, '#CFC0A3');
    ctx.fillStyle = wl; ctx.fill(); ctx.clip();
    ctx.globalCompositeOperation = 'overlay'; ctx.globalAlpha = 0.10; ctx.fillStyle = ctx.createPattern(noiseCanvas(), 'repeat'); ctx.fillRect(L, Tp, Wd, Hd);
    ctx.globalAlpha = 1; ctx.globalCompositeOperation = 'source-over';
    // лінія воску біля верху, видима крізь скло
    ctx.beginPath(); ctx.ellipse(g.cx, wy0, Rw, bw, 0, 0.04 * Math.PI, 0.96 * Math.PI);
    ctx.strokeStyle = 'rgba(255,252,244,0.85)'; ctx.lineWidth = Math.max(1, s * 0.7); ctx.stroke();
    ctx.restore();
    // товсте дно
    ctx.save(); bodyPath(ctx, g); ctx.clip();
    const gb = ctx.createLinearGradient(0, iby, 0, g.bottomY + g.b);
    gb.addColorStop(0, 'rgba(255,255,255,0.45)'); gb.addColorStop(0.6, 'rgba(196,210,203,0.40)'); gb.addColorStop(1, 'rgba(120,140,132,0.42)');
    ctx.fillStyle = gb; ctx.fillRect(L, iby + bw * 0.3, Wd, g.bottomY - iby + g.b);
    ctx.beginPath(); ctx.ellipse(g.cx, iby, Rw, bw, 0, 0.04 * Math.PI, 0.96 * Math.PI);
    ctx.strokeStyle = 'rgba(95,82,62,0.30)'; ctx.lineWidth = Math.max(1, s * 0.6); ctx.stroke();
    ctx.beginPath(); ctx.ellipse(g.cx, g.bottomY - s * 1.2, g.Rp * 0.97, g.b * 0.97, 0, 0.08 * Math.PI, 0.92 * Math.PI);
    ctx.strokeStyle = 'rgba(255,255,255,0.55)'; ctx.lineWidth = Math.max(1, s * 0.5); ctx.stroke();
    ctx.restore();
  }

  // ---- друк на поверхні скла
  if (o.flat){ ctx.save(); bodyPath(ctx, g); ctx.clip(); warpPrint(ctx, g, o.flat, o.k); ctx.restore(); }

  // ---- об’єм, фактура, відблиски
  ctx.save(); bodyPath(ctx, g); ctx.clip();
  ctx.globalCompositeOperation = 'multiply';
  let lg = ctx.createLinearGradient(g.cx - g.Rp, 0, g.cx + g.Rp, 0);
  for (let i = 0; i <= 24; i++){
    const sn = -1 + i / 12, t = Math.asin(clamp(sn, -1, 1));
    const d = Math.max(0, Math.sin(t) * -0.45 + Math.cos(t) * 0.89);
    const v = F.vMin + (1 - F.vMin) * Math.pow(d, 0.8), c = Math.round(255 * v);
    lg.addColorStop(i / 24, `rgb(${c},${Math.round(c * 0.99)},${Math.round(c * 0.975)})`);
  }
  ctx.fillStyle = lg; ctx.fillRect(L, Tp, Wd, Hd);
  lg = ctx.createLinearGradient(0, g.bottomY - s * 18, 0, g.bottomY + g.b);
  lg.addColorStop(0, 'rgb(255,255,255)'); lg.addColorStop(1, fin === 'satin' ? 'rgb(226,220,212)' : 'rgb(196,189,182)');
  ctx.fillStyle = lg; ctx.fillRect(L, Tp, Wd, Hd);
  lg = ctx.createLinearGradient(0, g.topY, 0, g.topY + g.b + s * 7);
  lg.addColorStop(0, 'rgb(222,217,210)'); lg.addColorStop(1, 'rgb(255,255,255)');
  ctx.fillStyle = lg; ctx.fillRect(L, Tp, Wd, Hd);
  // фактура покриття
  ctx.globalCompositeOperation = 'overlay'; ctx.globalAlpha = clear ? 0.035 : fin === 'gloss' ? 0.05 : 0.07;
  ctx.fillStyle = ctx.createPattern(noiseCanvas(), 'repeat'); ctx.fillRect(L, Tp, Wd, Hd);
  ctx.globalAlpha = 1; ctx.globalCompositeOperation = 'source-over';
  // френелівський край
  if (F.edge){
    lg = ctx.createLinearGradient(g.cx - g.Rp, 0, g.cx + g.Rp, 0);
    const col = F.edge > 0 ? '255,255,255' : '60,45,35', a = Math.abs(F.edge);
    [[0, a], [0.06, a * 0.25], [0.12, 0], [0.88, 0], [0.94, a * 0.25], [1, a]].forEach(([p, al]) => lg.addColorStop(p, `rgba(${col},${al})`));
    ctx.fillStyle = lg; ctx.fillRect(L, Tp, Wd, Hd);
  }
  if (clear){
    // заломлення в товщі стінок
    lg = ctx.createLinearGradient(g.cx - g.Rp, 0, g.cx + g.Rp, 0);
    [[0, 0.34], [0.03, 0.10], [0.065, 0], [0.935, 0], [0.97, 0.10], [1, 0.34]].forEach(([p, a]) => lg.addColorStop(p, `rgba(52,68,62,${a})`));
    ctx.fillStyle = lg; ctx.fillRect(L, Tp, Wd, Hd);
    ctx.strokeStyle = 'rgba(255,255,255,0.45)'; ctx.lineWidth = Math.max(1, s * 0.35);
    for (const sx of [-1, 1]){ ctx.beginPath(); ctx.moveTo(g.cx + sx * Rw, g.topY + g.b * 0.4); ctx.lineTo(g.cx + sx * Rw, g.bottomY - s * 3); ctx.stroke(); }
  }
  // відображення вікна: широка м’яка смуга, вузьке ядро, слабке відображення праворуч
  const band = (x0, x1, aTop, aBot, blurR) => {
    setBlur(ctx, blurR);
    const y0 = g.topY + g.b + s * 5, y1 = g.bottomY - s * 4;
    const vg = ctx.createLinearGradient(0, y0, 0, y1);
    vg.addColorStop(0, `rgba(255,255,255,${aTop})`); vg.addColorStop(0.55, `rgba(255,255,255,${(aTop + aBot) / 2})`); vg.addColorStop(1, `rgba(255,255,255,${aBot})`);
    ctx.fillStyle = vg; ctx.beginPath();
    const xa = g.cx + g.Rp * x0, xb = g.cx + g.Rp * x1, r = Math.min((xb - xa) / 2, s * 3);
    if (ctx.roundRect) ctx.roundRect(xa, y0, xb - xa, y1 - y0, r); else ctx.rect(xa, y0, xb - xa, y1 - y0);
    ctx.fill();
  };
  band(-0.70, -0.36, F.refl * 0.55, F.refl * 0.18, s * 2.2);
  band(-0.585, -0.515, F.refl * 0.95, F.refl * 0.45, s * 0.5);
  band(0.72, 0.84, F.refl * 0.30, F.refl * 0.10, s * 1.6);
  setBlur(ctx, 0);
  if (fin === 'gloss'){
    lg = ctx.createLinearGradient(0, g.bottomY - s * 14, 0, g.bottomY + g.b);
    lg.addColorStop(0, 'rgba(255,255,255,0)'); lg.addColorStop(1, 'rgba(255,240,225,0.10)');
    ctx.fillStyle = lg; ctx.fillRect(L, Tp, Wd, Hd);
  }
  ctx.restore();
  // заокруглений край дна
  ctx.save(); ctx.beginPath(); ctx.ellipse(g.cx, g.bottomY - s * 2.4, g.Rp * 0.985, g.b * 0.98, 0, 0.12 * Math.PI, 0.88 * Math.PI);
  ctx.strokeStyle = `rgba(255,255,255,${fin === 'satin' ? 0.35 : 0.22})`; ctx.lineWidth = Math.max(1, s * 0.55); ctx.stroke(); ctx.restore();

  // ---- вінця з товщиною стінки
  ctx.save();
  ctx.beginPath(); ctx.ellipse(g.cx, g.topY, g.Rp, g.b, 0, 0, Math.PI * 2); ctx.ellipse(g.cx, g.topY, Rw, bw, 0, 0, Math.PI * 2, true);
  lg = ctx.createLinearGradient(g.cx - g.Rp, 0, g.cx + g.Rp, 0);
  if (clear){ lg.addColorStop(0, 'rgba(220,232,227,0.95)'); lg.addColorStop(0.3, 'rgba(255,255,255,0.98)'); lg.addColorStop(1, 'rgba(196,210,204,0.95)'); }
  else { const top = mix(hex, '#ffffff', fin === 'gloss' ? 0.28 : 0.12); lg.addColorStop(0, mix(top, '#000000', 0.12)); lg.addColorStop(0.3, mix(top, '#ffffff', 0.25)); lg.addColorStop(1, mix(top, '#000000', 0.18)); }
  ctx.fillStyle = lg; ctx.fill('evenodd');
  ctx.restore();
  // внутрішня порожнина над воском
  ctx.save(); ctx.beginPath(); ctx.ellipse(g.cx, g.topY, Rw, bw, 0, 0, Math.PI * 2); ctx.clip();
  const inner = clear ? '#D3DCD7' : mix(hex, '#000000', fin === 'satin' ? 0.16 : 0.38);
  lg = ctx.createLinearGradient(0, g.topY - g.b, 0, g.topY + g.b);
  lg.addColorStop(0, mix(inner, '#ffffff', 0.12)); lg.addColorStop(1, mix(inner, '#000000', clear ? 0.14 : 0.30));
  ctx.fillStyle = lg; ctx.fillRect(g.cx - g.Rp, g.topY - g.b, g.Rp * 2, g.b * 2);
  // поверхня воску
  const wy = wy0, wrx = Rw, wry = bw;
  let rg = ctx.createRadialGradient(g.cx - wrx * 0.12, wy - wry * 0.2, wrx * 0.05, g.cx, wy, wrx);
  rg.addColorStop(0, '#FAF4E9'); rg.addColorStop(0.55, '#F0E7D6'); rg.addColorStop(0.9, '#E4D7C0'); rg.addColorStop(1, '#D7C8AD');
  ctx.beginPath(); ctx.ellipse(g.cx, wy, wrx, wry, 0, 0, Math.PI * 2); ctx.fillStyle = rg; ctx.fill();
  ctx.save(); ctx.clip();
  ctx.globalCompositeOperation = 'overlay'; ctx.globalAlpha = 0.12; ctx.fillStyle = ctx.createPattern(noiseCanvas(), 'repeat'); ctx.fillRect(g.cx - wrx, wy - wry, wrx * 2, wry * 2);
  ctx.globalAlpha = 1; ctx.globalCompositeOperation = 'source-over';
  // тінь від стінки на віск і м’який блиск
  lg = ctx.createLinearGradient(0, wy - wry, 0, wy - wry * 0.2);
  lg.addColorStop(0, 'rgba(90,66,40,0.26)'); lg.addColorStop(1, 'rgba(90,66,40,0)');
  ctx.fillStyle = lg; ctx.fillRect(g.cx - wrx, wy - wry, wrx * 2, wry * 2);
  setBlur(ctx, s * 1.4);
  ctx.beginPath(); ctx.ellipse(g.cx - wrx * 0.35, wy - wry * 0.1, wrx * 0.28, wry * 0.32, -0.15, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(255,255,255,0.35)'; ctx.fill();
  setBlur(ctx, 0);
  if (o.lit){
    rg = ctx.createRadialGradient(g.cx, wy, 0, g.cx, wy, wrx * 0.9);
    rg.addColorStop(0, 'rgba(255,190,110,0.5)'); rg.addColorStop(1, 'rgba(255,190,110,0)');
    ctx.fillStyle = rg; ctx.fillRect(g.cx - wrx, wy - wry, wrx * 2, wry * 2);
    // невелика калюжка розплавленого воску
    ctx.beginPath(); ctx.ellipse(g.cx, wy, wrx * 0.36, wry * 0.36, 0, 0, Math.PI * 2); ctx.fillStyle = 'rgba(232,206,160,0.35)'; ctx.fill();
  }
  ctx.restore();
  // меніск біля скла
  ctx.beginPath(); ctx.ellipse(g.cx, wy, wrx * 0.995, wry * 0.995, 0, Math.PI, Math.PI * 2);
  ctx.strokeStyle = 'rgba(255,250,240,0.7)'; ctx.lineWidth = Math.max(1, s * 0.5); ctx.stroke();
  ctx.restore();
  // кромки вінець
  ctx.beginPath(); ctx.ellipse(g.cx, g.topY, g.Rp, g.b, 0, 0, Math.PI * 2);
  ctx.strokeStyle = clear ? 'rgba(150,170,162,0.55)' : mix(hex, fin === 'gloss' ? '#ffffff' : '#000000', 0.25); ctx.lineWidth = Math.max(1, s * 0.35); ctx.stroke();
  ctx.beginPath(); ctx.ellipse(g.cx, g.topY, Rw, bw, 0, 0, Math.PI * 2);
  ctx.strokeStyle = clear ? 'rgba(120,140,132,0.45)' : mix(hex, '#000000', 0.32); ctx.lineWidth = Math.max(1, s * 0.3); ctx.stroke();
  ctx.beginPath(); ctx.ellipse(g.cx, g.topY, g.Rp * 0.985, g.b * 0.985, 0, 1.06 * Math.PI, 1.44 * Math.PI);
  ctx.strokeStyle = 'rgba(255,255,255,0.8)'; ctx.lineWidth = Math.max(1, s * 0.55); ctx.stroke();
  ctx.beginPath(); ctx.ellipse(g.cx, g.topY + s * 0.9, g.Rp * 0.995, g.b, 0, 0.12 * Math.PI, 0.42 * Math.PI);
  ctx.strokeStyle = `rgba(255,255,255,${clear ? 0.5 : 0.28})`; ctx.lineWidth = Math.max(1, s * 0.7); ctx.stroke();

  // ---- ґніт
  drawWick(ctx, g, wy0, o.wick);
  drawZone(ctx, g, o, hex, px);
  if (o.lit && !o.noFlame) drawFlame(ctx, g, o.t || 0, o.wick);
}
const WOOD_W = 7, WOOD_H = 5.5;
function wickTip(g, wick){
  const s = g.s;
  if (g.ph){ const sc = g.phSc, bx = g.phX + g.ph.wickBase[0] * sc, by = g.phY + g.ph.wickBase[1] * sc;
    return wick === 'wood' ? [bx, by - WOOD_H * s] : [g.phX + g.ph.wickTip[0] * sc, g.phY + g.ph.wickTip[1] * sc]; }
  const wy = g.topY + WAX_DEPTH * s; return wick === 'wood' ? [g.cx, wy - WOOD_H * s] : [g.cx + s * 0.7, wy - WICK_H * s];
}
function drawWick(ctx, g, wy0, wick){
  const s = g.s;
  ctx.save();
  if (wick === 'wood'){
    // дерев’яний ґніт: тонка пластина, повернута до глядача, з волокнами й обвугленим краєм
    const w = WOOD_W * s, h = WOOD_H * s, x0 = g.cx - w / 2, y0 = wy0 - h, th = Math.max(1, s * 0.6);
    setBlur(ctx, s * 0.7);
    ctx.beginPath(); ctx.ellipse(g.cx + s * 2.6, wy0 + s * 0.45, w * 0.62, s * 0.7, 0.06, 0, Math.PI * 2); ctx.fillStyle = 'rgba(70,50,30,0.24)'; ctx.fill();
    setBlur(ctx, 0);
    ctx.beginPath(); ctx.moveTo(x0 + w, y0 + s * 0.15); ctx.lineTo(x0 + w + th, y0 + s * 0.45); ctx.lineTo(x0 + w + th, wy0 + s * 0.2); ctx.lineTo(x0 + w, wy0); ctx.closePath();
    ctx.fillStyle = '#7A5230'; ctx.fill();
    const wg = ctx.createLinearGradient(x0, 0, x0 + w, 0);
    wg.addColorStop(0, '#9C6E43'); wg.addColorStop(0.35, '#C4925F'); wg.addColorStop(0.7, '#B48352'); wg.addColorStop(1, '#8E6139');
    ctx.beginPath(); ctx.moveTo(x0, y0 + s * 0.25); ctx.quadraticCurveTo(g.cx, y0 - s * 0.15, x0 + w, y0 + s * 0.15); ctx.lineTo(x0 + w, wy0); ctx.lineTo(x0, wy0 + s * 0.05); ctx.closePath();
    ctx.fillStyle = wg; ctx.fill();
    ctx.save(); ctx.clip();
    ctx.strokeStyle = 'rgba(95,62,32,0.35)'; ctx.lineWidth = Math.max(0.6, s * 0.16);
    for (let i = 1; i < 8; i++){ const x = x0 + w * i / 8 + Math.sin(i * 2.3) * s * 0.2; ctx.beginPath(); ctx.moveTo(x, y0); ctx.bezierCurveTo(x + s * 0.3, y0 + h * 0.35, x - s * 0.3, y0 + h * 0.7, x + s * 0.1, wy0); ctx.stroke(); }
    const cg = ctx.createLinearGradient(0, y0 - s * 0.2, 0, y0 + s * 1.3);
    cg.addColorStop(0, 'rgba(25,18,14,0.95)'); cg.addColorStop(1, 'rgba(25,18,14,0)');
    ctx.fillStyle = cg; ctx.fillRect(x0 - 2, y0 - s, w + 4, s * 2.3);
    ctx.restore();
  } else {
    // бавовняний ґніт: плетіння з обпаленим кінчиком
    const [tipX, tipY] = wickTip(g, 'cotton');
    setBlur(ctx, s * 0.6);
    ctx.beginPath(); ctx.ellipse(g.cx + s * 2.2, wy0 + s * 0.3, s * 2.6, s * 0.55, 0.1, 0, Math.PI * 2); ctx.fillStyle = 'rgba(70,50,30,0.22)'; ctx.fill();
    setBlur(ctx, 0);
    ctx.lineCap = 'round';
    const path = () => { ctx.beginPath(); ctx.moveTo(g.cx, wy0); ctx.quadraticCurveTo(g.cx - s * 0.35, wy0 - WICK_H * s * 0.55, tipX, tipY); };
    path(); ctx.strokeStyle = '#A99C86'; ctx.lineWidth = Math.max(1.6, s * 1.25); ctx.stroke();
    path(); ctx.strokeStyle = '#E9E1D1'; ctx.lineWidth = Math.max(1, s * 0.85); ctx.stroke();
    ctx.strokeStyle = 'rgba(120,104,82,0.55)'; ctx.lineWidth = Math.max(0.6, s * 0.18);
    for (let i = 1; i < 9; i++){
      const t = i / 10, x = (1 - t) * (1 - t) * g.cx + 2 * (1 - t) * t * (g.cx - s * 0.35) + t * t * tipX;
      const y = (1 - t) * (1 - t) * wy0 + 2 * (1 - t) * t * (wy0 - WICK_H * s * 0.55) + t * t * tipY;
      ctx.beginPath(); ctx.moveTo(x - s * 0.4, y + s * 0.15); ctx.lineTo(x + s * 0.4, y - s * 0.25); ctx.stroke();
    }
    ctx.beginPath(); ctx.moveTo(tipX - s * 0.2, tipY + s * 1.8); ctx.lineTo(tipX, tipY);
    ctx.strokeStyle = '#231B17'; ctx.lineWidth = Math.max(1.4, s * 1.1); ctx.stroke();
    ctx.beginPath(); ctx.arc(tipX + s * 0.05, tipY - s * 0.05, Math.max(0.8, s * 0.55), 0, Math.PI * 2); ctx.fillStyle = '#1A1411'; ctx.fill();
  }
  ctx.restore();
}
function drawZone(ctx, g, o, hex, px){
  if (!o.showZone) return;
  const s = g.s;
  ctx.save();
  const col = lum(hex) > 0.3 ? 'rgba(25,22,20,0.55)' : 'rgba(255,255,255,0.8)';
  ctx.setLineDash([5 * px, 4 * px]); ctx.lineWidth = 1.4 * px; ctx.strokeStyle = col; ctx.fillStyle = col;
  if (g.wrap){
    for (const v of [0, g.zh]){
      ctx.beginPath();
      for (let i = 0; i <= 48; i++){ const t = -Math.PI / 2 + Math.PI * i / 48, h = g.ztop + v; const x = g.cx + g.Rz * Math.sin(t), y = g.topY + h * s + bAt(g, h) * Math.cos(t); i ? ctx.lineTo(x, y) : ctx.moveTo(x, y); }
      ctx.stroke();
    }
    const a = gFwd(g, 0, 0), b2 = gFwd(g, 0, g.zh);
    if (a[2] > 0.08){
      ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(b2[0], b2[1]); ctx.stroke();
      if (a[2] > 0.35){ ctx.font = `700 ${11 * px}px "Manrope", sans-serif`; ctx.textAlign = 'center'; ctx.textBaseline = 'bottom'; ctx.fillText('шов', a[0], a[1] - 4 * px); }
    }
  } else { zonePath(ctx, (u, v) => gFwd(g, u, v), g.zw, g.zh); ctx.stroke(); }
  ctx.restore();
}
function drawFlame(ctx, g, t, wick){
  const s = g.s, [tipX, tipY] = wickTip(g, wick), wood = wick === 'wood';
  const fl = 1 + 0.045 * Math.sin(t * 7.3) + 0.03 * Math.sin(t * 12.7 + 1);
  const sway = s * (wood ? 0.35 : 0.6) * Math.sin(t * 2.7) + s * 0.25 * Math.sin(t * 6.1);
  const h = (wood ? 10 : 13) * s * fl, w = (wood ? 8.5 : 4.3) * s, by = tipY + s * (wood ? 0.6 : 1.6), cy = by - h * 0.45;
  ctx.save(); ctx.globalCompositeOperation = 'lighter';
  let rg = ctx.createRadialGradient(tipX, cy, 0, tipX, cy, 34 * s);
  rg.addColorStop(0, 'rgba(255,165,60,0.26)'); rg.addColorStop(0.35, 'rgba(255,140,40,0.09)'); rg.addColorStop(1, 'rgba(255,140,40,0)');
  ctx.fillStyle = rg; ctx.fillRect(tipX - 34 * s, cy - 34 * s, 68 * s, 68 * s); ctx.restore();
  ctx.save();
  const tx = tipX + sway, ty = by - h;
  ctx.beginPath(); ctx.moveTo(tx, ty);
  ctx.bezierCurveTo(tipX + w * 0.95, by - h * 0.42, tipX + w * 0.75, by, tipX, by);
  ctx.bezierCurveTo(tipX - w * 0.75, by, tipX - w * 0.95, by - h * 0.42, tx, ty);
  const fg = ctx.createLinearGradient(0, by, 0, ty);
  fg.addColorStop(0, 'rgba(70,110,255,0.75)'); fg.addColorStop(0.13, 'rgba(255,244,214,0.98)');
  fg.addColorStop(0.5, 'rgba(255,198,92,0.95)'); fg.addColorStop(0.85, 'rgba(255,135,35,0.55)'); fg.addColorStop(1, 'rgba(255,120,30,0)');
  ctx.fillStyle = fg; ctx.fill();
  ctx.beginPath(); ctx.ellipse(tipX + sway * 0.3, by - h * 0.28, w * 0.32, h * 0.2, 0, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(255,255,245,0.85)'; ctx.fill();
  ctx.restore();
}
function sizeCanvas(c){
  const dpr = Math.min(window.devicePixelRatio || 1, 2.5);
  const w = Math.max(1, Math.round(c.clientWidth * dpr)), h = Math.max(1, Math.round(c.clientHeight * dpr));
  if (c.width !== w || c.height !== h){ c.width = w; c.height = h; }
  return { W: w, H: h, dpr };
}
/* Малює свічку з дизайном у будь-який canvas (герой, приклади, мініатюри, прев’ю для заявки). */
function paintCandle(ctx, W, H, col, els, o = {}){
  const g = candleGeom(W, H, o.geom || {});
  const k = Math.min(18, g.s * 1.3);
  /* o.flatCache — кеш розгортки дизайну для повторних рендерів (картки товарів, обертання) */
  const fc = o.flatCache, fl = fc && fc.k === k && fc.c ? fc.c : (els && els.length) || o.bg ? flatCanvas(els || [], k, null, o.bg) : null;
  if (fc && fc.k !== k){ fc.k = k; fc.c = fl; }
  drawCandle(ctx, g, { hex: col.hex, clear: col.clear, finish: col.finish, photo: photoFor(col), flat: fl, k, lit: o.lit, noFlame: o.noFlame, t: o.t, showZone: o.showZone, px: o.px, wick: o.wick });
  return g;
}

/* ===================== Стан, історія, чернетка ===================== */
const assets = {};       // id -> {id, name, mime, blob, img, w, h, url}
const state = { colorId: CONFIG.defaultColorId, els: [], bg: null, sel: null, view: 'mock', zone: true, lit: false, step: 'color', spin: 0,
  scentMode: 'none', scentId: null, scentOther: '', scentGroup: CONFIG.scents.groups[0].id, qty: 1, wick: CONFIG.defaultWickId,
  custom: { desc: '', code: '', hex: CONFIG.customColor.defaultPreviewHex } };
let colorRef = null;   // приклад індивідуального кольору: {name, mime, blob}
let history = [];
const snap = () => JSON.stringify({ colorId: state.colorId, bg: state.bg, els: state.els });
function commit(){
  const s = snap();
  if (s !== history[history.length - 1]){ history.push(s); if (history.length > 80) history.shift(); scheduleSave(); }
  updateUndo(); renderReview();
}
function undo(){
  if (history.length < 2) return;
  history.pop(); restoreSnap(history[history.length - 1]); scheduleSave();
  toast('Останню дію скасовано');
}
function restoreSnap(s){
  const d = JSON.parse(s); state.colorId = d.colorId; state.bg = d.bg || null; state.els = d.els;
  if (!state.els.some((e) => e.id === state.sel)) state.sel = null;
  refreshAll();
}
function updateUndo(){ $('#btnUndo').disabled = history.length < 2; }

const IDB = {
  db: null,
  open(){ if (this.db) return Promise.resolve(this.db); return new Promise((res, rej) => { try { const r = indexedDB.open('rdk-candle', 1); r.onupgradeneeded = () => r.result.createObjectStore('kv'); r.onsuccess = () => { this.db = r.result; res(this.db); }; r.onerror = () => rej(r.error); } catch (e){ rej(e); } }); },
  async tx(mode, fn){ const db = await this.open(); return new Promise((res, rej) => { const t = db.transaction('kv', mode); const st = t.objectStore('kv'); const rq = fn(st); t.oncomplete = () => res(rq && rq.result); t.onerror = () => rej(t.error); t.onabort = () => rej(t.error); }); },
  get(k){ return this.tx('readonly', (s) => s.get(k)); },
  set(k, v){ return this.tx('readwrite', (s) => s.put(v, k)); }
};
let saveTimer = null, lastAssetSig = null, colorRefDirty = false;
function scheduleSave(){ clearTimeout(saveTimer); setSaveState('Зберігаємо чернетку…'); saveTimer = setTimeout(saveDraft, 500); }
async function saveDraft(){
  const draft = { v: 2, colorId: state.colorId, bg: state.bg, els: state.els, scentMode: state.scentMode, scentId: state.scentId, scentOther: state.scentOther, wick: state.wick, qty: state.qty, custom: state.custom, colorRefName: colorRef ? colorRef.name : null, savedAt: Date.now() };
  const used = [...new Set(state.els.filter((e) => e.type === 'image').map((e) => e.assetId))];
  const sig = used.sort().join(',');
  try {
    await IDB.set('draft', draft);
    if (colorRefDirty){ await IDB.set('colorRef', colorRef); colorRefDirty = false; }
    if (sig !== lastAssetSig){
      const out = {}; for (const id of used){ const a = assets[id]; if (a) out[id] = { name: a.name, mime: a.mime, w: a.w, h: a.h, blob: a.blob }; }
      await IDB.set('assets', out); lastAssetSig = sig;
    }
    setSaveState('Чернетку збережено на цьому пристрої · ' + new Date().toLocaleTimeString('uk-UA', { hour: '2-digit', minute: '2-digit' }));
  } catch (e){
    try { localStorage.setItem('rdk-candle-draft', JSON.stringify(draft)); setSaveState(used.length ? 'Чернетку збережено без зображень: браузер обмежує сховище' : 'Чернетку збережено на цьому пристрої', !!used.length); }
    catch (e2){ setSaveState('Не вдалося зберегти чернетку в браузері. Збережіть проєкт у файл.', true); }
  }
}
function setSaveState(t, bad){ const el = $('#saveState'); el.textContent = t; el.classList.toggle('bad', !!bad); }
async function loadDraft(){
  try {
    const d = await IDB.get('draft');
    if (d && Array.isArray(d.els)){
      const as = (await IDB.get('assets')) || {};
      for (const [id, a] of Object.entries(as)){ try { await registerAsset(id, a.blob, a.name, a.mime); } catch (e){ /* пошкоджений файл пропускаємо */ } }
      lastAssetSig = Object.keys(as).sort().join(',');
      try { const cr = await IDB.get('colorRef'); if (cr && cr.blob) colorRef = cr; } catch (e){}
      return d;
    }
  } catch (e){ /* IndexedDB недоступна */ }
  try { const s = localStorage.getItem('rdk-candle-draft'); if (s) return JSON.parse(s); } catch (e){}
  return null;
}
function applyDesign(d){
  if (d.custom) state.custom = Object.assign({ desc: '', code: '', hex: CONFIG.customColor.defaultPreviewHex }, d.custom);
  state.colorId = colorById(d.colorId).id; state.bg = d.bg || null;
  state.scentMode = d.scentMode === 'scent' ? 'scent' : 'none';
  state.scentOther = typeof d.scentOther === 'string' ? d.scentOther : '';
  state.wick = CONFIG.wicks.some((w) => w.id === d.wick) ? d.wick : CONFIG.defaultWickId;
  state.scentId = scentById(d.scentId) ? d.scentId : null;
  if (state.scentId) state.scentGroup = scentById(state.scentId).group;
  state.qty = Number.isInteger(d.qty) && d.qty > 0 ? d.qty : state.qty;
  const before = (d.els || []).length;
  state.els = (d.els || []).filter((e) => e.type !== 'image' || assets[e.assetId]).filter((e) => e.type !== 'graphic' || GRAPHICS[e.graphicId]);
  state.sel = null;
  return before - state.els.length;
}

/* ===================== Зображення ===================== */
/* Декодування без blob:-адрес: на захищених хостингах (CSP) img-src може не дозволяти blob:,
   тому спершу createImageBitmap, далі data:-URL через FileReader. */
const blobToDataUrl = (blob) => new Promise((res, rej) => { const r = new FileReader(); r.onload = () => res(r.result); r.onerror = () => rej(r.error || new Error('read')); r.readAsDataURL(blob); });
function loadImg(src){ return new Promise((res, rej) => { const i = new Image(); i.onload = () => res(i); i.onerror = () => rej(new Error('decode')); i.src = src; }); }
async function decodeBlob(blob){
  if (window.createImageBitmap){
    try { const bmp = await createImageBitmap(blob, { imageOrientation: 'from-image', premultiplyAlpha: 'none' }); return { img: bmp, w: bmp.width, h: bmp.height }; }
    catch (e){ try { const bmp = await createImageBitmap(blob); return { img: bmp, w: bmp.width, h: bmp.height }; } catch (e2){} }
  }
  const img = await loadImg(await blobToDataUrl(blob));
  return { img, w: img.naturalWidth, h: img.naturalHeight };
}
function thumbUrl(img, w, h){
  const k = Math.min(1, 160 / Math.max(w, h)), c = document.createElement('canvas');
  c.width = Math.max(1, Math.round(w * k)); c.height = Math.max(1, Math.round(h * k));
  c.getContext('2d').drawImage(img, 0, 0, c.width, c.height); return c.toDataURL('image/png');
}
async function registerAsset(id, blob, name, mime){
  const { img, w, h } = await decodeBlob(blob);
  assets[id] = { id, name: name || 'image', mime: mime || blob.type, blob, img, w, h, url: thumbUrl(img, w, h) };
  return assets[id];
}
async function validateFile(file){
  const P = CONFIG.print;
  const extOk = /\.(png|jpe?g)$/i.test(file.name || '');
  if (!['image/png', 'image/jpeg'].includes(file.type) && !extOk) return 'Цей формат не підтримується. Завантажте PNG або JPEG.';
  if (file.size > P.maxFileMb * 1024 * 1024) return `Файл завеликий (${fmt(file.size / 1048576)} МБ). Максимум — ${P.maxFileMb} МБ.`;
  if (file.size < 100) return 'Файл порожній або пошкоджений.';
  const b = new Uint8Array(await file.slice(0, 8).arrayBuffer());
  const isPng = b[0] === 0x89 && b[1] === 0x50 && b[2] === 0x4E && b[3] === 0x47;
  const isJpg = b[0] === 0xFF && b[1] === 0xD8 && b[2] === 0xFF;
  if (!isPng && !isJpg) return 'Вміст файлу не схожий на PNG чи JPEG. Збережіть зображення у PNG або JPEG ще раз.';
  return null;
}
function uploadStatus(text, level){ const el = $('#uploadStatus'); if (!text){ el.hidden = true; return; } el.hidden = false; el.className = 'upload-status ' + level; el.textContent = text; }
function setBusy(on){ $('#stageBusy').hidden = !on; }
async function handleFiles(files, replaceId){
  const file = files && files[0]; if (!file) return;
  const err = await validateFile(file);
  if (err){ uploadStatus(err, 'bad'); goStep('design'); return; }
  setBusy(true); uploadStatus('Обробляємо зображення…', 'ok');
  try {
    const id = 'a' + uid();
    const a = await registerAsset(id, file, file.name, file.type);
    const P = CONFIG.print;
    if (a.w < P.minImagePx || a.h < P.minImagePx){ uploadStatus(`Зображення замале (${a.w}×${a.h} px). Потрібно щонайменше ${P.minImagePx} px по меншій стороні.`, 'bad'); return; }
    if (a.w > P.maxImagePx || a.h > P.maxImagePx){ uploadStatus(`Зображення завелике (${a.w}×${a.h} px). Максимум — ${P.maxImagePx} px по більшій стороні.`, 'bad'); return; }
    const Z = ZONE(), ar = a.h / a.w;
    let el;
    const target = replaceId && state.els.find((e) => e.id === replaceId);
    if (target){
      el = target; const keepW = el.type === 'text' ? 30 : el.w;
      Object.assign(el, { type: 'image', assetId: id, w: keepW }); delete el.graphicId; delete el.tint;
      delete el.text; delete el.font; delete el.size; delete el.color; delete el.align;
    } else {
      let w = Math.min(Math.min(Z.widthMm, 140) * 0.55, (Z.heightMm * 0.7) / ar);
      el = { id: uid(), type: 'image', assetId: id, x: frontU(), y: Z.heightMm / 2, w, rot: 0 };
      state.els.push(el);
    }
    // стартовий розмір не більший, ніж дозволяє якість
    const maxW = (a.w / P.goodDpi) * 25.4; if (!target && el.w > maxW) el.w = Math.max(MIN_IMG, maxW);
    clampEl(el); state.sel = el.id;
    const q = qualityOf(el);
    const alpha = a.mime === 'image/png' ? ' Прозорі ділянки PNG залишаться прозорими.' : '';
    uploadStatus(`Додано «${a.name}» (${a.w}×${a.h} px). ${q.text}${alpha}`, q.level);
    refreshAll(); commit(); goStep('design');
  } catch (e){
    uploadStatus('Не вдалося прочитати файл. Можливо, він пошкоджений — спробуйте інший PNG або JPEG.', 'bad');
  } finally { setBusy(false); }
}

/* ===================== Прев’ю-сцена ===================== */
const stageCanvas = $('#stageCanvas');
let view = null, handles = null, renderQueued = false, stageFlat = document.createElement('canvas');
function requestRender(){ if (renderQueued) return; renderQueued = true; requestAnimationFrame(() => { renderQueued = false; renderStage(); }); }
function makeView(W, H){
  if (state.view === 'mock'){
    const g = candleGeom(W, H, { fitW: 0.74, fitH: 0.86, headMm: state.lit ? 20 : 12, phi: state.spin * DEG });
    return { kind: 'mock', g, fwd: (u, v) => gFwd(g, u, v), inv: (x, y) => gInv(g, x, y), k: Math.min(18, g.s * 1.3) };
  }
  const Z = ZONE(), sf = Math.min((W * 0.9) / Z.widthMm, (H * 0.62) / Z.heightMm);
  const ox = (W - Z.widthMm * sf) / 2, oy = (H - Z.heightMm * sf) / 2 - H * 0.03;
  return { kind: 'flat', sf, ox, oy, fwd: (u, v) => [ox + u * sf, oy + v * sf], inv: (x, y) => [(x - ox) / sf, (y - oy) / sf], k: sf };
}
function renderStage(){
  const { W, H, dpr } = sizeCanvas(stageCanvas);
  const ctx = stageCanvas.getContext('2d');
  ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.clearRect(0, 0, W, H);
  view = makeView(W, H);
  const hex = colorById(state.colorId).hex;
  const col = colorById(state.colorId);
  const fl = flatCanvas(state.els, view.k, stageFlat, state.bg);
  if (view.kind === 'mock'){
    drawCandle(ctx, view.g, { hex, clear: col.clear, finish: col.finish, photo: photoFor(col), flat: fl, k: view.k, lit: state.lit, showZone: state.zone, px: dpr, wick: state.wick });
  } else {
    const Z = ZONE(), pad = 8 * view.sf;
    ctx.save();
    const x0 = view.ox - pad, y0 = view.oy - pad, w = Z.widthMm * view.sf + pad * 2, h = Z.heightMm * view.sf + pad * 2;
    ctx.shadowColor = 'rgba(0,0,0,0.18)'; ctx.shadowBlur = 24 * dpr; ctx.shadowOffsetY = 8 * dpr;
    ctx.beginPath(); ctx.roundRect ? ctx.roundRect(x0, y0, w, h, 10 * dpr) : ctx.rect(x0, y0, w, h);
    if (col.clear){ ctx.fillStyle = '#F1EADB'; ctx.fill(); ctx.fillStyle = 'rgba(206,218,213,0.45)'; ctx.fill(); } else { ctx.fillStyle = hex; ctx.fill(); }
    ctx.restore();
    ctx.drawImage(fl, view.ox, view.oy, Z.widthMm * view.sf, Z.heightMm * view.sf);
    ctx.save(); zonePath(ctx, view.fwd, Z.widthMm, Z.heightMm);
    ctx.setLineDash([5 * dpr, 4 * dpr]); ctx.lineWidth = 1.4 * dpr;
    ctx.strokeStyle = lum(hex) > 0.3 ? 'rgba(25,22,20,0.55)' : 'rgba(255,255,255,0.75)'; ctx.stroke();
    ctx.fillStyle = getComputedStyle(document.body).color; ctx.globalAlpha = 0.7;
    ctx.font = `500 ${12 * dpr}px "JetBrains Mono", monospace`; ctx.textAlign = 'center'; ctx.textBaseline = 'top';
    ctx.fillText(Z.wrap ? 'Розгортка друку по колу · пропорції орієнтовні' : 'Розгортка зони друку · пропорції орієнтовні', W / 2, y0 + h + 14 * dpr);
    if (Z.wrap){
      ctx.font = `600 ${11 * dpr}px "Manrope", sans-serif`; ctx.textBaseline = 'bottom';
      ctx.fillText('шов', view.ox, y0 - 6 * dpr); ctx.fillText('перед', view.ox + Z.widthMm * view.sf / 2, y0 - 6 * dpr); ctx.fillText('шов', view.ox + Z.widthMm * view.sf, y0 - 6 * dpr);
    }
    ctx.restore();
  }
  drawSelection(ctx, dpr);
}
function drawSelection(ctx, dpr){
  handles = null;
  const el = state.els.find((e) => e.id === state.sel); if (!el) return;
  const { w, h } = elSize(el), r = (el.rot || 0) * DEG, c = Math.cos(r), s = Math.sin(r);
  const pad = 1;
  const loc = (lx, ly) => view.fwd(el.x + lx * c - ly * s, el.y + lx * s + ly * c);
  const hw = w / 2 + pad, hh = h / 2 + pad, N = 14, pts = [];
  const edge = (ax, ay, bx, by) => { for (let i = 0; i < N; i++) pts.push(loc(ax + (bx - ax) * i / N, ay + (by - ay) * i / N)); };
  edge(-hw, -hh, hw, -hh); edge(hw, -hh, hw, hh); edge(hw, hh, -hw, hh); edge(-hw, hh, -hw, -hh);
  const centre = view.fwd(el.x, el.y);
  if (centre[2] !== undefined && centre[2] < 0.12) return;
  ctx.save();
  ctx.beginPath(); let pen = false;
  pts.push(pts[0]);
  pts.forEach((p) => { const vis = p[2] === undefined || p[2] > 0.02; if (!vis){ pen = false; return; } pen ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]); pen = true; });
  ctx.lineWidth = 3.5 * dpr; ctx.strokeStyle = 'rgba(255,255,255,0.85)'; ctx.stroke();
  ctx.setLineDash([6 * dpr, 4 * dpr]); ctx.lineWidth = 1.6 * dpr; ctx.strokeStyle = '#C86A12'; ctx.stroke(); ctx.setLineDash([]);
  const top = loc(0, -hh), rotH = loc(0, -hh - Math.max(5, 22 * dpr / (view.kind === 'mock' ? view.g.s : view.sf)));
  const scH = loc(hw, hh);
  ctx.beginPath(); ctx.moveTo(top[0], top[1]); ctx.lineTo(rotH[0], rotH[1]); ctx.strokeStyle = '#C86A12'; ctx.lineWidth = 1.5 * dpr; ctx.stroke();
  const knob = (p, kind) => {
    ctx.beginPath(); ctx.arc(p[0], p[1], 9 * dpr, 0, Math.PI * 2); ctx.fillStyle = '#ffffff'; ctx.fill();
    ctx.lineWidth = 2 * dpr; ctx.strokeStyle = '#C86A12'; ctx.stroke();
    ctx.beginPath();
    if (kind === 'rot'){ ctx.arc(p[0], p[1], 4 * dpr, -0.2 * Math.PI, 1.3 * Math.PI); }
    else { ctx.moveTo(p[0] - 3.5 * dpr, p[1] - 3.5 * dpr); ctx.lineTo(p[0] + 3.5 * dpr, p[1] + 3.5 * dpr); ctx.moveTo(p[0] + 3.5 * dpr, p[1] - 0.5 * dpr); ctx.lineTo(p[0] + 3.5 * dpr, p[1] + 3.5 * dpr); ctx.lineTo(p[0] + 0.5 * dpr, p[1] + 3.5 * dpr); }
    ctx.lineWidth = 1.6 * dpr; ctx.stroke();
  };
  const visH = (p) => p[2] === undefined || p[2] > 0.1;
  if (visH(rotH)) knob(rotH, 'rot'); if (visH(scH)) knob(scH, 'scale');
  ctx.restore();
  handles = { rot: visH(rotH) ? rotH : [-1e9, -1e9], scale: visH(scH) ? scH : [-1e9, -1e9], r: 22 * dpr };
}
function hitTest(p){
  const uv = view.inv(p[0], p[1]); if (!uv) return null;
  for (let i = state.els.length - 1; i >= 0; i--){
    const el = state.els[i], { w, h } = elSize(el), r = -(el.rot || 0) * DEG;
    const dx = uv[0] - el.x, dy = uv[1] - el.y;
    const lx = dx * Math.cos(r) - dy * Math.sin(r), ly = dx * Math.sin(r) + dy * Math.cos(r);
    const tol = 2;
    if (Math.abs(lx) <= w / 2 + tol && Math.abs(ly) <= h / 2 + tol) return el;
  }
  return null;
}
const pointers = new Map(); let drag = null, pinch = null;
function devPt(e){ const r = stageCanvas.getBoundingClientRect(); const k = stageCanvas.width / r.width; return [(e.clientX - r.left) * k, (e.clientY - r.top) * k]; }
const dist = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1]);
function startPinch(){
  const el = selectedEl(); if (!el) return;
  const [a, b] = [...pointers.values()];
  pinch = { el, d0: dist(a, b), a0: Math.atan2(b[1] - a[1], b[0] - a[0]), size0: el.type === 'text' ? el.size : el.w, rot0: el.rot || 0 };
  drag = null;
}
stageCanvas.addEventListener('pointerdown', (e) => {
  if (e.button > 0) return;
  const p = devPt(e); pointers.set(e.pointerId, p);
  if (pointers.size === 2){ startPinch(); return; }
  if (pointers.size > 2) return;
  const el = selectedEl();
  if (el && handles){
    if (dist(p, handles.scale) < handles.r){ const uv = view.inv(p[0], p[1]); drag = { mode: 'scale', el, d0: Math.max(0.5, Math.hypot(uv[0] - el.x, uv[1] - el.y)), size0: el.type === 'text' ? el.size : el.w }; }
    else if (dist(p, handles.rot) < handles.r){ drag = { mode: 'rot', el }; }
  }
  if (!drag){
    const hit = hitTest(p);
    if (hit){ select(hit.id); const uv = view.inv(p[0], p[1]); drag = { mode: 'move', el: hit, u0: uv[0], v0: uv[1], x0: hit.x, y0: hit.y }; }
    else {
      if (state.sel) select(null);
      if (view.kind === 'mock' && Math.abs(p[0] - view.g.cx) < view.g.Rp * 1.15) drag = { mode: 'spin', x0: p[0], spin0: state.spin };
    }
  }
  if (drag){ try { stageCanvas.setPointerCapture(e.pointerId); } catch (err){} stageCanvas.style.cursor = drag.mode === 'move' ? 'grabbing' : 'crosshair'; }
});
stageCanvas.addEventListener('touchstart', (e) => { if (drag || pinch) e.preventDefault(); }, { passive: false });
stageCanvas.addEventListener('touchmove', (e) => { if (drag || pinch) e.preventDefault(); }, { passive: false });
stageCanvas.addEventListener('pointermove', (e) => {
  const p = devPt(e);
  if (pointers.has(e.pointerId)) pointers.set(e.pointerId, p);
  if (pinch && pointers.size >= 2){
    const [a, b] = [...pointers.values()], el = pinch.el;
    const f = dist(a, b) / Math.max(1, pinch.d0);
    if (el.type === 'text') el.size = clamp(pinch.size0 * f, MIN_TEXT, 40); else el.w = clamp(pinch.size0 * f, MIN_IMG, ZONE().widthMm);
    el.rot = normRot(pinch.rot0 + (Math.atan2(b[1] - a[1], b[0] - a[0]) - pinch.a0) / DEG);
    clampEl(el); syncProps(); requestRender(); return;
  }
  if (!drag){
    if (e.pointerType === 'mouse' && view){
      const onHandle = handles && (dist(p, handles.scale) < handles.r || dist(p, handles.rot) < handles.r);
      stageCanvas.style.cursor = onHandle ? 'crosshair' : hitTest(p) ? 'grab' : (view.kind === 'mock' && Math.abs(p[0] - view.g.cx) < view.g.Rp) ? 'ew-resize' : 'default';
    }
    return;
  }
  if (drag.mode === 'spin'){ setSpin(drag.spin0 - (p[0] - drag.x0) / view.g.Rp / DEG); return; }
  const uv = view.inv(p[0], p[1]), el = drag.el;
  if (drag.mode === 'move'){
    let du = uv[0] - drag.u0; const zw = ZONE().widthMm;
    if (ZONE().wrap && view.kind === 'mock'){ if (du > zw / 2) du -= zw; else if (du < -zw / 2) du += zw; }
    el.x = drag.x0 + du; el.y = drag.y0 + (uv[1] - drag.v0);
  }
  else if (drag.mode === 'scale'){
    const f = Math.hypot(uv[0] - el.x, uv[1] - el.y) / drag.d0;
    if (el.type === 'text') el.size = clamp(drag.size0 * f, MIN_TEXT, 40); else el.w = clamp(drag.size0 * f, MIN_IMG, ZONE().widthMm);
  } else if (drag.mode === 'rot'){
    let a = Math.atan2(uv[1] - el.y, uv[0] - el.x) / DEG + 90;
    a = normRot(a); for (const snapA of [0, 90, -90, 180, -180]) if (Math.abs(a - snapA) < 4) a = snapA;
    el.rot = a;
  }
  clampEl(el); syncProps(); requestRender();
});
function endPointer(e){
  pointers.delete(e.pointerId);
  if (pinch && pointers.size < 2){ pinch = null; commit(); syncProps(); renderLayers(); return; }
  if (drag && pointers.size === 0){ const wasSpin = drag.mode === 'spin'; drag = null; stageCanvas.style.cursor = 'default'; if (!wasSpin){ commit(); syncProps(); renderLayers(); } }
}
stageCanvas.addEventListener('pointerup', endPointer);
stageCanvas.addEventListener('pointercancel', endPointer);
stageCanvas.addEventListener('keydown', (e) => {
  const el = selectedEl();
  if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z'){ e.preventDefault(); undo(); return; }
  if (!el) return;
  const step = e.shiftKey ? 5 : 1;
  const moves = { ArrowLeft: [-step, 0], ArrowRight: [step, 0], ArrowUp: [0, -step], ArrowDown: [0, step] };
  if (moves[e.key]){ e.preventDefault(); el.x += moves[e.key][0]; el.y += moves[e.key][1]; clampEl(el); requestRender(); clearTimeout(keyCommit); keyCommit = setTimeout(commit, 400); }
  else if (e.key === 'Delete' || e.key === 'Backspace'){ e.preventDefault(); removeEl(el.id); }
  else if (e.key === 'Escape'){ select(null); }
});
let keyCommit = null;
const normRot = (a) => { a = ((a + 180) % 360 + 360) % 360 - 180; return Math.round(a); };
const selectedEl = () => state.els.find((e) => e.id === state.sel) || null;
function setSpin(deg, smooth){
  state.spin = smooth ? ((deg + 180) % 360 + 360) % 360 - 180 : normRot(deg);
  const r = $('#spin'); if (r) r.value = state.spin;
  const d = Math.round(state.spin), o = $('#o-spin'); if (o) o.textContent = d === 0 ? 'спереду' : Math.abs(d) === 180 ? 'ззаду' : `${d > 0 ? '+' : ''}${d}°`;
  requestRender();
}
function faceEl(el){ const Z = ZONE(); if (!Z.wrap || !el) return; setSpin((el.x - Z.widthMm / 2) / (CONFIG.vessel.diameterMm / 2) / DEG); }

['dragenter', 'dragover'].forEach((t) => $('#canvasWrap').addEventListener(t, (e) => { if ([...(e.dataTransfer?.types || [])].includes('Files')){ e.preventDefault(); $('#canvasWrap').classList.add('drag-over'); } }));
['dragleave', 'drop'].forEach((t) => $('#canvasWrap').addEventListener(t, (e) => { $('#canvasWrap').classList.remove('drag-over'); }));
$('#canvasWrap').addEventListener('drop', (e) => { e.preventDefault(); handleFiles(e.dataTransfer.files); });

/* ===================== Панель налаштувань ===================== */
function elLabel(el){
  if (el.type === 'text') return (el.text || 'Порожній напис').replace(/\n/g, ' ');
  if (el.type === 'image') return assets[el.assetId]?.name || 'Зображення';
  return GRAPHICS[el.graphicId].name;
}
function elKind(el){ return el.type === 'text' ? 'Напис' : el.type === 'image' ? 'Зображення' : 'Графіка'; }
function select(id){
  state.sel = id; renderLayers(); buildProps(); requestRender();
  const el = selectedEl();
  $('#selLive').textContent = el ? `Вибрано: ${elKind(el).toLowerCase()} «${elLabel(el)}»` : 'Нічого не вибрано';
  if (el && state.step !== 'design') goStep('design');
}
function removeEl(id){
  const i = state.els.findIndex((e) => e.id === id); if (i < 0) return;
  const el = state.els[i]; state.els.splice(i, 1); if (state.sel === id) state.sel = null;
  refreshAll(); commit(); toast(`${elKind(el)} видалено`, 'Повернути', undo);
}
function moveLayer(id, dir){
  const i = state.els.findIndex((e) => e.id === id), j = i + dir;
  if (i < 0 || j < 0 || j >= state.els.length) return;
  [state.els[i], state.els[j]] = [state.els[j], state.els[i]]; refreshAll(); commit();
}
function renderSwatches(){
  const c = colorById(state.colorId);
  $('#swatches').innerHTML = CONFIG.colors.map((x) => `<button type="button" class="swatch" data-color="${x.id}" aria-pressed="${x.id === c.id}"><i style="background:${swatchBg(x)}"></i>${esc(x.name)}</button>`).join('')
    + (CONFIG.customColor.enabled ? `<button type="button" class="swatch custom" data-color="custom" aria-pressed="${c.custom ? 'true' : 'false'}" style="--cc:${c.custom ? c.hex : 'transparent'}"><i></i>Інший колір</button>` : '');
  $('#colorName').textContent = c.custom ? 'під замовлення' : c.name;
  $('#customBox').hidden = !c.custom; $('#tintBadge').hidden = !c.custom;
  if (c.custom){
    const set = (id, v) => { const x = $('#' + id); if (document.activeElement !== x) x.value = v; };
    set('cc-desc', state.custom.desc); set('cc-code', state.custom.code); set('cc-hex', state.custom.hex);
    $('#cc-file-name').textContent = colorRef ? `Прикріплено: ${colorRef.name}` : '';
    $('#cc-file-del').hidden = !colorRef;
  }
}
function renderLayers(){
  const ul = $('#layers');
  $('#layerCount').textContent = state.els.length ? `${state.els.length} шт` : '';
  if (!state.els.length){ ul.innerHTML = `<li class="empty">Поки порожньо. Обери шаблон, додай напис або завантаж зображення.</li>`; return; }
  ul.innerHTML = state.els.map((el, i) => ({ el, i })).reverse().map(({ el, i }) => {
    const q = qualityOf(el);
    const kind = el.type === 'image' ? `<img src="${assets[el.assetId]?.url || ''}" alt="">` : el.type === 'text' ? 'Аа' : '✦';
    return `<li class="layer" aria-current="${el.id === state.sel}">
      <button type="button" class="sel" data-sel="${el.id}"><span class="kind" aria-hidden="true">${kind}</span><span><span class="sr-only">${elKind(el)}: </span>${esc(elLabel(el))}</span>${q ? `<i class="q q-${q.level}" title="${esc(q.text)}" aria-label="${esc(q.text)}"></i>` : ''}</button>
      <button type="button" class="mini" data-up="${el.id}" aria-label="Підняти вище" ${i === state.els.length - 1 ? 'disabled' : ''}>${ICON.up}</button>
      <button type="button" class="mini" data-down="${el.id}" aria-label="Опустити нижче" ${i === 0 ? 'disabled' : ''}>${ICON.down}</button>
      <button type="button" class="mini" data-del="${el.id}" aria-label="Видалити «${esc(elLabel(el))}»">${ICON.trash}</button>
    </li>`;
  }).join('');
}
function colorChips(current, name){
  const chips = CONFIG.printColors.map((c) => `<button type="button" class="chip-color" style="background:${c.hex}" data-${name}="${c.hex}" aria-label="${esc(c.name)}" aria-pressed="${current.toLowerCase() === c.hex.toLowerCase()}"></button>`).join('');
  return `<div class="chips">${chips}<label class="color-custom">Свій<input type="color" id="p-${name}-custom" value="${current}" aria-label="Свій колір"></label></div>`;
}
function buildProps(){
  const box = $('#props'); const el = selectedEl();
  if (!el){ box.innerHTML = state.els.length ? `<p class="hint">Вибери елемент у списку або на прев’ю, щоб змінити його.</p>` : ''; return; }
  const rot = `<div class="field"><div class="field-head"><label for="p-rot">Поворот</label><output id="o-rot"></output></div><input type="range" id="p-rot" min="-180" max="180" step="1"></div>`;
  const pos = `<div class="row-btns"><button type="button" class="btn btn-ghost btn-sm" data-act="cx">По центру ↔</button><button type="button" class="btn btn-ghost btn-sm" data-act="cy">По центру ↕</button><button type="button" class="btn btn-ghost btn-sm" data-act="r0">Без повороту</button></div>`;
  let html = `<div class="props" aria-label="Налаштування вибраного елемента"><div class="props-title"><h4>${elKind(el)}</h4><button type="button" class="btn btn-ghost btn-sm danger" data-act="del">Видалити</button></div>`;
  if (el.type === 'text'){
    html += `<div class="field"><label for="p-text">Текст</label><textarea id="p-text" rows="2" maxlength="80" aria-describedby="h-text">${esc(el.text)}</textarea><p class="hint" id="h-text">Новий рядок — Enter. До 80 символів.</p></div>
      <div class="field"><label for="p-font">Шрифт</label><select id="p-font">${FONTS.map((f) => `<option value="${esc(f.id)}" style="font-family:${esc(f.css)}" ${f.id === el.font ? 'selected' : ''}>${esc(f.label)}</option>`).join('')}</select></div>
      <div class="field"><div class="field-head"><label for="p-size">Розмір шрифту</label><output id="o-size"></output></div><input type="range" id="p-size" min="${MIN_TEXT}" max="30" step="0.1"></div>
      <fieldset class="field"><legend>Колір напису</legend>${colorChips(el.color, 'color')}</fieldset>
      <fieldset class="field"><legend>Вирівнювання рядків</legend><div class="seg" role="group">${[['left', 'Ліворуч'], ['center', 'По центру'], ['right', 'Праворуч']].map(([v, l]) => `<button type="button" data-align="${v}" aria-pressed="${el.align === v}">${l}</button>`).join('')}</div></fieldset>` + rot + pos;
  } else {
    const isImg = el.type === 'image', a = isImg ? assets[el.assetId] : null;
    if (isImg) html += `<div class="img-meta"><img src="${a.url}" alt=""><div><b style="color:var(--ink)">${esc(a.name)}</b><br>${a.w}×${a.h} px · ${a.mime === 'image/png' ? 'PNG' : 'JPEG'}</div></div><div class="quality" id="p-quality"></div>`;
    if (isImg) html += `<div class="row-btns"><button type="button" class="btn btn-ghost btn-sm" data-act="fill">${ZONE().wrap ? 'На всю зону по колу' : 'На всю зону'}</button></div>`;
    html += `<div class="field"><div class="field-head"><label for="p-w">Ширина</label><output id="o-w"></output></div><input type="range" id="p-w" min="${MIN_IMG}" max="${ZONE().widthMm}" step="0.5"><p class="hint">Пропорції зберігаються.</p></div>`;
    if (!isImg) html += `<fieldset class="field"><legend>Колір графіки</legend>${colorChips(el.tint, 'tint')}</fieldset>`;
    html += rot + pos;
    html += `<div><label class="btn btn-ghost btn-sm" for="replaceInput">${isImg ? 'Замінити зображення' : 'Замінити на свій файл'}</label><input type="file" id="replaceInput" class="sr-only" accept="image/png,image/jpeg,.png,.jpg,.jpeg"></div>`;
  }
  html += `<p class="hint">На прев’ю: тягни елемент, щоб перемістити; кругла ручка внизу праворуч — розмір, угорі — поворот. На телефоні — двома пальцями. Тягни по порожньому місцю склянки, щоб її повернути.</p></div>`;
  box.innerHTML = html; syncProps();
}
function syncProps(){
  const el = selectedEl(); if (!el) return;
  const set = (id, v) => { const x = document.getElementById(id); if (x && document.activeElement !== x) x.value = v; };
  const out = (id, t) => { const x = document.getElementById(id); if (x) x.textContent = t; };
  set('p-rot', el.rot || 0); out('o-rot', `${el.rot || 0}°`);
  if (el.type === 'text'){ set('p-size', el.size); out('o-size', fmt(el.size)); }
  else {
    set('p-w', el.w); out('o-w', ZONE().wrap ? `${Math.round(el.w / ZONE().widthMm * 100)}% кола` : `${Math.round(el.w / ZONE().widthMm * 100)}% зони`);
    const q = qualityOf(el), qb = $('#p-quality');
    if (q && qb){ qb.className = 'quality ' + q.level; qb.innerHTML = (q.level === 'ok' ? ICON.ok : ICON.warn) + `<span>${esc(q.text)}</span>`; }
  }
}
let textCommit = null;
$('#props').addEventListener('input', (e) => {
  const el = selectedEl(); if (!el) return; const t = e.target;
  if (t.id === 'p-text'){ el.text = t.value; clampEl(el); clearTimeout(textCommit); textCommit = setTimeout(() => { commit(); renderLayers(); }, 600); }
  else if (t.id === 'p-size'){ el.size = parseFloat(t.value); clampEl(el); }
  else if (t.id === 'p-w'){ el.w = parseFloat(t.value); clampEl(el); }
  else if (t.id === 'p-rot'){ el.rot = parseInt(t.value, 10); clampEl(el); }
  else if (t.id === 'p-color-custom'){ el.color = t.value; markChips('color', t.value); }
  else if (t.id === 'p-tint-custom'){ el.tint = t.value; markChips('tint', t.value); }
  else return;
  syncProps(); requestRender();
});
$('#props').addEventListener('change', (e) => {
  const el = selectedEl(); if (!el) return; const t = e.target;
  if (t.id === 'p-font'){ el.font = t.value; el.weight = null; clampEl(el); syncProps(); requestRender(); commit(); }
  else if (t.id === 'replaceInput'){ handleFiles(t.files, el.id); t.value = ''; }
  else if (['p-size', 'p-w', 'p-rot', 'p-color-custom', 'p-tint-custom'].includes(t.id)){ commit(); renderLayers(); }
});
function markChips(name, v){ $$(`[data-${name}]`, $('#props')).forEach((b) => b.setAttribute('aria-pressed', b.dataset[name].toLowerCase() === v.toLowerCase())); }
$('#props').addEventListener('click', (e) => {
  const el = selectedEl(); if (!el) return; const b = e.target.closest('button'); if (!b) return;
  const Z = ZONE();
  if (b.dataset.color){ el.color = b.dataset.color; markChips('color', el.color); const c = $('#p-color-custom'); if (c) c.value = el.color; }
  else if (b.dataset.tint){ el.tint = b.dataset.tint; markChips('tint', el.tint); const c = $('#p-tint-custom'); if (c) c.value = el.tint; }
  else if (b.dataset.align){ el.align = b.dataset.align; $$('[data-align]', $('#props')).forEach((x) => x.setAttribute('aria-pressed', x === b)); }
  else if (b.dataset.act === 'cx'){ el.x = Z.widthMm / 2; clampEl(el); faceEl(el); }
  else if (b.dataset.act === 'fill'){
    const ar = elSize(el).h / el.w; el.rot = 0; el.w = Math.min(Z.widthMm, Z.heightMm / ar); el.x = Z.widthMm / 2; el.y = Z.heightMm / 2; clampEl(el);
    if (el.w < Z.widthMm - 1) toast(`Щоб зображення закрило все коло, потрібен горизонтальний файл у пропорції приблизно ${fmt(Z.widthMm / Z.heightMm)} : 1.`);
  }
  else if (b.dataset.act === 'cy'){ el.y = Z.heightMm / 2; clampEl(el); }
  else if (b.dataset.act === 'r0'){ el.rot = 0; clampEl(el); }
  else if (b.dataset.act === 'del'){ removeEl(el.id); return; }
  else return;
  syncProps(); requestRender(); commit();
});
$('#layers').addEventListener('click', (e) => {
  const b = e.target.closest('button'); if (!b) return;
  if (b.dataset.sel){ select(b.dataset.sel); faceEl(selectedEl()); }
  else if (b.dataset.up) moveLayer(b.dataset.up, 1);
  else if (b.dataset.down) moveLayer(b.dataset.down, -1);
  else if (b.dataset.del) removeEl(b.dataset.del);
});
$('#swatches').addEventListener('click', (e) => {
  const b = e.target.closest('[data-color]'); if (!b) return;
  state.colorId = b.dataset.color; renderSwatches(); requestRender(); commit();
});
$('#btnAddText').addEventListener('click', () => {
  const Z = ZONE();
  const darkGlass = lum(colorById(state.colorId).hex) < 0.2;
  const el = T({ id: uid(), text: 'Твій напис', font: 'Prata', size: 7, color: darkGlass ? '#FFFFFF' : '#1F1D1B', x: frontU(), y: Z.heightMm / 2 });
  clampEl(el); state.els.push(el); state.sel = el.id; refreshAll(); commit();
  setTimeout(() => { const t = $('#p-text'); if (t){ t.focus(); t.select(); } }, 30);
});
$('#fileInput').addEventListener('change', (e) => { handleFiles(e.target.files); e.target.value = ''; });
$('#btnUndo').addEventListener('click', undo);
$('#btnReset').addEventListener('click', () => {
  if (!state.els.length) return;
  state.els = []; state.sel = null; refreshAll(); commit();
  toast('Дизайн скинуто', 'Повернути', undo);
});
$('#btnZone').addEventListener('click', (e) => { state.zone = !state.zone; e.currentTarget.setAttribute('aria-pressed', state.zone); requestRender(); });
$('#btnLit').addEventListener('click', (e) => { state.lit = !state.lit; e.currentTarget.setAttribute('aria-pressed', state.lit); requestRender(); });
$$('[data-view]').forEach((b) => b.addEventListener('click', () => { state.view = b.dataset.view; $$('[data-view]').forEach((x) => x.setAttribute('aria-pressed', x === b)); $('#spinRow').hidden = state.view !== 'mock'; requestRender(); }));
$('#spin').addEventListener('input', (e) => setSpin(parseInt(e.target.value, 10)));
$$('[data-spin]').forEach((b) => b.addEventListener('click', () => { spinTouched(); setSpin(parseInt(b.dataset.spin, 10)); }));

/* ===================== Автоматичне обертання прев’ю =====================
   Свічка повільно обертається, коли покупець нічого не редагує: нічого не вибрано, немає перетягування,
   прев’ю на екрані. Будь-яка дія на прев’ю ставить обертання на паузу, через resumeAfterMs воно продовжується.
   Кнопка «Обертання» вимикає його зовсім; за системного налаштування «зменшити рух» обертання вимкнене одразу. */
const reduceMotion = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
let spinOff = reduceMotion || !CONFIG.preview.autoSpin, lastSpinTouch = 0, stageOnScreen = true, spinT = 0, spinPaint = 0;
function spinTouched(){ lastSpinTouch = performance.now(); }
function syncSpinBtn(){ const b = $('#autoSpinBtn'); b.setAttribute('aria-pressed', String(!spinOff)); b.title = spinOff ? 'Увімкнути автоматичне обертання' : 'Зупинити автоматичне обертання'; }
$('#autoSpinBtn').addEventListener('click', () => { spinOff = !spinOff; lastSpinTouch = 0; syncSpinBtn(); });
syncSpinBtn();
['pointerdown', 'wheel', 'keydown'].forEach((t) => stageCanvas.addEventListener(t, spinTouched, { passive: true }));
stageCanvas.addEventListener('pointermove', (e) => { if (e.buttons) spinTouched(); }, { passive: true });
$('#spin').addEventListener('pointerdown', spinTouched); $('#spin').addEventListener('input', spinTouched);
if ('IntersectionObserver' in window) new IntersectionObserver((en) => { stageOnScreen = en[0].isIntersecting; }, { threshold: 0.2 }).observe($('#canvasWrap'));
function autoSpinTick(t){
  requestAnimationFrame(autoSpinTick);
  const on = !spinOff && state.view === 'mock' && !state.sel && !drag && !pinch && stageOnScreen && !document.hidden
    && ZONE().wrap && performance.now() - lastSpinTouch > CONFIG.preview.resumeAfterMs;
  if (!on){ spinT = 0; return; }
  if (!spinT){ spinT = t; return; }
  if (t - spinPaint < 33) return;                 // ~30 кадрів/с — плавно й не навантажує телефон
  const dt = Math.min(100, t - spinT); spinT = t; spinPaint = t;
  setSpin(state.spin + CONFIG.preview.degPerSec * dt / 1000, true);
}
requestAnimationFrame(autoSpinTick);
function renderBg(){
  $('#bgOn').checked = !!state.bg; const box = $('#bgChips'); box.hidden = !state.bg;
  if (state.bg) box.innerHTML = colorChips(state.bg, 'bg');
}
$('#bgOn').addEventListener('change', (e) => { state.bg = e.target.checked ? (lum(colorById(state.colorId).hex) > 0.3 ? '#233A63' : '#EADFC8') : null; renderBg(); requestRender(); commit(); });
$('#bgChips').addEventListener('click', (e) => { const b = e.target.closest('[data-bg]'); if (!b) return; state.bg = b.dataset.bg; renderBg(); requestRender(); commit(); });
$('#bgChips').addEventListener('input', (e) => { if (e.target.id === 'p-bg-custom'){ state.bg = e.target.value; requestRender(); } });
$('#bgChips').addEventListener('change', (e) => { if (e.target.id === 'p-bg-custom'){ renderBg(); commit(); } });

function goStep(step){
  state.step = step;
  ['color', 'scent', 'design', 'review'].forEach((s) => {
    const tab = $('#tab-' + s), on = s === step;
    tab.setAttribute('aria-selected', on); tab.tabIndex = on ? 0 : -1; $('#step-' + s).hidden = !on;
  });
  if (step === 'review'){ $('#qty').value = state.qty; renderReview(); }
  if (step === 'scent') renderScents();
  updateMbar();
  if (step === 'design') requestAnimationFrame(paintTemplateChips);
}
$$('[role=tab]').forEach((t) => t.addEventListener('click', () => goStep(t.id.replace('tab-', ''))));
$('.steps').addEventListener('keydown', (e) => {
  const order = ['color', 'scent', 'design', 'review'], i = order.indexOf(state.step);
  if (e.key === 'ArrowRight' || e.key === 'ArrowLeft'){ e.preventDefault(); const n = order[(i + (e.key === 'ArrowRight' ? 1 : 3)) % 4]; goStep(n); $('#tab-' + n).focus(); }
});
$$('[data-step]').forEach((b) => b.addEventListener('click', () => { goStep(b.dataset.step); const p = $('.panel'); if (p.getBoundingClientRect().top < 0) p.scrollIntoView({ block: 'start' }); }));

const money = (v) => `${Number(v).toLocaleString('uk-UA', { maximumFractionDigits: 0 })} ${CONFIG.pricing.currency}`;
function tierFor(q){ const T = CONFIG.pricing.tiers; let t = T[0]; for (const x of T) if (q >= x.min) t = x; return t; }
function tierRange(i){ const T = CONFIG.pricing.tiers, a = T[i].min, b = T[i + 1] ? T[i + 1].min - 1 : CONFIG.pricing.quoteFromQty ? CONFIG.pricing.quoteFromQty - 1 : null; return b === null ? `від ${a} шт` : a === b ? `${a} шт` : `${a}–${b} шт`; }
/* Розрахунок: ціна за шт з урахуванням тиражу й доплати за аромат. Індивідуальний колір не оцінюється. */
function quote(q = state.qty){
  const P = CONFIG.pricing;
  if (!P.enabled || !P.tiers.length) return null;
  if (P.quoteFromQty && q >= P.quoteFromQty) return { quoteOnly: true, qty: q };
  const t = tierFor(q), extra = (state.scentMode === 'scent' ? (P.scentSurcharge || 0) : 0) + (wickById(state.wick).surcharge || 0);
  const unit = t.price + extra, total = unit * q;
  const idx = P.tiers.indexOf(t), next = P.tiers[idx + 1] || null;
  let better = null;   // коли більша кількість коштує не дорожче за поточну
  if (next){ const nt = (next.price + extra) * next.min; if (nt <= total) better = { qty: next.min, total: nt }; }
  return { qty: q, tier: t, unit, total, extra, next, better, custom: colorById(state.colorId).custom };
}
function priceText(){
  const Q = quote();
  if (!Q) { const O = CONFIG.order; return O.unitPrice ? `від ${fmt(O.unitPrice, 0)} ${O.currency} / шт` : 'Отримати розрахунок'; }
  if (Q.quoteOnly) return 'Індивідуальний розрахунок';
  return `${money(Q.unit)} × ${Q.qty} = ${money(Q.total)}${Q.custom ? ' + колір окремо' : ''}`;
}
function renderPrice(){
  const box = $('#priceBox'); if (!box) return;
  const P = CONFIG.pricing, Q = quote();
  if (!Q){ box.hidden = true; return; }
  box.hidden = false;
  const cur = Q.quoteOnly ? -1 : P.tiers.indexOf(Q.tier);
  let html = `<div class="tiers" role="group" aria-label="Ціна залежно від кількості">${P.tiers.map((t, i) => `<button type="button" class="tier" data-tier-qty="${t.min}" aria-pressed="${i === cur}"><span>${tierRange(i)}</span><b>${money(t.price)}</b><small>за шт</small></button>`).join('')}${P.quoteFromQty ? `<button type="button" class="tier" data-tier-qty="${P.quoteFromQty}" aria-pressed="${!!Q.quoteOnly}"><span>від ${P.quoteFromQty} шт</span><b style="font-size:15px">Індивідуально</b><small>розрахунок</small></button>` : ''}</div>`;
  if (Q.quoteOnly) html += `<div class="price-total"><div><span class="hint">Від ${P.quoteFromQty} шт</span><b>Індивідуальний розрахунок</b></div></div>`;
  else {
    html += `<div class="price-total"><div><span class="hint">Ціна за шт</span><b>${money(Q.unit)}</b></div><div><span class="hint">Разом за ${Q.qty} шт</span><b class="sum">${money(Q.total)}</b></div></div>`;
    if (Q.extra) html += `<p class="hint">Враховано доплати за аромат чи ґніт: +${money(Q.extra)} за шт.</p>`;
    if (Q.better) html += `<p class="price-tip">${Q.better.qty} шт коштуватимуть ${money(Q.better.total)} — не дорожче, ніж ${Q.qty} шт. <button type="button" class="link-btn" data-tier-qty="${Q.better.qty}">Взяти ${Q.better.qty} шт</button></p>`;
    else if (Q.next){ const left = Q.next.min - Q.qty; html += `<p class="hint">Ще ${left} шт — і ціна ${money(Q.next.price + Q.extra)} за шт.</p>`; }
    if (Q.custom) html += `<p class="hint">${esc(P.customColorNote)}</p>`;
  }
  html += `<p class="hint">${esc(P.approved ? 'Ціни дійсні для свічки 200 мл з вашим дизайном.' : P.note)}</p>`;
  box.innerHTML = html;
}
document.addEventListener('click', (e) => { const b = e.target.closest('[data-tier-qty]'); if (b && b.closest('#priceBox, #pricesSection')){ setQty(b.dataset.tierQty); if (b.closest('#pricesSection')){ goStep('review'); $('#konstruktor').scrollIntoView({ block: 'start' }); } } });
function customColorText(){
  const c = state.custom, parts = [];
  if (c.desc.trim()) parts.push(c.desc.trim());
  if (c.code.trim()) parts.push(c.code.trim());
  if (colorRef) parts.push(`приклад: ${colorRef.name}`);
  return parts.join(' · ');
}
function reviewChecks(){
  const checks = [];
  if (!state.els.length) checks.push(['bad', 'Дизайн порожній. Додай напис, зображення або обери шаблон.']);
  if (state.scentMode === 'scent' && !state.scentId) checks.push(['bad', 'Обери аромат у каталозі або перемкни на «Без аромату».']);
  if (state.scentMode === 'scent' && state.scentId === 'other') checks.push(['warn', CONFIG.scents.other.note]);
  if (colorById(state.colorId).custom && !customColorText()) checks.push(['bad', 'Опиши бажаний колір склянки, вкажи HEX/RAL або прикріпи приклад.']);
  if (colorById(state.colorId).custom) checks.push(['warn', CONFIG.customColor.note]);
  state.els.filter((e) => e.type === 'text' && !String(e.text).trim()).forEach(() => checks.push(['warn', 'Є порожній напис — заповни або видали його.']));
  state.els.filter((e) => e.type === 'image').forEach((e) => { const q = qualityOf(e); if (q.level !== 'ok') checks.push(['warn', `«${assets[e.assetId].name}»: ${q.text}`]); });
  state.els.filter((e) => e.type === 'graphic' && e.graphicId === 'mark').forEach(() => checks.push(['warn', 'Знак у шаблоні — заглушка. Заміни його своїм логотипом: вибери знак і натисни «Замінити на свій файл».']));
  if (state.els.length && !checks.some((c) => c[0] === 'bad')) checks.unshift(['ok', 'Усі елементи в межах зони друку.']);
  return checks;
}
function summaryRows(){
  const c = colorById(state.colorId), P = CONFIG.product, O = CONFIG.order;
  const rows = [
    ['Товар', `${esc(P.name)}<br><span class="hint" style="font-weight:500">скляна тара місткістю ${P.containerMl} мл</span>`],
    ['Колір склянки', `<span class="sw-dot" style="background:${c.custom ? c.hex : swatchBg(c)}"></span>${esc(c.custom ? 'Інший колір під замовлення' : c.name)}`]
  ];
  if (c.custom) rows.push(['Побажання щодо кольору', esc(customColorText() || '—')]);
  rows.push(['Аромат', esc(scentLabel())]);
  rows.push(['Ґніт', esc(wickById(state.wick).name)]);
  rows.push(['Віск', esc(CONFIG.product.wax)]);
  rows.push(['Кількість', `${state.qty} шт`]);
  rows.push(['Дизайн', `${state.els.length} елем.${state.bg ? ' · суцільний фон' : ''}${ZONE().wrap ? ' · друк по колу' : ''}`]);
  const Q = quote();
  if (Q && !Q.quoteOnly){ rows.push(['Ціна за шт', money(Q.unit)]); rows.push(['Разом', `<b>${money(Q.total)}</b>${Q.custom ? '<br><span class="hint" style="font-weight:500">+ індивідуальний колір окремо</span>' : ''}${CONFIG.pricing.approved ? '' : '<br><span class="hint" style="font-weight:500">орієнтовно</span>'}`]); }
  else rows.push(['Вартість', priceText()]);
  if (O.minQty) rows.push(['Мінімальна кількість', `${O.minQty} шт`]);
  if (O.leadTime) rows.push(['Строк виготовлення', esc(O.leadTime)]);
  return rows;
}
function renderReview(){
  renderPrice(); updateMbar();
  $('#reviewSummary').innerHTML = summaryRows().map(([a, b]) => `<li><span>${a}</span><span>${b}</span></li>`).join('');
  const checks = reviewChecks();
  $('#reviewChecks').innerHTML = checks.map(([l, t]) => `<p class="check ${l}">${l === 'ok' ? ICON.ok : ICON.warn}<span>${esc(t)}</span></p>`).join('');
  $('#btnOrder').disabled = checks.some((c) => c[0] === 'bad');
}
function refreshAll(){ renderSwatches(); renderScents(); renderBg(); renderLayers(); buildProps(); requestRender(); renderReview(); updateUndo(); }

/* ===================== Аромат ===================== */
function renderScents(){
  $$('input[name=scentMode]').forEach((r) => { r.checked = r.value === state.scentMode; });
  $('#scentCatalog').hidden = state.scentMode !== 'scent';
  const nS = allScents().length, m10 = nS % 10, m100 = nS % 100;
  $('#scentDemo').textContent = CONFIG.scents.demo ? 'попередній перелік' : `${nS} ${m10 === 1 && m100 !== 11 ? 'аромат' : m10 >= 2 && m10 <= 4 && (m100 < 12 || m100 > 14) ? 'аромати' : 'ароматів'}`;
  const groups = CONFIG.scents.groups, O = CONFIG.scents.other, hasOther = O && O.enabled;
  if (!groups.some((g) => g.id === state.scentGroup) && !(hasOther && state.scentGroup === 'other')) state.scentGroup = groups[0].id;
  $('#scentGroups').innerHTML = groups.map((g) => `<button type="button" data-group="${g.id}" aria-pressed="${g.id === state.scentGroup}">${esc(g.name)}</button>`).join('')
    + (hasOther ? `<button type="button" data-group="other" aria-pressed="${state.scentGroup === 'other'}">${esc(O.name)}</button>` : '');
  if (state.scentGroup === 'other'){
    $('#scentList').innerHTML = `<legend class="sr-only">${esc(O.name)}</legend><div class="field"><label for="scent-other">Який аромат хочеш?</label><textarea id="scent-other" rows="2" maxlength="200" placeholder="Наприклад: кава з карамеллю">${esc(state.scentOther)}</textarea><p class="hint">${esc(O.note)}</p></div>`;
  } else {
    const g = groups.find((x) => x.id === state.scentGroup);
    $('#scentList').innerHTML = `<legend class="sr-only">${esc(g.name)}</legend>` + g.items.map((it) => `<label class="scent${it.available === false ? ' off' : ''}"><input type="radio" name="scent" value="${it.id}" ${it.id === state.scentId ? 'checked' : ''} ${it.available === false ? 'disabled' : ''}><span><b>${esc(it.name)}</b><small>${esc(it.desc || '')}${it.available === false ? ' · тимчасово недоступний' : ''}</small></span></label>`).join('');
  }
  renderPicked();
  $('#wickRow').innerHTML = CONFIG.wicks.map((w) => `<label class="mode"><input type="radio" name="wick" value="${w.id}" ${w.id === state.wick ? 'checked' : ''}><span><b>${esc(w.name)}</b><small>${esc(w.desc)}${w.surcharge ? ` · +${money(w.surcharge)} за шт` : ''}</small></span></label>`).join('');
  $('#waxSpec').innerHTML = `Віск: <b>${esc(CONFIG.product.wax.toLowerCase())}</b>`;
}
function renderPicked(){
  const sc = scentById(state.scentId), w = wickById(state.wick);
  const sTxt = state.scentMode === 'none' ? 'без аромату' : sc ? esc(sc.name) : '';
  $('#scentPicked').innerHTML = (state.scentMode === 'scent' && !sc ? 'Обери групу й один аромат зі списку.' : `Аромат: <b>${sTxt}</b>`) + ` · Ґніт: <b>${esc(w.name.toLowerCase())}</b>`;
}
document.addEventListener('change', (e) => {
  if (e.target.name === 'scentMode'){ state.scentMode = e.target.value; renderScents(); renderReview(); scheduleSave(); }
  else if (e.target.name === 'scent'){ state.scentId = e.target.value; renderPicked(); renderReview(); scheduleSave(); }
  else if (e.target.name === 'wick'){ state.wick = e.target.value; renderPicked(); renderReview(); requestRender(); scheduleSave(); }
});
document.addEventListener('input', (e) => {
  if (e.target.id === 'scent-other'){ state.scentOther = e.target.value; state.scentId = e.target.value.trim() ? 'other' : (state.scentId === 'other' ? null : state.scentId); renderPicked(); renderReview(); scheduleSave(); }
});
$('#scentGroups').addEventListener('click', (e) => { const b = e.target.closest('[data-group]'); if (!b) return; state.scentGroup = b.dataset.group; renderScents(); if (state.scentGroup === 'other') setTimeout(() => $('#scent-other')?.focus(), 30); });

/* ===================== Інший колір під замовлення ===================== */
const HEX_RE = /^#?([0-9a-f]{3}|[0-9a-f]{6})$/i;
$('#cc-desc').addEventListener('input', (e) => { state.custom.desc = e.target.value; renderReview(); scheduleSave(); });
$('#cc-code').addEventListener('input', (e) => {
  const v = e.target.value.trim(); state.custom.code = e.target.value; fieldErr('cc-code', '');
  if (HEX_RE.test(v)){ let h = v.replace('#', ''); if (h.length === 3) h = h.split('').map((c) => c + c).join(''); state.custom.hex = '#' + h.toUpperCase(); $('#cc-hex').value = state.custom.hex; refreshCustomPreview(); }
  renderReview(); scheduleSave();
});
$('#cc-code').addEventListener('change', (e) => {
  const v = e.target.value.trim();
  if (v && !HEX_RE.test(v) && !/^RAL\s?\d{4}/i.test(v) && /^#/.test(v)) fieldErr('cc-code', 'HEX має вигляд #RRGGBB, наприклад #7A8B5C.');
});
$('#cc-hex').addEventListener('input', (e) => { state.custom.hex = e.target.value.toUpperCase(); refreshCustomPreview(); });
$('#cc-hex').addEventListener('change', () => scheduleSave());
function refreshCustomPreview(){ const sw = $('.swatch.custom'); if (sw) sw.style.setProperty('--cc', state.custom.hex); requestRender(); }
$('#cc-file').addEventListener('change', async (e) => {
  const f = e.target.files[0]; e.target.value = ''; if (!f) return;
  const ok = ['image/png', 'image/jpeg', 'application/pdf'].includes(f.type) || /\.(png|jpe?g|pdf)$/i.test(f.name);
  if (!ok){ $('#cc-file-name').textContent = 'Підходять PNG, JPEG або PDF.'; return; }
  if (f.size > CONFIG.customColor.maxRefMb * 1048576){ $('#cc-file-name').textContent = `Файл завеликий. Максимум — ${CONFIG.customColor.maxRefMb} МБ.`; return; }
  colorRef = { name: f.name, mime: f.type || 'application/octet-stream', blob: f }; colorRefDirty = true;
  renderSwatches(); renderReview(); scheduleSave();
});
$('#cc-file-del').addEventListener('click', () => { colorRef = null; colorRefDirty = true; renderSwatches(); renderReview(); scheduleSave(); });
$('#ccNote').textContent = CONFIG.customColor.note;

/* ===================== Кількість ===================== */
function setQty(v){ const n = Math.max(1, Math.min(100000, parseInt(v, 10) || 1)); if (n === state.qty && String($('#qty').value) === String(n)) return; state.qty = n; $('#qty').value = n; const oq = $('#o-qty'); if (oq && document.activeElement !== oq) oq.value = n; renderReview(); if (!$('#zamovlennia').hidden) renderOrderSummary(); scheduleSave(); }
$('#qtyMinus').addEventListener('click', () => setQty(state.qty - 1));
$('#qtyPlus').addEventListener('click', () => setQty(state.qty + 1));
$('#qty').addEventListener('change', (e) => setQty(e.target.value));
$('#qty').addEventListener('input', (e) => { const n = parseInt(e.target.value, 10); if (Number.isInteger(n) && n > 0 && n !== state.qty){ state.qty = n; renderReview(); if (!$('#zamovlennia').hidden) renderOrderSummary(); scheduleSave(); } });

/* ===================== Шаблони ===================== */
/* Готові колекції — лише квіткова графіка, без написів. chip:false — не показуємо в рядку шаблонів конструктора. */
/* Рівномірно по колу; фаза підібрана так, щоб шов розгортки припадав між мотивами. */
const ringX = (Z, n, f0 = 0.5 + (n % 2 ? 0 : 0.5 / n)) => Array.from({ length: n }, (_, i) => Z.widthMm * (((f0 + i / n) % 1 + 1) % 1));
/* Квіткові шаблони в стилі прикладів робіт — без написів (центр спереду вільний для власного тексту). */
const FLORAL_TEMPLATES = [
  { id: 'f-wild', name: 'Польові квіти', colorId: 'clear', abs: true, els: (Z) => { const u = Z.widthMm / 2, H = Z.heightMm, w = H * 0.95 / 1.15, y = H - w * 1.15 / 2 - 0.3, lw = 40;
    return [G('wildspray', { x: u - 42, y, w }), G('wildspray', { x: u + 42, y, w, flip: true }), G('wildlow', { x: u, y: H - lw * 0.45 / 2 - 0.3, w: lw }),
      G('wildspray', { x: 42, y, w, flip: true }), G('wildspray', { x: Z.widthMm - 42, y, w })]; }},
  { id: 'f-frame', name: 'Квіткова рамка', colorId: 'clear', abs: true, els: (Z) => { const u = Z.widthMm / 2, H = Z.heightMm, w = H * 0.96 / 2.3;
    return [G('vine', { x: u - 30, y: H / 2, w }), G('vine', { x: u + 30, y: H / 2, w, flip: true }), G('vine', { x: 30, y: H / 2, w, flip: true }), G('vine', { x: Z.widthMm - 30, y: H / 2, w })]; }},
  { id: 'f-peony', name: 'Півонії й троянди', colorId: 'clear', abs: true, els: (Z) => { const H = Z.heightMm, w = 36;
    return ringX(Z, 8).map((x, i) => G('peonybunch', { x, y: i % 2 ? H - w / 2 - 0.5 : w / 2 + 0.5, w, rot: i % 2 ? 172 : -6, flip: i % 4 > 1 })); }},
  { id: 'f-wreath', name: 'Квітковий вінок', colorId: 'clear', abs: true, els: (Z) => { const u = Z.widthMm / 2, H = Z.heightMm, lw = 44;
    return [G('greenwreath', { x: u, y: H / 2, w: H * 0.97 }), G('wildlow', { x: 42, y: H - lw * 0.45 / 2 - 0.3, w: lw }), G('wildlow', { x: Z.widthMm - 42, y: H - lw * 0.45 / 2 - 0.3, w: lw, flip: true })]; }},
  { id: 'f-meadow', name: 'Луговий бордюр', colorId: 'clear', abs: true, els: (Z) => { const w = Z.widthMm / 6; return ringX(Z, 6).map((x, i) => G('wildlow', { x, y: Z.heightMm - w * 0.45 / 2 - 0.3, w, flip: i % 2 === 1 })); } },
  { id: 'f-bouquet', name: 'Букет по колу', colorId: 'white', abs: true, els: (Z) => { const H = Z.heightMm, w = H * 0.95 / 1.15;
    return ringX(Z, 6).map((x, i) => G('wildspray', { x, y: H - w * 1.15 / 2 - 0.3, w, flip: i % 2 === 1 })); }}
];
/* «Чиста свічка» — без дизайну; колір склянки не змінює. */
const CLEAN_TEMPLATE = { id: 'clean', name: 'Чиста свічка', colorId: null, els: () => [] };
TEMPLATES.push(CLEAN_TEMPLATE, ...FLORAL_TEMPLATES);

function templateEls(tpl){
  const Z = ZONE(), dx = (Z.widthMm - 100) / 2, dy = (Z.heightMm - 56) / 2;
  const list = tpl.abs ? tpl.els(Z) : tpl.els().map((e) => Object.assign({}, e, { x: e.x + dx, y: e.y + dy }));
  return list.map((e) => { const el = Object.assign({ id: uid() }, e); if (el.type === 'graphic' && !el.tint) el.tint = GRAPHICS[el.graphicId].tint || BOT.accent; clampEl(el); return el; });
}
function applyTemplate(id, opts = {}){
  const tpl = TEMPLATES.find((t) => t.id === id); if (!tpl) return;
  state.els = templateEls(tpl); state.bg = tpl.bg || null; state.colorId = opts.keepColor || !tpl.colorId ? state.colorId : tpl.colorId; state.sel = null; setSpin(0);
  if (!opts.silent){ refreshAll(); commit(); toast(tpl.id === 'clean' ? 'Чиста свічка. Додай свій напис, малюнок або логотип.' : `Шаблон «${tpl.name}» відкрито. Змінюй кольори або додай свій напис.`, 'Скасувати', undo); }
}
function renderTemplateChips(){
  $('#tplRow').innerHTML = TEMPLATES.filter((t) => t.chip !== false).map((t) => `<button type="button" class="tpl" data-tpl="${t.id}"><canvas aria-hidden="true"></canvas>${esc(t.name)}</button>`).join('');
  $$('#tplRow .tpl').forEach((b) => b.addEventListener('click', () => { applyTemplate(b.dataset.tpl); if (window.innerWidth < 960) $('#stage').scrollIntoView({ block: 'nearest' }); }));
  paintTemplateChips();
}
function paintTemplateChips(){
  $$('#tplRow .tpl').forEach((b) => {
    const t = TEMPLATES.find((x) => x.id === b.dataset.tpl), c = b.querySelector('canvas');
    if (!c.clientWidth) return;
    const { W, H } = sizeCanvas(c); const ctx = c.getContext('2d'); ctx.clearRect(0, 0, W, H);
    paintCandle(ctx, W, H, colorById(t.colorId || state.colorId), templateEls(t), { bg: t.bg, geom: { fitW: 0.8, fitH: 0.86, headMm: 6 } });
  });
}

/* ===================== Герой і галерея ===================== */
const HERO = [
  { tpl: 'birthday', color: 'white', label: 'Подарунок' },
  { tpl: 'wedding', color: 'clear', label: 'Весілля' },
  { tpl: 'logo', color: 'black', label: 'Бізнес' },
  { tpl: 'pattern', color: 'clear', label: 'По колу', lit: true }
];
/* Герой: одна велика свічка, на якій по черзі змінюються дизайни (єдина автоматична анімація сторінки). */
let heroCache = null, heroIdx = 0, heroFrom = 0, heroT0 = 0, heroAuto = true, heroTimer = null;
function renderHero(){
  const c = $('#heroCanvas'); if (!c) return; const { W, H } = sizeCanvas(c);
  const frames = HERO.map((h) => {
    const t = TEMPLATES.find((x) => x.id === h.tpl), cv = document.createElement('canvas'); cv.width = W; cv.height = H;
    const g = paintCandle(cv.getContext('2d'), W, H, colorById(h.color), templateEls(t), { bg: t.bg, geom: { fitW: 0.8, fitH: 0.82, headMm: 14, dy: -H * 0.03 }, lit: h.lit, noFlame: true });
    return { cv, g, lit: h.lit };
  });
  heroCache = { frames, W, H };
  drawHeroFrame(performance.now() / 1000);
  $('#heroSwatches').innerHTML = HERO.map((h, i) => `<button type="button" data-hero="${i}" aria-pressed="${i === heroIdx}"><i style="background:${swatchBg(colorById(h.color))}"></i>${esc(h.label)}</button>`).join('');
}
function drawHeroFrame(t){
  if (!heroCache) return;
  const c = $('#heroCanvas'), ctx = c.getContext('2d'), F = heroCache.frames;
  const k = heroT0 ? Math.min(1, (performance.now() - heroT0) / 700) : 1, e = k * k * (3 - 2 * k);
  ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.clearRect(0, 0, c.width, c.height);
  if (e < 1){ ctx.globalAlpha = 1 - e; ctx.drawImage(F[heroFrom].cv, 0, 0); }
  ctx.globalAlpha = e; ctx.drawImage(F[heroIdx].cv, 0, 0); ctx.globalAlpha = 1;
  if (F[heroIdx].lit) drawFlame(ctx, F[heroIdx].g, t);
}
function showHero(i, user){
  if (i === heroIdx) return;
  heroFrom = heroIdx; heroIdx = i; heroT0 = performance.now();
  $$('#heroSwatches [data-hero]').forEach((b) => b.setAttribute('aria-pressed', String(+b.dataset.hero === i)));
  if (user) heroAuto = false;
  if (!heroAnim) { const step = () => { drawHeroFrame(performance.now() / 1000); if (performance.now() - heroT0 < 720) requestAnimationFrame(step); }; requestAnimationFrame(step); }
}
$('#heroSwatches')?.addEventListener('click', (e) => { const b = e.target.closest('[data-hero]'); if (b) showHero(+b.dataset.hero, true); });
let heroAnim = null;
function heroLoop(ts){ drawHeroFrame(ts / 1000); heroAnim = requestAnimationFrame(heroLoop); }
function setHeroAnim(on){
  if (!$('#heroCanvas')) return;
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (on && !reduce && !heroAnim) heroAnim = requestAnimationFrame(heroLoop);
  if (!on && heroAnim){ cancelAnimationFrame(heroAnim); heroAnim = null; }
  clearInterval(heroTimer);
  if (on && !reduce) heroTimer = setInterval(() => { if (heroAuto && !document.hidden) showHero((heroIdx + 1) % HERO.length); }, 3600);
}
const IDEAS = [
  { skip: true, cls: 'idea-a', photo: 'gift', tpl: 'special', title: 'Подарунок', text: 'Кілька твоїх слів на склі й сердечко від руки. Такого подарунка немає в магазині.', alt: 'Свічка з написом «Ти — особлива» і сердечком поруч із подарунковою коробкою та стрічкою' },
  { skip: true, cls: 'idea-b', photo: 'quote', tpl: 'deadline', title: 'Для себе', text: 'Фраза, з якою легше видихнути. Для робочого столу чи тихого вечора вдома.', alt: 'Запалена свічка з написом «Горить свічка. Дедлайни зачекають.» на столі з блокнотом і лавандою' },
  { cls: 'idea-d', photo: 'team', tpl: 'brand', title: 'Для команди', text: 'Логотип і орнамент на кожній свічці партії. Для команди, клієнтів і партнерів — з погодженим макетом і розрахунком за тиражем.', alt: 'Партія свічок із логотипом RDK і зеленим орнаментом на кам’яній стільниці в офісі', batch: true }
];
function renderGallery(){
  const P = CONFIG.pricing, last = P.enabled && P.tiers.length ? P.tiers[P.tiers.length - 1] : null;
  $('#gallery').innerHTML = IDEAS.filter((o) => !o.skip).map((o) => `<figure class="idea ${o.cls}">
      <div class="ph"><img src="${window.SITE_PHOTOS[o.photo] || document.querySelector(`img[data-photo="${o.photo}"]`).src}" width="1100" height="1100" alt="${esc(o.alt)}"></div>
      <figcaption style="display:grid;gap:12px">
        <h3>${esc(o.title)}</h3><p>${esc(o.text)}</p>
        ${o.batch && last ? `<p class="hint">Від ${last.min} шт — ${money(last.price)} за свічку${P.approved ? '' : ', орієнтовно'}.</p>` : ''}
        <div class="row-btns"><button type="button" class="btn ${o.batch ? 'btn-ghost' : 'btn-cta'} btn-sm" data-use="${o.tpl}">Створити схожу свічку</button>${o.batch ? '<button type="button" class="btn btn-cta btn-sm" data-batch>Замовити партію</button>' : ''}</div>
      </figcaption></figure>`).join('');
}
function paintGallery(){}

/* ===================== Приклади робіт (фото) ===================== */
/* photo — ключ у window.COLLECTION_PHOTOS; tpl — шаблон конструктора, близький до фото;
   glass: 'clear' | 'custom' (customHex/customDesc — колір склянки під замовлення). */
let WORKS = [
  { id: 'mama', cat: 'gift', title: 'Мамо, дякую за тепло', glass: 'clear', note: 'Польові квіти по колу й напис від руки', tpl: 'mama', alt: 'Свічка з написом «Мамо, дякую за тепло» і польовими квітами по колу на камені поруч із квітами' },
  { id: 'bestyear', cat: 'gift', title: 'Твій найкращий рік', glass: 'clear', note: 'Привітання з днем народження в квітковій рамці', tpl: 'bestyear', alt: 'Свічка з написом «Твій найкращий рік. З днем народження» в квітковій рамці поруч із подарунком' },
  { id: 'kvitny', cat: 'gift', title: 'Квітни', glass: 'clear', note: 'Півонії по всьому колу й золотий напис', tpl: 'kvitny', alt: 'Свічка з півоніями по всьому колу й написом «Квітни»' },
  { id: 'gift', cat: 'gift', photo: 'gift', title: 'Ти — особлива', glass: 'clear', note: 'Кілька теплих слів і сердечко від руки', tpl: 'special', alt: 'Свічка з написом «Ти — особлива» і сердечком поруч із подарунковою коробкою та стрічкою' },
  { id: 'anna', cat: 'wedding', title: 'Анна & Максим', glass: 'clear', note: 'Весільний вінок, імена й дата', tpl: 'anna', alt: 'Весільна свічка з вінком і написом «Анна & Максим, 24.10.2026»' },
  { id: 'together', cat: 'love', title: 'Разом — назавжди', glass: 'clear', note: 'Лінійний малюнок і ваша річниця', tpl: 'together', alt: 'Свічка з малюнком рук і написом «Разом — назавжди. 5 років кохання»' },
  { id: 'onlyus', cat: 'love', title: 'Тільки ми', glass: 'custom', customHex: '#5C1320', customDesc: 'Рубінове скло, як у прикладі «Тільки ми»', note: 'Тонкі лінії на рубіновому склі', tpl: 'onlyus', alt: 'Запалена свічка в рубіновій склянці з лінійним малюнком і написом «Тільки ми»' },
  { id: 'quote', cat: 'gift', photo: 'quote', title: 'Дедлайни зачекають', glass: 'clear', note: 'Фраза для себе, для робочого столу чи тихого вечора', tpl: 'deadline', alt: 'Запалена свічка з написом «Горить свічка. Дедлайни зачекають.» на столі з блокнотом і лавандою' },
  { id: 'nova', cat: 'biz', title: 'NOVA Partners', glass: 'custom', customHex: '#4E4A46', customDesc: 'Димчасте скло, як у прикладі «NOVA Partners»', note: 'Логотип і подяка партнерам', tpl: 'nova', alt: 'Свічка в димчастій склянці з логотипом NOVA Partners і написом «Дякуємо за партнерство» поруч із подарунковою коробкою' },
  { id: 'forma', cat: 'biz', title: 'FORMA', glass: 'clear', note: 'Геометричний орнамент і слоган бренду', tpl: 'forma', alt: 'Свічка з геометричним орнаментом і написом «FORMA. Разом створюємо більше» поруч із брендованою коробкою' }
];
/* Категорії редагуються в адмін-панелі (workCategories у data/site.json). Порядок = порядок фільтрів. */
let WORK_CATS = [{ id: 'gift', name: 'Подарунки' }, { id: 'love', name: 'Кохання' }, { id: 'wedding', name: 'Весілля' }, { id: 'biz', name: 'Для бізнесу' }];
const workCatName = (id) => (WORK_CATS.find((c) => c.id === id) || {}).name || '';
/* Кнопки фільтра: «Усі» + категорії, у яких є хоча б одна видима позиція. */
function renderFilter(box, cats, used){
  const list = cats.filter((c) => used.has(c.id));
  box.innerHTML = `<button type="button" data-cat="all" aria-pressed="true">Усі</button>` + list.map((c) => `<button type="button" data-cat="${esc(c.id)}" aria-pressed="false">${esc(c.name)}</button>`).join('');
  box.hidden = list.length < 2;
}
const workPhoto = (w) => w.image || (w.photo ? ((window.SITE_PHOTOS || {})[w.photo] || document.querySelector(`img[data-photo="${w.photo}"]`)?.src || '') : (window.COLLECTION_PHOTOS || {})[w.id] || '');
const workGlassText = (w) => w.glass === 'custom' ? 'Колір склянки під замовлення.' : `${colorById(w.glass || 'clear').name} склянка.`;
function renderWorks(){
  renderFilter($('#worksFilter'), WORK_CATS, new Set(WORKS.filter((w) => !w.hidden).map((w) => w.cat)));
  $('#works').innerHTML = WORKS.filter((w) => !w.hidden).map((w) => `<figure class="coll" data-work="${w.id}" data-cat="${w.cat}">
      <div class="ph"><img src="${workPhoto(w)}" width="720" height="720" alt="${esc(w.alt)}"></div>
      <figcaption style="display:grid;gap:6px">
        <span class="tag">${esc(workCatName(w.cat))}</span>
        <h3>${esc(w.title)}</h3>
        <p class="meta">${esc(String(w.note || '').replace(/\.$/, ''))}. ${workGlassText(w)}</p>
        <div class="row-btns">${w.tpl && TEMPLATES.some((t) => t.id === w.tpl) ? `<button type="button" class="btn btn-ghost btn-sm" data-work-use="${w.id}">Створити на основі цього дизайну</button>` : `<button type="button" class="btn btn-ghost btn-sm" data-batch>Обговорити такий дизайн</button>`}</div>
      </figcaption></figure>`).join('');
}
$('#worksFilter').addEventListener('click', (e) => {
  const b = e.target.closest('[data-cat]'); if (!b) return;
  $$('#worksFilter [data-cat]').forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
  $$('#works .coll').forEach((f) => { f.hidden = b.dataset.cat !== 'all' && f.dataset.cat !== b.dataset.cat; });
});
function openInStudio(msg){ refreshAll(); commit(); goStep('design'); $('#konstruktor').scrollIntoView({ block: 'start' }); toast(msg); }
function applyWork(w){
  applyTemplate(w.tpl, { silent: true });
  if (w.glass === 'custom'){ state.custom = { desc: w.customDesc || '', code: '', hex: w.customHex || CONFIG.customColor.defaultPreviewHex }; state.colorId = 'custom'; }
  else if (colorById(w.glass)) state.colorId = w.glass;
  openInStudio(`Дизайн «${w.title}» відкрито в конструкторі. Зміни напис чи кольори під себе.`);
}
$('#works').addEventListener('click', (e) => {
  const b = e.target.closest('[data-work-use]'); if (b) applyWork(WORKS.find((w) => w.id === b.dataset.workUse));
});

/* ===================== Готові колекції (квіткові, без написів) ===================== */
/* Картки малюються тим самим мокапом склянки, що й конструктор; tpl — шаблон із FLORAL_TEMPLATES. */
const COLLECTIONS = [
  { id: 'wild', tpl: 'f-wild', title: 'Польові квіти', note: 'Ромашки, бордові суцвіття й гіпсофіла з боків склянки' },
  { id: 'frame', tpl: 'f-frame', title: 'Квіткова рамка', note: 'Тонкі гілки з бордовими й рум’яними квітами' },
  { id: 'peony', tpl: 'f-peony', title: 'Півонії й троянди', note: 'Рум’яні півонії та бордові троянди по колу' },
  { id: 'wreath', tpl: 'f-wreath', title: 'Квітковий вінок', note: 'Вінок із зелені, білих квітів і бутонів' },
  { id: 'meadow', tpl: 'f-meadow', title: 'Луговий бордюр', note: 'Ромашки й гіпсофіла по низу склянки' },
  { id: 'bouquet', tpl: 'f-bouquet', title: 'Букет по колу', note: 'Польові букети по всьому колу' }
];
const collTpl = (c) => TEMPLATES.find((t) => t.id === c.tpl);
document.addEventListener('click', (e) => {
  const b = e.target.closest('[data-use]'); if (!b || !b.closest('#gallery, .hero-photo')) return;
  applyTemplate(b.dataset.use); goStep('design');
  $('#konstruktor').scrollIntoView({ block: 'start' });
});
$$('[data-go-studio]').forEach((a) => a.addEventListener('click', () => goStep('color')));
document.addEventListener('click', (e) => { const b = e.target.closest('[data-batch]'); if (b){ e.preventDefault(); $('#btnBatch').click(); } });

/* ===================== Пакет заявки / проєкту ===================== */
function safeName(name, mime){
  const ext = mime === 'image/png' ? '.png' : '.jpg';
  const base = String(name || 'image').replace(/\.[^.]+$/, '').replace(/[^\p{L}\p{N}_-]+/gu, '_').slice(0, 60) || 'image';
  return base + ext;
}
function safeRefName(n){ const m = String(n).match(/\.(png|jpe?g|pdf)$/i); return (String(n).replace(/\.[^.]+$/, '').replace(/[^\p{L}\p{N}_-]+/gu, '_').slice(0, 60) || 'reference') + (m ? m[0].toLowerCase() : ''); }
function canvasBlob(c, type = 'image/png', q){ return new Promise((res, rej) => c.toBlob((b) => b ? res(b) : rej(new Error('Не вдалося створити зображення')), type, q)); }
async function renderLayoutBlob(){
  const k = CONFIG.print.targetDpi / 25.4;
  return canvasBlob(flatCanvas(state.els, k, null, state.bg));
}
async function renderMockupBlob(){
  const c = document.createElement('canvas'); c.width = 900; c.height = 1100;
  const ctx = c.getContext('2d'); ctx.fillStyle = '#F3F1EC'; ctx.fillRect(0, 0, c.width, c.height);
  paintCandle(ctx, c.width, c.height, colorById(state.colorId), state.els, { bg: state.bg, wick: state.wick, geom: { fitW: 0.7, fitH: 0.84, headMm: 10 } });
  return canvasBlob(c);
}
async function buildPackage(kind, extra = {}){
  const Z = ZONE(), V = CONFIG.vessel, col = colorById(state.colorId);
  const files = [], usedNames = new Set(), assetList = [];
  const elements = state.els.map((el, i) => {
    const { w, h } = elSize(el);
    const base = { order: i + 1, type: el.type, centerMm: { x: r2(el.x), y: r2(el.y) }, sizeMm: { w: r2(w), h: r2(h) }, rotationDeg: el.rot || 0 };
    if (el.type === 'text'){
      const f = fontById(el.font);
      return Object.assign(base, { text: el.text, font: { family: f.id, weight: el.weight || f.weight, source: 'Google Fonts' }, fontSizeMm: r2(el.size), lineHeight: el.lh || 1.18, color: el.color.toUpperCase(), align: el.align });
    }
    if (el.type === 'image'){
      const a = assets[el.assetId];
      let fname = `images/${String(i + 1).padStart(2, '0')}-${safeName(a.name, a.mime)}`;
      while (usedNames.has(fname)) fname = fname.replace(/(\.\w+)$/, '_1$1');
      usedNames.add(fname); files.push({ path: fname, blob: a.blob });
      assetList.push({ id: a.id, name: a.name, mime: a.mime, w: a.w, h: a.h, file: fname });
      return Object.assign(base, { file: fname, originalName: a.name, mime: a.mime, pixels: { w: a.w, h: a.h }, effectiveDpi: Math.round(dpiOf(el)), quality: qualityOf(el).level });
    }
    return Object.assign(base, { graphicId: el.graphicId, name: GRAPHICS[el.graphicId].name, color: el.tint.toUpperCase(), color2: el.tint2 ? el.tint2.toUpperCase() : (GRAPHICS[el.graphicId].tint2 || undefined), mirrored: el.flip || undefined, vector: true, note: el.graphicId === 'mark' ? 'Заглушка логотипа з шаблону' : undefined });
  });
  const [layout, preview] = await Promise.all([renderLayoutBlob(), renderMockupBlob()]);
  files.push({ path: 'layout-print.png', blob: layout }, { path: 'preview-mockup.png', blob: preview });
  if (col.custom && colorRef) files.push({ path: 'color-reference/' + safeRefName(colorRef.name), blob: colorRef.blob });
  const payload = {
    schema: 'rdk-candle/' + kind + '@1', kind, createdAt: new Date().toISOString(),
    ...extra,
    product: {
      name: CONFIG.product.name, fillVolumeMl: CONFIG.product.fillMl, containerCapacityMl: CONFIG.product.containerMl,
      glassColor: col.custom
        ? { id: 'custom', name: 'Інший колір під замовлення', custom: true, description: state.custom.desc.trim() || null, code: state.custom.code.trim() || null, previewHexApprox: state.custom.hex, referenceFile: colorRef ? 'color-reference/' + safeRefName(colorRef.name) : null, note: CONFIG.customColor.note }
        : { id: col.id, name: col.name, clearGlass: !!col.clear, finish: col.finish },
      scent: state.scentMode === 'scent' && scentById(state.scentId) ? (state.scentId === 'other' ? { mode: 'request', id: 'other', name: 'Інший аромат за запитом', request: state.scentOther.trim(), note: CONFIG.scents.other.note } : { mode: 'scent', id: state.scentId, name: scentById(state.scentId).name, group: scentById(state.scentId).groupName }) : { mode: 'none', name: 'Без аромату' },
      wax: CONFIG.product.wax,
      wick: { id: state.wick, name: wickById(state.wick).name },
      mockupProportions: { diameterMm: V.diameterMm, heightMm: V.heightMm, demoData: !!V.demo }
    },
    printArea: { widthMm: Z.widthMm, heightMm: Z.heightMm, offsetFromBottomMm: Z.offsetFromBottomMm, placement: ZONE().wrap ? 'по колу 360°; x = 0 і x = ширина — шов ззаду, x = ширина/2 — перед' : 'по центру фронтальної частини склянки', wrap: ZONE().wrap, background: state.bg },
    design: { units: 'mm', background: state.bg, origin: 'лівий верхній кут розгортки зони друку', rotation: 'градуси за годинниковою стрілкою навколо центру елемента', layerOrder: 'від нижнього до верхнього', elements },
    files: { originals: assetList.map((a) => a.file), layout: 'layout-print.png', layoutDpi: CONFIG.print.targetDpi, layoutNote: 'Плаский виробничий шар без мокапу, прозорий фон', preview: 'preview-mockup.png', previewNote: 'Орієнтовна візуалізація для погодження' },
    pricing: (() => { const Q = quote(extra.quantity || state.qty); if (!Q) return { status: 'quote_requested' }; if (Q.quoteOnly) return { status: 'quote_requested', reason: 'large_quantity' };
      return { unitPrice: Q.unit, quantity: Q.qty, total: Q.total, currency: CONFIG.pricing.currency, tierFromQty: Q.tier.min, scentSurcharge: Q.extra, approved: !!CONFIG.pricing.approved, note: CONFIG.pricing.approved ? null : CONFIG.pricing.note, customColorPricing: Q.custom ? 'окремий розрахунок' : null }; })(),
    editorState: { v: 2, colorId: state.colorId, bg: state.bg, els: state.els, assets: assetList, scentMode: state.scentMode, scentId: state.scentId, scentOther: state.scentOther, wick: state.wick, qty: state.qty, custom: state.custom }
  };
  return { payload, files, previewBlob: preview };
}
async function zipPackage(pkg, jsonName){
  if (!window.JSZip) throw new Error('Модуль архівації не завантажився. Перевірте з’єднання й оновіть сторінку.');
  const zip = new JSZip();
  zip.file(jsonName, JSON.stringify(pkg.payload, null, 2));
  pkg.files.forEach((f) => zip.file(f.path, f.blob));
  return zip.generateAsync({ type: 'blob', compression: 'DEFLATE', compressionOptions: { level: 6 } });
}
const downloadsCap = (window.claude && typeof window.claude.use === 'function') ? window.claude.use('downloads').catch(() => null) : Promise.resolve(null);
async function offerFile(filename, blob){
  const d = await downloadsCap;
  if (d){
    try { await d.save({ filename, data: blob }); return 'saved'; }
    catch (e){ if (e && e.code === 'declined') return 'declined'; if (e && e.code === 'rate_limited') throw new Error('Вікно збереження вже відкрите. Заверши його й спробуй ще раз.'); }
  }
  const url = URL.createObjectURL(blob); const a = document.createElement('a');
  a.href = url; a.download = filename; document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 60000);
  return 'started';
}
const stamp = () => new Date().toISOString().slice(0, 16).replace(/[-:T]/g, '');
async function saveProject(btn){
  if (!state.els.length){ toast('Спочатку додай елементи дизайну'); return; }
  const label = btn.textContent; btn.disabled = true; btn.textContent = 'Готуємо файл…';
  try {
    const pkg = await buildPackage('project');
    const blob = await zipPackage(pkg, 'project.json');
    const r = await offerFile(`svichka-proekt-${stamp()}.zip`, blob);
    toast(r === 'declined' ? 'Збереження скасовано' : 'Файл проєкту підготовлено. Відкрий його кнопкою «Відкрити проєкт».');
  } catch (e){ toast(e.message || 'Не вдалося зберегти проєкт'); }
  finally { btn.disabled = false; btn.textContent = label; }
}
$('#btnSaveProject').addEventListener('click', (e) => saveProject(e.currentTarget));
$('#projectInput').addEventListener('change', async (e) => {
  const file = e.target.files[0]; e.target.value = ''; if (!file) return;
  setBusy(true);
  try {
    let data, zip = null;
    if (/\.json$/i.test(file.name)) data = JSON.parse(await file.text());
    else {
      if (!window.JSZip) throw new Error('Модуль архівації не завантажився. Оновіть сторінку.');
      zip = await JSZip.loadAsync(file);
      const j = zip.file('project.json') || zip.file('zayavka.json');
      if (!j) throw new Error('У файлі немає project.json. Обери файл, збережений цим конструктором.');
      data = JSON.parse(await j.async('string'));
    }
    const es = data.editorState; if (!es || !Array.isArray(es.els)) throw new Error('Файл не схожий на проєкт свічки.');
    let missing = 0;
    for (const a of es.assets || []){
      const f = zip && zip.file(a.file);
      if (!f){ missing++; continue; }
      const blob = new Blob([await f.async('arraybuffer')], { type: a.mime });
      try { await registerAsset(a.id, blob, a.name, a.mime); } catch (err){ missing++; }
    }
    const dropped = applyDesign(es); refreshAll(); commit(); $('#qty').value = state.qty; scheduleSave(); goStep('design');
    toast(dropped || missing ? `Проєкт відкрито. Не вдалося відновити зображень: ${Math.max(dropped, missing)}.` : 'Проєкт відкрито');
  } catch (err){ toast(err.message && err.message.length < 140 ? err.message : 'Не вдалося відкрити файл проєкту'); }
  finally { setBusy(false); }
});

/* ===================== Валідація форм ===================== */
function normPhone(v){
  const d = String(v).replace(/\D/g, '');
  if (d.length === 10 && d[0] === '0') return '+38' + d;
  if (d.length === 12 && d.startsWith('380')) return '+' + d;
  if (String(v).trim().startsWith('+') && d.length >= 10 && d.length <= 15) return '+' + d;
  return null;
}
const emailOk = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);
function fieldErr(id, msg){
  const inp = $('#' + id), e = $('#e-' + id);
  if (inp) inp.setAttribute('aria-invalid', msg ? 'true' : 'false');
  if (e) e.textContent = msg || '';
  return !msg;
}
function validate(prefix){
  const v = (id) => ($('#' + prefix + '-' + id)?.value || '').trim();
  const res = [];
  res.push(fieldErr(prefix + '-name', v('name').length < 2 ? 'Вкажи ім’я.' : ''));
  res.push(fieldErr(prefix + '-phone', !normPhone(v('phone')) ? 'Вкажи телефон у форматі +380 XX XXX XX XX.' : ''));
  res.push(fieldErr(prefix + '-email', v('email') && !emailOk(v('email')) ? 'Перевір email — схоже, у ньому помилка.' : ''));
  const q = Number(v('qty')), min = CONFIG.order.minQty || 1;
  res.push(fieldErr(prefix + '-qty', !Number.isInteger(q) || q < min ? `Вкажи кількість — ціле число від ${min}.` : ''));
  res.push(fieldErr(prefix + '-consent', !$('#' + prefix + '-consent').checked ? 'Потрібна згода на обробку даних, щоб ми могли зв’язатися з тобою.' : ''));
  const firstBad = $$(`[id^="${prefix}-"][aria-invalid="true"]`)[0];
  if (firstBad) firstBad.focus();
  return res.every(Boolean);
}
$$('#orderForm input, #batchForm input').forEach((i) => i.addEventListener('input', () => { if (i.getAttribute('aria-invalid') === 'true') fieldErr(i.id, ''); }));
['o-name', 'o-phone', 'o-email', 'o-comment', 'b-name', 'b-phone', 'b-email', 'b-company'].forEach((id) => {
  try { const v = sessionStorage.getItem('rdk-f-' + id); if (v) $('#' + id).value = v; } catch (e){}
  $('#' + id).addEventListener('input', (e) => { try { sessionStorage.setItem('rdk-f-' + id, e.target.value); } catch (er){} });
});

/* ===================== Відправлення =====================
   Підключення: вкажіть CONFIG.order.endpoint — адресу серверної функції.
   Запит: POST multipart/form-data
     payload — JSON заявки (параметри, структура дизайну, editorState)
     files   — оригінали зображень, layout-print.png, preview-mockup.png (поле "files", ім’я = шлях у пакеті)
   Відповідь: JSON { ok: true, id: "номер заявки" }. Будь-яка інша відповідь показується як помилка. */
async function submitToEndpoint(payload, files){
  const fd = new FormData();
  fd.append('payload', JSON.stringify(payload));
  (files || []).forEach((f) => fd.append('files', f.blob, f.path));
  const ctrl = new AbortController(); const to = setTimeout(() => ctrl.abort(), 60000);
  try {
    const r = await fetch(CONFIG.order.endpoint, { method: 'POST', body: fd, signal: ctrl.signal });
    let data = null; try { data = await r.json(); } catch (e){}
    if (!r.ok || !data || data.ok !== true) throw new Error(data && data.error ? data.error : `Сервер відповів кодом ${r.status}`);
    return data;
  } finally { clearTimeout(to); }
}
function contactsHtml(){
  const C = CONFIG.contacts, parts = [];
  if (C.phone) parts.push(`Телефон: <b style="user-select:all">${esc(C.phone)}</b>`);
  if (C.email) parts.push(`Email: <b style="user-select:all">${esc(C.email)}</b>`);
  if (C.instagram) parts.push(`Instagram: <b style="user-select:all">${esc(C.instagram)}</b>`);
  return parts.length ? `<p>${parts.join(' · ')}</p>` : '';
}
async function copyText(text, btn){
  try { await navigator.clipboard.writeText(text); toast('Текст скопійовано'); }
  catch (e){ const ta = document.createElement('textarea'); ta.value = text; ta.setAttribute('readonly', ''); ta.style.cssText = 'position:fixed;opacity:0'; document.body.appendChild(ta); ta.select(); try { document.execCommand('copy'); toast('Текст скопійовано'); } catch (er){ toast('Не вдалося скопіювати. Виділи текст вручну.'); } ta.remove(); }
}
function orderText(p){
  const c = p.customer || {}, lines = [
    p.kind === 'order' ? 'Заявка на виготовлення свічки' : p.kind === 'collection' ? `Замовлення готової колекції «${p.collection.title}»` : 'Запит на партію свічок',
    p.collection ? `Склянка: ${p.collection.glass.name.toLowerCase()}; малюнок по всьому колу (${p.collection.design.elements.length} ел.)` : null,
    `Ім’я: ${c.name}`, `Телефон: ${c.phone}`, c.email ? `Email: ${c.email}` : null, c.company ? `Компанія/подія: ${c.company}` : null,
    `Кількість: ${p.quantity} шт`,
    p.product ? `Товар: ${p.product.name} (скляна тара ${p.product.containerCapacityMl} мл)` : null,
    p.product && p.product.glassColor ? `Колір склянки: ${p.product.glassColor.name}${p.product.glassColor.custom ? ` — ${[p.product.glassColor.description, p.product.glassColor.code].filter(Boolean).join(', ') || 'опис не вказано'}` : ''}` : null,
    p.product && p.product.scent ? `Аромат: ${p.product.scent.name}${p.product.scent.request ? ` — ${p.product.scent.request}` : ''}` : null,
    p.product && p.product.wick ? `Ґніт: ${p.product.wick.name}; віск: ${p.product.wax.toLowerCase()}` : null,
    p.design ? `Елементи дизайну: ${p.design.elements.map((e) => e.type === 'text' ? `напис «${e.text.replace(/\n/g, ' ')}» (${e.font.family}, ${e.color})` : e.type === 'image' ? `зображення ${e.originalName}` : `графіка «${e.name}»`).join('; ')}` : null,
    p.pricing && p.pricing.total ? `Вартість: ${money(p.pricing.unitPrice)} × ${p.pricing.quantity} = ${money(p.pricing.total)}${p.pricing.approved ? '' : ' (орієнтовно)'}` : null,
    p.comment ? `Коментар: ${p.comment}` : null
  ];
  return lines.filter(Boolean).join('\n');
}

/* ===================== Замовлення ===================== */
let lastOrderPkg = null;
async function openOrder(){
  const bad = reviewChecks().find((c) => c[0] === 'bad');
  if (bad){ toast(bad[1]); goStep(!state.els.length ? 'design' : state.scentMode === 'scent' && (!state.scentId || (state.scentId === 'other' && !state.scentOther.trim())) ? 'scent' : 'color'); return; }
  const sec = $('#zamovlennia'); sec.hidden = false;
  const q = $('#o-qty'); q.value = Math.max(state.qty, CONFIG.order.minQty || 1);
  $('#h-o-qty').textContent = CONFIG.order.minQty ? `Мінімум — ${CONFIG.order.minQty} шт.` : 'Для партії вкажи потрібну кількість.';
  $('#orderResult').innerHTML = ''; lastOrderPkg = null;
  renderOrderSummary();
  sec.scrollIntoView({ block: 'start' });
  setTimeout(() => $('#o-name').focus({ preventScroll: true }), 400);
  const pv = $('#orderPreview'); pv.innerHTML = '<span class="spinner" aria-hidden="true"></span>';
  try { const b = await renderMockupBlob(); const u = await blobToDataUrl(b); pv.innerHTML = `<img src="${u}" alt="Прев’ю вашої свічки, колір ${esc(colorById(state.colorId).name)}">`; }
  catch (e){ pv.innerHTML = '<p class="hint" style="padding:16px">Не вдалося побудувати прев’ю.</p>'; }
}
function renderOrderSummary(){
  $('#orderSummary').innerHTML = summaryRows().map(([a, b]) => `<li><span>${a}</span><span>${b}</span></li>`).join('') + `<li><span class="hint">Фінальний макет погодимо перед виготовленням.</span><span></span></li>`;
}
$('#o-qty').addEventListener('input', (e) => { const n = parseInt(e.target.value, 10); if (Number.isInteger(n) && n > 0){ state.qty = n; $('#qty').value = n; renderOrderSummary(); renderReview(); scheduleSave(); } });
$('#btnOrder').addEventListener('click', openOrder);
$('#orderForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  if (!validate('o')) return;
  const bad = reviewChecks().find((c) => c[0] === 'bad'); if (bad){ toast(bad[1]); return; }
  const btn = $('#btnSubmitOrder'), res = $('#orderResult');
  btn.disabled = true; btn.innerHTML = '<span class="spinner" aria-hidden="true"></span> Готуємо файли заявки…';
  res.innerHTML = '';
  try {
    const extra = {
      customer: { name: $('#o-name').value.trim(), phone: normPhone($('#o-phone').value), email: $('#o-email').value.trim() || null },
      quantity: parseInt($('#o-qty').value, 10), comment: $('#o-comment').value.trim() || null,
      consent: { personalData: true, at: new Date().toISOString() }
    };
    const pkg = await buildPackage('order', extra); lastOrderPkg = pkg;
    if (CONFIG.order.endpoint){
      btn.innerHTML = '<span class="spinner" aria-hidden="true"></span> Надсилаємо заявку…';
      const r = await submitToEndpoint(pkg.payload, pkg.files);
      res.innerHTML = `<div class="result ok"><h3>Заявку надіслано${r.id ? ` · № ${esc(r.id)}` : ''}</h3><p>Ми підготуємо фінальний макет і розрахунок та зв’яжемося з тобою за номером ${esc(extra.customer.phone)}.</p></div>`;
    } else {
      res.innerHTML = `<div class="result info"><h3>Заявку ще не надіслано</h3>
        <p>Онлайн-відправлення заявок на сайті поки не підключене. Твій дизайн і дані збережені на цій сторінці: можна зберегти пакет заявки — у ньому параметри, структура дизайну, оригінали файлів і прев’ю — та передати нам.</p>
        ${contactsHtml()}
        <div class="row-btns"><button type="button" class="btn btn-primary btn-sm" data-pkg="save">Зберегти пакет заявки</button><button type="button" class="btn btn-ghost btn-sm" data-pkg="copy">Скопіювати текст заявки</button></div></div>`;
    }
  } catch (err){
    res.innerHTML = `<div class="result bad"><h3>Не вдалося надіслати заявку</h3><p>${esc(err.name === 'AbortError' ? 'Сервер не відповів вчасно.' : err.message || 'Невідома помилка')} Перевір з’єднання й спробуй ще раз або збережи пакет заявки.</p><div class="row-btns"><button type="submit" class="btn btn-primary btn-sm">Спробувати ще раз</button>${lastOrderPkg ? '<button type="button" class="btn btn-ghost btn-sm" data-pkg="save">Зберегти пакет заявки</button>' : ''}</div></div>`;
  } finally { btn.disabled = false; btn.textContent = 'Надіслати заявку'; }
});
$('#orderResult').addEventListener('click', async (e) => {
  const b = e.target.closest('[data-pkg]'); if (!b || !lastOrderPkg) return;
  if (b.dataset.pkg === 'copy') return copyText(orderText(lastOrderPkg.payload));
  const label = b.textContent; b.disabled = true; b.textContent = 'Готуємо архів…';
  try { const blob = await zipPackage(lastOrderPkg, 'zayavka.json'); const r = await offerFile(`zayavka-svichka-${stamp()}.zip`, blob); toast(r === 'declined' ? 'Збереження скасовано' : 'Пакет заявки підготовлено'); }
  catch (err){ toast(err.message || 'Не вдалося створити архів'); }
  finally { b.disabled = false; b.textContent = label; }
});

/* ===================== Партія ===================== */
const dlg = $('#batchDlg');
let lastBatch = null, batchCollection = null;
/* Один діалог для двох сценаріїв: запит на партію або замовлення готової колекції. */
function openBatchDialog(coll){
  batchCollection = coll || null;
  $('#batchResult').innerHTML = '';
  $('#h-batch').textContent = coll ? `Замовити «${coll.title}»` : 'Замовити партію';
  $('#h-batch').previousElementSibling.textContent = coll ? 'Готова колекція' : 'Для бізнесу та подій';
  $('#b-comment').placeholder = coll ? 'Бажаний аромат і ґніт, інший колір склянки чи малюнка, терміни' : 'Що потрібно нанести, для якої події, бажані терміни';
  if (coll && !$('#b-qty').value) $('#b-qty').value = 1;
  $('#b-attach').closest('label').hidden = !!coll || !state.els.length;
  if (dlg.showModal) dlg.showModal(); else dlg.setAttribute('open', '');
  setTimeout(() => $('#b-name').focus(), 50);
}
$('#btnBatch').addEventListener('click', () => openBatchDialog(null));
$('#batchClose').addEventListener('click', () => dlg.close ? dlg.close() : dlg.removeAttribute('open'));
dlg.addEventListener('click', (e) => { if (e.target === dlg) dlg.close(); });
$('#batchForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  if (!validate('b')) return;
  const btn = $('#btnSubmitBatch'), res = $('#batchResult'); btn.disabled = true; btn.textContent = 'Готуємо запит…';
  try {
    const extra = {
      customer: { name: $('#b-name').value.trim(), phone: normPhone($('#b-phone').value), email: $('#b-email').value.trim() || null, company: $('#b-company').value.trim() || null },
      quantity: parseInt($('#b-qty').value, 10), comment: $('#b-comment').value.trim() || null,
      consent: { personalData: true, at: new Date().toISOString() }
    };
    let payload = Object.assign({ schema: 'rdk-candle/batch@1', kind: 'batch', createdAt: new Date().toISOString() }, extra), files = [];
    if (batchCollection){
      const c = batchCollection, t = CONFIG.pricing.enabled && CONFIG.pricing.tiers.length && !(CONFIG.pricing.quoteFromQty && extra.quantity >= CONFIG.pricing.quoteFromQty) ? tierFor(extra.quantity) : null;
      payload = Object.assign({ schema: 'rdk-candle/collection@1', kind: 'collection', createdAt: new Date().toISOString() }, extra, {
        collection: (() => { const t = collTpl(c), col = colorById(t.colorId), Z = ZONE();
          return { id: c.id, title: c.title, template: c.tpl, glass: { id: col.id, name: col.name },
            design: { units: 'mm', printArea: { widthMm: Z.widthMm, heightMm: Z.heightMm, wrap: Z.wrap }, elements: templateEls(t).map((el) => ({ type: el.type, graphicId: el.graphicId, name: GRAPHICS[el.graphicId] ? GRAPHICS[el.graphicId].name : undefined, xMm: +el.x.toFixed(2), yMm: +el.y.toFixed(2), widthMm: +el.w.toFixed(2), rotationDeg: el.rot || 0, mirrored: el.flip || undefined, color: el.tint, color2: el.tint2 || (GRAPHICS[el.graphicId] && GRAPHICS[el.graphicId].tint2) })) } }; })(),
        product: { name: CONFIG.product.name, fillVolumeMl: CONFIG.product.fillMl, containerCapacityMl: CONFIG.product.containerMl, wax: CONFIG.product.wax },
        pricing: t ? { unitPrice: t.price, quantity: extra.quantity, total: t.price * extra.quantity, currency: CONFIG.pricing.currency, approved: !!CONFIG.pricing.approved } : { status: 'quote_requested' }
      });
    } else if ($('#b-attach').checked && state.els.length){ const pkg = await buildPackage('batch', extra); payload = pkg.payload; files = pkg.files; }
    lastBatch = { payload };
    if (CONFIG.order.endpoint){
      btn.textContent = 'Надсилаємо…';
      await submitToEndpoint(payload, files);
      res.innerHTML = `<div class="result ok"><h3>Запит надіслано</h3><p>${batchCollection ? 'Ми зв’яжемося з тобою, щоб уточнити деталі й погодити макет.' : 'Ми зв’яжемося з тобою, щоб обговорити партію.'}</p></div>`;
    } else {
      res.innerHTML = `<div class="result info"><h3>Запит ще не надіслано</h3><p>Онлайн-відправлення поки не підключене. Скопіюй текст запиту й передай нам зручним способом.</p>${contactsHtml()}<div class="row-btns"><button type="button" class="btn btn-ghost btn-sm" id="copyBatch">Скопіювати текст запиту</button></div></div>`;
    }
  } catch (err){ res.innerHTML = `<div class="result bad"><h3>Не вдалося надіслати</h3><p>${esc(err.message || 'Помилка з’єднання')} Спробуй ще раз.</p></div>`; }
  finally { btn.disabled = false; btn.textContent = 'Надіслати запит'; }
});
$('#batchResult').addEventListener('click', (e) => { if (e.target.id === 'copyBatch' && lastBatch) copyText(orderText(lastBatch.payload)); });

/* ===================== Мобільна панель ціни ===================== */
const NEXT = { color: ['scent', 'Далі: аромат'], scent: ['design', 'Далі: дизайн'], design: ['review', 'Далі: кількість'], review: [null, 'Замовити'] };
let studioInView = false;
function updateMbar(){
  const bar = $('#mbar'); if (!bar) return;
  const Q = quote();
  $('#mbarPrice').textContent = !Q ? 'Отримати розрахунок' : Q.quoteOnly ? 'Індивідуальний розрахунок' : money(Q.total);
  $('#mbarQty').textContent = `${state.qty} шт · ${Q && !Q.quoteOnly ? money(Q.unit) + ' за шт' : 'свічка 200 мл'}`;
  $('#mbarNext').textContent = NEXT[state.step][1];
  const show = studioInView && window.innerWidth <= 960;
  bar.classList.toggle('show', show); bar.setAttribute('aria-hidden', String(!show)); $('#mbarNext').tabIndex = show ? 0 : -1;
  document.body.classList.toggle('mbar-on', show);
}
$('#mbarNext').addEventListener('click', () => {
  const n = NEXT[state.step][0];
  if (n){ goStep(n); $('.panel').scrollIntoView({ block: 'start' }); } else openOrder();
});

/* ===================== Toast ===================== */
let toastTimer = null;
function toast(text, actLabel, act){
  const t = $('#toast'), b = $('#toastAct'); $('#toastText').textContent = text;
  if (actLabel){ b.hidden = false; b.textContent = actLabel; b.onclick = () => { act(); t.classList.remove('show'); }; } else { b.hidden = true; b.onclick = null; }
  t.classList.add('show'); clearTimeout(toastTimer); toastTimer = setTimeout(() => t.classList.remove('show'), actLabel ? 6000 : 3500);
}

/* ===================== Ініціалізація ===================== */
function renderPricesSection(){
  const P = CONFIG.pricing, sec = $('#tsiny');
  if (!P.enabled || !P.tiers.length){ sec.hidden = true; $$('a[href="#tsiny"]').forEach((a) => { a.hidden = true; }); return; }
  $('#pricesSection').innerHTML = P.tiers.map((t, i) => `<div class="price-card"><span class="eyebrow">${tierRange(i)}</span><b>${money(t.price)}</b><small>за свічку</small><button type="button" class="btn btn-ghost btn-sm" data-tier-qty="${t.min}">Обрати ${t.min} шт</button></div>`).join('')
    + (P.quoteFromQty ? `<div class="price-card price-quote"><span class="eyebrow">від ${P.quoteFromQty} шт</span><b>Індивідуально</b><small>розрахуємо під вашу партію</small><button type="button" class="btn btn-ghost btn-sm" data-batch>Обговорити партію</button></div>` : '');
  const notes = [P.approved ? '' : P.note, P.scentSurcharge ? `Аромат: +${money(P.scentSurcharge)} за шт.` : 'Аромат — без доплати.', P.customColorNote, ''];
  $('#pricesNote').textContent = notes.filter(Boolean).join(' ');
}
function staticTexts(){
  renderPricesSection();
  if (CONFIG.pricing.enabled && CONFIG.pricing.tiers.length) $('#faqPrice').textContent = 'Ціна за свічку залежить від кількості: ' + CONFIG.pricing.tiers.map((t, i) => `${tierRange(i)} — ${money(t.price)}`).join(', ') + (CONFIG.pricing.quoteFromQty ? `, від ${CONFIG.pricing.quoteFromQty} шт — індивідуальний розрахунок` : '') + '. Конструктор одразу показує суму. ' + (CONFIG.pricing.approved ? '' : 'Ціни орієнтовні: остаточну вартість підтвердимо після погодження макета. ') + CONFIG.pricing.customColorNote;
  const V = CONFIG.vessel, Z = ZONE(), P = CONFIG.print;
  $('#demoBar').hidden = !CONFIG.showDemoNotice;
  $('#brandName').textContent = CONFIG.brand.name;
  const PR = CONFIG.product;
  const TT = CONFIG.pricing.tiers;
  const nScents = CONFIG.scents.groups.reduce((n, g) => n + g.items.length, 0);
  $('#heroFacts').innerHTML = `<li><b>${PR.fillMl} мл</b>соєвий віск, скляна тара ${PR.containerMl} мл</li><li><b>3 кольори</b>склянки та інші відтінки під замовлення</li><li><b>${nScents} ароматів</b>або свічка без аромату</li>` + (CONFIG.pricing.enabled && TT.length ? `<li><b>від ${money(TT[TT.length - 1].price)}</b>за свічку в партії від ${TT[TT.length - 1].min} шт</li>` : '');
  $('#bizPrice').textContent = CONFIG.pricing.enabled && TT.length ? `Від ${TT[TT.length - 1].min} шт — ${money(TT[TT.length - 1].price)} за свічку${CONFIG.pricing.approved ? '' : ' (орієнтовно)'}${CONFIG.pricing.quoteFromQty ? `, від ${CONFIG.pricing.quoteFromQty} шт — індивідуальний розрахунок` : ''}.` : '';
  $('#howDots').innerHTML = CONFIG.colors.map((c) => `<span class="dot" style="background:${swatchBg(c)}"></span>`).join('') + '<span class="dot" style="background:conic-gradient(#E7B9A6,#E9D9A3,#B9D2B0,#A9C3D9,#C7B3D8,#E7B9A6)"></span>';
  $('#vesselSpec').innerHTML = `<span><b>${esc(PR.name)}</b></span><span>${esc(PR.wax.toLowerCase())}</span><span>скляна тара місткістю <b>${PR.containerMl} мл</b></span><span>друк на склі <b>${Z.wrap ? 'по колу' : 'спереду'}</b></span>`;
  $('#uploadHint').textContent = `PNG або JPEG до ${P.maxFileMb} МБ. Чим більша роздільність, тим чіткіший друк.` + (Z.wrap ? ' Для друку по всьому колу підійде широке горизонтальне зображення.' : '') + ' Можна перетягнути файл на прев’ю.';
  $('#footBrand').textContent = `© ${new Date().getFullYear()} ${CONFIG.brand.name} ${CONFIG.brand.suffix} · свічки з дизайном на склі`;
  const C = CONFIG.contacts; $('#footContacts').textContent = [C.phone, C.email, C.instagram].filter(Boolean).join(' · ');
  if (CONFIG.privacyUrl) $$('.consent span').forEach((s) => { if (/персональних/.test(s.textContent)) s.insertAdjacentHTML('beforeend', ` <a href="${esc(CONFIG.privacyUrl)}" target="_blank" rel="noopener">Політика конфіденційності</a>`); });
}
function fontsReady(){
  if (!document.fonts || !document.fonts.load) return Promise.resolve();
  const loads = FONTS.map((f) => document.fonts.load(`${f.weight} 40px ${f.css.split(',')[0]}`, 'ЇїҐґЄєІі Аа Zz 0123'));
  loads.push(document.fonts.load('700 40px "Manrope"', 'ДЛЯ'), document.fonts.load('500 40px "Lora"', 'Свічка'));
  return Promise.race([Promise.allSettled(loads), new Promise((r) => setTimeout(r, 3500))]);
}

/* ===================== Магазин готових свічок =====================
   PRODUCTS — каталог. photo — ключ фото (SITE_PHOTOS / img[data-photo] / COLLECTION_PHOTOS);
   tpl — квітковий дизайн, який малюється на мокапі склянки (той самий, що в конструкторі).
   Ціна за свічку береться з CONFIG.pricing і залежить від загальної кількості в кошику (CONFIG.shop.tierByCartQty). */
let SHOP_CATS = [{ id: 'floral', name: 'Квіткові' }, { id: 'gift', name: 'Подарунки' }, { id: 'love', name: 'Кохання' }];
const catNames = (ids) => SHOP_CATS.filter((c) => (ids || []).includes(c.id)).map((c) => c.name).join(' · ');
let PRODUCTS = [
  { id: 'gold', photo: 'gold', cats: ['floral'], title: 'Золоті трави', desc: 'Тонкі золоті гілки трав по всьому колу склянки й маленька монограма.', glass: 'clear', alt: 'Свічка із золотими травами по колу склянки поруч із темною подарунковою коробкою' },
  { id: 'kvitny', photo: 'kvitny', cats: ['floral', 'gift'], title: 'Квітни', desc: 'Рум’яні півонії та бордові квіти по колу й напис «Квітни».', glass: 'clear', alt: 'Свічка з півоніями по всьому колу й написом «Квітни»' },
  { id: 'mama', photo: 'mama', cats: ['gift'], title: 'Мамо, дякую за тепло', desc: 'Польові квіти з боків і напис від руки — подарунок для мами.', glass: 'clear', alt: 'Свічка з написом «Мамо, дякую за тепло» і польовими квітами' },
  { id: 'bestyear', photo: 'bestyear', cats: ['gift'], title: 'Твій найкращий рік', desc: 'Квіткова рамка й привітання з днем народження.', glass: 'clear', alt: 'Свічка з написом «Твій найкращий рік. З днем народження» в квітковій рамці' },
  { id: 'special', photo: 'gift', cats: ['gift', 'love'], title: 'Ти — особлива', desc: 'Кілька теплих слів і маленьке серце.', glass: 'clear', alt: 'Свічка з написом «Ти — особлива» і сердечком поруч із подарунковою коробкою' },
  { id: 'f-wild', tpl: 'f-wild', cats: ['floral'], title: 'Польові квіти', desc: 'Ромашки, бордові суцвіття й гіпсофіла з обох боків склянки.' },
  { id: 'f-peony', tpl: 'f-peony', cats: ['floral', 'love'], title: 'Півонії й троянди', desc: 'Рум’яні півонії та бордові троянди по всьому колу.' },
  { id: 'f-frame', tpl: 'f-frame', cats: ['floral', 'love'], title: 'Квіткова рамка', desc: 'Тонкі гілки з бордовими й рум’яними квітами.' },
  { id: 'f-wreath', tpl: 'f-wreath', cats: ['floral'], title: 'Квітковий вінок', desc: 'Вінок із зелені, білих квітів і бутонів.' },
  { id: 'f-meadow', tpl: 'f-meadow', cats: ['floral'], title: 'Луговий бордюр', desc: 'Ромашки й гіпсофіла по низу склянки.' },
  { id: 'f-bouquet', tpl: 'f-bouquet', cats: ['floral'], title: 'Букет по колу', desc: 'Польові букети навколо білої склянки.' }
];
const productById = (id) => PRODUCTS.find((x) => x.id === id);
const productTpl = (pr) => pr.tpl ? TEMPLATES.find((t) => t.id === pr.tpl) : null;
const productGlass = (pr) => colorById(pr.tpl ? productTpl(pr).colorId : pr.glass) || colorById('clear');
const shopProducts = () => PRODUCTS.filter((x) => !x.hidden);
function productSrc(pr){
  if (pr.tpl) return null;
  if (pr.image) return pr.image;
  return (window.SITE_PHOTOS || {})[pr.photo] || (window.COLLECTION_PHOTOS || {})[pr.photo] || document.querySelector(`img[data-photo="${pr.photo}"]`)?.src || '';
}
const tplEls = {}, tplFlat = {};   // кеш елементів і розгортки квіткових дизайнів
function paintProduct(cv, pr, phi = 0){
  const t = productTpl(pr); if (!t) return;
  if (!tplEls[pr.id]) tplEls[pr.id] = templateEls(t);
  const key = pr.id + '@' + cv.width; if (!tplFlat[key]) tplFlat[key] = {};
  const ctx = cv.getContext('2d'); ctx.clearRect(0, 0, cv.width, cv.height);
  paintCandle(ctx, cv.width, cv.height, colorById(t.colorId), tplEls[pr.id], { geom: { fitW: 0.9, fitH: 0.9, headMm: 6, phi }, flatCache: tplFlat[key] });
}
/* Картки малюються поступово (кілька за кадр) і лише ті, що поруч з екраном, — сторінка не «підвисає». */
const paintQueue = new Set(); let paintRaf = 0;
const paintIO = 'IntersectionObserver' in window ? new IntersectionObserver((en) => en.forEach((x) => { x.target._vis = x.isIntersecting; if (x.isIntersecting && x.target._dirty) queuePaint(x.target); }), { rootMargin: '400px' }) : null;
function queuePaint(cv){ paintQueue.add(cv); if (!paintRaf) paintRaf = requestAnimationFrame(drainPaint); }
function drainPaint(){
  paintRaf = 0; const t0 = performance.now();
  for (const cv of paintQueue){
    paintQueue.delete(cv); if (!cv.isConnected) continue;
    const pr = productById(cv.dataset.paint); if (pr) paintProduct(cv, pr); cv._dirty = false;
    if (performance.now() - t0 > 24) break;
  }
  if (paintQueue.size) paintRaf = requestAnimationFrame(drainPaint);
}
function productMedia(pr, size = 720, cls = ''){
  return pr.tpl ? `<canvas width="${size}" height="${size}" data-paint="${pr.id}" role="img" aria-label="${esc('Свічка «' + pr.title + '»: ' + pr.desc)}"></canvas>`
    : `<img src="${productSrc(pr)}" width="${size}" height="${size}" alt="${esc(pr.alt || pr.title)}"${cls}>`;
}
const basePrice = () => { const P = CONFIG.pricing; return P.enabled && P.tiers.length ? P.tiers[0].price : null; };
function renderShop(){
  const bp = basePrice(), P = CONFIG.pricing;
  renderFilter($('#shopFilter'), SHOP_CATS, new Set(shopProducts().flatMap((x) => x.cats || [])));
  $('#shopGrid').innerHTML = shopProducts().map((pr) => `<figure class="coll" data-product-card="${pr.id}" data-cats="${(pr.cats || []).join(' ')}">
      <button type="button" class="ph${pr.tpl ? ' mock' : ''}" data-product="${pr.id}" aria-label="Переглянути свічку «${esc(pr.title)}»">${productMedia(pr)}</button>
      <figcaption style="display:grid;gap:6px">
        <span class="tag">${esc(catNames(pr.cats))}</span>
        <h3>${esc(pr.title)}</h3>
        <p class="meta">${esc(pr.desc)} ${esc(productGlass(pr).name)} склянка.</p>
        <p class="price">${bp ? money(bp) : 'Ціна за запитом'}${bp && !P.approved ? ' <span class="hint" style="font-weight:500">орієнтовно</span>' : ''}</p>
        <div class="row-btns"><button type="button" class="btn btn-cta btn-sm" data-product="${pr.id}">Обрати</button></div>
      </figcaption></figure>`).join('');
  paintShop();
  const T = P.tiers;
  $('#shopPriceNote').textContent = P.enabled && T.length ? `Ціна за свічку залежить від загальної кількості в кошику: ${T.map((t, i) => `${tierRange(i)} — ${money(t.price)}`).join(', ')}${P.quoteFromQty ? `, від ${P.quoteFromQty} шт — індивідуальний розрахунок` : ''}.${P.approved ? '' : ' Ціни орієнтовні.'}` : '';
  $('#shopFaqPrice').textContent = $('#shopPriceNote').textContent + ' Аромат і ґніт — без доплати.';
  const sc = allScents(); $('#shopFaqScents').textContent = `У каталозі ${sc.length} ароматів: ${CONFIG.scents.groups.map((g) => g.name.toLowerCase()).join(', ')}. Свічку можна замовити й без аромату.`;
  $('#aromaList').innerHTML = CONFIG.scents.groups.map((g) => `<div><h3>${esc(g.name)}</h3><ul>${g.items.filter((i) => i.available !== false).map((i) => `<li><b>${esc(i.name)}</b>${i.desc ? ' — ' + esc(i.desc.toLowerCase()) : ''}</li>`).join('')}</ul></div>`).join('');
  const PR = CONFIG.product;
  $('#shopFacts').innerHTML = `<li><b>${PR.fillMl} мл</b>соєвий віск, скляна тара ${PR.containerMl} мл</li><li><b>${sc.length} ароматів</b>або свічка без аромату</li><li><b>2 види ґноту</b>бавовняний або дерев’яний</li>` + (bp ? `<li><b>від ${money(T[T.length - 1].price)}</b>за свічку при більшій кількості</li>` : '');
  $$('img[data-coll-photo]').forEach((im) => { if (!im.getAttribute('src')) im.src = (window.COLLECTION_PHOTOS || {})[im.dataset.collPhoto] || ''; });
  applySiteTexts();
}
function paintShop(){
  $$('canvas[data-paint]').forEach((cv) => {
    if (!cv.closest('#shopGrid, #cartBody')) return;
    cv._dirty = true;
    if (paintIO && !cv._observed){ paintIO.observe(cv); cv._observed = true; }
    if (!paintIO || cv._vis || cv.closest('#cartBody')) queuePaint(cv);
  });
}
$('#shopFilter').addEventListener('click', (e) => {
  const b = e.target.closest('[data-cat]'); if (!b) return;
  $$('#shopFilter [data-cat]').forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
  $$('#shopGrid .coll').forEach((f) => { f.hidden = b.dataset.cat !== 'all' && !f.dataset.cats.split(' ').includes(b.dataset.cat); });
});

/* ---------- картка товару ---------- */
const pdDlg = $('#productDlg');
let pdProduct = null, pdRaf = 0;
function openDlg(d){ if (d.showModal) d.showModal(); else d.setAttribute('open', ''); }
function closeDlg(d){ if (d.close) d.close(); else d.removeAttribute('open'); }
$$('dialog [data-close]').forEach((b) => b.addEventListener('click', () => closeDlg(b.closest('dialog'))));
function scentOptions(sel){
  return `<option value="">Без аромату</option>` + CONFIG.scents.groups.map((g) => `<optgroup label="${esc(g.name)}">${g.items.filter((i) => i.available !== false).map((i) => `<option value="${i.id}"${i.id === sel ? ' selected' : ''}>${esc(i.name)}</option>`).join('')}</optgroup>`).join('');
}
function openProduct(id){
  const pr = productById(id); if (!pr) return; pdProduct = pr;
  $('#h-product').textContent = pr.title; $('#pdCat').textContent = catNames(pr.cats);
  $('#pdDesc').textContent = pr.desc;
  $('#pdMeta').textContent = `${CONFIG.product.name} · ${CONFIG.product.wax.toLowerCase()} · ${productGlass(pr).name.toLowerCase()} склянка ${CONFIG.product.containerMl} мл`;
  $('#pdMedia').innerHTML = productMedia(pr, 900);
  $('#pd-scent').innerHTML = scentOptions('');
  $('#pdWick').innerHTML = CONFIG.wicks.map((w) => `<label><input type="radio" name="pd-wick" value="${w.id}"${w.id === CONFIG.defaultWickId ? ' checked' : ''}>${esc(w.name)}</label>`).join('');
  $('#pd-qty').value = 1; renderPdPrice();
  openDlg(pdDlg);
  if (pr.tpl) spinProduct(); else cancelAnimationFrame(pdRaf);
}
function spinProduct(){
  cancelAnimationFrame(pdRaf);
  const cv = $('#pdMedia canvas'); if (!cv) return;
  let phi = 0, last = 0;
  const tick = (t) => {
    if (!pdDlg.open) return;
    pdRaf = requestAnimationFrame(tick);
    if (t - last < 33) return;
    const dt = last ? Math.min(100, t - last) : 0; last = t;
    phi += (reduceMotion ? 0 : CONFIG.preview.degPerSec) * DEG * dt / 1000;
    paintProduct(cv, pdProduct, phi);
  };
  paintProduct(cv, pdProduct, 0); pdRaf = requestAnimationFrame(tick);
}
pdDlg.addEventListener('close', () => cancelAnimationFrame(pdRaf));
const pdQty = () => Math.max(1, Math.min(999, parseInt($('#pd-qty').value, 10) || 1));
function shopQuote(totalQty){
  const P = CONFIG.pricing; if (!P.enabled || !P.tiers.length) return null;
  if (P.quoteFromQty && totalQty >= P.quoteFromQty) return { quoteOnly: true };
  const t = tierFor(totalQty), i = P.tiers.indexOf(t), next = P.tiers[i + 1] || null;
  return { unit: t.price, next };
}
function renderPdPrice(){
  const inCart = cartQty(), q = pdQty(), Q = shopQuote(inCart + q);
  let h = '';
  if (!Q) h = '<b>Ціна за запитом</b>';
  else if (Q.quoteOnly) h = `<span class="hint">Разом із кошиком ${inCart + q} шт</span><b>Індивідуальний розрахунок</b>`;
  else h = `<span class="hint">${q} шт × ${money(Q.unit)}${inCart ? ` (з урахуванням ${inCart} шт у кошику)` : ''}</span><b>${money(Q.unit * q)}</b>${Q.next ? `<span class="hint">Від ${Q.next.min} шт у кошику — ${money(Q.next.price)} за свічку.</span>` : ''}`;
  $('#pdPrice').innerHTML = h + (CONFIG.pricing.approved ? '' : `<span class="hint">${esc(CONFIG.pricing.note)}</span>`);
}
$('#pdForm').addEventListener('click', (e) => { const b = e.target.closest('[data-step]'); if (!b) return; $('#pd-qty').value = Math.max(1, pdQty() + Number(b.dataset.step)); renderPdPrice(); });
$('#pd-qty').addEventListener('input', renderPdPrice);
$('#pdForm').addEventListener('submit', (e) => {
  e.preventDefault();
  const wick = ($('input[name="pd-wick"]:checked') || {}).value || CONFIG.defaultWickId;
  addToCart(pdProduct.id, $('#pd-scent').value || null, wick, pdQty());
  closeDlg(pdDlg);
  toast(`«${pdProduct.title}» у кошику`, 'Відкрити кошик', openCart);
});
document.addEventListener('click', (e) => { const b = e.target.closest('[data-product]'); if (b) openProduct(b.dataset.product); });

/* ---------- кошик (зберігається в цьому браузері) ---------- */
let cart = [];
try { cart = JSON.parse(localStorage.getItem('rdk-cart') || '[]'); } catch (e){ cart = []; }
function pruneCart(){ cart = (Array.isArray(cart) ? cart : []).filter((i) => i && productById(i.id) && !productById(i.id).hidden && i.qty > 0); }
const cartQty = () => cart.reduce((n, i) => n + i.qty, 0);
function saveCart(){ try { localStorage.setItem('rdk-cart', JSON.stringify(cart)); } catch (e){} updateCartBadge(); }
function updateCartBadge(){ const n = cartQty(), c = $('#cartCount'); c.textContent = n; c.hidden = !n; $('#cartBtn').setAttribute('aria-label', `Кошик, товарів: ${n}`); }
function addToCart(id, scent, wick, qty){
  const key = [id, scent || '', wick].join('|'), ex = cart.find((i) => i.key === key);
  if (ex) ex.qty += qty; else cart.push({ key, id, scent, wick, qty });
  saveCart();
}
const scentName = (id) => id ? (scentById(id) || {}).name || id : 'без аромату';
const wickName = (id) => (wickById(id) || {}).name || id;
function cartTotals(){ const n = cartQty(), Q = shopQuote(n); return { n, Q, total: Q && !Q.quoteOnly ? Q.unit * n : null }; }
function renderCart(){
  const body = $('#cartBody');
  if (!cart.length){ body.innerHTML = `<p class="cart-empty">Кошик порожній. <a href="#katalog" data-close-cart>Перейти до каталогу</a></p>`; $('#checkoutForm').hidden = true; return; }
  const { n, Q, total } = cartTotals();
  body.innerHTML = `<ul class="cart-list">${cart.map((i) => { const pr = productById(i.id); return `<li class="cart-item" data-key="${esc(i.key)}">
      <div class="thumb">${productMedia(pr, 160)}</div>
      <div><b>${esc(pr.title)}</b><small>Аромат: ${esc(scentName(i.scent))} · ґніт: ${esc(wickName(i.wick).toLowerCase())}</small>
        <div class="stepper" style="margin-top:8px"><button type="button" class="icon-btn" data-cart-step="-1" aria-label="Менше «${esc(pr.title)}»">−</button><input type="number" min="1" max="999" value="${i.qty}" aria-label="Кількість «${esc(pr.title)}»" data-cart-qty><button type="button" class="icon-btn" data-cart-step="1" aria-label="Більше «${esc(pr.title)}»">+</button></div></div>
      <button type="button" class="icon-btn" data-cart-del aria-label="Видалити «${esc(pr.title)}»">${'<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><path d="M4 7h16M9 7V5h6v2M7 7l1 13h8l1-13"/></svg>'}</button>
    </li>`; }).join('')}</ul>
    <div class="cart-tot">
      <div><span>Свічок</span><span>${n} шт</span></div>
      ${!Q ? '<div><span>Вартість</span><b>Ціна за запитом</b></div>' : Q.quoteOnly ? '<div><span>Вартість</span><b>Індивідуальний розрахунок</b></div>' : `<div><span>Ціна за свічку</span><span>${money(Q.unit)}</span></div><div><span>Разом</span><b class="sum">${money(total)}</b></div>${Q.next ? `<p class="hint">Ще ${Q.next.min - n} шт — і ціна ${money(Q.next.price)} за свічку.</p>` : ''}`}
      ${CONFIG.pricing.approved ? '' : `<p class="hint">${esc(CONFIG.pricing.note)} Доставку й оплату погодимо під час підтвердження.</p>`}
    </div>
    ${$('#checkoutForm').hidden ? '<button type="button" class="btn btn-cta btn-lg" id="btnToCheckout" style="width:100%">Оформити замовлення</button>' : ''}`;
  paintShop();
}
function openCart(){ renderCart(); $('#checkoutResult').innerHTML = ''; openDlg($('#cartDlg')); }
$('#cartBtn').addEventListener('click', openCart);
$('#cartBody').addEventListener('click', (e) => {
  if (e.target.closest('[data-close-cart]')) closeDlg($('#cartDlg'));
  if (e.target.closest('#btnToCheckout')){ $('#checkoutForm').hidden = false; renderCart(); setTimeout(() => $('#c-name').focus(), 30); return; }
  const li = e.target.closest('.cart-item'); if (!li) return;
  const it = cart.find((i) => i.key === li.dataset.key); if (!it) return;
  const st = e.target.closest('[data-cart-step]');
  if (st){ it.qty = Math.max(1, it.qty + Number(st.dataset.cartStep)); saveCart(); renderCart(); }
  if (e.target.closest('[data-cart-del]')){ cart = cart.filter((i) => i !== it); saveCart(); renderCart(); }
});
$('#cartBody').addEventListener('change', (e) => {
  const inp = e.target.closest('[data-cart-qty]'); if (!inp) return;
  const it = cart.find((i) => i.key === inp.closest('.cart-item').dataset.key);
  it.qty = Math.max(1, Math.min(999, parseInt(inp.value, 10) || 1)); saveCart(); renderCart();
});
$$('#checkoutForm input').forEach((i) => i.addEventListener('input', () => { if (i.getAttribute('aria-invalid') === 'true') fieldErr(i.id, ''); }));
function shopText(p){
  return [`Замовлення свічок з магазину`, `Ім’я: ${p.customer.name}`, `Телефон: ${p.customer.phone}`, p.customer.email ? `Email: ${p.customer.email}` : null,
    `Доставка: ${p.delivery.city}${p.delivery.address ? ', ' + p.delivery.address : ''}`,
    ...p.items.map((i, n) => `${n + 1}. ${i.title} — ${i.quantity} шт; аромат: ${i.scent ? i.scent.name : 'без аромату'}; ґніт: ${i.wick.name.toLowerCase()}`),
    p.pricing.status === 'quote_requested' ? `Разом: ${p.quantity} шт — індивідуальний розрахунок` : `Разом: ${p.quantity} шт × ${p.pricing.unitPrice} = ${p.pricing.total} ${p.pricing.currency}${p.pricing.approved ? '' : ' (орієнтовно)'}`,
    p.comment ? `Коментар: ${p.comment}` : null].filter(Boolean).join('\n');
}
let lastShopOrder = null;
$('#checkoutForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const v = (id) => $('#c-' + id).value.trim();
  const ok = [fieldErr('c-name', v('name').length < 2 ? 'Вкажи ім’я.' : ''), fieldErr('c-phone', !normPhone(v('phone')) ? 'Вкажи телефон у форматі +380 XX XXX XX XX.' : ''),
    fieldErr('c-email', v('email') && !emailOk(v('email')) ? 'Перевір email — схоже, у ньому помилка.' : ''), fieldErr('c-city', v('city').length < 2 ? 'Вкажи місто доставки.' : ''),
    fieldErr('c-consent', !$('#c-consent').checked ? 'Потрібна згода на обробку даних, щоб ми могли зв’язатися з тобою.' : '')].every(Boolean);
  if (!ok){ const bad = $('#checkoutForm [aria-invalid="true"]'); if (bad) bad.focus(); return; }
  if (!cart.length) return;
  const { n, Q, total } = cartTotals(), now = new Date().toISOString();
  const payload = { schema: 'rdk-candle/shop-order@1', kind: 'shop', createdAt: now,
    customer: { name: v('name'), phone: normPhone(v('phone')), email: v('email') || null },
    delivery: { city: v('city'), address: v('delivery') || null }, comment: v('comment') || null, consent: { personalData: true, at: now },
    quantity: n,
    items: cart.map((i) => { const pr = productById(i.id), w = wickById(i.wick), sc = i.scent ? scentById(i.scent) : null;
      return { productId: pr.id, title: pr.title, quantity: i.qty, glass: { id: productGlass(pr).id, name: productGlass(pr).name }, scent: sc ? { id: sc.id, name: sc.name } : null, wick: { id: w.id, name: w.name }, design: pr.tpl ? { template: pr.tpl } : { photo: pr.photo } }; }),
    product: { name: CONFIG.product.name, fillVolumeMl: CONFIG.product.fillMl, containerCapacityMl: CONFIG.product.containerMl, wax: CONFIG.product.wax },
    pricing: !Q || Q.quoteOnly ? { status: 'quote_requested', quantity: n } : { unitPrice: Q.unit, quantity: n, total, currency: CONFIG.pricing.currency, approved: !!CONFIG.pricing.approved, note: CONFIG.pricing.approved ? null : CONFIG.pricing.note } };
  lastShopOrder = payload;
  const res = $('#checkoutResult'), btn = $('#btnCheckout');
  if (CONFIG.order.endpoint){
    btn.disabled = true; btn.textContent = 'Надсилаємо…';
    try {
      const data = await submitToEndpoint(payload, []);
      cart = []; saveCart(); renderCart(); $('#checkoutForm').hidden = true;
      $('#cartBody').innerHTML = `<div class="result ok"><h3>Замовлення надіслано</h3><p>Номер: <b>${esc(data.id || '—')}</b>. Ми зв’яжемося з вами, щоб підтвердити замовлення, доставку й оплату.</p></div>`;
    } catch (err){
      res.innerHTML = `<div class="result bad"><h3>Не вдалося надіслати замовлення</h3><p>${esc(err.message || 'Помилка мережі')}. Спробуйте ще раз або скопіюйте текст замовлення й передайте нам.</p><button type="button" class="btn btn-ghost btn-sm" data-copy-shop>Скопіювати текст замовлення</button></div>`;
    } finally { btn.disabled = false; btn.textContent = 'Надіслати замовлення'; }
  } else {
    res.innerHTML = `<div class="result info"><h3>Замовлення ще не надіслано</h3><p>Онлайн-відправлення на сайті поки не підключене. Скопіюйте текст замовлення й передайте нам зручним способом — кошик збережеться в цьому браузері.</p>${contactsHtml()}<div class="row-btns"><button type="button" class="btn btn-primary btn-sm" data-copy-shop>Скопіювати текст замовлення</button></div></div>`;
  }
});
$('#checkoutResult').addEventListener('click', async (e) => {
  if (!e.target.closest('[data-copy-shop]') || !lastShopOrder) return;
  try { await navigator.clipboard.writeText(shopText(lastShopOrder)); toast('Текст замовлення скопійовано'); }
  catch (err){ toast('Не вдалося скопіювати — виділіть текст вручну'); }
});

/* ===================== Два розділи: магазин (головна) і B2B кастомізація =====================
   Розділ визначається за адресою: #b2b або якір усередині B2B (#konstruktor, #tsiny…) відкриває B2B, решта — магазин. */
let b2bShown = false, pendingDraftToast = null;
function showView(v){
  document.body.dataset.mode = v;
  $$('[data-page]').forEach((x) => { x.hidden = x.dataset.page !== v; });
  document.title = v === 'b2b' ? 'B2B кастомізація — RDK Candle' : 'RDK Candle — свічки з малюнком на склі';
  if (v === 'b2b'){
    if (!b2bShown){ b2bShown = true; if (pendingDraftToast){ const t = pendingDraftToast; pendingDraftToast = null; setTimeout(t, 400); } }
    requestAnimationFrame(() => { repaintAll(); updateMbar(); });
  }
}
function route(){
  const h = decodeURIComponent(location.hash.slice(1));
  const target = h ? document.getElementById(h) : null;
  const view = h === 'b2b' ? 'b2b' : target && target.closest('[data-page]') ? target.closest('[data-page]').dataset.page : 'shop';
  if (document.body.dataset.mode !== view) showView(view);
  if (target && h !== 'b2b' && h !== 'top') requestAnimationFrame(() => target.scrollIntoView({ block: 'start' }));
  else window.scrollTo(0, 0);
}
window.addEventListener('hashchange', route);
document.addEventListener('click', (e) => { const a = e.target.closest('a[href^="#"]'); if (a && a.getAttribute('href') === location.hash) { e.preventDefault(); route(); } });

let repaintT = 0;
function scheduleRepaint(){ clearTimeout(repaintT); repaintT = setTimeout(repaintAll, 60); }
function repaintAll(){ renderHero(); paintGallery(); paintTemplateChips(); paintShop(); requestRender(); if (selectedEl()) syncProps(); }
function loadMockupPhotos(){
  const list = [CONFIG.mockup.photo, ...Object.values(CONFIG.mockup.photos || {})].filter(Boolean);
  list.forEach((ph) => {
    ph.imgs = {};
    const keys = { base: ph.src, shade: ph.shade, dark: ph.dark, hl: ph.highlights, patch: ph.wickPatch };
    Object.entries(keys).forEach(([k, src]) => {
      if (!src) return;
      const im = new Image(); im.onload = () => scheduleRepaint(); im.onerror = () => { if (k === 'base'){ ph.imgs.base = null; console.warn('Фотомокап не завантажився'); } };
      im.src = src; ph.imgs[k] = im;
    });
  });
}
/* ===================== Дані з адмін-панелі (data/site.json) =====================
   Сайт працює й без файлу: тоді лишаються вбудовані значення. Кожне поле перевіряється, щоб
   помилка в даних не зламала сторінку. */
let SITE_DATA = null;
async function loadSiteData(){
  if (!CONFIG.dataUrl) return null;
  try {
    const r = await fetch(CONFIG.dataUrl, { cache: 'no-cache' });
    if (!r.ok) throw new Error('HTTP ' + r.status);
    return await r.json();
  } catch (e){ console.warn('Не вдалося завантажити дані сайту, використовуються вбудовані', e); return null; }
}
function applySiteData(d){
  if (!d || typeof d !== 'object') return;
  const okTpl = (id) => TEMPLATES.some((t) => t.id === id);
  if (Array.isArray(d.products)) PRODUCTS = d.products.filter((x) => x && x.id && x.title && (x.image || okTpl(x.tpl)))
    .map((x) => Object.assign({ cats: [], desc: '', glass: 'clear' }, x, { tpl: x.image ? undefined : x.tpl }));
  if (Array.isArray(d.works)) WORKS = d.works.filter((x) => x && x.id && x.title && x.image).map((x) => Object.assign({ cat: 'gift', note: '', glass: 'clear' }, x));
  const cats = (list) => Array.isArray(list) ? list.filter((c) => c && c.id && c.name).map((c) => ({ id: String(c.id), name: String(c.name) })) : null;
  const sc = cats(d.shopCategories); if (sc) SHOP_CATS = sc;
  const wc = cats(d.workCategories); if (wc && wc.length) WORK_CATS = wc;
  const P = CONFIG.pricing, dp = d.pricing;
  if (dp && typeof dp === 'object'){
    if (Array.isArray(dp.tiers)){ const t = dp.tiers.map((x) => ({ min: Math.round(+x.min), price: +x.price })).filter((x) => x.min >= 1 && x.price >= 0).sort((a, b) => a.min - b.min); if (t.length){ t[0].min = 1; P.tiers = t; } }
    if ('quoteFromQty' in dp) P.quoteFromQty = dp.quoteFromQty ? Math.round(+dp.quoteFromQty) || null : null;
    if ('approved' in dp) P.approved = !!dp.approved;
    if (typeof dp.note === 'string' && dp.note.trim()) P.note = dp.note.trim();
  }
  if (d.scents && Array.isArray(d.scents.groups)){
    const g = d.scents.groups.filter((x) => x && x.id && x.name && Array.isArray(x.items)).map((x) => Object.assign({}, x, { items: x.items.filter((i) => i && i.id && i.name) })).filter((x) => x.items.length);
    if (g.length){ CONFIG.scents.groups = g; state.scentGroup = g[0].id; if (state.scentId && !scentById(state.scentId)){ state.scentId = null; state.scentMode = 'none'; } }
  }
  if (d.contacts && typeof d.contacts === 'object') ['phone', 'email', 'instagram'].forEach((k) => { if (k in d.contacts) CONFIG.contacts[k] = d.contacts[k] ? String(d.contacts[k]) : null; });
  if ('showDemoNotice' in d) CONFIG.showDemoNotice = !!d.showDemoNotice;
  SITE_DATA = d;
}
function applySiteTexts(){
  const d = SITE_DATA; if (!d) return;
  const txt = (id, v) => { if (typeof v === 'string' && v.trim() && $('#' + id)) $('#' + id).textContent = v.trim(); };
  const ph = d.photos || {}, img = (id, v) => { if (typeof v === 'string' && v && $('#' + id)) $('#' + id).src = v; };
  img('shopHeroImg', ph.shopHero); img('b2bHeroImg', ph.b2bHero); img('teaserImg', ph.teaser); img('bizImg', ph.business);
  const sh = (d.texts || {}).shopHero || {}, bh = (d.texts || {}).b2bHero || {};
  txt('shopKicker', sh.kicker); txt('h-shop', sh.title); txt('shopLead', sh.lead); txt('shopPhotoTitle', sh.photoTitle); txt('shopPhotoText', sh.photoText);
  if ('photoProduct' in sh){ const pr = sh.photoProduct && productById(sh.photoProduct); const b = $('#shopPhotoBtn'); b.hidden = !pr || !!pr.hidden; if (pr) b.dataset.product = pr.id; }
  if (typeof sh.photoAlt === 'string' && sh.photoAlt) $('#shopHeroImg').alt = sh.photoAlt;
  txt('b2bKicker', bh.kicker); txt('h-hero', bh.title); txt('b2bLead', bh.lead); txt('b2bPhotoTitle', bh.photoTitle); txt('b2bPhotoText', bh.photoText);
  if ('photoTemplate' in bh){ const b = $('#b2bPhotoBtn'); const ok = bh.photoTemplate && TEMPLATES.some((t) => t.id === bh.photoTemplate); b.hidden = !ok; if (ok) b.dataset.use = bh.photoTemplate; }
  if (typeof bh.photoAlt === 'string' && bh.photoAlt) $('#b2bHeroImg').alt = bh.photoAlt;
}
async function init(){
  applySiteData(await loadSiteData()); pruneCart();
  staticTexts(); loadMockupPhotos();
  renderTemplateChips(); renderGallery(); renderWorks(); renderShop(); updateCartBadge(); renderHero(); route();
  goStep('color');
  const d = await loadDraft();
  let restored = false;
  if (d && d.els && d.els.length){
    const dropped = applyDesign(d); restored = true;
    const t = dropped ? () => toast(`Чернетку відновлено, але ${dropped} зображень не збереглися в браузері`) : () => toast('Відновлено твою чернетку', 'Почати заново', () => { applyTemplate('f-wild'); });
    if (document.body.dataset.mode === 'b2b') setTimeout(t, 600); else pendingDraftToast = t;
  } else applyTemplate('f-wild', { silent: true });
  history = [snap()]; refreshAll(); $('#qty').value = state.qty;
  if (restored) setSaveState('Чернетку відновлено з цього пристрою');
  await fontsReady(); repaintAll();
  if (document.fonts) document.fonts.addEventListener?.('loadingdone', () => repaintAll());
  const io = new IntersectionObserver((en) => en.forEach((x) => setHeroAnim(x.isIntersecting)), { threshold: 0.05 });
  const hv = $('.hero-visual'); if (hv) io.observe(hv);
  let rz = null, lastW = document.body.clientWidth; new ResizeObserver(() => { const w = document.body.clientWidth; if (w === lastW) return; lastW = w; clearTimeout(rz); rz = setTimeout(repaintAll, 120); }).observe(document.body);
  new ResizeObserver(() => requestRender()).observe($('#canvasWrap'));
  new IntersectionObserver((en) => en.forEach((x) => { studioInView = x.isIntersecting; updateMbar(); }), { threshold: 0.12 }).observe($('#konstruktor'));
  window.addEventListener('resize', updateMbar);
}
init();
