# Implements: REQ-F-ODDSDLC-029
# Implements: REQ-F-ODDSDLC-030
# Implements: REQ-F-ODDSDLC-031
"""Compatibility facade for traceability callers.

Active implementation imports should use `traceability_index` for source
carrier reads and `requirement_closure` for closure/obligation projections.
This module remains only to preserve the public Python import surface while
T-020 removes traceability.py as a semantic center.
"""
from __future__ import annotations

from .requirement_closure import (
    REQUIREMENT_CLOSURE_PROMPT_CONTEXT_PATH,
    REQUIREMENT_CLOSURE_REGISTER_KIND,
    REQUIREMENT_CLOSURE_REGISTER_PATH,
    RequirementClosureUnavailableError,
    build_requirement_closure_prompt_context,
    build_requirement_closure_register,
    collect_declared_obligation_gaps,
    current_requirement_executability_gap,
    declared_requirement_edge_gap,
    load_requirement_closure_register_read_model,
    obligation_gap_from_declaration,
    refresh_requirement_closure_register,
    require_published_requirement_closure_register,
)
from .traceability_index import (
    RequirementFamilyTraceabilityPublication,
    RequirementTraceabilityIndex,
    TraceabilitySourceScan,
    build_requirement_traceability_index,
    requirement_family_traceability_publication,
    traceability_source_scan,
)

__all__ = [
    "REQUIREMENT_CLOSURE_PROMPT_CONTEXT_PATH",
    "REQUIREMENT_CLOSURE_REGISTER_KIND",
    "REQUIREMENT_CLOSURE_REGISTER_PATH",
    "RequirementClosureUnavailableError",
    "RequirementFamilyTraceabilityPublication",
    "RequirementTraceabilityIndex",
    "TraceabilitySourceScan",
    "build_requirement_closure_prompt_context",
    "build_requirement_closure_register",
    "build_requirement_traceability_index",
    "collect_declared_obligation_gaps",
    "current_requirement_executability_gap",
    "declared_requirement_edge_gap",
    "load_requirement_closure_register_read_model",
    "obligation_gap_from_declaration",
    "refresh_requirement_closure_register",
    "require_published_requirement_closure_register",
    "requirement_family_traceability_publication",
    "traceability_source_scan",
]
