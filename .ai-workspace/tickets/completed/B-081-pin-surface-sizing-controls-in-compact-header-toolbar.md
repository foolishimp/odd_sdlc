# B-081 Pin Surface Sizing Controls In Compact Header Toolbar

- id: B-081
- type: bug
- ticket_category: ordinary
- status: completed
- goal: stdo-ux-surface-usability
- change_intent: make the surface sizing options 30% smaller, pin them tightly in the top-right corner independent of scrolling, and place them on a thin toolbar that also carries the folder name exactly as it currently appears
- change_class: realization_refactor
- re_entry_point: code
- triaged_at: 2026-05-01
- created_at: 2026-05-01
- updated_at: 2026-05-01
- priority: medium
- build_tenant: typescript
- owner: unassigned
- review_status: implemented_in_odd_manager_surface
- intake_source: operator request: "the sizing options need to be 30% smaller and more tightly in the top right hand corner, they need to pinned there independent of the scrolling, you can have a thin tool bar that includes the folder name as it currently appears with the sizing options on the same bar"
- affected_boundary: STDO-UX surface header/tooling layer; folder-name display; sizing controls; scroll container; exact component path to bind during implementation intake

## STDO Triage

### First Missing Layer

Code.

The current surface controls are visually too large and are coupled to the
scrolling surface content. The folder name and sizing controls should be part
of one persistent surface header, not free-floating controls that move with the
document body.

## Target Shape

Introduce a thin pinned toolbar at the top of the surface viewport:

- left/available toolbar area: the folder name, rendered with the same displayed
  value it has today
- right toolbar area: the existing sizing options, scaled to 70% of their
  current visual footprint
- toolbar position: pinned to the top of the surface viewport and independent
  of content scrolling
- sizing controls: aligned tightly to the top-right corner without overlapping
  the folder name or surface content

## Acceptance Criteria

- AC-1: sizing options are approximately 30% smaller than the current control
  footprint while remaining usable.
- AC-2: sizing options stay pinned in the top-right corner while the surface
  content scrolls.
- AC-3: the folder name appears on the same thin toolbar and preserves its
  current text/value behavior.
- AC-4: toolbar layout does not cover, shift unpredictably, or overlap surface
  content at desktop and narrow viewport widths.
- AC-5: existing sizing behavior is preserved; this ticket changes placement
  and visual density, not sizing semantics.
- AC-6: implementation includes either a focused UI regression test or captured
  visual proof for the pinned-toolbar behavior.

## Non-Closure Conditions

- Making the controls smaller while leaving them inside the scrolling content.
- Pinning the controls without including the folder name on the same toolbar.
- Changing the folder-name value or sizing option semantics.
- Accepting overlap or clipped controls at narrow widths.

## Closure Note - 2026-05-01

Implemented under the STDO-UX owning surface in `odd_manager` as:

- `/Users/jim/src/apps/odd_manager/.ai-workspace/tickets/completed/B-077-pin-document-viewer-sizing-controls-in-compact-toolbar.md`
- `/Users/jim/src/apps/odd_manager/build_tenants/react_vite/src/components/DocumentViewer.tsx`
- `/Users/jim/src/apps/odd_manager/build_tenants/react_vite/src/features/sidecar/SidecarPanel.tsx`
- `/Users/jim/src/apps/odd_manager/build_tenants/react_vite/src/app/styles.css`
- `/Users/jim/src/apps/odd_manager/build_tenants/react_vite/tests/e2e/odd-manager-smoke.spec.ts`

The odd_sdlc ticket is closed as routed-to-owning-UX-surface. The owning
STDO-UX ticket is `B-077` in `odd_manager`.
