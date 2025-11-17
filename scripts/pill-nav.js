// Pill Navigation with GSAP animations
(function() {
  function initPillNav() {
    if (typeof gsap === 'undefined') {
      console.warn('GSAP not loaded, retrying...');
      setTimeout(initPillNav, 100);
      return;
    }

    const circleRefs = [];
    const tlRefs = [];
    const activeTweenRefs = [];
    
    const pills = document.querySelectorAll('.pill');
    const logoLink = document.querySelector('.pill-logo');
    const logoEmoji = document.querySelector('.logo-emoji');
    const mobileMenuButton = document.querySelector('.mobile-menu-button');
    const mobileMenu = document.querySelector('.mobile-menu-popover');
    const navItemsContainer = document.querySelector('.pill-nav-items');
    const logoContainer = document.querySelector('.pill-logo');
    
    let isMobileMenuOpen = false;

    // Layout function to calculate pill hover circles
    function layout() {
      pills.forEach((pill, index) => {
        const circle = pill.querySelector('.hover-circle');
        if (!circle) return;

        circleRefs[index] = circle;
        
        const rect = pill.getBoundingClientRect();
        const w = rect.width;
        const h = rect.height;
        const R = ((w * w) / 4 + h * h) / (2 * h);
        const D = Math.ceil(2 * R) + 2;
        const delta = Math.ceil(R - Math.sqrt(Math.max(0, R * R - (w * w) / 4))) + 1;
        const originY = D - delta;

        circle.style.width = `${D}px`;
        circle.style.height = `${D}px`;
        circle.style.bottom = `-${delta}px`;

        gsap.set(circle, {
          xPercent: -50,
          scale: 0,
          transformOrigin: `50% ${originY}px`
        });

        const label = pill.querySelector('.pill-label');
        const hoverLabel = pill.querySelector('.pill-label-hover');

        if (label) gsap.set(label, { y: 0 });
        if (hoverLabel) {
          gsap.set(hoverLabel, { y: h + 12, opacity: 0 });
        }

        // Kill existing timeline
        if (tlRefs[index]) {
          tlRefs[index].kill();
        }

        // Create hover animation timeline
        const tl = gsap.timeline({ paused: true });
        
        tl.to(circle, { 
          scale: 1.2, 
          xPercent: -50, 
          duration: 0.6, 
          ease: 'power3.out',
          overwrite: 'auto'
        }, 0);

        if (label) {
          tl.to(label, { 
            y: -(h + 8), 
            duration: 0.6, 
            ease: 'power3.out',
            overwrite: 'auto'
          }, 0);
        }

        if (hoverLabel) {
          gsap.set(hoverLabel, { y: Math.ceil(h + 100), opacity: 0 });
          tl.to(hoverLabel, { 
            y: 0, 
            opacity: 1, 
            duration: 0.6, 
            ease: 'power3.out',
            overwrite: 'auto'
          }, 0);
        }

        tlRefs[index] = tl;
      });
    }

    // Initial layout
    layout();

    // Resize handler
    window.addEventListener('resize', layout);

    // Font load handler
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(layout);
    }

    // Initial load animations
    if (logoContainer) {
      gsap.set(logoContainer, { scale: 0 });
      gsap.to(logoContainer, {
        scale: 1,
        duration: 0.6,
        ease: 'power3.out'
      });
    }

    if (navItemsContainer) {
      gsap.set(navItemsContainer, { width: 0, overflow: 'hidden' });
      gsap.to(navItemsContainer, {
        width: 'auto',
        duration: 0.6,
        ease: 'power3.out',
        delay: 0.2
      });
    }

    // Pill hover handlers
    pills.forEach((pill, index) => {
      pill.addEventListener('mouseenter', () => {
        const tl = tlRefs[index];
        if (!tl) return;
        
        if (activeTweenRefs[index]) {
          activeTweenRefs[index].kill();
        }
        
        activeTweenRefs[index] = tl.tweenTo(tl.duration(), {
          duration: 0.3,
          ease: 'power3.out',
          overwrite: 'auto'
        });
      });

      pill.addEventListener('mouseleave', () => {
        const tl = tlRefs[index];
        if (!tl) return;
        
        if (activeTweenRefs[index]) {
          activeTweenRefs[index].kill();
        }
        
        activeTweenRefs[index] = tl.tweenTo(0, {
          duration: 0.2,
          ease: 'power3.out',
          overwrite: 'auto'
        });
      });
    });

    // Pill click handlers: keep clicked pill highlighted until scroll changes section
    pills.forEach(pill => {
      pill.addEventListener('click', () => {
        pills.forEach(p => p.classList.remove('is-active'));
        pill.classList.add('is-active');
      });
    });

    // Logo hover animation
    if (logoLink && logoEmoji) {
      logoLink.addEventListener('mouseenter', () => {
        gsap.set(logoEmoji, { rotate: 0 });
        gsap.to(logoEmoji, {
          rotate: 360,
          duration: 0.5,
          ease: 'power3.out',
          overwrite: 'auto'
        });
      });
    }

    // Mobile menu toggle
    if (mobileMenuButton && mobileMenu) {
      gsap.set(mobileMenu, { visibility: 'hidden', opacity: 0 });

      mobileMenuButton.addEventListener('click', () => {
        isMobileMenuOpen = !isMobileMenuOpen;
        
        const lines = mobileMenuButton.querySelectorAll('.hamburger-line');
        
        if (isMobileMenuOpen) {
          // Animate to X
          gsap.to(lines[0], { rotation: 45, y: 3, duration: 0.3, ease: 'power3.out' });
          gsap.to(lines[1], { rotation: -45, y: -3, duration: 0.3, ease: 'power3.out' });
          
          // Show menu
          gsap.set(mobileMenu, { visibility: 'visible' });
          gsap.fromTo(mobileMenu,
            { opacity: 0, y: -10 },
            { opacity: 1, y: 0, duration: 0.3, ease: 'power3.out' }
          );
        } else {
          // Animate back to hamburger
          gsap.to(lines[0], { rotation: 0, y: 0, duration: 0.3, ease: 'power3.out' });
          gsap.to(lines[1], { rotation: 0, y: 0, duration: 0.3, ease: 'power3.out' });
          
          // Hide menu
          gsap.to(mobileMenu, {
            opacity: 0,
            y: -10,
            duration: 0.2,
            ease: 'power3.out',
            onComplete: () => {
              gsap.set(mobileMenu, { visibility: 'hidden' });
            }
          });
        }
      });

      // Close mobile menu on link click
      const mobileLinks = mobileMenu.querySelectorAll('.mobile-menu-link');
      mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
          if (isMobileMenuOpen) {
            mobileMenuButton.click();
          }
        });
      });
    }

    // Active state management
    const updateActiveState = () => {
      const sections = document.querySelectorAll('section[id], header[id]');
      const scrollY = window.scrollY;

      sections.forEach((section, index) => {
        const sectionTop = section.offsetTop - 50;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');

        const isFirst = index === 0;
        const inView = isFirst
          ? scrollY < sectionTop + sectionHeight
          : scrollY >= sectionTop && scrollY < sectionTop + sectionHeight;

        if (inView) {
          pills.forEach(pill => {
            pill.classList.remove('is-active');
            if (pill.getAttribute('href') === `#${sectionId}`) {
              pill.classList.add('is-active');
            }
          });
        }
      });
    };

    window.addEventListener('scroll', updateActiveState, { passive: true });
    updateActiveState();
  }

  // Wait for GSAP to load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPillNav);
  } else {
    initPillNav();
  }
})();