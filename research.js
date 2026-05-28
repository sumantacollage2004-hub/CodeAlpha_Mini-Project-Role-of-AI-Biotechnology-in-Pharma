/* ===== research.js ===== */

document.addEventListener('DOMContentLoaded', () => {

  /* ── 1. Print / Save-as-PDF button ── */
  const btn = document.createElement('button');
  btn.id = 'print-btn';
  btn.textContent = '⬇  Save as PDF';
  btn.addEventListener('click', () => window.print());
  document.body.appendChild(btn);

  /* ── 2. Animate stat counters on scroll ── */
  const counters = document.querySelectorAll('[data-count]');

  const animateCount = (el) => {
    const target = parseFloat(el.dataset.count);
    const isFloat = el.dataset.count.includes('.');
    const suffix  = el.dataset.suffix || '';
    const prefix  = el.dataset.prefix || '';
    const duration = 1400;
    const start   = performance.now();

    const tick = (now) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);   // ease-out-cubic
      const value = target * ease;

      el.textContent = prefix + (isFloat ? value.toFixed(1) : Math.round(value)) + suffix;

      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };

  if ('IntersectionObserver' in window) {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          animateCount(e.target);
          obs.unobserve(e.target);
        }
      });
    }, { threshold: 0.5 });
    counters.forEach(c => obs.observe(c));
  } else {
    counters.forEach(c => animateCount(c));
  }

  /* ── 3. Dynamic year in footer ── */
  document.querySelectorAll('.current-year').forEach(el => {
    el.textContent = new Date().getFullYear();
  });

  /* ── 4. Smooth fade-in for content sections ── */
  const sections = document.querySelectorAll('.section-heading, .callout, .stat-card, .data-table-wrap, .pull-quote');

  if ('IntersectionObserver' in window) {
    const fadeObs = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.style.opacity = '1';
          e.target.style.transform = 'translateY(0)';
          fadeObs.unobserve(e.target);
        }
      });
    }, { threshold: 0.1 });

    sections.forEach(s => {
      s.style.opacity = '0';
      s.style.transform = 'translateY(22px)';
      s.style.transition = 'opacity .55s ease, transform .55s ease';
      fadeObs.observe(s);
    });
  }

  /* ── 5. TOC active highlight on scroll ── */
  const headings = document.querySelectorAll('h2[id]');
  const tocLinks  = document.querySelectorAll('.toc-list a');

  if (tocLinks.length && 'IntersectionObserver' in window) {
    const tocObs = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          tocLinks.forEach(l => l.classList.remove('active'));
          const active = document.querySelector(`.toc-list a[href="#${e.target.id}"]`);
          if (active) active.classList.add('active');
        }
      });
    }, { rootMargin: '-30% 0px -60% 0px' });

    headings.forEach(h => tocObs.observe(h));
  }

});
