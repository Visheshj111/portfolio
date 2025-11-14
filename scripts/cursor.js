// Custom Cursor with Trail Effect
(function() {
  // Create cursor elements
  const cursor = document.createElement('div');
  cursor.className = 'cursor';
  document.body.appendChild(cursor);

  const cursorFollower = document.createElement('div');
  cursorFollower.className = 'cursor-follower';
  document.body.appendChild(cursorFollower);

  let mouseX = 0;
  let mouseY = 0;
  let cursorX = 0;
  let cursorY = 0;
  let followerX = 0;
  let followerY = 0;

  // Track mouse position
  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  // Smooth cursor animation
  function animate() {
    // Cursor follows mouse immediately
    cursorX += (mouseX - cursorX) * 0.3;
    cursorY += (mouseY - cursorY) * 0.3;
    
    // Follower has slower, smoother movement
    followerX += (mouseX - followerX) * 0.1;
    followerY += (mouseY - followerY) * 0.1;

    cursor.style.transform = `translate(${cursorX - 10}px, ${cursorY - 10}px)`;
    cursorFollower.style.transform = `translate(${followerX - 20}px, ${followerY - 20}px)`;

    requestAnimationFrame(animate);
  }

  animate();

  // Add hover effect for interactive elements
  const interactiveElements = document.querySelectorAll('a, button, .pill, .bounce-card, input, textarea');
  
  interactiveElements.forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursor.style.transform = `translate(${cursorX - 10}px, ${cursorY - 10}px) scale(1.5)`;
      cursor.style.borderColor = 'rgba(100, 200, 255, 0.9)';
      cursorFollower.style.width = '60px';
      cursorFollower.style.height = '60px';
      cursorFollower.style.background = 'rgba(100, 200, 255, 0.15)';
    });

    el.addEventListener('mouseleave', () => {
      cursor.style.transform = `translate(${cursorX - 10}px, ${cursorY - 10}px) scale(1)`;
      cursor.style.borderColor = 'rgba(255, 255, 255, 0.8)';
      cursorFollower.style.width = '40px';
      cursorFollower.style.height = '40px';
      cursorFollower.style.background = 'rgba(255, 255, 255, 0.1)';
    });
  });

  // Add click effect
  document.addEventListener('mousedown', () => {
    cursor.style.transform = `translate(${cursorX - 10}px, ${cursorY - 10}px) scale(0.8)`;
    cursorFollower.style.transform = `translate(${followerX - 20}px, ${followerY - 20}px) scale(0.8)`;
  });

  document.addEventListener('mouseup', () => {
    cursor.style.transform = `translate(${cursorX - 10}px, ${cursorY - 10}px) scale(1)`;
    cursorFollower.style.transform = `translate(${followerX - 20}px, ${followerY - 20}px) scale(1)`;
  });

  // Hide cursor when leaving window
  document.addEventListener('mouseleave', () => {
    cursor.style.opacity = '0';
    cursorFollower.style.opacity = '0';
  });

  document.addEventListener('mouseenter', () => {
    cursor.style.opacity = '1';
    cursorFollower.style.opacity = '1';
  });

  // Show default cursor on mobile
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  if (isMobile) {
    document.body.style.cursor = 'auto';
    cursor.style.display = 'none';
    cursorFollower.style.display = 'none';
  }
})();
