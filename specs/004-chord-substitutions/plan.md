# Implementation Plan: Chord Substitutions — Tritone Substitution

**Branch**: `004-chord-substitutions` | **Date**: 2026-06-08 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `specs/004-chord-substitutions/spec.md`

## Summary

This feature adds the first chord substitution capability: tritone substitution. Given a chord index and an already-computed `HarmonicAnalysis` from F2, it determines whether the chord is a resolving dominant (V7→I or V7→i) and, if so, returns an immutable `Substitution` value object carrying the substitute dominant 7th (rooted a tritone away) along with a structured explanation (shared enharmonic tritone + common resolution target). Non-applicable cases produce an explicit `SubstitutionResult` with a reason — never null, never an exception, never a silent no-op.

## Technical Context

**Language/Version**: TypeScript (strict mode: `strict: true`, `noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`)

**Primary Dependencies**: None (pure domain). `music21` is used as an oracle for testing but is NOT a production dependency.

**Storage**: N/A

**Testing**: `vitest` with `music21` oracle via custom Python script. TDD strictly required.

**Target Platform**: Agnostic (Node.js/Browser/Deno)

**Project Type**: Harmonic Analysis Domain Library (Entities Layer)

**Performance Goals**: Fast, deterministic, synchronous execution.

**Constraints**: Strict adherence to Clean Architecture. Feature sits entirely in the inner "Entities" ring. All new objects must be deeply immutable and self-validating.

**Scale/Scope**: Composes on the existing `Chord`, `Note`, `PitchClass`, `Interval`, `Progression`, and `HarmonicAnalysis` entities from F1/F2. Introduces new value objects (`Substitution`, `SubstitutionExplanation`) and a pure function for the tritone substitution logic.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- [x] **Principle I & II (Dependency Rule & Pure Domain)**: Does the design import any external dependencies into the domain layer? **No.** All new code lives in `entities/`, imports only from sibling entities.
- [x] **Principle III (Immutability)**: Are the new value objects deeply frozen/immutable? **Yes.** `Substitution` and `SubstitutionExplanation` will use `Object.freeze` and `readonly` properties.
- [x] **Principle IV (Aggregate Root)**: Does this feature mutate `Progression` or its internal state? **No.** It reads from `HarmonicAnalysis` (an immutable return value of `Progression.analyze()`), never mutates the aggregate.
- [x] **Principle V & VI (Ports/Adapters & DTOs)**: Does this feature introduce any I/O or expose domain entities across boundaries? **No.** Pure domain calculation, no boundary crossing.
- [x] **Principle VII (Screaming Architecture)**: Does the new file sit under `harmonic-analysis/entities/`? **Yes.**
- [x] **Principle VIII (TDD & Oracle)**: Will tests be written first and validated against `music21`? **Yes.**

## Explicit Out-of-Scope

- **Secondary dominants (V7/V)** and **deceptive resolutions (V7→vi)** — these depend on tonicization that F2 does not yet model. They compose on a FUTURE expansion of harmonic function, not F4.
- **Any substitution type other than tritone** (ii-for-V, diatonic subs, chromatic mediant, etc.) — planned for later features.
- **Web/MIDI/CLI/delivery concerns** — F4 stays entirely in the domain ring.

## Project Structure

### Documentation (this feature)

```text
specs/004-chord-substitutions/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
└── contracts/           # Phase 1 output
    └── api.md
```

### Source Code (repository root)

```text
src/
└── harmonic-analysis/
    └── entities/
        ├── Chord.ts              # Existing (no changes)
        ├── Note.ts               # Existing (no changes)
        ├── PitchClass.ts         # Existing (no changes)
        ├── Interval.ts           # Existing (no changes)
        ├── Progression.ts        # Existing — HarmonicAnalysis interface needs key field
        └── TritoneSubstitution.ts  # NEW: substitution logic + value objects

tests/
├── unit/
│   └── entities/
│       └── TritoneSubstitution.test.ts   # NEW: unit tests (TDD)
└── oracle/
    ├── scripts/
    │   └── music21-tritone-sub-oracle.py  # NEW: oracle script
    └── TritoneSubOracle.test.ts           # NEW: oracle tests
```

**Structure Decision**: A new file `TritoneSubstitution.ts` houses the substitution value objects and the pure function, following the same pattern as `Tensions.ts` in F3. This keeps `Progression.ts` and `Chord.ts` focused on their existing responsibilities.

### Key Architectural Decision: `HarmonicAnalysis` needs a `key` field

The current `HarmonicAnalysis` interface does NOT carry the `Key` used for the analysis. The tritone substitution explanation requires the resolution target (the tonic). Two options:

1. **Add `readonly key: Key` to `HarmonicAnalysis`** — minimal, backwards-compatible change to F2's return type.
2. **Accept `Key` as a separate parameter to the substitution function** — avoids touching F2, but breaks the "single source of truth" principle (the key is already known by the analysis).

**Decision**: Option 1. Add `readonly key: Key` to the `HarmonicAnalysis` interface and have `Progression.analyze()` include it in the returned object. This is a purely additive, backwards-compatible change that makes the analysis result self-contained.

### Key Architectural Decision: Resolution detection via pattern analysis

F4 determines "does this chord resolve?" by reading the existing `HarmonicAnalysis`:
- Check if `chordAnalysis[index]` is `{ diatonic: true, romanNumeral }` with `romanNumeral.symbol === 'V7'`.
- Check if `chordAnalysis[index + 1]` is `{ diatonic: true, romanNumeral }` with `romanNumeral.symbol` being `'I'`, `'Imaj7'`, `'i'`, or `'i7'`.

This means F4 does read `index + 1` from the analysis array — but this is reading from the **already-computed** `HarmonicAnalysis` result, not re-deriving resolution from raw chords. A trailing V7 at position `length - 1` simply has no `index + 1` entry, so it's "does not resolve" by construction. No out-of-bounds checks needed — standard optional chaining on the array access.

> **Important**: This is NOT "inspecting the next chord." F4 reads the per-chord functional labels that F2 already produced. The resolution semantics are defined by the labels, not by chord-to-chord interval analysis.
