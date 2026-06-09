# Research: Web MIDI API Integration

## Decision: Web MIDI API Wrapper
**Decision**: Isolate the `navigator.requestMIDIAccess` inside a single Humble Object `WebMidiProvider` that returns a stream/observable of MIDI events.
**Rationale**: Keeps the core adapter logic (stream segmentation and spelling) purely synchronous and testable with mock events, adhering to strict TDD without needing a real browser environment.
**Alternatives considered**: Passing `MIDIAccess` directly to the adapter. Rejected because it couples the adapter to browser globals and makes testing harder.

## Decision: Spelling Policy
**Decision**: Implement a `StrictSharpSpellingPolicy` that maps MIDI pitch classes (0-11) directly to their sharp equivalents (C, C#, D, D#, E, F, F#, G, G#, A, A#, B).
**Rationale**: Meets the explicit requirement of defaulting strictly to sharp spellings for all accidental pitch classes.
**Alternatives considered**: Context-aware spelling based on key. Rejected for MVP as spec dictates strict sharp default.

## Decision: Stream Segmentation
**Decision**: Implement a stateful accumulator `MidiStreamSegmenter` that buffers `note-on` events. When a new event arrives, if it's within 50ms of the first event in the buffer, it's added to the current chord. If silence exceeds the silence threshold, the chord buffer is flushed as a completed progression.
**Rationale**: Meets the timing constraints explicitly requested in the spec (50ms chord window).
