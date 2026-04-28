---
id: B-069
title: Harden B-068 outcome-iteration sandbox gap and archive proof
type: bug
ticket_category: build_wave_followup
status: completed
goal: restore-test35-recursive-realization-capability-in-odd-native-typescript
change_intent: Preserve the B-068 outcome-iteration proof without interrupting current TypeScript build activity by capturing the remaining review faults as a later hardening ticket.
change_class: design_reframe
re_entry_point: design
affected_boundary: TypeScript B-068 enterprise-core sandbox, ABG retry budget interpretation, sandbox archive schema, T-047 fixture authority, TypeScript RC proof lane
priority: high
triaged_at: 2026-04-26
created_at: 2026-04-26
updated_at: 2026-04-26
completed_at: 2026-04-26
dependencies:
  - B-068 completed as the primary outcome-iteration capability ticket
  - T-047 completed as the pre-refactor sandbox proof lane
  - T-041 remains the full operational Python-replacement RC lane
blocks:
  - citing B-068 as complete negative-path proof
  - citing B-068 archive output as standalone handoff evidence
  - promoting environment-sensitive sandbox evidence as RC proof without fixture qualification
governance_scope: STDO Method
governance_scope_expansion:
  - S: SPEC_METHOD.md
  - T: TICKET_METHOD.md
  - D: DESIGN_MODULE_METHOD.md
  - O: ODD_METHOD.md
intake_source: Codex review of the revised B-068 TypeScript enterprise-core outcome-iteration sandbox.
target_truth: B-068 publishes a sandbox proof lane that either proves outcome iteration or archives a precise ABG gap, and whose run archive independently proves stateful re-entry handoff and fixture authority.
superseded_truth: The happy-path B-068 sandbox proof alone is sufficient to claim negative-path ABG gap archival, standalone handoff proof, and RC-grade fixture authority.
closure_law: This ticket closes only when the B-068 sandbox has a failing/non-convergent path test that produces a precise ABG gap, the archive records constructor input handoff evidence per attempt, and sandbox fixture authority is pinned or explicitly classified so RC proof cannot depend on mutable local fixture state.
evaluation_criteria:
  - a non-convergent constructor/evaluator scenario is tested
  - retry budget exhaustion, stationary retry, or retry-stop decisions produce an explicit `abgGap` rather than `successMode: failed` with no gap
  - `laneVerdict`, `capabilityVerdict`, and legacy `verdict` remain semantically distinct
  - gap-path tests assert `laneVerdict: passed`, `capabilityVerdict: not_proved`, and `verdict: failed` where the lane discovers a precise ABG gap
  - successful outcome-iteration tests still require at least two same-edge re-entries before convergence
  - each attempt record or adjacent archive evidence records the prior artifact state and unresolved reasons consumed by that attempt
  - the shareable `run.json` can prove stateful handoff without relying on the reader to inspect the scripted constructor implementation
  - the B-068 archive postmortem renders handoff evidence and gap evidence clearly
  - T-047 sandbox fixture mode is pinned for RC proof, or mutable local `data_mapper.template` use is explicitly marked forensic/local rather than RC authority
  - `test_surface_map.md` documents the successful path, the gap path, and the fixture authority boundary
proof_surface:
  - `build_tenants/typescript/code/src/qualification/enterprise_core_iteration_sandbox.ts`
  - `build_tenants/typescript/test_env/sandbox/test_b068_enterprise_core_outcome_iteration.test.mjs`
  - `build_tenants/typescript/test_env/sandbox/test_t047_pre_refactor_sandbox.test.mjs`
  - `build_tenants/typescript/test_env/test_surface_map.md`
  - archived B-068 happy-path and gap-path runs under `build_tenants/typescript/test_env/test_runs/`
non_closure_conditions:
  - a permanently blocked B-068 run exits with `successMode: failed` and `abgGap: null`
  - ABG retry budget exhaustion is inferred from loop termination rather than represented as event/gap evidence
  - handoff is only proven by the scripted constructor throwing on bad input
  - `run.json` lacks prior-state or unresolved-reason evidence for each re-entered attempt
  - a mutable local `data_mapper.template` fixture is treated as RC proof without a pinned digest, copied fixture, or explicit forensic classification
  - the ticket rewrites B-068's current happy-path work instead of hardening it as follow-up
