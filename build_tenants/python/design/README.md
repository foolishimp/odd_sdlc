# odd_sdlc Tenant Design

Tenant-local design for `odd_sdlc` lives here.

Adopted common law:

- `build_tenants/common/design/ODD_SDLC_TRANSLATION.md`
- `build_tenants/common/design/adrs/ADR-002-graph-function-first-carrier-and-runtime-boundary.md`
- `build_tenants/common/design/adrs/ADR-004-standard-tenant-realization-topology.md`
- `build_tenants/common/design/adrs/ADR-005-bootstrap-asset-set-and-recursive-edge-contracts.md`

Tenant-local design law:

- `build_tenants/python/design/SOFTWARE_DOMAIN_BUILDOUT.md`
- `build_tenants/python/design/HOMEOSTATIC_GAP_TRIAGE_AND_INTENT_RENEWAL.md`
- `build_tenants/python/design/EXECUTION_CONTRACT_SOURCE_CARRIER.md`
- `build_tenants/python/design/GAP_ANALYSIS_DOSSIER.md`
- `build_tenants/python/design/PROMPT_CONTEXT_CARRIAGE.md`
- `build_tenants/python/design/QUERY_PLUGIN_CONTRACT.md`
- `build_tenants/python/design/START_TARGET_CATALOG_AND_ASSET_OWNERSHIP_INDEX.md`
- `build_tenants/python/design/TICKET_WORK_ITEM_REENTRY_ROUTING.md`
- `build_tenants/python/design/fp/README.md`

`SOFTWARE_DOMAIN_BUILDOUT.md` and
`HOMEOSTATIC_GAP_TRIAGE_AND_INTENT_RENEWAL.md` are the current operative
tenant-local design surfaces for `odd_sdlc`.

`EXECUTION_CONTRACT_SOURCE_CARRIER.md` defines the current upstream admitted
execution basis for prompt-bearing and review-bearing odd_sdlc work.

`GAP_ANALYSIS_DOSSIER.md` defines the current single-dossier review surface
derived from gap rows, triage artifacts, and analysis freshness.

`PROMPT_CONTEXT_CARRIAGE.md` defines the current ABG 3.2 prompt-bearing context
surface: odd_sdlc publishes admitted domain truth as declared GTL contexts, and
ABG owns the generic constructive prompt/manifest shape.

`QUERY_PLUGIN_CONTRACT.md` is the versioned query-surface contract derived from
that tenant-local design.

`START_TARGET_CATALOG_AND_ASSET_OWNERSHIP_INDEX.md` is the current target
resolution design surface for published `graph_function:` and `asset:` start
handles.

`TICKET_WORK_ITEM_REENTRY_ROUTING.md` is the ratified current routing contract
for triaged ticket/work-item intake. It defines how work-item handles extend
the existing `asset:` target family, how route contracts govern re-entry, and
how routed work-item execution remains visible in manifest/prompt provenance.

`build_tenants/python/design/fp/README.md` governs the active builder control
frames, including the deterministic repair-frontier law used by constructive
lanes and the shared generated-asset contract parity law used by constructor,
certification, and F_P prompt assembly.

The shared translation remains adopted common law only where it still provides
current cross-tenant truth. First-slice-only content does not remain active by
inertia.

## Traceability Convention

- Active requirement families publish `**Carries Forward From**:` and
  `**Authoring Design**:` in their family header.
- Ratified design surfaces reciprocate through `**Implements**:` requirement
  identifiers and `**Derives From**:` references to the governing requirement
  families or upstream design inputs.
- A requirement/design pair is not published traceability by implication. The
  requirement-side and design-side references must both exist in live files.

This tenant now realizes the active software-domain package, with the retained
proving subset treated only as a bounded proof lane inside that package:

- URI-addressed bootstrap assets
- typed asset nodes
- named functions over the bootstrap asset graph
- ABG runtime over the first graph-function call
- a versioned ODD query plugin contract for UI composition
- a tenant-local software-domain build-out over the full SDLC lifecycle
- a tenant-local homeostatic reverse path over observation, triage, route, and
  constitutional repricing
