# odd_sdlc.python vs TypeScript Substrate

## Claim

`odd_sdlc.python` is the current operational SDLC implementation.

The TypeScript line is not yet `odd_sdlc.ts`. It is the Abiogenesis TypeScript
substrate proving that SDLC can be rebuilt around typed graph functions,
explicit ingress carriers, ABG traversal truth, and semantic derivation
ledgers.

The difference is not language preference. The difference is product shape:

```text
Python:
  operational SDLC app with accumulated workflow behavior

TypeScript:
  governed ABG/GTL substrate proving the smaller algebraic shape needed for a
  future SDLC.TS
```

## Python Implementation

Python currently owns the working SDLC behavior.

It can install into a project workspace, normalize imported authority, publish
bootstrap read models, create generated specification/design/code/test
surfaces, route through public start/gap commands, maintain runtime registers,
and preserve evidence from real runs.

The important Python ingest path is `normalize_workspace(...)`.

That path:

- creates missing `.ai-workspace/runtime` and `.ai-workspace/context` roots
- creates default `PRODUCT.md` and `GOALS.md` when an imported workspace lacks
  canonical surfaces
- creates `specification/requirements/00-imported-sources.md`
- creates `.ai-workspace/context/project_bootstrap.md`
- normalizes `project_constraints.yml`
- migrates or removes stale tenant scaffolds
- normalizes `build_tenants/TENANT_REGISTRY.md`
- refreshes analysis, workspace state, and runtime manifests
- writes `.ai-workspace/runtime/odd_sdlc-workspace-normalization.json`

That is valuable. It represents lessons from real operational pressure,
especially the `data_mapper.testXX` sequence.

The weakness is structural. Python has ODD ideas inside it, but the product is
still organized around a large amount of imperative framework behavior:

```text
normalization.py
constructor.py
gap_dossier.py
project_profile.py
public_start.py
operational_dispatch.py
triage.py
runtime registers
installer scaffolding
```

The graph-function idea exists, but many SDLC transitions are still realized as
service methods that inspect files, write files, assemble read models, and
decide next steps. This makes Python useful as the discovery implementation,
but hard to reason about as a clean ODD-native program model.

## TypeScript Substrate

TypeScript currently proves lower substrate truths.

The active TS proof line is in the Abiogenesis TypeScript tenant, not in an
SDLC.TS tenant. It proves:

- generic graph-function traversal inspection
- minimum typed traversal semantics
- deterministic traversal probing
- `GF_BOOTSTRAP_PROJECT`
- `SdlcBootstrapInputSet -> SdlcProject`
- `SdlcDerivationLedger`
- real data-mapper ingress through T-064

The key TypeScript shape is:

```text
real ingress facts
  -> SdlcBootstrapInputSet
  -> GF_BOOTSTRAP_PROJECT
  -> SdlcProject
  -> SdlcDerivationLedger
```

The TS line is stricter because the semantic boundary is typed before it runs.
Weak imported material is admitted once into a governed carrier. After that,
derivation consumes the carrier, not ambient workspace state.

T-064 proves this against the real data-mapper fixture:

```text
data_mapper.template
data_mapper.test41
data_mapper.test42
data_mapper.test43
```

The proof reads the Python-generated normalization evidence, but does not copy
Python's installer. It admits real file URIs and SHA-256 digests into
`SdlcBootstrapInputSet`, derives CDME project identity, traces normalized
`REQ-LDM-001` to its real source file, and keeps runtime/context evidence as
ambiguity when it is not semantic authority.

Observed proof:

```text
npm run test:t064
tests 3
pass 3
fail 0
duration_ms 67.277917
```

## Main Difference

Python starts from the workspace and makes it operable.

TypeScript starts from the graph-function contract and makes the computation
inspectable.

In current terms:

```text
Python:
  workspace-first
  operationally complete
  file-mutating
  broad app behavior
  real installer and runtime command surface
  rich evidence from live dogfood runs

TypeScript:
  carrier-first
  substrate-complete only for proved slices
  non-mutating in the SDLC proof
  graph-function centered
  strict ABG/GTL/SDLC authority split
  stronger local reasoning and refactoring posture
```

## Authority Split

The Python implementation often blends three concerns because it has to get
real work done:

```text
workspace normalization
SDLC domain interpretation
runtime/workflow progression
```

TypeScript is separating those concerns:

