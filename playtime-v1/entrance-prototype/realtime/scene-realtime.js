import * as THREE from 'three';
import { GLTFLoader } from '../vendor/GLTFLoader.js';
import { createNightWeather } from './night-weather.js?v=rain-contrast-5';
import { createCharacterGlitch } from './character-glitch.js?v=smooth-16';
import { createCameraFollow } from './camera-follow.js?v=depth-pan-2';
const embedded = new URLSearchParams(location.search).has('embed');
document.documentElement.classList.toggle('embedded', embedded);

const canvas = document.querySelector('#scene');
const stage = document.querySelector('#stage');
const status = document.querySelector('#status');
const metrics = document.querySelector('#metrics');
const calibration = document.querySelector('#calibration');
const lightLevel = document.querySelector('#light-level');
const lightValue = document.querySelector('#light-value');
const motionToggle = document.querySelector('#motion-toggle');
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
const probes = new URLSearchParams(location.search);

const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: 'high-performance' });
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
const exposureKey = 'canqi-realtime-exposure-v2';
const storedExposure = Number(localStorage.getItem(exposureKey));
renderer.toneMappingExposure = storedExposure >= .8 && storedExposure <= 1.8 ? storedExposure : 1.25;
lightLevel.value = renderer.toneMappingExposure.toFixed(2);
lightValue.value = renderer.toneMappingExposure.toFixed(2);
// Bound GPU work on high-DPI/large displays; rain textures remain full resolution.
let renderQuality = 1;
let signalMode = false;
const scenePixelRatio = () => Math.min(devicePixelRatio || 1, 1.5,
  Math.sqrt(2400000 / Math.max(1, stage.clientWidth * stage.clientHeight))) * renderQuality;
renderer.setPixelRatio(scenePixelRatio());
renderer.setSize(stage.clientWidth, stage.clientHeight, false);

const scene = new THREE.Scene();
scene.background = new THREE.Color('#050d19');
scene.fog = new THREE.FogExp2('#07111e', 0.006);
// Less uniform fill, a stronger key: deepen shadows without dimming every light.
scene.add(new THREE.AmbientLight(0xa9bfd7, .46));
const moon = new THREE.DirectionalLight(0x9dbdde, 1.48);
moon.position.set(-8, 12, 6);
scene.add(moon);
const warm = new THREE.DirectionalLight(0xffcf8b, 0.10);
warm.position.set(7, 8, -6);
scene.add(warm);
const portrait = new THREE.PointLight(0xb8c8d7, 3.4, 7, 2);
portrait.position.set(-3.45, 5.32, 2.2);
if (probes.get('lights') !== 'off') scene.add(portrait);
const shoulderRim = new THREE.PointLight(0x547ca7, 1.2, 5, 2);
shoulderRim.position.set(-6.2, 5.2, -1.5);
if (probes.get('lights') !== 'off') scene.add(shoulderRim);

// The first four rows have independent CRT faces, halos, and short-range lights.
const glowCanvas = document.createElement('canvas');
glowCanvas.width = glowCanvas.height = 64;
const context = glowCanvas.getContext('2d');
const gradient = context.createRadialGradient(32, 32, 2, 32, 32, 32);
gradient.addColorStop(0, 'rgba(255,255,255,.8)');
gradient.addColorStop(.24, 'rgba(255,255,255,.36)');
gradient.addColorStop(.65, 'rgba(255,255,255,.065)');
gradient.addColorStop(1, 'rgba(255,255,255,0)');
context.fillStyle = gradient;
context.fillRect(0, 0, 64, 64);
const glowTexture = new THREE.CanvasTexture(glowCanvas);
const screenHalos = [];
const frontLamps = new Map();
const screenPalette = ['#ff8541', '#67add2', '#84bd72', '#bd88c8', '#e0b35c'].map(color => new THREE.Color(color));
let sceneStartTime = 0;
function addLampHalos(anchors) {
  for (const { row, column, position } of anchors) {
    const phase = row * 1.91 + column * 2.67;
    const light = new THREE.PointLight(0xffa052, 1.15, 2.25, 2);
    light.position.set(position[0], 1.06, position[2] + .12);
    scene.add(light);
    const lamp = { row, column, light, phase, halos: [], faceMaterial: null, color: new THREE.Color(),
      offset: (row * 1.3 + column * .8) % 5 };
    frontLamps.set(`${row}-${column}`, lamp);
    for (const [kind, size, offset, opacity] of [
      ['screen', [1.26, 1.06], [.0, .03, .18], .73],
      ['desk', [2.0, .9], [0, -.19, .38], .22],
    ]) {
      const material = new THREE.SpriteMaterial({ map: glowTexture, color: 0xffbf7a,
        transparent: true, opacity, depthWrite: false, depthTest: true,
        blending: THREE.AdditiveBlending });
      const halo = new THREE.Sprite(material);
      halo.position.set(position[0] + offset[0], position[1] + offset[1], position[2] + offset[2]);
      halo.scale.set(size[0], size[1], 1);
      scene.add(halo);
      screenHalos.push({ material, base: opacity, phase, kind });
      lamp.halos.push(material);
    }
  }
}

