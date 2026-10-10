"""Verify a downloaded checkout against the version's byte-for-byte manifest."""
from pathlib import Path
import hashlib
import json

root = Path(__file__).resolve().parent
manifest = json.loads((root / 'snapshot-manifest.json').read_text(encoding='utf-8'))
for record in manifest['files']:
    path = (root / record['path']).resolve()
    assert path.is_relative_to(root), record['path']
    assert path.is_file(), f"Missing: {record['path']}"
    assert path.stat().st_size == record['bytes'], f"Size mismatch: {record['path']}"
    assert hashlib.sha256(path.read_bytes()).hexdigest() == record['sha256'], f"Changed: {record['path']}"
print(f"Verified {len(manifest['files'])} files: {manifest['codename']}")
