import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';

const source = readFileSync(new URL('./scene-pan.js', import.meta.url), 'utf8');
function setup({ reduced = false, fine = true, width = 800, sceneWidth = 1280 } = {}) {
  const handlers = {};
  const frames = new Map();
  let id = 0, now = 0, overControl = false, intro = false;
  const viewport = {
    scrollLeft: 0, scrollWidth: sceneWidth, clientWidth: width,
    classList: { contains: () => intro }, contains: () => true,
    getBoundingClientRect: () => ({ left: 0, width }),
    addEventListener: (type, fn) => { handlers[type] = fn; },
  };
  const document = {
    hidden: false, getElementById: () => viewport, querySelector: () => ({}),
    elementFromPoint: () => ({ closest: () => overControl }),
    addEventListener: (type, fn) => { handlers[type] = fn; },
  };
  vm.runInNewContext(source, {
    document, matchMedia: q => ({ matches: q.includes('reduced') ? reduced : fine, addEventListener() {} }),
    requestAnimationFrame: fn => { frames.set(++id, fn); return id; },
    cancelAnimationFrame: key => frames.delete(key),
    addEventListener: (type, fn) => { handlers[type] = fn; },
  });
  return {
    viewport, document,
    move(x, type = 'mouse') { handlers.pointermove({clientX:x,clientY:100,pointerType:type,buttons:0}); },
    run(seconds) { for (let i=0;i<seconds*60;i++) { now += 1000/60; const pending=[...frames.values()]; frames.clear(); pending.forEach(fn=>fn(now)); } },
    control(value) { overControl = value; }, intro(value) { intro = value; },
    fire(type) { handlers[type](); },
  };
}
const pan = setup();
pan.move(799); pan.run(.05);
assert(pan.viewport.scrollLeft > 0 && pan.viewport.scrollLeft < 480, 'follow is eased rather than jumping');
pan.run(1);
assert.equal(pan.viewport.scrollLeft,480,'rightmost pixel maps to right boundary');
for (const fraction of [.5,.25,.75,0,1]) {
  pan.move(799*fraction); pan.run(1);
  assert.equal(pan.viewport.scrollLeft,480*fraction,`cursor fraction ${fraction} maps to same view fraction`);
}
pan.move(799*.6); pan.control(true); pan.run(1);
assert.equal(pan.viewport.scrollLeft,288,'mapping stays continuous over dialog controls');
const settled = pan.viewport.scrollLeft; pan.run(2);
assert.equal(pan.viewport.scrollLeft,settled,'stationary cursor does not cause endless travel');
pan.move(0); pan.run(.05); pan.move(799); pan.run(1);
assert.equal(pan.viewport.scrollLeft,480,'reversal follows newest cursor position');
pan.move(0); pan.fire('pointerdown'); pan.run(1);
assert.equal(pan.viewport.scrollLeft,480,'mouse press freezes view for click');
for (const options of [{reduced:true},{fine:false},{width:1280,sceneWidth:1280}]) {
  const quiet = setup(options); quiet.move((options.width || 800)-1); quiet.run(3);
  assert.equal(quiet.viewport.scrollLeft,0,'no unsolicited movement when disabled or fitted');
}
const inactive=setup(); inactive.move(799); inactive.fire('blur'); inactive.run(2);
assert.equal(inactive.viewport.scrollLeft,0,'window blur cancels movement');
const touch=setup(); touch.move(799,'touch'); touch.run(2);
assert.equal(touch.viewport.scrollLeft,0,'touch keeps native panning');
console.log('PASS: proportional positions, easing, continuous controls, stationary cursor, reversal, click, reduced motion, fitted view, blur, touch');
