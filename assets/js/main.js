/**
 * IndustrialPro Fasteners – Core Application JavaScript
 * Advanced Front-End Engine: Navigation, Theme, RTL, Form Validation, Interactive Calculators
 */

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initRTL();
  initNavigation();
  initFormValidation();
  initSpecCalculator();
  initCatalogModal();
  initBackToTop();
  initFaqAccordion();
});

/* ==========================================================================
   1. Theme Toggle System (Dark / Light Mode)
   ========================================================================== */
function initTheme() {
  const themeToggles = document.querySelectorAll('.btn-theme-toggle');
  const htmlEl = document.documentElement;

  // Retrieve saved preference or system preference
  const savedTheme = localStorage.getItem('industrialpro-theme');
  const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const initialTheme = savedTheme ? savedTheme : (systemPrefersDark ? 'dark' : 'light');

  applyTheme(initialTheme);

  themeToggles.forEach(toggle => {
    toggle.addEventListener('click', () => {
      const currentTheme = htmlEl.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      applyTheme(newTheme);
      localStorage.setItem('industrialpro-theme', newTheme);
    });
  });

  function applyTheme(theme) {
    if (theme === 'dark') {
      htmlEl.setAttribute('data-theme', 'dark');
      updateThemeIcons('ri-sun-line');
    } else {
      htmlEl.removeAttribute('data-theme');
      updateThemeIcons('ri-moon-line');
    }
  }

  function updateThemeIcons(iconClass) {
    themeToggles.forEach(btn => {
      const icon = btn.querySelector('i');
      if (icon) {
        icon.className = iconClass;
      }
    });
  }
}

/* ==========================================================================
   2. RTL Toggle System
   ========================================================================== */
function initRTL() {
  const rtlToggles = document.querySelectorAll('.btn-rtl-toggle');
  const htmlEl = document.documentElement;

  const savedRTL = localStorage.getItem('industrialpro-rtl');
  if (savedRTL === 'true') {
    enableRTL();
  }

  rtlToggles.forEach(btn => {
    btn.addEventListener('click', () => {
      const isRTL = htmlEl.getAttribute('dir') === 'rtl';
      if (isRTL) {
        disableRTL();
      } else {
        enableRTL();
      }
    });
  });

  function enableRTL() {
    htmlEl.setAttribute('dir', 'rtl');
    document.body.classList.add('rtl');
    localStorage.setItem('industrialpro-rtl', 'true');
  }

  function disableRTL() {
    htmlEl.removeAttribute('dir');
    document.body.classList.remove('rtl');
    localStorage.setItem('industrialpro-rtl', 'false');
  }
}

/* ==========================================================================
   3. Navbar & Hamburger Drawer
   ========================================================================== */
function initNavigation() {
  const hamburgerBtn = document.querySelector('.hamburger-btn');
  const drawer = document.querySelector('.nav-drawer');
  const backdrop = document.querySelector('.drawer-backdrop');
  const closeBtn = document.querySelector('.drawer-close');
  const drawerLinks = document.querySelectorAll('.drawer-links a');

  // Sticky header scroll elevation (always run regardless of GSAP)
  const header = document.querySelector('.site-header');
  if (header) {
    window.addEventListener('scroll', () => {
      header.classList.toggle('scrolled', window.scrollY > 20);
    }, { passive: true });
  }

  // If GSAP is loaded it takes over the drawer — skip vanilla binding
  if (typeof gsap !== 'undefined') return;

  if (!hamburgerBtn || !drawer || !backdrop) return;

  function openDrawer() {
    drawer.classList.add('active');
    backdrop.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeDrawer() {
    drawer.classList.remove('active');
    backdrop.classList.remove('active');
    document.body.style.overflow = '';
  }

  hamburgerBtn.addEventListener('click', openDrawer);
  if (closeBtn) closeBtn.addEventListener('click', closeDrawer);
  backdrop.addEventListener('click', closeDrawer);
  drawerLinks.forEach(link => link.addEventListener('click', closeDrawer));
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && drawer.classList.contains('active')) closeDrawer();
  });
}


/* ==========================================================================
   4. Form Validation Engine (Client-side, Accessible, No reload)
   ========================================================================== */
