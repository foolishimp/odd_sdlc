# Getting Started with odd_sdlc

This runsheet takes a new user from a clean machine to a governed odd_sdlc
workspace that can run `gaps` and `start` against an authored specification.

It covers:

1. Cloning the three sibling repositories (`abiogenesis`, `odd_sdlc`,
   `specification_methodology`) into one parent folder.
2. Building the TypeScript tenants for `abiogenesis` and `odd_sdlc`.
3. Creating a fresh target project workspace.
4. Running the `odd-sdlc-ts install` command into that workspace.
5. Authoring the initial specification (`INTENT`, `PRODUCT`, `GOALS`,
   `requirements/`).
6. Running `gaps` and `start`.
7. Reference material — key concepts, `gaps` and `start` flags, glossary.

The runsheet uses the TypeScript line, which is the current active runtime.

---

## 0. Prerequisites

| Tool | Version | Notes |
| --- | --- | --- |
| `git` | any modern | for cloning the three repos |
| `node` | 20 or later | `package.json` requires `"engines": { "node": ">=20" }` |
| `npm` | bundled with node | |
| `claude` CLI | optional | only required for live F_P traversal; deterministic conform/F_D work runs without it |

Verify:

```bash
node --version    # v20.x or newer
npm --version
git --version
```

---

## 1. Choose an apps-root and clone three sibling repos

The odd_sdlc CLI **resolves the abiogenesis source through sibling-directory
lookup** (`build_tenants/typescript/code/src/spec_method/entry.ts:218-225`).
The three repositories must therefore live as siblings under a single parent.

Pick a parent directory. Throughout this runsheet `<APPS>` refers to that
path; the user used `/Users/jim/src/apps` in the development tree.

```bash
export APPS="$HOME/src/apps"     # adjust to taste
mkdir -p "$APPS"
cd "$APPS"
```

Clone the three required repos as siblings:

```bash
cd "$APPS"
git clone https://github.com/foolishimp/abiogenesis.git
git clone https://github.com/foolishimp/odd_sdlc.git
git clone https://github.com/foolishimp/specification_methodology.git
```

**Claude prompt** (alternative to running the clone manually):

> Clone the three required GTL/ABG/STDO source repositories into `$APPS` as
> siblings: `abiogenesis`, `odd_sdlc`, and `specification_methodology` from
> the `foolishimp` GitHub org. Also clone `odd_manager` from the same org
> as an optional fourth sibling. Do not nest them; they must be at the same
> directory level under `$APPS`. After each clone, verify
> `<repo>/package.json` or `<repo>/specification/` exists. Stop and surface
> any clone failure verbatim.

Optional sibling for the operator-facing control plane:

```bash
git clone https://github.com/foolishimp/odd_manager.git
```

`odd_manager` is a separate downstream product on the same GTL/ABG line —
an operator-facing dashboard and control plane. It is not required for the
`odd_sdlc` install or operator loop, but it lives as a sibling under the
same `$APPS` parent because it is itself an `odd_sdlc`-governed workspace
when worked on.

Resulting layout (the install resolver depends on this sibling shape):

```
<APPS>/
├── abiogenesis/                   # GTL/ABG substrate source        (required)
│   └── build_tenants/abiogenesis/typescript/
├── odd_sdlc/                      # odd_sdlc domain source          (required)
│   └── build_tenants/typescript/
├── specification_methodology/     # constitutional method standards (required)
│   └── specification/standards/
└── odd_manager/                   # operator control plane          (optional)
    └── build_tenants/...
```

Verify:

```bash
ls "$APPS"/abiogenesis/build_tenants/abiogenesis/typescript/package.json
ls "$APPS"/odd_sdlc/build_tenants/typescript/package.json
ls "$APPS"/specification_methodology/specification/standards/SPEC_METHOD.md
```

Each command should print the path back. If any one is missing, fix the
clone before continuing — the resolver will not find ABG otherwise.

> **Note on hardcoded references.** A few historical paths in the source tree
> still reference `/Users/jim/src/apps/...` (for example
> `odd_sdlc/build_tenants/typescript/code/src/qualification/rc_qualification.ts:77`
> for an optional external data-mapper fixture). These are provenance, not
> required dependencies for the install or operator loop documented here.

---

## 2. Build the abiogenesis TypeScript tenant

```bash
cd "$APPS/abiogenesis/build_tenants/abiogenesis/typescript"
npm install
npm run build:semantic
```

The build emits typed JavaScript under `build/semantic/`.

**Claude prompt** (alternative to running the build manually):

> Build the abiogenesis TypeScript tenant at
> `$APPS/abiogenesis/build_tenants/abiogenesis/typescript`. Run
> `npm install` then `npm run build:semantic` from that directory.
> Verify `build/semantic/code/src/index.js` exists after the build.
> Surface any TypeScript compile error verbatim. This step has no
> dependency on `odd_sdlc`; do not touch any other directory.

Verify:

```bash
test -f "$APPS/abiogenesis/build_tenants/abiogenesis/typescript/build/semantic/code/src/index.js" && echo "abg build ok"
```

---

## 3. Build the odd_sdlc TypeScript tenant

```bash
cd "$APPS/odd_sdlc/build_tenants/typescript"
npm install
npm run build:semantic
```

Verify:

```bash
test -f "$APPS/odd_sdlc/build_tenants/typescript/build/semantic/code/src/cli/main.js" && echo "odd_sdlc build ok"
```

Optional sanity test (~5 s):

```bash
npm run test:t058    # spec method entrypoint smoke
```

**Claude prompt** (alternative to running the build manually):

> Build the odd_sdlc TypeScript tenant at
> `$APPS/odd_sdlc/build_tenants/typescript`. The abiogenesis tenant under
> `$APPS/abiogenesis/build_tenants/abiogenesis/typescript` must already be
> built (it is a `file:` dependency; its compiled artifacts live under
> `build/semantic/`). Run `npm install` then `npm run build:semantic`.
> Verify `build/semantic/code/src/cli/main.js` exists. If you see
> module-not-found errors mentioning `@abiogenesis/typescript-tenant`,
> stop and report — abiogenesis was probably not built. Then run
> `npm run test:t058` as a smoke check.

---

## 4. Create a fresh target project workspace

The target project is a separate folder where odd_sdlc will be **installed
into**. The source repos under `<APPS>` are not the project; they are the
*builder substrate*.

