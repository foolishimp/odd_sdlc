# ODD SDLC Domain Model

**Status**: Active
**Date**: 2026-04-30
**Purpose**: Publish the current `odd_sdlc` domain model and projection vocabulary for operator and UI consumers, especially `odd_manager`, without turning UI integration guidance into new constitutional law.
**Derives From**:
- `specification/INTENT.md`
- `specification/PRODUCT.md`
- `specification/requirements/02-graph-functions.md`
- `specification/requirements/07-asset-typing-and-binding.md`
- `specification/requirements/10-odd-sdlc-software-domain-buildout.md`
- `specification/scenarios/06-first-odd-sdlc-asset-function-call.md`
- `build_tenants/common/design/ODD_SDLC_TRANSLATION.md`
- `build_tenants/typescript/design/ODD_SDLC_TYPESCRIPT_TENANT_STRUCTURAL_CARRIER_DIAGRAM.md`
- `build_tenants/typescript/code/src/domain/software_domain_catalog.ts`
- `build_tenants/typescript/code/src/graph/catalog.ts`
- `build_tenants/typescript/code/src/graph/library.ts`
- `build_tenants/typescript/code/src/projection/query_domain.ts`
- `build_tenants/typescript/code/src/projection/requirement_closure.ts`
- `build_tenants/typescript/code/src/hooks/policy.ts`
- `build_tenants/typescript/code/src/operator/carriers.ts`
- `build_tenants/typescript/code/src/operational/carriers.ts`

## Purpose Boundary

This document explains the current `odd_sdlc` domain package as a UI-facing
model.

It is for:

- `odd_manager` domain UI-pack design
- query/projection consumers
- operator drill-down views
- lineage, closure, and gap explanations

It is not:

- a replacement for `specification/`
- a rival runtime model
- a tenant-local implementation note disguised as product law

`specification/` remains the governing `WHAT`. ABG remains runtime truth.
This document summarizes how the live TypeScript line currently publishes the
SDLC domain so a UI can consume it directly.

## Ownership Boundary

| Layer | Owner | UI meaning |
| --- | --- | --- |
| Intent, product, goals, requirements, scenarios | target project | constitutional domain truth |
| Asset families, asset types, graph-function catalog, work acts, gap/read models, operator carriers | `odd_sdlc` | domain overlay and SDLC semantics |
| Run, graph call, frame, continuation, runtime events, replay projections | ABG | runtime truth |
| Pages, badges, lenses, sort/group affordances | `odd_manager` | derived control-plane read model |

The manager should never let `odd_sdlc` redefine ABG runtime objects, and it
should never let UI-only summaries masquerade as source truth.

## Topology

```mermaid
flowchart LR
  Project[Project Authority\nspecification/*]
  Query[odd_sdlc Query Domain\nassetTypes assetFamilies functions programs]
  Start[Public Start Targets\nFg_conform_project bootstrap_release_self_test release_operational_cycle]
  ABG[ABG Runtime Truth\nRun GraphCall Frame Continuation Events]
  Worker[F_P Worker]
  Assets[Generated SDLC Assets]
  Ledgers[Closure and Lineage Ledgers\nrequirement closure lineage gap dossier]
  UI[odd_manager UI]

  Project --> Query
  Query --> Start
  Start --> ABG
  ABG --> Worker
  Worker --> Assets
  Assets --> Ledgers
  ABG --> Ledgers
  Query --> UI
  ABG --> UI
  Ledgers --> UI
```

## Visual Index

This document uses diagrams for four different concerns:

1. ownership and package boundary
2. domain object model
3. graph-function catalog and executive programs
4. installed operator and closure process flow

## Ownership And Package Boundary

```mermaid
flowchart TB
  Project[Target Project]
  Spec[specification/*]
  Domain[odd_sdlc Domain Package]
  Query[query-domain read model]
  Operator[installed operator]
  Runtime[ABG runtime]
  Manager[odd_manager]
  UILens[UI lenses and pages]

  Project --> Spec
  Spec --> Domain
  Domain --> Query
  Domain --> Operator
  Operator --> Runtime
  Runtime --> Operator
  Query --> Manager
  Runtime --> Manager
  Manager --> UILens
```

