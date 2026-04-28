# T-063 Govern ABG And odd_sdlc Installer Feature Contract Before RC

- id: T-063
- title: Govern ABG and odd_sdlc installer feature contract before RC
- status: completed
- ticket_category: installer_contract_rc_blocker
- change_class: requirement_reprice
- re_entry_point: requirements
- affected_boundary: ABIogenesis TypeScript installer, odd_sdlc TypeScript installer, installed target workspace, cold-agent bootstrap, sandbox population, data_mapper.test46.ts qualification lane
- intake_source: operator review of `data_mapper.test46.ts` install showed the TypeScript install chain lacks a complete declared installer feature contract. Missing pieces appeared incrementally: standards reference copy, cold-agent boot files, ABG install topology, repeat-install behavior, and sandbox evidence.
- upstream_authority: ABIogenesis owns substrate installer features. odd_sdlc owns product installer features layered over the installed ABG substrate.
- requirement_authority:
  - `/Users/jim/src/apps/abiogenesis/specification/PRODUCT.md` Installed Substrate Contract
  - `/Users/jim/src/apps/abiogenesis/specification/requirements/product/REQ-P-INSTALL.md`
  - `specification/PRODUCT.md` Installed Development Product Contract
  - `specification/requirements/14-odd-sdlc-installed-product-contract.md`
- closure_law: close only after the ABG and odd_sdlc installer feature contracts are explicitly reviewed, split into owning tickets where needed, implemented under STDO/Design Module Method, and proven by a clean data_mapper.test46.ts install plus `gaps`/`start` cold-agent command sanity checks.

## Triage

The installer is not a helper script. It is the boundary that turns released
builder products into an installed development product inside an independent
target workspace.

The current TypeScript path has useful pieces, but the feature contract is not
yet constitutional enough. That is why misses appear one by one: tests prove
individual functions, while the operator need is an installed workspace that a
cold agent can understand, inspect, and operate without hidden source-tree
knowledge.

Lawful re-entry started at requirements because the missing feature list was not
fully stated in product requirements before design and implementation. This
ticket now tracks closure against the elevated product requirements rather than
acting as the authority for them.

## Ownership Rule

ABG installer features are upstream ABIogenesis work. odd_sdlc shall not
reimplement ABG runtime, event, standards, archive, or substrate mechanics.

odd_sdlc installer features are downstream product work. ABG shall not encode
odd_sdlc domain HOW, target-project normalization, SDLC graph catalog policy, or
data_mapper-specific behavior.

## ABG TypeScript Installer Feature Inventory

