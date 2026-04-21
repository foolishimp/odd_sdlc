# odd_sdlc Gap Analysis Dossier

**Status**: Active
**Implements**: REQ-F-ODDSDLC-035
**Derives From**: `build_tenants/python/design/HOMEOSTATIC_GAP_TRIAGE_AND_INTENT_RENEWAL.md`, `build_tenants/python/design/QUERY_PLUGIN_CONTRACT.md`

## Position

`odd_sdlc` already publishes current workspace state, analysis identity,
current triage, and operator gap rows.

That is enough for direct code access, but it is still too distributed for one
review surface.

This design publishes one edge-scoped gap-analysis dossier so operator review
and future prompt-bearing gap handling do not need to reconstruct the current
gap story from multiple partial read models.

## Source Truth

The dossier is derived from existing current truth:

- workspace state
- analysis manifest freshness
- current edge triage artifact
- canonical operator gap row

The dossier does not invent a second triage regime and it does not outrank the
underlying triage artifact.

## Published Surfaces

The active publication pair is:

- `.ai-workspace/runtime/odd_sdlc-gap-dossiers.json`
- `.ai-workspace/runtime/odd_sdlc-gap-dossiers.md`

The JSON register is the machine-readable current dossier surface.

The markdown context is the operator-facing review summary over the same
current dossiers.

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

`gap_truth` is the canonical current gap row, not a second score surface.

`evidence_bundle_refs` points back to the current triage artifact and
correlated event ids so dossier review remains replayable.

## Runtime Rule

`odd_sdlc gaps` and `query-domain` must consume the same dossier builder.

That means:

- operator gap rows and query-domain gap rows remain one current story
- dossier publication is not a side-channel beside those operator surfaces
- future prompt-bearing gap handling consumes the dossier rather than scraping
  multiple runtime files

## Closure Rule

This design is only behaving lawfully when:

- `gaps` and `query-domain` no longer reconstruct the edge story independently
- the dossier is sufficient for "why is this edge open" review
- the dossier remains derived from current gap, triage, and analysis truth
  rather than becoming a rival tracker
