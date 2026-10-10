# 进入页-Playtime Ver.1

CANQI 进入页版本快照，2026-10-10。

- `entrance-prototype/`：批准的实时 3D 进入页、可编辑 Blender 场景、导出工具和检查。
- `site/`：同一时间的主页快照，保留 Got Him 的完整跳转。
- `snapshot-manifest.json`：所有快照文件的 SHA-256，用于校验恢复。

## 启动

在仓库根目录运行 `python -m http.server 4187 --bind 127.0.0.1`，然后打开
http://127.0.0.1:4187/entrance-prototype/ 。无需安装前端依赖。

详细功能、声音限制、模型重新导出和回归检查见 [进入页说明](entrance-prototype/README.md)。

## 恢复

```sh
git clone --branch playtime-v1 https://github.com/CanqiK/PersonalWebsite.git Playtime-Ver1
cd Playtime-Ver1
python -m http.server 4187 --bind 127.0.0.1
```

本快照位于 `backup/entrance-playtime-v1` 分支 / `playtime-v1` 标签。
主站 main 分支保持原状。历史试验材料留在本地归档，未重复上传到这个版本。
