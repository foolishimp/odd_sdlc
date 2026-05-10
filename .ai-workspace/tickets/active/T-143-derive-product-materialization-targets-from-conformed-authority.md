---
id: T-143
title: Derive product materialization targets from conformed authority documents
type: defect
ticket_category: implementation_migration
migration_strategy: inside_out_hard_break
library_usage: extend_existing_odd_sdlc_authority_conformance_target_binding_and_product_materialization_carriers
governing_library: odd_sdlc TypeScript project authority, target binding, traversal consequence, and worker handoff surfaces over ABG 3.7.1 evaluator substrate
status: active
review_status: pending_implementation
goal: typescript-data-mapper-live-parity
build_tenant: typescript
owner: odd_sdlc
change_intent: Make conformed induction documents the invariant source for concrete product-file materialization targets, so product materialization applies requirements over the workspace instead of regenerating a design note with an empty target contract.
change_class: design_reframe
re_entry_point: design
priority: critical
triaged_at: 2026-05-11
created_at: 2026-05-11
updated_at: 2026-05-11
governance_scope: STDO Method
dependencies:
  - T-109 ratifies the traversal consequence ledger/decision/evaluator split.
  - T-134 conforms project authority from defined workspace input.
  - T-135 provides evaluator-owned runner traversal spine.
  - T-137 provides target-obligation binding and published-action law.
  - T-139 exposes public gaps as read-only evaluator view.
  - T-141 restores the GTL transform boundary between requirement induction and product materialization.
  - T-142 proves autonomous product materialization from the consequence chain on bounded lanes.
related_tickets:
  - T-041 remains the full data_mapper parity lane after this defect is fixed.
  - T-131 is independent guided OddChat live build work.
affected_boundary:
  - build_tenants/typescript/code/src/operator/handoff.ts
  - build_tenants/typescript/code/src/operator/carriers.ts
  - build_tenants/typescript/code/src/operator/installed_operator.ts
  - build_tenants/typescript/code/src/operator/traversal_consequence.ts
  - build_tenants/typescript/code/src/projection/query_domain.ts
  - build_tenants/typescript/code/src/workspace/project_authority_conformance.ts
  - build_tenants/typescript/code/src/workspace/project_profile.ts
  - build_tenants/typescript/code/src/workspace/bootstrap_lineage.ts
  - build_tenants/typescript/code/src/spec_method/entry.ts
  - build_tenants/typescript/test_env/tests/
  - build_tenants/typescript/test_env/live/
intake_source: The external data_mapper live sandbox at /Users/jim/src/apps/ai_sdlc_examples/local_projects/data_mapper/data_mapper.test_ts_live_20260510T152802Z proved that conformed PRODUCT.md contains the expected product file tree, but Fg_materialize_declared_product_asset still receives declaredProductFileTargets: [] and writes build_tenants/scala_spark/design/component_code_surface.md instead of required Scala/SBT source files.
target_truth: Project induction creates conformant authority documents. Those documents are invariant authority for downstream traversal. Product materialization derives concrete product-file obligations from the conformed PRODUCT.md/requirements/context authority when possible, otherwise carries visible missing/ambiguous target lineage into F_P. F_P receives target binding, allowed roots, authority refs, requirement pressure, and lineage context; closure comes only from observed product files and admitted traversal consequence truth.
superseded_truth: Product materialization targets are present only if a fixture/context JSON contains expectedFiles; component_code_surface.md is treated as the product output artifact; missing product files cause retry of the same materialization edge with an empty target contract; retry prompt prose carries the target expectation without typed product-file obligations.
closure_law: This ticket closes only when a fresh installed external data_mapper workspace can run conformance, derive product materialization targets from the conformed documents already present in the workspace, invoke product materialization with a non-empty typed product-file target contract, observe materialized source/build files under build_tenants/<tenant>/, publish admitted traversal consequence carriers, and return a typed close/yield/retry/block result without unbounded retry.
non_closure_conditions:
  - declaredProductFileTargets remains empty when conformed PRODUCT.md contains an Expected Product Files tree.
  - Product materialization proceeds with empty or ambiguous target authority without making that condition visible to F_P, public gaps, and replay.
  - Fg_materialize_declared_product_asset uses build_tenants/<tenant>/design/component_code_surface.md as the only required product output when productMaterialization.required is true.
  - A design note, component_code_surface.md, worker prose, handoff_manifest, or runtime asset closes product materialization without admitted product-file evidence.
  - Missing product files produce an automatic retry loop with the same empty target contract.
  - Same-edge retry can exceed five retry dispositions without closing, yielding, blocking, repairing, repricing, or changing the observed basis.
  - Same-edge yield can exceed twenty yield dispositions without closing, blocking, repairing, repricing, or carrying replay-visible progress/resume truth.
  - Public gaps cannot show which invariant authority produced the expected product-file obligations.
  - Tests only prove JSON expectedFiles fixtures and do not cover conformed PRODUCT.md as the target source.
