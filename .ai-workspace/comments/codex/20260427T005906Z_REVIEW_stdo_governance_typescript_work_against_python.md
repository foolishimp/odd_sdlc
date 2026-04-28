# STDO Review: odd_sdlc TypeScript Work Against Python Baseline

**Status**: Review  
**Date**: 2026-04-27  
**Reviewer**: codex  
**Scope**: `odd_sdlc/build_tenants/typescript` under STDO governance, compared with `odd_sdlc/build_tenants/python` as reference implementation and cautionary baseline.

## Findings

### 1. High: bounded TypeScript RC is supportable, but full Python replacement remains unproved at multi-edge data_mapper depth.

The current TypeScript line is lawful as a bounded ODD-native package RC. The RC report states that boundary clearly: strict build, graph publication, pure ingress, query projections, public ABG handoff, hook contracts, traceability, triage, operational projection, CLI, installed sandbox, package install/release, and one live external `F_P` data_mapper traversal are in scope. It also explicitly excludes "full operational Python replacement at Python historical multi-edge data_mapper realization depth" in `build_tenants/typescript/code/src/qualification/rc_qualification.ts:9` and `build_tenants/typescript/code/src/qualification/rc_qualification.ts:13`.

The open gap is behavioral depth. T-053 proves one live `derive_code_surface` edge over data_mapper. Python's richer historical data_mapper yield-chain proves multi-edge continuation depth, triage, proposal, and repeated run surfaces. The comparison document states this directly in `build_tenants/typescript/qualification/ODD_SDLC_TYPESCRIPT_LIVE_PYTHON_ARCHIVE_COMPARISON.md:24` and `build_tenants/typescript/qualification/ODD_SDLC_TYPESCRIPT_LIVE_PYTHON_ARCHIVE_COMPARISON.md:118`. T-041 keeps the final go/no-go open at `.ai-workspace/tickets/backlog/T-041-realize-typescript-full-operational-python-replacement-rc-lane.md:146`.

This is not a defect in the bounded RC claim. It is a release-governance defect if anyone closes T-041 as full replacement without either narrowing the claim or proving the multi-edge data_mapper bar.

### 2. High: graph-function purity is improved, but the reusable graph-program library is still a first slice.

ODD method requires typed assets, named graph functions, a GTL module, ABG-owned traversal truth, and minimal imperative adapter code. See `/Users/jim/src/apps/specification_methodology/specification/standards/ODD_METHOD.md:31`, `/Users/jim/src/apps/specification_methodology/specification/standards/ODD_METHOD.md:45`, and `/Users/jim/src/apps/specification_methodology/specification/standards/ODD_METHOD.md:507`.

The TypeScript tenant now publishes two reusable forms: `Fg_single_typed_traversal` and `Fg_ingress_project` in `build_tenants/typescript/code/src/graph/library.ts:8` and `build_tenants/typescript/code/src/graph/library.ts:11`. The module publishes these library functions, two executive programs, and product-specific leaf graph functions in `build_tenants/typescript/code/src/graph/module.ts:433`.

That is real progress. It is not yet the target ODD model. Product-specific leaf graph functions still dominate the operative graph, and the current executive programs are linear compositions over catalog slices. Future route binding, closure, operational return, traceability, release, and recursive realization should be lifted into reusable graph-program forms rather than growing more TypeScript helper orchestration.

### 3. Medium: the CLI adapter is correct for the current slice, but it is carrying too many module roles.

`build_tenants/typescript/code/src/cli/command.ts` owns command grammar, option parsing, workspace source discovery, constraint parsing, ingress construction, query-domain projection, gaps projection, start projection, install dispatch, release-cut dispatch, and result serialization. The role spread is visible across `build_tenants/typescript/code/src/cli/command.ts:40`, `build_tenants/typescript/code/src/cli/command.ts:192`, `build_tenants/typescript/code/src/cli/command.ts:338`, `build_tenants/typescript/code/src/cli/command.ts:383`, `build_tenants/typescript/code/src/cli/command.ts:427`, `build_tenants/typescript/code/src/cli/command.ts:452`, and `build_tenants/typescript/code/src/cli/command.ts:493`.

