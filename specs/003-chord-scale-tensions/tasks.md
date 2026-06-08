# Tasks: Chord Scale Tensions Analysis

**Input**: Design documents from `/specs/003-chord-scale-tensions/`

**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: TDD strictly required (tests included).

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Single project**: `src/`, `tests/` at repository root

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [x] T001 Review implementation plan and existing models in `src/entities/Chord.ts` and `src/entities/Scale.ts`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T002 Update or create the `music21` python oracle script in `tests/oracle/scripts/` to generate expected tensions for a matrix of chord-scales.

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Available Tensions and Avoid Notes Calculation (Priority: P1) 🎯 MVP

**Goal**: As a musician studying harmony, I want to know which tensions I can add to a chord and which notes I should avoid based on its chord-scale, so that I can build idiomatic voicings and melodic lines.

**Independent Test**: Can be fully tested by providing a chord and its associated scale, verifying the output matches the expected theoretically correct available tensions and avoid notes using music21 as an oracle.

### Tests for User Story 1 (OPTIONAL - only if tests requested) ⚠️

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [x] T003 [P] [US1] Create unit test suite for Tensions logic in `tests/unit/entities/Tensions.test.ts`
- [x] T004 [P] [US1] Create oracle integration test in `tests/oracle/TensionsOracle.test.ts`

### Implementation for User Story 1

- [x] T005 [P] [US1] Create `Tension`, `AvoidNote`, and `ChordScaleTensions` value objects/interfaces in `src/entities/Tensions.ts`
- [x] T006 [P] [US1] Implement custom error classes `InvalidScaleLengthError` and `IncompatibleChordScaleError` in `src/entities/Tensions.ts`
- [x] T007 [US1] Implement `calculateTensions(chord: Chord, scale: Scale): ChordScaleTensions` core logic in `src/entities/Tensions.ts` (depends on T005, T006)

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently

---

## Phase N: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [x] T008 [P] Run validation suite via `npm run validate` to ensure 0% regression and check architecture rules.
- [x] T009 [P] Validate code snippets in `quickstart.md` run successfully.

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3+)**: All depend on Foundational phase completion
- **Polish (Final Phase)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories

### Within Each User Story

- Tests (if included) MUST be written and FAIL before implementation
- Models before services
- Services before endpoints
- Core implementation before integration
- Story complete before moving to next priority

### Parallel Opportunities

- All tests for a user story marked [P] can run in parallel
- Models within a story marked [P] can run in parallel

---

## Parallel Example: User Story 1

```bash
# Launch all tests for User Story 1 together:
Task: T003 [P] [US1] Create unit test suite for Tensions logic in tests/unit/entities/Tensions.test.ts
Task: T004 [P] [US1] Create oracle integration test in tests/oracle/TensionsOracle.test.ts

# Launch all models for User Story 1 together:
Task: T005 [P] [US1] Create Tension, AvoidNote, and ChordScaleTensions value objects/interfaces in src/entities/Tensions.ts
Task: T006 [P] [US1] Implement custom error classes InvalidScaleLengthError and IncompatibleChordScaleError in src/entities/Tensions.ts
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 1
4. **STOP and VALIDATE**: Test User Story 1 independently
5. Deploy/demo if ready

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Verify tests fail before implementing
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Avoid: vague tasks, same file conflicts, cross-story dependencies that break independence
