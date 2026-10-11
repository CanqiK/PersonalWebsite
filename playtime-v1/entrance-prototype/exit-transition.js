// Keep the live office visible under a brief surveillance signal, then cross
// documents only after black has fully covered the viewport.
const entryLink = document.getElementById('entry-link');
const scene = document.getElementById('entrance');
const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)');
let handoff = null;

function resetHandoff() {
  if (!handoff) return;
  clearTimeout(handoff.navigation);
  clearTimeout(handoff.audio);
  cancelAnimationFrame(handoff.frame);
  handoff.overlay.remove();
  scene.classList.remove('is-transmitting');
  document.getElementById('realtime-scene').contentWindow?.postMessage({type:'canqi:signal-mode',active:false},location.origin);
  scene.inert = false;
  entryLink.removeAttribute('aria-disabled');
  handoff = null;
}

entryLink.addEventListener('click', event => {
  // Preserve open-in-new-tab and other native link gestures.
  if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
  event.preventDefault();
  if (handoff) return;
  scene.dispatchEvent(new CustomEvent('scene:bubble-sound',{detail:{kind:'break',pan:0,level:1}}));
  scene.dispatchEvent(new Event('scene:handoff'));
  const destination = new URL(entryLink.href);
  destination.searchParams.set('intro', 'canqi');
  destination.hash = 'main';
  const overlay = document.createElement('div');
  overlay.className = `signal-handoff${reduceMotion.matches ? ' signal-handoff-reduced' : ''}`;
  overlay.setAttribute('aria-hidden', 'true');
  overlay.innerHTML = `<svg class="signal-rgb-defs" aria-hidden="true"><defs><filter id="signal-rgb" x="-5%" y="-5%" width="110%" height="110%" color-interpolation-filters="sRGB"><feColorMatrix in="SourceGraphic" type="matrix" values="1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0" result="r"/><feOffset in="r" dx="5" dy="1" result="red"/><feColorMatrix in="SourceGraphic" type="matrix" values="0 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 1 0" result="gb"/><feOffset in="gb" dx="-4" dy="-1" result="cyan"/><feBlend in="red" in2="cyan" mode="screen"/></filter></defs></svg><div class="signal-monitor"><i class="signal-corner tl"></i><i class="signal-corner tr"></i><i class="signal-corner bl"></i><i class="signal-corner br"></i><span class="signal-camera">CAM_01 / CANQI</span><span class="signal-rec">[ REC ]</span><span class="signal-caption">SUBJECT IDENTIFIED<br><small>TRANSFER_001 ▪ ▪ ▪</small></span><span class="signal-palette" aria-hidden="true"></span></div><canvas class="signal-noise" width="480" height="270"></canvas><div class="signal-scan"></div><div class="signal-tear"></div><div class="signal-black"></div>`;
  document.body.append(overlay);
  scene.inert = true;
  entryLink.setAttribute('aria-disabled', 'true');
  handoff = { overlay, frame: 0, audio: 0, navigation: 0 };
  // A timer also guarantees navigation if the animation cannot run.
  handoff.navigation = setTimeout(() => location.assign(destination.href), reduceMotion.matches ? 260 : 1160);
  handoff.audio = setTimeout(() => scene.dispatchEvent(new Event('scene:leaving')), reduceMotion.matches ? 0 : 700);
  if (reduceMotion.matches) return;
  scene.classList.add('is-transmitting');
  document.getElementById('realtime-scene').contentWindow?.postMessage({type:'canqi:signal-mode',active:true},location.origin);
  const canvas = overlay.querySelector('canvas');
  const context = canvas.getContext('2d');
  if (!context) return;
  const pixels = context.createImageData(canvas.width, canvas.height);
  const started = performance.now();
  let previous = -100;
  function drawSignal(now) {
    if (!handoff || now - started > 1000) return;
    if (now - previous >= 75) {
      previous = now;
      for (let p = 0; p < pixels.data.length; p += 4) {
        const value = Math.random() * 130;
        pixels.data[p] = value;
        pixels.data[p + 1] = Math.random() > .91 ? 240 : value;
        pixels.data[p + 2] = Math.random() > .91 ? 235 : value;
        pixels.data[p + 3] = 255;
      }
      context.putImageData(pixels, 0, 0);
      // Short, quantized colour blocks read as a failing digital feed.
      for (let block = 0; block < 4; block++) {
        context.fillStyle = ['#79e8da55','#cf85d955','#c9deb733','#25354a88'][block];
        context.fillRect(Math.floor(Math.random()*60)*8,Math.floor(Math.random()*32)*8,32+Math.floor(Math.random()*12)*8,4+block*2);
      }
    }
    handoff.frame = requestAnimationFrame(drawSignal);
  }
  handoff.frame = requestAnimationFrame(drawSignal);
});

addEventListener('pagehide', () => {
  if (handoff) cancelAnimationFrame(handoff.frame);
});
addEventListener('pageshow', event => {
  if (!event.persisted) return;
  resetHandoff();
  scene.dispatchEvent(new Event('scene:returned'));
});
