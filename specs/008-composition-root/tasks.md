# Tasks: Composition Root / Servidor Ejecutable

**Input**: Design documents from `specs/008-composition-root/`

**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, quickstart.md

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

[X] T001 Create structural files (`src/app.ts`, `src/server.ts`, `tests/apps/api/app.test.ts`)
[X] T002 Install or verify presence of `express`, `cors`, `dotenv`, and `supertest`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

[X] T003 Setup base Express application instance in `src/app.ts`

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Application Boot and Readiness Check (Priority: P1) 🎯 MVP

**Goal**: El servidor inicia y proporciona una ruta de salud (health check).

**Independent Test**: Invocar el endpoint de healthcheck para confirmar la respuesta HTTP 200 usando `supertest`.

### Tests for User Story 1 ⚠️

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

[X] T004 [US1] Create integration test for `GET /health` in `tests/apps/api/app.test.ts`

### Implementation for User Story 1

[X] T005 [P] [US1] Implement `GET /health` endpoint responding with 200 OK in `src/app.ts`
[X] T006 [P] [US1] Implement `app.listen` binding using `dotenv` for port in `src/server.ts`

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently

---

## Phase 4: User Story 2 - End-to-End Progression Analysis API (Priority: P1)

**Goal**: Enviar una petición de análisis de progresión armónica y recibir la respuesta JSON correcta.

**Independent Test**: `POST /api/v1/analyze/progression` devuelve 200 y JSON correcto usando `supertest`.

### Tests for User Story 2 ⚠️

[X] T007 [US2] Create integration test for `POST /api/v1/analyze/progression` in `tests/apps/api/app.test.ts`

### Implementation for User Story 2

[X] T008 [P] [US2] Wire `ProgressionAnalyzer` and Express router under `/api/v1` in `src/app.ts`

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently

---

## Phase 5: User Story 3 - Static Asset Serving for Frontend (Priority: P2)

**Goal**: Entregar archivos estáticos (HTML, JS, CSS) del frontend.

**Independent Test**: Solicitar recursos estáticos a la raíz.

### Implementation for User Story 3

[X] T009 [P] [US3] Add static file serving middleware (e.g., `express.static`) in `src/app.ts`
[X] T010 [P] [US3] Configure CORS for same-origin posture in `src/app.ts`

**Checkpoint**: All user stories should now be independently functional

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

[X] T011 Run `npm run validate` to ensure dependency rules and existing boundaries are not broken
[X] T012 Run manual validation using `quickstart.md` procedures

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3+)**: All depend on Foundational phase completion
- **Polish (Final Phase)**: Depends on all desired user stories being complete

### Parallel Opportunities

- Endpoints setup and server binding can be implemented in parallel.
- Static serving and CORS configuration can run in parallel.
