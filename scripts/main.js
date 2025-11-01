document.addEventListener('DOMContentLoaded', () => {
  if (window.lucide?.createIcons) {
    window.lucide.createIcons();
  }

  const header = document.getElementById('header');
  const mobileMenu = document.getElementById('mobile-menu');
  const mobileMenuButton = document.getElementById('mobile-menu-button');
  const themeToggle = document.getElementById('theme-toggle');
  const themeToggleMobile = document.getElementById('theme-toggle-mobile');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('main section');

  // Theme
  const applyTheme = (theme) => {
    const isDark = theme === 'dark';
    document.documentElement.classList.toggle('dark-mode', isDark);

    const ids = ['theme-icon-light', 'theme-icon-dark', 'theme-icon-light-mobile', 'theme-icon-dark-mobile'];
    const [light, dark, lightM, darkM] = ids.map(id => document.getElementById(id));

    if (light && dark) {
      light.classList.toggle('hidden', isDark);
      dark.classList.toggle('hidden', !isDark);
    }
    if (lightM && darkM) {
      lightM.classList.toggle('hidden', isDark);
      darkM.classList.toggle('hidden', !isDark);
    }
  };

  const getPreferredTheme = () => {
    const stored = localStorage.getItem('theme');
    if (stored) return stored;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  };

  const setTheme = (theme) => {
    localStorage.setItem('theme', theme);
    applyTheme(theme);
  };

  applyTheme(getPreferredTheme());

  const toggleTheme = () => {
    const isDark = document.documentElement.classList.contains('dark-mode');
    setTheme(isDark ? 'light' : 'dark');
  };

  themeToggle?.addEventListener('click', toggleTheme);
  themeToggleMobile?.addEventListener('click', toggleTheme);

  // Mobile menu
  mobileMenuButton?.addEventListener('click', () => {
    mobileMenu.classList.toggle('hidden');
  });

  mobileMenu?.addEventListener('click', (e) => {
    if (e.target.classList.contains('mobile-menu-link')) {
      mobileMenu.classList.add('hidden');
    }
  });

  // Header scroll effect
  const updateHeader = () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };
  updateHeader();
  window.addEventListener('scroll', updateHeader, { passive: true });

  // Active nav link
  const observerOptions = { root: null, rootMargin: '0px', threshold: 0.5 };
  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          const id = link.getAttribute('href')?.replace('#', '');
          if (id === entry.target.id) link.classList.add('active');
        });
      }
    });
  }, observerOptions);

  sections.forEach(section => sectionObserver.observe(section));

  // Fade in animations
  const fadeElements = document.querySelectorAll('.glass-card, .project-card, .skill-pill');
  const fadeObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('fade-in');
      }
    });
  }, { threshold: 0.1 });

  fadeElements.forEach(el => fadeObserver.observe(el));

  // Initialize game
  if (typeof window.initGameUI === 'function') {
    window.initGameUI();
  }
});