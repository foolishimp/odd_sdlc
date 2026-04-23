# Implements: REQ-F-ODDSDLC-033
# Implements: REQ-F-ODDSDLC-034
# Implements: REQ-F-ODDSDLC-035
# Implements: REQ-F-ODDSDLC-037
"""Homeostatic gap observation and triage projections for odd_sdlc."""
from __future__ import annotations

import hashlib
import json
import uuid
from pathlib import Path
from typing import Any, Mapping

from genesis.events import EventStream

from .analysis import load_analysis_manifest, load_workspace_state, workspace_state_ready
from .constitutional_surface import constitutional_surface_digest
from .gtl_module import module as odd_sdlc_module
from .public_start_contract import RealizationIterationProjection
from .runtime_effects import publish_runtime_event
from .runtime_event_contract import admit_runtime_event_payload


CURRENT_TRIAGE_DIR = Path(".ai-workspace/runtime/triage")
CURRENT_TRIAGE_ARTIFACT_KIND = "odd_sdlc.current_edge_triage"
CURRENT_TRIAGE_SCHEMA_VERSION = "v2"
_EDGE_LAYER_BY_NAME = {
    "derive_intent_surface": "intent",
    "derive_product_surface": "product",
    "derive_goal_surface": "goals",
    "derive_requirement_surface": "requirements",
    "derive_feature_decomp_surface": "design",
    "derive_uat_testcases_surface": "test",
    "derive_design_surface": "design",
    "derive_scenario_surface": "design",
    "derive_implementation_design_surface": "design",
    "select_implementation_stack_profile": "code",
    "derive_implementation_module_surface": "code",
    "derive_code_surface": "code",
    "derive_test_design_surface": "test",
    "select_test_stack_profile": "test",
    "derive_test_module_surface": "test",
    "derive_test_run_archive_surface": "test",
    "qualify_testcase_authority": "test",
    "prepare_release_surface": "execution",
    "prepare_deployment_surface": "execution",
    "derive_runtime_observation_surface": "execution",
    "derive_retrofit_plan_surface": "design",
}

_BINDING_LAYER_BY_NAME = {
    "intent_surface": "intent",
    "product_surface": "product",
    "goal_surface": "goals",
    "requirement_surface": "requirements",
    "feature_decomp_surface": "design",
    "uat_testcases_surface": "test",
    "design_surface": "design",
    "scenario_surface": "design",
    "implementation_design_surface": "design",
    "implementation_stack_profile": "code",
    "implementation_module_surface": "code",
    "code_surface": "code",
    "test_design_surface": "test",
    "test_stack_profile": "test",
    "test_module_surface": "test",
    "test_run_archive_surface": "test",
    "testcase_authority_surface": "test",
    "release_surface": "execution",
    "deployment_surface": "execution",
    "runtime_observation_surface": "execution",
    "retrofit_plan_surface": "design",
}

_CONSTITUTIONAL_RESOLUTION_EVENT_TYPES = frozenset(
    {
        "approved",
        "revoked",
        "constitutional_proposal_deferred",
        "constitutional_proposal_approved_with_edits",
    }
)


def current_edge_triage_path(workspace_root: Path | str, edge_id: str) -> Path:
    root = Path(workspace_root).resolve()
    return root / CURRENT_TRIAGE_DIR / f"{edge_id}.json"


def _load_json_dict(path: Path) -> dict[str, Any] | None:
    payload = json.loads(path.read_text(encoding="utf-8"))
    if not isinstance(payload, dict):
        return None
    return payload


def _published_event_id(event: dict[str, Any]) -> str | None:
    event_id = event.get("event_id")
    return event_id if isinstance(event_id, str) and event_id else None


def load_current_edge_triage(workspace_root: Path | str, edge_id: str) -> dict[str, Any] | None:
    path = current_edge_triage_path(workspace_root, edge_id)
    if not path.exists():
        return None
    return _load_json_dict(path)


def _new_id(prefix: str) -> str:
    return f"{prefix}_{uuid.uuid4().hex[:16]}"


def _constitutional_target_surface_digest(*, workspace_root: Path, target_surface: str) -> str:
    target_path = workspace_root / target_surface
    if not target_path.exists():
        return "missing"
    return constitutional_surface_digest(target_path)


def _gap_snapshot_run_id(*, analysis_fingerprint: str | None, work_key: str | None) -> str:
    payload = {
        "kind": "gap_snapshot",
        "analysis_fingerprint": analysis_fingerprint or "unpublished",
        "work_key": work_key or "global",
    }
    digest = hashlib.sha256(
        json.dumps(payload, sort_keys=True, separators=(",", ":")).encode("utf-8")
    ).hexdigest()[:16]
    return f"gap_snapshot::{digest}"


def _normalize_text(value: str) -> str:
    return " ".join(value.split())


def _normalized_evidence_item(item: dict[str, Any]) -> dict[str, Any]:
    normalized = dict(item)
    role = str(normalized.get("evidence_role") or "")
    if role in {"delta_summary", "workspace_state"}:
        normalized.pop("detail", None)
    elif isinstance(normalized.get("detail"), str):
        normalized["detail"] = _normalize_text(str(normalized["detail"]))
    if isinstance(normalized.get("excerpt"), str):
        normalized["excerpt"] = _normalize_text(str(normalized["excerpt"]))
    return normalized


def _normalized_projection(projection: dict[str, Any]) -> dict[str, Any]:
    observation = dict(projection.get("observation") or {})
    triage = dict(projection.get("triage") or {})
    route_binding = dict(projection.get("route_binding") or {})
    constitutional = projection.get("constitutional_proposal")
    observation.pop("event_id", None)
    observation.pop("observation_id", None)
    triage.pop("event_id", None)
    triage.pop("triage_id", None)
    triage.pop("observation_id", None)
    triage.pop("prior_observation_id", None)
    route_binding.pop("route_id", None)
    route_binding.pop("route_event_id", None)
    if isinstance(constitutional, dict):
        constitutional = dict(constitutional)
        constitutional.pop("event_id", None)
        constitutional.pop("resolution_event_id", None)
    return {
        "edge_id": projection.get("edge_id"),
        "run_id": projection.get("run_id"),
        "analysis_fingerprint": projection.get("analysis_fingerprint"),
        "analysis_current": projection.get("analysis_current"),
        "current_work_key": projection.get("current_work_key"),
        "triage_hash": projection.get("triage_hash"),
        "observation": {
            **observation,
            "evidence": [
                _normalized_evidence_item(item)
                for item in observation.get("evidence", ())
                if isinstance(item, dict)
            ],
        },
        "triage": {
            **triage,
            "evidence": [
                _normalized_evidence_item(item)
                for item in triage.get("evidence", ())
                if isinstance(item, dict)
            ],
        },
        "route_binding": route_binding,
        "constitutional_proposal": constitutional,
    }


