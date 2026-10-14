import { animate, stagger } from 'animejs';
import layout from './exploded-layout.json';

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const smooth = (t) => { t = clamp(t); return t * t * (3 - 2 * t); };
const clearInline = (els) => els.forEach((el) => { el.style.transform = ''; el.style.opacity = ''; });

/**
 * Everything below the hero: reveals, counters, marquee, product slider,
 * scroll-driven exploded view, testimonials, forms.
 * Returns { update } which main.js calls on scroll/resize.
 */
export function initBelow({ showToast, reduceMotion, finePointer }) {
  $('#year').textContent = new Date().getFullYear();

  /* ---------- Generic parallax images ([data-parallax]) ---------- */
  const parallaxEls = $$('[data-parallax]');
  function updateParallax() {
    if (reduceMotion) return;
    const vh = window.innerHeight;
    parallaxEls.forEach((img) => {
      const box = img.parentElement.getBoundingClientRect();
      if (box.bottom < -100 || box.top > vh + 100) return;
      const slack = box.height * 0.06;
      const offset = box.top + box.height / 2 - vh / 2;
      img.style.translate = `0 ${clamp(-offset * Number(img.dataset.parallax), -slack, slack)}px`;
    });
  }

  /* ---------- Scroll reveals ---------- */
  const revealUp = $$('[data-reveal-up]');
  const revealLine = $$('[data-reveal-line]');
  const revealCards = $$('[data-reveal-card]');

  if (!reduceMotion) {
    revealUp.forEach((el) => { el.style.opacity = '0'; el.style.transform = 'translateY(50px)'; });
    revealLine.forEach((el) => { el.style.opacity = '0'; el.style.transform = 'translateY(18px)'; });
    revealCards.forEach((el) => { el.style.opacity = '0'; el.style.transform = 'translateY(60px)'; });

    const revealIO = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        if (el.hasAttribute('data-reveal-card')) {
          const group = $$('[data-reveal-card]', el.parentElement).filter((n) => n.parentElement === el.parentElement);
          group.forEach((n) => revealIO.unobserve(n));
          animate(group, {
            opacity: [0, 1], translateY: [60, 0], duration: 1100, delay: stagger(110), ease: 'outExpo',
            onComplete: () => clearInline(group),
          });
        } else {
          revealIO.unobserve(el);
          const line = el.hasAttribute('data-reveal-line');
          animate(el, {
            opacity: [0, 1], translateY: [line ? 18 : 50, 0], duration: line ? 800 : 1200, ease: 'outExpo',
            onComplete: () => clearInline([el]),
          });
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });

    [...revealUp, ...revealLine, ...revealCards].forEach((el) => revealIO.observe(el));
  }

  /* ---------- Counters ---------- */
  const counterIO = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      counterIO.unobserve(el);
      const state = { v: 0 };
      animate(state, { v: Number(el.dataset.countTo), duration: 2200, ease: 'outExpo', onUpdate: () => { el.textContent = Math.round(state.v); } });
    });
  }, { threshold: 0.6 });
  $$('[data-counter]').forEach((el) => {
    if (reduceMotion) el.textContent = el.dataset.countTo;
    else counterIO.observe(el);
  });

  /* ---------- Brand marquee ---------- */
  const brandsTrack = $('#brandsTrack');
  if (brandsTrack && !reduceMotion) {
    brandsTrack.innerHTML += brandsTrack.innerHTML;
    animate(brandsTrack, { translateX: ['0%', '-50%'], duration: 36000, ease: 'linear', loop: true });
  }

  /* ---------- Card hover: spotlight + image drift ---------- */
  if (finePointer && !reduceMotion) {
    $$('[data-tilt]').forEach((el) => {
      const img = $('img', el);
      el.addEventListener('mousemove', (e) => {
        const r = el.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width;
        const y = (e.clientY - r.top) / r.height;
        el.style.setProperty('--mx', `${x * 100}%`);
        el.style.setProperty('--my', `${y * 100}%`);
        if (img) img.style.translate = `${(x - 0.5) * -18}px ${(y - 0.5) * -18}px`;
      });
      el.addEventListener('mouseleave', () => { if (img) img.style.translate = ''; });
    });
  }

  /* ---------- Products: arrows + add to cart ---------- */
  const prodTrack = $('#prodTrack');
  const prodPrev = $('#prodPrev');
  const prodNext = $('#prodNext');
  function prodState() {
    const max = prodTrack.scrollWidth - prodTrack.clientWidth - 2;
    prodPrev.disabled = prodTrack.scrollLeft <= 2;
    prodNext.disabled = prodTrack.scrollLeft >= max;
  }
  function prodScroll(dir) {
    const card = $('.prod', prodTrack);
    prodTrack.scrollBy({ left: dir * (card.offsetWidth + 16), behavior: 'smooth' });
  }
  prodPrev.addEventListener('click', () => prodScroll(-1));
  prodNext.addEventListener('click', () => prodScroll(1));
  prodTrack.addEventListener('scroll', prodState, { passive: true });
  window.addEventListener('resize', prodState);
  prodState();

  const cartBadge = $('.icon-btn__badge');
  let cartCount = 0;
  $$('.add-cart').forEach((btn) => {
    btn.addEventListener('click', () => {
      cartCount += 1;
      cartBadge.textContent = cartCount;
      if (!reduceMotion) animate(cartBadge, { scale: [1.9, 1], duration: 700, ease: 'outElastic(1, .5)' });
      const label = btn.textContent;
      btn.textContent = 'Added ✓';
      setTimeout(() => { btn.textContent = label; }, 1400);
      showToast(`${btn.dataset.name} added to your cart.`);
    });
  });

  /* ---------- Exploded view (scroll-driven) ----------
     Stage 1: the assembled turbo cross-fades into the five parts (bunched together).
     Stage 2: the parts spread out to their exploded positions and the labels appear.
     Part sizes/positions come from exploded-layout.json (written by the image slicer). */
  const xvSection = $('#engineering');
  const xvRow = $('#xvRow');
  const xvAsm = $('#xvAsm');
  const xvBar = $('#xvBar');
  const xvMobile = window.matchMedia('(max-width: 900px)');
  const XV_Z = [3, 2, 4, 2, 3];
  const xvParts = $$('.xv__p', xvRow).map((img, i) => ({ img, lab: $(`.xv__lab[data-i="${i}"]`, xvRow), ...layout.parts[i] }));
  let xvGeo = null;
  let lastE = -1;
  xvRow.style.setProperty('--ar', layout.aspect);
  xvParts.forEach((p, i) => { p.img.style.zIndex = XV_Z[i]; p.lab.style.zIndex = 6; });
  xvAsm.style.zIndex = 1;

  function layoutXV() {
    const W = xvRow.clientWidth;
    const H = xvRow.clientHeight;
    if (!W || !H) return;
    const mobile = xvMobile.matches;
    const mx = W / 2;
    const my = H / 2;
    const COMPACT = 0.3;
    const slot = H / xvParts.length;

    const parts = xvParts.map((p, i) => {
      let w, h, x, y, lx, ly;
      if (!mobile) {
        w = p.w * W; h = (w * p.ph) / p.pw; x = p.cx * W; y = p.cy * H; lx = x; ly = H + 14;
      } else {
        const s = Math.min((W * 0.56) / p.pw, (slot * 0.9) / p.ph);
        w = p.pw * s; h = p.ph * s; x = W * 0.3; y = slot * (i + 0.5); lx = W * 0.62; ly = y - 18;
      }
      p.img.style.width = `${w}px`;
      p.img.style.height = `${h}px`;
      return { w, h, x, y, cxC: mx + (x - mx) * COMPACT, cyC: my + (y - my) * COMPACT, lx, ly };
    });

    let aw, ah;
    if (!mobile) { ah = Math.min(H * 1.35, (W * 0.6) / layout.assembledAspect); aw = ah * layout.assembledAspect; }
    else { aw = W * 0.98; ah = aw / layout.assembledAspect; }
    xvAsm.style.width = `${aw}px`;
    xvAsm.style.height = `${ah}px`;
    xvGeo = { parts, asm: { aw, ah, x: mx, y: my } };
    lastE = -1;
  }

  function renderXV(e) {
    if (!xvGeo || Math.abs(e - lastE) < 0.0004) return;
    lastE = e;
    const split = smooth(e / 0.22);            // assembled -> parts
    const spread = smooth((e - 0.14) / 0.86);  // parts fly apart
    const labelOpacity = clamp((spread - 0.8) / 0.2);
    const { asm } = xvGeo;

    xvAsm.style.opacity = 1 - split;
    xvAsm.style.transform = `translate(${asm.x - asm.aw / 2}px, ${asm.y - asm.ah / 2}px) scale(${1 + 0.07 * split})`;

    xvParts.forEach((p, i) => {
      const g = xvGeo.parts[i];
      const x = g.cxC + (g.x - g.cxC) * spread;
      const y = g.cyC + (g.y - g.cyC) * spread;
      const sc = 0.62 + 0.38 * spread;
      p.img.style.opacity = split;
      p.img.style.transform = `translate(${x - g.w / 2}px, ${y - g.h / 2}px) scale(${sc})`;
      p.lab.style.opacity = labelOpacity;
      p.lab.style.transform = `translate(${g.lx}px, ${g.ly + (1 - labelOpacity) * 12}px)`;
    });
    xvBar.style.transform = `scaleX(${e})`;
  }

  function updateXV() {
    if (reduceMotion) { renderXV(1); return; }
    const r = xvSection.getBoundingClientRect();
    if (r.bottom < -200 || r.top > window.innerHeight + 200) return;
    const total = xvSection.offsetHeight - window.innerHeight;
    renderXV(clamp((clamp(-r.top / total) - 0.05) / 0.72));
  }

  layoutXV();
  renderXV(reduceMotion ? 1 : 0);
  if ('ResizeObserver' in window) new ResizeObserver(() => { layoutXV(); updateXV(); }).observe(xvRow);
  xvMobile.addEventListener('change', () => { layoutXV(); updateXV(); });

  /* ---------- How it works: line draws in ---------- */
  const stepsLine = $('#stepsLine');
  if (reduceMotion) stepsLine.style.transform = 'scaleX(1)';
  else {
    const stepsIO = new IntersectionObserver((entries) => {
      if (!entries[0].isIntersecting) return;
      stepsIO.disconnect();
      animate(stepsLine, { scaleX: [0, 1], duration: 2200, ease: 'inOutQuart', delay: 300 });
    }, { threshold: 0.35 });
    stepsIO.observe($('#steps'));
  }

  /* ---------- Testimonials slider ---------- */
  (function testimonials() {
    const slides = $$('.tslide');
    const dots = $$('#tDots button');
    let idx = 0;
    let sliding = false;
    let timer;

    function go(next, dir = 1) {
      next = (next + slides.length) % slides.length;
      if (sliding || next === idx) return;
      sliding = true;
      const out = slides[idx];
      const inn = slides[next];
      dots.forEach((d, i) => d.classList.toggle('is-active', i === next));
      idx = next;

      const finish = () => {
        out.classList.remove('active');
        clearInline([out]);
        inn.classList.add('active');
        if (reduceMotion) { sliding = false; return; }
        animate(inn, {
          opacity: [0, 1], translateX: [50 * dir, 0], duration: 700, ease: 'outExpo',
          onComplete: () => { clearInline([inn]); sliding = false; },
        });
      };
      if (reduceMotion) finish();
      else animate(out, { opacity: 0, translateX: -50 * dir, duration: 350, ease: 'inQuad', onComplete: finish });
    }

    const play = () => { clearInterval(timer); timer = setInterval(() => go(idx + 1), 7500); };
    $('#tNext').addEventListener('click', () => { go(idx + 1, 1); play(); });
    $('#tPrev').addEventListener('click', () => { go(idx - 1, -1); play(); });
    dots.forEach((d, i) => d.addEventListener('click', () => { go(i, i > idx ? 1 : -1); play(); }));
    const root = $('#testi');
    root.addEventListener('mouseenter', () => clearInterval(timer));
    root.addEventListener('mouseleave', play);
    if (!reduceMotion) play();
  })();

  /* ---------- Wholesale form (front-end only) ---------- */
  const wForm = $('#wForm');
  wForm.addEventListener('submit', (e) => {
    e.preventDefault();
    let ok = true;
    $$('input[required]', wForm).forEach((inp) => {
      const bad = !inp.value.trim() || (inp.type === 'email' && !/^\S+@\S+\.\S+$/.test(inp.value));
      inp.classList.toggle('is-invalid', bad);
      if (bad) ok = false;
    });
    if (!ok) {
      showToast('Please fill in your name, workshop, phone and a valid email.');
      if (!reduceMotion) animate(wForm, { translateX: [0, -8, 8, -6, 6, 0], duration: 450, ease: 'inOutQuad', onComplete: () => clearInline([wForm]) });
      return;
    }
    const done = $('#wDone');
    const reveal = () => {
      wForm.hidden = true;
      clearInline([wForm]);
      done.hidden = false;
      if (!reduceMotion) animate(done, { opacity: [0, 1], translateY: [24, 0], duration: 800, ease: 'outExpo', onComplete: () => clearInline([done]) });
    };
    if (reduceMotion) reveal();
    else animate(wForm, { opacity: 0, duration: 300, ease: 'outQuad', onComplete: reveal });
  });
  $$('input', wForm).forEach((i) => i.addEventListener('input', () => i.classList.remove('is-invalid')));

  /* ---------- Newsletter ---------- */
  $('#newsForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const input = $('input', e.currentTarget);
    if (!/^\S+@\S+\.\S+$/.test(input.value)) { showToast('Please enter a valid email address.'); return; }
    input.value = '';
    showToast('Thanks for subscribing. Watch your inbox!');
  });

  return { update() { updateParallax(); updateXV(); } };
}
