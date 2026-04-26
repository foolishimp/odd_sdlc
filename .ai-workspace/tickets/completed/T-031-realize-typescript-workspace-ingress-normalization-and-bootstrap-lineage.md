---
id: T-031
title: Realize TypeScript workspace ingress normalization and bootstrap lineage
type: feature
ticket_category: build_wave
status: completed
goal: build-odd-sdlc-typescript-as-odd-native-app
change_intent: Translate Python normalization and imported-workspace lessons into typed TypeScript ingress carriers and bootstrap lineage without copying Python installer orchestration.
change_class: realization_refactor
re_entry_point: realization
affected_boundary: workspace admission, imported source authority, project bootstrap, ambiguity register, requirement closure seed, normalization evidence
priority: high
triaged_at: 2026-04-26
created_at: 2026-04-26
updated_at: 2026-04-26
completed_at: 2026-04-26
dependencies:
  - T-030 completed
governance_scope: STDO Method
governance_scope_expansion:
  - S: SPEC_METHOD.md
  - T: TICKET_METHOD.md
  - D: DESIGN_MODULE_METHOD.md
  - O: ODD_METHOD.md
intake_source: Python `normalization.py`, `project_profile.py`, `imported_intent_carry_forward.py`, ABIogenesis TypeScript M05 bootstrap-lineage and data-mapper ingress proofs
target_truth: SDLC.TS can admit unstructured, loosely structured, or structured workspace input into typed bootstrap carriers and derive project/requirement lineage under ODD graph-function proof.
superseded_truth: Workspace normalization mutates files first and reconstructs semantic truth afterward from scattered runtime state.
closure_law: this ticket closes when TypeScript admits source files, digests, authority markers, ambiguity, and project constraints into typed carriers and proves `InputSet -> Project` lineage over a real imported fixture.
evaluation_criteria:
  - source input carrier records URI, digest, detected role, authority marker, and ambiguity
  - project constraints admission fails closed on malformed/stale shapes
  - imported requirement authority is carried into active requirement family seed truth
  - lineage answers which input produced each derived project element
  - proof compares Python normalization evidence without copying Python orchestration
proof_surface:
  - ingress carrier code
  - normalization admission tests
  - real data_mapper fixture sandbox test
  - lineage report/projection test
non_closure_conditions:
  - semantic authority inferred from path names alone
  - imported authority disappears after normalization
  - TS installer behavior is copied before typed ingress proof exists
---

## STDO Reading

This ticket is the bootstrap case: data enters conformantly before traversal.

## Closure Evidence

Completed on 2026-04-26.

Changed realization and proof surfaces:

- `build_tenants/typescript/code/src/workspace/carriers.ts`
- `build_tenants/typescript/code/src/workspace/source_input.ts`
- `build_tenants/typescript/code/src/workspace/project_constraints.ts`
- `build_tenants/typescript/code/src/workspace/bootstrap_lineage.ts`
- `build_tenants/typescript/code/src/workspace/ingress.ts`
- `build_tenants/typescript/code/src/workspace/index.ts`
- `build_tenants/typescript/code/src/index.ts`
- `build_tenants/typescript/design/ODD_SDLC_TYPESCRIPT_WORKSPACE_INGRESS_SEAMS.md`
- `build_tenants/typescript/package.json`
- `build_tenants/typescript/test_env/test_surface_map.md`
- `build_tenants/typescript/test_env/tests/test_t031_workspace_ingress.test.mjs`

Result:

The TypeScript tenant now admits source-input snapshots into typed ingress
carriers with URI, relative path, deterministic digest, detected role,
authority markers, and ambiguity state. It admits project constraints with
closed failure on stale/malformed shapes, carries imported requirement
authority into requirement seed truth, and projects bootstrap lineage over the
real `data_mapper.template` fixture without mutating that fixture.

Verification:

```text
npm run test:t031
npm run test:semantic
npm run lint:semantic
git diff --check
```

STDO review:

- `S`: implementation derives from normalization/imported-workspace
  requirements and does not add installer behavior as product truth.
- `T`: ticket closes with real fixture proof, negative admission proof, and
  lineage evidence.
- `D`: typed ingress carriers exist before workspace mutation or public start.
- `O`: ingress is an ODD input carrier/projection surface; graph execution and
  runtime truth remain separate.

## Correction Evidence

Claude review feedback on 2026-04-26 identified the first T-031 implementation
as too monolithic and at risk of repeating the Python `workspace_assets.py`
failure pattern tracked by T-019.

Correction applied:

- carrier vocabulary moved to `workspace/carriers.ts`
- source-input derivation and admission moved to `workspace/source_input.ts`
- project-constraint admission moved to `workspace/project_constraints.ts`
- bootstrap lineage projection moved to `workspace/bootstrap_lineage.ts`
- `workspace/ingress.ts` is now an export-only compatibility barrel
- `ODD_SDLC_TYPESCRIPT_WORKSPACE_INGRESS_SEAMS.md` records the module design
  and optimization rule

The ticket remains closed because behavior and proof are unchanged, but the
realization now follows the ODD role split rather than a like-for-like Python
move.