def _event_index_by_id(all_events: list[dict[str, Any]]) -> dict[str, int]:
    indexes: dict[str, int] = {}
    for index, event in enumerate(all_events):
        event_id = event.get("event_id")
        if isinstance(event_id, str) and event_id:
            indexes[event_id] = index
    return indexes


def _artifact_matches_current(
    artifact: dict[str, Any] | None,
    *,
    analysis_current: bool,
    analysis_fingerprint: str | None,
    work_key: str | None,
    all_events: list[dict[str, Any]],
) -> bool:
    if artifact is None:
        return False
    if bool(artifact.get("analysis_current")) != analysis_current:
        return False
    if str(artifact.get("analysis_fingerprint") or "") != str(analysis_fingerprint or ""):
        return False
    if artifact.get("current_work_key") != work_key:
        return False
    route_event_id = ((artifact.get("route_binding") or {}).get("route_event_id"))
    constitutional = artifact.get("constitutional_proposal") or {}
    constitutional_event_id = constitutional.get("event_id")
    last_event_id = constitutional_event_id or route_event_id
    if not isinstance(last_event_id, str) or not last_event_id:
        return False
    indexes = _event_index_by_id(all_events)
    last_index = indexes.get(last_event_id)
    if last_index is None:
        return False
    edge_id = str(artifact.get("edge_id") or "")
    if not edge_id:
        return False
    for event in all_events[last_index + 1 :]:
        if str((event.get("data") or {}).get("edge") or "") != edge_id:
            continue
        if str(event.get("event_type") or "") in _CONSTITUTIONAL_RESOLUTION_EVENT_TYPES:
            return False
    return True


def enrich_gap_snapshot(
    *,
    workspace_root: Path | str,
    stream: EventStream,
    workflow_version: str,
    raw_gap_payload: dict[str, Any],
    runtime_config: dict[str, Any] | None,
    publish: bool,
) -> dict[str, Any]:
    root = Path(workspace_root).resolve()
    analysis_current, workspace_state = workspace_state_ready(root)
    analysis_manifest = load_analysis_manifest(root)
    current_workspace_state = workspace_state or load_workspace_state(root) or {}
    all_events = list(stream.all_events())
    analysis_fingerprint = None
    if analysis_manifest is not None:
        analysis_fingerprint = str(analysis_manifest.get("analysis_fingerprint") or "") or None
    elif workspace_state is not None:
        analysis_fingerprint = str(workspace_state.get("analysis_fingerprint") or "") or None

    enriched_gaps = []
    for entry in raw_gap_payload.get("gaps", ()):
        edge_id = str(entry["edge"])
        work_key = str(entry.get("work_key") or "") or None
        prior = load_current_edge_triage(root, edge_id)
        projection: dict[str, Any]
        if not publish and prior is not None and _artifact_matches_current(
            prior,
            analysis_current=analysis_current,
            analysis_fingerprint=analysis_fingerprint,
            work_key=work_key,
            all_events=all_events,
        ):
            projection = prior
        else:
            run_id = _gap_snapshot_run_id(
                analysis_fingerprint=analysis_fingerprint,
                work_key=work_key,
            )
            projection = _build_edge_projection(
                workspace_root=root,
                entry=entry,
                analysis_current=analysis_current,
                analysis_fingerprint=analysis_fingerprint,
                workspace_state=current_workspace_state,
                runtime_config=runtime_config or {},
                all_events=all_events,
                prior=prior,
                run_id=run_id,
            )
        if publish:
            projection = _publish_edge_projection(
                workspace_root=root,
                stream=stream,
                workflow_version=workflow_version,
                projection=projection,
                prior=prior,
            )
        enriched_gaps.append(
            {
                **entry,
                "observation": projection["observation"],
                "triage": projection["triage"],
                "route_proposal": projection["route_proposal"],
                "route_binding": projection["route_binding"],
                "constitutional_proposal": projection["constitutional_proposal"],
            }
        )

    return {
        **raw_gap_payload,
        "analysis_current": analysis_current,
        "analysis_fingerprint": analysis_fingerprint,
        "gaps": enriched_gaps,
    }


def _build_edge_projection(
    *,
    workspace_root: Path,
    entry: dict[str, Any],
    analysis_current: bool,
    analysis_fingerprint: str | None,
    workspace_state: dict[str, Any],
    runtime_config: dict[str, Any],
    all_events: list[dict[str, Any]],
    prior: dict[str, Any] | None,
    run_id: str,
) -> dict[str, Any]:
    triage: dict[str, Any]
    edge_id = str(entry["edge"])
    work_key = str(entry.get("work_key") or "") or None
    observation = _build_observation(entry=entry, analysis_current=analysis_current)
    triage = _build_triage(
        workspace_root=workspace_root,
        entry=entry,
        analysis_current=analysis_current,
        analysis_fingerprint=analysis_fingerprint,
        observation=observation,
        workspace_state=workspace_state,
        runtime_config=runtime_config,
    )
    semantic_hash = _semantic_hash(
        {
            "edge_id": edge_id,
            "observation": {
                "observed_boundary": observation["observed_boundary"],
                "observed_signal": observation["observed_signal"],
                "evidence": observation["evidence"],
            },
            "triage": {
                "framework_layer": triage["framework_layer"],
                "framework_condition": triage["framework_condition"],
                "gap_kind": triage["gap_kind"],
                "process_outcome_kind": triage["process_outcome_kind"],
                "reentry_layer": triage["reentry_layer"],
                "resumption_trigger": triage["resumption_trigger"],
                "authority_basis": {
                    key: value
                    for key, value in triage["authority_basis"].items()
                    if key != "analysis_fingerprint"
                },
                "realized_basis": triage["realized_basis"],
                "realization_iteration": triage.get("realization_iteration"),
                "evidence": triage["evidence"],
                "asset_findings": triage["asset_findings"],
                "route_proposal": triage["route_proposal"],
                "policy_gate": triage["policy_gate"],
            },
        }
    )
    constitutional_proposal = _build_constitutional_proposal(
        workspace_root=workspace_root,
        entry=entry,
        triage=triage,
        workspace_state=workspace_state,
        runtime_config=runtime_config,
        all_events=all_events,
    )
    observation["observation_id"] = _new_id("obs")
    triage["triage_id"] = _new_id("tri")
    triage["observation_id"] = observation["observation_id"]
    if prior is not None and str(prior.get("triage_hash") or "") != semantic_hash:
        triage["prior_observation_id"] = (prior.get("observation") or {}).get("observation_id")
    route_binding = _build_route_binding(
        triage=triage,
        route_proposal=triage["route_proposal"],
        constitutional_proposal=constitutional_proposal,
    )
    return {
        "artifact_kind": CURRENT_TRIAGE_ARTIFACT_KIND,
        "schema_version": CURRENT_TRIAGE_SCHEMA_VERSION,
        "edge_id": edge_id,
        "run_id": run_id,
        "analysis_fingerprint": analysis_fingerprint,
        "analysis_current": analysis_current,
        "current_work_key": work_key,
        "triage_hash": semantic_hash,
        "observation": observation,
        "triage": triage,
        "route_proposal": triage["route_proposal"],
        "route_binding": route_binding,
        "constitutional_proposal": constitutional_proposal,
    }


