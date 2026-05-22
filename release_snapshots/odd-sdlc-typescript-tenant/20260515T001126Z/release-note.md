# odd_sdlc TypeScript Legacy Release Snapshot: 20260515T001126Z

This snapshot migrates a former `.ai-workspace/release-cuts/typescript` archive into the root release snapshot tree.

- package: @odd-sdlc/typescript-tenant@0.0.0-dev
- original archive: .ai-workspace/release-cuts/typescript/20260515T001126Z
- migrated manifest: legacy-release-cut-manifest.json
- migrated postmortem: release-cut-postmortem.md
- substrate note: the legacy release-cut manifest did not record an ABG release snapshot pin; this migrated snapshot preserves historical evidence only.

New odd_sdlc TypeScript release candidates must use `odd-sdlc-ts release-snapshot` so `release-snapshot-manifest.json` records the consumed ABG release snapshot.
