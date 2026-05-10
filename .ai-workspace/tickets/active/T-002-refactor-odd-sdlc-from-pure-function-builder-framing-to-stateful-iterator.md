# T-002 Clarify Stateless Graph Functions Over Stateful Workspace Activity

- id: T-002
- title: Clarify odd_sdlc builder control as stateless graph functions over stateful workspace activity
- type: feature
- status: active
- goal: ambiguity-governance-and-traceability
- priority: critical
- created_at: 2026-04-12
- updated_at: 2026-05-10
- dependencies: B-001, T-003, B-002

## Triage

- intake: feature / operator finding / live `test28` proving result
- lawful_change_class: design_reframe
- affected_boundary: odd_sdlc control-frame design, graph-function builder behavior, prompt/context selection, stateful worksite observation, system asset refs, workspace asset refs, and repair over installed workspace assets
- lawful_re_entry: odd_method design and realization surfaces for odd_sdlc builder control, graph functions, and proving lanes
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

- [ ] Identify the active odd_sdlc edge families that need distinct builder
  control frames rather than one serialized-input-shaped prompt pattern.
- [x] Reframe odd_sdlc builder prompts around observed stateful worksite assets
  rather than serialized bulk state.
- [x] Keep delivery and traceability obligations explicit in each builder frame.
- [x] Move large register and environment payloads out of the default inline
  prompt path where a reference-first domain frame is sufficient.
- [x] Make edge prompts explicitly inspect current system/workspace asset refs
  before further transformation.
- [ ] Normalize remaining ticket/design language so "stateful iterator" cannot
  be read as stateful graph functions or worker-owned hidden state.
- [ ] Prove that the refactored control frame improves live builder behavior on
  the `data_mapper` regression corpus without moving domain semantics upward
  into ABG.

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

Next cut inside this ticket:

- identify the remaining edge families that still need distinct domain control
  frames
- reduce other large inline payloads that are still function-shaped rather than
  asset-iterator-shaped
- add a stronger second-pass regression that proves existing shallow
  realization is deepened, not just that prompts are better shaped on the
  `data_mapper` regression corpus

## Proof Required

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
- post-topology proof:
  - final downstream acceptance is rerun after `T-003` lands so the builder is
    proven against the lawful workspace shape rather than the drifting `test28`
    topology

## Acceptance

- odd_sdlc prompt/control frames are no longer primarily shaped like pure
  function calls over serialized state
- builder prompts are aligned to observed system/workspace assets under
  construction while the invoked graph/F_P functions remain stateless
- delivery and traceability remain explicit obligations on the builder
- live proof shows better targeted iteration with less inert prompt payload
- ABG remains a fact/execution substrate rather than an odd_sdlc prompt owner

## Links

- parent: `/Users/jim/src/apps/odd_method/.ai-workspace/tickets/active/B-001-refactor-odd-method-to-released-abg-boundary.md`
- strategy: `/Users/jim/src/apps/odd_method/.ai-workspace/comments/codex/20260412T015309Z_STRATEGY_agentic-builder-control-frame-and-prompt-ontology.md`
- abg_strategy: `/Users/jim/src/apps/abiogenesis/.ai-workspace/comments/codex/20260412T161241Z_STRATEGY_abg-repair-control-plane-deferred-after-sdlc-priority-cut.md`
- sibling: `/Users/jim/src/apps/odd_method/.ai-workspace/tickets/completed/T-003-enforce-spec-method-structured-build-topology-for-project-tenants.md`
- standard: `/Users/jim/src/apps/specification_methodology/specification/standards/SPEC_METHOD.md`
- standard: `/Users/jim/src/apps/specification_methodology/specification/standards/TICKET_METHOD.md`
