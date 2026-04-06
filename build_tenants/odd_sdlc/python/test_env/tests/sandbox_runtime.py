# Validates: REQ-F-VERIFY-003
from __future__ import annotations

import json
import os
import shutil
import subprocess
import sys
from pathlib import Path
from typing import TYPE_CHECKING
from typing import Any

if TYPE_CHECKING:
    from run_archive import RunArchive

TESTS_DIR = Path(__file__).resolve().parent
ODD_ROOT = TESTS_DIR.parents[4]
APPS_ROOT = TESTS_DIR.parents[5]
ABI_INSTALLER = APPS_ROOT / "abiogenesis" / "build_tenants" / "abiogenesis" / "python" / "code" / "gen-install.py"
SOURCE_PACKAGE = ODD_ROOT / "build_tenants" / "odd_sdlc" / "python" / "code" / "odd_sdlc"


def install_kernel_sandbox(target: Path, *, archive: "RunArchive | None" = None) -> dict[str, Any]:
    target.mkdir(parents=True, exist_ok=True)
    try:
        result = subprocess.run(
            [sys.executable, str(ABI_INSTALLER), "--target", str(target), "--project-slug", "odd_sdlc_sandbox"],
            capture_output=True,
            text=True,
            timeout=120,
            check=True,
        )
    except subprocess.CalledProcessError as error:
        if archive is not None:
            archive.log_subprocess("install_kernel_sandbox", error)
        raise
    if archive is not None:
        archive.log_subprocess("install_kernel_sandbox", result)
        archive.capture_text("installer.stdout.txt", result.stdout)
    return json.loads(result.stdout)


def seed_odd_sdlc_package(target: Path) -> None:
    package_root = target / "build_tenants" / "odd_sdlc" / "python" / "code"
    package_root.mkdir(parents=True, exist_ok=True)
    shutil.copytree(SOURCE_PACKAGE, package_root / "odd_sdlc", dirs_exist_ok=True)


def seed_canonical_spec_surface(target: Path) -> None:
    spec_root = target / "specification"
    (spec_root / "requirements").mkdir(parents=True, exist_ok=True)
    (spec_root / "INTENT.md").write_text(
        "# Intent\n\n`odd_sdlc` exists to prove asset-typed GTL/ABG app execution.\n",
        encoding="utf-8",
    )
    (spec_root / "PRODUCT.md").write_text(
        "# Product\n\nThe canonical sandbox use case is a toy app with real GTL publication and ABG runtime audit.\n",
        encoding="utf-8",
    )
    (spec_root / "GOALS.md").write_text(
        "# Goals\n\n- run the sandbox\n- inspect emitted facts\n- reset and rerun\n",
        encoding="utf-8",
    )
    (spec_root / "requirements" / "10-canonical-sandbox.md").write_text(
        "# Canonical Sandbox Requirements\n\nThe sandbox lane must be repeatable.\n",
        encoding="utf-8",
    )


def sandbox_env(workspace: Path) -> dict[str, str]:
    env = os.environ.copy()
    env["PYTHONPATH"] = os.pathsep.join(
        (
            str(workspace / ".genesis"),
            str(workspace / "build_tenants" / "odd_sdlc" / "python" / "code"),
        )
    )
    env.pop("PYTEST_CURRENT_TEST", None)
    return env


def run_installed_odd_sdlc(
    workspace: Path,
    *args: str,
    archive: "RunArchive | None" = None,
    label: str | None = None,
) -> subprocess.CompletedProcess[str]:
    try:
        result = subprocess.run(
            [sys.executable, "-m", "odd_sdlc", *args, "--workspace", str(workspace)],
            cwd=str(workspace),
            env=sandbox_env(workspace),
            capture_output=True,
            text=True,
            timeout=60,
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
) -> subprocess.CompletedProcess[str]:
    try:
        result = subprocess.run(
            [sys.executable, "-m", "genesis", *args, "--workspace", str(workspace)],
            cwd=str(workspace),
            env=sandbox_env(workspace),
            capture_output=True,
            text=True,
            timeout=60,
            check=True,
        )
    except subprocess.CalledProcessError as error:
        if archive is not None:
            archive.log_subprocess(label or f"genesis {' '.join(args)}", error)
        raise
    if archive is not None:
        archive.log_subprocess(label or f"genesis {' '.join(args)}", result)
    return result


def run_installed_self_test(
    workspace: Path,
    *,
    archive: "RunArchive | None" = None,
    label: str = "odd_sdlc self-test",
) -> dict[str, Any]:
    result = run_installed_odd_sdlc(
        workspace,
        "self-test",
        archive=archive,
        label=label,
    )
    payload = json.loads(result.stdout)
    if archive is not None:
        archive.capture_json("self-test.result.json", payload)
    return payload


def run_constructor_for_start(
    workspace: Path,
    *,
    start_payload: dict[str, Any],
    archive: "RunArchive | None" = None,
    label: str | None = None,
) -> tuple[dict[str, Any], Path]:
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
    if runtime_root.exists():
        shutil.rmtree(runtime_root)


def read_events(workspace: Path) -> list[dict[str, Any]]:
    path = workspace / ".ai-workspace" / "events" / "events.jsonl"
    if not path.exists():
        return []
    return [
        json.loads(line)
        for line in path.read_text(encoding="utf-8").splitlines()
        if line.strip()
    ]
