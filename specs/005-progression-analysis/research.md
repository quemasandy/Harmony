# Phase 0: Outline & Research

## Architectural Decisions

### DECISION 1: Result Policy
- **Decision**: Structural errors (unparseable chord, invalid tonal center, malformed progression) result in an explicit ERROR DTO (discriminated union: `{ success: false, error: { code, message } }`).
- **Optional Capabilities**: If a chord cannot support a specific analysis (e.g., missing chord-scale for tensions), the use case returns a SUCCESS DTO, but marks that specific capability as "not available" for that chord.
- **Rationale**: Harmonic function (F2) does not depend on chord-scales (F3). Collapsing the entire progression analysis due to one missing scale tightly couples independent capabilities. This policy ensures maximal data extraction.

### DECISION 2: JSON as a Stable Contract
- **Decision**: The output of the JSON presenter is treated as a stable public contract, not an incidental debug dump.
- **Implementation**: Fixed key ordering. Explicit representation of optional/absent fields (`{ "tensions": null }` or `{ "tensions": { "available": false, "reason": "No chord scale provided" } }` rather than omitting the key).
- **Testing**: Tests must pin the exact JSON string output to prevent regressions and ensure determinism.

### DECISION 3: Dependency Enforcement
- **Decision**: A custom architecture test will be written to parse imports and fail the build if `src/interface-adapters` imports from `src/domain` or if DTOs import domain entities.
- **Rationale**: TypeScript types disappear at runtime. Static analysis (via a test script or linter) is required to enforce the boundary contract.
