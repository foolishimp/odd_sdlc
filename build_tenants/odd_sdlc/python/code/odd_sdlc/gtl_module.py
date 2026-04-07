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

from gtl.algebra import compose, fan_in, fan_out, gate, promote, recurse
from gtl.function_model import EnvRef, GraphFunction, RefinementBoundary
from gtl.graph import Attrs, Graph, GraphVector, Node
from gtl.module_model import Module
from gtl.operator_model import Evaluator, Rule, F_D, F_P, Operator
from gtl.work_model import ContractRef, Job, Role

from .function_catalog import FUNCTION_CATALOG


def _asset_node(
    name: str,
    schema: str,
    *,
    kind: str,
    required_contexts: tuple[str, ...] = (),
    output_contract_refs: tuple[str, ...] = (),
) -> Node:
    return Node(
        name,
        schema=schema,
        asset_surface={
            "kind": kind,
            "required_contexts": required_contexts,
            "output_contract_refs": output_contract_refs,
        },
    )


_input_set = _asset_node(
    "input_set",
    schema="odd.asset_collection.bootstrap_input_set",
    kind="bootstrap_input_set",
    output_contract_refs=("bootstrap_input_set_present",),
)
_intent_surface = _asset_node(
    "intent_surface",
    schema="odd.asset.intent_doc",
    kind="intent_doc",
    required_contexts=("input_set",),
    output_contract_refs=("single_authoritative_intent_surface",),
)
_product_surface = _asset_node(
    "product_surface",
    schema="odd.asset.product_doc",
    kind="product_doc",
    required_contexts=("input_set", "intent_surface"),
    output_contract_refs=("single_authoritative_product_surface",),
)
_goal_surface = _asset_node(
    "goal_surface",
    schema="odd.asset.goal_surface",
    kind="goal_surface",
    required_contexts=("input_set", "intent_surface", "product_surface"),
    output_contract_refs=("single_authoritative_goal_surface",),
)
_requirement_surface = _asset_node(
    "requirement_surface",
    schema="odd.asset.requirement_surface",
    kind="requirement_surface",
    required_contexts=("input_set", "intent_surface", "product_surface", "goal_surface"),
    output_contract_refs=("requirement_family_surface_present",),
)
_feature_decomp_surface = _asset_node(
    "feature_decomp_surface",
    schema="odd.asset.feature_decomp_surface",
    kind="feature_decomp_surface",
    required_contexts=("requirement_surface",),
    output_contract_refs=("feature_decomposition_surface_present",),
)
_uat_testcases_surface = _asset_node(
    "uat_testcases_surface",
    schema="odd.asset.uat_testcases_surface",
    kind="uat_testcases_surface",
    required_contexts=("requirement_surface",),
    output_contract_refs=("uat_testcase_surface_present",),
)
_design_surface = _asset_node(
    "design_surface",
    schema="odd.asset.design_surface",
    kind="design_surface",
    required_contexts=("requirement_surface", "feature_decomp_surface"),
    output_contract_refs=("design_surface_present",),
)
_review_assessment_surface = _asset_node(
    "review_assessment_surface",
    schema="odd.asset.review_assessment_surface",
    kind="review_assessment_surface",
    required_contexts=("design_surface",),
    output_contract_refs=("review_assessment_surface_present",),
)
_consensus_decision_surface = _asset_node(
    "consensus_decision_surface",
    schema="odd.asset.consensus_decision_surface",
    kind="consensus_decision_surface",
    required_contexts=("review_assessment_surface",),
    output_contract_refs=("consensus_decision_surface_present",),
)
_reviewed_design_surface = _asset_node(
    "reviewed_design_surface",
    schema="odd.asset.reviewed_design_surface",
    kind="reviewed_design_surface",
    required_contexts=("design_surface", "consensus_decision_surface"),
    output_contract_refs=("reviewed_design_surface_present",),
)
_testcase_authority_surface = _asset_node(
    "testcase_authority_surface",
    schema="odd.asset.testcase_authority_surface",
    kind="testcase_authority_surface",
    required_contexts=("uat_testcases_surface", "scenario_surface"),
    output_contract_refs=("testcase_authority_surface_present",),
)
_scenario_surface = _asset_node(
    "scenario_surface",
    schema="odd.asset.scenario_surface",
    kind="scenario_surface",
    required_contexts=("requirement_surface", "design_surface"),
    output_contract_refs=("scenario_surface_present",),
)
_implementation_design_surface = _asset_node(
    "implementation_design_surface",
    schema="odd.asset.implementation_design_surface",
    kind="implementation_design_surface",
    required_contexts=("design_surface", "scenario_surface"),
    output_contract_refs=("implementation_design_surface_present",),
)
_implementation_stack_profile = _asset_node(
    "implementation_stack_profile",
    schema="odd.asset.implementation_stack_profile",
    kind="implementation_stack_profile",
    required_contexts=("implementation_design_surface",),
    output_contract_refs=("implementation_stack_profile_present",),
)
_implementation_module_surface = _asset_node(
    "implementation_module_surface",
    schema="odd.asset.implementation_module_surface",
    kind="implementation_module_surface",
    required_contexts=("implementation_design_surface", "implementation_stack_profile"),
    output_contract_refs=("implementation_module_surface_present",),
)
_code_surface = _asset_node(
    "code_surface",
    schema="odd.asset.code_surface",
    kind="code_surface",
    required_contexts=("implementation_module_surface", "implementation_stack_profile"),
    output_contract_refs=("published_source_code_surface",),
)
_test_design_surface = _asset_node(
    "test_design_surface",
    schema="odd.asset.test_design_surface",
    kind="test_design_surface",
    required_contexts=("design_surface", "scenario_surface"),
    output_contract_refs=("test_design_surface_present",),
)
_test_stack_profile = _asset_node(
    "test_stack_profile",
    schema="odd.asset.test_stack_profile",
    kind="test_stack_profile",
    required_contexts=("test_design_surface",),
    output_contract_refs=("test_stack_profile_present",),
)
_test_module_surface = _asset_node(
    "test_module_surface",
    schema="odd.asset.test_module_surface",
    kind="test_module_surface",
    required_contexts=("test_design_surface", "test_stack_profile"),
    output_contract_refs=("test_module_surface_present",),
)
_test_run_archive_surface = _asset_node(
    "test_run_archive_surface",
    schema="odd.asset.test_run_archive_surface",
    kind="test_run_archive_surface",
    required_contexts=("test_module_surface", "test_stack_profile"),
    output_contract_refs=("test_run_archive_surface_present",),
)
_release_surface = _asset_node(
    "release_surface",
    schema="odd.asset.release_surface",
    kind="release_surface",
    required_contexts=(
        "requirement_surface",
        "design_surface",
        "scenario_surface",
        "code_surface",
        "testcase_authority_surface",
        "test_run_archive_surface",
    ),
    output_contract_refs=("release_surface_present",),
)

