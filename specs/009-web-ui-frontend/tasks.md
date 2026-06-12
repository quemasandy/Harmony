# Tasks: Web UI Frontend

**Input**: Design documents from `specs/009-web-ui-frontend/`

**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [X] T001 Initialize React project with Vite (TypeScript) in `frontend/`
- [X] T002 Configure Vite dev server proxy for `/api` requests in `frontend/vite.config.ts`
- [X] T003 [P] Define API and View Model TypeScript interfaces in `frontend/src/types/index.ts`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [X] T004 Establish global CSS tokens (dark mode, glassmorphism, animations) in `frontend/src/index.css`
- [X] T005 [P] Setup base App shell and layout structure in `frontend/src/App.tsx`
- [X] T006 [P] Ensure React entrypoint mounts correctly in `frontend/src/main.tsx`

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Submit Progression for Analysis (Priority: P1) 🎯 MVP

**Goal**: Users need to enter their harmonic progression, tonal center, and desired chord scales into a form to send for analysis.

**Independent Test**: Can be fully tested by filling out the form fields and observing the network request payload sent to the API.

### Implementation for User Story 1

- [X] T007 [P] [US1] Create `ProgressionForm` component to capture tonal center and dynamic chord inputs in `frontend/src/components/ProgressionForm.tsx`
- [X] T008 [P] [US1] Implement form state management (tonal center, chords, scales dropdown) inside `frontend/src/components/ProgressionForm.tsx`
- [X] T009 [US1] Implement `fetch` POST logic to `/api/v1/analyze/progression` and wire the form submission in `frontend/src/App.tsx`

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently

---

## Phase 4: User Story 2 - View Analysis Results (Priority: P1)

**Goal**: Users need to see the results of their harmonic progression analysis in a clear, structured, and readable format.

**Independent Test**: Can be fully tested by mocking a successful 200 OK JSON response from the API and verifying that the UI renders the correct harmonic functions, tensions, and substitutions.

### Implementation for User Story 2

- [X] T010 [P] [US2] Create `ChordCard` component to display individual chord data (roman numeral, tensions, avoid notes, substitutions) in `frontend/src/components/ChordCard.tsx`
- [X] T011 [P] [US2] Create `AnalysisView` component to render the list of analyzed chords in `frontend/src/components/AnalysisView.tsx`
- [X] T012 [US2] Wire `AnalysisView` into the main state flow to display the successful API response in `frontend/src/App.tsx`

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently

---

## Phase 5: User Story 3 - Graceful Error Handling (Priority: P2)

**Goal**: Users need to understand what went wrong if their input is invalid or if the server fails.

**Independent Test**: Can be tested by mocking 422 and 500 HTTP responses and verifying the displayed messages.

### Implementation for User Story 3

- [X] T013 [P] [US3] Parse 422 Unprocessable Entity responses and pass specific field errors to `ProgressionForm` in `frontend/src/App.tsx`
- [X] T014 [P] [US3] Display individual field-level validation errors visually under the corresponding inputs in `frontend/src/components/ProgressionForm.tsx`
- [X] T015 [US3] Catch 5xx Server Errors and display a generic fallback UI banner in `frontend/src/App.tsx`

**Checkpoint**: All user stories should now be independently functional

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [X] T016 Run manual validation against all flows defined in `specs/009-web-ui-frontend/quickstart.md`
- [X] T017 Audit UI aesthetics to ensure premium design guidelines (vibrant colors, micro-animations, glassmorphism) are met in `frontend/src/index.css`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3+)**: All depend on Foundational phase completion
  - User stories can then proceed in parallel (if staffed)
  - Or sequentially in priority order (P1 → P2 → P3)
- **Polish (Final Phase)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P1)**: Depends on US1 (needs the response from the submitted form, but can be built in parallel using mock data).
- **User Story 3 (P2)**: Depends on US1 (adds error handling to the submission flow).

### Within Each User Story

- UI components before State/Wiring
- Component implementation before integration into App.tsx
- Core implementation before integration
- Story complete before moving to next priority

### Parallel Opportunities

- Types definition (T003) can be done in parallel with Vite configuration (T002).
- `ChordCard` (T010) and `AnalysisView` (T011) can be built in parallel with `ProgressionForm` (T007).

---

## Parallel Example: User Story 2

```bash
# Launch components for User Story 2 together:
Task: "Create ChordCard component in frontend/src/components/ChordCard.tsx"
Task: "Create AnalysisView component in frontend/src/components/AnalysisView.tsx"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 1
4. **STOP and VALIDATE**: Test User Story 1 independently by capturing network requests
5. Deploy/demo if ready

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 → Test independently → MVP!
3. Add User Story 2 → Test independently → Displays results
4. Add User Story 3 → Test independently → Robust error handling
5. Each story adds value without breaking previous stories
