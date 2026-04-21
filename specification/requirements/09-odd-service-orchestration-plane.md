# odd_service Orchestration Plane Requirements

**Family**: REQ-F-ODDSVC-*
**Status**: Active
**Category**: Capability
**Carries Forward From**: None
**Authoring Design**: None

This family defines the `odd_service` incubation line inside `odd_sdlc`.

`odd_service` is the enduring orchestration plane proposed above `odd_sdlc`.
It is not a second runtime. It remains subordinate to GTL, ABG, and the
published `odd_sdlc` domain package.

### REQ-F-ODDSVC-001 — odd_service is incubated as an odd_sdlc product line before standalone promotion

`odd_service` begins as an incubating product line inside `odd_sdlc` so its
interfaces, proofs, and boundaries can be stabilized against the live
`odd_sdlc` domain and ABG runtime before promotion to a separate project.

**Acceptance Criteria**:
- AC-1: `odd_sdlc` publishes the `odd_service` carve-out as a deliberate
  product line rather than as an ad hoc utility or UI helper
- AC-2: the incubation path preserves a clean future promotion path to its own
  project root without changing the governing service/domain/runtime boundary
- AC-3: `odd_service` does not claim standalone runtime authority while it is
  still an incubating line under `odd_sdlc`

### REQ-F-ODDSVC-002 — odd_service owns orchestration and worker-session authority, not runtime truth

`odd_service` owns session lifecycle, worker registry, transport execution, and
dispatch routing, but it does not become the authority for runs, events,
convergence, lineage, or provenance.

**Acceptance Criteria**:
- AC-1: ABG remains the sole authority for runtime truth such as runs, graph
  calls, continuation state, convergence, and emitted provenance events
- AC-2: service-local state is limited to orchestration concerns such as
  session identity, client subscriptions, worker assignments, and observation
  history
- AC-3: `odd_service` does not maintain a rival convergence model, event store,
  or runtime projection layer that contradicts ABG

### REQ-F-ODDSVC-003 — odd_service wraps the existing local execution path rather than redefining execution law

`odd_service` must wrap the same GTL/ABG and `odd_sdlc` execution path used by
direct local CLI operation.

**Acceptance Criteria**:
- AC-1: direct local execution through the published `odd_sdlc start --scope
  workspace --target next|graph_function:<published_handle>|asset:<published_handle> --until converged`
  operator contract remains valid without the service; any lower-level
  substrate command path is internal runtime realization, not co-equal
  product/operator truth
- AC-2: local service execution drives the same underlying runtime contract and
  does not create a parallel traversal loop with different semantics
- AC-3: resumability, pending F_P dispatch, and assessed-result ingestion
  remain ABG-governed even when the service is the client-facing coordinator

### REQ-F-ODDSVC-004 — odd_service exposes peer client surfaces for CLI and browser clients

`odd_service` must expose a stable client surface for CLI agents and for
browser clients so they can observe and coordinate the same run without
competing ownership.

**Acceptance Criteria**:
- AC-1: the service exposes an MCP-oriented surface for CLI agents
- AC-2: the service exposes an HTTP/SSE-oriented surface for browser clients
- AC-3: lifecycle constructors are workspace-scoped and continuation or
  observation operations are run-scoped
- AC-4: the same run can be started from one client surface and observed or
  resumed from another without splitting authority

### REQ-F-ODDSVC-005 — odd_service provides named worker registration and contract-driven dispatch routing

`odd_service` must provide a worker registry over local or remote workers and
route F_P dispatch according to declared domain or policy contract rather than
ad hoc client preference.

**Acceptance Criteria**:
- AC-1: the service can register named workers with stable identity across
  dispatch cycles
- AC-2: the service can route one edge to one worker or fan out one contract to
  multiple workers when a harness or policy requires it
- AC-3: worker selection for consensus or similar higher-order harnesses is
  driven by harness/policy contract rather than hidden UI rules or prompt
  folklore
- AC-4: worker identity can be surfaced back into ABG provenance during
  dispatch

### REQ-F-ODDSVC-006 — odd_service keeps conversation history as observation state, not runtime truth

`odd_service` may retain durable worker conversation history, but that history
is an observation and debugging aid rather than constitutional runtime truth.

**Acceptance Criteria**:
- AC-1: worker conversation history is kept separate from ABG event truth
- AC-2: no convergence, closure, or runtime authority depends on the presence
  of service-local conversation history
- AC-3: operator or UI inspection of worker history does not replace or outrank
  ABG events and projections

### REQ-F-ODDSVC-007 — remote transport requires explicit workspace snapshot provenance and fail-closed verification

If `odd_service` dispatches work to a remote worker or remote workspace, it
must record the workspace snapshot contract and fail closed unless that
contract is verified on ingest.

**Acceptance Criteria**:
- AC-1: remote dispatch records a workspace snapshot identifier as part of the
  dispatch provenance surface
- AC-2: result ingest records a verification fact for snapshot match, mismatch,
  or missing verification
- AC-3: snapshot mismatch or absent verification fails closed and prevents the
  result from being treated as lawful runtime truth
- AC-4: remote transport does not rely on hand-wavy trust that the remote
  workspace “probably matched” the dispatched source state

### REQ-F-ODDSVC-008 — odd_manager consumes odd_service as a client, not as a competing session owner

`odd_manager` must consume `odd_service` through client APIs rather than
remaining a hidden owner of session lifecycle, worker lifecycle, or dispatch.

**Acceptance Criteria**:
- AC-1: browser state renders service-backed runs, workers, and gate surfaces
  rather than inventing browser-local session authority
- AC-2: `gterm` or similar terminal panes may remain as direct operator
  affordances, but they do not become the authoritative session controller
- AC-3: a run driven from CLI can be observed and acted on from `odd_manager`
  through the same service-backed truth

### REQ-F-ODDSVC-009 — consensus is the first serious proving lane for odd_service

The first serious proving lane for `odd_service` is the existing reusable
consensus harness because it exercises named workers, async fan-out, resumed
observation, and contract-driven routing.

**Acceptance Criteria**:
- AC-1: the first service proof can drive a real consensus harness over the
  published `odd_sdlc` domain package
- AC-2: proof includes at least two named workers and ordinary ABG provenance
  for the resulting review dispatch
- AC-3: browser and CLI clients can observe the same consensus run without
  split authority
- AC-4: the proving lane does not require a special-case consensus engine
  outside GTL, ABG, and the service boundary
