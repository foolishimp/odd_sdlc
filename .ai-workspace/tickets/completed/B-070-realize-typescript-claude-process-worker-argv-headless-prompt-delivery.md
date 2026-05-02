# B-070 Realize TypeScript `process://claude` Worker Argv With Headless Prompt Delivery

- id: B-070
- type: bug
- ticket_category: ordinary
- status: completed
- goal: typescript-rc-fp-worker-coverage
- closed_at: 2026-04-29
- change_intent: deliver `worker_prompt.md` content to spawned `process://claude` workers so the F_P contract executes instead of opening an interactive Claude Code session
- change_class: realization_refactor
- re_entry_point: code
- triaged_at: 2026-04-29
- created_at: 2026-04-29
- updated_at: 2026-04-29
- priority: high
- intake_source: data_mapper.test57.fp.cl operator run, comment `claude/20260429_fp_worker_prompt_not_delivered.md`
- affected_boundary: `build_tenants/typescript/code/src/operator/transport.ts` (`argsForWorker`)
- build_tenant: typescript
- links:
  - file://.ai-workspace/comments/claude/20260429_fp_worker_prompt_not_delivered.md (workspace-side post — not present in this repo; lives in scenario `data_mapper.test57.fp.cl`)
  - REQ-F-ODDSDLC-052 (`specification/requirements/14-odd-sdlc-installed-product-contract.md`, AC-5)
  - REQ-F-ODDSDLC-053 (same file, AC-3 — prompts derived from manifest)

## Context

The TypeScript tenant supports F_P worker dispatch via `process://<agent>` transport contracts. `transport.ts:transportAgentKey` already detects four distinct agent identities (`codex`, `claude`, `gemini`, `node`) and the parallel-test scenario `data_mapper.test57.fp` explicitly binds the `.cl` workspace to `process://claude` and the `.cx` workspace to `process://codex` so the same imported `data_mapper` corpus and same substrate package can be exercised under both lanes.

`argsForWorker` builds spawn argv per agent. Today it has only one branch:

```ts
if (input.transport.agentKey === "codex" && input.transport.args.length === 0) {
  return codexArgs({...});
}
return Object.freeze([...input.transport.args, input.manifestPath]);
```

The `codexArgs` builder reads `worker_prompt.md` and passes its **content** as the final positional argv to `codex exec` — codex's headless invocation convention.

Every non-codex agent — including `claude` — falls into the generic `[...args, manifestPath]` shape. For `process://claude` this becomes `claude <handoff_manifest.json>`. Claude Code interprets argv[1] as a file to open in interactive mode, prints a clarification question to stdout, and exits 0 with no `worker_result_report.json`. The operator postflight then correctly rejects: `worker_report_admission_failed: ENOENT`. The retry loop produces the same shape forever.

The `process://codex` lane in `data_mapper.test57.fp.cx` is the controlled counter-example: same substrate package, same manifest contract — codex closes `derive_intent_surface` and advances; claude does not. So the gap is in the argv builder, not in manifest authoring, prompt content, or env delivery.

This is a realization gap. The governing requirement (REQ-F-ODDSDLC-052 AC-5: dual-role agentic-CLI/F_P-worker executables must remain explicit through transport, manifest, report, and archive) and the per-agent argv-builder design pattern (`codexArgs`) are both already present. The code simply does not enumerate `claude` as a builder branch.

## Acceptance

- AC-1: `argsForWorker` dispatches on `transport.agentKey` for at least `codex` and `claude` (defaulting `node`/`generic` to the manifest-path fallthrough), so a `process://claude` invocation receives the content of `worker_prompt.md` via Claude Code's headless interface and is **not** spawned as `claude <handoff_manifest.json>`
- AC-2: a unit test asserts the argv shape produced for `process://claude` includes the headless print flag and the prompt content (file content as a single argv string), is **not** the bare manifest path, and remains independent of any installed `claude` binary
- AC-3: a unit test asserts `process://codex` argv shape is unchanged (regression guard for the existing codex lane)
- AC-4: a unit test asserts `process://node?script=...` (the existing node-script transport pattern used by `test_t064`, `test_t066`, `test_t076`) remains the manifest-path fallthrough — the new `claude` branch must not collapse the script-driven node lane
- AC-5: when redeployed into `data_mapper.test57.fp.cl`, a single `start --until blocked --worker process://claude` hop produces a non-empty `worker_result_report.json` matching the manifest's `resultReportSchema` at the manifest's `reportFile`. The *content* of that report is not in scope for this ticket — only that prompt delivery succeeds and the worker writes the report shape. Content-quality and obligation-fulfillment are downstream evaluator concerns.

