# Research: Web Adapter (F6)

## Technical Decisions

### Web Framework: Express
- **Decision**: Use `express` for the HTTP web adapter.
- **Rationale**: Express is standard, mature, and ubiquitous in the Node.js ecosystem. It aligns perfectly with the requirement for a "dumb" HTTP routing layer that simply maps payloads to the Input Port. It requires minimal boilerplate and has excellent compatibility with `supertest` for testing.
- **Alternatives considered**: Fastify, Native `http`. Fastify provides slightly better performance but introduces schema validation concepts that might overlap with the domain's strict validation. Native `http` requires too much manual payload parsing boilerplate.

### Stable JSON Contract Preservation
- **Decision**: Use `res.setHeader('Content-Type', 'application/json')` and `res.send(presenterOutputString)`.
- **Rationale**: The F5 `JsonProgressionPresenter` produces a strictly deterministic, stable JSON string. Calling `res.json(JSON.parse(presenterOutputString))` would parse and re-serialize the object, potentially destroying the stable key ordering guaranteed by F5. Using `res.send` with an explicit content type ensures the string is sent byte-for-byte exactly as produced.
- **Alternatives considered**: `res.json()` - Rejected because it implicitly calls `JSON.stringify()`, losing the customized stable sort ordering of F5.

### Port Interface Decoupling
- **Decision**: Define `AnalyzeProgressionInputPort` in the `application` layer that accepts a `ProgressionInputDTO` and returns a string (the JSON payload) or a Promise thereof. 
- **Rationale**: The input port must not reference `Request` or `Response` objects from Express. This ensures the F7 MIDI adapter can reuse the exact same port without needing a mock HTTP request.
- **Alternatives considered**: Passing `req` and `res` into the controller. Rejected as a gross violation of Clean Architecture.

### Architecture Invariant Testing
- **Decision**: Add a new boundary test in `tests/architecture/web-boundary.test.ts` that scans the `domain`, `application`, and `interface-adapters` directories and asserts that `frameworks/web` is never imported.
- **Rationale**: Enforces Principle I (Dependency Rule).