def _build_observation(*, entry: dict[str, Any], analysis_current: bool) -> dict[str, Any]:
    if not analysis_current:
        return {
            "observed_boundary": "analysis",
            "observed_signal": "stale_published_analysis",
            "evidence": [
                {
                    "evidence_role": "workspace_state",
                    "detail": "published analysis is not current for the active workspace inputs",
                }
            ],
        }

    failing = tuple(entry.get("failing") or ())
    missing_required = tuple(entry.get("missing_required_bindings") or ())
    if missing_required or not entry.get("environment_ready", True):
        return {
            "observed_boundary": "dependency",
            "observed_signal": "missing_required_bindings",
            "evidence": [
                {
                    "evidence_role": "required_binding",
                    "binding": binding,
                }
                for binding in missing_required
            ] or [
                {
                    "evidence_role": "environment",
                    "detail": "edge environment is not ready",
                }
            ],
        }
    if any("ambiguity" in name for name in failing):
        return {
            "observed_boundary": "ambiguity",
            "observed_signal": "major_ambiguity",
            "evidence": [
                {
                    "evidence_role": "failing_evaluator",
                    "name": name,
                }
                for name in failing
            ],
        }
    if any(
        name.startswith("missing_")
        or name.startswith("missing-")
        or "capability" in name
        for name in failing
    ):
        return {
            "observed_boundary": "capability",
            "observed_signal": "missing_capability",
            "evidence": [
                {
                    "evidence_role": "failing_evaluator",
                    "name": name,
                }
                for name in failing
            ],
        }
    return {
        "observed_boundary": _edge_layer(str(entry["edge"])),
        "observed_signal": "unresolved_gap_pressure",
        "evidence": [
            {
                "evidence_role": "delta_summary",
                "detail": _normalize_text(str(entry.get("delta_summary") or "")),
            }
        ],
    }


def _structured_authority_basis(
    *,
    entry: dict[str, Any],
    analysis_fingerprint: str | None,
    reentry_layer: str | None,
) -> dict[str, Any]:
    return {
        "basis_kind": "gap_authority_basis",
        "edge": str(entry["edge"]),
        "analysis_fingerprint": analysis_fingerprint,
        "failing_evaluators": list(entry.get("failing") or ()),
        "missing_required_bindings": list(entry.get("missing_required_bindings") or ()),
        "reentry_layer": reentry_layer,
    }


def _structured_realized_basis(
    *,
    entry: dict[str, Any],
    workspace_state: dict[str, Any],
) -> dict[str, Any]:
    return {
        "basis_kind": "gap_realized_basis",
        "delta": float(entry.get("delta") or 0.0),
        "delta_summary": _normalize_text(str(entry.get("delta_summary") or "")),
        "environment_ready": bool(entry.get("environment_ready", True)),
        "work_key": entry.get("work_key"),
        "selected_output_dir": workspace_state.get("selected_output_dir"),
    }


def _mapping_dict(value: object) -> dict[str, Any] | None:
    if hasattr(value, "to_dict"):
        value = value.to_dict()
    if not isinstance(value, Mapping):
        return None
    return {str(key): item for key, item in value.items()}


def _dispatch_index(workspace_root: Path, *, edge_id: str) -> int:
    manifests_dir = workspace_root / ".ai-workspace" / "fp_manifests"
    if not manifests_dir.exists():
        return 0
    return sum(1 for _ in manifests_dir.glob(f"{edge_id}_*.json"))


def _edge_fp_retry_policy(
    workspace_root: Path,
    *,
    edge_id: str,
) -> dict[str, Any] | None:
    module = odd_sdlc_module(workspace_root)
    for graph_function in module.graph_functions:
        if graph_function.template.graph is None:
            continue
        for vector in graph_function.template.graph.vectors:
            if vector.name != edge_id:
                continue
            return _mapping_dict(vector.declarations.get("fp_retry_policy"))
    return None


def _realization_iteration_projection(
    *,
    workspace_root: Path,
    entry: dict[str, Any],
) -> RealizationIterationProjection | None:
    edge_id = str(entry.get("edge") or "")
    if not edge_id:
        return None
    policy = _edge_fp_retry_policy(workspace_root, edge_id=edge_id)
    if policy is None:
        return None
    evaluator_id = str(policy.get("evaluator_id") or "")
    if not evaluator_id:
        return None
    failing = {str(name) for name in (entry.get("failing") or ()) if str(name)}
    if evaluator_id not in failing:
        return None
    deepening_eligible = bool(policy.get("deepening_eligible"))
    return {
        "edge_id": edge_id,
        "evaluator_id": evaluator_id,
        "classification": (
            "deepening_eligible"
            if deepening_eligible
            else "structurally_terminal"
        ),
        "deepening_eligible": deepening_eligible,
        "carry_delta": float(entry.get("delta") or 0.0),
        "dispatch_index": _dispatch_index(workspace_root, edge_id=edge_id),
    }


