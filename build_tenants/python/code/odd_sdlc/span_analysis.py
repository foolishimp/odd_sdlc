# Implements: REQ-F-ODDSDLC-004
"""Bounded span-level gap analysis for odd_sdlc operator zoom."""
from __future__ import annotations

from dataclasses import dataclass
from typing import Any, Mapping, Sequence

from genesis.services import ScopeSelector, gen_gaps
from .project_profile import load_or_build_operational_capability_projection
from .requirement_closure import collect_declared_obligation_gaps
from .triage import enrich_gap_snapshot


def parse_gap_scope_selector(raw_scope: str) -> ScopeSelector:
    value = (raw_scope or "").strip()
    if value == "workspace":
        return ScopeSelector(kind="workspace")
    prefix = "work_key:"
    if value.startswith(prefix):
        work_key = value[len(prefix):].strip()
        if work_key:
            return ScopeSelector(kind="work_key", work_key=work_key)
    raise ValueError("scope must be 'workspace' or 'work_key:<id>'")


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


def capability_gap_entries(
    workspace_root,
    *,
    edge_names: Sequence[str] | None = None,
) -> list[dict[str, Any]]:
    capability_projection = load_or_build_operational_capability_projection(workspace_root)
    capability_families = capability_projection.get("families")
    if not isinstance(capability_families, dict):
        return []
    selected_edges = set(edge_names or ())
    entries: list[dict[str, Any]] = []
    for family in capability_families.values():
        if not isinstance(family, dict):
            continue
        if not bool(family.get("in_scope")) or bool(family.get("declared")):
            continue
        family_edges = [
            str(edge_name)
            for edge_name in family.get("expected_resolving_edges", ())
            if str(edge_name)
        ]
        if selected_edges and not any(edge_name in selected_edges for edge_name in family_edges):
            continue
        target_edge = next(
            (edge_name for edge_name in family_edges if edge_name in selected_edges),
            str(family.get("primary_edge") or ""),
        )
        if not target_edge:
            continue
        family_name = str(family.get("family") or "")
        field_name = str(family.get("field_name") or "")
        entries.append(
            {
                "edge": target_edge,
                "delta": 1.0,
                "failing": [f"missing_{family_name}_capability"],
                "passing": [],
                "delta_summary": (
                    f"operational capability `{field_name}` is not declared; "
                    f"`{target_edge}` remains gated until the governing capability is published"
                ),
                "environment_ready": True,
                "operational_capability": dict(family),
            }
        )
    return entries


def _vector_by_name(app) -> dict[str, Any]:
    vectors: dict[str, Any] = {}
    for function in app.scope().module.graph_functions:
        graph = function.template.graph
        if graph is None:
            continue
        for vector in graph.vectors:
            vectors.setdefault(vector.name, vector)
    return vectors


def declared_obligation_specs(
    app,
    *,
    edge_names: Sequence[str] | None = None,
) -> list[tuple[str, dict[str, Any] | Any]]:
    by_name = _vector_by_name(app)
    declarations: list[tuple[str, dict[str, Any] | Any]] = []
    selected_edges = list(edge_names) if edge_names is not None else list(by_name)
    for edge_name in selected_edges:
        vector = by_name.get(edge_name)
        if vector is None:
            continue
        declaration = vector.declarations.get("obligation_ledger")
        if declaration is None:
            continue
        declarations.append((edge_name, declaration))
    return declarations


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


@dataclass(frozen=True)
class RawGraphGap:
    edge: str
    delta: float
    failing: tuple[str, ...]
    passing: tuple[str, ...]
    blocking_reasons: tuple[str, ...]
    metadata: dict[str, Any]


@dataclass(frozen=True)
class DeclaredObligationGap:
    edge: str
    carry_delta: float
    fulfillment_delta: float
    combined_delta: float
    carry_converged: bool
    fulfillment_converged: bool
    edge_converged: bool
    blocking_reasons: tuple[str, ...]
    expected_count: int
    carried_count: int
    fulfilled_count: int
    partial_count: int
    missing_count: int
    extra_count: int
    unfulfilled_count: int
    blocking_count: int
    signal_key: str
    metadata: dict[str, Any]