This is not currently a hidden traversal loop. The tests explicitly assert the CLI has no local iteration or direct ABG runner authority. But under Design Module Method, effect shells and adapters should convert external boundaries into carriers without inventing semantic law. See `/Users/jim/src/apps/specification_methodology/specification/standards/DESIGN_MODULE_METHOD.md:123` and `/Users/jim/src/apps/specification_methodology/specification/standards/DESIGN_MODULE_METHOD.md:681`.

The adapter should be split before it becomes the next monolith: command admission, workspace read adapter, read-only projection commands, start adapter, and side-effect install/release commands.

### 4. Medium: T-053 live proof admits a live returned asset, but it does not prove behavioral data_mapper sufficiency.

The live test is valuable. It provisions an ABG-installed workspace, reads the real data_mapper template, opens public start, dispatches Codex, observes returned files, admits a constructor result, and closes hook postflight. See `build_tenants/typescript/test_env/live/test_t053_live_fp_data_mapper.test.mjs:282` through `build_tenants/typescript/test_env/live/test_t053_live_fp_data_mapper.test.mjs:366`.

The acceptance bar is still single-edge and shape-oriented. The generated result admission requires a non-empty output file and digest in `build_tenants/typescript/test_env/live/test_t053_live_fp_data_mapper.test.mjs:217`. The work report admission checks kind, graph function name, target asset type, generated file path, and non-empty summary in `build_tenants/typescript/test_env/live/test_t053_live_fp_data_mapper.test.mjs:250`.

That proves live `F_P` boundary mechanics. It does not prove that the generated code compiles, passes tests, deepens across attempts, or realizes data_mapper to the Python test35/test45 behavioral bar. The review should continue to cite T-053 as live edge proof, not as external workload sufficiency.

### 5. Medium: package install and release-cut mechanics are sound but should probably be moved toward a common ABG package/archive substrate.

The TypeScript tenant now has real install/release surfaces. It packs the package, extracts it into a target workspace, links dependencies, binds binaries, invokes the ABG TypeScript installer, and writes manifest/bootstrap/normalization surfaces. See `build_tenants/typescript/code/src/package_binding/node_package.ts:129`, `build_tenants/typescript/code/src/package_binding/node_package.ts:165`, `build_tenants/typescript/code/src/package_binding/node_package.ts:224`, `build_tenants/typescript/code/src/package_binding/node_package.ts:253`, and `build_tenants/typescript/code/src/install/installer.ts:83`.

The boundary is currently acceptable because it is an effect shell. The global optimization is to stop every ODD product from owning its own Node package archive/install binding. ABG should own the reusable package/archive/install substrate where possible, with `odd_sdlc` supplying only product-level package identity and bootstrap guidance.

### 6. Low: archive evidence is useful but workspace growth needs a retention rule.

Current evidence archives are large:

| Archive family | Local size |
|---|---:|
| latest T-053 live data_mapper archive | 6.8M |
| B-068 outcome iteration archives | 91M |
| T-047 pre-refactor sandbox archives | 45M |

The archive framework is doing its job, but package extracts and installed node trees will become noisy. Add a retention/compression rule before these archives become a practical review burden.

## Quantitative Summary

### Source Size

| Surface | Files | LOC | Avg LOC/file | Largest file |
|---|---:|---:|---:|---|
| TypeScript source | 60 | 8,810 | 146.8 | `qualification/enterprise_core_iteration_sandbox.ts` at 815 LOC |
| Python source | 53 | 29,473 | 556.1 | `constructor.py` at 3,097 LOC |
| TypeScript tests/docs under `test_env`, excluding `test_runs` | 25 | 5,416 | 216.6 | `sandbox/test_t047_pre_refactor_sandbox.test.mjs` at 644 LOC |
| Python tests under `test_env/tests` | 19 | 16,527 | 869.8 | `test_odd_sdlc_first_slice.py` at 6,246 LOC |
| TypeScript design and qualification docs | 20 | 2,322 | 116.1 | `ODD_SDLC_TYPESCRIPT_PYTHON_PARITY_RC_BLOCKER_MAP.md` at 296 LOC |
| Python design docs | 22 | 2,951 | 134.1 | `SOFTWARE_DOMAIN_BUILDOUT.md` at 642 LOC |

