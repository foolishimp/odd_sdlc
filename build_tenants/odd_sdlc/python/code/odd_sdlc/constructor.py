# Implements: REQ-F-ODDSDLC-003
# Implements: REQ-F-ODDSDLC-004
# Implements: REQ-F-ASSETMODEL-005
"""Bounded constructor turn for the first odd_sdlc slice."""
from __future__ import annotations

import json
from pathlib import Path
from typing import Any

from genesis.events import EventContext, EventStream, emit

from .asset_types import ASSET_TYPES
from .fd_checks import GOALS_MARKER, INTENT_MARKER, PRODUCT_MARKER, REQUIREMENTS_MARKER
from .workspace_assets import checkpoint_for_path, relative_file_uri


def _read_json(path: Path, *, label: str) -> dict[str, Any]:
    raw = json.loads(path.read_text(encoding="utf-8"))
    if not isinstance(raw, dict):
        raise ValueError(f"{label} must be a JSON object")
    return raw


def _workspace_asset_path(workspace_root: Path, target_asset: str) -> Path:
    mapping = {
        "intent_surface": workspace_root / "specification" / "INTENT.md",
        "product_surface": workspace_root / "specification" / "PRODUCT.md",
        "goal_surface": workspace_root / "specification" / "GOALS.md",
        "requirement_surface": workspace_root / "specification" / "requirements" / "10-generated-bootstrap.md",
        "feature_decomp_surface": workspace_root / "build_tenants" / "common" / "design" / "20-generated-feature-decomp.md",
        "uat_testcases_surface": workspace_root / "specification" / "scenarios" / "20-generated-uat-testcases.md",
    }
    try:
        return mapping[target_asset]
    except KeyError as exc:
        raise ValueError(f"Unsupported target_asset {target_asset!r}") from exc


def _construct_intent(workspace_root: Path) -> str:
    product = (workspace_root / "specification" / "PRODUCT.md").read_text(encoding="utf-8").strip()
    goals = (workspace_root / "specification" / "GOALS.md").read_text(encoding="utf-8").strip()
    return "\n".join(
        (
            "# Intent",
            "",
            INTENT_MARKER,
            "",
            "## Purpose",
            "`odd_sdlc` exists to prove that asset-typed GTL/ABG apps can be built, run, audited, reset, and rerun.",
            "",
            "## Bound Sources",
            f"- Product surface present: {'yes' if product else 'no'}",
            f"- Goals surface present: {'yes' if goals else 'no'}",
            "",
            "## Runtime Contract",
            "- graph functions are the constructive carrier",
            "- ABG owns runtime facts",
            "- post-mortem event audit is the primary proof surface",
            "",
        )
    )


def _construct_product(workspace_root: Path) -> str:
    intent = (workspace_root / "specification" / "INTENT.md").read_text(encoding="utf-8").strip()
    goals = (workspace_root / "specification" / "GOALS.md").read_text(encoding="utf-8").strip()
    return "\n".join(
        (
            "# Product",
            "",
            PRODUCT_MARKER,
            "",
            "The current product is a toy app with one real canonical use case:",
            "- derive intent from the bootstrap input set",
            "- derive product from the bootstrap input set plus the current intent surface",
            "- derive goals from the bootstrap input set plus the current intent and product surfaces",
            "- audit emitted facts across that dependency chain",
            "- reset and rerun the same chain",
            "",
            "## Intent Dependency Snapshot",
            intent,
            "",
            "## Current Goals Snapshot",
            goals,
            "",
        )
    )


def _construct_goals(workspace_root: Path) -> str:
    intent = (workspace_root / "specification" / "INTENT.md").read_text(encoding="utf-8").strip()
    product = (workspace_root / "specification" / "PRODUCT.md").read_text(encoding="utf-8").strip()
    return "\n".join(
        (
            "# Goals",
            "",
            GOALS_MARKER,
            "",
            "## Current Wave",
            "- keep the `INTENT -> PRODUCT -> GOALS` dependency chain canonical",
            "- keep the installed sandbox use case repeatable",
            "- prove runtime truth by event audit and archived rerun comparison",
            "",
            "## Upstream Surfaces",
            intent,
            "",
            product,
            "",
        )
    )


def _construct_requirements(workspace_root: Path) -> str:
    intent = (workspace_root / "specification" / "INTENT.md").read_text(encoding="utf-8").strip()
    product = (workspace_root / "specification" / "PRODUCT.md").read_text(encoding="utf-8").strip()
    goals = (workspace_root / "specification" / "GOALS.md").read_text(encoding="utf-8").strip()
    return "\n".join(
        (
            "# Generated Bootstrap Requirements",
            "",
            REQUIREMENTS_MARKER,
            "",
            "The first odd_sdlc slice must remain installable, runnable, auditable, and resettable.",
            "",
            "## Generated Expectations",
            "- the installed sandbox opens the intent, product, and goal graph calls in dependency order",
            "- each bounded constructor turn records attributable asset mutation",
            "- assess-result closes each call lawfully",
            "- reset clears runtime state without corrupting the workspace",
            "",
            "## Derived Sources",
            intent,
            "",
            product,
            "",
            goals,
            "",
        )
    )


