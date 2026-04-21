# ODD Service Translation

**Status**: Active
**Date**: 2026-04-08
**Implements**: REQ-F-ODDSVC-001, REQ-F-ODDSVC-002, REQ-F-ODDSVC-003, REQ-F-ODDSVC-004, REQ-F-ODDSVC-005, REQ-F-ODDSVC-006, REQ-F-ODDSVC-007, REQ-F-ODDSVC-008, REQ-F-ODDSVC-009
**Derives From**: `specification/INTENT.md`, `specification/PRODUCT.md`, `specification/GOALS.md`, `specification/requirements/09-odd-service-orchestration-plane.md`

## Position

`odd_service` is the proposed enduring orchestration translation of
`odd_sdlc`.

It exists because:

- direct GTL/ABG + `odd_sdlc` execution already works
- the product now needs reconnectable sessions, named workers, async F_P
  dispatch, and peer client surfaces
- those concerns should not be pushed into browser-local state, prompt
  folklore, or a hidden controller inside `odd_sdlc`

The service therefore translates those needs into one bounded line:

- orchestration and worker-session authority
- not runtime truth
- not domain substance
- not UI ownership

## Translation Boundary

`odd_service` owns:

- session lifecycle
- worker registry
- transport execution
- dispatch routing
- browser-safe and CLI-safe client APIs
- service-local observation state such as worker history

`odd_service` does not own:

- GTL declarations
- ABG traversal
- ABG convergence
- ABG provenance truth
- `odd_sdlc` asset types, constructors, or graph functions
- browser rendering

## Runtime Boundary

The runtime boundary is strict.

ABG remains authoritative for:

- runs
- graph calls
- continuation state
- convergence
- lineage
- provenance

`odd_service` may point at that truth, stream it, enrich dispatch with service
context, or coordinate around it.

It must not:

- keep a rival event store
- maintain a rival convergence model
- certify completion independently of ABG

## Client Boundary

The service makes clients peers.

That means:

- Claude CLI is a client
- Codex CLI is a client
- `odd_manager` is a client

No client owns session or worker authority just because it happens to be the
surface the operator is currently using.

### odd_manager

`odd_manager` remains:

- browser UI
- projection renderer
- gate inbox
- worker activity display
- graph workspace display

It should stop being:

- browser-local session owner
- dispatch owner
- worker lifecycle owner

`gterm` may remain as an operator affordance, but it must not become the
authoritative orchestration model.

## Execution Law

The service wraps the existing local execution path.

It does not invent a second execution law.

The canonical local path remains:

```bash
PYTHONPATH=/Users/jim/src/apps/abiogenesis/build_tenants/abiogenesis/python/code:build_tenants/python/code python -m odd_sdlc gaps --scope workspace --workspace .
PYTHONPATH=/Users/jim/src/apps/abiogenesis/build_tenants/abiogenesis/python/code:build_tenants/python/code python -m odd_sdlc start --scope workspace --target next --until converged --workspace .
```

The service should drive the same runtime contract and the same ABG
assessed-result flow, while adding:

- service sessions
- durable workers
- async routing
- client observation

## Worker Model

The service introduces a real worker registry.

Each worker may carry:

- stable name
- agent kind
- transport kind
- transport configuration
- health/status
- optional durable conversation/history channel

Workers may be:

- ephemeral
- enduring

Both must map back into ABG provenance when they participate in dispatch.

## Consensus As First Consumer

Consensus is the first serious proving lane for `odd_service`.

That is because consensus already pressures:

- multiple named workers
- async fan-out
- resumed observation
- contract-driven worker routing
- browser and CLI peer observation

The service should not be consensus-specific.

But the first real consumer should be the published `odd_sdlc` consensus
harness because it exercises the right orchestration pressures without creating
a special-case engine.

## Remote Transport

Remote transport is allowed only under explicit snapshot law.

Required model:

- snapshot identity recorded at dispatch
- snapshot verification emitted on ingest
- mismatch or missing verification fails closed

Remote execution without this contract is not lawful enough for ODD.

## Initial Package Shape

The incubation line should grow under:

```text
build_tenants/odd_service/python/code/odd_service/
```

with the first bounded modules:

- `service.py`
- `sessions.py`
- `workers.py`
- `routing.py`
- `transport/local.py`
- `transport/ssh.py`
- `mcp_server.py`
- `http_api.py`
- `sse.py`
- `adapters/odd_sdlc_runtime.py`
- `adapters/abg_projection.py`

That is enough structure to become its own project later without changing the
design boundary.

## Promotion Path

Near-term:

- incubate inside `odd_sdlc`

Later:

- promote to standalone `odd_service` project when the local service path and
  browser-client path are both proven

The important thing is not the repo boundary. The important thing is that the
service/runtime/client boundary stays stable across the promotion.
