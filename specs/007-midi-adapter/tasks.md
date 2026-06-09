# Tasks: F7 MIDI Adapter

**Input**: Design documents from `/specs/007-midi-adapter/`

**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, quickstart.md

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [x] T001 Create `src/frameworks/midi/` test directory structure
- [x] T002 [P] Create `tests/frameworks/midi/` structure

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

- [x] T003 Architecture test: Create `tests/architecture/dependency-rule.test.ts` to assert that no inner layers import from `src/frameworks/midi`

---

## Phase 3: User Story 1 - Translate MIDI Input to Analysis (Priority: P1) 🎯 MVP

**Goal**: System correctly groups MIDI stream, spells pitch classes, and dispatches via input port.

**Independent Test**: Simulate MIDI Note-On streams in tests, assert stream segmentation and DTO composition.

### Tests for User Story 1

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [x] T004 [P] [US1] Unit test for spelling policy in `tests/frameworks/midi/midi-spelling-policy.test.ts`
- [x] T005 [P] [US1] Unit test for stream segmenter in `tests/frameworks/midi/midi-stream-segmenter.test.ts`
- [x] T006 [P] [US1] Unit test for Web MIDI adapter in `tests/frameworks/midi/web-midi-adapter.test.ts` (mocking Web MIDI API)

### Implementation for User Story 1

- [x] T007 [P] [US1] Implement `MidiSpellingPolicy` in `src/frameworks/midi/midi-spelling-policy.ts`
- [x] T008 [P] [US1] Implement `MidiStreamSegmenter` in `src/frameworks/midi/midi-stream-segmenter.ts`
- [x] T009 [US1] Implement `WebMidiAdapter` in `src/frameworks/midi/web-midi-adapter.ts` (depends on T007, T008)
- [x] T010 [US1] Export adapter in `src/frameworks/midi/index.ts`

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently

---

## Phase 4: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [x] T011 Run all validation tests
- [x] T012 Run architecture tests to confirm dependency rule compliance

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3+)**: All depend on Foundational phase completion
- **Polish (Final Phase)**: Depends on all desired user stories being complete

### Parallel Opportunities

- Unit tests can be written in parallel.
- `MidiSpellingPolicy` and `MidiStreamSegmenter` can be implemented in parallel.

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational
3. Complete Phase 3: User Story 1
4. **STOP and VALIDATE**: Run test suite
5. Complete Phase 4: Polish
