const viewport = document.getElementById('entrance');
const hint = document.querySelector('.scene-pan-hint');
const realtime = document.getElementById('realtime-scene');
const finePointer = matchMedia('(hover: hover) and (pointer: fine)');
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
let pointer = null;
let frame = 0;
let previous = 0;
let scrollPosition = null;

function cameraMessage(data) {
  realtime?.contentWindow?.postMessage({ type: 'canqi:camera-follow', ...data }, location.origin);
}
function deadzone(value) {
  const outside = Math.max(0, (Math.min(1, Math.abs(value)) - .20) / .80);
  return Math.sign(value) * outside * outside;
}
function resetCamera() { cameraMessage({ x: 0, y: 0 }); }

function stop() {
  cancelAnimationFrame(frame);
  frame = 0;
  previous = 0;
  pointer = null;
  scrollPosition = null;
}

function updateHint() {
  stop();
  resetCamera();
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
  if (event.pointerType !== 'mouse' || event.buttons || !finePointer.matches || reducedMotion.matches) { stop(); return; }
  if (viewport.scrollWidth - viewport.clientWidth <= 1) {
    const rect = viewport.getBoundingClientRect();
    cameraMessage({
      x: deadzone((event.clientX - rect.left) / rect.width * 2 - 1),
      y: deadzone(1 - (event.clientY - rect.top) / rect.height * 2),
    });
    return;
  }
  pointer = { x: event.clientX, y: event.clientY };
  if (!frame && desiredPosition() !== null) frame = requestAnimationFrame(tick);
}, { passive: true });
viewport.addEventListener('pointerleave', () => { stop(); resetCamera(); });
viewport.addEventListener('pointerdown', () => { stop(); cameraMessage({ freeze: true }); });
viewport.addEventListener('wheel', stop, { passive: true });
viewport.addEventListener('scene:focus-entry', stop);
document.addEventListener('visibilitychange', () => { stop(); resetCamera(); });
addEventListener('blur', () => { stop(); resetCamera(); });
addEventListener('resize', updateHint);
finePointer.addEventListener('change', updateHint);
reducedMotion.addEventListener('change', updateHint);
updateHint();