def _build_fixed_route_proposal(triage: dict[str, Any]) -> dict[str, Any] | None:
    outcome = str(triage["process_outcome_kind"])
    reentry_layer = str(triage.get("reentry_layer") or "")
    target_assets = [
        finding["asset_id"]
        for finding in triage.get("asset_findings", ())
        if isinstance(finding, dict) and isinstance(finding.get("asset_id"), str)
    ]
    if outcome != "advance_fixed_vector":
        return None
    fixed_vector: str | None = None
    if triage["gap_kind"] == "dependency_gap":
        fixed_vector = f"resume_from_{reentry_layer}" if reentry_layer else None
    elif reentry_layer == "product":
        fixed_vector = "reopen_product"
    elif reentry_layer == "requirements":
        fixed_vector = "reopen_requirements"
    elif reentry_layer == "design":
        fixed_vector = "reopen_design"
    elif reentry_layer == "code":
        fixed_vector = "repair_output_contract"
    elif reentry_layer == "test":
        fixed_vector = "realize_missing_tests"
    if fixed_vector is None:
        return None
    return {
        "vector_kind": "fixed",
        "fixed_vector": fixed_vector,
        "dynamic_family": None,
        "selected_graphfunction": None,
        "target_assets": target_assets,
    }


def _build_realization_iteration_route_proposal(
    triage: dict[str, Any],
) -> dict[str, Any] | None:
    if str(triage.get("process_outcome_kind") or "") != "advance_declared_graph_function":
        return None
    edge_id = str(((triage.get("authority_basis") or {}).get("edge")) or "")
    iteration = triage.get("realization_iteration")
    if not edge_id or not isinstance(iteration, Mapping):
        return None
    if not bool(iteration.get("deepening_eligible")):
        return None
    return {
        "vector_kind": "declared_graph_function",
        "fixed_vector": None,
        "dynamic_family": None,
        "selected_graphfunction": edge_id,
        "target_assets": [],
        "priority_source": "triage.realization_iteration",
    }


def _declared_head_graph_function_routes(workspace_root: Path) -> frozenset[str]:
    declared = odd_sdlc_module(workspace_root).metadata.get("start_authoritative_head_graph_functions", ())
    return frozenset(entry for entry in declared if isinstance(entry, str) and entry)


def _dynamic_route_forbidden_head_graph_functions(workspace_root: Path) -> frozenset[str]:
    declared = odd_sdlc_module(workspace_root).metadata.get(
        "dynamic_route_forbidden_head_graph_functions",
        (),
    )
    return frozenset(entry for entry in declared if isinstance(entry, str) and entry)


def _build_declared_graph_function_route_proposal(
    triage: dict[str, Any],
    *,
    workspace_root: Path,
) -> dict[str, Any] | None:
    edge = str(((triage.get("authority_basis") or {}).get("edge")) or "")
    if not edge or edge not in _declared_head_graph_function_routes(workspace_root):
        return None
    return {
        "vector_kind": "declared_graph_function",
        "fixed_vector": None,
        "dynamic_family": None,
        "selected_graphfunction": edge,
        "target_assets": [],
    }


def _dynamic_route_candidates(runtime_config: dict[str, Any]) -> tuple[dict[str, Any], ...]:
    section = runtime_config.get("dynamic_routing")
    if not isinstance(section, dict):
        return ()
    candidates = section.get("candidates")
    if not isinstance(candidates, list):
        return ()
    normalized: list[dict[str, Any]] = []
    for candidate in candidates:
        if not isinstance(candidate, dict):
            continue
        family = candidate.get("family")
        graphfunction = candidate.get("graphfunction")
        if not isinstance(family, str) or not family or not isinstance(graphfunction, str) or not graphfunction:
            continue
        applies_to = candidate.get("applies_to")
        normalized.append(
            {
                "family": family,
                "graphfunction": graphfunction,
                "priority": int(candidate.get("priority", 0) or 0),
                "applies_to": applies_to if isinstance(applies_to, dict) else {},
            }
        )
    return tuple(normalized)


def _dynamic_route_matches(candidate: dict[str, Any], triage: dict[str, Any]) -> bool:
    applies_to = candidate.get("applies_to") or {}
    for field in ("edge", "framework_layer", "framework_condition", "gap_kind", "reentry_layer"):
        expected = applies_to.get(field)
        if expected is None:
            continue
        actual = (
            ((triage.get("authority_basis") or {}).get("edge"))
            if field == "edge"
            else triage.get(field)
        )
        if actual != expected:
            return False
    return True


def _build_dynamic_route_proposal(
    triage: dict[str, Any],
    *,
    runtime_config: dict[str, Any],
) -> tuple[dict[str, Any] | None, bool]:
    candidates = _dynamic_route_candidates(runtime_config)
    if not candidates:
        return None, isinstance(runtime_config.get("dynamic_routing"), dict)
    matches = [candidate for candidate in candidates if _dynamic_route_matches(candidate, triage)]
    if not matches:
        return None, True
    selected = sorted(
        matches,
        key=lambda candidate: (
            -int(candidate["priority"]),
            str(candidate["family"]),
            str(candidate["graphfunction"]),
        ),
    )[0]
    target_assets = [
        finding["asset_id"]
        for finding in triage.get("asset_findings", ())
        if isinstance(finding, dict) and isinstance(finding.get("asset_id"), str)
    ]
    return {
        "vector_kind": "dynamic",
        "fixed_vector": None,
        "dynamic_family": selected["family"],
        "selected_graphfunction": selected["graphfunction"],
        "target_assets": target_assets,
    }, True


def _assign_route_proposal(
    triage: dict[str, Any],
    *,
    workspace_root: Path,
    runtime_config: dict[str, Any],
) -> dict[str, Any]:
    edge = str(((triage.get("authority_basis") or {}).get("edge")) or "")
    realization_iteration = _build_realization_iteration_route_proposal(triage)
    if realization_iteration is not None:
        triage["route_proposal"] = realization_iteration
        return triage
    declared_graph_function = _build_declared_graph_function_route_proposal(
        triage,
        workspace_root=workspace_root,
    )
    if declared_graph_function is not None:
        triage["process_outcome_kind"] = "advance_declared_graph_function"
        triage["route_proposal"] = declared_graph_function
        return triage
    proposal = _build_fixed_route_proposal(triage)
    if proposal is not None:
        triage["route_proposal"] = proposal
        return triage
    if edge and edge in _dynamic_route_forbidden_head_graph_functions(workspace_root):
        triage["route_proposal"] = None
        extensions = dict(triage.get("extensions") or {})
        extensions["no_lawful_route_reason"] = "graph_function_only_route_requires_declaration"
        triage["extensions"] = extensions
        return triage
    dynamic_proposal, dynamic_consulted = _build_dynamic_route_proposal(
        triage,
        runtime_config=runtime_config,
    )
    if dynamic_proposal is not None:
        triage["process_outcome_kind"] = "advance_dynamic_family"
        triage["route_proposal"] = dynamic_proposal
        return triage
    triage["route_proposal"] = None
    if dynamic_consulted:
        extensions = dict(triage.get("extensions") or {})
        extensions["no_lawful_route_reason"] = "no_matching_dynamic_candidate"
        triage["extensions"] = extensions
    return triage


