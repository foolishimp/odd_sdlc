# REVIEW: S-037 Traceability, Closure, And Gap Kernels

**Author**: Codex
**Date**: 2026-04-23T00:42:30Z
**Addresses**: S-037 Deliverable 2 for `traceability_index.py`, `requirement_closure.py`, and `span_analysis.py`
**Status**: Open

## Summary

This family carries the cleanest semantic kernels in odd_sdlc:

- [traceability_index.py](/Users/jim/src/apps/odd_sdlc/build_tenants/python/code/odd_sdlc/traceability_index.py:53)
- [requirement_closure.py](/Users/jim/src/apps/odd_sdlc/build_tenants/python/code/odd_sdlc/requirement_closure.py:656)
- [span_analysis.py](/Users/jim/src/apps/odd_sdlc/build_tenants/python/code/odd_sdlc/span_analysis.py:14)

The strongest module in the set is `span_analysis.py`. The riskiest is
`requirement_closure.py`, not because it duplicates truth, but because it is a
large hard-coded rule engine.

## Analysis

### File: `traceability_index.py`

Purpose: build the requirement-to-surface and requirement-to-code/test index
that all closure work depends on.

Role: carrier module plus semantic kernel.

Top-level semantic inventory:

- `build_requirement_traceability_index(...)` at [197](/Users/jim/src/apps/odd_sdlc/build_tenants/python/code/odd_sdlc/traceability_index.py:197)
- `traceability_source_scan(...)` at [225](/Users/jim/src/apps/odd_sdlc/build_tenants/python/code/odd_sdlc/traceability_index.py:225)
- `requirement_family_traceability_publication(...)` at [279](/Users/jim/src/apps/odd_sdlc/build_tenants/python/code/odd_sdlc/traceability_index.py:279)

Sequence: `traceability_source_scan(...)`

```mermaid
sequenceDiagram
    participant Caller
    participant Trace as traceability_index.py
    participant Files as workspace source files
    Caller->>Trace: traceability_source_scan(workspace)
    Trace->>Files: iterate code/test files under governed code root
    Trace->>Trace: collect tagged requirement ids and orphan files
    Trace-->>Caller: TraceabilitySourceScan
```

Sequence: `requirement_family_traceability_publication(...)`

```mermaid
sequenceDiagram
    participant Caller
    participant Trace as traceability_index.py
    participant Req as requirement surfaces
    participant Design as design references
    Caller->>Trace: requirement_family_traceability_publication(workspace)
    Trace->>Req: inspect current/generated requirement surfaces
    Trace->>Design: inspect authoring-design backlinks
    Trace->>Trace: classify family carry validity and missing backlinks
    Trace-->>Caller: RequirementFamilyTraceabilityPublication
```

Sequence: `build_requirement_traceability_index(...)`

```mermaid
sequenceDiagram
    participant Caller
    participant Trace as traceability_index.py
    Caller->>Trace: build_requirement_traceability_index(workspace)
    Trace->>Trace: traceability_source_scan(...)
    Trace->>Trace: requirement_family_traceability_publication(...)
    Trace->>Trace: gather authority/current/surface refs
    Trace-->>Caller: RequirementTraceabilityIndex
```

Fault-line categories:

- lawful and prime

Design judgment:

This file is strong. It exposes typed carriers and clear derived sets. It is a
good reference shape for the rest of odd_sdlc.

### File: `requirement_closure.py`

Purpose: turn the traceability index into requirement closure truth and declared
obligation gap truth.

Role: semantic kernel plus projection module.

Top-level semantic inventory:

- `build_requirement_closure_register(...)` at [656](/Users/jim/src/apps/odd_sdlc/build_tenants/python/code/odd_sdlc/requirement_closure.py:656)
- `current_requirement_executability_gap(...)` at [661](/Users/jim/src/apps/odd_sdlc/build_tenants/python/code/odd_sdlc/requirement_closure.py:661)
- `declared_requirement_edge_gap(...)` at [1037](/Users/jim/src/apps/odd_sdlc/build_tenants/python/code/odd_sdlc/requirement_closure.py:1037)
- `collect_declared_obligation_gaps(...)` at [1157](/Users/jim/src/apps/odd_sdlc/build_tenants/python/code/odd_sdlc/requirement_closure.py:1157)
- `build_requirement_closure_prompt_context(...)` at [1184](/Users/jim/src/apps/odd_sdlc/build_tenants/python/code/odd_sdlc/requirement_closure.py:1184)
- `load_requirement_closure_register_read_model(...)` at [1264](/Users/jim/src/apps/odd_sdlc/build_tenants/python/code/odd_sdlc/requirement_closure.py:1264)
- `require_published_requirement_closure_register(...)` at [1271](/Users/jim/src/apps/odd_sdlc/build_tenants/python/code/odd_sdlc/requirement_closure.py:1271)

Sequence: `build_requirement_closure_register(...)`

```mermaid
sequenceDiagram
    participant Caller
    participant Closure as requirement_closure.py
    participant Trace as traceability_index.py
    Caller->>Closure: build_requirement_closure_register(workspace)
    Closure->>Trace: build_requirement_traceability_index(...)
    Closure->>Closure: _build_requirement_closure_register_from_index(...)
    Closure-->>Caller: requirement closure register
```

Sequence: `current_requirement_executability_gap(...)`

```mermaid
sequenceDiagram
    participant Caller
    participant Closure as requirement_closure.py
    participant Trace as traceability_index.py
    Caller->>Closure: current_requirement_executability_gap(workspace)
    Closure->>Trace: build_requirement_traceability_index(...)
    Closure->>Closure: build closure register from index
    Closure->>Closure: derive expected vs extra requirement obligations
    Closure-->>Caller: requirement executability gap
```

