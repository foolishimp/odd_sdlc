# Implements: REQ-F-ASSETMODEL-002
# Implements: REQ-F-ASSETMODEL-005
"""Asset-type library for the first odd_sdlc slice."""
from __future__ import annotations

from .domain_model import AssetSemanticFacet, AssetTypeProfile


SEMANTIC_FACETS: dict[str, AssetSemanticFacet] = {
    "structured_document": AssetSemanticFacet(
        name="structured_document",
        description="A document-shaped asset with headings, sections, and stable textual structure.",
    ),
    "spec_surface": AssetSemanticFacet(
        name="spec_surface",
        description="A constitutional or bounded specification surface carrying live project truth.",
    ),
    "verification_surface": AssetSemanticFacet(
        name="verification_surface",
        description="A surface that defines, records, or proves verification and qualification work.",
    ),
    "authority_surface": AssetSemanticFacet(
        name="authority_surface",
        description="A surface that declares or stabilizes governing authority for downstream work.",
    ),
    "argument_surface": AssetSemanticFacet(
        name="argument_surface",
        description="A surface organized around claims, rationale, and supporting argument.",
    ),
}


ASSET_TYPES: dict[str, AssetTypeProfile] = {
    "intent_doc": AssetTypeProfile(
        name="intent_doc",
        description="Singleton intent surface for the project line.",
        semantic_facets=("structured_document", "spec_surface", "argument_surface"),
        fd_evaluator="bootstrap-input-set-present",
        fp_gap_description="The intent surface is not yet semantically converged.",
        fp_descriptive_framing="An intent document states why the project exists, its governing commitments, outcomes, and constraints.",
        proof_hints=("post_mortem_event_audit",),
        closure_hints=("single_authoritative_intent_surface",),
    ),
    "product_doc": AssetTypeProfile(
        name="product_doc",
        description="Singleton product definition surface.",
        semantic_facets=("structured_document", "spec_surface"),
        fd_evaluator="bootstrap-input-set-present",
        fp_gap_description="The product surface is not yet semantically converged.",
        fp_descriptive_framing="A product document defines what the product is, its terms, and the current end-state being built.",
        proof_hints=("post_mortem_event_audit",),
        closure_hints=("single_authoritative_product_surface",),
    ),
    "goal_surface": AssetTypeProfile(
        name="goal_surface",
        description="Current bounded wave of work.",
        semantic_facets=("structured_document", "spec_surface"),
        fd_evaluator="bootstrap-input-set-present",
        fp_gap_description="The goals surface is not yet semantically converged.",
        fp_descriptive_framing="A goals surface captures the current bounded wave of work without becoming permanent constitutional law.",
        proof_hints=("post_mortem_event_audit",),
        closure_hints=("single_authoritative_goal_surface",),
    ),
    "requirement_surface": AssetTypeProfile(
        name="requirement_surface",
        description="Folderized requirement family surface.",
        semantic_facets=("structured_document", "spec_surface", "authority_surface"),
        fd_evaluator="requirements-boundary-sources-present",
        fp_gap_description="The requirement surface is not yet semantically converged.",
        fp_descriptive_framing="A requirement surface is a folderized set of requirement family files that decompose the current product definition.",
        proof_hints=("post_mortem_event_audit",),
        closure_hints=("requirement_family_surface_present",),
    ),
    "proof_surface": AssetTypeProfile(
        name="proof_surface",
        description="Stable proof or qualification artifact.",
        semantic_facets=("structured_document", "verification_surface", "authority_surface"),
        fd_evaluator="requirements-boundary-sources-present",
        fp_gap_description="The proof surface does not yet justify qualification closure.",
        fp_descriptive_framing="A proof surface records stable verification or qualification truth for downstream consumers.",
        mutable_default=False,
        proof_hints=("immutable_snapshot",),
        closure_hints=("published_proof_surface",),
    ),
}