def _build_triage(
    *,
    workspace_root: Path,
    entry: dict[str, Any],
    analysis_current: bool,
    analysis_fingerprint: str | None,
    observation: dict[str, Any],
    workspace_state: dict[str, Any],
    runtime_config: dict[str, Any],
) -> dict[str, Any]:
    triage: dict[str, Any]
    failing = tuple(entry.get("failing") or ())
    missing_required = tuple(entry.get("missing_required_bindings") or ())
    delta = float(entry.get("delta") or 0.0)
    framework_layer = _framework_layer(entry)
    reentry_layer = _reentry_layer(entry)
    authority_basis = _structured_authority_basis(
        entry=entry,
        analysis_fingerprint=analysis_fingerprint,
        reentry_layer=reentry_layer,
    )
    realized_basis = _structured_realized_basis(entry=entry, workspace_state=workspace_state)
    realization_iteration = _realization_iteration_projection(
        workspace_root=workspace_root,
        entry=entry,
    )

    if not analysis_current:
        triage = {
            "analysis_fingerprint": analysis_fingerprint,
            "framework_layer": "analysis",
            "framework_condition": "stale",
            "gap_kind": "unclassified_gap",
            "process_outcome_kind": "blocked_stale_analysis",
            "reentry_layer": None,
            "resumption_trigger": "analysis_published",
            "policy_gate": {"state": "none", "reason": "analysis_not_current"},
            "authority_basis": authority_basis,
            "realized_basis": realized_basis,
            "asset_findings": [],
            "evidence": list(observation["evidence"]),
            "extensions": {},
        }
        triage["route_proposal"] = None
        return triage
    if any(
        name.startswith("missing_")
        or name.startswith("missing-")
        or "capability" in name
        for name in failing
    ):
        triage = {
            "analysis_fingerprint": analysis_fingerprint,
            "framework_layer": "capability",
            "framework_condition": "blocked",
            "gap_kind": "unclassified_gap",
            "process_outcome_kind": "blocked_missing_capability",
            "reentry_layer": None,
            "resumption_trigger": "capability_declaration_changed",
            "policy_gate": {"state": "capability_blocked", "reason": "missing_capability"},
            "authority_basis": authority_basis,
            "realized_basis": realized_basis,
            "asset_findings": [],
            "evidence": list(observation["evidence"]),
            "extensions": {},
        }
        triage["route_proposal"] = None
        return triage
    if missing_required or not entry.get("environment_ready", True):
        triage = {
            "analysis_fingerprint": analysis_fingerprint,
            "framework_layer": framework_layer,
            "framework_condition": "missing",
            "gap_kind": "dependency_gap",
            "process_outcome_kind": "advance_fixed_vector",
            "reentry_layer": reentry_layer,
            "resumption_trigger": None,
            "policy_gate": {"state": "none", "reason": None},
            "authority_basis": authority_basis,
            "realized_basis": realized_basis,
            "asset_findings": [
                {
                    "asset_id": binding,
                    "finding_kind": "missing_required_binding",
                    "target_layer": _binding_layer(binding),
                }
                for binding in missing_required
            ],
            "evidence": list(observation["evidence"]),
            "extensions": {},
        }
        triage = _assign_route_proposal(triage, workspace_root=workspace_root, runtime_config=runtime_config)
        if triage["route_proposal"] is None:
            triage["process_outcome_kind"] = "no_lawful_route"
            triage["framework_condition"] = "unroutable"
        return triage
    if any("ambiguity" in name for name in failing):
        triage = {
            "analysis_fingerprint": analysis_fingerprint,
            "framework_layer": "ambiguity",
            "framework_condition": "contradictory",
            "gap_kind": "ambiguity_gap",
            "process_outcome_kind": "await_fh_resolution",
            "reentry_layer": reentry_layer,
            "resumption_trigger": "approved_or_revoked",
            "policy_gate": {"state": "fh_approval_required", "reason": "major_ambiguity"},
            "authority_basis": authority_basis,
            "realized_basis": realized_basis,
            "asset_findings": [],
            "evidence": list(observation["evidence"]),
            "extensions": {},
        }
        triage["route_proposal"] = None
        return triage
    if delta > 0 and reentry_layer in {"goals", "intent"}:
        triage = {
            "analysis_fingerprint": analysis_fingerprint,
            "framework_layer": framework_layer,
            "framework_condition": "insufficient",
            "gap_kind": "unclassified_gap",
            "process_outcome_kind": "propose_constitutional_reprice",
            "reentry_layer": reentry_layer,
            "resumption_trigger": "approved_or_revoked",
            "policy_gate": {"state": "fh_approval_required", "reason": "constitutional_reprice_candidate"},
            "authority_basis": authority_basis,
            "realized_basis": realized_basis,
            "asset_findings": [],
            "evidence": list(observation["evidence"]),
            "extensions": {},
        }
        triage["route_proposal"] = None
        return triage
    if delta > 0 and reentry_layer in {"product", "requirements", "design", "code", "test"}:
        triage = {
            "analysis_fingerprint": analysis_fingerprint,
            "framework_layer": framework_layer,
            "framework_condition": "unproven",
            "gap_kind": f"{reentry_layer}_gap" if reentry_layer in {"requirements", "design", "code", "test"} else "unclassified_gap",
            "process_outcome_kind": (
                "advance_declared_graph_function"
                if realization_iteration is not None and realization_iteration["deepening_eligible"]
                else "advance_fixed_vector"
            ),
            "reentry_layer": reentry_layer,
            "resumption_trigger": None,
            "policy_gate": {"state": "none", "reason": None},
            "authority_basis": authority_basis,
            "realized_basis": realized_basis,
            "asset_findings": [],
            "evidence": list(observation["evidence"]),
            "extensions": {},
        }
        if realization_iteration is not None:
            triage["realization_iteration"] = realization_iteration
        triage = _assign_route_proposal(triage, workspace_root=workspace_root, runtime_config=runtime_config)
        if triage["route_proposal"] is None:
            triage["process_outcome_kind"] = "no_lawful_route"
            triage["framework_condition"] = "unroutable"
        return triage
    if delta > 0:
        triage = {
            "analysis_fingerprint": analysis_fingerprint,
            "framework_layer": framework_layer,
            "framework_condition": "unroutable",
            "gap_kind": "unclassified_gap",
            "process_outcome_kind": "no_lawful_route",
            "reentry_layer": reentry_layer,
            "resumption_trigger": None,
            "policy_gate": {"state": "none", "reason": None},
            "authority_basis": authority_basis,
            "realized_basis": realized_basis,
            "asset_findings": [],
            "evidence": list(observation["evidence"]),
            "extensions": {},
        }
        triage = _assign_route_proposal(triage, workspace_root=workspace_root, runtime_config=runtime_config)
        return triage
    triage = {
        "analysis_fingerprint": analysis_fingerprint,
        "framework_layer": framework_layer,
        "framework_condition": "complete",
        "gap_kind": "unclassified_gap",
        "process_outcome_kind": "converged",
        "reentry_layer": reentry_layer,
        "resumption_trigger": None,
        "policy_gate": {"state": "none", "reason": None},
        "authority_basis": authority_basis,
        "realized_basis": realized_basis,
        "asset_findings": [],
        "evidence": list(observation["evidence"]),
        "extensions": {},
    }
    triage["route_proposal"] = None
    return triage