Sequence: `declared_requirement_edge_gap(...)`

```mermaid
sequenceDiagram
    participant Caller
    participant Closure as requirement_closure.py
    participant Trace as traceability_index.py
    Caller->>Closure: declared_requirement_edge_gap(workspace,declaration,edge)
    Closure->>Trace: build_requirement_traceability_index(...)
    Closure->>Closure: derive expected ids, carried ids, extra ids
    Closure->>Closure: build obligation ledger views
    Closure-->>Caller: declared obligation gap
```

Sequence: `collect_declared_obligation_gaps(...)`

```mermaid
sequenceDiagram
    participant Caller
    participant Closure as requirement_closure.py
    Caller->>Closure: collect_declared_obligation_gaps(workspace,declarations_by_edge)
    loop each declared edge
        Closure->>Closure: obligation_gap_from_declaration(...)
    end
    Closure-->>Caller: declared obligation gap list
```

Sequence: `load_requirement_closure_register_read_model(...)`

```mermaid
sequenceDiagram
    participant Caller
    participant Closure as requirement_closure.py
    participant Disk as published requirement closure register
    Caller->>Closure: load_requirement_closure_register_read_model(workspace)
    Closure->>Disk: load_published_requirement_closure_register(...)
    alt published and current
        Closure-->>Caller: published register
    else unavailable
        Closure-->>Caller: unavailable projection
    end
```

Fault-line categories:

- lawful but over-coupled
- hidden semantic center

Design judgment:

This file is lawful to keep because requirement closure is one real semantic
boundary. The design weakness is hard-coded branching by fulfillment rule,
derivation rule, and evidence policy. That makes it harder to extend safely.
This is a prime candidate for future ADT-style tightening, not because the file
is too large, but because the kernel is rule-dense.

### File: `span_analysis.py`

Purpose: normalize graph gaps plus declared obligation gaps into one canonical
edge-gap carrier and one aggregate truth summary.

Role: carrier module plus semantic kernel.

Top-level semantic inventory:

- `parse_gap_scope_selector(...)` at [14](/Users/jim/src/apps/odd_sdlc/build_tenants/python/code/odd_sdlc/span_analysis.py:14)
- `capability_gap_entries(...)` at [39](/Users/jim/src/apps/odd_sdlc/build_tenants/python/code/odd_sdlc/span_analysis.py:39)
- `declared_obligation_specs(...)` at [98](/Users/jim/src/apps/odd_sdlc/build_tenants/python/code/odd_sdlc/span_analysis.py:98)
- `canonical_edge_gaps(...)` at [546](/Users/jim/src/apps/odd_sdlc/build_tenants/python/code/odd_sdlc/span_analysis.py:546)
- `aggregate_edge_gap_truth(...)` at [571](/Users/jim/src/apps/odd_sdlc/build_tenants/python/code/odd_sdlc/span_analysis.py:571)
- `span_gap_analysis(...)` at [651](/Users/jim/src/apps/odd_sdlc/build_tenants/python/code/odd_sdlc/span_analysis.py:651)

Sequence: `capability_gap_entries(...)`

```mermaid
sequenceDiagram
    participant Caller
    participant Span as span_analysis.py
    participant Cap as operational capability projection
    Caller->>Span: capability_gap_entries(workspace,edge_names?)
    Span->>Cap: load_or_build_operational_capability_projection(...)
    Span->>Span: emit synthetic graph gaps for undeclared capabilities
    Span-->>Caller: capability gap entries
```

Sequence: `declared_obligation_specs(...)`

```mermaid
sequenceDiagram
    participant Caller
    participant Span as span_analysis.py
    participant Module as GTL graph vectors
    Caller->>Span: declared_obligation_specs(app,edge_names?)
    Span->>Module: inspect vector declarations
    Span-->>Caller: declared obligation specs by edge
```

Sequence: `canonical_edge_gaps(...)`

```mermaid
sequenceDiagram
    participant Caller
    participant Span as span_analysis.py
    Caller->>Span: canonical_edge_gaps(raw_graph_gaps,ledger_gaps)
    Span->>Span: join graph rows and ledger rows by edge
    Span->>Span: choose graph-only or declared-obligation projection variant
    Span-->>Caller: canonical edge gaps
```

Sequence: `aggregate_edge_gap_truth(...)`

```mermaid
sequenceDiagram
    participant Caller
    participant Span as span_analysis.py
    Caller->>Span: aggregate_edge_gap_truth(canonical_gaps)
    Span->>Span: sum graph/carry/fulfillment totals
    Span->>Span: compute convergence flags and mixed truth classes
    Span-->>Caller: EdgeGapTruthSummary
```

Sequence: `span_gap_analysis(...)`

```mermaid
sequenceDiagram
    participant Caller
    participant Span as span_analysis.py
    participant App as odd_sdlc app/gaps sources
    Caller->>Span: span_gap_analysis(app,scope,from_edge,to_edge)
    Span->>App: parse scope + resolve active edge order
    Span->>App: gen_gaps(...) and enrich gap snapshot
    Span->>Span: build canonical edge gaps + summary
    Span-->>Caller: span zoom payload
```

Fault-line categories:

- lawful and prime

Design judgment:

`span_analysis.py` is the strongest typed kernel in the review set. If removed,
canonical edge-gap truth disappears. That stop is lawful. This is the shape the
more dict-heavy kernels should move toward when they next need real refactoring.

## Recommended Action

1. Preserve `traceability_index.py` and `span_analysis.py` as reference shapes.
2. Treat `requirement_closure.py` as a valid but rule-dense kernel. Tighten it
   only when a real typed rule family can be pulled out without proxy layers.
