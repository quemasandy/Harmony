# Feature Specification: web-adapter

**Feature Branch**: `[006-web-adapter]`

**Created**: 2026-06-09

**Status**: Draft

**Input**: User description: "F6 — Web adapter. The OUTERMOST ring..."

## Clarifications

### Session 2026-06-09
- Q: Which web framework should be used to implement the adapter? → A: Express
- Q: What is the exact HTTP method and route path for the endpoint? → A: POST /api/v1/analyze/progression
- Q: Which specific 4xx HTTP status code should be returned for structural errors like malformed chords? → A: 422 Unprocessable Entity

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Client requests harmonic analysis (Priority: P1)

A client application sends an HTTP request containing a chord progression (chord symbols, tonal center, explicit per-chord chord-scales) to receive a full harmonic analysis.

**Why this priority**: This is the core functionality of exposing the existing progression analysis engine (F5) to external consumers over the web.

**Independent Test**: Can be fully tested by sending an HTTP POST request to the web adapter port with a valid JSON payload and verifying the response matches F5's JSON presenter output exactly, with a 200 OK status.

**Acceptance Scenarios**:

1. **Given** a valid HTTP request with a supported progression data payload, **When** the web adapter receives the request, **Then** it delegates to the Input Port and returns a 200 HTTP status along with the exact JSON produced by the F5 Presenter.

---

### User Story 2 - Client sends structurally invalid request (Priority: P1)

A client sends an HTTP request containing a malformed chord or progression that cannot be parsed by the domain.

**Why this priority**: A robust API must gracefully handle bad input without crashing or leaking stack traces.

**Independent Test**: Can be tested by sending an HTTP POST request with a malformed payload and verifying a 4xx HTTP status code is returned along with the explicit error DTO.

**Acceptance Scenarios**:

1. **Given** an HTTP request with an unparseable chord or malformed progression, **When** the web adapter receives the request, **Then** it delegates to the Input Port which yields a structural error, and the adapter returns a 4xx HTTP status with the error DTO serialized via the presenter.

---

### User Story 3 - Unexpected server error (Priority: P2)

An unexpected failure occurs during the processing of the request (e.g., an unhandled exception in the application layer).

**Why this priority**: Essential for identifying and correctly classifying server-side faults versus client-side faults.

**Independent Test**: Can be tested using a test double for the Input Port that deliberately throws an unexpected exception, verifying the adapter catches it and returns a 5xx HTTP status.

**Acceptance Scenarios**:

1. **Given** an HTTP request, **When** an unexpected failure occurs while invoking the Input Port, **Then** the adapter catches the exception and returns a 5xx HTTP status.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST expose an HTTP POST endpoint at `/api/v1/analyze/progression` accepting a request with the progression analysis input data.
- **FR-002**: System MUST define a framework-agnostic Input Port interface for handling the progression analysis, explicitly avoiding HTTP-specific constructs (e.g., Request, Response objects) so it can be reused by F7 (MIDI).
- **FR-003**: System MUST route the HTTP request to the Input Port without executing any domain logic in the routing layer.
- **FR-004**: System MUST return a 200 HTTP status code for successful analysis alongside the exact JSON produced by the F5 Presenter.
- **FR-005**: System MUST return a 422 Unprocessable Entity HTTP status code for structural errors (e.g., malformed chord) with the explicit error DTO serialized via the F5 Presenter.
- **FR-006**: System MUST return a 5xx HTTP status code for unexpected internal failures.
- **FR-007**: The concrete web framework MUST be isolated in a single wiring/composition file that maps routes to the Input Port.

### Edge Cases

- What happens if the request payload is not valid JSON?
- What happens if the request payload is completely missing?

### Key Entities

- **ProgressionInputDTO**: The exact data shape accepted by the Input Port representing the progression to be analyzed.
- **Input Port**: The interface that the web adapter depends on to invoke the F5 use case.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: The web adapter successfully translates 100% of incoming valid HTTP requests to the Input Port and returns the unchanged F5 Presenter JSON payload.
- **SC-002**: Architecture tests verify 100% compliance that inner layers do not depend on the `frameworks/web` ring.
- **SC-003**: 100% of test cases for the web adapter use a test double for the Input Port and do not execute real music-theory domain logic.
- **SC-004**: The web framework can be completely swapped by changing only the single wiring file, without modifying the adapter logic, application, or domain layers.

## Assumptions

- The web adapter will be implemented using the Express framework.
- Authentication, persistence, and rate limiting are explicitly out of scope for this feature.
- No new music-theoretical capabilities will be added.
