# Research & Technical Decisions: Web UI Frontend

**Feature**: 009-web-ui-frontend
**Context**: Building a Web UI for the Progression Analyzer (F9) that operates purely as a Humble Object.

## Technical Decisions

### 1. Framework
- **Decision**: React with TypeScript via Vite.
- **Rationale**: Requested and resolved during specification phase. React provides component-based architecture for dynamic forms (chords + scales). Vite provides fast HMR and handles building static assets that will be served by the Express backend.
- **Alternatives Considered**: Vanilla JS (requires too much manual DOM manipulation for complex forms), Vue/Svelte (ruled out by user).

### 2. Styling
- **Decision**: Vanilla CSS with modern features (CSS variables, backdrop-filter for glassmorphism, transitions for micro-animations).
- **Rationale**: Aligns with system guidelines to avoid TailwindCSS unless requested. Vanilla CSS provides maximum control to create a premium, dynamic, dark-mode design with smooth gradients and hover effects.
- **Alternatives Considered**: TailwindCSS (avoided per constraints), CSS-in-JS (unnecessary overhead).

### 3. State Management & API
- **Decision**: Native React State (`useState`, `useReducer`) and standard `fetch` API.
- **Rationale**: The application is a single screen. Complex state management libraries (Redux, Zustand) or data fetching libraries (React Query) are overkill. The API contract is simple (`POST /api/v1/analyze/progression`).
- **Alternatives Considered**: React Query (good but unnecessary for a single mutation endpoint).

### 4. Project Structure (Architecture)
- **Decision**: A separate `frontend/` directory at the project root.
- **Rationale**: Aligns with Principle VII (Screaming Architecture) where delivery mechanisms are kept on the edges. The frontend is a separate build context from the Node.js backend.
- **Alternatives Considered**: Embedding React inside the `src/` folder (violates separation of concerns and build pipelines).

### 5. Architectural Constraints (Humble Object)
- **Decision**: The UI will do zero chord parsing or music theory deduction.
- **Rationale**: Required by Principle VIII. The UI only provides form validation (e.g., checking if fields are empty) and sends the raw strings to the backend. It maps 422 errors to fields and renders the resulting JSON exactly as returned.
