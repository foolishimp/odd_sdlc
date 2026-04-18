# B-020 Adopt ABG B-014 Typed F_P Fulfillment Carrier In odd_sdlc Domain

- id: B-020
- title: Migrate odd_sdlc domain onto the B-014 generic ABG typed F_P fulfillment carrier
- type: bug
- status: backlog
- goal: fulfillment-carrier-adoption
- change_intent: Replace the evaluator-projected fulfillment_obligations slug in ABG manifests with domain-declared GTL obligation topology, so odd_sdlc's F_P fulfillment truth is owned by the domain and carried by the generic ABG substrate without domain semantics leaking into ABG.
- change_class: realization_refactor
- re_entry_point: realized_surface
- priority: high
- dependencies: abiogenesis B-014 completed; B-019 migration wave in progress
- intake_source: operator direction 2026-04-18
- affected_boundary: ABG manifest fulfillment_obligations source, GTL obligation_ledger → manifest bridge, odd_sdlc F_P result payload, runtime ledger consumption
- triaged_at: 2026-04-18
- created_at: 2026-04-18
- updated_at: 2026-04-18

## Evaluation Criterion

The evaluation criterion for this ticket comes from abiogenesis B-014:

`F_D`, `F_P`, and `F_H` are generic edge-traversal functors in ABG — not
domain-specific concepts. They apply to any lawful edge between any node
categories.

The boundary is:

- ABG owns: typed probabilistic result carriage, admission carriage,
  merge/publication law, runtime/reporting consumption hooks
- domains own: what obligations exist, what evidence is sufficient, what
  fulfillment requires, how obligation topology is shaped across edges

For this ticket, the passing condition is:

- odd_sdlc's obligation topology flows into ABG manifests as domain-declared
  `fulfillment_obligations`, not as a runtime projection of failing evaluator
  names
- ABG carries the typed ledger without learning what the obligations mean
- odd_sdlc domain code owns obligation identity and fulfillment semantics
- no domain semantics are baked into ABG carrier code

## Context

`abiogenesis` B-014 is now complete. The ABG substrate provides a generic
typed fulfillment carrier:

1. manifest declares `fulfillment_obligations` with stable ids
2. F_P worker submits typed `fulfillment_assessments` keyed by those ids
3. ABG ingestion validates identity and writes a published merged ledger
4. `assessed{kind: fp}` carries a discovery pointer to that ledger
5. runtime and reporting resolve fulfillment from the published ledger, which
   gates on `carry_converged`, `admitted`, and per-obligation `fulfillment_status`

`odd_sdlc` already has the right domain obligation topology declared: each GTL
graph function declares an `obligation_ledger` with a stable `signal_key`,
`fulfillment_rule`, and `evidence_policy`. That topology belongs in the
manifest's `fulfillment_obligations` as the authoritative domain declaration.

## Problem Statement

### Current Slug Layer

ABG's `interpret.py` currently builds the manifest `fulfillment_obligations`
from the list of currently failing F_P evaluators (`fp_failing`):

```
"fulfillment_obligations": [
    {
        "id": ev.name,
        "evaluator": ev.name,
        "statement": ev.description,
        "source_kind": "manifest_failing_evaluators_projection",
        ...
    }
    for ev in fp_failing
]
```

This is a runtime projection, not a domain declaration. The obligation ids are
evaluator names derived from the current failure state, not from the domain's
declared obligation topology. The `source_kind` is
`manifest_failing_evaluators_projection` — explicitly a derived view.

This means:

- obligation identity changes run-to-run as evaluators pass or fail
- domain obligation semantics (signal_key, fulfillment_rule, evidence_policy)
  are invisible in the manifest
- a fully converged edge produces zero `fulfillment_obligations`, making
  identity law untestable
- odd_sdlc's domain obligation topology (declared in `gtl_module.py`) never
  enters the manifest

### Domain Declaration Already Exists

`odd_sdlc/build_tenants/python/code/odd_sdlc/gtl_module.py` already declares
per-edge obligation topology via `_requirement_edge_obligation_ledger`:

```python
obligation_ledger=_requirement_edge_obligation_ledger(
    signal_key=...,
    fulfillment_rule=...,
    evidence_policy=...
)
```

All 8 constructive edges have this declaration. The `signal_key` is a stable
domain-owned obligation id. This is the correct authoritative source for
`fulfillment_obligations` in the manifest.

### F_P Worker Is Already Partially Aligned

`odd_sdlc/build_tenants/python/code/odd_sdlc/constructor.py` already emits
typed `fulfillment_assessments` in the B-014 format:

```python
"fulfillment_assessments": [
    {
        "id": str(obligation["id"]),
        "fulfillment_status": "fulfilled",
        "fulfillment_detail": evidence,
        "blocking_reasons": [],
        "evidence_refs": [str(target_path.relative_to(workspace))],
    }
    for obligation in fulfillment_obligations
]
```

This is correct shape. The issue is that the obligations it reads back come
from the manifest's `fulfillment_obligations`, which are currently the
evaluator-projected ids rather than the GTL-declared signal_keys. If those ids
diverge, the assessment keying is wrong.

## Required Migration

### Step 1: Bridge GTL Obligation Declarations Into ABG Manifest

