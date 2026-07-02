// Nelson Kuo — nav drawer, scroll reveals, section-title character roll.
// All decorative motion is gated behind prefers-reduced-motion.

(function () {
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- nav drawer ---------- */

  var toggle = document.querySelector('.nav-toggle');
  var drawer = document.querySelector('.nav-drawer');
  var overlay = document.querySelector('.nav-overlay');

  function setNav(open) {
    toggle.classList.toggle('is-open', open);
    drawer.classList.toggle('is-open', open);
    overlay.classList.toggle('is-open', open);
    overlay.hidden = false;
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Close navigation menu' : 'Open navigation menu');
  }

  toggle.addEventListener('click', function () {
    setNav(!drawer.classList.contains('is-open'));
  });

  overlay.addEventListener('click', function () { setNav(false); });

  drawer.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', function () { setNav(false); });
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') setNav(false);
  });

  /* ---------- in-page anchor scrolling ---------- */

  document.querySelectorAll('a[href^="#"]').forEach(function (link) {
    link.addEventListener('click', function (e) {
      var target = document.querySelector(link.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      history.pushState(null, '', link.getAttribute('href'));
      target.scrollIntoView({ behavior: reduceMotion ? 'instant' : 'smooth' });
    });
  });

  /* ---------- section-title character roll ---------- */

  if (!reduceMotion) {
    document.querySelectorAll('[data-roll]').forEach(function (title) {
      var text = title.textContent;
      title.textContent = '';
      title.setAttribute('aria-label', text);
      Array.prototype.forEach.call(text, function (ch, i) {
        if (ch === ' ') {
          title.appendChild(document.createTextNode(' '));
          return;
        }
        var clip = document.createElement('span');
        clip.className = 'char-clip';
        clip.setAttribute('aria-hidden', 'true');
        var inner = document.createElement('span');
        inner.className = 'char-inner';
        inner.style.setProperty('--char-index', i);
        var a = document.createElement('span');
        a.textContent = ch;
        var b = document.createElement('span');
        b.textContent = ch;
        inner.appendChild(a);
        inner.appendChild(b);
        clip.appendChild(inner);
        title.appendChild(clip);
      });
    });
  }

  /* ---------- scroll reveals ---------- */

  var reveals = document.querySelectorAll('.reveal');

  if (reduceMotion || !('IntersectionObserver' in window)) {
    reveals.forEach(function (el) { el.classList.add('in'); });
    return;
  }

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('in');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });

  reveals.forEach(function (el) { observer.observe(el); });
})();
