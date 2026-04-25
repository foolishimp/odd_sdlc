# odd_sdlc Gap Analysis Dossier

**Status**: Active
**Implements**: REQ-F-ODDSDLC-035
**Derives From**: `build_tenants/python/design/HOMEOSTATIC_GAP_TRIAGE_AND_INTENT_RENEWAL.md`, `build_tenants/python/design/QUERY_PLUGIN_CONTRACT.md`, `build_tenants/python/design/REQUIREMENT_CLOSURE_CARRIER_AND_PROJECTION_BOUNDARY.md`

## Position

`odd_sdlc` already publishes current workspace state, analysis identity,
current triage, and operator gap rows.

That is enough for direct code access, but it is still too distributed for one
review surface.

This design publishes one edge-scoped gap-analysis dossier so operator review
and future prompt-bearing gap handling do not need to reconstruct the current
gap story from multiple partial read models.

Under the requirement-closure carrier boundary, the dossier is a downstream
projection over typed gap truth. It is not a second gap engine.

## Source Truth

The dossier is derived from existing current truth:

- workspace state
- analysis manifest freshness
- current edge triage artifact
- admitted execution-contract projection where present
- published requirement-closure read model
- canonical typed edge-gap projection and aggregate truth summary

The dossier does not invent a second triage regime and it does not outrank the
underlying triage artifact.

## Published Surfaces

The active publication pair is:

- `.ai-workspace/runtime/odd_sdlc-gap-dossiers.json`
- `.ai-workspace/runtime/odd_sdlc-gap-dossiers.md`

The JSON register is the machine-readable current dossier surface.

The markdown context is the operator-facing review summary over the same
current dossiers.

The public CLI default is a further operator projection over the published
dossier head. Bare `odd_sdlc gaps` binds `scope=workspace`, names the frontier,
classifies the blocker, and lists next lawful steps. That projection is not a
new carrier: it is derived from the same published dossier/read-model family.
The raw JSON register remains available through explicit `odd_sdlc gaps
--format json`.

## Dossier Shape

Each current dossier publishes:

- `edge`
- `analysis_current`
- `analysis_fingerprint`
- `current_work_key`
- `gap_truth`
- `observation`
- `triage`
- `route_binding`
- `constitutional_proposal`
- `resumption_trigger`
- `evidence_bundle_refs`

`gap_truth` is the canonical current gap projection, not a second score
surface.

`evidence_bundle_refs` points back to the current triage artifact and
correlated event ids so dossier review remains replayable.

## Runtime Rule

`odd_sdlc gaps`, `query-domain`, and public `start --target next` must consume
the same dossier builder.

That means:

- operator gap rows and query-domain gap rows remain one current story
- public `start --target next` does not invent a rival head-edge authority path
- dossier publication is not a side-channel beside those operator surfaces
- future prompt-bearing gap handling consumes the dossier rather than scraping
  multiple runtime files
- dossier build consumes canonical typed edge-gap projections and the published
  requirement-closure read model before any outward dict or markdown rendering
- missing or stale published requirement-closure truth yields an explicit
  unavailable read surface rather than a rescan of workspace authority

## Closure Rule

This design is only behaving lawfully when:

- `gaps`, `query-domain`, and public `start --target next` no longer
  reconstruct the edge story independently
- the dossier is sufficient for "why is this edge open" review
- the dossier remains derived from current gap, triage, and analysis truth
  rather than becoming a rival tracker
- open dict payloads exist only at the outward JSON or markdown boundary, not
  as the dossier module's internal semantic format
