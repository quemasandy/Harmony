# Feature Specification: Chord Progression Harmonic Analysis

**Feature Branch**: `002-chord-progression-analysis`

**Created**: 2026-06-08

**Status**: Draft

**Input**: User description: "Construye la Feature 2 del Motor de Análisis Armónico: análisis de una progresión de acordes dado un centro tonal explícito..."

## Clarifications

### Session 2026-06-08

- Q: How should the `Progression` aggregate root receive its chords? → A: Array of pre-instantiated `Chord` objects
- Q: When analyzing a progression string containing multiple invalid chords, how should the system report the errors? → A: Fail fast (reject immediately upon encountering the first invalid chord)
- Q: If patterns overlap within a progression, should the system report all overlapping patterns? → A: Yes, report all overlapping patterns (sliding window approach)

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Functional Analysis of a Diatonic Progression (Priority: P1)

As a musician studying harmony, I want to input a chord progression along with its key, so I can see the harmonic function of each chord as a Roman numeral relative to that key.

**Why this priority**: Core value of the feature, establishes the base structure of a progression and basic roman numeral translation.

**Independent Test**: Can be tested by providing a diatonic chord progression (e.g., "Dm7 G7 Cmaj7" in C Major) and verifying the correct roman numerals ("ii", "V", "I") are output.

**Acceptance Scenarios**:

1. **Given** a valid progression ("Dm7 G7 Cmaj7") and an explicit key (C Major), **When** analyzed, **Then** the system returns the roman numerals (ii, V, I) reflecting correct quality casing.
2. **Given** an empty progression and a valid key, **When** analyzed, **Then** the system rejects it with a clear error message.
3. **Given** a progression containing invalid chords and a valid key, **When** analyzed, **Then** the system rejects it with a clear error message.

---

### User Story 2 - Detection of ii-V-I Patterns (Priority: P2)

As a jazz student, I want the system to highlight ii-V-I patterns (both major and minor) within my progression, so I can recognize this fundamental cadence.

**Why this priority**: High value for jazz harmony learners, builds upon the foundational roman numeral analysis.

**Independent Test**: Can be tested by providing progressions containing major ii-V-I and minor ii-V-I patterns, and verifying the system correctly identifies their locations.

**Acceptance Scenarios**:

1. **Given** a progression containing a major ii-V-I ("Dm7 G7 Cmaj7" in C Major), **When** analyzed, **Then** the system reports the location of the pattern.
2. **Given** a progression containing a minor ii-V-I ("Dø7 G7 Cm7" in C Minor), **When** analyzed, **Then** the system reports the location of the pattern.
3. **Given** a progression without these patterns, **When** analyzed, **Then** no pattern is reported.

---

### User Story 3 - Handling Non-Diatonic Chords (Priority: P3)

As a musician exploring complex harmony, I want the system to identify chords that do not belong to the explicit key, so I know they are borrowed or chromatic without getting an incorrect analysis.

**Why this priority**: Essential for robustness when dealing with real-world music, which often contains non-diatonic chords. Prevents inaccurate functional analysis.

**Independent Test**: Can be tested by providing a progression with a non-diatonic chord and verifying it's labeled appropriately.

**Acceptance Scenarios**:

1. **Given** a progression with a chord outside the key (e.g., "Abmaj7" in C Major), **When** analyzed, **Then** the system reports the chord as non-diatonic (chromatic/borrowed) without further functional analysis.

## Edge Cases

- What happens when an empty progression is analyzed? The system rejects it and returns a clear error message.
- How does the system handle chords that cannot be parsed? It rejects the progression with a clear error message before attempting analysis.
- How does the system handle chords that do not belong to the provided key? It identifies them as non-diatonic (chromatic/borrowed) instead of trying to map them to an incorrect functional roman numeral.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The system MUST accept an ordered list of pre-instantiated `Chord` objects (a progression) and an explicit tonal center (major or minor key).
- **FR-002**: The system MUST return the harmonic function of each chord as a Roman numeral relative to the explicit key.
- **FR-003**: The system MUST format Roman numerals to reflect chord quality: uppercase for major/dominant, lowercase for minor, and appropriate symbols for diminished/half-diminished.
- **FR-004**: The system MUST detect and report the locations of all major ii-V-I patterns (ii - V7 - Imaj7), including overlapping instances.
- **FR-005**: The system MUST detect and report the locations of all minor ii-V-I patterns (iiø7 - V7 - i), including overlapping instances.
- **FR-006**: The system MUST identify and report any chord not belonging diatonically to the given key as "non-diatonic".
- **FR-007**: The system MUST reject empty progressions or progressions containing invalid chords with clear error messages, failing fast upon the first invalid chord encountered.
- **FR-008**: The analysis MUST be deterministic for any given pair of (progression, key).
- **FR-009**: The system MUST support all 12 major keys and 12 minor keys.
- **FR-010**: The system MUST NOT attempt automatic key inference, handle ambiguity, multiple tonal centers, secondary dominants, or substitutions.

### Key Entities

- **Progression**: The Aggregate Root representing an ordered sequence of chords. It is the only access point to its chords, ensuring they are not mutated externally.
- **Key**: Represents a specific major or minor tonal center.
- **HarmonicAnalysis**: The result of analyzing a progression against a key, containing Roman numerals, identified patterns, and non-diatonic flags.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% of Roman numerals generated by the system match the output of music21 (`romanNumeralFromChord`) for the same chord and key.
- **SC-002**: 100% of valid major and minor ii-V-I patterns in test cases are successfully detected and located.
- **SC-003**: 100% of non-diatonic chords in test cases are correctly identified as such without crashing or providing incorrect functional labels.
- **SC-004**: Progression aggregate root successfully encapsulates chords, preventing direct external mutation in 100% of architecture tests.

## Assumptions

- The existing chord parsing logic from Feature 1 is fully functional and can be reused to instantiate the chord objects within the progression.
- Users input chords in a format understood by the existing parsing logic.
- "Location" of a pattern can be reported as indices of the chords in the progression.