let camera;
let chestMeshes = [];
const canqiParts = {};
let workerHeads = [];
let glowMaterials = [];
let cityWindows = [];
let walkers = [];
let walkerLimbs = [];
let weather;
let portraitGlitch;
let cameraFollow;
let weatherTime = 0;
let lastFrame = 0;
let animationFrame = 0;
let nextFrameAt = 0;
let qualitySampleStart = 0;
let qualityElapsed = 0;
let qualitySamples = 0;
let lastQualityChange = 0;
function requestSceneFrame() {
  if (!animationFrame && !document.hidden && camera) animationFrame = requestAnimationFrame(update);
}
function sampleFrameLoad(t, gap) {
  if (!qualitySampleStart) qualitySampleStart = t;
  if (gap > 0 && gap < 200) { qualityElapsed += gap; qualitySamples++; }
  if (t - qualitySampleStart < 3500) return;
  const mean = qualityElapsed / Math.max(1, qualitySamples);
  let next = renderQuality;
  if (!signalMode && t - lastQualityChange > 8000 && qualitySamples > 50) {
    if (mean > 25) next = Math.max(.7, renderQuality - .1);
    else if (mean < 18 && t - lastQualityChange > 16000) next = Math.min(1, renderQuality + .05);
  }
  if (next !== renderQuality) {
    renderQuality = next;
    renderer.setPixelRatio(scenePixelRatio());
    lastQualityChange = t;
  }
  qualitySampleStart = t; qualityElapsed = qualitySamples = 0;
}
const tunedMaterials = new Set();
let moving = false;
const motionProbe = probes.get('motion') !== 'off';
let motionEnabled = motionProbe && !reducedMotion.matches;
const smoothstep = value => value * value * (3 - 2 * value);
const transition = (time, begin, end) => smoothstep(Math.max(0, Math.min(1, (time - begin) / (end - begin))));

const gaze = { active: false, x: 0, y: 0 };
const headScreen = new THREE.Vector3();
const gazeYaw = new THREE.Quaternion();
const gazePitch = new THREE.Quaternion();
const gazeTarget = new THREE.Quaternion();
const worldUp = new THREE.Vector3(0, 1, 0);
const cameraRight = new THREE.Vector3();
function receivePointer(data) {
  if (!Number.isFinite(data.x) || !Number.isFinite(data.y)) return;
  gaze.active = Boolean(data.active);
  gaze.x = THREE.MathUtils.clamp(data.x, -1, 1);
  gaze.y = THREE.MathUtils.clamp(data.y, -1, 1);
}
addEventListener('message', event => {
  if (embedded && event.origin === location.origin && event.source === window.parent &&
      event.data?.type === 'canqi:camera-follow') {
    if (event.data.freeze) cameraFollow?.freeze();
    else cameraFollow?.setTarget(event.data);
    return;
  }
  if (embedded && event.origin === location.origin && event.source === window.parent &&
      event.data?.type === 'canqi:portrait-glitch') {
    portraitGlitch?.setActive(event.data.active === true);
    return;
  }
  if (embedded && event.origin === location.origin && event.source === window.parent &&
      event.data?.type === 'canqi:signal-mode') {
    const signal = event.data.active === true;
    signalMode = signal;
    const ratio = signal ? Math.min(.6,640/stage.clientWidth) : scenePixelRatio();
    // setPixelRatio already resizes/clears the drawing buffer. Repaint in this
    // same task so the compositor never sees the cleared intermediate canvas.
    if (renderer.getPixelRatio() !== ratio) renderer.setPixelRatio(ratio);
    canvas.style.imageRendering = signal ? 'pixelated' : 'auto';
    if (camera) {
      if (!portraitGlitch?.render(performance.now() / 1000)) renderer.render(scene, camera);
      window.parent.postMessage({ type:'canqi:signal-ready', requestId:event.data.requestId }, location.origin);
    }
    return;
  }
  if (embedded && event.origin === location.origin && event.source === window.parent &&
      event.data?.type === 'canqi:pointer') receivePointer(event.data);
});
canvas.addEventListener('pointermove', event => {
  if (embedded || event.pointerType === 'touch') return;
  const rect = canvas.getBoundingClientRect();
  receivePointer({ active: true, x: (event.clientX - rect.left) / rect.width * 2 - 1,
    y: 1 - (event.clientY - rect.top) / rect.height * 2 });
}, { passive: true });
canvas.addEventListener('pointerleave', () => { gaze.active = false; });

