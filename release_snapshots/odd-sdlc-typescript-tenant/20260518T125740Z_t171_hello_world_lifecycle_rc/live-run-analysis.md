# F_D Run Analysis (hello_world)

- profile policy: policy://odd-sdlc/analysis/profile/hello_world/v1
- threshold policy: policy://odd-sdlc/analysis/threshold/hello_world/v1
- policy status: informational
- read-only: true

## Current State Telemetry

- inspected root: `/Users/jim/src/apps/odd_sdlc/build_tenants/typescript/test_env/test_runs/scenario_t132_hello_world_js_live/20260518T114036171Z_pid75297`
- inspected kind: run-archive
- scenario: scenario_t132_hello_world_js_live
- profile: hello_world
- operator-run count: 28
- graph edge sequence: bootstrap_release_self_test -> derive_uat_testcases_surface -> derive_testcase_authority_surface -> derive_feature_decomp_surface -> derive_design_surface -> derive_scenario_surface -> derive_implementation_design_surface -> derive_component_code_surface -> qualify_component_realization_surface -> derive_code_surface -> derive_test_design_surface -> derive_component_test_surface -> prepare_test_execution_surface -> derive_test_execution_result_surface -> qualify_component_test_execution_surface -> derive_component_repair_schedule_surface -> derive_test_run_archive_surface -> derive_release_depth_parity_surface -> prepare_release_surface
- same-edge retries: 2
- repair attempts: 4
- blocked attempts: 2
- yielded attempts: 0
- aborted attempts: 0
- final closure: close
- total wall-clock: 4267.6s
- summed worker elapsed: 4256.9s
- unattributed elapsed: 10.8s
- archive bytes: 254.12MiB
- runtime/event bytes: 75.94MiB
- stdout/stderr bytes: 8.27MiB
- prompt/context bytes: 2.55MiB
- product files: 3
- requirement obligations: 86
- product lineage refs: 5

## Edge Traversal

| # | edge | target | class | worker_ms | edge_ms | det_ms | pf | exec | exec_source | pressure | closure | retry | blocking | files | obligations | lineage |
| - | - | - | - | - | - | - | - | - | - | - | - | - | - | - | - | - |
| 0 | derive_intent_surface | intent_surface | constructive | 70.2s | 70.3s | 95.854248046875ms | passed | - | none | cleared:0 | close | - | - | 0 | 6 | 0 |
| 1 | derive_product_surface | product_surface | constructive | 92.8s | 92.9s | 90.68701171875ms | passed | - | none | cleared:0 | close | - | - | 0 | 11 | 0 |
| 2 | derive_goal_surface | goal_surface | constructive | 110.8s | 110.9s | 104.043212890625ms | passed | - | none | cleared:0 | close | - | - | 0 | 16 | 0 |
| 3 | derive_requirement_surface | requirement_surface | constructive | 121.8s | 121.9s | 110.6005859375ms | passed | - | none | cleared:0 | close | - | - | 0 | 21 | 0 |
| 4 | derive_uat_testcases_surface | uat_testcases_surface | constructive | 90.1s | 90.2s | 84.254150390625ms | passed | - | none | cleared:0 | close | - | - | 0 | 26 | 0 |
| 5 | derive_testcase_authority_surface | testcase_authority_surface | constructive | 123.0s | 123.1s | 104.513671875ms | passed | - | none | cleared:0 | close | - | - | 0 | 26 | 0 |
| 6 | derive_feature_decomp_surface | feature_decomp_surface | constructive | 98.9s | 99.0s | 98.398681640625ms | passed | - | none | cleared:0 | close | - | - | 0 | 26 | 0 |
| 7 | derive_design_surface | design_surface | constructive | 116.4s | 116.6s | 143.227294921875ms | passed | - | none | cleared:0 | close | - | - | 0 | 31 | 0 |
| 8 | derive_scenario_surface | scenario_surface | constructive | 135.5s | 135.6s | 117.381103515625ms | passed | - | none | cleared:0 | close | - | - | 0 | 36 | 0 |
| 9 | derive_implementation_design_surface | implementation_design_surface | constructive | 184.4s | 184.5s | 109.197021484375ms | passed | - | none | cleared:0 | close | - | - | 0 | 41 | 0 |
| 10 | derive_component_code_surface | component_code_surface | constructive | 118.1s | 118.2s | 152.77880859375ms | passed | - | none | cleared:0 | close | - | - | 1 | 48 | 5 |
| 11 | qualify_component_realization_surface | component_realization_qualification_surface | constructive | 121.4s | 121.5s | 122.1962890625ms | passed | - | none | cleared:0 | close | - | - | 0 | 51 | 0 |
| 12 | derive_code_surface | code_surface | rollup | 187.8s | 187.9s | 115.397216796875ms | passed | - | none | cleared:0 | close | - | - | 0 | 56 | 0 |
| 13 | derive_test_design_surface | test_design_surface | constructive | 240.1s | 240.3s | 146.18017578125ms | passed | - | none | cleared:0 | close | - | - | 0 | 61 | 0 |
| 14 | derive_component_test_surface | component_test_surface | constructive | 179.1s | 179.3s | 230.837158203125ms | passed | - | none | cleared:0 | close | - | - | 1 | 69 | 5 |
| 15 | prepare_test_execution_surface | test_execution_surface | constructive | 166.6s | 166.7s | 118.227294921875ms | passed | - | none | cleared:0 | close | - | - | 0 | 71 | 0 |
| 16 | derive_test_execution_result_surface | test_execution_result_surface | constructive | 371.0s | 371.2s | 160.95849609375ms | passed | succeeded | graph_test_execution_result | cleared:0 | close | - | - | 1 | 71 | 0 |
| 17 | qualify_component_test_execution_surface | component_test_qualification_surface | constructive | 183.0s | 183.2s | 158.427490234375ms | passed | - | none | cleared:0 | close | - | - | 0 | 71 | 0 |
| 18 | derive_component_repair_schedule_surface | component_repair_schedule_surface | constructive | 174.7s | 174.8s | 87.939453125ms | passed | - | none | none:0 | repair | - | - | 0 | 76 | 0 |
| 19 | derive_component_repair_schedule_surface | component_repair_schedule_surface | constructive | 137.2s | 137.3s | 114.0478515625ms | passed | - | none | none:0 | repair | - | - | 0 | 81 | 0 |
| 20 | derive_component_repair_schedule_surface | component_repair_schedule_surface | constructive | 151.1s | 151.3s | 198.614990234375ms | passed | - | none | cleared:0 | close | - | - | 0 | 81 | 0 |
| 21 | derive_test_run_archive_surface | test_run_archive_surface | constructive | 226.7s | 226.9s | 154.60546875ms | passed | - | none | cleared:0 | close | - | - | 0 | 85 | 0 |
| 22 | derive_release_depth_parity_surface | release_depth_parity_surface | rollup | 219.3s | 219.4s | 98.21923828125ms | passed | - | none | none:0 | repair | - | - | 0 | 81 | 0 |
| 23 | derive_release_depth_parity_surface | release_depth_parity_surface | rollup | 111.6s | 111.7s | 121.52734375ms | blocked | - | none | none:0 | retry | - | worker_authority_read_outside_workspace,worker_authority_read_outside_workspace:worker_stdout.log:20.message.content[0].input.path=/Users/jim/src/apps/odd_sdlc/code/src; worker_stdout.log:22.message.content[0].input.path=/Users/jim/src/apps/odd_sdlc/code/src | 0 | 86 | 0 |
| 24 | derive_release_depth_parity_surface | release_depth_parity_surface | rollup | 82.9s | 83.0s | 106.301513671875ms | passed | - | none | none:0 | repair | - | - | 0 | 86 | 0 |
| 25 | derive_release_depth_parity_surface | release_depth_parity_surface | rollup | 99.1s | 99.3s | 202.158935546875ms | blocked | - | none | none:0 | retry | - | worker_authority_read_outside_workspace,worker_authority_read_outside_workspace:worker_stdout.log:28.message.content[0].input.path=/Users/jim/src/apps/odd_sdlc/build_tenants/typescript/code/src | 0 | 86 | 0 |
| 26 | derive_release_depth_parity_surface | release_depth_parity_surface | rollup | 48.4s | 48.6s | 149.935302734375ms | passed | - | none | cleared:0 | close | - | - | 0 | 86 | 0 |
| 27 | prepare_release_surface | release_surface | rollup | 294.6s | 294.7s | 159.66357421875ms | passed | - | none | cleared:0 | close | - | - | 0 | 86 | 0 |

