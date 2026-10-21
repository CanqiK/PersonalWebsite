const root = document.getElementById('entrance');
const target = document.getElementById('canqi-target');
const panel = document.getElementById('intro-window');
const close = document.getElementById('intro-close');
const heading = panel.querySelector('.window-top');
const realtime = document.getElementById('realtime-scene');
let pinned = false;
let suppressed = false;
let pointer = null;
let leaveTimer = 0;
let drag = null;

const within = (point, rect) => point && point.x >= rect.left && point.x <= rect.right &&
  point.y >= rect.top && point.y <= rect.bottom;
const inGroup = node => node instanceof Node && (target.contains(node) || panel.contains(node));
function overlaps() {
  const a = target.getBoundingClientRect(), b = panel.getBoundingClientRect();
  return a.left < b.right && a.right > b.left && a.top < b.bottom && a.bottom > b.top;
}
function sound(kind) {
  root.dispatchEvent(new CustomEvent('scene:bubble-sound', { detail: { kind, pan: -.65, level: .6 } }));
}
function show() {
  clearTimeout(leaveTimer); leaveTimer = 0;
  if (suppressed || !panel.hidden) return;
  panel.hidden = false;
  root.dispatchEvent(new Event('scene:intro-layout'));
  root.classList.add('canqi-active', 'canqi-hover');
  target.setAttribute('aria-expanded', 'true');
  realtime.contentWindow?.postMessage({type:'canqi:portrait-glitch',active:true},location.origin);
  sound('open');
}
function pin() {
  pinned = true;
  panel.classList.add('is-pinned');
  root.classList.remove('canqi-hover');
  heading.title = 'Drag to move';
}
function hide(explicit = false) {
  if (!explicit && pinned) return;
  clearTimeout(leaveTimer); leaveTimer = 0;
  if (panel.hidden) return;
  pinned = false;
  drag = null;
  panel.classList.remove('is-pinned', 'is-dragging');
  panel.hidden = true;
  heading.removeAttribute('title');
  root.classList.remove('canqi-active', 'canqi-hover');
  target.setAttribute('aria-expanded', 'false');
  realtime.contentWindow?.postMessage({type:'canqi:portrait-glitch',active:false},location.origin);
  sound('close');
}
function checkLeave() {
  leaveTimer = 0;
  if (panel.hidden || pinned || drag) return;
  if (within(pointer, target.getBoundingClientRect()) || within(pointer, panel.getBoundingClientRect())) return;
  if (inGroup(document.activeElement) && document.activeElement.matches(':focus-visible')) return;
  hide();
}
function scheduleLeave() {
  if (!leaveTimer && !panel.hidden && !pinned) leaveTimer = setTimeout(checkLeave, 80);
}
for (const node of [target, panel]) {
  node.addEventListener('pointerenter', event => {
    pointer = { x: event.clientX, y: event.clientY };
    if (event.pointerType !== 'touch') show();
  });
  node.addEventListener('pointerleave', event => {
    pointer = { x: event.clientX, y: event.clientY };
    if (!inGroup(event.relatedTarget)) scheduleLeave();
  });
  node.addEventListener('focusin', show);
  node.addEventListener('focusout', event => { if (!inGroup(event.relatedTarget)) scheduleLeave(); });
}
target.addEventListener('click', event => {
  suppressed = false;
  show();
  // Use actual overlap, not the browser fullscreen state. Keyboard and touch
  // activation remain dismissible through the close button without hover.
  if (!overlaps() || event.detail === 0 || event.pointerType === 'touch' || !matchMedia('(hover:hover)').matches) pin();
});
close.addEventListener('click', () => {
  suppressed = true;
  hide(true);
  target.focus({preventScroll:true});
});
document.addEventListener('pointermove', event => {
  pointer = { x: event.clientX, y: event.clientY };
  if (suppressed && !within(pointer, target.getBoundingClientRect())) suppressed = false;
  scheduleLeave();
}, {passive:true});
root.addEventListener('scene:3d-anchors', scheduleLeave);
addEventListener('blur', () => { pointer = null; hide(); });
addEventListener('keydown', event => {
  if (event.key === 'Escape' && !panel.hidden) { suppressed = true; hide(true); target.focus({preventScroll:true}); }
});

heading.addEventListener('pointerdown', event => {
  if (!pinned || event.button !== 0 || event.target.closest('button')) return;
  const rect = panel.getBoundingClientRect();
  drag = { id: event.pointerId, x: event.clientX - rect.left, y: event.clientY - rect.top };
  panel.classList.add('is-dragging');
  heading.setPointerCapture(event.pointerId);
  event.preventDefault();
});
heading.addEventListener('pointermove', event => {
  if (!drag || drag.id !== event.pointerId) return;
  const rect = root.getBoundingClientRect();
  const x = Math.max(8, Math.min(root.clientWidth - panel.offsetWidth - 8, event.clientX - rect.left - drag.x));
  const y = Math.max(8, Math.min(root.clientHeight - panel.offsetHeight - 8, event.clientY - rect.top - drag.y));
  panel.dataset.dragX = String(x);
  panel.dataset.dragY = String(y);
  panel.style.left = `${root.scrollLeft + x}px`;
  panel.style.top = `${y}px`;
});
function endDrag(event) {
  if (!drag || event.pointerId !== drag.id) return;
  drag = null;
  panel.classList.remove('is-dragging');
  if (heading.hasPointerCapture(event.pointerId)) heading.releasePointerCapture(event.pointerId);
}
heading.addEventListener('pointerup', endDrag);
heading.addEventListener('pointercancel', endDrag);
heading.addEventListener('lostpointercapture', endDrag);
