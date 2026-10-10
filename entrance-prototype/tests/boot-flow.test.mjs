import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

// Exercise real entrance/audio modules with a deterministic clock: the ordering
// matters even when a cached model is ready before the loading screen is painted.
function environment() {
  const timers = new Map();
  let nextId = 0;
  const events = [];
  class Element extends EventTarget {
    constructor() {
      super(); this.style = {}; this.dataset = {}; this.attributes = {};
      this.hidden = false; this.inert = true; this.clientWidth = 1280; this.clientHeight = 720;
      this.classes = new Set();
      this.classList = { add: (...v) => v.forEach(x => this.classes.add(x)),
        remove: (...v) => v.forEach(x => this.classes.delete(x)), contains: x => this.classes.has(x) };
    }
    setAttribute(k, v) { this.attributes[k] = v; }
    querySelector() { return this; }
    contains(target) { return target === this; }
    focus() {}
    dispatchEvent(event) { events.push(event.type); return super.dispatchEvent(event); }
    animate() { return { finished: Promise.resolve(), cancel() {} }; }
  }
  const elements = new Map();
  const get = id => {
    if (!elements.has(id)) elements.set(id, new Element());
    return elements.get(id);
  };
  const win = new EventTarget();
  const document = new EventTarget();
  Object.assign(document, { hidden: false, getElementById: get, body: new Element() });
  const context = vm.createContext({ document, window: win, console, Event, EventTarget,
    CustomEvent: class extends Event { constructor(type, init) { super(type); this.detail = init?.detail; } },
    location: { origin: 'http://test', reload() { events.push('reload'); } },
    performance: { now: () => 0 }, matchMedia: () => ({ matches: false }),
    addEventListener: win.addEventListener.bind(win),
    setTimeout(fn, delay) { const id = ++nextId; timers.set(id, { fn, delay }); return id; },
    clearTimeout(id) { timers.delete(id); }, setInterval() {}, requestAnimationFrame() {},
  });
  return { context, get, events, timers, async nextTimer() {
    const [id, timer] = [...timers].sort((a, b) => a[1].delay - b[1].delay)[0];
    timers.delete(id); timer.fn();
    await new Promise(resolve => setImmediate(resolve));
  }, run(code) { return vm.runInContext(code, context); },
  message(data, origin = 'http://test') {
    const event = new Event('message');
    Object.assign(event, { data, origin, source: get('realtime-scene').contentWindow });
    win.dispatchEvent(event);
  } };
}
const source = file => fs.readFileSync(new URL(`../${file}`, import.meta.url), 'utf8').replace(/^import .*;\r?$/gm, '');
const ready = { type: 'canqi:3d-ready', bubbleAnchors: Object.fromEntries(
  ['artist','designer','mentor','director','entry'].map(role => [role, [1, 2]])), canqiBox: [1, 2, 3, 4] };
const boot = environment();
boot.run(source('interaction.js'));
boot.message({ type: 'canqi:3d-progress', value: 48 });
boot.message({ type: 'canqi:3d-progress', value: 12 });
assert.equal(boot.get('boot-progress').attributes['aria-valuenow'], '48');
boot.message(ready, 'http://untrusted');
assert.equal(boot.run('bootState'), 'loading');
boot.message(ready);
assert.equal(boot.get('entrance').classList.contains('scene-ready'), false);
assert.equal(boot.get('entrance').inert, true);
assert.equal(boot.events.includes('scene:entered'), false);
await boot.nextTimer(); // minimum loading display
assert.equal(boot.get('boot-loader').hidden, false);
await boot.nextTimer(); // monitor powers off
await boot.nextTimer(); // black pause, then iris reveal finishes
assert.equal(boot.get('boot-loader').hidden, true);
assert.equal(boot.get('entrance').inert, false);
assert.equal(boot.get('entrance').classList.contains('scene-ready'), true);
assert.equal(boot.events.filter(event => event === 'scene:entered').length, 1);

