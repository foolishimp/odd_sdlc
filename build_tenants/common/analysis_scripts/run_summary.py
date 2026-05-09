#!/usr/bin/env python3
"""Summarize odd_sdlc test-run and operator-run archives.

The script is intentionally read-only. It understands the current TypeScript
live/sandbox archive shape and reports the facts that are usually needed when a
long run is being inspected by hand: step progress, generated product files,
operator-run payload sizes, terminal/session bloat, and obvious prompt-package
duplication.
"""

from __future__ import annotations

import argparse
import json
import os
import re
import sys
from collections import Counter
from pathlib import Path
from typing import Any


PROMPT_BUDGET_BYTES = 8 * 1024
INVOCATION_PACKAGE_BUDGET_BYTES = 32 * 1024
SCREENLOG_BUDGET_BYTES = 100 * 1024


def read_text(path: Path) -> str:
    try:
        return path.read_text(encoding="utf-8", errors="replace")
    except OSError:
        return ""


def read_json(path: Path) -> Any | None:
    try:
        return json.loads(path.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError):
        return None


def file_size(path: Path) -> int:
    try:
        return path.stat().st_size
    except OSError:
        return 0


def dir_size(path: Path) -> int:
    total = 0
    if not path.exists():
        return 0
    for root, _, files in os.walk(path):
        for name in files:
            total += file_size(Path(root) / name)
    return total


def human_bytes(size: int) -> str:
    value = float(size)
    for unit in ("B", "KB", "MB", "GB"):
        if value < 1024 or unit == "GB":
            if unit == "B":
                return f"{int(value)} {unit}"
            return f"{value:.1f} {unit}"
        value /= 1024
    return f"{size} B"


def nested_get(record: Any, path: list[str], default: Any = None) -> Any:
    current = record
    for key in path:
        if not isinstance(current, dict) or key not in current:
            return default
        current = current[key]
    return current


def short_path(path: Path, root: Path) -> str:
    try:
        return str(path.relative_to(root))
    except ValueError:
        return str(path)


def parse_step_number(path: Path) -> int:
    match = re.search(r"step-(\d+)-", path.name)
    return int(match.group(1)) if match else -1


def find_workspace(run_root: Path) -> Path | None:
    candidate = run_root / "workspace"
    if candidate.is_dir():
        return candidate
    for parent in [run_root, *run_root.parents]:
        candidate = parent / "workspace"
        if candidate.is_dir():
            return candidate
    return None


def find_test_run_root(path: Path) -> Path:
    current = path.resolve()
    if current.is_file():
        current = current.parent
    if (current / "workspace").is_dir() or (current / "steps.json").is_file():
        return current
    for parent in current.parents:
        if (parent / "workspace").is_dir() or (parent / "steps.json").is_file():
            return parent
    return current


def latest_generated_state(run_root: Path) -> dict[str, Any] | None:
    states = sorted(
        run_root.glob("step-*-generated-suite-state.json"),
        key=parse_step_number,
    )
    if not states:
        initial = run_root / "initial_generated_suite_state.json"
        payload = read_json(initial)
        return payload if isinstance(payload, dict) else None
    payload = read_json(states[-1])
    return payload if isinstance(payload, dict) else None


def summarize_steps(run_root: Path) -> list[dict[str, Any]]:
    steps_path = run_root / "steps.json"
    steps = read_json(steps_path)
    if isinstance(steps, list):
        return [step for step in steps if isinstance(step, dict)]
    summaries: list[dict[str, Any]] = []
    for process_path in sorted(run_root.glob("step-*-*.process.json")):
        payload = read_json(process_path)
        if not isinstance(payload, dict):
            continue
        name = process_path.name.removesuffix(".process.json")
        summaries.append(
            {
                "step": parse_step_number(process_path),
                "phase": "start" if "-start-" in name else "gaps",
                "label": name,
                "status": payload.get("status"),
                "signal": payload.get("signal"),
                "stdoutBytes": payload.get("stdoutBytes"),
                "stderrBytes": payload.get("stderrBytes"),
            }
        )
    return summaries


def summarize_install(run_root: Path) -> dict[str, Any]:
    process = read_json(run_root / "install.process.json")
    result = read_json(run_root / "install_result.json")
    return {
        "status": nested_get(process, ["status"]),
        "signal": nested_get(process, ["signal"]),
        "stdoutBytes": nested_get(process, ["stdoutBytes"]),
        "stderrBytes": nested_get(process, ["stderrBytes"]),
        "resultStatus": nested_get(result, ["status"]),
        "payloadKind": nested_get(result, ["payload", "kind"]),
    }


