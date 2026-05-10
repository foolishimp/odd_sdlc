# T-002 Clarify Stateless Graph Functions Over Stateful Workspace Activity

- id: T-002
- title: Clarify odd_sdlc builder control as stateless graph functions over stateful workspace activity
- type: feature
- status: completed
- goal: ambiguity-governance-and-traceability
- priority: critical
- created_at: 2026-04-12
- updated_at: 2026-05-11
- dependencies: B-001, T-003, B-002

## Triage

- intake: feature / operator finding / live `test28` proving result
- lawful_change_class: design_reframe
- affected_boundary: odd_sdlc control-frame design, graph-function builder behavior, prompt/context selection, stateful worksite observation, system asset refs, workspace asset refs, and repair over installed workspace assets
- lawful_re_entry: odd_sdlc design and realization surfaces for builder control, graph functions, and proving lanes
- downstream_proof_span: odd_sdlc prompt/control-frame design, targeted proof lanes, then fresh live proving on the `data_mapper` regression corpus

## Framing Correction - 2026-05-10

The original title and some body text were inaccurate.

The target is not to make graph functions or F_P builder functions stateful.
The target is:

```text
stateless graph/F_P function
  over observed stateful worksite
  using explicit system asset refs and workspace asset refs
  producing candidate transform evidence
  admitted by F_D/runtime into workspace state
```

`odd_sdlc` should preserve the functional-programming boundary:

- graph functions are named stateless constructive programs;
- F_P workers evaluate/transform from bounded inputs and current observed
  worksite refs;
- F_P does not directly publish closure truth, ledgers, events, or canonical
  workspace state;
- F_D/runtime admission owns event writes, ledger writes, materialization
  admission, and replay-visible state mutation.

The worksite is stateful. The functions are not. The runner repeatedly observes
the stateful workspace/system asset set, selects a lawful stateless transform,
admits the result, and observes again.

The old phrase "stateful iterator" should therefore be read only as "stateful
workspace traversal". It must not be implemented as stateful graph functions,
hidden worker memory, or local controller state that bypasses events, ledgers,
or admitted workspace assets.

## Why This Ticket Exists

The current live builder works much better than before, but it still carries too
much serialized-input bias.

Observed in `test28`:

- some prompts still serialize large state payloads that the builder does not
  need inline
- the builder should be invoked as a bounded stateless transform over the
  observed evolving worksite, not over a giant serialized input frame
- delivery, traceability, and current-state inspection need to be the primary
  frame, not bulk environment dumping

This is domain-local work.

`odd_sdlc` owns the ontology of the worksite assets under construction, the
builder control frame, and the prompt composition strategy. ABG already
supplies enough runtime facts for the domain to correct its own model first.

## Intended Direction

`odd_sdlc` should behave like a governed traversal over a stateful worksite
using stateless graph functions:

- observe current system assets and workspace assets
- determine what is already realized
- identify the remaining obligation on the current edge or downstream
  transformation set
- invoke the selected stateless transform with bounded worksite refs,
  target-binding refs, and obligation refs
- admit transform evidence through F_D/runtime surfaces
- re-observe and continue from replay-visible state

The prompt/control frame should become more ontology-first, delivery-first, and
reference-first.

## Task List

- [x] Identify the active odd_sdlc edge families that need distinct builder
  control frames rather than one serialized-input-shaped prompt pattern.
- [x] Reframe odd_sdlc builder prompts around observed stateful worksite assets
  rather than serialized bulk state.
- [x] Keep delivery and traceability obligations explicit in each builder frame.
- [x] Move large register and environment payloads out of the default inline
  prompt path where a reference-first domain frame is sufficient.
- [x] Make edge prompts explicitly inspect current system/workspace asset refs
  before further transformation.
- [x] Normalize remaining ticket/design language so "stateful iterator" cannot
  be read as stateful graph functions or worker-owned hidden state.
