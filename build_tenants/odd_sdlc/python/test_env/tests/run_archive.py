# Validates: REQ-F-VERIFY-003
# Validates: REQ-F-VERIFY-004
"""Persistent run archive for odd_sdlc sandbox-backed proving lanes."""

from __future__ import annotations

import json
import re
import shutil
import subprocess
import sys
from dataclasses import dataclass, field
from datetime import datetime, timezone
from pathlib import Path
from typing import Any


TESTS_DIR = Path(__file__).resolve().parent
VARIANT_ROOT = TESTS_DIR.parents[1]
ODD_ROOT = TESTS_DIR.parents[4]


def _safe_name(value: str) -> str:
    return re.sub(r"[^A-Za-z0-9._-]+", "_", value).strip("_") or "unnamed"


def _git_commit() -> str:
    try:
        result = subprocess.run(
            ["git", "rev-parse", "HEAD"],
            cwd=str(ODD_ROOT),
            capture_output=True,
            text=True,
            timeout=5,
        )
    except Exception:
        return "unknown"
    if result.returncode != 0:
        return "unknown"
    return result.stdout.strip() or "unknown"


def _load_events(workspace: Path) -> list[dict[str, Any]]:
    events_path = workspace / ".ai-workspace" / "events" / "events.jsonl"
    if not events_path.exists():
        return []
    return [
        json.loads(line)
        for line in events_path.read_text(encoding="utf-8").splitlines()
        if line.strip()
    ]


def _unique_runtime_refs(events: list[dict[str, Any]], key: str) -> list[str]:
    values: list[str] = []
    for event in events:
        value = event.get(key)
        if isinstance(value, str) and value not in values:
            values.append(value)
    return values