function updateHead(dt, inhale) {
  const head = canqiParts.head;
  if (!head) return;
  head.object.getWorldPosition(headScreen).project(camera);
  const yaw = gaze.active ? THREE.MathUtils.clamp(-Math.atan((gaze.x - headScreen.x) * 1.1), -.72, .72) : 0;
  const pitch = gaze.active ? THREE.MathUtils.clamp((gaze.y - headScreen.y) * .32, -.24, .20) : 0;
  cameraRight.set(1, 0, 0).applyQuaternion(camera.quaternion).normalize();
  gazeYaw.setFromAxisAngle(worldUp, yaw);
  gazePitch.setFromAxisAngle(cameraRight, pitch);
  gazeTarget.copy(gazePitch).multiply(gazeYaw).multiply(head.baseQuaternion);
  head.object.quaternion.slerp(gazeTarget, 1 - Math.exp(-dt * 6));
  head.object.position.y = head.basePosition.y + .003 * inhale;
}

function addAisleWalkers() {
  const source = walkers[0]?.object;
  if (!source) return;
  // These x coordinates are the clear gaps between the four cubicle columns.
  for (const [x, z, travel] of [[-2.4, -6.8, 1.9], [2.48, -11.2, 2.9],
    [2.48, -25.5, 3.4], [-7.2, -42, 2.6]]) {
    const phase = walkers.length + 1;
    const object = source.clone(true);
    object.name = `Walking worker ${phase}`;
    object.position.set(x, 0, z);
    source.parent.add(object);
    walkers.push({ object, baseZ: z, baseY: 0, phase, travel });
    object.traverse(child => {
      const match = child.name.toLowerCase().replace(/[^a-z0-9]/g, '')
        .match(/^walkingworker\d+(left|right)(leg|arm)$/);
      if (match) walkerLimbs.push({ object: child, base: child.rotation.x,
        phase, side: match[1], limb: match[2] });
    });
  }
}

let fittedWidth = 0, fittedHeight = 0;
function fit() {
  if (!camera) return;
  const width = stage.clientWidth, height = stage.clientHeight;
  if (width === fittedWidth && height === fittedHeight) return;
  fittedWidth = width; fittedHeight = height;
  renderer.setPixelRatio(signalMode ? Math.min(.6, 640 / width) : scenePixelRatio());
  renderer.setSize(width, height, false);
  if (camera.userData.baseProjectionX) {
    camera.projectionMatrix.elements[0] = camera.userData.baseProjectionX *
      ((1280 / 720) / (stage.clientWidth / stage.clientHeight));
    camera.projectionMatrixInverse.copy(camera.projectionMatrix).invert();
  }
  camera.updateProjectionMatrix();
  renderer.render(scene, camera);
}
new ResizeObserver(fit).observe(stage);

