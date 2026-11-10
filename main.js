/* Birthday gift for Anamika - plain JS, works offline from index.html */
(() => {
'use strict';
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const NS = 'http://www.w3.org/2000/svg';
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const rnd = (a, b) => a + Math.random() * (b - a);
const PHOTOS = Array.from({ length: 8 }, (_, i) => `photo${i + 1}.jpg`);

/* ---------- shared SVG symbols: flowers + flame ---------- */
const petals = (col, n, rx, ry, cy, rot = 0) => Array.from({ length: n }, (_, i) =>
  `<ellipse cx="0" cy="${cy}" rx="${rx}" ry="${ry}" transform="rotate(${rot + i * 360 / n})"/>`).join('');
const flowerSym = (id, c1, c2) => `<g id="${id}"><g fill="${c1}" stroke="rgba(255,255,255,.55)" stroke-width=".6">${petals(c1, 6, 5.5, 9, -8)}</g><g fill="${c2}" opacity=".85">${petals(c2, 6, 3.4, 6, -5, 30)}</g><circle r="3" fill="#f5d77a"/><circle r="1.2" fill="#c98a2e"/></g>`;
document.body.insertAdjacentHTML('afterbegin', `<svg width="0" height="0" style="position:absolute" aria-hidden="true"><defs>
 ${flowerSym('fl-pink', '#f4a6c0', '#fbd3e1')}${flowerSym('fl-cream', '#fff1dc', '#f7d9b8')}${flowerSym('fl-lav', '#b9a3e3', '#ddd0f5')}
 <linearGradient id="flg" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="#ff8a2a"/><stop offset=".45" stop-color="#ffc247"/><stop offset="1" stop-color="#fff6c8"/></linearGradient>
 <radialGradient id="glw"><stop offset="0" stop-color="#ffd27a" stop-opacity=".9"/><stop offset="1" stop-color="#ffb84d" stop-opacity="0"/></radialGradient>
 <linearGradient id="wax" x1="0" x2="1"><stop offset="0" stop-color="#f2dcc8"/><stop offset=".5" stop-color="#fff6ea"/><stop offset="1" stop-color="#e3c6b0"/></linearGradient>
 <g id="flame"><path d="M0 0C-5 -6 -5 -13 0 -22 5 -13 5 -6 0 0Z" fill="url(#flg)"/><path d="M0 -1C-2 -4 -2 -8 0 -12 2 -8 2 -4 0 -1Z" fill="#fff9e0"/></g>
</defs></svg>`);

const flame = (x, y, k = 1, cls = '') => `<g transform="translate(${x} ${y}) scale(${k})"><circle cy="-10" r="22" fill="url(#glw)" class="fglow"/><use href="#flame" class="fl ${cls}"/></g>`;

/* ---------- fairy lights ---------- */
const lights = $('#lights');
function buildLights() {
  const w = innerWidth, swags = Math.max(2, Math.round(w / 240)), sw = w / swags, sag = 24;
  const cols = ['#ffe3a0', '#f8c1d4', '#fff4e2', '#d8c8f5'];
  let path = 'M0,3', bulbs = '', k = 0;
  for (let s = 0; s < swags; s++) {
    const x0 = s * sw, x1 = x0 + sw, cx = x0 + sw / 2;
    path += ` Q${cx},${3 + sag * 2} ${x1},3`;
    for (let i = 1; i <= 4; i++) {
      const t = i / 5, x = (1 - t) ** 2 * x0 + 2 * (1 - t) * t * cx + t * t * x1, y = (1 - t) ** 2 * 3 + 2 * (1 - t) * t * (3 + sag * 2) + t * t * 3;
      const c = cols[k++ % 4];
      bulbs += `<g><line x1="${x}" y1="${y}" x2="${x}" y2="${y + 5}" stroke="#7a5a30" stroke-width="1.5"/><circle class="b" cx="${x}" cy="${y + 10}" r="9" fill="${c}" opacity=".25" style="animation-delay:${rnd(0, 2.4).toFixed(2)}s;animation-duration:${rnd(1.6, 3).toFixed(2)}s"/><circle class="b" cx="${x}" cy="${y + 10}" r="4.3" fill="${c}" style="animation-delay:${rnd(0, 2.4).toFixed(2)}s;animation-duration:${rnd(1.6, 3).toFixed(2)}s"/></g>`;
    }
  }
  lights.innerHTML = `<path d="${path}" fill="none" stroke="#8a6b3e" stroke-width="1.8"/>${bulbs}`;
}

/* ---------- garlands ---------- */
function buildGarlands() {
  const bez = (p0, p1, p2, t) => [(1 - t) ** 2 * p0[0] + 2 * (1 - t) * t * p1[0] + t * t * p2[0], (1 - t) ** 2 * p0[1] + 2 * (1 - t) * t * p1[1] + t * t * p2[1]];
  const curves = [[[0, 16], [130, 118], [290, 26]], [[14, 0], [74, 170], [24, 300]]];
  let vine = '', leaves = '', fl = '', n = 0; const fs = ['fl-pink', 'fl-cream', 'fl-lav', 'fl-pink', 'fl-cream'];
  curves.forEach(([a, b, c]) => {
    vine += `<path d="M${a} Q${b} ${c}" fill="none" stroke="#6f9a7c" stroke-width="3.4" stroke-linecap="round"/>`;
    for (let t = 0.04; t < 1; t += 0.045) {
      const [x, y] = bez(a, b, c, t), r = rnd(0, 360);
      leaves += `<ellipse cx="${x}" cy="${y}" rx="${rnd(3.5, 5)}" ry="${rnd(8, 12)}" fill="${n % 2 ? '#8fb89b' : '#a9c8a4'}" transform="rotate(${r} ${x} ${y})"/>`;
      if (++n % 3 === 0) fl += `<use href="#${fs[n % 5]}" transform="translate(${x} ${y}) scale(${rnd(1.35, 2).toFixed(2)}) rotate(${r})"/>`;
    }
  });
  $$('.garland').forEach(g => g.innerHTML = `<svg viewBox="0 0 300 320" aria-hidden="true">${vine}${leaves}${fl}</svg>`);
}

/* ---------- corner candles ---------- */
function candleSVG(flip) {
  const c = (x, h, k, cls, y = 150) => `<rect x="${x - 6}" y="${y - h}" width="12" height="${h}" rx="3" fill="url(#wax)"/><path d="M${x - 6} ${y - h + 3}q3 8 6 2t6-2" fill="#f7c7d6"/><line x1="${x}" y1="${y - h}" x2="${x}" y2="${y - h - 4}" stroke="#5a3a2a" stroke-width="1.4"/>${flame(x, y - h - 3, k, cls)}`;
  return `<svg viewBox="0 0 130 170"${flip ? ' style="scale:-1 1"' : ''}><ellipse cx="65" cy="158" rx="58" ry="10" fill="#e9c46a" opacity=".9"/><ellipse cx="65" cy="154" rx="52" ry="8" fill="#f8e3a8"/>
  ${c(36, 70, 1.3, '')}${c(66, 100, 1.5, 'fl2')}${c(96, 56, 1.2, 'fl3')}
  <use href="#fl-pink" transform="translate(16 150) scale(1.5)"/><use href="#fl-cream" transform="translate(114 152) scale(1.3)"/><use href="#fl-lav" transform="translate(52 156) scale(1)"/></svg>`;
}

/* ---------- hanging photos on the sides ---------- */
const pol = (src) => `<div class="pol"><i class="clip"></i><img src="${src}" alt="Anamika" loading="eager" draggable="false"></div>`;
function buildSides() {
  [['left', [0, 2, 4]], ['right', [1, 3, 5]]].forEach(([side, idx]) => {
    let h = '<div class="rope"></div>';
    for (let y = 4; y < 100; y += 6) h += `<i class="mini" style="top:${y}%;animation-delay:${rnd(0, 2).toFixed(1)}s"></i>`;
    [8, 32, 58, 84].forEach((y, i) => h += `<svg class="rope-deco" style="top:${y}%" viewBox="-14 -14 28 28"><use href="#${['fl-pink', 'fl-lav', 'fl-cream', 'fl-pink'][i]}" transform="scale(1.4)"/></svg>`);
    idx.forEach((p, i) => h += `<div class="hang" style="--t:${12 + i * 24}%;--d:${(4.5 + i * .9 + (side === 'right' ? .6 : 0)).toFixed(1)}s">${pol(PHOTOS[p])}</div>`);
    $('.side.' + side).innerHTML = h;
  });
}

/* ---------- gallery (all 8 photos together) ---------- */
function buildGallery() {
  $('#rows').innerHTML = [0, 4].map(o => `<div class="row">${PHOTOS.slice(o, o + 4).map((s, i) =>
    `<div class="hang" tabindex="0" data-src="${s}" style="--d:${(4 + ((o + i) * 0.55) % 2.6).toFixed(1)}s;--e:${((o + i) * .12).toFixed(2)}s">${pol(s)}</div>`).join('')}</div>`).join('');
  const lb = $('#lightbox'), img = $('img', lb), close = () => lb.hidden = true;
  $$('#rows .hang').forEach(el => {
    const open = () => { img.src = el.dataset.src; lb.hidden = false; };
    el.addEventListener('click', open);
    el.addEventListener('keydown', e => (e.key === 'Enter' || e.key === ' ') && (e.preventDefault(), open()));
  });
  lb.addEventListener('click', close);
  addEventListener('keydown', e => e.key === 'Escape' && close());
}

/* ---------- cake ---------- */
function buildCake() {
  const cream = (x, w, y, n) => { let d = `M${x} ${y}`; const s = w / n; for (let i = 0; i < n; i++) d += `q${s / 2} ${i % 2 ? 26 : 34} ${s} 0`; return d + 'z'; };
  const cds = [118, 149, 180, 211, 242].map((x, i) => `<g class="cd"><rect x="${x - 5}" y="${70 + (i % 2) * 6}" width="10" height="${44 - (i % 2) * 6}" rx="3" fill="${i % 2 ? '#f6c1d1' : '#fff4e2'}"/><line x1="${x}" y1="${70 + (i % 2) * 6}" x2="${x}" y2="${66 + (i % 2) * 6}" stroke="#5a3a2a" stroke-width="1.4"/>${flame(x, 67 + (i % 2) * 6, 1.25, ['', 'fl2', 'fl3'][i % 3])}</g>`).join('');
  const dots = (y, xs, u) => xs.map((x, i) => `<use href="#${['fl-pink', 'fl-lav', 'fl-cream'][i % 3]}" transform="translate(${x} ${y}) scale(${u})"/>`).join('');
  $('#cake').innerHTML = `<svg viewBox="0 0 360 340" role="img" aria-label="Birthday cake with lit candles">
  <ellipse cx="180" cy="312" rx="165" ry="20" fill="#e9c46a" opacity=".95"/><ellipse cx="180" cy="306" rx="155" ry="16" fill="#fbebb8"/>
  <g class="L L1"><rect x="40" y="226" width="280" height="76" rx="14" fill="#f4a9c2"/><path d="${cream(40, 280, 226, 10)}" fill="#fff6ea"/>${dots(274, [72, 120, 168, 216, 264, 300], 1.9)}<rect x="40" y="288" width="280" height="14" rx="7" fill="#fff6ea" opacity=".9"/></g>
  <g class="L L2"><rect x="76" y="160" width="208" height="68" rx="12" fill="#cdb6ee"/><path d="${cream(76, 208, 160, 8)}" fill="#fff6ea"/>${dots(208, [104, 148, 192, 236, 262], 1.7)}</g>
  <g class="L L3"><rect x="108" y="108" width="144" height="54" rx="10" fill="#fbd0de"/><path d="${cream(108, 144, 108, 6)}" fill="#fff6ea"/>${dots(148, [136, 180, 224], 1.5)}</g>
  <g class="cd"><use href="#fl-pink" transform="translate(180 100) scale(1.2)"/></g>${cds}</svg>`;
}

/* ---------- bloom flower + finale garden ---------- */
function buildBloom() {
  const ring = (n, len, w, col, off, dl, s) => Array.from({ length: n }, (_, i) => `<g class="pt" style="--a:${off + i * 360 / n}deg;--dl:${dl + i * .05}s;--s:${s}"><ellipse cx="100" cy="${100 - len / 2 - 6}" rx="${w}" ry="${len / 2}" fill="${col}" stroke="rgba(255,255,255,.6)" stroke-width="1"/></g>`).join('');
  $('.bflower').innerHTML = `<svg viewBox="0 0 200 200">${ring(10, 84, 17, '#f08db1', 0, .0, 1)}${ring(10, 70, 15, '#f7b6cd', 18, .35, 1)}${ring(8, 52, 12, '#fff0f4', 22, .7, 1)}
  <g class="bctr"><circle cx="100" cy="100" r="14" fill="#f5d77a"/>${Array.from({ length: 9 }, (_, i) => `<circle cx="${100 + Math.cos(i) * 8}" cy="${100 + Math.sin(i) * 8}" r="2" fill="#c98a2e"/>`).join('')}</g></svg>`;
}
function buildGarden() {
  const fs = ['fl-pink', 'fl-lav', 'fl-cream', 'fl-pink', 'fl-lav', 'fl-cream', 'fl-pink'], hs = [.6, .85, .7, 1, .72, .88, .62];
  $('#garden').innerHTML = fs.map((f, i) => `<div class="stem" style="height:${hs[i] * 100}%;animation-delay:${i * .12}s,${1.4 + i * .3}s"><svg viewBox="-16 -16 32 32"><use href="#${f}" transform="scale(1.6)"/></svg><i></i></div>`).join('');
}

/* ---------- particles: snow, gold sparkles, petals, bursts ---------- */
const cv = $('#fx'), cx = cv.getContext('2d');
let W, H, dpr, snow = [], spark = [], petalsA = [], burstA = [], petalRate = 0.00028, last = 0, pAcc = 0;
const sprite = (() => { const c = document.createElement('canvas'); c.width = c.height = 32; const g = c.getContext('2d'), r = g.createRadialGradient(16, 16, 0, 16, 16, 16); r.addColorStop(0, 'rgba(255,244,200,1)'); r.addColorStop(.25, 'rgba(255,214,120,.8)'); r.addColorStop(1, 'rgba(255,190,80,0)'); g.fillStyle = r; g.fillRect(0, 0, 32, 32); return c; })();
function sizeCanvas() {
  dpr = Math.min(devicePixelRatio || 1, 2); W = innerWidth; H = innerHeight; cv.width = W * dpr; cv.height = H * dpr; cx.setTransform(dpr, 0, 0, dpr, 0, 0);
  const ns = Math.round(Math.min(130, W * H / 9000)), nk = Math.round(Math.min(46, W * H / 26000));
  snow = Array.from({ length: ns }, () => ({ x: rnd(0, W), y: rnd(0, H), r: rnd(1, 3.2), v: rnd(18, 48), ph: rnd(0, 6.3), a: rnd(.5, .95) }));
  spark = Array.from({ length: nk }, () => ({ x: rnd(0, W), y: rnd(0, H), r: rnd(5, 13), vx: rnd(-5, 5), vy: rnd(-12, -3), ph: rnd(0, 6.3), tw: rnd(1, 2.6) }));
}
const PCOL = ['#f6b6cb', '#fbd3e1', '#fff1dc', '#d9c8f5', '#f29bb8'];
function spawnPetal(x, y, burst) {
  const p = { x: x ?? rnd(-20, W), y: y ?? -20, s: rnd(7, 13), rot: rnd(0, 6.3), vr: rnd(-2, 2), ph: rnd(0, 6.3), c: PCOL[(Math.random() * 5) | 0], vx: burst ? rnd(-140, 140) : rnd(15, 55), vy: burst ? rnd(-220, -40) : rnd(30, 70), g: burst ? 140 : 0, life: burst ? rnd(3, 5) : 99 };
  petalsA.push(p);
}
window.burst = (x, y, n = 36, petalsToo = false) => {
  if (reduce) n = Math.min(n, 10);
  for (let i = 0; i < n; i++) { const a = rnd(0, 6.283), v = rnd(60, 280); burstA.push({ x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v - 40, life: rnd(.8, 1.7), t: 0, r: rnd(6, 15) }); }
  if (petalsToo) for (let i = 0; i < 16; i++) spawnPetal(x, y, true);
};
function frame(t) {
  requestAnimationFrame(frame);
  if (document.hidden) { last = t; return; }
  const dt = Math.min(.05, (t - last) / 1000 || 0); last = t; const k = reduce ? .25 : 1;
  cx.clearRect(0, 0, W, H);
  cx.fillStyle = '#fff'; 
  for (const s of snow) {
    s.y += s.v * dt * k; s.ph += dt; s.x += Math.sin(s.ph) * 16 * dt * k;
    if (s.y > H + 5) { s.y = -5; s.x = rnd(0, W); } 
    cx.globalAlpha = s.a; cx.beginPath(); cx.arc(s.x, s.y, s.r, 0, 6.283); cx.fill();
  }
  for (const s of spark) {
    s.x += s.vx * dt * k; s.y += s.vy * dt * k; s.ph += dt * s.tw;
    if (s.y < -20) { s.y = H + 20; s.x = rnd(0, W); } if (s.x < -20) s.x = W + 20; if (s.x > W + 20) s.x = -20;
    cx.globalAlpha = .25 + .75 * Math.abs(Math.sin(s.ph)); const r = s.r * (.7 + .3 * Math.sin(s.ph * 1.7)); cx.drawImage(sprite, s.x - r, s.y - r, r * 2, r * 2);
  }
  pAcc += petalRate * W * dt * 1000 * (reduce ? 0 : 1) / 1000 * 1000 / 1000; if (pAcc > 1 && petalsA.length < 40) { pAcc = 0; spawnPetal(); }
  for (let i = petalsA.length - 1; i >= 0; i--) {
    const p = petalsA[i]; p.vy += p.g * dt; p.ph += dt * 1.6; p.x += (p.vx + Math.sin(p.ph) * 30) * dt; p.y += p.vy * dt; p.rot += p.vr * dt; p.life -= dt; if (p.g) { p.vx *= .985; if (p.vy > 70) p.g = 0; }
    if (p.y > H + 20 || p.x > W + 30 || p.x < -40 || p.life < 0) { petalsA.splice(i, 1); continue; }
    cx.save(); cx.translate(p.x, p.y); cx.rotate(p.rot); cx.scale(1, .55 + .45 * Math.abs(Math.sin(p.ph))); cx.globalAlpha = .9; cx.fillStyle = p.c;
    cx.beginPath(); cx.ellipse(0, 0, p.s, p.s * .58, 0, 0, 6.283); cx.fill(); cx.restore();
  }
  cx.globalCompositeOperation = 'lighter';
  for (let i = burstA.length - 1; i >= 0; i--) {
    const b = burstA[i]; b.t += dt; if (b.t > b.life) { burstA.splice(i, 1); continue; }
    b.vx *= .97; b.vy = b.vy * .97 + 60 * dt; b.x += b.vx * dt; b.y += b.vy * dt; cx.globalAlpha = 1 - b.t / b.life; const r = b.r * (1 - b.t / b.life * .5); cx.drawImage(sprite, b.x - r, b.y - r, r * 2, r * 2);
  }
  cx.globalCompositeOperation = 'source-over'; cx.globalAlpha = 1;
}

/* ---------- audio ---------- */
const audio = $('#audio'), mbtn = $('#music');
let wantMusic = false;
function setMusic(on) {
  wantMusic = on; mbtn.setAttribute('aria-pressed', on);
  if (!on) { audio.pause(); return; }
  audio.volume = .55;
  const p = audio.play(); if (p && p.catch) p.catch(() => { wantMusic = false; mbtn.setAttribute('aria-pressed', 'false'); });
}
mbtn.addEventListener('click', () => setMusic(!wantMusic));
audio.addEventListener('error', () => { mbtn.title = 'Music unavailable'; mbtn.style.opacity = .5; });

/* ---------- screens ---------- */
const screens = $$('.screen'), dots = $('#dots'), back = $('#back');
dots.innerHTML = screens.map(() => '<i></i>').join('');
let cur = -1, busy = false;
function go(n) {
  if (busy || n === cur || n < 0 || n >= screens.length) return;
  busy = true; const old = screens[cur];
  const show = () => {
    cur = n; const s = screens[n]; resetScreen(n); s.classList.add('active'); document.body.dataset.screen = n;
    $$('i', dots).forEach((d, i) => { d.classList.toggle('on', i === n); d.classList.toggle('done', i < n); });
    back.hidden = n === 0; petalRate = n === 5 ? .0016 : n === 4 ? .0007 : .00028;
    if (n === 5) setTimeout(() => burst(innerWidth / 2, innerHeight * .4, 70, true), 500);
    setTimeout(() => busy = false, 700);
  };
  if (old) { old.classList.remove('active'); old.classList.add('leaving'); setTimeout(() => { old.classList.remove('leaving'); show(); }, 480); } else show();
}
function resetScreen(n) {
  if (n === 0) { $('#gift').classList.remove('open'); $('#openSurprise').hidden = true; $('#giftHint').style.display = ''; }
  if (n === 3) { $('#env').classList.remove('open'); $('#envStage').hidden = false; $('#envStage').classList.remove('done'); $('#sheet').hidden = true; $('#letterNext').hidden = true; $('#letterTitle').hidden = false; $('#envHint').style.display = ''; }
  if (n === 4) { seq++; $('#bloom').hidden = false; $('#bloom').classList.remove('bloomed', 'gone'); $('#bed').innerHTML = ''; $('#wish').hidden = true; $('#wishNext').hidden = true; $('#bloomHint').style.display = ''; $('#wishTitle').textContent = 'One more surprise'; }
}
$$('[data-next]').forEach(b => b.addEventListener('click', () => go(cur + 1)));
back.addEventListener('click', () => go(cur - 1));
$('#replay').addEventListener('click', () => { burst(innerWidth / 2, innerHeight / 2, 40); go(0); });
addEventListener('keydown', e => { if (e.key === 'ArrowLeft') go(cur - 1); });

const act = (el, fn) => { el.addEventListener('click', fn); el.addEventListener('keydown', e => (e.key === 'Enter' || e.key === ' ') && (e.preventDefault(), fn())); };

/* gift */
act($('#gift'), () => {
  const g = $('#gift'); if (g.classList.contains('open')) return;
  g.classList.add('open'); if (!wantMusic) setMusic(true);
  const r = g.getBoundingClientRect(), x = r.left + r.width / 2, y = r.top + r.height * .35;
  setTimeout(() => burst(x, y, 60), 450); setTimeout(() => burst(x, y - 40, 40), 900);
  setTimeout(() => { const b = $('#openSurprise'); b.hidden = false; }, 1500);
});
/* envelope -> letter */
act($('#env'), () => {
  const e = $('#env'); if (e.classList.contains('open')) return;
  e.classList.add('open'); $('#envHint').style.display = 'none'; $('#envStage').classList.add('done');
  const r = e.getBoundingClientRect(); burst(r.left + r.width / 2, r.top + r.height / 3, 30);
  setTimeout(() => { $('#envStage').hidden = true; $('#letterTitle').hidden = true; $('#sheet').hidden = false; burst(innerWidth / 2, innerHeight / 2.4, 40, true); }, 1900);
  setTimeout(() => { $('#letterNext').hidden = false; }, 3100);
});
/* bloom -> garden -> handwritten wish */
act($('#bloom'), () => {
  const b = $('#bloom'); if (b.classList.contains('bloomed')) return;
  b.classList.add('bloomed'); $('#bloomHint').style.display = 'none';
  const r = b.getBoundingClientRect(), x = r.left + r.width / 2, y = r.top + r.height / 2;
  burst(x, y, 70, true); later(700, () => burst(x, y, 50, true)); later(1500, () => burst(x, y, 40));
  $('#wishTitle').textContent = 'A wish just for you';
  later(2000, () => b.classList.add('gone'));
  later(2800, () => { b.hidden = true; growGarden(); });
  later(3400, writeWish);
});
/* tiny sparkle on any tap */
addEventListener('pointerdown', e => { if (!e.target.closest('#nav')) burst(e.clientX, e.clientY, 7); });
/* parallax */
if (!reduce) addEventListener('pointermove', e => { const s = document.body.style; s.setProperty('--mx', (e.clientX / innerWidth - .5).toFixed(3)); s.setProperty('--my', (e.clientY / innerHeight - .5).toFixed(3)); });


/* ---------- rose + sunflower garden, handwritten wish ---------- */
const WISH = $('#wish').textContent.trim();
let seq = 0; const later = (ms, fn) => { const m = seq; setTimeout(() => m === seq && fn(), ms); };
const ring = (i, n, cy, rx, ry, fill, off = 0, stroke = 'rgba(255,255,255,.35)') => `<g class="rl" style="--i:${i}">${Array.from({ length: n }, (_, k) => `<ellipse cx="50" cy="${50 - cy}" rx="${rx}" ry="${ry}" fill="${fill}" stroke="${stroke}" stroke-width=".8" transform="rotate(${off + k * 360 / n} 50 50)"/>`).join('')}</g>`;
const roseSVG = (a, b, c) => `<svg viewBox="0 0 100 100">${ring(0, 5, 20, 21, 23, a)}${ring(1, 4, 12, 15, 16, b, 25)}${ring(2, 3, 6, 9, 10, c, 10)}<g class="rl" style="--i:3"><circle cx="50" cy="50" r="4.5" fill="${a}"/><path d="M45 50a5 5 0 1 1 5 5" fill="none" stroke="rgba(120,20,50,.55)" stroke-width="1.3"/></g></svg>`;
const sunSVG = () => `<svg viewBox="0 0 100 100">${ring(0, 14, 33, 6.5, 17, '#f4b92b', 0, 'rgba(160,90,10,.35)')}${ring(1, 14, 31, 6, 15, '#ffd95a', 12.8, 'rgba(160,90,10,.25)')}<g class="rl" style="--i:2"><circle cx="50" cy="50" r="18" fill="#6a3d1a"/><circle cx="50" cy="50" r="18" fill="url(#glw)" opacity=".35"/>${Array.from({ length: 44 }, (_, k) => { const r = 2.2 * Math.sqrt(k + 1), t = k * 2.39996; return `<circle cx="${50 + Math.cos(t) * r}" cy="${50 + Math.sin(t) * r}" r="1.25" fill="#3b220e"/>`; }).join('')}</g></svg>`;
const ROSES = [['#d93a63', '#e8587e', '#f27f9c'], ['#f08fb0', '#f6aec6', '#fbd0de'], ['#f7c9a8', '#fadbc2', '#fdeede'], ['#c7335c', '#de4f76', '#ee7a98']];
function growGarden() {
  const n = innerWidth < 600 ? 7 : 11, bed = $('#bed'); bed.innerHTML = '';
  for (let k = 0; k < n; k++) {
    const sun = k % 3 === 1, d = Math.abs(k - (n - 1) / 2) * .45, el = document.createElement('div');
    el.className = 'gf' + (sun ? ' sun' : ''); el.style.cssText = `--h:${rnd(.55, 1).toFixed(2)};--dl:${d.toFixed(2)}s`;
    el.innerHTML = (sun ? sunSVG() : roseSVG(...ROSES[k % 4])) + '<i></i>'; bed.appendChild(el);
    later(60, () => el.classList.add('go'));
    later((d + 1.2) * 1000, () => { const r = el.querySelector('svg').getBoundingClientRect(); burst(r.left + r.width / 2, r.top + r.height / 2, 12); });
  }
}
function writeWish() {
  const el = $('#wish'); el.hidden = false;
  el.innerHTML = WISH.split(' ').map(w => `<span class="w">${[...w].map(c => `<span class="c">${c}</span>`).join('')}</span>`).join(' ');
  const cs = $$('.c', el), done = () => { $('#wishNext').hidden = false; };
  if (reduce) { cs.forEach(c => c.classList.add('on')); return done(); }
  cs.forEach((c, i) => later(i * 48, () => c.classList.add('on'))); later(cs.length * 48 + 600, done);
}

/* ---------- init ---------- */
function init() {
  buildLights(); buildGarlands(); buildSides(); buildGallery(); buildCake(); buildBloom(); buildGarden();
  $$('.candles').forEach((c, i) => c.innerHTML = candleSVG(i === 1));
  sizeCanvas(); requestAnimationFrame(frame); go(0);
}
let rz; addEventListener('resize', () => { clearTimeout(rz); rz = setTimeout(() => { buildLights(); sizeCanvas(); }, 150); });
init();
})();