## Prompt And Evidence Sources

| # | edge | construction brief | brief digest | rendered prompt | prompt policy | execution | command | reports | shards | counts |
| - | - | - | - | - | - | - | - | - | - | - |
| 0 | derive_intent_surface | workspace://.ai-workspace/runtime/odd_sdlc/operator-runs/20260518T114043115Z_pid75297/worker_construction_brief.json | sha256:d774102c3fe391f33908c30d4298018e52d13c80efcaebafe2f5648cd5eaef5b | file:///Users/jim/src/apps/odd_sdlc/build_tenants/typescript/test_env/test_runs/scenario_t132_hello_world_js_live/20260518T114036171Z_pid75297/workspace/.ai-workspace/runtime/odd_sdlc/operator-runs/20260518T114043115Z_pid75297/worker_prompt.md | policy://odd-sdlc/worker-prompt-source/worker-construction-brief/v1 | none:- | - | 0 | 0 | n/a/n/a/n/a |
| 1 | derive_product_surface | workspace://.ai-workspace/runtime/odd_sdlc/operator-runs/20260518T114153633Z_pid75297/worker_construction_brief.json | sha256:193546abc33366967aed3232002c620a7153d1cf170dda9168c9bb16b9ac9ae0 | file:///Users/jim/src/apps/odd_sdlc/build_tenants/typescript/test_env/test_runs/scenario_t132_hello_world_js_live/20260518T114036171Z_pid75297/workspace/.ai-workspace/runtime/odd_sdlc/operator-runs/20260518T114153633Z_pid75297/worker_prompt.md | policy://odd-sdlc/worker-prompt-source/worker-construction-brief/v1 | none:- | - | 0 | 0 | n/a/n/a/n/a |
| 2 | derive_goal_surface | workspace://.ai-workspace/runtime/odd_sdlc/operator-runs/20260518T114326803Z_pid75297/worker_construction_brief.json | sha256:85ed7b6b10827563d8f1d37504be05d7705676a1b2fb0bee4a7b193a45313e27 | file:///Users/jim/src/apps/odd_sdlc/build_tenants/typescript/test_env/test_runs/scenario_t132_hello_world_js_live/20260518T114036171Z_pid75297/workspace/.ai-workspace/runtime/odd_sdlc/operator-runs/20260518T114326803Z_pid75297/worker_prompt.md | policy://odd-sdlc/worker-prompt-source/worker-construction-brief/v1 | none:- | - | 0 | 0 | n/a/n/a/n/a |
| 3 | derive_requirement_surface | workspace://.ai-workspace/runtime/odd_sdlc/operator-runs/20260518T114517963Z_pid75297/worker_construction_brief.json | sha256:c3658629e217f0dd97a622fadee76f544bd8aa01a123d6d82d692f9b7d8657f0 | file:///Users/jim/src/apps/odd_sdlc/build_tenants/typescript/test_env/test_runs/scenario_t132_hello_world_js_live/20260518T114036171Z_pid75297/workspace/.ai-workspace/runtime/odd_sdlc/operator-runs/20260518T114517963Z_pid75297/worker_prompt.md | policy://odd-sdlc/worker-prompt-source/worker-construction-brief/v1 | none:- | - | 0 | 0 | n/a/n/a/n/a |
| 4 | derive_uat_testcases_surface | workspace://.ai-workspace/runtime/odd_sdlc/operator-runs/20260518T114720073Z_pid75297/worker_construction_brief.json | sha256:58d0f6fa685b8dcec1c794e9bf6e7c11f9bf7eb0ea9aba0770f93fef14208456 | file:///Users/jim/src/apps/odd_sdlc/build_tenants/typescript/test_env/test_runs/scenario_t132_hello_world_js_live/20260518T114036171Z_pid75297/workspace/.ai-workspace/runtime/odd_sdlc/operator-runs/20260518T114720073Z_pid75297/worker_prompt.md | policy://odd-sdlc/worker-prompt-source/worker-construction-brief/v1 | none:- | - | 0 | 0 | n/a/n/a/n/a |
| 5 | derive_testcase_authority_surface | workspace://.ai-workspace/runtime/odd_sdlc/operator-runs/20260518T114850598Z_pid75297/worker_construction_brief.json | sha256:7d6d5fdd4017d7a569383016fb109bbec1934d8d4ea85905d7933d3b36b8fd68 | file:///Users/jim/src/apps/odd_sdlc/build_tenants/typescript/test_env/test_runs/scenario_t132_hello_world_js_live/20260518T114036171Z_pid75297/workspace/.ai-workspace/runtime/odd_sdlc/operator-runs/20260518T114850598Z_pid75297/worker_prompt.md | policy://odd-sdlc/worker-prompt-source/worker-construction-brief/v1 | none:- | - | 0 | 0 | n/a/n/a/n/a |
| 6 | derive_feature_decomp_surface | workspace://.ai-workspace/runtime/odd_sdlc/operator-runs/20260518T115054013Z_pid75297/worker_construction_brief.json | sha256:86acd217081d35b44b902a9107253865a10d9b62765febcdf9db0c415464ebd6 | file:///Users/jim/src/apps/odd_sdlc/build_tenants/typescript/test_env/test_runs/scenario_t132_hello_world_js_live/20260518T114036171Z_pid75297/workspace/.ai-workspace/runtime/odd_sdlc/operator-runs/20260518T115054013Z_pid75297/worker_prompt.md | policy://odd-sdlc/worker-prompt-source/worker-construction-brief/v1 | none:- | - | 0 | 0 | n/a/n/a/n/a |
| 7 | derive_design_surface | workspace://.ai-workspace/runtime/odd_sdlc/operator-runs/20260518T115233274Z_pid75297/worker_construction_brief.json | sha256:61c6482f3a4c8c879aafc611fa901c63e5a13a9817bc3119c776c658d1aaf9aa | file:///Users/jim/src/apps/odd_sdlc/build_tenants/typescript/test_env/test_runs/scenario_t132_hello_world_js_live/20260518T114036171Z_pid75297/workspace/.ai-workspace/runtime/odd_sdlc/operator-runs/20260518T115233274Z_pid75297/worker_prompt.md | policy://odd-sdlc/worker-prompt-source/worker-construction-brief/v1 | none:- | - | 0 | 0 | n/a/n/a/n/a |
| 8 | derive_scenario_surface | workspace://.ai-workspace/runtime/odd_sdlc/operator-runs/20260518T115430139Z_pid75297/worker_construction_brief.json | sha256:51faceb086f2ec36dea525fda6dd72d0f1f4381152fc3fcec2887ffc4252aa42 | file:///Users/jim/src/apps/odd_sdlc/build_tenants/typescript/test_env/test_runs/scenario_t132_hello_world_js_live/20260518T114036171Z_pid75297/workspace/.ai-workspace/runtime/odd_sdlc/operator-runs/20260518T115430139Z_pid75297/worker_prompt.md | policy://odd-sdlc/worker-prompt-source/worker-construction-brief/v1 | none:- | - | 0 | 0 | n/a/n/a/n/a |
| 9 | derive_implementation_design_surface | workspace://.ai-workspace/runtime/odd_sdlc/operator-runs/20260518T115646069Z_pid75297/worker_construction_brief.json | sha256:9904cefd3e4a274f908dfefcef832e6cfa3d44a6b23935e012293dcdf75ecc41 | file:///Users/jim/src/apps/odd_sdlc/build_tenants/typescript/test_env/test_runs/scenario_t132_hello_world_js_live/20260518T114036171Z_pid75297/workspace/.ai-workspace/runtime/odd_sdlc/operator-runs/20260518T115646069Z_pid75297/worker_prompt.md | policy://odd-sdlc/worker-prompt-source/worker-construction-brief/v1 | none:- | - | 0 | 0 | n/a/n/a/n/a |
| 10 | derive_component_code_surface | workspace://.ai-workspace/runtime/odd_sdlc/operator-runs/20260518T115950849Z_pid75297/worker_construction_brief.json | sha256:684643dcdf9975a409fd610f4fafaca9cbf00bb0c6d9d79c4575493553aa2255 | file:///Users/jim/src/apps/odd_sdlc/build_tenants/typescript/test_env/test_runs/scenario_t132_hello_world_js_live/20260518T114036171Z_pid75297/workspace/.ai-workspace/runtime/odd_sdlc/operator-runs/20260518T115950849Z_pid75297/worker_prompt.md | policy://odd-sdlc/worker-prompt-source/worker-construction-brief/v1 | none:- | - | 0 | 0 | n/a/n/a/n/a |
| 11 | qualify_component_realization_surface | workspace://.ai-workspace/runtime/odd_sdlc/operator-runs/20260518T120149365Z_pid75297/worker_construction_brief.json | sha256:ebcdc30b3711c3f09dee4a1e6cfd15e240059f352dba67f50d0532041d155f10 | file:///Users/jim/src/apps/odd_sdlc/build_tenants/typescript/test_env/test_runs/scenario_t132_hello_world_js_live/20260518T114036171Z_pid75297/workspace/.ai-workspace/runtime/odd_sdlc/operator-runs/20260518T120149365Z_pid75297/worker_prompt.md | policy://odd-sdlc/worker-prompt-source/worker-construction-brief/v1 | none:- | - | 0 | 0 | n/a/n/a/n/a |
| 12 | derive_code_surface | workspace://.ai-workspace/runtime/odd_sdlc/operator-runs/20260518T120351170Z_pid75297/worker_construction_brief.json | sha256:04fac1b30670118a513797204cf6b62d1240c6bff6ec828fc64ad941c7b20bad | file:///Users/jim/src/apps/odd_sdlc/build_tenants/typescript/test_env/test_runs/scenario_t132_hello_world_js_live/20260518T114036171Z_pid75297/workspace/.ai-workspace/runtime/odd_sdlc/operator-runs/20260518T120351170Z_pid75297/worker_prompt.md | policy://odd-sdlc/worker-prompt-source/worker-construction-brief/v1 | none:- | - | 0 | 0 | n/a/n/a/n/a |
| 13 | derive_test_design_surface | workspace://.ai-workspace/runtime/odd_sdlc/operator-runs/20260518T120659398Z_pid75297/worker_construction_brief.json | sha256:54ca9d30bf452dd98cd5759647cd627ad925aef237e0bf283d670072df509a86 | file:///Users/jim/src/apps/odd_sdlc/build_tenants/typescript/test_env/test_runs/scenario_t132_hello_world_js_live/20260518T114036171Z_pid75297/workspace/.ai-workspace/runtime/odd_sdlc/operator-runs/20260518T120659398Z_pid75297/worker_prompt.md | policy://odd-sdlc/worker-prompt-source/worker-construction-brief/v1 | none:- | - | 0 | 0 | n/a/n/a/n/a |
| 14 | derive_component_test_surface | workspace://.ai-workspace/runtime/odd_sdlc/operator-runs/20260518T121059993Z_pid75297/worker_construction_brief.json | sha256:2f394d8a81b5dcbab20ef9c1a3efaaee170b8dc0158b6fa210241bf4d6107457 | file:///Users/jim/src/apps/odd_sdlc/build_tenants/typescript/test_env/test_runs/scenario_t132_hello_world_js_live/20260518T114036171Z_pid75297/workspace/.ai-workspace/runtime/odd_sdlc/operator-runs/20260518T121059993Z_pid75297/worker_prompt.md | policy://odd-sdlc/worker-prompt-source/worker-construction-brief/v1 | none:- | - | 0 | 0 | n/a/n/a/n/a |
| 15 | prepare_test_execution_surface | workspace://.ai-workspace/runtime/odd_sdlc/operator-runs/20260518T121359639Z_pid75297/worker_construction_brief.json | sha256:117e26f3c4414e595df137000a26925ff73cdea6e348f839bdd819687e218564 | file:///Users/jim/src/apps/odd_sdlc/build_tenants/typescript/test_env/test_runs/scenario_t132_hello_world_js_live/20260518T114036171Z_pid75297/workspace/.ai-workspace/runtime/odd_sdlc/operator-runs/20260518T121359639Z_pid75297/worker_prompt.md | policy://odd-sdlc/worker-prompt-source/worker-construction-brief/v1 | none:- | - | 0 | 0 | n/a/n/a/n/a |
| 16 | derive_test_execution_result_surface | workspace://.ai-workspace/runtime/odd_sdlc/operator-runs/20260518T121646670Z_pid75297/worker_construction_brief.json | sha256:b396e0bba2f13f370d0521f1cc3e48853cf795c190e031f96aab1c1b78b7e419 | file:///Users/jim/src/apps/odd_sdlc/build_tenants/typescript/test_env/test_runs/scenario_t132_hello_world_js_live/20260518T114036171Z_pid75297/workspace/.ai-workspace/runtime/odd_sdlc/operator-runs/20260518T121646670Z_pid75297/worker_prompt.md | policy://odd-sdlc/worker-prompt-source/worker-construction-brief/v1 | graph_test_execution_result:succeeded | node --test test/hello.test.js | 4 | 1 | 1/1/0 |
| 17 | qualify_component_test_execution_surface | workspace://.ai-workspace/runtime/odd_sdlc/operator-runs/20260518T122258200Z_pid75297/worker_construction_brief.json | sha256:abb9bcd97cf71bd3fe12ab704039f9f3a102d6bc292cffabdd9a4040b1409006 | file:///Users/jim/src/apps/odd_sdlc/build_tenants/typescript/test_env/test_runs/scenario_t132_hello_world_js_live/20260518T114036171Z_pid75297/workspace/.ai-workspace/runtime/odd_sdlc/operator-runs/20260518T122258200Z_pid75297/worker_prompt.md | policy://odd-sdlc/worker-prompt-source/worker-construction-brief/v1 | none:- | - | 0 | 0 | n/a/n/a/n/a |
| 18 | derive_component_repair_schedule_surface | workspace://.ai-workspace/runtime/odd_sdlc/operator-runs/20260518T122601758Z_pid75297/worker_construction_brief.json | sha256:e4f622d1c8ebdbdc3547ebbad69f97ea2ccf807da6ed40aeb5b560ce92bd64c2 | file:///Users/jim/src/apps/odd_sdlc/build_tenants/typescript/test_env/test_runs/scenario_t132_hello_world_js_live/20260518T114036171Z_pid75297/workspace/.ai-workspace/runtime/odd_sdlc/operator-runs/20260518T122601758Z_pid75297/worker_prompt.md | policy://odd-sdlc/worker-prompt-source/worker-construction-brief/v1 | none:- | - | 0 | 0 | n/a/n/a/n/a |
| 19 | derive_component_repair_schedule_surface | workspace://.ai-workspace/runtime/odd_sdlc/operator-runs/20260518T122856561Z_pid75297/worker_construction_brief.json | sha256:62e9aeb48d928ecf046f87869b90ff260c919c9af27945844ef363efc446048f | file:///Users/jim/src/apps/odd_sdlc/build_tenants/typescript/test_env/test_runs/scenario_t132_hello_world_js_live/20260518T114036171Z_pid75297/workspace/.ai-workspace/runtime/odd_sdlc/operator-runs/20260518T122856561Z_pid75297/worker_prompt.md | policy://odd-sdlc/worker-prompt-source/worker-construction-brief/v1 | none:- | - | 0 | 0 | n/a/n/a/n/a |
| 20 | derive_component_repair_schedule_surface | workspace://.ai-workspace/runtime/odd_sdlc/operator-runs/20260518T123113901Z_pid75297/worker_construction_brief.json | sha256:e80a4e64cf02dbd1307deb9aa85b9015a1edafbf5f7de7467d1151c59d61d4c7 | file:///Users/jim/src/apps/odd_sdlc/build_tenants/typescript/test_env/test_runs/scenario_t132_hello_world_js_live/20260518T114036171Z_pid75297/workspace/.ai-workspace/runtime/odd_sdlc/operator-runs/20260518T123113901Z_pid75297/worker_prompt.md | policy://odd-sdlc/worker-prompt-source/worker-construction-brief/v1 | none:- | - | 0 | 0 | n/a/n/a/n/a |
| 21 | derive_test_run_archive_surface | workspace://.ai-workspace/runtime/odd_sdlc/operator-runs/20260518T123345679Z_pid75297/worker_construction_brief.json | sha256:0863f97af7fbe98217e7d6a1974c2324dbd85a608e7b5591099228f96c4f32b5 | file:///Users/jim/src/apps/odd_sdlc/build_tenants/typescript/test_env/test_runs/scenario_t132_hello_world_js_live/20260518T114036171Z_pid75297/workspace/.ai-workspace/runtime/odd_sdlc/operator-runs/20260518T123345679Z_pid75297/worker_prompt.md | policy://odd-sdlc/worker-prompt-source/worker-construction-brief/v1 | none:- | - | 0 | 0 | n/a/n/a/n/a |
| 22 | derive_release_depth_parity_surface | workspace://.ai-workspace/runtime/odd_sdlc/operator-runs/20260518T123733000Z_pid75297/worker_construction_brief.json | sha256:d2e23941283d49603df8b76b3d9e9dfff72ff089cb47b97ba531f0f14b68f9bb | file:///Users/jim/src/apps/odd_sdlc/build_tenants/typescript/test_env/test_runs/scenario_t132_hello_world_js_live/20260518T114036171Z_pid75297/workspace/.ai-workspace/runtime/odd_sdlc/operator-runs/20260518T123733000Z_pid75297/worker_prompt.md | policy://odd-sdlc/worker-prompt-source/worker-construction-brief/v1 | none:- | - | 0 | 0 | n/a/n/a/n/a |
| 23 | derive_release_depth_parity_surface | workspace://.ai-workspace/runtime/odd_sdlc/operator-runs/20260518T124112439Z_pid75297/worker_construction_brief.json | sha256:5dac96810d0377b0c23b1572d34d18ce5cebe538fa75a7f43abe99cec7f0ccb8 | file:///Users/jim/src/apps/odd_sdlc/build_tenants/typescript/test_env/test_runs/scenario_t132_hello_world_js_live/20260518T114036171Z_pid75297/workspace/.ai-workspace/runtime/odd_sdlc/operator-runs/20260518T124112439Z_pid75297/worker_prompt.md | policy://odd-sdlc/worker-prompt-source/worker-construction-brief/v1 | none:- | - | 0 | 0 | n/a/n/a/n/a |
| 24 | derive_release_depth_parity_surface | workspace://.ai-workspace/runtime/odd_sdlc/operator-runs/20260518T124304195Z_pid75297/worker_construction_brief.json | sha256:acae3a65f03242e3e8e870f6e0783b5d84def04d666e0976598ff817e74f9478 | file:///Users/jim/src/apps/odd_sdlc/build_tenants/typescript/test_env/test_runs/scenario_t132_hello_world_js_live/20260518T114036171Z_pid75297/workspace/.ai-workspace/runtime/odd_sdlc/operator-runs/20260518T124304195Z_pid75297/worker_prompt.md | policy://odd-sdlc/worker-prompt-source/worker-construction-brief/v1 | none:- | - | 0 | 0 | n/a/n/a/n/a |
| 25 | derive_release_depth_parity_surface | workspace://.ai-workspace/runtime/odd_sdlc/operator-runs/20260518T124427230Z_pid75297/worker_construction_brief.json | sha256:7b427ccc7b94b988394bf75bcf227c2913f83daa1781d9019a01414b27437088 | file:///Users/jim/src/apps/odd_sdlc/build_tenants/typescript/test_env/test_runs/scenario_t132_hello_world_js_live/20260518T114036171Z_pid75297/workspace/.ai-workspace/runtime/odd_sdlc/operator-runs/20260518T124427230Z_pid75297/worker_prompt.md | policy://odd-sdlc/worker-prompt-source/worker-construction-brief/v1 | none:- | - | 0 | 0 | n/a/n/a/n/a |
| 26 | derive_release_depth_parity_surface | workspace://.ai-workspace/runtime/odd_sdlc/operator-runs/20260518T124606975Z_pid75297/worker_construction_brief.json | sha256:7692329783923dbc9e40e1cce8677132943ec7d27de76867205640ac47c23b29 | file:///Users/jim/src/apps/odd_sdlc/build_tenants/typescript/test_env/test_runs/scenario_t132_hello_world_js_live/20260518T114036171Z_pid75297/workspace/.ai-workspace/runtime/odd_sdlc/operator-runs/20260518T124606975Z_pid75297/worker_prompt.md | policy://odd-sdlc/worker-prompt-source/worker-construction-brief/v1 | none:- | - | 0 | 0 | n/a/n/a/n/a |
| 27 | prepare_release_surface | workspace://.ai-workspace/runtime/odd_sdlc/operator-runs/20260518T124656017Z_pid75297/worker_construction_brief.json | sha256:ac68eb47793b7c6107b0a2ef932a0090c357b69ad4d4da571965fd4e76ca2048 | file:///Users/jim/src/apps/odd_sdlc/build_tenants/typescript/test_env/test_runs/scenario_t132_hello_world_js_live/20260518T114036171Z_pid75297/workspace/.ai-workspace/runtime/odd_sdlc/operator-runs/20260518T124656017Z_pid75297/worker_prompt.md | policy://odd-sdlc/worker-prompt-source/worker-construction-brief/v1 | none:- | - | 0 | 0 | n/a/n/a/n/a |

