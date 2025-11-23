/**
 * TargetCursor - Vanilla JS implementation
 * Custom cursor with spinning corners that snap to target elements
 */

class TargetCursor {
  constructor(options = {}) {
    this.options = {
      targetSelector: options.targetSelector || '.cursor-target',
      spinDuration: options.spinDuration || 2,
      hideDefaultCursor: options.hideDefaultCursor !== false,
      hoverDuration: options.hoverDuration || 0.2,
      parallaxOn: options.parallaxOn !== false
    };

    this.constants = {
      borderWidth: 3,
      cornerSize: 12
    };

    // Check if mobile
    this.isMobile = this.checkMobile();
    if (this.isMobile) return;

    // Refs
    this.cursorRef = null;
    this.cornersRef = [];
    this.spinTl = null;
    this.dotRef = null;

    // State
    this.isActive = false;
    this.targetCornerPositions = null;
    this.activeStrength = 0;
    this.activeTarget = null;
    this.currentLeaveHandler = null;
    this.resumeTimeout = null;
    this.originalCursor = null;

    this.init();
  }

  checkMobile() {
    const hasTouchScreen = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    const isSmallScreen = window.innerWidth <= 768;
    const userAgent = navigator.userAgent || navigator.vendor || window.opera;
    const mobileRegex = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i;
    const isMobileUserAgent = mobileRegex.test(userAgent.toLowerCase());
    return (hasTouchScreen && isSmallScreen) || isMobileUserAgent;
  }

  init() {
    if (typeof gsap === 'undefined') {
      console.warn('GSAP not loaded for TargetCursor, retrying...');
      setTimeout(() => this.init(), 100);
      return;
    }

    this.createCursorElement();
    this.setupEventListeners();
  }

  createCursorElement() {
    // Create cursor wrapper
    const wrapper = document.createElement('div');
    wrapper.className = 'target-cursor-wrapper';
    
    // Create dot
    const dot = document.createElement('div');
    dot.className = 'target-cursor-dot';
    wrapper.appendChild(dot);
    
    // Create corners
    const corners = ['tl', 'tr', 'br', 'bl'];
    corners.forEach(pos => {
      const corner = document.createElement('div');
      corner.className = `target-cursor-corner corner-${pos}`;
      wrapper.appendChild(corner);
    });
    
    document.body.appendChild(wrapper);
    
    this.cursorRef = wrapper;
    this.dotRef = dot;
    this.cornersRef = Array.from(wrapper.querySelectorAll('.target-cursor-corner'));
    
    // Hide default cursor
    this.originalCursor = document.body.style.cursor;
    if (this.options.hideDefaultCursor) {
      document.body.style.cursor = 'none';
    }
    
    // Initial position
    gsap.set(this.cursorRef, {
      xPercent: -50,
      yPercent: -50,
      x: window.innerWidth / 2,
      y: window.innerHeight / 2
    });
    
    // Start spinning
    this.createSpinTimeline();
  }

  createSpinTimeline() {
    if (this.spinTl) {
      this.spinTl.kill();
    }
    this.spinTl = gsap
      .timeline({ repeat: -1 })
      .to(this.cursorRef, { 
        rotation: '+=360', 
        duration: this.options.spinDuration, 
        ease: 'none' 
      });
  }

  moveCursor(x, y) {
    if (!this.cursorRef) return;
    gsap.to(this.cursorRef, {
      x,
      y,
      duration: 0.1,
      ease: 'power3.out'
    });
  }

  tickerFn = () => {
    if (!this.targetCornerPositions || !this.cursorRef || !this.cornersRef.length) {
      return;
    }

    const strength = this.activeStrength;
    if (strength === 0) return;

    const cursorX = gsap.getProperty(this.cursorRef, 'x');
    const cursorY = gsap.getProperty(this.cursorRef, 'y');

    this.cornersRef.forEach((corner, i) => {
      const currentX = gsap.getProperty(corner, 'x');
      const currentY = gsap.getProperty(corner, 'y');

      const targetX = this.targetCornerPositions[i].x - cursorX;
      const targetY = this.targetCornerPositions[i].y - cursorY;

      const finalX = currentX + (targetX - currentX) * strength;
      const finalY = currentY + (targetY - currentY) * strength;

      const duration = strength >= 0.99 ? (this.options.parallaxOn ? 0.2 : 0) : 0.05;

      gsap.to(corner, {
        x: finalX,
        y: finalY,
        duration: duration,
        ease: duration === 0 ? 'none' : 'power1.out',
        overwrite: 'auto'
      });
    });
  };

  cleanupTarget(target) {
    if (this.currentLeaveHandler) {
      target.removeEventListener('mouseleave', this.currentLeaveHandler);
    }
    this.currentLeaveHandler = null;
  }

