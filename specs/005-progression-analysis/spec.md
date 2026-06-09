# Feature Specification: Progression Analysis Application Layer

**Feature Branch**: `005-progression-analysis`

**Created**: 2026-06-08

**Status**: Draft

**Input**: User description: "F5 — Application layer: progression-analysis use case + JSON presenter. This is the FIRST feature outside the domain ring. Goal: expose the domain's existing analytical capabilities (F2 harmonic function + ii-V-I, F3 available tensions + avoid notes, F4 tritone substitutions) through a single application use case, with a presenter that renders the result as JSON. The use case ORCHESTRATES existing domain capabilities — it must not reimplement or duplicate any music-theory logic. All correctness already lives in the domain. Boundary contract (the core architectural decision for F5): The use case accepts a plain INPUT DTO (no domain types): chord symbols as strings, the tonal center, and the explicit chord-scales per chord. The use case returns a plain application-layer OUTPUT DTO (no domain entities). The JSON presenter is an INTERFACE ADAPTER. Layering (must be reflected in folder structure — screaming architecture): domain <- application <- interface-adapters. Error handling: explicit application-level result, NOT a leaked domain exception. Constraints: Strict TDD, Immutable DTOs. Explicitly OUT OF SCOPE: No web/HTTP server, no REST endpoint, no MIDI, no CLI."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Orchestrating Progression Analysis (Priority: P1)

As a consumer of the Harmony engine, I want to submit a plain data representation of a chord progression, so that I receive a comprehensive theoretical analysis without needing to construct domain entities manually.

**Why this priority**: This is the core purpose of the F5 use case—bridging the gap between external plain data and internal domain complexity.

**Independent Test**: Can be fully tested by instantiating the use case, providing a valid Input DTO, and asserting the Output DTO structure and values.

**Acceptance Scenarios**:

1. **Given** a valid Input DTO with a tonal center and a sequence of chords, **When** the progression analysis use case is executed, **Then** it orchestrates the domain entities and returns an Output DTO containing harmonic functions, tensions, and tritone substitutions.
2. **Given** an invalid Input DTO (e.g., malformed chord symbol), **When** the progression analysis use case is executed, **Then** it returns an explicit application-level error result (discriminated union) without throwing an exception.

---

### User Story 2 - JSON Presentation of Analysis (Priority: P2)

As a consumer of the application layer, I want to serialize the analysis results into JSON, so that I can easily transmit the data over external boundaries (like a future HTTP API or CLI).

**Why this priority**: The JSON presenter validates the interface adapter boundary and ensures that the output is strictly serializable without leaking domain concepts.

**Independent Test**: Can be tested by providing an Output DTO to the JSON presenter and asserting the resulting JSON string structure.

**Acceptance Scenarios**:

1. **Given** a valid Output DTO from the use case, **When** the JSON presenter processes it, **Then** it returns a correctly structured, valid JSON string or object.
2. **Given** an error result from the use case, **When** the JSON presenter processes it, **Then** it returns a standardized JSON error representation.

### Edge Cases

- What happens when an unparseable chord symbol is provided in the input DTO? (Should return a structured error result).
- What happens when a chord-scale provided is incompatible with the parsed chord? (Should return a structured error result).
- How does the system handle an empty sequence of chords? (Should return a valid but empty analysis, or a specific error depending on domain rules).

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The system MUST implement a use case that accepts a plain Input DTO containing chord symbols, a tonal center, and optional explicit chord-scales.
- **FR-002**: The use case MUST map the Input DTO to domain entities using existing constructors and parsers.
- **FR-003**: The use case MUST return a plain Output DTO containing harmonic functions, ii-V-I patterns, available tensions, avoid notes, and tritone substitutions.
- **FR-004**: The system MUST implement a JSON presenter in the `interface-adapters` layer that consumes only the application Output DTO.
- **FR-005**: The system MUST handle invalid inputs by returning an explicit application-level result (discriminated union) rather than throwing domain exceptions.
- **FR-006**: The folder structure MUST clearly reflect the dependency rule: `domain` <- `application` <- `interface-adapters`.
- **FR-007**: No domain entities (Note, Chord, Interval) MUST leak into the Input DTO or Output DTO.

### Key Entities

- **Input DTO**: A plain object containing string arrays and primitives (chords, scales, tonal center).
- **Output DTO**: A plain object containing the aggregated analysis results (roman numerals, tensions, substitutions).
- **Use Case**: The orchestrator that bridges the input DTO and domain logic.
- **JSON Presenter**: The adapter that converts the Output DTO into JSON format.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% of the use case inputs and outputs are plain data structures (DTOs), completely decoupled from domain classes.
- **SC-002**: 100% of domain errors triggered during parsing or entity construction are caught and transformed into explicit application-level error structures.
- **SC-003**: The JSON presenter successfully serializes 100% of valid Output DTOs without throwing circular reference or serialization errors.
- **SC-004**: Test coverage for the application boundary and interface adapter boundary is strictly maintained using TDD.

## Assumptions

- We assume the existing domain layer (F1-F4) is stable and provides the necessary public methods to retrieve all analysis data.
- The discriminated union error pattern used in previous features will be the standard for surfacing application-level errors.