## Non-closure conditions

- env-var-only "fix" that still spawns `claude <manifest>` and relies on the child to discover `ODD_SDLC_OPERATOR_*` from env without prompt delivery — does not satisfy AC-1
- spawning a wrapper script that re-invokes claude under the hood without changing the substrate `argsForWorker` law — moves the fix outside admitted substrate truth
- adding a `claudeArgs` builder but leaving `argsForWorker` `codex`-only-conditioned — must extend the dispatch
- changing the codex argv shape — out of scope; protected by AC-3
- changing `process://node?script=...` semantics — out of scope; protected by AC-4
- claiming closure based on `npm run test:semantic` green without exercising `data_mapper.test57.fp.cl` — substrate proof is necessary but not sufficient (AC-5)

## Implementation Plan

1. Add `claudeArgs(input)` in `transport.ts` returning `["-p", <prompt content>, "--add-dir", workspaceRoot, "--permission-mode", "bypassPermissions", "--output-format", "text"]`. Rationale: Claude Code's `-p`/`--print` is the documented headless mode; `--add-dir` exposes the workspace root for read access; `--permission-mode bypassPermissions` is the closest equivalent to codex's `--sandbox workspace-write` and is required so the spawned worker can call Read/Write/Bash tools without an interactive approval prompt that headless mode cannot answer; `--output-format text` keeps stdout simple for the operator stdout log.
2. Extend `argsForWorker` to dispatch on `agentKey` when `transport.args.length === 0`: `codex` → `codexArgs`, `claude` → `claudeArgs`, otherwise the existing `[...args, manifestPath]` fallthrough.
3. Bump the default `invokeWorkerTransport` timeout from 10 minutes to 30 minutes. Rationale: empirical evidence from the first single-hop verification on `data_mapper.test57.fp.cl` shows the spawned claude worker hits `SIGTERM` at exactly 10 minutes (status 143, `elapsedMs ≈ 600s`) on the `bootstrap_release_self_test/derive_intent_surface` edge (100 obligations, 22 authority refs). The timeout cap was too tight for a real F_P spec-authoring hop. 30 minutes preserves bounded execution while leaving room for the actual constructive work. Per-call override via `input.timeoutMs` is unchanged.
4. Add `test_env/tests/test_b070_claude_argv_shape.test.mjs` covering AC-2/AC-3/AC-4 against the in-process pure builder (no live claude binary). Tests stay deterministic by stubbing the prompt path to a temp file.
5. `npm run build:semantic` (which runs `tsc -p tsconfig.semantic-strict.json`).
6. Re-pack and re-install into `data_mapper.test57.fp.cl` (`odd-sdlc-ts install --target ... --package-source ... --abg-package-source ...`).
7. `node_modules/.bin/odd-sdlc-ts start --workspace . --target next --until blocked --worker process://claude` — observe `worker_result_report.json` exists at the manifest's `reportFile`. AC-5 satisfied.

## Iteration log

- 2026-04-29 first build/install/run: argv shape correct (verified via `worker_run.json`), prompt delivered, claude actually executed — but worker exited with `status: 143` (SIGTERM) at the 10-minute substrate-default timeout cap. `worker_stdout.log` empty → claude was almost certainly blocked on an interactive permission prompt (`Write` to `outputFile`, `Write` to `reportFile`) that headless `-p` mode cannot answer. Two fixes added on iteration: `--permission-mode bypassPermissions` on the spawn argv (so tool use is admitted without confirmation) and default timeout bump to 30 minutes.

