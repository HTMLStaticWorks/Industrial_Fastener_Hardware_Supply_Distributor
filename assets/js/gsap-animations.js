/**
 * IndustrialPro Fasteners – GSAP Premium Animation Engine
 * Uses GSAP 3 + ScrollTrigger plugin for production-grade animations
 * Covers: Navbar, Hero, Scroll-reveal cards, counters, CTA, modals, page transitions
 *
 * FIX: All scroll-triggered elements that may already be in the viewport on
 * page load are handled via ScrollTrigger's onRefresh + invalidateOnRefresh so
 * they never get "stuck" at opacity:0.
 */

/* ==========================================================================
   GSAP Registration & Availability Guard
   ========================================================================== */
(function () {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

  gsap.registerPlugin(ScrollTrigger);
  if (typeof ScrollToPlugin !== 'undefined') gsap.registerPlugin(ScrollToPlugin);

  // Ensure DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initGSAPAnimations);
  } else {
    initGSAPAnimations();
  }
})();

/* ==========================================================================
   Helper: build a ScrollTrigger that safely handles already-visible elements
   ========================================================================== */
function safeTrigger(triggerEl, startPos) {
  return {
    trigger: triggerEl,
    start: startPos || 'top 90%',
    once: true,
    // If element is already above the start marker when page loads, play immediately
    onEnter: function () {},
  };
}