- [x] Bind `data_mapper` proving as downstream parity/RC work after this
  prompt/control-frame closure instead of keeping T-002 open as a
  data_mapper-scale proof ticket.

## Closure Boundary - 2026-05-11

T-002 is closed as the methodological prompt/control-frame correction:

- graph functions and F_P worker invocations remain stateless transforms;
- the observed workspace, system assets, and workspace assets are the stateful
  worksite being transformed;
- worker launch prompts now stay compact and reference-first;
- structured worker packages carry the single axiom authority,
  outcomeDirectives, target file refs, strategy, feature scope, and trace
  obligations;
- Claude transport receives prompt content on stdin instead of argv;
- execution byproduct filtering no longer drops `project/**` as a whole.

This ticket does not claim `data_mapper` parity. The data_mapper proof belongs
to the next test35 parity goal now that the prompt/control-frame surface is no
longer the blocker.

## Current Slice

Started 2026-04-12.

Delivered in the first implementation slice:

- published a shared worksite-observation control frame into runtime workspace
  context so every leaf builder prompt sees the current system/workspace asset
  refs under construction rather than a one-shot serialized input blob
- replaced the inlined requirement-closure register prompt surface with a
  compact builder context that summarizes current closure pressure and points to
  the full register by reference for on-demand inspection
- added an edge-local realized-test-source obligation context for
  `derive_test_run_archive_surface`
- carried the new domain control-frame assets through the release installer so
  installed workspaces and source workspaces behave the same way

Proof for this slice:

- `test_odd_sdlc_first_slice.py`
- `test_odd_sdlc_installation.py -k 'requirement_closure_register_preserves_carry_forward_and_traceability or default_claude_manifest_declares_domain_dispatch_timeout'`

Live acceptance is still open:

- do not close this ticket before reviewing the reset-driven second proving loop
  on `data_mapper.test28`
- current live evidence shows the new stateful control frame on some later
  edges, but the second loop still reopened from `derive_requirement_surface`
  with a very large prompt payload (`prompt_length: 135107`)
- that means the first slice is real but incomplete; the replay/rebuild path is
  still carrying too much serialized state on at least the requirement edge
- the current `test28` second loop is baseline evidence only; that workspace is
  still running the pre-`T-002` domain cut and must not be treated as final
  acceptance for this ticket

Delivered in the second implementation slice:

- identified a distinct realization-family builder frame for
  `derive_implementation_module_surface`, `derive_code_surface`, and
  `derive_test_module_surface`
- published `REALIZATION_DEEPENING_CONTROL_FRAME.md` so realization-family
  prompts explicitly treat existing files and existing module groups as
  obligations rather than proof of completion
- required realization-family prompts to prefer deepening shallow existing
  realization before widening the surface laterally
- carried the realization-deepening frame through the release installer and
  runtime context publication path so installed workspaces receive the same
  domain law as source workspaces
- added direct prompt proof for the code edge so the builder prompt now carries
  the realization-deepening law, not just the shared generic stateful frame

Proof for the second slice:

- `test_odd_sdlc_first_slice.py`
- `test_odd_sdlc_installation.py`
- `test_odd_sdlc_fd_evidence.py`
- combined internal run:
  - `python -m pytest build_tenants/odd_sdlc/python/test_env/tests/test_odd_sdlc_first_slice.py build_tenants/odd_sdlc/python/test_env/tests/test_odd_sdlc_installation.py build_tenants/odd_sdlc/python/test_env/tests/test_odd_sdlc_fd_evidence.py -q`
  - result: `29 passed in 109.31s`

Added isolated `test28`-style installed-template regression proof:

- replaced the unstable full installed `start --auto` regression primitive with
  bounded chained traversal from intent over the literal `data_mapper.template`
- split the regression into separate properties instead of asking one complex
  lane to prove prompt boundedness, code-edge control framing, deterministic
  failure carriage, reset/replay, and frontier stopping behavior at once
