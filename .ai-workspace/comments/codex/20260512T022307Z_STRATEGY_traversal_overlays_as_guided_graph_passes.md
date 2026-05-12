# Strategy: Traversal Overlays As Guided Graph Passes Over Workspace

- author: codex
- status: commentary, not law
- created_at: 2026-05-12T02:23:07Z
- scope: `odd_sdlc` traversal graph strategy
- source discussion: operator design refinement on multiple traversal graphs, workspace overlays, and W/L/E/Ev consistency
- related code surfaces:
  - `build_tenants/typescript/code/src/graph/catalog.ts`
  - `build_tenants/typescript/code/src/graph/module.ts`
  - `build_tenants/typescript/code/src/projection/query_domain.ts`
  - `build_tenants/typescript/code/src/start/public_start.ts`

## Position

The current question is not only whether `odd_sdlc` can expose multiple graph
functions or multiple start targets. The stronger design is that each traversal
graph is a governed overlay on the current workspace.

The workspace is the mutable construction surface. A traversal overlay selects a
lawful view over that workspace: what may be observed, which graph functions may
run, which F_P callouts are allowed, which ledgers must be emitted, and which
evaluation fold can accept, retry, re-enter, reprice, or block the result.

This turns "multiple traversal graphs" into a more precise mechanism:

```text
Run graph functions over W through declared overlays.
Each overlay is a guided pass over the same workspace.
Different overlays may provide different depth without creating rival truth.
```

A light hello-world overlay and a heavy design-planning overlay are not
competing product definitions. They are different lawful passes over `W`.

## Core Algebra

Use the existing W/L/E/Ev relation:

```text
W  = mutable workspace under construction
O  = traversal overlay over W
L  = immutable governed ledger emitted by F_P work under O
E  = immutable event log anchoring admitted transitions
Ev = evaluator work over L/E under O's closure law
```

The overlay is the missing selector:

```text
O(W) -> F_P work -> L -> E -> Ev -> next lawful action
```

The consistency relation is:

```text
W may change without becoming authority.
O defines the lawful traversal view over W.
F_P acts in W through O.
Admission preserves governed evidence in L.
E orders and anchors L entries with predecessor refs.
Ev evaluates declared ledger/event snapshots, not ambient workspace state.
Ev output is itself work that must be admitted back into L/E.
L/E constrain the next lawful action over W.
```

This is an algebraic refinement, not a contradiction of the current method. It
does not replace ABG event truth. It names the missing guided-pass layer between
workspace reality and graph execution.

## Overlay Shape

A traversal overlay should be a first-class declared carrier, not only a naming
convention around executive graph functions.

Candidate carrier:

```ts
interface SdlcTraversalOverlay {
  readonly kind: "sdlc_traversal_overlay";
  readonly overlayRef: string;
  readonly intent: string;
  readonly workspaceObservationPolicy: string;
  readonly graphFunctionNames: readonly string[];
  readonly publicStartTargets: readonly string[];
  readonly requiredLedgersByEdge: readonly SdlcOverlayLedgerRequirement[];
  readonly evalPolicy: SdlcOverlayEvalPolicy;
  readonly refinementPolicy: SdlcOverlayRefinementPolicy;
}
```

Each execution under an overlay should stamp at least:

```text
overlayRef
workspaceObservationRef
graphFunctionRef
edgeRef
ledgerRef
eventRef
evalRef
refinesOverlayRef?
```

That stamp prevents a light run, heavy run, repair run, or eval-only run from
being confused with another pass over the same workspace.

## Light And Heavy Overlays

A light hello-world overlay should be able to run a small lawful pass:

```text
O_hello_world_light:
  observe input document / project authority
  derive or confirm requirement authority
  materialize declared hello-world product asset
  emit product-materialization and requirement-fulfillment ledgers
  evaluate closure over those ledgers
```

A heavy bootstrap overlay should retain the deeper planning path:

```text
O_bootstrap_heavy:
  observe workspace and source inputs
  derive intent/product/goals/requirements
  derive design/scenario/topology/schedule
  materialize code and tests
  execute, qualify, archive, and prepare release
  emit ledgers across materialization, semantic convergence, obligation carry,
  requirement fulfillment, ambiguity, capability, shallow realization, and fold
  evaluation
```

The heavy overlay can refine or challenge the light overlay, but it should not
erase it. If the heavy pass discovers that the light result was shallow,
ambiguous, under-specified, or missing lineage, that discovery is a new ledger
and event fact.

The refinement relation is:

```text
O_light(W) -> L_light, E, Ev_light
O_heavy(W, L_light, E) -> L_heavy, E, Ev_heavy
```

