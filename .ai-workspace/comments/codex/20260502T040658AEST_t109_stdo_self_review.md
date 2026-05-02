# T-109 STDO Self Review

Date: 2026-05-02
Reviewer: Codex
Scope: T-109 traversal-ledger implementation, ledger ownership, ABG/odd_sdlc
boundary, FP discipline, legacy closure paths.

## Verdict

Do not close T-109 yet.

The implementation is a useful step, but it is not yet a clean STDO closure.
The ledgers are currently written by the odd_sdlc installed operator, which is
the right domain owner for SDLC fulfillment meaning. ABG still owns traversal
iteration. The blocking problem is that the newly written edge ledger is not yet
the value consumed by ABG continuation. It is mostly an archive/project-ledger
sidecar beside existing postflight/assurance/gap behavior.

## Findings

### High: Edge ledger is written, but it is not yet the operative closure authority.

`writeEdgeFulfillmentLedger(...)` constructs and archives
`edge_fulfillment_ledger.json`, then appends `edge_fulfillment_ledger_admitted`
and `closure_decision` project-construction entries. It returns `void`.

The ABG-facing dispatch result is still assembled separately from postflight,
assurance, hook, and `fulfillmentArtifact(...)` branches. The success path
returns a fulfilled artifact from `postflight.evidenceRefs`, not from the edge
ledger or its `lawfulNextAction`.

Refs:

- `build_tenants/typescript/code/src/operator/installed_operator.ts:356`
- `build_tenants/typescript/code/src/operator/installed_operator.ts:400`
- `build_tenants/typescript/code/src/operator/installed_operator.ts:416`
- `build_tenants/typescript/code/src/operator/installed_operator.ts:2045`
- `build_tenants/typescript/code/src/operator/installed_operator.ts:2070`
- `build_tenants/typescript/code/src/operator/installed_operator.ts:2087`

Design mismatch:

- `build_tenants/typescript/design/ODD_SDLC_TYPESCRIPT_TRAVERSAL_LEDGER_SOLUTION.md:668`
- `build_tenants/typescript/design/ODD_SDLC_TYPESCRIPT_TRAVERSAL_LEDGER_SOLUTION.md:672`
- `build_tenants/typescript/design/ODD_SDLC_TYPESCRIPT_TRAVERSAL_LEDGER_SOLUTION.md:745`
- `build_tenants/typescript/design/ODD_SDLC_TYPESCRIPT_TRAVERSAL_LEDGER_SOLUTION.md:751`

STDO read: this violates "one truth." The edge ledger is not yet the closure
surface; it is emitted after the old surfaces decide the dispatch outcome.

### High: Framework-generated requirement fulfillment now overcorrects from lexical to too-permissive material observation.

`postTransformObligationAssessments(...)` marks every requirement obligation as
fulfilled if the declared output file exists and is non-empty. That removes the
bad lexical ID check, but it does not yet prove material representation of each
requirement.

The assurance gate then treats fulfilled assessments as requirement closure
truth through `requirementClosureRegisterFromObligations(...)` and
`deriveRequirementFulfillmentAssuranceLedger(...)`.

Refs:

- `build_tenants/typescript/code/src/operator/handoff.ts:2278`
- `build_tenants/typescript/code/src/operator/handoff.ts:2287`
- `build_tenants/typescript/code/src/operator/handoff.ts:2294`
- `build_tenants/typescript/code/src/operator/assurance_gate.ts:289`
- `build_tenants/typescript/code/src/operator/assurance_gate.ts:291`
- `build_tenants/typescript/code/src/operator/assurance_gate.ts:476`
- `build_tenants/typescript/code/src/assurance/requirement_fulfillment.ts:71`

STDO read: "behavioral/material, not lexical" does not mean "any non-empty
artifact satisfies every requirement." This can falsely close requirement
obligations and is a closure-authority defect.

### High: Requirement-resolution projection is still sourced from worker/report assessments, not admitted edge ledgers.

T-109 calls for requirement resolution to be a projection over admitted edge
fulfillment ledgers. The implemented code still derives the requirement closure
register from `manifest + workerReport` inside the assurance gate. I found no
production `SdlcRequirementResolutionProjection` carrier or derivation from
`SdlcEdgeFulfillmentLedger`.

Refs:

- `build_tenants/typescript/code/src/operator/assurance_gate.ts:272`
- `build_tenants/typescript/code/src/operator/assurance_gate.ts:288`
- `build_tenants/typescript/code/src/operator/assurance_gate.ts:326`
- `build_tenants/typescript/code/src/operator/assurance_gate.ts:476`
- `build_tenants/typescript/code/src/operator/traversal_ledger.ts:154`
- `build_tenants/typescript/design/ODD_SDLC_TYPESCRIPT_TRAVERSAL_LEDGER_SOLUTION.md:691`

STDO read: this leaves two truth lines: edge ledger closure truth and legacy
requirement closure derived from worker/report facts.

### Medium-high: The retry allowlist exists as a pure function but production retry still uses legacy heuristics.

`classifyRetry(...)` encodes the typed allowlist, but production silent-worker
retry still flows through `silentInactivitySharpenedRetryAvailable(...)` and
`priorSilentInactivityCount(...)`. The production path checks execution shards
or prior dossier shape, not the typed allowlist with retry budget and
semantic-gap-preserved inputs.

Refs:

- `build_tenants/typescript/code/src/operator/traversal_ledger.ts:523`
- `build_tenants/typescript/code/src/operator/installed_operator.ts:1108`
- `build_tenants/typescript/code/src/operator/installed_operator.ts:1142`
- `build_tenants/typescript/code/src/operator/installed_operator.ts:1179`

STDO read: this is a legacy code path. The pure FP rule exists, but the runtime
decision does not consume it.

### Medium-high: The traversal ledger module mixes pure algebra with filesystem and clock effects.

The design requires pure projection/closure functions with effects isolated at
the adapter boundary. `traversal_ledger.ts` contains the pure carrier algebra,
but also imports `node:fs`, reads existing ledger files, calls `new Date()`, and
appends JSONL entries.

Refs:

- `build_tenants/typescript/code/src/operator/traversal_ledger.ts:4`
- `build_tenants/typescript/code/src/operator/traversal_ledger.ts:658`
- `build_tenants/typescript/code/src/operator/traversal_ledger.ts:666`
- `build_tenants/typescript/code/src/operator/traversal_ledger.ts:726`
- `build_tenants/typescript/code/src/operator/traversal_ledger.ts:742`
- `build_tenants/typescript/code/src/operator/traversal_ledger.ts:745`
- `build_tenants/typescript/design/ODD_SDLC_TYPESCRIPT_TRAVERSAL_LEDGER_SOLUTION.md:75`
- `build_tenants/typescript/design/ODD_SDLC_TYPESCRIPT_TRAVERSAL_LEDGER_SOLUTION.md:85`

STDO read: this is not clean FP structure yet. The write boundary should be in
an adapter/event-store module. The domain module should stay pure.

### Medium: The project construction ledger is not yet a strong authoritative audit chain.

`entryWithDigest(...)` hashes only sequence, event time, entry kind, graph
function, edge, vector, and payload refs. It does not commit to parent refs,
basis refs, reason codes, supersedes refs, work key, spec hash, actor/process
refs, or full payload. `projectConstructionLedger(...)` checks duplicate
sequence and sorts, but does not validate entry digests or parent linkage.

Refs:

- `build_tenants/typescript/code/src/operator/traversal_ledger.ts:551`
- `build_tenants/typescript/code/src/operator/traversal_ledger.ts:557`
- `build_tenants/typescript/code/src/operator/traversal_ledger.ts:690`
- `build_tenants/typescript/code/src/operator/traversal_ledger.ts:695`
- `build_tenants/typescript/code/src/operator/traversal_ledger.ts:705`
- `build_tenants/typescript/code/src/operator/traversal_ledger.ts:726`

STDO read: this is append-only in practice, but not yet an authoritative
digestable lineage chain in the strong sense the ticket asks for.

### Medium: Edge-ledger refs are thin and lack digest admission.

The edge ledger currently stores `manifestRef` as `archiveRoot`, output refs as
absolute paths, materialized file refs as absolute paths, and no per-ref digests
for manifest, traversal obligation context, output, materialized files, or
process files.

Refs:

- `build_tenants/typescript/code/src/operator/traversal_ledger.ts:462`
- `build_tenants/typescript/code/src/operator/traversal_ledger.ts:465`
- `build_tenants/typescript/code/src/operator/traversal_ledger.ts:485`
- `build_tenants/typescript/code/src/operator/traversal_ledger.ts:486`
- `build_tenants/typescript/code/src/operator/traversal_ledger.ts:487`

