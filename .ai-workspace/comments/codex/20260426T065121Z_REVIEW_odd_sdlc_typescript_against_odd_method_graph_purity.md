# Review: odd_sdlc.TypeScript Against ODD Method Graph Purity

**Author**: Codex
**Date**: 2026-04-26T06:51:21Z
**Scope**: `odd_sdlc/build_tenants/typescript`
**Method Basis**: `/Users/jim/src/apps/specification_methodology/specification/standards/ODD_METHOD.md`
**Local Authority**: `specification/INTENT.md`, `specification/PRODUCT.md`, `specification/GOALS.md`, `build_tenants/typescript/design/ODD_SDLC_TYPESCRIPT_TENANT_DERIVATION.md`

## Executive Verdict

`odd_sdlc.TS` is a real bounded ODD-shaped tenant. It has typed assets,
published graph functions, a GTL module, ABG handoff, read-model projections,
closure surfaces, and a strict proof lane.

It is not yet a fully ODD-native SDLC framework in the stronger sense now
implied by `ODD_METHOD.md` outcome-first law.

The current line declares graph functions as program truth, but a large amount
of operative framework behavior still lives in custom TypeScript admission,
projection, evaluator, closure, and policy code. This is lawful for the current
bounded RC claim, but it is not the final target if SDLC itself is meant to be
built primarily out of reusable graph-function programs.

The strongest claim supported now is:

```text
ODD-shaped bounded TypeScript package
with graph-function publication and ABG handoff,
plus custom TypeScript carriers/projections/evaluators around that carrier.
```

The stronger target claim is not yet supported:

```text
ODD-native SDLC program library
where framework behavior is mostly expressed as reusable graph functions
and TypeScript is only typed carriers, adapters, and deterministic proof.
```

## ODD Method Scorecard

Pass:

- typed assets and carrier families are explicit
- graph-function catalog is machine-readable
- GTL module publishes 33 leaf graph functions and 2 executive graph functions
- public start is one bounded handoff and does not own a continuation loop
- ABG owns next-vector/transition projection
- query projection now fails closed on structural drift
- requirement closure no longer accepts trace shells or split proof/contract
- operational command/result/projection surfaces remain separate

Partial:

- graph functions are primary publication truth, but not yet primary
  implementation truth for much framework behavior
- executive graph functions compose declared leaf functions, but the
  compositions are linear and product-specific
- hooks describe `F_D -> F_P -> F_D` traversal contracts, but the evaluator and
  work-report machinery is custom TypeScript
- triage is published as graph functions, but route selection is still
  imperative TypeScript policy logic
- workspace ingress derives typed source assets, but it is not yet itself a
  graph-function-executed bootstrap program

Weak:

- no reusable higher-order graph-function library exists yet for common SDLC
  patterns such as `typed_input -> typed_output`, closure, route binding,
  source-ingress, command/result admission, or projection coherence
- no generic graph-function composition primitive is exposed as an SDLC product
  surface; composition exists inside `graph/module.ts`
- the largest behavioral modules are still bespoke TypeScript code rather than
  reusable graph-function declarations plus small adapters

## Size And Shape

Production TypeScript:

```text
5,241 LOC across 33 source files
```

Tests:

```text
2,668 LOC across 15 semantic/reference test files
54 semantic tests passing in the current lane
```

Production LOC by module:

```text
1,033 hooks
  886 projection
  883 domain
  653 graph
  396 workspace
  392 triage
  293 start
  220 runtime
  186 operational
  144 qualification
  106 shared
   49 root index
```

The line count tells the real story. The GTL/publication surface is meaningful
but not dominant. The biggest areas are custom hook/evaluator and projection
logic.

Imperative/control-flow signals in `code/src`:

```text
if:       108
for:       15
while:      0
switch:     0
throw:     30

map:       61
filter:    13
flatMap:    9
reduce:     0

Object.freeze: 223
```

This is not imperative in the Python-service sense. The code is mostly
functional/immutable TypeScript with guard clauses. But it is still custom
deterministic framework logic, not graph-function-realized behavior.

## Graph Function Purity

Current graph publication:

```text
catalog functions:          33
catalog executives:          2
module graph functions:     35
leaf graph functions:       33
executive graph functions:   2
materialized vectors:       60
module jobs:                 2
operators:                   1
```

Strength:

- `graph/catalog.ts` is a clean declarative catalog of named SDLC functions.
- `graph/module.ts` converts that catalog into ABG/GTL graph functions through
  reusable construction helpers.
- The module has two public executive carriers:
  `bootstrap_release_self_test` and `release_operational_cycle`.
- The public jobs target published graph functions and are checked.

