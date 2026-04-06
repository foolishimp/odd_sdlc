# Runtime Governance Requirements

**Family**: REQ-F-RUNTIME-*
**Status**: Active
**Category**: Governance

This family defines the runtime boundary between ABG as substrate and `odd_method` as
configured domain product.

### REQ-F-RUNTIME-001 — ABG owns raw runtime fact truth

Traversal lifecycle, execution facts, and event truth are emitted by ABG as the
runtime substrate.

**Acceptance Criteria**:
- AC-1: `odd_method` does not become the authoritative producer of post-dispatch
  runtime fact truth
- AC-2: execution facts needed for recovery, retry, or escalation reasoning are
  emitted by the substrate rather than hidden behind product-local summary
  artifacts
- AC-3: `odd_method` consumes substrate fact truth rather than recreating it locally

### REQ-F-RUNTIME-002 — `odd_method` configures policy but does not implement a shadow runtime

`odd_method` may provide evaluator, escalation, and selection policy surfaces, but it
does not own a second imperative runtime after ABG dispatch.

**Acceptance Criteria**:
- AC-1: project policy is attached declaratively to lawful runtime surfaces
- AC-2: product policy may influence evaluation, escalation, or selection
  behavior without replacing substrate execution ownership
- AC-3: no product-local post-dispatch shadow runtime remains as a stable model

### REQ-F-RUNTIME-003 — The default constructive stance favors F_P

The default constructive regime favors `F_P`, with `F_D` used for cheap
trustworthy checks and `F_H` used for governance escalation.

**Acceptance Criteria**:
- AC-1: `F_D` is used where the check is cheap, reliable, and structurally
  meaningful
- AC-2: ambiguous or constructive work escalates to `F_P` by default
- AC-3: policy or risk boundaries may escalate work to `F_H`

### REQ-F-RUNTIME-004 — Runtime topology is GTL/ABG-native and project-owned

`odd_method` defines runtime behavior through GTL and ABG-native configuration and
publication surfaces rather than by inheriting foreign control-plane artifacts
by default.

**Acceptance Criteria**:
- AC-1: `odd_method` runtime behavior is explainable from `odd_method` and substrate
  surfaces alone
- AC-2: inherited control-plane artifacts are not presumed live
  unless explicitly retained as compatibility features
- AC-3: any retained compatibility surface is named, justified, and tested