---

# T-143: Derive Product Materialization Targets From Conformed Authority Documents

## STDO Triage

First missing layer: design.

The product requirement is not changing. The live defect is in realization
structure: the framework treats context JSON `expectedFiles` as the only
machine-readable source for concrete product materialization targets, even
after induction has created the conformed authority documents that are supposed
to become invariants.

Correct model:

```text
source folder / bootstrap document
  -> Fg_conform_project_authority
  -> conformed authority documents
       INTENT.md
       PRODUCT.md
       GOALS.md
       specification/requirements/*
       .ai-workspace/context/*
  -> invariant authority for downstream traversal
  -> evaluate_next derives product-file obligations
  -> Fg_materialize_declared_product_asset applies requirements over worksite
  -> product files under build_tenants/<tenant>/
```

The current implementation gets the first half right and then drops the
invariant authority before materialization.

## Root Cause Analysis

### What The Live Run Proved

External sandbox:

```text
/Users/jim/src/apps/ai_sdlc_examples/local_projects/data_mapper/data_mapper.test_ts_live_20260510T152802Z
```

Installed and executed as an actual downstream workspace:

```text
./node_modules/.bin/odd-sdlc-ts install
./node_modules/.bin/odd-sdlc-ts gaps --workspace .
./node_modules/.bin/odd-sdlc-ts start --workspace . --target next --until blocked
./node_modules/.bin/odd-sdlc-ts start --workspace . --target next --until first_traversal --worker 'process://claude?model=sonnet&effort=xhigh'
```

Observed sequence:

```text
Fg_conform_project
  -> converged
Fg_conform_project_authority
  -> worker exited 0
  -> postflight passed
  -> next edge Fg_materialize_declared_product_asset
Fg_materialize_declared_product_asset
  -> worker exited 0
  -> postflight blocked
  -> automatic retry attempt started with same empty target contract
```

The conformed documents are present and contain the required invariant truth.

Evidence from the live workspace:

```text
specification/PRODUCT.md
```

The `Expected Product Files` section says:

```text
build_tenants/scala_spark/
  build.sbt
  project/
  cdme-compiler/src/
  cdme-assurance/src/
  cdme-executor/src/
  cdme-adjoint/src/
  cdme-accounting/src/
  cdme-fidelity/src/
  cdme-engine/src/
```

The same file also declares:

```text
Selected Output Root: build_tenants/scala_spark
Compile: sbt compile
Test: sbt test
```

The materialization worker package nevertheless contained:

```text
targetAssetType: component_code_surface
outputFile: build_tenants/scala_spark/design/component_code_surface.md
materializationRequired: true
requiredRoles: source
declaredProductFileTargets: []
```

That is the fault line. The worker was told product materialization was
required, but was not given the concrete product targets already available in
the conformed authority.

### Code-Level Cause

The current target derivation is too narrow:

```text
build_tenants/typescript/code/src/operator/handoff.ts
  declaredProductFileTargets(manifest)
```

It only scans:

```text
.ai-workspace/context/*.json
```

and only admits values from:

```text
expectedFiles: [...]
```

The full external data_mapper workspace does not have a context JSON
`expectedFiles` array. It has the richer, correctly conformed authority in
`specification/PRODUCT.md` plus requirements/context documents.

The result is:

```text
declaredProductFileTargets: []
```

Then the worker receives contradictory directives:

```text
Product materialization is REQUIRED for this edge.
Declared product file targets: none.
For declared product materialization, materialize the declared product file targets; use minimal structure only when no topology authority is present.
```

The worker reasonably writes a design artifact:

```text
build_tenants/scala_spark/design/component_code_surface.md
```

The framework postflight then correctly blocks because no product source files
were observed:

```text
materialized_product_files_missing
materialized_product_role_missing:source
```

The second defect is continuation control. After the blocked postflight, the
runner started another worker attempt on the same edge with the same empty
contract:

```text
.ai-workspace/runtime/odd_sdlc/operator-runs/20260510T153936542Z_pid18312/
```

That retry is not automatically unlawful. An F_P agent can recover from an
under-specified materialization package if the retry prompt makes the failure
visible and tells the agent to inspect the conformed authority, especially:

```text
specification/PRODUCT.md
```

But the framework must bound this recovery lane. The retry is only a lawful
pressure release while it remains replay-visible and finite.

Required default breaker policy:

```text
retry dispositions: max 5 for the same edge before typed block/repair/reprice
yield dispositions: max 20 for the same edge before typed block/repair/reprice
```

This policy is intentionally asymmetric. Yield is lawful iterate: same edge
remains open, waiting/progress is admitted, and resume truth is replay-visible.
Retry is corrective re-entry after a failed/partial attempt, so it gets less
budget.

For this data_mapper defect, the bounded retry may allow recovery by reading
the conformed `PRODUCT.md`. It must not allow unbounded repetition with the
same empty target contract.

## Prior Miss

T-141 and T-142 corrected the high-level spine:

```text
induction closes as induction
requirements become downstream transformation-set pressure
evaluate_next selects product materialization
```

But they did not fully exercise the source of product-file targets for a real
external project whose authority lives in conformed Markdown documents rather
than fixture JSON.

The narrow proof succeeded because hello-world lanes can inject or infer simple
targets. Full data_mapper needs the framework to read the conformed product
definition as invariant authority.

## Current Miss

The current line still confuses three surfaces:

1. `component_code_surface.md`
   - a design/induction artifact describing the component code surface.
   - useful evidence, not the product source role.

2. `specification/PRODUCT.md`
   - conformed invariant authority after induction.
   - owns expected product topology, selected output root, build/test contracts,
     module structure, and execution entry.

3. `build_tenants/<tenant>/**`
   - actual product realization workspace.
   - owns source, test, build config, project files, and executable product
     artifacts.

The product-materialization edge must transform (2) over the current worksite
into (3). It may emit (1) as evidence or planning support, but (1) cannot
satisfy `requiredRoles: ["source"]`.

## Required Fix

### 1. Promote Product Materialization Target Contract

Add or extend an existing carrier so product file targets are not just a
prompt-local string list.

Candidate shape:

```text
SdlcProductMaterializationTargetContract
  kind
  contractRef
  authorityRefs
  sourceAuthorityRefs
  activeTenant
  selectedOutputRoot
  buildExecutionContract
  testExecutionContract
  requiredRoles
  expectedProductFileTargets
  expectedProductDirectoryTargets
  moduleTargets
  executionEntryRefs
  derivationStatus
  derivationReasons
```

This can be folded into `SdlcProductMaterializationContract` if that is cleaner,
but the contract must become a replay-visible carrier that both worker handoff
and postflight read.

### 2. Derive Targets From Conformed Authority Documents

Target derivation must read the invariant authority produced by
`Fg_conform_project_authority`, not only context JSON.

Minimum authority sources:

```text
specification/PRODUCT.md
specification/requirements/*
.ai-workspace/context/project_constraints.yml
.ai-workspace/context/project_bootstrap.md
conformed_project.json
```