def _construct_feature_decomp(workspace_root: Path) -> str:
    requirements = (
        workspace_root / "specification" / "requirements" / "10-generated-bootstrap.md"
    ).read_text(encoding="utf-8").strip()
    return "\n".join(
        (
            "# Generated Feature Decomposition",
            "",
            "This feature decomposition surface is regenerated by the bounded odd_sdlc constructor turn.",
            "",
            "## Candidate Features",
            "- bootstrap_chain: derive intent, product, goals, and requirements in lawful dependency order",
            "- fanout_outputs: derive downstream planning and proving surfaces from the generated requirement surface",
            "",
            "## Source Requirements Snapshot",
            requirements,
            "",
        )
    )


def _construct_uat_testcases(workspace_root: Path) -> str:
    requirements = (
        workspace_root / "specification" / "requirements" / "10-generated-bootstrap.md"
    ).read_text(encoding="utf-8").strip()
    return "\n".join(
        (
            "# Generated UAT Testcases",
            "",
            "This UAT testcase surface is regenerated by the bounded odd_sdlc constructor turn.",
            "",
            "## Canonical Acceptance Cases",
            "1. install a clean sandbox workspace",
            "2. run the bootstrap subgraph to requirements",
            "3. fan out from requirements to feature decomposition and UAT testcase surfaces",
            "4. reset runtime state and rerun without losing archived evidence",
            "",
            "## Source Requirements Snapshot",
            requirements,
            "",
        )
    )


def _constructed_content(target_asset: str, workspace_root: Path) -> str:
    if target_asset == "intent_surface":
        return _construct_intent(workspace_root)
    if target_asset == "product_surface":
        return _construct_product(workspace_root)
    if target_asset == "goal_surface":
        return _construct_goals(workspace_root)
    if target_asset == "requirement_surface":
        return _construct_requirements(workspace_root)
    if target_asset == "feature_decomp_surface":
        return _construct_feature_decomp(workspace_root)
    if target_asset == "uat_testcases_surface":
        return _construct_uat_testcases(workspace_root)
    raise ValueError(f"Unsupported target_asset {target_asset!r}")


def construct_manifest(manifest_path: str | Path, *, workspace_root: str | Path = ".") -> dict[str, Any]:
    workspace = Path(workspace_root).resolve()
    manifest_file = Path(manifest_path).resolve()
    manifest = _read_json(manifest_file, label=f"manifest file {manifest_file}")

    target_asset = manifest.get("target_asset")
    result_path = manifest.get("result_path")
    failing_evaluators = manifest.get("failing_evaluators", [])
    if not isinstance(target_asset, str) or not target_asset:
        raise ValueError("manifest must provide target_asset")
    if not isinstance(result_path, str) or not result_path:
        raise ValueError("manifest must provide result_path")
    if not isinstance(failing_evaluators, list) or not failing_evaluators:
        raise ValueError("manifest must provide failing_evaluators")

    target_path = _workspace_asset_path(workspace, target_asset)
    target_path.parent.mkdir(parents=True, exist_ok=True)
    previous_checkpoint = checkpoint_for_path(target_path)
    content = _constructed_content(target_asset, workspace)
    target_path.write_text(content, encoding="utf-8")
    current_checkpoint = checkpoint_for_path(target_path)

    declared_asset_type = {
        "intent_surface": "intent_doc",
        "product_surface": "product_doc",
        "goal_surface": "goal_surface",
        "requirement_surface": "requirement_surface",
        "feature_decomp_surface": "feature_decomp_surface",
        "uat_testcases_surface": "uat_testcases_surface",
    }[target_asset]
    asset_profile = ASSET_TYPES[declared_asset_type]

    emit(
        "asset_checkpoint_updated",
        {
            "asset_id": target_asset,
            "asset_uri": relative_file_uri(target_path, workspace_root=workspace),
            "declared_asset_type": declared_asset_type,
            "mutable": asset_profile.mutable_default,
            "manifest_id": manifest["manifest_id"],
            "edge": manifest["edge"],
            "target_path": str(target_path),
            "previous_checkpoint": previous_checkpoint.to_dict(),
            "current_checkpoint": current_checkpoint.to_dict(),
        },
        stream=EventStream.open(workspace),
        context=EventContext(
            workflow_version=manifest.get("workflow_version", "unknown"),
            run_id=manifest.get("run_id"),
            job_id=manifest.get("job_id"),
            graph_function_id=manifest.get("graph_function_id"),
            materialization_id=manifest.get("materialization_id"),
            call_id=manifest.get("call_id"),
            vector_id=manifest.get("vector_id"),
            aggregate_type="graph_call",
            aggregate_id=manifest.get("call_id"),
            correlation_id=manifest.get("call_id"),
        ),
    )

    primary_evaluator = failing_evaluators[0]["name"]
    payload = {
        "edge": manifest["edge"],
        "actor": "odd_sdlc_constructor",
        "assessments": [
            {
                "evaluator": primary_evaluator,
                "result": "pass",
                "evidence": f"updated {target_path.relative_to(workspace)} via bounded constructor turn",
            }
        ],
    }
    result_file = Path(result_path)
    result_file.parent.mkdir(parents=True, exist_ok=True)
    result_file.write_text(json.dumps(payload, indent=2), encoding="utf-8")

    return {
        "status": "constructed",
        "manifest_path": str(manifest_file),
        "target_asset": target_asset,
        "target_path": str(target_path),
        "result_path": str(result_file),
        "actor": payload["actor"],
        "evaluator": primary_evaluator,
    }
