# Postmortem: T-047 TypeScript Pre-Refactor Sandbox Proof Lane

**Author**: Codex
**Date**: 2026-04-26T07:42:37Z
**Scope**: `odd_sdlc/build_tenants/typescript`
**Ticket**: `T-047`

## Verdict

T-047 passed.

The TypeScript tenant now has a repeatable sandbox command:

```text
npm run test:sandbox
```

The run writes archived evidence under:

```text
build_tenants/typescript/test_env/test_runs/typescript_pre_refactor_sandbox/
```

Latest archive:

```text
build_tenants/typescript/test_env/test_runs/typescript_pre_refactor_sandbox/20260426T074237344Z_pid38320
```

The archive contains:

- `run.json`
- `summary.json`
- `stdout.log`
- `stderr.log`
- `postmortem.md`

## Run Summary

```text
scenario: t047-data-mapper-composed-sdlc-traversal
fixture: external_data_mapper_template
fixture_source: /Users/jim/src/apps/ai_sdlc_examples/local_projects/data_mapper/data_mapper.template
verdict: passed
elapsed_ms: 44.976
expected_events: 12
actual_events: 12
sequence_matches: true
graph_functions_exercised: 7
carriers_admitted: 12
diagnostics: none
```

## Expected Event Sequence

```text
ingress_report_derived
-> gtl_module_constructed
-> query_domain_projected
-> worker_attachment_admitted
-> public_start_projected
-> gap_dossier_derived
-> hook_turn_completed
-> requirement_closure_projected
-> gap_route_bound
-> ticket_route_projected
-> operational_build_result_admitted
-> runtime_return_observed
```

## Actual Event Sequence

The actual event sequence matched the expected sequence exactly.

The archive records each event with carrier kind, graph-function name where
applicable, and evidence reference.

## Graph Functions Exercised

```text
bootstrap_release_self_test
derive_build_execution_result_surface
derive_code_surface
derive_requirement_surface
derive_retrofit_plan_surface
derive_runtime_observation_surface
route_ticket_work_item
```

## Admitted Carriers

```text
abiogenesis_module
sdlc_gap_dossier
sdlc_hook_turn_outcome
sdlc_operational_advance
sdlc_public_start_projected
sdlc_query_domain_projection
sdlc_requirement_closure_register
sdlc_route_binding
sdlc_runtime_return_observation
sdlc_ticket_work_item_route
sdlc_worker_attachment
sdlc_workspace_ingress_report
```

## Verification

Passed:

```text
npm run test:sandbox
npm run test:semantic
npm run lint:semantic
ODD_SDLC_DATA_MAPPER_TEMPLATE_ROOT=/Users/jim/src/apps/ai_sdlc_examples/local_projects/data_mapper/data_mapper.template npm run test:reference:data-mapper
```

## Residuals

These are not closed by T-047:

- `T-041`: live external `F_P` worker execution
- `T-041`: installed-workspace CLI replacement
- `T-041`: full Python live archive comparison
- `T-048`: common sandbox convergence on a public ABG M05 sandbox/archive framework export

## STDO Closure Review

```text
S: pass — product claim stayed bounded; this closes only the pre-refactor sandbox gate.
T: pass — T-047 carried the sandbox work; T-041 remains the full operational replacement lane; T-048 records the common-framework dependency.
D: pass — archive carriers, event sequence evaluation, filesystem materialization, and tests are module-derived.
O: pass — GTL graph functions and ABG runtime truth remain the constructive carrier; odd_sdlc writes only qualification evidence.

Verdict:
  consolidation_refactor_gate: closed
  T-041_residuals: live F_P, installed CLI, Python live comparison
  T-048_residuals: public ABG M05 sandbox/archive framework export
```