Required extraction for the current data_mapper shape:

```text
Selected Output Root -> build_tenants/scala_spark
Expected Product Files -> build.sbt, project/, module src/ directories
Module Structure -> cdme-compiler, cdme-assurance, cdme-executor, cdme-adjoint, cdme-accounting, cdme-fidelity, cdme-engine
Build/Test Contract -> sbt compile / sbt test
Execution Entry -> CdmeEngineRunner
```

Directory targets are lawful. A directory target such as
`cdme-compiler/src/` is a worker-facing product-topology hint and an admission
evidence basis. Whether a concrete file beneath it satisfies source/build/test
meaning is supplied by F_P output and any declared tenant/capability validator,
then admitted or rejected by postflight and traversal consequence truth.

### 3. Keep Target Ambiguity F_P-Visible, Not F_D-Gated

If product materialization is required and the framework cannot derive a
non-empty product target contract from invariant authority, that fact is not
automatically an F_D pre-dispatch block.

The default constructive stance favors F_P. The framework should dispatch the
worker with visible lineage when the action is published, binding is lawful,
write roots are safe, and no irreversible/operational side effect is being
attempted. The worker package must make the missing or ambiguous target basis
explicit:

```text
product_materialization_authority.status = missing | ambiguous
reasonRefs = declared_product_file_targets_missing | product_context_target_mismatch | ...
sourceRefs = PRODUCT.md / requirements / context refs
selectedOutputRoot
allowedWriteRoots
requirementTraceObligationIds
```

F_D may block dispatch only for hard-stop prerequisites:

```text
unpublished action
invalid target binding
unsafe write root
missing worker/capability for an executional edge
undeclared irreversible side effect
missing authority, where no constructive recovery basis exists
```

Otherwise, missing/ambiguous target authority is constructive pressure. F_P
must see it and decide how to transform the workspace. The prompt/package must
explicitly name the authority to inspect:

```text
inspect specification/PRODUCT.md Expected Product Files
derive product file/directory targets
materialize source/build files under selected output root
report materialized files and rationale
```

F_D blocks closure/admission after F_P returns when the observed result does not
satisfy the declared obligation evidence. It does not replace the constructive
decision. The recovery path is capped by the retry breaker: five retry
dispositions for the same edge. After that, the runner must emit typed
block/repair/reprice truth. It must not start an unbounded retry loop with the
same empty target basis.

### 4. Separate Design Artifact From Product Source Satisfaction

`component_code_surface.md` can remain a tenant-local design output, but it
must not be the required product output when `productMaterialization.required`
is true.

Product evidence should come from observed files such as:

```text
build_tenants/scala_spark/build.sbt
build_tenants/scala_spark/project/build.properties
build_tenants/scala_spark/project/plugins.sbt
build_tenants/scala_spark/cdme-compiler/src/main/scala/...
...
```

Build config, source, test, documentation, and design roles are admitted from
worker-reported and observed evidence. Stack-specific role semantics belong to
declared tenant/capability validators, not hidden core runtime grammar. Core
SDLC must not hard-code SBT, Scala, Rust, or directory naming law as generic
product closure.

### 5. Bind Target Contract Into Worker Prompt

The prompt/package should say:

```text
Product materialization is REQUIRED.
Expected product file/directory targets:
  build.sbt
  project/
  cdme-compiler/src/
  ...
Do not satisfy source role by writing design/component_code_surface.md.
Materialize product files under build_tenants/scala_spark.
Use requirements as the transformation set.
If target inventory is missing or ambiguous, inspect the listed authority refs
and report the topology you derived.
```

This must come from structured package fields, not only prose.

### 6. Preserve Replay And Lineage

The target contract must cite causal predecessor refs:

```text
conformed_project.json
specification/PRODUCT.md digest/ref
specification/requirements/* refs
project_constraints.yml ref
SdlcTargetObligationBinding refs
SdlcNextActionProjection refs
ConstructionIntent refs
```

Replay must reconstruct the same product-materialization target contract from
those refs. If it cannot, the edge is non-replayable and must fail A13.

