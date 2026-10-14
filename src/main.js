import './style.css';
import './sections.css';
import { initBelow } from './below.js';
import { animate, createTimeline, stagger, utils } from 'animejs';
import Lenis from 'lenis';

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

/* ---------- Smooth scroll ---------- */
const lenis = new Lenis({ duration: 1.15, smoothWheel: !reduceMotion });
lenis.stop();
function raf(t) { lenis.raf(t); requestAnimationFrame(raf); }
requestAnimationFrame(raf);

function scrollToHash(hash) {
  const target = hash === '#top' ? 0 : $(hash);
  if (target === null || target === undefined) return false;
  lenis.scrollTo(target, { offset: hash === '#top' ? 0 : -70, duration: 1.4 });
  return true;
}
document.addEventListener('click', (e) => {
  const a = e.target.closest('a[href^="#"]');
  if (!a) return;
  const hash = a.getAttribute('href');
  if (hash.length > 1 && scrollToHash(hash)) e.preventDefault();
  closeMenu();
});

/* ---------- Initial (pre-intro) states ---------- */
const hero = {
  lines: $$('.split-inner'),
  fades: $$('[data-hero="fade"]'),
  tags: $$('[data-hero="tag"]'),
  finder: $('[data-hero="finder"]'),
  disc: $('#heroDisc'),
  rings: $$('.hero__ring'),
  aura: $('.hero__aura'),
  bg: $('#heroBg'),
  header: $('#header'),
};

if (!reduceMotion) {
  hero.lines.forEach((el) => { el.style.transform = 'translateY(115%)'; });
  [...hero.fades, ...hero.tags, hero.finder].forEach((el) => { el.style.opacity = '0'; });
  hero.disc.style.opacity = '0';
  hero.aura.style.opacity = '0';
  hero.rings.forEach((el) => { el.style.opacity = '0'; });
  hero.header.style.opacity = '0';
}

/* ---------- Preloader ---------- */
const preloader = $('#preloader');
const preBar = $('#preBar');
const preCount = $('#preCount');

function runPreloader() {
  if (reduceMotion) { finishPreloader(); return; }
  const counter = { v: 0 };
  animate(counter, {
    v: 100,
    duration: 1500,
    ease: 'inOutQuad',
    onUpdate: () => {
      const v = Math.round(counter.v);
      preCount.textContent = v;
      preBar.style.transform = `scaleX(${counter.v / 100})`;
    },
    onComplete: finishPreloader,
  });
}

function finishPreloader() {
  const done = () => {
    preloader.remove();
    document.body.classList.remove('is-loading');
    lenis.start();
  };
  if (reduceMotion) { done(); return; }
  animate(preloader, { opacity: 0, duration: 600, ease: 'outQuad', onComplete: done });
  playIntro();
}

// Wait for the hero images (bounded) so the intro never plays on empty pixels.
const imgReady = Promise.race([
  Promise.all([hero.disc, hero.bg].map((img) => (img.decode ? img.decode().catch(() => {}) : Promise.resolve()))),
  new Promise((r) => setTimeout(r, 3000)),
]);
imgReady.then(runPreloader);

/* ---------- Hero intro ---------- */
function playIntro() {
  const tl = createTimeline({ defaults: { ease: 'outExpo' } });

  tl.add(hero.bg, { scale: [1.18, 1], duration: 2200, ease: 'outQuart' }, 0)
    .add(hero.header, { opacity: [0, 1], translateY: [-20, 0], duration: 900 }, 200)
    .add(hero.lines, { translateY: ['115%', '0%'], duration: 1300, delay: stagger(130) }, 250)
    .add(hero.fades, { opacity: [0, 1], translateY: [24, 0], duration: 1000, delay: stagger(110) }, 500)
    .add(hero.aura, { opacity: [0, 1], scale: [0.6, 1], duration: 1800, ease: 'outQuart' }, 300)
    .add(hero.rings, { opacity: [0, 1], scale: [0.7, 1], duration: 1600, delay: stagger(160), ease: 'outQuart' }, 400)
    .add(hero.disc, { opacity: [0, 1], scale: [0.55, 1], rotate: [-28, 0], translateY: [60, 0], duration: 1800, ease: 'outQuart' }, 350)
    .add(hero.tags, { opacity: [0, 1], translateX: (_, i) => [i ? 40 : -40, 0], duration: 1000, delay: stagger(180) }, 1300)
    .add(hero.finder, { opacity: [0, 1], translateY: [50, 0], duration: 1200 }, 900);

  tl.then(() => {
    startFloating();
    startSparks();
    startTilt();
  });
  if (!reduceMotion) startRingSpin();
}