def process_alive(pid: int) -> bool:
    try:
        os.kill(pid, 0)
    except ProcessLookupError:
        return False
    except PermissionError:
        return True
    return True


def run_process_summary(run_root: Path) -> dict[str, Any]:
    match = re.search(r"_pid(\d+)$", run_root.name)
    if match is None:
        return {"pid": None, "alive": None}
    pid = int(match.group(1))
    return {"pid": pid, "alive": process_alive(pid)}


def summarize_expected_files(state: dict[str, Any] | None) -> dict[str, Any]:
    rows = state.get("expectedFiles", []) if isinstance(state, dict) else []
    if not isinstance(rows, list):
        rows = []
    present = [row for row in rows if isinstance(row, dict) and row.get("exists") is True]
    missing = [
        row.get("relativePath")
        for row in rows
        if isinstance(row, dict) and row.get("exists") is not True
    ]
    present_paths = [
        row.get("relativePath")
        for row in present
        if isinstance(row.get("relativePath"), str)
    ]
    missing_paths = [path for path in missing if isinstance(path, str)]
    return {
        "expectedCount": len(rows),
        "presentCount": len(present),
        "missingCount": len(missing_paths),
        "expectedFilesPresent": bool(state.get("expectedFilesPresent"))
        if isinstance(state, dict)
        else False,
        "presentFiles": present_paths,
        "missingFiles": missing_paths,
        "runtimeFileCount": state.get("runtimeFileCount") if isinstance(state, dict) else None,
        "runtimeAssetFileCount": state.get("runtimeAssetFileCount")
        if isinstance(state, dict)
        else None,
        "operatorRunFileCount": state.get("operatorRunFileCount")
        if isinstance(state, dict)
        else None,
    }


def product_files(workspace: Path | None) -> list[str]:
    if workspace is None:
        return []
    root = workspace / "build_tenants"
    if not root.is_dir():
        return []
    files = [
        short_path(path, workspace)
        for path in root.rglob("*")
        if path.is_file()
    ]
    return sorted(files)


def parse_tokens_used(screenlog: str) -> int | None:
    lines = [line.strip() for line in screenlog.splitlines()]
    for index, line in enumerate(lines):
        if line == "tokens used" and index + 1 < len(lines):
            raw = lines[index + 1].replace(",", "")
            if raw.isdigit():
                return int(raw)
    match = re.search(r"tokens used\s+([0-9,]+)", screenlog)
    if match:
        return int(match.group(1).replace(",", ""))
    return None


def load_command_args(operator_root: Path) -> list[str]:
    command = read_json(
        operator_root / "worker_process_events.jsonl.trace" / "command.json"
    )
    args = command.get("args") if isinstance(command, dict) else None
    if isinstance(args, list):
        return [arg for arg in args if isinstance(arg, str)]
    return []