## Required Implementation Surfaces

### `operator/handoff.ts`

- Replace or extend `declaredProductFileTargets(manifest)` so it reads the
  conformed product authority, not just `.ai-workspace/context/*.json`.
- Add parser/adapter for `PRODUCT.md` Expected Product Files.
- Preserve existing JSON `expectedFiles` support as one input, not the only
  input.
- Include target contract fields in `constructWorkerInvocationPackage`.
- Ensure output directives distinguish design output from product file targets.
- Ensure product materialization postflight records observed files and role
  evidence against the contract without hard-coding tenant-specific ecosystem
  grammar as generic SDLC law.

### `operator/carriers.ts`

- Add/extend product materialization target carrier types.
- Make expected file/directory/module targets typed and replay-visible.
- Keep role typing explicit as worker/validator evidence: `source`, `test`,
  `build_config`, `design`, `documentation`, `other`.

### `workspace/project_authority_conformance.ts`

- Ensure conformed PRODUCT.md is treated as machine-readable-enough authority
  for target derivation.
- If possible, emit a structured companion target contract while writing
  PRODUCT.md so downstream parsing is deterministic.
- Do not require source projects to provide a JSON `expectedFiles` sidecar when
  PRODUCT.md already carries the product topology.

### `workspace/project_profile.ts` / `bootstrap_lineage.ts`

- Carry selected output root, tenant, module structure, build/test contracts,
  and expected product topology into conformed project/profile lineage.
- Preserve source refs and digests for replay.

### `operator/installed_operator.ts`

- Do not refuse F_P dispatch solely because product target inventory is empty
  or ambiguous. Carry that condition into the worker package as lineage and
  constructive pressure.
- Route unchanged missing/ambiguous target basis to typed closure
  decision/no-action only after the bounded recovery lane is exhausted, or when
  a true hard-stop prerequisite is present.
- Add disposition-aware re-entry circuit breakers:
  - retry: max 5 same-edge retry dispositions;
  - yield: max 20 same-edge yield dispositions;
  - both must be replay-visible in the installed start loop.
- Prevent same-edge retry from continuing past the breaker with the identical
  failed empty target contract.

### `projection/query_domain.ts` and `spec_method/entry.ts`

- Expose product materialization target contract refs in public gaps.
- Show whether expected product targets were derived from conformed authority.
- Keep public view read-only and non-executable.

## Required Tests

### Deterministic Unit / Functional Tests

Add a focused test, likely:

```text
test_t143_product_materialization_targets_from_conformed_authority.test.mjs
```

Required cases:

1. `PRODUCT.md` expected file tree produces a non-empty product target contract.
2. Directory targets such as `cdme-compiler/src/` are admitted as directory
   target hints without core stack-specific role grammar.
3. Context JSON `expectedFiles` remains supported but is not required when
   PRODUCT.md contains the topology.
4. Empty target inventory is visible to F_P as `missing` target authority and
   does not become a hidden dispatch gate.
5. Product materialization cannot close from `component_code_surface.md` alone
   without admitted product-file evidence.
6. Tenant-specific file-role semantics are left to declared validators or F_P
   worker evidence, not core runtime path grammar.
7. Source files reported by F_P under module paths can satisfy product-file
   evidence when admitted by postflight.
8. Same-edge retry is blocked when the target contract basis is unchanged and
   still empty after five retry dispositions.
9. Public gaps exposes target-contract refs and blocking reasons read-only.
10. Same-edge yield is blocked after twenty yield dispositions.

### Live / Live-Equivalent Test

Use the external data_mapper template as the definitive regression shape:

```text
/Users/jim/src/apps/ai_sdlc_examples/local_projects/data_mapper/data_mapper.template
```

The lane must:

1. Copy the template into a new external sandbox.
2. Install the latest local odd_sdlc TypeScript package into that sandbox.
3. Run from inside the sandbox with:

```text
./node_modules/.bin/odd-sdlc-ts gaps --workspace .
./node_modules/.bin/odd-sdlc-ts start --workspace . --target next --until blocked
./node_modules/.bin/odd-sdlc-ts start --workspace . --target next --until first_traversal --worker 'process://claude?model=sonnet&effort=xhigh'
```

4. Stop after confirming the materialization package carries product-file
   targets derived from conformed PRODUCT.md, or a replay-visible `missing` /
   `ambiguous` authority status with source refs.
5. For full live proof, continue until the worker produces product-file
   evidence under the declared output root, or returns a typed closure reason
   that is not an unbounded empty-contract retry.

Do not use odd_sdlc internal harness shortcuts as the only proof. The test must
exercise the installed downstream workspace path.

## Required Closure Evidence

Closure note must cite:

1. The new product materialization target contract carrier/type.
2. The extraction source for the data_mapper `PRODUCT.md` Expected Product
   Files section.
3. A test showing `declaredProductFileTargets` is non-empty without JSON
   `expectedFiles`.
4. A test showing `component_code_surface.md` alone cannot close product
   materialization without admitted product-file evidence.
5. A test showing empty target authority is carried to F_P as visible lineage
   rather than hidden prompt absence or unbounded retry.
6. A live or live-equivalent external data_mapper run archive.
7. The resulting `SdlcEdgeFulfillmentLedger`, `SdlcEdgeClosureDecision`, and
   `SdlcNextActionProjection` refs, when a product edge is invoked.

## Migration Declaration

Old truth path:

```text
.ai-workspace/context/*.json expectedFiles
  -> declaredProductFileTargets
  -> prompt prose
  -> postflight materializedFiles
```

New truth path:

```text
conformed authority documents + project profile/context
  -> ProductMaterializationTargetContract
  -> SdlcTargetObligationBinding / ConstructionIntent
  -> worker invocation package
  -> observed product files
  -> SdlcEdgeFulfillmentLedger
  -> SdlcEdgeClosureDecision
  -> SdlcNextActionProjection
```

Hard break rule: product materialization cannot silently proceed with an empty
target contract when conformed authority exists or when materialization is
required. It must either derive targets or carry a replay-visible
missing/ambiguous target-authority status into F_P and public projections.
F_D blocks closure/admission; F_D blocks dispatch only for hard-stop
prerequisites.

## Migration Checklist

- [x] Inventory existing uses of `declaredProductFileTargets`.
- [x] Add/extend typed target contract carrier.
- [x] Derive target contract from conformed PRODUCT.md and project profile.
- [x] Preserve JSON `expectedFiles` as an additional source with visible refs.
- [x] Bind target contract into worker invocation package.
- [x] Add retry/yield circuit breakers: retry max 5, yield max 20.
- [x] Carry empty/ambiguous target authority into F_P as visible lineage rather
      than a hidden missing prompt field.
- [ ] Route unchanged missing/ambiguous target basis to typed closure after the
      bounded F_P recovery retry lane is exhausted.
- [ ] Update public gaps to show target-contract status and refs.
- [x] Add deterministic T-143 tests.
- [ ] Add external data_mapper live/live-equivalent proof.
- [ ] Record closure note with run archive and consequence carrier refs.

## Functional Review Criteria

Reviewers should answer:

1. Does product materialization derive concrete target obligations from the
   conformed documents already present in the workspace?
2. Can a design artifact still masquerade as source-role product evidence?
3. Does the worker package tell F_P exactly which files/directories to create?
4. Does missing/ambiguous target authority remain visible to F_P and replay
   without becoming an F_D dispatch gate?
5. Does retry require changed basis evidence, or can it loop with the same
   empty target contract?
6. Are public gaps read-only and sufficient to diagnose the target-contract
   failure?
7. Can replay reconstruct the target contract from causal predecessor refs?

## Implementation Notes

### 2026-05-11 Circuit-Breaker Slice

Landed the bounded continuation guard before the full target-contract repair:

```text
retry dispositions: max 5
yield dispositions: max 20
other re-entry dispositions: max 5
```

