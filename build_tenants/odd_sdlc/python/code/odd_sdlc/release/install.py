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

from odd_sdlc.normalization import PROJECT_BOOTSTRAP_PATH, normalize_workspace


SOURCE_PACKAGE = Path(__file__).resolve().parents[1]
APPS_ROOT = Path(__file__).resolve().parents[7]
ABI_INSTALLER = APPS_ROOT / "abiogenesis" / "build_tenants" / "abiogenesis" / "python" / "code" / "gen-install.py"
RUNTIME_CONTRACT_RELATIVE = Path(".odd_sdlc/release/genesis.yml")
_ODD_SDLC_BOOTLOADER_START = "<!-- ODD_SDLC_BOOTLOADER_START -->"
_ODD_SDLC_BOOTLOADER_END = "<!-- ODD_SDLC_BOOTLOADER_END -->"


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
        "runtime_backend: claude",
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


def _workspace_instruction_bootloader(
    target_root: Path,
    *,
    project_slug: str,
    platform: str,
) -> str:
    workspace_name = target_root.name
    imported_summary = "workspace://specification/requirements/00-imported-sources.md"
    normalization_report = "workspace://.ai-workspace/runtime/odd_sdlc-workspace-normalization.json"
    project_bootstrap = "workspace://.ai-workspace/context/project_bootstrap.md"
    runtime_contract = f"workspace://{RUNTIME_CONTRACT_RELATIVE.as_posix()}"
    authority_candidates = (
        "specification/INTENT.md",
        "specification/REQUIREMENTS.md",
        "specification/mapper_requirements.md",
    )
    authority_surfaces = tuple(
        f"- `workspace://{relative}`"
        for relative in authority_candidates
        if (target_root / relative).exists()
    )
    authority_surface_lines = authority_surfaces or ("- no imported authority surface was detected",)
    provenance_lines = tuple(
        f"- `workspace://README.md` (provenance/context only; do not use as primary identity evidence)"
        for _ in [0]
        if (target_root / "README.md").exists()
    )
    return "\n".join(
        (
            "# odd_sdlc Workspace Governance Surface",
            "",
            "This workspace contains a target project governed by `odd_sdlc`.",
            "It is not itself a GTL/ABG project in identity terms.",
            "GTL/ABG are the substrate. `odd_sdlc` is the governance/runtime package.",
            "The target project may be imported, partial, stale, or still underdefined.",
            "",
            "## 1. Workspace Identity",
            f"- workspace: `{workspace_name}`",
            f"- project slug: `{project_slug}`",
            f"- platform: `{platform}`",
            f"- active runtime contract: `{runtime_contract}`",
            f"- normalization report: `{normalization_report}`",
            f"- project bootstrap: `{project_bootstrap}`",
            f"- imported authority summary: `{imported_summary}`",
            "",
            "## 2. Agent Operating Rule",
            "- start from project truth, not substrate ontology",
            "- treat `odd_sdlc` as governance over the target project",
            "- do not describe the project itself as a GTL/ABG app",
            "- do not infer project purpose or business identity from repository name, sibling workspaces, template lineage, or methodology examples",
            "- if the project identity is incomplete, say so explicitly",
            "- use imported authority surfaces as the first description of the project",
            "",
            "## 3. Read First",
            f"- `{project_bootstrap}`",
            *authority_surface_lines,
            f"- `{imported_summary}`",
            *provenance_lines,
            f"- `{normalization_report}`",
            f"- `{runtime_contract}`",
            "- `workspace://.genesis/docs/LLM_GTL_APP_BUILDER_GUIDE.md`",
            "",
            "## 4. Start Here",
            "- inspect the current pipeline state with `PYTHONPATH=.genesis python -m genesis gaps --workspace .`",
            "- trigger full odd_sdlc traversal with `PYTHONPATH=.genesis python -m genesis start --auto --human-proxy --workspace .`",
            "- if imported project docs contain historical bootstrap or install commands from older scaffolds, treat them as provenance only; the installed runtime contract above is authoritative for this workspace",
            "",
            "## 5. Interpretation Rule",
            "- substrate truth explains how work is executed",
            "- governance truth explains how this project is operated",
            "- imported project sources explain what the project is",
            "- README/bootstrap history and template lineage are provenance unless imported authority makes them project-defining",
            "- repository and sibling-workspace context may explain provenance, but must not be used as project identity evidence",
            "",
            "If those layers disagree, imported project authority wins for project identity,",
            "and GTL/ABG plus odd_sdlc govern how work proceeds over that authority.",
        )
    )


def _install_domain_instruction_bootloader(
    target_root: Path,
    filename: str,
    *,
    project_slug: str,
    platform: str,
) -> str:
    section = (
        f"{_ODD_SDLC_BOOTLOADER_START}\n"
        f"{_workspace_instruction_bootloader(target_root, project_slug=project_slug, platform=platform)}\n"
        f"{_ODD_SDLC_BOOTLOADER_END}"
    )
    instruction_path = target_root / filename
    if instruction_path.exists():
        existing = instruction_path.read_text(encoding="utf-8")
        if _ODD_SDLC_BOOTLOADER_START in existing and _ODD_SDLC_BOOTLOADER_END in existing:
            start = existing.index(_ODD_SDLC_BOOTLOADER_START)
            end = existing.index(_ODD_SDLC_BOOTLOADER_END) + len(_ODD_SDLC_BOOTLOADER_END)
            updated = existing[:start] + section + existing[end:]
            instruction_path.write_text(updated, encoding="utf-8")
            return "updated"
        separator = "\n\n" if existing.strip() else "\n"
        instruction_path.write_text(section + separator + existing.lstrip(), encoding="utf-8")
        return "prepended"
    instruction_path.write_text(section + "\n", encoding="utf-8")
    return "created"


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
    agents_md = _install_domain_instruction_bootloader(
        root,
        "AGENTS.md",
        project_slug=slug,
        platform=platform,
    )
    claude_md = _install_domain_instruction_bootloader(
        root,
        "CLAUDE.md",
        project_slug=slug,
        platform=platform,
    )
    return {
        "status": "installed",
        "target_root": str(root),
        "project_slug": slug,
        "platform": platform,
        "abiogenesis": abiogenesis_result,
        "package_path": str(package_path.relative_to(root)),
        "runtime_contract": str(contract_path.relative_to(root)),
        "normalization": normalization,
        "agents_md": agents_md,
        "claude_md": claude_md,
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