```text
GTL owns:
  graph functions, typed nodes, vectors, operator/evaluator declarations

ABG owns:
  execution basis, traversal, events, frames, continuations, replay, probes

SDLC owns:
  project meaning, authority interpretation, gap/triage semantics, lineage
```

This split matters because SDLC.TS should not be another imperative shell
around ABG. It should be an ODD-native app whose programs are graph functions.

## Lineage Difference

Python has substantial event, manifest, ledger, and runtime visibility work.
It can publish evidence that a run created or changed surfaces.

The TypeScript proof narrows the lineage claim:

```text
Which source input produced this project element?
Why does this derived element exist?
Which ABG traversal/provenance facts produced the movement?
```

That is a more algebraic shape. The lineage is not only a run report or a
workspace audit artifact. It is carried inside the typed result:

```text
SdlcProject
  -> SdlcDerivationLedger
      -> asset lineage
      -> element lineage
      -> runtime provenance refs
```

This is the better direction for global reasoning. It lets later SDLC programs
compose over derivation facts rather than rediscovering them from workspace
files and accumulated registers.

## What Python Still Has That TypeScript Does Not

TypeScript does not yet replace Python.

Missing SDLC.TS app behavior includes:

- installer
- workspace normalization
- public `gaps` command
- public `start` command
- full Gap/Triage/Create Ticket loop
- SDLC domain graph-function catalog
- F_P worker attachment for SDLC work
- generated specification/design/code/test surface constructors
- live data-mapper generation
- release/deployment/runtime-return surfaces
- persistence of SDLC workspace read models

The current TypeScript line proves that these can be rebuilt on a cleaner
substrate. It does not yet implement them.

## What TypeScript Already Gives That Python Does Not

TypeScript already gives stronger structure for the future rebuild:

- smaller prime carrier sets
- stricter ingress admission
- explicit graph-function contracts
- direct compile-time pressure on boundary drift
- deterministic traversal probes over ABG truth
- clearer separation between runtime provenance and SDLC semantics
- test lanes derived from design/module surfaces
- lower tolerance for ad hoc orchestration helpers becoming hidden authority

This is the reason to move the future SDLC line toward TS. The benefit is not
that TS can do everything Python currently does. The benefit is that TS makes
the lawful shape harder to blur once SDLC behavior is rebuilt.

## Code Comparison

These counts are mechanical line counts over current workspace files. They are
useful as a shape signal, not as a quality score.

Scope:

```text
Python implementation:
  odd_sdlc/build_tenants/python/code/odd_sdlc/**/*.py

Python tests:
  odd_sdlc/build_tenants/python/test_env/tests/**/*.py

TypeScript substrate implementation:
  abiogenesis/build_tenants/abiogenesis/typescript/code/src/**/*.ts

TypeScript substrate tests:
  abiogenesis/build_tenants/abiogenesis/typescript/test_env/**/*.{mjs,ts}

TypeScript SDLC proof slice:
  abiogenesis/build_tenants/abiogenesis/typescript/code/src/qualification/m05/sdlc_bootstrap_lineage*.ts
  abiogenesis/build_tenants/abiogenesis/typescript/test_env/**/test_m05_sdlc_bootstrap_lineage_unit.test.mjs
  abiogenesis/build_tenants/abiogenesis/typescript/test_env/**/test_m05_data_mapper_real_ingress.test.mjs
```

Raw line counts:

```text
Python implementation:
  files: 53
  total lines: 29,448
  blank lines: 2,577
  comment lines: 134
  code-ish lines: 26,737

Python tests:
  files: 19
  total lines: 16,406
  blank lines: 1,610
  comment lines: 55
  code-ish lines: 14,741

TypeScript substrate implementation:
  files: 133
  total lines: 19,289
  blank lines: 1,417
  comment lines: 147
  code-ish lines: 17,725

TypeScript substrate tests:
  files: 89
  total lines: 16,209
  blank lines: 1,157
  comment lines: 192
  code-ish lines: 14,860

TypeScript SDLC bootstrap-lineage implementation slice:
  files: 3
  total lines: 771
  blank lines: 56
  comment lines: 0
  code-ish lines: 715

TypeScript SDLC bootstrap-lineage tests:
  files: 2
  total lines: 673
  blank lines: 51
  comment lines: 8
  code-ish lines: 614

TypeScript SDLC bootstrap-lineage design surfaces:
  files: 4
  total lines: 432
  blank lines: 100
  text lines: 332
```

Immediate read:

