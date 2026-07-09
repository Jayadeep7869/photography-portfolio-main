// ================================================
//  Photography Portfolio — Main JS
//  Global behavior: navbar, scroll animations
// ================================================

// Load feature activation engine dynamically if needed
if (!window.FeatureActivation) {
  const script = document.createElement('script');
  const pathPrefix = window.location.pathname.includes('/photographer/') ? '../' : './';
  script.src = `${pathPrefix}js/activation.js`;
  document.head.appendChild(script);
}

document.addEventListener('DOMContentLoaded', () => {

  // ── 1. Navbar scroll effect ──────────────────
  const navbar = document.querySelector('.navbar');
  if (navbar) {
    const onScroll = () => {
      navbar.classList.toggle('scrolled', window.scrollY > 60);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll(); // run once on load
  }

  // ── 2. Mobile hamburger menu ─────────────────
  const hamburger = document.getElementById('hamburger');
  const mobileNav = document.getElementById('mobile-nav');

  if (hamburger && mobileNav) {
    hamburger.addEventListener('click', () => {
      const open = mobileNav.classList.toggle('open');
      hamburger.classList.toggle('open', open);
      document.body.style.overflow = open ? 'hidden' : '';
    });

    // Close mobile nav when a link is clicked
    mobileNav.querySelectorAll('a, button').forEach(el => {
      el.addEventListener('click', () => {
        mobileNav.classList.remove('open');
        hamburger.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  // ── 3. Fade-in on scroll (IntersectionObserver) ──
  const fadeEls = document.querySelectorAll('.fade-in');
  if (fadeEls.length > 0 && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target); // fire once
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );
    fadeEls.forEach(el => observer.observe(el));
  } else {
    // Fallback: just show everything
    fadeEls.forEach(el => el.classList.add('visible'));
  }

  // ── 4. Smooth scroll for anchor links ────────
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const href = anchor.getAttribute('href');
      if (href === '#' || href === '#!') return;
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // ── 5. Active nav link highlighter ───────────
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-center a').forEach(link => {
    const linkPage = link.getAttribute('href');
    if (linkPage && linkPage.includes(currentPage)) {
      link.style.color = 'var(--accent)';
    }
  });

  // ── 6. Animated counter for stats strip ──────
  const statValues = document.querySelectorAll('.strip-stat-value[data-count]');
  if (statValues.length > 0 && 'IntersectionObserver' in window) {
    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          counterObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    statValues.forEach(el => counterObserver.observe(el));
  }

  function animateCounter(el) {
    const target = parseInt(el.dataset.count, 10);
    const suffix = el.dataset.suffix || '';
    const duration = 1800;
    const start = performance.now();

    const update = (now) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      el.textContent = Math.round(eased * target) + suffix;
      if (progress < 1) requestAnimationFrame(update);
    };

    requestAnimationFrame(update);
  }

  // Intercept dashboard links for guests
  document.querySelectorAll('a[href*="dashboard.html"]').forEach(link => {
    link.addEventListener('click', (e) => {
      if (window.Auth && !Auth.isLoggedIn()) {
        e.preventDefault();
        if (window.FeatureActivation) {
          FeatureActivation.showGate('dashboard');
        } else {
          window.location.href = link.href;
        }
      }
    });
  });

});

// Global Toast Notification Helper
window.showToast = function(message) {
  let toast = document.getElementById('toast-notification');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toast-notification';
    toast.className = 'toast-msg';
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.classList.add('show');
  setTimeout(() => {
    toast.classList.remove('show');
  }, 3000);
};

// polished
