# Implements: REQ-F-ODDSDLC-004
"""Bounded span-level gap analysis for odd_sdlc operator zoom."""
from __future__ import annotations

from typing import Any

from genesis.services import gen_gaps

from .traceability import current_requirement_executability_gap
from .triage import enrich_gap_snapshot


_DEPENDENT_PROOF_EDGES = {
    "derive_code_surface",
    "derive_test_design_surface",
    "select_test_stack_profile",
    "derive_test_module_surface",
    "derive_test_run_archive_surface",
    "qualify_testcase_authority",
    "prepare_release_surface",
    "prepare_build_execution_surface",
    "derive_build_execution_result_surface",
    "prepare_test_execution_surface",
    "derive_test_execution_result_surface",
    "prepare_deployment_surface",
    "derive_deployment_result_surface",
    "derive_deployed_environment_surface",
    "derive_runtime_observation_surface",
    "derive_retrofit_plan_surface",
}


def _active_edge_order(app) -> list[str]:
    catalog_entries = app.scope().module.metadata.get("function_catalog", ())
    order: list[str] = []
    for entry in catalog_entries:
        if not isinstance(entry, dict):
            continue
        backing = entry.get("backing_graph_function")
        if not isinstance(backing, str) or not backing:
            continue
        order.append(backing)
    return order


def _slice_span_edges(order: list[str], start_edge: str, end_edge: str) -> list[str]:
    if start_edge not in order:
        raise ValueError(f"unknown span start edge {start_edge!r}")
    if end_edge not in order:
        raise ValueError(f"unknown span end edge {end_edge!r}")
    start_index = order.index(start_edge)
    end_index = order.index(end_edge)
    if start_index > end_index:
        raise ValueError(
            f"invalid span ordering: start edge {start_edge!r} occurs after end edge {end_edge!r}"
        )
    return order[start_index : end_index + 1]


def span_gap_analysis(
    app,
    *,
    from_edge: str,
    to_edge: str,
    zoom: str = "combined",
    include_dependent: bool = True,
) -> dict[str, Any]:
    if zoom not in {"coarse", "refined", "combined"}:
        raise ValueError(f"invalid zoom {zoom!r}; expected coarse, refined, or combined")

    scope = app.scope()
    raw_payload = gen_gaps(scope, app.stream)
    order = _active_edge_order(app)
    span_edges = _slice_span_edges(order, from_edge, to_edge)
    direct_span_gaps = [
        dict(gap)
        for gap in raw_payload.get("gaps", ())
        if isinstance(gap, dict) and str(gap.get("edge") or "") in span_edges
    ]
    span_raw_payload = {
        **raw_payload,
        "gaps": direct_span_gaps,
        "jobs_considered": len(span_edges),
        "total_delta": sum(float(gap.get("delta") or 0.0) for gap in direct_span_gaps),
        "converged": not direct_span_gaps,
    }
    refined_payload = enrich_gap_snapshot(
        workspace_root=app.config.workspace_root,
        stream=app.stream,
        workflow_version=scope.workflow_version,
        raw_gap_payload=span_raw_payload,
        runtime_config=app.config.runtime_config,
        publish=False,
    )
    dependent_gap = current_requirement_executability_gap(app.config.workspace_root)
    include_executability = include_dependent and any(edge in _DEPENDENT_PROOF_EDGES for edge in span_edges)
    dependent_gaps = [dependent_gap] if include_executability else []
    combined_delta = float(refined_payload.get("total_delta") or 0.0) + sum(
        float(gap.get("delta") or 0.0) for gap in dependent_gaps
    )
    combined_converged = bool(refined_payload.get("converged")) and all(
        bool(gap.get("converged")) for gap in dependent_gaps
    )

    result = {
        "analysis_kind": "odd_sdlc.span_gap_analysis",
        "span": {
            "from_edge": from_edge,
            "to_edge": to_edge,
            "selected_edges": span_edges,
            "zoom": zoom,
            "include_dependent": include_dependent,
        },
        "coarse": {
            "jobs_considered": len(span_edges),
            "total_delta": span_raw_payload["total_delta"],
            "converged": span_raw_payload["converged"],
            "gaps": direct_span_gaps,
        },
        "refined": refined_payload,
        "dependent_gaps": dependent_gaps,
        "combined": {
            "total_delta": combined_delta,
            "converged": combined_converged,
            "direct_gap_count": len(direct_span_gaps),
            "dependent_gap_count": len(dependent_gaps),
        },
    }
    result["selected_view"] = result["combined" if zoom == "combined" else zoom]
    return result
