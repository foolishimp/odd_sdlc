---
id: B-056
title: Canonicalize project_constraints.yml shape for v3.2 from-bootstrap workspaces
type: bug
ticket_category: implementation_migration
migration_strategy: inside_out_hard_break
library_usage: none
library_rationale: the canonicalization belongs to odd_sdlc project-profile normalization and evaluator consumption for this product boundary; no separate reusable library owns the v3.1 to v3.2 workspace constraint migration
status: completed
goal: one-canonical-project-constraints-profile-for-runtime-and-evaluators
change_intent: `data_mapper.test39` exposed a v3.1.0 to v3.2.0 drift in `project_constraints.yml`: the current workspace writes and reads the `structure.design_tenants[]` shape while older successful runs carried richer `build_tenants.<name>.capability_contracts` style truth. Evaluators, normalization, bootstrap, and runtime routing must consume one canonical profile rather than relying on whichever raw YAML shape happens to be present.
change_class: design_reframe
re_entry_point: design_surface
affected_boundary: `project_profile.py`, `normalization.py`, project constraints templates, workspace-state projection, capability-gated route/evaluator lookup, install normalization reports, bootstrap guidance, source/install tests
priority: critical
triaged_at: 2026-04-25
created_at: 2026-04-25
updated_at: 2026-04-25
dependencies:
  - B-046 completed
  - B-051 completed
  - B-052 completed
intake_source: `data_mapper.test39` versus `data_mapper.test35` matrix and `20260424T100000Z_REVIEW_b051-b052-test39-remediation-coverage.md`; current comments identify `project_constraints.yml` shape drift as an unclaimed RC blocker
target_truth: odd_sdlc admits raw project constraint input through one normalization path and publishes one canonical project profile used by analysis, triage, capability gating, prompt assembly, and bootstrap guidance. Raw v3.1-style and v3.2-style inputs may be accepted only if they normalize to the same canonical carrier. Evaluators and route decisions must not read divergent raw YAML shapes directly.
superseded_truth: runtime/evaluator behavior can depend on whether `project_constraints.yml` is authored in the older rich `build_tenants.*.capability_contracts` shape or the current `structure.design_tenants[]` shape, and no migration note declares which one is current authority.
closure_law: this ticket closes when one canonical project-profile carrier owns tenant capability and constraint truth, both supported raw shapes either normalize deterministically or fail closed with governed diagnostics, all evaluator/route consumers use the canonical carrier, and source/install proofs cover v3.1-style input, v3.2-style input, malformed input, and generated bootstrap text. Closure cannot rely on manually editing `project_constraints.yml` during a run.
evaluation_criteria:
  - canonical project profile is the only runtime/evaluator authority for tenant capability and constraint truth
  - raw v3.1-style and v3.2-style inputs normalize to the same semantic carrier when lawful
  - malformed, ambiguous, or semantically empty constraint fields fail closed with governed diagnostics
  - route/evaluator lookup does not consume raw YAML in a way that bypasses normalization
  - migration note or bootstrap text names the v3.1 to v3.2 shape rule for operators
proof_surface:
  - source proof that v3.1-style constraints normalize to the canonical project profile
  - source proof that v3.2-style constraints normalize to the same canonical project profile
  - source proof that malformed/ambiguous constraints fail closed
  - source proof that capability-gated route/evaluator lookup reads the canonical profile
  - install proof on an imported workspace that no manual `project_constraints.yml` repair is needed before first public start/gaps analysis
non_closure_conditions:
  - closure is claimed while any normal route/evaluator path reads raw `project_constraints.yml` shape directly
  - v3.1-style and v3.2-style inputs produce different capability truth without a declared diagnostic
  - empty English prose or blank execution-contract fields are treated as capability evidence
  - install proofs require manual in-session edits to `project_constraints.yml`
---

## Why This Ticket Exists

`data_mapper.test39` was the first fresh from-bootstrap run under the new
carrier topology and v3.2.0 installed shape. It surfaced an unresolved
configuration migration issue.

The system has accumulated multiple ways to describe tenant capabilities and
constraints. That is tolerable only if one canonical carrier owns the admitted
truth and every raw input shape normalizes through it before runtime use.

This is an RC blocker because evaluator grounding and capability gates cannot
be trusted while they may be reading different shapes of the same file.

## Trace Boundary

This ticket reads current repo-law truth from:

- `specification/GOALS.md`
- `specification/INTENT.md`
- `specification/PRODUCT.md`
- `specification/requirements/03-runtime-governance.md`
- `specification/requirements/10-odd-sdlc-software-domain-buildout.md`
- `specification/requirements/12-declarative-operational-state-transitions.md`

This ticket reads current design truth from:

- `build_tenants/python/design/README.md`
- `build_tenants/python/design/GAP_ANALYSIS_DOSSIER.md`
- `build_tenants/python/design/TICKET_WORK_ITEM_REENTRY_ROUTING.md`

This ticket reads current forensic truth from:

- `.ai-workspace/comments/claude/20260424T090000Z_MATRIX_test39-regression-vs-test35.md`
- `.ai-workspace/comments/claude/20260424T100000Z_REVIEW_b051-b052-test39-remediation-coverage.md`

This ticket reads current method-law truth from:

