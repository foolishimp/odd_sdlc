---
id: T-043
title: Bind runtime-return observation to command identity and lane
type: defect
ticket_category: forensic_review_remediation
status: completed
goal: keep-odd-sdlc-typescript-runtime-evidence-bound
change_intent: Prevent runtime-return observations from attributing foreign results or non-runtime-return commands to retrofit graph functions.
change_class: realization_refactor
re_entry_point: design_reframe
affected_boundary: TypeScript operational runtime-return observation
priority: high
triaged_at: 2026-04-26
created_at: 2026-04-26
updated_at: 2026-04-26
completed_at: 2026-04-26
dependencies:
  - T-037 completed
governance_scope: STDO Method
governance_scope_expansion:
  - S: SPEC_METHOD.md
  - T: TICKET_METHOD.md
  - D: DESIGN_MODULE_METHOD.md
  - O: ODD_METHOD.md
intake_source: .ai-workspace/comments/codex/20260426T161728Z_FORENSIC_STDO_REVIEW_typescript_tenant_T025_T041.md
target_truth: Runtime-return observation admits only runtime_return commands and results whose commandId equals the observed commandId.
superseded_truth: Runtime-return observation can combine any command with any operational result.
closure_law: this ticket closes when foreign command results and non-runtime-return lanes fail closed before observation projection.
evaluation_criteria:
  - valid runtime-return command/result still produces observation
  - foreign result commandId throws
  - non-runtime-return command throws
proof_surface:
  - build_tenants/typescript/code/src/operational/operational.ts
  - build_tenants/typescript/test_env/tests/test_t037_operational_transition_runtime_return.test.mjs
non_closure_conditions:
  - observation consumes a result from another command
  - observation consumes build/test/deployment commands
---

## Closure Evidence

`observeSdlcRuntimeReturn` now fails closed unless the command lane is
`runtime_return` and the result belongs to the same command.

Focused `T-043` tests cover both negative cases.