@dataclass(frozen=True)
class GraphProjection:
    graph_delta: float
    graph_converged: bool
    graph_failing: tuple[str, ...]
    graph_passing: tuple[str, ...]


@dataclass(frozen=True)
class GraphEdgeGapProjection:
    edge: str
    graph_delta: float
    graph_converged: bool
    blocking_reasons: tuple[str, ...]
    failing: tuple[str, ...]
    passing: tuple[str, ...]
    metadata: dict[str, Any]

    def to_dict(self) -> dict[str, Any]:
        payload = dict(self.metadata)
        payload.update(
            {
                "edge": self.edge,
                "gap_kind": "graph_edge_gap",
                "graph_delta": self.graph_delta,
                "graph_converged": self.graph_converged,
                "carry_truth_available": False,
                "fulfillment_truth_available": False,
                "carry_delta": None,
                "fulfillment_delta": None,
                "combined_delta": None,
                "total_delta": self.graph_delta,
                "carry_converged": None,
                "fulfillment_converged": None,
                "edge_converged": self.graph_converged,
                "failing": list(self.failing),
                "passing": list(self.passing),
                "blocking_reasons": list(self.blocking_reasons),
            }
        )
        return payload


@dataclass(frozen=True)
class DeclaredObligationEdgeGapProjection:
    edge: str
    graph_delta: float
    graph_converged: bool
    graph_failing: tuple[str, ...]
    graph_passing: tuple[str, ...]
    carry_delta: float
    fulfillment_delta: float
    combined_delta: float
    total_delta: float
    carry_converged: bool
    fulfillment_converged: bool
    edge_converged: bool
    blocking_reasons: tuple[str, ...]
    expected_count: int
    carried_count: int
    fulfilled_count: int
    partial_count: int
    missing_count: int
    extra_count: int
    unfulfilled_count: int
    blocking_count: int
    signal_key: str
    metadata: dict[str, Any]

    def to_dict(self) -> dict[str, Any]:
        payload = dict(self.metadata)
        payload.update(
            {
                "edge": self.edge,
                "gap_kind": "declared_obligation_edge_gap",
                "graph_delta": self.graph_delta,
                "graph_converged": self.graph_converged,
                "carry_truth_available": True,
                "fulfillment_truth_available": True,
                "graph_failing": list(self.graph_failing),
                "graph_passing": list(self.graph_passing),
                "carry_delta": self.carry_delta,
                "fulfillment_delta": self.fulfillment_delta,
                "combined_delta": self.combined_delta,
                "total_delta": self.total_delta,
                "carry_converged": self.carry_converged,
                "fulfillment_converged": self.fulfillment_converged,
                "edge_converged": self.edge_converged,
                "ledger_converged": self.metadata.get("ledger_converged", self.edge_converged),
                "blocking_reasons": list(self.blocking_reasons),
                "expected_count": self.expected_count,
                "carried_count": self.carried_count,
                "fulfilled_count": self.fulfilled_count,
                "partial_count": self.partial_count,
                "missing_count": self.missing_count,
                "extra_count": self.extra_count,
                "unfulfilled_count": self.unfulfilled_count,
                "blocking_count": self.blocking_count,
                "signal_key": self.signal_key,
            }
        )
        return payload


CanonicalEdgeGap = GraphEdgeGapProjection | DeclaredObligationEdgeGapProjection


