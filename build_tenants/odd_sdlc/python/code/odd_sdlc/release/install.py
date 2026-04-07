# Implements: REQ-F-ODDSDLC-007
"""Deploy odd_sdlc into a target workspace and normalize it for operation."""
from __future__ import annotations

import argparse
import json
import shutil
import subprocess
import sys
from pathlib import Path
from typing import Any

from odd_sdlc.normalization import normalize_workspace


SOURCE_PACKAGE = Path(__file__).resolve().parents[1]
APPS_ROOT = Path(__file__).resolve().parents[7]
ABI_INSTALLER = APPS_ROOT / "abiogenesis" / "build_tenants" / "abiogenesis" / "python" / "code" / "gen-install.py"
RUNTIME_CONTRACT_RELATIVE = Path(".odd_sdlc/release/genesis.yml")


def _copy_package(target_root: Path) -> Path:
    package_root = target_root / "build_tenants" / "odd_sdlc" / "python" / "code"
    package_root.mkdir(parents=True, exist_ok=True)
    shutil.copytree(
        SOURCE_PACKAGE,
        package_root / "odd_sdlc",
        dirs_exist_ok=True,
        ignore=shutil.ignore_patterns("__pycache__", "*.pyc", "*.pyo"),
    )
    return package_root / "odd_sdlc"


def _run_abiogenesis_install(target_root: Path, *, project_slug: str, platform: str) -> dict[str, Any]:
    if not ABI_INSTALLER.exists():
        raise FileNotFoundError(f"abiogenesis installer not found at {ABI_INSTALLER}")
    result = subprocess.run(
        [
            sys.executable,
            str(ABI_INSTALLER),
            "--target",
            str(target_root),
            "--project-slug",
            project_slug,
            "--platform",
            platform,
        ],
        capture_output=True,
        text=True,
        timeout=180,
        check=True,
    )
    return json.loads(result.stdout)


def _runtime_contract_lines() -> tuple[str, ...]:
    return (
        "# odd_sdlc runtime contract",
        "module: odd_sdlc.gtl_module:MODULE",
        "package: odd_sdlc.gtl_module:MODULE",
        "domain_package: odd_sdlc",
        "pythonpath:",
        "  - .genesis",
        "  - build_tenants/odd_sdlc/python/code",
        "",
    )


def _write_runtime_contract(target_root: Path) -> Path:
    contract_path = target_root / RUNTIME_CONTRACT_RELATIVE
    contract_path.parent.mkdir(parents=True, exist_ok=True)
    contract_path.write_text("\n".join(_runtime_contract_lines()), encoding="utf-8")
    return contract_path


def _wire_kernel_contract(target_root: Path) -> None:
    kernel_path = target_root / ".genesis" / "genesis.yml"
    if not kernel_path.exists():
        return
    desired = f"runtime_contract: {RUNTIME_CONTRACT_RELATIVE.as_posix()}"
    text = kernel_path.read_text(encoding="utf-8")
    if desired in text:
        return
    if "# runtime_contract: path/to/domain/genesis.yml" in text:
        text = text.replace("# runtime_contract: path/to/domain/genesis.yml", desired)
    else:
        text = text.rstrip() + f"\n{desired}\n"
    kernel_path.write_text(text, encoding="utf-8")


def install(
    target_root: Path | str,
    *,
    project_slug: str | None = None,
    platform: str = "python",
) -> dict[str, Any]:
    root = Path(target_root).resolve()
    slug = (project_slug or root.name.split(".", 1)[0] or "project").replace("-", "_")
    abiogenesis_result = _run_abiogenesis_install(root, project_slug=slug, platform=platform)
    package_path = _copy_package(root)
    normalization = normalize_workspace(root, project_slug=slug, platform=platform)
    contract_path = _write_runtime_contract(root)
    _wire_kernel_contract(root)
    return {
        "status": "installed",
        "target_root": str(root),
        "project_slug": slug,
        "platform": platform,
        "abiogenesis": abiogenesis_result,
        "package_path": str(package_path.relative_to(root)),
        "runtime_contract": str(contract_path.relative_to(root)),
        "normalization": normalization,
    }


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(prog="odd_sdlc.release.install")
    parser.add_argument("--target", required=True)
    parser.add_argument("--project-slug")
    parser.add_argument("--platform", default="python")
    args = parser.parse_args(argv)

    payload = install(
        args.target,
        project_slug=args.project_slug,
        platform=args.platform,
    )
    print(json.dumps(payload, indent=2, sort_keys=True))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
