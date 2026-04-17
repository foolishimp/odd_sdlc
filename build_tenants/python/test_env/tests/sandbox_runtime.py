# Validates: REQ-F-VERIFY-003
from __future__ import annotations

import json
import shutil
import subprocess
import sys
from pathlib import Path
from typing import TYPE_CHECKING
from typing import Any

from odd_sdlc.sandbox_lifecycle import (
    assert_installed_genesis_runtime as _assert_installed_genesis_runtime,
    install_kernel_sandbox as _install_kernel_sandbox,
    observe_sandbox as _observe_sandbox,
    reset_sandbox_runtime_state as _reset_sandbox_runtime_state,
    sandbox_env,
    seed_canonical_spec_surface as _seed_canonical_spec_surface,
    seed_odd_sdlc_package as _seed_odd_sdlc_package,
)

if TYPE_CHECKING:
    from run_archive import RunArchive

TESTS_DIR = Path(__file__).resolve().parent


def install_kernel_sandbox(target: Path, *, archive: "RunArchive | None" = None) -> dict[str, Any]:
    try:
        payload = _install_kernel_sandbox(target)
    except subprocess.CalledProcessError as error:
        if archive is not None:
            archive.log_subprocess("install_kernel_sandbox", error)
        raise
    if archive is not None:
        archive.capture_json("installer.result.json", payload)
    return payload


def seed_odd_sdlc_package(target: Path) -> None:
    _seed_odd_sdlc_package(target)


def assert_installed_genesis_runtime(target: Path) -> None:
    _assert_installed_genesis_runtime(target)


def seed_canonical_spec_surface(target: Path) -> None:
    _seed_canonical_spec_surface(target)


def run_installed_odd_sdlc(
    workspace: Path,
    *args: str,
    archive: "RunArchive | None" = None,
    label: str | None = None,
    timeout: int = 60,
) -> subprocess.CompletedProcess[str]:
    try:
        result = subprocess.run(
            [sys.executable, "-m", "odd_sdlc", *args, "--workspace", str(workspace)],
            cwd=str(workspace),
            env=sandbox_env(workspace),
            capture_output=True,
            text=True,
            timeout=timeout,
            check=True,
        )
    except subprocess.CalledProcessError as error:
        if archive is not None:
            archive.log_subprocess(label or f"odd_sdlc {' '.join(args)}", error)
        raise
    if archive is not None:
        archive.log_subprocess(label or f"odd_sdlc {' '.join(args)}", result)
    return result


def run_installed_genesis(
    workspace: Path,
    *args: str,
    archive: "RunArchive | None" = None,
    label: str | None = None,
    timeout: int = 60,
    check: bool = True,
) -> subprocess.CompletedProcess[str]:
    result = subprocess.run(
        [sys.executable, "-m", "genesis", *args, "--workspace", str(workspace)],
        cwd=str(workspace),
        env=sandbox_env(workspace),
        capture_output=True,
        text=True,
        timeout=timeout,
        check=False,
    )
    if archive is not None:
        archive.log_subprocess(label or f"genesis {' '.join(args)}", result)
    if check and result.returncode != 0:
        raise subprocess.CalledProcessError(
            result.returncode,
            result.args,
            output=result.stdout,
            stderr=result.stderr,
        )
    return result


def run_installed_self_test(
    workspace: Path,
    *,
    archive: "RunArchive | None" = None,
    label: str = "odd_sdlc self-test",
    timeout: int = 120,
) -> dict[str, Any]:
    result = run_installed_odd_sdlc(
        workspace,
        "self-test",
        archive=archive,
        label=label,
        timeout=timeout,
    )
    payload = json.loads(result.stdout)
    if archive is not None:
        archive.capture_json("self-test.result.json", payload)
    return payload


def continue_installed_result(
    workspace: Path,
    *,
    result_path: Path,
    archive: "RunArchive | None" = None,
    label: str = "odd_sdlc continue",
    timeout: int = 120,
) -> dict[str, Any]:
    result = run_installed_odd_sdlc(
        workspace,
        "continue",
        "--result",
        str(result_path),
        archive=archive,
        label=label,
        timeout=timeout,
    )
    payload = json.loads(result.stdout)
    if archive is not None:
        archive.capture_json("continue.result.json", payload)
    return payload


