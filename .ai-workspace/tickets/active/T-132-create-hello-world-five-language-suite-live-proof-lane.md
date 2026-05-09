---
id: T-132
title: Create hello-world five-language suite live proof lane
type: feature
ticket_category: live_proof_lane
status: active
review_status: implementation_pending_review
goal: typescript-rc-bounded-live-proof
build_tenant: typescript
owner: odd_sdlc
change_intent: Add a compact live proof candidate where odd_sdlc starts from one bootstrap document, builds a hello-world suite as five independent programming-language build tenants, and proves each generated program by executing it and asserting the emitted output.
change_class: design_reframe
re_entry_point: design
affected_boundary:
  - build_tenants/typescript/test_env/fixtures/t132_hello_world_five_languages/
  - build_tenants/typescript/test_env/live/
  - build_tenants/typescript/code/src/workspace/
  - build_tenants/typescript/code/src/operator/
  - build_tenants/typescript/package.json
priority: high
triaged_at: 2026-05-09
created_at: 2026-05-09
updated_at: 2026-05-09
completed_at: null
governance_scope: STDO Method
dependencies:
  - T-129 completed ABG 3.7.1 evaluator and liveness substrate migration
related_tickets:
  - T-041 remains open for data_mapper end-goal/stress proof
  - T-131 remains open for guided odd_chat product build proof
  - T-133 is the one-tenant Rust minimum-overhead baseline; it does not replace this broader five-language escalation lane.
intake_source: The operator requested a simpler new test rather than further unpacking the long odd_chat/data_mapper lanes. The desired proof is for odd_sdlc to create a hello-world suite using five programming languages and test the output. During the first live attempt, the fixture incorrectly collapsed all languages into one `hello_world_suite` tenant; the operator corrected the expected proof shape to one build tenant per language, with design, ADR, and module surfaces inside each tenant.
target_truth: odd_sdlc has a small canonical live-build candidate where one bootstrap document is the scenario source of truth. The standard project profile/template declares the runtime layout: transform assets are admitted under `.ai-workspace/runtime/odd_sdlc/assets`, operator run archives under `.ai-workspace/runtime/odd_sdlc/operator-runs`, and product materialization uses `selected_output_root`. The live lane creates a fresh sandbox, installs odd_sdlc into that sandbox as builder, runs installed odd_sdlc traversal from the bootstrap, requires five separate generated build tenant roots for JavaScript, Python, Ruby, Bash, and Java, requires each tenant to contain its own design module file, ADR file, and source file, then executes each generated program and asserts the exact `Hello, world!` output.
superseded_truth: A broad data_mapper or odd_chat run is the only valid live proof, or a fixture can count as proof by carrying prebuilt hello-world source files without installed odd_sdlc construction and execution evidence.
closure_law: This ticket closes only when the bootstrap contract is validated deterministically, the standard project profile/template exposes the runtime layout as typed conformed project truth, the operator handoff consumes that same runtime layout for `assets` and `operator-runs`, the bootstrap sandbox starts without generated tenant design/ADR/module/source files, the package exposes a focused T-132 test command, and the opt-in live lane installs odd_sdlc into a fresh sandbox, generates all five language tenants, executes all five programs, and archives output evidence under the test run root.
evaluation_criteria:
  - The bootstrap document declares product intent, five build tenants, language matrix, exact expected output, expected files, lifecycle graph, lawful actions, and commands.
  - The standard `project_constraints.yml` template declares `runtime.root`, `runtime.transform_asset_root`, `runtime.operator_run_root`, and `runtime.product_materialization_root_policy`.
  - The conformed project profile carries the runtime layout as typed truth and the operator handoff writes transform assets/operator archives from that profile rather than from a second hardcoded path.
  - The bootstrap fixture contains only scenario authority and no prebuilt generated tenant design, ADR, module, or program source.
  - The harness validates the contract shape and rejects duplicate language ids, duplicate expected files, missing commands, and missing lifecycle actions.
  - The harness rejects a flat `build_tenants/hello_world_suite` output as the proof shape.
  - The live lane uses the installed odd_sdlc command path from the sandbox install result.
  - The live lane writes runtime/events under `build_tenants/typescript/test_env/test_runs/t132_hello_world_five_languages_bootstrap_sandbox/<timestamp>_pid<pid>/workspace/.ai-workspace`.
  - Runtime transform assets under `.ai-workspace/runtime/odd_sdlc/assets` are expected SDLC transform evidence and are not mistaken for product materialization.
  - Per-tenant `build_tenants/hello_world_*` files are required only for product materialization and executable output proof.
  - The proof surface includes per-tenant design/module/ADR assets and actual process execution for JavaScript, Python, Ruby, Bash, and Java.
  - Each language execution must emit exactly `Hello, world!` after trimming trailing whitespace.
proof_surface:
  - build_tenants/typescript/test_env/fixtures/t132_hello_world_five_languages/bootstrap.md
  - build_tenants/typescript/test_env/live/test_t132_hello_world_five_language_suite_live_build.test.mjs
  - build_tenants/typescript/code/src/workspace/runtime_layout.ts
  - build_tenants/typescript/code/src/workspace/project_profile.ts
  - build_tenants/typescript/code/src/operator/handoff.ts
  - npm run test:t132
  - npm run test:t132:hello-world-live for opt-in live proof