ABG's `interpret.py` must read the GTL `obligation_ledger` declaration for the
vector being traversed and use that as the authoritative source of
`fulfillment_obligations` in the manifest, replacing the
`manifest_failing_evaluators_projection` path.

The manifest population rule must be:

- if the GTL vector declares an `obligation_ledger`, use those obligations as
  `fulfillment_obligations` with `source_kind: "gtl_obligation_declaration"`
- if the GTL vector does not declare an `obligation_ledger`, fall back to
  the evaluator projection only if no authoritative domain source is available,
  and mark it `source_kind: "manifest_failing_evaluators_projection"` so the
  bridge is visible

The GTL `obligation_ledger` must surface:

- `signal_key` → obligation `id`
- `fulfillment_rule` → obligation `statement` or `fulfillment_rule` field
- `evidence_policy` → obligation `evidence_policy` field
- `source_kind: "gtl_obligation_declaration"`

### Step 2: Stabilize Obligation Identity Across Runs

Once GTL-declared obligations are the source, obligation ids are stable:

- they do not change as evaluators converge or diverge
- a fully converged edge still has its declared obligations in the manifest
- identity law in B-014's ingestion path enforces that the F_P worker
  assesses all declared obligations

This removes the current failure mode where a partially converged edge has
different obligation ids than a fully converged edge.

### Step 3: Remove Evaluator Name Co-Alignment Assumption

The current co-alignment between evaluator names and signal_keys is an
accident of the first implementation. The migration must not depend on this
co-alignment persisting.

After migration:

- obligation ids come from GTL signal_keys (domain-declared)
- evaluator names come from GTL evaluator declarations (ABG-traversal-declared)
- these may overlap but are not required to

### Step 4: Audit odd_sdlc Constructor For Domain Semantics Leak

`constructor.py` currently generates `fulfillment_assessments` with
`fulfillment_status: "fulfilled"` for all declared obligations when
construction succeeds. This is the correct flat construction case.

Audit whether:

- the constructor can generate partial or blocked assessments where
  domain evidence is insufficient
- the `evidence_refs` are meaningful to the domain — pointing to the
  right surface, not just any constructed file
- `fulfillment_detail` describes domain-meaningful evidence, not
  infrastructure evidence

### Step 5: Align Proof

After Steps 1–4:

- re-run the ABIogenesis proof lane to confirm the generic carrier still works
- run the odd_sdlc proof lane to confirm GTL-declared obligation ids are stable
  across runs
- confirm that the `published_ledger_path` event field points to a ledger
  containing the GTL signal_keys as obligation ids
- confirm that `bind_fp_certified` correctly resolves from that ledger
  (ABG side — no change expected, it already reads the ledger correctly)

## Boundary: ABG Change vs Domain Change

ABG change (`interpret.py` in abiogenesis):

- add read path for `obligation_ledger` declaration from the GTL vector
- populate `fulfillment_obligations` from that declaration when present
- keep the evaluator-projection fallback but mark it non-authoritative

Domain change (`gtl_module.py`, `constructor.py` in odd_sdlc):

- expose `obligation_ledger` fields in a form ABG can read at manifest build
  time (may require GTL type surface change or interpretation hook)
- verify `constructor.py` maps obligation ids to GTL signal_keys, not
  evaluator names

**ABG must not learn what signal_keys mean. It must only carry them.**

## Divergences From B-014 Target

### Divergence 1: Manifest Obligations Are Runtime-Projected, Not Domain-Declared

`source_kind: "manifest_failing_evaluators_projection"` in all odd_sdlc
manifests.

Resolution: Step 1 above.

### Divergence 2: Obligation Identity Changes Run-To-Run

A converging edge has a different obligation set than a diverging edge.

Resolution: Step 2 above.

### Divergence 3: Evaluator Name / Signal Key Co-Alignment Is Invisible

The current accidental alignment between evaluator names and signal_keys is
not declared. It is an implicit coupling that will break silently if either
changes.

Resolution: Step 3 above.

## Relationship To B-019

B-019 covers the broader odd_sdlc migration wave: carry/fulfillment separation,
derivation rules, start/gaps alignment, harness proof.

B-020 is a narrower substrate-adoption ticket scoped specifically to:

- replacing the evaluator-projected `fulfillment_obligations` slug
- bridging GTL obligation declarations into ABG manifests
- stabilizing obligation identity for the B-014 carrier

B-020 should complete before B-019's harness/proof phase (Step 5 in B-019's
dependency order), because the proof assertions must use GTL-declared obligation
ids, not evaluator names.

## Acceptance

B-020 is complete when:

- `fulfillment_obligations` in odd_sdlc manifests have `source_kind:
  "gtl_obligation_declaration"` and ids matching the GTL signal_keys
- obligation ids are stable across converging runs on the same edge
- `bind_fp_certified` resolves correctly from a ledger keyed by signal_keys
- ABG carries those ids without encoding domain meaning (fulfillment_rule,
  evidence_policy remain domain-owned)
- the evaluator-projection path is either removed or marked explicitly
  non-authoritative
- the abiogenesis and odd_sdlc proof lanes are green on the aligned obligation
  ids
