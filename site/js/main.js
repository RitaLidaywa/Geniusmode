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

  /* ===== services: tap/click to toggle info panels (mobile tap, desktop keyboard/click) ===== */
  document.querySelectorAll('.info-toggle').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var panel = btn.parentElement.querySelector('.info-panel');
      var isOpen = panel.classList.contains('is-open');

      // close any other open panels
      document.querySelectorAll('.info-panel.is-open').forEach(function (p) {
        if (p !== panel) {
          p.classList.remove('is-open');
          var otherBtn = p.parentElement.querySelector('.info-toggle');
          if (otherBtn) otherBtn.setAttribute('aria-expanded', 'false');
        }
      });

      panel.classList.toggle('is-open', !isOpen);
      btn.setAttribute('aria-expanded', String(!isOpen));
    });
  });

  /* ===== geo-based pricing ===== */
  var priceEls = document.querySelectorAll('[data-ksh]');

  function applyCurrency(isKenya) {
    priceEls.forEach(function (el) {
      var val = isKenya ? el.getAttribute('data-ksh') : el.getAttribute('data-usd');
      el.textContent = val || el.getAttribute('data-usd') || '';
    });
  }

  // default to USD immediately so nothing is ever blank while the fetch resolves
  applyCurrency(false);

  fetch('https://get.geojs.io/v1/ip/country.json')
    .then(function (res) {
      if (!res.ok) throw new Error('geo lookup failed');
      return res.json();
    })
    .then(function (data) {
      var isKenya = data && data.country === 'KE';
      applyCurrency(isKenya);
    })
    .catch(function () {
      applyCurrency(false); // default to USD on failure/block
    });

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
