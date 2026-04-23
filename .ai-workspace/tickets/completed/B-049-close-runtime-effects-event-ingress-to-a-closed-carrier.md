---
id: B-049
title: Close runtime_effects event ingress to a closed carrier
type: bug
ticket_category: implementation_migration
migration_strategy: inside_out_hard_break
status: completed
goal: close-runtime-event-effect-boundary-after-b-040
change_intent: `runtime_effects.publish_runtime_event` still accepts `Mapping[str, object]`, which is a typed-opaque sink at the effect boundary. B-040 improved the public-start family but explicitly did not close the event-emission ingress to a closed runtime-event union. This ticket closes that effect-edge seam.
change_class: design_reframe
re_entry_point: design_surface
affected_boundary: `build_tenants/python/code/odd_sdlc/runtime_effects.py` and the call sites that currently hand closed carriers to a typed-opaque `Mapping[str, object]` event sink
priority: medium
triaged_at: 2026-04-23
created_at: 2026-04-23
updated_at: 2026-04-24
dependencies: B-040 completed
intake_source: B-040 second-closure residual debt and Claude gap analysis on 2026-04-23
target_truth: runtime event emission accepts one closed runtime-event carrier family, or one explicit typed adapter that converts a closed carrier to the emitted transport shape. The effect boundary does not accept arbitrary semantic `Mapping[str, object]`.
superseded_truth: `runtime_effects.publish_runtime_event(data: Mapping[str, object])` is a typed-opaque sink that can erase a closed carrier family back into an open payload right at the effect edge.
closure_law: this migration closes only when runtime event emission is bound to a closed event carrier family or one explicit typed adapter. `Mapping[str, object]` is no longer the semantic ingress contract for runtime event emission.
evaluation_criteria:
  - the runtime effect boundary has one closed input carrier shape
  - call sites no longer rely on a typed-opaque `Mapping[str, object]` sink
  - the new carrier shape does not duplicate existing event truth or invent a rival event authority
proof_surface:
  - bounded typing proof over `runtime_effects.py` and the immediate caller slice
  - source proof that open `Mapping[str, object]` payloads are not accepted as semantic event ingress
  - negative proof that raw dict payloads fail closed or must pass through the named typed adapter
non_closure_conditions:
  - closure is claimed while `publish_runtime_event` still accepts semantic `Mapping[str, object]` ingress
  - call sites still erase closed carriers into open mappings before effect emission
  - a second rival runtime-event authority is introduced instead of a typed adapter over the existing event truth
  - closure is claimed without an explicit effect-boundary role matrix and negative proof
---

## Why This Ticket Exists

The effect edge is still one of the easiest places to cheat Python typing:

- build a lawful carrier
- hand it to `publish_runtime_event(data: Mapping[str, object])`
- erase the seam right before emission

That is better than `dict[str, Any]`, but it is still not closure.

## Scope

In scope:

- runtime event ingress in `runtime_effects.py`
- immediate caller slices that currently rely on the typed-opaque sink

Out of scope:

- redesigning the broader event store or ABG event model
- reopening public-start carrier work that B-040 already closed

## Trace Boundary

This ticket reads current repo-law truth from:

- `specification/GOALS.md`
- `specification/INTENT.md`
- `specification/PRODUCT.md`
- `specification/requirements/03-runtime-governance.md`
- `specification/requirements/09-odd-service-orchestration-plane.md`
- `specification/requirements/12-declarative-operational-state-transitions.md`
- `specification/scenarios/03-first-constructive-edge-runtime-facts.md`
- `specification/scenarios/08-odd-service-orchestration-plane.md`

This ticket reads current design truth from:

- `build_tenants/python/design/EXECUTION_CONTRACT_SOURCE_CARRIER.md`
- `build_tenants/python/design/GAP_ANALYSIS_DOSSIER.md`
- `build_tenants/python/design/PROMPT_CONTEXT_CARRIAGE.md`
- `build_tenants/python/design/README.md`

This ticket reads current method-law truth from:

- `/Users/jim/src/apps/specification_methodology/specification/standards/SPEC_METHOD.md`
- `/Users/jim/src/apps/specification_methodology/specification/standards/ODD_METHOD.md`
- `/Users/jim/src/apps/specification_methodology/specification/standards/TICKET_METHOD.md`
- `/Users/jim/src/apps/specification_methodology/specification/standards/DESIGN_MODULE_METHOD.md`

## Migration Declaration

- old_truth_path: semantic callers can hand lawful carriers to `publish_runtime_event(data: Mapping[str, object])` and erase closure at the final effect edge
- new_truth_path: runtime event emission accepts one closed event carrier family or one explicit typed adapter over the existing event truth; raw open mappings are not the semantic ingress contract
- producers_old:
  - `runtime_effects.py`
  - immediate event-emitting callers that downcast to mappings
- producers_new:
  - closed runtime-event carrier or typed event-emission adapter
  - immediate callers emitting admitted event truth directly
- consumers_old:
  - runtime event store/effect boundary
  - immediate callers relying on opaque mappings
- consumers_new:
  - runtime event sink consuming one admitted event carrier/adapter contract
  - immediate callers using the same typed boundary
- derived_surfaces:
  - emitted runtime events
  - source/install proofs over event emission

## Migration Checklist

- [x] old mapping-based semantic ingress path is named explicitly
- [x] new closed runtime-event ingress path is named explicitly
- [x] producer and consumer sets are listed
- [x] opaque mapping ingress is removed or explicitly demoted behind one typed adapter
- [x] mixed closed-carrier/open-mapping behavior is no longer accepted as closure evidence
- [x] typing proof, source proof, and ticket wording are reconciled before closure

