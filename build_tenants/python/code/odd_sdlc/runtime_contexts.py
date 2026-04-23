"""Published runtime context sidecars for odd_sdlc."""
from __future__ import annotations

import hashlib
import json
from pathlib import Path
from typing import Any

from .test_lane_evidence import build_test_lane_completeness_context

STATEFUL_ITERATOR_CONTROL_CONTEXT_PATH = Path(
    ".ai-workspace/runtime/odd_sdlc-stateful-builder-control-frame.md"
)
TEST_LANE_COMPLETENESS_CONTEXT_PATH = Path(
    ".ai-workspace/runtime/odd_sdlc-test-lane-completeness.md"
)
REALIZATION_ITERATION_DIGEST_CONTEXT_PATH = Path(
    ".ai-workspace/runtime/odd_sdlc-realization-iteration-digest.md"
)

_REALIZATION_ITERATION_EDGES = (
    "derive_implementation_module_surface",
    "derive_code_surface",
    "derive_test_design_surface",
    "derive_test_module_surface",
)


def _sha256_text(content: str) -> str:
    return "sha256:" + hashlib.sha256(content.encode("utf-8")).hexdigest()


def _read_text(path: Path) -> str | None:
    if not path.exists():
        return None
    return path.read_text(encoding="utf-8")


def _latest_manifest_for_edge(workspace_root: Path, edge_id: str) -> Path | None:
    manifests_dir = workspace_root / ".ai-workspace" / "fp_manifests"
    if not manifests_dir.exists():
        return None
    manifests = sorted(manifests_dir.glob(f"{edge_id}_*.json"))
    return manifests[-1] if manifests else None


def _manifest_result_path(workspace_root: Path, manifest_path: Path, manifest_payload: dict[str, Any]) -> Path | None:
    result_path = manifest_payload.get("result_path")
    if isinstance(result_path, str) and result_path:
        candidate = Path(result_path)
        if not candidate.is_absolute():
            candidate = (workspace_root / candidate).resolve()
        return candidate
    candidate = workspace_root / ".ai-workspace" / "fp_results" / manifest_path.name
    return candidate if candidate.exists() else None


def build_realization_iteration_digest_context(workspace_root: Path) -> str:
    lines = [
        "# odd_sdlc Realization Iteration Continuity Digest",
        "",
        "This runtime context publishes the latest prior-turn fp_manifest / fp_result digest",
        "for realization edges. Treat it as historical evidence only; current workspace",
        "state remains the runtime truth.",
    ]
    for edge_id in _REALIZATION_ITERATION_EDGES:
        lines.extend(("", f"## `{edge_id}`"))
        manifest_path = _latest_manifest_for_edge(workspace_root, edge_id)
        if manifest_path is None:
            lines.append("- no_prior_turn_published: true")
            continue
        manifest_text = _read_text(manifest_path)
        if manifest_text is None:
            lines.append("- no_prior_turn_published: true")
            continue
        try:
            manifest_payload = json.loads(manifest_text)
        except json.JSONDecodeError:
            manifest_payload = {}
        result_path = _manifest_result_path(workspace_root, manifest_path, manifest_payload)
        result_text = _read_text(result_path) if result_path is not None else None
        lines.extend(
            (
                f"- latest_manifest_path: {manifest_path.as_posix()}",
                f"- latest_manifest_digest: {_sha256_text(manifest_text)}",
            )
        )
        if result_path is not None and result_text is not None:
            lines.extend(
                (
                    f"- latest_result_path: {result_path.as_posix()}",
                    f"- latest_result_digest: {_sha256_text(result_text)}",
                )
            )
        else:
            lines.append("- latest_result_path: unavailable")
    lines.append("")
    return "\n".join(lines)


def publish_runtime_contexts(workspace_root: Path) -> list[dict[str, str]]:
    package_python_root = Path(__file__).resolve().parents[2]
    published_contexts = (
        (
            package_python_root / "design" / "fp" / "STATEFUL_ITERATOR_CONTROL_FRAME.md",
            workspace_root / STATEFUL_ITERATOR_CONTROL_CONTEXT_PATH,
            "stateful_builder_control_frame",
        ),
        (
            None,
            workspace_root / TEST_LANE_COMPLETENESS_CONTEXT_PATH,
            "test_lane_completeness_context",
        ),
        (
            None,
            workspace_root / REALIZATION_ITERATION_DIGEST_CONTEXT_PATH,
            "realization_iteration_digest",
        ),
    )
    actions: list[dict[str, str]] = []
    for source_path, target_path, label in published_contexts:
        if source_path is None:
            if label == "test_lane_completeness_context":
                content = build_test_lane_completeness_context(workspace_root)
            else:
                content = build_realization_iteration_digest_context(workspace_root)
        else:
            content = source_path.read_text(encoding="utf-8")
        target_path.parent.mkdir(parents=True, exist_ok=True)
        existing = target_path.read_text(encoding="utf-8") if target_path.exists() else None
        if existing == content:
            continue
        target_path.write_text(content, encoding="utf-8")
        action_kind = f"{'update' if existing is not None else 'create'}_{label}"
        actions.append(
            {
                "kind": action_kind,
                "path": target_path.as_posix(),
                "detail": f"published {label.replace('_', ' ')} runtime context for odd_sdlc execution",
            }
        )
    return actions