def _framework_layer(entry: dict[str, Any]) -> str:
    if not entry.get("environment_ready", True):
        missing_required = tuple(entry.get("missing_required_bindings") or ())
        if missing_required:
            return _binding_layer(missing_required[0])
        return "routing"
    return _edge_layer(str(entry["edge"]))


def _reentry_layer(entry: dict[str, Any]) -> str | None:
    missing_required = tuple(entry.get("missing_required_bindings") or ())
    if missing_required:
        return _binding_layer(missing_required[0])
    layer = _edge_layer(str(entry["edge"]))
    return layer if layer in {"intent", "product", "goals", "requirements", "design", "code", "test"} else None


def _edge_layer(edge_id: str) -> str:
    return _EDGE_LAYER_BY_NAME.get(edge_id, "code")


def _binding_layer(binding: str) -> str:
    return _BINDING_LAYER_BY_NAME.get(binding, "code")


def _build_constitutional_proposal(
    *,
    workspace_root: Path,
    entry: dict[str, Any],
    triage: dict[str, Any],
    workspace_state: dict[str, Any],
    runtime_config: dict[str, Any],
    all_events: list[dict[str, Any]],
) -> dict[str, Any] | None:
    if triage["process_outcome_kind"] != "propose_constitutional_reprice":
        return None
    reentry_layer = triage.get("reentry_layer")
    if reentry_layer not in {"goals", "intent"}:
        return None

    edge_id = str(entry["edge"])
    work_key = str(entry.get("work_key") or "") or None
    target_surface = "specification/GOALS.md" if reentry_layer == "goals" else "specification/INTENT.md"
    proposal_kind = "goal_reprice" if reentry_layer == "goals" else "intent_reprice"
    target_surface_digest = _constitutional_target_surface_digest(
        workspace_root=workspace_root,
        target_surface=target_surface,
    )
    proposal_identity_hash = _constitutional_proposal_identity_hash(
        edge_id=edge_id,
        work_key=work_key,
        reentry_layer=str(reentry_layer),
        proposal_kind=proposal_kind,
        target_surface=target_surface,
        target_surface_digest=target_surface_digest,
    )
    mode = _constitutional_policy_mode(
        workspace_state=workspace_state,
        runtime_config=runtime_config,
    )
    proposal_id = f"const_{proposal_identity_hash[:16]}"
    resolution = _constitutional_resolution(
        edge_id=edge_id,
        proposal_id=proposal_id,
        all_events=all_events,
    )
    state = "suppressed" if mode == "suppress" else "pending_fh"
    if resolution is not None:
        state = resolution["state"]
    return {
        "proposal_id": proposal_id,
        "identity_hash": proposal_identity_hash,
        "state": state,
        "policy_mode": mode,
        "proposal_kind": proposal_kind,
        "target_surface": target_surface,
        "target_surface_digest": target_surface_digest,
        "reentry_layer": reentry_layer,
        "resumption_trigger": "approved_or_revoked" if state in {"pending_fh", "defer"} else None,
        "evidence": list(triage["evidence"]),
        "resolution_event_id": None if resolution is None else resolution["event_id"],
    }


def _constitutional_policy_mode(
    *,
    workspace_state: dict[str, Any],
    runtime_config: dict[str, Any],
) -> str:
    config_section = runtime_config.get("constitutional_repricing")
    configured_mode = config_section.get("mode") if isinstance(config_section, dict) else None
    if configured_mode in {"fh_gate", "suppress"}:
        return str(configured_mode)
    if configured_mode is not None:
        raise RuntimeError(
            f"invalid constitutional_repricing.mode {configured_mode!r}; expected 'fh_gate' or 'suppress'"
        )
    workspace_mode = str(workspace_state.get("workspace_mode") or "")
    if workspace_mode == "governed_workspace":
        return "suppress"
    return "fh_gate"


def _constitutional_resolution(
    *,
    edge_id: str,
    proposal_id: str,
    all_events: list[dict[str, Any]],
) -> dict[str, str] | None:
    for event in reversed(all_events):
        data = event.get("data", {})
        if data.get("edge") != edge_id:
            continue
        event_proposal_id = data.get("proposal_id")
        if isinstance(event_proposal_id, str) and event_proposal_id and event_proposal_id != proposal_id:
            continue
        event_type = event.get("event_type")
        if event_type == "constitutional_proposal_deferred":
            return {"state": "defer", "event_id": str(event["event_id"])}
        if event_type == "constitutional_proposal_approved_with_edits":
            return {"state": "approve_with_edits", "event_id": str(event["event_id"])}
        if event_type == "approved" and data.get("kind") == "fh_intent":
            return {"state": "approve", "event_id": str(event["event_id"])}
        if event_type == "revoked" and data.get("kind") == "fh_approval":
            return {"state": "reject", "event_id": str(event["event_id"])}
    return None


