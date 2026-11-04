import * as THREE from 'three';
import { createGlassSign } from './glass-sign.js?v=playtime-v1-cursors';
import { airshipAcoustics } from './airship-acoustics.js?v=playtime-v1';

const paneX = -12.27;

function rainTexture(seed, streaks, beads, renderer) {
  const canvas = document.createElement('canvas');
  const logicalWidth = 1024;
  const logicalHeight = 256;
  const textureLimit = renderer?.capabilities.maxTextureSize || 4096;
  canvas.width = 2 ** Math.floor(Math.log2(Math.min(4096, textureLimit)));
  canvas.height = canvas.width / 4;
  const context = canvas.getContext('2d');
  // Draw in the original coordinates so extra texels refine edges, not drop size or density.
  context.scale(canvas.width / logicalWidth, canvas.height / logicalHeight);
  context.lineCap = 'round';
  let state = seed;
  const random = () => ((state = (1664525 * state + 1013904223) >>> 0) / 4294967296);
  for (let i = 0; i < streaks; i++) {
    const x = random() * logicalWidth;
    const y = random() * logicalHeight;
    const length = 7 + random() ** 2 * 47;
    const alpha = .09 + random() * .30;
    context.strokeStyle = `rgba(202,224,241,${alpha})`;
    context.lineWidth = random() > .90 ? 1.3 : .65;
    context.beginPath();
    context.moveTo(x, y);
    context.lineTo(x + (random() - .5) * 2, y + length);
    context.stroke();
    context.fillStyle = `rgba(235,246,255,${alpha * .74})`;
    context.beginPath();
    context.ellipse(x, y + length, .65, 1, 0, 0, Math.PI * 2);
    context.fill();
  }
  for (let i = 0; i < beads; i++) {
    const x = random() * logicalWidth;
    const y = random() * logicalHeight;
    context.fillStyle = `rgba(226,242,252,${.13 + random() * .22})`;
    context.beginPath();
    context.ellipse(x, y, .8 + random() * 1.6, 1.6 + random() * 3, 0, 0, Math.PI * 2);
    context.fill();
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(1, 1.6);
  texture.generateMipmaps = true;
  texture.minFilter = THREE.LinearMipmapLinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.anisotropy = Math.min(8, renderer?.capabilities.getMaxAnisotropy() || 1);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

function makeRain(scene, renderer) {
  const movingTexture = rainTexture(2771, 760, 80, renderer);
  const fixedTexture = rainTexture(8107, 110, 210, renderer);
  for (const [texture, x, opacity] of [
    [movingTexture, paneX, .84], [fixedTexture, paneX + .012, .37],
  ]) {
    const pane = new THREE.Mesh(new THREE.PlaneGeometry(64, 7), new THREE.MeshBasicMaterial({
      map: texture, transparent: true, opacity, depthWrite: false, side: THREE.DoubleSide,
    }));
    pane.rotation.y = Math.PI / 2;
    pane.position.set(x, 3.5, -28);
    pane.renderOrder = 4;
    scene.add(pane);
  }

  const count = 380;
  const positions = new Float32Array(count * 6);
  const drops = Array.from({ length: count }, () => ({
    x: -12.65 - Math.random() * 5.4,
    z: 3 - Math.random() * 62,
    y: Math.random() * 8,
    length: .12 + Math.random() * .31,
    speed: 3.7 + Math.random() * 4.1,
  }));
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3).setUsage(THREE.DynamicDrawUsage));
  const rain = new THREE.LineSegments(geometry, new THREE.LineBasicMaterial({
    color: 0xa8c7d9, transparent: true, opacity: .30, depthWrite: false,
  }));
  rain.frustumCulled = false;
  scene.add(rain);

  function update(elapsed, dt) {
    // Positive UV offset moves the sampled image down the upright glass plane.
    movingTexture.offset.y = elapsed * .17;
    fixedTexture.offset.y = elapsed * .014;
    for (let i = 0; i < count; i++) {
      const drop = drops[i];
      drop.y -= drop.speed * dt;
      if (drop.y < -.4) drop.y += 8.3;
      const j = i * 6;
      positions[j] = positions[j + 3] = drop.x;
      positions[j + 1] = drop.y;
      positions[j + 4] = drop.y + drop.length;
      positions[j + 2] = positions[j + 5] = drop.z;
    }
    geometry.attributes.position.needsUpdate = true;
  }
  update(0, 0);
  return update;
}