```text
Python operational SDLC source is larger than the whole current TypeScript
Abiogenesis source tree:

  Python implementation code-ish lines: 26,737
  TypeScript substrate implementation code-ish lines: 17,725

The TypeScript SDLC-specific proof slice is much smaller:

  implementation code-ish lines: 715
  test code-ish lines: 614
  design text lines: 332
```

This is the expected shape. Python is a full operational SDLC app. TypeScript is
currently the substrate plus a small SDLC proof.

## Concentration

Python has large workflow files:

```text
constructor.py: 3,094 lines
gtl_module.py: 2,231 lines
gap_dossier.py: 1,737 lines
project_profile.py: 1,590 lines
triage.py: 1,512 lines
normalization.py: 1,380 lines
requirement_closure.py: 1,360 lines
execution_contract.py: 1,338 lines
runtime_event_contract.py: 1,187 lines
workspace_assets.py: 1,071 lines
app.py: 1,034 lines
```

The top five Python files are about 10,164 lines, roughly 34.5% of the Python
implementation line count.

TypeScript is more distributed:

```text
cli/command.ts: 886 lines
gtl/m01/algebra/core.ts: 769 lines
abg/m03/contracts/carriers.ts: 629 lines
app/m04/live_status/admission.ts: 557 lines
gtl/m01/contracts/constructors.ts: 508 lines
gtl/m01/admission/carriers.ts: 493 lines
qualification/m05/sandbox_behavior_portfolio.ts: 457 lines
qualification/m05/sdlc_bootstrap_lineage.ts: 422 lines
app/m04/gaps/projection.ts: 409 lines
gtl/m02/contracts/constructors.ts: 387 lines
abg/m03/contracts/event_admission.ts: 385 lines
```

The top five TypeScript files are about 3,349 lines, roughly 17.4% of the
TypeScript implementation line count.

Read:

```text
Python has more central orchestration mass.
TypeScript has more distributed carrier/admission/projection mass.
```

That is a code-quality concern for Python. The largest Python files are not
only big; they own workflow movement, workspace mutation, construction,
interpretation, and evidence publication in the same broad implementation
surface.

## Imperative, Declarative, Outcome Shape

The following counts are heuristic regex counts. They are not semantic AST
classification. They are still useful because they show where each line is
leaning.

Heuristic definitions:

```text
Imperative:
  control-flow lines plus IO/mutation markers
  examples: if, for, try, return, raise/throw, write_text, mkdir, append, push

Declarative:
  carrier/type/catalog/function declaration markers
  examples: class, dataclass, interface, type, exported function declarations

Outcome:
  proof/evidence/report/manifest/requirement markers
  examples: REQ-, INT-, assert, expected, closure, evidence, report, manifest
```

Python implementation signals:

```text
function definitions: 921
class/dataclass markers: 203
control-flow line markers: 4,360
IO/mutation markers: 494
outcome/evidence markers: 1,574
```

TypeScript substrate implementation signals:

```text
interface/type declarations: 481
function declarations: 720
control-flow line markers: 1,807
IO/mutation markers: 388
outcome/evidence markers: 945
```

TypeScript SDLC bootstrap-lineage slice signals:

```text
interface/type declarations: 13
function declarations: 38
control-flow line markers: 83
IO/mutation markers: 13
outcome/evidence/lineage markers: 59
```

Normalized against implementation code-ish lines:

```text
Python implementation:
  control-flow markers per 1k code-ish lines: ~163
  IO/mutation markers per 1k code-ish lines: ~18
  outcome/evidence markers per 1k code-ish lines: ~59

TypeScript substrate implementation:
  control-flow markers per 1k code-ish lines: ~102
  IO/mutation markers per 1k code-ish lines: ~22
  outcome/evidence markers per 1k code-ish lines: ~53

TypeScript SDLC bootstrap-lineage slice:
  control-flow markers per 1k code-ish lines: ~116
  IO/mutation markers per 1k code-ish lines: ~18
  outcome/evidence/lineage markers per 1k code-ish lines: ~83
```

Interpretation:

```text
Python:
  more imperative control density
  more operational behavior in fewer files
  stronger evidence of workflow accumulation
  outcome surfaces exist, but are often produced by imperative construction

TypeScript substrate:
  lower control-flow density
  stronger carrier/type declaration pressure
  more distributed module surface
  still has imperative code, but it is more often admission/projection logic

TypeScript SDLC proof:
  tiny compared with Python
  high outcome/lineage density
  explicitly carrier-first
  not operationally complete
```