def summarize_operator_run(operator_root: Path, run_root: Path) -> dict[str, Any]:
    invocation = read_json(operator_root / "worker_invocation_package.json")
    traversal = read_json(operator_root / "traversal_intent_package.json")
    if not isinstance(invocation, dict):
        invocation = {}
    if not isinstance(traversal, dict):
        traversal = {}

    prompt_path = operator_root / "worker_prompt.md"
    prompt = read_text(prompt_path)
    screenlog_path = (
        operator_root
        / "worker_process_events.jsonl.trace"
        / "terminal_session"
        / "screenlog.0"
    )
    screenlog = read_text(screenlog_path)
    command_args = load_command_args(operator_root)
    prompt_arg_bytes = max((len(arg.encode("utf-8")) for arg in command_args), default=0)

    inline_package = "Compact worker invocation package:" in prompt
    legacy_projection = "Legacy compact prompt pressure projection:" in prompt
    prompt_passed_as_argv = prompt_arg_bytes >= file_size(prompt_path) and prompt_arg_bytes > 1024

    sizes = {
        "operatorRunBytes": dir_size(operator_root),
        "workerPromptBytes": file_size(prompt_path),
        "workerInvocationPackageBytes": file_size(
            operator_root / "worker_invocation_package.json"
        ),
        "traversalIntentPackageBytes": file_size(
            operator_root / "traversal_intent_package.json"
        ),
        "handoffManifestBytes": file_size(operator_root / "handoff_manifest.json"),
        "screenlogBytes": file_size(screenlog_path),
        "workerStdoutBytes": file_size(operator_root / "worker_stdout.log"),
        "runtimeEventsBytes": file_size(operator_root / "runtime_events.json"),
        "runJsonBytes": file_size(operator_root / "run.json"),
        "largestCommandArgBytes": prompt_arg_bytes,
    }

    flags: list[str] = []
    if sizes["workerPromptBytes"] > PROMPT_BUDGET_BYTES:
        flags.append("prompt_over_budget")
    if sizes["workerInvocationPackageBytes"] > INVOCATION_PACKAGE_BUDGET_BYTES:
        flags.append("invocation_package_over_budget")
    if sizes["screenlogBytes"] > SCREENLOG_BUDGET_BYTES:
        flags.append("screenlog_over_budget")
    if inline_package:
        flags.append("inline_invocation_package_in_prompt")
    if legacy_projection:
        flags.append("legacy_pressure_projection_in_prompt")
    if prompt_passed_as_argv:
        flags.append("prompt_passed_as_command_arg")

    materialization = traversal.get("productMaterialization")
    if not isinstance(materialization, dict):
        materialization = {}

    return {
        "name": operator_root.name,
        "path": short_path(operator_root, run_root),
        "edgeName": invocation.get("edgeName") or traversal.get("edgeName"),
        "vectorIndex": invocation.get("vectorIndex") or traversal.get("vectorIndex"),
        "targetAssetType": invocation.get("targetAssetType")
        or traversal.get("targetAssetType"),
        "materializationRequired": nested_get(
            invocation, ["outputContract", "materializationRequired"],
            materialization.get("required"),
        ),
        "includedModuleNames": nested_get(
            invocation, ["featureScope", "includedModuleNames"], []
        ),
        "selectedStrategy": nested_get(
            invocation, ["traversalStrategyDecision", "selectedStrategy"]
        ),
        "tokensUsed": parse_tokens_used(screenlog),
        "sizes": sizes,
        "bloatFlags": flags,
    }


def find_operator_runs(run_root: Path, workspace: Path | None) -> list[Path]:
    candidates: list[Path] = []
    if (run_root / "worker_invocation_package.json").is_file():
        candidates.append(run_root)
    roots = []
    if workspace is not None:
        roots.append(workspace / ".ai-workspace/runtime/odd_sdlc/operator-runs")
    roots.append(run_root / "workspace/.ai-workspace/runtime/odd_sdlc/operator-runs")
    for root in roots:
        if root.is_dir():
            candidates.extend(path for path in root.iterdir() if path.is_dir())
    return sorted(set(candidates), key=lambda path: path.name)


def summarize_run(path: Path) -> dict[str, Any]:
    run_root = find_test_run_root(path)
    workspace = find_workspace(run_root)
    state = latest_generated_state(run_root)
    operators = [
        summarize_operator_run(operator_root, run_root)
        for operator_root in find_operator_runs(run_root, workspace)
    ]
    steps = summarize_steps(run_root)
    last_step = steps[-1] if steps else None
    return {
        "runRoot": str(run_root),
        "workspace": str(workspace) if workspace is not None else None,
        "process": run_process_summary(run_root),
        "install": summarize_install(run_root),
        "steps": steps,
        "lastStep": last_step,
        "expectedFiles": summarize_expected_files(state),
        "productFiles": product_files(workspace),
        "operatorRuns": operators,
        "operatorRunCount": len(operators),
        "operatorRunBytes": sum(
            int(operator["sizes"]["operatorRunBytes"]) for operator in operators
        ),
    }