function makeAirship(scene) {
  const ship = new THREE.Group();
  ship.name = 'Low-poly airship outside left glazing';
  const hull = new THREE.Mesh(new THREE.IcosahedronGeometry(1, 1), new THREE.MeshStandardMaterial({
    color: 0x34465a, roughness: .86, metalness: .12,
    emissive: 0x1a3046, emissiveIntensity: .30, flatShading: true,
  }));
  hull.scale.set(.89, .67, 2.75);
  ship.add(hull);
  const dark = new THREE.MeshStandardMaterial({ color: 0x101b29, roughness: .82, metalness: .17 });
  const cabin = new THREE.Mesh(new THREE.BoxGeometry(.68, .35, 1.32), dark);
  cabin.position.set(0, -.69, .14);
  ship.add(cabin);
  for (const [size, position] of [
    [[.10, .76, .87], [0, .48, 2.20]],
    [[1.23, .09, .78], [0, .02, 2.28]],
  ]) {
    const fin = new THREE.Mesh(new THREE.BoxGeometry(...size), dark);
    fin.position.set(...position);
    ship.add(fin);
  }
  const windowMaterial = new THREE.MeshBasicMaterial({ color: 0xf6c67e });
  for (const side of [-1, 1]) {
    for (let i = 0; i < 4; i++) {
      const window = new THREE.Mesh(new THREE.IcosahedronGeometry(.055, 0), windowMaterial);
      window.position.set(side * .58, -.67, -.30 + i * .28);
      ship.add(window);
    }
    const navigation = new THREE.Mesh(new THREE.IcosahedronGeometry(.07, 0),
      new THREE.MeshBasicMaterial({ color: side < 0 ? 0xd5473a : 0x85c8bd }));
    navigation.position.set(side * .89, -.03, 1.15);
    ship.add(navigation);
  }
  const lamp = new THREE.Mesh(new THREE.CylinderGeometry(.12, .16, .18, 8),
    new THREE.MeshStandardMaterial({ color: 0xb6a57b, metalness: .5, roughness: .4 }));
  lamp.position.set(0, -.94, -.55);
  ship.add(lamp);
  const rim = new THREE.PointLight(0x88aac8, 1.1, 4.5, 2);
  rim.position.set(.25, .2, 0);
  ship.add(rim);
  scene.add(ship);
  return ship;
}

