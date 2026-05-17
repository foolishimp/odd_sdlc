# F_D Run Analysis (generic)

- profile policy: policy://odd-sdlc/analysis/profile/generic/v1
- threshold policy: policy://odd-sdlc/analysis/threshold/generic/v1
- policy status: informational
- read-only: true

## Current State Telemetry

- inspected root: `/Users/jim/src/apps/odd_sdlc/build_tenants/typescript/test_env/test_runs/scenario_t132_hello_world_js_live/20260517T032609453Z_pid8323/workspace`
- inspected kind: workspace
- scenario: workspace
- profile: generic
- operator-run count: 11
- graph edge sequence: bootstrap_release_self_test -> derive_uat_testcases_surface -> derive_testcase_authority_surface -> derive_feature_decomp_surface -> derive_design_surface -> derive_scenario_surface -> derive_implementation_design_surface -> derive_component_code_surface
- same-edge retries: 0
- repair attempts: 0
- blocked attempts: 0
- yielded attempts: 0
- aborted attempts: 0
- final closure: close
- total wall-clock: 2039.7s
- summed worker elapsed: 2035.7s
- unattributed elapsed: 4.0s
- archive bytes: 96.16MiB
- runtime/event bytes: 27.29MiB
- stdout/stderr bytes: 4.18MiB
- prompt/context bytes: 837.4KiB
- product files: 1
- requirement obligations: 62
- product lineage refs: 6

## Edge Traversal

| # | edge | target | class | worker_ms | edge_ms | det_ms | pf | exec | pressure | closure | retry | blocking | files | obligations | lineage |
| - | - | - | - | - | - | - | - | - | - | - | - | - | - | - | - |
| 0 | derive_intent_surface | intent_surface | constructive | 91.7s | 91.8s | 101.810302734375ms | passed | - | cleared:0 | close | - | - | 0 | 12 | 0 |
| 1 | derive_product_surface | product_surface | constructive | 126.5s | 126.6s | 98.201904296875ms | passed | - | cleared:0 | close | - | - | 0 | 18 | 0 |
| 2 | derive_goal_surface | goal_surface | constructive | 113.3s | 113.5s | 110.6484375ms | passed | - | cleared:0 | close | - | - | 0 | 24 | 0 |
| 3 | derive_requirement_surface | requirement_surface | constructive | 135.8s | 135.9s | 92.88916015625ms | passed | - | cleared:0 | close | - | - | 0 | 30 | 0 |
| 4 | derive_uat_testcases_surface | uat_testcases_surface | constructive | 157.8s | 158.0s | 118.87158203125ms | passed | - | cleared:0 | close | - | - | 0 | 36 | 0 |
| 5 | derive_testcase_authority_surface | testcase_authority_surface | constructive | 162.5s | 162.6s | 115.015625ms | passed | - | cleared:0 | close | - | - | 0 | 36 | 0 |
| 6 | derive_feature_decomp_surface | feature_decomp_surface | constructive | 285.0s | 285.1s | 125.110595703125ms | passed | - | cleared:0 | close | - | - | 0 | 36 | 0 |
| 7 | derive_design_surface | design_surface | constructive | 233.5s | 233.6s | 121.27685546875ms | passed | - | cleared:0 | close | - | - | 0 | 42 | 0 |
| 8 | derive_scenario_surface | scenario_surface | constructive | 262.8s | 262.9s | 130.677001953125ms | passed | - | cleared:0 | close | - | - | 0 | 48 | 0 |
| 9 | derive_implementation_design_surface | implementation_design_surface | constructive | 256.2s | 256.3s | 128.378662109375ms | passed | - | cleared:0 | close | - | - | 0 | 54 | 0 |
| 10 | derive_component_code_surface | component_code_surface | constructive | 210.7s | 210.9s | 156.051025390625ms | passed | succeeded | cleared:0 | close | - | - | 1 | 62 | 6 |

## Prompt And Evidence Sources

