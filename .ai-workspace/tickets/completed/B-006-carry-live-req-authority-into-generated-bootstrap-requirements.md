# B-006 Carry Live REQ Authority Into Generated Bootstrap Requirements

- id: B-006
- title: Carry live requirement authority into generated bootstrap requirements for imported software projects
- type: bug
- status: completed
- goal: ambiguity-governance-and-traceability
- priority: high
- created_at: 2026-04-16
- updated_at: 2026-04-16
- dependencies: T-004

## Triage

- intake: downstream dogfood failure / imported-workspace traceability regression
- lawful_change_class: realization_refactor
- affected_boundary: `odd_sdlc` requirement-surface constructor, requirement-scope deterministic proof, and released install behavior over imported software projects
- lawful_re_entry: odd_sdlc constructor implementation, fd evidence, and installed-workspace regression proof
- downstream_proof_span: odd_sdlc constructor/fd proof plus odd_domain dogfood replay through the refreshed released odd_sdlc install

## Why This Ticket Exists

`odd_sdlc` is being used to dogfood the mutable `odd_domain` source project.

That exposed a real consumer-facing bug in the `derive_requirement_surface`
constructor path for imported software projects:

- the generated bootstrap requirement surface at
  `specification/requirements/10-generated-bootstrap.md` narrows scope to a
  generic local bullet list
- it does not carry forward the live imported `REQ-*` identifiers already
  declared in the project requirement families
- the deterministic `requirement_scope_complete` check then fails lawfully,
  because the generated current requirement surface no longer contains the live
  requirement ids

This is a real `odd_sdlc` defect, not an `odd_domain` local problem.

The same downstream dogfood run also exposed a smaller generic defect in
project naming:

- if `specification/INTENT.md` starts with the generic heading `# Intent`,
  the generated bootstrap requirement surface currently reports the project as
  `Intent`
- that is not a lawful project identity readback for imported projects

## Intended Direction

Fix this generically in `odd_sdlc`:

- the software-project requirement-surface constructor must carry forward the
  live imported `REQ-*` ids from project authority
- the generated bootstrap requirement surface must therefore satisfy the
  deterministic requirement-scope check immediately after construction
- generic headings such as `Intent`, `Product`, `Goals`, and `Requirements`
  must not be treated as project titles when reading imported project identity

Then the refreshed released `odd_sdlc` product should be reinstalled into
`odd_domain` and the bounded dogfood slice rerun there.

## Task List

- [x] Patch the `odd_sdlc` constructor so generated bootstrap requirements
  carry live imported `REQ-*` authority for software projects.
- [x] Patch project-title readback so generic constitutional headings do not
  become project identity.
- [x] Add a focused regression proving:
  - constructor-generated bootstrap requirements include live imported
    requirement ids
  - `requirement_scope_complete` passes after that constructor turn
  - generic `# Intent` headings do not collapse project identity to `Intent`
- [x] Refresh the released `odd_sdlc` install into `odd_domain` and replay the
  bounded dogfood slice there.

## Acceptance

- `odd_sdlc` generically carries live imported `REQ-*` ids into generated
  bootstrap requirements for software projects
- the generated bootstrap requirement surface no longer fails deterministic
  scope closure just because the constructor narrowed authority
- generic constitutional headings are not mistaken for project identity
- the refreshed released `odd_sdlc` product can be reinstalled into
  `odd_domain` and advance the dogfood line past the original requirement
  carry-forward defect

## Links

- downstream dogfood ticket: `/Users/jim/src/apps/odd_domain/.ai-workspace/tickets/active/T-018-dogfood-odd-domain-through-released-odd-sdlc.md`
- standard: `/Users/jim/src/apps/specification_methodology/specification/standards/SPEC_METHOD.md`
- standard: `/Users/jim/src/apps/specification_methodology/specification/standards/TICKET_METHOD.md`

## Completion Notes

- `odd_sdlc` now carries live project `REQ-*` ids into generated bootstrap
  requirements using project authority, not just imported requirement-like
  source heuristics.
- generic constitutional headings such as `# Intent` no longer collapse
  imported project identity to `Intent`.
- focused non-live regression proof passes in `odd_sdlc`:
  `python -m pytest build_tenants/python/test_env/tests/test_odd_sdlc_fd_evidence.py -q`
- the refreshed released `odd_sdlc` product was reinstalled into `odd_domain`,
  the installed constructor regenerated
  `specification/requirements/10-generated-bootstrap.md`, and the installed
  deterministic `requirement_scope_complete` check passed there.
- post-refresh non-live gap scan in `odd_domain` now shows
  `derive_requirement_surface` with `delta: 0.0` and `state: converged`; the
  next open gaps are downstream design/test surfaces rather than the original
  requirement carry-forward defect.