Limit:

- Most leaf graph functions are single-edge declarations over symbolic asset
  nodes.
- The executives are concatenated workflows over catalog entries, not yet
  reusable algebraic SDLC programs.
- There is no graph-function library for generic traversal forms such as:

```text
single_hop_typed_traversal(A, B, T, E)
ingress_to_project(unstructured | structured -> Project)
admit_command_result(command, result)
close_requirement(lineage, proof, contract)
bind_gap_route(observation, classification)
project_query_from_module(module, catalog)
```

The current graph functions name the product workflow. They do not yet replace
the framework's local deterministic machinery.

## Custom Code Concentration

### 1. `hooks/hook_set.ts`

This is the largest file at 1,032 LOC.

It owns:

- hook contract catalog construction
- target-asset to edge-class mapping
- default operation selection
- asset/evidence/ambiguity/generated-asset admissions
- preflight `F_D`
- work-report construction
- postflight `F_D`
- minimal test invocation construction

Assessment:

This is useful and strict, but it is too much authority in one custom TypeScript
module. It is the main place where the TS tenant still feels like a framework
implemented around ODD, rather than an ODD framework implemented through graph
functions.

Refactor pressure:

- split carriers/admission/evaluator/catalog/report helpers
- move target-asset classification into declarative catalog data
- make `F_D`, `F_P`, `F_H` bindings first-class traversal declarations
- treat `constructSdlcHookContractCatalog` as a graph-function-derived or
  catalog-derived surface, not hand-rolled policy

### 2. `projection/query_domain.ts`

This is 464 LOC and now performs important structural drift rejection.

Assessment:

This file is currently justified. Projection-source coherence is ODD law, and
this code protects against stale read models. The weakness is that this should
probably become a reusable ABG/GTL projection-coherence proof surface, because
every ODD tenant will need it.

Refactor pressure:

- extract module/catalog structural comparison into reusable substrate or ODD
  library function
- preserve fail-closed behavior
- keep product-owned asset/query interpretation local

### 3. `projection/requirement_closure.ts`

This is 420 LOC and now has the right evidence-binding law.

Assessment:

The closure semantics are product-domain law, so custom code is lawful. The
current implementation is mostly projection over admitted lineage/work reports.
The risk is that closure is becoming a bespoke deterministic engine rather than
a reusable graph-function closure pattern.

Refactor pressure:

- extract common closure algebra:

```text
lineage entry + proof + contract -> closure state
closure states -> repair frontier
```

- keep SDLC-specific proof kinds and open reasons local

### 4. `triage/triage.ts`

This is 242 LOC.

Assessment:

The file separates observation, classification, route binding, repricing
proposal, ticket route, and loopback retirement. That is good governance.

The weak point is that route and target selection are still `if`-based policy:

```text
classification -> route kind -> target graph function
```

That should be data or graph-function policy, not custom control logic, if this
is going to become reusable ODD SDLC infrastructure.

### 5. `start/public_start.ts`

This is 292 LOC.

Assessment:

This module is mostly a bounded adapter. It does not loop, does not choose
internal ABG continuation, and calls ABG transition derivation once. That is
good.

The custom part is target resolution:

```text
next | graph_function | asset -> target graph function
```

That is probably acceptable at the public adapter boundary, but it should
continue moving toward declared start-target catalog truth rather than local
logic.

### 6. `operational/operational.ts`

This is 138 LOC.

Assessment:

This is small and mostly lawful command/result adapter code. The recent command
identity and lane binding fix moved it closer to ODD method. Some lane-to-
substrate mapping is still encoded imperatively and can become declarative
catalog data.

## Imperative Versus Declarative Versus Outcome

Outcome layer:

- Present, but thin.
- The product declares outcomes through graph-function names and output asset
  types.
- Current outcomes are mostly symbolic asset surfaces rather than generated
  assets produced by ABG-run SDLC programs.

Declarative layer:

- Stronger than Python.
- Function catalog, graph module, typed carriers, frozen catalogs, and RC
  report are concrete declarative surfaces.
- The graph catalog is the best current evidence that the tenant is moving in
  the right direction.

Imperative/custom deterministic layer:

- Still large.
- Most semantic enforcement is TypeScript guard/projection/evaluator logic.
- This is not inherently wrong. ODD needs deterministic `F_D` proof.
- The issue is authority placement: some policy and workflow semantics that
  should become declared graph/policy/catalog truth are still code branches.

Current ratio by judgment:

```text
declarative carrier/catalog/module surfaces:       moderate
deterministic proof/projection/admission code:     high
imperative workflow/control ownership:             low to moderate
graph-function-realized reusable framework logic:  low
```

