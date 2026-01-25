/**
 * Tilted Card Component
 * Creates an interactive 3D tilt effect on project cards
 */

class TiltedCard {
  constructor(element, options = {}) {
    this.element = element;
    this.inner = element.querySelector('.tilted-card-inner');
    this.caption = element.querySelector('.tilted-card-caption');
    
    // Default options
    this.options = {
      rotateAmplitude: options.rotateAmplitude || 14,
      scaleOnHover: options.scaleOnHover || 1.02,
      liftOnHover: options.liftOnHover || -8,
      springDamping: options.springDamping || 30,
      springStiffness: options.springStiffness || 100,
      ...options
    };
    
    // State
    this.rotateX = 0;
    this.rotateY = 0;
    this.scale = 1;
    this.translateY = 0;
    this.targetRotateX = 0;
    this.targetRotateY = 0;
    this.targetScale = 1;
    this.targetTranslateY = 0;
    this.lastY = 0;
    this.isHovering = false;
    
    // Bind methods
    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.handleMouseEnter = this.handleMouseEnter.bind(this);
    this.handleMouseLeave = this.handleMouseLeave.bind(this);
    this.animate = this.animate.bind(this);
    
    this.init();
  }
  
  init() {
    this.element.addEventListener('mousemove', this.handleMouseMove);
    this.element.addEventListener('mouseenter', this.handleMouseEnter);
    this.element.addEventListener('mouseleave', this.handleMouseLeave);
    
    // Start animation loop
    this.animate();
  }
  
  handleMouseMove(e) {
    if (!this.inner) return;
    
    const rect = this.element.getBoundingClientRect();
    const offsetX = e.clientX - rect.left - rect.width / 2;
    const offsetY = e.clientY - rect.top - rect.height / 2;
    
    this.targetRotateX = (offsetY / (rect.height / 2)) * -this.options.rotateAmplitude;
    this.targetRotateY = (offsetX / (rect.width / 2)) * this.options.rotateAmplitude;
    
    // Update caption position
    if (this.caption) {
      this.caption.style.left = `${e.clientX - rect.left}px`;
      this.caption.style.top = `${e.clientY - rect.top}px`;
    }
    
    this.lastY = offsetY;
  }
  
  handleMouseEnter() {
    this.isHovering = true;
    this.targetScale = this.options.scaleOnHover;
    this.targetTranslateY = this.options.liftOnHover;
    
    if (this.caption) {
      this.caption.style.opacity = '1';
    }
  }
  
  handleMouseLeave() {
    this.isHovering = false;
    this.targetRotateX = 0;
    this.targetRotateY = 0;
    this.targetScale = 1;
    this.targetTranslateY = 0;
    
    if (this.caption) {
      this.caption.style.opacity = '0';
    }
  }
  
  lerp(start, end, factor) {
    return start + (end - start) * factor;
  }
  
  animate() {
    // Smooth spring-like animation
    const dampingFactor = 0.1;
    
    this.rotateX = this.lerp(this.rotateX, this.targetRotateX, dampingFactor);
    this.rotateY = this.lerp(this.rotateY, this.targetRotateY, dampingFactor);
    this.scale = this.lerp(this.scale, this.targetScale, dampingFactor);
    this.translateY = this.lerp(this.translateY, this.targetTranslateY, dampingFactor);
    
    if (this.inner) {
      this.inner.style.transform = `
        translateY(${this.translateY}px)
        rotateX(${this.rotateX}deg) 
        rotateY(${this.rotateY}deg) 
        scale(${this.scale})
      `;
    }
    
    requestAnimationFrame(this.animate);
  }
  
  destroy() {
    this.element.removeEventListener('mousemove', this.handleMouseMove);
    this.element.removeEventListener('mouseenter', this.handleMouseEnter);
    this.element.removeEventListener('mouseleave', this.handleMouseLeave);
  }
}

/**
 * Project Modal Manager
 * Handles expand button clicks and modal display
 */
class ProjectModalManager {
  constructor() {
    this.activeModal = null;
    this.init();
  }
  
  init() {
    // Handle expand button clicks
    document.querySelectorAll('.expand-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        const projectId = btn.getAttribute('data-expand');
        this.openModal(projectId);
      });
    });
    
    // Handle modal close buttons
    document.querySelectorAll('.modal-close-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        this.closeModal();
      });
    });
    
    // Handle clicking outside modal content
    document.querySelectorAll('.project-modal').forEach(modal => {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          this.closeModal();
        }
      });
    });
    
    // Handle escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.activeModal) {
        this.closeModal();
      }
    });
  }
  
  openModal(projectId) {
    const modal = document.getElementById(`modal-${projectId}`);
    if (modal) {
      this.activeModal = modal;
      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
      
      // Re-initialize lucide icons for modal content
      if (window.lucide?.createIcons) {
        window.lucide.createIcons();
      }
    }
  }
  
  closeModal() {
    if (this.activeModal) {
      this.activeModal.classList.remove('active');
      document.body.style.overflow = '';
      this.activeModal = null;
    }
  }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  // Initialize tilted cards
  const tiltedCards = document.querySelectorAll('.tilted-card-figure');
  tiltedCards.forEach(card => {
    new TiltedCard(card, {
      rotateAmplitude: 8,
      scaleOnHover: 1.02
    });
  });
  
  // Initialize project modal manager
  new ProjectModalManager();
});

// Export for potential module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { TiltedCard, ProjectModalManager };
}
