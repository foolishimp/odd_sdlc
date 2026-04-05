# ADR-002 - Graph-Function-First Carrier And Runtime Boundary

**Status**: Active
**Date**: 2026-04-05
**Implements**: REQ-F-GFUNC-001, REQ-F-GFUNC-002, REQ-F-GFUNC-003, REQ-F-GFUNC-004, REQ-F-RUNTIME-001, REQ-F-RUNTIME-002, REQ-F-RUNTIME-003, REQ-F-RUNTIME-004

## Context

The product direction for `odd_method` is lightweight and GTL/ABG-native.

The recent `genesis_sdlc` pressure case showed a bad boundary where product
code can become a shadow runtime after ABG dispatch.

At the same time, GTL already provides graph-function composition and recursion,
so a second execution primitive is unnecessary.

## Decision

`odd_method` adopts a graph-function-first runtime model.

The structural split is:

- GTL defines graph-function algebra and contracts
- ABG owns traversal, execution, and raw runtime fact truth
- `odd_method` publishes graph functions and may publish work vectors as
  productization over graph functions
- `odd_method` attaches policy declaratively and interprets substrate facts, but does
  not implement a second imperative runtime after dispatch

Work vectors are therefore a product/read model over graph functions or lawful
graph-function compositions.

They are not a separate executor.

The default constructive stance favors `F_P`.

`F_D` remains for cheap trustworthy checks.

`F_H` remains the governance escalation surface.

## Consequences

- graph functions remain the load-bearing carrier for execution investment
- composition and recursion stay first-class without inventing a rival runtime
- runtime failure and success facts stay attributable to ABG
- product policy remains visible without collapsing into imperative runtime code
