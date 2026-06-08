# Implementation Plan: Chord Scale Tensions Analysis

**Branch**: `003-chord-scale-tensions` | **Date**: 2026-06-08 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `specs/003-chord-scale-tensions/spec.md`

## Summary

This feature adds the ability to calculate available tensions and avoid notes for a given chord paired with a chord-scale. It leverages the existing musical domain entities (Note, Interval, Chord, Scale) to deterministically derive the 9, 11, 13 tensions and identify avoid notes (notes a minor second above a chord tone). It strictly enforces a 7-note scale limitation and throws errors for incompatible chord-scale pairings.

## Technical Context

**Language/Version**: TypeScript (strict mode: `strict: true`, `noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`)

**Primary Dependencies**: None (pure domain). `music21` is used as an oracle for testing but is NOT a production dependency.

**Storage**: N/A

**Testing**: `vitest` with `music21` oracle via custom testing hooks. TDD strictly required.

**Target Platform**: Agnostic (Node.js/Browser/Deno)

**Project Type**: Harmonic Analysis Domain Library (Entities Layer)

**Performance Goals**: Fast, deterministic, synchronous execution for real-time analysis capabilities.

**Constraints**: Strict adherence to Clean Architecture. The feature sits entirely in the inner "Entities" ring. All objects must be deeply immutable and self-validating.

**Scale/Scope**: Extension of the existing `Chord` and `Scale` entities; introduces a new domain calculation logic for tensions.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- [x] **Principle I & II (Dependency Rule & Pure Domain)**: Does the design import any external dependencies into the domain layer? **No.**
- [x] **Principle III (Immutability)**: Are the generated tension result objects deeply frozen/immutable? **Yes.**
- [x] **Principle IV (Aggregate Root)**: N/A (this is a calculation on values, does not mutate Aggregate Roots).
- [x] **Principle VIII (TDD & Oracle)**: Will tests be written first and validated against the `music21` oracle? **Yes.**

## Project Structure

### Documentation (this feature)

```text
specs/003-chord-scale-tensions/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
└── contracts/           # Phase 1 output
```

### Source Code (repository root)

```text
src/
└── entities/
    ├── Chord.ts         # Existing entity
    ├── Scale.ts         # Existing entity
    └── Tensions.ts      # New: Calculation logic and return types

tests/
├── unit/
│   └── entities/
│       └── Tensions.test.ts
└── oracle/
    └── TensionsOracle.test.ts
```

**Structure Decision**: The logic belongs in the `entities/` folder since it represents pure musical theory. A new file `Tensions.ts` (or similar) will house the value objects and calculation logic to keep `Chord.ts` and `Scale.ts` from becoming bloated, though they will be closely related.
