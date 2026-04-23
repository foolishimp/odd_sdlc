# odd_sdlc Generated Asset Contract Prompt Parity

**Status**: Active
**Implements**: REQ-F-ODDSDLC-029
**Derives From**: `build_tenants/python/design/SOFTWARE_DOMAIN_BUILDOUT.md`, `build_tenants/python/design/fp/DETERMINISTIC_REPAIR_FRONTIER.md`

Generated asset production and generated asset certification must consume one
shared contract.

That contract is published from the odd_sdlc asset model and carried through the
workspace asset query surface. It includes:

- materialization kind
- generated marker text
- marker path
- generated heading prefix when applicable
- required files and member prefixes when applicable

The contract is authoritative for three consumers:

1. deterministic generated-asset certification
2. deterministic constructor generation
3. probabilistic F_P prompt rendering for generated assets

Rules:

- No prompt path may invent or restate a divergent marker requirement.
- The constructor may render the marker text directly, but that text must come
  from the shared generated-asset contract rather than a local ad hoc string.
- The F_P prompt must render the shared generated-asset contract when the target
  asset is a generated asset.
- Query/domain publication must expose the same contract so prompt assembly and
  certification stay on one truth surface.
- A generated asset is not closed when certification and prompt contract disagree,
  even if one path happens to pass in a local scenario.