- requirement replay lane:
  - chains only through `derive_requirement_surface`
  - proves the requirement-edge prompt stays compact and reference-first on a
    real installed `data_mapper.template` run
  - proves a lawful workspace `reset` reruns from intent and keeps the replayed
    requirement prompt bounded rather than exploding back toward the historical
    `test28.02` giant serialized payload
- code-edge lane:
  - chains once through `derive_code_surface`
  - proves the installed code prompt carries the
    realization-deepening law on the same real template fixture
- removed the template-side assertion that the same run must also expose a live
  failing deterministic lane with structured `stdout`; that property remains
  proven in the dedicated `B-002` regression tests instead of making the
  template fixture carry an unstable extra obligation

Proof for the isolated installed-template regression slice:

- `python -m pytest build_tenants/odd_sdlc/python/test_env/tests/test_odd_sdlc_test28_regression.py -q`
  - result: `3 passed in 77.72s`

Added second-pass deepening proof on the literal `data_mapper.template`
fixture:

- seeded an existing shallow code realization under the governed code root
- reset and replayed the chain lawfully back into `derive_code_surface`
- proved the second pass changed the existing shallow file rather than only
  widening the surface laterally
- kept the deepening behavior under explicit realization-family prompt law by
  requiring the fake proving agent to reject prompts missing the
  realization-deepening control frame

Proof for the second-pass deepening slice:

- `python -m pytest build_tenants/odd_sdlc/python/test_env/tests/test_odd_sdlc_test28_regression.py -q`
  - result: `4 passed in 224.25s`

Historical next-cut note:

- the remaining edge-family and data_mapper-scale proving work is no longer
  owned by T-002;
- T-002's closure surface is the generic prompt/control-frame correction;
- data_mapper parity resumes through the test35 uplift goal sequence using
  this corrected control frame.

## TypeScript Slice - 2026-05-10

This slice addresses the current TypeScript worker-launch duplication without
changing graph/F_P semantics.

Problem:

- `worker_prompt.md` is already archived as the bounded launch contract and is
  intentionally compact/reference-first.
- `worker_brief.json`, `worker_invocation_package.json`, and
  `traversal_intent_package.json` carry the worker-facing authority by file ref.
- `process://claude` still passed the full prompt text as a positional argv
  value, so command traces, PTY command lines, and process metadata could record
  the prompt payload again.

Implemented:

- `process://claude` now matches the Codex worker shape: argv carries only the
  non-interactive stream-json command contract, while prompt content is supplied
  through stdin.
- PTY launches redirect the prompt file into stdin instead of embedding prompt
  content in argv.
- local-spawn launches pipe prompt content through stdin.
- model and effort controls remain argv flags because they are transport
  configuration, not worksite prompt payload.

This keeps the functional boundary intact:

```text
stateless F_P.transform(prompt stdin over explicit worksite refs)
  -> candidate transform evidence
  -> F_D/runtime admission and closure
```

Verification:

```bash
npm run build:semantic
# passed

node --test test_env/tests/test_b070_claude_worker_argv.test.mjs
# 16/16 passed

node --test test_env/tests/test_t118_worker_invocation_package.test.mjs
# 3/3 passed

ODD_SDLC_TS_T133_RUST_HELLO_WORLD_WORKER='process://claude?model=sonnet&effort=xhigh' npm run test:t133:rust-live
# 3/3 passed, duration_ms 215658.909375
```

Live proof archive:

- `build_tenants/typescript/test_env/test_runs/t133_rust_hello_world_bootstrap_sandbox/20260510T123258000Z_pid1689`
- product proof: `build_tenants/hello_world_rust/Cargo.toml` and
  `build_tenants/hello_world_rust/src/main.rs` were generated; `cargo run`
  produced `Hello, world!`.