@dataclass
class RunArchive:
    run_dir: Path
    workspace: Path
    artifacts_dir: Path
    usecase_id: str
    test_name: str
    timestamp: str
    notes: list[dict[str, Any]] = field(default_factory=list)
    summary_overrides: dict[str, Any] = field(default_factory=dict)
    _stdout_path: Path = field(init=False)
    _stderr_path: Path = field(init=False)
    _finalized: bool = field(default=False, init=False)

    def __post_init__(self) -> None:
        self._stdout_path = self.run_dir / "stdout.log"
        self._stderr_path = self.run_dir / "stderr.log"
        self._stdout_path.touch()
        self._stderr_path.touch()

    def note(self, label: str, **data: Any) -> None:
        self.notes.append(
            {
                "label": label,
                "timestamp": datetime.now(timezone.utc).isoformat(),
                **data,
            }
        )

    def log_subprocess(self, label: str, result: subprocess.CompletedProcess[str]) -> None:
        args = result.args if isinstance(result.args, list) else [str(result.args)]
        self.note(
            "subprocess",
            subprocess_label=label,
            args=args,
            returncode=result.returncode,
        )
        with open(self._stdout_path, "a", encoding="utf-8") as handle:
            handle.write(f"--- {label} (exit {result.returncode}) ---\n")
            handle.write(result.stdout or "")
            handle.write("\n")
        with open(self._stderr_path, "a", encoding="utf-8") as handle:
            handle.write(f"--- {label} (exit {result.returncode}) ---\n")
            handle.write(result.stderr or "")
            handle.write("\n")

    def capture_text(self, name: str, text: str) -> Path:
        path = self.artifacts_dir / name
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_text(text, encoding="utf-8")
        return path

    def capture_json(self, name: str, payload: Any) -> Path:
        path = self.artifacts_dir / name
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_text(json.dumps(payload, indent=2, sort_keys=True), encoding="utf-8")
        return path

    def copy_file(self, source: Path, *, dest_name: str | None = None) -> Path | None:
        if not source.exists():
            return None
        destination = self.artifacts_dir / (dest_name or source.name)
        destination.parent.mkdir(parents=True, exist_ok=True)
        shutil.copy2(source, destination)
        return destination

    def snapshot_runtime(self, label: str, *, workspace: Path | None = None) -> Path:
        workspace_root = workspace or self.workspace
        snapshot_root = self.artifacts_dir / "runtime_snapshots" / _safe_name(label)
        if snapshot_root.exists():
            shutil.rmtree(snapshot_root)
        snapshot_root.mkdir(parents=True, exist_ok=True)

        captured: list[str] = []
        for relative in (
            Path(".ai-workspace"),
            Path("specification/INTENT.md"),
            Path("specification/PRODUCT.md"),
            Path("specification/GOALS.md"),
            Path("specification/requirements"),
        ):
            source = workspace_root / relative
            if source.is_dir():
                shutil.copytree(source, snapshot_root / relative)
                captured.append(str(relative))
            elif source.exists():
                destination = snapshot_root / relative
                destination.parent.mkdir(parents=True, exist_ok=True)
                shutil.copy2(source, destination)
                captured.append(str(relative))

        self.note(
            "runtime_snapshot",
            snapshot_label=label,
            snapshot_root=str(snapshot_root),
            captured=captured,
        )
        return snapshot_root

    def update_summary(self, **data: Any) -> None:
        self.summary_overrides.update(data)

    def finalize(
        self,
        *,
        test_passed: bool,
        outcome: str,
        outcome_stage: str | None = None,
        outcome_reason: str | None = None,
    ) -> None:
        if self._finalized:
            return
        self._finalized = True

        self.snapshot_runtime("final")

        summary = self._build_summary()
        summary["test_passed"] = test_passed
        summary["test_outcome"] = outcome
        summary["outcome_stage"] = outcome_stage
        summary["outcome_reason"] = outcome_reason
        (self.run_dir / "summary.json").write_text(
            json.dumps(summary, indent=2, sort_keys=True),
            encoding="utf-8",
        )

        run_meta = {
            "usecase_id": self.usecase_id,
            "test_name": self.test_name,
            "timestamp": self.timestamp,
            "test_passed": test_passed,
            "test_outcome": outcome,
            "outcome_stage": outcome_stage,
            "outcome_reason": outcome_reason,
            "source_commit": _git_commit(),
            "python": sys.executable,
            "notes": self.notes,
        }
        (self.run_dir / "run.json").write_text(
            json.dumps(run_meta, indent=2, sort_keys=True),
            encoding="utf-8",
        )

        self._copy_workspace_artifacts()

    def _build_summary(self) -> dict[str, Any]:
        events = _load_events(self.workspace)
        summary = {
            "usecase_id": self.usecase_id,
            "test_name": self.test_name,
            "workspace": str(self.workspace),
            "total_events": len(events),
            "event_sequence": [
                str(event["event_type"])
                for event in events
                if isinstance(event, dict) and isinstance(event.get("event_type"), str)
            ],
            "event_types": sorted(
                {
                    str(event["event_type"])
                    for event in events
                    if isinstance(event, dict) and isinstance(event.get("event_type"), str)
                }
            ),
            "run_ids": _unique_runtime_refs(events, "run_id"),
            "graph_call_ids": _unique_runtime_refs(events, "call_id"),
            "continuation_ids": _unique_runtime_refs(events, "continuation_id"),
            "manifest_files": self._list_runtime_files("fp_manifests"),
            "result_files": self._list_runtime_files("fp_results"),
            "snapshots": [
                note["snapshot_label"]
                for note in self.notes
                if note.get("label") == "runtime_snapshot" and isinstance(note.get("snapshot_label"), str)
            ],
        }
        summary.update(self.summary_overrides)
        return summary

    def _copy_workspace_artifacts(self) -> None:
        for relative, dest_name in (
            (Path(".ai-workspace/events/events.jsonl"), "events.jsonl"),
            (Path(".ai-workspace/runtime/resolved-runtime.json"), "resolved-runtime.json"),
            (Path(".genesis/genesis.yml"), "genesis.runtime.yml"),
        ):
            self.copy_file(self.workspace / relative, dest_name=dest_name)

        for subdir, prefix in (("fp_manifests", "manifest"), ("fp_results", "result")):
            root = self.workspace / ".ai-workspace" / subdir
            if not root.exists():
                continue
            for payload in sorted(root.glob("*.json")):
                self.copy_file(payload, dest_name=f"{prefix}_{payload.name}")

    def _list_runtime_files(self, name: str) -> list[str]:
        root = self.workspace / ".ai-workspace" / name
        if not root.exists():
            return []
        return sorted(path.name for path in root.glob("*.json"))


def create_run_archive(usecase_id: str, test_name: str) -> RunArchive:
    timestamp = datetime.now(timezone.utc).strftime("%Y%m%dT%H%M%S")
    run_name = f"{timestamp}_{_safe_name(test_name)}"
    run_dir = VARIANT_ROOT / "test_runs" / _safe_name(usecase_id) / run_name
    workspace = run_dir / "workspace"
    artifacts_dir = run_dir / "artifacts"
    run_dir.mkdir(parents=True, exist_ok=True)
    workspace.mkdir(parents=True, exist_ok=True)
    artifacts_dir.mkdir(parents=True, exist_ok=True)
    return RunArchive(
        run_dir=run_dir,
        workspace=workspace,
        artifacts_dir=artifacts_dir,
        usecase_id=_safe_name(usecase_id),
        test_name=test_name,
        timestamp=timestamp,
    )