def print_text_summary(summary: dict[str, Any], operator_limit: int) -> None:
    print(f"Run root: {summary['runRoot']}")
    print(f"Workspace: {summary['workspace']}")
    process = summary["process"]
    print(f"Process: pid={process.get('pid')} alive={process.get('alive')}")
    install = summary["install"]
    print(
        "Install: "
        f"status={install.get('status')} result={install.get('resultStatus')} "
        f"payload={install.get('payloadKind')}"
    )

    steps = summary["steps"]
    last = summary["lastStep"] or {}
    print(
        "Steps: "
        f"{len(steps)} records; last phase={last.get('phase')} "
        f"current={last.get('currentEdge')} requested={last.get('requestedEdge')} "
        f"blocking={last.get('blockingReason')}"
    )

    expected = summary["expectedFiles"]
    print(
        "Expected files: "
        f"{expected['presentCount']}/{expected['expectedCount']} present; "
        f"missing={expected['missingCount']}; "
        f"allPresent={expected['expectedFilesPresent']}"
    )
    print(
        "Runtime counts: "
        f"files={expected.get('runtimeFileCount')} "
        f"assets={expected.get('runtimeAssetFileCount')} "
        f"operatorRunFiles={expected.get('operatorRunFileCount')}"
    )

    product = summary["productFiles"]
    print(f"Product files under workspace/build_tenants: {len(product)}")
    for path in product[:20]:
        print(f"  - {path}")
    if len(product) > 20:
        print(f"  ... {len(product) - 20} more")

    missing = expected["missingFiles"]
    if missing:
        print("Missing expected files:")
        for path in missing[:20]:
            print(f"  - {path}")
        if len(missing) > 20:
            print(f"  ... {len(missing) - 20} more")

    print(
        "Operator runs: "
        f"{summary['operatorRunCount']} dirs; total={human_bytes(summary['operatorRunBytes'])}"
    )
    print("Recent/largest operator-run details:")
    operators = sorted(
        summary["operatorRuns"],
        key=lambda row: (
            len(row["bloatFlags"]) == 0,
            -int(row["sizes"]["operatorRunBytes"]),
            row["name"],
        ),
    )
    for row in operators[:operator_limit]:
        sizes = row["sizes"]
        flags = ",".join(row["bloatFlags"]) if row["bloatFlags"] else "none"
        modules = ",".join(row.get("includedModuleNames") or [])
        print(
            "  - "
            f"{row['name']} edge={row.get('edgeName')} "
            f"target={row.get('targetAssetType')} "
            f"materialize={row.get('materializationRequired')} "
            f"modules={modules or '-'} "
            f"prompt={human_bytes(sizes['workerPromptBytes'])} "
            f"pkg={human_bytes(sizes['workerInvocationPackageBytes'])} "
            f"screenlog={human_bytes(sizes['screenlogBytes'])} "
            f"tokens={row.get('tokensUsed')} "
            f"flags={flags}"
        )

    if steps:
        print("Step timeline:")
        for step in steps:
            phase = step.get("phase")
            current = step.get("currentEdge")
            requested = step.get("requestedEdge")
            status = step.get("status")
            postflight = step.get("postflight")
            assurance = step.get("assurance")
            print(
                "  - "
                f"{step.get('step'):>2} {phase:<5} "
                f"current={current} requested={requested} "
                f"status={status} postflight={postflight} assurance={assurance}"
            )


def tenant_name_from_expected_path(path: str) -> str | None:
    parts = path.split("/")
    if len(parts) < 3 or parts[0] != "build_tenants":
        return None
    return parts[1]


def expected_tenant_progress(expected: dict[str, Any]) -> list[dict[str, Any]]:
    by_tenant: dict[str, dict[str, int]] = {}
    for path in expected.get("presentFiles", []):
        if not isinstance(path, str):
            continue
        tenant = tenant_name_from_expected_path(path)
        if tenant is None:
            continue
        row = by_tenant.setdefault(tenant, {"present": 0, "expected": 0})
        row["present"] += 1
        row["expected"] += 1
    for path in expected.get("missingFiles", []):
        if not isinstance(path, str):
            continue
        tenant = tenant_name_from_expected_path(path)
        if tenant is None:
            continue
        row = by_tenant.setdefault(tenant, {"present": 0, "expected": 0})
        row["expected"] += 1
    return [
        {"tenant": tenant, **counts}
        for tenant, counts in sorted(by_tenant.items())
    ]


def edge_label(step: dict[str, Any]) -> str:
    phase = step.get("phase")
    current = step.get("currentEdge")
    requested = step.get("requestedEdge")
    if phase == "start" and requested is not None:
        return f"{requested} -> {current}"
    return str(current)


def status_label(step: dict[str, Any]) -> str:
    status = step.get("status")
    postflight = step.get("postflight")
    assurance = step.get("assurance")
    blocking = step.get("blockingReason")
    if blocking is not None:
        return f"blocked:{blocking}"
    if postflight is not None or assurance is not None:
        return f"{status}/{postflight}/{assurance}"
    return str(status)


def compact_bloat_label(flags: list[str]) -> str:
    names = {
        "prompt_over_budget": "prompt",
        "invocation_package_over_budget": "pkg",
        "screenlog_over_budget": "screen",
        "inline_invocation_package_in_prompt": "inline-pkg",
        "legacy_pressure_projection_in_prompt": "legacy-proj",
        "prompt_passed_as_command_arg": "argv-prompt",
    }
    return ",".join(names.get(flag, flag) for flag in flags) if flags else "none"


