---
id: T-047
title: Realize TypeScript pre-refactor sandbox proof lane
type: qualification
ticket_category: build_wave_blocker
status: completed
goal: build-odd-sdlc-typescript-as-odd-native-app
change_intent: Establish a repeatable TypeScript sandbox proof lane before any consolidation refactor changes the current implementation shape.
change_class: design_reframe
re_entry_point: design
affected_boundary: TypeScript sandbox harness, run archive framework, data_mapper scenario proof, postmortem evidence, consolidation-refactor gate
priority: critical
triaged_at: 2026-04-26
created_at: 2026-04-26
updated_at: 2026-04-26
completed_at: 2026-04-26T07:42:37Z
dependencies:
  - T-038 completed
  - T-040 completed
  - T-041 remains backlog for the wider operational Python-replacement RC lane
blocks:
  - TypeScript consolidation refactor
governance_scope: STDO Method
governance_scope_expansion:
  - S: SPEC_METHOD.md
  - T: TICKET_METHOD.md
  - D: DESIGN_MODULE_METHOD.md
  - O: ODD_METHOD.md
intake_source: Operator decision that sandbox proof must exist before refactoring the TypeScript tenant.
target_truth: odd_sdlc.TS has a repeatable, archived sandbox lane that proves composed GTL/ABG/SDLC behavior and records expected versus actual traversal evidence before consolidation refactor work begins.
superseded_truth: The existing semantic lane, in-process T-038 scenario, and optional data_mapper reference test are enough governance evidence to start consolidation.
closure_law: This ticket closes only when the TypeScript tenant has an explicit sandbox command, archived run evidence, data_mapper-shaped scenario coverage, expected/actual traversal sequence analysis, timing evidence, and a postmortem that states which operational claims remain deferred to T-041.
---

# T-047: Realize TypeScript Pre-Refactor Sandbox Proof Lane

## Hard Gate

No TypeScript consolidation refactor starts until this ticket closes.

The completed T-038 scenario is useful but insufficient. It is an in-process
semantic qualification test. It does not create the sandbox archive, event
sequence evidence, timing record, or postmortem surface needed to protect a
large structural refactor.

T-041 remains the full operational Python-replacement RC lane. This ticket is
narrower and earlier: prove the sandbox lane that protects the refactor.

## STDO Reading

### S: Spec Method

This is a `design_reframe` entry point. The product claim does not widen to
Python operational replacement. The current design/test proof boundary changes:
pre-refactor closure now requires sandbox evidence, not only unit and reference
tests.

This ticket must not rewrite `INTENT.md`, `PRODUCT.md`, or requirements unless
the sandbox work proves those surfaces are false.

### T: Ticket Method

This is the durable work authority for the pre-refactor TypeScript sandbox
proof lane.

It is not a comment, strategy note, or implicit subtask of T-041. It is the
active ticket under which the sandbox work is built.

This ticket carries one tenant lifecycle: odd_sdlc TypeScript. Python remains
comparison evidence only. ABG remains substrate authority; if ABG must expose a
missing reusable sandbox framework surface, that requires a linked upstream
abiogenesis ticket rather than hidden odd_sdlc drift.

### D: Design Module Method

The sandbox proof must be design/module-derived:

- sandbox archive data has typed carriers
- expected traversal sequence is declared before execution
- actual traversal sequence is recorded after execution
- comparison is evaluated deterministically
- failures produce governed diagnostics, not loose logs
- tests prove module behavior and composed traversal behavior

The lane must not be a one-off script that bypasses module boundaries.

### O: ODD Method

The sandbox must prove the ODD shape:

- graph functions remain the constructive carrier
- ABG remains traversal/runtime/provenance authority
- SDLC contributes domain meaning, domain carriers, hooks, query overlays, and
  proof interpretation
- outcome traversal evidence outranks imperative helper success
- imperative code is admitted only as a bounded adapter around graph-function
  and archive carriers

## Required Sandbox Set

The minimum pre-refactor sandbox set is:

1. `npm run test:sandbox`

   A first-class TypeScript package script. It must run from
   `build_tenants/typescript` and must not be hidden behind an ad hoc command.

2. Archived run evidence

   Each sandbox run must create or refresh evidence under:

   ```text
   build_tenants/typescript/test_env/test_runs/
   ```

   The archive must record:

   - command
   - package root
   - scenario id
   - scenario authority
   - start/end timestamps
   - elapsed time
   - expected event sequence
   - actual event sequence
   - verdict
   - diagnostics
   - gap list

3. Composed SDLC traversal scenario

   The sandbox must exercise the current composed path:

   ```text
   ingress
   -> query/start
   -> public ABG handoff
   -> constructor/evaluator hook evidence
   -> requirement closure proof
   -> triage route
   -> operational transition/result admission
   -> runtime-return observation
   ```

   The scenario must assert the event sequence. Printing the sequence is not
   enough.

4. `data_mapper`-shaped scenario

   The sandbox must use the current real-world `data_mapper` fixture as the
   reference shape, or a checked-in minimized fixture explicitly derived from
   it. The archive must state which source was used.