@dataclass(frozen=True)
class EdgeGapTruthSummary:
    graph_total_delta: float
    direct_graph_delta: float
    carry_delta: float
    fulfillment_delta: float
    combined_delta: float
    total_delta: float
    declared_obligation_gap_count: int
    graph_edge_gap_count: int
    mixed_truth_classes: bool
    expected_count: int
    carried_count: int
    fulfilled_count: int
    partial_count: int
    missing_count: int
    extra_count: int
    unfulfilled_count: int
    blocking_count: int
    blocking_reasons: tuple[str, ...]
    graph_converged: bool
    carry_converged: bool
    fulfillment_converged: bool
    declared_carry_converged: bool | None
    declared_fulfillment_converged: bool | None
    graph_gap_converged: bool | None
    converged: bool

    def to_dict(self) -> dict[str, Any]:
        return {
            "graph_total_delta": self.graph_total_delta,
            "direct_graph_delta": self.direct_graph_delta,
            "carry_delta": self.carry_delta,
            "fulfillment_delta": self.fulfillment_delta,
            "combined_delta": self.combined_delta,
            "total_delta": self.total_delta,
            "declared_obligation_gap_count": self.declared_obligation_gap_count,
            "graph_edge_gap_count": self.graph_edge_gap_count,
            "mixed_truth_classes": self.mixed_truth_classes,
            "expected_count": self.expected_count,
            "carried_count": self.carried_count,
            "fulfilled_count": self.fulfilled_count,
            "partial_count": self.partial_count,
            "missing_count": self.missing_count,
            "extra_count": self.extra_count,
            "unfulfilled_count": self.unfulfilled_count,
            "blocking_count": self.blocking_count,
            "blocking_reasons": list(self.blocking_reasons),
            "graph_converged": self.graph_converged,
            "carry_converged": self.carry_converged,
            "fulfillment_converged": self.fulfillment_converged,
            "declared_carry_converged": self.declared_carry_converged,
            "declared_fulfillment_converged": self.declared_fulfillment_converged,
            "graph_gap_converged": self.graph_gap_converged,
            "converged": self.converged,
        }


def _string_tuple(values: Any) -> tuple[str, ...]:
    if not isinstance(values, (list, tuple)):
        return ()
    return tuple(str(value) for value in values if str(value))


def _int_value(value: Any) -> int:
    if isinstance(value, bool):
        return int(value)
    if isinstance(value, int):
        return value
    try:
        return int(value)
    except (TypeError, ValueError):
        return 0


def _raw_graph_gap_metadata(payload: Mapping[str, Any]) -> dict[str, Any]:
    consumed = {"edge", "delta", "failing", "passing", "blocking_reasons"}
    return {key: value for key, value in payload.items() if key not in consumed}


def _declared_obligation_gap_metadata(payload: Mapping[str, Any]) -> dict[str, Any]:
    consumed = {
        "edge",
        "carry_delta",
        "fulfillment_delta",
        "combined_delta",
        "carry_converged",
        "fulfillment_converged",
        "edge_converged",
        "blocking_reasons",
        "expected_count",
        "carried_count",
        "fulfilled_count",
        "partial_count",
        "missing_count",
        "extra_count",
        "unfulfilled_count",
        "blocking_count",
        "signal_key",
    }
    return {key: value for key, value in payload.items() if key not in consumed}


def project_raw_graph_gap_rows(raw_graph_gaps: Sequence[Mapping[str, Any]]) -> list[RawGraphGap]:
    projected: list[RawGraphGap] = []
    for gap in raw_graph_gaps:
        edge = str(gap.get("edge") or "")
        if not edge:
            continue
        projected.append(
            RawGraphGap(
                edge=edge,
                delta=float(gap.get("delta") or 0.0),
                failing=_string_tuple(gap.get("failing")),
                passing=_string_tuple(gap.get("passing")),
                blocking_reasons=_string_tuple(gap.get("blocking_reasons")),
                metadata=_raw_graph_gap_metadata(gap),
            )
        )
    return projected


def project_declared_obligation_gap_rows(
    ledger_gaps: Sequence[Mapping[str, Any]],
) -> list[DeclaredObligationGap]:
    projected: list[DeclaredObligationGap] = []
    for gap in ledger_gaps:
        edge = str(gap.get("edge") or "")
        if not edge:
            continue
        projected.append(
            DeclaredObligationGap(
                edge=edge,
                carry_delta=float(gap.get("carry_delta") or 0.0),
                fulfillment_delta=float(gap.get("fulfillment_delta") or 0.0),
                combined_delta=float(gap.get("combined_delta") or 0.0),
                carry_converged=bool(gap.get("carry_converged")),
                fulfillment_converged=bool(gap.get("fulfillment_converged")),
                edge_converged=bool(gap.get("edge_converged")),
                blocking_reasons=_string_tuple(gap.get("blocking_reasons")),
                expected_count=_int_value(gap.get("expected_count")),
                carried_count=_int_value(gap.get("carried_count")),
                fulfilled_count=_int_value(gap.get("fulfilled_count")),
                partial_count=_int_value(gap.get("partial_count")),
                missing_count=_int_value(gap.get("missing_count")),
                extra_count=_int_value(gap.get("extra_count")),
                unfulfilled_count=_int_value(gap.get("unfulfilled_count")),
                blocking_count=_int_value(gap.get("blocking_count")),
                signal_key=str(gap.get("signal_key") or edge),
                metadata=_declared_obligation_gap_metadata(gap),
            )
        )
    return projected


