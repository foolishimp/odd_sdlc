---
id: T-064
title: Define and realize test46 installed operator UX for governed TypeScript SDLC run
type: feature
ticket_category: installed_operator_ux
status: completed
goal: data-mapper-test46-installed-ux
change_intent: Stop treating installed TypeScript SDLC execution as isolated missing switches; define the operator UX walkthrough first, derive the required features from that walkthrough, and then implement the smallest governed path that makes `data_mapper.test46.ts` actually run through worker execution, asset materialization, event ingestion, gaps projection, and archive proof.
change_class: product_reprice
re_entry_point: product_definition
affected_boundary: installed `odd-sdlc-ts` UX, public start/gaps command behavior, worker dispatch, graph-function edge execution, output asset materialization, ABG runtime event ingestion, sandbox archive proof, data_mapper.test46 qualification
priority: high
triaged_at: 2026-04-27T05:44:46Z
created_at: 2026-04-27T05:44:46Z
updated_at: 2026-04-27T18:20:36Z
completed_at: 2026-04-27T18:20:36Z
dependencies:
  - T-041 backlog
  - T-052 completed
  - T-053 completed
  - T-058 completed
  - T-059 completed
  - T-061 completed
  - T-062 completed
  - abiogenesis:T-081 completed
  - abiogenesis:T-082 backlog
governance_scope: STDO-UX
governance_scope_aliases:
  - STDO law
  - STDO governance
  - STDO Constitution
  - STDO Method
  - STDO-UX
governance_scope_expansion:
  - S: SPEC_METHOD.md
  - T: TICKET_METHOD.md
  - D: DESIGN_MODULE_METHOD.md
  - O: ODD_METHOD.md
product_authority:
  - specification/PRODUCT.md Product Position
  - specification/PRODUCT.md Installed Development Product Contract
  - specification/PRODUCT.md Product Terms
intent_authority:
  - specification/INTENT.md Outcomes
  - specification/INTENT.md Constraints
method_authority:
  - /Users/jim/src/apps/specification_methodology/specification/standards/SPEC_METHOD.md
  - /Users/jim/src/apps/specification_methodology/specification/standards/TICKET_METHOD.md
  - /Users/jim/src/apps/specification_methodology/specification/standards/DESIGN_MODULE_METHOD.md
  - /Users/jim/src/apps/specification_methodology/specification/standards/ODD_METHOD.md
upstream_abg_authority:
  - /Users/jim/src/apps/abiogenesis/specification/PRODUCT.md Public Operator Contract
  - /Users/jim/src/apps/abiogenesis/specification/requirements/product/REQ-P-POLICY.md REQ-P-POLICY-014
  - /Users/jim/src/apps/abiogenesis/specification/requirements/product/REQ-P-POLICY.md REQ-P-POLICY-015
  - /Users/jim/src/apps/abiogenesis/.ai-workspace/tickets/completed/B-021-reprice-the-public-runtime-command-surface-around-gen-start-and-gen-gaps.md
  - /Users/jim/src/apps/abiogenesis/.ai-workspace/tickets/completed/B-022-introduce-startintent-scope-target-until-and-a-typed-stop-algebra-behind-gen-start.md
  - /Users/jim/src/apps/abiogenesis/.ai-workspace/tickets/completed/B-030-publish-one-complete-gen-start-interface-and-clear-stop-taxonomy.md
  - /Users/jim/src/apps/abiogenesis/.ai-workspace/tickets/completed/B-030-TS-realize-typescript-m04-complete-start-callable-surface-and-stop-taxonomy-over-canonical-public-control-truth.md
