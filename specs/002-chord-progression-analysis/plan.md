# Implementation Plan: Chord Progression Harmonic Analysis

**Branch**: `002-chord-progression-analysis` | **Date**: 2026-06-08 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/002-chord-progression-analysis/spec.md`

## Summary

Implement the Harmonic Analysis Engine's Feature 2: parsing and analyzing a sequence of pre-instantiated `Chord` objects against an explicit `Key`. The `Progression` aggregate root will compute Roman numeral functions and detect overlapping major/minor ii-V-I patterns using a sliding window. It adheres to strict TDD, clean architecture, and the project Constitution.

## Technical Context

**Language/Version**: TypeScript strict
**Primary Dependencies**: music21 (dev dependency for tests only)
**Storage**: N/A
**Testing**: Vitest
**Target Platform**: Node.js / Browser (Library)
**Project Type**: Domain Library (Harmony Analysis)
**Performance Goals**: Instant memory processing
**Constraints**: Zero runtime dependencies in the domain.
**Scale/Scope**: In-memory analysis of short progressions.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- [x] Principle I (Dependency Rule): All new entities (`Key`, `Progression`, `RomanNumeral`) will reside in `src/harmonic-analysis/entities/` and import nothing from outer rings.
- [x] Principle II (Pure Musical Entities): No external knowledge (MIDI, web) in entities.
- [x] Principle III (Immutable Value Objects): `Key` and `RomanNumeral` will be `readonly`, validated in constructor, no setters.
- [x] Principle IV (Aggregate Root): `Progression` will encapsulate the `Chord` array. No direct external mutation.
- [x] Principle VII (Screaming Architecture): Fits in existing `src/harmonic-analysis/entities/`.
- [x] Principle VIII (Humble Object + TDD): TDD cycle mandated. `music21` used only in tests as an oracle.

## Project Structure

### Documentation (this feature)

```text
specs/002-chord-progression-analysis/
├── plan.md
├── research.md
├── data-model.md
└── tasks.md
```

### Source Code (repository root)

```text
src/
└── harmonic-analysis/
    ├── entities/
    │   ├── Key.ts
    │   ├── RomanNumeral.ts
    │   └── Progression.ts
    └── adapters/
        └── (existing ChordSymbolParser.ts)

tests/
├── unit/
│   └── entities/
│       ├── Key.test.ts
│       ├── RomanNumeral.test.ts
│       └── Progression.test.ts
└── oracle/
    └── progression-oracle.test.ts
```

**Structure Decision**: Extending the existing single project structure under `src/harmonic-analysis/entities/` and `tests/`.

## Complexity Tracking

*(No violations)*
