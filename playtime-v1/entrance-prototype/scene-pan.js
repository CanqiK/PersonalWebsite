const viewport = document.getElementById('entrance');
const hint = document.querySelector('.scene-pan-hint');
const finePointer = matchMedia('(hover: hover) and (pointer: fine)');
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
let pointer = null;
let frame = 0;
let previous = 0;
let scrollPosition = null;

function stop() {
  cancelAnimationFrame(frame);
  frame = 0;
  previous = 0;
  pointer = null;
  scrollPosition = null;
}

function updateHint() {
  stop();
  hint.textContent = !finePointer.matches ? 'Swipe to explore →'
    : reducedMotion.matches ? 'Scroll horizontally to explore ↔'
      : 'Move the mouse left or right to look around ↔';
}

function desiredPosition() {
  if (!pointer || document.hidden || !finePointer.matches || reducedMotion.matches) return null;
  const rect = viewport.getBoundingClientRect();
  // Every horizontal mouse position maps to the same fraction of the full view.
  const fraction = Math.max(0, Math.min(1, (pointer.x - rect.left) / Math.max(1, rect.width - 1)));
  const range = Math.max(0, viewport.scrollWidth - viewport.clientWidth);
  return fraction * range;
}

function tick(now) {
  frame = 0;
  const dt = previous ? Math.min((now - previous) / 1000, .05) : 1 / 60;
  previous = now;
  const desired = desiredPosition();
  if (desired === null) { stop(); return; }
  if (scrollPosition === null) scrollPosition = viewport.scrollLeft;
  // Brief easing softens the follow without changing the cursor-to-view mapping.
  const next = scrollPosition + (desired - scrollPosition) * (1 - Math.exp(-dt * 14));
  scrollPosition = next;
  viewport.scrollLeft = next;
  if (Math.abs(desired - next) < .25) {
    viewport.scrollLeft = desired;
    stop();
    return;
  }
  frame = requestAnimationFrame(tick);
}

viewport.addEventListener('pointermove', event => {
  if (event.pointerType !== 'mouse' || event.buttons) { stop(); return; }
  pointer = { x: event.clientX, y: event.clientY };
  if (!frame && desiredPosition() !== null) frame = requestAnimationFrame(tick);
}, { passive: true });
viewport.addEventListener('pointerleave', stop);
viewport.addEventListener('pointerdown', stop);
viewport.addEventListener('wheel', stop, { passive: true });
viewport.addEventListener('scene:focus-entry', stop);
document.addEventListener('visibilitychange', stop);
addEventListener('blur', stop);
addEventListener('resize', stop);
finePointer.addEventListener('change', updateHint);
reducedMotion.addEventListener('change', updateHint);
updateHint();