## Test35 Conceptual Stage Coverage

| test35 stage | expected edge | expected target | mapped edge | mapped target | class | runs |
| - | - | - | - | - | - | - |
| test35://stage/project-conformance | Fg_conform_project_authority | project_bootstrap_surface | - | - | missing | 0 |
| test35://stage/feature-decomposition | derive_feature_decomp_surface | feature_decomp_surface | derive_feature_decomp_surface | feature_decomp_surface | constructive | 1 |
| test35://stage/scenario-uat-pressure | derive_scenario_surface | scenario_surface | derive_scenario_surface | scenario_surface | constructive | 1 |
| test35://stage/uat-testcases | derive_uat_testcases_surface | uat_testcases_surface | derive_uat_testcases_surface | uat_testcases_surface | constructive | 1 |
| test35://stage/implementation-design | derive_implementation_design_surface | implementation_design_surface | derive_implementation_design_surface | implementation_design_surface | constructive | 1 |
| test35://stage/component-code | derive_component_code_surface | component_code_surface | derive_component_code_surface | component_code_surface | constructive | 1 |
| test35://stage/test-design | derive_test_design_surface | test_design_surface | derive_test_design_surface | test_design_surface | constructive | 1 |
| test35://stage/component-test | derive_component_test_surface | component_test_surface | derive_component_test_surface | component_test_surface | constructive | 1 |
| test35://stage/test-execution-prep | prepare_test_execution_surface | test_execution_surface | prepare_test_execution_surface | test_execution_surface | constructive | 1 |
| test35://stage/test-execution-result | derive_test_execution_result_surface | test_execution_result_surface | derive_test_execution_result_surface | test_execution_result_surface | constructive | 1 |
| test35://stage/test-run-archive | derive_test_run_archive_surface | test_run_archive_surface | derive_test_run_archive_surface | test_run_archive_surface | constructive | 1 |
| test35://stage/code-rollup | derive_code_surface | code_surface | derive_code_surface | code_surface | rollup | 1 |
| test35://stage/release-preparation | prepare_release_surface | release_surface | prepare_release_surface | release_surface | rollup | 1 |
| test35://stage/unmapped-runtime-edge | unmapped | unmapped | derive_intent_surface | intent_surface | unmapped | 1 |
| test35://stage/unmapped-runtime-edge | unmapped | unmapped | derive_product_surface | product_surface | unmapped | 1 |
| test35://stage/unmapped-runtime-edge | unmapped | unmapped | derive_goal_surface | goal_surface | unmapped | 1 |
| test35://stage/unmapped-runtime-edge | unmapped | unmapped | derive_requirement_surface | requirement_surface | unmapped | 1 |
| test35://stage/unmapped-runtime-edge | unmapped | unmapped | derive_testcase_authority_surface | testcase_authority_surface | unmapped | 1 |
| test35://stage/unmapped-runtime-edge | unmapped | unmapped | derive_design_surface | design_surface | unmapped | 1 |
| test35://stage/unmapped-runtime-edge | unmapped | unmapped | qualify_component_realization_surface | component_realization_qualification_surface | unmapped | 1 |
| test35://stage/unmapped-runtime-edge | unmapped | unmapped | qualify_component_test_execution_surface | component_test_qualification_surface | unmapped | 1 |
| test35://stage/unmapped-runtime-edge | unmapped | unmapped | derive_component_repair_schedule_surface | component_repair_schedule_surface | unmapped | 1 |
| test35://stage/unmapped-runtime-edge | unmapped | unmapped | derive_component_repair_schedule_surface | component_repair_schedule_surface | unmapped | 1 |
| test35://stage/unmapped-runtime-edge | unmapped | unmapped | derive_component_repair_schedule_surface | component_repair_schedule_surface | unmapped | 1 |
| test35://stage/unmapped-runtime-edge | unmapped | unmapped | derive_release_depth_parity_surface | release_depth_parity_surface | unmapped | 1 |
| test35://stage/unmapped-runtime-edge | unmapped | unmapped | derive_release_depth_parity_surface | release_depth_parity_surface | unmapped | 1 |
| test35://stage/unmapped-runtime-edge | unmapped | unmapped | derive_release_depth_parity_surface | release_depth_parity_surface | unmapped | 1 |
| test35://stage/unmapped-runtime-edge | unmapped | unmapped | derive_release_depth_parity_surface | release_depth_parity_surface | unmapped | 1 |
| test35://stage/unmapped-runtime-edge | unmapped | unmapped | derive_release_depth_parity_surface | release_depth_parity_surface | unmapped | 1 |