intake_source: Rebuilt `/Users/jim/src/apps/ai_sdlc_examples/local_projects/data_mapper/data_mapper.test46.ts` proves install and graph-query readiness, but installed `odd-sdlc-ts start` stops at `fp_worker_unattached` without a worker and only projects `dispatch_required` with `--worker process://codex`; it does not invoke the worker, materialize assets, ingest results, update ABG events, or advance to the next edge.
target_truth: A cold installed `data_mapper.test46.ts` workspace supports the already-ratified ABG operator UX shape: `User -> [Agentic_Coder_CLI | Plain CLI] -> installed odd_sdlc command/callable contract -> ABG runtime truth -> GTL graph-function edge -> IoC worker/plugin execution -> materialized asset and report -> ABG event/projection truth -> [Agentic_Coder_CLI | Plain CLI] -> User`.
superseded_truth: Installed `start` proving only `dispatch_required` is enough to claim the TypeScript SDLC tenant is operational over data_mapper.
closure_law: close only when the UX walkthrough is ratified into product/requirement/design surfaces under STDO-UX, all required implementation features are either completed or explicitly split into subordinate tickets with non-overlapping ownership, and `data_mapper.test46.ts` has a sandbox/live proof showing at least one constructive edge moves from dispatch through materialized output and replay-derived next-edge projection using installed commands.
non_closure_conditions:
  - agentic coder CLI is described only as a worker transport instead of the primary operator UI binding
  - `start` stops at `dispatch_required` and no worker process is invoked
  - worker invocation is hidden in a test harness rather than the installed command/runtime path
  - output paths or asset IDs are hardcoded by the test instead of governed by an admitted allocation or explicit target binding
  - result ingestion bypasses ABG event/projection truth
  - CLI output is too large/noisy for operator use and lacks a concise status view
  - Python behavior is copied file-for-file instead of translated into graph-function, typed-carrier, and ABG-runtime terms
---

# T-064: test46 Installed Operator UX

## Problem

The current TypeScript installed path is too fragmented.

`data_mapper.test46.ts` now proves:

- ABG substrate install works.
- `odd_sdlc` install topology is present.
- installed `odd-sdlc-ts gaps` works.
- installed `odd-sdlc-ts start` resolves the SDLC executive graph.
- `--worker process://codex` changes the state from missing worker to
  `dispatch_required`.

It does not prove the operator experience that matters:

```text
User -> [Agentic_Coder_CLI | Plain CLI]
  -> installed odd_sdlc command/callable contract
  -> ABG runtime truth
  -> GTL graph-function edge
  -> IoC worker/plugin execution
  -> materialized asset + worker result report
  -> ABG event/projection truth
  -> [Agentic_Coder_CLI | Plain CLI]
  -> User
```

The Python tenant already demonstrated a useful operational loop. The
TypeScript tenant should translate that behavior into ODD-native graph
functions, typed carriers, ABG runtime truth, and installed command UX. It
should not rebuild Python's imperative structure or close one small switch at a
time.

## STDO-UX Correction

This ticket was originally framed from the failing installed command symptom.
That was too low.

The upstream ABG product line already ratified the operator law:

- `gen-start` / `gen-gaps` are public named operator compositions
- literal CLI spellings are delivery bindings beneath those compositions
- the primary flexible UI is the agentic coder CLI
- downstream products must consume ABG substrate truth rather than rebuilding a
  second control loop

So this ticket is not inventing a new UX. It is migrating that UX law into the
`odd_sdlc.TS` installed product line.

`STDO-UX` means the normal STDO stack applied to an operator/user-interface
boundary. For this ticket, the UI boundary is:

```text
User -> [Agentic_Coder_CLI | Plain CLI] -> installed odd_sdlc contract
```

The agentic coder CLI is not merely a worker process. It is the interface that
accepts user intent, reads the generated bootstrap provenance, calls installed
commands, inspects archives, and reports the next lawful state. When ABG
dispatches an `F_P` graph edge to Codex or another model-backed process, that
same technology may also act as a worker/plugin binding. Those roles must stay
distinguished.

## UX Walkthrough To Govern

This is the product experience this ticket owns.

### 1. Fresh Installed Workspace

Given a workspace created from:

```text
/Users/jim/src/apps/ai_sdlc_examples/local_projects/data_mapper/data_mapper.template
```

and installed as:

```text
/Users/jim/src/apps/ai_sdlc_examples/local_projects/data_mapper/data_mapper.test46.ts
```

the operator can open a cold agent session and inspect local instructions,
manifests, standards references, and installed commands without source-tree
private knowledge.

### 2. Gaps

The operator runs:

```bash
node_modules/.bin/odd-sdlc-ts gaps --workspace .
```

Expected UX:

- concise summary first
- target graph function
- current edge
- why it is open
- next lawful action
- machine-readable detail available without overwhelming the normal view

Current state:

- command succeeds
- current graph function is `bootstrap_release_self_test`
- current edge is `derive_intent_surface`
- blocked without worker attachment
- output is much too large for operator use

### 3. Start Without Worker

The operator runs:

```bash
node_modules/.bin/odd-sdlc-ts start --workspace . --target next --until blocked
```

Expected UX:

- truthful blocked state
- explicit worker attachment requirement
- exact command shape or config surface needed to continue
- no hidden attempt to construct assets

Current state:

- command returns `fp_worker_unattached`
- this is truthful but not yet enough to continue productively