```mermaid
flowchart LR
  subgraph Constitutional["Project constitutional truth"]
    I[INTENT]
    P[PRODUCT]
    G[GOALS]
    R[requirements/*]
    S[scenarios/*]
  end

  subgraph DomainPack["odd_sdlc domain truth"]
    AF[asset families]
    AT[asset types]
    GF[graph-function catalog]
    GD[gap and closure projections]
    OP[operator carriers]
  end

  subgraph RuntimePack["ABG runtime truth"]
    Run[Run]
    GC[GraphCall]
    Fr[Frame]
    Ct[Continuation]
    Ev[RuntimeEvent]
  end

  subgraph ControlPlane["odd_manager read models"]
    Pg[pages]
    Ln[lenses]
    Bd[badges]
    Qs[queues]
  end

  Constitutional --> DomainPack
  DomainPack --> ControlPlane
  RuntimePack --> ControlPlane
```

## Primary Published Contracts

These are the main machine-readable surfaces a UI should treat as first-class.

| Surface | Contract | Purpose |
| --- | --- | --- |
| query-domain | `odd_sdlc.query-domain` `ts-v1` | publish the domain catalog and start-addressable SDLC model |
| gap projection | `sdlc_gap_projection` | current graph-level progress and next edge |
| gap dossier | `sdlc_gap_dossier` | current actionable gap with evidence and next lawful actions |
| requirement closure | `sdlc_requirement_closure_register` | requirement fulfillment, carry, traceability, and open reasons |
| lineage ledger | `sdlc_lineage_ledger` | requirement-to-generated-asset linkage |
| operator outcome | `sdlc_installed_operator_start_outcome` | one `start` hop outcome with handoff, worker, postflight, and archive refs |
| runtime return | `sdlc_runtime_return_observation` | operational evidence returned into the worksite |

## Core Objects

## Domain Object Model

```mermaid
classDiagram
  class DomainContract
  class AssetFamily
  class AssetType
  class WorkActType
  class Function
  class Program
  class StartTarget
  class AssetOwnership
  class GapProjection
  class GapDossier
  class RequirementClosureRegister
  class RequirementClosureEntry
  class LineageLedger
  class LineageEntry
  class OperatorSummary
  class OperatorOutcome
  class WorkerHandoffManifest
  class WorkerResultReport
  class Run
  class GraphCall
  class Frame
  class Continuation

  DomainContract --> Program
  DomainContract --> Function
  AssetFamily --> AssetType
  Function --> AssetType : produces/consumes
  Program --> Function : orders
  StartTarget --> Program : invokes
  AssetOwnership --> Function : producerGraphFunctions
  GapProjection --> Function : currentEdge
  GapDossier --> Function : edge
  RequirementClosureRegister --> RequirementClosureEntry
  LineageLedger --> LineageEntry
  OperatorOutcome --> OperatorSummary
  OperatorOutcome --> WorkerHandoffManifest
  OperatorOutcome --> WorkerResultReport
  OperatorOutcome --> GapDossier
  OperatorOutcome --> Run
  Run --> GraphCall
  GraphCall --> Frame
  GraphCall --> Continuation
```

### Domain Overlay Objects

| Object | Meaning |
| --- | --- |
| `AssetFamily` | lifecycle grouping over related asset types |
| `AssetType` | typed semantic role of an SDLC artifact |
| `WorkActType` | governed mutation/qualification act such as `generate` or `deploy` |
| `Function` | one named SDLC transformation with typed inputs/outputs |
| `Program` | one executive graph-function chain exposed as a job/start target |
| `StartTarget` | top-level graph function the operator or manager may start |
| `AssetOwnership` | mapping from asset type to producing graph functions |
| `GapProjection` | compact current graph progress summary |
| `GapDossier` | current open gap and next lawful actions |
| `RequirementClosureEntry` | one requirement's carry, fulfillment, traceability, and evidence state |
| `LineageEntry` | one generated asset's upstream requirement linkage |
| `OperatorSummary` | one hop-level outcome summary for the installed operator |

### ABG Runtime Objects

The UI should consume these from ABG, not from `odd_sdlc` reinterpretation:

