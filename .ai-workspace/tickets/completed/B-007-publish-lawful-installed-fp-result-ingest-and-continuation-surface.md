# B-007 Publish Lawful Installed FP Result Ingest And Continuation Surface

- id: B-007
- title: Publish a lawful installed-workspace FP result ingestion and continuation surface for yielded odd_sdlc turns
- type: bug
- status: completed
- goal: ambiguity-governance-and-traceability
- priority: medium
- created_at: 2026-04-16
- updated_at: 2026-04-16
- dependencies:

## Triage

- intake: downstream dogfood friction / installed-product operator limitation / yielded handoff usability gap
- lawful_change_class: interface_reprice
- affected_boundary: installed odd_sdlc operator surface for yielded FP handoff, FP result admission, analysis refresh, and continuation over imported workspaces
- lawful_re_entry: odd_sdlc installed CLI/operator surface, yielded handoff continuation design, and installed-workspace proof
- downstream_proof_span: refreshed installed odd_sdlc replay over odd_domain plus one focused installed-workspace regression proving lawful result admission and continuation

## Why This Ticket Exists

The released installed `odd_sdlc` product can now drive the mutable
`odd_domain` source project through lawful yielded FP handoff.

But the current continuation path is still not published as a proper installed
operator surface.

In the live `odd_domain` dogfood line, advancing past yielded edges currently
required this sequence:

- author the target surface by hand in the mutable project
- call internal module code via:
  `python -c "from genesis.result_ingest import ingest_fp_result ..."`
- run `python -m odd_sdlc refresh-analysis --workspace .`
- then resume with `gaps` or `start`

That means the installed product still leaks internal continuation machinery:

- FP result admission is real, but not exposed as a lawful public installed
  surface
- analysis refresh is real, but still fragmented from result admission
- continuation is possible, but only by operator folklore rather than one
  published path

This is a real `odd_sdlc` limitation exposed by dogfooding, not an
`odd_domain` local problem.

It is not a fundamental closure break.

The current released product can still progress lawfully through operator
iteration. The limitation is that the lawful continuation path is not yet
published cleanly as a first-class installed operator surface.

## Intended Direction

`odd_sdlc` should publish one lawful installed continuation surface for yielded
FP turns.

That surface should:

- accept a returned FP result artifact through a supported installed command or
  equivalent public operator surface
- refresh analysis lawfully as part of that continuation path, or make the
  required refresh inseparable from result admission
- preserve yielded handoff truth rather than hiding the FP seam
- let the operator continue the installed workspace without dropping into
  internal Python module calls

The point is not to eliminate yielded handoff.

The point is to make the yielded handoff consumable through the released
installed product itself.

## Scope Boundary

This ticket is in scope for:

- publishing an installed operator surface for FP result ingestion
- binding analysis refresh and continuation lawfully to that result-admission
  path
- proving the path on an installed imported workspace such as `odd_domain`

This ticket is not in scope for:

- removing yielded FP handoff
- hiding FP artifacts from the operator
- rewriting imported-project semantics in `odd_domain`

## Task List

- [x] Choose the public installed operator shape for FP result admission and
  continuation.
- [x] Implement the installed odd_sdlc surface so operators do not need
  `python -c` calls into internal modules.
- [x] Bind analysis refresh lawfully to that continuation path so result
  admission does not leave the workspace in a trivially stale state.
- [x] Add focused installed-workspace proof for result admission,
  refresh/continuation, and resumed gap/start behavior.
- [x] Replay the proof against the current `odd_domain` dogfood line or an
  equivalent imported-workspace fixture.

## Acceptance

- the installed odd_sdlc product publishes a lawful FP result ingestion and
  continuation surface
- yielded handoff remains explicit, but operators no longer need internal
  module calls to continue
- analysis refresh is handled lawfully as part of the continuation path rather
  than by fragile manual folklore
- the refreshed installed product proves the path on at least one imported
  workspace

## Current Workaround

The current operator-workable path is:

- author the yielded target surface
- ingest the FP result through the internal result-ingest module
- refresh analysis
- continue with `gaps` or `start`

That workaround is lawful enough to keep dogfood moving today. This ticket
exists to turn that workaround into a proper released installed surface.

## Links

- downstream dogfood ticket: `/Users/jim/src/apps/odd_domain/.ai-workspace/tickets/active/T-018-dogfood-odd-domain-through-released-odd-sdlc.md`
- related bug: `/Users/jim/src/apps/odd_sdlc/.ai-workspace/tickets/completed/B-005-adopt-abg-yielded-handoff-in-odd-sdlc.md`
- standard: `/Users/jim/src/apps/specification_methodology/specification/standards/SPEC_METHOD.md`
- standard: `/Users/jim/src/apps/specification_methodology/specification/standards/TICKET_METHOD.md`

## Completion Notes

- `odd_sdlc` now publishes a real installed continuation surface:
  `python -m odd_sdlc continue --result <fp_result.json> --workspace <workspace>`.
- That public surface wraps lawful FP result admission plus inseparable
  `refresh-analysis`, then returns the refreshed gap snapshot and active
  executive program context so operators no longer need `python -c` calls into
  `genesis.result_ingest`.
- Focused installed-workspace proof is green in
  `build_tenants/python/test_env/tests/test_odd_sdlc_yield_usecase.py`:
  - `test_data_mapper_continue_command_admits_result_refreshes_analysis_and_advances_start`
  - `test_data_mapper_continue_command_preserves_yielded_handoff_truth`
- Full installed yielded-handoff regression is also green:
  `python -m pytest build_tenants/python/test_env/tests/test_odd_sdlc_yield_usecase.py -q`
