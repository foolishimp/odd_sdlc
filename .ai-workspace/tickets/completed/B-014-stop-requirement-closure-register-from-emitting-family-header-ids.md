# B-014 Stop Requirement Closure Register From Emitting Family Header IDs

- id: B-014
- title: Requirement closure register emits family header ids as if they were real requirements
- type: bug
- status: completed
- goal: traceability-and-installed-dev-proof
- priority: high
- created_at: 2026-04-17
- updated_at: 2026-04-17
- dependencies:

## Triage

- intake: `odd_sdlc` installed proof against current source and latest ABG runtime
- change_intent: restore requirement-closure truth so requirement family headers do not masquerade as executable requirement ids
- lawful_change_class: realization_refactor
- affected_boundary: deterministic traceability inspection, requirement closure register publication, and installation-proof expectations
- lawful_re_entry: realization layer first; no requirement reprice required because the requirement-vs-family distinction is already part of the existing traceability law
- downstream_proof_span: installation suite plus any downstream workspace that depends on closure-register truth for requirement authority accounting
- triaged_at: 2026-04-17

## Why This Ticket Exists

The current installation proof still fails at:

- `test_requirement_closure_register_ignores_family_headers_and_counts_written_testcase_authority`

The failure shows that `build_requirement_closure_register(...)` emits
`REQ-F-ODDSVC` as an actual entry when the requirement surface contains a
family header such as:

- `**Family**: REQ-F-ODDSVC-*`

That is unlawful traceability truth.

Requirement families are grouping labels. They are not executable or governable
requirement ids and must not appear in the closure register beside concrete
requirement ids like `REQ-F-ODDSVC-001`.

This is a real installed-dev proof defect because downstream closure logic and
testcase authority accounting should operate over actual requirements only.

## Intended Direction

The deterministic requirement-id extraction path must distinguish:

- requirement family headers
- concrete requirement ids

Only concrete requirement ids belong in the closure register. Family labels may
remain available as grouping/context metadata if useful, but they must not be
published as requirement entries.

## Task List

- [x] Identify where family-header syntax is currently promoted into concrete
  requirement ids during closure-register construction.
- [x] Tighten requirement-id extraction so family-header tokens are filtered out
  before register entries are created.
- [x] Preserve testcase authority accounting for the real child requirements in
  the same family.
- [x] Add or update deterministic regression coverage so a family header like
  `REQ-F-ODDSVC-*` never yields a `REQ-F-ODDSVC` entry.
- [x] Re-run the installation suite and confirm the closure-register proof is
  green.

## Resolution

The root cause was the broadened requirement-id collector in
`build_tenants/python/code/odd_sdlc/traceability.py`, which accepted any
`REQ-*` token and therefore promoted family headers like `REQ-F-ODDSVC` into
closure-register entries.

The containment fix was to keep the existing readable id population intact and
filter closure-register collection to concrete requirement ids only. In the
current `odd_sdlc` requirement corpus, concrete ids carry at least one numeric
segment while family ids do not. That preserved live concrete requirement
truth without repricing identity law.

## Proof

- targeted regression:
  - `python -m pytest build_tenants/python/test_env/tests/test_odd_sdlc_installation.py -q -k 'requirement_closure_register_ignores_family_headers_and_counts_written_testcase_authority'`
- installation suite:
  - `python -m pytest build_tenants/python/test_env/tests/test_odd_sdlc_installation.py -q`
- sandbox suite:
  - `python -m pytest build_tenants/python/test_env/tests/test_odd_sdlc_sandbox_usecase.py -q`

## Acceptance

- the closure register does not emit bare family ids such as `REQ-F-ODDSVC`
- concrete requirement ids in the same family still appear and retain their
  authority/testcase accounting
- deterministic installation proof is green for the family-header regression

## Links

- failing proof: `build_tenants/python/test_env/tests/test_odd_sdlc_installation.py::test_requirement_closure_register_ignores_family_headers_and_counts_written_testcase_authority`
- proving context: install + sandbox verification against installer-owned
  `abiogenesis.standard@3.1.0`