def _edge_order(
    edge_names: Sequence[str],
    raw_graph_gaps: Sequence[RawGraphGap],
    ledger_gaps: Sequence[DeclaredObligationGap],
) -> list[str]:
    ordered: list[str] = []
    for edge_name in edge_names:
        if edge_name not in ordered:
            ordered.append(edge_name)
    for gap in raw_graph_gaps:
        edge_name = gap.edge
        if edge_name and edge_name not in ordered:
            ordered.append(edge_name)
    for gap in ledger_gaps:
        edge_name = gap.edge
        if edge_name and edge_name not in ordered:
            ordered.append(edge_name)
    return ordered


def _graph_projection(edge_name: str, graph_gap: RawGraphGap | None) -> GraphProjection:
    if graph_gap is None:
        return GraphProjection(
            graph_delta=0.0,
            graph_converged=True,
            graph_failing=(),
            graph_passing=(),
        )
    obligation_evaluator_names = {
        f"{edge_name}_obligation_ledger_carry_converged",
    }
    residual_failing = tuple(
        item for item in graph_gap.failing if item not in obligation_evaluator_names
    )
    if not graph_gap.failing:
        return GraphProjection(
            graph_delta=0.0,
            graph_converged=True,
            graph_failing=(),
            graph_passing=graph_gap.passing,
        )
    if residual_failing:
        return GraphProjection(
            graph_delta=graph_gap.delta,
            graph_converged=False,
            graph_failing=residual_failing,
            graph_passing=graph_gap.passing,
        )
    return GraphProjection(
        graph_delta=0.0,
        graph_converged=True,
        graph_failing=(),
        graph_passing=graph_gap.passing,
    )


def _canonical_graph_gap(graph_gap: RawGraphGap) -> GraphEdgeGapProjection:
    graph_converged = not graph_gap.failing and graph_gap.delta == 0.0
    return GraphEdgeGapProjection(
        edge=graph_gap.edge,
        graph_delta=graph_gap.delta,
        graph_converged=graph_converged,
        blocking_reasons=graph_gap.blocking_reasons,
        failing=graph_gap.failing,
        passing=graph_gap.passing,
        metadata=graph_gap.metadata,
    )


def _canonical_declared_gap(
    edge_name: str,
    *,
    graph_gap: RawGraphGap | None,
    ledger_gap: DeclaredObligationGap,
) -> DeclaredObligationEdgeGapProjection:
    graph_projection = _graph_projection(edge_name, graph_gap)
    total_delta = graph_projection.graph_delta + ledger_gap.combined_delta
    merged_metadata = dict(ledger_gap.metadata)
    if graph_gap is not None:
        for key in (
            "delta_summary",
            "environment_ready",
            "observation",
            "triage",
            "route_binding",
            "analysis_current",
        ):
            if key in graph_gap.metadata:
                merged_metadata[key] = graph_gap.metadata[key]
    merged_metadata["ledger_converged"] = ledger_gap.edge_converged
    return DeclaredObligationEdgeGapProjection(
        edge=edge_name,
        graph_delta=graph_projection.graph_delta,
        graph_converged=graph_projection.graph_converged,
        graph_failing=graph_projection.graph_failing,
        graph_passing=graph_projection.graph_passing,
        carry_delta=ledger_gap.carry_delta,
        fulfillment_delta=ledger_gap.fulfillment_delta,
        combined_delta=ledger_gap.combined_delta,
        total_delta=total_delta,
        carry_converged=ledger_gap.carry_converged,
        fulfillment_converged=ledger_gap.fulfillment_converged,
        edge_converged=(
            graph_projection.graph_converged
            and ledger_gap.carry_converged
            and ledger_gap.fulfillment_converged
        ),
        blocking_reasons=ledger_gap.blocking_reasons,
        expected_count=ledger_gap.expected_count,
        carried_count=ledger_gap.carried_count,
        fulfilled_count=ledger_gap.fulfilled_count,
        partial_count=ledger_gap.partial_count,
        missing_count=ledger_gap.missing_count,
        extra_count=ledger_gap.extra_count,
        unfulfilled_count=ledger_gap.unfulfilled_count,
        blocking_count=ledger_gap.blocking_count,
        signal_key=ledger_gap.signal_key,
        metadata=merged_metadata,
    )