const failed = environment();
failed.run(source('interaction.js'));
failed.message({ type: 'canqi:3d-error' });
assert.equal(failed.run('bootState'), 'error');
assert.equal(failed.get('boot-loader').hidden, false);
assert.equal(failed.get('boot-retry').hidden, false);
assert.equal(failed.get('entrance').inert, true);
assert.equal(failed.events.includes('scene:entered'), false);

const audio = environment();
audio.run(`
  class Param { value = 0; setTargetAtTime(value, time, duration) { this.value = value; this.duration = duration; }
    setValueAtTime() {} linearRampToValueAtTime() {} exponentialRampToValueAtTime() {} }
  class Node { gain = new Param(); frequency = new Param(); Q = new Param(); pan = new Param();
    delayTime = new Param(); threshold = new Param(); knee = new Param(); ratio = new Param();
    attack = new Param(); release = new Param(); connect(node) { return node; } start() {} stop() {} disconnect() {} }
  window.AudioContext = class extends EventTarget {
    sampleRate = 1000; currentTime = 0; state = 'running'; destination = new Node();
    createGain() { return new Node(); } createDynamicsCompressor() { return new Node(); }
    createBufferSource() { return new Node(); } createBiquadFilter() { return new Node(); }
    createOscillator() { return new Node(); } createStereoPanner() { return new Node(); }
    createDelay() { return new Node(); }
    createBuffer(channels, length) { const data = new Float32Array(length); return { getChannelData: () => data }; }
    async resume() {} async suspend() { this.state = 'suspended'; }
  };
`);
audio.run(source('ambience.js'));
await Promise.resolve();
assert.equal(audio.run('engine.master.gain.value'), 0);
assert.equal(audio.run('audible'), false);
audio.get('entrance').dispatchEvent(new Event('scene:entered'));
await Promise.resolve();
assert.equal(audio.run('engine.master.gain.value'), 1.45);
assert.equal(audio.run('engine.master.gain.duration'), 1.05);
assert.equal(audio.run('audible'), true);
const signal = audio.run('targetFoundSignal()');
const code = signal.pulses.map((pulse, index, all) => {
  const gap = index ? pulse.at - all[index - 1].at - all[index - 1].duration : 0;
  return (gap > .4 ? ' / ' : gap > .15 ? ' ' : '') + (pulse.duration > .1 ? '-' : '.');
}).join('');
assert.equal(code, '- .- .-. --. . - / ..-. --- ..- -. -..');
audio.run(`entrance.dispatchEvent(new CustomEvent('scene:bubble-sound', { detail: { kind: 'target', pan: 0, level: 1 } }))`);
assert.ok([...audio.timers.values()].some(timer => timer.delay > 6000));
audio.message({ type: 'canqi:ambience-state', airships: [
  { level: .8, pan: -.6, cutoff: 650, doppler: 1.004 },
  { level: .15, pan: -.2, cutoff: 260, doppler: .997 },
] });
assert.equal(audio.run('engine.airships[0].level.gain.value'), .8);
assert.equal(audio.run('engine.airships[1].level.gain.value'), .15);
assert.equal(audio.run('engine.airships[0].glass.frequency.value'), 650);
audio.message({ type: 'canqi:ambience-state', airships: [] });
assert.equal(audio.run('engine.airships[0].level.gain.value'), 0);
audio.run('muteSound()');
assert.equal(audio.run('engine.master.gain.value'), 0);
assert.equal(audio.run('userMuted'), true);
const mutedTimers = audio.timers.size;
audio.run(`entrance.dispatchEvent(new CustomEvent('scene:bubble-sound', { detail: { kind: 'target', pan: 0, level: 1 } }))`);
assert.equal(audio.timers.size, mutedTimers);
console.log('PASS: progress, ready/reveal ordering, error recovery, silent loading, audio fade and mute');
