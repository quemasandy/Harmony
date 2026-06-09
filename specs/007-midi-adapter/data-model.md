# Data Model: F7 MIDI Adapter

Since this is an adapter, it does not define any core domain entities. It uses purely internal data structures to manage the state of the MIDI stream segmentation.

## Entities (Adapter Level)

### MidiEvent
Represents a raw hardware signal.
- `noteNumber`: number (0-127)
- `velocity`: number (0-127)
- `timestamp`: number (DOMHighResTimeStamp)
- `type`: 'note-on' | 'note-off'

### ChordBuffer
Accumulates notes played simultaneously.
- `events`: MidiEvent[]
- `startTime`: number

### ProgressionBuffer
Accumulates sequential chords.
- `chords`: ChordBuffer[]
- `lastActivityTime`: number
