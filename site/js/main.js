(function () {
  'use strict';

  /* ===== mobile nav toggle ===== */
  var navToggle = document.getElementById('navToggle');
  var navLinks = document.getElementById('navLinks');
  if (navToggle && navLinks) {
    navToggle.addEventListener('click', function () {
      var open = navLinks.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    navLinks.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        navLinks.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ===== scattered circles: grow in on scroll ===== */
  var circles = document.querySelectorAll('.motif-circle');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
        }
      });
    }, { threshold: 0.15 });
    circles.forEach(function (c) { io.observe(c); });
  } else {
    circles.forEach(function (c) { c.classList.add('in-view'); });
  }

  /* ===== geo-based pricing: resolved once, reused by the modal whenever it opens ===== */
  var isKenya = false; // default to USD until/unless the lookup says otherwise

  fetch('https://get.geojs.io/v1/ip/country.json')
    .then(function (res) {
      if (!res.ok) throw new Error('geo lookup failed');
      return res.json();
    })
    .then(function (data) {
      isKenya = !!(data && data.country === 'KE');
    })
    .catch(function () {
      isKenya = false; // default to USD on failure/block
    });

  /* ===== services: click/tap opens a shared modal (works identically on desktop and mobile) ===== */
  var modalBackdrop = document.getElementById('modalBackdrop');
  var modalTitle = document.getElementById('modalTitle');
  var modalMoment = document.getElementById('modalMoment');
  var modalIncludes = document.getElementById('modalIncludes');
  var modalPriceLabel = document.getElementById('modalPriceLabel');
  var modalPrice = document.getElementById('modalPrice');
  var modalClose = document.getElementById('modalClose');
  var lastFocused = null;

  function openModal(btn) {
    modalTitle.textContent = btn.getAttribute('data-title') || '';
    modalMoment.textContent = '"' + (btn.getAttribute('data-moment') || '') + '"';
    modalIncludes.textContent = btn.getAttribute('data-includes') || '';
    modalPriceLabel.textContent = btn.getAttribute('data-price-label') || '';
    modalPrice.textContent = isKenya
      ? btn.getAttribute('data-price-ksh')
      : btn.getAttribute('data-price-usd');
    lastFocused = btn;
    modalBackdrop.classList.add('is-open');
    modalClose.focus();
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    modalBackdrop.classList.remove('is-open');
    document.body.style.overflow = '';
    if (lastFocused) lastFocused.focus();
  }

  if (modalBackdrop) {
    document.querySelectorAll('.info-toggle').forEach(function (btn) {
      btn.addEventListener('click', function () { openModal(btn); });
    });
    modalClose.addEventListener('click', closeModal);
    modalBackdrop.addEventListener('click', function (e) {
      if (e.target === modalBackdrop) closeModal();
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && modalBackdrop.classList.contains('is-open')) closeModal();
    });
  }

  /* ===== contact form: friendly inline confirmation on Netlify submit ===== */
  var contactForm = document.getElementById('contactForm');
  var formStatus = document.getElementById('formStatus');
  if (contactForm && formStatus) {
    function handleContactSubmit(e) {
      // Let Netlify handle the actual POST/redirect; if JS fetch fails, native submit still works.
      e.preventDefault();
      var data = new FormData(contactForm);
      fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(data).toString()
      })
        .then(function () {
          formStatus.hidden = false;
          formStatus.textContent = "Sent. I'll reply within 24–72 business hours.";
          contactForm.reset();
        })
        .catch(function () {
          // fall back to a normal form submission
          contactForm.removeEventListener('submit', handleContactSubmit);
          contactForm.submit();
        });
    }
    contactForm.addEventListener('submit', handleContactSubmit);
  }
})();
