# Tasks: Análisis de Acorde Individual

**Input**: Design documents from `specs/001-chord-analysis/`

**Prerequisites**: plan.md ✅, spec.md ✅, research.md ✅, data-model.md ✅, contracts/ ✅, quickstart.md ✅

**Tests**: Obligatorios por constitución (Principio VIII: TDD estricto). Tests ANTES de implementación en cada fase.

**Organization**: Tasks grouped by user story. Each story independently testable.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization, TypeScript strict config, test runner, folder structure.

- [ ] T001 Initialize npm project and install devDependencies (typescript, vitest) in package.json
- [ ] T002 Configure TypeScript strict mode (strict: true, noUncheckedIndexedAccess: true, exactOptionalPropertyTypes: true) in tsconfig.json
- [ ] T003 Configure Vitest in vitest.config.ts
- [ ] T004 Create directory structure per plan: src/harmonic-analysis/{entities,use-cases,adapters}/, tests/{unit/entities,unit/adapters,oracle,architecture}/
- [ ] T005 Create base error classes (HarmonyError, InvalidNoteError, InvalidIntervalError, InvalidChordSymbolError) in src/harmonic-analysis/entities/errors.ts
- [ ] T006 Create music21 oracle script in tests/oracle/music21-oracle.py — accepts chord symbol as argument, outputs JSON with root, notes, intervals, quality

---

## Phase 2: Foundational — Note & PitchClass (Blocking Prerequisites)

**Purpose**: `Note` and `PitchClass` are required by ALL user stories. Must complete before any chord construction.

**⚠️ CRITICAL**: No user story work can begin until this phase is complete.

### Tests for Note (TDD: write first, must FAIL) 🔴

- [ ] T007 [P] Test Note creation with valid inputs (all 21 root combinations: 7 letters × 3 accidentals) in tests/unit/entities/Note.test.ts
- [ ] T008 [P] Test Note rejects invalid inputs (invalid letter, invalid accidental) throwing InvalidNoteError in tests/unit/entities/Note.test.ts
- [ ] T009 [P] Test Note immutability (attempting to mutate readonly fields throws error, Object.freeze verified) in tests/unit/entities/Note.test.ts
- [ ] T010 [P] Test Note equality by value (same letter+accidental → equals true; different → equals false) in tests/unit/entities/Note.test.ts
- [ ] T011 [P] Test Note.toString() returns correct display string ("C", "F#", "Bb") in tests/unit/entities/Note.test.ts
- [ ] T012 [P] Test Note.semitonesFromC() returns correct semitone distance for all 21 notes in tests/unit/entities/Note.test.ts

### Implementation for Note 🟢

- [ ] T013 Implement Note Value Object (letter, accidental, readonly, Object.freeze, self-validating constructor, equals, toString, semitonesFromC) in src/harmonic-analysis/entities/Note.ts

### Tests for PitchClass (TDD: write first, must FAIL) 🔴

