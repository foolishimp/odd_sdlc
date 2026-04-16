# B-010 Normalize Imported Requirement Ids Across Authority And Traceability

- id: B-010
- title: Make odd_sdlc carry imported two-digit REQ ids lawfully through authority, closure, and traceability evaluation
- type: bug
- status: completed
- goal: ambiguity-governance-and-traceability
- priority: high
- created_at: 2026-04-16
- updated_at: 2026-04-16
- dependencies: B-006

## Triage

- intake: downstream comparative review / imported-workspace authority drift / traceability normalization defect
- lawful_change_class: interface_reprice
- affected_boundary: odd_sdlc requirement-closure register, requirement scope validation, and downstream code/test traceability over imported projects whose authority uses two-digit REQ numbering
- lawful_re_entry: odd_sdlc traceability/closure law and imported-workspace proof on data_mapper
- downstream_proof_span: replay on `data_mapper.test32` plus one focused regression over imported authority surfaces using `REQ-XX-01` style ids

## Why This Ticket Exists

The current `odd_sdlc` traceability parser is keyed to three-digit requirement
ids:

- `REQ-...-001`
- `REQ-...-002`

But imported downstream authorities such as `data_mapper` still use two-digit
forms:

- `REQ-LDM-01`
- `REQ-TRV-05-A`

Dogfooding and comparative review against:

- `/Users/jim/src/apps/ai_sdlc_examples/local_projects/data_mapper/data_mapper.test32`

showed that this format drift weakens closure honesty.

Observed effects:

1. The generated bootstrap requirements normalize the imported ids into
   three-digit form.
2. The traceability/closure register then sees the generated bootstrap ids as
   current truth.
3. But the imported source authority ids are not carried literally through the
   same parser/evaluator path.
4. That allows the workspace to converge under the normalized internal branch
   even when an external literal authority review still shows unreleased
   requirement ids downstream.

This does not mean `test32` is empty or fake. It does mean the current
framework is not yet fully honest about imported requirement-id equivalence.

## Concrete Reproduction

Using:

`/Users/jim/src/apps/ai_sdlc_examples/local_projects/data_mapper/data_mapper.test32`

1. Inspect imported authority surfaces:
   - `specification/REQUIREMENTS.md`
   - `specification/mapper_requirements.md`
2. Observe two-digit ids such as:
   - `REQ-LDM-01`
   - `REQ-PDM-02-A`
   - `REQ-TRV-05-B`
3. Inspect the generated bootstrap and traceability-bearing generated surfaces.
4. Observe normalized three-digit forms such as:
   - `REQ-LDM-001`
   - `REQ-PDM-002-A`
   - `REQ-TRV-005-B`
5. Run:
   - `PYTHONPATH=.genesis python -m genesis gaps --workspace .`
6. Observe:
   - the workspace can report `converged: true`
   - but a normalized external review still finds requirement ids remaining only
     at `specified` / not fully realized downstream

## Intended Direction

`odd_sdlc` should treat imported requirement ids lawfully across format
variants.

That means at minimum:

1. imported authority ids using two-digit numbering must be parsed as live
   authority
2. generated normalized ids must remain equivalent to their imported authority
   source ids
3. closure and traceability evaluators must operate on one lawful normalized
   identity set rather than silently dropping imported authority literals

The goal is not cosmetic renumbering.

The goal is preserving literal downstream pressure from imported authority.

## Scope Boundary

This ticket is in scope for:

- fixing requirement-id parsing/normalization across imported authority and
  generated surfaces
- making the closure register honest about `present_in_authority`
- replaying the effect on imported workspaces such as `data_mapper.test32`

This ticket is not in scope for:

- redesigning the whole proving subset law
- requiring every imported requirement to be realized in one wave regardless of
  current implementation claims
- repricing product intent or requirements in the downstream domain itself

## Task List

- [x] Make imported two-digit requirement ids parse as live authority in the
  closure register.
- [x] Normalize imported and generated ids into one lawful equivalence class for
  downstream traceability evaluation.
- [x] Ensure closure register rows on imported workspaces set
  `present_in_authority` truthfully after normalization.
- [x] Replay on `data_mapper.test32` and confirm the authority/current/code/test
  view is internally honest.
- [x] Add one focused regression covering an imported workspace with two-digit
  REQ ids.

## Acceptance

- imported `REQ-XX-01` style ids are treated as live authority by odd_sdlc
- normalized generated ids remain trace-equivalent to their imported source ids
- closure and traceability outputs no longer hide imported authority through
  numbering drift
- replay on `data_mapper.test32` shows honest authority carry-forward under the
  fixed normalization law

## Links

- downstream comparison set: `/Users/jim/src/apps/ai_sdlc_examples/local_projects/data_mapper`
- converged imported workspace exposing the issue:
  `/Users/jim/src/apps/ai_sdlc_examples/local_projects/data_mapper/data_mapper.test32`
- related bug:
  `/Users/jim/src/apps/odd_sdlc/.ai-workspace/tickets/completed/B-009-fix-traceability-evaluators-that-pass-empty-code-and-test-surfaces.md`
- related completed fix:
  `/Users/jim/src/apps/odd_sdlc/.ai-workspace/tickets/completed/B-006-carry-live-req-authority-into-generated-bootstrap-requirements.md`

## Completion Notes

- `odd_sdlc.traceability` now normalizes requirement identifiers into one
  canonical identity set by zero-padding numeric segments shorter than three
  digits, so imported ids like `REQ-LDM-01` and generated ids like
  `REQ-LDM-001` land in the same authority/traceability row.
- The requirement-id parser now admits imported two-digit forms through the
  same authority/current/claim/code/test collection path instead of silently
  dropping them.
- Focused regression is green:
  `python -m pytest build_tenants/python/test_env/tests/test_odd_sdlc_fd_evidence.py -q`
- On `data_mapper.test32`, normalized rows such as `REQ-LDM-001`,
  `REQ-PDM-002-A`, and `REQ-TRV-005-B` now set `present_in_authority: true`
  and carry authority refs back to the imported source requirement files.
- The imported-workspace replay is now honest rather than cosmetically green:
  after `refresh-analysis` / `gaps`, `data_mapper.test32` reopens
  `derive_requirement_surface`, `derive_test_module_surface`, and
  `derive_test_run_archive_surface` instead of claiming full convergence across
  mixed two-digit and three-digit requirement identities.
