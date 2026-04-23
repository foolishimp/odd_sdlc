---
id: B-050
title: Converge odd_sdlc to ADR-001 package-wide strict typing
type: bug
ticket_category: implementation_migration
migration_strategy: inside_out_hard_break
status: completed
goal: make-adr-001-package-wide-strict-typing-true-on-the-live-line
change_intent: ADR-001 now states the tenant law directly: the only lawful maximum-enforcement claim is package-wide `mypy` strictness for `odd_sdlc`. The current line still uses a transitional per-module allowlist and the package-wide proof command fails. This ticket removes that gap.
change_class: design_reframe
re_entry_point: design_surface
affected_boundary: `mypy.ini` plus every tenant-owned Python module reached by `python -m mypy --config-file mypy.ini -p odd_sdlc`, with the current failing slice centered on `__main__.py`, `constructor.py`, `fd_checks.py`, `normalization.py`, `operational_dispatch.py`, `sandbox_lifecycle.py`, `self_test.py`, and `release/install.py`
priority: high
triaged_at: 2026-04-23
created_at: 2026-04-23
updated_at: 2026-04-23
dependencies: ADR-001 active design law; B-043 active overlap on `operational_dispatch.py`
intake_source: ADR-001 conformance review on 2026-04-23 after tenant-wide strict migration across the previously enumerated module set
target_truth: `odd_sdlc` has one package-wide strict typing lane. `python -m mypy --config-file mypy.ini -p odd_sdlc` is green. `mypy.ini` enforces `strict = True` for `odd_sdlc.*` as one package rule, not as a tenant-local per-module allowlist. Tenant-local typing cheats are gone.
superseded_truth: the line can claim strong typing because many important modules are strict, while uncovered or still-failing tenant modules remain outside the package-wide proof lane.
closure_law: this ticket closes only when the tenant package passes `python -m mypy --config-file mypy.ini -p odd_sdlc`, `mypy.ini` uses one package-wide `odd_sdlc.*` strict rule, and no tenant-local `follow_imports = skip`, `ignore_missing_imports`, or uncovered-module loophole remains.
evaluation_criteria:
  - package-wide `odd_sdlc` typing proof is green
  - `mypy.ini` enforces one package-wide strict rule for `odd_sdlc.*`
  - tenant-local softening is gone; only foreign import softening remains
  - fixes are lawful seam closures, not `cast(...)`, `Any`, or `# type: ignore` suppression
proof_surface:
  - package-wide typing proof: `python -m mypy --config-file mypy.ini -p odd_sdlc`
  - structural proof that `mypy.ini` no longer uses per-module `odd_sdlc.*` strict entries as the primary enforcement shape
  - focused source/install proofs covering the touched semantic slices
non_closure_conditions:
  - `-p odd_sdlc` still fails
  - `mypy.ini` still depends on a tenant-local per-module allowlist as the primary enforcement shape
  - any `odd_sdlc.*` module still uses `follow_imports = skip` or `ignore_missing_imports`
  - fixes rely on semantic-center `Any`, `cast(...)`, or `# type: ignore`
  - closure is claimed while new tenant modules can still land outside the package-wide strict lane
---

## Why This Ticket Exists

ADR-001 is now explicit: the strongest lawful typing claim for this tenant is
package-wide strictness, not a selective strict subset.

The current line is better than it was, but it is not conformant yet. The live
package proof command still fails, and the config still expresses strictness as
an enumerated tenant-local allowlist instead of one package rule.

## Current Failing Surface

As of 2026-04-23, `python -m mypy --config-file mypy.ini -p odd_sdlc` reports
30 errors in these files:

- `build_tenants/python/code/odd_sdlc/__main__.py`
- `build_tenants/python/code/odd_sdlc/constructor.py`
- `build_tenants/python/code/odd_sdlc/fd_checks.py`
- `build_tenants/python/code/odd_sdlc/normalization.py`
- `build_tenants/python/code/odd_sdlc/operational_dispatch.py`
- `build_tenants/python/code/odd_sdlc/release/install.py`
- `build_tenants/python/code/odd_sdlc/sandbox_lifecycle.py`
- `build_tenants/python/code/odd_sdlc/self_test.py`

Those files are the minimum live conformance gap.

## Scope

In scope:

- package-wide strict conformance for `odd_sdlc`
- `mypy.ini` enforcement-shape convergence
- the eight currently failing tenant files
- any newly exposed tenant-owned module reached by the package proof command

Out of scope:

- softening ADR-001
- treating per-module strict success as closure evidence
- external namespace typing work outside tenant authority

## Trace Boundary

This ticket reads current repo-law truth from:

- `specification/GOALS.md`
- `specification/INTENT.md`
- `specification/PRODUCT.md`
- `specification/requirements/07-asset-typing-and-binding.md`
- `specification/requirements/12-declarative-operational-state-transitions.md`

This ticket reads current design truth from:

- `build_tenants/python/design/README.md`
- `build_tenants/python/design/adrs/ADR-001-maximum-enforceable-python-typing.md`
- `build_tenants/python/design/EXECUTION_CONTRACT_SOURCE_CARRIER.md`
- `build_tenants/python/design/QUERY_PLUGIN_CONTRACT.md`
- `build_tenants/python/design/START_TARGET_CATALOG_AND_ASSET_OWNERSHIP_INDEX.md`

This ticket reads current method-law truth from:

- `/Users/jim/src/apps/specification_methodology/specification/standards/SPEC_METHOD.md`
- `/Users/jim/src/apps/specification_methodology/specification/standards/ODD_METHOD.md`
- `/Users/jim/src/apps/specification_methodology/specification/standards/TICKET_METHOD.md`
- `/Users/jim/src/apps/specification_methodology/specification/standards/DESIGN_MODULE_METHOD.md`

## Migration Declaration

- old_truth_path: strict typing is expressed as a curated list of tenant-local modules while the package-wide proof command still fails
- new_truth_path: strict typing is expressed as one package rule over `odd_sdlc.*`, and the package proof command is green
- producers_old:
  - `mypy.ini` per-module `odd_sdlc.*` strict entries
  - the eight currently failing tenant files
- producers_new:
  - one package-wide `odd_sdlc.*` strict rule
  - the same tenant files, now lawful under the package proof lane
- consumers_old:
  - local typing claims and ticket closure notes that can cite only the enumerated subset
- consumers_new:
  - package-wide typing proof
  - tenant design law in ADR-001
  - future tickets that need one typing authority surface
- derived_surfaces:
  - package-wide `mypy` proof output
  - focused source/install proofs on touched semantic slices

## Migration Checklist

- [x] the failing package-wide proof command is captured in the ticket
- [x] the eight-file live conformance gap is named explicitly
- [x] `mypy.ini` is converged from per-module allowlist to package-wide strict rule
- [x] the package proof command is green
- [x] source/install proofs are rerun for any touched semantic slice
- [x] ticket wording and proof claims are reconciled before closure

## Functional Review Criteria

1. Does the tenant now have one package-wide strict typing authority surface?
2. Can a new `odd_sdlc.*` module land outside the strict lane without being caught?
3. Did each fix narrow/parse/prove shape lawfully, or did it suppress typing errors cosmetically?
4. Is the remaining softening limited to foreign imports outside tenant authority?
5. Does the config now say exactly what ADR-001 says?

## Evaluator Gate

### 1. Authority Seam Closure

- [x] typing authority is one package-wide lane, not a hand-picked module list
- [x] touched modules narrow dynamic input once at ingress instead of spreading `object`/`Any` through consumers
- [x] no touched module reopens typed carriers into open dict truth to satisfy `mypy`

### 2. Essential Carrier Consolidation

- [x] fixes reuse existing carriers or lawful subordinate helpers
- [x] no fragment classes are introduced just to satisfy typing
- [x] type helpers stay subordinate to the current carrier families

### 3. Typed Enforcement After Proof

- [x] `cast(...)`, `Any`, and `# type: ignore` are not used as semantic-center escape hatches
- [x] package-wide strict success comes from real narrowing and typed carriers
- [x] the package-wide proof command, not a curated subset, is the closure surface

## Typing Authority Role Matrix

| Surface | Role | Closure expectation |
| --- | --- | --- |
| `mypy.ini` | authoritative tenant typing policy | package-wide `odd_sdlc.*` strict rule |
| tenant-owned `odd_sdlc` modules | semantic producers/consumers | pass package-wide strict without tenant-local softening |
| foreign namespaces (`genesis.*`, `gtl.*`) | external import boundary | may remain softened until external type surfaces exist |
| source/install tests | downstream proof surfaces | prove touched semantic slices still behave lawfully |

## Concrete Change Inventory

- [x] `mypy.ini`
  - [x] replace tenant-local per-module `odd_sdlc.*` strict list with package-wide strict rule
  - [x] keep external-only softening limited to foreign namespaces
- [x] `build_tenants/python/code/odd_sdlc/__main__.py`
  - [x] remove `dict[str, Any]` assumptions about typed carrier returns
- [x] `build_tenants/python/code/odd_sdlc/constructor.py`
  - [x] type work-report helpers and summary reads lawfully
  - [x] close the current `workspace_assets` export/type drift