### 4. Start With Worker

The operator runs:

```bash
node_modules/.bin/odd-sdlc-ts start --workspace . --target next --until blocked --worker process://codex
```

Expected UX:

- worker transport is admitted
- selected graph-function edge is projected
- worker handoff manifest is constructed
- worker is invoked through the installed runtime path
- worker writes the required output artifact and report
- runtime ingests the result and emits replayable events

Current state:

- command returns `dispatch_required`
- no worker process is invoked
- no output asset is materialized
- no runtime event progression is emitted

### 5. Result Ingestion And Next Gaps

After worker completion, the operator runs:

```bash
node_modules/.bin/odd-sdlc-ts gaps --workspace .
```

Expected UX:

- previous edge is closed or yielded with explicit reason
- produced asset identity and path are visible
- next edge is visible
- unresolved requirements remain live pressure
- archive/postmortem records exact event sequence and worker evidence

Current state:

- not available through installed command path

## Derived Feature Inventory

The implementation must derive from the walkthrough, not from local helper
pressure.

### F1. Concise Operator Projection

Installed `gaps` and `start` need a human-usable summary before detailed JSON.
The detailed payload may remain available, but the default UX must not dump the
entire GTL module for routine operation.

Required fields:

- workspace
- graph function
- current edge
- status
- blocking reason
- next lawful action
- evidence/archive refs

### F2. Worker Registry And Transport Contract

`--worker process://codex` must be more than an admitted string.

The installed product needs a governed worker registry or transport contract
that answers:

- command executable
- allowed workspace root
- timeout/progress policy
- result artifact contract
- stdout/stderr archive path
- failure classification

This can initially support Codex only, but the carrier must not be Codex-only
in shape.

### F3. Start Executes The Selected Edge

Installed `start` must cross the current gap:

```text
dispatch_required -> worker_invoked -> result_observed -> postflight_evaluated
```

The command must not stop after projecting dispatch when a valid worker
transport is supplied.

### F4. Worker Handoff Manifest

The worker must receive a governed manifest derived from:

- admitted workspace ingress
- selected graph function
- selected edge
- source asset bindings
- target asset/output binding
- method references
- proof obligations
- allowed write roots
- result report schema

This is the product counterpart of ABG runtime allocation. If ABG T-082 is not
yet complete, the TypeScript SDLC slice may use an explicit temporary output
binding, but it must be called out as transitional and must not become hidden
path lore.

### F5. Output Asset Materialization

The worker must write a real output asset for at least the first edge in
`data_mapper.test46.ts`.

For the first proof, the accepted target may be narrow:

```text
derive_intent_surface: input_set -> intent_surface
```

The output must be:

- non-empty
- typed as the target asset surface
- linked to the producing graph function and edge
- bound to a path under an admitted output root
- digest recorded

### F6. Result Report Admission

The worker report must be admitted through typed carriers, not parsed as
ambient prose.

Minimum report fields:

- report kind
- graph function
- edge
- output asset type
- output file/path
- digest or enough data to verify digest
- summary
- unresolved reasons, if any

### F7. Postflight F_D

After construction, deterministic postflight must prove:

- output file exists
- output is non-empty
- report references the selected graph function and edge
- report target asset type matches the edge output
- digest matches materialized content
- output root is within the admitted workspace/output allocation

### F8. Event And Projection Update

Completion must feed ABG/runtime truth rather than only a local test object.

Expected minimum runtime facts:

- worker dispatch/handoff evidence
- result observation
- assessment/admission
- edge closure or yielded handoff
- next edge projection

### F9. Archive And Postmortem

The run must preserve:

- command invocation
- worker prompt/manifest
- worker stdout/stderr
- worker result report
- generated asset
- event/projection evidence
- postmortem with actual vs expected event sequence
- comparison note against the Python operational precedent

### F10. Re-Start Loop

After one constructive edge, rerunning `gaps` and `start` must not restart from
zero. It must consume replay/current state and point to the next open edge or a
truthful stop.

## Implementation Order

1. Product/requirement tightening:
   define the installed operator UX and command outcome contract.
2. Design:
   publish a TypeScript design surface for worker transport, handoff manifest,
   result report, materialized output, and event/projection update.
3. First implementation slice:
   implement one-edge `derive_intent_surface` over `data_mapper.test46.ts`.
4. Proof:
   run installed command path from the test46 workspace and archive the result.
5. Extension decision:
   either continue edge-by-edge under this ticket or split further tickets only
   after the first governed UX loop is real.

