# Implements: REQ-F-ODDSDLC-036
"""Shared constitutional-surface normalization and application helpers."""
from __future__ import annotations

import hashlib
from pathlib import Path


APPLIED_CONSTITUTIONAL_PROPOSAL_MARKER = "<!-- odd_sdlc constitutional proposal applied: "


def proposal_application_block(
    *,
    edge: str,
    proposal_id: str,
    target_surface: str,
    actor: str,
) -> str:
    return "\n".join(
        (
            "",
            f"{APPLIED_CONSTITUTIONAL_PROPOSAL_MARKER}{proposal_id} -->",
            "## Applied Constitutional Proposal",
            f"- proposal_id: `{proposal_id}`",
            f"- originating_edge: `{edge}`",
            f"- target_surface: `{target_surface}`",
            f"- applied_by: `{actor}`",
            "",
        )
    )


def normalize_constitutional_surface(text: str) -> str:
    lines = text.splitlines()
    normalized: list[str] = []
    index = 0
    while index < len(lines):
        line = lines[index]
        if line.startswith(APPLIED_CONSTITUTIONAL_PROPOSAL_MARKER):
            index += 1
            while index < len(lines):
                current = lines[index]
                if current.startswith("## ") and current != "## Applied Constitutional Proposal":
                    break
                if current == "## Applied Constitutional Proposal":
                    index += 1
                    continue
                index += 1
            while normalized and normalized[-1] == "":
                normalized.pop()
            continue
        normalized.append(line)
        index += 1
    return "\n".join(normalized).rstrip() + "\n"


def constitutional_surface_digest(target_path: Path) -> str:
    normalized = normalize_constitutional_surface(
        target_path.read_text(encoding="utf-8")
    )
    return hashlib.sha256(normalized.encode("utf-8")).hexdigest()
