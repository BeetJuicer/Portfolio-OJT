// ─── SHOWCASE CARD EXPAND/COLLAPSE ───
function toggleCard(header) {
  const card = header.closest('.showcase-card');
  card.classList.toggle('open');
}

// ─── SCRIPTS PANEL TOGGLE ───
function toggleScripts(btn) {
  btn.classList.toggle('open');
  btn.closest('.scripts-toggle').nextElementSibling.classList.toggle('visible');
}

// ─── FILE TAB SWITCHER ───
function switchTab(tab, id) {
  const panel = tab.closest('.scripts-panel');
  panel.querySelectorAll('.file-tab').forEach(t => t.classList.remove('active'));
  panel.querySelectorAll('.file-content').forEach(c => c.classList.remove('active'));
  tab.classList.add('active');
  document.getElementById(id)?.classList.add('active');
}

// ─── ACTIVE NAV HIGHLIGHT ───
const navObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      document.querySelectorAll('nav a').forEach(a => a.classList.remove('active'));
      const active = document.querySelector(`nav a[href="#${e.target.id}"]`);
      if (active) active.classList.add('active');
    }
  });
}, { threshold: 0.3 });
document.querySelectorAll('section[id]').forEach(s => navObs.observe(s));

// ─── SCROLL REVEAL ───
document.querySelectorAll('.project-row').forEach((el, i) => {
  el.classList.add('reveal');
  el.style.setProperty('--i', i);
});
document.querySelectorAll('.showcase-card').forEach((el, i) => {
  el.classList.add('reveal');
  el.style.setProperty('--i', i);
});
document.querySelectorAll('.section-head').forEach(el => el.classList.add('reveal'));

const revealObs = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
}, { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach(el => revealObs.observe(el));

// ─── BACKGROUND CANVAS ANIMATION ───
(function () {
  const canvas = document.getElementById('bg-canvas');
  const ctx = canvas.getContext('2d');
  const isDark = () => window.matchMedia('(prefers-color-scheme: dark)').matches;

  const BALLS = 8;
  let W, H, balls = [];

  function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  function makeBall() {
    const r = 40 + Math.random() * 90;
    return {
      x: Math.random() * W,
      y: Math.random() * H,
      r,
      vx: (Math.random() - 0.5) * 0.7,
      vy: (Math.random() - 0.5) * 0.7,
      hue: Math.random() < 0.5
        ? 150 + Math.random() * 30
        : 190 + Math.random() * 40,
      alpha: 0.06 + Math.random() * 0.08,
      phase: Math.random() * Math.PI * 2,
      speed: 0.004 + Math.random() * 0.003
    };
  }

  resize();
  for (let i = 0; i < BALLS; i++) balls.push(makeBall());
  window.addEventListener('resize', resize);

  let frame = 0;
  function draw() {
    ctx.clearRect(0, 0, W, H);
    const dark = isDark();
    frame++;
    balls.forEach(b => {
      b.x += b.vx;
      b.y += b.vy;
      if (b.x < -b.r) b.x = W + b.r;
      if (b.x > W + b.r) b.x = -b.r;
      if (b.y < -b.r) b.y = H + b.r;
      if (b.y > H + b.r) b.y = -b.r;

      const pulse = 1 + 0.06 * Math.sin(frame * b.speed + b.phase);
      const rad = b.r * pulse;
      const alpha = b.alpha * (dark ? 0.7 : 1);

      const grad = ctx.createRadialGradient(
        b.x - rad * 0.25, b.y - rad * 0.25, rad * 0.05,
        b.x, b.y, rad
      );
      const sat = dark ? '35%' : '55%';
      const light = dark ? '55%' : '72%';
      grad.addColorStop(0,   `hsla(${b.hue},${sat},${light},${alpha * 1.6})`);
      grad.addColorStop(0.5, `hsla(${b.hue},${sat},${light},${alpha})`);
      grad.addColorStop(1,   `hsla(${b.hue},${sat},${light},0)`);

      ctx.beginPath();
      ctx.arc(b.x, b.y, rad, 0, Math.PI * 2);
      ctx.fillStyle = grad;
      ctx.fill();
    });
    requestAnimationFrame(draw);
  }
  draw();
})();