function initGSAPAnimations() {

  /* ─────────────────────────────────────────────────────────────────────────
     GSAP Global Defaults
  ───────────────────────────────────────────────────────────────────────── */
  gsap.defaults({ ease: 'power3.out', duration: 0.8 });

  /* ─────────────────────────────────────────────────────────────────────────
     1. NAVBAR — Slide in on page load
  ───────────────────────────────────────────────────────────────────────── */
  const header = document.querySelector('.site-header');
  if (header) {
    gsap.from(header, {
      y: -80,
      opacity: 0,
      duration: 0.65,
      ease: 'power4.out',
      clearProps: 'transform,opacity'
    });
  }

  /* ─────────────────────────────────────────────────────────────────────────
     2. NAV LINKS — stagger on load (desktop only)
  ───────────────────────────────────────────────────────────────────────── */
  if (window.innerWidth > 1024) {
    const navLinks = document.querySelectorAll('.nav-links .nav-link');
    if (navLinks.length) {
      gsap.from(navLinks, {
        y: -10, opacity: 0, stagger: 0.05, duration: 0.4,
        delay: 0.45, ease: 'power2.out', clearProps: 'transform,opacity'
      });
    }
  }

  /* ─────────────────────────────────────────────────────────────────────────
     3. HERO CONTENT (.hero-content layout — index.html style)
  ───────────────────────────────────────────────────────────────────────── */
  const heroContent = document.querySelector('.hero-content');
  if (heroContent) {
    heroContent.querySelectorAll('h1, p, .hero-actions, .hero-metrics, .tag-badge').forEach(el => {
      el.style.animation = 'none';
      el.style.opacity = '1';
    });

    const heroTl = gsap.timeline({ delay: 0.15 });

    const heroBadge = heroContent.querySelector('.tag-badge');
    if (heroBadge) heroTl.from(heroBadge, { y: 18, opacity: 0, duration: 0.45, clearProps: 'transform,opacity' });

    const heroH1 = heroContent.querySelector('h1');
    if (heroH1) {
      const words = heroH1.innerHTML.split(' ');
      heroH1.innerHTML = words
        .map(w => `<span class="gsap-word"><span class="gsap-word-inner">${w}&nbsp;</span></span>`)
        .join('');
      heroTl.from(heroH1.querySelectorAll('.gsap-word-inner'), {
        y: '100%', opacity: 0, stagger: 0.04, duration: 0.6, ease: 'power3.out'
      }, '-=0.1');
    }

    const heroP = heroContent.querySelector('p');
    if (heroP) heroTl.from(heroP, { y: 20, opacity: 0, duration: 0.55, clearProps: 'transform,opacity' }, '-=0.2');

    const heroActions = heroContent.querySelector('.hero-actions');
    if (heroActions) heroTl.from(heroActions.children, { y: 18, opacity: 0, stagger: 0.1, duration: 0.5, clearProps: 'transform,opacity' }, '-=0.25');

    const metricItems = heroContent.querySelectorAll('.metric-item');
    if (metricItems.length) heroTl.from(metricItems, { y: 14, opacity: 0, stagger: 0.08, duration: 0.45, clearProps: 'transform,opacity' }, '-=0.2');
  }

  /* ─────────────────────────────────────────────────────────────────────────
     4. HERO VISUAL
  ───────────────────────────────────────────────────────────────────────── */
  const heroVisual = document.querySelector('.hero-visual');
  if (heroVisual) {
    gsap.from(heroVisual, { x: 55, opacity: 0, duration: 0.95, delay: 0.4, ease: 'power3.out', clearProps: 'transform,opacity' });
  }

  const floatingBadge = document.querySelector('.hero-floating-badge');
  if (floatingBadge) {
    floatingBadge.style.animation = 'none';
    gsap.from(floatingBadge, { x: -35, opacity: 0, scale: 0.85, duration: 0.65, delay: 1.0, ease: 'back.out(1.4)', clearProps: 'transform,opacity' });
    // Persistent gentle float
    gsap.to(floatingBadge, { y: -10, duration: 2.2, ease: 'power1.inOut', yoyo: true, repeat: -1, delay: 1.7 });
  }

  /* ─────────────────────────────────────────────────────────────────────────
     5. HERO (centered section-header style — home2.html, about, services…)
        These are already in the viewport, so animate immediately on load,
        not on scroll.
  ───────────────────────────────────────────────────────────────────────── */
  const heroSectionHeader = document.querySelector('.hero .section-header');
  if (heroSectionHeader) {
    const heroChildren = [
      heroSectionHeader.querySelector('.tag-badge'),
      heroSectionHeader.querySelector('h1, h2'),
      heroSectionHeader.querySelector('p, .lead'),
      ...heroSectionHeader.querySelectorAll('div > .btn, div > a.btn')
    ].filter(Boolean);

    // Reset any stale opacity
    heroChildren.forEach(el => { el.style.opacity = '1'; });

    const heroTl2 = gsap.timeline({ delay: 0.2 });
    heroTl2.from(heroChildren, {
      y: 30, opacity: 0, stagger: 0.12, duration: 0.7,
      ease: 'power3.out', clearProps: 'transform,opacity'
    });
  }

  /* ─────────────────────────────────────────────────────────────────────────
     6. METRIC NUMBER COUNTERS
  ───────────────────────────────────────────────────────────────────────── */
  document.querySelectorAll('.metric-number').forEach(el => {
    const rawText = el.textContent.trim();
    const numMatch = rawText.match(/[\d,.]+/);
    if (!numMatch) return;

    const numStr = numMatch[0].replace(/,/g, '');
    const numVal = parseFloat(numStr);
    if (isNaN(numVal)) return;

    const prefix = rawText.substring(0, rawText.indexOf(numMatch[0]));
    const suffix = rawText.substring(rawText.indexOf(numMatch[0]) + numMatch[0].length);

    const obj = { val: 0 };
    ScrollTrigger.create({
      trigger: el, start: 'top 90%', once: true,
      onEnter: () => {
        gsap.to(obj, {
          val: numVal, duration: 1.8, ease: 'power2.out',
          onUpdate: () => {
            const d = Number.isInteger(numVal) ? Math.round(obj.val).toLocaleString() : obj.val.toFixed(1);
            el.textContent = prefix + d + suffix;
          }
        });
      }
    });
  });

  /* ─────────────────────────────────────────────────────────────────────────
     7. SECTION HEADERS — Scroll-triggered (non-hero ones below the fold)
        KEY FIX: use 'top 100%' so even elements near the top of the page
        trigger as soon as they exist in the DOM scroll area.
  ───────────────────────────────────────────────────────────────────────── */
  document.querySelectorAll('.section-header').forEach(sh => {
    // Skip the hero's own section header (already handled above)
    if (sh.closest('.hero')) return;

    const children = [
      sh.querySelector('.tag-badge'),
      sh.querySelector('h1, h2, h3'),
      sh.querySelector('p, .lead'),
      ...sh.querySelectorAll('.btn, a.btn')
    ].filter(Boolean);

    if (!children.length) return;

    // Ensure elements start visible (prevent flash of invisible content)
    gsap.set(children, { opacity: 0, y: 32 });

    ScrollTrigger.create({
      trigger: sh,
      start: 'top 95%',   // very generous — fires as soon as element is near viewport bottom
      once: true,
      onEnter: () => {
        gsap.to(children, {
          opacity: 1, y: 0, stagger: 0.12, duration: 0.72,
          ease: 'power3.out', clearProps: 'transform,opacity'
        });
      },
      // Also fires if already past start on load
      onEnterBack: () => {
        gsap.to(children, { opacity: 1, y: 0, duration: 0.01, clearProps: 'transform,opacity' });
      }
    });
  });

  /* ─────────────────────────────────────────────────────────────────────────
     8. CARDS — staggered scroll reveal
  ───────────────────────────────────────────────────────────────────────── */
  document.querySelectorAll('.card-grid, .card-grid-4').forEach(grid => {
    const cards = Array.from(grid.querySelectorAll(':scope > .card'));
    if (!cards.length) return;

    gsap.set(cards, { opacity: 0, y: 45, scale: 0.97 });

    ScrollTrigger.create({
      trigger: grid,
      start: 'top 95%',
      once: true,
      onEnter: () => {
        gsap.to(cards, {
          opacity: 1, y: 0, scale: 1,
          stagger: { each: 0.1, from: 'start' },
          duration: 0.68, ease: 'power3.out', clearProps: 'transform,opacity'
        });
      }
    });
  });

  /* ─────────────────────────────────────────────────────────────────────────
     9. KPI CARDS — dashboard entrance
  ───────────────────────────────────────────────────────────────────────── */
  const kpiCards = document.querySelectorAll('.kpi-card');
  if (kpiCards.length) {
    gsap.from(kpiCards, { y: 32, opacity: 0, stagger: 0.09, duration: 0.6, delay: 0.2, clearProps: 'transform,opacity' });

    kpiCards.forEach(card => {
      const valEl = card.querySelector('.kpi-val');
      if (!valEl) return;
      const text = valEl.textContent.trim();
      const m = text.match(/[\d,]+/);
      if (!m) return;
      const numVal = parseFloat(m[0].replace(/,/g, ''));
      if (isNaN(numVal)) return;
      const prefix = text.substring(0, text.indexOf(m[0]));
      const suffix = text.substring(text.indexOf(m[0]) + m[0].length);
      const obj2 = { val: 0 };
      gsap.to(obj2, {
        val: numVal, duration: 1.4, delay: 0.4, ease: 'power2.out',
        onUpdate: () => { valEl.textContent = prefix + Math.round(obj2.val).toLocaleString() + suffix; }
      });
    });
  }

  /* ─────────────────────────────────────────────────────────────────────────
     10. TIMELINE STEPS
  ───────────────────────────────────────────────────────────────────────── */
  const timelineSteps = document.querySelectorAll('.timeline-step');
  if (timelineSteps.length) {
    gsap.set(timelineSteps, { scale: 0.72, opacity: 0 });
    ScrollTrigger.create({
      trigger: '.shipment-timeline',
      start: 'top 90%',
      once: true,
      onEnter: () => {
        gsap.to(timelineSteps, {
          scale: 1, opacity: 1, stagger: 0.14, duration: 0.52,
          ease: 'back.out(1.5)', clearProps: 'transform,opacity'
        });
      }
    });
  }

  /* ─────────────────────────────────────────────────────────────────────────
     11. FOOTER COLUMNS
  ───────────────────────────────────────────────────────────────────────── */
  const footerCols = document.querySelectorAll('.footer-col');
  if (footerCols.length) {
    gsap.set(footerCols, { y: 28, opacity: 0 });
    ScrollTrigger.create({
      trigger: '.site-footer',
      start: 'top 95%',
      once: true,
      onEnter: () => {
        gsap.to(footerCols, { y: 0, opacity: 1, stagger: 0.11, duration: 0.65, ease: 'power3.out', clearProps: 'transform,opacity' });
      }
    });
  }

  /* ─────────────────────────────────────────────────────────────────────────
     12. CALCULATOR BOX
  ───────────────────────────────────────────────────────────────────────── */
  const calcBox = document.querySelector('.calculator-box');
  if (calcBox) {
    gsap.set(calcBox, { y: 40, opacity: 0, scale: 0.97 });
    ScrollTrigger.create({
      trigger: calcBox,
      start: 'top 92%',
      once: true,
      onEnter: () => {
        gsap.to(calcBox, { y: 0, opacity: 1, scale: 1, duration: 0.78, ease: 'power3.out', clearProps: 'transform,opacity' });
      }
    });
  }

  /* ─────────────────────────────────────────────────────────────────────────
     13. PRICING TABLE ROWS
  ───────────────────────────────────────────────────────────────────────── */
  const pricingRows = document.querySelectorAll('table tbody tr');
  if (pricingRows.length) {
    gsap.set(pricingRows, { x: -22, opacity: 0 });
    ScrollTrigger.create({
      trigger: 'table',
      start: 'top 92%',
      once: true,
      onEnter: () => {
        gsap.to(pricingRows, { x: 0, opacity: 1, stagger: 0.07, duration: 0.48, ease: 'power2.out', clearProps: 'transform,opacity' });
      }
    });
  }

  /* ─────────────────────────────────────────────────────────────────────────
     14. MODAL OPEN ANIMATION (scale morph)
  ───────────────────────────────────────────────────────────────────────── */
  const modalOverlay = document.getElementById('catalog-spec-modal');
  if (modalOverlay) {
    const modalContent = modalOverlay.querySelector('.modal-content');
    new MutationObserver(mutations => {
      mutations.forEach(m => {
        if (m.type === 'attributes' && m.attributeName === 'class') {
          if (modalOverlay.classList.contains('active') && modalContent) {
            gsap.fromTo(modalContent,
              { scale: 0.88, opacity: 0, y: 18 },
              { scale: 1, opacity: 1, y: 0, duration: 0.38, ease: 'back.out(1.3)' }
            );
          }
        }
      });
    }).observe(modalOverlay, { attributes: true });
  }

  /* ─────────────────────────────────────────────────────────────────────────
     15. HAMBURGER DRAWER — GSAP slide override
  ───────────────────────────────────────────────────────────────────────── */
  const drawer = document.querySelector('.nav-drawer');
  const backdrop = document.querySelector('.drawer-backdrop');
  const hamburgerBtn = document.querySelector('.hamburger-btn');
  const closeDrawerBtn = document.querySelector('.drawer-close');

  if (drawer && backdrop && hamburgerBtn) {
    drawer.style.transition = 'none';
    backdrop.style.opacity = '0';

    const isRTL = () => document.documentElement.getAttribute('dir') === 'rtl';
    let drawerOpen = false;

    function openGSAPDrawer() {
      if (drawerOpen) return;
      drawerOpen = true;
      drawer.classList.add('active');
      backdrop.classList.add('active');
      document.body.style.overflow = 'hidden';
      gsap.fromTo(drawer, { x: isRTL() ? '-100%' : '100%' }, { x: '0%', duration: 0.36, ease: 'power3.out' });
      gsap.to(backdrop, { opacity: 1, duration: 0.28 });
      const links = drawer.querySelectorAll('.drawer-links li');
      gsap.from(links, { x: isRTL() ? -18 : 18, opacity: 0, stagger: 0.055, duration: 0.32, delay: 0.12, ease: 'power2.out' });
    }

    function closeGSAPDrawer() {
      if (!drawerOpen) return;
      drawerOpen = false;
      gsap.to(drawer, {
        x: isRTL() ? '-100%' : '100%',
        duration: 0.3, ease: 'power3.in',
        onComplete: () => {
          drawer.classList.remove('active');
          backdrop.classList.remove('active');
          document.body.style.overflow = '';
          gsap.set(drawer, { clearProps: 'x' });
        }
      });
      gsap.to(backdrop, { opacity: 0, duration: 0.26 });
    }

    hamburgerBtn.addEventListener('click', openGSAPDrawer);
    if (closeDrawerBtn) closeDrawerBtn.addEventListener('click', closeGSAPDrawer);
    backdrop.addEventListener('click', closeGSAPDrawer);
    document.addEventListener('keydown', e => { if (e.key === 'Escape') closeGSAPDrawer(); });
    drawer.querySelectorAll('.drawer-links a').forEach(a => a.addEventListener('click', closeGSAPDrawer));
  }

  /* ─────────────────────────────────────────────────────────────────────────
     16. MAGNETIC BUTTON HOVER
  ───────────────────────────────────────────────────────────────────────── */
  document.querySelectorAll('.btn-primary').forEach(btn => {
    btn.addEventListener('mouseenter', () => gsap.to(btn, { scale: 1.04, duration: 0.18, ease: 'power1.out' }));
    btn.addEventListener('mouseleave', () => gsap.to(btn, { scale: 1, duration: 0.22, ease: 'power1.inOut' }));
  });

  /* ─────────────────────────────────────────────────────────────────────────
     17. HERO PARALLAX SCROLL
  ───────────────────────────────────────────────────────────────────────── */
  const heroSection = document.querySelector('.hero');
  if (heroSection) {
    gsap.to(heroSection, {
      backgroundPositionY: '18%',
      ease: 'none',
      scrollTrigger: { trigger: heroSection, start: 'top top', end: 'bottom top', scrub: 1.4 }
    });
  }

  /* ─────────────────────────────────────────────────────────────────────────
     18. BLOG ARTICLE sequential reveal
  ───────────────────────────────────────────────────────────────────────── */
  const articleSection = document.querySelector('article.section');
  if (articleSection) {
    const articleTl = gsap.timeline({ delay: 0.18 });
    const articleHeader = articleSection.querySelector('.section-header');
    const heroImg = articleSection.querySelector('.card-img-wrap');
    if (articleHeader) articleTl.from(articleHeader, { y: 26, opacity: 0, duration: 0.62, clearProps: 'transform,opacity' });
    if (heroImg) articleTl.from(heroImg, { y: 22, opacity: 0, scale: 0.98, duration: 0.68, clearProps: 'transform,opacity' }, '-=0.12');
  }

  /* ─────────────────────────────────────────────────────────────────────────
     19. Refresh ScrollTrigger after all animations are set up
        This ensures elements already in view on load are handled correctly.
  ───────────────────────────────────────────────────────────────────────── */
  ScrollTrigger.refresh();
}