```bash
export PROJECT_NAME="my-first-odd-app"
export PROJECT_ROOT="$APPS/$PROJECT_NAME"
mkdir -p "$PROJECT_ROOT"
cd "$PROJECT_ROOT"
```

Initialise git for the project (optional but recommended):

```bash
git init
```

The project workspace must not be inside any of the three source repos.

**Claude prompt** (alternative to creating the workspace manually):

> Create a fresh empty project workspace at `$APPS/$PROJECT_NAME` where
> `$PROJECT_NAME` is the slug I will give you. Run `git init` inside it.
> The workspace must be a sibling of `abiogenesis`, `odd_sdlc`,
> `specification_methodology`, and `odd_manager` — not nested inside any
> of them. Verify the directory is otherwise empty. Stop if a directory
> with the same name already exists; do not overwrite.

---

## 5. Run the odd_sdlc install

Invoke the source-tree CLI to install the odd_sdlc product payload (plus the
ABG substrate) into the target workspace:

```bash
cd "$PROJECT_ROOT"
node "$APPS/odd_sdlc/build_tenants/typescript/build/semantic/code/src/cli/main.js" \
  install \
  --target "$PROJECT_ROOT"
```

The defaults for `--package-source` and `--abg-package-source` resolve through
the sibling-directory convention you set up in step 1, so you do **not** need
to pass them explicitly.

After the install completes, the project workspace contains:

```
$PROJECT_ROOT/
├── .abiogenesis/                 # ABG substrate (installed; not source)
│   ├── docs/standards/           # local mirror of method standards
│   ├── install-manifest.json
│   └── odd_sdlc/typescript/      # installed odd_sdlc product payload
├── .ai-workspace/
│   ├── context/project_bootstrap.md
│   └── runtime/odd_sdlc/         # operator-runs land here
├── AGENTS.md                     # installed bootstrap surface
├── CLAUDE.md                     # installed bootstrap surface
├── README.md
├── node_modules/
│   ├── @abiogenesis/typescript-tenant/
│   └── @odd-sdlc/typescript-tenant/
└── package.json
```

The installed CLI is at `node_modules/.bin/odd-sdlc-ts`.

Verify:

```bash
ls .abiogenesis/install-manifest.json
ls .abiogenesis/odd_sdlc/typescript/install-manifest.json
node_modules/.bin/odd-sdlc-ts --help 2>&1 | head -5 || true
```

**Claude prompt** (alternative to running the install manually):

> From `$PROJECT_ROOT`, run the odd_sdlc installer by invoking the
> source-tree CLI:
> `node $APPS/odd_sdlc/build_tenants/typescript/build/semantic/code/src/cli/main.js install --target $PROJECT_ROOT`.
> Do not pass `--package-source` or `--abg-package-source`; the resolver
> finds abiogenesis through the sibling-directory convention. After the
> install completes verify that
> `$PROJECT_ROOT/.abiogenesis/install-manifest.json`,
> `$PROJECT_ROOT/.abiogenesis/odd_sdlc/typescript/install-manifest.json`,
> and `$PROJECT_ROOT/node_modules/.bin/odd-sdlc-ts` all exist. If any are
> missing, surface the install command output verbatim.

---

## 6. Author the initial specification

The installed workspace expects four authoring surfaces. Use the templates
under
`$APPS/specification_methodology/specification/standards/templates/` as
starting material.

Create the directory and seed the files:

```bash
mkdir -p "$PROJECT_ROOT/specification/requirements"

cp "$APPS/specification_methodology/specification/standards/templates/INTENT_TEMPLATE.md"  "$PROJECT_ROOT/specification/INTENT.md"
cp "$APPS/specification_methodology/specification/standards/templates/PRODUCT_TEMPLATE.md" "$PROJECT_ROOT/specification/PRODUCT.md"
cp "$APPS/specification_methodology/specification/standards/templates/GOALS_TEMPLATE.md"   "$PROJECT_ROOT/specification/GOALS.md"
```

Edit each file. Below is a worked example for a small CLI product. Replace
with your own content.

### `specification/INTENT.md`

```markdown
# Project Intent

## Purpose

`my-first-odd-app` is a small command-line note-taking tool. It exists so a
single operator can capture a one-line note, list past notes, and delete a
note, with every operation recorded as governed evidence.

## Outcomes

- The operator can capture a note from the terminal.
- The operator can list all captured notes in chronological order.
- The operator can delete a note by id.

## Constraints

- Local-only; no network calls.
- Notes are stored as plain files under the workspace.
- Every command emits one evidence row.
```

### `specification/PRODUCT.md`

```markdown
# Project Product

## Product Position

`my-first-odd-app` is a local CLI over a notes ledger. The product surface is
the command set, the notes ledger asset, and an admitted evidence trail.

## Product Terms

- **Note**: one immutable line of text with an id and a timestamp.
- **Ledger**: the append-only set of notes for this workspace.
- **Evidence row**: one admitted record of one command invocation.

## Goal Model

Goals scope one wave of work. Intent sets direction. Product defines the
current realization. Requirements decompose the product realization.

## Product End State

A built CLI named `notes` that exposes three subcommands (`add`, `list`,
`delete`) and admits evidence after each successful invocation.

## Current Product Definition

The current product is:

- a Node CLI binary
- a notes ledger asset stored as a JSON file
- an evidence ledger asset stored as a JSONL file
- three subcommands binding to graph functions over those assets
```

### `specification/GOALS.md`

```markdown
# Project Goals

## Position

Goals focus one bounded wave of work for `my-first-odd-app`. They are
narrower than intent and shorter-lived than the product definition.

## Current Goals

- Land an end-to-end `add` command that admits one note and emits one
  evidence row.
- Land `list` reading from the same ledger.
- Land `delete` mutating the ledger and admitting an evidence row.
```

### `specification/requirements/01-notes-cli.md`

```markdown
# Notes CLI Requirements

**Carries Forward From:** GOALS.md current wave
**Authoring Design:** to be derived

## REQ-NOTES-001 Add a note

The `notes add "<text>"` command must persist the note to the ledger with a
fresh id and a UTC timestamp, and admit one `note_admitted` evidence row.

## REQ-NOTES-002 List notes

The `notes list` command must print all notes in chronological order with id
and timestamp.

## REQ-NOTES-003 Delete a note

The `notes delete <id>` command must remove the note from the ledger and
admit one `note_deleted` evidence row.

## REQ-NOTES-004 Local-only

No command may make a network call.

## REQ-NOTES-005 Evidence on every command

Every successful command must admit exactly one evidence row.
```