- [ ] T014 [P] Test PitchClass creation with valid values (0–11) in tests/unit/entities/PitchClass.test.ts
- [ ] T015 [P] Test PitchClass rejects invalid values (negative, >11, non-integer) in tests/unit/entities/PitchClass.test.ts
- [ ] T016 [P] Test PitchClass immutability and equality by value in tests/unit/entities/PitchClass.test.ts
- [ ] T017 [P] Test Note.pitchClass() derives correct PitchClass for all 21 notes (C=0, C#=1, Db=1, ..., B=11) in tests/unit/entities/PitchClass.test.ts

### Implementation for PitchClass 🟢

- [ ] T018 Implement PitchClass Value Object (value 0–11, readonly, Object.freeze, self-validating, equals) in src/harmonic-analysis/entities/PitchClass.ts
- [ ] T019 Add pitchClass() method to Note that derives PitchClass in src/harmonic-analysis/entities/Note.ts

**Checkpoint**: Note and PitchClass fully tested and implemented. Foundation ready for Interval and Chord.

---

## Phase 3: Foundational — Interval (Blocking Prerequisite)

**Purpose**: `Interval` is required to construct chords via interval application. Must complete before chord construction.

**⚠️ CRITICAL**: Chord construction depends on Interval.apply(root).

### Tests for Interval (TDD: write first, must FAIL) 🔴

- [ ] T020 [P] Test Interval creation with valid quality+number combinations (P1, m2, M2, m3, M3, P4, d5, P5, A5, m6, M6, m7, M7, d7) in tests/unit/entities/Interval.test.ts
- [ ] T021 [P] Test Interval rejects invalid quality+number combinations (e.g., "major 5th", "perfect 3rd") throwing InvalidIntervalError in tests/unit/entities/Interval.test.ts
- [ ] T022 [P] Test Interval immutability and equality by value in tests/unit/entities/Interval.test.ts
- [ ] T023 [P] Test Interval.semitones() returns correct semitone count for all valid intervals in tests/unit/entities/Interval.test.ts
- [ ] T024 [P] Test Interval.toString() returns human-readable string ("perfect unison", "minor 3rd", "diminished 5th") in tests/unit/entities/Interval.test.ts
- [ ] T025 Test Interval.apply(root) produces correct spelled note for major intervals from C (M3 from C → E, P5 from C → G, M7 from C → B) in tests/unit/entities/Interval.test.ts
- [ ] T026 Test Interval.apply(root) produces correct spelled note for minor/diminished intervals (m3 from D → F, d5 from B → F, d7 from B → Ab NOT G#) in tests/unit/entities/Interval.test.ts
- [ ] T027 Test Interval.apply(root) with sharped roots (M3 from F# → A#, m3 from F# → A, d5 from F# → C) in tests/unit/entities/Interval.test.ts
- [ ] T028 Test Interval.apply(root) with flatted roots (m3 from Eb → Gb, P5 from Eb → Bb, M7 from Ab → G) in tests/unit/entities/Interval.test.ts

### Implementation for Interval 🟢

- [ ] T029 Implement Interval Value Object (quality, number, readonly, Object.freeze, self-validating, equals, semitones, toString) in src/harmonic-analysis/entities/Interval.ts
- [ ] T030 Implement Interval.apply(root: Note): Note — letter arithmetic + accidental adjustment for correct enharmonic spelling in src/harmonic-analysis/entities/Interval.ts

**Checkpoint**: Interval fully tested including apply() with correct enharmonic spelling. Ready for Chord construction.

---

## Phase 4: Foundational — ChordQuality & Chord Entity (Blocking Prerequisite)

**Purpose**: `ChordQuality` interval templates and `Chord` entity. Must complete before parser can produce chords.

### Tests for ChordQuality (TDD: write first, must FAIL) 🔴

- [ ] T031 [P] Test ChordQuality has exactly 9 valid values (major, minor, diminished, augmented, major-seventh, dominant-seventh, minor-seventh, half-diminished-seventh, diminished-seventh) in tests/unit/entities/ChordQuality.test.ts
- [ ] T032 [P] Test interval template lookup returns correct intervals for each of the 9 qualities in tests/unit/entities/ChordQuality.test.ts

### Implementation for ChordQuality 🟢

- [ ] T033 Implement ChordQuality type and CHORD_INTERVAL_TEMPLATES constant mapping each quality to its interval array in src/harmonic-analysis/entities/ChordQuality.ts

### Tests for Chord (TDD: write first, must FAIL) 🔴

- [ ] T034 [P] Test Chord construction from root C + quality major → notes [C, E, G], intervals [P1, M3, P5] in tests/unit/entities/Chord.test.ts
- [ ] T035 [P] Test Chord construction from root D + quality minor → notes [D, F, A], intervals [P1, m3, P5] in tests/unit/entities/Chord.test.ts
- [ ] T036 [P] Test Chord construction from root B + quality diminished → notes [B, D, F], intervals [P1, m3, d5] in tests/unit/entities/Chord.test.ts
- [ ] T037 [P] Test Chord construction from root C + quality augmented → notes [C, E, G#], intervals [P1, M3, A5] in tests/unit/entities/Chord.test.ts
- [ ] T038 [P] Test Chord construction from root C + quality major-seventh → notes [C, E, G, B] in tests/unit/entities/Chord.test.ts
- [ ] T039 [P] Test Chord construction from root G + quality dominant-seventh → notes [G, B, D, F] in tests/unit/entities/Chord.test.ts
- [ ] T040 [P] Test Chord construction from root D + quality minor-seventh → notes [D, F, A, C] in tests/unit/entities/Chord.test.ts
- [ ] T041 [P] Test Chord construction from root F# + quality half-diminished-seventh → notes [F#, A, C, E] in tests/unit/entities/Chord.test.ts
- [ ] T042 [P] Test Chord construction from root B + quality diminished-seventh → notes [B, D, F, Ab] (NOT G#) in tests/unit/entities/Chord.test.ts
- [ ] T043 [P] Test Chord with flatted roots: Eb minor-seventh → [Eb, Gb, Bb, Db], Ab major-seventh → [Ab, C, Eb, G] in tests/unit/entities/Chord.test.ts
- [ ] T044 [P] Test Chord immutability (readonly root, notes array, intervals array; Object.freeze; mutation attempt throws) in tests/unit/entities/Chord.test.ts
- [ ] T045 [P] Test Chord equality by value in tests/unit/entities/Chord.test.ts

### Implementation for Chord 🟢

- [ ] T046 Implement Chord Value Object (root, notes, intervals, quality; constructed from root + quality using CHORD_INTERVAL_TEMPLATES; readonly, Object.freeze, equals) in src/harmonic-analysis/entities/Chord.ts
- [ ] T047 Create barrel export in src/harmonic-analysis/entities/index.ts exporting Note, PitchClass, Interval, Chord, ChordQuality, and error types

**Checkpoint**: All domain entities fully tested and implemented. Chord construction from root + quality produces correctly spelled notes. Ready for parser and user story phases.

---

## Phase 5: User Story 1 — Analizar un acorde válido (séptimas) (Priority: P1) 🎯 MVP

**Goal**: Given a valid seventh chord symbol (e.g., "Dm7", "G7", "Cmaj7", "F#m7b5", "Bdim7"), parse it and return a complete structural analysis with correct enharmonic spelling.

**Independent Test**: Invoke `parseChordSymbol("Dm7")` and verify root=D, notes=[D,F,A,C], intervals=[P1,m3,P5,m7], quality=minor-seventh. Compare against music21 oracle.

### Tests for ChordSymbolParser — séptimas (TDD: write first, must FAIL) 🔴

- [ ] T048 [P] [US1] Test parseChordSymbol("Cmaj7") → root C, quality major-seventh, notes [C,E,G,B] in tests/unit/adapters/ChordSymbolParser.test.ts
- [ ] T049 [P] [US1] Test parseChordSymbol("CM7") → root C, quality major-seventh, notes [C,E,G,B] (M7 synonym) in tests/unit/adapters/ChordSymbolParser.test.ts
- [ ] T050 [P] [US1] Test parseChordSymbol("Dm7") → root D, quality minor-seventh, notes [D,F,A,C] in tests/unit/adapters/ChordSymbolParser.test.ts
- [ ] T051 [P] [US1] Test parseChordSymbol("G7") → root G, quality dominant-seventh, notes [G,B,D,F] in tests/unit/adapters/ChordSymbolParser.test.ts
- [ ] T052 [P] [US1] Test parseChordSymbol("F#m7b5") → root F#, quality half-diminished-seventh, notes [F#,A,C,E] in tests/unit/adapters/ChordSymbolParser.test.ts
- [ ] T053 [P] [US1] Test parseChordSymbol("Bdim7") → root B, quality diminished-seventh, notes [B,D,F,Ab] in tests/unit/adapters/ChordSymbolParser.test.ts
- [ ] T054 [P] [US1] Test parseChordSymbol with sharped/flatted roots: "Ebm7" → [Eb,Gb,Bb,Db], "Abmaj7" → [Ab,C,Eb,G] in tests/unit/adapters/ChordSymbolParser.test.ts
- [ ] T055 [P] [US1] Test parseChordSymbol trims whitespace: " Dm7 " → same result as "Dm7" in tests/unit/adapters/ChordSymbolParser.test.ts

### Implementation for User Story 1 🟢

- [ ] T056 [US1] Implement parseChordSymbol function (trim → extract root letter+accidental → match suffix to quality → construct Chord) in src/harmonic-analysis/adapters/ChordSymbolParser.ts

**Checkpoint**: Seventh chord analysis working end-to-end. Parser → Chord construction → correct spelling verified.

---

## Phase 6: User Story 2 — Analizar tríadas (Priority: P1)

**Goal**: Given a valid triad symbol (e.g., "C", "Dm", "Bdim", "Caug", "C+"), parse it and return a complete structural analysis.

**Independent Test**: Invoke `parseChordSymbol("C")` and verify root=C, notes=[C,E,G], intervals=[P1,M3,P5], quality=major.

### Tests for ChordSymbolParser — tríadas (TDD: write first, must FAIL) 🔴

- [ ] T057 [P] [US2] Test parseChordSymbol("C") → root C, quality major, notes [C,E,G] in tests/unit/adapters/ChordSymbolParser.test.ts
- [ ] T058 [P] [US2] Test parseChordSymbol("Dm") → root D, quality minor, notes [D,F,A] in tests/unit/adapters/ChordSymbolParser.test.ts
- [ ] T059 [P] [US2] Test parseChordSymbol("Bdim") → root B, quality diminished, notes [B,D,F] in tests/unit/adapters/ChordSymbolParser.test.ts
- [ ] T060 [P] [US2] Test parseChordSymbol("Caug") → root C, quality augmented, notes [C,E,G#] in tests/unit/adapters/ChordSymbolParser.test.ts
- [ ] T061 [P] [US2] Test parseChordSymbol("C+") → root C, quality augmented, notes [C,E,G#] (synonym for aug) in tests/unit/adapters/ChordSymbolParser.test.ts
- [ ] T062 [P] [US2] Test parseChordSymbol with sharped/flatted triad roots: "F#", "Bb", "Ebm" in tests/unit/adapters/ChordSymbolParser.test.ts

### Implementation for User Story 2 🟢

- [ ] T063 [US2] Extend suffix table in parseChordSymbol to handle triad suffixes ("", "m", "dim", "aug", "+") if not already covered in T056 — in src/harmonic-analysis/adapters/ChordSymbolParser.ts

**Checkpoint**: All 9 chord qualities parseable. Triads and sevenths both working.

---

## Phase 7: User Story 3 — Rechazar un símbolo inválido (Priority: P1)

**Goal**: Given an invalid, malformed, or unsupported chord symbol, reject it with a clear error message. No partial or incorrect chord result should be produced.

**Independent Test**: Invoke `parseChordSymbol("XYZ")` and verify it throws `InvalidChordSymbolError` with descriptive message.

### Tests for ChordSymbolParser — error cases (TDD: write first, must FAIL) 🔴

- [ ] T064 [P] [US3] Test parseChordSymbol("XYZ") throws InvalidChordSymbolError (invalid root letter) in tests/unit/adapters/ChordSymbolParser.test.ts
- [ ] T065 [P] [US3] Test parseChordSymbol("") throws InvalidChordSymbolError (empty string) in tests/unit/adapters/ChordSymbolParser.test.ts
- [ ] T066 [P] [US3] Test parseChordSymbol("Hm7") throws InvalidChordSymbolError (H not valid in Anglo-Saxon notation) in tests/unit/adapters/ChordSymbolParser.test.ts
- [ ] T067 [P] [US3] Test parseChordSymbol("cmaj7") throws InvalidChordSymbolError (lowercase root, FR-012) in tests/unit/adapters/ChordSymbolParser.test.ts
- [ ] T068 [P] [US3] Test parseChordSymbol("dM7") throws InvalidChordSymbolError (lowercase root, FR-012) in tests/unit/adapters/ChordSymbolParser.test.ts
- [ ] T069 [P] [US3] Test parseChordSymbol("Cmin") throws InvalidChordSymbolError (non-canonical suffix, FR-011) in tests/unit/adapters/ChordSymbolParser.test.ts
- [ ] T070 [P] [US3] Test parseChordSymbol("C-") throws InvalidChordSymbolError (non-canonical suffix, FR-011) in tests/unit/adapters/ChordSymbolParser.test.ts
- [ ] T071 [P] [US3] Test parseChordSymbol("C9") throws InvalidChordSymbolError (unsupported extension, FR-008) in tests/unit/adapters/ChordSymbolParser.test.ts
- [ ] T072 [P] [US3] Test parseChordSymbol("Dm11") throws InvalidChordSymbolError (unsupported extension, FR-008) in tests/unit/adapters/ChordSymbolParser.test.ts
- [ ] T073 [P] [US3] Test parseChordSymbol("G13") throws InvalidChordSymbolError (unsupported extension, FR-008) in tests/unit/adapters/ChordSymbolParser.test.ts
- [ ] T074 [P] [US3] Test parseChordSymbol("Fbb") throws InvalidChordSymbolError (double flat root, out of scope) in tests/unit/adapters/ChordSymbolParser.test.ts
- [ ] T075 [P] [US3] Test parseChordSymbol("C°") throws InvalidChordSymbolError (non-canonical symbol, FR-011) in tests/unit/adapters/ChordSymbolParser.test.ts
- [ ] T076 [P] [US3] Test parseChordSymbol("Cø7") throws InvalidChordSymbolError (non-canonical symbol, FR-011) in tests/unit/adapters/ChordSymbolParser.test.ts
- [ ] T077 [P] [US3] Test error messages are descriptive and mention the invalid symbol in tests/unit/adapters/ChordSymbolParser.test.ts

### Implementation for User Story 3 🟢

- [ ] T078 [US3] Add validation and descriptive error messages for all rejection cases in src/harmonic-analysis/adapters/ChordSymbolParser.ts — verify no partial Chord is ever returned on invalid input

**Checkpoint**: All invalid inputs rejected with clear errors. No silent failures.

---

## Phase 8: Oracle Validation — music21 Comparison

**Purpose**: Verify domain correctness against the authoritative music21 oracle (Principio VIII).

### Oracle Tests 🔴🟢

- [ ] T079 [P] Test oracle script runs: invoke music21-oracle.py with "Cmaj7" and verify JSON output structure in tests/oracle/chord-oracle.test.ts
- [ ] T080 Test all 5 seventh chord acceptance scenarios from spec against music21 oracle (Cmaj7, Dm7, G7, F#m7b5, Bdim7) in tests/oracle/chord-oracle.test.ts
- [ ] T081 Test all 4 triad acceptance scenarios from spec against music21 oracle (C, Dm, Bdim, Caug) in tests/oracle/chord-oracle.test.ts
- [ ] T082 Test sharped/flatted root chords against music21 oracle (Ebm7, Abmaj7, F#, Bb) in tests/oracle/chord-oracle.test.ts
- [ ] T083 Test enharmonic spelling matches music21 exactly (Bdim7 → Ab not G#; Ebm7 → Gb not F#) in tests/oracle/chord-oracle.test.ts

**Checkpoint**: Domain produces identical results to music21 for all supported chord types.

---

## Phase 9: Architecture Verification

**Purpose**: Automated verification of constitutional compliance (Principio I: Regla de Dependencia).

### Architecture Tests

- [ ] T084 [P] Create dependency rule checker script that parses imports in src/harmonic-analysis/entities/ and verifies none point to adapters/, use-cases/, or outside harmonic-analysis/ in scripts/check-dependency-rule.ts
- [ ] T085 Test dependency rule: no file in entities/ imports from adapters/ or use-cases/ in tests/architecture/dependency-rule.test.ts
- [ ] T086 Test dependency rule: adapters/ only imports from entities/ (inward dependency) in tests/architecture/dependency-rule.test.ts
- [ ] T087 [P] Test immutability across all entities: attempt Object.assign, property reassignment, and array push on Note, PitchClass, Interval, Chord — all must throw in tests/architecture/immutability.test.ts

**Checkpoint**: All constitutional constraints verified automatically.

---

## Phase 10: Polish & Cross-Cutting Concerns

**Purpose**: Final cleanup and validation.

- [ ] T088 [P] Add npm scripts to package.json: "test", "test:unit", "test:oracle", "test:arch", "typecheck", "check-deps"
- [ ] T089 [P] Create barrel export for public API in src/harmonic-analysis/index.ts (re-export entities + parseChordSymbol)
- [ ] T090 Run full test suite (npx vitest run) and verify 100% pass
- [ ] T091 Run quickstart.md validation: execute the usage example and confirm output matches expected
- [ ] T092 Verify SC-001: all 189 chord combinations (9 qualities × 21 roots) produce correct results compared against music21 oracle — parametric test in tests/oracle/chord-matrix.test.ts

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — can start immediately
- **Foundational Note/PitchClass (Phase 2)**: Depends on Phase 1 — BLOCKS all subsequent phases
- **Foundational Interval (Phase 3)**: Depends on Phase 2 (Note) — BLOCKS Chord construction
- **Foundational ChordQuality/Chord (Phase 4)**: Depends on Phase 3 (Interval) — BLOCKS parser
- **User Story 1 (Phase 5)**: Depends on Phase 4 — parser for seventh chords
- **User Story 2 (Phase 6)**: Depends on Phase 4 — parser for triads (can run in parallel with Phase 5)
- **User Story 3 (Phase 7)**: Depends on Phase 4 — error handling (can run in parallel with Phase 5/6)
- **Oracle (Phase 8)**: Depends on Phases 5+6 (valid chords must parse correctly)
- **Architecture (Phase 9)**: Depends on Phases 5+6+7 (all code written, verify structure)
- **Polish (Phase 10)**: Depends on all previous phases

### User Story Dependencies

- **User Story 1 (P1)**: Depends only on foundational phases (1–4). No dependency on US2 or US3.
- **User Story 2 (P1)**: Depends only on foundational phases (1–4). Can run in parallel with US1.
- **User Story 3 (P1)**: Depends only on foundational phases (1–4). Can run in parallel with US1 and US2.

### Within Each Phase (TDD Order)

1. Tests MUST be written and FAIL before implementation
2. Value Objects built bottom-up: Note → PitchClass → Interval → ChordQuality → Chord
3. Parser implemented after all entities exist
4. Oracle and architecture tests run after all code is written

### Parallel Opportunities

- T007–T012: All Note tests can run in parallel
- T014–T017: All PitchClass tests can run in parallel
- T020–T024: Interval creation tests can run in parallel (T025–T028 sequential: depend on apply logic)
- T031–T032: ChordQuality tests in parallel
- T034–T045: All Chord construction tests in parallel
- T048–T055: All US1 parser tests in parallel
- T057–T062: All US2 parser tests in parallel
- T064–T077: All US3 error tests in parallel
- T079–T083: Oracle tests (T079 first, then T080–T083 in parallel)
- T084–T087: Architecture tests in parallel

---

## Parallel Example: Foundational Phase (Note)

```bash
# Launch all Note tests together (all write to different test blocks, no deps):
Task: T007 "Test Note creation with valid inputs" in tests/unit/entities/Note.test.ts
Task: T008 "Test Note rejects invalid inputs" in tests/unit/entities/Note.test.ts
Task: T009 "Test Note immutability" in tests/unit/entities/Note.test.ts
Task: T010 "Test Note equality by value" in tests/unit/entities/Note.test.ts
Task: T011 "Test Note.toString()" in tests/unit/entities/Note.test.ts
Task: T012 "Test Note.semitonesFromC()" in tests/unit/entities/Note.test.ts

# Then implement Note (single task, all tests must turn green):
Task: T013 "Implement Note Value Object" in src/harmonic-analysis/entities/Note.ts
```

---

## Implementation Strategy

### MVP First (Phases 1–5 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Note + PitchClass (TDD)
3. Complete Phase 3: Interval (TDD)
4. Complete Phase 4: ChordQuality + Chord (TDD)
5. Complete Phase 5: User Story 1 — seventh chord parsing (TDD)
6. **STOP and VALIDATE**: Parse all 5 spec acceptance scenarios, compare against music21
7. This is a functional MVP: seventh chords analyzed correctly

### Incremental Delivery

1. Setup + Foundational (Phases 1–4) → All entities ready
2. Add User Story 1 (Phase 5) → Seventh chords working → MVP! ✅
3. Add User Story 2 (Phase 6) → Triads working → Feature more complete
4. Add User Story 3 (Phase 7) → Error handling robust → Production-quality
5. Add Oracle (Phase 8) → Correctness verified against authority
6. Add Architecture (Phase 9) → Constitutional compliance proven
7. Polish (Phase 10) → Ship-ready

### Sequential Solo Strategy

With a single developer (TDD cycle per entity):

1. Phase 1: Setup (~15 min)
2. Phase 2: Note tests → Note impl → PitchClass tests → PitchClass impl
3. Phase 3: Interval tests → Interval impl (including apply)
4. Phase 4: ChordQuality tests → ChordQuality impl → Chord tests → Chord impl
5. Phase 5: Parser seventh tests → Parser impl
6. Phase 6: Parser triad tests → extend parser
7. Phase 7: Parser error tests → add validation
8. Phase 8: Oracle tests
9. Phase 9: Architecture tests
10. Phase 10: Polish

---

## Notes

- [P] tasks = different files or independent test blocks, no dependencies
- [Story] label maps task to specific user story for traceability
- 🔴 = Red phase (tests must fail before implementation)
- 🟢 = Green phase (implement until tests pass)
- TDD cycle is **mandatory** per constitution Principle VIII
- music21 is a **devDependency only** — never imported in src/
- All entities use `readonly` + `Object.freeze` — Principle III
- Commit after each completed phase or logical group