## Active-Run Liveness

- active operator-run: `file:///Users/jim/src/apps/odd_sdlc/build_tenants/typescript/test_env/test_runs/scenario_t132_hello_world_js_live/20260518T114036171Z_pid75297/workspace/.ai-workspace/runtime/odd_sdlc/operator-runs/20260518T124656017Z_pid75297`
- active edge: prepare_release_surface
- active vector: prepare_release_surface
- active target asset: release_surface
- worker pid: 44433
- process alive: false
- last event at: 294038
- last stdout at: 1779108710087.1868
- last heartbeat at: n/a
- heartbeat age: n/a
- max no-output gap: 30.0s
- archive growth: 0B/min
- productive signal: completed
- last blocking reason: none

## Runtime Artifact Gaps

none

## Diagnostics

| code | severity | edge | detail |
| - | - | - | - |
| product_lineage_missing | warn | - | product file package.json carries no canonical requirement lineage |
| repair_observed | warn | derive_component_repair_schedule_surface | derive_component_repair_schedule_surface reentered via repair |
| repair_observed | warn | derive_component_repair_schedule_surface | derive_component_repair_schedule_surface reentered via repair |
| repair_observed | warn | derive_release_depth_parity_surface | derive_release_depth_parity_surface reentered via repair |
| retry_observed | warn | derive_release_depth_parity_surface | derive_release_depth_parity_surface reentered via retry |
| blocked_attempt_observed | warn | derive_release_depth_parity_surface | derive_release_depth_parity_surface attempt blocked: worker_authority_read_outside_workspace,worker_authority_read_outside_workspace:worker_stdout.log:20.message.content[0].input.path=/Users/jim/src/apps/odd_sdlc/code/src; worker_stdout.log:22.message.content[0].input.path=/Users/jim/src/apps/odd_sdlc/code/src |
| worker_authority_read_outside_workspace_observed | warn | derive_release_depth_parity_surface | derive_release_depth_parity_surface read authority outside workspace 1 times |
| repair_observed | warn | derive_release_depth_parity_surface | derive_release_depth_parity_surface reentered via repair |
| retry_observed | warn | derive_release_depth_parity_surface | derive_release_depth_parity_surface reentered via retry |
| blocked_attempt_observed | warn | derive_release_depth_parity_surface | derive_release_depth_parity_surface attempt blocked: worker_authority_read_outside_workspace,worker_authority_read_outside_workspace:worker_stdout.log:28.message.content[0].input.path=/Users/jim/src/apps/odd_sdlc/build_tenants/typescript/code/src |
| worker_authority_read_outside_workspace_observed | warn | derive_release_depth_parity_surface | derive_release_depth_parity_surface read authority outside workspace 1 times |
| event_snapshot_volume_high | info | bootstrap_release_self_test | edge bootstrap_release_self_test event bytes 710649 exceeds 300000 |
| event_snapshot_volume_high | info | bootstrap_release_self_test | edge bootstrap_release_self_test event bytes 853282 exceeds 300000 |
| event_snapshot_volume_high | info | bootstrap_release_self_test | edge bootstrap_release_self_test event bytes 822875 exceeds 300000 |
| event_snapshot_volume_high | info | bootstrap_release_self_test | edge bootstrap_release_self_test event bytes 947968 exceeds 300000 |
| handoff_growth_suspicious | info | derive_uat_testcases_surface | edge derive_uat_testcases_surface handoff bytes 173712 exceeds 150000 |
| event_snapshot_volume_high | info | derive_uat_testcases_surface | edge derive_uat_testcases_surface event bytes 1532113 exceeds 300000 |
| handoff_growth_suspicious | info | derive_testcase_authority_surface | edge derive_testcase_authority_surface handoff bytes 180693 exceeds 150000 |
| event_snapshot_volume_high | info | derive_testcase_authority_surface | edge derive_testcase_authority_surface event bytes 2079449 exceeds 300000 |
| handoff_growth_suspicious | info | derive_feature_decomp_surface | edge derive_feature_decomp_surface handoff bytes 172836 exceeds 150000 |
| event_snapshot_volume_high | info | derive_feature_decomp_surface | edge derive_feature_decomp_surface event bytes 2036309 exceeds 300000 |
| handoff_growth_suspicious | info | derive_design_surface | edge derive_design_surface handoff bytes 196516 exceeds 150000 |
| event_snapshot_volume_high | info | derive_design_surface | edge derive_design_surface event bytes 2065791 exceeds 300000 |
| handoff_growth_suspicious | info | derive_scenario_surface | edge derive_scenario_surface handoff bytes 212221 exceeds 150000 |
| event_snapshot_volume_high | info | derive_scenario_surface | edge derive_scenario_surface event bytes 3095714 exceeds 300000 |
| handoff_growth_suspicious | info | derive_implementation_design_surface | edge derive_implementation_design_surface handoff bytes 289755 exceeds 150000 |
| event_snapshot_volume_high | info | derive_implementation_design_surface | edge derive_implementation_design_surface event bytes 2578701 exceeds 300000 |
| handoff_growth_suspicious | info | derive_component_code_surface | edge derive_component_code_surface handoff bytes 233614 exceeds 150000 |
| event_snapshot_volume_high | info | derive_component_code_surface | edge derive_component_code_surface event bytes 1949618 exceeds 300000 |
| handoff_growth_suspicious | info | qualify_component_realization_surface | edge qualify_component_realization_surface handoff bytes 255939 exceeds 150000 |
| event_snapshot_volume_high | info | qualify_component_realization_surface | edge qualify_component_realization_surface event bytes 2243071 exceeds 300000 |
| handoff_growth_suspicious | info | derive_code_surface | edge derive_code_surface handoff bytes 272007 exceeds 150000 |
| event_snapshot_volume_high | info | derive_code_surface | edge derive_code_surface event bytes 2767729 exceeds 300000 |
| handoff_growth_suspicious | info | derive_test_design_surface | edge derive_test_design_surface handoff bytes 339155 exceeds 150000 |
| event_snapshot_volume_high | info | derive_test_design_surface | edge derive_test_design_surface event bytes 3642552 exceeds 300000 |
| handoff_growth_suspicious | info | derive_component_test_surface | edge derive_component_test_surface handoff bytes 304181 exceeds 150000 |
| event_snapshot_volume_high | info | derive_component_test_surface | edge derive_component_test_surface event bytes 2743142 exceeds 300000 |
| handoff_growth_suspicious | info | prepare_test_execution_surface | edge prepare_test_execution_surface handoff bytes 319205 exceeds 150000 |
| event_snapshot_volume_high | info | prepare_test_execution_surface | edge prepare_test_execution_surface event bytes 2532789 exceeds 300000 |
| handoff_growth_suspicious | info | derive_test_execution_result_surface | edge derive_test_execution_result_surface handoff bytes 318378 exceeds 150000 |
| event_snapshot_volume_high | info | derive_test_execution_result_surface | edge derive_test_execution_result_surface event bytes 8292451 exceeds 300000 |
| handoff_growth_suspicious | info | qualify_component_test_execution_surface | edge qualify_component_test_execution_surface handoff bytes 324341 exceeds 150000 |
| event_snapshot_volume_high | info | qualify_component_test_execution_surface | edge qualify_component_test_execution_surface event bytes 3807106 exceeds 300000 |
| handoff_growth_suspicious | info | derive_component_repair_schedule_surface | edge derive_component_repair_schedule_surface handoff bytes 345362 exceeds 150000 |
| event_snapshot_volume_high | info | derive_component_repair_schedule_surface | edge derive_component_repair_schedule_surface event bytes 2327296 exceeds 300000 |
| handoff_growth_suspicious | info | derive_component_repair_schedule_surface | edge derive_component_repair_schedule_surface handoff bytes 1001909 exceeds 150000 |
| event_snapshot_volume_high | info | derive_component_repair_schedule_surface | edge derive_component_repair_schedule_surface event bytes 3136866 exceeds 300000 |
| handoff_growth_suspicious | info | derive_component_repair_schedule_surface | edge derive_component_repair_schedule_surface handoff bytes 1644767 exceeds 150000 |
| event_snapshot_volume_high | info | derive_component_repair_schedule_surface | edge derive_component_repair_schedule_surface event bytes 5200897 exceeds 300000 |
| handoff_growth_suspicious | info | derive_test_run_archive_surface | edge derive_test_run_archive_surface handoff bytes 370415 exceeds 150000 |
| event_snapshot_volume_high | info | derive_test_run_archive_surface | edge derive_test_run_archive_surface event bytes 3622291 exceeds 300000 |
| handoff_growth_suspicious | info | derive_release_depth_parity_surface | edge derive_release_depth_parity_surface handoff bytes 371163 exceeds 150000 |
| event_snapshot_volume_high | info | derive_release_depth_parity_surface | edge derive_release_depth_parity_surface event bytes 3469066 exceeds 300000 |
| handoff_growth_suspicious | info | derive_release_depth_parity_surface | edge derive_release_depth_parity_surface handoff bytes 1061721 exceeds 150000 |
| event_snapshot_volume_high | info | derive_release_depth_parity_surface | edge derive_release_depth_parity_surface event bytes 3297164 exceeds 300000 |
| handoff_growth_suspicious | info | derive_release_depth_parity_surface | edge derive_release_depth_parity_surface handoff bytes 1079076 exceeds 150000 |
| event_snapshot_volume_high | info | derive_release_depth_parity_surface | edge derive_release_depth_parity_surface event bytes 2128845 exceeds 300000 |
| handoff_growth_suspicious | info | derive_release_depth_parity_surface | edge derive_release_depth_parity_surface handoff bytes 1787488 exceeds 150000 |
| event_snapshot_volume_high | info | derive_release_depth_parity_surface | edge derive_release_depth_parity_surface event bytes 4459464 exceeds 300000 |
| handoff_growth_suspicious | info | derive_release_depth_parity_surface | edge derive_release_depth_parity_surface handoff bytes 1751478 exceeds 150000 |
| event_snapshot_volume_high | info | derive_release_depth_parity_surface | edge derive_release_depth_parity_surface event bytes 1706009 exceeds 300000 |
| handoff_growth_suspicious | info | prepare_release_surface | edge prepare_release_surface handoff bytes 403797 exceeds 150000 |
| event_snapshot_volume_high | info | prepare_release_surface | edge prepare_release_surface event bytes 5583079 exceeds 300000 |