- 2026-04-29 second build/install/run: full converged traversal on `data_mapper.test57.fp.cl` over `process://claude`. Closed 18 unique constructive edges across the bootstrap-self-test graph with `unresolvedReasons: []`: `derive_intent_surface`, `derive_product_surface`, `derive_goal_surface`, `derive_requirement_surface`, `derive_feature_decomp_surface`, `derive_uat_testcases_surface`, `derive_design_surface`, `derive_scenario_surface`, `derive_implementation_design_surface`, `select_implementation_stack_profile`, `derive_implementation_module_surface`, `derive_realization_schedule_surface`, `derive_code_surface`, `derive_test_design_surface`, `select_test_stack_profile`, `derive_test_module_surface`, `derive_test_schedule_surface`. 34 worker reports admitted by postflight; 39 assets materialized; 36 post-fix operator runs. Run terminated lawfully at `derive_test_run_archive_surface` with `worker_report_unresolved_reasons_present, test_execution_not_succeeded` — claude correctly returned non-empty `unresolvedReasons` because authoring an archive of test-run *results* requires real build/test execution evidence (F_D/F_H operational dispatch), not F_P constructive synthesis. That stop is out of B-070 scope.

## Closure

All five acceptance criteria satisfied:

- AC-1 ✓ `argsForWorker` dispatches on `agentKey` (`codex` → `codexArgs`, `claude` → `claudeArgs`, otherwise fallthrough). `process://claude` no longer spawns as `claude <handoff_manifest.json>`.
- AC-2 ✓ Unit test `B-070 process://claude argv delivers prompt content via -p, not the bare manifest path` asserts the headless flag, prompt content, `--add-dir`, `--permission-mode bypassPermissions`, and the absence of the bare manifest path.
- AC-3 ✓ Unit test `B-070 process://codex argv shape is preserved (regression guard)` green; codex argv shape unchanged.
- AC-4 ✓ Unit test `B-070 process://node?script=... falls through to manifest-path argv (regression guard)` green; node-script transport unaffected. Plus an extra guard: `process://claude?script=` overrides claudeArgs and falls through to manifest-path argv when an explicit script is supplied.
- AC-5 ✓ 34 non-empty `worker_result_report.json` files written across 36 post-fix operator runs on `data_mapper.test57.fp.cl`, all matching `resultReportSchema`.

Full semantic suite green: 144 / 144 tests pass after the change.

## Out-of-scope follow-up surfaced by this ticket

The traversal stop at `derive_test_run_archive_surface` indicates the bootstrap-self-test graph eventually wants test-execution evidence that no F_P constructive worker (claude or codex) can lawfully synthesise from spec authority alone. The next lawful move is operational dispatch (`odd-sdlc-ts dispatch-operational` or similar). That belongs in a separate ticket: probably an operational-dispatch lane for the TypeScript tenant, or a triage entry confirming that this edge requires `F_D` evaluator binding rather than `F_P` constructor binding. **Filing as future work, not as B-070 reopen.**

## Out of scope

- the *content quality* of intent surfaces produced by the spawned claude worker (covered by manifest evaluators, not this ticket)
- claude permission-mode flags / sandbox mode beyond the minimum needed for AC-5 (deferred — first land prompt delivery, then tune trust posture)
- `gemini` argv builder (separate follow-up if/when a gemini lane is exercised)
- changes to `codexArgs` or to `process://node?script=` semantics

## Evidence refs

- `file:///Users/jim/src/apps/ai_sdlc_examples/local_projects/data_mapper/data_mapper.test57.fp.cl/.ai-workspace/comments/claude/20260429_fp_worker_prompt_not_delivered.md`
- `file:///Users/jim/src/apps/ai_sdlc_examples/local_projects/data_mapper/data_mapper.test57.fp.cl/.ai-workspace/runtime/odd_sdlc/operator-runs/20260428T190146397Z_pid62354/postmortem.md`
- `file:///Users/jim/src/apps/ai_sdlc_examples/local_projects/data_mapper/data_mapper.test57.fp.cl/.ai-workspace/runtime/odd_sdlc/operator-runs/20260428T190146397Z_pid62354/worker_run.json`
- `file:///Users/jim/src/apps/odd_sdlc/build_tenants/typescript/code/src/operator/transport.ts` (lines 64–98)
- `file:///Users/jim/src/apps/odd_sdlc/specification/requirements/14-odd-sdlc-installed-product-contract.md` (REQ-F-ODDSDLC-052 AC-5, REQ-F-ODDSDLC-053 AC-3)
