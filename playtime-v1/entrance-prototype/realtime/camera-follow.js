import * as THREE from 'three';

// Translate the perspective camera, not separate floor meshes: the building stays
// connected while nearby railings and Canqi naturally travel more than the office.
export function createCameraFollow(camera, model, meta, parts, reducedMotion) {
  const base = camera.position.clone();
  const referenceProjection = new THREE.Matrix4().set(...meta.projectionRows.flat());
  const offset = new THREE.Vector3();
  const point = new THREE.Vector3();
  const target = { x: 0, y: 0 };
  const current = { x: 0, y: 0 };
  const corners = [];
  model.updateMatrixWorld(true);
  const inverseProjection = referenceProjection.clone().invert();
  const cameraOrigin = camera.getWorldPosition(new THREE.Vector3());
  // The export merged some heads into static meshes. Recover all five original
  // anchor points on their shared head-height plane once, before moving camera.
  const anchorsWorld = Object.fromEntries(Object.entries(meta.bubbleAnchors).map(([role, xy]) => {
    const ray = new THREE.Vector3(xy[0] / 640 - 1, 1 - xy[1] / 360, .5)
      .applyMatrix4(inverseProjection).applyMatrix4(camera.matrixWorld).sub(cameraOrigin).normalize();
    return [role, cameraOrigin.clone().addScaledVector(ray, (1.19 - cameraOrigin.y) / ray.y)];
  }));
  for (const part of Object.values(parts)) {
    part.object.traverse(object => {
      if (!object.isMesh) return;
      object.geometry.computeBoundingBox();
      const { min, max } = object.geometry.boundingBox;
      for (const x of [min.x, max.x]) for (const y of [min.y, max.y]) for (const z of [min.z, max.z]) {
        corners.push(new THREE.Vector3(x, y, z).applyMatrix4(object.matrixWorld));
      }
    });
  }
  function project(world) {
    point.copy(world).applyMatrix4(camera.matrixWorldInverse).applyMatrix4(referenceProjection);
    return [(point.x + 1) * 640, (1 - point.y) * 360];
  }
  function bounds() {
    const box = [Infinity, Infinity, -Infinity, -Infinity];
    for (const corner of corners) {
      const [x, y] = project(corner);
      box[0] = Math.min(box[0], x); box[1] = Math.min(box[1], y);
      box[2] = Math.max(box[2], x); box[3] = Math.max(box[3], y);
    }
    return box;
  }
  const originalBox = bounds();

  function publishAnchors() {
    const anchors = {};
    for (const [role, world] of Object.entries(anchorsWorld)) anchors[role] = project(world);
    const moved = corners.length ? bounds() : originalBox;
    const box = meta.canqiBox.map((value, i) => corners.length ? value + moved[i] - originalBox[i] : value);
    window.parent.postMessage({ type: 'canqi:camera-anchors', anchors, box }, location.origin);
  }

  return {
    setTarget(data) {
      if (!Number.isFinite(data.x) || !Number.isFinite(data.y)) return;
      target.x = reducedMotion.matches ? 0 : THREE.MathUtils.clamp(data.x, -1, 1);
      target.y = reducedMotion.matches ? 0 : THREE.MathUtils.clamp(data.y, -1, 1);
    },
    freeze() { target.x = current.x; target.y = current.y; },
    update(dt) {
      if (reducedMotion.matches) target.x = target.y = 0;
      const blend = reducedMotion.matches ? 1 : 1 - Math.exp(-dt * 6);
      const x = Math.abs(target.x - current.x) < .0001 ? target.x : current.x + (target.x - current.x) * blend;
      const y = Math.abs(target.y - current.y) < .0001 ? target.y : current.y + (target.y - current.y) * blend;
      if (x === current.x && y === current.y) return;
      current.x = x; current.y = y;
      // Approx. 20px horizontal / 12px vertical on the nearby platform at 720p;
      // distant desks move less, according to their actual camera-space depth.
      offset.set(x * .16, y * .10, 0).applyQuaternion(camera.quaternion);
      camera.position.copy(base).add(offset);
      camera.updateMatrixWorld(true);
      publishAnchors();
    },
  };
}
