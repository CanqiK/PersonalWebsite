# 进入页-Playtime Ver.1

CANQI 的正式进入页，版本冻结日期：2026-10-10。

## 本地预览

在本目录的上一级（同时包含 `entrance-prototype/` 和 `site/`）运行：

```powershell
python -m http.server 4187 --bind 127.0.0.1
```

打开 http://127.0.0.1:4187/entrance-prototype/ 。全部页面资源在本地，无 npm 安装或构建步骤。Got Him 链接进入相邻的 `site/index.html#main`。

## 当前效果

- 黑底 CRT 电脑显示模型下载、场景组装和灯光准备进度；首帧完成后关屏，再通过中央圆形蒙版揭开实时 3D 场景。
- 四个工位气泡错开出现、逐字输入、闲置六秒后收缩消失；全部点击击碎后才出现持续保留的 Got Him。
- Canqi 的介绍随悬停出现/离开消失；头部平滑跟随鼠标，窄屏支持横向查看场景。
- 九名走廊行人、前四排共十六个彩色屏幕、窗外城市灯光、玻璃雨水与右侧闪烁发光字。
- 两艘飞艇错开巡航，约二十秒一次经过，两组探照灯随艇持续扫入室内。
- Web Audio 合成隔窗雨声、室内底噪、五组键盘、电脑提示、翻页、电话、远处警笛和按距离变化的飞艇引擎。
- 气泡开启、关闭和击碎音效；Got Him 的一次性短警报加 TARGET FOUND 摩斯电码。
- 转场完成后声音渐强；浏览器限制自动播放时，在加载电脑上点击 CLICK FOR SOUND 或进入后点击 START SOUND。静音会在淡出后暂停音频处理。
- 减少动态效果设置使用温和淡入，关闭非必要运动。加载失败保留电脑加载屏并提供重试。

## 目录

| 位置 | 用途 |
| --- | --- |
| `index.html`, `styles.css`, `interaction.js` | 加载、转场和进入页交互 |
| `bubble-sequence.js`, `scene-anchors.js`, `scene-pan.js` | 工位气泡、投影位置、横向浏览 |
| `ambience.js` | 全部程序合成声音，无外部音频采样文件 |
| `realtime/` | Three.js 场景、天气、飞艇、玻璃字、GLB 和摄像机元数据 |
| `vendor/`, `utils/` | 固定的 Three.js r180 依赖；MIT 许可见 `vendor/LICENSE` |
| `assets/canqi-office-facing-styled.blend` | 当前可编辑 Blender 场景，包含角色与办公室 |
| `assets/reference-approved.png` | 视觉参考 |
| `assets/preview-*.png` | 两张版本效果记录，不在网页加载路径中 |
| `blender/export_realtime_scene.py` | 从当前 Blender 场景重新导出 GLB 和元数据 |
| `tests/`, `scene-pan.test.mjs` | 无依赖 Node 回归检查 |

## 重新导出 3D

在本目录运行，下方路径按 Blender 安装位置调整：

```powershell
& 'C:\Steam\steam\steamapps\common\Blender\blender.exe' --background --factory-startup --python '.\blender\export_realtime_scene.py'
```

导出脚本读取 `assets/canqi-office-facing-styled.blend`，生成 `realtime/canqi-night-office.glb` 和 `scene-meta.json`。它不保存或修改源 Blender 文件。固定摄像机、人物投影、材质与分离的动画部件一起导出，修改摄像机后应重新检查所有气泡位置。

## 检查

```powershell
node tests/runtime-assets.test.mjs
node tests/boot-flow.test.mjs
node tests/airship-acoustics.test.mjs
node scene-pan.test.mjs
```

覆盖资源链接、加载/转场顺序、加载时静音、音量渐入、错误重试、距离衰减、两艘飞艇独立声音、摩斯电码内容、静音和鼠标横向浏览。浏览器还需检查视觉效果；自动测试不代替实际设备试听。

## 本次整理

整理前 160 个文件、135,823,983 字节。132 个历史文件迁到本地 `../历史方案/进入页-Playtime-Ver1-归档/`；其 `archive-manifest.json` 记录每个文件的大小与 SHA-256。保留全部历史材料，不混入当前版本备份。

移出的内容：旧 `scene.js` / `scene-motion.js`、52 个平面动画素材、旧模型和 Blender 自动备份、重复渲染图、探索脚本和调试截图。当前 15.04 MB GLB 的 91 个材质全部在使用；模型几何与材质保持当前批准版本。

网页实际依赖 19 个资源，原始合计约 17.30 MB，其中 GLB 是主要体积。此轮主要减少维护和备份冗余，没有把归档体积下降当作网页下载速度提升。CSS 从 14,614 字节缩减为 12,431 字节。

## 出处与备份

场景参考：Jacques Tati, dir., *PlayTime* (France/Italy, 1967)。页面保留指向 https://www.cinematheque.qc.ca/en/cinema/playtime/ 的出处链接。

GitHub 仓库：`CanqiK/PersonalWebsite`。备份分支 `backup/entrance-playtime-v1`，版本标签 `playtime-v1`，代号 **进入页-Playtime Ver.1**。快照包含当前进入页及相邻主页，可在仓库根目录启动 HTTP 服务后完整浏览；不更改线上 main 分支。
