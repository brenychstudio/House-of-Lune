# SPP reference notes for BR-03

Inspected through BDB on 2026-09-05.

```text
REFERENCE_WORKSPACE=ws_spatial_product_platform
REFERENCE_HEAD=6d9ff208f2674182996db0845ead9cb06439728b
REFERENCE_WORKTREE=CLEAN
REFERENCE_READ=YES
DEPENDENCY_CREATED=NO
CODE_COPIED=NO
RENDERER_ADDED_TO_BRENYCH=NO
```

Read: README.md, docs/canon/SPP-TECHNICAL-ARCHITECTURE-CANON.md, docs/canon/SPP-ASSET-CONTRACT-V1.md, docs/PERFORMANCE.md, package.json, src/app/RuntimeProvider.tsx and src/runtime/assets/WebPresentationOverrides.ts.

Verified observations:

- React owns semantic information and controls; RuntimeProvider creates and disposes an imperative SppRuntime in a stable canvas host.
- The canon assigns renderer/camera/loading/lifetime to the runtime and keeps React outside the frame loop.
- package.json pins Three.js 0.185.1.
- Presentation overrides are keyed by asset/material identity and include semantic purpose and a reason.
- Asset eligibility, provenance and payload validation are explicit. Performance reports distinguish local measurement from universal device/performance claims.
- Build success is separate from physical browser/visual acceptance.

BDB project memory and artifact roots were unconfigured, but bounded repository reads were available. No memory/bootstrap changes or task execution were requested through BDB.

BRENYCH adopts only the ownership boundary: Commerce Core = commercial truth; React/DOM = semantic information and controls; future Three/WebGPU = presentation. SPP source/assets and deployments remain independent.