This is a good intermediate tenant. It is not the final form of an ODD-native
SDLC application framework.

## Comparison To Python Direction

The TypeScript tenant is materially better than the Python line on authority
shape:

- no hidden continuation loop
- stricter typed carriers
- stronger projection-source coherence
- more explicit GTL publication
- cleaner command/result/projection separation
- fewer ambient service concepts
- better evidence binding in requirement closure

But the TS tenant still risks rebuilding a cleaner framework around ODD rather
than building the framework with ODD.

The Python problem was not only "too imperative." The deeper problem was that
Python discovered needed behavior while hiding the constructive carrier in
services, loops, and local operational state.

The TS line has removed much of the hidden runtime risk. It has not yet removed
enough custom framework machinery.

## Reusable Graph Function Opportunities

The next design wave should look for common graph-function libraries before
adding more TS modules.

Candidate reusable graph functions:

```text
Fg_single_typed_traversal
  inputs: source asset, target asset declaration, transform contract, eval contract
  output: generated target asset + work report

Fg_ingress_project
  inputs: unstructured/structured input set
  output: typed Project asset with imported authority and lineage

Fg_close_requirement
  inputs: requirement inventory, lineage ledger, proof claims, generated-asset contracts
  output: requirement closure register + repair frontier

Fg_project_module_query
  inputs: admitted GTL module, function catalog
  output: query-domain projection or structural drift failure

Fg_bind_gap_route
  inputs: gap observation, classification, route policy
  output: public start target or explicit blocked route

Fg_admit_operational_return
  inputs: command, returned result, runtime facts
  output: operational projection + runtime return observation
```

These would move repeated framework behavior from custom TS logic into reusable
ODD programs. TypeScript would then mostly provide carrier schemas, adapters,
and deterministic evaluators.

## Findings

### High: Graph functions are published, but not yet the dominant implementation mechanism

`graph/catalog.ts` and `graph/module.ts` publish the program surface, but much
of the operative framework behavior still lives in `hooks/`, `projection/`,
`triage/`, and `start/`.

This is acceptable for the bounded RC claim. It is not enough for the stronger
claim that SDLC.TS is built primarily using the ODD unit of compute.

Recommendation:

Open a design ticket to define the first reusable ODD SDLC graph-function
library. Start with `Fg_single_typed_traversal` and `Fg_ingress_project`.

### High: `hooks/hook_set.ts` is a monolith and the clearest consolidation target

The hook set is doing too many jobs in one module.

Recommendation:

Split it into:

```text
hooks/carriers.ts
hooks/admission.ts
hooks/catalog.ts
hooks/evaluators.ts
hooks/work_report.ts
hooks/test_fixture.ts
```

Then reprice which parts should become declarative graph-function or policy
catalogs.

### Medium: Policy mappings are code branches where catalog data would be better

Examples:

- target asset -> edge class
- target asset -> default operation
- triage classification -> route kind
- route kind -> target graph function
- operational lane -> substrate binding
- start target -> backing graph function

Recommendation:

Move these into declared catalog/policy surfaces and keep TypeScript functions
as validators/projectors over those surfaces.

### Medium: Projection coherence is correct but should be generalized

`query_domain.ts` now enforces structural module/catalog truth. This is the
right behavior, but it is likely reusable ODD infrastructure.

Recommendation:

Promote module/catalog structural signature comparison into a shared ABG/ODD
projection proof primitive once one more tenant needs it.

### Medium: Current graph composition is linear, not algebraic enough

The two executives are useful, but they are assembled by concatenating
materialized vectors from leaf functions. They do not yet expose algebraic
composition concepts such as typed single-hop traversal, reusable carried
environment, partial closure, fork/join, or higher-order graph functions.

Recommendation:

Use the upcoming one-hop/minimum-typed traversal scenarios as design probes for
the reusable composition layer.

## Bottom Line

`odd_sdlc.TS` is a strong corrective move away from Python's imperative
service shape.

It is not yet the clean ODD-native SDLC product you are trying to prove.

The next quality step is not to add more TypeScript behavior. The next quality
step is to reduce TypeScript's role:

```text
TypeScript should own:
  typed carriers
  closed admission
  deterministic proof
  adapter boundaries
  projection rendering

GTL/ABG graph functions should own:
  outcome movement
  framework workflow programs
  reusable traversal forms
  composition
  lawful start/route/closure structure
```

Current status:

```text
ODD-shaped bounded RC: yes
ODD-native reusable SDLC graph-program framework: partial
Python-like shadow runtime risk: mostly removed
custom framework code weight: still high
next focus: reusable graph-function library plus hook/projection consolidation
```
