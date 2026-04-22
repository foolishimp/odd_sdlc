# S-037 Review 06: Fault-Line Synthesis and Repair Order

## Repeated Pattern

The same failure pattern appears across the core:

1. a lawful carrier or published read model is introduced
2. a public wrapper or helper path continues to reinterpret or bypass it
3. mixed authority survives behind a new name
4. the bug only becomes visible in a sandbox or event-forensic review

This is not GTL config drift.

It is odd_sdlc-side domain-governance migration drift.

## File-by-File Category Map

### `analysis.py`

- lawful but over-coupled
- low hidden-semantic-center risk

### `traceability_index.py`

- prime carrier boundary
- helper sprawl inside a prime boundary
- downstream incomplete-migration risk if consumers bypass it

### `requirement_closure.py`

- lawful but over-coupled
- interface bleed risk
- medium hidden-semantic-center risk

### `triage.py`

- high hidden-semantic-center risk
- unstable identity across refresh or reprojection
- lawful but over-coupled

### `gap_dossier.py`

- projection boundary with split-carrier-vs-controller risk
- proxy-compatibility risk if unavailable projection becomes silent rebuild

### `homeostatic_loop.py`

- incorrect boundary ownership risk if constitutional application is delegated
  to substrate helpers
- unstable identity risk when proposal continuity is not stable

### `app.py`

- highest hidden-semantic-center risk in the repo
- incomplete migration hotspot
- incorrect boundary ownership hotspot

### `start_targeting.py`

- lawful adapter boundary
- GTL reinvention risk if bypassed

### `execution_contract.py`

- lawful hard-break admission boundary
- incomplete migration risk if callers bypass admission

### `query.py`

- thin projection aggregator
- interface-bleed risk if it starts rebuilding truth

### `span_analysis.py`

- interface-bleed risk
- previous split-truth risk between raw graph gaps and declared obligation gaps

### `repair_frontier.py`

- projection-becoming-policy risk

### `constructor.py`

- lawful but over-coupled
- helper sprawl inside a prime boundary
- medium hidden-semantic-center risk if it absorbs route or requirement law

## Primary Fault Lines

The stabilization wave should treat these as the main fault classes:

### 1. Incomplete migration

Meaning:

- new carrier exists
- one public or side path still uses old procedural truth

Seen most strongly in:

- `app.py`
- `gap_dossier.py`
- `execution_contract.py` callers
- downstream tests that bypass publication

### 2. Incorrect boundary ownership

Meaning:

- generic substrate helper is used where odd_sdlc domain meaning should apply

Seen most strongly in:

- `app.py`
- `homeostatic_loop.py`

### 3. Hidden semantic center

Meaning:

- reviewers must read one controller file to discover what “next”, “blocked”,
  “closure”, or “re-entry” means

Seen most strongly in:

- `app.py`
- `triage.py`
- secondarily `requirement_closure.py`

### 4. Unstable identity across refresh/reprojection

Meaning:

- refreshed analysis or republished artifacts change identity for semantically
  same work

Seen most strongly in:

- `triage.py`
- `homeostatic_loop.py`

### 5. Interface bleed

Meaning:

- a projection file starts deciding source truth, or a report file starts
  deciding closure

Seen most strongly in:

- `requirement_closure.py`
- `span_analysis.py`
- `query.py`
- `repair_frontier.py`

## What Is Stable Enough To Keep

These design choices are worth preserving:

- source-carrier first architecture
- published read-model requirement for public `next`
- explicit rejection of raw `next` admission in `execution_contract.py`
- fail-closed read models for gap dossier and requirement closure
- odd_sdlc ownership of constitutional application
- typed canonical edge-gap projection

## What Needs Tight Discipline

- `app.py` must stay thin and carrier-consuming
- `triage.py` must stay deterministic and identity-stable
- `requirement_closure.py` must not be bypassed by fresh scans in public paths
- `constructor.py` must not absorb route or requirement law

## Recommended Repair Order

1. Fix all live controller bypasses of published carriers.
2. Fix unstable identity / refresh semantics in homeostatic and triage flows.
3. Fix any remaining incorrect boundary ownership between odd_sdlc and ABG.
4. Only then consider file-size or helper-sprawl refactors.

The right question is not “which file is ugly?”

It is:

`which file currently owns meaning that should already exist in a carrier or projection?`

## Ticket Mapping

- `B-035`
  primary category: incomplete migration and controller bypass of published
  head-gap truth
- `B-036`
  primary category: public control and continuation/re-entry semantics after the
  ABG substrate fix; review needed against `app.py`, `homeostatic_loop.py`, and
  yield-path tests

If new bugs are opened from this review, they should use the categories above
instead of generic “wiring issue” language.

## Review Conclusion

The core architecture is not broken at the topological level.

The recurring breakage comes from migrations that stop short of severing the old
semantic center. Stabilization should therefore prioritize:

- authoritative carrier consumption
- explicit boundary ownership
- fail-closed read models
- stable identity through refresh and reprojection

before any large-scale reshaping of the module set.
