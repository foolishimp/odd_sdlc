# SCOPE: T-041 Full Operational Python-Replacement RC

**Status**: Open, not closable in the bounded TypeScript RC pass.

T-041 is a future full operational claim. It cannot be completed by extending
the current deterministic TS proof lane alone.

Required missing surfaces:

- `cli/` command adapter for install/start/gaps/release
- side-effecting installed-workspace install and normalize adapter
- live external `F_P` data_mapper traversal
- run archive/postmortem comparison over that live traversal
- release-cut packaging and binary binding

The bounded TypeScript RC remains truthful because it explicitly does not claim
those surfaces. T-041 should be opened only when the work wave is ready to move
from package RC to operational Python-replacement RC.
