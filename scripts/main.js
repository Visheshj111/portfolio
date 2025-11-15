document.addEventListener('DOMContentLoaded', () => {
  // Wait for all scripts to load
  setTimeout(() => {
    if (window.lucide?.createIcons) {
      window.lucide.createIcons();
    }
  }, 100);

  const themeToggle = document.getElementById('theme-toggle');
  const themeTransition = document.getElementById('theme-transition');
  const sections = document.querySelectorAll('section[id]');
  let isTransitioning = false;

  // Theme Toggle with Radial Transition
  const applyTheme = (theme) => {
    if (theme === 'light') {
      document.body.classList.add('light-mode');
    } else {
      document.body.classList.remove('light-mode');
    }
  };

  const getPreferredTheme = () => {
    const stored = localStorage.getItem('theme');
    if (stored) return stored;
    // Default to dark mode
    return 'dark';
  };

  const setTheme = (theme) => {
    localStorage.setItem('theme', theme);
    applyTheme(theme);
  };

  // Apply initial theme
  applyTheme(getPreferredTheme());

  const toggleThemeWithTransition = (event) => {
    if (isTransitioning) return;
    
    isTransitioning = true;
    const isLight = document.body.classList.contains('light-mode');
    const newTheme = isLight ? 'dark' : 'light';
    
    // Get button position
    const rect = themeToggle.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;
    
    // Set ripple origin and color
    const newBgColor = newTheme === 'dark' ? '#0a0a0f' : '#f8f9fa';
    themeTransition.style.setProperty('--ripple-x', `${x}px`);
    themeTransition.style.setProperty('--ripple-y', `${y}px`);
    themeTransition.style.setProperty('--ripple-color', newBgColor);
    
    // Change theme immediately so colors transition smoothly
    setTheme(newTheme);
    
    // Start ripple animation
    themeTransition.classList.add('transitioning');
    
    // Cleanup after animation
    setTimeout(() => {
      themeTransition.classList.remove('transitioning');
      isTransitioning = false;
    }, 850);
  };

  themeToggle?.addEventListener('click', toggleThemeWithTransition);
  
  // Keyboard support
  themeToggle?.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      toggleThemeWithTransition(e);
    }
  });

  // Simple digit counter helpers for GitHub stats
  function renderCounter(container, value) {
    const targetStr = String(Math.max(0, Math.floor(value)));
    const length = targetStr.length;
    container.innerHTML = '';

    // Build all digits starting at 0 so we can animate up
    for (let i = 0; i < length; i++) {
      const digitEl = document.createElement('div');
      digitEl.className = 'counter-digit';

      const strip = document.createElement('div');
      strip.className = 'counter-strip';

      for (let n = 0; n < 10; n++) {
        const span = document.createElement('span');
        span.textContent = n;
        strip.appendChild(span);
      }

      // start at 0 position
      strip.style.transform = 'translateY(0em)';

      digitEl.appendChild(strip);
      container.appendChild(digitEl);
    }

    // initial state: all zeros
    container.dataset.value = '0'.repeat(length);

    // animate to target on next frame
    requestAnimationFrame(() => {
      animateCounter(container, targetStr);
    });
  }

  function animateCounter(container, value) {
    const oldStr = container.dataset.value || '0';
    const newStr = typeof value === 'string'
      ? value
      : String(Math.max(0, Math.floor(value)));

    if (oldStr.length !== newStr.length) {
      renderCounter(container, newStr);
      return;
    }

    const strips = container.querySelectorAll('.counter-digit .counter-strip');
    for (let i = 0; i < newStr.length; i++) {
      const digit = parseInt(newStr[i], 10) || 0;
      const strip = strips[i];
      if (!strip) continue;
      const offset = -digit * 1.3;
      strip.style.transform = `translateY(${offset}em)`;
    }

    container.dataset.value = newStr;
  }

  // Fetch GitHub Stats
  const fetchGitHubStats = async () => {
    const username = 'Visheshj111'; 
    const contributionsWrapper = document.querySelector('#github-contributions .counter');
    const streakWrapper = document.querySelector('#github-streak .counter');

    if (!contributionsWrapper || !streakWrapper) return;
    
    try {
      const year = new Date().getFullYear();
      const response = await fetch(`https://github-contributions-api.jogruber.de/v4/${username}?y=${year}`);
      if (!response.ok) throw new Error('Failed to fetch');
      
      const data = await response.json();
      
      let totalContributions = 0;
      let activeDays = 0;
      
      if (data.contributions) {
        data.contributions.forEach(day => {
          totalContributions += day.count;
          if (day.count > 0) activeDays++;
        });
      }
      
      if (!contributionsWrapper.dataset.value) {
        renderCounter(contributionsWrapper, totalContributions || 0);
      } else {
        animateCounter(contributionsWrapper, totalContributions || 0);
      }

      if (!streakWrapper.dataset.value) {
        renderCounter(streakWrapper, activeDays || 0);
      } else {
        animateCounter(streakWrapper, activeDays || 0);
      }
    } catch (error) {
      console.error('Error fetching GitHub stats:', error);
      if (!contributionsWrapper.dataset.value) {
        renderCounter(contributionsWrapper, 360);
      } else {
        animateCounter(contributionsWrapper, 360);
      }
      if (!streakWrapper.dataset.value) {
        renderCounter(streakWrapper, 26);
      } else {
        animateCounter(streakWrapper, 26);
      }
    }
  };

  // Call the function
  fetchGitHubStats();

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

  // Bouncing Cards Animation - GSAP handles ALL positioning
  if (typeof gsap !== 'undefined') {
    const languageCards = document.querySelectorAll('.floating-card[data-language]');
    
    // Card configuration with EXACT positioning
    const cardStates = [
      { rotation: 10,  x: -170, y: 0 },  // TypeScript
      { rotation: 5,   x: -85,  y: 0 },  // Java  
      { rotation: -3,  x: 0,    y: 0 },  // CSS (center)
      { rotation: -10, x: 85,   y: 0 },  // JavaScript - NO Y OFFSET
      { rotation: 2,   x: 170,  y: 0 }   // HTML
    ];

    // Initialize cards with proper transform origin
    languageCards.forEach((card, index) => {
      // Clear any existing transforms first
      card.style.transform = '';
      
      const state = cardStates[index];
      
      // Set initial state with GSAP
      gsap.set(card, {
        position: 'absolute',
        top: '70%',
        left: '50%',
        xPercent: -50,  // This replaces translate(-50%, -50%)
        yPercent: -50,
        x: state.x,     // Additional offset from center
        y: state.y,     // Should be 0 for all cards
        rotation: state.rotation,
        scale: 0,
        zIndex: 10,
        transformOrigin: 'center center'
      });
      
      // Animate in with elastic bounce
      gsap.to(card, {
        scale: 1,
        ease: 'elastic.out(1, 0.8)',
        delay: 0.5 + (index * 0.08)
      });
    });

    // Hover push animation
    const pushSiblings = (hoveredIdx) => {
      languageCards.forEach((card, i) => {
        gsap.killTweensOf(card);
        const baseState = cardStates[i];
        
        if (i === hoveredIdx) {
          // Hovered card: remove rotation, bring to front, subtle scale up
          card.style.zIndex = '100';
          gsap.to(card, {
            x: baseState.x,
            y: baseState.y,  // Maintain baseline
            rotation: 0,
            scale: 1.08,
            duration: 0.4,
            ease: 'back.out(1.4)',
            overwrite: 'auto'
          });
        } else {
          // Other cards: push away
          card.style.zIndex = '1';
          const pushDirection = i < hoveredIdx ? -1 : 1;
          const pushDistance = 80;  // Reduced from 160 to 80
          
          gsap.to(card, {
            x: baseState.x + (pushDirection * pushDistance),
            y: baseState.y,  // Keep original Y (which is 0)
            rotation: baseState.rotation,
            duration: 0.4,
            ease: 'back.out(1.4)',
            delay: Math.abs(hoveredIdx - i) * 0.05,
            overwrite: 'auto'
          });
        }
      });
    };

    // Reset animation
    const resetSiblings = () => {
      languageCards.forEach((card, i) => {
        gsap.killTweensOf(card);
        const baseState = cardStates[i];
        card.style.zIndex = '10';
        
        gsap.to(card, {
          x: baseState.x,
          y: baseState.y,
          rotation: baseState.rotation,
          scale: 1,
          duration: 0.4,
          ease: 'back.out(1.4)',
          overwrite: 'auto'
        });
      });
    };

    // Attach hover listeners
    languageCards.forEach((card, index) => {
      card.addEventListener('mouseenter', () => pushSiblings(index));
      card.addEventListener('mouseleave', resetSiblings);
    });

    // Animate GitHub stats card
    const statsCard = document.querySelector('.github-stats-card');
    if (statsCard) {
      gsap.from(statsCard, {
        duration: 1,
        x: -100,
        opacity: 0,
        ease: 'power3.out',
        delay: 0.5
      });

      // Subtle floating animation
      gsap.to(statsCard, {
        duration: 3,
        y: -10,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut'
      });
    }
  }
});