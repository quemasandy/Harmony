# Data Model: Chord Scale Tensions Analysis

**Branch**: `003-chord-scale-tensions` | **Feature**: Chord Scale Tensions Analysis

## Domain Entities

### `Tension` (Value Object)
Represents a single available tension.
- **Fields**:
  - `note: Note` (The actual note object, e.g., D4 or just pitch class D).
  - `degree: number` (The scale degree, typically 7, 9, 11, or 13).
  - `intervalFromRoot: Interval` (The interval from the chord root, e.g., Major 9th).
- **Invariants**:
  - Must not be a chord tone.
  - Must not be a minor second above any chord tone.

### `AvoidNote` (Value Object)
Represents a single avoid note.
- **Fields**:
  - `note: Note`
  - `degree: number`
  - `clashingChordTone: Note` (The chord tone that this note clashes with, i.e., is a minor 2nd above).
- **Invariants**:
  - Must be exactly one semitone (minor second) above at least one chord tone.

### `ChordScaleTensions` (Value Object / Calculation Result)
The aggregate result of the tension analysis.
- **Fields**:
  - `chord: Chord`
  - `scale: Scale`
  - `availableTensions: Tension[]`
  - `avoidNotes: AvoidNote[]`
- **Invariants**:
  - `scale` must have exactly 7 notes.
  - `chord` and `scale` must not be incompatible (all chord tones must be present in the scale, enharmonically or exactly, depending on the strictness of the implementation).
  - The union of `chord.notes`, `availableTensions.map(t => t.note)`, and `avoidNotes.map(a => a.note)` must equal the set of `scale.notes`.

## Error States

- `InvalidScaleLengthError`: Thrown when the provided scale does not have exactly 7 notes.
- `IncompatibleChordScaleError`: Thrown when a chord contains a note that is directly contradicted by the scale (e.g., chord has a Major 3rd, scale has a Minor 3rd).
