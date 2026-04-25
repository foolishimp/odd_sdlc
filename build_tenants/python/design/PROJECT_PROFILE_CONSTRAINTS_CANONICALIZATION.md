# Project Profile Constraints Canonicalization

**Status**: Ratified
**Implements**: REQ-F-ODDSDLC-027, REQ-F-ODDSDLC-028, REQ-F-ODDSDLC-032
**Tickets**: B-056, B-060, B-063

## Claim

Raw `.ai-workspace/context/project_constraints.yml` is input only. Runtime,
analysis, capability gates, route selection, and prompt context consume the
canonical `ProjectProfile` and its workspace-state projection.

## Admission

The project-profile admission path accepts two raw shapes when their tenant
truth is unambiguous:

- v3.1 `build_tenants.<tenant>` registry with `active_tenant`
- v3.2 `structure.design_tenants[]`

Both shapes normalize to the same carrier fields:

- tenant name
- declared output directory
- technology execution contracts
- tenant capability contracts
- module structure
- root code policy

Malformed or empty constraint input remains a normalization defect and fails
closed before runtime traversal.

## Execution Contract Inference

The admission path may infer canonical execution contracts only from selected
tenant truth and unambiguous imported cues.

Admitted inference inputs are:

- selected tenant name
- selected tenant language
- selected tenant build tool
- selected tenant capability contracts
- explicit `test_runner`
- imported source text cues for named runtime observation systems

Examples:

- a selected Scala/Spark tenant with `fat_jar: true` admits
  `build_execution_contract: "sbt clean assembly"`
- a selected Scala/Spark tenant admits `test_execution_contract: "sbt test"`
  when no stronger explicit test execution contract is present
- `spark_submit_compatible: true` admits
  `deployment_contract: "spark-submit"`
- imported OpenLineage source text admits
  `runtime_observation_contract: "OpenLineage"`

Inline comments, empty strings, and prose placeholders are not executable
contracts. They are stripped or normalized before inference. If the remaining
selected tenant truth is insufficient, the execution contract remains
`undeclared` and capability-gated execution edges stay open with a deterministic
reason.

## Migration Rule

Legacy `build_tenants:` registries are projected into current
`structure.design_tenants[]` form during normalization. Capability contracts
are preserved under the selected tenant instead of being dropped or
reinterpreted downstream.

For both accepted raw shapes, execution-contract inference is written into the
normalized constraint surface during admission. That keeps
`.ai-workspace/context/project_constraints.yml`, `ProjectProfile`,
workspace-state capability projection, and ambiguity reports on the same
declared-or-undeclared truth. Runtime consumers read the admitted
`ProjectProfile` fields and do not perform data-mapper-specific cue
interpretation.

Consumers must not branch on raw YAML shape. Shape compatibility ends at
project-profile admission.