def print_terminal_summary(
    summary: dict[str, Any],
    *,
    tail: int,
    operator_limit: int,
) -> None:
    process = summary["process"]
    install = summary["install"]
    expected = summary["expectedFiles"]
    steps = summary["steps"]
    last = summary["lastStep"] or {}
    product_count = len(summary["productFiles"])
    operators = summary["operatorRuns"]
    flagged = [row for row in operators if row["bloatFlags"]]
    flag_counts = Counter(flag for row in flagged for flag in row["bloatFlags"])

    print(
        "run "
        f"pid={process.get('pid')} alive={process.get('alive')} "
        f"install={install.get('resultStatus') or install.get('status')} "
        f"steps={len(steps)} last={edge_label(last)} "
        f"expected={expected['presentCount']}/{expected['expectedCount']} "
        f"productFiles={product_count} "
        f"operators={summary['operatorRunCount']} "
        f"operatorBytes={human_bytes(summary['operatorRunBytes'])}"
    )

    tenants = expected_tenant_progress(expected)
    if tenants:
        tenant_line = " ".join(
            f"{row['tenant']}={row['present']}/{row['expected']}"
            for row in tenants
        )
        print(f"tenants {tenant_line}")

    print(
        "runtime "
        f"files={expected.get('runtimeFileCount')} "
        f"assets={expected.get('runtimeAssetFileCount')} "
        f"operatorRunFiles={expected.get('operatorRunFileCount')}"
    )

    if flagged:
        top_flags = ", ".join(
            f"{name}:{count}" for name, count in flag_counts.most_common(4)
        )
        print(f"bloat flaggedRuns={len(flagged)}/{len(operators)} topFlags={top_flags}")
        worst = sorted(
            flagged,
            key=lambda row: (
                -int(row["sizes"]["screenlogBytes"]),
                -int(row["sizes"]["workerPromptBytes"]),
                row["name"],
            ),
        )
        for row in worst[:operator_limit]:
            sizes = row["sizes"]
            print(
                "  "
                f"{row['vectorIndex']:>2} {row['edgeName']} "
                f"prompt={human_bytes(sizes['workerPromptBytes'])} "
                f"pkg={human_bytes(sizes['workerInvocationPackageBytes'])} "
                f"screen={human_bytes(sizes['screenlogBytes'])} "
                f"tokens={row.get('tokensUsed')} "
                f"flags={compact_bloat_label(row['bloatFlags'])}"
            )

    start_steps = [step for step in steps if step.get("phase") == "start"]
    if start_steps:
        print(f"recent starts last={min(tail, len(start_steps))}:")
        for step in start_steps[-tail:]:
            print(
                "  "
                f"{step.get('step'):>2} {edge_label(step)} "
                f"{status_label(step)}"
            )

    missing = expected.get("missingFiles", [])
    if missing:
        print(f"missing expected files={len(missing)}")
        for path in missing[: min(6, len(missing))]:
            print(f"  - {path}")
        if len(missing) > 6:
            print(f"  ... {len(missing) - 6} more")


def main(argv: list[str]) -> int:
    parser = argparse.ArgumentParser(
        description="Summarize an odd_sdlc test-run or operator-run archive."
    )
    parser.add_argument("path", type=Path, help="test run root or operator run path")
    parser.add_argument(
        "--json",
        action="store_true",
        help="emit machine-readable JSON instead of text",
    )
    parser.add_argument(
        "--summary",
        action="store_true",
        help="emit a compact terminal progress summary",
    )
    parser.add_argument(
        "--tail",
        type=int,
        default=6,
        help="number of recent start steps to print in --summary mode",
    )
    parser.add_argument(
        "--operator-limit",
        type=int,
        default=12,
        help="number of operator runs to print in text mode",
    )
    args = parser.parse_args(argv)

    summary = summarize_run(args.path)
    if args.json:
        json.dump(summary, sys.stdout, indent=2, sort_keys=True)
        sys.stdout.write("\n")
    elif args.summary:
        print_terminal_summary(
            summary,
            tail=max(0, args.tail),
            operator_limit=max(0, args.operator_limit),
        )
    else:
        print_text_summary(summary, max(0, args.operator_limit))
    return 0


if __name__ == "__main__":
    raise SystemExit(main(sys.argv[1:]))