TypeScript source is about 70.1% smaller than Python source. Average TypeScript source file size is about 73.6% smaller than Python.

### TypeScript LOC By Module

| Module | Files | LOC | Role assessment |
|---|---:|---:|---|
| `qualification` | 5 | 1,488 | Proof and sandbox machinery, not core product runtime |
| `hooks` | 9 | 1,228 | Hook contracts, admission, policy, evaluators |
| `graph` | 4 | 1,004 | GTL catalog/module/library publication |
| `projection` | 3 | 889 | Query and requirement closure read models |
| `domain` | 5 | 883 | Typed carriers and domain admission |
| `cli` | 3 | 557 | Public command adapter, growing role spread |
| `triage` | 4 | 523 | Gap classification and route proposal |
| `workspace` | 6 | 506 | Ingress/source/lineage carriers |
| `start` | 3 | 341 | Public start projection |
| `install` | 4 | 317 | Side-effect install adapter |
| `package_binding` | 3 | 314 | Node package effect shell |
| `runtime` | 2 | 220 | ABG substrate binding |
| `operational` | 4 | 219 | Operational command/result/projection |
| `release` | 3 | 159 | Release-cut effect shell |
| `shared` | 1 | 106 | Shared validation |

Approximate TypeScript role split:

| Role bucket | LOC | Share |
|---|---:|---:|
| Declarative/outcome/domain/projection modules | 5,755 | 65.3% |
| Qualification and sandbox proof modules | 1,488 | 16.9% |
| Imperative/effect adapters | 1,567 | 17.8% |

### Python Largest Modules

| Python module | LOC | Review note |
|---|---:|---|
| `constructor.py` | 3,097 | Main constructive surface, far too broad as a design boundary |
| `gtl_module.py` | 2,231 | Contains graph truth, but much larger than TS graph publication |
| `gap_dossier.py` | 1,737 | Large read-model/projection surface |
| `project_profile.py` | 1,590 | Broad workspace/project interpretation |
| `triage.py` | 1,512 | Broad routing and classification logic |
| `normalization.py` | 1,380 | Side-effecting workspace normalization |
| `requirement_closure.py` | 1,360 | Large closure/evidence surface |
| `execution_contract.py` | 1,338 | Large contract/runtime seam |
| `runtime_event_contract.py` | 1,187 | Event contract surface |
| `workspace_assets.py` | 1,071 | Workspace effect and asset surface |

The Python implementation contains important discovered behavior, but its module boundaries are not the architecture target.

### Pattern Metrics

These are lexical proxies, not semantic proof. They are useful for relative shape.

| Metric | TypeScript count | TS per kLOC | Python count | Python per kLOC | Interpretation |
|---|---:|---:|---:|---:|---|
| Explicit loop lines | 45 | 5.1 | 768 | 26.1 | TS has much less loop-shaped control flow |
| Branch lines | 178 | 20.2 | 2,570 | 87.2 | TS has lower conditional density |
| Exception lines | 76 | 8.6 | 217 | 7.4 | Similar exception density, TS slightly higher |
| Mutation signal lines | 84 | 9.5 | 1,040 | 35.3 | TS has materially lower mutation density |
| Functional/declarative signal lines | 523 | 59.4 | 168 | 5.7 | TS has much higher declarative/functional signal density |
| Carrier/type signal lines | 1,647 | 186.9 | 289 | 9.8 | TS is carrier/type dominated by design |
| Effect signal lines | 15 | 1.7 | 335 | 11.4 | TS isolates side effects more aggressively |

### Test And Proof Coverage

