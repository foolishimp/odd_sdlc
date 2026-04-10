# Implements: REQ-F-ODDSDLC-003
# Implements: REQ-F-ODDSDLC-007
# Implements: REQ-F-ODDSDLC-022
# Implements: REQ-F-ODDSDLC-027
# Implements: REQ-F-ODDSDLC-029
"""Deterministic workspace normalization for odd_sdlc operation."""
from __future__ import annotations

import json
import re
from pathlib import Path
from typing import Any

from .ambiguity import AMBIGUITY_REGISTER_PATH, build_ambiguity_register
from .traceability import REQUIREMENT_CLOSURE_REGISTER_PATH, build_requirement_closure_register

NORMALIZATION_REPORT_PATH = Path(".ai-workspace/runtime/odd_sdlc-workspace-normalization.json")
IMPORTED_REQUIREMENTS_PATH = Path("specification/requirements/00-imported-sources.md")
PROJECT_BOOTSTRAP_PATH = Path(".ai-workspace/context/project_bootstrap.md")
PROJECT_POLICY_FIELDS: tuple[tuple[str, str], ...] = (
    ("ambiguity_risk_appetite", '"medium"'),
)
TENANT_CAPABILITY_FIELDS: tuple[tuple[str, str], ...] = (
    ("test_execution_contract", '""'),
    ("deployment_contract", '""'),
    ("runtime_observation_contract", '""'),
)


def default_project_slug(workspace_root: Path) -> str:
    name = workspace_root.resolve().name.strip()
    if not name:
        return "project"
    return name.split(".", 1)[0].replace("-", "_")


def _normalization_action(*, kind: str, path: Path, detail: str) -> dict[str, str]:
    return {
        "kind": kind,
        "path": path.as_posix(),
        "detail": detail,
    }