Adjust the requirement count and content for your own product. Keep the
heading convention `## REQ-<FAMILY>-<NNN>` — the conform step uses that
pattern to lift requirement ids into the workspace's requirement authority.

**Claude prompt** (alternative to authoring the spec manually):

> Author the initial specification for the project at `$PROJECT_ROOT`.
> Create `specification/INTENT.md`, `specification/PRODUCT.md`,
> `specification/GOALS.md`, and one initial requirements family at
> `specification/requirements/01-<feature>.md`. Start from the templates
> at `$APPS/specification_methodology/specification/standards/templates/`.
> Follow `SPEC_METHOD.md` and `WRITING_GUIDE.md` strictly: present-tense,
> declarative, no filler, no "now/newly/added/previously" prose, one
> claim per sentence. Use `## REQ-<FAMILY>-<NNN>` for requirement
> headings so conform can lift the ids. I will give you the product
> purpose, outcomes, and constraints; do not invent product scope.

---

## 7. Run gaps

`gaps` is a read-only projection over the current runtime state. It is the
right first command to run after authoring or editing the specification.

```bash
cd "$PROJECT_ROOT"
node_modules/.bin/odd-sdlc-ts gaps --workspace .
```

Expected first-time output (shape — your values will differ):

```
odd-sdlc-ts gaps
status: open
graph_function: Fg_conform_project
current_edge:   Fg_conform_project
requirements:   5/5 unresolved
triage:         spec/open_gap -> spec:conform_project
read_only:      true
next_action:    construction-action:graph-function:odd_sdlc:Fg_conform_project:...
```

Read the projection top-down:

- `status` — `open` means more lawful work is available; `converged` means
  the current frame is done.
- `graph_function` — the active or next graph function on the SDLC graph.
- `current_edge` — the specific edge the runner sees as the working face.
- `requirements` — count of admitted requirements vs unresolved.
- `triage` — homeostatic gap-triage routing recommendation.
- `next_action` — the construction action the runner would dispatch if you
  call `start` without an explicit `--target`.

`gaps` never mutates state. It is safe to call as often as you like.

**Claude prompt** (alternative to running gaps manually):

> From `$PROJECT_ROOT`, run
> `node_modules/.bin/odd-sdlc-ts gaps --workspace .`. Read the projection
> and report: `status`, `graph_function`, `current_edge`, the
> `requirements` satisfied/total, the `triage` recommendation, and
> `next_action`. Do not mutate state and do not run `start` as part of
> this step. If you need machine-readable output, set
> `ODD_SDLC_TS_OUTPUT=json` and parse the JSON, but still summarise in
> prose. Quote any `blockingReason` or `error` field verbatim.

---

## 8. Run start

`start` admits intent and dispatches the picked traversal. It is the
mutating counterpart to `gaps`.

### 8a. Deterministic conform (no worker required)

The first traversal after install is `Fg_conform_project` — an F_D edge that
ingests the specification surfaces, lifts requirement ids into the workspace
requirement authority, and normalises constraints. No LLM worker is involved.

```bash
node_modules/.bin/odd-sdlc-ts start \
  --workspace . \
  --target next \
  --until converged
```

After it returns `status: converged`, re-run `gaps`. The reported
`graph_function` and unresolved-requirement counts will have changed.

### 8b. F_P traversal with a live worker (Claude)

For graph functions that materialise product assets (for example
`Fg_materialize_declared_product_asset`), `start` dispatches an F_P worker.
Bind one with `--worker`:

```bash
node_modules/.bin/odd-sdlc-ts start \
  --workspace . \
  --target next \
  --until converged \
  --worker process://claude
```

A Claude CLI must be installed and authenticated for `process://claude` to
launch. The dispatch admits the constructed payload, runs F_D validation, and
either closes the edge or schedules a retry/repair pass.

To explicitly pick a model and effort level, include them as URI query
parameters:

```bash
--worker 'process://claude?model=claude-opus-4-7&effort=high'
```

### 8c. Bounded frontier inspection

To advance one edge and stop (useful for debugging) use:

```bash
node_modules/.bin/odd-sdlc-ts start --workspace . --target next --until first_traversal
```

**Claude prompt** (alternative to running start manually):

> From `$PROJECT_ROOT`, advance the SDLC graph by running
> `node_modules/.bin/odd-sdlc-ts start --workspace . --target next --until converged`.
> For deterministic conform passes do not pass `--worker`. For F_P
> dispatches pass `--worker 'process://claude?model=claude-opus-4-7&effort=high'`
> (and only after I have confirmed I want to spend LLM tokens). Wait for
> the command to return. Then re-run `gaps` and report the new
> projection. Locate the most recent operator-run archive under
> `$PROJECT_ROOT/.ai-workspace/runtime/odd_sdlc/operator-runs/` and
> report its `run_compact.txt` summary. If the command exits non-zero,
> surface stdout and stderr verbatim and stop — do not retry blindly.

---

## 9. Validate the install with the hello-world sandboxes

The odd_sdlc source tree ships scenario sandboxes that exercise the full
install + traversal loop against throwaway fixtures. Running them is the
fastest way to prove that steps 2–5 produced a working stack before you
commit time to authoring a real project.

Each scenario runs from the **source** tenant (under
`$APPS/odd_sdlc/build_tenants/typescript`), mints a fresh archive under
`test_env/test_runs/<scenario>/<timestamp>_pid<pid>/`, provisions an ABG
sandbox into it, installs odd_sdlc into a workspace inside the archive,
copies the scenario fixture in, and runs `gaps → start`.

### 9a. Deterministic suite (no LLM cost)

This runs every deterministic scenario in one go — data_mapper internal
induction, T-131 odd_chat bootstrap induction, Rust minimum induction,
T-132 JavaScript hello-world, T-133 Rust hello-world.

```bash
cd "$APPS/odd_sdlc/build_tenants/typescript"
npm run test:scenario-sandbox
```

Expected: roughly 15–20 s total, five passes, three skips for the opt-in
live variants. Sample tail:

```
✔ scenario sandbox: data_mapper internal induction               (~3 s)
✔ scenario sandbox: T-131 odd_chat bootstrap induction           (~3 s)
✔ scenario sandbox: minimum Rust hello-world induction           (~3 s)
✔ scenario sandbox: T-132 JavaScript hello-world bootstrap …     (~3 s)
✔ scenario sandbox: T-133 Rust hello-world bootstrap induction   (~3 s)
﹣ scenario sandbox: T-131 odd_chat live build loop (opt-in)
﹣ scenario sandbox: T-132 JavaScript hello-world live build loop (opt-in)
﹣ scenario sandbox: T-133 Rust hello-world live build loop (opt-in)
ℹ pass 5  fail 0  skipped 3
```

If this passes, the substrate is correctly built and the install machinery
works. Any failure here points at step 2 or step 3 not being clean — fix
those before authoring a real project.

To run just one scenario:

```bash
npm run test:t132     # JavaScript hello-world, deterministic only
npm run test:t133     # Rust hello-world, deterministic only
```

**Claude prompt** (alternative to running the deterministic suite manually):

> From `$APPS/odd_sdlc/build_tenants/typescript`, run
> `npm run test:scenario-sandbox`. Expect five passes plus three opt-in
> skips, total runtime around 15–20 seconds. Report the pass/fail/skip
> counts and the slowest scenario duration. If any deterministic
> scenario fails, stop immediately and surface the failing test's stderr
> verbatim — a deterministic-suite failure means the substrate build
> (step 2 or step 3) is broken; do not proceed to live validation.

### 9b. Live build, hello-world (real Claude dispatch)

This actually dispatches the Claude CLI as the F_P worker and produces a
materialised hello-world implementation in the sandbox. Costs LLM tokens
and runs for several minutes.

Requirements:

- `claude` CLI installed and authenticated (run `claude --version` to
  verify).

JavaScript hello-world live build:

```bash
cd "$APPS/odd_sdlc/build_tenants/typescript"
npm run test:t132:hello-world-live
```

Rust hello-world live build:

```bash
npm run test:t133:rust-live
```

Minimum Rust induction (shortest live lane):

```bash
npm run test:scenario:hello-world-rust-minimum-live
```

Tunables (set before invoking the script):

| Env var | Default | Effect |
| --- | --- | --- |
| `ODD_SDLC_TS_T132_HELLO_WORLD_JS_SCENARIO_WORKER` | `process://claude` | F_P worker URI for T-132 |
| `ODD_SDLC_TS_T132_HELLO_WORLD_JS_SCENARIO_MAX_ADVANCES` | `6` | maximum gaps→start loop iterations for T-132 |
| `ODD_SDLC_TS_T133_HELLO_WORLD_RUST_SCENARIO_WORKER` | `process://claude` | as above, T-133 |
| `ODD_SDLC_TS_T133_HELLO_WORLD_RUST_SCENARIO_MAX_ADVANCES` | `6` | as above, T-133 |
| `ODD_SDLC_TS_HELLO_WORLD_RUST_MINIMUM_INDUCTION_SCENARIO_WORKER` | `process://claude` | as above, minimum Rust |
| `ODD_SDLC_TS_HELLO_WORLD_RUST_MINIMUM_INDUCTION_SCENARIO_MAX_ADVANCES` | `6` | as above, minimum Rust |

To pin model and effort level on Claude:

```bash
export ODD_SDLC_TS_T132_HELLO_WORLD_JS_SCENARIO_WORKER='process://claude?model=claude-opus-4-7&effort=high'
npm run test:t132:hello-world-live
```

Rough runtime: a few minutes for the JS/Rust hello-world live lanes,
shorter for the minimum Rust induction. The exact wall time depends on the
worker model and how many advances each scenario consumes.

**Claude prompt** (alternative to running the live lane manually):

> From `$APPS/odd_sdlc/build_tenants/typescript`, run a live hello-world
> validation lane against the Claude CLI as the F_P worker. Pick one of:
> `npm run test:t132:hello-world-live` (JavaScript),
> `npm run test:t133:rust-live` (Rust), or
> `npm run test:scenario:hello-world-rust-minimum-live` (shortest).
> Before invoking, confirm `claude --version` resolves. Treat the run as
> long-running (several minutes) and do not poll the log faster than
> every 30 seconds. After it finishes report: pass/fail, total wall
> time, the latest archive under
> `test_env/test_runs/scenario_*/<latest>/`, and the contents of that
> archive's `workspace/.ai-workspace/runtime/odd_sdlc/operator-runs/`
> directory listing. Do not re-run on failure without my approval.

### 9c. Inspect the archive

After any run, the most recent archive is under
`test_env/test_runs/<scenario>/<latest>/`. To pinpoint it:

```bash
ls -dt test_env/test_runs/scenario_t132_hello_world_js_live/*/ | head -1
```

The interesting paths inside the archive:

| Path | What it carries |
| --- | --- |
| `workspace/` | the installed target workspace at run end |
| `workspace/.ai-workspace/runtime/odd_sdlc/operator-runs/` | one folder per `start` invocation |
| `workspace/.ai-workspace/runtime/odd_sdlc/operator-runs/*/run_compact.txt` | per-run summary |
| `workspace/.ai-workspace/runtime/odd_sdlc/operator-runs/*/postmortem.md` | event-sequence trace |
| `workspace/.ai-workspace/runtime/odd_sdlc/operator-runs/*/worker_invocation_package.json` | exact F_P dispatch |
| `workspace/.ai-workspace/runtime/odd_sdlc/operator-runs/*/worker_result_report.json` | what the worker returned |
| `workspace/.ai-workspace/runtime/odd_sdlc/operator-runs/*/sdlc_edge_fulfillment_ledger.json` | per-edge obligation accounting |
| `workspace/specification/requirements/` | requirement families lifted by conform |
| `workspace/build_tenants/<tenant>/` | the materialised product (for live runs) |
| `abg_installed_workspace/` | the ABG installed-substrate evidence for the sandbox |

To rerun `gaps` against the post-run sandbox manually:

```bash
LATEST=$(ls -dt test_env/test_runs/scenario_t132_hello_world_js_live/*/ | head -1)
(cd "$LATEST/workspace" && node node_modules/.bin/odd-sdlc-ts gaps --workspace .)
```

That projection tells you exactly where the live lane stopped, what
obligations remain, and what the runner's `next_action` would be.

### 9d. What a successful live run proves

- Step 2's ABG build resolved cleanly under odd_sdlc's TypeScript build
  (step 3).
- `odd-sdlc-ts install` minted a working installed payload into a fresh
  workspace.
- Conformance (`Fg_conform_project`) lifted the fixture's requirement
  surface into the installed workspace.