## Functional Review Criteria

1. Did the change close the semantic effect edge, or only move the open mapping one function deeper?
2. Is there one runtime-event ingress contract for callers?
3. Do callers emit admitted event truth directly instead of reconstructing/opening it at the last moment?
4. Does the new boundary reuse existing event truth instead of inventing a rival event authority?
5. Can raw dict/mapping event payloads fail closed under test?

## Evaluator Gate

### 1. Authority Seam Closure

- [x] the runtime effect edge has one authoritative typed ingress contract
- [x] deleting the typed adapter/carrier causes fail-closed behavior rather than silent mapping passthrough
- [x] callers no longer rebuild or reopen event truth right before emission

### 2. Essential Carrier Consolidation

- [x] the migration reuses the existing event truth family or one adapter over it, not a second rival event hierarchy
- [x] no wrapper-only peer family is introduced merely to appease typing
- [x] effect-edge typing remains subordinate to the existing runtime event authority

### 3. Typed Enforcement After Proof

- [x] any foreign/dynamic event payload is collapsed once at the effect ingress
- [x] `Mapping[str, object]`, `dict[str, Any]`, and `cast(...)` are not used as semantic event-ingress truth
- [x] immediate callers pass admitted typed event truth rather than progressively mutating dict payloads

## Runtime Event Role Matrix

| Surface | Role | Closure expectation |
| --- | --- | --- |
| `runtime_effects.py` ingress | authoritative effect boundary | accepts closed event carrier or typed adapter only |
| immediate event-emitting callers | upstream semantic producers | pass admitted typed event truth directly |
| transport/store serialization | downstream edge effect | may serialize after admission, not define semantic ingress |

## Concrete Change Inventory

- [x] `build_tenants/python/code/odd_sdlc/runtime_effects.py`
  - [x] replace semantic `Mapping[str, object]` ingress with closed carrier or typed adapter
  - [x] ensure serialization happens after admission, not before
- [x] `build_tenants/python/code/odd_sdlc/runtime_event_contract.py`
  - [x] define the closed runtime-event carrier family
  - [x] define the single named ingress adapter `admit_runtime_event_payload(...)`
- [x] immediate callers
  - [x] identify all `publish_runtime_event(...)` and `publish_workspace_runtime_event(...)` call sites
  - [x] stop downcasting lawful carriers into opaque mappings
- [x] proofs
  - [x] bounded typing proof over `runtime_effects.py` and immediate callers
  - [x] source proof that raw mappings are not accepted as semantic ingress
  - [x] negative proof that dict payloads fail closed or require the named adapter

## Impacted Interface Review Checklist

- [x] `publish_runtime_event(...)` signature is reviewed as the single effect-edge contract
- [x] immediate callers are reviewed for downcast/open-mapping behavior
- [x] no second event authority is introduced in the adapter/carrier shape
- [x] event-store/transport serialization remains downstream-only

## Proof Selector Plan

Structural selectors:

```bash
rg -n 'data: Mapping\\[str, object\\]|data: RuntimeEventPayload|admit_runtime_event_payload\\(' build_tenants/python/code/odd_sdlc/{runtime_effects,app,public_start,execution_contract,homeostatic_loop,constructor,triage}.py
```

Planned typing selector:

```bash
python -m mypy --config-file mypy.ini \
  -m odd_sdlc.runtime_event_contract \
  -m odd_sdlc.runtime_effects \
  -m odd_sdlc.app \
  -m odd_sdlc.execution_contract \
  -m odd_sdlc.homeostatic_loop \
  -m odd_sdlc.constructor \
  -m odd_sdlc.triage \
  -m odd_sdlc.public_start
```

Planned source selector:

```bash
PYTHONPATH=/Users/jim/src/apps/abiogenesis/build_tenants/abiogenesis/python/code:build_tenants/python/code \
python -m pytest build_tenants/python/test_env/tests/test_odd_sdlc_first_slice.py -q \
  -k 'test_b049_runtime_effects_rejects_open_mapping_event_ingress or test_b049_runtime_event_emission_uses_closed_carrier_adapter or test_b049_runtime_effects_fail_closed_on_raw_dict_payload'
```

## Closure Note

Landed shape:

- `runtime_event_contract.py` now defines the closed `RuntimeEventPayload` family and `RuntimeEventType`
- `admit_runtime_event_payload(...)` is the single named ingress adapter
- `runtime_effects.publish_runtime_event(...)` and `publish_workspace_runtime_event(...)` now take `RuntimeEventPayload`, re-admit once at ingress, and serialize only after admission
- odd_sdlc emitters in `app.py`, `public_start.py`, `execution_contract.py`, `homeostatic_loop.py`, `constructor.py`, and `triage.py` now bind through the adapter

Proofs used for closure:

- bounded typing lane:
  - `python -m mypy --config-file mypy.ini -m odd_sdlc.runtime_event_contract -m odd_sdlc.runtime_effects -m odd_sdlc.app -m odd_sdlc.execution_contract -m odd_sdlc.homeostatic_loop -m odd_sdlc.constructor -m odd_sdlc.triage -m odd_sdlc.public_start`
  - `Success: no issues found in 8 source files`
- package strict lane:
  - `python -m mypy --config-file mypy.ini -p odd_sdlc`
  - `Success: no issues found in 51 source files`
- source proof:
  - `3 passed, 104 deselected`
- structural selector:
  - `runtime_effects.py` exposes `data: RuntimeEventPayload`
  - all odd_sdlc runtime-effect callers bind through `admit_runtime_event_payload(...)`

No live tests were used for this ticket.
