# PROJECT: odd_service Carve-Out And odd_manager Client Boundary

**Author**: codex
**Date**: 2026-04-08T02:30:07Z
**Addresses**: enduring service boundary for odd_sdlc orchestration; project split between odd_service and odd_manager; project-ready design carve-out
**Status**: Draft for review

## Summary

This post proposes the enduring carve-out for `odd_service`.

The point is not to invent a second runtime. The point is to create a durable
orchestration plane around the already-working GTL/ABG + `odd_sdlc` path.

The service should own:

- session lifecycle
- worker registry
- dispatch routing
- local and remote transport orchestration
- run observation surfaces for clients

It should not own:

- GTL language declarations
- ABG traversal/convergence/event truth
- `odd_sdlc` domain substance
- UI state or terminal ownership

That gives a clean project split:

- `abiogenesis`: language/runtime truth
- `odd_method`: domain substance and harnesses
- `odd_service`: orchestration and worker-session authority
- `odd_manager`: browser client over service and projections

This design is detailed enough to become a standalone project proposal.

## Why This Exists

The recent `data_mapper.test19` work exposed a real operator problem:

- the local engine path works
- installed workspaces now have a clear start surface
- but long-running runs, resumed F_P dispatch, named workers, consensus fan-out,
  remote transport, and browser observation still want a durable orchestration
  plane

The local command path remains important:

```bash
PYTHONPATH=.genesis python -m genesis gaps --workspace .
PYTHONPATH=.genesis python -m genesis start --auto --human-proxy --workspace .
```

That path should continue to exist for direct execution.

But the enduring operational model needs more:

- reconnectable sessions
- named workers
- asynchronous F_P fan-out
- observation-friendly APIs
- browser and CLI clients as peers

That is the service problem.

## Design Position

`odd_service` is not a replacement for ABG and not a wrapper that invents a new
truth model.

It is the orchestration plane over existing truth.

The governing rule is:

- ABG remains the authority for runs, events, convergence, lineage, and
  provenance
- `odd_service` owns orchestration state that is useful but not constitutional
- clients talk to `odd_service`, not directly to browser-local terminal pools or
  hidden agent-specific controllers

This is a service/client split, not a runtime fork.

## Target Architecture

```text
Claude CLI / Codex CLI / odd_manager        ← peer clients
                    │
                    ▼
                odd_service                 ← orchestration + worker-session authority
                    │
                    ▼
                 odd_sdlc                   ← domain graph functions, harnesses, F_D, constructors
                    │
                    ▼
                   ABG                      ← traversal, events, convergence, provenance
                    │
                    ▼
                   GTL                      ← graph language and declarations
```

The critical property is that no layer skips a neighbor:

- clients do not own session truth
- `odd_service` does not reinterpret GTL
- `odd_service` does not mint its own convergence or provenance truth
- `odd_manager` does not become the owner of dispatch or worker lifecycle

## Project Split

### `abiogenesis`

Owns:

- `genesis start`, `gaps`, `observe`, `assess-result`
- event stream and projections
- pending-run truth
- dispatch runtime contract
- runtime provenance fields

Changes that may still be required:

- enrich `fp_dispatched` with service-supplied `worker`, `transport`,
  `workspace_snapshot`
- emit fail-closed ingest facts for snapshot mismatch on remote work
- preserve resume-safe manifest identity on pending runs

Non-goal:

- no orchestration daemon
- no worker registry
- no client session model

### `odd_method`

Owns:

- `odd_sdlc` module publication
- graph-function catalog
- harnesses such as consensus
- asset surfaces, constructors, and F_D checks
- install/normalize surfaces for imported workspaces

Changes that may still be required:

- service-facing domain adapter surfaces
- graph-function metadata rich enough for worker routing policy
- consensus/policy declarations that a service can honor without hidden client
  rules

Non-goal:

- no browser session ownership
- no general worker/session daemon

### `odd_service`

Owns:

- session lifecycle
- worker registry
- dispatch routing
- transport execution
- workspace snapshotting for remote execution
- MCP surface for CLI agents
- HTTP/SSE surface for browser clients
- observation-grade worker history

Non-goal:

- no rival event store
- no domain catalog of its own
- no UI

### `odd_manager`

Owns:

- browser UX
- projection rendering
- service-client API adapter
- gate inbox
- worker activity rendering
- graph workspace, provenance panes, and review panes

Should stop owning:

- browser-local session authority
- dispatch authority
- worker lifecycle authority

May still keep:

- local terminal panes such as `gterm`
- direct MCP-oriented terminal sessions for expert/operator escape hatches

But those are client affordances, not runtime authority.

## Enduring Concept Model

### Workspace

A filesystem workspace with an installed runtime contract and one or more
published graph functions/modules.

### Run

ABG runtime truth for one execution attempt.

Service rule:

- `odd_service` never invents its own run truth
- it stores references to ABG run identity and session state around that run

### Session

Service-owned orchestration state around a run.

A session can contain:

- workspace root
- selected graph function/module
- current ABG run id
- client subscriptions
- worker assignments
- dispatch bookkeeping
- service-local observation state

This is not constitutional truth.

### Worker

A named execution endpoint.

Properties:

- worker name
- agent kind
- transport kind
- transport config
- lifecycle status
- optional conversation/history channel

Workers may be:

- ephemeral
- enduring

Both should map back into the same ABG provenance fields during dispatch.

## Core Service Interfaces

These are the stable concepts, not final syntax.

### CLI/MCP-Oriented Operations

Constructor operations are workspace-scoped:

- `catalog(workspace)`
- `start(workspace, graph_function?, module?)`
- `run(workspace, graph_function?, module?, agent?)`

Continuation and observation operations are run-scoped:

- `step(run_id)`
- `gaps(run_id)`
- `observe(run_id, since?)`
- `approve(run_id, edge)`
- `reject(run_id, edge, reason)`

Worker operations are service-scoped:

- `workers()`
- `attach(worker_name, agent, transport?)`
- `detach(worker_name)`

This matters because the earlier strategy note drifted on “all tools require
run_id scope.” They do not. Constructors are workspace-scoped, then the rest
becomes run-scoped.

### Browser/HTTP-Oriented Operations

Minimum browser surface:

- `GET /api/runs`
- `POST /api/runs/start`
- `POST /api/runs/{run_id}/step`
- `POST /api/runs/{run_id}/run`
- `GET /api/runs/{run_id}/gaps`
- `GET /api/runs/{run_id}/observe?since=`
- `POST /api/runs/{run_id}/approve`
- `POST /api/runs/{run_id}/reject`
- `GET /api/workers`
- `POST /api/workers/attach`
- `GET /api/workers/{name}/history`
- `GET /api/runs/{run_id}/events` via SSE

The browser should be able to render the whole run from these surfaces without
inventing local authority.

## How odd_service Should Execute

### Local Path

For local execution, the service should wrap the existing engine path.

It should not create a second traversal loop.

Operationally:

1. resolve workspace and runtime contract
2. call the same `genesis`/`odd_sdlc` execution path used by local CLI
3. when F_P dispatch is needed, use the service’s worker routing and transport
4. ingest results through ABG
5. observe by replaying ABG projections

That preserves one execution law.

### Remote Path

For remote execution:

1. derive a workspace snapshot hash
2. record snapshot metadata in dispatch provenance
3. materialize or verify the remote workspace copy
4. dispatch to the remote worker
5. collect the result artifact
6. verify snapshot contract on ingest
7. fail closed if snapshot verification is missing or mismatched

This is the clean remote law:

- remote execution is allowed
- remote truth is not trusted without workspace snapshot verification

## Provenance Requirements

This is the minimum ABG-side enrichment needed for the service model to be
credible.

`fp_dispatched` should be able to carry:

- `worker`
- `transport`
- `workspace_snapshot`
- `service_session_id` if needed as observation metadata

Result ingest should emit a verification fact for remote work:

- snapshot verified
- snapshot mismatch
- verification missing

Remote ingest must fail closed when the snapshot contract is not satisfied.

This should not be treated as optional commentary. It is part of the runtime
contract for remote dispatch.

## Consensus As The First Real Consumer

The service should not be built around consensus specifically, but consensus is
the first serious proving lane.

Why:

- it needs multiple workers
- it needs durable reviewer identities
- it needs async fan-out
- it needs resumed observation
- it needs policy-driven routing

That makes consensus the best first “higher-order harness consumer” of the
service model.

The service should route consensus by domain/policy contract:

- reviewer count
- reviewer roles
- transport preferences
- escalation order

That routing should not be driven by ad hoc UI decisions.

## Recommended Project Carve-Out

### Near-Term Incubation

Incubate inside `odd_method` first, but under a clearly separable package name:

```text
odd_method/
  build_tenants/odd_service/python/code/odd_service/
```

Reason:

- reuse local domain/runtime context while the interfaces are still moving
- avoid premature repo sprawl
- prove the shape with real consensus and imported workspace flows

### Standalone Target

Once step 1 and step 2 below are stable, promote to a standalone repo:

```text
/Users/jim/src/apps/odd_service
```

with a structure like:

```text
odd_service/
  specification/
    INTENT.md
    PRODUCT.md
    GOALS.md
    requirements/
    scenarios/
  build_tenants/odd_service/python/code/odd_service/
    __init__.py
    service.py
    sessions.py
    workers.py
    routing.py
    snapshots.py
    mcp_server.py
    http_api.py
    sse.py
    transport/
      local.py
      ssh.py
    adapters/
      odd_sdlc_runtime.py
      abg_projection.py
  build_tenants/odd_service/python/test_env/tests/
```

This is enough structure to turn directly into a project.

## Phased Delivery

### Phase 1: Local Service Wrapper

Deliver:

- `odd_service` package
- MCP surface
- workspace-scoped `start/run`
- run-scoped `step/gaps/observe/approve/reject`
- local subprocess worker transport only

Proof:

- a Claude session can create a run, advance it, observe F_P dispatch, approve
  F_H, and converge
- no browser required

Acceptance criteria:

- no separate event store
- ABG events remain the only runtime truth
- direct local engine path still works without the service

### Phase 2: odd_manager As Browser Client

Deliver:

- HTTP/SSE surface in `odd_service`
- `odd_manager` client adapter
- world map and gate inbox driven from service APIs

Proof:

- run started from CLI can be observed in browser
- approval issued in browser resumes run seen by CLI

Acceptance criteria:

- browser owns no run/session truth
- no browser-local dispatch authority

### Phase 3: Enduring Workers

Deliver:

- named worker registry
- attach/detach
- persistent local worker identities
- worker history surface

Proof:

- worker survives across multiple F_P dispatches
- worker identity is visible in ABG provenance

### Phase 4: Consensus Routed By Contract

Deliver:

- consensus harness uses named workers through the service
- worker assignment derived from harness/policy contract

Proof:

- two-worker consensus round
- review identities preserved
- browser and CLI both observe the same progress

### Phase 5: Remote SSH Transport

Deliver:

- SSH transport
- workspace snapshotting
- ingest-time verification facts

Proof:

- remote worker executes one edge
- snapshot is recorded and verified
- mismatch fails closed

## odd_manager Work Packet

This is the work packet for the parallel `odd_manager` line.

`odd_manager` should prepare for the service by doing only client work:

1. define a service-client adapter layer
2. refactor existing state so UI components consume adapter projections rather
   than owning session logic
3. keep `gterm` as a terminal affordance, not as authority
4. add run list, worker list, gate inbox, and event stream views against the
   service API

The browser should remain capable of opening terminals, but that must not
become the source of truth for orchestration.

## Risks

### 1. Service accidentally becomes a second runtime

Mitigation:

- require all run/convergence/provenance truth to come from ABG projections
- forbid service-local convergence state

### 2. odd_manager keeps hidden authority

Mitigation:

- browser only talks to service APIs
- no browser-local dispatch ownership

### 3. Remote transport becomes unverifiable

Mitigation:

- snapshot contract required
- ingest emits verification fact or fails closed

### 4. Worker history bleeds into runtime truth

Mitigation:

- classify conversation history as service observation state only
- keep ABG event stream authoritative

## Open Questions

1. Should session ids be replay-derived from ABG run ids plus workspace, or
   service-generated ids pointing at ABG runs?
2. Does `odd_service run(...)` return once all F_P work is dispatched, or should
   it optionally long-poll until any new observation arrives?
3. Should the first implementation use only MCP for CLI and defer HTTP until the
   browser cut, or build both together?
4. When consensus routing is policy-driven, where should the worker capability
   declarations live: service registry only, or partly in odd-domain metadata?

## Recommended Action

1. Ratify this split:
   - `odd_service` owns orchestration and workers
   - `odd_manager` owns browser client UX
   - ABG remains runtime truth
2. Start Phase 1 inside `odd_method` under an `odd_service` package.
3. In parallel, have `odd_manager` prepare the service-client adapter and remove
   any lingering session-authority assumptions from browser state.
4. Use consensus as the first serious proof, but keep the service generic.