- `Run`
- `GraphCall`
- `Frame`
- `Continuation`
- `RuntimeEvent`

## Domain Query Projection Shape

The current `SdlcQueryDomainProjection` publishes:

- `assetTypes`
- `assetFamilies`
- `workActTypes`
- `libraryFunctions`
- `functions`
- `programs`
- `graphFunctions`
- `startTargets`
- `assetOwnership`
- `currentDossierRefs`
- `projectConformance`

This is the main UI bootstrap payload for the domain pack.

## Naming Rule

The current `odd_sdlc` line uses several adjacent but different namespaces.

| Namespace | Examples | Owner | UI rule |
| --- | --- | --- | --- |
| asset families | `implementation_branch`, `governance_loop` | `odd_sdlc` domain catalog | use for grouping and navigation |
| asset types | `implementation_module_surface`, `runtime_observation_surface` | `odd_sdlc` domain catalog | use for artifact semantics |
| graph node / function IO names | `intent_surface`, `product_surface`, `gap_observation_surface` | GTL graph publication | use for graph rendering and edge inspection |
| read-model carriers | `sdlc_gap_dossier`, `sdlc_requirement_closure_register` | `odd_sdlc` projection layer | use for overlays and operator explanations |
| runtime aggregates | `Run`, `GraphCall`, `Frame`, `Continuation` | ABG | use for execution truth |

Do not flatten these into one enum.

In the current line, many names align, but not all. For example:

- the asset-type registry currently includes `intent_doc` and `product_doc`
- the bootstrap graph publishes `intent_surface` and `product_surface`

The UI should preserve both when they are distinct:

- asset types answer "what semantic artifact is this?"
- graph node names answer "what node does this edge bind or produce?"

## Asset Families

The current TypeScript line publishes these asset families.

| Family | Lifecycle Role | Asset Types |
| --- | --- | --- |
| `worksite_inputs` | `entry` | `intent_doc`, `product_doc`, `goal_surface`, `requirement_surface`, `work_request_surface` |
| `solution_design` | `design` | `feature_decomp_surface`, `design_surface`, `scenario_surface` |
| `implementation_branch` | `build` | `implementation_design_surface`, `implementation_stack_profile`, `implementation_module_surface`, `realization_schedule_surface`, `code_surface` |
| `qualification_branch` | `qualification` | `uat_testcases_surface`, `test_design_surface`, `test_stack_profile`, `test_module_surface`, `test_schedule_surface`, `test_run_archive_surface`, `testcase_authority_surface` |
| `release_readiness` | `release` | `release_surface`, `release_document_surface` |
| `deployment_records` | `deployment` | `deployment_record_surface`, `deployment_surface`, `deployment_result_surface`, `deployed_environment_surface` |
| `runtime_evidence` | `operation` | `runtime_observation_surface`, `operational_evidence_surface`, `build_execution_surface`, `build_execution_result_surface`, `test_execution_surface`, `test_execution_result_surface` |
| `retrofit_plans` | `retrofit` | `maintenance_plan_surface`, `retrofit_design_surface`, `retrofit_plan_surface` |
| `governance_loop` | `operation` | `gap_observation_surface`, `gap_triage_surface`, `gap_route_surface`, `repricing_proposal_surface`, `ticket_work_item_route_surface`, `gap_retirement_surface` |

## Work Act Types

These are the current domain work acts:

- `generate`
- `adopt`
- `import`
- `qualify`
- `release`
- `deploy`
- `observe`
- `retrofit`

The UI should treat these as domain acts, not as raw button labels. One graph
edge may declare a default operation through target policy.

## Start Targets And Executive Programs

The current installed product exposes three top-level graph carriers:

| Start Target | Kind | Purpose | Outputs |
| --- | --- | --- | --- |
| `Fg_conform_project` | reusable graph function / induction target | normalize and classify an imported or stale workspace into the current `odd_sdlc` operating shape | `conform_project_profile`, `selected_tenant_surface`, `module_inventory_surface`, `capability_contract_surface`, `execution_contract_surface`, `conformance_gap_set` |
| `bootstrap_release_self_test` | executive program | run the retained bootstrap-to-release proving chain | `release_surface` |
| `release_operational_cycle` | executive program | continue from release into execution, deployment, runtime return, and retrofit planning | `retrofit_plan_surface` |

