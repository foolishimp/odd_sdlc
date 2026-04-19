"""Test-only Codex launcher for live odd_sdlc qualification lanes.

This wrapper keeps Codex-specific session/auth workarounds out of ABG core
transport. It exists only to make the live qualification harness explicit about
its local operator/runtime assumptions.
"""

from __future__ import annotations

import os
from pathlib import Path
import shutil
import sys
import tempfile


def _resolve_codex_home() -> Path:
    configured = os.environ.get("ODD_SDLC_CODEX_HOME")
    if configured:
        return Path(configured)
    return Path(tempfile.gettempdir()) / "odd_sdlc_live_codex_home"


def _seed_codex_home(target: Path) -> None:
    target.mkdir(parents=True, exist_ok=True)
    source_home = Path.home() / ".codex"
    for filename in ("auth.json", "config.toml", "installation_id"):
        source = source_home / filename
        destination = target / filename
        if source.exists() and not destination.exists():
            shutil.copy2(source, destination)


def main() -> int:
    codex_home = _resolve_codex_home()
    _seed_codex_home(codex_home)
    env = os.environ.copy()
    env["CODEX_HOME"] = str(codex_home)
    os.execvpe("codex", ["codex", *sys.argv[1:]], env)


if __name__ == "__main__":
    raise SystemExit(main())