- The worker URI parsed, the F_P dispatch reached the Claude CLI, and the
  return payload passed F_D admission.
- The hello-world product asset materialised under
  `build_tenants/<tenant>/` in the sandbox.

If 9a passes and 9b fails, the LLM-side configuration (Claude CLI auth,
model name, effort string) is the likely culprit — not the substrate.

---

## Key Concepts

**Three layers, distinct ownership.**

- **GTL** — the formal language. Declares graphs, nodes, vectors, graph
  functions, jobs, roles, modules. Engine-agnostic.
- **ABG** — the runtime substrate. Event-sourced and replay-derivable. Owns
  traversal mechanics, payload admission, projection, selection
  application, evaluator regimes, closure decisions.
- **odd_sdlc** — the domain package on that substrate. Owns software-delivery
  semantics: typed product assets, graph functions like `Fg_conform_project`
  and `Fg_materialize_declared_product_asset`, the worksite lifecycle,
  homeostatic gap triage, and closure policy.

**Authoring vs runtime surfaces.**

- `specification/` — authoring `WHAT` (intent, product, goals, requirements).
- `.abiogenesis/` — installed substrate. Not project source.
- `.abiogenesis/odd_sdlc/` — installed product payload. Not project source.
- `.ai-workspace/runtime/odd_sdlc/operator-runs/` — per-run archives written
  during `start`. Read-only after the run; the canonical evidence trail.

**The W / L / E / Ev algebra.**

- **W** — the mutable workspace under construction.
- **L** — the immutable governed ledger of work over W.
- **E** — the append-only event log; the replay spine.
- **Ev** — evaluator work over L, whose output must itself be admitted into
  L and E.

**Three evaluator regimes.**

- **F_D** — deterministic. Schema checks, hash checks, lifted-id checks,
  structural conformance. No LLM.
- **F_P** — probabilistic. The LLM worker constructs an asset; F_D admits
  and validates the result. F_P owns semantic quality.
- **F_H** — human. Operator approval gates for review/escalation. Cannot
  override deterministic failure.

**The operator loop.**

```
gaps        (read projection — what is the next lawful work?)
  -> start  (admit intent, dispatch, admit result, advance)
  -> gaps   (read again to see the new frontier)
```

That loop is sufficient. Anything that wraps shell commands around it
(`npm install`, `npm test`, deployment) is outside the governed traversal
unless it's bound as a graph-function edge.

---

## `gaps` quick reference

```
node_modules/.bin/odd-sdlc-ts gaps --workspace <path> [--output-workspace <path>]
```

| Flag | Meaning |
| --- | --- |
| `--workspace <path>` | required; the installed project workspace root |
| `--output-workspace <path>` | optional; route materialisation outputs to a separate workspace |

Output fields:

| Field | Meaning |
| --- | --- |
| `status` | `open` (work remains) / `converged` (current frame done) / `blocked` (lawful obstacle) |
| `graph_function` | the active or next graph function |
| `current_edge` | the specific traversal edge |
| `closed_vectors` | count of vectors already closed in this run |
| `requirements` | `<satisfied>/<total>` requirement obligations |
| `triage` | homeostatic gap classification and recommended re-entry layer |
| `read_only` | `true` if no mutation would happen on `start` |
| `chooses_next_traversal` | `true` if the autonomous runner will pick the next edge |
| `next_action` | the construction action `start --target next` would dispatch |

For machine-readable output:

```bash
ODD_SDLC_TS_OUTPUT=json node_modules/.bin/odd-sdlc-ts gaps --workspace .
```

---

## `start` quick reference

```
node_modules/.bin/odd-sdlc-ts start --workspace <path>
                                    [--target <selector>]
                                    [--until <stop-mode>]
                                    [--worker <worker-uri>]
                                    [--output-workspace <path>]
```

| Flag | Values | Meaning |
| --- | --- | --- |
| `--workspace` | path | required |
| `--target` | `next` \| `graph_function:<handle>` \| `asset:<handle>` | what to drive toward; `next` lets the runner pick |
| `--until` | `first_traversal` \| `converged` \| `blocked` | stop condition; default `converged` |
| `--worker` | `process://claude` \| `process://codex` \| `process://<cmd>?model=…&effort=…` | F_P worker binding |
| `--output-workspace` | path | route materialisation outputs to a separate workspace |

Behaviour:

- Without `--worker`, only F_D and F_H edges advance. F_P edges return a
  lawful stop status `fp_worker_unattached`.
- `--until first_traversal` advances exactly one edge then returns.
- `--until converged` runs until the current frame's traversal converges or
  hits a lawful stop.

The run archive lands under
`.ai-workspace/runtime/odd_sdlc/operator-runs/<timestamp>_pid<pid>/` and
contains:

| File | What it carries |
| --- | --- |
| `run.json`, `run_compact.json`, `run_compact.txt` | operator-level summary |
| `runtime_events.json` | full event stream for the run |
| `postmortem.md` | event-sequence trace |
| `traversal_intent_package.json` | what was admitted at intent time |
| `worker_invocation_package.json`, `worker_prompt.md` | exact F_P dispatch |
| `worker_result_report.json`, `worker_process_events.jsonl` | F_P return |
| `fp_evaluate_result.json` | F_D verdict over the F_P return |
| `assurance_ledgers.json`, `assurance_satisfaction.json` | assurance fold |
| `sdlc_edge_fulfillment_ledger.json` | per-edge obligation accounting |
| `sdlc_edge_closure_decision.json` | close / yield / retry / repair |
| `sdlc_next_action_projection.json` | what the runner picks next |

---

## STDO — Constitutional Governance

STDO is the four-method governance stack that every odd_sdlc-governed
workspace inherits. The methods live in
`$APPS/specification_methodology/specification/standards/`, and the
installer mirrors them locally at
`$PROJECT_ROOT/.abiogenesis/docs/standards/`. The local mirror is reference
only; the upstream source is authoritative.

### The four methods

- **`SPEC_METHOD.md`** — what a specification artifact must satisfy.
  Defines the constitutional chain `Goals → Intent → Product → Requirements
  → Design → Code → Events → Projection → Delta → Scenarios →
  Gap Analysis → Repricing`. Declares the change classes (`goal_reprice`,
  `intent_reprice`, `product_reprice`, `requirement_reprice`,
  `design_reframe`, `realization_refactor`).
