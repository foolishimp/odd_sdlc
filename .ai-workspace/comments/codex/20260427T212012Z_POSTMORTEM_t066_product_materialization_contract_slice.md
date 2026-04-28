# T-066 Product Materialization Contract Slice Postmortem

## Current Verdict

`T-066` is not closed, but the first serious false-positive is now blocked.

Before this slice, `derive_code_surface` could pass by producing only
`code_surface.md` under `.ai-workspace/runtime/odd_sdlc/assets`. The installed
graph could then converge without any downstream product source tree. That was
the core RC failure.

Now the installed operator handoff carries a product materialization contract.
`code_surface` requires a materialized `source` file. `test_module_surface`
requires a materialized `test` file. Postflight rejects markdown-only output for
those realization edges.

## Bugs Found

| Severity | Bug | Status | Evidence |
| --- | --- | --- | --- |
| Critical | Product realization edges accepted markdown-only runtime surfaces as implementation evidence. | Fixed for first contract slice; `T-066` remains open for full data_mapper quality/depth. | `npm run test:t066`, markdown-only negative test. |
| High | Installed project constraints defaulted `selectedOutputRoot` to `build_tenants/typescript` even when `active_tenant: scala_spark` was set and no top-level `selected_output_root` existed. | Fixed. Default is now `build_tenants/<activeTenant>`. | `data_mapper.test47.ts` exposed wrong root; `data_mapper.test48.ts` proves corrected root. |
| Medium | The smoke worker can prove contract mechanics but not product-quality depth comparable to `test35`. | Open. | `T-066` remains `in_progress`; full live F_P data_mapper run still required. |

## Code Changes

- `operator/carriers.ts`
  - added `SdlcProductMaterializationContract`
  - added `SdlcMaterializedProductFile`
  - extended worker manifests and reports with materialization truth
- `operator/handoff.ts`
  - derives required roles for realization targets
  - admits `materializedFiles`
  - rejects missing/out-of-root/digest-mismatched materialized files
  - archives `product_materialization_manifest.json`
- `operator/installed_operator.ts`
  - passes workspace project constraints into the handoff
  - archives materialization before postflight/constructor result
- `workspace/project_constraints.ts`
  - derives default output root from `active_tenant`
- `test_t066_product_materialization_contract.test.mjs`
  - proves tenant-root source materialization
  - proves markdown-only `code_surface` rejection

## Verification

Source verification:

- `npm run test:t066`: 2 passed
- `npm run test:t064`: 2 passed
- `npm run test:semantic`: 77 passed
- `npm run lint:semantic`: passed
- `npm run test:sandbox`: 6 passed

Installed smoke verification:

- workspace:
  `/Users/jim/src/apps/ai_sdlc_examples/local_projects/data_mapper/data_mapper.test48.ts`
- installed package:
  `@odd-sdlc/typescript-tenant@0.0.0-dev`
- ABG substrate:
  `@abiogenesis/typescript-tenant@3.4.0-rc.2`
- graph:
  `bootstrap_release_self_test`
- result:
  converged through vectors `0..17`

Materialized files:

- `build_tenants/scala_spark/src/main/scala/generated/DataMapper.scala`
- `build_tenants/scala_spark/src/test/scala/generated/DataMapperSpec.scala`

Key archives:

- code edge:
  `.ai-workspace/runtime/odd_sdlc/operator-runs/20260427T111948573Z_pid84859`
- test-module edge:
  `.ai-workspace/runtime/odd_sdlc/operator-runs/20260427T111949264Z_pid84943`

Both archives include `product_materialization_manifest.json` with
`selectedOutputRoot: build_tenants/scala_spark`.

## Remaining RC Gap

This proves the product-materialization carrier and rejection rule. It does not
yet prove that odd_sdlc.TS can generate the real `data_mapper` enterprise-depth
implementation. The next `T-066` step is a live F_P data_mapper run using this
contract, where the generated inventory must be materially non-trivial and
qualification evidence must execute against it.
