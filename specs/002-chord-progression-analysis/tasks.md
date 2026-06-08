---
description: "Task list template for feature implementation"
---

# Tasks: Chord Progression Harmonic Analysis

**Input**: Design documents from `/specs/002-chord-progression-analysis/`

**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

*(None required - Extending existing single project structure)*

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [X] T001 [P] Create `Key` value object in `src/harmonic-analysis/entities/Key.ts`
- [X] T002 [P] Create unit tests for `Key` in `tests/unit/entities/Key.test.ts`
- [X] T003 [P] Create `RomanNumeral` value object in `src/harmonic-analysis/entities/RomanNumeral.ts`
- [X] T004 [P] Create unit tests for `RomanNumeral` in `tests/unit/entities/RomanNumeral.test.ts`
- [X] T005 [P] Define `HarmonicAnalysis` type/interface in `src/harmonic-analysis/entities/Progression.ts`

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Functional Analysis of a Diatonic Progression (Priority: P1) 🎯 MVP

**Goal**: Input a chord progression along with its key, so I can see the harmonic function of each chord as a Roman numeral relative to that key.

**Independent Test**: Can be tested by providing a diatonic chord progression (e.g., "Dm7 G7 Cmaj7" in C Major) and verifying the correct roman numerals ("ii", "V", "I") are output.

### Tests for User Story 1 ⚠️

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [X] T006 [P] [US1] Unit test for diatonic progression analysis in `tests/unit/entities/Progression.test.ts`

### Implementation for User Story 1

- [X] T007 [US1] Create `Progression` aggregate root in `src/harmonic-analysis/entities/Progression.ts` (depends on T001, T003)
- [X] T008 [US1] Implement `Progression.analyze()` basic diatonic Roman numeral mapping in `src/harmonic-analysis/entities/Progression.ts`
- [X] T009 [US1] Ensure `Progression` fails fast upon empty progression or invalid chords in `src/harmonic-analysis/entities/Progression.ts`

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently

---

## Phase 4: User Story 2 - Detection of ii-V-I Patterns (Priority: P2)

**Goal**: Highlight ii-V-I patterns (both major and minor) within my progression.

**Independent Test**: Can be tested by providing progressions containing major ii-V-I and minor ii-V-I patterns, and verifying the system correctly identifies their locations.

### Tests for User Story 2 ⚠️

- [X] T010 [P] [US2] Unit test for major and minor ii-V-I pattern detection in `tests/unit/entities/Progression.test.ts`

### Implementation for User Story 2

- [X] T011 [US2] Implement sliding window pattern detection in `Progression.analyze()` in `src/harmonic-analysis/entities/Progression.ts`

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently

---

## Phase 5: User Story 3 - Handling Non-Diatonic Chords (Priority: P3)

**Goal**: Identify chords that do not belong to the explicit key, so I know they are borrowed or chromatic without getting an incorrect analysis.

**Independent Test**: Can be tested by providing a progression with a non-diatonic chord and verifying it's labeled appropriately.

### Tests for User Story 3 ⚠️

- [X] T012 [P] [US3] Unit test for handling non-diatonic chords in `tests/unit/entities/Progression.test.ts`

### Implementation for User Story 3

- [X] T013 [US3] Add non-diatonic chord identification logic to `Progression.analyze()` in `src/harmonic-analysis/entities/Progression.ts`

**Checkpoint**: All user stories should now be independently functional

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [X] T014 Pass existing oracle tests in `tests/oracle/progression-oracle.test.ts`
- [X] T015 Ensure architectural compliance (Principle I, II, III, IV) using `tests/architecture/immutability.test.ts` or similar

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3+)**: All depend on Foundational phase completion
  - User stories can then proceed sequentially in priority order (P1 → P2 → P3)
- **Polish (Final Phase)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P2)**: Can start after Foundational (Phase 2) - May integrate with US1 but should be independently testable
- **User Story 3 (P3)**: Can start after Foundational (Phase 2) - May integrate with US1/US2 but should be independently testable

### Within Each User Story

- Tests (if included) MUST be written and FAIL before implementation
- Models before services
- Services before endpoints
- Core implementation before integration
- Story complete before moving to next priority

### Parallel Opportunities

- All Foundational tasks marked [P] can run in parallel (within Phase 2)
- All tests for a user story marked [P] can run in parallel

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Verify tests fail before implementing
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Avoid: vague tasks, same file conflicts, cross-story dependencies that break independence
