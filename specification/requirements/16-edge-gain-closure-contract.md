# Edge Gain And Closure Contract Requirements

**Family**: REQ-F-ODDSDLC-063..067
**Status**: Active
**Category**: Governance, Capability, Verification
**Carries Forward From**:
- `.ai-workspace/comments/codex/20260513T035126Z_data_mapper_test35_vs_ts_followup.md`
- `.ai-workspace/tickets/active/T-164-declare-per-edge-gain-and-closure-functions-for-sdlc-traversals.md`
- `/Users/jim/src/apps/abiogenesis/.ai-workspace/tickets/completed/T-131-declare-gtl-edge-assurance-contract-for-fp-gain-and-close.md`
- `/Users/jim/src/apps/abiogenesis/.ai-workspace/tickets/completed/T-132-prove-installed-gtl-edge-assurance-with-three-chain-live-sandbox.md`
**Authoring Design**:
- `build_tenants/typescript/design/ODD_SDLC_TYPESCRIPT_EDGE_GAIN_CLOSURE_CONTRACT.md`

This family defines the product-owned edge assurance contract for `odd_sdlc`.
ABG owns traversal substrate truth. `odd_sdlc` owns software-domain gain,
evidence admission, metric, closure, residual-pressure, and composition
semantics for SDLC typed vector traversals.

### REQ-F-ODDSDLC-063 — every published vector is classified in an assurance matrix

The active `odd_sdlc` graph publication shall expose one machine-readable edge
assurance matrix row for every published typed graph vector.

**Acceptance Criteria**:
- AC-1: every published vector is classified as `close_capable`,
  `library_only`, `projection_only`, or `no_close`
- AC-2: every `close_capable` vector has exactly one edge assurance contract
  row
- AC-3: every graph overlay-selected vector resolves to a contract row before
  overlay construction can be considered valid
- AC-4: missing, duplicate, ambiguous, or unregistered rows fail closed with
  typed diagnostics
- AC-5: deterministic proof compares the matrix against materialized GTL/ABG
  graph-vector source and target boundaries

### REQ-F-ODDSDLC-064 — close-capable vectors declare gain and closure semantics

Every close-capable typed vector traversal shall declare the computation that
turns admitted evidence into edge gain, residual pressure, and closure state.

**Acceptance Criteria**:
- AC-1: the contract row declares edge identity, source asset set, target asset
  type, target outcome, transformation category, authority basis, obligation
  derivation, evidence policy, metric function, threshold policy, ledger inputs,
  closure function, residual-pressure function, composition role, and proof lane
- AC-2: the gain function consumes admitted evidence and ledger rows, not
  worker percent-complete, worker prose, artifact existence, manifest shape,
  route completion, or postflight success alone
- AC-3: the closure function closes only when required obligations meet their
  declared thresholds, required evidence is present, diagnostics are clear, and
  no required residual pressure remains
- AC-4: worker assessments are admissible evidence only under the edge evidence
  policy; they are not closure authority by themselves
- AC-5: deterministic optimizations may support admission, validation,
  folding, routing, or deterministic edge execution only when the edge contract
  declares their authority

### REQ-F-ODDSDLC-065 — compound traversal closure preserves intermediate pressure

Compound graph-function and overlay closure shall be a typed composition of
edge-local gains and closure decisions.

**Acceptance Criteria**:
- AC-1: compound gain is computed as a fold over edge gain rows, not as a
  route-level scalar status
- AC-2: compound close requires every required intermediate edge closure, final
  target closure, and absence of required residual pressure
- AC-3: residual pressure from an intermediate edge remains visible to the
  compound traversal, even when later edges produced artifacts
- AC-4: recomposed overlays reuse existing vector contract rows where the same
  vector is selected
- AC-5: specialized overlays that introduce direct or shortened vectors declare
  their own residual-pressure policy rather than silently inheriting full-route
  closure

### REQ-F-ODDSDLC-066 — runtime artifacts carry the selected contract identity

Installed execution shall carry the selected edge assurance contract through
handoff, evidence admission, ledgers, closure decisions, projections, archives,
and replay.

**Acceptance Criteria**:
- AC-1: handoff manifests record the selected edge contract ref and stable
  contract digest
- AC-2: admitted evidence rows and measuring ledgers record the contract ref
  under which the evidence was admitted
- AC-3: closure decisions record the gain function, close function, residual
  pressure, diagnostics, and contract digest used for the decision
- AC-4: query-domain and gaps projections expose contract identity and
  residual pressure as read models without becoming closure authority
- AC-5: replay reuses prior evidence only when workspace, graph vector, target
  binding, evidence policy, contract digest, and predecessor refs match

### REQ-F-ODDSDLC-067 — T-164 proof covers a three-edge assurance chain

The edge assurance contract shall be proven by deterministic and installed
sandbox proof over at least one three-edge SDLC chain.

**Acceptance Criteria**:
- AC-1: deterministic proof covers a chain with at least
  `requirements synthesis -> formal requirement syntax -> design encoding`
- AC-2: each edge in the chain exposes obligations, admitted evidence,
  measured gain, residual pressure, close decision, and composition state
- AC-3: the compound close fails when an intermediate edge has required
  residual pressure
- AC-4: installed sandbox proof uses the same installer and test-run archive
  surface as operator-facing installs
- AC-5: live proof, when enabled, archives handoff, ledger, closure,
  next-action, and assurance evidence for each edge
