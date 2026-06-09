# Tasks: Chord Substitutions — Tritone Substitution

**Input**: Design documents from `specs/004-chord-substitutions/`

**Prerequisites**: plan.md ✅, spec.md ✅, research.md ✅, data-model.md ✅, contracts/ ✅, quickstart.md ✅

**Tests**: TDD strictly required (per constitution Principle VIII and spec constraints). All tests written FIRST and must FAIL before implementation.

**Organization**: Tasks grouped by user story. US1 and US2 are both P1 but US2 depends on the same `tritoneSubstitution` function as US1 — they share the implementation and are tested together. US3 (P2) refines the explanation with enharmonic detail.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

---

## Phase 1: Setup

**Purpose**: Prerequisite changes to F2's `HarmonicAnalysis` interface and error infrastructure

- [x] T001 Add `readonly key: Key` field to `HarmonicAnalysis` interface in src/harmonic-analysis/entities/Progression.ts
- [x] T002 Include `key: this.key` in the frozen return object of `Progression.analyze()` in src/harmonic-analysis/entities/Progression.ts
- [x] T003 Add `InvalidSubstitutionError` class to src/harmonic-analysis/entities/errors.ts
- [x] T004 Verify existing F2 tests still pass after the `HarmonicAnalysis` key field addition by running `npm test`

**Checkpoint**: `HarmonicAnalysis` now carries the key. All existing tests green. Foundation ready for substitution logic.

---

## Phase 2: User Story 1 — Apply Tritone Substitution to a Resolving Dominant (Priority: P1) 🎯 MVP

**Goal**: Given a chord index and a `HarmonicAnalysis`, return a `Substitution` value object when the chord is a resolving V7→I/i, carrying the substitute Db7-style chord and a structured explanation with shared tritone and resolution target.

**Independent Test**: Build a ii-V-I in C Major, analyze via `Progression.analyze()`, call `tritoneSubstitution(analysis, 1)`, assert substitute is Db7, explanation carries B↔Cb and F↔F, resolution target is C.

### Tests for User Story 1 ⚠️

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [x] T005 [P] [US1] Write unit test: G7 (V7 in C Major) → Db7 substitute in tests/unit/entities/TritoneSubstitution.test.ts
- [x] T006 [P] [US1] Write unit test: Bb7 (V7 in Eb Major) → E7 substitute in tests/unit/entities/TritoneSubstitution.test.ts
- [x] T007 [P] [US1] Write unit test: D7 (V7 in G Major) → Ab7 substitute in tests/unit/entities/TritoneSubstitution.test.ts
- [x] T008 [P] [US1] Write unit test: substitution result carries correct `explanation.resolutionTarget` (tonic of the key) in tests/unit/entities/TritoneSubstitution.test.ts
- [x] T009 [P] [US1] Write unit test: `Substitution` value object is deeply immutable (attempt mutation throws) in tests/unit/entities/TritoneSubstitution.test.ts

### Implementation for User Story 1

- [x] T010 [US1] Define `SubstitutionResult` discriminated union type, `Substitution` value object class, `SubstitutionExplanation` value object class, and `SharedTritoneNotePair` value object class in src/harmonic-analysis/entities/TritoneSubstitution.ts
- [x] T011 [US1] Implement `tritoneSubstitution(analysis: HarmonicAnalysis, chordIndex: number): SubstitutionResult` function in src/harmonic-analysis/entities/TritoneSubstitution.ts — core logic: validate index, check diatonic + V7, check next chord is I/i, compute substitute root via `new Interval('d5').apply(root)`, build `Substitution` with explanation
- [x] T012 [US1] Ensure all value objects use `Object.freeze` and `readonly` fields for deep immutability in src/harmonic-analysis/entities/TritoneSubstitution.ts
- [x] T013 [US1] Run unit tests and confirm T005–T009 pass green

**Checkpoint**: Core tritone substitution works for resolving dominants. MVP functional.

---

## Phase 3: User Story 2 — Reject for Non-Resolving or Non-Dominant Chords (Priority: P1)

**Goal**: When the chord at the given index is not a resolving V7→I/i, return `{ applicable: false, reason: "..." }` with a precise reason string. Covers non-diatonic chords, non-V7 diatonic chords, and V7 without I/i following.

