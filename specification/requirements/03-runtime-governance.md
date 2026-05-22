# Runtime Governance Requirements

**Family**: REQ-F-RUNTIME-*
**Status**: Active
**Category**: Governance
**Carries Forward From**: None
**Authoring Design**: None

This family defines the runtime boundary between ABG as substrate and `odd_sdlc` as
configured domain product.

### REQ-F-RUNTIME-001 — ABG owns raw runtime fact truth

Traversal lifecycle, execution facts, and event truth are emitted by ABG as the
runtime substrate.

**Acceptance Criteria**:
- AC-1: `odd_sdlc` does not become the authoritative producer of post-dispatch
  runtime fact truth
- AC-2: execution facts needed for recovery, retry, or escalation reasoning are
  emitted by the substrate rather than hidden behind product-local summary
  artifacts
- AC-3: `odd_sdlc` consumes substrate fact truth rather than recreating it locally

### REQ-F-RUNTIME-002 — `odd_sdlc` configures policy but does not implement a shadow runtime

`odd_sdlc` may provide evaluator, escalation, and selection policy surfaces, but it
does not own a second imperative runtime after ABG dispatch.

**Acceptance Criteria**:
- AC-1: project policy is attached declaratively to lawful runtime surfaces
- AC-2: product policy may influence evaluation, escalation, or selection
  behavior without replacing substrate execution ownership
- AC-3: no product-local post-dispatch shadow runtime remains as a stable model

### REQ-F-RUNTIME-003 — The generic constructive stance favors F_P

The default constructive regime for the generic SDLC product path is `F_P`.
`F_D` is an optimization, admission, validation, folding, and routing regime
around configured `F_P` work, not a generic substitute for open-ended
constructive traversal. Optimized domains may rely on `F_D` for performance and
cost reasons when their product-owned contract declares deterministic authority
and deterministic closure law. `F_H` is used for governance escalation.

**Acceptance Criteria**:
- AC-1: `F_D` is used where the check is cheap, reliable, and structurally
  meaningful
- AC-2: ambiguous or constructive work escalates to `F_P` by default
- AC-3: policy or risk boundaries may escalate work to `F_H`
- AC-4: a generic constructive SDLC edge that expects `F_P` cannot close from
  `F_D` success alone unless its product contract explicitly declares the edge
  as deterministic, projection-only, or no-close
- AC-5: an optimized domain may choose an `F_D`-heavy path only through an
  explicit product-owned deterministic contract rather than by silently treating
  generic `F_P` gates as deterministic

### REQ-F-RUNTIME-004 — Runtime topology is GTL/ABG-native and project-owned

`odd_sdlc` defines runtime behavior through GTL and ABG-native configuration and
publication surfaces rather than by inheriting foreign control-plane artifacts
by default.

**Acceptance Criteria**:
- AC-1: `odd_sdlc` runtime behavior is explainable from `odd_sdlc` and substrate
  surfaces alone
- AC-2: inherited control-plane artifacts are not presumed live
  unless explicitly retained as compatibility features
- AC-3: any retained compatibility surface is named, justified, and tested

### REQ-F-RUNTIME-005 — ABG owns frontier scheduling for SDLC DAGs

`odd_sdlc` may derive product-specific feature/module/test dependency DAGs and
compile them into ABG dependency-frontier declarations, but ABG owns ready-row
selection, branch leases, bounded concurrency, retry isolation, fan-in events,
and replay truth.

**Acceptance Criteria**:
- AC-1: SDLC publishes `{ start_nodes[], DAG }` and ABG frontier declarations;
  it does not implement a second scheduler for admitted branch families
- AC-2: branch declarations include predecessor, read, write-territory,
  output-allocation, idempotency, and fan-in data before ABG lease selection
- AC-3: analyzer, archive, and replay surfaces consume ABG frontier events as
  runtime truth rather than treating the SDLC topological order as execution
  authority

### REQ-F-RUNTIME-006 — `odd_sdlc` preserves the ABG ontology/epistemology split

`odd_sdlc` shall use GTL and ABG carrier names as the ontology, and shall use
`C`, `transform.C`, `evaluate.C`, and `consequence.C` only as epistemic
notation over selected `abg.fn_composition` and ABG-admitted runtime truth.

**Acceptance Criteria**:
- AC-1: `odd_sdlc` uses ratified GTL carrier names without renaming them into a
  product-local carrier ontology
- AC-2: `C` means selected composition notation over selected
  `abg.fn_composition`; it is not a product-local `ComputeUnit`,
  `ReliableCompute`, topology anchor, runtime carrier, execution target, or
  closure path
- AC-3: `transform.C` may produce candidates, product deltas, and evidence
  under the selected composition and edge permission class, but it shall not
  emit runtime events, write ledgers, publish projections, select traversal, or
  close a boundary
- AC-4: `evaluate.C` produces findings, metrics, residual-pressure rows,
  diagnostics, evidence refs, authority refs, and proposed dispositions; it
  shall not directly close, write, select, transition, or emit runtime truth
- AC-5: ABG admission is the boundary where transform and evaluation payloads
  become runtime facts; ABG owns event emission, payload admission, payload
  ledgers, assurance projection, closure fold, traversal transition,
  continuation, correction, and replay truth
- AC-6: `consequence.C` is a projection reference over ABG-admitted state,
  assurance decision refs, traversal transition refs, and downstream read-model
  refs; it is not an independent action stage
- AC-7: `odd_sdlc` pressure maps, gain meaning, closure interpretation, analyzer
  output, and query overlays are product-owned projections over ABG-admitted
  facts, not generic GTL or ABG ontology
