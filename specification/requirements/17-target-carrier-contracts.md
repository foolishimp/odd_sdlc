# SDLC Target Carrier Contract Requirements

**Family**: REQ-F-ODDSDLC-069..073
**Status**: Active
**Category**: Governance, Runtime, Verification
**Carries Forward From**:
- `.ai-workspace/comments/codex/20260516T024852Z_STRATEGY_fp_fd_eventual_consistency_steel_thread_execution.md`
- `.ai-workspace/tickets/active/T-170-implement-authority-placement-strategy-and-repair-fd-overreach.md`
- `.ai-workspace/tickets/completed/T-169-implement-gtl-target-carrier-contracts-for-sdlc-vector-outputs.md`
- `.ai-workspace/tickets/completed/T-164-declare-per-edge-gain-and-closure-functions-for-sdlc-traversals.md`
- `.ai-workspace/tickets/completed/T-168-build-design-consumer-test-pipeline-for-co-affirming-implementation.md`
- `/Users/jim/src/apps/abiogenesis/.ai-workspace/tickets/completed/T-133-declare-gtl-target-carrier-contracts-for-graph-vector-outputs.md`
**Authoring Design**:
- `build_tenants/typescript/design/ODD_SDLC_TYPESCRIPT_TARGET_CARRIER_CONTRACTS.md`

This family defines how `odd_sdlc.TS` consumes the ABIogenesis target carrier
contract surface. ABG owns the generic GTL target carrier machinery. `odd_sdlc`
owns the product-specific output carrier meaning for SDLC graph-vector outputs.

### REQ-F-ODDSDLC-069 - close-capable vector outputs declare target carrier contracts

Every close-capable TypeScript SDLC graph-vector output shall have an effective
GTL target carrier contract binding.

**Acceptance Criteria**:
- AC-1: every published close-capable vector resolves one target carrier
  binding
- AC-2: the effective binding is never null
- AC-3: product-specific SDLC output rows are declared on graph-vector
  declarations where SDLC output shape matters
- AC-4: generic ABI defaults are accepted only as visible config-backed
  defaults, not as hidden code constants
- AC-5: missing, duplicate, malformed, or target/schema-mismatched bindings fail
  closed with typed diagnostics

### REQ-F-ODDSDLC-070 - target carrier contracts admit output envelope evidence

SDLC edge assurance shall consume target carrier admission as output envelope
and identity evidence. Target carrier admission preserves the selected contract
ref, digest, target node, target schema, fixed protocol fields, and worker
fillable payload boundary. It does not decide SDLC content completeness,
requirement fulfillment, implementation correctness, test adequacy, or product
close.

**Acceptance Criteria**:
- AC-1: edge assurance read models expose the selected target carrier contract
  ref and digest
- AC-2: edge evidence admission can carry admitted, rejected, missing, or
  not-required target carrier admission truth without losing the selected
  carrier identity
- AC-3: missing or rejected carrier admission blocks carrier evidence
  admission and preserves protocol pressure; it is not a product/content
  completeness verdict
- AC-4: a well-formed carrier with weak or incomplete SDLC content is admitted
  structurally and routed to F_P/content pressure or execution evidence
- AC-5: compound traversal gain preserves target carrier pressure from
  intermediate edges

### REQ-F-ODDSDLC-071 - worker handoff and result admission project the carrier contract

Worker handoff packages and returned worker output admission shall use the same
selected target carrier contract.

**Acceptance Criteria**:
- AC-1: handoff manifests record target carrier contract ref and digest
- AC-2: handoff manifests project carrier kind, nested payload path, required
  fields, fixed protocol fields, worker-fillable fields, and literal domains
- AC-3: worker result candidates are validated against the selected ABI target
  carrier binding
- AC-4: missing nested payload, wrong kind literal, missing required field,
  fixed-field mutation, and stale digest each reject the candidate
- AC-5: rejected carriers produce typed non-close diagnostics visible in
  archives and read models
- AC-6: review-grade fulfillment findings that bind an obligation to realized
  product output shall carry ABIogenesis `GtlContractFulfillmentBinding` truth,
  not an SDLC-local lookalike binding shape

### REQ-F-ODDSDLC-072 - query, gaps, archives, and replay carry carrier identity

Operator-facing read models and replay evidence shall preserve selected target
carrier contract identity.

**Acceptance Criteria**:
- AC-1: query-domain exposes a read-only target carrier matrix
- AC-2: gaps and gap dossiers expose the current edge target carrier ref and
  digest
- AC-3: ledgers and closure decisions record target carrier admission refs when
  available
- AC-4: replay reuse requires matching graph vector, target carrier contract
  ref, target carrier digest, and edge assurance digest
- AC-5: read models remain evidence/projection surfaces and do not choose the
  next traversal

### REQ-F-ODDSDLC-073 - tests derive carrier cases from the same contract assets

The design-consumer test pipeline shall consume target carrier contracts when
building implementation and test proof assets.

**Acceptance Criteria**:
- AC-1: deterministic tests derive positive and negative carrier candidates
  from the same contract asset consumed by implementation
- AC-2: test design, component test, test execution result, and test run
  archive outputs have target carrier contract rows; test module, test data,
  and expected-result truth are rows inside the test design carrier
- AC-3: UAT-derived integration tests preserve target carrier contract refs for
  their generated test assets and execution evidence
- AC-4: product convergence cannot hide missing, malformed, or rejected test
  output carrier pressure, but carrier pressure remains envelope/evidence
  pressure rather than a content-completeness verdict
- AC-5: live or live-equivalent proof archives target carrier refs and digests
  through handoff, admission, closure, and query evidence
