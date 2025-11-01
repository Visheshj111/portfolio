document.addEventListener('DOMContentLoaded', () => {
  // Wait for all scripts to load
  setTimeout(() => {
    if (window.lucide?.createIcons) {
      window.lucide.createIcons();
    }
  }, 100);

  const themeToggle = document.getElementById('theme-toggle');
  const sections = document.querySelectorAll('section[id]');

  // Theme
  const applyTheme = (theme) => {
    const isDark = theme === 'dark';
    document.documentElement.classList.toggle('dark-mode', isDark);

    const ids = ['theme-icon-light', 'theme-icon-dark'];
    const [light, dark] = ids.map(id => document.getElementById(id));

    if (light && dark) {
      light.classList.toggle('hidden', isDark);
      dark.classList.toggle('hidden', !isDark);
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

  // Initialize game UI - with retry logic
  const initGame = () => {
    if (typeof window.initGameUI === 'function') {
      try {
        window.initGameUI();
        console.log('Game initialized successfully');
      } catch (error) {
        console.error('Error initializing game:', error);
      }
    } else {
      console.log('Game not ready, retrying...');
      setTimeout(initGame, 200);
    }
  };

  // Wait a bit for game script to load
  setTimeout(initGame, 300);
});