| # | edge | construction brief | brief digest | rendered prompt | prompt policy | execution reports |
| - | - | - | - | - | - | - |
| 0 | derive_intent_surface | workspace://.ai-workspace/runtime/odd_sdlc/operator-runs/20260517T032614939Z_pid8323/worker_construction_brief.json | sha256:49e547a17bda14bde80e8b6c3f6bb83704a1165edb7ebec7e9148feb390ec040 | file:///Users/jim/src/apps/odd_sdlc/build_tenants/typescript/test_env/test_runs/scenario_t132_hello_world_js_live/20260517T032609453Z_pid8323/workspace/.ai-workspace/runtime/odd_sdlc/operator-runs/20260517T032614939Z_pid8323/worker_prompt.md | policy://odd-sdlc/worker-prompt-source/worker-construction-brief/v1 | 0 |
| 1 | derive_product_surface | workspace://.ai-workspace/runtime/odd_sdlc/operator-runs/20260517T032746989Z_pid8323/worker_construction_brief.json | sha256:a034d6080b89c623ded9520e6ca261151e71b86e00721ee1666969357ec7db4f | file:///Users/jim/src/apps/odd_sdlc/build_tenants/typescript/test_env/test_runs/scenario_t132_hello_world_js_live/20260517T032609453Z_pid8323/workspace/.ai-workspace/runtime/odd_sdlc/operator-runs/20260517T032746989Z_pid8323/worker_prompt.md | policy://odd-sdlc/worker-prompt-source/worker-construction-brief/v1 | 0 |
| 2 | derive_goal_surface | workspace://.ai-workspace/runtime/odd_sdlc/operator-runs/20260517T032953802Z_pid8323/worker_construction_brief.json | sha256:42957a915da98231eb557dd795ab86ec560c8769ca70ce20717179991b321b47 | file:///Users/jim/src/apps/odd_sdlc/build_tenants/typescript/test_env/test_runs/scenario_t132_hello_world_js_live/20260517T032609453Z_pid8323/workspace/.ai-workspace/runtime/odd_sdlc/operator-runs/20260517T032953802Z_pid8323/worker_prompt.md | policy://odd-sdlc/worker-prompt-source/worker-construction-brief/v1 | 0 |
| 3 | derive_requirement_surface | workspace://.ai-workspace/runtime/odd_sdlc/operator-runs/20260517T033147519Z_pid8323/worker_construction_brief.json | sha256:40f8d011dd9fcfddf5cb619b61c45d6ee91020c938dd53d79372157cc4117a5c | file:///Users/jim/src/apps/odd_sdlc/build_tenants/typescript/test_env/test_runs/scenario_t132_hello_world_js_live/20260517T032609453Z_pid8323/workspace/.ai-workspace/runtime/odd_sdlc/operator-runs/20260517T033147519Z_pid8323/worker_prompt.md | policy://odd-sdlc/worker-prompt-source/worker-construction-brief/v1 | 0 |
| 4 | derive_uat_testcases_surface | workspace://.ai-workspace/runtime/odd_sdlc/operator-runs/20260517T033403628Z_pid8323/worker_construction_brief.json | sha256:8702f73a650d578c99a987be07e6103887da222d52372f6b91f26ec46cb96780 | file:///Users/jim/src/apps/odd_sdlc/build_tenants/typescript/test_env/test_runs/scenario_t132_hello_world_js_live/20260517T032609453Z_pid8323/workspace/.ai-workspace/runtime/odd_sdlc/operator-runs/20260517T033403628Z_pid8323/worker_prompt.md | policy://odd-sdlc/worker-prompt-source/worker-construction-brief/v1 | 0 |
| 5 | derive_testcase_authority_surface | workspace://.ai-workspace/runtime/odd_sdlc/operator-runs/20260517T033641846Z_pid8323/worker_construction_brief.json | sha256:15eb178a55892d3ce75fd48b64f409a21348fee640b0f20ad05276f1d9d7f591 | file:///Users/jim/src/apps/odd_sdlc/build_tenants/typescript/test_env/test_runs/scenario_t132_hello_world_js_live/20260517T032609453Z_pid8323/workspace/.ai-workspace/runtime/odd_sdlc/operator-runs/20260517T033641846Z_pid8323/worker_prompt.md | policy://odd-sdlc/worker-prompt-source/worker-construction-brief/v1 | 0 |
| 6 | derive_feature_decomp_surface | workspace://.ai-workspace/runtime/odd_sdlc/operator-runs/20260517T033924682Z_pid8323/worker_construction_brief.json | sha256:6ac0f97bcfd3beabaf472adcb37579c137bc1ad6b46c4b573dd98127a2ad28fd | file:///Users/jim/src/apps/odd_sdlc/build_tenants/typescript/test_env/test_runs/scenario_t132_hello_world_js_live/20260517T032609453Z_pid8323/workspace/.ai-workspace/runtime/odd_sdlc/operator-runs/20260517T033924682Z_pid8323/worker_prompt.md | policy://odd-sdlc/worker-prompt-source/worker-construction-brief/v1 | 0 |
| 7 | derive_design_surface | workspace://.ai-workspace/runtime/odd_sdlc/operator-runs/20260517T034410040Z_pid8323/worker_construction_brief.json | sha256:8a1591d40c8afd8f12292bb7c9884fc642185cab4c7ce008f8050325fd872cb2 | file:///Users/jim/src/apps/odd_sdlc/build_tenants/typescript/test_env/test_runs/scenario_t132_hello_world_js_live/20260517T032609453Z_pid8323/workspace/.ai-workspace/runtime/odd_sdlc/operator-runs/20260517T034410040Z_pid8323/worker_prompt.md | policy://odd-sdlc/worker-prompt-source/worker-construction-brief/v1 | 0 |
| 8 | derive_scenario_surface | workspace://.ai-workspace/runtime/odd_sdlc/operator-runs/20260517T034803950Z_pid8323/worker_construction_brief.json | sha256:87e15dfaadb2c862d661be641c6d22c279b20fc16b230156e47bc0bf4302aadf | file:///Users/jim/src/apps/odd_sdlc/build_tenants/typescript/test_env/test_runs/scenario_t132_hello_world_js_live/20260517T032609453Z_pid8323/workspace/.ai-workspace/runtime/odd_sdlc/operator-runs/20260517T034803950Z_pid8323/worker_prompt.md | policy://odd-sdlc/worker-prompt-source/worker-construction-brief/v1 | 0 |
| 9 | derive_implementation_design_surface | workspace://.ai-workspace/runtime/odd_sdlc/operator-runs/20260517T035227142Z_pid8323/worker_construction_brief.json | sha256:67f6d3859479902ce5ad7a8a3d55a283ebff3ec6fa4f85a9c162475648f3b737 | file:///Users/jim/src/apps/odd_sdlc/build_tenants/typescript/test_env/test_runs/scenario_t132_hello_world_js_live/20260517T032609453Z_pid8323/workspace/.ai-workspace/runtime/odd_sdlc/operator-runs/20260517T035227142Z_pid8323/worker_prompt.md | policy://odd-sdlc/worker-prompt-source/worker-construction-brief/v1 | 0 |
| 10 | derive_component_code_surface | workspace://.ai-workspace/runtime/odd_sdlc/operator-runs/20260517T035643789Z_pid8323/worker_construction_brief.json | sha256:4a495c24744cc99ce6b886d2879239e7849627dc94f73e50ea6a8444fd3ed889 | file:///Users/jim/src/apps/odd_sdlc/build_tenants/typescript/test_env/test_runs/scenario_t132_hello_world_js_live/20260517T032609453Z_pid8323/workspace/.ai-workspace/runtime/odd_sdlc/operator-runs/20260517T035643789Z_pid8323/worker_prompt.md | policy://odd-sdlc/worker-prompt-source/worker-construction-brief/v1 | 3 |

