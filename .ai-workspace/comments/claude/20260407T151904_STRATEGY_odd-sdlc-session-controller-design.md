# STRATEGY: odd_sdlc Session Controller Design

**Author**: claude
**Date**: 2026-04-07T15:19:04Z
**Updated**: 2026-04-08
**Addresses**: Session-driven orchestration of odd_sdlc graph function execution via odd_sdlc_service
**Status**: Draft (rev 3 — clean service/client split, async dispatch, explicit scoping)

## Summary

odd_sdlc_service is the orchestration and worker-session authority for odd_sdlc workflows. It owns session lifecycle, worker registry, transport config, dispatch routing, and workspace snapshotting. ABG remains the execution-truth authority for runs, events, convergence, and provenance. Genesis Manager, Claude CLI, and Codex CLI are peer client surfaces that talk to the service — none is special-cased. The direct local engine path (`python -m genesis start --auto --workspace .`) remains the canonical entry point for basic execution; the service is the enduring orchestration plane, not a prerequisite.

## Stack

```
genesis_manager / Claude CLI / Codex CLI    ← client surfaces (peers)
                    │
                    ▼
            odd_sdlc_service                ← domain execution + session authority
                    │
                    ▼
                odd_sdlc                    ← domain instance (module, catalog, constructor, F_D checks)
                    │
                    ▼
                  ABG                       ← interpreter/runtime (traversal, events, provenance, convergence)
                    │
                    ▼
                  GTL                       ← language (graph, algebra, declarations)
```

Each layer owns one concern. No layer reaches past its neighbor.

## Analysis

### What odd_sdlc_service owns

| Concern | Detail |
|---------|--------|
| Session lifecycle | Create, resume, close sessions. Each session targets a run. |
| Worker registry | Named, persistent workers (local or remote). Identity survives dispatch cycles. |
| Transport config | How to reach each worker: local subprocess, SSH remote, etc. |
| Dispatch routing | Which worker handles which F_P edge. For consensus, routing is driven by the harness/policy contract (e.g., reviewer count, roles), not ad hoc client choice. |
| Workspace snapshotting | Hash of workspace state at dispatch time. Required for remote transport replayability. |
| Async dispatch | F_P dispatch is non-blocking. Service dispatches, then returns. Client monitors via observe/gaps. |
| Conversation history | Durable I/O trace per worker session. Observation/audit surface, not runtime truth. |

### What odd_sdlc_service does NOT own

| Concern | Owner | Why |
|---------|-------|-----|
| Traversal, convergence, events, provenance | ABG | Runtime truth |
| Graph functions, modules, algebra | GTL | Language declarations |
| Asset types, constructor logic, F_D checks | odd_sdlc (domain) | Domain substance |
| Visual rendering, UI layout | genesis_manager | Client UX |
| Terminal rendering | genesis_manager (gterm) or Claude CLI | Client UX |

### What client surfaces do

All clients are peers. Each talks to odd_sdlc_service via MCP (for CLI agents) or HTTP/SSE (for browser).

| Client | How it talks | What it does |
|--------|-------------|-------------|
| Claude CLI | MCP tools | Orchestrate, observe, approve F_H gates |
| Codex CLI | MCP tools | Same |
| genesis_manager | HTTP API + SSE | Visual observation, gate inbox, session stream rendering |

Genesis_manager reads projections and issues commands. It does not own sessions, workers, or dispatch. It renders what the service tells it.

## Interface

### MCP tools (for CLI agents)

All tools require explicit `run_id` scope. No implicit "current run" — avoids ambiguity with multiple runs or continuations per workspace.

**1. `catalog(workspace)`**
Returns odd_sdlc graph functions with metadata: name, intent, inputs, outputs, asset contracts, harness kind, tags.

**2. `start(workspace, graph_function?, module?)`**
Initializes a new run. Returns `{run_id, status, edge, blocking_reason}`.

**3. `step(run_id)`**
Advances one edge:
- **F_D edge**: constructs deterministically, assesses result, returns outcome.
- **F_P edge**: dispatches to worker (non-blocking), returns `{status: "fp_dispatched", edge, worker, manifest_id}`. Client monitors via `observe`.
- **F_H edge**: returns gate context. Client must call `approve` or `reject`.

