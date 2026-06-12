# Implementation Plan: Composition Root / Servidor Ejecutable

**Branch**: `008-composition-root` | **Date**: 2026-06-12 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `specs/008-composition-root/spec.md`

## Summary

This feature implements the application's Composition Root (the "Main" component). It is the outermost layer (Frameworks & Drivers) responsible for wiring together the existing ProgressionAnalyzer use case, adapting it to the Input Port, mounting the Express router from F6, configuring CORS for same-origin, serving static assets for the future frontend (F9), and starting the HTTP server with a health check endpoint.

## Technical Context

**Language/Version**: TypeScript 5+

**Primary Dependencies**: Express, cors, dotenv, supertest (for testing)

**Storage**: N/A

**Testing**: Jest + supertest (integration smoke test)

**Target Platform**: Node.js server

**Project Type**: Web service (REST API + static file server)

**Performance Goals**: `GET /health` responds in <50ms

**Constraints**: Zero domain logic; strictly a Humble Object (Principle VIII). Single smoke test.

**Scale/Scope**: Top-level server initialization and dependency wiring.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **Principle I (Dependency Rule)**: PASS. The Composition Root is at the outermost ring (Frameworks & Drivers) and is explicitly authorized to import from inner rings to wire dependencies.
- **Principle V (Ports and Adapters)**: PASS. It instantiates the use case and injects it into the adapter.
- **Principle VII (Screaming Architecture)**: PASS. It lives at the edge of the system (e.g., `src/server.ts` or `src/apps/api/server.ts`).
- **Principle VIII (Humble Object)**: PASS. Zero domain logic here. Only infrastructural wiring, tested via a single integration smoke test.

## Project Structure

### Documentation (this feature)

```text
specs/008-composition-root/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
└── contracts/
```

### Source Code (repository root)

```text
src/
├── app.ts                 # Express application setup (wiring router, CORS, static files)
├── server.ts              # Entry point (app.listen)
└── harmonic-analysis/     # (Existing domain and use cases)
    ├── frameworks/
    │   └── web/
    │       └── progression-router.ts
    └── use-cases/
        └── analyze-progression.ts

tests/
├── apps/
│   └── api/
│       └── app.test.ts    # Smoke test using supertest
```

**Structure Decision**: A top-level `src/app.ts` (for the Express instance) and `src/server.ts` (for `app.listen`) will be created or updated. This separates the app configuration (which can be exported and used by supertest) from the actual port binding.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

No violations.
