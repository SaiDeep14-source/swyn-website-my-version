/* ═══════════════════════════════════════════════════════════
   SWYN — Main JavaScript
   Handles: sticky nav, hamburger menu, smooth scroll,
   scroll-triggered fade-ins
   ═══════════════════════════════════════════════════════════ */

// ── DOM References ──────────────────────────────────────
const nav = document.getElementById('nav');
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');

// ── Sticky Nav ──────────────────────────────────────────
function handleScroll() {
  if (window.scrollY > 60) {
    nav.classList.add('nav--scrolled');
  } else {
    nav.classList.remove('nav--scrolled');
  }
}

window.addEventListener('scroll', handleScroll, { passive: true });
handleScroll(); // initial check

// ── Hamburger Menu ──────────────────────────────────────
hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('nav__hamburger--open');
  navLinks.classList.toggle('nav__links--open');
});

// Close mobile nav when a link is clicked
navLinks.querySelectorAll('.nav__link').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('nav__hamburger--open');
    navLinks.classList.remove('nav__links--open');
  });
});

// ── Smooth Scroll ───────────────────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const navHeight = nav.offsetHeight;
      const targetPosition = target.getBoundingClientRect().top + window.scrollY - navHeight;
      window.scrollTo({ top: targetPosition, behavior: 'smooth' });
    }
  });
});

// ── Scroll-triggered Fade-in Animations ─────────────────
const fadeElements = document.querySelectorAll('.fade-in');

const fadeObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('fade-in--visible');
        fadeObserver.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.15,
    rootMargin: '0px 0px -40px 0px',
  }
);

fadeElements.forEach((el) => {
  fadeObserver.observe(el);
});

// ── Staggered fade-in for grid items ────────────────────
const staggerContainers = document.querySelectorAll('.stats, .steps, .functions-grid, .bench-stats');

staggerContainers.forEach(container => {
  const children = container.children;
  Array.from(children).forEach((child, index) => {
    child.style.opacity = '0';
    child.style.transform = 'translateY(20px)';
    child.style.transition = `opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${index * 0.12}s, transform 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${index * 0.12}s`;
  });

  const staggerObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          Array.from(entry.target.children).forEach(child => {
            child.style.opacity = '1';
            child.style.transform = 'translateY(0)';
          });
          staggerObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1 }
  );

  staggerObserver.observe(container);
});