_design_review_request_vector = Node(
    "design_review_request_vector",
    schema="Vector[odd.asset.review_request]",
)
_review_assessment_vector = Node(
    "review_assessment_vector",
    schema="Vector[odd.asset.review_assessment_surface]",
)

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
_product_fd = Evaluator(
    name="product_dependency_surfaces_present",
    regime=F_D,
    description="The product derivation sources exist and the intent surface has already been regenerated by the bounded constructor chain.",
    binding="exec://python -m odd_sdlc.fd_checks product-dependency-surfaces-present --workspace .",
)
_goal_fd = Evaluator(
    name="goal_dependency_surfaces_present",
    regime=F_D,
    description="The goal derivation sources exist and both intent and product surfaces have already been regenerated by the bounded constructor chain.",
    binding="exec://python -m odd_sdlc.fd_checks goal-dependency-surfaces-present --workspace .",
)
_requirements_fd = Evaluator(
    name="requirements_boundary_sources_present",
    regime=F_D,
    description="Intent, product, and goals have already been regenerated and the requirement surface root exists.",
    binding="exec://python -m odd_sdlc.fd_checks requirements-boundary-sources-present --workspace .",
)
_feature_decomp_fd = Evaluator(
    name="feature_decomp_dependency_surfaces_present",
    regime=F_D,
    description="The feature decomposition derivation depends on a regenerated requirement surface.",
    binding="exec://python -m odd_sdlc.fd_checks feature-decomp-dependency-surfaces-present --workspace .",
)
_uat_testcases_fd = Evaluator(
    name="uat_testcases_dependency_surfaces_present",
    regime=F_D,
    description="The UAT testcase derivation depends on a regenerated requirement surface.",
    binding="exec://python -m odd_sdlc.fd_checks uat-testcases-dependency-surfaces-present --workspace .",
)
_design_fd = Evaluator(
    name="design_dependency_surfaces_present",
    regime=F_D,
    description="The design derivation depends on regenerated requirement and feature decomposition surfaces.",
    binding="exec://python -m odd_sdlc.fd_checks design-dependency-surfaces-present --workspace .",
)
_review_assessment_fd = Evaluator(
    name="review_assessment_dependency_surfaces_present",
    regime=F_D,
    description="The review assessment derivation depends on a regenerated design surface.",
    binding="exec://python -m odd_sdlc.fd_checks review-assessment-dependency-surfaces-present --workspace .",
)
_consensus_decision_fd = Evaluator(
    name="consensus_decision_dependency_surfaces_present",
    regime=F_D,
    description="The consensus decision derivation depends on a regenerated review assessment surface.",
    binding="exec://python -m odd_sdlc.fd_checks consensus-decision-dependency-surfaces-present --workspace .",
)
_reviewed_design_fd = Evaluator(
    name="reviewed_design_dependency_surfaces_present",
    regime=F_D,
    description="The reviewed design derivation depends on regenerated design and consensus decision surfaces.",
    binding="exec://python -m odd_sdlc.fd_checks reviewed-design-dependency-surfaces-present --workspace .",
)
_testcase_authority_fd = Evaluator(
    name="testcase_authority_dependency_surfaces_present",
    regime=F_D,
    description="The testcase authority qualification depends on regenerated UAT testcase and scenario surfaces.",
    binding="exec://python -m odd_sdlc.fd_checks testcase-authority-dependency-surfaces-present --workspace .",
)
_scenario_fd = Evaluator(
    name="scenario_dependency_surfaces_present",
    regime=F_D,
    description="The scenario derivation depends on regenerated requirement and design surfaces.",
    binding="exec://python -m odd_sdlc.fd_checks scenario-dependency-surfaces-present --workspace .",
)
_implementation_design_fd = Evaluator(
    name="implementation_design_dependency_surfaces_present",
    regime=F_D,
    description="The implementation design derivation depends on regenerated design and scenario surfaces.",
    binding="exec://python -m odd_sdlc.fd_checks implementation-design-dependency-surfaces-present --workspace .",
)
_implementation_stack_profile_fd = Evaluator(
    name="implementation_stack_profile_dependency_surfaces_present",
    regime=F_D,
    description="The implementation stack profile derivation depends on a regenerated implementation design surface.",
    binding="exec://python -m odd_sdlc.fd_checks implementation-stack-profile-dependency-surfaces-present --workspace .",
)
_implementation_module_fd = Evaluator(
    name="implementation_module_dependency_surfaces_present",
    regime=F_D,
    description="The implementation module derivation depends on regenerated implementation design and implementation stack profile surfaces.",
    binding="exec://python -m odd_sdlc.fd_checks implementation-module-dependency-surfaces-present --workspace .",
)
_code_fd = Evaluator(
    name="code_dependency_surfaces_present",
    regime=F_D,
    description="The code derivation depends on regenerated implementation module and implementation stack profile surfaces.",
    binding="exec://python -m odd_sdlc.fd_checks code-dependency-surfaces-present --workspace .",
)
_release_fd = Evaluator(
    name="release_dependency_surfaces_present",
    regime=F_D,
    description="The release derivation depends on regenerated requirement, design, scenario, code, testcase authority, and archived test-evidence surfaces.",
    binding="exec://python -m odd_sdlc.fd_checks release-dependency-surfaces-present --workspace .",
)
_test_design_fd = Evaluator(
    name="test_design_dependency_surfaces_present",
    regime=F_D,
    description="The test design derivation depends on regenerated design and scenario surfaces.",
    binding="exec://python -m odd_sdlc.fd_checks test-design-dependency-surfaces-present --workspace .",
)
_test_stack_profile_fd = Evaluator(
    name="test_stack_profile_dependency_surfaces_present",
    regime=F_D,
    description="The test stack profile derivation depends on a regenerated test design surface.",
    binding="exec://python -m odd_sdlc.fd_checks test-stack-profile-dependency-surfaces-present --workspace .",
)
_test_module_fd = Evaluator(
    name="test_module_dependency_surfaces_present",
    regime=F_D,
    description="The test module derivation depends on regenerated test design and test stack profile surfaces.",
    binding="exec://python -m odd_sdlc.fd_checks test-module-dependency-surfaces-present --workspace .",
)
_test_run_archive_fd = Evaluator(
    name="test_run_archive_dependency_surfaces_present",
    regime=F_D,
    description="The archive-evidence derivation depends on regenerated test module and test stack profile surfaces.",
    binding="exec://python -m odd_sdlc.fd_checks test-run-archive-dependency-surfaces-present --workspace .",
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
_feature_decomp_fp = Evaluator(
    name="feature_decomp_surface_semantically_converged",
    regime=F_P,
    description="The feature decomposition surface is semantically converged for the current workspace requirements.",
)
_uat_testcases_fp = Evaluator(
    name="uat_testcases_surface_semantically_converged",
    regime=F_P,
    description="The UAT testcase surface is semantically converged for the current workspace requirements.",
)
_design_fp = Evaluator(
    name="design_surface_semantically_converged",
    regime=F_P,
    description="The design surface is semantically converged for the current workspace requirements and feature decomposition.",
)
_review_assessment_fp = Evaluator(
    name="review_assessment_surface_semantically_converged",
    regime=F_P,
    description="The review assessment surface is semantically converged for the current design under review.",
)
_consensus_decision_fp = Evaluator(
    name="consensus_decision_surface_semantically_converged",
    regime=F_P,
    description="The consensus decision surface is semantically converged for the current review assessment round.",
)
_reviewed_design_fp = Evaluator(
    name="reviewed_design_surface_semantically_converged",
    regime=F_P,
    description="The reviewed design surface is semantically converged for the current design and consensus decision state.",
)
_testcase_authority_fp = Evaluator(
    name="testcase_authority_surface_semantically_converged",
    regime=F_P,
    description="The testcase authority surface is semantically converged for the current generated UAT testcase and scenario surfaces.",
)
_design_consensus_gate_fp = Evaluator(
    name="design_consensus_gate_satisfied",
    regime=F_P,
    description="The current review assessment vector satisfies the declared consensus rule for design review.",
)
_design_consensus_termination = Evaluator(
    name="design_consensus_terminated",
    regime=F_P,
    description="The current design consensus carrier has either converged or lawfully exhausted its declared review rounds.",
)
_scenario_fp = Evaluator(
    name="scenario_surface_semantically_converged",
    regime=F_P,
    description="The scenario surface is semantically converged for the current workspace requirements and design.",
)
_implementation_design_fp = Evaluator(
    name="implementation_design_surface_semantically_converged",
    regime=F_P,
    description="The implementation design surface is semantically converged for the current design and scenario set.",
)
_implementation_stack_profile_fp = Evaluator(
    name="implementation_stack_profile_semantically_converged",
    regime=F_P,
    description="The implementation stack profile is semantically converged for the current generated implementation design.",
)
_implementation_module_fp = Evaluator(
    name="implementation_module_surface_semantically_converged",
    regime=F_P,
    description="The implementation module surface is semantically converged for the current generated implementation design and stack profile.",
)
_code_fp = Evaluator(
    name="code_surface_semantically_converged",
    regime=F_P,
    description="The code surface is semantically converged for the current generated implementation module and stack profile.",
)
_release_fp = Evaluator(
    name="release_surface_semantically_converged",
    regime=F_P,
    description="The release surface is semantically converged for the current requirement, design, scenario, code, testcase authority, and archived test-evidence state.",
)
_test_design_fp = Evaluator(
    name="test_design_surface_semantically_converged",
    regime=F_P,
    description="The test design surface is semantically converged for the current design and scenario set.",
)
_test_stack_profile_fp = Evaluator(
    name="test_stack_profile_semantically_converged",
    regime=F_P,
    description="The test stack profile is semantically converged for the current generated test design.",
)
_test_module_fp = Evaluator(
    name="test_module_surface_semantically_converged",
    regime=F_P,
    description="The test module surface is semantically converged for the current generated test design and stack profile.",
)
_test_run_archive_fp = Evaluator(
    name="test_run_archive_surface_semantically_converged",
    regime=F_P,
    description="The test run archive surface is semantically converged for the current generated test module and stack profile.",
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
    return GraphFunction.from_graph(
        name=name,
        graph=graph,
        environment=EnvRef.from_contract(
            requires=graph.inputs,
            provides=graph.outputs,
        ),
        declarations=Attrs(
            entries=(
                ("function_kind", "odd_asset_function"),
            )
        ),
    )


def _symbolic_graph_function(
    *,
    name: str,
    ref: str,
    inputs: tuple[Node, ...],
    outputs: tuple[Node, ...],
    declarations: Attrs,
    tags: tuple[str, ...] = (),
) -> GraphFunction:
    return GraphFunction.symbolic(
        name=name,
        ref=ref,
        inputs=inputs,
        outputs=outputs,
        environment=EnvRef.from_contract(
            requires=inputs,
            provides=outputs,
        ),
        declarations=declarations,
        tags=tags,
    )


def _annotate_graph_function(
    graph_function: GraphFunction,
    *,
    name: str | None = None,
    function_kind: str,
    intent: str,
    extra_declarations: dict[str, object] | None = None,
    tags: tuple[str, ...] = (),
) -> GraphFunction:
    merged_declarations = {
        **graph_function.declarations.to_dict(),
        "function_kind": function_kind,
        "intent": intent,
        **dict(extra_declarations or {}),
    }
    return GraphFunction(
        name=name or graph_function.name,
        inputs=graph_function.inputs,
        outputs=graph_function.outputs,
        environment=graph_function.environment,
        template=graph_function.template,
        effects=graph_function.effects,
        declarations=Attrs.coerce(merged_declarations),
        tags=tuple((*graph_function.tags, *tags)),
    )


def _rename_graph(graph: Graph, *, name: str) -> Graph:
    return Graph(
        name=name,
        inputs=graph.inputs,
        outputs=graph.outputs,
        nodes=graph.nodes,
        vectors=graph.vectors,
        contexts=graph.contexts,
        rules=graph.rules,
        tags=graph.tags,
    )


def _executive_graph_function(
    *,
    name: str,
    intent: str,
    functions: tuple[GraphFunction, ...],
) -> GraphFunction:
    composed = compose(*functions)
    executive_graph = _rename_graph(composed.materialize(), name=f"{name}_graph")
    return GraphFunction.from_graph(
        name=name,
        graph=executive_graph,
        environment=composed.environment,
        effects=composed.effects,
        declarations=Attrs(
            entries=(
                ("function_kind", "odd_executive_graph_function"),
                ("intent", intent),
                ("entrypoint", True),
            )
        ),
        tags=("executive",),
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
    source=(_input_set, _intent_surface),
    target=_product_surface,
    fd_evaluator=_product_fd,
    fp_evaluator=_product_fp,
    req_refs=("REQ-F-ASSET-001", "REQ-F-ASSET-002", "REQ-F-ODDSDLC-002"),
)
GF_DERIVE_GOALS = _graph_function(
    name="derive_goal_surface",
    source=(_input_set, _intent_surface, _product_surface),
    target=_goal_surface,
    fd_evaluator=_goal_fd,
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
GF_DERIVE_FEATURE_DECOMP = _graph_function(
    name="derive_feature_decomp_surface",
    source=_requirement_surface,
    target=_feature_decomp_surface,
    fd_evaluator=_feature_decomp_fd,
    fp_evaluator=_feature_decomp_fp,
    req_refs=("REQ-F-ASSET-004", "REQ-F-ODDSDLC-002"),
)
GF_DERIVE_UAT_TESTCASES = _graph_function(
    name="derive_uat_testcases_surface",
    source=_requirement_surface,
    target=_uat_testcases_surface,
    fd_evaluator=_uat_testcases_fd,
    fp_evaluator=_uat_testcases_fp,
    req_refs=("REQ-F-ASSET-004", "REQ-F-ODDSDLC-002"),
)
GF_DERIVE_DESIGN = _graph_function(
    name="derive_design_surface",
    source=(_requirement_surface, _feature_decomp_surface),
    target=_design_surface,
    fd_evaluator=_design_fd,
    fp_evaluator=_design_fp,
    req_refs=("REQ-F-ASSET-004", "REQ-F-ODDSDLC-002"),
)
GF_DERIVE_REVIEW_ASSESSMENT = _graph_function(
    name="derive_review_assessment_surface",
    source=_design_surface,
    target=_review_assessment_surface,
    fd_evaluator=_review_assessment_fd,
    fp_evaluator=_review_assessment_fp,
    req_refs=("REQ-F-GFUNC-004", "REQ-F-ODDSDLC-002"),
)
GF_DERIVE_CONSENSUS_DECISION = _graph_function(
    name="derive_consensus_decision_surface",
    source=_review_assessment_surface,
    target=_consensus_decision_surface,
    fd_evaluator=_consensus_decision_fd,
    fp_evaluator=_consensus_decision_fp,
    req_refs=("REQ-F-GFUNC-004", "REQ-F-ODDSDLC-002"),
)
GF_DERIVE_REVIEWED_DESIGN = _graph_function(
    name="derive_reviewed_design_surface",
    source=(_design_surface, _consensus_decision_surface),
    target=_reviewed_design_surface,
    fd_evaluator=_reviewed_design_fd,
    fp_evaluator=_reviewed_design_fp,
    req_refs=("REQ-F-GFUNC-004", "REQ-F-ODDSDLC-002"),
)
GF_QUALIFY_TESTCASE_AUTHORITY = _graph_function(
    name="qualify_testcase_authority",
    source=(_uat_testcases_surface, _scenario_surface),
    target=_testcase_authority_surface,
    fd_evaluator=_testcase_authority_fd,
    fp_evaluator=_testcase_authority_fp,
    req_refs=("REQ-F-ASSET-004", "REQ-F-ODDSDLC-002"),
)
GF_DERIVE_SCENARIOS = _graph_function(
    name="derive_scenario_surface",
    source=(_requirement_surface, _design_surface),
    target=_scenario_surface,
    fd_evaluator=_scenario_fd,
    fp_evaluator=_scenario_fp,
    req_refs=("REQ-F-ASSET-004", "REQ-F-ODDSDLC-002"),
)
GF_DERIVE_IMPLEMENTATION_DESIGN = _graph_function(
    name="derive_implementation_design_surface",
    source=(_design_surface, _scenario_surface),
    target=_implementation_design_surface,
    fd_evaluator=_implementation_design_fd,
    fp_evaluator=_implementation_design_fp,
    req_refs=("REQ-F-ASSET-004", "REQ-F-ODDSDLC-002"),
)
GF_SELECT_IMPLEMENTATION_STACK_PROFILE = _graph_function(
    name="select_implementation_stack_profile",
    source=_implementation_design_surface,
    target=_implementation_stack_profile,
    fd_evaluator=_implementation_stack_profile_fd,
    fp_evaluator=_implementation_stack_profile_fp,
    req_refs=("REQ-F-ASSET-004", "REQ-F-ODDSDLC-002"),
)
GF_DERIVE_IMPLEMENTATION_MODULE = _graph_function(
    name="derive_implementation_module_surface",
    source=(_implementation_design_surface, _implementation_stack_profile),
    target=_implementation_module_surface,
    fd_evaluator=_implementation_module_fd,
    fp_evaluator=_implementation_module_fp,
    req_refs=("REQ-F-ASSET-004", "REQ-F-ODDSDLC-002"),
)
GF_DERIVE_CODE = _graph_function(
    name="derive_code_surface",
    source=(_implementation_module_surface, _implementation_stack_profile),
    target=_code_surface,
    fd_evaluator=_code_fd,
    fp_evaluator=_code_fp,
    req_refs=("REQ-F-ASSET-004", "REQ-F-ODDSDLC-002"),
)
GF_DERIVE_TEST_DESIGN = _graph_function(
    name="derive_test_design_surface",
    source=(_design_surface, _scenario_surface),
    target=_test_design_surface,
    fd_evaluator=_test_design_fd,
    fp_evaluator=_test_design_fp,
    req_refs=("REQ-F-ASSET-004", "REQ-F-ODDSDLC-002"),
)
GF_SELECT_TEST_STACK_PROFILE = _graph_function(
    name="select_test_stack_profile",
    source=_test_design_surface,
    target=_test_stack_profile,
    fd_evaluator=_test_stack_profile_fd,
    fp_evaluator=_test_stack_profile_fp,
    req_refs=("REQ-F-ASSET-004", "REQ-F-ODDSDLC-002"),
)
GF_DERIVE_TEST_MODULE = _graph_function(
    name="derive_test_module_surface",
    source=(_test_design_surface, _test_stack_profile),
    target=_test_module_surface,
    fd_evaluator=_test_module_fd,
    fp_evaluator=_test_module_fp,
    req_refs=("REQ-F-ASSET-004", "REQ-F-ODDSDLC-002"),
)
GF_DERIVE_TEST_RUN_ARCHIVE = _graph_function(
    name="derive_test_run_archive_surface",
    source=(_test_module_surface, _test_stack_profile),
    target=_test_run_archive_surface,
    fd_evaluator=_test_run_archive_fd,
    fp_evaluator=_test_run_archive_fp,
    req_refs=("REQ-F-ASSET-004", "REQ-F-ODDSDLC-002"),
)
GF_PREPARE_RELEASE = _graph_function(
    name="prepare_release_surface",
    source=(
        _requirement_surface,
        _design_surface,
        _scenario_surface,
        _code_surface,
        _testcase_authority_surface,
        _test_run_archive_surface,
    ),
    target=_release_surface,
    fd_evaluator=_release_fd,
    fp_evaluator=_release_fp,
    req_refs=("REQ-F-ASSET-004", "REQ-F-ODDSDLC-002"),
)

REVIEW_DESIGN_CONSENSUS_ROUND_INTENT = (
    "Run one explicit design-review consensus round: derive review assessments, "
    "reduce them into a consensus decision, and apply the reviewed design result."
)
DESIGN_CONSENSUS_HARNESS_CONTRACT = {
    "subject_asset": "design_surface",
    "assessment_asset": "review_assessment_surface",
    "decision_asset": "consensus_decision_surface",
    "reviewed_asset": "reviewed_design_surface",
    "assessment_vector_asset": "review_assessment_vector",
    "injected_functions": {
        "review_round": "review_design_assessment_round",
        "reduce": "reduce_design_consensus_decision",
        "apply": "apply_design_consensus_decision",
    },
    "policy_rule": "design_consensus_rule",
    "composable": True,
    "recursive": True,
}


GF_REVIEW_DESIGN_CONSENSUS_ROUND = _annotate_graph_function(
    _executive_graph_function(
        name="review_design_consensus_round",
        intent=REVIEW_DESIGN_CONSENSUS_ROUND_INTENT,
        functions=(
            GF_DERIVE_REVIEW_ASSESSMENT,
            GF_DERIVE_CONSENSUS_DECISION,
            GF_DERIVE_REVIEWED_DESIGN,
        ),
    ),
    function_kind="odd_consensus_round_graph_function",
    intent=REVIEW_DESIGN_CONSENSUS_ROUND_INTENT,
    extra_declarations={
        "harness_kind": "consensus_round",
        "harness_contract": DESIGN_CONSENSUS_HARNESS_CONTRACT,
    },
    tags=("consensus", "round"),
)

_design_review_worker_round = _symbolic_graph_function(
    name="review_design_assessment_round",
    ref="odd_sdlc.review_design_assessment_round",
    inputs=(_review_assessment_vector,),
    outputs=(_review_assessment_vector,),
    declarations=Attrs(),
    tags=("consensus", "review_round"),
)
_design_consensus_reducer = _symbolic_graph_function(
    name="reduce_design_consensus_decision",
    ref="odd_sdlc.reduce_design_consensus_decision",
    inputs=(_review_assessment_vector,),
    outputs=(_consensus_decision_surface,),
    declarations=Attrs(),
    tags=("consensus", "reduce"),
)
_design_consensus_applier = _symbolic_graph_function(
    name="apply_design_consensus_decision",
    ref="odd_sdlc.apply_design_consensus_decision",
    inputs=(_design_surface, _consensus_decision_surface),
    outputs=(_reviewed_design_surface,),
    declarations=Attrs(),
    tags=("consensus", "apply"),
)
_design_consensus_rule = Rule(
    name="design_consensus_rule",
    kind="consensus",
    config={
        "quorum": 2,
        "max_rounds": 3,
        "on_open": "repeat_round",
        "on_exhaust": "escalate_f_h",
        "assessment_shape": "review_assessment_surface",
    },
)

GF_REVIEW_DESIGN_BY_CONSENSUS = _annotate_graph_function(
    recurse(
        compose(
            promote(source=_design_surface, to=_review_assessment_vector),
            fan_out(_design_review_worker_round, over=_review_assessment_vector),
            gate(
                fan_in(_design_consensus_reducer, over=_review_assessment_vector),
                rule=_design_consensus_rule,
                evaluators=(_design_consensus_gate_fp,),
            ),
            _design_consensus_applier,
        ),
        _design_consensus_termination,
        foldback={
            "mode": "rebind",
            "binding": "reviewed_design_surface",
            "requires_parent_evaluation": True,
        },
    ),
    name="review_design_by_consensus",
    function_kind="odd_consensus_library_graph_function",
    intent=(
        "Run explicit design consensus over GTL higher-order operators: "
        "promote design into review requests, fan out review work, gate the "
        "reduced consensus decision, apply it back to the design, and recurse until termination."
    ),
    extra_declarations={
        "harness_kind": "consensus_harness",
        "harness_contract": DESIGN_CONSENSUS_HARNESS_CONTRACT,
    },
    tags=("consensus", "library"),
)

LEAF_GRAPH_FUNCTIONS: tuple[GraphFunction, ...] = (
    GF_DERIVE_INTENT,
    GF_DERIVE_PRODUCT,
    GF_DERIVE_GOALS,
    GF_DERIVE_REQUIREMENTS,
    GF_DERIVE_FEATURE_DECOMP,
    GF_DERIVE_UAT_TESTCASES,
    GF_DERIVE_DESIGN,
    GF_DERIVE_SCENARIOS,
    GF_DERIVE_IMPLEMENTATION_DESIGN,
    GF_SELECT_IMPLEMENTATION_STACK_PROFILE,
    GF_DERIVE_IMPLEMENTATION_MODULE,
    GF_DERIVE_CODE,
    GF_DERIVE_TEST_DESIGN,
    GF_SELECT_TEST_STACK_PROFILE,
    GF_DERIVE_TEST_MODULE,
    GF_DERIVE_TEST_RUN_ARCHIVE,
    GF_QUALIFY_TESTCASE_AUTHORITY,
    GF_PREPARE_RELEASE,
)

BOOTSTRAP_RELEASE_SELF_TEST_INTENT = (
    "Act as the current top-level GTL executive over the odd_sdlc bootstrap, "
    "recursive implementation branch, recursive test branch, authority qualification, and release preparation "
    "asset functions."
)


GF_BOOTSTRAP_RELEASE_SELF_TEST = _executive_graph_function(
    name="bootstrap_release_self_test",
    intent=BOOTSTRAP_RELEASE_SELF_TEST_INTENT,
    functions=LEAF_GRAPH_FUNCTIONS,
)

BOOTSTRAP_RELEASE_SELF_TEST_STEPS: tuple[str, ...] = tuple(
    vector.name
    for vector in GF_BOOTSTRAP_RELEASE_SELF_TEST.materialize().vectors
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
            GF_BOOTSTRAP_RELEASE_SELF_TEST,
            GF_REVIEW_DESIGN_CONSENSUS_ROUND,
            GF_REVIEW_DESIGN_BY_CONSENSUS,
        )
        if function.template.graph is not None
    ),
    graph_functions=(
        GF_BOOTSTRAP_RELEASE_SELF_TEST,
        GF_REVIEW_DESIGN_CONSENSUS_ROUND,
        GF_REVIEW_DESIGN_BY_CONSENSUS,
    ),
    refinement_boundaries=tuple(
        RefinementBoundary(
            name=vector.name,
            inputs=vector.source if isinstance(vector.source, tuple) else (vector.source,),
            outputs=(vector.target,),
            hints=Attrs(entries=(("terminal", True),)),
        )
        for vector in (
            *GF_BOOTSTRAP_RELEASE_SELF_TEST.materialize().vectors,
            *GF_REVIEW_DESIGN_CONSENSUS_ROUND.materialize().vectors,
        )
    ),
    jobs=(
        _job("bootstrap_release_self_test_job", GF_BOOTSTRAP_RELEASE_SELF_TEST),
    ),
    roles=(_ROLE_CONSTRUCTOR,),
    operators=(_builder,),
    evaluators=(
        _bootstrap_fd,
        _product_fd,
        _goal_fd,
        _requirements_fd,
        _feature_decomp_fd,
        _uat_testcases_fd,
        _design_fd,
        _review_assessment_fd,
        _consensus_decision_fd,
        _reviewed_design_fd,
        _testcase_authority_fd,
        _scenario_fd,
        _implementation_design_fd,
        _implementation_stack_profile_fd,
        _implementation_module_fd,
        _code_fd,
        _release_fd,
        _test_design_fd,
        _test_stack_profile_fd,
        _test_module_fd,
        _test_run_archive_fd,
        _intent_fp,
        _product_fp,
        _goal_fp,
        _requirements_fp,
        _feature_decomp_fp,
        _uat_testcases_fp,
        _design_fp,
        _review_assessment_fp,
        _consensus_decision_fp,
        _reviewed_design_fp,
        _testcase_authority_fp,
        _design_consensus_gate_fp,
        _design_consensus_termination,
        _scenario_fp,
        _implementation_design_fp,
        _implementation_stack_profile_fp,
        _implementation_module_fp,
        _code_fp,
        _release_fp,
        _test_design_fp,
        _test_stack_profile_fp,
        _test_module_fp,
        _test_run_archive_fp,
    ),
    rules=(
        _design_consensus_rule,
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
                "REQ-F-ODDSDLC-006",
            )),
            ("function_catalog", tuple(entry.to_dict() for entry in FUNCTION_CATALOG)),
            ("executive_graph_function", GF_BOOTSTRAP_RELEASE_SELF_TEST.name),
            ("library_graph_functions", (
                GF_REVIEW_DESIGN_CONSENSUS_ROUND.name,
                GF_REVIEW_DESIGN_BY_CONSENSUS.name,
            )),
            ("domain_package", "odd_sdlc"),
        )
    ),
)


def module() -> Module:
    return MODULE
