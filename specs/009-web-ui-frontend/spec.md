# Feature Specification: Web UI Frontend

**Feature Branch**: `009-web-ui-frontend`

**Created**: 2026-06-12

**Status**: Draft

**Input**: User description: "F9 — Web UI frontend. La primera interfaz para PERSONAS: hasta ahora todo lo construido sirve a programas (API HTTP + MIDI)..."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Submit Progression for Analysis (Priority: P1)

Users need to enter their harmonic progression, tonal center, and desired chord scales into a form to send for analysis.

**Why this priority**: Without inputting data, no analysis can be performed. This is the core entry point of the UI.

**Independent Test**: Can be fully tested by filling out the form fields and observing the network request payload sent to the API.

**Acceptance Scenarios**:

1. **Given** a clean UI, **When** the user enters a tonal center, a sequence of chords, and selects a scale for each chord, and clicks "Analyze", **Then** the UI makes an HTTP POST request to `/api/v1/analyze/progression` with the correct JSON payload.
2. **Given** the progression form, **When** the user attempts to submit without providing a tonal center or leaving a chord symbol empty, **Then** the UI prevents submission and shows a basic validation error (e.g., "Field is required").

---

### User Story 2 - View Analysis Results (Priority: P1)

Users need to see the results of their harmonic progression analysis in a clear, structured, and readable format.

**Why this priority**: Displaying the returned data is the primary purpose of the application.

**Independent Test**: Can be fully tested by mocking a successful 200 OK JSON response from the API and verifying that the UI renders the correct harmonic functions, tensions, and substitutions.

**Acceptance Scenarios**:

1. **Given** a submitted progression, **When** the API returns a successful JSON analysis result, **Then** the UI displays the roman numeral and harmonic function for each chord.
2. **Given** a successful analysis result, **When** a chord contains ii-V-I patterns, available tensions, avoid notes, or tritone substitutions, **Then** the UI clearly displays this information grouped by chord.

---

### User Story 3 - Graceful Error Handling (Priority: P2)

Users need to understand what went wrong if their input is invalid or if the server fails.

**Why this priority**: Users will inevitably input invalid chord symbols or unsupported scales; clear feedback prevents frustration.

**Independent Test**: Can be tested by mocking 422 and 500 HTTP responses and verifying the displayed messages.

**Acceptance Scenarios**:

1. **Given** a submitted progression, **When** the API returns a 422 Unprocessable Entity due to an invalid chord symbol, **Then** the UI displays a human-readable error indicating exactly which chord or field failed, without showing raw JSON or stack traces.
2. **Given** a submitted progression, **When** the API returns a 5xx Server Error, **Then** the UI displays a generic, polite error message indicating a server issue.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The UI MUST provide input fields for the progression's explicit tonal center.
- **FR-002**: The UI MUST provide dynamic or structured input fields for entering multiple chords, including the chord symbol and an explicit chord-scale per chord.
- **FR-003**: The UI MUST capture the chord-scale input via a dropdown menu containing the supported 7-note scales.
- **FR-004**: The UI MUST NOT perform any domain-specific music theory validation (e.g., parsing chords or deducing functions) locally.
- **FR-005**: The UI MUST send the captured data as a POST request to `/api/v1/analyze/progression`.
- **FR-006**: The UI MUST render the API's JSON response, displaying harmonic functions, ii-V-I flags, tensions, avoid notes, and tritone substitutions per chord.
- **FR-007**: The UI MUST map 422 API errors to human-readable validation messages tied to specific inputs.
- **FR-008**: The UI MUST map 5xx API errors to generic user-friendly server error messages.
- **FR-009**: The UI MUST be built using React with TypeScript.
- **FR-010**: The UI MUST operate as a static application built via Vite, producing assets to be served by the backend.

### Key Entities

- **Progression Input Form State**: Contains the current tonal center, list of chord symbols, and list of chord scales entered by the user.
- **Analysis View State**: Contains the structured presentation data returned by the API (roman numerals, tensions, substitutions).

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can input a 4-chord progression and receive visual analysis results.
- **SC-002**: The application renders the complete F6 API JSON response into UI elements accurately 100% of the time.
- **SC-003**: Users receive immediate, human-readable feedback when inputting a chord symbol that the API rejects.
- **SC-004**: Zero domain logic (music theory parsing, chord rule validation) is executed in the browser; the client relies strictly on the API contract.

## Assumptions

- The frontend will be served from the exact same origin as the API in production, making CORS configuration unnecessary.
- During development, Vite's dev server proxy will be used to route `/api/*` requests to the local Express backend.
- Authentication, session persistence, and history tracking are out of scope.
- MIDI input and audio playback are out of scope for this UI.
