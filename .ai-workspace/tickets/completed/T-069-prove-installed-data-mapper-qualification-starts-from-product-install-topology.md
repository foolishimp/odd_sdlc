---
id: T-069
title: Refactor data_mapper qualification to prove valid installed initial state
type: defect
ticket_category: rc_blocker
status: completed
completion_type: implementation
goal: odd-sdlc-typescript-full-operational-rc
change_intent: Refactor the data_mapper qualification setup so the first admitted state conforms to the active installed-topology and conformed-project design surfaces, not source-local helpers or partially hand-prepared state.
change_class: realization_refactor
re_entry_point: code_and_proof
affected_boundary: installed workspace preparation, ABG installer topology, odd_sdlc.TS installer topology, conformed project profile, independent data_mapper qualification lane, runtime archive evidence
priority: critical
triaged_at: 2026-04-27T12:12:00Z
created_at: 2026-04-27T12:12:00Z
updated_at: 2026-04-27T17:42:23Z
completed_at: 2026-04-27T17:22:06Z
dependencies:
  - T-041
  - T-052 completed
  - T-059 completed
  - T-063 completed
  - T-064 completed
  - T-068 completed
  - T-070 consolidated
governance_scope: STDO Method
governance_scope_expansion:
  - S: SPEC_METHOD.md
  - T: TICKET_METHOD.md
  - D: DESIGN_MODULE_METHOD.md
  - O: ODD_METHOD.md
intake_source: .ai-workspace/comments/codex/20260427T120602Z_AUDIT_data_mapper_test35_traversal_vs_current_ts_success_gap.md
active_design_refs:
  - build_tenants/typescript/design/ODD_SDLC_TYPESCRIPT_INSTALL_RELEASE_ADAPTERS.md
  - build_tenants/typescript/design/ODD_SDLC_TYPESCRIPT_INSTALLED_OPERATOR_UX.md
  - build_tenants/typescript/design/ODD_SDLC_TYPESCRIPT_WORKSPACE_INGRESS_SEAMS.md
active_module_refs:
  - build_tenants/typescript/code/src/install/
  - build_tenants/typescript/code/src/workspace/
  - build_tenants/typescript/code/src/operator/
test35_observed_capability: test35 begins from an installed/runtime-seeded workspace before graph traversal and preserves runtime evidence across the productive session.
current_ts_status: TypeScript has installer, conformed-profile, and installed-operator proofs, but the full data_mapper recursive realization run has not yet asserted the complete initial state as a hard prerequisite.
gap: a future successful run could still be over-read if it uses source-local helpers, hand-written workspace state, scalar defaults, or installer/profile topology not proven in the run archive.
fill: make installed initial-state validation the first deterministic gate of the next data_mapper qualification lane.
target_truth: Every full-RC data_mapper qualification run proves ABG install topology, odd_sdlc.TS install topology, and conformed project profile before graph execution starts.
superseded_truth: Existing installer unit/sandbox tests or scalar project defaults alone are sufficient proof that an arbitrary data_mapper qualification run used installed product topology and admitted project truth.
closure_law: this ticket closes only when a fresh independent data_mapper successor workspace records installer manifests, command bindings, bootstrap provenance, ABG runtime identity, odd_sdlc.TS domain install identity, conformed_project.json, and a deterministic initial-state assertion before the first graph-function traversal.
evaluation_criteria:
  - qualification setup creates a fresh independent data_mapper workspace from the template
  - ABG installer writes `.abiogenesis/` substrate topology and manifest evidence
  - odd_sdlc.TS installer writes `.abiogenesis/odd_sdlc/typescript/` domain topology and manifest evidence
  - installed `odd-sdlc-ts`, `abiogenesis-ts`, and bootstrap guidance are present before `start`
  - conformed project profile exists before realization handoff
  - handoff consumes the conformed profile rather than rescanning scalar defaults
  - topology validation fails closed before graph execution if required installed surfaces are absent
  - the validation result is archived with the run and referenced from the postmortem
proof_surface:
  - conformance note against installed-topology and conformed-project design
  - deterministic topology and conformed-profile assertion test
  - fresh data_mapper successor run archive
  - T-041 blocker-map update
non_closure_conditions:
  - source-local commands are used as substitute proof for installed commands
  - required installed files are copied manually without installer manifest evidence
  - topology or conformed profile is checked after graph execution rather than before it
  - conformed profile is archived but not consumed by handoff, output contract, or postflight
  - evidence relies only on previous T-052/T-059/T-063 tests without a data_mapper successor run
---

## Design Method Notes

This is a boundary-proof refactor over the active design. It must not introduce
a second installer, a second project profile, or a test-only setup path.

Design Module Method obligations:

- conform to the topology and conformed-project carriers already represented
  in design and modules
- keep installer side effects behind explicit adapter/effect boundaries
- make validation a deterministic transform over admitted install manifests
- do not let data_mapper-specific setup leak into product installer law
- publish local/global optimization notes before closure

## Consolidated Scope

`T-070` is consolidated into this ticket. The conformed project profile is part
of the valid initial-state refactor, not a separate active design ticket.

## Completion Evidence

- `build_tenants/typescript/code/src/qualification/installed_initial_state.ts`
  defines the deterministic initial-state validation carrier.
- `build_tenants/typescript/test_env/tests/test_t069_installed_initial_state.test.mjs`
  copies the real `data_mapper.template` into a fresh independent workspace,
  installs ABG plus `odd_sdlc.TS`, validates topology before any graph
  traversal, writes `initial_state_validation.json`, and writes
  `conformed_project.json`.
- The validation checks ABG install manifests, odd_sdlc install manifest,
  normalization, bootstrap guide, `AGENTS.md`, `CLAUDE.md`, installed
  `odd-sdlc-ts`, `abiogenesis-ts`, and `genesis-ts` commands, runtime refs, and
  conformed project truth.
- The negative test proves the same validation fails closed before install.
- `npm run test:t069` passed: 2 tests.
- `npm run test:semantic` passed: 106 tests.
- `npm run lint:semantic` passed.

## Post-Review Hardening

Claude review
`.ai-workspace/comments/claude/20260427T230000Z_REVIEW_active-tickets-and-assurance-ledger-wave.md`
identified that initial-state validation existed as a qualification carrier but
was not yet a pre-graph installed CLI gate.

Hardening implemented:

- `executeInstalledOperatorStart` now accepts `requireInstalledTopology`.
- `odd-sdlc-ts start --worker ...` sets that gate from the CLI adapter.
- The gate archives `initial_state_validation.json` and
  `conformed_project.json` before graph execution.
- Missing install topology now returns `status=blocked` with
  `blockingReason=installed_topology_invalid` before worker dispatch,
  graph-event append, or postflight.
- `test_t069_installed_initial_state.test.mjs` now proves the negative CLI
  path.

Additional verification:

- `npm run test:t069` passed: 3 tests.
- `npm run test:semantic` passed: 109 tests.
- `npm run lint:semantic` passed.