function initFormValidation() {
  const forms = document.querySelectorAll('.validated-form');

  forms.forEach(form => {
    const inputs = form.querySelectorAll('input, select, textarea');

    // Real-time validation on input/blur
    inputs.forEach(input => {
      input.addEventListener('blur', () => validateField(input));
      input.addEventListener('input', () => {
        if (input.classList.contains('is-invalid')) {
          validateField(input);
        }
      });
    });

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      let isValid = true;

      inputs.forEach(input => {
        if (!validateField(input)) {
          isValid = false;
        }
      });

      if (isValid) {
        // Show inline success message
        const successBanner = form.querySelector('.alert-success-banner');
        if (successBanner) {
          successBanner.style.display = 'flex';
          successBanner.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        } else {
          alert('Request submitted successfully! An IndustrialPro engineer will contact you shortly.');
        }

        form.reset();
        inputs.forEach(input => {
          input.classList.remove('is-valid');
          input.classList.remove('is-invalid');
        });
      }
    });
  });

  function validateField(input) {
    const isRequired = input.hasAttribute('required');
    const value = input.value.trim();
    let valid = true;
    let message = '';

    const errorEl = input.parentElement.querySelector('.error-message');

    // Required check
    if (isRequired && !value) {
      valid = false;
      message = 'This field is required.';
    }

    // Email check
    if (valid && input.type === 'email' && value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        valid = false;
        message = 'Please enter a valid business email address.';
      }
    }

    // Password check (min 8 chars)
    if (valid && input.type === 'password' && input.name === 'password' && value) {
      if (value.length < 8) {
        valid = false;
        message = 'Password must be at least 8 characters long.';
      }
    }

    // Confirm password check
    if (valid && input.name === 'confirm_password') {
      const form = input.closest('form');
      const passwordInput = form.querySelector('input[name="password"]');
      if (passwordInput && value !== passwordInput.value) {
        valid = false;
        message = 'Passwords do not match.';
      }
    }

    // Checkbox check (e.g., terms agreement)
    if (isRequired && input.type === 'checkbox' && !input.checked) {
      valid = false;
      message = 'You must accept the terms to proceed.';
    }

    // Apply classes
    if (!valid) {
      input.classList.add('is-invalid');
      input.classList.remove('is-valid');
      if (errorEl) {
        errorEl.textContent = message;
        errorEl.style.display = 'block';
      }
    } else {
      input.classList.remove('is-invalid');
      if (value || input.type === 'checkbox') {
        input.classList.add('is-valid');
      }
      if (errorEl) {
        errorEl.style.display = 'none';
      }
    }

    return valid;
  }
}

/* ==========================================================================
   5. Home 2 Interactive Fastener Spec & Torque Calculator
   ========================================================================== */
function initSpecCalculator() {
  const gradeSelect = document.getElementById('calc-grade');
  const diaSelect = document.getElementById('calc-dia');
  const condSelect = document.getElementById('calc-condition');

  if (!gradeSelect || !diaSelect) return;

  const proofResult = document.getElementById('calc-proof-load');
  const tensileResult = document.getElementById('calc-tensile-strength');
  const torqueResult = document.getElementById('calc-torque');

  // Engineering calculation database
  const gradeData = {
    'grade2': { tensile: 74000, proofRatio: 0.75, name: 'SAE Grade 2 (Low Carbon)' },
    'grade5': { tensile: 120000, proofRatio: 0.71, name: 'SAE Grade 5 (Medium Carbon Q&T)' },
    'grade8': { tensile: 150000, proofRatio: 0.80, name: 'SAE Grade 8 (Alloy Steel Q&T)' },
    'a325':   { tensile: 120000, proofRatio: 0.70, name: 'ASTM A325 (Structural Steel)' },
    'b7':     { tensile: 125000, proofRatio: 0.84, name: 'ASTM A193 B7 (High Temp/Pressure)' },
    'ss316':  { tensile: 85000,  proofRatio: 0.65, name: 'AISI 316 Stainless (Marine)' }
  };

  const diaData = {
    '0.25':   { area: 0.0318, nominal: 0.25 },
    '0.375':  { area: 0.0775, nominal: 0.375 },
    '0.5':    { area: 0.1419, nominal: 0.5 },
    '0.625':  { area: 0.226,  nominal: 0.625 },
    '0.75':   { area: 0.334,  nominal: 0.75 },
    '1.0':    { area: 0.606,  nominal: 1.0 },
    '1.25':   { area: 0.969,  nominal: 1.25 }
  };

  function calculate() {
    const grade = gradeSelect.value;
    const dia = diaSelect.value;
    const condition = condSelect ? condSelect.value : 'plain';

    const gInfo = gradeData[grade] || gradeData['grade8'];
    const dInfo = diaData[dia] || diaData['0.5'];

    // K-factor for torque equation: T = K * D * P
    // Plain steel K ≈ 0.20, Lubricated / Cadmium K ≈ 0.15
    const kFactor = condition === 'lubricated' ? 0.15 : 0.20;

    const tensilePsi = gInfo.tensile;
    const proofLoadLbs = Math.round(tensilePsi * gInfo.proofRatio * dInfo.area);
    const targetClampLoad = proofLoadLbs * 0.75; // 75% proof load
    const torqueFtLbs = Math.round((kFactor * (dInfo.nominal / 12) * targetClampLoad));

    if (proofResult) proofResult.textContent = proofLoadLbs.toLocaleString() + ' lbs';
    if (tensileResult) tensileResult.textContent = tensilePsi.toLocaleString() + ' PSI';
    if (torqueResult) torqueResult.textContent = torqueFtLbs.toLocaleString() + ' ft-lbs';
  }

  gradeSelect.addEventListener('change', calculate);
  diaSelect.addEventListener('change', calculate);
  if (condSelect) condSelect.addEventListener('change', calculate);

  calculate();
}

