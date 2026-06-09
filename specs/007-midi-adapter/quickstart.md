# Quickstart: F7 MIDI Adapter

Since this adapter operates within the browser's Web MIDI API context, it is tested primarily via simulated event streams.

## Test Scenarios

1. **Simulated Chord**: Send three `note-on` events (e.g., 60, 64, 67 for C Major) with timestamps within 10ms of each other. Verify that the `MidiStreamSegmenter` groups them into a single chord.
2. **Spelling Translation**: Verify that pitch class 1 (C#/Db) translates strictly to `C#` when using the `StrictSharpSpellingPolicy`.
3. **Progression Dispatch**: Send a C Major chord, wait for the silence threshold, then send an F Major chord, wait for the silence threshold. Verify that a `ProgressionInputDTO` is constructed with both chords and passed to `AnalyzeProgressionInputPort`.