`Fg_conform_project` is only offered as a start target while project conformance
is still blocked. Once conformance passes, UI start controls should pivot to the
executive programs.

## Graph-Function Catalog Overview

```mermaid
flowchart TB
  subgraph StartTargets["Start targets"]
    C[Fg_conform_project]
    B[bootstrap_release_self_test]
    O[release_operational_cycle]
  end

  subgraph Reusable["Reusable library graph functions"]
    L1[Fg_single_typed_traversal]
    L2[Fg_ingress_project]
    L3[Fg_conform_project]
    L4[Fg_materialization_assurance_ledger]
    L5[Fg_semantic_convergence_assurance_ledger]
    L6[Fg_obligation_carry_assurance_ledger]
    L7[Fg_requirement_fulfillment_assurance_ledger]
    L8[Fg_ambiguity_assurance_ledger]
    L9[Fg_capability_assurance_ledger]
    L10[Fg_shallow_realization_assurance_ledger]
    L11[Fg_traversal_assurance_fold]
  end

  subgraph Bootstrap["bootstrap_release_self_test"]
    B1[derive_intent_surface]
    B2[derive_product_surface]
    B3[derive_goal_surface]
    B4[derive_requirement_surface]
    B5[derive_feature_decomp_surface]
    B6[derive_uat_testcases_surface]
    B7[derive_design_surface]
    B8[derive_scenario_surface]
    B9[derive_implementation_design_surface]
    B10[select_implementation_stack_profile]
    B11[derive_implementation_module_surface]
    B12[derive_realization_schedule_surface]
    B13[derive_code_surface]
    B14[derive_test_design_surface]
    B15[select_test_stack_profile]
    B16[derive_test_module_surface]
    B17[derive_test_schedule_surface]
    B18[derive_test_run_archive_surface]
    B19[qualify_testcase_authority]
    B20[prepare_release_surface]
  end

  subgraph Operational["release_operational_cycle"]
    O1[prepare_build_execution_surface]
    O2[derive_build_execution_result_surface]
    O3[prepare_test_execution_surface]
    O4[derive_test_execution_result_surface]
    O5[prepare_deployment_surface]
    O6[derive_deployment_result_surface]
    O7[derive_deployed_environment_surface]
    O8[derive_runtime_observation_surface]
    O9[derive_retrofit_plan_surface]
  end

  subgraph Governance["governance loop"]
    G1[observe_gap_pressure]
    G2[classify_gap_triage]
    G3[bind_gap_route]
    G4[propose_constitutional_repricing]
    G5[route_ticket_work_item]
    G6[retire_gap_after_loopback]
  end

  C --> B
  B --> O
  O --> G1
```

## Reusable Graph Functions

The current library layer includes these reusable GTL carriers:

- `Fg_single_typed_traversal`
- `Fg_ingress_project`
- `Fg_conform_project`
- `Fg_materialization_assurance_ledger`
- `Fg_semantic_convergence_assurance_ledger`
- `Fg_obligation_carry_assurance_ledger`
- `Fg_requirement_fulfillment_assurance_ledger`
- `Fg_ambiguity_assurance_ledger`
- `Fg_capability_assurance_ledger`
- `Fg_shallow_realization_assurance_ledger`
- `Fg_traversal_assurance_fold`

For most UI work these appear as advanced graph/runtime detail rather than
primary operator actions, but they matter for graph inspection and assurance
drill-down.

## Software-Domain Function Catalog

### Bootstrap To Release Program

These functions make up `bootstrap_release_self_test`.

