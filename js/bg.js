/* SnapTune — Cinematic Canvas Background v1.0 */
(function () {
  'use strict';

  const canvas = document.createElement('canvas');
  canvas.id = 'bg-canvas';
  canvas.style.cssText = `
    position: fixed;
    inset: 0;
    width: 100%;
    height: 100%;
    z-index: 0;
    pointer-events: none;
    display: block;
  `;
  document.body.insertBefore(canvas, document.body.firstChild);

  const ctx = canvas.getContext('2d');
  let W, H, dpr, mouse = { x: -9999, y: -9999 };
  let frame = 0;
  let raf;

  // ---------- palette ----------
  const C = {
    p:  [104,  69, 200],   // indigo
    q:  [190,  70, 140],   // violet-pink
    t:  [ 40, 180, 175],   // teal
    bg: [  5,   4,  14],   // near-black
  };

  // ---------- orbs ----------
  class Orb {
    constructor(xr, yr, r, color, speed, phase) {
      this.xr = xr; this.yr = yr;
      this.r  = r;
      this.color = color;
      this.speed = speed;
      this.phase = phase;
      this.ox = 0; this.oy = 0;
    }
    tick(t) {
      this.ox = Math.sin(t * this.speed + this.phase)      * W * 0.12;
      this.oy = Math.cos(t * this.speed * 0.7 + this.phase) * H * 0.10;
    }
    draw(ctx) {
      const x = W * this.xr + this.ox;
      const y = H * this.yr + this.oy;
      const r = Math.min(W, H) * this.r;
      const g = ctx.createRadialGradient(x, y, 0, x, y, r);
      const [R, G, B] = this.color;
      g.addColorStop(0,   `rgba(${R},${G},${B},0.55)`);
      g.addColorStop(0.4, `rgba(${R},${G},${B},0.20)`);
      g.addColorStop(1,   `rgba(${R},${G},${B},0)`);
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fillStyle = g;
      ctx.fill();
    }
  }

  const orbs = [
    new Orb(0.15, 0.15, 0.70, C.p, 0.18, 0.0),
    new Orb(0.85, 0.80, 0.60, C.q, 0.14, 1.2),
    new Orb(0.50, 0.55, 0.55, C.t, 0.10, 2.4),
    new Orb(0.80, 0.10, 0.45, C.p, 0.22, 3.6),
    new Orb(0.10, 0.85, 0.40, C.q, 0.16, 5.0),
  ];

  // ---------- particles ----------
  class Particle {
    constructor() { this.reset(true); }
    reset(init) {
      this.x  = Math.random() * W;
      this.y  = init ? Math.random() * H : H + 10;
      this.vy = -(0.15 + Math.random() * 0.35);
      this.vx = (Math.random() - 0.5) * 0.2;
      this.size = 0.5 + Math.random() * 1.5;
      this.life = 0;
      this.maxLife = 200 + Math.random() * 300;
      const colors = [C.p, C.q, C.t];
      this.color = colors[Math.floor(Math.random() * colors.length)];
    }
    tick() {
      this.x  += this.vx;
      this.y  += this.vy;
      this.life++;
      // gentle mouse attraction
      const dx = mouse.x - this.x;
      const dy = mouse.y - this.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 160) {
        this.vx += (dx / dist) * 0.006;
        this.vy += (dy / dist) * 0.006;
      }
      if (this.life > this.maxLife || this.y < -10) this.reset(false);
    }
    draw(ctx) {
      const alpha = Math.sin((this.life / this.maxLife) * Math.PI) * 0.7;
      const [R, G, B] = this.color;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${R},${G},${B},${alpha})`;
      ctx.fill();
    }
  }

  let particles = [];

  // ---------- aurora streaks ----------
  function drawAurora(ctx, t) {
    for (let i = 0; i < 3; i++) {
      const phase = i * 2.1;
      const y0 = H * (0.25 + i * 0.25 + Math.sin(t * 0.12 + phase) * 0.06);
      const cp1x = W * 0.25;
      const cp1y = y0 + Math.sin(t * 0.08 + phase) * H * 0.12;
      const cp2x = W * 0.75;
      const cp2y = y0 - Math.cos(t * 0.10 + phase) * H * 0.10;
      const colors = [[C.p, C.q], [C.q, C.t], [C.t, C.p]];
      const [cA, cB] = colors[i];

      const grad = ctx.createLinearGradient(0, y0 - 80, 0, y0 + 80);
      grad.addColorStop(0,   `rgba(${cA[0]},${cA[1]},${cA[2]},0)`);
      grad.addColorStop(0.5, `rgba(${cA[0]},${cA[1]},${cA[2]},0.06)`);
      grad.addColorStop(1,   `rgba(${cB[0]},${cB[1]},${cB[2]},0)`);

      ctx.save();
      ctx.beginPath();
      ctx.moveTo(0, y0 + 80);
      ctx.bezierCurveTo(cp1x, cp1y + 80, cp2x, cp2y + 80, W, y0 + 80);
      ctx.lineTo(W, y0 - 80);
      ctx.bezierCurveTo(cp2x, cp2y - 80, cp1x, cp1y - 80, 0, y0 - 80);
      ctx.closePath();
      ctx.fillStyle = grad;
      ctx.filter = 'blur(18px)';
      ctx.globalAlpha = 0.9;
      ctx.fill();
      ctx.restore();
    }
  }

  // ---------- mouse glow ----------
  function drawMouseGlow(ctx) {
    if (mouse.x < 0) return;
    const g = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, 200);
    g.addColorStop(0,   'rgba(104,69,200,0.10)');
    g.addColorStop(0.5, 'rgba(190,70,140,0.04)');
    g.addColorStop(1,   'rgba(0,0,0,0)');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, W, H);
  }

  // ---------- resize ----------
  function resize() {
    dpr = window.devicePixelRatio || 1;
    W   = window.innerWidth;
    H   = window.innerHeight;
    canvas.width  = W * dpr;
    canvas.height = H * dpr;
    canvas.style.width  = W + 'px';
    canvas.style.height = H + 'px';
    ctx.scale(dpr, dpr);

    // recreate particles on resize
    particles = Array.from({ length: 80 }, () => new Particle());
  }

  // ---------- render ----------
  function render() {
    frame++;
    const t = frame * 0.016; // ~1s per 60 frames

    ctx.clearRect(0, 0, W, H);

    // solid bg
    ctx.fillStyle = `rgb(${C.bg[0]},${C.bg[1]},${C.bg[2]})`;
    ctx.fillRect(0, 0, W, H);

    // orbs (blurred radial blobs)
    ctx.save();
    ctx.filter = 'blur(60px)';
    orbs.forEach(o => { o.tick(t); o.draw(ctx); });
    ctx.restore();

    // aurora streaks
    drawAurora(ctx, t);

    // particles
    ctx.save();
    particles.forEach(p => { p.tick(); p.draw(ctx); });
    ctx.restore();

    // mouse reactive glow
    drawMouseGlow(ctx);

    raf = requestAnimationFrame(render);
  }

  // ---------- init ----------
  function init() {
    resize();
    window.addEventListener('resize', resize, { passive: true });
    window.addEventListener('mousemove', e => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    }, { passive: true });
    render();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