def canonical_edge_gaps(
    *,
    edge_names: Sequence[str],
    raw_graph_gaps: Sequence[RawGraphGap],
    ledger_gaps: Sequence[DeclaredObligationGap],
) -> list[CanonicalEdgeGap]:
    raw_by_edge = {gap.edge: gap for gap in raw_graph_gaps if gap.edge}
    ledger_by_edge = {gap.edge: gap for gap in ledger_gaps if gap.edge}
    canonical: list[CanonicalEdgeGap] = []
    for edge_name in _edge_order(edge_names, raw_graph_gaps, ledger_gaps):
        graph_gap = raw_by_edge.get(edge_name)
        ledger_gap = ledger_by_edge.get(edge_name)
        if ledger_gap is None:
            if graph_gap is None:
                continue
            edge_gap = _canonical_graph_gap(graph_gap)
            if not edge_gap.graph_converged:
                canonical.append(edge_gap)
            continue
        edge_gap = _canonical_declared_gap(edge_name, graph_gap=graph_gap, ledger_gap=ledger_gap)
        if not edge_gap.edge_converged:
            canonical.append(edge_gap)
    return canonical


def aggregate_edge_gap_truth(gaps: Sequence[CanonicalEdgeGap]) -> EdgeGapTruthSummary:
    declared_gaps = [gap for gap in gaps if isinstance(gap, DeclaredObligationEdgeGapProjection)]
    graph_only_gaps = [gap for gap in gaps if isinstance(gap, GraphEdgeGapProjection)]
    graph_total_delta = sum(gap.graph_delta for gap in gaps)
    carry_delta = sum(gap.carry_delta for gap in declared_gaps)
    fulfillment_delta = sum(gap.fulfillment_delta for gap in declared_gaps)
    combined_delta = sum(gap.combined_delta for gap in declared_gaps)
    total_delta = sum(
        gap.total_delta if isinstance(gap, DeclaredObligationEdgeGapProjection) else gap.graph_delta
        for gap in gaps
    )
    blocking_reasons = sorted(
        {
            reason
            for gap in gaps
            for reason in gap.blocking_reasons
        }
    )
    declared_carry_converged = (
        None
        if not declared_gaps
        else all(gap.carry_converged for gap in declared_gaps)
    )
    declared_fulfillment_converged = (
        None
        if not declared_gaps
        else all(gap.fulfillment_converged for gap in declared_gaps)
    )
    graph_gap_converged = (
        None
        if not graph_only_gaps
        else all(gap.graph_converged for gap in graph_only_gaps)
    )
    carry_converged = (
        True
        if not gaps
        else (
            False
            if graph_only_gaps
            else all(gap.carry_converged for gap in declared_gaps)
        )
    )
    fulfillment_converged = (
        True
        if not gaps
        else (
            False
            if graph_only_gaps
            else all(gap.fulfillment_converged for gap in declared_gaps)
        )
    )
    return EdgeGapTruthSummary(
        graph_total_delta=graph_total_delta,
        direct_graph_delta=graph_total_delta,
        carry_delta=carry_delta,
        fulfillment_delta=fulfillment_delta,
        combined_delta=combined_delta,
        total_delta=total_delta,
        declared_obligation_gap_count=len(declared_gaps),
        graph_edge_gap_count=len(graph_only_gaps),
        mixed_truth_classes=bool(declared_gaps and graph_only_gaps),
        expected_count=sum(gap.expected_count for gap in declared_gaps),
        carried_count=sum(gap.carried_count for gap in declared_gaps),
        fulfilled_count=sum(gap.fulfilled_count for gap in declared_gaps),
        partial_count=sum(gap.partial_count for gap in declared_gaps),
        missing_count=sum(gap.missing_count for gap in declared_gaps),
        extra_count=sum(gap.extra_count for gap in declared_gaps),
        unfulfilled_count=sum(gap.unfulfilled_count for gap in declared_gaps),
        blocking_count=sum(gap.blocking_count for gap in declared_gaps),
        blocking_reasons=tuple(blocking_reasons),
        graph_converged=all(gap.graph_converged for gap in gaps),
        carry_converged=carry_converged,
        fulfillment_converged=fulfillment_converged,
        declared_carry_converged=declared_carry_converged,
        declared_fulfillment_converged=declared_fulfillment_converged,
        graph_gap_converged=graph_gap_converged,
        converged=not gaps,
    )


