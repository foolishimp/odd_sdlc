from __future__ import annotations

import os
import re
import subprocess
import sys
from pathlib import Path


RESULT_PATH_PATTERN = re.compile(r"Write assessment JSON to:\s*(.+)")
REQUIRED_PROMPT_SIGNAL = "Existing files and existing module groups are obligations, not proof of completion."


def _extract_result_path(prompt: str) -> Path:
    match = RESULT_PATH_PATTERN.search(prompt)
    if match is None:
        raise ValueError("prompt did not contain a result-path directive")
    return Path(match.group(1).strip())


def _derive_manifest_path(result_path: Path) -> Path:
    return Path(str(result_path).replace("/fp_results/", "/fp_manifests/"))


def main(argv: list[str] | None = None) -> int:
    args = list(argv or sys.argv[1:])
    if len(args) != 2:
        raise SystemExit("usage: fake_deepening_fp_agent.py '<prompt>' '<target-relative-path>'")

    prompt, target_relative_path = args
    if REQUIRED_PROMPT_SIGNAL not in prompt:
        raise SystemExit("prompt is missing the realization-deepening control law")

    workspace = Path.cwd()
    target_path = workspace / target_relative_path
    if not target_path.exists():
        raise SystemExit(f"target file {target_relative_path!r} does not exist")

    text = target_path.read_text(encoding="utf-8")
    if "???" not in text:
        raise SystemExit(f"target file {target_relative_path!r} is not shallow")
    target_path.write_text(text.replace("???", '"deepened-pass-2"', 1), encoding="utf-8")

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
    if completed.stdout:
        sys.stdout.write(completed.stdout)
    if completed.stderr:
        sys.stderr.write(completed.stderr)
    return completed.returncode


if __name__ == "__main__":
    raise SystemExit(main())