```mermaid
flowchart TD
  I[input_set]
  INT[intent_surface]
  PROD[product_surface]
  GOAL[goal_surface]
  REQ[requirement_surface]
  FEAT[feature_decomp_surface]
  UAT[uat_testcases_surface]
  DES[design_surface]
  SCN[scenario_surface]
  IDES[implementation_design_surface]
  ISTACK[implementation_stack_profile]
  IMOD[implementation_module_surface]
  RS[realization_schedule_surface]
  CODE[code_surface]
  TDES[test_design_surface]
  TSTACK[test_stack_profile]
  TMOD[test_module_surface]
  TS[test_schedule_surface]
  TAR[test_run_archive_surface]
  TAUTH[testcase_authority_surface]
  REL[release_surface]

  I -->|derive_intent_surface| INT
  I -->|derive_product_surface| PROD
  INT -->|derive_product_surface| PROD
  I -->|derive_goal_surface| GOAL
  INT -->|derive_goal_surface| GOAL
  PROD -->|derive_goal_surface| GOAL
  I -->|derive_requirement_surface| REQ
  INT -->|derive_requirement_surface| REQ
  PROD -->|derive_requirement_surface| REQ
  GOAL -->|derive_requirement_surface| REQ
  REQ -->|derive_feature_decomp_surface| FEAT
  REQ -->|derive_uat_testcases_surface| UAT
  REQ -->|derive_design_surface| DES
  FEAT -->|derive_design_surface| DES
  REQ -->|derive_scenario_surface| SCN
  DES -->|derive_scenario_surface| SCN
  DES -->|derive_implementation_design_surface| IDES
  SCN -->|derive_implementation_design_surface| IDES
  IDES -->|select_implementation_stack_profile| ISTACK
  IDES -->|derive_implementation_module_surface| IMOD
  ISTACK -->|derive_implementation_module_surface| IMOD
  IDES -->|derive_realization_schedule_surface| RS
  IMOD -->|derive_realization_schedule_surface| RS
  ISTACK -->|derive_realization_schedule_surface| RS
  IMOD -->|derive_code_surface| CODE
  ISTACK -->|derive_code_surface| CODE
  RS -->|derive_code_surface| CODE
  DES -->|derive_test_design_surface| TDES
  SCN -->|derive_test_design_surface| TDES
  TDES -->|select_test_stack_profile| TSTACK
  TDES -->|derive_test_module_surface| TMOD
  TSTACK -->|derive_test_module_surface| TMOD
  TDES -->|derive_test_schedule_surface| TS
  TMOD -->|derive_test_schedule_surface| TS
  TSTACK -->|derive_test_schedule_surface| TS
  TMOD -->|derive_test_run_archive_surface| TAR
  TSTACK -->|derive_test_run_archive_surface| TAR
  TS -->|derive_test_run_archive_surface| TAR
  UAT -->|qualify_testcase_authority| TAUTH
  SCN -->|qualify_testcase_authority| TAUTH
  REQ -->|prepare_release_surface| REL
  DES -->|prepare_release_surface| REL
  SCN -->|prepare_release_surface| REL
  CODE -->|prepare_release_surface| REL
  TAUTH -->|prepare_release_surface| REL
  TAR -->|prepare_release_surface| REL
```

| Function | Inputs | Output | Edge Class |
| --- | --- | --- | --- |
| `derive_intent_surface` | `input_set` | `intent_surface` | `bootstrap_specification` |
| `derive_product_surface` | `input_set`, `intent_surface` | `product_surface` | `bootstrap_specification` |
| `derive_goal_surface` | `input_set`, `intent_surface`, `product_surface` | `goal_surface` | `bootstrap_specification` |
| `derive_requirement_surface` | `input_set`, `intent_surface`, `product_surface`, `goal_surface` | `requirement_surface` | `bootstrap_specification` |
| `derive_feature_decomp_surface` | `requirement_surface` | `feature_decomp_surface` | `design` |
| `derive_uat_testcases_surface` | `requirement_surface` | `uat_testcases_surface` | `qualification` |
| `derive_design_surface` | `requirement_surface`, `feature_decomp_surface` | `design_surface` | `design` |
| `derive_scenario_surface` | `requirement_surface`, `design_surface` | `scenario_surface` | `design` |
| `derive_implementation_design_surface` | `design_surface`, `scenario_surface` | `implementation_design_surface` | `design` |
| `select_implementation_stack_profile` | `implementation_design_surface` | `implementation_stack_profile` | `implementation` |
| `derive_implementation_module_surface` | `implementation_design_surface`, `implementation_stack_profile` | `implementation_module_surface` | `implementation` |
| `derive_realization_schedule_surface` | `implementation_design_surface`, `implementation_module_surface`, `implementation_stack_profile` | `realization_schedule_surface` | `implementation` |
| `derive_code_surface` | `implementation_module_surface`, `implementation_stack_profile`, `realization_schedule_surface` | `code_surface` | `implementation` |
| `derive_test_design_surface` | `design_surface`, `scenario_surface` | `test_design_surface` | `design` |
| `select_test_stack_profile` | `test_design_surface` | `test_stack_profile` | `qualification` |
| `derive_test_module_surface` | `test_design_surface`, `test_stack_profile` | `test_module_surface` | `qualification` |
| `derive_test_schedule_surface` | `test_design_surface`, `test_module_surface`, `test_stack_profile` | `test_schedule_surface` | `qualification` |
| `derive_test_run_archive_surface` | `test_module_surface`, `test_stack_profile`, `test_schedule_surface` | `test_run_archive_surface` | `qualification` |
| `qualify_testcase_authority` | `uat_testcases_surface`, `scenario_surface` | `testcase_authority_surface` | `qualification` |
| `prepare_release_surface` | `requirement_surface`, `design_surface`, `scenario_surface`, `code_surface`, `testcase_authority_surface`, `test_run_archive_surface` | `release_surface` | `release` |