- **`TICKET_METHOD.md`** — how change is admitted as first-class artifacts.
  Defines ticket fields, types, categories, sprint manifests, comments, and
  execution contracts.
- **`DESIGN_MODULE_METHOD.md`** — how design decomposes into governed
  modules with explicit derivation from requirements.
- **`ODD_METHOD.md`** — outcome-driven worksite law for governed delivery.
  Sits over the three other methods and governs how a delivery worksite
  uses GTL/ABG as runtime substrate.

No constitutional change is lawful outside these four.

### Companion guides

- **`POSTING_GUIDE.md`** — how to write commentary (analysis, review,
  handoff, strategy) under `.ai-workspace/comments/`.
- **`WRITING_GUIDE.md`** — present-tense, active-surface writing rules used
  by specification, design, and ratified surfaces.
- **`GLOSSARY_GUIDE.md`** — terminology conventions.
- **`IDENTITY_METHOD.md`**, **`WORLD_MODEL_METHOD.md`**,
  **`RELEASE_METHOD.md`**, **`UX_METHOD.md`** — domain-specific extensions
  that compose with the four core methods.

---

## Creating a Ticket

Tickets are the durable unit of execution tracking. Goals scope a wave;
tickets scope a change.

### Where they live

```
$PROJECT_ROOT/.ai-workspace/tickets/
├── active/        # currently being executed
├── backlog/       # admitted, not yet active
└── completed/     # closed (success or supersession)
```

One ticket per file. Filename convention:
`T-<NNN>-<kebab-case-title>.md` where `NNN` is a monotonically increasing
zero-padded id.

### Required frontmatter fields

Every ticket carries a YAML frontmatter block. The minimum required set
(per `TICKET_METHOD.md`):

| Field | Meaning |
| --- | --- |
| `id` | `T-NNN` |
| `title` | one-line title |
| `type` | `feature`, `bug`, `spike`, `chore` |
| `ticket_category` | `ordinary` or `implementation_migration` |
| `status` | `triage`, `backlog`, `active`, `blocked`, `completed`, `superseded` |
| `goal` | the GOALS.md goal this ticket serves |
| `change_intent` | one-sentence statement of what changes |
| `change_class` | constitutional re-entry class (see below) |
| `re_entry_point` | the layer this change re-enters at |
| `triaged_at` | YYYY-MM-DD |
| `created_at` | YYYY-MM-DD |
| `updated_at` | YYYY-MM-DD |

**Change classes** (where the change lawfully re-enters the constitutional
chain):

- `goal_reprice` — current work-wave focus changes
- `intent_reprice` — direction or scope changes
- `product_reprice` — current product shape changes
- `requirement_reprice` — constitutional truth changes
- `design_reframe` — realization structure changes
- `realization_refactor` — local realization changes with no upstream change

Recommended additional frontmatter when relevant: `priority`, `dependencies`,
`links`, `intake_source`, `affected_boundary`, `source_ticket`,
`build_tenant`.

### Execution-contract fields (for tickets the runner admits)

When a ticket is admitted as an execution contract for a `start` run, also
record:

- `target_truth` — what is true after the ticket closes
- `superseded_truth` — what stops being true
- `closure_law` — the rule that decides closure
- `evaluation_criteria` — bullets the closure law evaluates against
- `non_closure_conditions` — things that invalidate closure if observed
- `proof_surface` — the files / commands that produce the proof

### Worked example

```markdown
---
id: T-201
title: Add a notes list command with timestamps
type: feature
ticket_category: ordinary
status: active
goal: notes-cli-wave-1
change_intent: Land a `notes list` subcommand that prints all admitted notes
  in chronological order with id and UTC timestamp.
change_class: requirement_reprice
re_entry_point: requirement
priority: medium
triaged_at: 2026-05-12
created_at: 2026-05-12
updated_at: 2026-05-12
dependencies:
  - T-200 add command lands the notes-ledger asset
affected_boundary:
  - specification/requirements/01-notes-cli.md
  - build_tenants/typescript/code/src/commands/list.ts
target_truth: A `notes list` command exists and prints admitted notes
  ordered by timestamp ascending.
closure_law: Closure requires REQ-NOTES-002 lifted, a list-command
  implementation admitted, and a passing test in the test surface.
evaluation_criteria:
  - REQ-NOTES-002 appears in the workspace requirement closure register
  - `notes list` exits 0 against a non-empty ledger and prints rows
  - admitted evidence row of kind `notes_listed` exists for the smoke run
non_closure_conditions:
  - The command depends on network access.
  - The command mutates the ledger.
  - Output order is non-deterministic across runs.
proof_surface:
  - npm test in build_tenants/typescript
  - smoke run admitted under .ai-workspace/runtime/odd_sdlc/operator-runs/
---

# T-201: Add a notes list command with timestamps

## STDO Triage

First missing layer: requirement.

REQ-NOTES-002 declares the behaviour, but no admitted code surface
implements it.

## Approach

One implementation file under `commands/list.ts`. Read the notes ledger,
sort by `createdAt`, print one line per row, admit one evidence row of
kind `notes_listed`. No new asset types.

## Out of scope

- Pagination
- Filtering
- Network sync
```

### Lifecycle

1. **Triage** — author the frontmatter and a short body. Status starts as
   `triage` or `backlog`.
2. **Admit** — move to `active/` when work starts; update `updated_at`.
3. **Execute** — work the change. The proof surface accumulates.
4. **Close** — when the closure law is satisfied, move to `completed/`,
   set `status: completed`, and record `completed_at`.
5. **Supersede** — if the ticket is replaced before closure, set
   `status: superseded` and point at the replacing ticket via
   `superseded_by` (and back from the replacement via `source_ticket`).

**Claude prompt** (alternative to authoring a ticket manually):

> Create a new ticket at
> `$PROJECT_ROOT/.ai-workspace/tickets/active/T-<NNN>-<kebab-slug>.md`
> where `<NNN>` is the next free monotonic id (scan `active/`,
> `backlog/`, and `completed/` to pick it). Follow `TICKET_METHOD.md`
> strictly. Required frontmatter: `id`, `title`, `type`,
> `ticket_category`, `status`, `goal`, `change_intent`, `change_class`,
> `re_entry_point`, `triaged_at`, `created_at`, `updated_at`. Use
> today's date in UTC. Add `target_truth`, `closure_law`,
> `evaluation_criteria`, `non_closure_conditions`, and `proof_surface`
> when the ticket is execution-contract shaped. Body must start with an
> `## STDO Triage` section naming the first missing layer. I will give
> you the title, change_intent, change_class, and goal; do not invent
> those.