function update(t) {
  animationFrame = 0;
  if (!camera || document.hidden) return;
  // Do not redraw the same scene at 120/144 Hz on fast monitors.
  if (t < nextFrameAt - 1) { requestSceneFrame(); return; }
  nextFrameAt = Math.max(nextFrameAt + 1000 / 60, t);
  sampleFrameLoad(t, lastFrame ? t - lastFrame : 0);
  const time = t / 1000;
  const dt = lastFrame ? Math.min(.05, (t - lastFrame) / 1000) : 0;
  lastFrame = t;
  if (moving) cameraFollow?.update(dt);
  if (motionEnabled && moving) weatherTime += dt;
  weather?.update(weatherTime, dt, motionEnabled && moving, embedded);
  if (motionEnabled && moving) {
    const inhale = .25 + .75 * (1 + Math.sin(time * Math.PI * 2 / 4.4)) / 2;
    for (const {mesh, index} of chestMeshes) mesh.morphTargetInfluences[index] = inhale;
    updateHead(dt, inhale);
    for (const side of ['leftarm', 'rightarm']) {
      const arm = canqiParts[side];
      if (!arm) continue;
      arm.object.position.y = arm.basePosition.y + .0025 * inhale;
      arm.object.position.x = arm.basePosition.x + (side === 'leftarm' ? -.002 : .002) * inhale;
    }
    for (const { object, base, baseY, phase } of workerHeads) {
      object.rotation.y = base + .22 * Math.sin(time * (.72 + phase * .04) + phase * 1.8);
      object.position.y = baseY + .012 * Math.sin(time * (1.05 + phase * .03) + phase);
    }
    for (let i = 0; i < glowMaterials.length; i++) {
      const { material, base } = glowMaterials[i];
      material.emissiveIntensity = base * (1 + .095 * Math.sin(time * .48 + i * .7));
    }
    for (const { material, base, phase, kind } of screenHalos) {
      const breathe = .79 + .21 * Math.sin(time * (.55 + (phase % 3) * .1) + phase);
      const flicker = kind === 'screen' ? .08 * Math.sin(time * 6.2 + phase * 3.4) : 0;
      material.opacity = base * Math.max(.45, breathe + flicker);
    }
    for (const lamp of frontLamps.values()) {
      const elapsed = Math.max(0, time - sceneStartTime) + lamp.offset;
      const cycle = Math.floor(elapsed / 5);
      const progress = elapsed - cycle * 5;
      const blend = transition(progress, 0, .55);
      const index = (cycle + lamp.row * 2 + lamp.column) % screenPalette.length;
      const previous = (index - 1 + screenPalette.length) % screenPalette.length;
      const color = lamp.color.copy(screenPalette[previous]).lerp(screenPalette[index], blend);
      const switchDip = .78 + .22 * blend;
      lamp.light.color.copy(color);
      lamp.light.intensity = (.95 + .34 * Math.sin(time * (.55 + (lamp.phase % 3) * .1) + lamp.phase)) * switchDip;
      for (const halo of lamp.halos) halo.color.copy(color);
      if (lamp.faceMaterial) {
        lamp.faceMaterial.color.copy(color).multiplyScalar(.18);
        lamp.faceMaterial.emissive.copy(color);
        lamp.faceMaterial.emissiveIntensity = .78 * switchDip;
      }
    }
    for (const { material, base, phase } of cityWindows) {
      const slow = .76 + .24 * Math.sin(time * (.24 + phase * .017) + phase * 2.8);
      const switching = Math.sin(time * (.72 + phase * .013) + phase * 7.1) > .985 ? .22 : 1;
      material.emissiveIntensity = base * slow * switching;
    }
    for (const { object, baseZ, baseY, phase, travel = 2.2 } of walkers) {
      const stride = weatherTime * (.19 + phase * .009) + phase * 2.3;
      const pace = Math.abs(Math.cos(stride));
      object.position.z = baseZ + travel * Math.sin(stride);
      object.position.y = baseY + .014 * Math.abs(Math.sin(weatherTime * 4.3 + phase)) * pace;
      const heading = Math.cos(stride) > 0 ? Math.PI : 0;
      const turn = Math.atan2(Math.sin(heading - object.rotation.y), Math.cos(heading - object.rotation.y));
      object.rotation.y += turn * (1 - Math.exp(-dt * 4.5));
    }
    for (const { object, base, phase, side, limb } of walkerLimbs) {
      const travel = weatherTime * (.19 + phase * .009) + phase * 2.3;
      const pace = Math.abs(Math.cos(travel));
      const opposite = side === 'left' ? 1 : -1;
      object.rotation.x = base + opposite * (limb === 'leg' ? .29 : -.17) *
        Math.sin(weatherTime * 4.3 + phase) * pace;
    }
  }
  if (!portraitGlitch?.render(time)) renderer.render(scene, camera);
  requestSceneFrame();
}