/* ==========================================================================
   6. Catalog Spec Modal Quick View
   ========================================================================== */
function initCatalogModal() {
  const modalOverlay = document.getElementById('catalog-spec-modal');
  const closeBtn = document.querySelector('.modal-close');
  const specTriggers = document.querySelectorAll('.btn-view-specs');

  if (!modalOverlay) return;

  specTriggers.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const partName = btn.dataset.part || 'Industrial Fastener Spec';
      const partStandard = btn.dataset.standard || 'ASTM A325 / ISO 4014';
      const partMaterial = btn.dataset.material || 'Alloy Steel, Hot-Dip Galvanized';

      const titleEl = modalOverlay.querySelector('#modal-part-title');
      const standardEl = modalOverlay.querySelector('#modal-part-standard');
      const materialEl = modalOverlay.querySelector('#modal-part-material');

      if (titleEl) titleEl.textContent = partName;
      if (standardEl) standardEl.textContent = partStandard;
      if (materialEl) materialEl.textContent = partMaterial;

      modalOverlay.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  });

  function closeModal() {
    modalOverlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) closeModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalOverlay.classList.contains('active')) {
      closeModal();
    }
  });
}

/* ==========================================================================
   7. Back To Top Button
   ========================================================================== */
function initBackToTop() {
  const btn = document.getElementById('back-to-top');
  if (!btn) return;

  const SHOW_AFTER = 320; // px scrolled before button appears

  // Use GSAP if available, otherwise fall back to CSS class toggle
  function showBtn() {
    if (typeof gsap !== 'undefined') {
      gsap.to(btn, { opacity: 1, y: 0, scale: 1, duration: 0.38, ease: 'back.out(1.5)', pointerEvents: 'auto' });
    } else {
      btn.classList.add('visible');
    }
  }

  function hideBtn() {
    if (typeof gsap !== 'undefined') {
      gsap.to(btn, { opacity: 0, y: 18, scale: 0.85, duration: 0.28, ease: 'power2.in', pointerEvents: 'none' });
    } else {
      btn.classList.remove('visible');
    }
  }

  // Scroll listener — show/hide with passive flag for performance
  let isVisible = false;
  window.addEventListener('scroll', () => {
    const shouldShow = window.scrollY > SHOW_AFTER;
    if (shouldShow && !isVisible) { isVisible = true; showBtn(); }
    else if (!shouldShow && isVisible) { isVisible = false; hideBtn(); }
  }, { passive: true });

  // Click — smooth scroll to top
  btn.addEventListener('click', () => {
    if (typeof gsap !== 'undefined') {
      gsap.to(window, { scrollTo: 0, duration: 0.9, ease: 'power3.inOut' });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  });
}

/* ==========================================================================
   8. FAQ Accordion System
   ========================================================================== */
function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');
  if (!faqItems.length) return;

  faqItems.forEach(item => {
    item.addEventListener('toggle', () => {
      if (item.open) {
        // Optional smooth accordion behavior: collapse others when one opens
        faqItems.forEach(otherItem => {
          if (otherItem !== item && otherItem.open) {
            otherItem.open = false;
          }
        });
      }
    });
  });
}

