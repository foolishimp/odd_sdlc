---
id: T-131
title: Create guided odd_chat CLI live build lane over deployed ODD/GTL/ABG domains
type: feature
ticket_category: live_proof_lane
status: active
review_status: corrected_to_bootstrap_only_live_build_candidate_pending_opt_in_execution
goal: typescript-rc-guided-live-proof
build_tenant: typescript
owner: odd_sdlc
change_intent: Add a smaller guided live proof lane where a bootstrap start document declares the odd_chat CLI product, build tenant, workspace create/open dialogue, default deployed ODD/GTL/ABG domain, graph-function selection dialogue, lawful action menu, and graph-function asset build plan, so odd_sdlc can prove it can build odd_chat without relying on an unconstrained long-running data_mapper agent lane.
change_class: design_reframe
re_entry_point: design
affected_boundary:
  - build_tenants/typescript/test_env/fixtures/t131_guided_odd_chat/
  - build_tenants/typescript/test_env/live/
  - build_tenants/typescript/package.json
  - T-041 bounded RC proof strategy
priority: high
triaged_at: 2026-05-09
created_at: 2026-05-09
updated_at: 2026-05-09
completed_at: null
governance_scope: STDO Method
dependencies:
  - T-041 active bounded RC data_mapper end-goal lane
  - T-129 completed ABG 3.7.1 evaluator and liveness substrate migration
  - T-120 completed typed retry-local repair prompt packaging
related_tickets:
  - T-041 remains open for data_mapper end-goal/stress proof
  - T-109 remains open for current-runtime full traversal or typed exhaustion proof
  - T-112 remains open for complete lifecycle release/closure proof
intake_source: The latest data_mapper live lane ran for about 134.6 minutes before the outer harness killed it at derive_component_test_surface. The operator asked for a simpler live proof that still shows the full lifecycle: bootstrap, sandbox setup, install odd_sdlc as builder, build odd_chat, locally install odd_chat, and test odd_chat. The intended product is a standalone CLI that can create/open an operator workspace, load deployed ODD/GTL/ABG domains into that workspace, then separately choose which domain graph function to operate. Its first/default domain is document_to_requirements, where a human evaluator chooses lawful actions over a graph that turns a source document into typed requirements.
target_truth: odd_sdlc has a compact canonical live-build candidate where one self-contained bootstrap document carries intent, product definition, build tenant, workspace create/open dialogue, default document_to_requirements domain, graph-function selection dialogue, lawful action menu, graph-function bindings, expected assets, sandbox/install/deploy/test commands, and acceptance criteria for building odd_chat. The harness creates a fresh sandbox from that bootstrap document, installs odd_sdlc into the sandbox as builder, runs the installed odd_sdlc command path, and treats generated odd_chat CLI implementation files as build evidence rather than fixture input. odd_chat itself is not an odd_sdlc runtime wrapper.
superseded_truth: The only meaningful live proof is the full data_mapper lane, or a short fixture may bypass bootstrap, GTL graph authority, lawful actions, graph-function asset construction, deploy, or test evidence by copying a prebuilt odd_chat implementation.
closure_law: This ticket closes only when the T-131 bootstrap document is the single scenario source of truth, the fixture does not carry prebuilt odd_chat implementation source, the harness validates all required lifecycle/action/asset/test/deploy details from the document, the package exposes a focused test command, and the opt-in live lane installs odd_sdlc into a fresh sandbox and builds odd_chat target files through the installed traversal. The generated odd_chat product must be a standalone CLI over workspaces and deployed ODD/GTL/ABG domains, with document_to_requirements as the default proof domain and graph-function selection as a separate step from workspace creation and action selection.
evaluation_criteria:
  - The bootstrap document declares product intent, product definition, build tenant, runtime/deploy target, acceptance criteria, and test expectations.
  - The bootstrap document declares odd_sdlc as builder only, not as odd_chat's runtime graph loader.
  - The bootstrap document declares workspace create/open as a first-class odd_chat dialogue.
  - The bootstrap document declares document_to_requirements as the default deployed ODD/GTL/ABG domain for odd_chat.
  - The bootstrap document declares graph-function listing and selection as a separate odd_chat dialogue.
  - The bootstrap document declares a builder lifecycle graph from start document through sandbox setup, odd_sdlc install, odd_chat build, local CLI deployment, test execution, and release-readiness projection.
  - Each graph node has a lawful action entry with action id, graph function, source asset refs, target asset ref, expected carrier, human evaluator decision, retry action, and done predicate.
- The harness treats the bootstrap document as the only scenario contract and rejects missing lifecycle nodes, duplicate action ids, missing graph-function bindings, missing deploy/test commands, or missing expected output assets.
- The harness can run in deterministic contract mode without live workers and in opt-in live mode for sandbox install/gaps/start build proof.
- The opt-in live lane writes the installed runtime workspace under `build_tenants/typescript/test_env/test_runs/t131_guided_odd_chat_bootstrap_sandbox/<timestamp>_pid<pid>/workspace`, so `.ai-workspace/runtime/odd_sdlc` and per-edge event logs are inspectable from the same sandbox that was bootstrapped for the run.
- data_mapper remains the end-goal/stress lane under T-041; T-131 does not close T-041 by itself.
proof_surface:
  - build_tenants/typescript/test_env/fixtures/t131_guided_odd_chat/bootstrap.md
  - build_tenants/typescript/test_env/live/test_t131_guided_odd_chat_live_build.test.mjs
  - npm run test:t131
  - npm run test:t131:guided-odd-chat-live for opt-in live proof
