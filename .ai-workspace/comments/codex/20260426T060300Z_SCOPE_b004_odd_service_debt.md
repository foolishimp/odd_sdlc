# SCOPE: B-004 odd_service Debt

**Status**: Backlog, odd_service line only.

B-004 tracks real deferred scope:

- remote snapshot verification
- odd_manager as client rather than competing owner
- consensus as the service proving lane
- peer CLI/browser execution surface completeness

This is not TypeScript tenant work. The current `odd_sdlc.TS` bounded RC does
not claim remote orchestration, service-owned worker registry, or consensus
service proof.

The debt remains visible through:

- `specification/requirements/09-odd-service-orchestration-plane.md`
- `specification/scenarios/08-odd-service-orchestration-plane.md`
- `specification/PRODUCT.md`
- `.ai-workspace/tickets/backlog/B-004-track-odd-service-remote-client-and-consensus-scope-debt.md`

No odd_service implementation was changed in this TS pass.