non_closure_conditions:
  - The fixture contains prebuilt hello-world implementation, design, module, or ADR files.
  - The generated product collapses all languages into one `build_tenants/hello_world_suite` tenant.
  - The harness only checks that files exist and does not execute all five generated programs.
  - The live lane bypasses installed odd_sdlc and writes implementation files from the harness as proof.
  - A language is skipped silently because its runtime is unavailable.
  - The worker narrative is treated as output proof without process execution.
  - Worker prompts embed `worker_invocation_package.json`, legacy prompt pressure projection JSON, or other stable archived packages inline instead of referencing them.
  - Codex worker transport passes the full prompt as a positional argv value, causing command logs and PTY transcripts to duplicate prompt payload.
  - The ticket is used to close T-041 or T-131 without separate review.
---

# T-132: Hello-World Five-Language Suite Live Proof Lane

## STDO Triage

First missing layer: design.

The current RC proof set has strong but long live lanes. The missing proof is a
small, inspectable product that can still exercise the real installed builder
path and multi-tenant output shape:

```text
bootstrap start document
  -> sandbox setup
  -> install odd_sdlc as builder
  -> build five tenant roots
  -> build tenant design/module/ADR/source surfaces
  -> execute generated product in five languages
  -> admit output evidence
```

This is not a replacement for the data_mapper end-goal lane. It is a bounded
release-confidence lane for installed construction and execution evidence.

## Escalation Role

This ticket is intentionally preserved as the broader hello-world use case. It
should remain available for an escalating scenario ladder:

```text
T-133: one Rust tenant, minimal product materialization and execution proof
  -> T-132: five independent language tenants with per-tenant design/ADR/module surfaces
  -> T-131: guided odd_chat product workflow
  -> T-041: data_mapper end-goal and RC stress proof
```

T-132 must not be deleted or collapsed into T-133. T-133 measures the floor cost
of bringing odd_sdlc to a new product; T-132 measures whether the same installed
builder can scale to a small multi-tenant suite with richer SDLC evidence.

## Initial Implementation Slice

Planned surfaces:

- `build_tenants/typescript/test_env/fixtures/t132_hello_world_five_languages/bootstrap.md`
- `build_tenants/typescript/test_env/live/test_t132_hello_world_five_language_suite_live_build.test.mjs`
- package scripts:
  - `npm run test:t132`
  - `npm run test:t132:hello-world-live`

The deterministic path validates the bootstrap contract and proves the sandbox
starts without generated tenant files. The opt-in live path installs odd_sdlc
and requires generated JavaScript, Python, Ruby, Bash, and Java tenants to each
contain design/module/ADR/source surfaces and emit `Hello, world!`.

## Correction - 2026-05-09

The first live attempt used the wrong scenario shape. It derived a single
`activeTenant: hello_world_suite` and `selectedOutputRoot:
build_tenants/hello_world_suite`, which would not prove the desired
multi-tenant SDLC behavior.

The second correction is the runtime/materialization boundary. Runtime transform
assets are expected under `.ai-workspace/runtime/odd_sdlc/assets/<runId>`.
That is not the same surface as product materialization. Generated product
files must appear under `build_tenants/<tenant>/` only when the traversal is
building materialized tenant output.

Corrected target shape:

- `build_tenants/hello_world_javascript/`
- `build_tenants/hello_world_python/`
- `build_tenants/hello_world_ruby/`
- `build_tenants/hello_world_bash/`
- `build_tenants/hello_world_java/`

Each tenant must contain:

- `design/modules/<tenant>_module.md`
- `design/adrs/ADR-001-runtime-and-output-contract.md`
- one generated source file under `src/`

Standard template config to carry forward:

```yaml
runtime:
  root: .ai-workspace/runtime/odd_sdlc
  transform_asset_root: .ai-workspace/runtime/odd_sdlc/assets
  operator_run_root: .ai-workspace/runtime/odd_sdlc/operator-runs
  product_materialization_root_policy: selected_output_root
```

## Performance Tuning Finding - 2026-05-09

The T-132 run bed exposed prompt/log bloat in the generic worker handoff path.
The live process was sending a large prompt that said to read compact package
files, then embedded those same package contents inline. Codex transport also
passed prompt text as a positional argv value, which caused command archives and
PTY transcripts to carry the full prompt payload.

Required tuning checklist:

- [ ] `worker_prompt.md` stays under 8 KiB for a large requirement surface.
- [ ] `worker_prompt.md` contains no embedded `sdlc_worker_invocation_package`
  JSON and no legacy `sdlc_worker_prompt_pressure_projection`.
- [ ] `worker_invocation_package.json` stays under 32 KiB for a large
  requirement surface.
- [ ] `worker_brief.json` exists and stays under 4 KiB, carrying only current
  edge, target asset, output/report files, product materialization flag,
  allowed write roots, required schema, and exact package/manifest refs to read.
- [ ] Codex worker transport uses stdin with `codex exec -`; prompt text is not
  a positional argv value.
- [ ] For a no-retry live edge, PTY `screenlog.0` remains below 100 KiB unless
  product output itself is the cause, in which case the run summary records the
  exception explicitly.
