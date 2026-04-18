from __future__ import annotations

import os
import re
import subprocess
import sys
from pathlib import Path


RESULT_PATH_PATTERN = re.compile(r"Write fulfillment assessment JSON to:\s*(.+)")


def _extract_result_path(prompt: str) -> Path:
    match = RESULT_PATH_PATTERN.search(prompt)
    if match is None:
        raise ValueError("prompt did not contain a result-path directive")
    return Path(match.group(1).strip())


def _derive_manifest_path(result_path: Path) -> Path:
    return Path(str(result_path).replace("/fp_results/", "/fp_manifests/"))


def main(argv: list[str] | None = None) -> int:
    args = list(argv or sys.argv[1:])
    if len(args) != 1:
        raise SystemExit("usage: fake_fp_agent.py '<prompt>'")

    prompt = args[0]
    workspace = Path.cwd()
    result_path = _extract_result_path(prompt)
    manifest_path = _derive_manifest_path(result_path)
    env = os.environ.copy()
    pythonpath_entries = [
        str(workspace / ".genesis"),
        str(workspace / ".genesis" / "odd_sdlc" / "python" / "code"),
    ]
    existing_pythonpath = env.get("PYTHONPATH")
    if existing_pythonpath:
        pythonpath_entries.append(existing_pythonpath)
    env["PYTHONPATH"] = os.pathsep.join(pythonpath_entries)

    completed = subprocess.run(
        [
            sys.executable,
            "-m",
            "odd_sdlc",
            "construct",
            "--manifest",
            str(manifest_path),
            "--workspace",
            str(workspace),
        ],
        cwd=str(workspace),
        env=env,
        capture_output=True,
        text=True,
    )
    if completed.returncode != 0:
        if completed.stdout:
            sys.stdout.write(completed.stdout)
        if completed.stderr:
            sys.stderr.write(completed.stderr)
        return completed.returncode
    sys.stdout.write(completed.stdout)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