async function load() {
  const reportProgress = (value, label) => {
    if (embedded) window.parent.postMessage({ type: 'canqi:3d-progress', value, label }, location.origin);
  };
  try {
    reportProgress(5, 'LOADING THE OFFICE');
    const [meta, gltf] = await Promise.all([
      fetch('./scene-meta.json?v=workers-5').then(response => { if (!response.ok) throw new Error('Camera metadata missing'); return response.json(); }),
      new GLTFLoader().loadAsync('./canqi-night-office.glb?v=workers-5', event => {
        if (event.lengthComputable && event.total > 0) {
          reportProgress(5 + event.loaded / event.total * 75, 'LOADING THE OFFICE');
        } else reportProgress(5, 'RECEIVING THE OFFICE');
      }),
    ]);
    reportProgress(85, 'ASSEMBLING THE SCENE');
    scene.add(gltf.scene);
    camera = gltf.cameras[0];
    if (!camera) throw new Error('Blender camera missing from model');
    camera.projectionMatrix.set(...meta.projectionRows.flat());
    camera.userData.baseProjectionX = camera.projectionMatrix.elements[0];
    camera.projectionMatrixInverse.copy(camera.projectionMatrix).invert();
    camera.updateMatrixWorld(true);
    camera.updateProjectionMatrix = () => {};
    addLampHalos(meta.frontLampAnchors || []);
    weather = createNightWeather(scene, camera, renderer);

    gltf.scene.traverse(object => {
      const nodeKey = object.name.toLowerCase().replace(/[^a-z0-9]/g, '');
      if (/^walkingworker\d+$/.test(nodeKey)) {
        walkers.push({ object, baseZ: object.position.z, baseY: object.position.y,
          phase: Number(nodeKey.match(/\d+$/)[0]) });
      }
      const limbMatch = nodeKey.match(/^walkingworker(\d+)(left|right)(leg|arm)$/);
      if (limbMatch) walkerLimbs.push({ object, base: object.rotation.x,
        phase: Number(limbMatch[1]), side: limbMatch[2], limb: limbMatch[3] });
      for (const part of ['head', 'chest', 'leftarm', 'rightarm', 'lower']) {
        if (nodeKey === `canqi${part}`) {
          canqiParts[part] = { object, basePosition: object.position.clone(), baseQuaternion: object.quaternion.clone() };
        }
      }
      if (!object.isMesh) return;
      const label = object.name.toLowerCase();
      let ancestor = object;
      while (ancestor && ancestor.name.toLowerCase().replace(/[^a-z0-9]/g, '') !== 'canqichest') ancestor = ancestor.parent;
      if (ancestor && object.morphTargetInfluences) {
        const map = object.morphTargetDictionary || {};
        const breath = Object.keys(map).find(key => /Chest.inhale/i.test(key));
        if (breath !== undefined) chestMeshes.push({mesh:object,index:map[breath]});
      }
      if (label.includes('worker_head') || label.includes('worker_hair')) {
        const phase = Number(label.match(/(\d+)$/)?.[1] || 0) % 7;
        workerHeads.push({ object, base: object.rotation.y, baseY: object.position.y, phase });
      }
      const materials = Array.isArray(object.material) ? object.material : [object.material];
      for (const material of materials) {
        if (!material || tunedMaterials.has(material)) continue;
        tunedMaterials.add(material);
        if (/grey.green.partitions/i.test(material.name)) material.color.multiplyScalar(.84);
        if (/partition.edges/i.test(material.name)) material.color.multiplyScalar(.86);
        if (/worn.black.trench|lighter.cloth.facets|charcoal.woven.scarf/i.test(material.name)) {
          material.color.multiplyScalar(1.12);
          material.emissive.set('#14243a');
          material.emissiveIntensity = .30;
        }
        if (/rounded.soft.fur.cap/i.test(material.name)) {
          material.color.multiplyScalar(1.25);
          material.emissive.set('#152235');
          material.emissiveIntensity = .19;
        }
        if (/black.leather.bird.mask/i.test(material.name)) {
          material.roughness = .58;
          material.emissive.set('#263446');
          material.emissiveIntensity = .22;
        }
        if (/pewter.goggle.rim/i.test(material.name)) {
          material.color.set('#a69b84');
          material.metalness = .35;
          material.roughness = .4;
        }
        if (/amber.lamps|warm.ceiling.lights/i.test(material.name)) {
          const frontMatch = material.name.match(/front.*r(\d+).*c(\d+)/i);
          if (/amber.lamps/i.test(material.name)) {
            material.color.set('#8a4b1c');
            material.emissive.set('#ff963c');
            material.emissiveIntensity = 1.25;
          } else {
            material.color.set('#74634e');
            material.emissive.set('#ffdcb0');
            material.emissiveIntensity = .55;
          }
          if (frontMatch) {
            const lamp = frontLamps.get(`${frontMatch[1]}-${frontMatch[2]}`);
            if (lamp) lamp.faceMaterial = material;
          } else {
            glowMaterials.push({ material, base: material.emissiveIntensity });
          }
        }
        if (/city.*window/i.test(material.name)) {
          material.emissive.copy(material.color).multiplyScalar(1.7);
          material.emissiveIntensity = 1.9;
          const bank = Number(material.name.match(/bank\s+(\d+)/i)?.[1] || 0);
          cityWindows.push({ material, base: material.emissiveIntensity,
            phase: bank + cityWindows.length * .17 });
        }
        material.side = THREE.DoubleSide;
      }
    });

    cameraFollow = createCameraFollow(camera, gltf.scene, meta, canqiParts, reducedMotion);
    portraitGlitch = createCharacterGlitch(renderer, scene, camera, canqiParts, reducedMotion);
    addAisleWalkers();
    reportProgress(92, 'WARMING UP THE LIGHTS');
    await new Promise(requestAnimationFrame);
    if (renderer.compileAsync) await renderer.compileAsync(scene, camera);
    fit();
    await portraitGlitch.warmup();
    renderer.render(scene, camera);
    // Wait for the first rendered frame before allowing the parent to reveal it.
    await new Promise(requestAnimationFrame);
    sceneStartTime = performance.now() / 1000;
    moving = !document.hidden;
    metrics.textContent = `LIVE WEBGL  ·  ${renderer.info.render.calls} DRAWS  ·  ${renderer.info.render.triangles.toLocaleString()} TRIS`;
    status.hidden = true;
    if (embedded && window.parent !== window) {
      reportProgress(100, 'OFFICE READY');
      window.parent.postMessage({ type: 'canqi:3d-ready',
        bubbleAnchors: meta.bubbleAnchors, canqiBox: meta.canqiBox }, location.origin);
    }
    metrics.hidden = false;
    calibration.hidden = false;
    motionToggle.setAttribute('aria-pressed', String(motionEnabled));
    motionToggle.textContent = motionEnabled ? 'MOTION ON' : 'MOTION OFF';
    console.info(`CANQI live scene: camera=${camera.name}; parts=${Object.keys(canqiParts).join(',')}; chestMeshes=${chestMeshes.length}; workers=${workerHeads.length}; walkers=${walkers.length}; limbs=${walkerLimbs.length}; coloredScreens=${[...frontLamps.values()].filter(lamp => lamp.faceMaterial).length}; cityBanks=${cityWindows.length}; draws=${renderer.info.render.calls}`);
    requestSceneFrame();
  } catch (error) {
    status.textContent = `LIVE 3D LOAD FAILED — ${error.message}`;
    console.error(error);
    if (embedded && window.parent !== window) window.parent.postMessage({ type: 'canqi:3d-error' }, location.origin);
  }
}

document.addEventListener('visibilitychange', () => {
  moving = !document.hidden;
  lastFrame = nextFrameAt = qualitySampleStart = qualityElapsed = qualitySamples = 0;
  cancelAnimationFrame(animationFrame); animationFrame = 0;
  if (moving) requestSceneFrame();
});
lightLevel.addEventListener('input', () => {
  renderer.toneMappingExposure = Number(lightLevel.value);
  lightValue.value = renderer.toneMappingExposure.toFixed(2);
  localStorage.setItem(exposureKey, lightValue.value);
  if (camera) renderer.render(scene, camera);
});
motionToggle.addEventListener('click', () => {
  motionEnabled = !motionEnabled;
  motionToggle.setAttribute('aria-pressed', String(motionEnabled));
  motionToggle.textContent = motionEnabled ? 'MOTION ON' : 'MOTION OFF';
});
load();
