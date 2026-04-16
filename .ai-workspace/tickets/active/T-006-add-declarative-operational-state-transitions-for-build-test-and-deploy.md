# T-006 Add Declarative Operational State Transitions For Build, Test, And Deploy

- id: T-006
- title: Add declarative operational state transitions for build, test execution, deployment, and returned evidence in odd_sdlc without changing GTL or ABG
- type: feature
- status: active
- goal: ambiguity-governance-and-traceability
- priority: high
- created_at: 2026-04-14
- updated_at: 2026-04-16
- dependencies: T-004, B-005

## Triage

- intake: product expansion / operational capability repricing / post-RC proving gap
- lawful_change_class: requirement_reprice
- affected_boundary: odd_sdlc domain-level operational capability contracts, release/deployment/runtime-return graph functions, project-profile capability declarations, and installed-workspace operational truth admission
- lawful_re_entry: odd_sdlc product and requirement surfaces, odd_sdlc graph publication, project constraints/profile shape, and downstream proving on installed workspaces
- downstream_proof_span: synthetic capability-gated fixtures plus installed-workspace proof for local or hosted execution substrates

## Why This Ticket Exists

`odd_sdlc v1.0RC` can now carry an inherited workspace all the way through:

- code realization
- test design
- test module realization
- test archive
- testcase authority
- release preparation

`data_mapper.test32` proved that the constructive SDLC line can fully
converge. But it also exposed the next missing layer:

- the release can converge constitutionally
- the generated release can describe required operational truth such as
  `sbt test`, coverage, deployment, and runtime evidence
- yet the live graph still has no declarative execution/deployment transition
  lane that can trigger those substrates and ingest returned truth lawfully

The current workspace state makes the gap concrete.

In [`project_constraints.yml`](/Users/jim/src/apps/ai_sdlc_examples/local_projects/data_mapper.test32/.ai-workspace/context/project_constraints.yml),
the active tenant still declares:

- `test_execution_contract: ""`
- `deployment_contract: ""`
- `runtime_observation_contract: ""`

And the final release surface explicitly says the release is open pending
governed execution evidence such as `sbt test`:

- [40-generated-release.md](/Users/jim/src/apps/ai_sdlc_examples/local_projects/data_mapper.test32/docs/40-generated-release.md)

The current graph already publishes:

- `prepare_deployment_surface`
- `derive_runtime_observation_surface`

but it does **not** yet publish a generic declarative lane for:

- build if required
- test execution
- deployment trigger
- returned execution/runtime evidence admission

This ticket exists to add that layer without:

- changing GTL
- changing ABG
- rebuilding bespoke agentic builders per substrate

The builder already demonstrated, for example, that it can install and use
`pytest` when the environment and evidence contract are sufficiently legible.
The missing piece is declarative operational disambiguation, not raw builder
capability.

The specific ambiguity to remove is:

- requested operational transition intent
- admitted returned result or evidence
- current projected operational state

Those three positions must become explicit and typed rather than collapsing into
one vague operational document.

## Design Position

This ticket adopts the following architectural stance:

- GTL remains unchanged
- ABG remains unchanged
- odd_sdlc grows a sharper operational domain layer
- the builder remains generic
- substrate-specific execution is bound through declared capability contracts
- ABG remains the sole event, continuation, and correlation substrate
- odd_sdlc projects domain-facing operational read models on top of ABG truth
- operational lanes progress as explicit event-driven sagas rather than ambient
  lifecycle appendages

The method should declare:

- current bounded state
- target bounded state
- declared substrate binding
- required returned evidence
- bounded progress state

and let the builder realize the transition lawfully.

This is explicitly **not** a ticket to add imperative one-off commands such as:

- "install sbt"
- "run github action"
- "deploy to aws"

Those are implementation details of declared operational capability bindings.

The target framing is declarative:

- from `release_surface`
- through explicit command-side transition surfaces
- into admitted result/evidence surfaces
- and then into current projected operational state
- via a declared substrate such as `local_scala_sbt`,
  `github_actions_scala_sbt`, `aws_codebuild_scala_sbt`, or
  `aws_ecs_deploy`
- proved by returned surfaces such as `test_execution_result_surface` and
  `runtime_observation_surface`

This is intended to fit:

- event sourcing over ABG truth
- CQRS-style current operational state projections
- saga-shaped operational progression with explicit reopen, retry, failure, and
  pending-external-completion states

## Intended Direction

The next wave should add a domain-level operational transition layer to
`odd_sdlc`.

The builder should continue to be the same generic agentic builder. What
changes is the declared law around operational transitions.

### Public shape

Candidate capability contracts:

- `build_execution_contract`
- `test_execution_contract`
- `deployment_contract`
- `runtime_observation_contract`

Candidate substrate bindings:

- `local_scala_sbt`
- `github_actions_scala_sbt`
- `aws_codebuild_scala_sbt`
- `aws_ecs_deploy`

Command-side transition surfaces:

- `build_execution_surface`
- `test_execution_surface`
- `deployment_surface`

Admitted result/evidence surfaces:

- `build_execution_result_surface`
- `test_execution_result_surface`
- `deployment_result_surface`
- `runtime_observation_surface`

Current projected state surfaces:

- `deployed_environment_surface`
- current operational status summaries exposed through query/read-model
  surfaces

Candidate new graph functions:

- `prepare_build_execution_surface`
- `execute_build_surface`
- `prepare_test_execution_surface`
- `execute_test_surface`
- `execute_deployment_surface`

The existing:

- `prepare_deployment_surface`
- `derive_runtime_observation_surface`

should be repriced around this stronger declarative model rather than treated as
ambient post-release appendages.

### Event progression

Operational transitions should expose bounded progress such as:

- `prepared`
- `dispatched`
- `result_admitted`
- `failed`
- `deferred`
- `reopened`

Additional bounded states such as retrying, rollback/compensation, or
pending-external-completion are allowed where the product requires them.

## Scope Boundary

This ticket is in scope for:

- repricing odd_sdlc product/requirement surfaces so declarative operational
  transitions are explicit line capability at the odd_sdlc domain layer
- adding domain-level capability declarations and project-profile support for
  build/test/deploy/runtime observation
- publishing graph functions and surfaces for generic build/test/deploy
  transitions and returned evidence with explicit command-side, admitted-result,
  and current-state separation
- modeling operational state transitions declaratively so the same generic
  builder can act across local, GitHub Actions, and AWS-like substrates
- keeping ABG as the sole event, continuation, and correlation substrate while
  `odd_sdlc` projects domain-facing operational read models over that truth
- expressing operational progression as saga-shaped bounded states rather than
  hidden side effects or ambient operator folklore
- proving at least one concrete substrate binding end to end

This ticket is not in scope for:

- changing GTL algebra
- changing ABG runtime semantics
- creating bespoke builders per provider or tool
- absorbing full cloud platform productization in one wave

## Non-Goals

This ticket does **not** mean:

- a new GTL keyword
- a new ABG execution primitive
- shell commands becoming constitutional truth
- environment setup being modeled as imperative folklore

The point is to add sharper domain law so the existing builder can do lawful
operational work.

## Task List

- [x] Reprice `PRODUCT.md` and the active odd_sdlc requirement surfaces so
  operational state transitions are explicit domain capability rather than
  ambient future work.
- [ ] Decide whether `build_execution_contract` must be added as a first-class
  tenant capability beside the existing execution/deployment/runtime-observation
  contracts.
- [ ] Reprice the active graph boundary so operational transitions are modeled
  as declarative state changes from release into command-side transition,
  admitted-result/evidence, and current projected operational state.
- [ ] Publish new odd_sdlc asset surfaces for build execution, test execution,
  deployment result, and returned evidence where needed, keeping command-side,
  result-side, and current-state roles explicit and typed.
