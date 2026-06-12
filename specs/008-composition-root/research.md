# Research: Composition Root

## Decisions

### Composition Root Location
- **Decision**: Implement the composition root across two files: `src/app.ts` (Express setup) and `src/server.ts` (Port binding/listen).
- **Rationale**: Separating the Express application setup from the actual `app.listen` call allows for easier integration testing with `supertest`, as tests can import the configured app without starting a real HTTP server on an arbitrary port.
- **Alternatives considered**: A single `server.ts` file containing both setup and listen. Rejected because it complicates testing.

### CORS Configuration
- **Decision**: Configure CORS for same-origin only in production, and allow proxying from Vite in development.
- **Rationale**: The user explicitly requested same-origin for production since Express will serve the static Vite build. In development, the Vite dev server acts as a proxy. No preflight requests needed.
- **Alternatives considered**: Wildcard CORS (`*`), rejected for security reasons and contrary to user request.

### Static File Serving
- **Decision**: Use `express.static()` pointing to a standard build directory (e.g., `public` or `dist`).
- **Rationale**: Built-in Express middleware is sufficient and standard for serving static files.
- **Alternatives considered**: Nginx reverse proxy serving static files, rejected as out of scope for the application's Composition Root feature.
