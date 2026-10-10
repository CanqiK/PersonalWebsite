import * as THREE from 'three';

// Chunky, authored letterforms keep the sign in the low-poly scene's vocabulary.
const glyphs = {
  H: ['11011','11011','11011','11111','11011','11011','11011'],
  A: ['01110','11011','11011','11111','11011','11011','11011'],
  V: ['11011','11011','11011','11011','11011','01110','00100'],
  E: ['11111','11000','11000','11110','11000','11000','11111'],
  Y: ['11011','11011','11011','01110','00100','00100','00100'],
  O: ['01110','11011','11011','11011','11011','11011','01110'],
  U: ['11011','11011','11011','11011','11011','11011','01110'],
  S: ['01111','11000','11000','01110','00011','00011','11110'],
  N: ['11001','11101','11101','11011','11011','11011','11001'],
  C: ['01111','11000','11000','11000','11000','11000','01111'],
  Q: ['01110','11011','11011','11011','11011','01110','00011'],
  I: ['11111','00100','00100','00100','00100','00100','11111'],
  '?': ['11110','00011','00011','00110','00100','00000','00100'],
};

function makeLetterTexture(glow = false) {
  const canvas = document.createElement('canvas');
  canvas.width = 1056;
  canvas.height = 352;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#dcefff';
  if (glow) {
    ctx.shadowColor = '#a9d9ff';
    ctx.shadowBlur = 18;
    ctx.globalAlpha = .72;
  }
  for (const [line, y] of [['HAVE YOU', 24], ['SEEN CANQI?', 192]]) {
    const width = [...line].reduce((sum, character) => sum + (character === ' ' ? 48 : 96), -16);
    ctx.save();
    ctx.translate(24, y);
    ctx.scale(992 / width, 1);
    let x = 0;
    for (const character of line) {
      const glyph = glyphs[character];
      if (glyph) glyph.forEach((row, j) => [...row].forEach((pixel, i) => {
        if (pixel === '1') ctx.fillRect(x + i * 16, j * 16, 16, 16);
      }));
      x += character === ' ' ? 48 : 96;
    }
    ctx.restore();
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

// Two ignition flashes in two seconds, three seconds of steady light, then an
// interrupted power-down. The cadence changes only the dark interval, not flashes.
export function glassSignState(age) {
  if (age < 0 || age >= 5.85) return { level: 0, spark: 0 };
  let level = 0;
  if (age >= .10 && age < .38) level = .72;
  else if (age >= 1.05 && age < 1.44) level = .95;
  else if (age >= 2 && age < 5) level = 1;
  else if (age >= 5.30 && age < 5.53) level = .66;
  else if (age >= 5.53) level = .66 * (1 - (age - 5.53) / .32);
  const spark = [.10, 1.05, 5.30].reduce((strength, start) =>
    Math.max(strength, age >= start && age < start + .22 ? 1 - (age - start) / .22 : 0), 0);
  return { level, spark };
}

export function createGlassSign(scene) {
  const preview = new URLSearchParams(location.search).get('sign') === 'preview';
  const assembly = new THREE.Group();
  assembly.name = 'Have you seen Canqi? — behind right glazing';
  // The x=2 structural piers sit just inside this glazing. Normal faces the room;
  // local +X runs toward the camera along the wall, so the lettering reads correctly.
  assembly.position.set(2.19, 3.85, -28);
  assembly.rotation.y = -Math.PI / 2;
  const geometry = new THREE.PlaneGeometry(24, 4.3);
  const coreMaterial = new THREE.MeshBasicMaterial({
    map: makeLetterTexture(), color: 0xebf6ff, transparent: true,
    opacity: 0, depthWrite: false, toneMapped: false, side: THREE.DoubleSide,
  });
  const core = new THREE.Mesh(geometry, coreMaterial);
  const bloomMaterial = new THREE.MeshBasicMaterial({
    map: makeLetterTexture(true), transparent: true, opacity: 0,
    depthWrite: false, toneMapped: false, blending: THREE.AdditiveBlending,
    side: THREE.DoubleSide,
  });
  const bloom = new THREE.Mesh(geometry, bloomMaterial);
  bloom.position.z = -.025;
  assembly.add(bloom, core);
  // A faint displaced reflection places the light behind the glass surface.
  const reflection = new THREE.Mesh(geometry, bloomMaterial.clone());
  reflection.position.set(.08, -.045, .035);
  assembly.add(reflection);

  const sparkMaterial = new THREE.MeshBasicMaterial({ color: 0xd8f0ff,
    transparent: true, opacity: 0, toneMapped: false, depthWrite: false });
  const sparks = new THREE.InstancedMesh(new THREE.PlaneGeometry(.18, .055), sparkMaterial, 12);
  sparks.frustumCulled = false;
  assembly.add(sparks);
  const dummy = new THREE.Object3D();
  scene.add(assembly);
  const spill = new THREE.PointLight(0x9bc8e7, 0, 9, 2);
  spill.position.set(1.65, 3.2, -18);
  scene.add(spill);
  let nextStart = 4;
  let cycle = 0;
  let age = -1;

  function update(elapsed, active) {
    if (active) {
      age = elapsed - nextStart;
      if (age >= 5.85) {
        cycle++;
        nextStart = elapsed + 7 + ((cycle * 3) % 5);
        age = -1;
      }
    }
    const state = glassSignState(preview ? 3.5 : age);
    assembly.visible = state.level > 0 || state.spark > 0;
    coreMaterial.opacity = state.level * .94;
    bloomMaterial.opacity = state.level * .44;
    reflection.material.opacity = state.level * .12;
    spill.intensity = state.level * 3.2;
    sparkMaterial.opacity = state.spark;
    sparks.visible = state.spark > 0;
    if (sparks.visible) {
      for (let i = 0; i < 12; i++) {
        const scatter = 1 - state.spark;
        dummy.position.set(8.8 + Math.sin(i * 2.4) * scatter * 1.8,
          -.95 + Math.cos(i * 1.7) * scatter * .42 - scatter * scatter * .25, .055);
        dummy.scale.set(.45 + (i % 3) * .32, .5 + i % 2, 1);
        dummy.updateMatrix();
        sparks.setMatrixAt(i, dummy.matrix);
      }
      sparks.instanceMatrix.needsUpdate = true;
    }
    return active ? state : { level: 0, spark: 0 };
  }
  update(0, false);
  return { update };
}