The second overlay consumes the first pass as admitted history. It does not
pretend the first pass never happened.

## Current Code Reading

The current TypeScript line already has a partial form of this model.

`constructExecutive()` composes multiple leaf graph functions into a named
executive graph function. The module currently publishes:

```text
bootstrap_release_self_test
release_operational_cycle
```

Those are close to overlays, but they are still encoded as executive graph
functions in the canonical module rather than declared overlay profiles.

The public query surface currently exposes a hardcoded public target set:

```text
Fg_conform_project
Fg_conform_project_authority
bootstrap_release_self_test
release_operational_cycle
```

That means the immediate implementation path is straightforward: add another
executive graph function for a light pass. The stronger implementation path is
to make overlays first-class and let public start targets derive from the active
overlay catalog.

## Design Consequences

The overlay model gives the system a clean way to support multiple traversal
depths without multiplying workspaces or truth surfaces.

It also clarifies why every F_P callout that performs work needs a ledger. The
ledger is not optional bookkeeping. It is the durable attention surface for the
work performed under a specific overlay. Without it, a later overlay cannot
lawfully refine, accept, reject, or route the prior pass.

The evaluator is also F_P work over the ledger. That means an eval result must
not float outside the same consistency relation. It has its own basis,
observation target, admitted output, event anchor, and replay-visible
predecessor chain.

In short:

```text
F_P work over W requires L.
Ev work over L/E also requires L/E admission.
Overlay identity must be carried through both.
```

## Method Implication

This should become a strong ODD axiom after review:

> A traversal graph is a governed overlay over a mutable workspace. It does not
> replace the workspace, ledger, event log, or evaluator. It selects the lawful
> graph-function pass over the workspace and defines the ledger/eval obligations
> needed for that pass to become replay-visible system truth.

That axiom gives constitutional clarity to the W/L/E/Ev relationship:

```text
W <-> L is the governed work pair.
E anchors the immutable predecessor chain.
Ev evaluates admitted ledger/event snapshots.
O selects the lawful graph-function pass over W.
```

It also connects the ledger mechanism to attention. A ledger is governed
attention over construction history. Lineage is the attention graph that decides
which admitted work an evaluator may lawfully see, which predecessor facts must
be carried, and which ambient workspace facts must be ignored.

## Implementation Direction

There are two practical stages.

### Stage 1: Named Lightweight Executive

Add a new light executive graph function inside the existing canonical module.
This proves the idea without changing the runtime contract.

Candidate work:

- add a light catalog slice for hello-world or declared product materialization;
- compose it with `constructExecutive()`;
- publish it through the graph-function catalog;
- expose it as a public start target;
- require ledger emission for each work-performing edge;
- add tests proving the light executive does not invoke the heavy planning
  sequence.

This is the low-risk bridge from today's implementation to traversal overlays.

### Stage 2: First-Class Traversal Overlay Catalog

Add a declared overlay catalog above graph functions.

Candidate work:

- define `SdlcTraversalOverlay`;
- stamp `overlayRef` into execution contracts, ledgers, events, evals, and next
  action projections;
- derive public start targets from overlay policy rather than hardcoded names;
- make replay reject execution records whose overlay identity or predecessor
  chain does not match the selected overlay;
- allow one overlay to refine another through `refinesOverlayRef`;
- keep ABG event truth as the substrate authority.

This is the real product move. It turns graph selection into a lawful guided
pass over workspace reality rather than a CLI convenience.

## Acceptance Shape

A cold session should be able to prove the following:

1. The same workspace can be observed through a light overlay and a heavy
   overlay without creating two truth surfaces.
2. The light overlay emits ledgers for every F_P edge that performs work.
3. The heavy overlay can consume the light overlay's admitted ledgers/events as
   prior history.
4. A heavy overlay finding can refine or reject a light overlay finding through
   new ledger/event facts, not by deleting the old pass.
5. Replay can distinguish overlay identity, graph function identity, ledger
   identity, event identity, and eval identity.
6. Public start target selection is governed by overlay policy.
7. Ambient workspace state is never enough for closure without admitted ledger
   and event truth.

## Strategic Summary

`odd_sdlc` should support multiple traversal depths by treating graph programs
as overlays over `W`.

The immediate code can add a light executive graph. The stronger design should
promote traversal overlays to first-class carriers that bind graph functions,
workspace observation policy, required ledgers, eval policy, and refinement
rules.

This preserves one workspace, one event spine, and one ledger/eval consistency
relation while allowing multiple guided passes over the same construction state.