| Lane | Current evidence | Result in this review |
|---|---|---|
| Semantic/unit/module-derived lane | `npm run test:semantic` | 73 passed |
| Sandbox lane | `npm run test:sandbox` | 6 passed |
| Lint lane | `npm run lint:semantic` | passed |
| Latest live `F_P` lane | `ODD_SDLC_TS_LIVE_FP=1 npm run test:live` latest accepted archive | passed in prior run, 149,907ms total, 148,813ms worker |
| Full Python replacement | T-041 | open |

Latest live archive inspected:

`build_tenants/typescript/test_env/test_runs/t053_live_data_mapper/20260426T183216072Z_pid7194/`

It records `@abiogenesis/typescript-tenant@3.4.0-rc.2`, event sequence `abg_installed_workspace -> public_start_projected -> external_fp_worker_dispatched -> worker_result_file_observed -> constructor_result_admitted -> hook_turn_closed`, 6 source inputs, 136 imported requirement authorities, and hook postflight `passed`.

## What Landed Well

1. The TypeScript tenant is much smaller, more typed, and more auditable than Python.
2. Hook contracts were split into carriers, admission, catalog, evaluators, policy, fixtures, and work-report projection. This directly addresses prior monolith pressure.
3. Query-domain structural drift is now tested against same-name/different-structure drift, not just missing functions.
4. B-068/B-069 now prove stateful handoff between attempts and exact ordered ABG runtime events. The prior critique that the sandbox only advanced by attempt index has been corrected in `build_tenants/typescript/code/src/qualification/enterprise_core_iteration_sandbox.ts:396` and tested in `build_tenants/typescript/test_env/sandbox/test_b068_enterprise_core_outcome_iteration.test.mjs:183`.
5. Sandboxes now require ABG-installed workspace evidence. That closes the earlier false confidence around source-local sandbox execution.
6. The docs now correctly classify `data_mapper` as an independent qualification workload, not `odd_sdlc` product scope.

## Method-Standard Optimizations

1. Add an RC quantitative review checklist to `TICKET_METHOD.md` or `RELEASE_METHOD.md`: source LOC, largest files, effect density, loop density, mutation density, carrier density, test counts, sandbox/live archive counts, and open non-claims.
2. Add an ODD "graph-function purity index": percentage of operative transitions with named graph functions, no hidden loop, no adapter-owned next-step decision, and explicit ABG continuation handoff.
3. Add a Design Module Method closure requirement for ODD products: every effect shell must prove it only transports/persists admitted facts and does not choose semantic target movement.
4. Define a proof ladder for ODD tenants: unit/module proof -> harnessed sandbox -> installed sandbox -> live single-edge -> live multi-edge -> independent workload sufficiency -> release cut.
5. Require archive retention policy once installed sandbox archives copy package payloads or node_modules trees.

## Broader Engineering Optimizations

1. Split `cli/command.ts` before it grows. Suggested cuts: command admission, workspace read adapter, read-only commands, start adapter, install command, release command.
2. Move reusable Node package pack/install/archive mechanics toward ABG or a shared build substrate. `odd_sdlc` should own product identity and bootstrap text, not generic package extraction law.
3. Build the next data_mapper proof as a multi-edge graph-program scenario:
   `Fg_ingress_project -> derive_code_surface -> derive_test_surface -> execute_test_surface -> evaluate_gap -> retry/continue`.
4. Raise live worker acceptance from "non-empty returned file plus report shape" to deterministic postflight evidence: compile, test report, generated source inventory, generated test inventory, and requirement trace.
5. Expand the reusable graph-function library beyond `Fg_single_typed_traversal` and `Fg_ingress_project` into closure, triage route binding, operational return, traceability, and release-cut graph forms.
6. Keep Python as behavioral archaeology, not migration architecture. Port discovered capability, not file structure.
7. Add a metrics script so future STDO reviews are reproducible instead of ad hoc shell counts.

## Bottom Line

The TypeScript work is a successful ODD-native consolidation relative to Python. It is smaller, more typed, more declarative, less imperative, and much easier to audit.

The remaining critical distinction is product claim scope. The current evidence supports bounded TypeScript package RC. It does not yet support full Python operational replacement if that claim includes Python's historical multi-edge data_mapper realization depth.
