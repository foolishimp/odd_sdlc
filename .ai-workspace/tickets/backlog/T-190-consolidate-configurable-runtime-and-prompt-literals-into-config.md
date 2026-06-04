---
id: T-190
title: Consolidate configurable runtime and prompt literals into config
type: tech_debt_cleanup
ticket_category: runtime_configuration
status: backlog
proof_status: not_started
priority: high
owner: odd_sdlc
created_at: 2026-06-04
updated_at: 2026-06-04
triaged_at: 2026-06-04
change_class: realization_refactor
re_entry_point: TypeScript tenant runtime/config realization
first_missing_layer: configurable-value inventory and ownership classification
governance_scope: odd_sdlc TypeScript tenant runtime, prompt construction, live harness, and config surfaces
source_documents:
  - specification/PRODUCT.md
  - specification/requirements/
  - build_tenants/typescript/config/operator-runtime-policy.json
  - build_tenants/typescript/code/src/operator/runtime_policy.ts
  - .ai-workspace/tickets/active/T-188-force-fp-depth-through-iteration-and-prompt-control.md
related_tickets:
  - .ai-workspace/tickets/active/T-188-force-fp-depth-through-iteration-and-prompt-control.md
affected_boundary:
  config:
    - build_tenants/typescript/config/operator-runtime-policy.json
    - build_tenants/typescript/config/
  realization:
    - build_tenants/typescript/code/src/operator/
    - build_tenants/typescript/code/src/spec_method/
    - build_tenants/typescript/test_env/
target_truth: Tunable runtime, prompt, harness, retry, liveness, budget, concurrency, and profile thresholds are declared in tenant configuration surfaces and consumed by typed config readers. Code owns schema, validation, fail-closed behavior, and non-tunable law; code does not embed values that operators need to tune between runs.
superseded_truth: Runtime retry caps, repeated-blocker brakes, timeouts, prompt IO budgets, worker budget hints, harness command limits, liveness intervals, and related operational knobs may be scattered as numeric or string literals in TypeScript source, tests, prompt builders, or scenario harnesses, requiring code edits for operational tuning.
closure_law: This ticket closes only after a source audit inventories configurable literals, classifies each literal as method/product law, config-owned runtime policy, tenant/work-category policy, prompt template law, test fixture data, or non-config implementation detail; every config-owned item is moved to an appropriate config surface with typed validation; tests prove runtime/prompt/harness behavior reads from config rather than copied constants; and review accepts the classification before closure.
non_closure_conditions:
  - tuning any migrated value still requires changing TypeScript source
  - config migration turns constitutional law, carrier kinds, graph names, or admission schema into mutable operational config
  - tests assert copied numeric values instead of asserting behavior follows config
  - prompt builders and tool profiles keep separate copied budget/profile predicates
  - smoke/lite/full data-mapper profiles inherit the same retry or liveness policy without explicit config selection
  - environment overrides bypass the declared config schema without validation
review_gate: review required before activation; not requested now
---

# T-190: Consolidate Configurable Runtime And Prompt Literals Into Config

## Intake

Smallest lawful re-entry point: `realization_refactor`.

Reason: the 2026-06-04 hello-world rate-limit incident exposed that operational
retry brakes were still code literals. The immediate T-188 fix moved the active
retry/repeated-blocker brakes into `operator-runtime-policy.json`, but the same
failure class can recur anywhere runtime, prompt, liveness, harness, budget, or
profile tuning still lives as scattered literals.

This ticket is backlog. It needs review before activation.

## Required Audit

Inventory configurable literals across the TypeScript tenant, especially:

- retry and repeated-blocker limits
- timeout, lease, heartbeat, inactivity, and termination-grace values
- prompt IO/read caps, stdout budgets, package-size caps, and line limits
- worker token/budget hints and proportionality profile thresholds
- harness command timeouts and scenario profile knobs
- process-supervision, PTY/local-spawn, and worker transport policy knobs
- retry-loop, repair-loop, and same-edge guard thresholds
- concurrency, batch, shard, and fanout limits

For each literal, classify it as:

- method/product law: keep in specification/design, not mutable runtime config
- config-owned runtime policy: move to typed config
- tenant/work-category policy: move to tenant or work-category config
- prompt template law: keep in prompt source but avoid copied tunable values
- test fixture data: keep local to tests
- implementation detail: keep in code with justification

## Acceptance

- A reviewed inventory exists and covers source, tests, prompt builders, live
  harnesses, and config readers.
- Config-owned knobs are declared in config files under
  `build_tenants/typescript/config/` or a more specific tenant policy surface.
- Config readers validate shape, positive ranges, and fail-closed missing
  values.
- Runtime, prompt, harness, and tests consume typed config values.
- Tests prove behavior follows config without hardcoding the copied numeric
  value.
- No stack-specific tenant facts are moved into SDLC core.