---

## Creating a Comment

Comments are the commentary layer. They are **not** constitutional truth.
Use them for analysis, criticism, proposed changes, handoffs, strategy
notes, and closure summaries.

### Where they live

```
$PROJECT_ROOT/.ai-workspace/comments/
├── claude/        # comments authored under the claude agent identity
├── codex/         # comments authored under the codex agent identity
└── <agent>/       # one folder per agent identity
```

One comment per file. Filename convention:
`<UTC-timestamp>_<CATEGORY>_<kebab-slug>.md` for example
`20260512T091400Z_ANALYSIS_notes-cli-list-command-boundary.md`.

`CATEGORY` is one of (per `POSTING_GUIDE.md`):

- `ANALYSIS` — reading current state and naming what's there
- `STRATEGY` — proposing a direction or sequence
- `REVIEW` — review of a ticket, design, or change
- `HANDOFF` — handover to another agent or session
- `CLOSURE` — summary at the end of a wave
- `DECISION` — recording a choice and its rationale

### Structure

A comment carries three sections at minimum:

```markdown
# <title>

**Type:** Analysis | Strategy | Review | Handoff | Closure | Decision
**Author:** <agent>
**Date:** YYYY-MM-DD UTC
**Reviewed artifact:** <path-or-ref>     (when applicable)

This is commentary, not specification or design law.

## Summary

One paragraph: the claim, and why it matters.

## Analysis

Walk the evidence. Cite specific files, lines, or commits. Distinguish
what is observed from what is inferred.

## Recommended Action

What you suggest happens next. May be "ratify into spec/design",
"open ticket T-NNN", "no action", or "supersede previous comment".
```

### Worked example

```markdown
# Boundary analysis: notes list command must read, not mutate

**Type:** Analysis
**Author:** claude
**Date:** 2026-05-12 UTC
**Reviewed artifact:** .ai-workspace/tickets/active/T-201-notes-list.md

This is commentary, not specification or design law.

## Summary

T-201 declares the `notes list` command as a read-only projection over the
notes ledger. A casual implementation that uses the same write-path helper
as `notes add` would silently couple read and write authority and break
REQ-NOTES-005 (one evidence row per command).

## Analysis

- T-201 `target_truth` says the list command "prints admitted notes
  ordered by timestamp ascending" — present-tense read.
- REQ-NOTES-005 (`specification/requirements/01-notes-cli.md`) requires
  exactly one evidence row per successful command.
- The current `notes add` flow at `commands/add.ts` admits a
  `note_admitted` row through `evidenceLedger.append`.
- If `list` reuses `evidenceLedger.append` to emit `notes_listed`, the
  same code path that mutates the notes ledger gets exercised — and a
  refactor to the add-path could regress list silently.

## Recommended Action

Split the evidence interface: introduce `evidenceLedger.appendReadEvent`
(no notes-ledger access) and bind `list` to it. Keep
`evidenceLedger.append` for write events only. Capture this in T-201's
design notes before implementation lands.
```

### When to use a comment vs a ticket

- **Comment** — provisional, investigative, comparative, argumentative,
  not yet ratified.
- **Ticket** — durable work admission that you intend to execute or close
  against.

If a comment ends up driving a change, open a ticket and link to the
comment from `intake_source`. The comment stays as the analytic record;
the ticket becomes the execution record.

### Do not use a comment for

- Live requirements (those go in `specification/requirements/`)
- Live design decisions (those go in `build_tenants/<tenant>/design/`)
- Closure status (that's the ticket's `status` field)

**Claude prompt** (alternative to authoring a comment manually):

> Create a new comment at
> `$PROJECT_ROOT/.ai-workspace/comments/<your-agent-folder>/<UTC-timestamp>_<CATEGORY>_<kebab-slug>.md`.
> `<your-agent-folder>` is your stable agent identity (for example
> `claude`). Use the current UTC instant in compact form
> (`YYYYMMDDTHHMMSSZ`). Follow `POSTING_GUIDE.md` strictly. Body must
> begin with `**Type:**`, `**Author:**`, `**Date:**`, and a `**Reviewed
> artifact:**` line when applicable, followed by the literal sentence
> "This is commentary, not specification or design law." Then sections
> `## Summary`, `## Analysis`, `## Recommended Action`. Cite specific
> file paths and line numbers in the analysis; distinguish observed
> from inferred. I will give you the category, the reviewed artifact,
> and the claim; do not invent any of those.

---

## Glossary

**ABG (Abiogenesis)** — the runtime substrate. Event-sourced, append-only,
replay-derivable. Owns traversal, admission, projection, closure decisions.

**Asset** — a named durable surface of product truth (intent, product,
requirement, design, code, test, evidence). Asset types carry semantic role.

**Asset graph** — the dependency topology over typed asset nodes.

**Assurance ledger** — a projection over admitted events recording per-edge
obligation accounting. Read-only; derived.

**Blocking reason** — a typed reason an edge cannot advance, surfaced
through `gaps` and admitted evidence.

**Candidate family** — a published set of lawful alternatives over one outer
contract. Used for branching like `in_house` vs `third_party`.

**Carrier** — a typed payload that admits intent, evidence, or assurance
into the governed line.

**Carrier schema** — the typed contract a carrier must satisfy. F_D checks
admitted payloads against the schema.

**Closure decision** — the per-edge disposition (`close`, `yield`, `retry`,
`repair`, `re-enter`, `reprice`, `block`).

**Conform project** — the F_D traversal that ingests `specification/`
surfaces and lifts requirement ids into workspace requirement authority.
Graph function: `Fg_conform_project`.

**Construction action** — the typed action the runner picks on the next
traversal step. Surfaced through `next_action` in `gaps`.

**Construction intent** — the admitted intent record for one dispatch.

**Deployed domain** — a downstream `domains/<name>/` package that can be
loaded at runtime over the same GTL/ABG substrate (for example the
`document_to_requirements` domain used by `odd_chat`).

**Disposition** — the closure outcome for one edge (`close`, `yield`, etc.).

**Edge** — one traversal vector instance under a graph function.

**Edge fulfillment ledger** — per-edge obligation accounting. Tracks
`fulfillmentConverged`, `targetCertificationPassed`, `fdRecheckPassed`,
`edgeConverged`.

