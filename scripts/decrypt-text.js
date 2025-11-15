/**
 * DecryptText - Vanilla JS implementation of text decryption animation
 * Adapted from React component for use in plain HTML/CSS/JS
 */

class DecryptText {
  constructor(element, options = {}) {
    this.element = element;
    this.originalText = element.textContent;
    
    // Options
    this.speed = options.speed || 50;
    this.maxIterations = options.maxIterations || 10;
    this.sequential = options.sequential || false;
    this.revealDirection = options.revealDirection || 'start';
    this.useOriginalCharsOnly = options.useOriginalCharsOnly || false;
    this.characters = options.characters || 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz!@#$%^&*()_+';
    this.animateOn = options.animateOn || 'view'; // 'hover', 'view', or 'both'
    
    // State
    this.isAnimating = false;
    this.hasAnimated = false;
    this.revealedIndices = new Set();
    this.currentIteration = 0;
    this.interval = null;
    
    this.init();
  }
  
  init() {
    // Set up element structure
    this.element.style.display = 'inline-block';
    // Let CSS control wrapping so we don't break layout
    
    // Add event listeners based on animateOn option
    if (this.animateOn === 'hover' || this.animateOn === 'both') {
      this.element.addEventListener('mouseenter', () => this.startAnimation());
      this.element.addEventListener('mouseleave', () => this.stopAnimation());
    }
    
    if (this.animateOn === 'view' || this.animateOn === 'both') {
      this.setupIntersectionObserver();
    }
  }
  
  setupIntersectionObserver() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !this.hasAnimated) {
          this.startAnimation();
          this.hasAnimated = true;
        }
      });
    }, {
      threshold: 0.1
    });
    
    observer.observe(this.element);
  }
  
  getAvailableChars() {
    if (this.useOriginalCharsOnly) {
      return Array.from(new Set(this.originalText.split(''))).filter(char => char !== ' ');
    }
    return this.characters.split('');
  }
  
  getNextIndex() {
    const textLength = this.originalText.length;
    
    switch (this.revealDirection) {
      case 'start':
        return this.revealedIndices.size;
      
      case 'end':
        return textLength - 1 - this.revealedIndices.size;
      
      case 'center': {
        const middle = Math.floor(textLength / 2);
        const offset = Math.floor(this.revealedIndices.size / 2);
        const nextIndex = this.revealedIndices.size % 2 === 0 
          ? middle + offset 
          : middle - offset - 1;
        
        if (nextIndex >= 0 && nextIndex < textLength && !this.revealedIndices.has(nextIndex)) {
          return nextIndex;
        }
        
        for (let i = 0; i < textLength; i++) {
          if (!this.revealedIndices.has(i)) return i;
        }
        return 0;
      }
      
      default:
        return this.revealedIndices.size;
    }
  }
  
  shuffleText() {
    const availableChars = this.getAvailableChars();
    
    if (this.useOriginalCharsOnly) {
      const positions = this.originalText.split('').map((char, i) => ({
        char,
        isSpace: char === ' ',
        index: i,
        isRevealed: this.revealedIndices.has(i)
      }));
      
      const nonSpaceChars = positions
        .filter(p => !p.isSpace && !p.isRevealed)
        .map(p => p.char);
      
      // Fisher-Yates shuffle
      for (let i = nonSpaceChars.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [nonSpaceChars[i], nonSpaceChars[j]] = [nonSpaceChars[j], nonSpaceChars[i]];
      }
      
      let charIndex = 0;
      return positions.map(p => {
        if (p.isSpace) return ' ';
        if (p.isRevealed) return this.originalText[p.index];
        return nonSpaceChars[charIndex++];
      }).join('');
    } else {
      return this.originalText.split('').map((char, i) => {
        if (char === ' ') return ' ';
        if (this.revealedIndices.has(i)) return this.originalText[i];
        return availableChars[Math.floor(Math.random() * availableChars.length)];
      }).join('');
    }
  }
  
  startAnimation() {
    if (this.isAnimating) return;
    
    this.isAnimating = true;
    this.currentIteration = 0;

    // Prevent mid-animation wrapping glitches by keeping text on one line while scrambling
    const previousWhiteSpace = this.element.style.whiteSpace;
    this.element.dataset._previousWhiteSpace = previousWhiteSpace || '';
    this.element.style.whiteSpace = 'nowrap';
    
    this.interval = setInterval(() => {
      // Sequential mode: lock in one new character at a time
      if (this.sequential) {
        if (this.revealedIndices.size < this.originalText.length) {
          const nextIndex = this.getNextIndex();
          this.revealedIndices.add(nextIndex);
        }
        const scrambled = this.shuffleText();
        this.element.textContent = scrambled;

        if (this.revealedIndices.size >= this.originalText.length) {
          this.finishAnimation();
        }
      } else {
        // Non-sequential: whole word scrambles for a few iterations
        this.element.textContent = this.shuffleText();
        this.currentIteration++;
        if (this.currentIteration >= this.maxIterations) {
          this.finishAnimation();
        }
      }
    }, this.speed);
  }
  
  stopAnimation() {
    if (this.animateOn === 'view') return; // Don't stop if it's view-triggered
    
    this.finishAnimation();
    this.revealedIndices.clear();
  }
  
  finishAnimation() {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }
    this.element.textContent = this.originalText;
    this.isAnimating = false;

    // Restore original white-space so layout returns to normal
    if (this.element.dataset._previousWhiteSpace !== undefined) {
      this.element.style.whiteSpace = this.element.dataset._previousWhiteSpace;
      delete this.element.dataset._previousWhiteSpace;
    }
  }
  
  destroy() {
    this.stopAnimation();
    this.element.removeEventListener('mouseenter', () => this.startAnimation());
    this.element.removeEventListener('mouseleave', () => this.stopAnimation());
  }
}

// Auto-initialize elements with data-decrypt attribute
document.addEventListener('DOMContentLoaded', () => {
  const elements = document.querySelectorAll('[data-decrypt]');
  
  elements.forEach(element => {
    const options = {
      speed: parseInt(element.dataset.speed) || 50,
      maxIterations: parseInt(element.dataset.maxIterations) || 10,
      sequential: element.dataset.sequential === 'true',
      revealDirection: element.dataset.revealDirection || 'start',
      useOriginalCharsOnly: element.dataset.useOriginalCharsOnly === 'true',
      characters: element.dataset.characters || 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz!@#$%^&*()_+',
      animateOn: element.dataset.animateOn || 'view'
    };
    
    new DecryptText(element, options);
  });
});

// Export for manual initialization
if (typeof module !== 'undefined' && module.exports) {
  module.exports = DecryptText;
}
