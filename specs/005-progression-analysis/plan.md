# Implementation Plan: Progression Analysis Application Layer

**Branch**: `005-progression-analysis` | **Date**: 2026-06-08 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/005-progression-analysis/spec.md`

## Summary

Implement the Progression Analysis use case and JSON presenter. This is the first feature outside the domain ring. It orchestrates F2, F3, and F4 capabilities without reimplementing music theory, mapping a plain Input DTO to a plain Output DTO. The JSON presenter then serializes this Output DTO as a stable contract. Error handling uses discriminated unions for structural errors, while optional capabilities (like tensions) are marked as unavailable per-chord when inapplicable.

## Technical Context

**Language/Version**: TypeScript (Strict Mode)

**Primary Dependencies**: None (Plain Node.js/TypeScript)

**Storage**: N/A

**Testing**: Jest (Unit and Architecture Tests), music21 (Oracle for baseline assertions)

**Target Platform**: Node.js/Browser agnostic (Application Layer)

**Project Type**: Core Engine Library

**Performance Goals**: Fast synchronous execution (<10ms per progression)

**Constraints**: Strict Layering (domain <- application <- interface-adapters). Immutable DTOs. Discriminated union errors.

**Scale/Scope**: Progression analysis for standard jazz/pop chord sequences.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **Principle I (Dependency Rule)**: PASS. The plan strictly enforces `domain` <- `application` <- `interface-adapters`.
- **Principle II (Pure Domain)**: PASS. Domain entities remain untouched and unaware of the new layers.
- **Principle III (Immutable VOs)**: PASS. Input and Output DTOs will be immutable (`readonly`).
- **Principle IV (Aggregate Root)**: PASS. The use case will instantiate a `Progression` aggregate root to perform the analysis.
- **Principle V (Ports & Adapters)**: PASS. The JSON presenter acts as an interface adapter.
- **Principle VI (DTOs across boundaries)**: PASS. Input DTO and Output DTO are plain objects. No domain entities leak.
- **Principle VII (Screaming Architecture)**: PASS. Folder structure will reflect the rings (`src/application`, `src/interface-adapters`).
- **Principle VIII (Humble Object + TDD)**: PASS. Strict TDD required. Presenter is a humble object. Oracle tests used where applicable.

## Project Structure

### Documentation (this feature)

```text
specs/005-progression-analysis/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output
└── tasks.md             # Phase 2 output
```

### Source Code (repository root)

```text
src/
├── domain/              # Existing entities (F1-F4)
├── application/
│   ├── use-cases/
│   │   └── ProgressionAnalyzer.ts
│   └── dtos/
│       ├── ProgressionInputDTO.ts
│       ├── ProgressionOutputDTO.ts
│       └── ProgressionResult.ts (Discriminated union)
└── interface-adapters/
    └── presenters/
        └── JsonProgressionPresenter.ts

tests/
├── architecture/
│   └── boundary.test.ts # Enforces dependency rule
├── application/
│   └── ProgressionAnalyzer.test.ts
└── interface-adapters/
    └── JsonProgressionPresenter.test.ts
```

**Structure Decision**: Clean Architecture strict ring layout. `src/domain` holds existing theory logic. `src/application` holds the DTOs and use case. `src/interface-adapters` holds the JSON presenter. Tests mirror this structure and add an `architecture` folder for boundary enforcement tests.
