# Implements: REQ-F-GFUNC-001
# Implements: REQ-F-GFUNC-004
# Implements: REQ-F-ASSET-001
# Implements: REQ-F-ASSET-002
# Implements: REQ-F-ASSET-003
# Implements: REQ-F-ASSET-004
# Implements: REQ-F-ASSETMODEL-004
# Implements: REQ-F-ODDSDLC-002
"""Published GTL module for the first odd_sdlc slice."""
from __future__ import annotations

from gtl.function_model import GraphFunction, RefinementBoundary, TemplateRef
from gtl.graph import Attrs, Graph, GraphVector, Node
from gtl.module_model import Module
from gtl.operator_model import Evaluator, F_D, F_P, Operator
from gtl.work_model import ContractRef, Job, Role

from .function_catalog import FUNCTION_CATALOG


_input_set = Node("input_set", schema="odd.asset_collection.bootstrap_input_set")
_intent_surface = Node("intent_surface", schema="odd.asset.intent_doc")
_product_surface = Node("product_surface", schema="odd.asset.product_doc")
_goal_surface = Node("goal_surface", schema="odd.asset.goal_surface")
_requirement_surface = Node("requirement_surface", schema="odd.asset.requirement_surface")

_builder = Operator(
    name="odd_sdlc_builder",
    regime=F_P,
    binding="agent://odd_sdlc/builder",
)

_bootstrap_fd = Evaluator(
    name="bootstrap_input_set_present",
    regime=F_D,
    description="The bootstrap input set exists and carries the three singleton specification surfaces.",
    binding="exec://python -m odd_sdlc.fd_checks bootstrap-input-set-present --workspace .",
)
_requirements_fd = Evaluator(
    name="requirements_boundary_sources_present",
    regime=F_D,
    description="Intent, product, goals, and the requirement surface root all exist.",
    binding="exec://python -m odd_sdlc.fd_checks requirements-boundary-sources-present --workspace .",
)
_intent_fp = Evaluator(
    name="intent_surface_semantically_converged",
    regime=F_P,
    description="The intent surface is semantically converged for the current workspace input set.",
)
_product_fp = Evaluator(
    name="product_surface_semantically_converged",
    regime=F_P,
    description="The product surface is semantically converged for the current workspace input set.",
)
_goal_fp = Evaluator(
    name="goal_surface_semantically_converged",
    regime=F_P,
    description="The goals surface is semantically converged for the current workspace input set.",
)
_requirements_fp = Evaluator(
    name="requirement_surface_semantically_converged",
    regime=F_P,
    description="The requirement family surface is semantically converged for the current workspace input set.",
)


def _graph_function(
    *,
    name: str,
    source: Node | tuple[Node, ...],
    target: Node,
    fd_evaluator: Evaluator,
    fp_evaluator: Evaluator,
    req_refs: tuple[str, ...],
) -> GraphFunction:
    vector = GraphVector(
        name=name,
        source=source,
        target=target,
        operators=(_builder,),
        evaluators=(fd_evaluator, fp_evaluator),
        declarations=Attrs(
            entries=(
                ("dispatch", Attrs(entries=(("ref", "genesis.dispatch_runtime:dispatch_bound_manifest_via_transport"),))),
                ("proof", Attrs(entries=(("ref", "genesis.policy_defaults:proof_recheck_after_fp"),))),
                ("closure", Attrs(entries=(("ref", "genesis.policy_defaults:closure_require_resolution_or_fh"),))),
                ("implements", tuple(req_refs)),
            )
        ),
    )
    source_nodes = source if isinstance(source, tuple) else (source,)
    graph = Graph(
        name=f"{name}_graph",
        inputs=tuple(source_nodes),
        outputs=(target,),
        nodes=tuple((*source_nodes, target)),
        vectors=(vector,),
    )
    return GraphFunction(
        name=name,
        inputs=graph.inputs,
        outputs=graph.outputs,
        template=TemplateRef.inline_graph(graph, ref=f"inline:{name}"),
        declarations=Attrs(
            entries=(
                ("function_kind", "odd_asset_function"),
                ("intent", next(entry.intent for entry in FUNCTION_CATALOG if entry.name == name)),
            )
        ),
    )


