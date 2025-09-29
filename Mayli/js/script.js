// Confetti + hearts for Mayli
(function () {
  const canvas = document.getElementById('confetti-canvas');
  const ctx = canvas.getContext('2d');

  let width = 0;
  let height = 0;
  let animationFrameId = 0;

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  const CONFETTI_COLORS = ['#ff68b8', '#7f6bff', '#ffd166', '#06d6a0', '#ef476f'];

  function random(min, max) { return Math.random() * (max - min) + min; }

  class Particle {
    constructor(x, y, shape) {
      this.x = x;
      this.y = y;
      this.vx = random(-1.5, 1.5);
      this.vy = random(-3, -1);
      this.size = random(6, 12);
      this.color = CONFETTI_COLORS[(Math.random() * CONFETTI_COLORS.length) | 0];
      this.rotation = random(0, Math.PI * 2);
      this.rotationSpeed = random(-0.1, 0.1);
      this.shape = shape; // 'rect' | 'heart'
      this.life = 0;
      this.maxLife = random(120, 240);
    }

    update() {
      this.vy += 0.04; // gravity
      this.x += this.vx;
      this.y += this.vy;
      this.rotation += this.rotationSpeed;
      this.life++;
      if (this.y > height + 20) this.y = -20;
    }

    draw(ctx) {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate(this.rotation);
      ctx.fillStyle = this.color;
      if (this.shape === 'rect') {
        ctx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size * 0.6);
      } else {
        drawHeart(ctx, 0, 0, this.size, this.color);
      }
      ctx.restore();
    }
  }

  function drawHeart(ctx, x, y, size, color) {
    const s = size / 15;
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(x, y + 3 * s);
    ctx.bezierCurveTo(x - 12 * s, y - 10 * s, x - 2 * s, y - 16 * s, x, y - 4 * s);
    ctx.bezierCurveTo(x + 2 * s, y - 16 * s, x + 12 * s, y - 10 * s, x, y + 3 * s);
    ctx.closePath();
    ctx.fill();
  }

  let particles = [];

  function burst(cx, cy, amount = 140) {
    for (let i = 0; i < amount; i++) {
      const shape = Math.random() < 0.75 ? 'rect' : 'heart';
      const p = new Particle(cx + random(-20, 20), cy + random(-20, 20), shape);
      p.vx = Math.cos((i / amount) * Math.PI * 2) * random(1, 4);
      p.vy = Math.sin((i / amount) * Math.PI * 2) * random(1, 4);
      particles.push(p);
    }
  }

  function loop() {
    ctx.clearRect(0, 0, width, height);
    particles.forEach(p => {
      p.update();
      p.draw(ctx);
    });
    particles = particles.filter(p => p.life < p.maxLife);
    animationFrameId = requestAnimationFrame(loop);
  }

  // Initial gentle rain
  function gentleRain() {
    const cols = Math.min(80, Math.floor(width / 24));
    for (let i = 0; i < cols; i++) {
      const x = (i / cols) * width + random(-10, 10);
      const y = random(-height, 0);
      const shape = Math.random() < 0.85 ? 'rect' : 'heart';
      particles.push(new Particle(x, y, shape));
    }
  }

  gentleRain();
  loop();

  // Interactions
  const btn = document.getElementById('celebrateBtn');
  if (btn) {
    btn.addEventListener('click', () => {
      burst(window.innerWidth / 2, window.innerHeight * 0.3, 200);
    });
  }

  window.addEventListener('pointerdown', (e) => {
    burst(e.clientX, e.clientY, 120);
  });
})();