STDO read: this weakens replayability and portability. It also means the ledger
does not itself admit evidence integrity; it points at evidence loosely.

### Medium: Active design reconciliation is incomplete.

The canonical design says older design docs must not restate competing closure,
retry, ledger, or lineage law. `ODD_SDLC_TYPESCRIPT_TRAVERSAL_ASSURANCE_INTEGRATION.md`
still says the closure path is `SdlcTraversalRequirementSatisfaction -> close |
retry_same_edge | blocked | reprice_required`, and it does not reference the
canonical T-109 edge-ledger solution in its authority block.

Refs:

- `build_tenants/typescript/design/ODD_SDLC_TYPESCRIPT_TRAVERSAL_ASSURANCE_INTEGRATION.md:21`
- `build_tenants/typescript/design/ODD_SDLC_TYPESCRIPT_TRAVERSAL_ASSURANCE_INTEGRATION.md:25`
- `build_tenants/typescript/design/ODD_SDLC_TYPESCRIPT_TRAVERSAL_ASSURANCE_INTEGRATION.md:74`
- `build_tenants/typescript/design/ODD_SDLC_TYPESCRIPT_TRAVERSAL_ASSURANCE_INTEGRATION.md:82`
- `build_tenants/typescript/design/ODD_SDLC_TYPESCRIPT_TRAVERSAL_LEDGER_SOLUTION.md:976`
- `build_tenants/typescript/design/ODD_SDLC_TYPESCRIPT_TRAVERSAL_LEDGER_SOLUTION.md:991`

STDO read: design-method closure is still blocked. The implementation ran
ahead of reconciliation.

## Ownership Assessment

Who owns the ledgers:

- ABG owns graph traversal, frames, retry/continuation events, process actor
  facts, and iteration.
- odd_sdlc owns SDLC domain meaning: obligation mapping, worker evidence
  admission, assurance interpretation, edge fulfillment ledgers, and
  requirement-resolution projection.

Who currently writes them:

- The odd_sdlc installed operator writes the project construction ledger and
  edge fulfillment ledger from inside the F_P dispatch plugin.
- ABG does not write these ledgers.

That ownership is broadly correct, but incomplete. The operator writes the
ledger; ABG still receives continuation truth through legacy dispatch artifacts
and gap dossiers rather than through a ledger-derived result carrier.

## FP Assessment

The implementation has FP elements:

- closed-ish TypeScript sum types
- immutable `Object.freeze(...)` carriers
- pure `edgeConverged(...)`
- pure `constructEdgeFulfillmentLedger(...)`
- pure `classifyRetry(...)`
- result values for projection failures

It is not yet a clean FP solution:

- effectful ledger append lives in the same module as pure algebra
- production retry does not consume the pure retry classifier
- the edge ledger is written as evidence but not used as the continuation
  decision value
- requirement resolution still derives from mutable report-time state rather
  than a pure projection over admitted edge ledgers

## Required Next Actions

1. Make `writeEdgeFulfillmentLedger(...)` return the ledger and make every
   ABG-facing `FpDispatchOutcome` derive from the ledger's `lawfulNextAction`
   and evidence refs.
2. Move filesystem/clock append logic out of `traversal_ledger.ts` into an
   operator/event-store adapter; keep `traversal_ledger.ts` pure.
3. Replace `silentInactivitySharpenedRetryAvailable(...)` with production use
   of `classifyRetry(...)` using explicit retry budget and semantic-gap state.
4. Add `SdlcRequirementResolutionProjection` as a projection over admitted edge
   ledgers and stop deriving requirement closure directly from worker reports.
5. Replace blanket non-empty-output requirement fulfillment with per-obligation
   material observation rows. Lexical IDs are not required, but every row must
   carry a material basis.
6. Strengthen project ledger digests so each entry commits to full entry
   content and parent refs; validate chain projection fail-closed.
7. Add digest-bearing file refs to edge ledger evidence fields.
8. Reconcile active design docs so the T-109 solution is the only closure-law
   surface.
9. Add an installed-operator regression proving the ABG dispatch result is
   derived from the edge fulfillment ledger, not from legacy postflight or
   assurance paths.

## Closure Read

T-109 core implementation evidence is useful, but it should remain active.
Under STDO, this is not "tech debt"; it is unresolved design-method closure and
one-truth closure authority drift.
