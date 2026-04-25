---
id: B-052
title: Admit genesis policy bundle refs through one sequence-shaped ingress
type: bug
ticket_category: implementation_migration
migration_strategy: inside_out_hard_break
status: completed
goal: singular-policy-bundle-ingress-between-genesis-and-public-start
change_intent: `genesis.policy.ResolvedPolicy.to_dict()` publishes `bundle_refs` as a tuple, while `odd_sdlc.public_start_subcarriers` currently rejects anything except `list[str]`. That makes `--fh-mode human-proxy` and any public-start lane carrying resolved policy vulnerable to a container-shape crash even though the semantic carrier is otherwise valid. This ticket closes the seam so one lawful sequence-shaped policy bundle carrier crosses from genesis into odd_sdlc and is normalized once, without odd_sdlc inventing a second rival raw-policy validator.
change_class: realization_refactor
re_entry_point: realization
affected_boundary: `build_tenants/python/code/odd_sdlc/public_start_subcarriers.py`, `public_start_contract.py`, and genesis policy bundle payload consumption through public-start/result admission
priority: high
triaged_at: 2026-04-24
created_at: 2026-04-24
updated_at: 2026-04-24
dependencies:
  - B-049 completed
intake_source: `data_mapper.test39` human-proxy run abort; direct code review showed `genesis.policy.ResolvedPolicy.to_dict()` emits `bundle_refs` as `tuple[str, ...]` while odd_sdlc `_string_list(...)` rejects any non-list container
target_truth: genesis policy publication and odd_sdlc public-start admission agree on one lawful sequence semantics for `bundle_refs`. Odd_sdlc admits the genesis-shaped payload once at ingress, normalizes it to its local carrier shape, and downstream semantic kernels never care whether genesis used `tuple` or `list` internally. Raw malformed policy payload validation remains owned by genesis policy admission rather than being duplicated inside odd_sdlc.
superseded_truth: the same semantic policy bundle carrier is treated as lawful in genesis and unlawful in odd_sdlc solely because one side publishes `tuple[str, ...]` and the other side requires `list[str]`.
closure_law: this ticket closes only when policy bundle refs cross the genesis -> odd_sdlc seam through one admitted sequence contract, human-proxy/public-start no longer crash on tuple-vs-list mismatch, and odd_sdlc does not introduce a second rival raw-policy validation path after genesis admission.
evaluation_criteria:
  - odd_sdlc admits genesis-published `bundle_refs` without controller-local patching
  - sequence normalization happens once at ingress, not repeatedly downstream
  - odd_sdlc does not duplicate genesis raw-policy validation with a divergent second parser
  - no rival peer carrier for resolved policy bundle refs is introduced
  - after admission, the installed human-proxy lane returns a lawful public result instead of aborting in result-policy admission
proof_surface:
  - source proof that tuple-shaped `bundle_refs` from genesis admit successfully through odd_sdlc public-start subcarrier ingress
  - source proof that list-shaped `bundle_refs` still admit successfully
  - install proof that an installed manifest resolved policy round-trips through the same odd_sdlc ingress
  - install proof that `--fh-mode human-proxy` on a real imported workspace admits the same genesis-shaped resolved policy and progresses to a lawful yielded continuation instead of crashing
non_closure_conditions:
  - closure is claimed while tuple-shaped `bundle_refs` still crash public-start admission
  - the fix is a controller-local special case outside the public-start ingress seam
  - odd_sdlc introduces a second raw-policy validator that diverges from genesis admission truth
---

## Why This Ticket Exists

This is a clean ingress-collapse bug.

The producer publishes:

- `genesis.policy.ResolvedPolicy.to_dict()` -> `bundle_refs: tuple[str, ...]`

The consumer admits:

- `odd_sdlc.public_start_subcarriers._string_list(...)` -> rejects anything
  that is not a `list`

So one semantic carrier crosses the boundary with two incompatible structural
assumptions.

Under `DESIGN_MODULE_METHOD.md`, that fails:

- Authority Seam Closure
- Essential Carrier Consolidation
- Enforcement After Proof

## Trace Boundary

This ticket reads current repo-law truth from:

- `specification/GOALS.md`
- `specification/INTENT.md`
- `specification/PRODUCT.md`
- `specification/requirements/03-runtime-governance.md`
- `specification/requirements/08-odd-sdlc-first-slice.md`

This ticket reads current design truth from:

- `build_tenants/python/design/README.md`
- `build_tenants/python/design/QUERY_PLUGIN_CONTRACT.md`
- `build_tenants/python/design/START_TARGET_CATALOG_AND_ASSET_OWNERSHIP_INDEX.md`

This ticket reads current method-law truth from:

- `/Users/jim/src/apps/specification_methodology/specification/standards/SPEC_METHOD.md`
- `/Users/jim/src/apps/specification_methodology/specification/standards/TICKET_METHOD.md`
- `/Users/jim/src/apps/specification_methodology/specification/standards/DESIGN_MODULE_METHOD.md`

## Migration Declaration

- old_truth_path: genesis publishes resolved policy with tuple-shaped `bundle_refs`; odd_sdlc public-start ingress expects list-shaped `bundle_refs`
- new_truth_path: odd_sdlc public-start ingress admits any lawful string-sequence form for `bundle_refs` and normalizes once into the local payload carrier
- producers_old:
  - `genesis.policy.ResolvedPolicy.to_dict()`
  - `odd_sdlc.public_start_subcarriers._string_list(...)`
- producers_new:
  - one admitted sequence-normalization ingress in `public_start_subcarriers.py`
- consumers_old:
  - `admit_resolved_policy_payload(...)`
  - public-start and human-proxy result paths carrying resolved policy payloads
- consumers_new:
  - same consumers, now reading one admitted local carrier

## Functional Review Criteria

1. Is the fix at ingress, not in a controller branch?
2. Does one semantic policy carrier survive regardless of tuple vs list origin?
3. Do malformed non-string values still fail closed?
4. Is no new wrapper carrier added just to mask the mismatch?
5. Is genesis still the only raw-policy ingress authority?

## Evaluator Gate

### 1. Authority Seam Closure

- [ ] the regression tests exercise the actual `genesis -> odd_sdlc` serialized
- [x] the regression tests exercise the actual `genesis -> odd_sdlc` serialized
  policy boundary, not producer-only and consumer-only slices in isolation
- [x] one admitted ingress collapses lawful string-sequence forms to the local
  carrier shape

### 2. Essential Carrier Consolidation

- [x] no fixture-only peer carrier is introduced for `bundle_refs`
- [x] the same `admit_resolved_policy_payload(...)` seam is used for source and
  install proof

### 3. Enforcement After Proof

- [x] source regression proves tuple-shaped `bundle_refs` from `genesis`
- [x] source regression proves list-shaped compatibility remains lawful
- [x] install regression proves an installed manifest round-trips through the
  same ingress before repair is claimed complete
- [x] install regression proves human-proxy no longer crashes after policy admission

## Regression Governance

This ticket exists because the prior test wave proved producer-side policy
publication and consumer-side payload admission separately, but did not prove
the admitted carrier at the real cross-repo seam.

So the regression lane itself is part of closure.

- [x] source cross-boundary seam proof exists
- [x] install cross-boundary seam proof exists
- [x] the regression lane proves the real seam rather than a duplicated raw ingress that odd_sdlc does not actually own
- [x] no controller-local or human-proxy-only workaround is accepted as repair

## Required Break Order

1. Add source proof using a real `genesis.policy.resolve_policy_bundle()` payload.
2. Add list-shaped compatibility proof through the same ingress.
3. Add install proof that an installed manifest `resolved_policy` round-trips
   through the same ingress.
4. Add install proof that `--fh-mode human-proxy` progresses lawfully after
   policy admission instead of aborting in result-policy admission.
5. Only then repair the ingress seam.

## Initial Direction

1. reprice `_string_list(...)` into a lawful string-sequence admission helper
2. keep the local admitted carrier list-shaped if that remains the public-start contract
3. add tuple/list positive proofs plus one install round-trip proof

## Closure Note

Closed on the actual install seam, not a unit-only admission proof.

- `public_start_subcarriers.py` now admits lawful string sequences for
  `resolved_policy.bundle_refs` and normalizes them once into the local
  carrier.
- source proof:
  `test_b052_public_start_resolved_policy_accepts_genesis_tuple_bundle_refs`
  and
  `test_b052_public_start_resolved_policy_accepts_list_bundle_refs`
- install proof:
  `test_b052_installed_manifest_resolved_policy_round_trips_through_public_start_ingress`
  and
  `test_b052_install_human_proxy_advances_after_resolved_policy_bundle_ref_admission`
- package strict lane:
  `python -m mypy --config-file mypy.ini -p odd_sdlc`
  -> `Success: no issues found in 52 source files`