- [x] `build_tenants/python/code/odd_sdlc/fd_checks.py`
  - [x] add missing return annotations and lawful bounded-value narrowing
- [x] `build_tenants/python/code/odd_sdlc/normalization.py`
  - [x] replace object-shaped legacy dict coercions with real narrowing
- [x] `build_tenants/python/code/odd_sdlc/operational_dispatch.py`
  - [x] align current-state result types with the typed public-start family
- [x] `build_tenants/python/code/odd_sdlc/release/install.py`
  - [x] narrow JSON CLI reads lawfully
- [x] `build_tenants/python/code/odd_sdlc/sandbox_lifecycle.py`
  - [x] narrow JSON CLI reads lawfully
- [x] `build_tenants/python/code/odd_sdlc/self_test.py`
  - [x] stop treating typed start/gap results as `dict[str, Any]`
- [x] proofs
  - [x] package-wide typing proof
  - [x] focused source proofs for touched boundaries
  - [x] focused install proofs for touched boundaries

## Impacted Interface Review Checklist

- [ ] `mypy.ini` is reviewed as the single typing authority surface
- [ ] `__main__.py` CLI emission still handles typed query/gap/start results correctly
- [ ] `constructor.py` summary helpers stay within existing carrier law
- [ ] `operational_dispatch.py` does not regress B-043-owned seam work while becoming type-correct
- [ ] `self_test.py` remains aligned with B-044 route-law closure while becoming type-correct

## Proof Selector Plan

Structural selectors:

```bash
rg -n '\[mypy-odd_sdlc\.' mypy.ini
rg -n 'follow_imports = skip|ignore_missing_imports' mypy.ini
rg -n 'cast\(|# type: ignore|dict\[str, Any\]|Mapping\[str, object\]' \
  build_tenants/python/code/odd_sdlc/{__main__,constructor,fd_checks,normalization,operational_dispatch,sandbox_lifecycle,self_test}.py \
  build_tenants/python/code/odd_sdlc/release/install.py
```

Typing selector:

```bash
python -m mypy --config-file mypy.ini -p odd_sdlc
```

Planned source selector:

```bash
PYTHONPATH=/Users/jim/src/apps/abiogenesis/build_tenants/abiogenesis/python/code:build_tenants/python/code \
python -m pytest build_tenants/python/test_env/tests/test_odd_sdlc_first_slice.py -q \
  -k 'test_cli_query_domain_emits_typed_payload or test_cli_gaps_emits_typed_payload or test_cli_start_emits_typed_payload or test_operational_dispatch_preserves_typed_start_family'
```

Planned install selector:

```bash
PYTHONPATH=/Users/jim/src/apps/abiogenesis/build_tenants/abiogenesis/python/code:build_tenants/python/code \
python -m pytest build_tenants/python/test_env/tests/test_odd_sdlc_installation.py -q \
  -k 'test_data_mapper_realization_iteration_digest_reaches_second_dispatch or test_prepare_release_surface_declared_route_fails_closed_without_declaration'
```

## Initial Direction

1. make the eight-file live gap green without semantic-center cheats
2. switch `mypy.ini` to one package-wide `odd_sdlc.*` strict rule
3. rerun `python -m mypy --config-file mypy.ini -p odd_sdlc`
4. rerun focused source/install proofs on the touched semantic slices
5. do not claim closure until the package-wide lane, config shape, and proof notes all agree

## Closure Note

Converged on 2026-04-23.

Final proof surface:

- `python -m mypy --config-file mypy.ini -p odd_sdlc`
  - `Success: no issues found in 48 source files`
- source selector:
  - `python -m pytest build_tenants/python/test_env/tests/test_odd_sdlc_first_slice.py -q -k 'test_query_domain_exposes_domain_views_without_runtime_duplication or test_start_runs_through_declared_entry_and_emits_abg_facts or test_self_test_executes_the_current_executive_program'`
  - `3 passed, 92 deselected`
- install selector:
  - `python -m pytest build_tenants/python/test_env/tests/test_odd_sdlc_installation.py -q -k 'test_install_deploys_runtime_contract_and_enables_odd_sdlc_gaps or test_install_data_mapper_derive_code_surface_reenters_with_realization_iteration_continuity or test_query_domain_uses_explicit_workspace_root_when_called_outside_workspace'`
  - `3 passed, 33 deselected`

Final config shape:

- one package-wide `[mypy-odd_sdlc.*] strict = True` rule
- no tenant-local `odd_sdlc.*` allowlist remains
- foreign-only softening remains limited to `genesis.*` and `gtl.*`