def refresh_installed_analysis(
    workspace: Path,
    *,
    archive: "RunArchive | None" = None,
    label: str = "odd_sdlc refresh-analysis",
    timeout: int = 60,
) -> dict[str, Any]:
    result = run_installed_odd_sdlc(
        workspace,
        "refresh-analysis",
        archive=archive,
        label=label,
        timeout=timeout,
    )
    return json.loads(result.stdout)


def run_constructor_for_start(
    workspace: Path,
    *,
    start_payload: dict[str, Any],
    archive: "RunArchive | None" = None,
    label: str | None = None,
) -> tuple[dict[str, Any], Path]:
    if start_payload.get("blocking_reason") != "fp_dispatch" or "fp_manifest_path" not in start_payload:
        raise AssertionError(
            "Expected start to dispatch F_P with fp_manifest_path, "
            f"got blocking_reason={start_payload.get('blocking_reason')!r} "
            f"failing_evaluators={start_payload.get('failing_evaluators', [])!r} "
            f"edge={start_payload.get('edge')!r}"
        )
    manifest_path = Path(start_payload["fp_manifest_path"])
    result = run_installed_odd_sdlc(
        workspace,
        "construct",
        "--manifest",
        str(manifest_path),
        archive=archive,
        label=label or "odd_sdlc construct",
    )
    payload = json.loads(result.stdout)
    if archive is not None:
        archive.capture_json("construct.result.json", payload)
    return payload, Path(payload["result_path"])


def complete_current_call(
    workspace: Path,
    *,
    archive: "RunArchive | None" = None,
    label_prefix: str,
) -> dict[str, Any]:
    refresh = refresh_installed_analysis(
        workspace,
        archive=archive,
        label=f"{label_prefix} refresh-analysis",
    )
    start = json.loads(
        run_installed_odd_sdlc(
            workspace,
            "start",
            archive=archive,
            label=f"{label_prefix} start",
        ).stdout
    )
    constructor, result_path = run_constructor_for_start(
        workspace,
        start_payload=start,
        archive=archive,
        label=f"{label_prefix} construct",
    )
    assessed = json.loads(
        run_installed_genesis(
            workspace,
            "assess-result",
            "--result",
            str(result_path),
            archive=archive,
            label=f"{label_prefix} assess-result",
        ).stdout
    )
    return {
        "refresh_analysis": refresh,
        "start": start,
        "constructor": constructor,
        "assessed": assessed,
    }


def complete_bootstrap_chain(
    workspace: Path,
    *,
    archive: "RunArchive | None" = None,
    label_prefix: str,
    steps: tuple[str, ...] = (
        "derive_intent_surface",
        "derive_product_surface",
        "derive_goal_surface",
        "derive_requirement_surface",
        "derive_feature_decomp_surface",
        "derive_uat_testcases_surface",
        "derive_design_surface",
        "derive_scenario_surface",
        "derive_implementation_design_surface",
        "select_implementation_stack_profile",
        "derive_implementation_module_surface",
        "derive_code_surface",
        "derive_test_design_surface",
        "select_test_stack_profile",
        "derive_test_module_surface",
        "derive_test_run_archive_surface",
        "qualify_testcase_authority",
        "prepare_release_surface",
    ),
) -> list[dict[str, Any]]:
    completed: list[dict[str, Any]] = []
    for edge in steps:
        step_label = edge.removeprefix("derive_").removesuffix("_surface")
        result = complete_current_call(
            workspace,
            archive=archive,
            label_prefix=f"{label_prefix}_{step_label}",
        )
        if result["start"]["edge"] != edge:
            raise AssertionError(f"Expected edge {edge!r}, got {result['start']['edge']!r}")
        completed.append(result)
    return completed


def reset_sandbox_runtime_state(
    workspace: Path,
    *,
    archive: "RunArchive | None" = None,
    snapshot_label: str = "before_reset",
) -> None:
    runtime_root = workspace / ".ai-workspace"
    if archive is not None and runtime_root.exists():
        archive.snapshot_runtime(snapshot_label, workspace=workspace)
        archive.note("runtime_reset", snapshot_label=snapshot_label)
    _reset_sandbox_runtime_state(workspace)


def read_events(workspace: Path) -> list[dict[str, Any]]:
    observation = _observe_sandbox(workspace)
    if observation["event_count"] == 0:
        return []
    path = workspace / ".ai-workspace" / "events" / "events.jsonl"
    return [
        json.loads(line)
        for line in path.read_text(encoding="utf-8").splitlines()
        if line.strip()
    ]
