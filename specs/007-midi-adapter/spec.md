# Feature Specification: F7 MIDI Adapter

**Feature Branch**: `007-midi-adapter`

**Created**: 2026-06-09

**Status**: Draft

**Input**: User description: "F7 — MIDI adapter via Web MIDI API. The OUTERMOST ring (Frameworks & Drivers). The LAST feature on the roadmap, and the second input adapter alongside F6's web adapter. Principle: pure I/O translation, no logic. MIDI events -> spelled notes/chords -> ProgressionInputDTO -> F6's AnalyzeProgressionInputPort."

## Clarifications

### Session 2026-06-09

- Q: Which spelling policy should the adapter implement for this feature? → A: Strictly default to sharp spellings for all accidentals.
- Q: Is 50ms the firm default window, or should we use another value? → A: 50ms as the default configurable window.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Translate MIDI Input to Analysis (Priority: P1)

As a musician using a MIDI keyboard, I want the system to read the chords I play in real-time, translate them into proper musical notes, and feed them into the harmonic analysis engine, so I can see the structural analysis of my progression.

**Why this priority**: This is the core functionality of the adapter, taking live I/O and connecting it to the existing domain logic without changing that logic.

**Independent Test**: Can be tested by simulating MIDI note-on/note-off event streams using a test double without a real physical device, ensuring the event stream is segmented properly into a `ProgressionInputDTO` and sent through the port.

**Acceptance Scenarios**:

1. **Given** an active simulated MIDI connection, **When** a stream of notes is triggered simultaneously (forming a chord), **Then** the adapter segments the notes into a single chord, translates their pitch classes to spelled notes using the configured spelling policy, and invokes the `AnalyzeProgressionInputPort`.
2. **Given** a stream of sequential chords separated by the configured silence threshold, **When** the threshold is exceeded, **Then** the adapter groups the chords into a complete progression and submits it for analysis.

### Edge Cases

- What happens when a user holds a chord for an extended period, exceeding normal silence thresholds?
- How does the system handle rapid, arpeggiated input that is intended to be a single chord but arrives slightly staggered?
- What happens if the Web MIDI API is not supported by the browser or lacks permissions?

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST connect to MIDI devices using the Web MIDI API.
- **FR-002**: System MUST segment streams of MIDI note-on/note-off events into discrete chords based on timing/simultaneity thresholds.
- **FR-003**: System MUST group successive chords into a progression based on a configurable silence threshold.
- **FR-004**: System MUST convert MIDI note numbers (pitch class + octave) into fully spelled musical Notes.
- **FR-005**: System MUST strictly default to sharp spelling for MIDI translation of all accidental pitch classes.
- **FR-006**: System MUST construct a `ProgressionInputDTO` from the translated notes and invoke the existing `AnalyzeProgressionInputPort`.
- **FR-007**: System MUST NOT include any domain logic, new analytical capability, or direct music theory parsing in the adapter.
- **FR-008**: System MUST isolate all Web MIDI API access behind a single composition point that can be mocked for automated tests.

### Key Entities *(include if feature involves data)*

- **MIDI Event**: Raw note-on/note-off signals from the hardware (note number, velocity, timestamp).
- **Spelling Policy**: Strategy/heuristic for translating a pitch class to an enharmonic spelling.
- **Stream Segmenter**: Logic that accumulates MIDI events and decides when a chord or progression is complete based on timing.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Adapter achieves 100% test coverage using simulated event sequences without requiring a physical MIDI device or browser environment.
- **SC-002**: Architecture tests verify 0 dependencies from inner layers pointing to `frameworks/midi`.
- **SC-003**: Adapter successfully invokes the existing `AnalyzeProgressionInputPort` with a correctly assembled `ProgressionInputDTO` without requiring modifications to the port interface itself.
- **SC-004**: System correctly groups staggered note events arriving within a 50ms window into a single chord structure.

## Assumptions

- Web MIDI API is available and permissions are granted by the user.
- Simultaneous notes meant to form a chord arrive within a predictably short time window.
- The spelling policy strictly uses sharps for all accidentals.
- No real-time playback or UI keyboard visualization is required for this specific adapter feature.