## Test35 Conceptual Stage Coverage

| test35 stage | expected edge | expected target | mapped edge | mapped target | class | runs |
| - | - | - | - | - | - | - |
| test35://stage/project-conformance | Fg_conform_project_authority | project_bootstrap_surface | - | - | missing | 0 |
| test35://stage/feature-decomposition | derive_feature_decomp_surface | feature_decomp_surface | derive_feature_decomp_surface | feature_decomp_surface | constructive | 1 |
| test35://stage/scenario-uat-pressure | derive_scenario_surface | scenario_surface | derive_scenario_surface | scenario_surface | constructive | 1 |
| test35://stage/uat-testcases | derive_uat_testcases_surface | uat_testcases_surface | derive_uat_testcases_surface | uat_testcases_surface | constructive | 1 |
| test35://stage/implementation-design | derive_implementation_design_surface | implementation_design_surface | derive_implementation_design_surface | implementation_design_surface | constructive | 1 |
| test35://stage/component-code | derive_component_code_surface | component_code_surface | derive_component_code_surface | component_code_surface | constructive | 1 |
| test35://stage/test-design | derive_test_design_surface | test_design_surface | - | - | missing | 0 |
| test35://stage/component-test | derive_component_test_surface | component_test_surface | - | - | missing | 0 |
| test35://stage/test-execution-prep | prepare_test_execution_surface | test_execution_surface | - | - | missing | 0 |
| test35://stage/test-run-archive | derive_test_run_archive_surface | test_run_archive_surface | - | - | missing | 0 |
| test35://stage/test-execution-result | derive_test_execution_result_surface | test_execution_result_surface | - | - | missing | 0 |
| test35://stage/code-rollup | derive_code_surface | code_surface | - | - | missing | 0 |
| test35://stage/release-preparation | prepare_release_surface | release_surface | - | - | missing | 0 |
| test35://stage/unmapped-runtime-edge | unmapped | unmapped | derive_intent_surface | intent_surface | unmapped | 1 |
| test35://stage/unmapped-runtime-edge | unmapped | unmapped | derive_product_surface | product_surface | unmapped | 1 |
| test35://stage/unmapped-runtime-edge | unmapped | unmapped | derive_goal_surface | goal_surface | unmapped | 1 |
| test35://stage/unmapped-runtime-edge | unmapped | unmapped | derive_requirement_surface | requirement_surface | unmapped | 1 |
| test35://stage/unmapped-runtime-edge | unmapped | unmapped | derive_testcase_authority_surface | testcase_authority_surface | unmapped | 1 |
| test35://stage/unmapped-runtime-edge | unmapped | unmapped | derive_design_surface | design_surface | unmapped | 1 |