---

# B-069: Harden B-068 Outcome-Iteration Sandbox Gap And Archive Proof

## Faults Captured

The revised B-068 sandbox is a credible happy-path proof of outcome iteration.
It still needs follow-up hardening before it can be used as a complete proof
surface.

First, non-convergence is under-specified. The runner uses the same
`maxAttempts` value as both the constructor loop bound and the ABG retry budget.
That can let a permanently blocked run plan a final retry and then leave the
loop with no final artifact and no `abgGap`. The lane must archive a precise
ABG gap for this case instead of reporting an unclassified failure.

Second, state handoff is currently proven by the scripted constructor's private
input checks. That is useful test pressure, but the archive should carry public
evidence that attempt 2 consumed attempt 1 state and blocking reasons, and that
attempt 3 consumed attempt 2 state and blocking reasons.

Third, the wider `test:sandbox` lane remains environment-sensitive through
T-047. It may consume Jim's mutable local `data_mapper.template` when present
and otherwise use a portable literal fixture. That is fine for forensic runs,
but RC proof must pin fixture authority or state clearly that mutable local
fixture evidence is not RC authority.

## STDO Reading

### S: Spec Method

This is a `design_reframe`. The target product claim does not widen. The proof
design changes so outcome-iteration evidence includes both success and bounded
non-convergence behavior.

### T: Ticket Method

This ticket is a follow-up to B-068, not a replacement for it. It exists so the
current TypeScript build wave can continue without losing the review defects.

### D: Design Module Method

The archive schema is part of the proof design. If the proof depends on
stateful re-entry, the archive must expose the state handoff, not only the final
artifact state.

### O: ODD Method

ABG owns retry, continuation, stop law, and gap evidence. The sandbox must not
convert bounded non-convergence into an untyped local failure when ABG has a
retry-stop or escalation concept available.

## Closure Evidence

Implemented:

- `build_tenants/typescript/code/src/qualification/enterprise_core_iteration_sandbox.ts`
- `build_tenants/typescript/code/src/qualification/enterprise_core_inventory.ts`
- `build_tenants/typescript/code/src/qualification/sandbox_proof.ts`
- `build_tenants/typescript/test_env/sandbox/test_b068_enterprise_core_outcome_iteration.test.mjs`
- `build_tenants/typescript/test_env/sandbox/test_t047_pre_refactor_sandbox.test.mjs`
- `build_tenants/typescript/test_env/test_surface_map.md`

The B-068 archive now records public handoff evidence per attempt:

- prior artifact attempt index
- prior source component inventory
- prior test component inventory
- prior build/test evidence state
- unresolved reasons consumed by the next attempt

The non-convergent path now archives ABG retry-stop evidence:

- archive:
  `build_tenants/typescript/test_env/test_runs/b068_enterprise_core_outcome_iteration/20260426T091252815Z_pid44331/`
- `laneVerdict=passed`
- `capabilityVerdict=not_proved`
- `verdict=failed`
- `successMode=abg_gap_detected`
- `abgGap=abg_retry_repair_stopped:retry_budget_exhausted`
- runtime event includes `retry_attempt_stopped`

The successful path still proves outcome iteration:

- archive:
  `build_tenants/typescript/test_env/test_runs/b068_enterprise_core_outcome_iteration/20260426T091252811Z_pid44331/`
- `laneVerdict=passed`
- `capabilityVerdict=proved`
- `verdict=passed`
- two same-edge re-entries before convergence

T-047 fixture authority is explicit:

- archive:
  `build_tenants/typescript/test_env/test_runs/typescript_pre_refactor_sandbox/20260426T091252859Z_pid44332/`
- `fixture_mode=external_data_mapper_template`
- `fixture_authority=forensic_local_reference`

Mutable local `data_mapper.template` evidence is therefore classified as
forensic/local reference evidence, not RC proof authority. The checked-in
portable fixture remains the RC lane authority when used.

Verification:

```text
npm run test:sandbox
npm run test:semantic
npm run lint:semantic
```
