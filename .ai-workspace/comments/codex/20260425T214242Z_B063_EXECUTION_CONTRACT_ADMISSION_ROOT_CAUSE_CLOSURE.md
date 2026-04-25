# B-063 Execution Contract Admission Root Cause Closure

## Claim

The residual RC failure was not a new data_mapper product bug. It was an
admission-boundary split between the normalized constraint read model and the
runtime `ProjectProfile`.

## Root Cause

The legacy v3.1 `build_tenants:` normalization path already applied selected
tenant execution-contract inference and wrote the admitted contracts into
`.ai-workspace/context/project_constraints.yml`.

The direct v3.2 `structure.design_tenants[]` normalization path did not. It
rewrote empty fields to:

- `build_execution_contract: "undeclared"`
- `test_execution_contract: "undeclared"`
- `deployment_contract: "undeclared"`
- `runtime_observation_contract: "undeclared"`

Then `load_project_profile()` parsed the same normalized YAML and inferred
build/test capability from selected Scala and `test_runner: "sbt test"`.

That made the surfaces disagree:

- normalized YAML said build/test were undeclared
- runtime `ProjectProfile` said build/test were declared
- ambiguity tests expected missing build/test capability
- operational code saw declared build/test capability

## Fix

Normalization now calls the same execution-contract inference for the direct
v3.2 shape and writes the admitted values into the normalized constraint
surface before downstream runtime projection.

For the minimal imported Scala/sbt workspace:

- build infers to `sbt compile`
- test infers to `sbt test`
- deployment remains `undeclared`
- runtime observation remains `undeclared`

For the full data_mapper template:

- build remains `sbt clean assembly`
- test remains `sbt test`
- deployment remains `spark-submit`
- runtime observation remains `OpenLineage`

## Secondary Correction

Once build/test admission became consistent, the release operational executive
was too eager: partial build/test capability could publish
`release_operational_cycle` even when deployment/runtime were still undeclared.

That was corrected by making `release_operational_cycle` publish only when all
four operational families are declared:

- build execution
- test execution
- deployment
- runtime observation

Individual missing deployment/runtime gaps still project; the executive no
longer implies a complete operational lane under partial capability.

## Confidence

This fix improves confidence in odd_method because it moves truth to the right
boundary:

- raw YAML shape compatibility ends at admission
- inference happens once during normalization/admission
- `ProjectProfile`, workspace state, ambiguity register, and query surfaces no
  longer compute competing capability truth
- valid imported data_mapper intent routes directly instead of pausing at a
  synthetic constitutional FH gate
- malformed imported intent still has a separate FH-gated proof path

## Proof

- `test_odd_sdlc_installation.py` full suite:
  `41 passed, 2 skipped`
- capability-gating use case:
  `2 passed`
- B-060/source profile focused set:
  `3 passed, 121 deselected`
- sandbox focused valid-template/contract repairs:
  focused reruns passed
- clean data_mapper template install:
  `/tmp/odd_sdlc_b063_data_mapper_20260425T211018Z`
- clean installed bare gaps:
  `analysis_kind: odd_sdlc.operator_gap_analysis`,
  frontier `derive_intent_surface`, route `advance_fixed_vector`