### Operational Program

These functions make up `release_operational_cycle`.

```mermaid
flowchart TD
  REL[release_surface]
  BES[build_execution_surface]
  BER[build_execution_result_surface]
  TES[test_execution_surface]
  TER[test_execution_result_surface]
  DEP[deployment_surface]
  DER[deployment_result_surface]
  ENV[deployed_environment_surface]
  TAR[test_run_archive_surface]
  ROS[runtime_observation_surface]
  RET[retrofit_plan_surface]

  REL -->|prepare_build_execution_surface| BES
  BES -->|derive_build_execution_result_surface| BER
  REL -->|prepare_test_execution_surface| TES
  TES -->|derive_test_execution_result_surface| TER
  TAR -->|derive_test_execution_result_surface| TER
  REL -->|prepare_deployment_surface| DEP
  DEP -->|derive_deployment_result_surface| DER
  DER -->|derive_deployed_environment_surface| ENV
  DER -->|derive_runtime_observation_surface| ROS
  TAR -->|derive_runtime_observation_surface| ROS
  ROS -->|derive_retrofit_plan_surface| RET
  REL -->|derive_retrofit_plan_surface| RET
```

| Function | Inputs | Output | Edge Class |
| --- | --- | --- | --- |
| `prepare_build_execution_surface` | `release_surface` | `build_execution_surface` | `release` |
| `derive_build_execution_result_surface` | `build_execution_surface` | `build_execution_result_surface` | `operational_return` |
| `prepare_test_execution_surface` | `release_surface` | `test_execution_surface` | `release` |
| `derive_test_execution_result_surface` | `test_execution_surface`, `test_run_archive_surface` | `test_execution_result_surface` | `operational_return` |
| `prepare_deployment_surface` | `release_surface` | `deployment_surface` | `release` |
| `derive_deployment_result_surface` | `deployment_surface` | `deployment_result_surface` | `operational_return` |
| `derive_deployed_environment_surface` | `deployment_result_surface` | `deployed_environment_surface` | `operational_return` |
| `derive_runtime_observation_surface` | `deployment_result_surface`, `test_run_archive_surface` | `runtime_observation_surface` | `operational_return` |
| `derive_retrofit_plan_surface` | `runtime_observation_surface`, `release_surface` | `retrofit_plan_surface` | `operational_return` |

### Governance Loop Program

These are read/re-entry functions over current gap and closure truth.

```mermaid
flowchart TD
  D[sdlc_gap_dossier]
  C[sdlc_requirement_closure_register]
  O[gap_observation_surface]
  T[gap_triage_surface]
  R[gap_route_surface]
  P[repricing_proposal_surface]
  W[ticket_work_item_route_surface]
  X[gap_retirement_surface]

  D -->|observe_gap_pressure| O
  C -->|observe_gap_pressure| O
  O -->|classify_gap_triage| T
  O -->|bind_gap_route| R
  T -->|bind_gap_route| R
  T -->|propose_constitutional_repricing| P
  R -->|route_ticket_work_item| W
  O -->|retire_gap_after_loopback| X
  C -->|retire_gap_after_loopback| X
```

