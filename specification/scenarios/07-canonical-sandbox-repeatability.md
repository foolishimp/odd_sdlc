# Scenario Bundle - Canonical Sandbox Repeatability

**Validates**: REQ-F-VERIFY-003, REQ-F-VERIFY-004, REQ-F-ODDSDLC-004

**Purpose**: Prove that the first `odd_sdlc` app can run in an installed
sandbox, be reset to a clean runtime state, and run again with the same
post-mortem runtime audit shape.

## Scenario

Install a clean sandbox workspace, seed the first `odd_sdlc` tenant package and
its canonical bootstrap specification surfaces, run the first bootstrap
dependency chain:

- `derive_intent_surface`
- `derive_product_surface`
- `derive_goal_surface`
- `derive_requirement_surface`
- `derive_feature_decomp_surface`
- `derive_uat_testcases_surface`

For each call, execute one bounded constructor turn, ingest the resulting
successful `F_P` result through `genesis assess-result`, audit the resulting
runtime facts, wipe runtime state, and then rerun the same use case.

## Significant Paths

- install path: the sandbox installs the GTL/ABG runtime cleanly
- seed path: the toy app package and canonical specification surfaces are
  materialized into the sandbox
- first-run path: the sandbox opens the bootstrap chain and first downstream
  fan-out graph calls in dependency order and emits runtime facts
- constructor path: a bounded constructor turn writes the target surface and
  emits a result file for the open call
- asset path: the constructor records attributable asset checkpoint mutation in
  the event log before result ingestion
- completion path: that result file is ingested through `genesis assess-result`
  and closes the graph call lawfully
- archive path: first-run runtime state is retained as post-mortem evidence
  before reset so reruns can be compared against archived artifacts
- reset path: runtime state is wiped without changing the installed runtime or
  app package
- rerun path: the sandbox reruns the same use case and emits the same event
  shape from a clean runtime state
- audit path: post-mortem review over the sandbox event log remains the primary
  proof surface

## Expected Outcomes

1. the sandbox runs from the installed runtime rather than from source-tree
   imports
2. the dependency chain advances in the order
   `INTENT -> PRODUCT -> GOALS -> requirements`, then fans out from
   `requirements` to feature decomposition and UAT testcase surfaces
3. each bounded constructor turn records attributable asset checkpoint mutation
   and then successful result ingestion produces lawful `assessed`,
   `proof_passed`, `closure_passed`, `graph_call_closed`, and `run_completed`
   truth
4. resetting the sandbox clears runtime state without corrupting the app
5. rerunning produces a clean event log with the same significant lifecycle
   shape
6. first-run and rerun post-mortem artifacts are both retained for comparative
   analysis
