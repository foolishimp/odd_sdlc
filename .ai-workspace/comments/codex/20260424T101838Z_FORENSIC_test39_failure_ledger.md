# FORENSIC: `data_mapper.test39` failure ledger

**Author**: codex
**Date**: 2026-04-24
**Workspace**: `/Users/jim/src/apps/ai_sdlc_examples/local_projects/data_mapper/data_mapper.test39`
**Purpose**: harvest repeatable failures from the first `test39` attempt and map each one to the regression proof that must exist before the next run.

## Executive Summary

`test39` was not one defect. It was a stack of three different classes:

1. **Operator invocation error**
   - obsolete `start --auto` style invocation
   - not a product/runtime bug
2. **Real `odd_sdlc` governance bug**
   - imported bootstrap carry-forward was not authoritative enough on first-run `derive_intent_surface`
   - first-run `start(next)` stopped at a synthetic `intent_reprice` FH gate
3. **Real `odd_sdlc` ingress bug**
   - `--fh-mode human-proxy` crashed because `genesis` emitted `bundle_refs` as `tuple[str, ...]` and `odd_sdlc` admitted only `list[str]`

While adding the missing seam tests for (3), one additional latent regression surfaced:

4. **Closed carrier drift**
   - triage emitted route states (`blocked_missing_capability`, `converged`, `unresolved`) that the closed runtime-event route-state carrier no longer admitted
   - this was not the original `test39` crash, but it was a real control-plane miss exposed by the same install lane

## Evidence

### A. Obsolete CLI invocation

From:

- `.ai-workspace/runtime/start_auto_20260424T040432.log`

Observed:

- `odd_sdlc start: error: the following arguments are required: --scope, --target, --until`

Classification:

- operator misuse / stale command memory
- **not** an `odd_sdlc` runtime defect

Status:

- existing installer/bootstrap guidance already points to the current form:
  - `python -m odd_sdlc start --scope workspace --target next --until converged --workspace .`

### B. First-run imported workspace halted at synthetic constitutional gate

From:

- `.ai-workspace/runtime/start_20260424T040449.log`
- `.ai-workspace/runtime/triage/derive_intent_surface.json`
- `.ai-workspace/context/project_bootstrap.md`

Observed:

- bootstrap explicitly carried imported identity from `specification/INTENT.md`
- direct public start returned:
  - `status: pending`
  - `stopped_by: fh_gate`
  - `edge: derive_intent_surface`
  - `constitutional_proposal.proposal_kind: intent_reprice`
  - `constitutional_proposal.state: pending_fh`

Classification:

- real `odd_sdlc` authority-seam bug
- bootstrap/imported-authority carry-forward and first-run triage disagreed about whether imported intent was already admissible

Owning ticket:

- `B-051`

### C. Human-proxy start crashed on resolved policy ingress

From:

- `.ai-workspace/runtime/start_hp_20260424T042045.log`

Observed:

- crash in `odd_sdlc.public_start_subcarriers.admit_resolved_policy_payload(...)`
- failure:
  - `ValueError: resolved_policy.bundle_refs must be a list[str]`

Root cause:

- `genesis.policy.ResolvedPolicy.to_dict()` published `bundle_refs` as `tuple[str, ...]`
- `odd_sdlc` admitted only `list[str]`

Classification:

- real `odd_sdlc` ingress-collapse bug

Owning ticket:

- `B-052`

### D. Latent route-state carrier drift exposed by install-lane proof

Observed while adding the `B-052` install proof:

- installed `odd_sdlc gaps` failed because `route_recorded.state` rejected a route state triage now emits

Root cause:

- `public_start_contract.RouteState` / `runtime_event_contract._route_state(...)` were missing:
  - `blocked_missing_capability`
  - `converged`
  - `unresolved`

Classification:

- real closed-carrier drift
- test39-adjacent install-lane miss

Status:

- fixed on source line during the forensic proof pass

## Non-Bugs / Do Not Misclassify

### Placeholder `GOALS.md` / `PRODUCT.md` surfaces

Current files:

- `specification/GOALS.md`
- `specification/PRODUCT.md`

still contain installed placeholder text and non-canonical headings.

This is **not** separate evidence that bootstrap is broken. These are downstream constructive surfaces that are expected to be rewritten/generated later in the bootstrap chain once governance is allowed to proceed.

The primary blocker on `test39` was still the first-run intent gate and then the human-proxy ingress crash.

### Current approved proposal state in gap dossier

Current head dossier shows:

- `constitutional_proposal.state: approve_with_edits`
- `route_binding.state: constitutional_reprice_approved`

This is not itself a contradiction. It means the constitutional proposal was approved and the route is now lawful to proceed. The unresolved part is that the original first-run stop should not have been required merely to restate imported identity, and the human-proxy lane then crashed before productive continuation.

## Regression Test Matrix

### Must exist before retry

1. **Imported carry-forward suppresses synthetic first-run FH gate**
   - owner: `B-051`
   - shape:
     - fresh imported workspace with valid `specification/INTENT.md`
     - `start --scope workspace --target next --until first_traversal`
     - does **not** return `fh_gate` solely for imported identity restatement

2. **Applied constitutional proposal replay clears public pending state**
   - owner: `B-051`
   - shape:
     - record + apply imported-intent constitutional proposal
     - republish gap head
     - public `start(next)` no longer returns stale `pending_fh`

3. **Malformed imported `INTENT.md` still gates**
   - owner: `B-051`
   - shape:
     - missing or malformed imported intent
     - constitutional gate still opens fail-closed

4. **Genesis tuple-shaped `bundle_refs` admit through public-start ingress**
   - owner: `B-052`
   - status: implemented

5. **List-shaped `bundle_refs` still admit**
   - owner: `B-052`
   - status: implemented

6. **Installed manifest resolved policy round-trips through public-start ingress**
   - owner: `B-052`
   - status: implemented

7. **`route_recorded.state` carrier admits all triage-published route states**
   - owner: follow-on from `B-049` closure wave
   - status: implemented for direct source proof

### Existing/implemented proof anchors

Implemented in source/install during this forensic pass:

- `test_b052_public_start_resolved_policy_accepts_genesis_tuple_bundle_refs`
- `test_b052_public_start_resolved_policy_accepts_list_bundle_refs`
- `test_b052_installed_manifest_resolved_policy_round_trips_through_public_start_ingress`
- `test_b049_runtime_event_emission_uses_closed_carrier_adapter` now also proves a `route_recorded` event with `blocked_missing_capability`

Needed next for `B-051`:

- `test_imported_intent_carry_forward_does_not_open_first_run_fh_gate`
- `test_applied_constitutional_proposal_clears_public_next_pending_gate`
- `test_malformed_imported_intent_still_requires_constitutional_gate`
- install-lane `data_mapper` proof replacing the old pending-FH expectation

## Conclusion

The `test39` calamity should be treated as:

- one stale operator command
- two real `odd_sdlc` bugs (`B-051`, `B-052`)
- one latent closed-carrier drift that the new install proof exposed and the source line now fixes

The next retry should not happen until `B-051` is proved with explicit source + install regression tests, and `B-052` is reconciled to the now-green tuple/list/install seam proofs.
