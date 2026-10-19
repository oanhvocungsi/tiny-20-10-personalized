/**
 * Tiny 20/10 personalized particle canvas.
 * Usage:
 * const stop = mountTinyParticles(canvas, { recipient: "tquin", fps: window.TINY_PERF?.leafFps ?? 30 });
 * stop(); // call when the scene is hidden or destroyed
 *
 * This is a standalone helper. Integrate it with the existing TINY_PERF loop rather
 * than creating a second RAF loop if the original code already owns one.
 */
export function mountTinyParticles(canvas, options = {}) {
  const ctx = canvas?.getContext?.("2d");
  if (!ctx) return () => {};
  const recipient = ["tquin", "nhi", "huong"].includes(options.recipient) ? options.recipient : "tquin";
  const fps = Math.max(12, Math.min(60, Number(options.fps) || 30));
  const palette = recipient === "tquin"
    ? { main: "#ff2a55", light: "#ffb3c6", green: "#4ad66d" }
    : recipient === "nhi"
    ? { main: "#00bbf9", light: "#caf0f8", green: "#52b788" }
    : { main: "#ff70a6", light: "#ffd670", green: "#fff0f5" };

  const reduceMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ?? false;
  const count = reduceMotion ? 10 : (window.innerWidth < 700 ? 24 : 48);
  const particles = Array.from({ length: count }, () => makeParticle(true));
  let raf = 0, stopped = false, lastFrame = 0;
  const frameInterval = 1000 / fps;
  let width = 0, height = 0, dpr = 1;

  function resize() {
    const rect = canvas.getBoundingClientRect();
    width = Math.max(1, rect.width);
    height = Math.max(1, rect.height);
    dpr = Math.min(Number(options.dpr) || window.devicePixelRatio || 1, window.innerWidth < 700 ? 1.5 : 2);
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  function makeParticle(randomY = false) {
    const candy = recipient === "huong";
    return {
      x: Math.random() * Math.max(1, width || window.innerWidth),
      y: randomY ? Math.random() * Math.max(1, height || window.innerHeight) : -20,
      size: 3 + Math.random() * (candy ? 7 : 8),
      speed: .35 + Math.random() * 1.15,
      drift: (Math.random() - .5) * .7,
      phase: Math.random() * Math.PI * 2,
      spin: (Math.random() - .5) * .06,
      angle: Math.random() * Math.PI * 2,
      type: candy ? (Math.random() < .6 ? "candy" : "heart") : "petal",
      color: Math.random() < .55 ? palette.main : palette.light
    };
  }
  function drawPetal(p) {
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(p.angle);
    ctx.globalAlpha = .65 + .3 * Math.sin(p.phase);
    ctx.fillStyle = p.color;
    ctx.shadowColor = p.color;
    ctx.shadowBlur = p.size * 1.2;
    ctx.beginPath();
    ctx.moveTo(0, -p.size);
    ctx.bezierCurveTo(p.size * 1.25, -p.size * .55, p.size, p.size * .8, 0, p.size);
    ctx.bezierCurveTo(-p.size, p.size * .55, -p.size * 1.2, -p.size * .6, 0, -p.size);
    ctx.fill();
    ctx.restore();
  }
  function drawCandy(p) {
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(p.angle);
    ctx.shadowColor = p.color;
    ctx.shadowBlur = p.size;
    if (p.type === "heart") {
      ctx.fillStyle = "#ff83b5";
      ctx.beginPath();
      ctx.moveTo(0, p.size * .8);
      ctx.bezierCurveTo(-p.size * 1.8, -p.size * .2, -p.size * .8, -p.size * 1.5, 0, -p.size * .5);
      ctx.bezierCurveTo(p.size * .8, -p.size * 1.5, p.size * 1.8, -p.size * .2, 0, p.size * .8);
      ctx.fill();
    } else {
      ctx.fillStyle = p.color;
      ctx.beginPath(); ctx.arc(0, 0, p.size * .72, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = "#fff3c8"; ctx.lineWidth = Math.max(1, p.size * .18);
      ctx.beginPath(); ctx.arc(0, 0, p.size * .45, -.7, 2.4); ctx.stroke();
      ctx.strokeStyle = "#fff"; ctx.globalAlpha = .65; ctx.beginPath(); ctx.moveTo(-p.size * 1.3, 0); ctx.lineTo(-p.size * .7, 0); ctx.moveTo(p.size * .7, 0); ctx.lineTo(p.size * 1.3, 0); ctx.stroke();
    }
    ctx.restore();
  }
  function render(now) {
    if (stopped) return;
    raf = requestAnimationFrame(render);
    if (now - lastFrame < frameInterval) return;
    lastFrame = now;
    ctx.clearRect(0, 0, width, height);
    for (const p of particles) {
      if (!reduceMotion) {
        p.y += p.speed;
        p.x += p.drift + Math.sin(p.phase) * .5;
        p.angle += p.spin;
        p.phase += .025;
      }
      if (p.y > height + 30) { Object.assign(p, makeParticle(false)); p.y = -15; }
      if (p.x < -30) p.x = width + 20;
      if (p.x > width + 30) p.x = -20;
      if (p.type === "petal") drawPetal(p); else drawCandy(p);
    }
  }
  const observer = typeof ResizeObserver !== "undefined" ? new ResizeObserver(resize) : null;
  observer?.observe(canvas);
  window.addEventListener("resize", resize, { passive: true });
  resize();
  raf = requestAnimationFrame(render);

  return () => {
    stopped = true;
    cancelAnimationFrame(raf);
    observer?.disconnect();
    window.removeEventListener("resize", resize);
    ctx.clearRect(0, 0, width, height);
  };
}
