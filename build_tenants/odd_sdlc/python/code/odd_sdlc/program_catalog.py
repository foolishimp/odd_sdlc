# Implements: REQ-F-ODDSDLC-006
"""Executive program read-model catalog derived from the GTL carrier."""
from __future__ import annotations

from .domain_model import ExecutiveProgramEntry
from .gtl_module import BOOTSTRAP_RELEASE_SELF_TEST_INTENT, BOOTSTRAP_RELEASE_SELF_TEST_STEPS


BOOTSTRAP_RELEASE_SELF_TEST = ExecutiveProgramEntry(
    name="bootstrap_release_self_test",
    intent=BOOTSTRAP_RELEASE_SELF_TEST_INTENT,
    steps=BOOTSTRAP_RELEASE_SELF_TEST_STEPS,
    outputs=("release_surface",),
)


PROGRAM_CATALOG: tuple[ExecutiveProgramEntry, ...] = (BOOTSTRAP_RELEASE_SELF_TEST,)


def program_by_name(name: str) -> ExecutiveProgramEntry:
    for entry in PROGRAM_CATALOG:
        if entry.name == name:
            return entry
    raise ValueError(f"Unknown executive program {name!r}")
