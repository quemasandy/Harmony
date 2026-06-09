# Tasks: Web Adapter (F6)

**Input**: Design documents from `/specs/006-web-adapter/`

**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Tests are strictly required for the Web Adapter.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [x] T001 Create project directories for `application/ports` and `frameworks/web`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

- [x] T002 [P] Create `AnalyzeProgressionInputPort.ts` interface in `src/harmonic-analysis/application/ports/`

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Client requests harmonic analysis (Priority: P1) 🎯 MVP

**Goal**: Expose the F5 Progression Analysis use case over HTTP with 200 OK responses.

**Independent Test**: Can be fully tested by sending an HTTP POST request to the web adapter port with a valid JSON payload and verifying the response matches F5's JSON presenter output exactly, with a 200 OK status.

### Tests for User Story 1

- [x] T003 [P] [US1] Create boundary test in `tests/architecture/web-boundary.test.ts` to assert that inner rings never import from `frameworks/web`
- [x] T004 [P] [US1] Create unit tests in `tests/frameworks/web/ExpressAdapter.test.ts` using `supertest` for route delegation, 200 status, and byte-for-byte exact JSON output

### Implementation for User Story 1

- [x] T005 [US1] Create framework-agnostic handler logic in `src/harmonic-analysis/frameworks/web/ExpressAdapter.ts` (map request to DTO, call port, `res.send()` the output string)
- [x] T006 [US1] Create isolated Express composition wiring in `src/harmonic-analysis/frameworks/web/ExpressWiring.ts` (maps route to the adapter)

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently

---

## Phase 4: User Story 2 - Client sends structurally invalid request (Priority: P1)

**Goal**: Handle structural validation failures without crashing.

**Independent Test**: Can be tested by sending an HTTP POST request with a malformed payload and verifying a 422 HTTP status code is returned along with the explicit error DTO.

### Tests for User Story 2

- [x] T007 [P] [US2] Add tests in `tests/frameworks/web/ExpressAdapter.test.ts` for structural error handling with a test double port returning an error

### Implementation for User Story 2

- [x] T008 [US2] Update `ExpressAdapter.ts` to map structured failures to HTTP 422 Unprocessable Entity

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently

---

## Phase 5: User Story 3 - Unexpected server error (Priority: P2)

**Goal**: Handle unexpected server faults.

**Independent Test**: Can be tested using a test double for the Input Port that deliberately throws an unexpected exception, verifying the adapter catches it and returns a 5xx HTTP status.

### Tests for User Story 3

- [x] T009 [P] [US3] Add tests in `tests/frameworks/web/ExpressAdapter.test.ts` simulating thrown unexpected errors from the port.

### Implementation for User Story 3

- [x] T010 [US3] Update `ExpressAdapter.ts` to catch unexpected exceptions and return HTTP 500 status.

**Checkpoint**: All user stories should now be independently functional

---

## Phase N: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [x] T011 [P] Run `npm run validate` to ensure all tests and boundary architecture constraints are passing.

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3+)**: All depend on Foundational phase completion
- **Polish (Final Phase)**: Depends on all desired user stories being complete
