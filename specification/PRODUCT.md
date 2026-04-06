# odd_method Product

**Status**: Active
**Derived From**: [GOALS.md](./GOALS.md),
[INTENT.md](./INTENT.md),
`.genesis/docs/standards/SPEC_METHOD.md`
**Purpose**: Define the current product realization and product terms for
`odd_method`

## Product Position

`odd_method` is an installed outcome-driven development product.

It provides an outcome-driven development domain expressed through GTL and
executed through ABG.

It gives a project a lawful way to declare:

- outcomes
- outcome transitions
- graph functions
- policy over evaluation and escalation
- evidence and proving lanes

It adopts a singleton constitutional specification together with a standard
project-owned realization topology rooted in `build_tenants/`.

## Product Terms

### Outcome-Driven Development

A graph-native development method where declared outcomes and lawful transitions
govern delivery, evidence, and repricing.

### Outcome

A declared product state that has explicit meaning and explicit closure
expectations.

### Asset

A named durable surface of product truth or produced delivery state.

### Requirement Family Surface

The folderized asset surface rooted at `specification/requirements/` that
carries live requirement truth as separate family files.

### Graph Function

The executable constructive carrier over declared graph contracts.

### Input Set

A bounded set of imported or authored source surfaces supplied to a graph
function boundary.

### Work Vector

A named productized work capability over one graph function or one lawful graph
function composition.

A work vector is not a second executor. It is the product/method view over the
same underlying graph-function carrier.

### Runtime Fact

An event or equivalent substrate truth emitted by ABG during traversal and
execution.

### Policy Surface

A declarative configuration surface that constrains evaluation, escalation,
worker/backend selection, or closure expectations without redefining graph law.

## Goal Model

`GOALS.md` focuses one bounded wave of work.

Goals orient current repricing and bootstrap activity.

Intent sets direction.

Product defines the current realization being built.

Requirements then decompose that product realization into constitutional truth.

## Product End State

The intended end-state product shape is:

1. install `odd_method` clean as a GTL/ABG-native product
2. author project-owned intent, product, and requirements surfaces
3. maintain project-owned realization structure beneath `build_tenants/`
4. keep design under `build_tenants/common/design/` or a tenant-local
   `build_tenants/<tenant>/design/` root rather than under `specification/`
5. keep shared bootstrap realization law in `build_tenants/common/` until real
   tenant-local divergence appears
6. publish graph functions and lawful higher-order compositions directly over
   GTL
7. execute through ABG without a product-local shadow runtime
8. prove capability claims through written scenario bundles and installed-dev
   qualification

## Current Product Definition

The current product definition of `odd_method` is:

- a fresh constitutional line
- an outcome-driven development product
- lightweight by design
- graph-function-first in execution
- beginning from an explicit bootstrap asset set and recursive edge contracts
- subordinate to GTL and ABG for runtime substrate truth
- standardized on the `build_tenants/` realization model from bootstrap
- currently using `build_tenants/common/` as the only active realization root
- explicit in adoption of any carried-forward truth

The current bootstrap asset graph is:

- `{input_set} -> {specification/INTENT.md}`
- `{input_set} -> {specification/PRODUCT.md}`
- `{input_set, specification/INTENT.md, specification/PRODUCT.md} -> {specification/requirements/}`

The current bootstrap focus is to establish the live constitutional and
realization topology before deriving code.