## Design Module Method Bar

Before code changes that add new runtime entities, the implementation must
include:

- structural carrier diagram
- first-slice IACS
- explicit local/global optimization review
- module-derived unit tests for carriers and evaluators
- sandbox/live test proving installed command behavior

The review must specifically guard against:

- a shadow SDLC runtime beside ABG
- a Codex-only imperative adapter
- hardcoded data_mapper path assumptions
- output materialization outside governed binding
- repeated huge JSON CLI dumps as the only operator UX

## Relationship To Existing Tickets

T-041 remains the broad full Python-replacement RC envelope.

This ticket carves out the concrete operator UX needed to make that discussion
actionable. It should either close a major part of T-041 or produce a smaller
set of follow-up tickets after one real installed test46 loop exists.

ABG T-082 owns generic runtime output allocation. This ticket may proceed with
an explicit transitional output binding for the first slice, but the end-state
must converge with ABG-owned output allocation rather than institutionalizing
an SDLC-local allocator.

## Minimal Closure Proof

The minimum close proof is a run from:

```text
/Users/jim/src/apps/ai_sdlc_examples/local_projects/data_mapper/data_mapper.test46.ts
```

using installed commands only:

```bash
node_modules/.bin/odd-sdlc-ts gaps --workspace .
node_modules/.bin/odd-sdlc-ts start --workspace . --target next --until blocked --worker process://codex
node_modules/.bin/odd-sdlc-ts gaps --workspace .
```

Expected minimum outcome:

- first `gaps` shows `derive_intent_surface` open
- `start` invokes worker, writes an `intent_surface` artifact, admits the
  worker report, and records runtime evidence
- second `gaps` does not report the same unchanged starting state; it reports
  the next lawful edge or a specific postflight/yield/gap reason
- archive proves actual event sequence, elapsed time, generated files,
  postflight status, and remaining gaps

## Implementation Progress

### 2026-04-27 First Installed-Operator Slice

Completed in the TypeScript source tenant:

- product/requirement authority exists for installed operator UX:
  `specification/PRODUCT.md` and
  `specification/requirements/14-odd-sdlc-installed-product-contract.md`
- design surface added:
  `build_tenants/typescript/design/ODD_SDLC_TYPESCRIPT_INSTALLED_OPERATOR_UX.md`
- implementation slice added under `build_tenants/typescript/code/src/operator/`
- `cli/command.ts` now routes async installed `start --worker ...` into the
  operator slice while keeping sync/public `start` as the bounded projection
  adapter
- `gaps` now consumes `.ai-workspace/events/events.jsonl` instead of always
  projecting over an empty replay
- focused proof added:
  `build_tenants/typescript/test_env/tests/test_t064_installed_operator_ux.test.mjs`

Verified:

- `npm run test:t064` passed
- `npm run test:t058` passed
- `npm run test:semantic` passed, 74 tests
- `npm run lint:semantic` passed

Proof currently established:

- admitted `process://...` worker transport
- graph-function-derived handoff manifest
- real worker process invocation
- materialized `intent_surface` artifact
- admitted JSON worker report
- deterministic postflight and hook postflight
- ABG-compatible runtime event append to `.ai-workspace/events/events.jsonl`
- second `gaps` advances from `derive_intent_surface` to
  `derive_product_surface`

Remaining before ticket closure:

- rebuild and run the independent
  `/Users/jim/src/apps/ai_sdlc_examples/local_projects/data_mapper/data_mapper.test46.ts`
  installed workspace through the same installed command path
- archive the test46 command stdout/stderr, generated files, event log, and
  postmortem
- decide whether further multi-edge test46 execution stays inside this ticket
  or splits into a narrower follow-up after the first real workload edge
  succeeds

### 2026-04-27 Independent data_mapper.test46.ts Live Proof

Executed against:

```text
/Users/jim/src/apps/ai_sdlc_examples/local_projects/data_mapper/data_mapper.test46.ts
```

Setup:

- rebuilt the workspace from
  `/Users/jim/src/apps/ai_sdlc_examples/local_projects/data_mapper/data_mapper.template`
- installed current `odd_sdlc` TypeScript package into the target workspace
  using the public TypeScript installer
- installed ABG substrate reported package
  `@abiogenesis/typescript-tenant@3.4.0-rc.2`
- verified first installed `gaps` started at `derive_intent_surface`

First live attempt:

- command:
  `node_modules/.bin/odd-sdlc-ts start --workspace . --target graph_function:bootstrap_release_self_test --until blocked --worker process://codex`