**Independent Test**: Call `tritoneSubstitution` on a Cmaj7 (I), a Dm7 (ii), a standalone G7 (V7 as last chord), and verify each returns `applicable: false` with the correct reason.

### Tests for User Story 2 ⚠️

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [x] T014 [P] [US2] Write unit test: Cmaj7 (Imaj7, not dominant) → not applicable, reason contains "not V7" in tests/unit/entities/TritoneSubstitution.test.ts
- [x] T015 [P] [US2] Write unit test: Dm7 (ii7, not dominant) → not applicable, reason contains "not V7" in tests/unit/entities/TritoneSubstitution.test.ts
- [x] T016 [P] [US2] Write unit test: non-diatonic chord (e.g., Abmaj7 in C Major) → not applicable, reason contains "not diatonic" in tests/unit/entities/TritoneSubstitution.test.ts
- [x] T017 [P] [US2] Write unit test: G7 as last chord in progression (no resolution target) → not applicable, reason contains "does not resolve" in tests/unit/entities/TritoneSubstitution.test.ts
- [x] T018 [P] [US2] Write unit test: invalid chord index (negative, out of range) → throws `InvalidSubstitutionError` in tests/unit/entities/TritoneSubstitution.test.ts

### Implementation for User Story 2

- [x] T019 [US2] Verify the not-applicable branches in `tritoneSubstitution` handle all three reason cases from data-model.md: not diatonic, not V7, V7 not followed by I/i — in src/harmonic-analysis/entities/TritoneSubstitution.ts
- [x] T020 [US2] Verify index-out-of-range guard throws `InvalidSubstitutionError` in src/harmonic-analysis/entities/TritoneSubstitution.ts
- [x] T021 [US2] Run unit tests and confirm T014–T018 pass green

**Checkpoint**: Both happy path and rejection path fully functional. All P1 stories complete.

---

## Phase 4: User Story 3 — Enharmonic Correctness of Shared Tritone (Priority: P2)

**Goal**: The `SharedTritoneNotePair` in the explanation correctly distinguishes literal identity (F↔F) from enharmonic equivalence (B↔Cb) using `PitchClass.equals()` and `Note.equals()`.

**Independent Test**: Inspect the explanation of G7→Db7 and verify the first pair (B↔Cb) has `isEnharmonicEquivalent: true, isLiterallyIdentical: false` and the second pair (F↔F) has `isEnharmonicEquivalent: false, isLiterallyIdentical: true`.

### Tests for User Story 3 ⚠️

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [x] T022 [P] [US3] Write unit test: G7→Db7 explanation has B↔Cb pair with `isEnharmonicEquivalent: true` and `isLiterallyIdentical: false` in tests/unit/entities/TritoneSubstitution.test.ts
- [x] T023 [P] [US3] Write unit test: G7→Db7 explanation has F↔F pair with `isEnharmonicEquivalent: false` and `isLiterallyIdentical: true` in tests/unit/entities/TritoneSubstitution.test.ts
- [x] T024 [P] [US3] Write unit test: C7→Gb7 explanation enharmonic pairs are correct (E↔? and Bb↔?) in tests/unit/entities/TritoneSubstitution.test.ts

### Implementation for User Story 3

- [x] T025 [US3] Verify `SharedTritoneNotePair` constructor computes `isEnharmonicEquivalent` and `isLiterallyIdentical` from `Note.equals()` and `PitchClass.equals()` in src/harmonic-analysis/entities/TritoneSubstitution.ts
- [x] T026 [US3] Verify `SharedTritoneNotePair` constructor validates invariant: `pitchClass` equality must hold, and exactly one of the two flags is true — in src/harmonic-analysis/entities/TritoneSubstitution.ts
- [x] T027 [US3] Run unit tests and confirm T022–T024 pass green

**Checkpoint**: All user stories complete. Enharmonic explanation is precise.

---

## Phase 5: Oracle Validation

**Purpose**: Validate domain logic against music21 ground truth

