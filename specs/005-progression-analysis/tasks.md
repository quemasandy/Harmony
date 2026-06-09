# Tasks: Progression Analysis Application Layer

**Input**: Design documents from `/specs/005-progression-analysis/`

**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [X] T001 Setup directory structure for `src/application` and `src/interface-adapters`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

- [X] T002 [P] Implement boundary architecture test in `tests/architecture/boundary.test.ts` to enforce dependency rule (no domain imports from application/adapters, no domain leaks in DTOs).

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Orchestrating Progression Analysis (Priority: P1) 🎯 MVP

**Goal**: Expose the domain's analytical capabilities through a single application use case using DTOs without reimplementing music theory.

**Independent Test**: Can be fully tested by instantiating the ProgressionAnalyzer, providing a valid Input DTO, and asserting the Output DTO structure and values.

### Tests for User Story 1 ⚠️

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [X] T003 [P] [US1] Create test suite for ProgressionAnalyzer in `tests/application/ProgressionAnalyzer.test.ts` (asserting structural errors, optional capabilities, and successful mappings).

### Implementation for User Story 1

- [X] T004 [P] [US1] Create DTO types in `src/application/dtos/ProgressionInputDTO.ts`, `ProgressionOutputDTO.ts`, and `ProgressionResult.ts` per `data-model.md`.
- [X] T005 [US1] Implement ProgressionAnalyzer in `src/application/use-cases/ProgressionAnalyzer.ts` (depends on T004).

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently

---

## Phase 4: User Story 2 - JSON Presentation of Analysis (Priority: P2)

**Goal**: Serialize the application-layer Output DTO into a deterministic and stable JSON contract.

**Independent Test**: Can be tested by providing an Output DTO to the JSON presenter and asserting the resulting JSON string structure.

### Tests for User Story 2 ⚠️

- [X] T006 [P] [US2] Create test suite for JsonProgressionPresenter in `tests/interface-adapters/JsonProgressionPresenter.test.ts` (pinning the exact JSON schema and error formatting).

### Implementation for User Story 2

- [X] T007 [US2] Implement JsonProgressionPresenter in `src/interface-adapters/presenters/JsonProgressionPresenter.ts`.

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently

---

## Phase 5: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [X] T008 [P] Export all DTOs, Use Cases, and Presenters from an `index.ts` file in `src/application` and `src/interface-adapters` if necessary.

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3+)**: All depend on Foundational phase completion
- **Polish (Final Phase)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P2)**: Depends on US1 DTO definitions.

### Parallel Opportunities

- T002, T003 can run in parallel.
- DTO creation (T004) can be done in parallel with tests.

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 1
4. **STOP and VALIDATE**: Test User Story 1 independently
5. Deploy/demo if ready
