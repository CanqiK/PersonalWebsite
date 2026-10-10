const viewport = document.getElementById('entrance');
const stage = document.getElementById('scene-stage');
// Head positions measured in the approved 1280 x 720 render.
let anchors = {
  artist: [700, 295],
  designer: [515, 386],
  mentor: [1104, 337],
  director: [1172, 492],
  entry: [807, 435],
};
let canqiBox = [80, 215, 280, 715];
let live3d = false;

function layout() {
  viewport.classList.toggle('can-pan', stage.clientWidth > viewport.clientWidth + 1);
  const scale = live3d ? stage.clientHeight / 720 : Math.max(stage.clientWidth / 1280, stage.clientHeight / 720);
  const offsetX = (stage.clientWidth - 1280 * scale) / 2;
  const offsetY = (stage.clientHeight - 720 * scale) / 2;
  for (const [role, point] of Object.entries(anchors)) {
    const node = stage.querySelector(`.worker-bubble.${role}`);
    const x = offsetX + point[0] * scale;
    const y = offsetY + point[1] * scale;
    node.style.left = `${x}px`;
    // bottom anchors avoid measuring hidden dialogs or their animated scale.
    node.style.top = 'auto';
    node.style.bottom = `${stage.clientHeight - y + 24}px`;
    node.style.setProperty('--tail', '50%');
  }
  const target = document.getElementById('canqi-target');
  Object.assign(target.style, {
    left: `${offsetX + canqiBox[0] * scale}px`, top: `${offsetY + canqiBox[1] * scale}px`,
    width: `${(canqiBox[2] - canqiBox[0]) * scale}px`, height: `${(canqiBox[3] - canqiBox[1]) * scale}px`,
  });
  positionIntro();
}
function positionIntro() {
  const panel = document.getElementById('intro-window');
  const width = Math.min(640, viewport.clientWidth - 32);
  panel.style.width = `${width}px`;
  panel.style.left = `${viewport.scrollLeft + Math.max(16, (viewport.clientWidth - width) / 2)}px`;
}
const observer = new ResizeObserver(layout);
observer.observe(stage);
observer.observe(viewport);
viewport.addEventListener('scroll', positionIntro, { passive: true });
viewport.addEventListener('scene:3d-anchors', event => {
  anchors = event.detail.anchors;
  canqiBox = event.detail.box;
  live3d = true;
  layout();
});
layout();
