# Root Cause: Lossy Traversal Obligation Carriers

**Status**: resolved for the TypeScript carrier/postflight slice by T-091
**Scope**: all prompt-bearing ODD SDLC traversals
**Primary ticket**:
`active/T-091-harden-typescript-traversal-closure-against-lossy-obligation-carriers.md`
**Observed in**: `data_mapper.test52.ts`

## Claim

The `data_mapper.test52.ts` bootstrap failure is one instance of a general
traversal defect.

Every prompt-bearing edge can lose authority pressure before the worker runs
because the current traversal carrier reduces rich source truth to IDs,
generic summaries, and refs. Closure can then pass because postflight verifies
that every ID was assessed, not that the actual obligation content constrained
the output.

## Observable Evidence

In `test52`, `Fg_conform_project` now runs in the right order and creates the
required topology:

- `specification/GOALS.md`
- `specification/PRODUCT.md`
- `specification/requirements/00-imported-sources.md`
- `.ai-workspace/context/project_bootstrap.md`
- `.ai-workspace/context/project_constraints.yml`
- `build_tenants/TENANT_REGISTRY.md`

The F_D edge closes with:

```text
graph_call_opened -> frame_opened -> vector_traversal_planned -> vector_evaluated -> vector_closed
```

But the closed requirement surface is only a marker ledger. It does not carry
requirement text, family allocation, source spans, or acceptance criteria as
first-class authority.

The next prompt edge receives 97 obligations, including 90 requirements, but
the requirement obligations look like:

```text
Fulfill live requirement REQ-LDM-004.
```

That is formal pressure, not useful pressure.

## Code-Level Cause

The current carrier is too small:

```ts
interface SdlcTraversalObligation {
  kind: "sdlc_traversal_obligation";
  obligationId: string;
  obligationKind: SdlcTraversalObligationKind;
  summary: string;
  evidenceRefs: readonly string[];
}
```

`requirementObligations` scans files under `specification/requirements/` with a
regex, normalizes markers, and emits:

```ts
summary: `Fulfill live requirement ${requirementId}.`
```

That loses:

- the requirement text
- the requirement family
- the source document digest
- the source span
- the acceptance criteria
- aliases or marker ambiguity
- the expected edge-specific gain

`assertTraversalIntentPackagePressure` checks identity, non-empty authority,
induction lineage for materialization, obligation count, and prior gap refs on
retry. It does not check obligation payload adequacy.

`evaluateObligationAssessments` checks missing/extra/unassessed/blocked-without-
evidence. It does not reject fulfilled obligations whose evidence is only a
ledger ref or whose declared obligation had no semantic payload.

The assurance ledger mirrors this: it can prove every declared obligation was
assessed, but it cannot prove source-to-output coverage when the declared
obligation did not carry the source payload.

## Algebraic Root Cause

The edge should behave like a total function over typed state:

```text
Compute_e(
  SourceAssets,
  TargetContract,
  PriorEdgeState,
  GapState,
  EvaluatorContracts
) -> Accepted(Output, CoverageLedger)
   | Retry(GapDossier)
   | Reprice(RepriceDossier)
```

The current implementation applies a lossy quotient before compute:

```text
SourceAssets + PriorEdgeState + TargetContract
  -> IDs + refs
  -> prompt
  -> fulfilled IDs
```

Once the system has collapsed a requirement, design, module, source asset, or
gap into an ID and a ref, the evaluator can no longer deterministically ask:

```text
Did the result match the requirement?
```

It can only ask:

```text
Did the worker say it fulfilled the ID?
```

That is the algebraic break.

## Why It Repeats At Every Iteration

This is not bootstrap-specific because every traversal has the same shape:

```text
A -> B
```

For each edge, `A` is never just a file or type. It is a typed source surface
plus accumulated obligations:

- imported requirements
- current intent/product/goals
- design/module constraints
- prior edge outputs
- unresolved gaps
- evaluator contracts
- runtime evidence
- target output contract

If any of those are represented only as refs and IDs, the worker has too much
unconstrained internal traversal space. The same failure can occur at:

- intent derivation
- product derivation
- requirement synthesis
- feature decomposition
- design synthesis
- module synthesis
- code generation
- test generation
- test execution evidence
- release qualification

The failure mode is always:

```text
formal obligation present
semantic payload absent
worker reports fulfilled
postflight accepts shape/count/evidence
edge closes too early
```

## Correct General Fix

Create a typed `TraversalObligationDossier` for every prompt-bearing edge.

Minimum shape:

```text
TraversalObligationDossier {
  edge_identity
  source_assets
  target_contract
  required_gain
  authority_obligations
  design_or_module_obligations
  prior_edge_obligations
  prior_gap_obligations
  evaluator_obligations
  runtime_context_obligations
  coverage_contract
}
```

Each obligation must carry its useful payload, not just an ID:

- `source_ref`
- `source_digest`
- `source_span` or bounded source excerpt/summary
- `obligation_text`
- `family` or dimension
- `edge_relevance`
- `acceptance_criteria`
- `expected_output_coverage`
- `lawful_carry_forward_policy`

The worker report must then include a coverage ledger:

```text
ObligationCoverage {
  obligation_id
  output_refs
  coverage_status
  evidence_refs
  residual_gap
}
```

Postflight closes only when required obligations are either covered or lawfully
carried forward as typed gaps. Evidence refs alone are not coverage.

## Boundary

ABG should not own SDLC requirement meaning. ABG owns traversal runtime,
frames, events, retry, continuation, lineage, and projection.

`odd_sdlc` owns this domain-specific obligation dossier and its closure
evaluators. The product plugin supplies the typed pressure and coverage rules;
ABG provides the runtime path that keeps those facts visible across retries and
later edges.

## Design Consequence

`T-091` must not be implemented as a bootstrap-only requirement ledger patch.
Bootstrap is the first failing instance. The durable fix is to make every
prompt-bearing traversal consume and return typed obligation coverage.

## Implemented Resolution

T-091 hardens the TypeScript tenant at the `odd_sdlc` domain boundary:

- traversal obligations now carry typed payloads with status, source refs,
  source digests, bounded snippets, and coverage expectations
- `Fg_conform_project` materializes deterministic requirement-family files
  from concrete imported requirement lines
- requirement obligations expand `00-imported-sources.md` back to imported
  source documents before prompt-bearing handoff
- marker-only requirement pressure is rejected before worker dispatch
- postflight rejects fulfilled requirement assessments that cite only input
  authority without generated output, product materialization, or execution
  evidence coverage

This is not an ABG core fix. ABG owns runtime/event/retry/projection truth. The
defect was the SDLC projection that fed prompt workers and postflight with
lossy obligation carriers.

Verification:

- `npm run test:t087`
- `npm run test:t088`
- `npm run test:t089`
- `npm run test:t091`
- `npm run lint:semantic`
- `npm run test:semantic` passed with 127 tests.
