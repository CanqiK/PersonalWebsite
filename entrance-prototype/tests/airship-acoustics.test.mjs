import assert from 'node:assert/strict';
import { airshipAcoustics } from '../realtime/airship-acoustics.js';

const listener = { x: -2.28, y: 5.97, z: 3.12 };
const right = { x: .91, y: 0, z: -.42 };
const sample = (z, progress = .4, active = true) => airshipAcoustics(
  { x: -16.2, y: 4.68, z }, listener, right, progress, active);
const near = sample(3), middle = sample(-20), far = sample(-55);
assert.ok(near.level > middle.level && middle.level > far.level);
assert.ok(near.cutoff > middle.cutoff && middle.cutoff > far.cutoff);
assert.ok(sample(9).doppler > sample(-20).doppler);
assert.equal(sample(10, 0).level, 0);
assert.equal(sample(-62, 1).level, 0);
assert.equal(sample(3, .4, false).level, 0);
for (let z = 10; z >= -62; z--) {
  const state = sample(z, (10 - z) / 72);
  assert.ok(Object.values(state).every(Number.isFinite));
  assert.ok(state.level >= 0 && state.level <= 1);
  assert.ok(Math.abs(state.pan) <= .92);
}
console.log(`PASS: distance attenuation, muffling, Doppler and seamless wrap; near=${near.level.toFixed(3)}, far=${far.level.toFixed(3)}`);