non_closure_conditions:
  - The guided CLI or harness owns action selection outside the bootstrap/GTL projection.
  - odd_chat is built as an odd_sdlc-specific runtime wrapper instead of a standalone CLI over deployed ODD/GTL/ABG domains.
  - odd_chat collapses workspace creation, domain loading, graph-function selection, and action selection into one hidden step.
  - The fixture omits deploy or test execution evidence.
  - The fixture asks an AI worker to plan the whole SDLC rather than build one selected edge-local asset.
  - The harness hardcodes a second lifecycle plan instead of reading the bootstrap scenario contract.
  - The fixture contains generated odd_chat implementation source before the live build starts.
  - The ticket is used to close data_mapper T-041 without an explicit T-041 reprice.
---

# T-131: Guided odd_chat CLI Live Build Lane

## STDO Triage

First missing layer: design.

The current data_mapper live lane remains the end-goal and stress proof under
T-041, but it is too long and too complex to be the only rapid release proof.
The missing slice is a compact, inspectable live fixture that preserves the same
architecture:

```text
bootstrap start document
  -> GTL lifecycle graph
  -> lawful action menu
  -> human evaluator/intent selection
  -> edge-local graph function
  -> F_P asset construction
  -> F_D admission/test/deploy evidence
  -> next projection
```

The odd_chat product is an operator CLI, not a second controller. odd_sdlc is
only the builder used by this live proof. The built odd_chat CLI creates or
opens an operator workspace, loads deployed ODD/GTL/ABG domains into that
workspace, lists available graph functions, records the human-selected graph
function, and only then exposes lawful actions. The default proof domain is
document_to_requirements, whose graph turns a start document into typed
requirements through human evaluator choices and edge-local graph functions.

## Initial Implementation Slice - 2026-05-09

Added:

- `build_tenants/typescript/test_env/fixtures/t131_guided_odd_chat/bootstrap.md`
- `build_tenants/typescript/test_env/live/test_t131_guided_odd_chat_live_build.test.mjs`
- package scripts:
  - `npm run test:t131`
  - `npm run test:t131:guided-odd-chat-live`

Correction after review: the earlier prebuilt fixture shape was not the intended
proof. T-131 is a test-run candidate. Each run must build odd_chat from the
start document. The fixture therefore keeps only `bootstrap.md` as durable
scenario input. The harness may write derived sandbox files such as
`specification/requirements/00-start-document.md`, `gtl/graph.json`,
`domains/document_to_requirements/domain.json`, and
`.odd-chat/workspace-dialogue-contract.json`, but it must not copy
`build_tenants/typescript/src/*`, CLI tests, package scaffolding, or UI files as
fixture inputs.

Deterministic proof:

- `npm run test:t131` passed on 2026-05-09.
- The focused test:
  - validates `bootstrap.md` as the scenario source of truth;
  - creates a fresh non-live bootstrap fixture archive from the bootstrap
    document;
  - writes only derived authority/context surfaces;
  - validates workspace create/open and graph-function selection contract rows;
  - asserts that all expected odd_chat implementation files are absent before
    traversal.

The odd_sdlc install/start smoke path is still opt-in through
`npm run test:t131:guided-odd-chat-live` because it may invoke a live worker.
That script sets `ODD_SDLC_TS_T131_GUIDED_ODD_CHAT_LIVE=1`, installs odd_sdlc
into the fresh sandbox, runs the installed `odd-sdlc-ts` command, and fails
unless the expected odd_chat target files are produced by traversal.

Archive-root correction on 2026-05-09:

- The non-live bootstrap fixture archive uses
  `t131_guided_odd_chat_bootstrap_fixture`.
- The opt-in installed live archive uses
  `t131_guided_odd_chat_bootstrap_sandbox`.
- The opt-in installed live lane must invoke the public source CLI install
  surface (`odd-sdlc-ts install` via the built CLI entrypoint) and archive
  `install.process.json`, `install.stdout.json`, `install.stderr.log`, and
  `install_result.json`; it must not call `installOddSdlcTypescript` directly
  as the live proof of install.
- The harness resolves archive/workspace paths to absolute paths before passing
  `--workspace` to installed `odd-sdlc-ts`; installed commands must not receive a
  workspace-relative test archive path that can be resolved twice.
- The live archive is the one expected to contain
  `workspace/.ai-workspace/runtime/odd_sdlc`, operator-run event files,
  `worker_process_events.jsonl`, PTY trace files, assets, ledgers, and runtime
  projections.
- Harness archive-root env vars such as `ODD_SDLC_TS_TEST_RUN_ROOT` and
  `ODD_SDLC_TS_LIVE_TEST_RUN_ROOT` must not be passed into the installed
  `odd-sdlc-ts` process. They are harness concerns, not installed-product
  runtime inputs.
- Older already-running live invocations that started before this correction may
  still archive under the previous temp `t131_guided_odd_chat_live_build` root;
  those are stale path evidence, not the configured target for new runs.

## Closure Boundary

T-131 can close the guided odd_chat live-lane setup. It does not close the
data_mapper end-goal or the bounded RC envelope.
