# odd_sdlc Requirement Closure Carrier And Projection Boundary

**Status**: Active
**Date**: 2026-04-22
**Implements**: `T-020`, `REQ-F-ODDSDLC-029`, `REQ-F-ODDSDLC-030`, `REQ-F-ODDSDLC-031`, `REQ-F-ODDSDLC-035`
**Governed By**: `specification_methodology/specification/standards/DESIGN_MODULE_METHOD.md`
**Derives From**: `build_tenants/python/design/SOFTWARE_DOMAIN_BUILDOUT.md`, `build_tenants/python/design/HOMEOSTATIC_GAP_TRIAGE_AND_INTENT_RENEWAL.md`, `build_tenants/python/design/GAP_ANALYSIS_DOSSIER.md`, `build_tenants/python/design/QUERY_PLUGIN_CONTRACT.md`

## Position

`odd_sdlc` adopts the design-module method for the requirement-closure,
traceability, gap, query, and prompt/report boundary.

Within this boundary, requirement identity, requirement carry, fulfillment, and
declared-obligation closure must move through one carrier-and-projection stack.

This design rejects:

- helper-owned rescans after the carrier already exists
- query or report helpers that silently rebuild current truth from the workspace
- gap or dossier consumers that decide closure from ad hoc dict merges
- compatibility facades that preserve the old authority path behind a new name

The goal of the split is not "smaller files."

The goal is one authoritative semantic path that downstream readers project
from without inventing a second closure engine.

## Boundary Taxonomy

This boundary is governed by the following design-module roles.

### Carrier Modules

- `traceability_index.py`
  - `RequirementTraceabilityIndex`
- `requirement_closure.py`
  - published requirement-closure register read model

Carrier modules own typed source truth and published read-model truth.

They do not own downstream operator prose, dossier wording, or app orchestration.

### Semantic Kernel Modules

- `requirement_closure.py`
  - requirement-closure register build
  - declared-obligation gap projection
- `span_analysis.py`
  - typed graph-gap projection
  - typed declared-obligation projection
  - canonical edge-gap projection
  - aggregate edge-gap truth summary

Semantic kernels transform admitted carriers into typed projections.

They do not perform workspace publication while deciding the semantic law.

### Projection Modules

- `query.py`
- `traceability_report.py`
- `gap_dossier.py`

Projection modules render admitted carrier truth for read or review surfaces.

They must not rescan the workspace or recompute closure semantics.

### Effect Shell And Publication Modules

- `analysis.py`
- publication helpers inside `requirement_closure.py`
- publication helpers inside `gap_dossier.py`

Effect shells write current runtime surfaces, prompt contexts, or dossier
artifacts from already-admitted carriers and projections.

### Binding And Adapter Modules

- `app.py`
- `fd_checks.py`
- `repair_frontier.py`

Binding and adapter modules may select and pass the lawful carrier or
projection. They must not become a second semantic center.

## Authoritative Path

The lawful source-to-projection path is:

1. build `RequirementTraceabilityIndex` from admitted workspace authority
2. build the requirement-closure register from that prebuilt index
3. project declared-obligation gaps from that same carrier family
4. project graph gaps into typed graph carriers
5. combine graph and declared-obligation truth through one canonical
   edge-gap projection boundary
6. serialize JSON or markdown only at the read-model or operator boundary

Any path that skips back to raw workspace scans after step 1 is a bridge to the
old authority path and is not lawful under this design.

## Prime-Law Consolidation

This boundary is now under the Prime Law from the design-module method.

New functions are lawful only when they introduce one irreducible boundary:

- source carrier admission
- semantic transformation
- publication effect
- downstream read-model projection

New wrappers are not lawful when they only:

- rename an old helper path
- shuttle dict payloads between modules
- preserve rescan capability under a new interface
- hide fallback reconstruction of requirement carry or closure

The current prime boundaries are:

- `build_requirement_traceability_index(...)`
- requirement-closure register build from a prebuilt index
- declared-obligation projection from the same carrier family
- `project_raw_graph_gap_rows(...)`
- `project_declared_obligation_gap_rows(...)`
- `canonical_edge_gaps(...)`
- `aggregate_edge_gap_truth(...)`
- published read-model loading for requirement closure

No additional helper layer should be introduced inside this boundary unless it
creates a new carrier, semantic transform, effect edge, or read-model
projection that cannot honestly be expressed through the existing stack.

## Fail-Closed Rule

Read surfaces in this boundary are projection consumers, not recovery engines.

That means:

- query surfaces load the published requirement-closure read model
- prompt/report builders consume an explicit register payload
- missing or stale publication yields an explicit unavailable projection
- no query, prompt, dossier, or report surface rebuilds current truth on read

If the authoritative carrier or published read model is missing, the boundary
must stop at explicit unavailability rather than silently re-entering workspace
scans.

## Remaining Consolidation Surfaces

The split is not complete until the following downstream surfaces are fully
consolidated under the same prime boundaries.

### `gap_dossier.py`

`gap_dossier.py` must consume typed canonical edge-gap projections and the
aggregate truth summary as its semantic input.

Its remaining role is dossier projection and publication.

It must not treat open dict gap rows as the durable semantic format inside the
module.

### `analysis.refresh_analysis(...)`

`refresh_analysis(...)` must publish requirement-closure and gap/dossier truth
from the admitted carrier stack only.

It must not revive older helper-owned closure logic during refresh or
publication.

### `traceability_report.py`

`traceability_report.py` remains a pure projection module.

It is lawful only while it renders the register payload it is given and does
not reach back into workspace scans or helper-owned missing/unexpected logic.

### `repair_frontier.py`

Repair routing must consume the same requirement-closure and gap projections
used by F_D checks and dossier publication.

Repair prioritization is not a second closure engine.

### `app.py` and `query-domain`

`app.gaps(...)` and `query-domain` remain binding and serialization boundaries.

They may translate typed projections into outward JSON payloads, but they must
not recompute requirement carry, fulfillment, or closure semantics.

## Demotion Rule

`traceability.py` is compatibility-only.

It does not define current semantic law for requirement identity, requirement
closure, declared obligation, query-domain closure, or prompt/report truth.

Any runtime path that still needs it as live authority should be treated as a
design defect, not as acceptable compatibility.

## Closure Rule

This boundary is lawful only when:

- one source carrier owns requirement identity and closure inputs
- declared-obligation and canonical edge-gap truth are pure projections over
  that carrier family
- downstream query, dossier, prompt, report, and repair consumers read the same
  projections
- missing or stale publication fails closed instead of rebuilding from helper
  scans
- no controller, adapter, or public wrapper becomes the hidden semantic center

Until those conditions are true, this design remains active refactoring law and
not closure evidence.