GF_DERIVE_INTENT = _graph_function(
    name="derive_intent_surface",
    source=_input_set,
    target=_intent_surface,
    fd_evaluator=_bootstrap_fd,
    fp_evaluator=_intent_fp,
    req_refs=("REQ-F-ASSET-001", "REQ-F-ASSET-002", "REQ-F-ODDSDLC-002"),
)
GF_DERIVE_PRODUCT = _graph_function(
    name="derive_product_surface",
    source=_input_set,
    target=_product_surface,
    fd_evaluator=_bootstrap_fd,
    fp_evaluator=_product_fp,
    req_refs=("REQ-F-ASSET-001", "REQ-F-ASSET-002", "REQ-F-ODDSDLC-002"),
)
GF_DERIVE_GOALS = _graph_function(
    name="derive_goal_surface",
    source=_input_set,
    target=_goal_surface,
    fd_evaluator=_bootstrap_fd,
    fp_evaluator=_goal_fp,
    req_refs=("REQ-F-ASSET-001", "REQ-F-ASSET-004", "REQ-F-ODDSDLC-002"),
)
GF_DERIVE_REQUIREMENTS = _graph_function(
    name="derive_requirement_surface",
    source=(_input_set, _intent_surface, _product_surface, _goal_surface),
    target=_requirement_surface,
    fd_evaluator=_requirements_fd,
    fp_evaluator=_requirements_fp,
    req_refs=("REQ-F-ASSET-003", "REQ-F-ASSET-004", "REQ-F-ODDSDLC-002"),
)

_ROLE_CONSTRUCTOR = Role(name="constructor", tags=("f_p",))


def _job(name: str, graph_function: GraphFunction) -> Job:
    return Job(
        name=name,
        contracts=(ContractRef(kind="graph_function", target_id=graph_function.id),),
        roles=(_ROLE_CONSTRUCTOR,),
    )


MODULE = Module(
    name="odd_sdlc",
    graphs=tuple(
        function.template.graph
        for function in (
            GF_DERIVE_INTENT,
            GF_DERIVE_PRODUCT,
            GF_DERIVE_GOALS,
            GF_DERIVE_REQUIREMENTS,
        )
        if function.template.graph is not None
    ),
    graph_functions=(
        GF_DERIVE_INTENT,
        GF_DERIVE_PRODUCT,
        GF_DERIVE_GOALS,
        GF_DERIVE_REQUIREMENTS,
    ),
    refinement_boundaries=tuple(
        RefinementBoundary(
            name=function.name,
            inputs=function.inputs,
            outputs=function.outputs,
            hints=Attrs(entries=(("terminal", True),)),
        )
        for function in (
            GF_DERIVE_INTENT,
            GF_DERIVE_PRODUCT,
            GF_DERIVE_GOALS,
            GF_DERIVE_REQUIREMENTS,
        )
    ),
    jobs=(
        _job("derive_intent_surface_job", GF_DERIVE_INTENT),
        _job("derive_product_surface_job", GF_DERIVE_PRODUCT),
        _job("derive_goal_surface_job", GF_DERIVE_GOALS),
        _job("derive_requirement_surface_job", GF_DERIVE_REQUIREMENTS),
    ),
    roles=(_ROLE_CONSTRUCTOR,),
    operators=(_builder,),
    evaluators=(
        _bootstrap_fd,
        _requirements_fd,
        _intent_fp,
        _product_fp,
        _goal_fp,
        _requirements_fp,
    ),
    metadata=Attrs(
        entries=(
            ("requirements", (
                "REQ-F-GFUNC-001",
                "REQ-F-GFUNC-004",
                "REQ-F-RUNTIME-001",
                "REQ-F-RUNTIME-002",
                "REQ-F-RUNTIME-003",
                "REQ-F-RUNTIME-004",
                "REQ-F-ASSET-001",
                "REQ-F-ASSET-002",
                "REQ-F-ASSET-003",
                "REQ-F-ASSET-004",
                "REQ-F-ASSETMODEL-001",
                "REQ-F-ASSETMODEL-002",
                "REQ-F-ASSETMODEL-003",
                "REQ-F-ASSETMODEL-004",
                "REQ-F-ODDSDLC-001",
                "REQ-F-ODDSDLC-002",
                "REQ-F-ODDSDLC-003",
                "REQ-F-ODDSDLC-004",
            )),
            ("function_catalog", tuple(entry.to_dict() for entry in FUNCTION_CATALOG)),
            ("domain_package", "odd_sdlc"),
        )
    ),
)


def module() -> Module:
    return MODULE