| Feature | Owner | Required Behavior | Current Evidence | Status |
|---|---|---|---|---|
| Installed root | ABG | Creates `.abiogenesis/` in the target workspace as the substrate root. | `data_mapper.test46.ts` has `.abiogenesis/install-manifest.json`. | present |
| Package materialization | ABG | Packs/extracts the ABG TypeScript package into target `node_modules` without source-tree imports. | `.abiogenesis/package-pack`, `.abiogenesis/package-extract`, package command bindings. | present |
| CLI bindings | ABG | Publishes installed `abiogenesis-ts` and `genesis-ts` commands. | `node_modules/.bin` links created by TypeScript installer. | present |
| Bootstrap manifest | ABG | Writes inspectable install/bootstrap manifest and runtime identity. | `.abiogenesis/install-manifest.json`, `.abiogenesis/typescript-installer-manifest.json`. | present |
| Runtime event/projection roots | ABG | Creates or declares event and runtime roots used by installed execution. | `.ai-workspace/events`, `.ai-workspace/runtime` manifest fields and test46 live event append proof. | present |
| Full installed standards tree | ABG | Installs the full method standards tree under `.abiogenesis/docs/standards/` so cold agents can use `workspace://.abiogenesis/docs/standards/...` references. | ABG T-079; refreshed `data_mapper.test46.ts` has the full standards tree. | present |
| Standards manifest proof | ABG | Records standards source, installed path, and copied file inventory/checksums in installer manifest. | ABG T-079 manifest file inventory/checksums. | present |
| Clean/imported target mode | ABG | Distinguishes clean-target scaffolding from imported-target preservation. | ABG installer reports `targetMode`; test46 refresh reports `imported`. | present |
| Install event/provenance | ABG | Emits or persists installed-substrate provenance into runtime truth. | `.abiogenesis/install-provenance.json` records installed package, command, standards, docs, event/runtime roots. | present |
| Public verify/doctor | ABG | Provides typed verification for complete, incomplete, or stale installed substrates. | `verifyAbiogenesisTypescriptInstallTopology(...)` is public from `@abiogenesis/typescript-tenant/app/m04/install-bootstrap`; T-080 classifies this as the TS replacement for Python `--verify`. | present |
| Repeat install idempotency | ABG | Re-running install refreshes admitted installed state or returns a precise stale-state remediation result. | ABG T-078 completed; test46 refresh reports `installMode: "refresh"`. | present |
| Public sandbox archive API | ABG | Exposes common sandbox archive/postmortem framework for downstream tests. | ABG T-077 completed; odd_sdlc sandbox helper now imports `@abiogenesis/typescript-tenant/qualification/m05` and records `m05ArchiveQualification`. | present |
| Installer archive/postmortem proof | ABG | Persists install proof with manifest, package, command, runtime, event/projection, and postmortem evidence. | T-076/T-079/T-081 archive proof exists; T-080 full Python-baseline review completed. | present |
| Cold-agent substrate instructions | ABG | Provides substrate-level bootstrap instructions or command descriptors without downstream domain HOW. | T-080 classifies ABG as owning substrate docs and domain-neutral references under `.abiogenesis/docs/`; odd_sdlc owns root `AGENTS.md`/`CLAUDE.md`. | present |
| Installed command grammar | ABG | Keeps ABG command grammar stable for downstream products using `start`, `gaps`, install, and runtime inspection. | `genesis-ts` / `abiogenesis-ts` commands exist and were exercised by the T-052 sandbox command probe and T-076 installer lane. | present |

## odd_sdlc TypeScript Installer Feature Inventory

| Feature | Owner | Required Behavior | Current Evidence | Status |
|---|---|---|---|---|
| Product tenant root | odd_sdlc | Installs product payload under `.abiogenesis/odd_sdlc/typescript/`. | `data_mapper.test46.ts` has `.abiogenesis/odd_sdlc/typescript/install-manifest.json`. | present |
| ABG substrate population | odd_sdlc via ABG | Calls public ABG installer rather than copying private ABG test/runtime fixtures. | T-059/T-061/T-062 path uses ABG installer. | present |
| Cold-agent instruction files | odd_sdlc | Writes marker-governed root `AGENTS.md` and `CLAUDE.md` with `gaps` and `start` commands. | `data_mapper.test46.ts` now has both files. | present |
| Installed standards references | odd_sdlc | Refers to ABG-installed method copies by `workspace://.abiogenesis/docs/standards/...`, not absolute workspace paths. | T-065 completed; refreshed test46 bootstrap and manifest carry workspace refs. | present |
| Target workspace preservation | odd_sdlc | Does not overwrite project-owned `specification/`, source, or imported template truth. | Existing install tests plus refreshed data_mapper.test46 proof. | present |
| Product command grammar | odd_sdlc | Installed command line exposes `odd-sdlc-ts gaps --workspace .` and `odd-sdlc-ts start --workspace . --target next --until blocked`. | Sanity check ran after test46 install. | present |
| Worker attachment guidance | odd_sdlc | Cold-agent output explains `fp_worker_unattached` as an operational gap, not a code crash. | T-064/T-065 generated bootstrap and compact CLI output. | present |
| Operational read models | odd_sdlc | Publishes project bootstrap, normalization report, ambiguity register, requirement closure register, analysis/workspace-state projection, and runtime contract binding. | T-064/T-065 install and cold-agent proof surfaces carry the first-edge operational read models; T-041 owns full operational breadth. | present for installer contract |
| Sandbox population harness | odd_sdlc | All sandbox tests create target workspaces through the installed ABG substrate and public ABG M05 archive substrate. | `npm run test:sandbox` passes; T-052 registry proves every sandbox uses `provisionAbgInstalledSandbox(...)` and that the shared helper consumes `@abiogenesis/typescript-tenant/qualification/m05`. | present |
| data_mapper.test46.ts proof | odd_sdlc | Fresh copy from `data_mapper.template`, ABG install, odd_sdlc install, command sanity, archive evidence. | T-064 first-edge live installed proof archive `20260427T082235364Z_pid60375`. | present for first-edge UX |
| Install manifest | odd_sdlc | Records product, build tenant, command paths, runtime dependency, and installed product root. | `.abiogenesis/odd_sdlc/typescript/install-manifest.json`. | present |
| Repeat install behavior | odd_sdlc via ABG | Product reinstall works over existing ABG substrate or fails with precise remediation. | Refreshed test46 via public installer after ABG T-078. | present |
| Installed UAT/live lane | odd_sdlc | Live/sandbox UAT uses installed command path and records proof. | T-064 first-edge installed live proof closes the installer-contract lane; T-041 still owns full operational Python-replacement breadth. | present for installer contract |