def span_gap_analysis(
    app,
    *,
    scope: str = "workspace",
    from_edge: str,
    to_edge: str,
    zoom: str = "combined",
    include_dependent: bool = True,
) -> dict[str, Any]:
    if zoom not in {"coarse", "refined", "combined"}:
        raise ValueError(f"invalid zoom {zoom!r}; expected coarse, refined, or combined")

    resolved_scope = app.scope(selector=parse_gap_scope_selector(scope))
    raw_payload = gen_gaps(resolved_scope, app.stream)
    order = _active_edge_order(app)
    span_edges = _slice_span_edges(order, from_edge, to_edge)
    all_direct_span_gaps = [
        dict(gap)
        for gap in raw_payload.get("gaps", ())
        if isinstance(gap, dict) and str(gap.get("edge") or "") in span_edges
    ]
    seen_edges = {str(gap.get("edge") or "") for gap in all_direct_span_gaps}
    for entry in capability_gap_entries(app.config.workspace_root, edge_names=span_edges):
        edge_name = str(entry.get("edge") or "")
        if edge_name in seen_edges:
            continue
        seen_edges.add(edge_name)
        all_direct_span_gaps.append(entry)
    dependent_gaps = (
        collect_declared_obligation_gaps(
            app.config.workspace_root,
            declared_obligation_specs(app, edge_names=span_edges),
        )
        if include_dependent
        else []
    )
    canonical_gaps = canonical_edge_gaps(
        edge_names=span_edges,
        raw_graph_gaps=project_raw_graph_gap_rows(all_direct_span_gaps),
        ledger_gaps=project_declared_obligation_gap_rows(dependent_gaps),
    )
    span_raw_payload = {
        **raw_payload,
        "gaps": all_direct_span_gaps,
        "jobs_considered": len(span_edges),
        "total_delta": sum(float(gap.get("delta") or 0.0) for gap in all_direct_span_gaps),
        "converged": not all_direct_span_gaps,
    }
    refined_payload = enrich_gap_snapshot(
        workspace_root=app.config.workspace_root,
        stream=app.stream,
        workflow_version=resolved_scope.workflow_version,
        raw_gap_payload=span_raw_payload,
        runtime_config=app.config.runtime_config,
        publish=False,
    )
    summary = aggregate_edge_gap_truth(canonical_gaps)
    summary_payload = summary.to_dict()

    result = {
        "analysis_kind": "odd_sdlc.span_gap_analysis",
        "span": {
            "from_edge": from_edge,
            "to_edge": to_edge,
            "selected_edges": span_edges,
            "zoom": zoom,
            "include_dependent": include_dependent,
        },
        "gaps": [gap.to_dict() for gap in canonical_gaps],
        "graph_view": {
            "jobs_considered": len(span_edges),
            "total_delta": span_raw_payload["total_delta"],
            "converged": span_raw_payload["converged"],
            "gaps": all_direct_span_gaps,
        },
        "refined_view": refined_payload,
        "summary": {
            **summary_payload,
            "span_converged": summary.converged,
            "gap_count": len(canonical_gaps),
        },
    }
    result["selected_view"] = result["summary" if zoom == "combined" else ("graph_view" if zoom == "coarse" else "refined_view")]
    return result
