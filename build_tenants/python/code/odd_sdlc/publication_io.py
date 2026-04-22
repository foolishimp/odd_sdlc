"""Prime publication helpers for idempotent file writes."""
from __future__ import annotations

import json
from pathlib import Path
from typing import Any


def write_text_if_changed(path: Path, content: str) -> bool:
    path.parent.mkdir(parents=True, exist_ok=True)
    existing = path.read_text(encoding="utf-8") if path.exists() else None
    if existing == content:
        return False
    path.write_text(content, encoding="utf-8")
    return True


def write_json_if_changed(path: Path, payload: dict[str, Any]) -> bool:
    return write_text_if_changed(
        path,
        json.dumps(payload, indent=2, sort_keys=True),
    )