## Required Ticket Split

1. ABIogenesis ticket: classify full Python installer capability baseline against `REQ-P-INSTALL` (`T-080`) - completed.
2. ABIogenesis ticket: install method standards into `.abiogenesis/docs/standards/` and record manifest proof (`T-079`) - completed.
3. ABIogenesis ticket: close or reprice repeat-install idempotency over existing package state (`T-078`) - completed.
4. ABIogenesis ticket: export and prove public sandbox archive/postmortem framework (`T-077`) - completed.
5. odd_sdlc ticket or extension: reference installed standards in `AGENTS.md` and `CLAUDE.md` only after ABG installs them - completed by T-065.
6. odd_sdlc ticket or extension: prove installed operational read models and runtime contract binding from a clean data_mapper install - first-edge proof completed by T-064.
7. odd_sdlc ticket or extension: rerun clean `data_mapper.test46.ts` install proof and command sanity after ABG installer fixes - completed by T-064.
8. odd_sdlc ticket or extension: audit all TypeScript sandbox tests for installed ABG substrate population - completed by T-052 registry and rerun after ABG T-077.

## Non-Closure

- Treating source-tree paths under `/Users/jim/src/apps/specification_methodology` as the installed workspace contract.
- Letting odd_sdlc copy ABG substrate files or method standards independently.
- Claiming sandbox or data_mapper proof from source imports, private fixtures, or a partially installed workspace.
- Closing RC from unit tests only, without a clean independent target workspace install.

## Review Questions

1. Which ABG installer features are mandatory before odd_sdlc RC?
2. Which odd_sdlc installer features are mandatory before odd_sdlc RC?
3. Which features are tactical installed read models versus constitutional source truth?
4. Which features need persistent archive/postmortem proof rather than command-output proof?
5. Which Python installer behaviors are genuine requirements, and which were incidental implementation precedent?

## Closure

Completed 2026-04-27.

### Closure Claim

The ABG and odd_sdlc installer feature contracts are now explicit enough for the
RC lane to proceed without discovering installer requirements one cut at a time.
ABG owns substrate install, topology verification, standards/docs provenance,
repeat install, and the public M05 sandbox/archive API. odd_sdlc owns product
payload install, root cold-agent instructions, product command grammar,
operational read models, and data_mapper/test sandbox proof.

This ticket does not claim full odd_sdlc operational RC. T-041 remains the
ticket for full Python-replacement breadth and live operational parity.

### Evidence

- ABG T-077 completed and passed `npm run test:t077`, `test:t030`,
  `test:t022`, `test:t076`, and `lint:semantic`.
- odd_sdlc sandbox helper
  `build_tenants/typescript/test_env/sandbox/abg_installed_workspace.mjs`
  consumes `@abiogenesis/typescript-tenant/qualification/m05`.
- `npm run test:sandbox`: 6 passed after public M05 integration.
- Prior installed operator proof remains the clean `data_mapper.test46.ts`
  archive `20260427T082235364Z_pid60375`, with installed `gaps` and installed
  `start --worker process://codex` sanity.