- [x] T028 [P] Write music21 oracle script `music21-tritone-sub-oracle.py` in tests/oracle/scripts/ — accepts chord+key pairs, outputs JSON with substitute chord root, shared tritone notes, and enharmonic flags
- [x] T029 [P] Write oracle test file tests/oracle/TritoneSubOracle.test.ts — runs oracle script, compares domain output against music21 for G7/C, Bb7/Eb, D7/G, C7/F, and at least 2 minor-key cases
- [x] T030 Run oracle tests and confirm all pass green

**Checkpoint**: Domain logic verified against music21 oracle.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Final quality gates and integration

- [x] T031 [P] Export `tritoneSubstitution`, `Substitution`, `SubstitutionResult`, `SubstitutionExplanation`, `SharedTritoneNotePair` from src/harmonic-analysis/entities/index.ts
- [x] T032 [P] Run dependency architecture check (`npm run validate` or check-dependency-rule) to verify no framework imports in domain layer
- [x] T033 [P] Validate quickstart.md code example compiles and runs correctly
- [x] T034 Run full test suite (`npm test`) — all F1, F2, F3, and F4 tests pass

**Checkpoint**: Feature complete. All quality gates pass.

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 (Setup)**: No dependencies — can start immediately
- **Phase 2 (US1)**: Depends on Phase 1 completion
- **Phase 3 (US2)**: Depends on Phase 2 (shares same function and file, US2 tests the rejection branches of the same `tritoneSubstitution` function)
- **Phase 4 (US3)**: Depends on Phase 2 (refines the explanation value objects created in US1)
- **Phase 5 (Oracle)**: Depends on Phases 2–4 (validates all domain logic)
- **Phase 6 (Polish)**: Depends on all previous phases

### User Story Dependencies

- **US1 (P1)**: Can start after Phase 1 — No dependencies on other stories
- **US2 (P1)**: Can start after US1 — tests rejection branches of the same function
- **US3 (P2)**: Can start after US1 — refines explanation detail, independent from US2

### Within Each User Story

- Tests MUST be written and FAIL before implementation (TDD)
- Value objects before function logic
- Function logic before immutability verification
- All tests green before checkpoint

### Parallel Opportunities

- T005–T009: All US1 tests can be written in parallel (different test cases, same file)
- T014–T018: All US2 tests can be written in parallel
- T022–T024: All US3 tests can be written in parallel
- T028–T029: Oracle script and oracle test can be written in parallel
- T031–T033: Polish tasks can run in parallel
- US2 and US3 can be developed in parallel after US1 completes (they touch different concerns)

---

## Parallel Example: User Story 1

```bash
# Launch all US1 tests together (they write to the same file but test different cases):
Task: "Write unit test: G7 → Db7 substitute in tests/unit/entities/TritoneSubstitution.test.ts"
Task: "Write unit test: Bb7 → E7 substitute in tests/unit/entities/TritoneSubstitution.test.ts"
Task: "Write unit test: D7 → Ab7 substitute in tests/unit/entities/TritoneSubstitution.test.ts"
Task: "Write unit test: explanation.resolutionTarget in tests/unit/entities/TritoneSubstitution.test.ts"
Task: "Write unit test: Substitution immutability in tests/unit/entities/TritoneSubstitution.test.ts"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (add key to HarmonicAnalysis, add error class)
2. Complete Phase 2: User Story 1 (tritone sub for resolving V7)
3. **STOP and VALIDATE**: Tests green, substitute chord correct, explanation populated
4. Feature delivers core value — can demo tritone substitution

### Incremental Delivery

1. Phase 1 → Setup ready
2. Phase 2: US1 → Happy path works → **MVP** ✅
3. Phase 3: US2 → Rejection paths explicit → **Robustness** ✅
4. Phase 4: US3 → Enharmonic explanation precise → **Correctness** ✅
5. Phase 5: Oracle → Ground truth verified → **Confidence** ✅
6. Phase 6: Polish → Exports, architecture check → **Ship-ready** ✅

---

## Notes

- [P] tasks = different files or independent test cases, no dependencies
- [Story] label maps task to specific user story for traceability
- TDD is mandatory: write test → red → implement → green → refactor
- Commit after each phase checkpoint
- US2 tests the same function as US1 but from the rejection perspective — they share `TritoneSubstitution.ts`
- The `HarmonicAnalysis` key field addition (T001–T002) is a backwards-compatible change; existing F2 tests must remain green (T004)