- transport proof: the materialization worker command used `/bin/sh -lc
  'prompt_file=$1; shift; exec "$@" < "$prompt_file"' ... claude -p --model
  sonnet --effort xhigh --output-format stream-json --verbose
  --permission-mode bypassPermissions`; the prompt file path was redirected to
  stdin and the prompt payload was not present in the Claude argv.

Remaining T-002 work:

- none inside this ticket.
- data_mapper proof remains the downstream parity/RC lane, not a T-002 closure
  condition.

## TypeScript Compact Prompt Slice - 2026-05-10

This slice keeps traversal behavior unchanged and reduces the worker launch
attention surface.

Problem:

- the transport fix removed prompt duplication from Claude argv, but the launch
  prompt still carried long repeated prose;
- the worker package already carries structured worksite refs, materialization
  contracts, target file refs, and closure/evaluator refs;
- compacting too far caused live authority-conformance regressions because the
  worker produced the transform artifact but did not update the actual authority
  files.

Implemented:

- `SdlcWorkerInvocationPackage` now carries terse `transformAxioms` and
  edge-local `outcomeDirectives` as structured package fields;
- `SdlcWorkerInvocationOutputContract` now carries
  `declaredProductFileTargets` so prompts can point at the expected product
  assets without restating the whole contract prose;
- `promptForHandoff()` now emits a compact launch frame:
  outcome summary, read order, terse axioms, outcome directives, materialization
  requirement, and package-field pointers;
- authority-conformance directives explicitly require updating the canonical
  authority files:
  `.ai-workspace/context/project_bootstrap.md`, `specification/INTENT.md`,
  `specification/PRODUCT.md`, `specification/GOALS.md`,
  `specification/requirements/README.md`, and requirement files.
- component-code materialization observation now ignores build execution
  byproducts such as `target/` and `.bsp/` files, preventing build-tool
  scratch files from becoming product-materialization evidence.

Functional boundary:

```text
focused F_P.transform(prompt stdin + package refs)
  -> candidate transform evidence
  -> F_D/runtime admission
  -> unchanged traversal/closure behavior
```

Verification:

```bash
npm run build:semantic
# passed

node --test test_env/tests/test_t118_worker_invocation_package.test.mjs
# 3/3 passed

node --test test_env/tests/test_t066_product_materialization_contract.test.mjs
# 31/31 passed

node --test test_env/tests/test_t123_per_edge_traversal_strategy.test.mjs
# 7/7 passed

node --test test_env/tests/test_t141_gtl_transform_boundary.test.mjs
# 7/7 passed

node --test test_env/tests/test_b070_claude_worker_argv.test.mjs
# 16/16 passed

git diff --check
# passed

ODD_SDLC_TS_T133_RUST_HELLO_WORLD_WORKER='process://claude?model=sonnet&effort=xhigh' npm run test:t133:rust-live
# 3/3 passed, duration_ms 236055.098583
```

Live proof archive:

- `build_tenants/typescript/test_env/test_runs/t133_rust_hello_world_bootstrap_sandbox/20260510T131449249Z_pid86962`
- product proof: `build_tenants/hello_world_rust/Cargo.toml` and
  `build_tenants/hello_world_rust/src/main.rs` were generated; `cargo run`
  produced `Hello, world!`.
- traversal proof: authority conformance closed, gaps selected
  `Fg_materialize_declared_product_asset`, materialization closed, and
  consequence count was `1`.
- run summary proof: `elapsedMs` was `73149`, expected files present count was
  `2`, runtime file count was `101`, runtime asset file count was `1`, and
  operator-run file count was `94`.
- prompt-size proof:
  - prior successful Claude run
    `20260510T123258000Z_pid1689`: `worker_prompt.md` total `15699` bytes
    across two worker invocations;
  - compact successful Claude run
    `20260510T131449249Z_pid86962`: `worker_prompt.md` total `6712` bytes
    across two worker invocations;
  - total worker prompt bytes reduced by about `57%`;
  - authority-conformance prompt reduced from `7220` to `3544` bytes.

