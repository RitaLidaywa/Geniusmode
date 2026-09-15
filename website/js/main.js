/* ==========================================================================
   Tiri — shared behaviour
   ========================================================================== */

(function () {
  'use strict';

  /* ---------- Theme toggle ---------- */
  function readStoredTheme() {
    try {
      return localStorage.getItem('tiri-theme');
    } catch (e) {
      return null;
    }
  }

  function writeStoredTheme(theme) {
    try {
      localStorage.setItem('tiri-theme', theme);
    } catch (e) {
      /* storage unavailable (private mode, sandboxed preview, etc.) */
    }
  }

  var RAY_COUNT = 8;

  function buildRays(toggle) {
    for (var i = 0; i < RAY_COUNT; i++) {
      var ray = document.createElement('span');
      ray.className = 'ray';
      ray.style.setProperty('--angle', (i * (360 / RAY_COUNT)) + 'deg');
      ray.style.setProperty('--i', i);
      toggle.appendChild(ray);
    }
  }

  function playBeam(toggle, direction) {
    var prefersReduced = window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    var beamClass = direction === 'light' ? 'beaming-out' : 'beaming-in';
    toggle.classList.remove('beaming-out', 'beaming-in');
    // Force reflow so the animation replays even if the same class was just used.
    void toggle.offsetWidth;
    toggle.classList.add(beamClass);
    setTimeout(function () {
      toggle.classList.remove(beamClass);
    }, 900);
  }

  function initTheme() {
    var root = document.documentElement;
    var toggle = document.querySelector('.theme-toggle');
    // Light is the default brand experience; dark mode is opt-in only,
    // so this never falls back to the OS/browser color-scheme preference.
    var theme = readStoredTheme() === 'dark' ? 'dark' : 'light';
    root.setAttribute('data-theme', theme);

    if (toggle) {
      buildRays(toggle);

      toggle.addEventListener('click', function () {
        var current = root.getAttribute('data-theme');
        var next = current === 'dark' ? 'light' : 'dark';
        root.setAttribute('data-theme', next);
        writeStoredTheme(next);
        playBeam(toggle, next);
      });
    }
  }

  /* ---------- Nav dropdowns (Services, Pata Studio) ---------- */
  function initDropdowns() {
    var items = document.querySelectorAll('.nav-item.has-dropdown');
    if (!items.length) return;

    function closeAll(except) {
      items.forEach(function (item) {
        if (item !== except) {
          item.classList.remove('open');
          var toggle = item.querySelector('.dropdown-toggle');
          if (toggle) toggle.setAttribute('aria-expanded', 'false');
        }
      });
    }

    items.forEach(function (item) {
      var toggle = item.querySelector('.dropdown-toggle');
      if (!toggle) return;

      toggle.addEventListener('click', function (e) {
        e.stopPropagation();
        var isOpen = item.classList.contains('open');
        closeAll(item);
        item.classList.toggle('open', !isOpen);
        toggle.setAttribute('aria-expanded', String(!isOpen));
      });
    });

    document.addEventListener('click', function () {
      closeAll(null);
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeAll(null);
    });
  }

  /* ---------- Mobile hamburger menu ---------- */
  function initHamburger() {
    var hamburger = document.querySelector('.hamburger');
    var links = document.querySelector('.nav-links');
    if (!hamburger || !links) return;

    hamburger.addEventListener('click', function () {
      hamburger.classList.toggle('open');
      links.classList.toggle('open');
    });

    links.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        hamburger.classList.remove('open');
        links.classList.remove('open');
      });
    });
  }

  /* ---------- Typewriter effect (runs once per page load, short lines only) ---------- */
  function typewrite(el, speed) {
    var text = el.getAttribute('data-text') || el.textContent;
    el.textContent = '';
    el.setAttribute('data-text', text);

    var cursor = document.createElement('span');
    cursor.className = 'typewriter-cursor';
    cursor.textContent = ' ';

    var i = 0;
    function step() {
      if (i <= text.length) {
        el.textContent = text.slice(0, i);
        el.appendChild(cursor);
        i++;
        setTimeout(step, speed);
      } else {
        cursor.style.height = '1em';
      }
    }
    step();
  }

  function initTypewriters() {
    var els = document.querySelectorAll('[data-typewriter]');
    els.forEach(function (el, idx) {
      setTimeout(function () {
        typewrite(el, 38);
      }, idx * 120 + 200);
    });
  }

  /* ---------- Scroll fade-in ---------- */
  function initFadeIn() {
    var items = document.querySelectorAll('.fade-in');
    if (!('IntersectionObserver' in window)) {
      items.forEach(function (el) { el.classList.add('visible'); });
      return;
    }
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });

    items.forEach(function (el) { observer.observe(el); });
  }

  /* ---------- Back to top ---------- */
  function initBackToTop() {
    var btn = document.querySelector('.back-to-top');
    if (!btn) return;
    window.addEventListener('scroll', function () {
      if (window.scrollY > 500) {
        btn.classList.add('show');
      } else {
        btn.classList.remove('show');
      }
    });
    btn.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ---------- Portfolio carousel ---------- */
  function initCarousel() {
    var track = document.querySelector('.carousel');
    var prev = document.querySelector('.carousel-controls .prev');
    var next = document.querySelector('.carousel-controls .next');
    if (!track) return;

    function scrollAmount() {
      var card = track.querySelector('.carousel-card');
      return card ? card.offsetWidth + 24 : 300;
    }

    if (prev) prev.addEventListener('click', function () {
      track.scrollBy({ left: -scrollAmount(), behavior: 'smooth' });
    });
    if (next) next.addEventListener('click', function () {
      track.scrollBy({ left: scrollAmount(), behavior: 'smooth' });
    });
  }

  /* ---------- Lightbox gallery ---------- */
  function initLightbox() {
    var images = Array.prototype.slice.call(document.querySelectorAll('.gallery img'));
    var overlay = document.querySelector('.lightbox-overlay');
    if (!images.length || !overlay) return;

    var overlayImg = overlay.querySelector('img');
    var closeBtn = overlay.querySelector('.lightbox-close');
    var prevBtn = overlay.querySelector('.lightbox-prev');
    var nextBtn = overlay.querySelector('.lightbox-next');
    var currentIndex = 0;

    function show(index) {
      currentIndex = (index + images.length) % images.length;
      overlayImg.src = images[currentIndex].src;
      overlayImg.alt = images[currentIndex].alt;
      overlay.classList.add('open');
    }

    function close() {
      overlay.classList.remove('open');
    }

    images.forEach(function (img, index) {
      img.addEventListener('click', function () { show(index); });
    });

    if (closeBtn) closeBtn.addEventListener('click', close);
    if (prevBtn) prevBtn.addEventListener('click', function () { show(currentIndex - 1); });
    if (nextBtn) nextBtn.addEventListener('click', function () { show(currentIndex + 1); });

    overlay.addEventListener('click', function (e) {
      if (e.target === overlay) close();
    });

    document.addEventListener('keydown', function (e) {
      if (!overlay.classList.contains('open')) return;
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowLeft') show(currentIndex - 1);
      if (e.key === 'ArrowRight') show(currentIndex + 1);
    });
  }

  /* ---------- Contact form validation ---------- */
  function initContactForm() {
    var form = document.querySelector('.contact-form');
    if (!form) return;

    var status = form.querySelector('.form-status');

    function setError(field, message) {
      var group = field.closest('.form-group');
      var errorEl = group ? group.querySelector('.error-msg') : null;
      if (errorEl) errorEl.textContent = message || '';
    }

    function validateField(field) {
      var value = field.value.trim();
      if (field.hasAttribute('required') && !value) {
        setError(field, 'This field is required.');
        return false;
      }
      if (field.type === 'email' && value) {
        var re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!re.test(value)) {
          setError(field, 'Enter a valid email address.');
          return false;
        }
      }
      setError(field, '');
      return true;
    }

    form.querySelectorAll('input, textarea, select').forEach(function (field) {
      field.addEventListener('blur', function () { validateField(field); });
    });

    form.addEventListener('submit', function (e) {
      var fields = form.querySelectorAll('input, textarea, select');
      var valid = true;
      fields.forEach(function (field) {
        if (!validateField(field)) valid = false;
      });

      if (!valid) {
        e.preventDefault();
        if (status) {
          status.textContent = 'Please fix the highlighted fields.';
          status.className = 'form-status error';
        }
        return;
      }

      // Netlify Forms handles the actual submission via form action/data-netlify.
      // For environments without a live Netlify deploy, prevent default and show a message.
      if (form.getAttribute('data-demo-mode') === 'true') {
        e.preventDefault();
        if (status) {
          status.textContent = 'Thanks. I read every message myself and reply within two business days.';
          status.className = 'form-status success';
        }
        form.reset();
      }
    });
  }

  /* ---------- Pricing currency detection ---------- */
  function initPricing() {
    var tables = document.querySelectorAll('[data-pricing-table]');
    if (!tables.length) return;

    var toggleButtons = document.querySelectorAll('.currency-toggle button');

    function setCurrency(currency) {
      document.querySelectorAll('[data-ksh]').forEach(function (el) {
        var value = currency === 'KES' ? el.getAttribute('data-ksh') : el.getAttribute('data-usd');
        el.textContent = value;
      });
      toggleButtons.forEach(function (btn) {
        btn.classList.toggle('active', btn.getAttribute('data-currency') === currency);
      });
      localStorage.setItem('tiri-currency', currency);
    }

    toggleButtons.forEach(function (btn) {
      btn.addEventListener('click', function () {
        setCurrency(btn.getAttribute('data-currency'));
      });
    });

    var stored = localStorage.getItem('tiri-currency');
    if (stored) {
      setCurrency(stored);
      return;
    }

    fetch('https://get.geojs.io/v1/ip/country.json')
      .then(function (res) {
        if (!res.ok) throw new Error('geo lookup failed');
        return res.json();
      })
      .then(function (data) {
        var currency = data && data.country === 'KE' ? 'KES' : 'USD';
        setCurrency(currency);
      })
      .catch(function () {
        setCurrency('USD');
      });
  }

  document.addEventListener('DOMContentLoaded', function () {
    initTheme();
    initDropdowns();
    initHamburger();
    initTypewriters();
    initFadeIn();
    initBackToTop();
    initCarousel();
    initLightbox();
    initContactForm();
    initPricing();
  });
})();