function makeSearchlight(scene, offset = 0) {
  const light = new THREE.SpotLight(0xc9ddff, 0, 42, .22, .72, 1.25);
  light.position.set(-16, 4, -16);
  const target = new THREE.Object3D();
  scene.add(light, target);
  light.target = target;
  const beam = new THREE.Mesh(new THREE.CylinderGeometry(.035, 1.65, 1, 16, 1, true),
    new THREE.MeshBasicMaterial({ color: 0xbdd9ff, transparent: true, opacity: 0,
      blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide }));
  beam.visible = false;
  scene.add(beam);
  const spotCanvas = document.createElement('canvas');
  spotCanvas.width = spotCanvas.height = 64;
  const spotContext = spotCanvas.getContext('2d');
  const gradient = spotContext.createRadialGradient(32, 32, 2, 32, 32, 32);
  gradient.addColorStop(0, 'rgba(230,242,255,.55)');
  gradient.addColorStop(.25, 'rgba(185,217,255,.16)');
  gradient.addColorStop(1, 'rgba(185,217,255,0)');
  spotContext.fillStyle = gradient;
  spotContext.fillRect(0, 0, 64, 64);
  const glassSpot = new THREE.Sprite(new THREE.SpriteMaterial({
    map: new THREE.CanvasTexture(spotCanvas), transparent: true, opacity: 0,
    blending: THREE.AdditiveBlending, depthWrite: false, depthTest: true,
  }));
  glassSpot.scale.set(4.1, 4.1, 1);
  glassSpot.visible = false;
  scene.add(glassSpot);
  const direction = new THREE.Vector3();
  const source = new THREE.Vector3();
  const inside = new THREE.Vector3();
  const midpoint = new THREE.Vector3();
  const localDown = new THREE.Vector3(0, -1, 0);

  function update(elapsed, ship, active) {
    // Both fixtures remain lit in flight, sweeping continuously with the ship.
    // Only fade the route ends, where the ship wraps outside the room's view.
    const envelope = THREE.MathUtils.smoothstep(ship.position.z, -62, -53) *
      (1 - THREE.MathUtils.smoothstep(ship.position.z, 4, 10));
    light.visible = beam.visible = glassSpot.visible = envelope > .001;
    const sweep = Math.sin(elapsed * .83 + offset);
    source.set(ship.position.x, ship.position.y - 1.03, ship.position.z - .55);
    inside.set(-2.7 + 1.8 * Math.sin(elapsed * .37 + offset),
      1.0 + .65 * Math.sin(elapsed * .57 + offset), ship.position.z - 3 + 8 * sweep);
    light.position.copy(source);
    target.position.copy(inside);
    light.intensity = 65 * envelope;
    direction.subVectors(inside, source);
    const distance = direction.length();
    beam.position.copy(midpoint.addVectors(source, inside).multiplyScalar(.5));
    beam.scale.set(1, distance, 1);
    beam.quaternion.setFromUnitVectors(localDown, direction.normalize());
    beam.material.opacity = .036 * envelope;
    const fraction = (paneX - source.x) / (inside.x - source.x);
    glassSpot.position.set(paneX + .045,
      THREE.MathUtils.lerp(source.y, inside.y, fraction),
      THREE.MathUtils.lerp(source.z, inside.z, fraction));
    glassSpot.material.opacity = .46 * envelope;
    return envelope;
  }
  return update;
}

export function createNightWeather(scene, camera, renderer) {
  const updateRain = makeRain(scene, renderer);
  const patrols = [0, 1].map(index => ({ ship: makeAirship(scene),
    searchlight: makeSearchlight(scene, index * 2.4), offset: index * 20 }));
  const sign = createGlassSign(scene);
  let lastMessage = 0;
  let previousNeon = 0;
  const listener = new THREE.Vector3();
  const cameraRotation = new THREE.Quaternion();
  const listenerRight = new THREE.Vector3();
  function update(elapsed, dt, active, embedded) {
    if (active) updateRain(elapsed, dt);
    let beam = 0;
    camera.getWorldPosition(listener);
    camera.getWorldQuaternion(cameraRotation);
    listenerRight.set(1, 0, 0).applyQuaternion(cameraRotation);
    const airships = [];
    for (const [index, patrol] of patrols.entries()) {
      const { ship, searchlight, offset } = patrol;
      const progress = ((elapsed + 9 + offset) % 40) / 40;
      ship.position.set(-16.2 - index * 1.1 + .25 * Math.sin(elapsed * .17 + index),
        4.68 + index * .65 + .10 * Math.sin(elapsed * .31 + index), 10 - 72 * progress);
      ship.rotation.y = -.04 + .025 * Math.sin(elapsed * .12 + index);
      beam = Math.max(beam, searchlight(elapsed, ship, active));
      airships.push(airshipAcoustics(ship.position, listener, listenerRight, progress, active));
    }
    const neon = sign.update(elapsed, active);
    if (embedded && (performance.now() - lastMessage > 100 || neon.level !== previousNeon)) {
      window.parent.postMessage({ type: 'canqi:ambience-state', airships,
        searchlight: active ? beam : 0, neon: neon.level, spark: neon.spark }, location.origin);
      lastMessage = performance.now();
      previousNeon = neon.level;
    }
  }
  update(0, 0, true, false);
  return { update };
}
