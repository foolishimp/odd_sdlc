# odd_sdlc Run Analysis Scripts

This directory contains read-only helpers for inspecting local run archives.

## `run_summary.py`

Summarizes a TypeScript live/sandbox run archive or an operator-run directory.

```bash
python3 build_tenants/common/analysis_scripts/run_summary.py \
  build_tenants/typescript/test_env/test_runs/<suite>/<timestamp>_pid<pid>
```

Machine-readable output:

```bash
python3 build_tenants/common/analysis_scripts/run_summary.py --json <run-root>
```

Compact terminal progress output:

```bash
python3 build_tenants/common/analysis_scripts/run_summary.py --summary <run-root>
```

Useful repeated watch form:

```bash
watch -n 10 'python3 build_tenants/common/analysis_scripts/run_summary.py --summary --tail 8 <run-root>'
```

The summary reports:

- install status
- step timeline and last known edge
- expected generated-file progress
- materialized product files under `workspace/build_tenants`
- operator-run prompt/package/screenlog sizes
- bloat flags such as inline package JSON, legacy pressure projection, or
  prompt text passed as a command argument

Budgets are intentionally conservative:

- worker prompt: 8 KB
- worker invocation package: 32 KB
- `screenlog.0`: 100 KB

The script does not modify the archive.