| Function | Inputs | Output | Role |
| --- | --- | --- | --- |
| `observe_gap_pressure` | `sdlc_gap_dossier`, `sdlc_requirement_closure_register` | `gap_observation_surface` | observe current pressure |
| `classify_gap_triage` | `gap_observation_surface` | `gap_triage_surface` | classify defect/process layer |
| `bind_gap_route` | `gap_observation_surface`, `gap_triage_surface` | `gap_route_surface` | bind to lawful re-entry |
| `propose_constitutional_repricing` | `gap_triage_surface` | `repricing_proposal_surface` | publish repricing proposal |
| `route_ticket_work_item` | `gap_route_surface` | `ticket_work_item_route_surface` | route into work tracking |
| `retire_gap_after_loopback` | `gap_observation_surface`, `sdlc_requirement_closure_register` | `gap_retirement_surface` | publish retirement state |

## Installed Operator And Worker Surfaces

The installed operator publishes a per-hop archive and typed carrier set. These
matter for UI drill-down and forensic views.

## Installed Operator Process Flow

```mermaid
sequenceDiagram
  participant User
  participant CLI as odd-sdlc-ts
  participant Domain as odd_sdlc operator
  participant ABG as ABG process actor
  participant Worker as Claude F_P worker
  participant Archive as operator archive
  participant Ledgers as closure/lineage/gap projections

  User->>CLI: start --target next --until converged --worker process://claude
  CLI->>Domain: public start request
  Domain->>Domain: choose next graph edge
  Domain->>Archive: create operator-runs/timestamp_pid_outerpid
  Domain->>Archive: write handoff_manifest.json + worker_prompt.md
  Domain->>ABG: invoke worker through process actor
  ABG->>Archive: worker_process_started.json
  ABG->>Worker: spawn claude -p ...
  Worker-->>ABG: stdout/stderr/process exit
  ABG->>Archive: worker_process_events.jsonl + stream logs
  ABG-->>Domain: worker run result
  Domain->>Archive: worker_result_report.json
  Domain->>Domain: postflight + assurance fold
  Domain->>Archive: postflight.json + hook_outcome.json + run.json + postmortem.md
  Domain->>Ledgers: update closure / lineage / gap truth
  Domain-->>CLI: operator summary + next lawful action
  CLI-->>User: blocked / worker_invoked / converged
```

## One-Hop Archive Structure

```mermaid
flowchart TD
  Root[operator-runs/run-id]
  H[handoff_manifest.json]
  P[worker_prompt.md]
  PS[worker_process_started.json]
  PE[worker_process_events.jsonl]
  SO[worker_stdout.log]
  SE[worker_stderr.log]
  WR[worker_result_report.json]
  PF[postflight.json]
  HO[hook_outcome.json]
  AS[assurance ledgers]
  RU[run.json]
  PM[postmortem.md]
  RT[runtime_events.json]

  Root --> H
  Root --> P
  Root --> PS
  Root --> PE
  Root --> SO
  Root --> SE
  Root --> WR
  Root --> PF
  Root --> HO
  Root --> AS
  Root --> RU
  Root --> PM
  Root --> RT
```

### One-Hop Outcome

`SdlcInstalledOperatorStartOutcome` carries:

- `summary`
- `start`
- `transport`
- `manifest`
- `workerRun`
- `workerReport`
- `postflight`
- `assuranceSatisfaction`
- `gapDossier`
- `hookOutcome`
- `emittedRuntimeEventKinds`
- `eventLogPath`
- `archiveRoot`

### Worker Handoff

`SdlcWorkerHandoffManifest` is the authoritative edge handoff. It includes:

- graph function name and edge name
- input asset types and target asset type
- allowed write roots
- project conformance profile
- product materialization contract
- traversal obligation context
- traversal intent package
- retry context
- method refs
- result-report schema

### Worker Result

`SdlcWorkerResultReport` includes:

- graph function and edge identity
- target asset type
- output file and digest
- summary
- `unresolvedReasons`
- `materializedFiles`
- optional execution evidence
- per-obligation assessments

The UI should treat `unresolvedReasons` and obligation assessments as distinct
from final closure. Postflight and assurance still have to admit them.

## Lineage And Closure Surfaces

### Lineage Ledger

`SdlcLineageLedger` projects generated assets back to:

- `requirementIds`
- `sourceInputUris`
- `producedByGraphFunction`
- `targetAssetType`
- `evidenceRefs`
- `proofKinds`
- `authorityVerbs`

This is the current bridge from requirement truth to generated assets.

### Requirement Closure Register

Each `SdlcRequirementClosureEntry` carries:

- `requirementId`
- `assetIds`
- `producedByGraphFunctions`
- `proofKinds`
- `authorityVerbs`
- `traceabilityStatus`
- `fulfillmentStatus`
- `carryStatus`
- `openReasons`

For UI purposes:

- `carryStatus` and `fulfillmentStatus` must stay separate
- `traceabilityStatus` is not the same thing as fulfillment
- `openReasons` are the honest explanation surface

```mermaid
flowchart LR
  Req[requirement authority]
  Work[worker result report]
  Asset[generated asset]
  Proof[proof claims]
  Lineage[sdlc_lineage_ledger]
  Closure[sdlc_requirement_closure_register]
  Gap[sdlc_gap_dossier]

  Req --> Proof
  Work --> Proof
  Asset --> Proof
  Proof --> Lineage
  Lineage --> Closure
  Closure --> Gap
```

### Gap Dossier

`SdlcGapDossier` is the current actionable gap projection. It carries:

- `edge`
- `status`
- `evidenceRefs`
- `triageInput`
- `nextLawfulActions`

This is the right source for gap views. The manager may derive compact badges or
queues from it, but it should not go back to ad hoc `gaps` parsing as the
primary semantic contract.

## UI Composition Guidance For odd_manager

### Use These As First-Class

- query-domain projection
- ABG runtime projections
- requirement closure register
- lineage ledger
- current gap dossier
- installed operator hop archives for drill-down

### Do Not Infer These From Prose Or Paths

- asset family membership
- producer graph-function ownership
- start-addressability
- edge class
- closure status
- worker success

### Recommended UI Slices

1. Overview
   - workspace identity
   - domain contract identity
   - current program
   - current edge
   - conformance/gap state

2. Graph View
   - start targets
   - executive programs
   - leaf functions
   - current vector status

3. Asset View
   - asset families
   - asset types
   - producer ownership
   - latest materialized evidence

4. Closure View
   - requirement closure register
   - carry vs fulfillment
   - traceability posture
   - open reasons

5. Forensics View
   - operator archive
   - worker handoff
   - process evidence
   - worker result report
   - postflight and assurance outcomes

## UI Navigation Map

```mermaid
flowchart TD
  Home[workspace overview]
  Graph[graph and programs]
  Assets[assets and families]
  Runs[runtime and operator runs]
  Closure[closure and lineage]
  Gaps[gaps and re-entry]

  Home --> Graph
  Home --> Assets
  Home --> Runs
  Home --> Closure
  Home --> Gaps

  Graph --> GraphFns[graph functions]
  Graph --> Starts[start targets]
  Assets --> Families[asset families]
  Assets --> Ownership[asset ownership]
  Runs --> ABGRuntime[ABG runtime]
  Runs --> Archives[operator archives]
  Closure --> ReqClosure[requirement closure]
  Closure --> Lineage[lineage ledger]
  Gaps --> Dossier[current dossier]
  Gaps --> Route[triage and route]
```

## Minimal Integration Rule

If the manager can only wire one domain pack pass initially, it should:

1. bootstrap from `odd_sdlc.query-domain ts-v1`
2. compose that with ABG runtime projections
3. treat requirement closure, lineage, and gap dossier as the first domain
   overlays
4. defer any UI-only scoring or summarization until those source projections are
   visible and drillable

That preserves the right ownership split:

- ABG owns runtime truth
- `odd_sdlc` owns SDLC domain semantics
- `odd_manager` owns supervision and presentation
