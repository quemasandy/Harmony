# Feature Specification: Composition Root / Servidor Ejecutable

**Feature Branch**: `008-composition-root`

**Created**: 2026-06-12

**Status**: Draft

**Input**: User description: "F8 — Composition Root / servidor ejecutable. El componente "Main": el anillo más externo (Frameworks & Drivers), el único punto del sistema autorizado a conocer todos los anillos a la vez. Hasta ahora nada arranca de verdad — F6 dejó app.listen como pseudocódigo en su quickstart. Esta feature convierte el motor en un servidor que realmente bootea."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Application Boot and Readiness Check (Priority: P1)

Como operador de la plataforma, quiero que la aplicación inicie como un servidor real y proporcione una ruta de salud (health check), para poder verificar que el sistema está corriendo y listo para recibir tráfico (por ejemplo, desde un balanceador de carga o un orquestador de contenedores).

**Why this priority**: Es el paso inicial indispensable. Si la aplicación no bootea ni indica que está viva, nada de lo demás puede funcionar o probarse de manera integrada.

**Independent Test**: Se puede probar arrancando la aplicación e invocando el endpoint de healthcheck para confirmar la respuesta HTTP 200.

**Acceptance Scenarios**:

1. **Given** la aplicación es configurada con un puerto válido, **When** el servidor arranca, **Then** expone un endpoint `GET /health` que devuelve código 200.

---

### User Story 2 - End-to-End Progression Analysis API (Priority: P1)

Como consumidor de la API, quiero enviar una petición de análisis de progresión armónica y recibir la respuesta JSON correcta, para poder integrar el motor de análisis en aplicaciones de usuario.

**Why this priority**: Es el núcleo funcional del servidor; expone el caso de uso central del sistema integrando los componentes previamente construidos (F5 y F6).

**Independent Test**: Se puede probar de manera automatizada (smoke test) verificando la respuesta HTTP 200 y la salida de JSON exacta tras invocar el endpoint montado con dependencias reales.

**Acceptance Scenarios**:

1. **Given** el servidor en ejecución, **When** se envía una petición `POST /api/v1/analyze/progression` con un payload válido, **Then** el servidor devuelve código 200 con la estructura JSON generada por el `ProgressionAnalyzer` de F5.

---

### User Story 3 - Static Asset Serving for Frontend (Priority: P2)

Como usuario final, quiero poder cargar la aplicación web en mi navegador, para lo cual el servidor debe poder entregar los archivos estáticos (HTML, JS, CSS) del frontend.

**Why this priority**: Prepara el terreno para F9 (la interfaz gráfica), pero depende del análisis principal y el booteo para ser completamente útil.

**Independent Test**: Puede probarse simulando la petición de archivos estáticos básicos en la raíz del servidor.

**Acceptance Scenarios**:

1. **Given** una carpeta con archivos estáticos en el sistema, **When** se hace un GET a la raíz (`/`) u otras rutas estáticas, **Then** el servidor responde con el contenido correcto.

### Edge Cases

- ¿Qué pasa si el puerto definido en la variable de entorno ya está en uso?
- ¿Qué pasa si el payload de la petición POST es inválido a nivel de endpoint?

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST instance the `ProgressionAnalyzer` use case (F5) and adapt it to the `AnalyzeProgressionInputPort`.
- **FR-002**: System MUST mount the existing Express router (F6) at the path `POST /api/v1/analyze/progression`.
- **FR-003**: System MUST expose a readiness check endpoint at `GET /health` that responds with HTTP 200.
- **FR-004**: System MUST start an HTTP server listening on a port defined via environment variable (with a default fallback).
- **FR-005**: System MUST be capable of serving static assets for the future frontend (F9).
- **FR-006**: System MUST configure Cross-Origin Resource Sharing (CORS) for a same-origin posture (no CORS in prod as Express serves static Vite build; Vite proxy in dev).

### Constraints & Out of Scope
- **C-001**: ZERO domain logic allowed in the Composition Root. It must be a thin Humble Object.
- **C-002**: No re-testing of domain logic or use cases. The component must be covered by a single integration smoke test that asserts a 200 OK + expected JSON on the POST endpoint, and 200 OK on `/health`.
- **C-003**: The Composition Root is the ONLY component authorized to import from various architectural rings.
- **OOS-001**: Authentication is out of scope.
- **OOS-002**: Persistence is out of scope.
- **OOS-003**: Rate limiting is out of scope.
- **OOS-004**: Frontend implementation (F9) and Deployment (F10) are out of scope.

### Key Entities

This feature focuses on infrastructure wiring rather than domain data, so it primarily deals with routing logic and dependency injection boundaries rather than business entities.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: The server successfully boots and the readiness check responds successfully under 50ms.
- **SC-002**: A single smoke integration test successfully executes the analysis request, returning a success response and the exact data output from the analysis engine.
- **SC-003**: Static file serving is verified to be active for frontend preparation.

## Assumptions

- Environment variables will be the primary mechanism for configuration (e.g., `PORT`).
- The static assets directory will have a standard structure (e.g., `public` or `dist`).
