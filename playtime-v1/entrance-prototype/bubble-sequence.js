const root = document.getElementById('entrance');
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
const entry = document.getElementById('entry-link');
const randomDelay = () => 1000 + Math.random() * 2000;
let firstDelay = 1000;
const bubbles = [...document.querySelectorAll('.worker-bubble[data-role]')].map(node => {
  const state = makeState(node, firstDelay);
  firstDelay += 450 + Math.random() * 200;
  return state;
});
const reward = makeState(entry, Infinity);
let unlocked = false;
let autoShattering = false;
let shatterElapsed = 0;

function makeState(node, delay) {
  const body = node.querySelector('.window-body');
  const text = body.textContent;
  body.textContent = '';
  node.hidden = true;
  return { node, body, text, phase: 'waiting', elapsed: 0, delay, rounds: 0, hover: false, focus: false };
}

function begin(state) {
  state.rounds += 1;
  state.node.hidden = false;
  bubbleSound(state.node, state.node === entry ? 'target' : 'open');
  if (state.node === entry) {
    root.dispatchEvent(new Event('scene:focus-entry'));
    entry.scrollIntoView({ block: 'nearest', inline: 'center', behavior: reducedMotion.matches ? 'instant' : 'smooth' });
  }
  state.node.classList.remove('is-collapsing', 'is-typing');
  state.node.classList.add('is-opening');
  state.body.textContent = '';
  state.phase = 'opening';
  state.elapsed = 0;
}

function bubbleSound(node, kind) {
  const rect = node.getBoundingClientRect();
  const outside = rect.right <= 0 || rect.left >= innerWidth;
  root.dispatchEvent(new CustomEvent('scene:bubble-sound', {
    detail: { kind, pan: kind === 'target' ? 0 : (rect.left + rect.width / 2) / innerWidth * 2 - 1,
      level: outside && kind !== 'target' ? .35 : 1 },
  }));
}

function shatter(node) {
  if (reducedMotion.matches) return;
  const rect = node.getBoundingClientRect();
  const cuts = [
    'polygon(0 0,32% 0,36% 30%,31% 60%,37% 100%,0 100%)',
    'polygon(32% 0,69% 0,65% 35%,70% 64%,66% 100%,36% 100%,31% 60%,36% 30%)',
    'polygon(69% 0,100% 0,100% 100%,66% 100%,70% 64%,65% 35%)',
  ];
  cuts.forEach((cut, index) => {
    const piece = node.cloneNode(true);
    piece.className = 'window worker-bubble shard';
    piece.removeAttribute('data-role');
    piece.disabled = true;
    piece.tabIndex = -1;
    piece.setAttribute('aria-hidden', 'true');
    piece.style.cssText = `left:${rect.left}px;top:${rect.top}px;width:${rect.width}px;height:${rect.height}px;min-width:0;clip-path:${cut};--turn:${(index - 1) * 12}deg`;
    document.body.append(piece);
    setTimeout(() => piece.remove(), 800);
  });
}

function spark(node) {
  if (reducedMotion.matches) return;
  const rect = node.getBoundingClientRect();
  const flash = document.createElement('span');
  flash.className = 'bubble-spark';
  flash.setAttribute('aria-hidden', 'true');
  flash.style.cssText = `left:${rect.left + rect.width / 2}px;top:${rect.top + rect.height / 2}px;width:${rect.width}px`;
  document.body.append(flash);
  setTimeout(() => flash.remove(), 450);
}

let lastHoverSound = -Infinity;
function selectBubble(state) {
  if (state.hover || state.focus || performance.now() - lastHoverSound < 150) return;
  lastHoverSound = performance.now();
  bubbleSound(state.node, 'hover');
}
[...bubbles,reward].forEach(state => {
  state.node.addEventListener('pointerenter', event => {
    if (event.pointerType === 'touch') return;
    selectBubble(state); state.hover = true;
  });
  state.node.addEventListener('pointerleave', () => { state.hover = false; });
  state.node.addEventListener('focus', () => { selectBubble(state); state.focus = true; });
  state.node.addEventListener('blur', () => { state.focus = false; });
});
function breakBubble(state) {
  if (state.phase === 'broken') return;
  bubbleSound(state.node, 'break');
  shatter(state.node);
  state.node.hidden = true;
  state.phase = 'broken';
  state.hover = false;
  state.focus = false;
  state.node.dataset.state = 'broken';
  if (!unlocked && bubbles.every(bubble => bubble.phase === 'broken')) {
    unlocked = true;
    reward.delay = 500;
    reward.elapsed = 0;
  }
}
bubbles.forEach(state => state.node.addEventListener('click', () => breakBubble(state)));

// One clock keeps transitions ordered and pauses the sequence in hidden tabs.
let previous = performance.now();
function tickSequence() {
  const now = performance.now();
  const delta = Math.min(now - previous, 100);
  previous = now;
  if (document.hidden || !root.classList.contains('scene-ready') || root.classList.contains('scene-3d-pending')) return;
  const introOpen = root.classList.contains('canqi-hover');
  for (const state of [...bubbles, reward]) {
    if (state.phase === 'broken' || (introOpen && state !== reward) || root.inert) continue;
    state.elapsed += delta;
    if (state.phase === 'waiting' && state.elapsed >= state.delay) begin(state);
    else if (state.phase === 'opening' && state.elapsed >= 180) {
      state.node.classList.remove('is-opening');
      state.node.classList.add('is-typing');
      state.phase = 'typing';
      state.elapsed = 0;
    } else if (state.phase === 'typing') {
      const count = reducedMotion.matches ? state.text.length : Math.floor(state.elapsed / 85);
      state.body.textContent = state.text.slice(0, count);
      if (count >= state.text.length) {
        state.phase = 'visible';
        state.elapsed = 0;
        state.node.classList.remove('is-typing');
      }
    } else if (state.phase === 'visible' && state !== reward && state.rounds < 2 && state.elapsed >= 6000) {
      state.phase = 'collapsing';
      state.elapsed = 0;
      state.node.classList.add('is-collapsing');
      bubbleSound(state.node, 'close');
      spark(state.node);
    } else if (state.phase === 'collapsing' && state.elapsed >= 420) {
      state.node.hidden = true;
      state.node.classList.remove('is-collapsing');
      state.phase = 'waiting';
      state.elapsed = 0;
      state.delay = randomDelay();
    }
    state.node.dataset.state = state.phase;
  }
  // Finish the second reading of every remaining bubble, then break them in order.
  // Hover/focus does not restart the clock; only hidden scene states pause it.
  if (!unlocked && !introOpen && !root.inert) {
    const remaining = bubbles.filter(state => state.phase !== 'broken');
    if (!autoShattering && remaining.every(state => state.rounds >= 2 && state.phase === 'visible' && state.elapsed >= 6000)) {
      autoShattering = true;
      shatterElapsed = 450;
    }
    if (autoShattering) {
      shatterElapsed += delta;
      if (shatterElapsed >= 450 && remaining.length) {
        shatterElapsed = 0;
        breakBubble(remaining[0]);
      }
    }
  }
  // The reward remains interactive, but no longer needs a 25 Hz sequence clock.
  if (reward.phase === 'visible') { clearInterval(sequenceTimer);sequenceTimer=0; }
}
let sequenceTimer=setInterval(tickSequence,40);
document.addEventListener('visibilitychange',()=>{
  clearInterval(sequenceTimer);sequenceTimer=0;
  previous=performance.now();
  if(!document.hidden&&reward.phase!=='visible')sequenceTimer=setInterval(tickSequence,40);
});