Interpretation:

- this reduces the initial prompt attention surface and removes repeated prose
  from the launch prompt;
- it does not claim total Claude token use is minimized, because the worker may
  still inspect referenced files when doing the work;
- the live failures before this proof showed the safe lower bound: terse axioms
  are useful only when paired with exact outcome directives for the target
  assets that must move.

Review follow-up:

- accepted the byproduct-filter finding and narrowed execution byproduct
  filtering so `project/**` is not globally dropped; only build-output paths
  such as `target/**`, `.bsp/**`, and nested `project/target/**` are ignored;
- added deterministic coverage proving `project/build.properties` remains
  admissible materialization evidence while `target/` and `.bsp/` byproducts are
  filtered;
- added deterministic coverage proving declared product file targets from
  `.ai-workspace/context/*.json` reach the worker invocation package and compact
  prompt;
- accepted the duplicate-axiom-authority finding and made
  `workerInvocationPackage.transformAxioms` the single axiom authority named by
  the prompt; the prompt no longer inlines a parallel axiom list;
- preserved full-breadth versus steel-thread strategy as outcome directives so
  compact prompts do not silently narrow induction/product/requirements work;
- did not fold the execution-evidence assertion into this slice because the
  installed loop can return a converged/replayed execution-result step without a
  `workerReport` on that returned object; mandatory replay-visible execution
  evidence should be handled as a separate closure-carrier assertion, not as a
  T-002 prompt-volume change.

## Closure Proof

- focused prompt/control-frame proof:
  - requirement-edge and later-edge manifests shrink or shift materially away
    from bulk serialized state
- installed-template regression proof:
  - a real `data_mapper.template` auto traversal keeps the requirement edge
    bounded and reference-first and preserves realization-deepening law on the
    code edge
- second-pass deepening proof:
  - an existing shallow realization under the governed code root is deepened on
    pass two rather than being left byte-identical while lateral files are
    added elsewhere
- installed-workspace proof:
  - installed sandboxes receive the new domain control frames, not just source
    workspaces
- reset/replay proof:
  - a reset-driven second traversal works against current asset state using the
    post-cut domain framing
- TypeScript compact prompt proof:
  - package refs carry the single axiom authority, outcome directives, declared
    product file targets, and trace obligations;
  - Claude prompt payload is supplied through stdin, not argv;
  - byproduct filtering preserves valid `project/*` source/config files while
    ignoring build outputs.

Downstream proof:

- data_mapper parity and RC behavior are now outside T-002 and should be tested
  through the test35 uplift/data_mapper lane.

## Acceptance

- odd_sdlc prompt/control frames are no longer primarily shaped like pure
  function calls over serialized state
- builder prompts are aligned to observed system/workspace assets under
  construction while the invoked graph/F_P functions remain stateless
- delivery and traceability remain explicit obligations on the builder
- live proof shows better targeted iteration with less inert prompt payload
- ABG remains a fact/execution substrate rather than an odd_sdlc prompt owner

## Links

- parent: `.ai-workspace/tickets/completed/B-001-refactor-odd-method-to-released-abg-boundary.md`
- strategy: `.ai-workspace/comments/codex/20260412T015309Z_STRATEGY_agentic-builder-control-frame-and-prompt-ontology.md`
- abg_strategy: `/Users/jim/src/apps/abiogenesis/.ai-workspace/comments/codex/20260412T161241Z_STRATEGY_abg-repair-control-plane-deferred-after-sdlc-priority-cut.md`
- sibling: `.ai-workspace/tickets/completed/T-003-enforce-spec-method-structured-build-topology-for-project-tenants.md`
- standard: `/Users/jim/src/apps/specification_methodology/specification/standards/SPEC_METHOD.md`
- standard: `/Users/jim/src/apps/specification_methodology/specification/standards/TICKET_METHOD.md`