## Code Quality Read

Python quality:

```text
Strengths:
  working operational behavior
  broad real-world coverage
  mature normalization and runtime evidence paths
  proven against data_mapper dogfood runs
  rich practical knowledge embedded in code

Costs:
  large orchestration files
  workspace IO and semantic interpretation are close together
  graph-function intent is partially obscured by service-method behavior
  harder to isolate one lawful traversal
  harder to refactor without losing hidden coupling
  higher burden on after-the-fact audit
```

TypeScript quality:

```text
Strengths:
  smaller governed slices
  explicit carrier admission
  graph functions are inspectable
  ABG runtime truth is separate from SDLC semantic truth
  lineage is carried in typed result surfaces
  tests derive from design/module method surfaces
  better shape for refactoring and spec-driven change

Costs:
  not a full SDLC implementation yet
  current SDLC proof is narrow
  no operational installer/start/gap loop replacement yet
  some TypeScript substrate files are still large enough to watch
  app scaffolding decisions remain ahead
```

The code-quality conclusion is:

```text
Python is high-value but structurally expensive.
TypeScript is structurally cleaner but behaviorally incomplete.
```

The migration target should not be Python parity by file count or surface
count. The migration target should be behavioral parity through fewer, clearer,
typed graph-function programs.

## Outcome, Declarative, Imperative Order

The architectural rule is:

```text
If ODD introduces a new unit of compute, SDLC must use that unit of compute to
build SDLC itself.
```

The unit is not an application service method. The unit is an edge traversal
with eventual closure.

Therefore the SDLC implementation order should be:

```text
1. Outcome code
2. Declarative code
3. Minimal imperative code only where unavoidable
```

Outcome code means the SDLC program is expressed as governed target movement:

```text
BootstrapInputSet -> Project
ProjectState -> GapSet
Gap -> TriageDecision
TriageDecision -> Ticket
RequirementSurface -> DesignSurface
DesignSurface -> ModuleSurface
ModuleSurface -> ImplementationSurface
ImplementationSurface -> QualificationEvidence
```

The outcome layer declares:

```text
source asset type
target asset type
edge traversal name
closure/evaluation obligation
lineage obligation
ambiguity obligation
allowed F_D/F_P/F_H compute bindings
```

Declarative code then supplies the executable structure:

```text
GTL graph functions
typed nodes
vectors
operator bindings
evaluator bindings
carrier schemas
policy declarations
projection declarations
lineage ledger declarations
```

Imperative code is last and narrow:

```text
read files
write files
load manifests
persist events
invoke subprocesses
adapt CLI/API input
call ABG execution entrypoints
render projections
```

Imperative code must not own the SDLC semantics. It may transport facts into
carriers and persist results out of carriers, but it must not be the hidden
program.

This is the inversion Python does not fully achieve:

```text
Python current shape:
  imperative services produce SDLC outcomes
  ODD concepts are embedded inside service behavior

Target ODD-native shape:
  outcome graph functions define SDLC programs
  declarative GTL/ABG/SDLC carriers make them executable
  imperative adapters only move bytes and invoke the runtime
```

That is why a file-by-file Python port is the wrong target. The correct target
is to extract Python's learned outcomes and rebuild them as graph-function
programs first.

## Design Consequence

Python remains the reference for observed behavior and dogfood lessons.

TypeScript should not port Python file-by-file.

The better path is:

```text
1. Treat Python behavior as evidence.
2. Extract the lawful SDLC graph functions.
3. Define typed carriers and ledgers first.
4. Prove each traversal as GTL/ABG/SDLC authority split.
5. Rebuild only the minimum app scaffolding needed around those programs.
```

The next major SDLC.TS question is not "how do we port `normalization.py`?"

The better question is:

```text
What is the graph-function program that performs bootstrap conformance,
lineage capture, gap evaluation, triage, ticket creation, and iteration?
```

That program should then decide what app scaffolding is actually necessary.

## Current Bottom Line

Python is the operational implementation.

TypeScript is the cleaner substrate proof.

The target SDLC.TS should use Python as evidence, not as architecture. The
future line should be:

```text
SDLC.TS:
  SDLC domain graph functions
  over GTL carriers
  executed by ABG
  with domain IoC bindings
  producing typed assets and derivation ledgers
  exposed through minimal public app scaffolding
```

That is the point where SDLC stops being a large imperative framework around
ABG and becomes an ODD-native program family.
