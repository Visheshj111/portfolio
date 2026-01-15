// Vanilla JS Tilted Card Effect
// Applies to .tilted-card-figure elements
(function() {
  var figures = document.querySelectorAll('.tilted-card-figure');
  figures.forEach(function(figure) {
    var inner = figure.querySelector('.tilted-card-inner');
    var caption = figure.querySelector('.tilted-card-caption');
    var scaleOnHover = parseFloat(figure.getAttribute('data-scale') || '1.1');
    var rotateAmplitude = parseFloat(figure.getAttribute('data-rotate') || '14');
    var lastY = 0;
    function handleMouse(e) {
      var rect = figure.getBoundingClientRect();
      var offsetX = e.clientX - rect.left - rect.width / 2;
      var offsetY = e.clientY - rect.top - rect.height / 2;
      var rotationX = (offsetY / (rect.height / 2)) * -rotateAmplitude;
      var rotationY = (offsetX / (rect.width / 2)) * rotateAmplitude;
      inner.style.transform = `rotateX(${rotationX}deg) rotateY(${rotationY}deg) scale(${scaleOnHover})`;
      if (caption) {
        caption.style.left = (e.clientX - rect.left) + 'px';
        caption.style.top = (e.clientY - rect.top) + 'px';
        caption.style.opacity = 1;
        var velocityY = offsetY - lastY;
        caption.style.transform = `rotate(${-velocityY * 0.6}deg)`;
        lastY = offsetY;
      }
    }
    function handleMouseEnter() {
      inner.style.transition = 'transform 0.2s cubic-bezier(.25,.46,.45,.94)';
      if (caption) caption.style.opacity = 1;
    }
    function handleMouseLeave() {
      inner.style.transform = 'rotateX(0deg) rotateY(0deg) scale(1)';
      inner.style.transition = 'transform 0.4s cubic-bezier(.25,.46,.45,.94)';
      if (caption) {
        caption.style.opacity = 0;
        caption.style.transform = 'rotate(0deg)';
      }
    }
    figure.addEventListener('mousemove', handleMouse);
    figure.addEventListener('mouseenter', handleMouseEnter);
    figure.addEventListener('mouseleave', handleMouseLeave);
  });
})();
