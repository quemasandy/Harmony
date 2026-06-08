# Feature Specification: Chord Scale Tensions Analysis

**Feature Branch**: `003-chord-scale-tensions`

**Created**: 2026-06-08

**Status**: Draft

**Input**: User description: "Construye la Feature 3 del Motor de Análisis Armónico: cálculo de tensiones disponibles y avoid notes de un acorde, a partir de su chord-scale."

## Clarifications

### Session 2026-06-08

- Q: How strict should the system be when a user pairs a chord with a scale that contradicts its core chord tones? → A: Throw an error indicating the chord and scale are incompatible (strict validation).
- Q: How should the 7th be categorized if the input chord is a simple triad? → A: Treat the 7th as an available extension/tension for triads.
- Q: Should the feature support non-standard scale lengths (fewer or more than 7 notes)? → A: Restrict to 7-note scales for the MVP; throw an error if provided otherwise.


## User Scenarios & Testing *(mandatory)*

### User Story 1 - Available Tensions and Avoid Notes Calculation (Priority: P1)

As a musician studying harmony, I want to know which tensions I can add to a chord and which notes I should avoid based on its chord-scale, so that I can build idiomatic voicings and melodic lines.

**Why this priority**: This is the core value proposition of the feature, providing the essential harmonic insight required for voicing construction and improvisation.

**Independent Test**: Can be fully tested by providing a chord and its associated scale, verifying the output matches the expected theoretically correct available tensions and avoid notes using music21 as an oracle.

**Acceptance Scenarios**:

1. **Given** a Cmaj7 chord and the Ionian mode as its chord-scale, **When** calculating tensions, **Then** the system returns 9 (D) and 13 (A) as available tensions, and 11 (F) as an avoid note (due to the b9 interval with the major 3rd E).
2. **Given** a G7 chord and the Mixolydian mode as its chord-scale, **When** calculating tensions, **Then** the system returns 9 (A) and 13 (E) as available tensions, and 11 (C) as an avoid note.
3. **Given** a non-diatonic chord with an assigned chord-scale, **When** calculating tensions, **Then** the system returns the correct tensions and avoid notes without failing due to lack of diatonic function.

---

### Edge Cases

- **Altered Chords**: When requesting tensions for an altered chord (e.g., G7b9) with an altered scale (e.g., Super Locrian), the system calculates normally based on interval rules. The b9 would be a chord tone, and other non-chord tones are evaluated as tensions or avoid notes.
- **Non-Standard Scale Lengths**: The system MUST restrict input to 7-note scales. If a scale with fewer (e.g., pentatonic) or more (e.g., symmetrical) than 7 notes is provided, the system MUST throw an error.
- **Incompatible Chord and Scale**: If the provided chord and chord-scale are incompatible (e.g., Cmaj7 chord with a scale that has a minor 3rd), the system MUST throw an error (strict validation).

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST calculate available tensions for a given chord and its assigned chord-scale. If the input chord is a triad, the 7th degree from the scale MUST be treated as an available tension.
- **FR-002**: System MUST identify avoid notes, strictly defined as any scale degree that is a minor second (one semitone) above any chord tone.
- **FR-003**: System MUST output tension notes using their musically correct spelling (e.g., F for 11 of Cmaj7, Ab for b9 of G7).
- **FR-004**: System MUST NOT attempt to deduce the chord-scale automatically beyond a default mapping; the calculation assumes the chord-scale is provided as input.
- **FR-005**: System MUST support the calculation for both diatonic and non-diatonic chords, provided they are paired with a valid chord-scale.

### Key Entities *(include if feature involves data)*

- **ChordScaleContext** (or similar domain object): Represents the pairing of a chord and a scale from which tensions and avoid notes are derived.
- **TensionResult**: The output structure that categorizes non-chord tones from the scale into available tensions and avoid notes.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% of generated available tensions and avoid notes match the expected theoretical results, verified against the music21 oracle.
- **SC-002**: The calculation is purely deterministic given a chord and a chord-scale pair.
- **SC-003**: 0% regression in the existing domain entities (Note, Interval, Chord, Scale, Key, Progression).

## Assumptions

- The existing domain models (Note, Interval, Chord, Scale, Key, Progression) are fully stable and require no architectural changes to support this feature.
- The input chord-scales provided will generally be compatible with the chords they are paired with.
- The definition of an avoid note strictly follows the "minor second above a chord tone" rule.
- Advanced features like reharmonization, voicing generation, and progression analysis for improvisation are explicitly out of scope.
