# T-102 F_P Workspace Editor Edge Registry

Status: forensic registry for T-102/T-171 continuation.

Governing axiom:

```text
F_P.transform is the only F_P process with workspace edit authority.
Every other F_P process is read-only over workspace state and returns typed
findings or parameters to the installed operator typed-carrier interface for
deterministic write/admission.
```

The current TypeScript line mostly protects framework-owned files such as
`fp_evaluate_result.json`, `worker_result_report.json`, runtime events,
ledgers, closure decisions, and projections. The remaining defect is different:
some `F_P.transform` prompts ask the worker to author evaluator-shaped payloads
inside the target artifact.

## Count

- implementation floor: 5 edges
- conservative sweep set: 7 edges

Hard failures:

1. `qualify_component_realization_surface`
2. `qualify_component_test_execution_surface`
3. `derive_component_repair_schedule_surface`
4. `derive_release_depth_parity_surface`
5. `derive_test_execution_result_surface`

Review/fence required:

1. `prepare_test_execution_surface`
2. `derive_implementation_design_surface`

## Direct Evidence

- `handoff.ts` carries the correct global axiom: "Do not write ledgers, runtime
  events, closure decisions, evaluator projections, or framework result
  carriers."
- The same prompt construction then asks specific edges to emit
  `componentTestQualificationRows[].status`, `componentRepairSchedule`,
  `releaseDepthParity`, and `sdlc_worker_execution_evidence`.
- The hello-world RC-rejected run retried on `componentRepairSchedule` and
  `releaseDepthParity` because the transform worker was asked to guess
  framework-owned evaluator/rollup payloads.

## Registry

| Edge | GTL role | Axiom verdict | Required action |
|---|---|---:|---|
| `derive_intent_surface` | Construct intent surface | pass | none identified |
| `derive_product_surface` | Construct product surface | pass | none identified |
| `derive_goal_surface` | Construct goal surface | pass | none identified |
| `derive_requirement_surface` | Construct requirement surface | pass | none identified |
| `derive_uat_testcases_surface` | Construct UAT testcase pressure | pass | none identified |
| `derive_testcase_authority_surface` | Construct testcase authority | pass | none identified |
| `derive_feature_decomp_surface` | Construct feature decomposition | pass | none identified |
| `derive_design_surface` | Construct design surface | pass | none identified |
| `derive_scenario_surface` | Construct scenario surface | pass | none identified |
| `derive_implementation_design_surface` | Construct implementation design | review | fence or move `designCompletenessVerdict` to evaluator-owned installed-operator record |
| `derive_component_code_surface` | Materialize implementation/source files | pass | keep transform as editor over declared product files only |
| `qualify_component_realization_surface` | Qualify component realization | fail | move realized/missing/collapsed/affected qualification findings to read-only evaluator plus installed-operator write |
| `derive_code_surface` | Roll up code surface from admitted component evidence | pass | none identified in current prompt; keep as projection-only if possible |
| `derive_test_design_surface` | Construct composite test design | pass | none identified |
| `derive_component_test_surface` | Materialize component test files | pass | keep transform as editor over declared test product files only |
| `prepare_test_execution_surface` | Prepare test execution transition | review | fence `prepared/blocked/pending` as construction readiness or move status to evaluator-owned record |
| `derive_test_execution_result_surface` | Execute declared test contract | fail-special | move execution-evidence JSON/status/count payload to installed operator admission; route repair pressure back through a constructive transform edge |
| `qualify_component_test_execution_surface` | Qualify observed test execution | fail | move pass/fail/blocked/pending/unproven qualification rows and failure register to evaluator-owned installed-operator record |
| `derive_component_repair_schedule_surface` | Derive repair pressure schedule | fail | move repair schedule construction from worker output to read-only evaluator findings plus installed-operator write |
| `derive_test_run_archive_surface` | Archive admitted test execution truth | pass | no fresh execution/eval payload in prompt; keep archive as deterministic projection where possible |
| `derive_release_depth_parity_surface` | Release-depth parity assessment | fail | move `met/blocked/repriced` parity verdict to evaluator-owned installed-operator record |
| `prepare_release_surface` | Prepare release readiness | pass | no direct prompt leak found; verify target payload during sweep |
| `derive_lite_design_adr_surface` | Construct bounded lite design/ADR | pass | none identified |
| `derive_lite_component_code_surface` | Materialize bounded lite component code | pass | keep transform as editor over declared product files only |
| `prepare_build_execution_surface` | Prepare build transition | pass | no direct prompt leak found |
| `derive_build_execution_result_surface` | Admit returned build result/pending state | pass | no direct prompt leak found; future operational-evidence split should mirror test execution |
| `prepare_deployment_surface` | Prepare deployment transition | pass | no direct prompt leak found |
| `derive_deployment_result_surface` | Admit returned deployment result/pending state | pass | no direct prompt leak found |
| `derive_deployed_environment_surface` | Project deployed environment | pass | no direct prompt leak found; should remain deterministic projection |
| `derive_runtime_observation_surface` | Bind runtime evidence | pass | no direct prompt leak found; should remain evidence admission/projection |
| `derive_retrofit_plan_surface` | Plan retrofit wave | pass | no direct prompt leak found |
| `observe_gap_pressure` | Project gap pressure | pass | no direct prompt leak found; read-model projection should be installed-operator-owned if executed |
| `classify_gap_triage` | Classify gap pressure | pass | no direct prompt leak found; classification should use read-only F_P findings plus installed-operator write if executed |
| `bind_gap_route` | Bind lawful re-entry route | pass | no direct prompt leak found; route record should be installed-operator-owned if executed |
| `propose_constitutional_repricing` | Propose repricing | pass | no direct prompt leak found |
| `route_ticket_work_item` | Project ticket route | pass | no direct prompt leak found |
| `retire_gap_after_loopback` | Publish gap retirement state | pass | no direct prompt leak found |

## Fix Rule

For the five hard failures, do not solve this by adding more schema prose to the
worker prompt. The correct fix is to split the target:

```text
F_P.transform
  -> writes only construction/edit artifact allowed by the edge
F_P.evaluate / domain evaluator
  -> reads admitted evidence and returns typed findings
installed operator typed-carrier interface
  -> writes the evaluation carrier, ledger/register/projection, and fold inputs
```

The two review edges need explicit closure before T-171 RC proof. If their
status/verdict fields are construction metadata, the target carrier contract
must say so. Otherwise they join the hard-failure set.