def _publish_edge_projection(
    *,
    workspace_root: Path,
    stream: EventStream,
    workflow_version: str,
    projection: dict[str, Any],
    prior: dict[str, Any] | None,
) -> dict[str, Any]:
    edge_id = str(projection["edge_id"])
    path = current_edge_triage_path(workspace_root, edge_id)
    path.parent.mkdir(parents=True, exist_ok=True)
    if prior is not None and _normalized_projection(prior) == _normalized_projection(projection):
        if not path.exists():
            path.write_text(json.dumps(prior, indent=2, sort_keys=True) + "\n", encoding="utf-8")
        return prior

    observation_event = publish_runtime_event(
        stream=stream,
        event_type="observation_recorded",
        data=admit_runtime_event_payload(
            event_type="observation_recorded",
            data={
                "kind": "odd_sdlc.homeostatic_gap",
                "edge": edge_id,
                "run_id": projection.get("run_id"),
                "observation_id": projection["observation"]["observation_id"],
                "analysis_fingerprint": projection.get("analysis_fingerprint"),
                "observed_boundary": projection["observation"]["observed_boundary"],
                "observed_signal": projection["observation"]["observed_signal"],
                "evidence": projection["observation"]["evidence"],
            },
        ),
        workflow_version=workflow_version,
        work_key=projection.get("current_work_key"),
        run_id=projection.get("run_id"),
        aggregate_type="odd_sdlc.edge_triage",
        aggregate_id=edge_id,
    )
    triage_event = publish_runtime_event(
        stream=stream,
        event_type="triage_produced",
        data=admit_runtime_event_payload(
            event_type="triage_produced",
            data={
                "kind": "odd_sdlc.homeostatic_gap",
                "edge": edge_id,
                "run_id": projection.get("run_id"),
                "triage_id": projection["triage"]["triage_id"],
                "observation_id": projection["observation"]["observation_id"],
                "prior_observation_id": projection["triage"].get("prior_observation_id"),
                "analysis_fingerprint": projection.get("analysis_fingerprint"),
                "triage_hash": projection["triage_hash"],
                "framework_layer": projection["triage"]["framework_layer"],
                "framework_condition": projection["triage"]["framework_condition"],
                "gap_kind": projection["triage"]["gap_kind"],
                "process_outcome_kind": projection["triage"]["process_outcome_kind"],
                "reentry_layer": projection["triage"]["reentry_layer"],
                "resumption_trigger": projection["triage"]["resumption_trigger"],
                "authority_basis": projection["triage"]["authority_basis"],
                "realized_basis": projection["triage"]["realized_basis"],
                "asset_findings": projection["triage"]["asset_findings"],
                "evidence": projection["triage"]["evidence"],
                "realization_iteration": projection["triage"].get("realization_iteration"),
                "route_proposal": projection["route_proposal"],
            },
        ),
        workflow_version=workflow_version,
        work_key=projection.get("current_work_key"),
        run_id=projection.get("run_id"),
        aggregate_type="odd_sdlc.edge_triage",
        aggregate_id=edge_id,
        correlation_id=_published_event_id(observation_event),
        causation_event_id=_published_event_id(observation_event),
    )
    route_event = publish_runtime_event(
        stream=stream,
        event_type="route_recorded",
        data=admit_runtime_event_payload(
            event_type="route_recorded",
            data={
                "kind": "odd_sdlc.homeostatic_gap",
                "edge": edge_id,
                "run_id": projection.get("run_id"),
                "route_id": projection["route_binding"]["route_id"],
                "triage_id": projection["triage"]["triage_id"],
                "analysis_fingerprint": projection.get("analysis_fingerprint"),
                "state": projection["route_binding"]["state"],
                "vector_kind": projection["route_binding"]["vector_kind"],
                "selected_vector": projection["route_binding"]["selected_vector"],
                "dynamic_family": projection["route_binding"]["dynamic_family"],
                "selected_graphfunction": projection["route_binding"]["selected_graphfunction"],
                "target_assets": projection["route_binding"]["target_assets"],
                "priority_source": projection["route_binding"]["priority_source"],
                "realization_iteration": projection["triage"].get("realization_iteration"),
                "no_lawful_route_reason": projection["route_binding"].get("no_lawful_route_reason"),
            },
        ),
        workflow_version=workflow_version,
        work_key=projection.get("current_work_key"),
        run_id=projection.get("run_id"),
        aggregate_type="odd_sdlc.edge_triage",
        aggregate_id=edge_id,
        correlation_id=_published_event_id(triage_event),
        causation_event_id=_published_event_id(triage_event),
    )
    constitutional_event = None
    if projection["constitutional_proposal"] is not None:
        constitutional_event = publish_runtime_event(
            stream=stream,
            event_type="constitutional_proposal_recorded",
            data=admit_runtime_event_payload(
                event_type="constitutional_proposal_recorded",
                data={
                    "kind": "odd_sdlc.homeostatic_gap",
                    "edge": edge_id,
                    "run_id": projection.get("run_id"),
                    "proposal_id": projection["constitutional_proposal"]["proposal_id"],
                    "triage_id": projection["triage"]["triage_id"],
                    "analysis_fingerprint": projection.get("analysis_fingerprint"),
                    "state": projection["constitutional_proposal"]["state"],
                    "identity_hash": projection["constitutional_proposal"]["identity_hash"],
                    "policy_mode": projection["constitutional_proposal"]["policy_mode"],
                    "proposal_kind": projection["constitutional_proposal"]["proposal_kind"],
                    "target_surface": projection["constitutional_proposal"]["target_surface"],
                    "target_surface_digest": projection["constitutional_proposal"]["target_surface_digest"],
                    "reentry_layer": projection["constitutional_proposal"]["reentry_layer"],
                },
            ),
            workflow_version=workflow_version,
            work_key=projection.get("current_work_key"),
            run_id=projection.get("run_id"),
            aggregate_type="odd_sdlc.edge_triage",
            aggregate_id=edge_id,
            correlation_id=_published_event_id(route_event),
            causation_event_id=_published_event_id(route_event),
        )
    projection["observation"]["event_id"] = observation_event["event_id"]
    projection["triage"]["event_id"] = triage_event["event_id"]
    projection["route_binding"]["route_event_id"] = route_event["event_id"]
    if constitutional_event is not None:
        projection["constitutional_proposal"]["event_id"] = constitutional_event["event_id"]
    if prior is not None and prior.get("triage_hash") != projection["triage_hash"]:
        divergence_event = publish_runtime_event(
            stream=stream,
            event_type="triage_divergence",
            data=admit_runtime_event_payload(
                event_type="triage_divergence",
                data={
                    "kind": "odd_sdlc.homeostatic_gap",
                    "edge": edge_id,
                    "run_id": projection.get("run_id"),
                    "prior_triage_hash": prior.get("triage_hash"),
                    "current_triage_hash": projection["triage_hash"],
                    "prior_triage_id": (prior.get("triage") or {}).get("triage_id"),
                    "current_triage_id": projection["triage"]["triage_id"],
                },
            ),
            workflow_version=workflow_version,
            work_key=projection.get("current_work_key"),
            run_id=projection.get("run_id"),
            aggregate_type="odd_sdlc.edge_triage",
            aggregate_id=edge_id,
        )
        projection["divergence_event_id"] = divergence_event["event_id"]
    path.write_text(json.dumps(projection, indent=2, sort_keys=True) + "\n", encoding="utf-8")
    return projection


