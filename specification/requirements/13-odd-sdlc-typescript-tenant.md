# odd_sdlc TypeScript Tenant Requirements

**Status**: Active
**Category**: Realization
**Carries Forward From**: None
**Authoring Design**: `build_tenants/typescript/design/ODD_SDLC_TYPESCRIPT_TENANT_DERIVATION.md`, `build_tenants/typescript/design/ODD_SDLC_TYPESCRIPT_TENANT_FIRST_SLICE_IACS.md`, `build_tenants/typescript/design/ODD_SDLC_TYPESCRIPT_TENANT_STRUCTURAL_CARRIER_DIAGRAM.md`

This family defines the constitutional requirements for opening the
`odd_sdlc.TS` build line.

It does not close any TypeScript implementation behavior by itself. It states
the product and tenant authority needed before implementation tickets may claim
closure.

### REQ-F-ODDSDLC-040 - odd_sdlc.TS is an ODD-native tenant build line

`odd_sdlc.TS` shall realize the singleton `odd_sdlc` specification as a
TypeScript build tenant. It shall use graph functions as the operative program
surface, typed assets as domain state, ABG as traversal/runtime truth, and
projection/query surfaces as read models.

Acceptance criteria:

- AC-1: the TypeScript tenant is registered under `build_tenants/`
- AC-2: the tenant does not define a rival `WHAT` surface
- AC-3: operative SDLC behavior is expressed through GTL graph functions
- AC-4: public command or service bindings remain adapters over graph-function
  and ABG truth

### REQ-F-ODDSDLC-041 - Python is discovery evidence, not TypeScript architecture

The Python tenant shall remain valid operational evidence and source material
for functionality translation, but its file layout, controller shape, and
imperative service decomposition shall not be copied as the TypeScript
architecture by default.

Acceptance criteria:

- AC-1: TypeScript design maps Python behavior to ODD roles before
  implementation
- AC-2: Python modules may be referenced as source material in tickets and
  design
- AC-3: Python service methods do not become hidden TypeScript graph functions
- AC-4: behavioral parity claims cite scenario or proof evidence, not file
  similarity

### REQ-F-ODDSDLC-042 - TypeScript consumes ABIogenesis substrate truth

`odd_sdlc.TS` shall consume the ABIogenesis TypeScript GTL/ABG substrate through
declared public carriers and adapters. It shall not fork, vendor, or re-create
ABG runtime truth as product-local controller state.

Acceptance criteria:

- AC-1: ABIogenesis TypeScript dependency or source binding is explicit
- AC-2: ABG owns graph-call, frame, continuation, event, projection, and
  traversal truth
- AC-3: `odd_sdlc.TS` does not infer next internal graph vectors outside ABG
  projection
- AC-4: substrate assumptions are traced to ABIogenesis proof surfaces

### REQ-F-ODDSDLC-043 - TypeScript build work follows governed sequencing

The TypeScript build wave shall proceed from product/requirements authority to
design/module authority, package scaffold, substrate binding, domain carriers,
graph publication, public adapters, hooks, projections, and qualification.

Acceptance criteria:

- AC-1: the backlog records the TS build-wave tickets and dependencies
- AC-2: code implementation tickets depend on accepted product/design authority
- AC-3: each completed build ticket records proof and STDO review evidence
- AC-4: RC readiness is declared only after unit, scenario/sandbox, and live or
  justified non-live evidence appropriate to the release claim