  setupEventListeners() {
    // Mouse move
    this.moveHandler = (e) => this.moveCursor(e.clientX, e.clientY);
    window.addEventListener('mousemove', this.moveHandler);

    // Scroll handler
    this.scrollHandler = () => {
      if (!this.activeTarget || !this.cursorRef) return;
      const mouseX = gsap.getProperty(this.cursorRef, 'x');
      const mouseY = gsap.getProperty(this.cursorRef, 'y');
      const elementUnderMouse = document.elementFromPoint(mouseX, mouseY);
      const isStillOverTarget =
        elementUnderMouse &&
        (elementUnderMouse === this.activeTarget || 
         elementUnderMouse.closest(this.options.targetSelector) === this.activeTarget);
      if (!isStillOverTarget) {
        if (this.currentLeaveHandler) {
          this.currentLeaveHandler();
        }
      }
    };
    window.addEventListener('scroll', this.scrollHandler, { passive: true });

    // Mouse down/up
    this.mouseDownHandler = () => {
      if (!this.dotRef) return;
      gsap.to(this.dotRef, { scale: 0.7, duration: 0.3 });
      gsap.to(this.cursorRef, { scale: 0.9, duration: 0.2 });
    };

    this.mouseUpHandler = () => {
      if (!this.dotRef) return;
      gsap.to(this.dotRef, { scale: 1, duration: 0.3 });
      gsap.to(this.cursorRef, { scale: 1, duration: 0.2 });
    };

    window.addEventListener('mousedown', this.mouseDownHandler);
    window.addEventListener('mouseup', this.mouseUpHandler);

    // Mouse over (enter target)
    this.enterHandler = (e) => {
      const directTarget = e.target;
      const allTargets = [];
      let current = directTarget;
      while (current && current !== document.body) {
        if (current.matches(this.options.targetSelector)) {
          allTargets.push(current);
        }
        current = current.parentElement;
      }
      const target = allTargets[0] || null;
      if (!target || !this.cursorRef || !this.cornersRef.length) return;
      if (this.activeTarget === target) return;
      if (this.activeTarget) {
        this.cleanupTarget(this.activeTarget);
      }
      if (this.resumeTimeout) {
        clearTimeout(this.resumeTimeout);
        this.resumeTimeout = null;
      }

      this.activeTarget = target;
      this.cornersRef.forEach(corner => gsap.killTweensOf(corner));

      gsap.killTweensOf(this.cursorRef, 'rotation');
      this.spinTl?.pause();
      gsap.set(this.cursorRef, { rotation: 0 });

      const rect = target.getBoundingClientRect();
      const { borderWidth, cornerSize } = this.constants;
      const cursorX = gsap.getProperty(this.cursorRef, 'x');
      const cursorY = gsap.getProperty(this.cursorRef, 'y');

      this.targetCornerPositions = [
        { x: rect.left - borderWidth, y: rect.top - borderWidth },
        { x: rect.right + borderWidth - cornerSize, y: rect.top - borderWidth },
        { x: rect.right + borderWidth - cornerSize, y: rect.bottom + borderWidth - cornerSize },
        { x: rect.left - borderWidth, y: rect.bottom + borderWidth - cornerSize }
      ];

      this.isActive = true;
      gsap.ticker.add(this.tickerFn);

      gsap.to(this, {
        activeStrength: 1,
        duration: this.options.hoverDuration,
        ease: 'power2.out'
      });

      this.cornersRef.forEach((corner, i) => {
        gsap.to(corner, {
          x: this.targetCornerPositions[i].x - cursorX,
          y: this.targetCornerPositions[i].y - cursorY,
          duration: 0.2,
          ease: 'power2.out'
        });
      });

      const leaveHandler = () => {
        gsap.ticker.remove(this.tickerFn);

        this.isActive = false;
        this.targetCornerPositions = null;
        gsap.set(this, { activeStrength: 0, overwrite: true });
        this.activeTarget = null;

        if (this.cornersRef.length) {
          gsap.killTweensOf(this.cornersRef);
          const { cornerSize } = this.constants;
          const positions = [
            { x: -cornerSize * 1.5, y: -cornerSize * 1.5 },
            { x: cornerSize * 0.5, y: -cornerSize * 1.5 },
            { x: cornerSize * 0.5, y: cornerSize * 0.5 },
            { x: -cornerSize * 1.5, y: cornerSize * 0.5 }
          ];
          const tl = gsap.timeline();
          this.cornersRef.forEach((corner, index) => {
            tl.to(
              corner,
              {
                x: positions[index].x,
                y: positions[index].y,
                duration: 0.3,
                ease: 'power3.out'
              },
              0
            );
          });
        }

        this.resumeTimeout = setTimeout(() => {
          if (!this.activeTarget && this.cursorRef && this.spinTl) {
            const currentRotation = gsap.getProperty(this.cursorRef, 'rotation');
            const normalizedRotation = currentRotation % 360;
            this.spinTl.kill();
            this.spinTl = gsap
              .timeline({ repeat: -1 })
              .to(this.cursorRef, { rotation: '+=360', duration: this.options.spinDuration, ease: 'none' });
            gsap.to(this.cursorRef, {
              rotation: normalizedRotation + 360,
              duration: this.options.spinDuration * (1 - normalizedRotation / 360),
              ease: 'none',
              onComplete: () => {
                this.spinTl?.restart();
              }
            });
          }
          this.resumeTimeout = null;
        }, 50);

        this.cleanupTarget(target);
      };

      this.currentLeaveHandler = leaveHandler;
      target.addEventListener('mouseleave', leaveHandler);
    };

    window.addEventListener('mouseover', this.enterHandler, { passive: true });
  }

  destroy() {
    if (this.isMobile) return;

    if (this.tickerFn) {
      gsap.ticker.remove(this.tickerFn);
    }

    window.removeEventListener('mousemove', this.moveHandler);
    window.removeEventListener('mouseover', this.enterHandler);
    window.removeEventListener('scroll', this.scrollHandler);
    window.removeEventListener('mousedown', this.mouseDownHandler);
    window.removeEventListener('mouseup', this.mouseUpHandler);

    if (this.activeTarget) {
      this.cleanupTarget(this.activeTarget);
    }

    this.spinTl?.kill();
    
    if (this.cursorRef) {
      this.cursorRef.remove();
    }
    
    document.body.style.cursor = this.originalCursor;

    this.isActive = false;
    this.targetCornerPositions = null;
    this.activeStrength = 0;
  }
}

// Auto-initialize
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.targetCursor = new TargetCursor();
  });
} else {
  window.targetCursor = new TargetCursor();
}

// Export for manual initialization
if (typeof module !== 'undefined' && module.exports) {
  module.exports = TargetCursor;
}
