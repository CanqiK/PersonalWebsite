const html = document.documentElement;
let timers = [];
function clearHit() {
  timers.forEach(clearTimeout);
  timers = [];
  html.classList.remove('cursor-hit');
}
document.addEventListener('click', event => {
  const bubble = event.target.closest('.worker-bubble:not(.shard)');
  if (!bubble || bubble.hidden || event.button !== 0 || event.ctrlKey || event.metaKey || event.altKey || event.shiftKey) return;
  clearHit();
  html.classList.add('cursor-hit');
  timers.push(setTimeout(()=>html.classList.remove('cursor-hit'),75));
  if (!matchMedia('(prefers-reduced-motion: reduce)').matches) {
    timers.push(setTimeout(()=>html.classList.add('cursor-hit'),120));
    timers.push(setTimeout(()=>html.classList.remove('cursor-hit'),190));
  }
  // Touch and keyboard have no visible native cursor: place the same mark at
  // the click, or at the button centre for keyboard activation.
  if (!matchMedia('(hover:hover) and (pointer:fine)').matches || event.detail === 0) {
    const rect = bubble.getBoundingClientRect();
    const marker = document.createElement('span');
    marker.className = 'bubble-hit';
    marker.setAttribute('aria-hidden','true');
    marker.style.left = `${event.detail ? event.clientX : rect.left+rect.width/2}px`;
    marker.style.top = `${event.detail ? event.clientY : rect.top+rect.height/2}px`;
    document.body.append(marker);
    setTimeout(()=>marker.remove(),240);
  }
},true);
addEventListener('pagehide',clearHit);
