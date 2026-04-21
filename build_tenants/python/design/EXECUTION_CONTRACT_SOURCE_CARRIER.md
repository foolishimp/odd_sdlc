# odd_sdlc Execution Contract Source Carrier

**Status**: Current
**Implements**: `T-023`
**Derives From**: `specification/PRODUCT.md`, `build_tenants/python/design/PROMPT_CONTEXT_CARRIAGE.md`, `build_tenants/python/design/TICKET_WORK_ITEM_REENTRY_ROUTING.md`

## Position

`odd_sdlc` does not admit execution law through raw operator phrasing, raw
ticket markdown, or prompt-side reconstruction.

The authoritative source carrier for one bounded dispatch is
`execution_contract_surface`.

That carrier is graph-owned first and consumer-owned second.

## Source Carrier

The current source carrier pair is:

- `derive_execution_contract_surface`
- `admit_execution_contract_surface`

These are published graph functions over:

- `work_request_surface`
- `execution_contract_surface`

They are internal source-carrier graph functions, not public operator targets.

They exist so execution admission is expressed in the same graph-function
language as the rest of the domain rather than as an app-only sidecar.

## Current Runtime Boundary

`odd_sdlc start` remains the public operator entry.

Its job is thin:

- normalize `scope + target + until`
- resolve the published target
- derive and admit the current execution-contract surface
- carry the admitted surface forward as an ABG 3.2 declared prompt context

`start` is not the owner of execution semantics.

## Carrier Rule

The execution-contract surface carries the admitted current execution basis for
the run, including:

- source kind
- categorized work basis
- normalized target truth
- closure law
- evaluation criteria
- non-closure conditions
- proof surface

Prompt, manifest, closure, and later dossier consumers read that admitted
surface downstream. Under ABG 3.2, prompt and manifest carriage happens through
the `odd_sdlc_execution_contract_context` GTL context and the structured
execution-contract register.

## Closure Rule

This source-carrier design is only behaving lawfully when:

- the execution-contract carrier is published in the live graph-function set
- it does not become a new public `start` target family
- prompt and manifest contexts attribute the dispatch back to the admitted
  carrier
- downstream dossier and review consumers do not replace the admitted carrier
  as execution authority