**4. `run(workspace, graph_function?, module?, agent?)`**
Auto-loop over `step`. Advances F_D edges immediately. Dispatches F_P edges asynchronously. Pauses and returns at F_H gates or when all dispatched F_P work is in flight. Client resumes after monitoring or approval.

**5. `gaps(run_id)`**
Convergence state: per-edge delta, overall convergence, unconverged edges with blocking reasons.

**6. `observe(run_id, since?)`**
Recent events, run projections, dispatch status, worker activity. Supports incremental polling via `since` cursor.

**7. `approve(run_id, edge)`**
Emits F_H approval event. Unblocks the run.

**8. `reject(run_id, edge, reason)`**
Emits F_H rejection event. Engine re-iterates or escalates.

**9. `workers()`**
Lists registered workers: name, agent type, transport (local/ssh), status, session stats.

**10. `attach(worker_name, agent, transport?)`**
Registers a named worker. If transport is SSH, specifies remote host. Worker persists across dispatches.

### HTTP/SSE surface (for genesis_manager)

Same operations as MCP tools, plus:

- `GET /api/runs` — list active runs with status
- `GET /api/runs/{run_id}/events?since=` — SSE stream of run events
- `GET /api/workers` — worker registry with live status
- `GET /api/workers/{name}/history` — conversation history for a worker
- `POST /api/runs/{run_id}/approve` — F_H approval
- `POST /api/runs/{run_id}/reject` — F_H rejection

Genesis_manager subscribes to the SSE stream and renders: world map with convergence state, gate inbox with pending approvals, worker activity with conversation history, run timeline with events.

## Transport model

### Local dispatch

```
odd_sdlc_service → transport.call_agent("claude", prompt, workspace)
                 → subprocess with _sanitized_env()
                 → agent writes result artifact
                 → service calls assess-result
```

Same as current live test infrastructure. Proven 2026-04-07.

### Remote dispatch (SSH)

```
odd_sdlc_service → snapshot workspace hash → record in provenance
                 → ssh host -- claude -p "<prompt>" (via registered worker)
                 → agent works on remote workspace copy
                 → result synced back
                 → service calls assess-result with snapshot provenance
```

Workspace materialization is governed, not hand-wavy:
- Service records workspace snapshot hash at dispatch time as ABG provenance.
- Remote workspace must match snapshot (verified on return or pre-dispatch sync).
- Result is only assessed if snapshot contract holds.

### Provenance

ABG records the facts of every dispatch:

```json
{
  "event_type": "fp_dispatched",
  "data": {
    "agent": "claude",
    "worker": "reviewer.traceability",
    "transport": "ssh:gpu-box",
    "workspace_snapshot": "sha256:abc123...",
    "manifest_id": "...",
    "run_id": "...",
    "edge": "derive_review_assessment_surface"
  }
}
```

This is ABG runtime truth. The service populates transport and worker fields; ABG emits and owns the event.

## Worker model

| Property | Ephemeral | Enduring |
|----------|-----------|----------|
| Lifetime | One dispatch | Persists across dispatches |
| Identity | Anonymous | Named (e.g., `reviewer.traceability`) |
| Transport | Local subprocess | Local or SSH remote |
| History | Result artifact only | Full conversation history |
| Recovery | Retry from scratch | Resume from history |
| Use case | Simple single-agent edges | Consensus reviewers, long-running discovery, remote compute |

Enduring workers are registered via `attach`. Ephemeral workers are created on-the-fly by the service for simple dispatches. Both produce the same ABG provenance events.

## Session UX examples

### Claude CLI — simple run

```
User: "run the bootstrap flow against ~/myproject"

Claude: [calls catalog(~/myproject)] → shows graph functions
        [user picks one]
        [calls start(~/myproject, graph_function=...)] → gets run_id
        [calls run(run_id=...)] → auto-advances
        → F_D edges: immediate
        → F_P edges: dispatched, Claude polls observe()
        → F_H gate: "design surface ready for review — approve?"
        [user approves]
        [calls approve(run_id, edge)]
        [calls run(run_id)] → resumes, completes
        → "Converged."
```

### Claude CLI — consensus with remote workers

```
User: "review the design with consensus, use gpu-box for traceability"

Claude: [calls attach("reviewer.traceability", "claude", ssh="gpu-box")]
        [calls attach("reviewer.delivery", "claude")]
        [calls start(~/myproject, module=consensus_harness_module)] → run_id
        [calls run(run_id)] → dispatches to named workers
        [polls observe(run_id)] → sees both workers active
        → both complete, consensus converges
        → "Reviewed design written."
```