/* ---------- Ambient hero motion ---------- */
function startFloating() {
  if (reduceMotion) return;
  animate('#heroFloat', { translateY: [-12, 12], rotate: [-1.2, 1.2], duration: 3800, ease: 'inOutSine', loop: true, alternate: true });
  animate('.hero__tag--a', { translateY: [-6, 6], duration: 3000, ease: 'inOutSine', loop: true, alternate: true });
  animate('.hero__tag--b', { translateY: [6, -6], duration: 3400, ease: 'inOutSine', loop: true, alternate: true });
  animate(hero.aura, { scale: [1, 1.08], opacity: [0.85, 1], duration: 2600, ease: 'inOutSine', loop: true, alternate: true });
}

function startRingSpin() {
  animate('.hero__ring--1', { rotate: 360, duration: 60000, ease: 'linear', loop: true });
  animate('.hero__ring--2', { rotate: -360, duration: 90000, ease: 'linear', loop: true });
}

function startSparks() {
  if (reduceMotion) return;
  const wrap = $('#sparks');
  const count = window.innerWidth < 700 ? 14 : 30;
  for (let i = 0; i < count; i++) {
    const s = document.createElement('i');
    s.className = 'spark';
    const size = utils.random(2, 5);
    s.style.cssText = `width:${size}px;height:${size}px;left:${utils.random(18, 88)}%;top:${utils.random(20, 90)}%`;
    wrap.appendChild(s);
    animate(s, {
      translateX: [0, utils.random(-80, 140)],
      translateY: [0, utils.random(-200, -40)],
      opacity: [{ to: 1, duration: 300 }, { to: 0, duration: utils.random(900, 1800) }],
      scale: [1, 0.2],
      duration: utils.random(1400, 2600),
      delay: utils.random(0, 3500),
      ease: 'outQuad',
      loop: true,
      loopDelay: utils.random(400, 2200),
    });
  }
}

/* ---------- Mouse tilt + parallax on the product ---------- */
function startTilt() {
  if (reduceMotion || !finePointer) return;
  const product = $('#heroProduct');
  const tags = $$('.hero__tag');
  const target = { x: 0, y: 0 };
  const cur = { x: 0, y: 0 };
  window.addEventListener('mousemove', (e) => {
    target.x = (e.clientX / window.innerWidth - 0.5) * 2;
    target.y = (e.clientY / window.innerHeight - 0.5) * 2;
  }, { passive: true });
  (function loop() {
    cur.x += (target.x - cur.x) * 0.07;
    cur.y += (target.y - cur.y) * 0.07;
    product.style.transform = `translate3d(${cur.x * 22}px, ${cur.y * 16}px, 0) rotateY(${cur.x * 7}deg) rotateX(${-cur.y * 5}deg)`;
    tags.forEach((t, i) => { t.style.translate = `${cur.x * (i ? -34 : 30)}px ${cur.y * (i ? -20 : 22)}px`; });
    requestAnimationFrame(loop);
  })();
}

/* ---------- Scroll: header state + hero background parallax ---------- */
function onScroll() {
  const y = window.scrollY;
  hero.header.classList.toggle('is-scrolled', y > 40);
  if (!reduceMotion && y < window.innerHeight * 1.2) {
    // parallax layers are written with `translate` so they never fight anime.js `transform`
    hero.bg.style.translate = `0 ${y * 0.18}px`;
    $('.hero__visual').style.translate = `0 ${y * -0.08}px`;
  }
  if (below) below.update();
}
let below = null;
window.addEventListener('scroll', onScroll, { passive: true });
window.addEventListener('resize', onScroll);

