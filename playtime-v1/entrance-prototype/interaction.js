const root = document.getElementById('entrance');
const realtimeFrame = document.getElementById('realtime-scene');
const noiseSlider = document.getElementById('scene-noise');
const noiseValue = document.getElementById('scene-noise-value');
const noiseLayer = document.querySelector('.scene-grain');
const noiseStorageKey = 'canqi-scene-noise';
try {
  const savedNoise = localStorage.getItem(noiseStorageKey);
  if (savedNoise !== null && Number.isFinite(Number(savedNoise))) {
    noiseSlider.value = String(Math.max(0, Math.min(100, Number(savedNoise))));
  }
} catch {}
function updateNoise() {
  const amount = Number(noiseSlider.value);
  noiseLayer.style.opacity = String(amount / 100);
  noiseValue.value = `${amount}%`;
  noiseSlider.setAttribute('aria-valuetext', `${amount}%`);
}
noiseSlider.addEventListener('input', updateNoise);
noiseSlider.addEventListener('change', () => {
  try { localStorage.setItem(noiseStorageKey, noiseSlider.value); } catch {}
});
updateNoise();

const loader = document.getElementById('boot-loader');
const computer = document.getElementById('boot-computer');
const bootStatus = document.getElementById('boot-status');
const progress = document.getElementById('boot-progress');
const progressFill = document.getElementById('boot-progress-fill');
const progressText = document.getElementById('boot-percent');
const retry = document.getElementById('boot-retry');
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
const bootStarted = performance.now();
let bootState = 'loading';
let progressValue = 0;
function showProgress(value, label) {
  if (bootState !== 'loading') return;
  if (Number.isFinite(value)) {
    progressValue = Math.max(progressValue, Math.min(100, Math.round(value)));
    progress.setAttribute('aria-valuenow', String(progressValue));
    progressFill.style.transform = `scaleX(${progressValue / 100})`;
    progressText.textContent = `${progressValue}%`;
  }
  if (label) bootStatus.textContent = label;
}
function showLoadError() {
  if (bootState !== 'loading') return;
  bootState = 'error';
  clearTimeout(loadingTimeout);
  bootStatus.textContent = 'CONNECTION INTERRUPTED';
  progressText.textContent = 'PLEASE RETRY';
  retry.hidden = false;
  loader.classList.add('boot-error');
}
const loadingTimeout = setTimeout(showLoadError, 60000);
retry.addEventListener('click', () => location.reload());
const pause = duration => new Promise(resolve => setTimeout(resolve, duration));
async function enterScene() {
  showProgress(100, 'OFFICE READY');
  bootState = 'revealing';
  clearTimeout(loadingTimeout);
  root.classList.add('scene-3d');
  await pause(Math.max(180, 850 - (performance.now() - bootStarted)));
  loader.classList.add('is-powering-off');
  await pause(reducedMotion.matches ? 120 : 380);
  computer.style.opacity = '0';
  await pause(reducedMotion.matches ? 0 : 100);
  loader.hidden = true;
  // The live scene itself is clipped; this is a real opening in the black frame.
  const radius = Math.ceil(Math.hypot(root.clientWidth, root.clientHeight) / 2) + 2;
  const keyframes = reducedMotion.matches
    ? [{ clipPath: `circle(${radius}px at 50% 50%)`, opacity: 0 },
      { clipPath: `circle(${radius}px at 50% 50%)`, opacity: 1 }]
    : [{ clipPath: 'circle(0px at 50% 50%)' }, { clipPath: `circle(${radius}px at 50% 50%)` }];
  const reveal = root.animate(keyframes, { duration: reducedMotion.matches ? 180 : 760,
    easing: 'cubic-bezier(.22,.7,.18,1)', fill: 'forwards' });
  await reveal.finished;
  root.classList.add('scene-entered', 'scene-ready');
  root.classList.remove('scene-3d-pending');
  root.inert = false;
  root.setAttribute('aria-busy', 'false');
  reveal.cancel();
  bootState = 'entered';
  root.dispatchEvent(new Event('scene:entered'));
  if (document.activeElement === document.body) root.focus({ preventScroll: true });
}
addEventListener('message', event => {
  if (event.origin !== location.origin || event.source !== realtimeFrame.contentWindow) return;
  if (event.data?.type === 'canqi:camera-anchors') {
    const { anchors, box } = event.data;
    if (!anchors || !['artist','designer','mentor','director','entry'].every(role =>
      Array.isArray(anchors[role]) && anchors[role].length === 2 && anchors[role].every(Number.isFinite)) ||
      !Array.isArray(box) || box.length !== 4 || !box.every(Number.isFinite)) return;
    root.dispatchEvent(new CustomEvent('scene:3d-anchors', { detail: { anchors, box } }));
    queuePointer();
    return;
  }
  if (bootState !== 'loading') return;
  if (event.data?.type === 'canqi:3d-progress') {
    showProgress(event.data.value, event.data.label);
    return;
  }
  if (event.data?.type === 'canqi:3d-error') { showLoadError(); return; }
  if (event.data?.type !== 'canqi:3d-ready') return;
  const anchors = event.data.bubbleAnchors;
  const box = event.data.canqiBox;
  if (!anchors || !['artist','designer','mentor','director','entry'].every(role =>
      Array.isArray(anchors[role]) && anchors[role].length === 2 && anchors[role].every(Number.isFinite)) ||
      !Array.isArray(box) || box.length !== 4 || !box.every(Number.isFinite)) return;
  root.dispatchEvent(new CustomEvent('scene:3d-anchors', { detail: { anchors, box } }));
  enterScene();
});
realtimeFrame.addEventListener('error', showLoadError);

// The iframe does not intercept the scene's bubbles. Relay the real pointer in
// its full, horizontally panned canvas coordinates instead.
let headPointer = null;
let pointerFrame = 0;
function relayPointer() {
  pointerFrame = 0;
  if (bootState !== 'entered') return;
  const rect = realtimeFrame.getBoundingClientRect();
  realtimeFrame.contentWindow?.postMessage({ type: 'canqi:pointer',
    active: Boolean(headPointer),
    x: headPointer ? (headPointer.x - rect.left) / rect.width * 2 - 1 : 0,
    y: headPointer ? 1 - (headPointer.y - rect.top) / rect.height * 2 : 0,
  }, location.origin);
}
function queuePointer() {
  if (!pointerFrame) pointerFrame = requestAnimationFrame(relayPointer);
}
root.addEventListener('pointermove', event => {
  if (event.pointerType !== 'mouse' && event.pointerType !== 'pen') return;
  headPointer = { x: event.clientX, y: event.clientY };
  queuePointer();
}, { passive: true });
function clearPointer() { headPointer = null; queuePointer(); }
root.addEventListener('pointerleave', clearPointer);
root.addEventListener('scroll', queuePointer, { passive: true });
addEventListener('blur', clearPointer);

import './bubble-sequence.js?v=rounds-pin-3';
import './intro-window.js?v=rounds-pin-3';
import './scene-anchors.js?v=rounds-pin-3';
import './scene-pan.js?v=depth-pan-2';
import './ambience.js?v=auto-sound-8';
import './exit-transition.js?v=handoff-fix-6';
import './hit-feedback.js?v=digital-3';
