# Implementation Plan: Web Adapter (F6)

**Branch**: `master` | **Date**: 2026-06-09 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `specs/006-web-adapter/spec.md`

## Summary

Implement the F6 Web Adapter using Express to expose the F5 Progression Analysis use case over HTTP. The adapter acts purely as a translation layer—mapping HTTP requests to the Input Port DTO and returning the exact JSON string produced by the F5 presenter, preserving the stable contract.

## Technical Context

**Language/Version**: TypeScript (strict mode)

**Primary Dependencies**: `express`, `supertest` (for testing)

**Testing**: `vitest`, `supertest`

**Project Type**: web-service (frameworks/web ring)

**Constraints**:
- Strictly adhere to Clean Architecture layering: `domain` <- `application` <- `interface-adapters` <- `frameworks/web`
- The web adapter must NOT depend on any domain entity or the concrete use-case class.
- Must preserve the exact output of the F5 Presenter (no `JSON.stringify` or `res.json` that reorders keys).
- Express logic must be isolated in a single composition/wiring file.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **Principle I (Dependency Rule)**: ✅ The plan enforces that the web ring only depends on the Input Port and DTOs.
- **Principle V (Ports & Adapters)**: ✅ The web framework is treated as a detail and decoupled via an Input Port.
- **Principle VI (DTOs across boundaries)**: ✅ The adapter maps HTTP requests to DTOs; no domain entities cross the boundary.
- **Principle VII (Screaming Architecture)**: ✅ The web adapter is placed in `src/harmonic-analysis/frameworks/web`, respecting the existing structure.
- **Principle VIII (TDD & Humble Object)**: ✅ Tests will use a test double for the port. No domain logic tested here.

## Project Structure

### Documentation (this feature)

```text
specs/006-web-adapter/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/api.md     # Phase 1 output
└── tasks.md             # Phase 2 output
```

### Source Code (repository root)

```text
src/harmonic-analysis/
├── application/
│   ├── ports/
│   │   └── AnalyzeProgressionInputPort.ts  # [NEW] The interface port
│   └── dtos/
│       └── ProgressionInputDTO.ts          # [EXISTING] Reused for input
├── interface-adapters/
│   └── JsonProgressionPresenter.ts         # [EXISTING] The stable JSON producer
└── frameworks/
    └── web/
        ├── ExpressAdapter.ts               # [NEW] Framework-agnostic route handler logic
        └── ExpressWiring.ts                # [NEW] The single composition/wiring file

tests/
├── frameworks/web/
│   └── ExpressAdapter.test.ts              # [NEW] Tests route handling, byte-for-byte matching, status codes
└── architecture/
    └── web-boundary.test.ts                # [NEW] Fails if inner layers import from frameworks/web
```

**Structure Decision**: The project structure maintains the Clean Architecture layering. We add the Input Port in `application/ports` and the Web Adapter in `frameworks/web`. The single wiring file keeps Express isolated.

## Complexity Tracking

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| N/A       |            |                                     |
