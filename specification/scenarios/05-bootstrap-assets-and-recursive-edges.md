# Scenario Bundle - Bootstrap Assets And Recursive Edges

**Validates**: REQ-F-ASSET-001, REQ-F-ASSET-002, REQ-F-ASSET-003, REQ-F-ASSET-004

**Purpose**: Prove that the bootstrap asset set and recursive graph contracts
are explicit.

## Scenario

Declare one bounded bootstrap `input_set`, publish one graph function
`{input_set} -> {specification/INTENT.md}`, publish one graph function
`{input_set} -> {specification/PRODUCT.md}`, then publish the downstream
requirements boundary
`{input_set, specification/INTENT.md, specification/PRODUCT.md} -> {specification/requirements/}`.

## Significant Paths

- publication path: the bootstrap asset set is explicit and inspectable
- intent path: one graph-function boundary publishes
  `{input_set} -> {specification/INTENT.md}`
- product path: one graph-function boundary publishes
  `{input_set} -> {specification/PRODUCT.md}`
- requirements path: one downstream graph-function boundary publishes
  `{input_set, specification/INTENT.md, specification/PRODUCT.md} -> {specification/requirements/}`
- decomposition path: requirements output is expressed as family files rather
  than one monolithic artifact
- recursive path: intent and product remain independently derivable upstream
  assets feeding the requirements boundary

## Expected Outcomes

1. the bootstrap asset set is named explicitly
2. the intent and product graph-function contracts are inspectable at the outer
   boundary
3. the downstream requirements contract is inspectable at the outer boundary
4. requirements output is rooted at `specification/requirements/` and
   folderized as requirement families
5. intent, product, and requirements remain one coherent downstream span
