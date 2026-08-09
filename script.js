document.addEventListener('DOMContentLoaded', function () {
  const btn = document.querySelector('.nav-toggle');
  const header = document.querySelector('header');
  const nav = document.getElementById('primary-nav');
  const navLinks = nav ? Array.from(nav.querySelectorAll('a[href^="#"]')) : [];
  const sections = Array.from(document.querySelectorAll('main [id], section[id]'))
    .filter(s => s.id);

  if (btn && header) {
    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      const open = header.classList.toggle('open');
      btn.setAttribute('aria-expanded', String(open));
    });

    // Close nav when clicking a link (mobile)
    navLinks.forEach(link => {
      link.addEventListener('click', function () {
        header.classList.remove('open');
        btn.setAttribute('aria-expanded', 'false');
      });
    });

    // Close nav when clicking outside on small screens
    document.addEventListener('click', function (e) {
      if (!header.classList.contains('open')) return;
      if (!header.contains(e.target)) {
        header.classList.remove('open');
        btn.setAttribute('aria-expanded', 'false');
      }
    });

    // Close nav on Escape
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && header.classList.contains('open')) {
        header.classList.remove('open');
        btn.setAttribute('aria-expanded', 'false');
        btn.focus();
      }
    });
  }

  // Add header shadow when scrolling
  function onScroll() {
    if (!header) return;
    if (window.scrollY > 10) header.classList.add('scrolled');
    else header.classList.remove('scrolled');
  }
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  // Active link on scroll using IntersectionObserver
  if (navLinks.length && sections.length && 'IntersectionObserver' in window) {
    const observerOptions = {
      root: null,
      rootMargin: '0px 0px -40% 0px',
      threshold: 0
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          navLinks.forEach(link => {
            if (link.getAttribute('href') === `#${id}`) {
              link.classList.add('active');
              link.setAttribute('aria-current', 'page');
            } else {
              link.classList.remove('active');
              link.removeAttribute('aria-current');
            }
          });
        }
      });
    }, observerOptions);

    sections.forEach(s => observer.observe(s));
  }
});


// WhatsApp quick-message menu handlers
(function () {
  const WA_PHONE = '67581533028'; // international format, no plus or spaces

  function urlForMessage(text) {
    return `https://wa.me/${WA_PHONE}?text=${encodeURIComponent(text)}`;
  }

  document.addEventListener('DOMContentLoaded', function () {
    const wrap = document.querySelector('.whatsapp-wrap');
    if (!wrap) return;

    const toggle = wrap.querySelector('.whatsapp-btn');
    const menu = document.getElementById('whatsapp-menu');
    const options = Array.from(wrap.querySelectorAll('.whatsapp-option'));

    function openMenu() {
      wrap.classList.add('open');
      menu.setAttribute('aria-hidden', 'false');
      toggle.setAttribute('aria-expanded', 'true');
      // put focus on first option for keyboard users
      const first = menu.querySelector('.whatsapp-option');
      if (first) first.focus();
    }

    function closeMenu() {
      wrap.classList.remove('open');
      menu.setAttribute('aria-hidden', 'true');
      toggle.setAttribute('aria-expanded', 'false');
      toggle.focus();
    }

    // toggle on button click
    toggle.addEventListener('click', function (e) {
      e.stopPropagation();
      if (wrap.classList.contains('open')) closeMenu();
      else openMenu();
    });

    // clicking an option opens WhatsApp in a new tab/window
    options.forEach(btn => {
      btn.addEventListener('click', function (e) {
        const msg = btn.getAttribute('data-msg') || '';
        const url = urlForMessage(msg);
        // open in new tab/window to avoid navigation surprises
        window.open(url, '_blank', 'noopener');
        // close menu after choosing
        closeMenu();
      });
    });

    // close when clicking outside
    document.addEventListener('click', function (e) {
      if (!wrap.classList.contains('open')) return;
      if (!wrap.contains(e.target)) closeMenu();
    });

    // keyboard handling: Escape closes
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && wrap.classList.contains('open')) {
        e.preventDefault();
        closeMenu();
      }
    });

    // keep menu accessible: trap focus inside when open (simple)
    menu.addEventListener('keydown', function (e) {
      if (e.key !== 'Tab') return;
      const focusable = Array.from(menu.querySelectorAll('.whatsapp-option'));
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const active = document.activeElement;

      if (e.shiftKey && active === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && active === last) {
        e.preventDefault();
        first.focus();
      }
    });
  });
})();