## Active-Run Liveness

- active operator-run: `file:///Users/jim/src/apps/odd_sdlc/build_tenants/typescript/test_env/test_runs/scenario_t132_hello_world_js_live/20260517T032609453Z_pid8323/workspace/.ai-workspace/runtime/odd_sdlc/operator-runs/20260517T035643789Z_pid8323`
- active edge: derive_component_code_surface
- active vector: derive_component_code_surface
- active target asset: component_code_surface
- worker pid: 45285
- process alive: false
- last event at: 210373
- last stdout at: 1778990414193.0566
- last heartbeat at: n/a
- heartbeat age: n/a
- max no-output gap: 30.0s
- archive growth: 0B/min
- productive signal: completed
- last blocking reason: none

## Runtime Artifact Gaps

none

## Diagnostics

none

## Bloat And Slope

- bytes/obligation: 576931.27
- bytes/product file: 35769739
- bytes/edge: 3251794.45
- bytes/retry: n/a
- lineage refs/product file: 6
- duplicate authority count: 0
- raw display-id requirement count: 0
- canonical requirement id count: 6

| # | edge | handoff | events | stdout | prompt/ctx |
| - | - | - | - | - | - |
| 0 | bootstrap_release_self_test | 78.0KiB | 865.3KiB | 175.6KiB | 53.8KiB |
| 1 | bootstrap_release_self_test | 96.2KiB | 953.4KiB | 228.0KiB | 63.3KiB |
| 2 | bootstrap_release_self_test | 108.7KiB | 922.3KiB | 260.8KiB | 64.9KiB |
| 3 | bootstrap_release_self_test | 122.6KiB | 1.04MiB | 326.9KiB | 68.8KiB |
| 4 | derive_uat_testcases_surface | 172.7KiB | 2.16MiB | 255.7KiB | 72.4KiB |
| 5 | derive_testcase_authority_surface | 179.5KiB | 2.50MiB | 321.2KiB | 73.5KiB |
| 6 | derive_feature_decomp_surface | 171.8KiB | 3.77MiB | 388.2KiB | 66.4KiB |
| 7 | derive_design_surface | 194.9KiB | 3.75MiB | 487.6KiB | 69.0KiB |
| 8 | derive_scenario_surface | 211.0KiB | 4.72MiB | 667.9KiB | 71.8KiB |
| 9 | derive_implementation_design_surface | 286.5KiB | 3.26MiB | 591.2KiB | 141.7KiB |
| 10 | derive_component_code_surface | 239.2KiB | 3.43MiB | 581.2KiB | 91.8KiB |

## Retry Forensics

none

## Summary Drift

no summary file present
