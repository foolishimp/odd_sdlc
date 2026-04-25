# B-053 Bare Gaps Operator Analysis Closure

## Claim

B-053 is closed.

Bare `odd_sdlc gaps` now defaults to workspace scope and returns an
operator-facing analysis projected from the published gap dossier head.
Explicit raw machine output remains available through `odd_sdlc gaps --format
json`.

## Implemented Surface

- `gap_dossier.py` owns `project_operator_gap_analysis(...)`.
- `app.py` exposes `gap_operator_analysis(...)` as the app-level projection
  wrapper.
- `__main__.py` binds bare `gaps` to the operator projection and keeps the raw
  dossier behind explicit `--format json` / hidden `--raw`.
- installed `AGENTS.md`, `CLAUDE.md`, and `project_bootstrap.md` guidance now
  teach bare `gaps` as the normal operator path and `--format json` as the
  machine carrier.
- `specification/PRODUCT.md` and `build_tenants/python/design/GAP_ANALYSIS_DOSSIER.md`
  now describe the product/design boundary for the operator projection.

## Proof

Source proof:

```text
PYTHONPATH=/Users/jim/src/apps/abiogenesis/build_tenants/abiogenesis/python/code:/Users/jim/src/apps/odd_sdlc/build_tenants/python/code python -m pytest build_tenants/python/test_env/tests/test_odd_sdlc_first_slice.py -k 'operator_gap_analysis or cli_bare_gaps or cli_gaps_raw_json or cli_gaps_help or gaps_publishes_homeostatic'
6 passed, 118 deselected
```

Install proof:

```text
PYTHONPATH=/Users/jim/src/apps/abiogenesis/build_tenants/abiogenesis/python/code:/Users/jim/src/apps/odd_sdlc/build_tenants/python/code python -m pytest build_tenants/python/test_env/tests/test_odd_sdlc_installation.py -k 'deploys_runtime_contract_and_enables_odd_sdlc_gaps or exposes_public_odd_sdlc_start_contract'
2 passed, 41 deselected
```

Clean imported workspace proof:

```text
/tmp/odd_sdlc_b053_install_20260425T0715Z
```

The clean workspace was copied from `data_mapper.template`, installed from the
current source, then run through:

```text
PYTHONPATH=.genesis:.genesis/odd_sdlc/python/code python -m odd_sdlc gaps --workspace .
PYTHONPATH=.genesis:.genesis/odd_sdlc/python/code python -m odd_sdlc gaps --format json --workspace .
```

The default operator output returned:

- `analysis_kind=odd_sdlc.operator_gap_analysis`
- `scope=workspace`
- frontier `derive_intent_surface`
- blocker class `advance_fixed_vector`
- next step `odd_sdlc start --scope workspace --target next --until first_traversal`

The raw `--format json` dossier head matched the same frontier and route state.

## Residual Note

An intentionally broader install selection that included
`test_install_reports_named_capability_diagnostic_before_operational_traversal`
still fails on a stale capability expectation:

```text
profile.has_build_execution_capability() is True, expected False
```

That failure is outside the B-053 operator `gaps` contract. The B-053
source/install proofs listed above passed.
