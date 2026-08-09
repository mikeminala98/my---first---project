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
