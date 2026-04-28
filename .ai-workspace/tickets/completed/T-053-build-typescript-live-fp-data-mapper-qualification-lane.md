---
id: T-053
title: Build TypeScript live F_P data_mapper qualification lane
type: feature
ticket_category: rc_quality_gate
status: completed
goal: build-odd-sdlc-typescript-as-operational-candidate
change_intent: Add the missing odd_sdlc.TS live test lane so TypeScript can prove actual external F_P traversal over data_mapper instead of stopping at semantic, sandbox, or reference-fixture proof.
change_class: product_reprice
re_entry_point: product_definition
affected_boundary: TypeScript live test harness, external F_P worker transport, ABG-installed sandbox workspace, data_mapper fixture, live run archive, RC qualification report
priority: high
triaged_at: 2026-04-26T16:19:18Z
created_at: 2026-04-26T16:19:18Z
updated_at: 2026-04-26T17:38:48Z
closed_at: 2026-04-26T17:38:48Z
dependencies:
  - T-041
  - T-052 completed
  - abiogenesis/.ai-workspace/tickets/completed/T-076-realize-typescript-abg-installer-for-downstream-sandbox-population.md
governance_scope: STDO Method
governance_scope_expansion:
  - S: SPEC_METHOD.md
  - T: TICKET_METHOD.md
  - D: DESIGN_MODULE_METHOD.md
  - O: ODD_METHOD.md
intake_source: Operator challenge that Python has live tests while odd_sdlc.TS has no live external F_P test lane.
target_truth: odd_sdlc.TS publishes and runs a first-class live qualification lane that provisions an ABG-installed workspace, attaches an external F_P worker, traverses a data_mapper graph-function program, archives prompts/manifests/events/projections/results/postmortem evidence, and fails closed when worker dispatch does not occur.
superseded_truth: The broad T-041 full Python-replacement ticket is sufficient to track the concrete missing TypeScript live-test build-out.
closure_law: This ticket closes only when `npm run test:live` or an equivalently named TypeScript package script executes a live external F_P data_mapper traversal from an ABG-installed workspace, records an archive with worker dispatch and returned result evidence, and updates the RC qualification surfaces to distinguish passed live proof from remaining full operational replacement gaps.
---

# T-053: TypeScript Live F_P data_mapper Qualification Lane

## Problem

`odd_sdlc.TS` currently has semantic, harnessed sandbox, installed-sandbox, and
reference-fixture proof. It does not have a live external `F_P` qualification
lane.

Python has live qualification tests in
`build_tenants/python/test_env/tests/test_odd_sdlc_live_codex.py`. Those tests
are not TypeScript evidence, but they expose the proof class TypeScript is
missing: a live worker is attached, real probabilistic traversal is attempted,
and the run is archived.

The current TypeScript package has no `test:live` script. The RC report
correctly says live external `F_P` data_mapper generation is not claimed. That
is honest, but it is not enough for an operational candidate.

## Target Truth

TypeScript live qualification is a first-class proof lane.

The lane must:

1. provision a fresh workspace through the public ABG TypeScript installer
2. bind a declared external `F_P` worker transport
3. use the real `data_mapper.template` fixture as the scenario source
4. dispatch a published TypeScript graph-function program through ABG authority
5. archive the worker prompt, manifest, runtime events, projections, returned
   result, generated/updated asset surfaces, and postmortem
6. fail closed if no worker dispatch occurs, if only harnessed worker evidence
   is present, or if the result is not admitted back through the TypeScript
   hook/result contract

## Required Build Surfaces

- `build_tenants/typescript/package.json` script such as `test:live`
- live test file under `build_tenants/typescript/test_env/live/` or an
  equivalent explicit live proof directory
- reusable TypeScript live-run archive helper
- worker readiness probe with visible skip/fail semantics
- ABG-installed workspace fixture reuse from T-052
- data_mapper scenario binding
- RC report/test surface map update

## Evaluation Criteria

- `npm run test:live` exists.
- The live lane is skipped only when explicitly disabled or when the configured
  worker is unavailable; skip output must name the missing worker condition.
