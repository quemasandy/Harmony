# Implementation Plan: [FEATURE]

**Branch**: `[###-feature-name]` | **Date**: [DATE] | **Spec**: [link]

**Input**: Feature specification from `/specs/[###-feature-name]/spec.md`

**Note**: This template is filled in by the `/speckit-plan` command. See `.specify/templates/plan-template.md` for the execution workflow.

## Summary

Implement a Single Page React application (using TypeScript and Vite) that provides a user interface for progression analysis. The UI will capture tonal centers, chord symbols, and chord-scales, submitting them to the existing F6 API, and rendering the results without performing any domain logic (Humble Object).

## Technical Context

**Language/Version**: TypeScript strict (Node.js/Browser compatible)

**Primary Dependencies**: React 18, Vite 5, Vanilla CSS

**Storage**: N/A

**Testing**: Vitest + React Testing Library (for Humble Object interaction checks)

**Target Platform**: Web Browser (Modern)

**Project Type**: Web UI Frontend (Single Page App)

**Performance Goals**: Fast initial render, responsive form interactions

**Constraints**: Humble Object pattern (zero theory logic, pure API consumer). Explicit input over inference.

**Scale/Scope**: Single screen application.

## Constitution Check

*GATE: Passed. The frontend acts exclusively as a Framework & Driver (Ring 4). It knows nothing of the domain Entities or Use Cases. It relies solely on Data Transfer Objects (DTOs) from the API. The UI is designed as a Humble Object.*

## Project Structure

### Documentation (this feature)

```text
specs/009-web-ui-frontend/
├── plan.md              # This file (/speckit-plan command output)
├── research.md          # Phase 0 output (/speckit-plan command)
├── data-model.md        # Phase 1 output (/speckit-plan command)
├── quickstart.md        # Phase 1 output (/speckit-plan command)
├── contracts/           # Phase 1 output (/speckit-plan command)
└── tasks.md             # Phase 2 output (/speckit-tasks command - NOT created by /speckit-plan)
```

### Source Code (repository root)

```text
backend/ (Current Project)
├── src/
└── tests/

frontend/
├── index.html
├── package.json
├── vite.config.ts
├── src/
│   ├── main.tsx
│   ├── App.tsx
│   ├── index.css
│   ├── components/
│   │   ├── ProgressionForm.tsx
│   │   ├── AnalysisView.tsx
│   │   └── ChordCard.tsx
│   └── types/
└── tests/
    └── setup.ts
```

**Structure Decision**: Per Principle VII (Screaming Architecture), we separate the `frontend/` out of `src/` into a sibling directory at the root, ensuring complete isolation of the build pipeline and dependencies from the backend analysis engine.
