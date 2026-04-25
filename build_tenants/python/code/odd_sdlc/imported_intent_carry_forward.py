from __future__ import annotations

import re
from pathlib import Path
from typing import TypedDict


INTENT_SURFACE_PATH = Path("specification/INTENT.md")
_IMPORTED_REQUIREMENT_CANDIDATES = (
    Path("specification/REQUIREMENTS.md"),
    Path("specification/mapper_requirements.md"),
)


class ImportedIntentCarryForwardPayload(TypedDict):
    kind: str
    target_surface: str
    intent_surface_present: bool
    identity_title: str | None
    identity_source: str | None
    ontology_anchor_refs: list[str]
    imported_requirement_sources: list[str]
    authoritative: bool
    reason: str


def _markdown_headings(path: Path) -> list[str]:
    headings: list[str] = []
    for line in path.read_text(encoding="utf-8").splitlines():
        stripped = line.strip()
        if stripped.startswith("#"):
            headings.append(stripped)
    return headings


def _project_title_from_intent(path: Path) -> str | None:
    pattern = re.compile(r"^\*\*Project\*\*:\s*(.+?)\s*$")
    for line in path.read_text(encoding="utf-8").splitlines():
        match = pattern.match(line.strip())
        if match:
            title = match.group(1).strip()
            if title:
                return title
    return None


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


def _imported_requirement_sources(workspace_root: Path) -> list[Path]:
    return [
        path
        for path in (workspace_root / candidate for candidate in _IMPORTED_REQUIREMENT_CANDIDATES)
        if path.exists()
    ]


def build_imported_intent_carry_forward(
    workspace_root: Path | str,
) -> ImportedIntentCarryForwardPayload:
    root = Path(workspace_root).resolve()
    intent_path = root / INTENT_SURFACE_PATH
    imported_sources = _imported_requirement_sources(root)
    imported_source_refs = [path.relative_to(root).as_posix() for path in imported_sources]
    ontology_anchor_refs: list[str] = []
    if intent_path.exists():
        relative_intent_path = intent_path.relative_to(root).as_posix()
        for anchor in _ontology_anchor_headings(intent_path):
            ontology_anchor_refs.append(f"{relative_intent_path}#{anchor}")
    identity_title = _project_title_from_intent(intent_path) if intent_path.exists() else None
    identity_source = INTENT_SURFACE_PATH.as_posix() if identity_title is not None else None
    authoritative = identity_title is not None
    reason = (
        "imported_intent_identity_detected"
        if authoritative
        else (
            "intent_surface_present_without_project_identity"
            if intent_path.exists()
            else "intent_surface_missing"
        )
    )
    return {
        "kind": "odd_sdlc.imported_intent_carry_forward",
        "target_surface": INTENT_SURFACE_PATH.as_posix(),
        "intent_surface_present": intent_path.exists(),
        "identity_title": identity_title,
        "identity_source": identity_source,
        "ontology_anchor_refs": ontology_anchor_refs,
        "imported_requirement_sources": imported_source_refs,
        "authoritative": authoritative,
        "reason": reason,
    }