- [ ] Publish graph functions for generic build/test/deploy transitions without
  changing GTL or ABG.
- [ ] Define the substrate-binding model explicitly so bindings such as local,
  GitHub Actions, and AWS-native execution are contract values, not special
  engines.
- [ ] Declare the bounded operational saga states and their admission/reopen
  semantics explicitly so pending, failed, retried, deferred, reopened, and
  compensated work remains queryable.
- [ ] Prove at least one concrete operational binding end to end, preferably
  starting with `local_scala_sbt` on an installed workspace.
- [ ] Prove that returned execution/runtime evidence is admitted back into the
  graph as governed truth rather than ambient logs.
- [ ] Keep all provider/tool-specific realization in odd_sdlc/domain/operator
  surfaces rather than inventing bespoke builder families.

## Acceptance

- odd_sdlc explicitly models declarative operational transitions for build,
  test execution, deployment, and returned evidence
- no GTL change is required
- no ABG change is required
- project-profile capability declarations make operational substrate intent
  explicit
- command-side transition surfaces, admitted result/evidence surfaces, and
  current projected state surfaces are explicit and non-interchangeable
- current operational state is projected from admitted evidence plus ABG truth,
  not from requested transition intent alone
- operational progress is inspectable through bounded saga states rather than
  implicit logs or blended lifecycle documents
- at least one execution substrate can be triggered lawfully through declared
  state transition and returned evidence
- operational truth is admitted through governed evidence surfaces, not by
  ambient side effects
- the builder remains generic and substrate-agnostic outside declared bindings

## Proof Required

- requirement/product proof:
  - the line explicitly states declarative operational transitions as part of
    odd_sdlc domain law
  - the line explicitly states command/result/state separation together with
    event-sourced, CQRS-style, saga-shaped operational meaning
- graph publication proof:
  - new operational graph functions and asset surfaces are published and
    inspectable
- capability proof:
  - the active tenant/profile can declare build/test/deploy/runtime capability
    contracts explicitly
- substrate proof:
  - one concrete substrate binding, likely `local_scala_sbt`, is realized end
    to end from release through returned evidence
- state-model proof:
  - command-side intent cannot be mistaken for admitted result or for current
    projected operational state
  - failed, deferred, reopened, or pending-external-completion work stays
    visibly open
- non-regression proof:
  - constructive convergence remains lawful when no operational capability is
    declared
  - capability-gated behavior still blocks or yields correctly instead of
    silently assuming ambient execution

## Links

- release note: `/Users/jim/src/apps/odd_sdlc/docs/ODD_SDLC_RC_RELEASE_NOTE.md`
- rc notes: `/Users/jim/src/apps/odd_sdlc/docs/ODD_SDLC_RC_NOTES.md`
- installed proof workspace: `/Users/jim/src/apps/ai_sdlc_examples/local_projects/data_mapper.test32`
- related bug: `/Users/jim/src/apps/odd_sdlc/.ai-workspace/tickets/completed/B-005-adopt-abg-yielded-handoff-in-odd-sdlc.md`
- parent: `/Users/jim/src/apps/odd_sdlc/.ai-workspace/tickets/completed/T-004-restore-homeostatic-gap-triage-and-intent-renewal.md`
- requirement: `/Users/jim/src/apps/odd_sdlc/specification/requirements/12-declarative-operational-state-transitions.md`
- scenario: `/Users/jim/src/apps/odd_sdlc/specification/scenarios/14-declarative-operational-state-transitions.md`
- adr: `/Users/jim/src/apps/odd_sdlc/build_tenants/common/design/adrs/ADR-007-declarative-operational-command-result-state-boundary.md`
- standard: `/Users/jim/src/apps/specification_methodology/specification/standards/SPEC_METHOD.md`
- standard: `/Users/jim/src/apps/specification_methodology/specification/standards/TICKET_METHOD.md`