## Bloat And Slope

- bytes/obligation: 1218325.14
- bytes/product file: 34925320.67
- bytes/edge: 3741998.64
- bytes/retry: 17462660.33
- lineage refs/product file: 1.67
- duplicate authority count: 0
- raw display-id requirement count: 0
- canonical requirement id count: 5

| # | edge | handoff | events | stdout | prompt/ctx |
| - | - | - | - | - | - |
| 0 | bootstrap_release_self_test | 73.4KiB | 694.0KiB | 114.3KiB | 49.9KiB |
| 1 | bootstrap_release_self_test | 92.0KiB | 833.3KiB | 166.4KiB | 58.5KiB |
| 2 | bootstrap_release_self_test | 104.0KiB | 803.6KiB | 169.1KiB | 59.9KiB |
| 3 | bootstrap_release_self_test | 117.9KiB | 925.8KiB | 201.8KiB | 63.6KiB |
| 4 | derive_uat_testcases_surface | 169.6KiB | 1.46MiB | 162.1KiB | 67.7KiB |
| 5 | derive_testcase_authority_surface | 176.5KiB | 1.98MiB | 203.2KiB | 68.8KiB |
| 6 | derive_feature_decomp_surface | 168.8KiB | 1.94MiB | 191.0KiB | 61.8KiB |
| 7 | derive_design_surface | 191.9KiB | 1.97MiB | 194.2KiB | 64.1KiB |
| 8 | derive_scenario_surface | 207.2KiB | 2.95MiB | 303.5KiB | 66.6KiB |
| 9 | derive_implementation_design_surface | 283.0KiB | 2.46MiB | 352.7KiB | 137.2KiB |
| 10 | derive_component_code_surface | 228.1KiB | 1.86MiB | 237.4KiB | 82.4KiB |
| 11 | qualify_component_realization_surface | 249.9KiB | 2.14MiB | 269.0KiB | 78.7KiB |
| 12 | derive_code_surface | 265.6KiB | 2.64MiB | 332.7KiB | 76.6KiB |
| 13 | derive_test_design_surface | 331.2KiB | 3.47MiB | 419.9KiB | 116.1KiB |
| 14 | derive_component_test_surface | 297.1KiB | 2.62MiB | 326.1KiB | 93.7KiB |
| 15 | prepare_test_execution_surface | 311.7KiB | 2.42MiB | 281.7KiB | 95.1KiB |
| 16 | derive_test_execution_result_surface | 310.9KiB | 7.91MiB | 325.7KiB | 91.6KiB |
| 17 | qualify_component_test_execution_surface | 316.7KiB | 3.63MiB | 364.2KiB | 87.7KiB |
| 18 | derive_component_repair_schedule_surface | 337.3KiB | 2.22MiB | 297.4KiB | 89.8KiB |
| 19 | derive_component_repair_schedule_surface | 978.4KiB | 2.99MiB | 473.5KiB | 125.9KiB |
| 20 | derive_component_repair_schedule_surface | 1.57MiB | 4.96MiB | 363.3KiB | 143.0KiB |
| 21 | derive_test_run_archive_surface | 361.7KiB | 3.45MiB | 460.2KiB | 92.9KiB |
| 22 | derive_release_depth_parity_surface | 362.5KiB | 3.31MiB | 463.7KiB | 91.3KiB |
| 23 | derive_release_depth_parity_surface | 1.01MiB | 3.14MiB | 377.2KiB | 127.1KiB |
| 24 | derive_release_depth_parity_surface | 1.03MiB | 2.03MiB | 343.8KiB | 127.3KiB |
| 25 | derive_release_depth_parity_surface | 1.70MiB | 4.25MiB | 403.4KiB | 158.1KiB |
| 26 | derive_release_depth_parity_surface | 1.67MiB | 1.63MiB | 231.0KiB | 141.8KiB |
| 27 | prepare_release_surface | 394.3KiB | 5.32MiB | 435.4KiB | 90.5KiB |

