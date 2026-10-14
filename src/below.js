import { animate, stagger } from 'animejs';

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

  /* ---------- Exploded view (scroll-driven) ---------- */
  const xvSection = $('#engineering');
  const xvParts = $$('.xv__part').map((g) => ({
    g,
    cx: Number(g.dataset.cx),
    dx: Number(g.dataset.dx),
    label: $('.xv__label', g),
  }));
  const xvSvg = $('#xvSvg');
  const xvMobile = window.matchMedia('(max-width: 900px)');
  let spread = 1;
  function applyXvLayout() {
    spread = xvMobile.matches ? 0.55 : 1;
    xvSvg.setAttribute('viewBox', xvMobile.matches ? '170 120 1060 290' : '0 0 1400 560');
    lastE = -1;
  }
  const xvAxis = $('#xvAxis');
  const xvBar = $('#xvBar');
  let lastE = -1;

  function renderXV(e) {
    if (Math.abs(e - lastE) < 0.0005) return;
    lastE = e;
    const labelOpacity = clamp((e - 0.7) / 0.3);
    xvParts.forEach((p) => {
      p.g.setAttribute('transform', `translate(${p.cx + p.dx * spread * e} 0)`);
      p.label.style.opacity = labelOpacity;
    });
    xvAxis.style.opacity = clamp(e * 1.4);
    xvBar.style.transform = `scaleX(${e})`;
  }

  function updateXV() {
    if (reduceMotion) { renderXV(1); return; }
    const r = xvSection.getBoundingClientRect();
    if (r.bottom < -200 || r.top > window.innerHeight + 200) return;
    const total = xvSection.offsetHeight - window.innerHeight;
    renderXV(smooth((clamp(-r.top / total) - 0.08) / 0.62));
  }
  xvMobile.addEventListener('change', () => { applyXvLayout(); updateXV(); });
  applyXvLayout();
  renderXV(0);

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