- When enabled, the lane records at least one actual external `F_P` worker
  dispatch and one returned result admission.
- The archive contains event sequence, prompt/manifest, worker identity,
  install manifest, result payload, projection evidence, and postmortem.
- The test fails if the run uses only deterministic fixtures, harnessed worker
  reports, or source-local helper paths.
- The RC qualification report stops saying live proof is absent only after this
  lane passes.

## Non-Closure Conditions

- TS live proof is inferred from Python live tests.
- TS live proof is inferred from `npm run test:sandbox`.
- the live lane bypasses ABG install or graph-function authority.
- worker output is accepted without TypeScript result admission.
- generated artifacts are claimed without archive evidence.

## Relationship To T-041

T-041 remains the broader full operational Python-replacement ticket. This
ticket is the concrete build-out for the missing TypeScript live `F_P`
qualification lane. Closing T-053 does not by itself close T-041 because T-041
also owns full CLI replacement, install/normalize behavior, release-cut
packaging, and Python comparison.

## Closure Evidence

Implemented surfaces:

- `build_tenants/typescript/package.json` publishes `npm run test:live`.
- `build_tenants/typescript/test_env/live/test_t053_live_fp_data_mapper.test.mjs`
  implements the live lane and skips unless `ODD_SDLC_TS_LIVE_FP=1`.
- `build_tenants/typescript/design/ODD_SDLC_TYPESCRIPT_LIVE_FP_DATA_MAPPER_QUALIFICATION.md`
  records the module design, ownership, non-ownership, and accepted proof.
- `build_tenants/typescript/qualification/ODD_SDLC_TYPESCRIPT_RC_QUALIFICATION_REPORT.md`,
  `build_tenants/typescript/qualification/ODD_SDLC_TYPESCRIPT_PYTHON_PARITY_RC_BLOCKER_MAP.md`,
  and `build_tenants/typescript/test_env/test_surface_map.md` distinguish
  closed live proof from the remaining T-041 full operational replacement gaps.

Accepted live run:

- command: `ODD_SDLC_TS_LIVE_FP=1 npm run test:live`
- result: passed, 1 test
- duration: `149909.146459ms`
- archive:
  `build_tenants/typescript/test_env/test_runs/t053_live_data_mapper/20260426T183216072Z_pid7194/`
- installed ABG runtime:
  `@abiogenesis/typescript-tenant@3.4.0-rc.2`
- target graph function: `bootstrap_release_self_test`
- selected edge graph function: `derive_code_surface`
- event sequence:
  `abg_installed_workspace -> public_start_projected -> external_fp_worker_dispatched -> worker_result_file_observed -> constructor_result_admitted -> hook_turn_closed`
- worker: `codex`, status `0`, elapsed `148813.489333ms`
- result digest:
  `sha256:c296f8a916f71df70e8d8d05ffe15b41db430f07e6d0211d8cfa2b8ac77b480b`

The run generated `generated/code_surface.ts` and `generated/work_report.json`
in the live worker workspace. The generated file was admitted through
`SdlcConstructorResult`, and `runSdlcHookTurn` closed postflight with
`hookPostflightStatus: passed`.

## Design Module Method Review

The live lane adds one qualification module. It does not add a production
runner or a second traversal engine. The module boundary is prime because it
owns only live qualification: ABG install evidence, public start projection,
external worker dispatch, returned artifact admission, hook outcome, and
archive writing.

Local optimization:

- live-run mechanics stay inside the live qualification module
- hook admission reuses the existing `hooks/` module split
- start authority reuses `publicStartOnce`
- ingress authority reuses `deriveSdlcWorkspaceIngressReport`

Global optimization:

- no Python tenant code is copied
- no product-local retry loop is introduced
- the accepted proof uses ABG-installed workspace evidence from T-052
- T-048 remains open for convergence on a reusable ABG M05 archive framework

## Residual Non-Claims

T-053 does not close:

- full `odd_sdlc` CLI replacement
- side-effecting install/normalize adapter
- release-cut packaging or public binary distribution
- Python live archive equivalence
- T-041 full operational Python-replacement RC
