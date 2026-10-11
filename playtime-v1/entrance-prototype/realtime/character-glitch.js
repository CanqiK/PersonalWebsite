import * as THREE from 'three';

// Render the live character's silhouette separately, so the office stays clear.
export function createCharacterGlitch(renderer, scene, camera, parts, reducedMotion) {
  const meshes = new Set();
  for (const { object } of Object.values(parts)) object.traverse(child => {
    if (child.isMesh) meshes.add(child);
  });
  const color = new THREE.WebGLRenderTarget(1, 1, { type: THREE.HalfFloatType });
  const mask = new THREE.WebGLRenderTarget(1, 1, {
    minFilter: THREE.NearestFilter, magFilter: THREE.NearestFilter,
  });
  const maskMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff,
    side: THREE.DoubleSide, toneMapped: false, fog: false });
  // Reuse the character's geometry, without traversing/updating the office
  // a second time for the mask. Morphs and world transforms stay live.
  const maskScene = new THREE.Scene();
  maskScene.matrixWorldAutoUpdate = false;
  const proxies = [...meshes].map(source => {
    const proxy = source.clone(false);
    proxy.material = maskMaterial;
    proxy.matrixAutoUpdate = false;
    proxy.matrixWorldAutoUpdate = false;
    proxy.morphTargetInfluences = source.morphTargetInfluences;
    maskScene.add(proxy);
    return { source, proxy };
  });
  const size = new THREE.Vector2();
  const clearColor = new THREE.Color();
  const uniforms = {
    tScene: { value: color.texture }, tMask: { value: mask.texture },
    uResolution: { value: new THREE.Vector2(1, 1) },
    uTime: { value: 0 }, uAge: { value: 0 }, uReduced: { value: 0 },
  };
  const material = new THREE.ShaderMaterial({
    uniforms, depthTest: false, depthWrite: false,
    vertexShader: `varying vec2 vUv;
      void main() { vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }`,
    fragmentShader: `
      uniform sampler2D tScene, tMask;
      uniform vec2 uResolution;
      uniform float uTime, uAge, uReduced;
      varying vec2 vUv;
      float hash(float n) { return fract(sin(n * 127.1) * 43758.5453); }
      vec2 safeUV(vec2 uv) { return clamp(uv, vec2(0.001), vec2(0.999)); }
      void main() {
        float tick = floor(uTime * 9.0);
        float band = floor(vUv.y * uResolution.y / 19.0);
        float tear = step(0.72, hash(band + tick * 13.0)) * (1.0 - uReduced);
        float shift = (hash(band * 7.0 + tick) - 0.5) * 29.0 * tear;
        float settle = smoothstep(0.0, 0.85, uAge);
        float grain = mix(30.0, 5.0 + 8.0 * hash(tick * 3.0), settle);
        grain = mix(grain, 9.0, uReduced);
        vec2 cell = vec2(grain) / uResolution;
        vec2 pixelUV = (floor(vUv / cell) + 0.5) * cell;
        pixelUV.x += shift / uResolution.x;
        pixelUV = safeUV(pixelUV);
        float originalMask = texture2D(tMask, vUv).r;
        float pixelMask = texture2D(tMask, pixelUV).r;
        float silhouette = max(originalMask, pixelMask);
        vec3 normal = texture2D(tScene, vUv).rgb;
        // Most screen pixels belong to the office; skip their glitch work.
        vec3 result = normal;
        if (silhouette > 0.001) {
        vec2 split = vec2((2.0 + tear * 6.0) / uResolution.x, 0.0);
        vec3 digital = vec3(texture2D(tScene, safeUV(pixelUV + split)).r,
          texture2D(tScene, pixelUV).g,
          texture2D(tScene, safeUV(pixelUV - split)).b);
        float grey = dot(digital, vec3(0.2126, 0.7152, 0.0722));
        digital = mix(digital, vec3(grey * 0.65, grey * 1.35, grey * 1.4), tear * 0.4);
        float block = hash(floor(vUv.x * uResolution.x / 24.0) + band * 57.0 + tick * 11.0);
        float dropout = step(0.88, block) * tear;
        digital = mix(digital, vec3(0.008, 0.013, 0.021), dropout * 0.88);
        float staticGrain = hash(floor(vUv.x * uResolution.x / 3.0) + band * 319.0 + tick);
        digital += vec3(0.045, 0.065, 0.055) * staticGrain * (0.35 + tear);
        digital *= 0.88 + 0.12 * step(1.0, mod(gl_FragCoord.y, 3.0));
          result = mix(normal, digital, silhouette);
        }
        gl_FragColor = vec4(result, 1.0);
        #include <tonemapping_fragment>
        #include <colorspace_fragment>
      }`,
  });
  const quadScene = new THREE.Scene();
  const quad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material);
  quad.frustumCulled = false;
  quadScene.add(quad);
  const quadCamera = new THREE.Camera();
  let active = false;
  let started = 0;
  let lastMask = -Infinity;

  function resize() {
    renderer.getDrawingBufferSize(size);
    if (color.width === size.x && color.height === size.y) return;
    color.setSize(size.x, size.y);
    // A deliberately pixelated silhouette needs no full-resolution buffer.
    const scale = Math.min(0.5, 768 / Math.max(size.x, size.y));
    mask.setSize(Math.max(1, Math.round(size.x * scale)), Math.max(1, Math.round(size.y * scale)));
    uniforms.uResolution.value.copy(size);
    lastMask = -Infinity;
  }

  function drawMask(time) {
    for (const { source, proxy } of proxies) {
      proxy.matrixWorld.copy(source.matrixWorld);
      proxy.visible = source.visible;
    }
    renderer.getClearColor(clearColor);
    const alpha = renderer.getClearAlpha();
    try {
      renderer.setClearColor(0x000000, 0);
      renderer.setRenderTarget(mask);
      renderer.render(maskScene, camera);
      lastMask = time;
    } finally {
      renderer.setClearColor(clearColor, alpha);
    }
  }

  function compile(view, viewCamera, target) {
    const previous = renderer.getRenderTarget();
    try {
      renderer.setRenderTarget(target);
      return renderer.compileAsync ? renderer.compileAsync(view, viewCamera) : renderer.compile(view, viewCamera);
    } finally {
      renderer.setRenderTarget(previous);
    }
  }

  return {
    async warmup() {
      resize();
      // Compile target-specific shader variants before the entrance opens.
      await compile(scene, camera, color);
      await compile(maskScene, camera, mask);
      await compile(quadScene, quadCamera, null);
      const target = renderer.getRenderTarget();
      try {
        renderer.setRenderTarget(color);
        renderer.render(scene, camera);
        drawMask(performance.now() / 1000);
        renderer.setRenderTarget(target);
        renderer.render(quadScene, quadCamera);
      } finally {
        renderer.setRenderTarget(target);
      }
    },
    setActive(value) {
      if (value && !active) {
        started = performance.now() / 1000;
        lastMask = -Infinity;
      }
      active = value && meshes.size > 0;
    },
    render(time) {
      if (!active) return false;
      resize();
      uniforms.uTime.value = reducedMotion.matches ? 0 : time;
      uniforms.uAge.value = Math.max(0, time - started);
      uniforms.uReduced.value = reducedMotion.matches ? 1 : 0;
      const target = renderer.getRenderTarget();
      try {
        renderer.setRenderTarget(color);
        renderer.render(scene, camera);
        // Breathing/head motion needs only a 30 Hz mask; the live scene and
        // animated distortion still render on every animation frame.
        if (time - lastMask >= 1 / 30) drawMask(time);
      } finally {
        renderer.setRenderTarget(target);
      }
      renderer.render(quadScene, quadCamera);
      return true;
    },
  };
}
