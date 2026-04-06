# Implements: REQ-F-ODDSDLC-006
"""Executive odd_program catalog for odd_sdlc."""
from __future__ import annotations

from .domain_model import ExecutiveProgramEntry


BOOTSTRAP_RELEASE_SELF_TEST = ExecutiveProgramEntry(
    name="bootstrap_release_self_test",
    intent=(
        "Act as the current top-level executive over the odd_sdlc bootstrap, "
        "recursive test branch, authority qualification, and release "
        "preparation graph functions."
    ),
    steps=(
        "derive_intent_surface",
        "derive_product_surface",
        "derive_goal_surface",
        "derive_requirement_surface",
        "derive_feature_decomp_surface",
        "derive_uat_testcases_surface",
        "derive_design_surface",
        "derive_scenario_surface",
        "derive_test_design_surface",
        "select_test_stack_profile",
        "derive_test_module_surface",
        "derive_test_run_archive_surface",
        "qualify_testcase_authority",
        "prepare_release_surface",
    ),
    outputs=("release_surface",),
)


PROGRAM_CATALOG: tuple[ExecutiveProgramEntry, ...] = (BOOTSTRAP_RELEASE_SELF_TEST,)


def program_by_name(name: str) -> ExecutiveProgramEntry:
    for entry in PROGRAM_CATALOG:
        if entry.name == name:
            return entry
    raise ValueError(f"Unknown odd_program {name!r}")