The installed start loop now records closure disposition and a re-entry basis
ref on each loop attempt, carries `exhaustedDisposition` on the loop summary,
and distinguishes `retry_guard_exhausted`, `yield_guard_exhausted`, and
`reentry_guard_exhausted`.

Validation:

```text
npm run test:t143
npm run test:t140
```

This is not ticket closure. The primary T-143 work remains: derive the concrete
product materialization target contract from conformed authority documents,
especially `specification/PRODUCT.md`, so the recovery lane is exceptional
rather than normal.

### 2026-05-11 Product Authority Reconciliation Slice

Landed the first semantic linter/check for the failure class:

```text
specification/PRODUCT.md Expected Product Files
+ .ai-workspace/context/*.json expectedFiles
  -> sdlc_product_materialization_authority_reconciliation
  -> outputContract.declaredProductFileTargets
```

`SdlcWorkerInvocationPackage` now carries
`productMaterializationAuthority`, including:

- `contextExpectedFileTargets`
- `productAuthorityTargets`
- `declaredProductFileTargets`
- per-target source/sourceRef lineage in `declaredProductTargetContracts`
- `sourceRefs`
- `reasonRefs`

The parser handles both the hello-world `Declared Product Files` bullet style
and the data_mapper `Expected Product Files` tree style. Worker-facing package
refs are workspace-relative, not host-absolute.

Validation:

```text
npm run test:t143
node --test test_env/tests/test_t118_worker_invocation_package.test.mjs
npm run test:t140
npm run test:t066
```

Remaining work in this ticket is now narrower:

- bounded-recovery on unchanged empty/ambiguous target authority;
- expose the reconciliation status/refs through public gaps;
- run the external data_mapper live/live-equivalent proof against the installed
  downstream workspace path.

## Impacted Interface Review Checklist

- [ ] CLI `start --target next` keeps the same command shape.
- [ ] Installed downstream workspaces do not require new manual JSON sidecars.
- [ ] Existing hello-world lanes still pass.
- [ ] Existing context JSON `expectedFiles` fixtures still pass.
- [ ] Full data_mapper template gets a non-empty target contract from
      `PRODUCT.md`.
- [ ] Worker prompt/package remains compact and structured.
- [ ] No new action-selection surface is introduced.
- [ ] No new ledger is introduced beside T-109/T-136/T-138 carriers.

## Break-To-Closure Map

1. Break hidden empty-target dispatch:
   - Carry missing/ambiguous target authority into F_P as explicit lineage and
     bounded recovery pressure.
   - Closure proof: empty target authority is visible in the worker package and
     retry stops after five retry dispositions if the basis does not change.

2. Break context-JSON-only target derivation:
   - Add conformed-authority target extraction.
   - Closure proof: data_mapper PRODUCT.md yields target rows without JSON
     `expectedFiles`.

3. Break design-as-product closure:
   - Ensure design output is evidence/planning support, not sufficient product
     materialization closure by itself.
   - Closure proof: component_code_surface.md alone does not close the product
     materialization edge.

4. Restore materialization consequence:
   - Observe product files against the typed target contract.
   - Closure proof: ledger/decision/projection cite target contract and observed
     files.

5. Bound lawful iteration:
   - Add disposition-aware installed-loop circuit breakers.
   - Closure proof: retry stops at 5; yield stops at 20; terminal reason names
     the exhausted disposition.

## Mixed-State Negative Proof

The implementation must reject these mixed states:

1. `productMaterialization.required=true` and `declaredProductFileTargets=[]`
   with no visible missing/ambiguous authority status and unbounded retry.
2. `component_code_surface.md` exists, no product-file evidence exists, and edge closes.
3. `PRODUCT.md` Expected Product Files exists, but public gaps says no product
   target contract is available.
4. Retry continues past five retry dispositions with the same target-contract
   basis after a missing/ambiguous target-authority result.
5. JSON `expectedFiles` and PRODUCT.md conflict silently. Conflict must become
   typed ambiguity or a deterministic precedence rule with visible refs.
