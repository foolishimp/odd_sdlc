---
id: B-086
title: Sweep SDLC F_D disambiguation, alias admission, and F_P escalation law
type: bug
ticket_category: rc_blocker
status: completed
review_status: completed_live_fd_disambiguation_sweep_proof
goal: typescript-bounded-data-mapper-build-rc
change_intent: Sweep SDLC F_D admission and assurance checks so they evaluate carriers at the level of disambiguation supplied by hard source authority, ticket, handoff, feature scope, and carrier context; remove strict canonical spelling checks inferred from local parser preferences, admit deterministic aliases when equivalence is provable, and route unresolved semantic disambiguation to F_P instead of forcing F_D failure.
change_class: design_reframe
re_entry_point: design
affected_boundary:
  - build_tenants/typescript/code/src/assurance/
  - build_tenants/typescript/code/src/operator/*_register.ts
  - build_tenants/typescript/code/src/operator/handoff.ts
  - build_tenants/typescript/test_env/tests/
  - build_tenants/typescript/test_env/live/test_t109_live_installed_data_mapper_pty.test.mjs
priority: critical
triaged_at: 2026-05-07
created_at: 2026-05-07
updated_at: 2026-05-09
completed_at: 2026-05-09
build_tenant: typescript
owner: odd_sdlc
governance_scope: STDO Method
governance_scope_expansion:
  - S: SPEC_METHOD.md
  - T: TICKET_METHOD.md
  - D: DESIGN_MODULE_METHOD.md
  - O: ODD_METHOD.md
dependencies:
  - T-041 active bounded RC release claim
  - B-084 active design-depth admission closure correction
  - T-116 active module domain schema/state and aggregate design surfaces
  - T-120 active retry-local repair prompts
  - T-122 active feature scope carrier closure correction
  - T-123 active traversal strategy authority correction
evidence_refs:
  - /Users/jim/src/apps/abiogenesis/specification/INTENT.md
  - /Users/jim/src/apps/abiogenesis/specification/PRODUCT.md
  - /Users/jim/src/apps/abiogenesis/specification/requirements/abg/REQ-R-ABG3-CONVERGENCE.md
  - /Users/jim/src/apps/abiogenesis/specification/requirements/abg/REQ-R-ABG3-PAYLOAD.md
  - /Users/jim/src/apps/abiogenesis/specification/requirements/abg/REQ-R-ABG3-ASSURANCE.md
  - /Users/jim/src/apps/odd_sdlc/specification/INTENT.md
  - /Users/jim/src/apps/odd_sdlc/specification/PRODUCT.md
  - /Users/jim/src/apps/odd_sdlc/specification/requirements/03-runtime-governance.md
  - /Users/jim/src/apps/odd_sdlc/specification/requirements/10-odd-sdlc-software-domain-buildout.md
  - /Users/jim/src/apps/odd_sdlc/specification/requirements/11-odd-sdlc-homeostatic-gap-triage-and-intent-renewal.md
  - build_tenants/typescript/test_env/test_runs/t109_live_installed_data_mapper_pty/20260507T013551288Z_pid99914
  - build_tenants/typescript/test_env/test_runs/t109_live_installed_data_mapper_pty/20260507T023042351Z_pid93685
  - build_tenants/typescript/test_env/test_runs/t109_live_installed_data_mapper_pty/20260507T025957794Z_pid37324/workspace/.ai-workspace/runtime/odd_sdlc/operator-runs/20260507T032310674Z_pid3068/assurance_postflight.json
  - build_tenants/typescript/test_env/test_runs/t109_live_installed_data_mapper_pty/20260507T025957794Z_pid37324/workspace/.ai-workspace/runtime/odd_sdlc/operator-runs/20260507T032310674Z_pid3068/design_depth_candidate_0_raw.json
implementation_refs:
  - build_tenants/typescript/code/src/assurance/carriers.ts
  - build_tenants/typescript/code/src/assurance/component_depth.ts
  - build_tenants/typescript/code/src/assurance/fold.ts
  - build_tenants/typescript/code/src/assurance/shared.ts
  - build_tenants/typescript/code/src/assurance/design_completeness.ts
  - build_tenants/typescript/code/src/operator/assurance_gate.ts
  - build_tenants/typescript/code/src/operator/component_depth_register.ts
  - build_tenants/typescript/code/src/operator/design_depth_register.ts
  - build_tenants/typescript/code/src/operator/feature_scope.ts
  - build_tenants/typescript/code/src/operator/handoff.ts
  - build_tenants/typescript/code/src/operator/installed_operator.ts
  - build_tenants/typescript/code/src/operator/traversal_strategy.ts
  - build_tenants/typescript/code/src/shared/fd_admission.ts
  - build_tenants/typescript/code/src/shared/blocking_reason.ts
  - build_tenants/typescript/code/src/workspace/source_input.ts
  - build_tenants/typescript/code/src/workspace/project_constraints.ts
  - build_tenants/typescript/code/src/workspace/project_profile.ts
  - build_tenants/typescript/code/src/hooks/admission.ts
  - build_tenants/typescript/code/src/hooks/evaluators.ts
  - build_tenants/typescript/test_env/tests/test_b086_fd_disambiguation_sweep.test.mjs
  - build_tenants/typescript/test_env/tests/test_t084_assurance_ledger_composition.test.mjs
  - build_tenants/typescript/test_env/tests/test_t086_blocking_reason_carriers.test.mjs
  - build_tenants/typescript/test_env/tests/test_t066_product_materialization_contract.test.mjs
  - build_tenants/typescript/test_env/tests/test_t113_component_depth_register_admission.test.mjs
  - build_tenants/typescript/test_env/tests/test_t115_component_execution_failure_repair_flow.test.mjs
  - build_tenants/typescript/test_env/tests/test_t120_retry_local_repair_prompt.test.mjs
  - build_tenants/typescript/test_env/tests/test_t122_feature_scope_closure.test.mjs
intake_source: The 2026-05-07 live T-109 data_mapper lane repeatedly found F_D false failures after lawful same-edge repair. Operation/entity aliases, scope-qualified status values, and standard cardinality notations were rejected even though the source/handoff did not carry a hard signal selecting one canonical spelling. This is broader than B-084's current design-depth instance and requires a full SDLC F_D sweep plus explicit F_P escalation law.
target_truth: SDLC F_D is a deterministic admission and assurance optimization over declared truth, not a hidden canonicalization policy, constitutional shortcut, or semantic judge. F_D may reject malformed carriers, missing hard-required identity, contradictory ownership, or out-of-scope truth when those facts are decidable against hard source law. When the only issue is semantic disambiguation that the source did not hard-signal, F_D cannot force a failure; it must admit provably equivalent aliases or escalate the ambiguity to F_P. F_D optimization may be tuned later through declared policy, schema, or domain gain-function law, but tuning does not retroactively turn an optimization preference into source authority.
superseded_truth: F_D parsers and assurance checks may treat local TypeScript carrier enum names, parser implementation choices, prompt examples, or prior observed outputs as if they were source-level disambiguation requirements.
closure_law: Close only after a code sweep enumerates every SDLC F_D parser/admission/assurance gate, classifies exact-contract fields, alias-admissible fields, and F_P-escalation fields, removes false canonical checks or backs them with explicit hard source/handoff/schema contract law, adds deterministic positive/negative tests for the classification, and reruns the live T-109 data_mapper lane far enough to prove the corrected F_D path does not stop on non-hard disambiguation before the next real product/test blocker.
evaluation_criteria:
  - Every F_D gate has an inventory entry naming its carrier, parser/admission function, assurance function, accepted field set, and exactness policy.
  - Exact spelling is required only for fields whose source authority explicitly disambiguates one spelling with a hard signal or whose value is a private protocol discriminator.
  - Alias admission is used for public domain identity, scoped entity/operation refs, standard cardinality notation, scope-qualified closed statuses, and case/separator variants when module/context identity is compatible and equivalence is deterministically provable.
  - Unresolved semantic disambiguation without a hard source signal routes to F_P escalation, not F_D failure.
  - Contradictory module ownership, missing hard-required target identity, malformed carrier shape, and out-of-scope truth still reject only when the contradiction is deterministic against hard source law.
  - Handoff accepted-carrier field sets match parser law; workers are not asked to emit a shape or enum vocabulary that F_D later rejects.
  - Deterministic tests cover each corrected alias class with a matching negative contradiction case.
  - The live RC lane is rerun after the sweep and any remaining blocker is classified as real product/test truth, repairable same-edge truth, graph-span reentry, or lawful reprice.
proof_surface:
  - F_D sweep inventory checked into ticket or commentary
  - focused deterministic parser/assurance tests
  - `npm run test:semantic`
  - `npm run test:sandbox`
  - fresh T-109 live data_mapper archive after the sweep
non_closure_conditions:
  - fixing only the observed cardinality/status/operation-id failures without sweeping other F_D gates
  - routing unresolved non-hard disambiguation to F_D failure instead of F_P escalation
  - adding broad string fuzzing that admits contradictory or unscoped truth
  - silently converting tenant-specific vocabulary inside generic odd_sdlc core
  - treating a local parser enum, preferred normalized form, prompt example, or prior worker output as a hard source signal
  - requiring canonical output spellings that are not declared by hard source authority, ticket, handoff, feature scope, or typed schema
  - treating the current F_D optimization shape as constitutional authority rather
    than a tunable deterministic aid beneath source law and F_P/F_H escalation
  - treating a deterministic/sandbox pass as RC proof without a fresh live T-109 run
---

# B-086: Sweep SDLC F_D Disambiguation, Alias Admission, And F_P Escalation Law

## Closure Note - 2026-05-09

Closed under STDO for the SDLC F_D disambiguation and alias-admission sweep.

Current live evidence:

- Fresh data_mapper live archive:
  `build_tenants/typescript/test_env/test_runs/t109_live_installed_data_mapper_pty/20260508T122226315Z_pid79621`.
- The run advanced past the previous false-failure classes: non-canonical
  operation identity, scope-qualified design-completeness status, standard
  cardinality notation, and design-depth parser drift.
- Remaining stop point was an outer test harness timeout during
  `derive_component_test_surface`, not an F_D disambiguation rejection.
- Retry-bearing live packages carried typed repair instructions instead of
  requiring local parser-preference spellings as source authority.

Closure boundary:

- This closes the F_D exactness/alias/escalation sweep.
- It does not close RC or the component-test/release-depth blocker.

## STDO Triage

### First Missing Layer

Design.

The immediate failures were observed in realization code, but the defect is not
one bad enum. The missing law is the F_D exactness boundary and optimization
status:

- what must be exact because it is a private protocol discriminator;
- what must be exact because source authority carries a hard signal selecting a
  single value;
- what may be normalized because it is a public domain identity or notation and
  source authority did not select one exact form;
- what must escalate to F_P because semantic disambiguation is needed and F_D
  has no hard source signal to decide it;
- what must reject because it is malformed or contradictory against hard source
  law.
- what may be improved later because F_D is an optimization over declared truth,
  not the authority source itself.

### Current Evidence

Live T-109 archives exposed the pattern:

- `20260507T013551288Z_pid99914`: F_D demanded normalized operation IDs such as
  `operation:bindtypes` even though the carrier used an allowed camelCase form.
- `20260507T023042351Z_pid93685`: F_D rejected
  `satisfied_for_steel_thread` even though the selected feature scope supplied
  the qualifier context.
- `20260507T025957794Z_pid37324`: F_D rejected standard cardinality notation
  such as `1..1` because the parser only admitted `one | optional | many`.

These are not worker-output defects by themselves. They are false failures when
the controlling source contract did not demand the private canonical spelling.

## Governing Authority Anchors

This ticket is not introducing new law. It is enforcing existing ABIogenesis
and `odd_sdlc` product law.

ABIogenesis anchors:

- `abiogenesis/specification/INTENT.md`: ABG has three evaluator regimes
  (`F_D`, `F_P`, `F_H`); the operator workflow removes ambiguity with the
  agentic surface; `F_D` applies only where the domain can make part of the work
  precise and does not move domain HOW into framework law.
- `abiogenesis/specification/PRODUCT.md`: unconstrained `F_P` space remains
  hidden internal traversal by the probabilistic worker; `F_D` is only a
  deterministic evaluator or domain-owned optimization where the domain can make
  the work precise.
- `abiogenesis/specification/requirements/abg/REQ-R-ABG3-CONVERGENCE.md`:
  deterministic evaluation/proof runs first, but falls forward to governed
  `F_P` when deterministic handling is absent or remains open; only invalid,
  contradictory, malformed, or engine-erroring deterministic paths fail closed.
- `abiogenesis/specification/requirements/abg/REQ-R-ABG3-PAYLOAD.md`:
  missing domain semantics, bad gain functions, or adapter gaps surface as
  explicit ambiguity or gap rows rather than silent closure.
- `abiogenesis/specification/requirements/abg/REQ-R-ABG3-ASSURANCE.md`:
  assurance distinguishes authority-missing, contradictory authority/evidence,
  partial, missing, and deferred states; incomplete downstream gain functions
  surface declared ambiguity rather than silent repair of domain meaning.

`odd_sdlc` anchors:

- `odd_sdlc/specification/INTENT.md`: observation, triage, route selection, and
  constitutional repricing are distinct lawful acts and must not collapse into
  hidden control flow.
- `odd_sdlc/specification/PRODUCT.md`: gap triage is domain-local semantic
  appraisal bounded by deterministic evidence and published authority; lawful
  re-entry preserves authority direction instead of collapsing every gap into
  immediate repair.
- `odd_sdlc/specification/requirements/03-runtime-governance.md`: the default
  constructive stance favors `F_P`; `F_D` is for cheap, reliable, structurally
  meaningful checks; ambiguous or constructive work escalates to `F_P` by
  default.
- `odd_sdlc/specification/requirements/10-odd-sdlc-software-domain-buildout.md`:
  generic software-domain traversal relies on configured `F_P` where
  deterministic authority is not sufficient on its own; major ambiguity is
  surfaced explicitly, carried by `F_P`, escalated to `F_H`, or hard-stopped only
  by declared risk/policy.
- `odd_sdlc/specification/requirements/11-odd-sdlc-homeostatic-gap-triage-and-intent-renewal.md`:
  meaningful mismatch resolves to explicit triage/route outcomes; no mismatch
  falls through to implicit retry, silent repair, or undefined state.

## Hard Source Signal Rule

F_D may enforce a disambiguated requirement only when the disambiguation is a
hard signal in the governing source for that edge.

Hard source signals include:

- an explicit requirement or design statement that names the required value;
- an accepted carrier schema exposed to the worker as mandatory contract law;
- a handoff field set that declares a closed vocabulary for that field;
- a private protocol discriminator or schema version owned by the runtime.

Hard source signals do not include:

- local TypeScript enum names used by a parser;
- preferred normalized forms used internally after admission;
- examples in a prompt that are not marked mandatory;
- stale precedent from prior worker outputs;
- convenience strings introduced by assurance code.

If there is no hard source signal, F_D must either admit equivalent aliases
when equivalence is deterministically provable under compatible context, or
emit an F_P escalation carrier for semantic disambiguation. It must not
manufacture a hard requirement from implementation-local vocabulary, and it must
not convert that missing source signal into an F_D failure.

## F_D Optimization Rule

F_D is a deterministic optimization layer. It is valuable because it can cheaply
admit, reject, normalize, or route work when the source law and carrier facts
make the decision precise.

That optimization is tunable. Future product or domain work may tighten an F_D
check, loosen an alias set, add a gain function, add a hard-stop policy, or move
an ambiguity class to F_H. Those tuning changes must enter through declared
policy, schema, requirement, design, or graph-function law. They do not arise
from local parser convenience.

Therefore:

- current F_D behavior is evidence about the implementation, not source law;
- F_D may accelerate lawful convergence, but it may not invent the law it
  accelerates;
- when F_D cannot decide from hard source truth, the lawful optimization result
  is escalation or yielded ambiguity, not failure.

## Required Sweep

Inventory all SDLC F_D gates under the TypeScript tenant:

- project conformance and induction F_D checks;
- design-depth register admission and design-completeness assurance;
- aggregate-domain and sunny-day design assurance;
- component-depth and component repair admission;
- test execution/result/archive admission;
- release-depth parity and release readiness assurance;
- handoff accepted-carrier field-set generation for all retry-local repairs.

For each gate, classify fields as:

- `exact_protocol`: private discriminator or schema version; exact spelling is
  lawful.
- `exact_contract`: source authority or handoff explicitly required the exact
  value through a hard signal; exact spelling is lawful.
- `alias_admissible`: public domain identity, notation, or scoped value where
  the carrier context can bind equivalent forms deterministically.
- `fp_escalation`: semantic disambiguation is required and no hard source signal
  lets F_D decide; emit a typed F_P escalation carrier instead of failure.
- `reject`: malformed, contradictory against hard source law, out-of-scope, or
  impossible structure.

## Broader F_D Sweep Checklist

Use this checklist before any fresh RC live lane. Each checked item must name
the exact parser/admission/assurance surfaces inspected, the field exactness
classification, and the deterministic tests added or confirmed.

- [x] Assurance carrier and fold boundary.
  - Status: deterministic checkpoint applied; post-review fold precedence
    correction applied.
  - Surfaces: `assurance/carriers.ts`, `assurance/fold.ts`,
    `assurance/shared.ts`, `operator/assurance_gate.ts`,
    `operator/handoff.ts`, `operator/installed_operator.ts`,
    `shared/blocking_reason.ts`.
  - Result: `fp_escalation` / `escalate_to_fp` is an explicit lawful path and
    no longer collapses into `retry_same_edge`; mixed ledgers with both
    `open_gap` and `fp_escalation` fold to F_P escalation while preserving the
    open-gap reasons as evidence.
  - Proof: `test_t084_assurance_ledger_composition.test.mjs`,
    `test_t086_blocking_reason_carriers.test.mjs`.

- [x] First observed design-completeness false-failure path.
  - Status: deterministic checkpoint applied.
  - Surfaces: `assurance/design_completeness.ts`,
    `operator/design_depth_register.ts`.
  - Result: worker-authored semantic partial/block verdicts without hard source
    disambiguation escalate to F_P; observed B-084 alias classes are admitted.
  - Proof: `test_t122_feature_scope_closure.test.mjs`.

- [x] Component-depth and release-depth parser/admission sweep.
  - Status: deterministic positive/negative sweep tests added; post-review
    exact-protocol and tenant-separation corrections applied.
  - Surfaces: `operator/component_depth_register.ts`,
    `assurance/component_depth.ts`, `shared/fd_admission.ts`.
  - Classify: `kind`, `registerVersion`, `targetAssetType`, row ids,
    `componentId`, `moduleName`, `testClassId`, `shardId`, `failureKind`,
    `repairTarget`, `lawfulReentryPoint`, `attributionConfidence`,
    `scheduleStatus`, `releaseDepthParity.status`, `blockingReasons`.
  - Required outcome: exact protocol remains exact; public IDs and path-derived
    repair targets admit provable aliases; non-hard semantic repair ambiguity
    routes to `escalate_to_fp`, `triage_gap`, or declared reprice instead of
    F_D failure; contradictions still reject.
  - Proof: `test_b086_fd_disambiguation_sweep.test.mjs` covers exact
    top-level and nested protocol kind/version rejection, missing row kind
    rejection, declared path-derived repair-target admission, tenant-specific
    failure-kind guess rejection, alternate register-kind rejection, schedule
    status admission/rejection, and release-depth blocker alias
    admission/non-contract status rejection. `test_t113_component_depth_register_admission.test.mjs`
    and `test_t115_component_execution_failure_repair_flow.test.mjs` now emit
    canonical component-depth protocol values instead of relying on parser
    defaulting or tenant vocabulary.

- [x] Worker result, execution evidence, and test archive admission sweep.
  - Status: deterministic positive/negative sweep tests added; post-review
    execution-status contract correction applied.
  - Surfaces: `operator/handoff.ts` report admission, execution evidence
    admission, execution shard evaluation, obligation assessment evaluation,
    archive source dependency checks.
  - Classify: report `kind`, graph/edge/target identity, materialized file
    roles, execution `lane`, `status`, command, shard ids, module names,
    counts, report refs, obligation fulfillment status, archive dependency refs.
  - Required outcome: private protocol fields remain exact; `pending` is the
    admitted non-closure status; non-contract status values such as `not_run`,
    `skipped`, `unknown`, or `none` reject before assurance; structurally valid
    failed execution remains repair input; archive closure cannot rely on
    prose-only dependency evidence.
  - Proof: `test_b086_fd_disambiguation_sweep.test.mjs` covers declared
    `pending` admission, `not_run`/unknown status rejection, failed-execution
    repair input, contradictory count triage, and archive closure requiring
    admitted execution-result report refs rather than prose-only dependency
    claims. `test_t066_product_materialization_contract.test.mjs` now asserts
    `not_run` is rejected as a report-contract violation.

- [x] Accepted-carrier field-set and retry prompt sweep.
  - Status: deterministic positive/negative sweep tests added.
  - Surfaces: `operator/handoff.ts` `acceptedCarrierSchemaForReason`,
    `componentDepthFieldSetForTarget`, `designDepthFieldSetForTarget`,
    retry repair instruction generation.
  - Classify: every advertised field as exact protocol, exact contract,
    alias-admissible, F_P escalation, or reject.
  - Required outcome: worker prompts do not demand parser-local enum spelling
    unless hard source/schema law requires it; field sets do not advertise
    shapes that parser admission later rejects.
  - Proof: `test_b086_fd_disambiguation_sweep.test.mjs` covers
    execution-evidence accepted-carrier schema and field-set projection plus
    typed rejection of unknown postflight next actions.

- [x] Design-depth remainder sweep.
  - Status: deterministic positive/negative sweep tests added.
  - Surfaces: `operator/design_depth_register.ts`,
    `assurance/design_completeness.ts`.
  - Classify: module schema rows, entity ownership, attribute ids/types,
    cardinality, operation ids, state diagram ids/transitions, aggregate
    cross-module references, sunny-day sequence refs, completeness verdicts.
  - Required outcome: observed B-084 fixes remain, contradictory ownership
    rejects, and string-token scope heuristics do not hide or invent hard
    source disambiguation.
  - Proof: `test_b086_fd_disambiguation_sweep.test.mjs` covers shorthand
    module-schema alias admission, missing hard module identity rejection,
    allowed operation/entity alias admission, disambiguated mismatch open-gap
    pressure, malformed verdict-shape rejection, and F_P escalation for
    worker-authored semantic partials. `test_t122_feature_scope_closure.test.mjs`
    continues to cover B-084 missing-module, contradictory-ownership, and
    aggregate/sunny-day alias regressions.

- [x] Remaining assurance dimensions sweep.
  - Status: deterministic positive/negative sweep tests added.
  - Surfaces: `assurance/materialization.ts`,
    `assurance/semantic_convergence.ts`, `assurance/obligation_carry.ts`,
    `assurance/requirement_fulfillment.ts`, `assurance/ambiguity.ts`,
    `assurance/capability.ts`, `assurance/shallow_realization.ts`,
    plus `operator/assurance_gate.ts`.
  - Classify: reason codes, status values, capability ids, requirement ids,
    ambiguity routes, reprice routes, and all `same_edge_retry` assignments.
  - Required outcome: semantic uncertainty not backed by hard source truth
    escalates to F_P/reprice/triage; only deterministic malformed,
    contradictory, or missing-hard-evidence facts fail closed.
  - Proof: `test_b086_fd_disambiguation_sweep.test.mjs` covers positive and
    negative outcomes for materialization, semantic convergence, obligation
    carry, requirement fulfillment, ambiguity, capability, and shallow
    realization. `test_t077_t083_assurance_ledgers.test.mjs` remains the
    broader dimension-specific regression lane.

- [x] Project conformance and induction F_D sweep.
  - Status: deterministic positive/negative sweep tests added.
  - Surfaces: `workspace/source_input.ts`, `workspace/project_constraints.ts`,
    `workspace/project_profile.ts`, `operator/traversal_strategy.ts`,
    `operator/feature_scope.ts`.
  - Classify: project constraints, risk appetite, tenant registry values,
    execution contract declarations, traversal directives, feature-scope module
    binding, fallback-to-full-breadth behavior.
  - Required outcome: generic builder core does not encode tenant-specific build
    law; unresolved module binding falls back or escalates lawfully.
  - Proof: `test_b086_fd_disambiguation_sweep.test.mjs` covers
    underdisambiguated risk-appetite fallback, invalid typed carrier rejection,
    ABG-selected full breadth overriding retry pressure, steel-thread module
    binding, and unbound scope fallback to full breadth. `test_t123_per_edge_traversal_strategy.test.mjs`
    remains the full traversal-strategy authority lane.

- [x] Hook preflight/postflight F_D sweep.
  - Status: deterministic positive/negative sweep tests added.
  - Surfaces: `hooks/admission.ts`, `hooks/evaluators.ts`.
  - Classify: hook protocol discriminators, edge classes, requested operation,
    generated asset authority, ambiguity candidates, generated asset contract
    status.
  - Required outcome: private hook protocol remains exact; domain identity or
    ambiguity candidates are not rejected for parser-preferred spelling when
    the source did not hard-signal it.
  - Proof: `test_b086_fd_disambiguation_sweep.test.mjs` covers surface-name
    alias admission, source-binding absence rejection, declared-type alias
    admission, operation mismatch rejection, and unbound output rejection.

- [ ] Fresh live T-109 data_mapper proof after sweep.
  - Priority: release-blocking.
  - Required outcome: live lane no longer stops on non-hard F_D
    disambiguation; any remaining blocker is classified as real product/test
    truth, repairable same-edge truth, graph-span re-entry, F_P escalation, or
    lawful reprice.
  - Non-closure: deterministic/sandbox pass alone is not RC proof.

## Initial Implementation Checkpoint

B-084 already repaired the first observed design-depth classes:

- scoped entity/operation alias comparison;
- scope-qualified closed design-completeness statuses;
- standard attribute cardinality notation.

Those changes are evidence for B-086, not closure for B-086. B-086 remains open
until the full SDLC F_D sweep and fresh live proof are complete.

## Applied Deterministic Checkpoint - 2026-05-07

This checkpoint applies the ticketed F_D/F_P distinction without closing B-086.

Implemented code changes:

- Added `shared/fd_admission.ts` as the first shared F_D admission calculus for
  field classes, exact private protocol strings/versions, exact contract enums,
  and declared aliases. Carrier-local parsers now declare field law instead of
  hand-rolling unrelated exactness rules for the same pattern.
- Added explicit assurance verdict/status `fp_escalation` and lawful re-entry
  action `escalate_to_fp`.
- Updated the assurance fold so F_P escalation reasons do not collapse into
  `retry_same_edge`, including mixed-ledger cases that contain both open gaps
  and F_P escalation pressure.
- Updated assurance postflight and gap-dossier construction so
  `escalate_to_fp` is preserved as a lawful next action and remains
  retry-eligible for the installed self-healing loop.
- Updated installed-operator projection so assurance-ledger F_P escalation is
  surfaced as `fp_escalation` / `escalate_to_fp`, not `postflight_failed` /
  same-edge retry.
- Updated design-completeness worker-authored semantic partial/block verdicts
  to route to F_P escalation when they are not backed by a hard deterministic
  source signal.
- Updated component-depth admission so top-level, nested register, and row
  private discriminators remain exact; missing/defaulted row kinds and
  alternate component-depth register kinds/versions reject instead of being
  normalized. Removed tenant-specific failure-kind and concern-role inference
  from the generic component-depth parser.
- Updated execution-evidence admission so `pending` is the admitted non-closure
  status and non-contract values such as `not_run` reject before assurance.
- Removed a Scala-specific diagnostic keyword from the generic repair prompt
  scanner; the repair row, file refs, and actual evidence excerpts remain the
  diagnostic authority.

Added deterministic proof:

- `test_b086_fd_disambiguation_sweep.test.mjs`: adds positive and negative
  F_D tests across component-depth/release-depth, worker result and archive
  evidence, accepted-carrier retry prompts, design-depth admission and
  assurance, remaining assurance dimensions, project conformance/traversal
  scope, and hook preflight/postflight.
- `test_t084_assurance_ledger_composition.test.mjs`: proves
  `fp_escalation` folds to F_P re-entry instead of same-edge retry.
- `test_t086_blocking_reason_carriers.test.mjs`: proves the postflight gap
  dossier preserves `escalate_to_fp` as a lawful next action.
- `test_t122_feature_scope_closure.test.mjs`: proves a generic
  worker-authored design-completeness partial verdict escalates to F_P instead
  of becoming an F_D failure.
- `test_t066_product_materialization_contract.test.mjs`: proves `not_run`
  rejects as a worker report contract violation.
- `test_t113_component_depth_register_admission.test.mjs` and
  `test_t115_component_execution_failure_repair_flow.test.mjs`: keep
  production-shaped component-depth fixtures on the exact protocol surface.
- `test_t120_retry_local_repair_prompt.test.mjs`: proves B-085
  `component_repair_row_open` becomes a typed component-test repair re-entry
  plan under the exact release-depth parity protocol.

Verification run:

- `npm run build:semantic` passed.
- `node --test test_env/tests/test_b086_fd_disambiguation_sweep.test.mjs`
  passed, 15/15.
- `node --test test_env/tests/test_t122_feature_scope_closure.test.mjs test_env/tests/test_t077_t083_assurance_ledgers.test.mjs test_env/tests/test_t034_hook_set.test.mjs test_env/tests/test_t123_per_edge_traversal_strategy.test.mjs`
  passed, 51/51.
- `npm run test:semantic` passed, 257/257.
- `npm run test:sandbox` passed, 15/15.
- `git diff --check` passed.

Remaining non-closure:

- Fresh live T-109 data_mapper proof has not been rerun after this checkpoint.
- Operator review of these deterministic results is still required before
  closure.
- This ticket must remain active until the live lane proves the corrected
  behavior against the RC path.

## ABG 3.7 Evaluator Boundary - 2026-05-08

T-129's evaluator migration sharpens B-086's closure law: F_D is not an
action-decision path. It may admit, reject exact protocol defects, or emit
typed ambiguity / F_P escalation pressure. It must not force iteration by
locally deciding that an allowed ambiguity is a failure.

Closure expectation update:

- Alias-admissible or underdisambiguated semantic cases should become admitted
  truth, typed ambiguity, or F_P/evaluator pressure, not local retry ranking.
- F_P escalation rows must remain visible through the same gap/evaluator
  projection path used by public gaps and RC reporting.
- Tests must continue to distinguish exact private protocol discriminators from
  public semantic identity aliases; passing deterministic tests is not RC proof
  without the fresh live T-109 lane.
- Any future assurance fold that ranks repair/reentry must consume ABG
  construction priority projection truth or be explicitly scoped as temporary
  adapter debt pending ABG T-128.