def _write_text(path: Path, content: str, *, kind: str, detail: str, actions: list[dict[str, str]]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(content, encoding="utf-8")
    actions.append(_normalization_action(kind=kind, path=path, detail=detail))


def _imported_requirement_sources(workspace_root: Path) -> list[Path]:
    spec_root = workspace_root / "specification"
    candidates = (
        spec_root / "REQUIREMENTS.md",
        spec_root / "mapper_requirements.md",
    )
    return [path for path in candidates if path.exists()]


def _imported_sources_markdown(workspace_root: Path) -> str:
    imported = _imported_requirement_sources(workspace_root)
    bullets = (
        [f"- `{path.relative_to(workspace_root).as_posix()}`" for path in imported]
        or ["- no imported requirement-like source was detected"]
    )
    return "\n".join(
        (
            "# Imported Requirement Sources",
            "",
            "This surface was created by `odd_sdlc` deterministic workspace normalization.",
            "",
            "## Imported Sources",
            *bullets,
            "",
            "## Purpose",
            "- establish the canonical `specification/requirements/` root required by odd_sdlc bootstrap",
            "- preserve imported requirement-like authority without rewriting the original sources",
            "",
        )
    )


def _markdown_headings(path: Path) -> list[str]:
    headings: list[str] = []
    for line in path.read_text(encoding="utf-8").splitlines():
        stripped = line.strip()
        if stripped.startswith("#"):
            headings.append(stripped)
    return headings


def _first_heading(path: Path) -> str | None:
    for heading in _markdown_headings(path):
        return heading.lstrip("#").strip()
    return None


def _project_title_from_intent(path: Path) -> str | None:
    pattern = re.compile(r"^\*\*Project\*\*:\s*(.+?)\s*$")
    for line in path.read_text(encoding="utf-8").splitlines():
        match = pattern.match(line.strip())
        if match:
            title = match.group(1).strip()
            if title:
                return title
    return None


def _project_identity(workspace_root: Path) -> tuple[str | None, str | None]:
    intent_path = workspace_root / "specification" / "INTENT.md"
    if intent_path.exists():
        title = _project_title_from_intent(intent_path)
        if title:
            return title, intent_path.relative_to(workspace_root).as_posix()
    for source in _imported_requirement_sources(workspace_root):
        title = _first_heading(source)
        if title:
            return title, source.relative_to(workspace_root).as_posix()
    return None, None


def _intent_ids_from_surface(workspace_root: Path) -> tuple[str, ...]:
    intent_path = workspace_root / "specification" / "INTENT.md"
    if not intent_path.exists():
        return ()
    return tuple(sorted(set(re.findall(r"\bINT-\d{3}\b", intent_path.read_text(encoding="utf-8")))))


def _goals_surface_with_intent_carry_forward(existing_text: str, *, intent_ids: tuple[str, ...]) -> str:
    if not intent_ids:
        return existing_text
    if all(intent_id in existing_text for intent_id in intent_ids):
        return existing_text

    lines = existing_text.rstrip().splitlines()
    if lines and lines[-1] != "":
        lines.append("")
    lines.extend(
        (
            "## Intent Authority Carry-Forward",
            *[f"- {intent_id}: carried forward from imported intent authority" for intent_id in intent_ids],
            "",
        )
    )
    return "\n".join(lines)


def _ontology_anchor_headings(path: Path) -> list[str]:
    keywords = (
        "ontology",
        "axiom",
        "executive summary",
        "intent",
        "object",
        "morphism",
        "terminology",
        "architecture",
        "domain",
        "philosophy",
    )
    anchors: list[str] = []
    for heading in _markdown_headings(path):
        normalized = heading.lower()
        if any(keyword in normalized for keyword in keywords):
            anchors.append(heading.lstrip("#").strip())
    return anchors


def _project_bootstrap_markdown(workspace_root: Path, *, project_slug: str, platform: str) -> str:
    imported = _imported_requirement_sources(workspace_root)
    intent_path = workspace_root / "specification" / "INTENT.md"
    readme = workspace_root / "README.md"
    identity_title, identity_source = _project_identity(workspace_root)
    candidate_titles = []
    if intent_path.exists():
        title = _project_title_from_intent(intent_path) or _first_heading(intent_path)
        if title:
            candidate_titles.append((intent_path.relative_to(workspace_root).as_posix(), title))
    for source in imported:
        title = _first_heading(source)
        if title:
            candidate_titles.append((source.relative_to(workspace_root).as_posix(), title))
    if readme.exists():
        title = _first_heading(readme)
        if title:
            candidate_titles.append(("README.md", f"{title} [provenance/context]"))

    title_lines = (
        [f"- `{source}`: {title}" for source, title in candidate_titles]
        or ["- no source title detected"]
    )

    ontology_lines: list[str] = []
    seen_anchors: set[tuple[str, str]] = set()
    candidate_sources = tuple(path for path in (readme, *imported) if path.exists())
    for source in candidate_sources:
        rel = source.relative_to(workspace_root).as_posix()
        for anchor in _ontology_anchor_headings(source):
            key = (rel, anchor)
            if key in seen_anchors:
                continue
            seen_anchors.add(key)
            ontology_lines.append(f"- `{rel}` → {anchor}")

    if not ontology_lines:
        ontology_lines.append("- no explicit ontology anchors detected in imported authority")

    return "\n".join(
        (
            "# Project Bootstrap",
            "",
            "This generated surface is a deterministic read model over imported project authority.",
            "It is not a replacement for project-owned specification truth.",
            "",
            "## Workspace Identity",
            f"- workspace: `{workspace_root.name}`",
            f"- project slug: `{project_slug}`",
            f"- platform: `{platform}`",
            "",
            "## Project Identity",
            (
                f"- authoritative project title: `{identity_title}`"
                if identity_title
                else "- authoritative project title: not confidently determined from imported authority"
            ),
            (
                f"- identity source: `{identity_source}`"
                if identity_source
                else "- identity source: no explicit imported identity surface detected"
            ),
            "- workspace/template/bootstrap provenance does not change project identity",
            "",
            "## Source Titles",
            *title_lines,
            "",
            "## Ontology Anchors",
            *ontology_lines,
            "",
            "## Read Order",
            "- `specification/INTENT.md` when present",
            "- `specification/requirements/00-imported-sources.md`",
            "- imported requirement-like sources listed there",
            "- `.ai-workspace/runtime/odd_sdlc-ambiguity-register.json` for current major ambiguity state",
            "- `.ai-workspace/runtime/odd_sdlc-requirement-closure.json` for live requirement carry-forward and code/test closure state",
            "- `README.md` only as provenance/context after the imported authority",
            "- `specification/PRODUCT.md` and `specification/GOALS.md` only after the imported authority",
            "",
            "## Installed Runtime Start Surface",
            "- inspect current gaps with `PYTHONPATH=.genesis python -m genesis gaps --workspace .`",
            "- trigger bounded odd_sdlc traversal with `PYTHONPATH=.genesis python -m genesis start --auto --workspace .`",
            "- add `--human-proxy` only when you expect an explicit F_H approval lane; it does not proxy F_P transport failures",
            "- deployment, runtime-return, and similar side-effect stages only traverse when the active build tenant declares the required technology capability contracts in `project_constraints.yml`",
            "- major ambiguity is always recorded; `project_constraints.yml` declares `ambiguity_risk_appetite`, which governs whether unresolved major ambiguity is carried by `F_P` or escalated to `F_H` unless it is a hard-stop prerequisite",
            "- when release/deployment/runtime remain at `pending_evidence` with no returned execution data, treat the converged boundary as `construction_complete_pending_execution`",
            "- treat legacy bootstrap instructions or older scaffold references in imported project docs as provenance only, not active runtime guidance for this installed workspace",
            "",
            "## Interpretation Rule",
            "- use this surface to orient quickly",
            "- use imported project sources as authority",
            "- treat README/bootstrap history and template language as provenance unless an imported authority surface makes it project-defining",
            "- if ontology remains incomplete, say so explicitly rather than inferring it from repository context",
            "",
        )
    )
def _default_product_surface(workspace_root: Path) -> str:
    imported = _imported_requirement_sources(workspace_root)
    bullets = (
        [f"- imported source present: `{path.relative_to(workspace_root).as_posix()}`" for path in imported]
        or ["- imported source present: none detected"]
    )
    return "\n".join(
        (
            "# Product",
            "",
            "This product surface was normalized by odd_sdlc to make an imported workspace operable.",
            "",
            "## Current Product Position",
            "- this workspace was imported without the canonical odd_sdlc bootstrap surfaces fully present",
            "- odd_sdlc requires explicit product and goal surfaces for lawful operation",
            "- this normalized surface preserves the imported project while giving odd_sdlc a canonical product anchor",
            "",
            "## Imported Sources",
            *bullets,
            "",
        )
    )


def _default_goals_surface(workspace_root: Path) -> str:
    imported = _imported_requirement_sources(workspace_root)
    bullets = (
        [f"- imported source present: `{path.relative_to(workspace_root).as_posix()}`" for path in imported]
        or ["- imported source present: none detected"]
    )
    intent_ids = _intent_ids_from_surface(workspace_root)
    intent_bullets = (
        [f"- {intent_id}: carried forward from imported intent authority" for intent_id in intent_ids]
        or ["- no imported INT-* authority markers detected"]
    )
    return "\n".join(
        (
            "# Goals",
            "",
            "These goals were normalized by odd_sdlc to standardize an imported workspace for operation.",
            "",
            "## Current Wave",
            "- establish the canonical odd_sdlc bootstrap surfaces without discarding imported project authority",
            "- make the workspace installable, iterable, and auditable through the odd_sdlc executive",
            "- preserve imported requirement-like sources as carried context for later refinement",
            "",
            "## Intent Authority Carry-Forward",
            *intent_bullets,
            "",
            "## Imported Sources",
            *bullets,
            "",
        )
    )


def _normalize_project_constraints(
    workspace_root: Path,
    *,
    project_slug: str,
    platform: str,
    actions: list[dict[str, str]],
) -> None:
    path = workspace_root / ".ai-workspace" / "context" / "project_constraints.yml"
    if not path.exists():
        content = "\n".join(
            (
                f"# Project Constraints — {workspace_root.name}",
                "# Generated by odd_sdlc deterministic workspace normalization",
                "",
                "project:",
                f'  name: "{workspace_root.name}"',
                '  kind: "software-project"',
                '  language: ""',
                '  test_runner: ""',
                '  ambiguity_risk_appetite: "medium"',
                "",
                "constraints: {}",
                "",
                "structure:",
                "  design_tenants:",
                f'    - name: "{platform}"',
                f'      output_dir: "build_tenants/{project_slug}/{platform}/"',
                '      description: "Normalized tenant target for odd_sdlc operation"',
                '      test_execution_contract: ""',
                '      deployment_contract: ""',
                '      runtime_observation_contract: ""',
                "  root_code_policy: reject",
                "",
            )
        )
        _write_text(
            path,
            content,
            kind="create_project_constraints",
            detail="created canonical project constraints surface for odd_sdlc operation",
            actions=actions,
        )
        return

    original = path.read_text(encoding="utf-8")
    lines = original.splitlines()
    updated: list[str] = []
    in_project = False
    in_structure = False
    in_design_tenants = False
    design_tenant_seen = False
    project_policy_seen: set[str] = set()
    first_design_tenant_scope = False
    tenant_field_indent = "      "
    tenant_fields_seen: set[str] = set()
    tenant_capabilities_flushed = False

    def _flush_missing_tenant_capabilities() -> None:
        nonlocal tenant_capabilities_flushed
        if tenant_capabilities_flushed or not design_tenant_seen:
            return
        for field_name, default_value in TENANT_CAPABILITY_FIELDS:
            if field_name in tenant_fields_seen:
                continue
            updated.append(f"{tenant_field_indent}{field_name}: {default_value}")
        tenant_capabilities_flushed = True

    for index, line in enumerate(lines):
        stripped = line.strip()
        next_line = lines[index + 1] if index + 1 < len(lines) else ""
        next_stripped = next_line.strip()
        next_indent = len(next_line) - len(next_line.lstrip()) if next_line else 0
        if line.startswith("# Project Constraints"):
            updated.append(f"# Project Constraints — {workspace_root.name}")
            continue
        if stripped == "project:":
            if first_design_tenant_scope:
                _flush_missing_tenant_capabilities()
                first_design_tenant_scope = False
            in_project = True
            in_structure = False
            in_design_tenants = False
            updated.append(line)
            continue
        if stripped == "structure:":
            if first_design_tenant_scope:
                _flush_missing_tenant_capabilities()
                first_design_tenant_scope = False
            if in_project:
                for field_name, default_value in PROJECT_POLICY_FIELDS:
                    if field_name in project_policy_seen:
                        continue
                    updated.append(f"  {field_name}: {default_value}")
            in_project = False
            in_structure = True
            in_design_tenants = False
            updated.append(line)
            continue
        if stripped == "design_tenants:" and in_structure:
            in_design_tenants = True
            updated.append(line)
            continue
        if in_project and stripped.startswith("name:"):
            indent = line[: len(line) - len(line.lstrip())]
            updated.append(f'{indent}name: "{workspace_root.name}"')
            continue
        if in_project and ":" in stripped:
            field_name = stripped.partition(":")[0].strip()
            project_policy_seen.add(field_name)
        if in_design_tenants and stripped.startswith("- name:"):
            if first_design_tenant_scope:
                _flush_missing_tenant_capabilities()
                first_design_tenant_scope = False
            if not design_tenant_seen:
                design_tenant_seen = True
                first_design_tenant_scope = True
                tenant_fields_seen = set()
                tenant_capabilities_flushed = False
            updated.append(line)
            continue
        if first_design_tenant_scope and ":" in stripped and not stripped.startswith("- name:"):
            field_name = stripped.partition(":")[0].strip()
            tenant_fields_seen.add(field_name)
            tenant_field_indent = line[: len(line) - len(line.lstrip())]
        if in_design_tenants and stripped.startswith("output_dir:") and design_tenant_seen:
            updated.append(line)
        else:
            updated.append(line)

        if first_design_tenant_scope and (
            not next_line
            or next_stripped.startswith("- name:")
            or (next_stripped and next_indent <= 4)
        ):
            _flush_missing_tenant_capabilities()
            first_design_tenant_scope = False

    normalized = "\n".join(updated) + ("\n" if original.endswith("\n") else "")
    if normalized != original:
        _write_text(
            path,
            normalized,
            kind="normalize_project_constraints",
            detail="updated workspace identity while preserving the declared realization root and tenant selection",
            actions=actions,
        )


def normalize_workspace(
    workspace_root: Path | str,
    *,
    project_slug: str | None = None,
    platform: str = "python",
) -> dict[str, Any]:
    root = Path(workspace_root).resolve()
    slug = (project_slug or default_project_slug(root)).strip() or "project"
    actions: list[dict[str, str]] = []

    (root / ".ai-workspace" / "runtime").mkdir(parents=True, exist_ok=True)
    (root / ".ai-workspace" / "context").mkdir(parents=True, exist_ok=True)

    product_path = root / "specification" / "PRODUCT.md"
    if not product_path.exists():
        _write_text(
            product_path,
            _default_product_surface(root),
            kind="create_product_surface",
            detail="created PRODUCT.md from imported workspace context",
            actions=actions,
        )

    goals_path = root / "specification" / "GOALS.md"
    if not goals_path.exists():
        _write_text(
            goals_path,
            _default_goals_surface(root),
            kind="create_goals_surface",
            detail="created GOALS.md from imported workspace context",
            actions=actions,
        )
    else:
        updated_goals = _goals_surface_with_intent_carry_forward(
            goals_path.read_text(encoding="utf-8"),
            intent_ids=_intent_ids_from_surface(root),
        )
        if updated_goals != goals_path.read_text(encoding="utf-8"):
            _write_text(
                goals_path,
                updated_goals,
                kind="update_goals_surface",
                detail="carried imported INT-* authority into existing GOALS.md",
                actions=actions,
            )

    requirements_root = root / "specification" / "requirements"
    if not requirements_root.exists():
        requirements_root.mkdir(parents=True, exist_ok=True)
        actions.append(
            _normalization_action(
                kind="create_requirements_root",
                path=requirements_root,
                detail="created canonical specification/requirements/ root",
            )
        )

    imported_summary = root / IMPORTED_REQUIREMENTS_PATH
    if not imported_summary.exists():
        _write_text(
            imported_summary,
            _imported_sources_markdown(root),
            kind="create_imported_requirements_summary",
            detail="captured imported requirement-like sources under the canonical requirements root",
            actions=actions,
        )

    project_bootstrap = root / PROJECT_BOOTSTRAP_PATH
    bootstrap_content = _project_bootstrap_markdown(root, project_slug=slug, platform=platform)
    if not project_bootstrap.exists():
        _write_text(
            project_bootstrap,
            bootstrap_content,
            kind="create_project_bootstrap",
            detail="created deterministic project bootstrap read model from imported authority",
            actions=actions,
        )
    else:
        original_bootstrap = project_bootstrap.read_text(encoding="utf-8")
        if original_bootstrap != bootstrap_content:
            _write_text(
                project_bootstrap,
                bootstrap_content,
                kind="update_project_bootstrap",
                detail="updated deterministic project bootstrap read model from imported authority",
                actions=actions,
            )

    _normalize_project_constraints(
        root,
        project_slug=slug,
        platform=platform,
        actions=actions,
    )

    ambiguity_path = root / AMBIGUITY_REGISTER_PATH
    ambiguity_payload = build_ambiguity_register(root, stage="normalize_workspace")
    ambiguity_content = json.dumps(ambiguity_payload, indent=2, sort_keys=True)
    if not ambiguity_path.exists():
        _write_text(
            ambiguity_path,
            ambiguity_content,
            kind="create_ambiguity_register",
            detail="created initial ambiguity register from deterministic normalization and topology inspection",
            actions=actions,
        )
    else:
        existing_ambiguity = ambiguity_path.read_text(encoding="utf-8")
        if existing_ambiguity != ambiguity_content:
            _write_text(
                ambiguity_path,
                ambiguity_content,
                kind="update_ambiguity_register",
                detail="updated ambiguity register from deterministic normalization and topology inspection",
                actions=actions,
            )

    requirement_closure_path = root / REQUIREMENT_CLOSURE_REGISTER_PATH
    requirement_closure_payload = build_requirement_closure_register(root, stage="normalize_workspace")
    requirement_closure_content = json.dumps(requirement_closure_payload, indent=2, sort_keys=True)
    if not requirement_closure_path.exists():
        _write_text(
            requirement_closure_path,
            requirement_closure_content,
            kind="create_requirement_closure_register",
            detail="created initial requirement closure register from deterministic normalization and traceability inspection",
            actions=actions,
        )
    else:
        existing_requirement_closure = requirement_closure_path.read_text(encoding="utf-8")
        if existing_requirement_closure != requirement_closure_content:
            _write_text(
                requirement_closure_path,
                requirement_closure_content,
                kind="update_requirement_closure_register",
                detail="updated requirement closure register from deterministic normalization and traceability inspection",
                actions=actions,
            )

    report = {
        "workspace_root": str(root),
        "workspace_name": root.name,
        "project_slug": slug,
        "platform": platform,
        "changed": bool(actions),
        "actions": actions,
        "report_path": NORMALIZATION_REPORT_PATH.as_posix(),
    }

    report_path = root / NORMALIZATION_REPORT_PATH
    report_path.parent.mkdir(parents=True, exist_ok=True)
    report_path.write_text(json.dumps(report, indent=2, sort_keys=True), encoding="utf-8")
    return report