/* ---------- Custom cursor ---------- */
if (finePointer && !reduceMotion) {
  const dot = $('#cursorDot');
  const ring = $('#cursorRing');
  document.body.classList.add('has-cursor');
  const mouse = { x: -100, y: -100 };
  const pos = { x: -100, y: -100 };
  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX; mouse.y = e.clientY;
    dot.style.opacity = ring.style.opacity = '1';
  }, { passive: true });
  document.addEventListener('mouseleave', () => { dot.style.opacity = ring.style.opacity = '0'; });
  (function loop() {
    pos.x += (mouse.x - pos.x) * 0.16;
    pos.y += (mouse.y - pos.y) * 0.16;
    dot.style.transform = `translate3d(${mouse.x}px, ${mouse.y}px, 0)`;
    ring.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0)`;
    requestAnimationFrame(loop);
  })();
  document.addEventListener('mouseover', (e) => ring.classList.toggle('is-hover', !!e.target.closest('[data-hover], a, button')));
}

/* ---------- Magnetic buttons ---------- */
if (finePointer && !reduceMotion) {
  $$('[data-magnetic]').forEach((btn) => {
    btn.addEventListener('mousemove', (e) => {
      const r = btn.getBoundingClientRect();
      const x = e.clientX - (r.left + r.width / 2);
      const y = e.clientY - (r.top + r.height / 2);
      animate(btn, { translateX: x * 0.3, translateY: y * 0.4, duration: 400, ease: 'outQuad' });
    });
    btn.addEventListener('mouseleave', () => {
      animate(btn, { translateX: 0, translateY: 0, duration: 900, ease: 'outElastic(1, .5)' });
    });
  });
}

/* ---------- Mobile menu ---------- */
const burger = $('#burger');
const mnav = $('#mnav');
function setMenu(open) {
  burger.setAttribute('aria-expanded', String(open));
  mnav.classList.toggle('is-open', open);
  mnav.setAttribute('aria-hidden', String(!open));
  open ? lenis.stop() : lenis.start();
  if (open && !reduceMotion) {
    animate($$('#mnav a'), { opacity: [0, 1], translateY: [30, 0], duration: 800, delay: stagger(70, { start: 250 }), ease: 'outExpo' });
  }
}
function closeMenu() { if (mnav.classList.contains('is-open')) setMenu(false); }
burger.addEventListener('click', () => setMenu(!mnav.classList.contains('is-open')));
window.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeMenu(); });

/* ---------- Vehicle finder ---------- */
const VEHICLES = {
  'BMW': ['3 Series', '5 Series', 'X5'],
  'Ford': ['Focus', 'Mustang', 'F-150'],
  'Honda': ['Accord', 'Civic', 'CR-V'],
  'Mercedes-Benz': ['C-Class', 'E-Class', 'GLC'],
  'Toyota': ['Camry', 'Corolla', 'Hilux'],
};
const YEARS = Array.from({ length: 21 }, (_, i) => 2025 - i);
const ENGINES = ['Petrol', 'Diesel', 'Hybrid', 'Electric'];

const fMake = $('#fMake'), fModel = $('#fModel'), fYear = $('#fYear'), fEngine = $('#fEngine');

function fill(select, placeholder, items) {
  select.innerHTML = '';
  select.append(new Option(placeholder, ''));
  items.forEach((v) => select.append(new Option(v, v)));
}
function lock(...selects) { selects.forEach((s) => { s.disabled = true; }); }
function pulse(el) {
  if (reduceMotion) return;
  animate(el, { borderColor: ['rgba(225,6,0,1)', 'rgba(255,255,255,0.1)'], duration: 1000, ease: 'outQuad' });
}

fill(fMake, 'Select make', Object.keys(VEHICLES));
fill(fModel, 'Select model', []);
fill(fYear, 'Select year', []);
fill(fEngine, 'Select engine', []);

fMake.addEventListener('change', () => {
  fill(fModel, 'Select model', VEHICLES[fMake.value] || []);
  fill(fYear, 'Select year', []);
  fill(fEngine, 'Select engine', []);
  lock(fYear, fEngine);
  fModel.disabled = !fMake.value;
  if (fMake.value) pulse(fModel);
});
fModel.addEventListener('change', () => {
  fill(fYear, 'Select year', fModel.value ? YEARS : []);
  fill(fEngine, 'Select engine', []);
  lock(fEngine);
  fYear.disabled = !fModel.value;
  if (fModel.value) pulse(fYear);
});
fYear.addEventListener('change', () => {
  fill(fEngine, 'Select engine', fYear.value ? ENGINES : []);
  fEngine.disabled = !fYear.value;
  if (fYear.value) pulse(fEngine);
});

const toast = $('#toast');
let toastTimer;
function showToast(msg) {
  toast.textContent = msg;
  if (reduceMotion) { toast.style.opacity = '1'; toast.style.transform = 'translate(-50%, 0)'; }
  else animate(toast, { opacity: 1, translateY: ['140%', '0%'], translateX: '-50%', duration: 700, ease: 'outExpo' });
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    if (reduceMotion) { toast.style.opacity = '0'; return; }
    animate(toast, { opacity: 0, translateY: '140%', duration: 500, ease: 'inQuad' });
  }, 3800);
}

$('#finder').addEventListener('submit', (e) => {
  e.preventDefault();
  const label = `${fYear.value} ${fMake.value} ${fModel.value} · ${fEngine.value}`;
  const text = $('#finderBtnText');
  text.textContent = 'Searching…';
  setTimeout(() => {
    text.textContent = 'Search Parts';
    showToast(`Catalog search for ${label} will connect here once the product pages are built.`);
  }, 900);
});

/* ---------- Everything below the hero ---------- */
below = initBelow({ showToast, reduceMotion, finePointer });
onScroll();
