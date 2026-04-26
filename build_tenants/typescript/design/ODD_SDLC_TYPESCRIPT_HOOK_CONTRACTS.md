# odd_sdlc TypeScript Hook Contracts

**Status**: Active
**Date**: 2026-04-26
**Implements**: REQ-F-ODDSDLC-013, REQ-F-ODDSDLC-014, REQ-F-ODDSDLC-015, REQ-F-ODDSDLC-017
**Derives From**: `ODD_SDLC_TYPESCRIPT_TENANT_DERIVATION.md`, `ODD_SDLC_TYPESCRIPT_TENANT_FIRST_SLICE_IACS.md`, `build_tenants/python/design/fp/DETERMINISTIC_REPAIR_FRONTIER.md`

## Position

The hook layer is SDLC-owned IoC for one ABG-selected edge. It is not graph
iteration, public start, or ticket routing.

The prime carrier is `SdlcWorkReport`. It carries the bounded proof that a
constructive turn produced or updated one governed target asset under a declared
contract.

The Python constructor, F_D checks, and repair frontier are behavior evidence.
They are not a module template. The TypeScript realization consolidates them
into one ODD hook-contract surface with separate preflight F_D, constructive
F_P result, and postflight F_D projections.

## Carrier Set

| Carrier | Role |
| --- | --- |
| `SdlcHookContract` | edge-class contract over source assets, target asset, F_D/F_P/F_H dependencies, work report, and closure policy |
| `SdlcHookInvocation` | admitted request from an ABG-selected edge to a tenant hook |
| `SdlcConstructorResult` | bounded F_P construction result before postflight acceptance |
| `SdlcGeneratedAssetAuthority` | graph-function authority for the generated target asset |
| `SdlcWorkReport` | machine-readable evidence returned to ABG/domain projections |
| `SdlcEvaluatorResult` | deterministic preflight or postflight result with blocking reasons |

## Evaluation Law

Preflight F_D checks binding, source presence, target contract, and F_P worker
contract readiness before construction.

Constructive F_P returns a constructor result and work report. It does not
select the next traversal.

Postflight F_D checks output identity, target binding, evidence refs,
graph-function asset authority, requested/returned operation agreement,
generated-asset attestation, and ambiguity candidates before proof can count.

Local optimization keeps contract admission and evaluator projection in the
hook layer. Global optimization is that every SDLC edge class reads the same
contract shape instead of carrying a bespoke constructor path.

## Non-Ownership

Hooks must not:

- emit ABG runtime events directly
- call public start recursively
- infer a next graph vector
- accept trace tags or comments as behavioral fulfillment
- merge foreign realization candidates into the target silently