- result: `worker_failed`
- elapsed: about `204 ms`
- cause: nested Codex could not write `/Users/jim/.codex/sessions` from the
  sandboxed parent command
- archive:
  `.ai-workspace/runtime/odd_sdlc/operator-runs/20260427T060536194Z_pid5489`
- no runtime events were appended

Second live attempt:

- reran the same installed command with elevated execution so nested Codex could
  access its session directory
- result: `worker_invoked`
- worker elapsed: `169669.420 ms`
- emitted event sequence:
  `graph_call_opened -> frame_opened -> vector_traversal_planned -> assessed -> assessed`
- event log:
  `.ai-workspace/events/events.jsonl`
- event count after run: `5`
- generated output:
  `.ai-workspace/runtime/odd_sdlc/assets/20260427T063246441Z_pid28236/intent_surface.md`
- output size: `121` lines
- digest:
  `sha256:4b8da692f8e005928dc4dfd574bf4cad4f4c74cd4de6cf362a23c6999308cb49`
- archive:
  `.ai-workspace/runtime/odd_sdlc/operator-runs/20260427T063246441Z_pid28236`

Post-run `gaps` compact verification:

```json
{
  "status": "ok",
  "currentEdge": "derive_product_surface",
  "closedVectorIndexes": [0],
  "gapStatus": "partial"
}
```

Additional UX fix after live proof:

- default binary serialization for `gaps` and `start` now emits concise
  operator text
- full JSON remains available with `ODD_SDLC_TS_OUTPUT=json`
- `test_t064_installed_operator_ux.test.mjs` validates both compact output and
  JSON override
- `test_t059_install_release_adapter.test.mjs` was updated to request JSON for
  machine parsing
- final verification after the formatter change:
  `npm run test:t064`, `npm run test:semantic`, and `npm run lint:semantic`
  passed
- refreshed the installed `data_mapper.test46.ts` package after the formatter
  change and verified:
  - `.ai-workspace/events/events.jsonl` still contains `5` replay events
  - default installed `gaps` output is compact and reports
    `current_edge: derive_product_surface`
  - `ODD_SDLC_TS_OUTPUT=json` still returns the full machine-readable payload

Final closure proof:

- refreshed `data_mapper.test46.ts` through the public `odd-sdlc-ts install`
  path after the ABG repeat-install repair
- ABG substrate refresh reported `installMode: "refresh"` and
  `@abiogenesis/typescript-tenant@3.4.0-rc.2`
- generated `AGENTS.md`, `CLAUDE.md`, bootstrap guide, install manifest, and
  normalization projection carry STDO/STDO-UX bootstrap provenance
- installed compact `gaps` reported `current_edge: derive_intent_surface`
  before live execution
- installed live command:
  `node_modules/.bin/odd-sdlc-ts start --workspace . --target next --until blocked --worker process://codex`
- result: `worker_invoked`
- worker elapsed: `132267.333292 ms`
- emitted event sequence:
  `graph_call_opened -> frame_opened -> vector_traversal_planned -> assessed -> assessed`
- event log:
  `.ai-workspace/events/events.jsonl`
- event count after run: `5`
- generated output:
  `.ai-workspace/runtime/odd_sdlc/assets/20260427T082235364Z_pid60375/intent_surface.md`
- digest:
  `sha256:21661d9c9c3e6a315f39b54146f8dacd62f4fdb5606f8863a6271fb46df01ee9`
- archive:
  `.ai-workspace/runtime/odd_sdlc/operator-runs/20260427T082235364Z_pid60375`
- postflight status: `passed`
- post-run compact `gaps` reports `status: partial`,
  `current_edge: derive_product_surface`, and `closed_vectors: 0`
- post-run JSON `gaps` remains available with `ODD_SDLC_TS_OUTPUT=json`

Verification:

- `npm run test:t064` passed
- `npm run test:t059` passed
- `npm run test:semantic` passed, `74` tests
- `npm run lint:semantic` passed

Close status:

- T-064 closes as the first-edge installed operator UX ticket
- multi-edge `data_mapper` continuation and full Python replacement remain
  owned by T-041 or narrower follow-up tickets

## Non-Goals

- Do not claim full multi-edge Python parity from one edge.
- Do not implement a general service/orchestration plane in this ticket.
- Do not make data_mapper part of the odd_sdlc product.
- Do not make ABG own SDLC domain semantics.
- Do not bypass the installed command path with a private test harness.
