# odd_sdlc v2.0.0-rc.1 Release Note

## RC Identity

- product: `odd_sdlc`
- candidate: `v2.0.0-rc.1`
- RC branch: `rc/2.0.0`
- predecessor: `v1.0.0-rc.2` (Python-line RC)
- release state: first published release candidate for the `2.0.0` line

## Position

`v2.0.0` reflects the TypeScript build_tenant maturing into a co-equal
realization of the `odd_sdlc` constitutional surface alongside the Python line.

The `2.0` boundary is set because the TypeScript tenant now carries:

- the constitutional traversal-consequence chain
  (`SdlcConstructionIntent → SdlcWorksiteEvidence → SdlcEdgeFulfillmentLedger
  → SdlcEdgeClosureDecision → SdlcNextActionProjection`)
- ABG 3.7.1 evaluator and liveness substrate consumption
- governed worker invocation, evidence admission, and replay
- a working live lane that produces a Rust hello-world product end-to-end

This is a multi-tenant constitutional surface, not a Python-only project with a
TypeScript port.

## What Shipped

### TypeScript Tenant Foundation Through Maturity

- `build_tenants/typescript/` is now a co-equal realization of the constitutional
  `specification/`, with the same graph/F_P/F_D semantics carried in TypeScript
  carriers
- the tenant carries its own qualification surfaces, test environment, and
  per-tenant configuration alongside the Python tenant
- ratified design surfaces governing the tenant include the build_tenants/<tenant>/design
  ADR convention published in specification_methodology v1.6.0

### ABG 3.7.1 Substrate Migration

- `Track ABG 3.7.1 substrate migration` (1a294fe) and follow-up evaluator
  traversal compliance work moved odd_sdlc onto ABG 3.7.1's evaluator and
  liveness substrate
- TypeScript and Python lines both consume ABG runtime, projection, and
  admission contracts; runtime events flow through ABG admission rather than
  through odd_sdlc-local writers
- B-032 `workspace_installation_admitted` runtime event is admitted by ABG
  during install and emitted by `installer.ts:240`

### Constructive Evaluation And Yield Loop

- `SdlcEdgeFulfillmentLedger`, `SdlcEdgeClosureDecision`, and
  `SdlcNextActionProjection` carry the closure law for every traversed edge
- closure decision is the seven-disposition sum type
  `{close, yield, retry, repair, re-enter, reprice, block}`
- `yield` is admitted as lawful iterate, distinct from retry/block/timeout
- next-action selection derives from `SdlcEdgeClosureDecision` plus fresh
  observation, not from gap dossier strings or local controller state
- aligns with the constructive evaluation and yield loop ratified in
  specification_methodology v1.6.0 ODD_METHOD §11.5D

### GTL Transform Boundary (T-141)

- requirement-edge obligations partition into `edge_local` (gates this edge)
  and `downstream_transformation_set` (carried into product materialization)
- requirement edge closes when local obligations converge; downstream pressure
  is emitted as observation rows for the next product-asset action
- `traversal_consequence.ts` is the single computation surface for the partition

### T-002 Prompt And Control Frame Correction

- worker prompts are compact, reference-first launch contracts
- `SdlcWorkerInvocationPackage` carries the single `transformAxioms` authority,
  `outcomeDirectives`, declared product file targets, traversal strategy,
  feature scope, and trace obligations
- Claude transport delivers prompt content on stdin; argv contains only the
  non-interactive stream-json command contract
- byproduct filtering narrows to `target/`, `*/target/*`, `*/project/target/*`,
  and `.bsp/*` paths; valid `project/*` source files (SBT plugins/properties)
  are no longer dropped

### T-004 Homeostatic Gap Triage

- public `gaps` returns typed `homeostaticTriage` with distinct
  `SdlcGapObservation`, `SdlcTriageClassification`, and `SdlcRouteBinding`
  carriers
- requirement-vs-code, requirement-vs-test, and requirement-lineage authority
  failures route to distinct re-entry edges