def _semantic_hash(payload: dict[str, Any]) -> str:
    return hashlib.sha256(
        json.dumps(payload, sort_keys=True, separators=(",", ":")).encode("utf-8")
    ).hexdigest()


def _constitutional_proposal_identity_hash(
    *,
    edge_id: str,
    work_key: str | None,
    reentry_layer: str,
    proposal_kind: str,
    target_surface: str,
    target_surface_digest: str,
) -> str:
    # Today reentry_layer, proposal_kind, and target_surface are effectively 1:1
    # for constitutional reprices. Keep all three in the basis so future fan-out
    # stays identity-visible. The target-surface digest is computed after stripping
    # prior applied-proposal marker blocks so lawful approval/republication does not
    # mint a new proposal id by itself.
    return _semantic_hash(
        {
            "basis_kind": "constitutional_proposal_identity",
            "edge_id": edge_id,
            "work_key": work_key,
            "reentry_layer": reentry_layer,
            "proposal_kind": proposal_kind,
            "target_surface": target_surface,
            "target_surface_digest": target_surface_digest,
        }
    )


def _build_route_binding(
    *,
    triage: dict[str, Any],
    route_proposal: dict[str, Any] | None,
    constitutional_proposal: dict[str, Any] | None,
) -> dict[str, Any]:
    process_outcome_kind = str(triage["process_outcome_kind"])
    route_id = _new_id("route")
    target_assets = [
        finding["asset_id"]
        for finding in triage.get("asset_findings", ())
        if isinstance(finding, dict) and isinstance(finding.get("asset_id"), str)
    ]
    if process_outcome_kind == "advance_fixed_vector" and route_proposal is not None:
        return {
            "route_id": route_id,
            "state": "advance_fixed_vector",
            "vector_kind": route_proposal["vector_kind"],
            "selected_vector": route_proposal["fixed_vector"],
            "dynamic_family": None,
            "selected_graphfunction": None,
            "target_assets": route_proposal["target_assets"],
            "priority_source": route_proposal.get("priority_source", "triage.fixed_vector_mapping"),
            "no_lawful_route_reason": None,
        }
    if process_outcome_kind == "advance_declared_graph_function" and route_proposal is not None:
        return {
            "route_id": route_id,
            "state": "advance_declared_graph_function",
            "vector_kind": route_proposal["vector_kind"],
            "selected_vector": None,
            "dynamic_family": None,
            "selected_graphfunction": route_proposal.get("selected_graphfunction"),
            "target_assets": [],
            "priority_source": route_proposal.get("priority_source", "triage.declared_graph_function"),
            "no_lawful_route_reason": None,
        }
    if process_outcome_kind == "advance_dynamic_family" and route_proposal is not None:
        return {
            "route_id": route_id,
            "state": "advance_dynamic_family",
            "vector_kind": route_proposal["vector_kind"],
            "selected_vector": None,
            "dynamic_family": route_proposal["dynamic_family"],
            "selected_graphfunction": route_proposal.get("selected_graphfunction"),
            "target_assets": route_proposal["target_assets"],
            "priority_source": "triage.dynamic_family_mapping",
            "no_lawful_route_reason": None,
        }
    if process_outcome_kind == "blocked_stale_analysis":
        return {
            "route_id": route_id,
            "state": "blocked_stale_analysis",
            "vector_kind": None,
            "selected_vector": None,
            "dynamic_family": None,
            "selected_graphfunction": None,
            "target_assets": [],
            "priority_source": "analysis_publication_gate",
            "no_lawful_route_reason": None,
        }
    if process_outcome_kind == "blocked_missing_capability":
        return {
            "route_id": route_id,
            "state": "blocked_missing_capability",
            "vector_kind": None,
            "selected_vector": None,
            "dynamic_family": None,
            "selected_graphfunction": None,
            "target_assets": [],
            "priority_source": "capability_gate",
            "no_lawful_route_reason": None,
        }
    if process_outcome_kind == "await_fh_resolution":
        return {
            "route_id": route_id,
            "state": "await_fh_resolution",
            "vector_kind": None,
            "selected_vector": None,
            "dynamic_family": None,
            "selected_graphfunction": None,
            "target_assets": [],
            "priority_source": "fh_gate",
            "no_lawful_route_reason": None,
        }
    if process_outcome_kind == "propose_constitutional_reprice" and constitutional_proposal is not None:
        constitutional_state = constitutional_proposal["state"]
        if constitutional_state == "suppressed":
            route_state = "suppressed_by_mode"
        elif constitutional_state == "defer":
            route_state = "deferred"
        elif constitutional_state in {"approve", "approve_with_edits"}:
            route_state = "constitutional_reprice_approved"
        elif constitutional_state == "reject":
            route_state = "constitutional_reprice_rejected"
        else:
            route_state = "await_fh_resolution"
        return {
            "route_id": route_id,
            "state": route_state,
            "vector_kind": None,
            "selected_vector": None,
            "dynamic_family": None,
            "selected_graphfunction": None,
            "target_assets": [],
            "priority_source": "constitutional_repricing",
            "no_lawful_route_reason": None,
        }
    if process_outcome_kind == "converged":
        return {
            "route_id": route_id,
            "state": "converged",
            "vector_kind": None,
            "selected_vector": None,
            "dynamic_family": None,
            "selected_graphfunction": None,
            "target_assets": [],
            "priority_source": "triage.converged",
            "no_lawful_route_reason": None,
        }
    if process_outcome_kind == "no_lawful_route":
        return {
            "route_id": route_id,
            "state": "no_lawful_route",
            "vector_kind": None,
            "selected_vector": None,
            "dynamic_family": None,
            "selected_graphfunction": None,
            "target_assets": target_assets,
            "priority_source": "triage.no_lawful_route",
            "no_lawful_route_reason": (triage.get("extensions") or {}).get(
                "no_lawful_route_reason",
                "no_declared_route_mapping",
            ),
        }
    return {
        "route_id": route_id,
        "state": "unresolved",
        "vector_kind": None,
        "selected_vector": None,
        "dynamic_family": None,
        "selected_graphfunction": None,
        "target_assets": target_assets,
        "priority_source": "triage_pending_route_selection",
        "no_lawful_route_reason": None,
    }
