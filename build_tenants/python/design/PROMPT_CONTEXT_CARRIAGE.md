# odd_sdlc ABG 3.2 Prompt Context Carriage

**Status**: Current
**Implements**: `T-023`
**Supersedes**: `T-021` constructive prompt-template implementation shape
**Derives From**: `specification/PRODUCT.md`, `build_tenants/python/design/EXECUTION_CONTRACT_SOURCE_CARRIER.md`

## Position

ABG 3.2 owns the generic constructive `F_P` prompt and manifest shape.

`odd_sdlc` does not publish a second domain-owned constructive prompt template
as runtime authority. The domain publishes admitted source truth as declared GTL
contexts that ABG consumes before dispatch.

For execution-contract admission, the current prompt-bearing carrier is:

- structured source truth:
  `.ai-workspace/runtime/odd_sdlc-execution-contract.json`
- prompt context:
  `.ai-workspace/runtime/odd_sdlc-execution-contract.md`
- GTL context name:
  `odd_sdlc_execution_contract_context`

## Provenance Rule

Every constructive `odd_sdlc start` dispatch that lawfully reaches ABG admits
the execution contract before ABG opens constructive `F_P` dispatch.

Public `odd_sdlc start --target next` may stop earlier at the published
homeostatic constitutional gate. When the head dossier carries
`route_binding.state=await_fh_resolution` together with
`constitutional_proposal.state=pending_fh`, no execution contract is admitted
and no constructive run opens.

The ABG 3.2 manifest records that source truth through its `contexts` array.
The manifest must include a context entry with:

- `name: odd_sdlc_execution_contract_context`
- `locator: workspace://.ai-workspace/runtime/odd_sdlc-execution-contract.md`
- `content` containing the admitted execution-contract context

The rendered prompt must carry the same context content before the worker can
act.

`dispatch_provenance.constructive_prompt_template` is not current ABG 3.2
runtime truth for `odd_sdlc`.

## Closure Rule

This surface is lawful only when:

- public `odd_sdlc start` admits the execution contract before constructive
  dispatch
- public `odd_sdlc start --target next` can stop before execution-contract
  admission when the homeostatic constitutional gate is still pending
- the GTL graph functions declare `odd_sdlc_execution_contract_context` as a
  constructive context
- ABG manifests carry that context in `contexts`
- prompt text includes the admitted execution-contract context
- no prompt-template helper or manifest bridge acts as a second authority