- `SdlcRequirementTransformLineage` carries typed transform-authority rows
  from workspace ingress; stale, ambiguous, or contradictory authority routes
  upstream to requirements re-entry before code/design repair
- `gaps` remains read-only and emits no runtime events

### Tenant-Local SDLC Surface Placement

- runtime reports, packages, and ledgers stay in
  `.ai-workspace/runtime/odd_sdlc/`
- target surface artifacts (`component_code_surface.md`,
  `implementation_design_surface.md`) are written under
  `build_tenants/<tenant>/design/` or `build_tenants/<tenant>/design/adrs/`
- ADR output validation enforces the SPEC_METHOD field set
  (Status, Implements, Derives from, Supersedes, Superseded by,
  Retained special case)

### Live Proof Lanes

- `t133_rust_hello_world_bootstrap_sandbox` produced a working Rust hello-world
  product end-to-end including `Cargo.toml` and `src/main.rs` materialization
  and `cargo run` execution
- `t053_live_fp_data_mapper`, `t087_t091_t096_internal_data_mapper_induction`,
  `t109_live_installed_data_mapper_pty`, and
  `t115_live_installed_data_mapper_repair_flow` ran data_mapper lanes against
  earlier RC code (May 7-8); these lanes have not yet been rerun against the
  T-002/T-004 closure code (see Known Limitations)

## Qualification Bundle

This RC was qualified on the source cut at commit `134aac5`.

TypeScript tenant tests passing on the closing wave:

- `npm run build:semantic` — passed
- `npm run test:t036` — 14/14 passed (gap triage homeostatic route)
- `npm run test:t058` — 8/8 passed (spec method entrypoint)
- `npm run test:t066` — 31/31 passed (product materialization contract)
- `npm run test:t068` — 5/5 passed (conform project profile)
- `npm run test:t038` — 4/4 passed (RC qualification)
- `npm run test:t139` — 7/7 passed
- `npm run test:t032` — 4/4 passed
- `node --test test_env/tests/test_b070_claude_worker_argv.test.mjs` — 16/16 passed
- `node --test test_env/tests/test_t118_worker_invocation_package.test.mjs` — 2/2 passed
- `node --test test_env/tests/test_t123_per_edge_traversal_strategy.test.mjs` — 7/7 passed
- `node --test test_env/tests/test_t141_gtl_transform_boundary.test.mjs` — 7/7 passed
- `git diff --check` — passed

Live proof:

- `t133_rust_hello_world_bootstrap_sandbox/20260510T131449249Z_pid86962`:
  product proof `Hello, world!` from `cargo run`; worker prompt bytes reduced
  from 15699 to 6712 across the two-worker path; authority prompt reduced from
  7220 to 3544 bytes

The Python tenant qualification carried over from `v1.0.0-rc.2` remains the
authoritative Python-line qualification for this RC.

## Known Limitations

- live data_mapper lanes have not been rerun against the T-002/T-004 closure
  code; the most recent live data_mapper runs are dated May 7-8 against
  pre-closure code. T-002 and T-004 closure boundaries explicitly defer
  data_mapper parity to the test35 uplift parity lane
- the test35 uplift parity table has 1 row Done, 8 rows Partial, 1 row Not Done
  against the TypeScript line; full parity is targeted for the next RC cycle
- `installed_operator.ts` still authors product-materialization candidate
  declaration locally; moving candidate declaration into the published GTL
  catalog is a deferred uplift (Row 3 of the test35 uplift table)
- the ADR validator currently requires all six SPEC_METHOD ADR fields including
  `Superseded by` and `Retained special case`; specification_methodology v1.6.0
  marks these as conditional. Reconciliation between validator and template is
  open

## RC Boundary

- RC branch: `rc/2.0.0`
- RC tag: `v2.0.0-rc.1`

This RC tag is immutable. Subsequent RC work in the `2.0.0` window will publish
new RC tags (`v2.0.0-rc.2`, ...) without mutating this cut.

The final tap will be `release/2.0.0` / `v2.0.0` after RC qualification and
operator review accept the `2.0.0` candidate scope.
