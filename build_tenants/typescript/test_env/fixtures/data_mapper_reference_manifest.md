# data_mapper.template Reference Fixture Manifest

Lane: optional local reference comparison.

This fixture is not part of required TypeScript semantic closure. Required
semantic closure uses checked-in portable source snapshots in
`test_t031_workspace_ingress.test.mjs`.

The full `data_mapper.template` project remains useful as a reference comparison
against the Python discovery line and later RC qualification.

## Binding

- Environment variable: `ODD_SDLC_DATA_MAPPER_TEMPLATE_ROOT`
- Expected local source: `/Users/jim/src/apps/ai_sdlc_examples/local_projects/data_mapper/data_mapper.template`
- Script: `npm run test:reference:data-mapper`

If the environment variable is missing or the path is absent, the reference lane
fails with a governed fixture diagnostic. That failure is not semantic-lane
product failure.