**Evaluator** — convergence and attestation surface; one of `F_D`, `F_P`,
`F_H`.

**Event** — one append-only runtime fact. The replay spine.

**Evidence row** — one admitted record of admitted product or process truth.

**F_D (deterministic)** — schema, digest, identity, and admission-envelope
checks. No LLM.

**F_H (human)** — operator approval gate.

**F_P (probabilistic)** — LLM-driven asset construction. Owns semantic
quality of `A.req_i → B.result_i`.

**Fg_** — name prefix for graph functions in the odd_sdlc catalog. Examples:
`Fg_conform_project`, `Fg_conform_project_authority`,
`Fg_materialize_declared_product_asset`, `Fg_ingress_project`.

**Frame** — one invocation-local recursion context opened by a selection
decision.

**Gap dossier** — a per-edge typed record of unmet obligations and
recommended re-entry.

**Gap triage** — domain-local classification of an observed mismatch into a
re-entry layer (spec / design / code / evidence / etc.).

**Graph function** — a published reusable workflow program over typed
asset nodes. The unit of dispatch.

**GTL (Graph Type Language)** — the declarative language for graphs, nodes,
vectors, graph functions, jobs, roles, modules. Engine-agnostic.

**Handoff manifest** — the typed package that crosses the F_P boundary,
carrying obligation context.

**Homeostatic loop** — observation → triage → lawful re-entry → renewed
derivation → loopback judgment.

**Installed product payload** — the `.abiogenesis/odd_sdlc/<tenant>/`
directory created by `odd-sdlc-ts install`. Immutable substrate.

**Lawful action** — an action declared by the loaded domain or odd_sdlc
catalog that the operator may legally invoke at the current node.

**Lawful re-entry** — the named constitutional or realization layer the
system must re-enter after gap analysis before forward derivation resumes.

**L (Ledger)** — the immutable governed ledger of work over W.

**Materialization** — the F_P-driven act of constructing a product asset
into the workspace under governed binding.

**Module** — the GTL publication boundary for graph functions and
contracts.

**Next action projection** — the read model that picks the next lawful
construction action from the current frontier.

**Obligation** — a typed requirement to be satisfied for an edge to close.

**odd_chat** — a candidate app built by odd_sdlc as a guided operator CLI
over deployed ODD/GTL/ABG domains.

**odd_sdlc** — the domain package over GTL/ABG that owns the software
delivery lifecycle.

**Operator-run** — one `start` invocation archive under
`.ai-workspace/runtime/odd_sdlc/operator-runs/<timestamp>_pid<pid>/`.

**Operator topology** — the workspace's projected topology after admission.

**Postmortem** — the human-readable event-sequence trace written at the end
of an operator-run.

**Projection** — a replay-derived read model over admitted events. Never
authoritative on its own; derived.

**Provenance** — admitted facts about who/what produced each evidence row.

**Reprice** — open a goal-or-intent change proposal because a gap cannot be
resolved at a lower layer.

**Requirement authority** — admitted, namespaced requirement records lifted
from authoring surfaces (`workspace.bootstrap.*`, `workspace.readme.*`,
`workspace.<source>.*`).

**Requirement closure register** — the projection over admitted requirement
obligations and their current closure state.

**Resolved runtime** — the workspace's bound runtime contract at
`.ai-workspace/runtime/resolved-runtime.json` (when present).

**Role** — a semantic capability class declared in GTL and bound to
workers/personas by policy.

**Sandbox** — a fresh isolated workspace used for a single live build run.

**Selection application** — ABG's admission of a chosen alternative from a
candidate family.

**Source input** — a discovered file from `specification/` and other tracked
roots, admitted as an authoring surface during conform.

**Specification methodology (STDO)** — the four-method constitutional
governance stack: SPEC_METHOD, TICKET_METHOD, DESIGN_MODULE_METHOD,
ODD_METHOD, found in
`<APPS>/specification_methodology/specification/standards/`.

**Change class** — the constitutional layer a ticket re-enters at:
`goal_reprice`, `intent_reprice`, `product_reprice`,
`requirement_reprice`, `design_reframe`, `realization_refactor`.

**Closure law** — the ticket-frontmatter rule that decides whether a
ticket may close. Evaluated against `evaluation_criteria` and not violated
by `non_closure_conditions`.

**Comment** — a commentary artifact under `.ai-workspace/comments/<agent>/`
authored per `POSTING_GUIDE.md`. Not constitutional truth.

**Execution contract** — the run-scoped admitted work surface derived from
a ticket. Carries `target_truth`, `superseded_truth`, `closure_law`,
`evaluation_criteria`, `non_closure_conditions`, `proof_surface`.

**Intake source** — frontmatter field on a ticket pointing at where the
work item originated (comment, conversation, prior ticket).

**odd_manager** — operator-facing control-plane product on the same
GTL/ABG line; lives as an optional sibling under `<APPS>`.

**Re-entry point** — frontmatter field on a ticket naming the layer the
change re-enters (`goal`, `intent`, `product`, `requirement`, `design`,
`realization`).

**Sprint manifest** — an optional grouping artifact admitting a batch of
tickets for one bounded execution window. Defined in `TICKET_METHOD.md`.

**Ticket** — the durable execution record. One markdown file under
`.ai-workspace/tickets/{active,backlog,completed}/T-NNN-<slug>.md`.

**Ticket category** — `ordinary` or `implementation_migration`; orthogonal
to `type`. Governs ticket-execution discipline.

**Ticket type** — `feature`, `bug`, `spike`, `chore`; orthogonal to
`ticket_category` and `change_class`.

**Start** — the public CLI entrypoint that admits intent and runs the
admit → dispatch → admit-result → advance loop.

**Target** — a `--target` selector for `start`: `next` lets the runner
pick; `graph_function:<handle>` and `asset:<handle>` are explicit targets.

**Tenant** — a build_tenants/<name>/ realization line within a project
(here: the `typescript` tenant).

**Traversal** — one bounded run over the SDLC graph from a frame open to
its terminal vector.

**Until** — the `--until` stop mode: `first_traversal`, `converged`,
`blocked`.

**Vector** — a graph edge — the admissible transition from one node to
another under a contract.

**W (Workspace)** — the mutable workspace under construction.

**Worker URI** — the `process://<command>?model=...&effort=...` selector
that binds an external F_P worker.

**Worksite lifecycle** — request → gate → specify → design → implement →
qualify → release → deploy → observe → return → retrofit → relaunch.
