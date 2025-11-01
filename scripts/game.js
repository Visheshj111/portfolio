// Encapsulated game logic for the Asteroids-like mini-game with touch controls
(function () {
  console.log('Game script loaded');

  const state = {
    gameLoopId: null,
    score: 0,
    player: null,
    bullets: [],
    asteroids: [],
    particles: [],
    stars: [],
    keys: {},
    isGameOver: false,
    isMobile: false,
    touchControls: {
      thrust: false,
      rotateLeft: false,
      rotateRight: false,
      shoot: false
    },
    audio: {
      ready: false,
      shootSynth: null,
      explosionSynth: null,
      playerExplosionSynth: null,
      thrustOsc: null,
    },
    dom: {
      playGameBtn: null,
      closeGameBtn: null,
      gameOverlay: null,
      gameControlsModal: null,
      startGameBtn: null,
      canvas: null,
      ctx: null,
      scoreEl: null,
      gameMessageEl: null,
      gameOverTextEl: null,
      finalScoreTextEl: null,
      mobileControls: null
    }
  };

  const setupAudio = async () => {
    if (typeof Tone === 'undefined') {
      console.warn('Tone.js not loaded');
      return;
    }

    try {
      await Tone.start();
      
      state.audio.shootSynth = new Tone.Synth({
        oscillator: { type: 'triangle' },
        envelope: { attack: 0.01, decay: 0.1, sustain: 0.05, release: 0.2 }
      }).toDestination();

      state.audio.explosionSynth = new Tone.NoiseSynth({
        noise: { type: 'white' },
        envelope: { attack: 0.01, decay: 0.2, sustain: 0, release: 0.1 }
      }).toDestination();

      state.audio.playerExplosionSynth = new Tone.MembraneSynth({
        pitchDecay: 0.05,
        octaves: 10,
        envelope: { attack: 0.001, decay: 0.4, sustain: 0.01, release: 1.4, attackCurve: 'exponential' }
      }).toDestination();

      state.audio.thrustOsc = new Tone.Oscillator({
        type: "sawtooth",
        frequency: 50,
        volume: -25
      }).toDestination();

      state.audio.ready = true;
      console.log('Audio initialized');
    } catch (error) {
      console.warn('Audio initialization failed:', error);
    }
  };

  const initGame = () => {
    const canvas = state.dom.canvas;
    const ctx = state.dom.ctx;
    
    if (!canvas || !ctx) {
      console.error('Canvas not found');
      return;
    }
    
    // Detect mobile
    state.isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || 
                     ('ontouchstart' in window);

    canvas.width = Math.floor(window.innerWidth * 0.9);
    canvas.height = Math.floor(window.innerHeight * 0.9);

    state.player = {
      x: canvas.width / 2,
      y: canvas.height / 2,
      radius: 15,
      angle: 90 / 180 * Math.PI,
      rotation: 0,
      speed: 0,
      friction: 0.99,
      thrust: 0.1,
      isThrusting: false,
      lives: 3,
    };

    state.score = 0;
    if (state.dom.scoreEl) {
      state.dom.scoreEl.textContent = `SCORE: ${state.score}`;
    }
    state.bullets = [];
    state.asteroids = [];
    state.particles = [];
    state.stars = [];

    for (let i = 0; i < 100; i++) {
      state.stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 1.5,
        alpha: Math.random() * 0.5 + 0.2
      });
    }

    for (let i = 0; i < 5; i++) {
      createAsteroid();
    }

    state.isGameOver = false;
    if (state.dom.gameMessageEl) {
      state.dom.gameMessageEl.classList.add('hidden');
    }

    // Show mobile controls if on mobile
    if (state.isMobile && state.dom.mobileControls) {
      state.dom.mobileControls.classList.remove('hidden');
    }

    window.addEventListener('resize', () => {
      canvas.width = Math.floor(window.innerWidth * 0.9);
      canvas.height = Math.floor(window.innerHeight * 0.9);
    }, { passive: true });
  };

  const createExplosion = (x, y, color) => {
    for (let i = 0; i < 15; i++) {
      state.particles.push({
        x,
        y,
        speedX: (Math.random() - 0.5) * 4,
        speedY: (Math.random() - 0.5) * 4,
        radius: Math.random() * 2 + 1,
        color,
        life: 100
      });
    }
  };

  const createAsteroid = (x, y, radius) => {
    const canvas = state.dom.canvas;
    if (!canvas) return;
    
    const rad = radius || Math.random() * 30 + 30;
    const posX = x || (Math.random() < 0.5 ? Math.random() * canvas.width * 0.3 : canvas.width * 0.7 + Math.random() * canvas.width * 0.3);
    const posY = y || (Math.random() < 0.5 ? Math.random() * canvas.height * 0.3 : canvas.height * 0.7 + Math.random() * canvas.height * 0.3);

    const asteroid = {
      x: posX,
      y: posY,
      radius: rad,
      angle: Math.random() * Math.PI * 2,
      speed: Math.random() * 1 + 0.5,
      vertices: Math.floor(Math.random() * 5 + 7),
      offsets: []
    };
    for (let i = 0; i < asteroid.vertices; i++) {
      asteroid.offsets.push(Math.random() * rad * 0.6 - rad * 0.3);
    }
    state.asteroids.push(asteroid);
  };

  const drawPlayer = () => {
    const ctx = state.dom.ctx;
    const p = state.player;
    if (!ctx || !p) return;
    
    ctx.strokeStyle = '#818cf8';
    ctx.lineWidth = 2;

    if (p.isThrusting) {
      const grad = ctx.createLinearGradient(p.x, p.y, p.x - 20 * Math.cos(p.angle), p.y + 20 * Math.sin(p.angle));
      grad.addColorStop(0, "orange");
      grad.addColorStop(1, "yellow");
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.moveTo(
        p.x - p.radius * (2 / 3 * Math.cos(p.angle) + 0.5 * Math.sin(p.angle)),
        p.y + p.radius * (2 / 3 * Math.sin(p.angle) - 0.5 * Math.cos(p.angle))
      );
      ctx.lineTo(
        p.x - p.radius * (2 / 3 * Math.cos(p.angle) - 0.5 * Math.sin(p.angle)),
        p.y + p.radius * (2 / 3 * Math.sin(p.angle) + 0.5 * Math.cos(p.angle))
      );
      ctx.lineTo(
        p.x - p.radius * 1.5 * Math.cos(p.angle),
        p.y + p.radius * 1.5 * Math.sin(p.angle)
      );
      ctx.closePath();
      ctx.fill();
    }

    ctx.beginPath();
    ctx.moveTo(p.x + p.radius * Math.cos(p.angle), p.y - p.radius * Math.sin(p.angle));
    ctx.lineTo(p.x - p.radius * (Math.cos(p.angle) + Math.sin(p.angle)), p.y + p.radius * (Math.sin(p.angle) - Math.cos(p.angle)));
    ctx.lineTo(p.x - p.radius * (Math.cos(p.angle) - Math.sin(p.angle)), p.y + p.radius * (Math.sin(p.angle) + Math.cos(p.angle)));
    ctx.closePath();
    ctx.stroke();
  };

  const drawAsteroid = (asteroid) => {
    const ctx = state.dom.ctx;
    if (!ctx) return;
    
    ctx.strokeStyle = "#BDBDBD";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(
      asteroid.x + (asteroid.radius + asteroid.offsets[0]) * Math.cos(0),
      asteroid.y + (asteroid.radius + asteroid.offsets[0]) * Math.sin(0)
    );
    for (let j = 1; j < asteroid.vertices; j++) {
      ctx.lineTo(
        asteroid.x + (asteroid.radius + asteroid.offsets[j]) * Math.cos(j * Math.PI * 2 / asteroid.vertices),
        asteroid.y + (asteroid.radius + asteroid.offsets[j]) * Math.sin(j * Math.PI * 2 / asteroid.vertices)
      );
    }
    ctx.closePath();
    ctx.stroke();
  };

  const gameLoop = () => {
    if (state.isGameOver) return;

    const canvas = state.dom.canvas;
    const ctx = state.dom.ctx;
    const p = state.player;

    if (!canvas || !ctx || !p) return;

    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    state.stars.forEach(star => {
      ctx.beginPath();
      ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 255, 255, ${star.alpha})`;
      ctx.fill();
    });

    // Handle touch controls
    if (state.touchControls.thrust || state.keys['ArrowUp']) {
      p.isThrusting = true;
      p.speed = Math.min(5, p.speed + p.thrust);
      if (state.audio.ready && state.audio.thrustOsc.state !== 'started') {
        state.audio.thrustOsc.start();
      }
    } else {
      p.isThrusting = false;
      if (state.audio.ready && state.audio.thrustOsc.state === 'started') {
        state.audio.thrustOsc.stop();
      }
    }

    if (state.touchControls.rotateLeft || state.keys['ArrowLeft']) {
      p.rotation = 0.05;
    } else if (state.touchControls.rotateRight || state.keys['ArrowRight']) {
      p.rotation = -0.05;
    } else {
      p.rotation = 0;
    }

    p.x += p.speed * Math.cos(p.angle);
    p.y -= p.speed * Math.sin(p.angle);
    p.angle += p.rotation;
    p.speed *= p.friction;

    wrapAround(p, canvas);
    drawPlayer();

    state.particles.forEach((part, index) => {
      part.x += part.speedX;
      part.y += part.speedY;
      if (--part.life <= 0) {
        state.particles.splice(index, 1);
      } else {
        ctx.fillStyle = `rgba(${part.color}, ${part.life / 100})`;
        ctx.beginPath();
        ctx.arc(part.x, part.y, part.radius, 0, Math.PI * 2);
        ctx.fill();
      }
    });

    state.bullets.forEach((bullet, index) => {
      bullet.x += bullet.speedX;
      bullet.y += bullet.speedY;
      ctx.fillStyle = "#FFFF00";
      ctx.beginPath();
      ctx.arc(bullet.x, bullet.y, 3, 0, Math.PI * 2);
      ctx.fill();

      if (bullet.x < 0 || bullet.x > canvas.width || bullet.y < 0 || bullet.y > canvas.height) {
        state.bullets.splice(index, 1);
      }
    });

    state.asteroids.forEach((a, aIndex) => {
      a.x += a.speed * Math.cos(a.angle);
      a.y += a.speed * Math.sin(a.angle);
      wrapAround(a, canvas);
      drawAsteroid(a);

      state.bullets.forEach((b, bIndex) => {
        const dist = Math.hypot(b.x - a.x, b.y - a.y);
        if (dist < a.radius) {
          if (a.radius > 20) {
            state.score += 20;
            createAsteroid(a.x, a.y, a.radius / 2);
            createAsteroid(a.x, a.y, a.radius / 2);
          } else {
            state.score += 50;
          }
          if (state.audio.ready) state.audio.explosionSynth.triggerAttackRelease("4n");
          createExplosion(a.x, a.y, "189, 189, 189");
          state.asteroids.splice(aIndex, 1);
          state.bullets.splice(bIndex, 1);
          if (state.dom.scoreEl) {
            state.dom.scoreEl.textContent = `SCORE: ${state.score}`;
          }
        }
      });

      const playerDist = Math.hypot(p.x - a.x, p.y - a.y);
      if (playerDist < p.radius + a.radius) {
        createExplosion(p.x, p.y, "129, 140, 248");
        if (state.audio.ready) state.audio.playerExplosionSynth.triggerAttackRelease("C2", "1n");
        endGame();
      }
    });

    if (state.asteroids.length === 0) {
      for (let i = 0; i < 5; i++) createAsteroid();
    }

    state.gameLoopId = requestAnimationFrame(gameLoop);
  };

  const wrapAround = (obj, canvas) => {
    if (obj.x < 0 - obj.radius) obj.x = canvas.width + obj.radius;
    if (obj.x > canvas.width + obj.radius) obj.x = 0 - obj.radius;
    if (obj.y < 0 - obj.radius) obj.y = canvas.height + obj.radius;
    if (obj.y > canvas.height + obj.radius) obj.y = 0 - obj.radius;
  };

  const endGame = () => {
    state.isGameOver = true;
    if (state.audio.ready && state.audio.thrustOsc.state === 'started') {
      state.audio.thrustOsc.stop();
    }
    cancelAnimationFrame(state.gameLoopId);
    if (state.dom.finalScoreTextEl) {
      state.dom.finalScoreTextEl.textContent = `FINAL SCORE: ${state.score}`;
    }
    if (state.dom.gameMessageEl) {
      state.dom.gameMessageEl.classList.remove('hidden');
    }
    
    // Hide mobile controls
    if (state.dom.mobileControls) {
      state.dom.mobileControls.classList.add('hidden');
    }
  };

  const startGame = () => {
    console.log('Starting game...');
    initGame();
    state.gameLoopId = requestAnimationFrame(gameLoop);
  };

  const shoot = () => {
    const p = state.player;
    if (state.bullets.length < 5 && !state.isGameOver && p) {
      state.bullets.push({
        x: p.x + p.radius * Math.cos(p.angle),
        y: p.y - p.radius * Math.sin(p.angle),
        speedX: 10 * Math.cos(p.angle),
        speedY: -10 * Math.sin(p.angle),
      });
      if (state.audio.ready) state.audio.shootSynth.triggerAttackRelease("C5", "8n");
    }
  };

  const handleKeyDown = (e) => {
    if (state.isGameOver && (e.key === 'r' || e.key === 'R')) {
      startGame();
      return;
    }

    state.keys[e.key] = true;

    if (e.key === ' ') {
      e.preventDefault();
      shoot();
    }
  };

  const handleKeyUp = (e) => {
    state.keys[e.key] = false;
  };

  const handleEscKey = (e) => {
    if (e.key === 'Escape') {
      if (state.dom.closeGameBtn) {
        state.dom.closeGameBtn.click();
      }
    }
  };

  const setupTouchControls = () => {
    const controls = state.dom.mobileControls;
    if (!controls) return;

    const leftBtn = controls.querySelector('.control-left');
    const rightBtn = controls.querySelector('.control-right');
    const thrustBtn = controls.querySelector('.control-thrust');
    const shootBtn = controls.querySelector('.control-shoot');

    const addTouchListeners = (btn, action, value) => {
      if (!btn) return;
      
      btn.addEventListener('touchstart', (e) => {
        e.preventDefault();
        state.touchControls[action] = value;
        btn.classList.add('active');
      });
      btn.addEventListener('touchend', (e) => {
        e.preventDefault();
        state.touchControls[action] = false;
        btn.classList.remove('active');
      });
      btn.addEventListener('touchcancel', (e) => {
        e.preventDefault();
        state.touchControls[action] = false;
        btn.classList.remove('active');
      });
    };

    if (leftBtn) addTouchListeners(leftBtn, 'rotateLeft', true);
    if (rightBtn) addTouchListeners(rightBtn, 'rotateRight', true);
    if (thrustBtn) addTouchListeners(thrustBtn, 'thrust', true);
    
    if (shootBtn) {
      shootBtn.addEventListener('touchstart', (e) => {
        e.preventDefault();
        shoot();
        shootBtn.classList.add('active');
      });
      shootBtn.addEventListener('touchend', (e) => {
        e.preventDefault();
        shootBtn.classList.remove('active');
      });
    }
  };

  const openControlsModal = () => {
    console.log('Opening controls modal');
    if (state.dom.gameControlsModal) {
      state.dom.gameControlsModal.classList.remove('hidden');
      state.dom.gameControlsModal.style.display = 'flex';
    }
    if (state.dom.startGameBtn) {
      setTimeout(() => state.dom.startGameBtn.focus(), 0);
    }
  };

  const openGame = async () => {
    console.log('Opening game');
    
    // Setup audio first
    if (!state.audio.ready) {
      await setupAudio();
    }
    
    if (state.dom.gameControlsModal) {
      state.dom.gameControlsModal.classList.add('hidden');
      state.dom.gameControlsModal.style.display = 'none';
    }

    if (state.dom.gameOverlay) {
      state.dom.gameOverlay.classList.remove('hidden');
      state.dom.gameOverlay.style.display = 'flex';
    }
    
    document.body.style.overflow = 'hidden';

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    window.addEventListener('keydown', handleEscKey);
    
    startGame();
  };

  const closeGame = () => {
    console.log('Closing game');
    
    if (state.dom.gameOverlay) {
      state.dom.gameOverlay.classList.add('hidden');
      state.dom.gameOverlay.style.display = 'none';
    }
    
    document.body.style.overflow = '';
    
    if (state.audio.ready && state.audio.thrustOsc && state.audio.thrustOsc.state === 'started') {
      state.audio.thrustOsc.stop();
    }
    
    cancelAnimationFrame(state.gameLoopId);
    window.removeEventListener('keydown', handleKeyDown);
    window.removeEventListener('keyup', handleKeyUp);
    window.removeEventListener('keydown', handleEscKey);
    
    // Hide mobile controls
    if (state.dom.mobileControls) {
      state.dom.mobileControls.classList.add('hidden');
    }
  };

  function bindUI() {
    console.log('Binding game UI');
    
    state.dom.playGameBtn = document.getElementById('play-game-btn');
    state.dom.closeGameBtn = document.getElementById('close-game-btn');
    state.dom.gameOverlay = document.getElementById('game-overlay');
    state.dom.gameControlsModal = document.getElementById('game-controls-modal');
    state.dom.startGameBtn = document.getElementById('start-game-btn');
    state.dom.canvas = document.getElementById('game-canvas');
    state.dom.ctx = state.dom.canvas?.getContext('2d');
    state.dom.scoreEl = document.getElementById('game-score');
    state.dom.gameMessageEl = document.getElementById('game-message');
    state.dom.gameOverTextEl = document.getElementById('game-over-text');
    state.dom.finalScoreTextEl = document.getElementById('final-score-text');
    state.dom.mobileControls = document.getElementById('mobile-game-controls');

    if (!state.dom.playGameBtn) {
      console.error('Play game button not found');
      return;
    }
    
    if (!state.dom.startGameBtn) {
      console.error('Start game button not found');
      return;
    }

    console.log('Adding event listeners');
    state.dom.playGameBtn.addEventListener('click', (e) => {
      console.log('Play button clicked');
      e.preventDefault();
      openControlsModal();
    });
    
    state.dom.startGameBtn.addEventListener('click', async (e) => {
      console.log('Start button clicked');
      e.preventDefault();
      await openGame();
    });
    
    if (state.dom.closeGameBtn) {
      state.dom.closeGameBtn.addEventListener('click', (e) => {
        console.log('Close button clicked');
        e.preventDefault();
        closeGame();
      });
    }
    
    setupTouchControls();
    
    console.log('Game UI bound successfully');
  }

  window.initGameUI = function initGameUI() {
    console.log('initGameUI called');
    // Wait a bit for DOM to be fully ready
    setTimeout(bindUI, 100);
  };

  console.log('Game module initialized');
})();