### genesis_manager — visual observation

```
Browser connects to odd_sdlc_service SSE stream.
World map shows graph topology with live edge convergence.
Gate inbox shows pending F_H approval.
Worker panel shows 2 active sessions with streaming history.
User clicks "approve" in gate inbox → POST /api/runs/{id}/approve.
Run resumes.
```

## Design decisions

**odd_sdlc_service is the authority, clients are peers.** No client owns sessions, workers, or dispatch. Genesis_manager is not special — it's a browser client alongside Claude and Codex CLI clients.

**Async dispatch, not blocking step.** F_P dispatch returns immediately. Client monitors via `observe`/`gaps`. This supports enduring workers, SSH transport with latency, and reconnectable sessions without contradiction.

**Explicit run_id scoping.** Every tool targets a specific run. No ambient "current workspace state" that becomes ambiguous with multiple runs or continuations.

**Workspace snapshot for remote transport.** ABG provenance records the snapshot hash at dispatch time. Results are only assessed if the snapshot contract holds. Remote dispatch is auditable and replayable.

**Conversation history is service state, not ABG truth.** Worker I/O traces are useful for observation and debugging but are not runtime truth. ABG events remain the single authority for convergence, traversal, and provenance.

**MCP for CLI agents, HTTP/SSE for browser.** MCP is natural for Claude/Codex sessions. Browser UIs want streaming feeds. Same service, two access surfaces.

## What needs to be built

| Component | Where | Effort | What it does |
|-----------|-------|--------|-------------|
| `odd_sdlc_service` | odd_method | Medium | Service daemon: session lifecycle, worker registry, dispatch routing, async run loop |
| MCP tool surface | odd_method | Small | MCP server exposing the 10 tools |
| HTTP/SSE surface | odd_method | Small | REST + SSE endpoints for browser clients |
| Worker transport layer | odd_method | Medium | Local subprocess + SSH dispatch with snapshot provenance |
| F_H event emission | odd_method | Small | `approve`/`reject` commands that emit ABG events |
| genesis_manager client adapter | genesis_manager | Small | Replace gterm-as-session-owner with service client. Read projections, issue commands. |

## What does NOT change

- **GTL**: no language changes.
- **ABG traversal model**: no rewrite of traversal, convergence, or event model.
- **odd_sdlc domain**: module, catalog, constructor, F_D checks — all unchanged.
- **Direct local execution**: `PYTHONPATH=.genesis python -m genesis start --auto --workspace .` still works without the service. The service wraps the existing execution path, it does not replace it.
- **genesis_manager core UI**: world map, gate inbox, observer panels — unchanged, just wired to service instead of local state.

## What DOES change (acknowledging Codex review)

- **ABG transport provenance enrichment**: `fp_dispatched` events gain `worker`, `transport`, `workspace_snapshot` fields. Not new event types — enriched data on existing events. Resume-safe pending dispatch identity and snapshot verification facts on ingest may also be needed.
- **New integration proofs**: service dispatch, async monitoring, remote transport, workspace snapshot verification, enduring worker lifecycle.
- **genesis_manager session model**: moves from browser-local gterm ownership to service-client projection. Existing gterm infrastructure can back the service's worker sessions, but authority moves to the service. Genesis_manager retains the ability to spawn terminal sessions (gterm) that give direct access to MCP and other services — bypassing the UI while staying within one surface.

## Build order

1. **odd_sdlc_service with MCP tools** — wrapping the existing local engine path. Prove: catalog → start → run → approve → converge from a Claude session.
2. **HTTP/SSE surface** — wire genesis_manager as a client. Prove: browser observes a run driven from Claude CLI.
3. **Enduring worker registry** — named persistent workers with conversation history. Prove: worker survives dispatch cycles.
4. **Consensus harness routed through named workers** — harness/policy contract drives worker assignment. Prove: consensus round with two named workers dispatched by contract, not ad hoc.
5. **SSH/remote snapshot transport** — remote dispatch with workspace snapshot provenance. Prove: remote agent dispatch with auditable snapshot.

## Recommended Action

Build step 1. Everything else follows from a working service with MCP tools and local transport.