- `/Users/jim/src/apps/specification_methodology/specification/standards/SPEC_METHOD.md`
- `/Users/jim/src/apps/specification_methodology/specification/standards/TICKET_METHOD.md`
- `/Users/jim/src/apps/specification_methodology/specification/standards/DESIGN_MODULE_METHOD.md`
- `/Users/jim/src/apps/specification_methodology/specification/standards/ODD_METHOD.md`

## Migration Declaration

- old_truth_path: raw `project_constraints.yml` shape acts as runtime truth, with v3.1-style and v3.2-style forms both influencing behavior through local readers
- new_truth_path: one normalized project-profile carrier owns tenant capability and constraint truth; raw YAML is input only
- producers_old:
  - raw `.ai-workspace/context/project_constraints.yml`
  - local readers in normalization, analysis, route, evaluator, or prompt-assembly code
- producers_new:
  - canonical project-profile normalization/admission path
  - workspace-state or analysis-manifest projection of the admitted profile
  - governed diagnostics for malformed, ambiguous, or semantically empty input
- consumers_old:
  - route/evaluator lookup over raw shape
  - bootstrap interpretation of raw constraint text
  - manual operator edits during live runs
- consumers_new:
  - analysis/gap dossier
  - homeostatic triage and capability gating
  - prompt/context assembly
  - installed bootstrap guidance
  - from-bootstrap RC proof lane
- projections_and_proofs:
  - normalization report
  - workspace-state/profile projection
  - analysis manifest source inputs
  - route/evaluator diagnostics
  - source and install tests over both raw shapes

## Interface Inventory

- raw input: `.ai-workspace/context/project_constraints.yml`
- canonical carrier: project profile / workspace-state projection
- normalization producer: `odd_sdlc.normalization`
- profile parser/admitter: `odd_sdlc.project_profile`
- consumers: analysis, triage, capability gating, prompt/context assembly, bootstrap text
- proofs: source profile-shape tests, install imported-workspace tests, malformed input tests

## Migration Checklist

- [x] old truth path is named explicitly
- [x] new truth path is named explicitly
- [x] producer set for the new truth is listed
- [x] consumer set for the new truth is listed
- [x] projection/read-model surfaces are listed
- [x] old truth path is removed or explicitly demoted from authority
- [x] mixed-state behavior is no longer accepted as closure evidence
- [x] tests proving mixed old/new behavior are removed or repriced
- [x] recurring realization patterns are checked against existing library/commonization surfaces
- [x] ticket declares library usage and names the governing library or rationale
- [x] if the work exists in more than one build tenant, this backlog/active ticket carries only one tenant lifecycle and any sibling tenant work lives on its own suffixed ticket
- [x] ticket wording, product wording, and proof claims are reconciled before closure

## Functional Review Criteria

1. Is there exactly one runtime authority for tenant capability and constraint truth?
2. Are v3.1-style and v3.2-style raw inputs treated as inputs to admission, not as rival live contracts?
3. Do malformed or semantically empty values fail closed instead of defaulting into apparent capability?
4. Do route/evaluator consumers read the canonical carrier rather than raw YAML?
5. Does generated bootstrap guidance name the canonical rule clearly enough for operators?

## Evaluator Gate

### 1. Authority Seam Closure

- [x] canonical project profile owns constraint truth
- [x] raw YAML is demoted to admitted input only
- [x] all route/evaluator consumers use the canonical profile

### 2. Essential Carrier Consolidation

- [x] no second config-shape parser remains as runtime authority
- [x] v3.1/v3.2 compatibility is handled at admission, not in every consumer

### 3. Enforcement After Proof

- [x] v3.1-style source proof lands
- [x] v3.2-style source proof lands
- [x] malformed-input negative proof lands
- [x] install proof lands before closure

## Required Break Order

1. Inventory all raw `project_constraints.yml` consumers.
2. Add source proofs for v3.1-style, v3.2-style, and malformed/ambiguous inputs.
3. Define or tighten the canonical project-profile carrier.
4. Rebind route/evaluator consumers to the canonical carrier.
5. Demote raw YAML readers to normalization/admission only.
6. Add install proof that a fresh imported workspace needs no manual constraint repair.
7. Publish migration/bootstrap wording for the canonical v3.2 rule.

## Initial Direction

1. prefer a canonical `ProjectProfile`/workspace-state carrier over direct raw YAML reads
2. support older input shape only as an admitted migration input if semantics are unambiguous
3. fail closed on ambiguous or empty capability evidence
4. make B-057 depend on this ticket before claiming RC readiness

## Closure Note

Closed by:

- `build_tenants/python/design/PROJECT_PROFILE_CONSTRAINTS_CANONICALIZATION.md`
- `ProjectProfile.capability_contracts` and v3.1/v3.2 admission in `project_profile.py`
- legacy `build_tenants:` projection preserving capability and execution contracts in `normalization.py`
- source tests `test_b056_project_profile_admits_v31_build_tenants_constraints` and `test_b056_v31_and_v32_project_constraints_normalize_to_same_profile`
- installed proof `test_b056_install_normalizes_v31_build_tenants_constraints_without_manual_repair`
- existing malformed-input proof `test_normalize_workspace_fails_closed_for_malformed_project_constraints`
