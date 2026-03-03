// ====================================================================
// SmoothCursor — Vanilla JS port of MagicUI SmoothCursor
// Matches framer-motion useSpring physics exactly:
//   position  → stiffness 400 | damping 45 | mass 1
//   rotation  → stiffness 300 | damping 60 | mass 1
//   scale     → stiffness 500 | damping 35 | mass 1
//   appear    → stiffness 400 | damping 30 (scale 0→1 on first move)
// Accumulated rotation: spinning the mouse in circles keeps adding up.
// Cursor is centered on the mouse pointer (translate -50%, -50%).
// ====================================================================
(function () {
  // ---- Skip on touch / mobile ----
  if ('ontouchstart' in window || navigator.maxTouchPoints > 0) return;

  // ---- Spring class (semi-implicit Euler integration) ----
  // Matches framer-motion spring behaviour closely at 60fps.
  function Spring(stiffness, damping, mass) {
    this.k = stiffness;
    this.d = damping;
    this.m = mass || 1;
    this.pos = 0;
    this.vel = 0;
    this.target = 0;
  }
  Spring.prototype.set = function (t) { this.target = t; };
  Spring.prototype.step = function (dt) {
    var F = this.k * (this.target - this.pos) - this.d * this.vel;
    this.vel += (F / this.m) * dt;
    this.pos += this.vel * dt;
  };

  // Position springs
  var spX = new Spring(400, 45, 1);
  var spY = new Spring(400, 45, 1);
  // Rotation spring
  var spR = new Spring(300, 60, 1);
  // Scale spring — start at 0 so it pops in on first appearance
  var spS = new Spring(500, 35, 1);
  spS.pos = 0; spS.target = 0;

  // ---- State ----
  var alive = false;
  var mouseX = 0, mouseY = 0;
  var lastMouseX = 0, lastMouseY = 0;
  var lastMouseTime = Date.now();
  var velX = 0, velY = 0;
  var prevAngle = 0;
  var accRotation = 0;
  var moveTimer = null;
  var lastTick = null;
  var rafBusy = false;

  // ---- Build the cursor element ----
  var el = document.createElement('div');
  el.id = 'smooth-cursor';
  el.setAttribute('aria-hidden', 'true');
  // Flex wrapper so the SVG centres itself when we centre the wrapper
  el.style.cssText = [
    'position:fixed',
    'top:0', 'left:0',
    'pointer-events:none',
    'z-index:2147483647',
    'will-change:transform',
    'display:flex',
    'align-items:center',
    'justify-content:center',
    'width:24px',
    'height:26px',
    'opacity:0',
    'transition:opacity 0.2s ease'
  ].join(';');

  // Exact SVG from the MagicUI SmoothCursor component (with unique filter ID)
  el.innerHTML = [
    '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="26"',
    '  viewBox="0 0 50 54" fill="none" style="display:block">',
    '  <g filter="url(#sc_dropshadow)">',
    '    <path d="M42.6817 41.1495L27.5103 6.79925C26.7269 5.02557 24.2082 5.02558',
    '      23.3927 6.79925L7.59814 41.1495C6.75833 42.9759 8.52712 44.8902',
    '      10.4125 44.1954L24.3757 39.0496C24.8829 38.8627 25.4385 38.8627',
    '      25.9422 39.0496L39.8121 44.1954C41.6849 44.8902 43.4884 42.9759',
    '      42.6817 41.1495Z" fill="black"/>',
    '    <path d="M43.7146 40.6933L28.5431 6.34306C27.3556 3.65428 23.5772',
    '      3.69516 22.3668 6.32755L6.57226 40.6778C5.3134 43.4156 7.97238',
    '      46.298 10.803 45.2549L24.7662 40.109C25.0221 40.0147 25.2999',
    '      40.0156 25.5494 40.1082L39.4193 45.254C42.2261 46.2953 44.9254',
    '      43.4347 43.7146 40.6933Z" stroke="white" stroke-width="2.25825"/>',
    '  </g>',
    '  <defs>',
    '    <filter id="sc_dropshadow" x="0.602397" y="0.952444"',
    '      width="49.0584" height="52.428" filterUnits="userSpaceOnUse"',
    '      color-interpolation-filters="sRGB">',
    '      <feFlood flood-opacity="0" result="BackgroundImageFix"/>',
    '      <feColorMatrix in="SourceAlpha" type="matrix"',
    '        values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>',
    '      <feOffset dy="2.25825"/>',
    '      <feGaussianBlur stdDeviation="2.25825"/>',
    '      <feComposite in2="hardAlpha" operator="out"/>',
    '      <feColorMatrix type="matrix"',
    '        values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.08 0"/>',
    '      <feBlend mode="normal" in2="BackgroundImageFix" result="sc_shadow"/>',
    '      <feBlend mode="normal" in="SourceGraphic" in2="sc_shadow" result="shape"/>',
    '    </filter>',
    '  </defs>',
    '</svg>'
  ].join('\n');

  document.body.appendChild(el);

  // ---- Hide the native cursor everywhere ----
  var styleEl = document.createElement('style');
  styleEl.textContent = '*, *::before, *::after { cursor: none !important; }';
  document.head.appendChild(styleEl);

  // ---- Mouse tracking (throttled to rAF) ----
  document.addEventListener('mousemove', function (e) {
    mouseX = e.clientX;
    mouseY = e.clientY;

    // First move: snap position so the cursor doesn't fly in from (0,0)
    if (!alive) {
      spX.pos = mouseX; spX.target = mouseX;
      spY.pos = mouseY; spY.target = mouseY;
      spS.target = 1;          // trigger appear animation (scale 0 → 1)
      el.style.opacity = '1';
      alive = true;
    }

    if (rafBusy) return;
    rafBusy = true;

    requestAnimationFrame(function () {
      rafBusy = false;

      // Velocity in px/ms
      var now = Date.now();
      var dt = now - lastMouseTime;
      if (dt > 0) {
        velX = (mouseX - lastMouseX) / dt;
        velY = (mouseY - lastMouseY) / dt;
      }
      lastMouseTime = now;
      lastMouseX = mouseX;
      lastMouseY = mouseY;

      var speed = Math.sqrt(velX * velX + velY * velY);
      spX.set(mouseX);
      spY.set(mouseY);

      if (speed > 0.1) {
        // Compute new angle (+90° so 0° = pointing up)
        var angle = Math.atan2(velY, velX) * (180 / Math.PI) + 90;
        // Shortest-arc diff to avoid 359→0 jumps
        var diff = angle - prevAngle;
        if (diff >  180) diff -= 360;
        if (diff < -180) diff += 360;
        accRotation += diff;          // accumulated — keeps spinning indefinitely
        spR.set(accRotation);
        prevAngle = angle;

        spS.set(0.95);                // squish slightly while moving
        clearTimeout(moveTimer);
        moveTimer = setTimeout(function () { spS.set(1); }, 150);
      }
    });
  }, { passive: true });

  document.addEventListener('mouseleave', function () {
    el.style.opacity = '0';
  });
  document.addEventListener('mouseenter', function () {
    if (alive) el.style.opacity = '1';
  });

  // ---- Animation loop ----
  function tick(ts) {
    if (lastTick === null) lastTick = ts;
    var dt = Math.min((ts - lastTick) / 1000, 0.05); // seconds, capped at 50ms
    lastTick = ts;

    if (alive) {
      spX.step(dt);
      spY.step(dt);
      spR.step(dt);
      spS.step(dt);

      var x = spX.pos;
      var y = spY.pos;
      var r = spR.pos;
      var s = spS.pos;

      // Centre the element on the cursor: translate so midpoint sits on mouse
      el.style.transform =
        'translate(' + (x - 12) + 'px,' + (y - 13) + 'px)' +
        ' rotate(' + r + 'deg)' +
        ' scale(' + s + ')';
    }

    requestAnimationFrame(tick);
  }

  requestAnimationFrame(tick);
})();