5. Postmortem report

   The run must produce a postmortem comment or report that states:

   - what was expected
   - what actually happened
   - elapsed time
   - which graph functions were exercised
   - which typed carriers were admitted
   - which evidence was archived
   - what failed or remained unproven
   - which residuals remain T-041 scope

## Explicit T-041 Boundary

This ticket does not close the full Python-replacement RC claim.

The following remain T-041 unless this ticket is explicitly repriced:

- live external `F_P` worker execution
- final install/normalize operational adapter
- public CLI replacement claim
- release-cut packaging and binary binding
- full archive comparison against Python live runs

This ticket may compare against Python sandbox precedent, but it must not copy
Python file boundaries as design authority.

## Evaluation Criteria

- A package script named `test:sandbox` exists and is documented in the
  TypeScript test surface map.
- The sandbox run records a structured archive under
  `build_tenants/typescript/test_env/test_runs/`.
- The archive includes timing, expected event sequence, actual event sequence,
  verdict, and diagnostics.
- The sandbox exercises composed GTL/ABG/SDLC behavior rather than isolated
  helper calls.
- The `data_mapper` fixture or a declared minimized derivative is part of the
  sandbox proof.
- The postmortem identifies every residual claim deferred to T-041.
- The final closure review states whether consolidation refactor may begin.

## Non-Closure Conditions

This ticket must remain open if any of the following are true:

- only `npm run test:semantic` passed
- only T-038 passed
- only the optional `test:reference:data-mapper` lane passed
- no sandbox archive was written
- expected and actual traversal sequences were not compared
- elapsed time was not recorded
- `data_mapper` shape was not exercised or explicitly substituted
- the sandbox bypassed graph-function authority with product-local imperative
  orchestration
- ABG runtime/provenance authority was replaced by an odd_sdlc-only loop
- Python behavior was copied without repricing into ODD-native TypeScript
  carriers and graph-function proof
- the closure review claims Python operational replacement
- consolidation refactor begins before this ticket closes

## Work Plan

- [x] Inventory the existing Python sandbox/archive precedent and ABG TypeScript
  sandbox framework precedent.
- [x] Decide whether the first TypeScript sandbox consumes ABG's reusable
  sandbox framework directly or records an upstream ABG export gap.
- [x] Define TypeScript sandbox archive carriers and deterministic evaluators.
- [x] Add `npm run test:sandbox`.
- [x] Add the composed SDLC traversal sandbox scenario.
- [x] Bind the `data_mapper` reference shape into the sandbox lane.
- [x] Run the sandbox and record archived evidence.
- [x] Publish the postmortem report.
- [x] Run STDO closure review before allowing consolidation refactor.

## Closure Evidence

Landed surfaces:

- `build_tenants/typescript/code/src/qualification/sandbox_proof.ts`
- `build_tenants/typescript/test_env/sandbox/test_t047_pre_refactor_sandbox.test.mjs`
- `build_tenants/typescript/package.json` adds `npm run test:sandbox`
- `build_tenants/typescript/test_env/test_surface_map.md` records the T-047 lane
- `.ai-workspace/comments/codex/20260426T073904Z_POSTMORTEM_t047_typescript_pre_refactor_sandbox_proof_lane.md`
- `.ai-workspace/tickets/backlog/T-048-track-abg-m05-sandbox-archive-framework-public-export-for-common-sandbox-convergence.md`

Latest local archive:

```text
build_tenants/typescript/test_env/test_runs/typescript_pre_refactor_sandbox/20260426T074237344Z_pid38320
```

Verification:

```text
npm run test:sandbox
npm run test:semantic
npm run lint:semantic
ODD_SDLC_DATA_MAPPER_TEMPLATE_ROOT=/Users/jim/src/apps/ai_sdlc_examples/local_projects/data_mapper/data_mapper.template npm run test:reference:data-mapper
```

Result:

- `test:sandbox` passed: 1 test.
- `test:semantic` passed: 54 tests.
- `lint:semantic` passed.
- `test:reference:data-mapper` passed: 1 test.

STDO closure:

```text
S: pass — product claim stayed bounded; this closes only the pre-refactor sandbox gate.
T: pass — T-047 carried the sandbox work; T-041 remains full operational replacement; T-048 records the common-framework dependency.
D: pass — sandbox carriers, event sequence, archive, and tests are module-derived.
O: pass — GTL graph functions and ABG runtime truth remain the constructive carrier.

Verdict:
  consolidation_refactor_gate: closed
  T-041_residuals: live F_P, installed CLI, Python live comparison
  T-048_residuals: public ABG M05 sandbox/archive framework export
```

## Closure Review Template

Use this exact closure shape:

```text
S: pass/fail — product claim stayed bounded; any upstream truth changes were repriced.
T: pass/fail — T-047 carried the work; T-041 residuals remained separate.
D: pass/fail — sandbox carriers, event sequence, archive, and tests are module-derived.
O: pass/fail — GTL graph functions and ABG runtime truth remain the constructive carrier.

Verdict:
  consolidation_refactor_gate: open|closed
  T-041_residuals: listed
```