## Retry Forensics

| edge | attempt | predecessor | worker_s | blocking | lineage | outside_reads | schema_violations | cause |
| - | - | - | - | - | - | - | - | - |
| derive_component_repair_schedule_surface | file:///Users/jim/src/apps/odd_sdlc/build_tenants/typescript/test_env/test_runs/scenario_t132_hello_world_js_live/20260518T114036171Z_pid75297/workspace/.ai-workspace/runtime/odd_sdlc/operator-runs/20260518T122601758Z_pid75297 | file:///Users/jim/src/apps/odd_sdlc/build_tenants/typescript/test_env/test_runs/scenario_t132_hello_world_js_live/20260518T114036171Z_pid75297/workspace/.ai-workspace/runtime/odd_sdlc/operator-runs/20260518T122258200Z_pid75297 | 174.71 | - | unknown | 0 | 0 | unknown |
| derive_component_repair_schedule_surface | file:///Users/jim/src/apps/odd_sdlc/build_tenants/typescript/test_env/test_runs/scenario_t132_hello_world_js_live/20260518T114036171Z_pid75297/workspace/.ai-workspace/runtime/odd_sdlc/operator-runs/20260518T122856561Z_pid75297 | file:///Users/jim/src/apps/odd_sdlc/build_tenants/typescript/test_env/test_runs/scenario_t132_hello_world_js_live/20260518T114036171Z_pid75297/workspace/.ai-workspace/runtime/odd_sdlc/operator-runs/20260518T122601758Z_pid75297 | 137.22 | - | unknown | 0 | 0 | unknown |
| derive_release_depth_parity_surface | file:///Users/jim/src/apps/odd_sdlc/build_tenants/typescript/test_env/test_runs/scenario_t132_hello_world_js_live/20260518T114036171Z_pid75297/workspace/.ai-workspace/runtime/odd_sdlc/operator-runs/20260518T123733000Z_pid75297 | file:///Users/jim/src/apps/odd_sdlc/build_tenants/typescript/test_env/test_runs/scenario_t132_hello_world_js_live/20260518T114036171Z_pid75297/workspace/.ai-workspace/runtime/odd_sdlc/operator-runs/20260518T123345679Z_pid75297 | 219.33 | - | unknown | 0 | 0 | unknown |
| derive_release_depth_parity_surface | file:///Users/jim/src/apps/odd_sdlc/build_tenants/typescript/test_env/test_runs/scenario_t132_hello_world_js_live/20260518T114036171Z_pid75297/workspace/.ai-workspace/runtime/odd_sdlc/operator-runs/20260518T124112439Z_pid75297 | file:///Users/jim/src/apps/odd_sdlc/build_tenants/typescript/test_env/test_runs/scenario_t132_hello_world_js_live/20260518T114036171Z_pid75297/workspace/.ai-workspace/runtime/odd_sdlc/operator-runs/20260518T123733000Z_pid75297 | 111.63 | worker_authority_read_outside_workspace,worker_authority_read_outside_workspace:worker_stdout.log:20.message.content[0].input.path=/Users/jim/src/apps/odd_sdlc/code/src; worker_stdout.log:22.message.content[0].input.path=/Users/jim/src/apps/odd_sdlc/code/src | unknown | 1 | 0 | worker_policy_violation |
| derive_release_depth_parity_surface | file:///Users/jim/src/apps/odd_sdlc/build_tenants/typescript/test_env/test_runs/scenario_t132_hello_world_js_live/20260518T114036171Z_pid75297/workspace/.ai-workspace/runtime/odd_sdlc/operator-runs/20260518T124304195Z_pid75297 | file:///Users/jim/src/apps/odd_sdlc/build_tenants/typescript/test_env/test_runs/scenario_t132_hello_world_js_live/20260518T114036171Z_pid75297/workspace/.ai-workspace/runtime/odd_sdlc/operator-runs/20260518T124112439Z_pid75297 | 82.92 | - | unknown | 0 | 0 | unknown |
| derive_release_depth_parity_surface | file:///Users/jim/src/apps/odd_sdlc/build_tenants/typescript/test_env/test_runs/scenario_t132_hello_world_js_live/20260518T114036171Z_pid75297/workspace/.ai-workspace/runtime/odd_sdlc/operator-runs/20260518T124427230Z_pid75297 | file:///Users/jim/src/apps/odd_sdlc/build_tenants/typescript/test_env/test_runs/scenario_t132_hello_world_js_live/20260518T114036171Z_pid75297/workspace/.ai-workspace/runtime/odd_sdlc/operator-runs/20260518T124304195Z_pid75297 | 99.05 | worker_authority_read_outside_workspace,worker_authority_read_outside_workspace:worker_stdout.log:28.message.content[0].input.path=/Users/jim/src/apps/odd_sdlc/build_tenants/typescript/code/src | unknown | 1 | 0 | worker_policy_violation |

## Summary Drift

no summary file present
