# Data Model: Chord Substitutions — Tritone Substitution

**Branch**: `004-chord-substitutions` | **Feature**: Chord Substitutions — Tritone Substitution

## Domain Entities

### `SharedTritoneNotePair` (Value Object)
Represents one pair of notes from the shared tritone between the original and substitute chords.
- **Fields**:
  - `originalNote: Note` — The note from the original dominant chord (either its 3rd or 7th).
  - `substituteNote: Note` — The corresponding note from the substitute chord (7th or 3rd, respectively).
  - `isEnharmonicEquivalent: boolean` — `true` if the two notes have the same pitch class but different spellings (e.g., B and Cb).
  - `isLiterallyIdentical: boolean` — `true` if `originalNote.equals(substituteNote)` (same letter + accidental).
- **Invariants**:
  - `originalNote.pitchClass().equals(substituteNote.pitchClass())` must be `true` (same pitch class).
  - Exactly one of `isEnharmonicEquivalent` or `isLiterallyIdentical` must be `true`.
  - Both flags are derived, not user-supplied — computed from the notes in the constructor.

### `SubstitutionExplanation` (Value Object)
The structured justification for why a tritone substitution is valid.
- **Fields**:
  - `sharedTritone: readonly [SharedTritoneNotePair, SharedTritoneNotePair]` — The two note pairs forming the shared tritone. First pair: original 3rd ↔ substitute 7th. Second pair: original 7th ↔ substitute 3rd.
  - `resolutionTarget: Note` — The tonal center (tonic) that both the original and substitute chords resolve toward.
- **Invariants**:
  - Exactly 2 note pairs in `sharedTritone`.
  - All notes in `sharedTritone` must satisfy pitch-class equality within each pair.
  - `resolutionTarget` must be a valid `Note`.

### `Substitution` (Value Object)
The complete tritone substitution result when applicable.
- **Fields**:
  - `originalChord: Chord` — The original dominant 7th chord.
  - `substituteChord: Chord` — The substitute dominant 7th chord (rooted a tritone away).
  - `explanation: SubstitutionExplanation` — The structured justification.
- **Invariants**:
  - `originalChord.quality` must be `'dominant-seventh'`.
  - `substituteChord.quality` must be `'dominant-seventh'`.
  - `substituteChord.root.pitchClass().value` must equal `(originalChord.root.pitchClass().value + 6) % 12`.
  - Deeply immutable (`Object.freeze` on construction).

### `SubstitutionResult` (Discriminated Union)
The return type of the tritone substitution function.
```
type SubstitutionResult =
  | { readonly applicable: true; readonly substitution: Substitution }
  | { readonly applicable: false; readonly reason: string }
```
- **Variants**:
  - `applicable: true` — Substitution was valid; carries the `Substitution` value object.
  - `applicable: false` — Substitution was not applicable; carries a human-readable `reason`.
- **Invariants**:
  - Result is deeply frozen.
  - `reason` is never empty when `applicable` is `false`.

## Modified Entities

### `HarmonicAnalysis` (Interface — in `Progression.ts`)
**Change**: Add `readonly key: Key` field.
- **Before**: `{ chords, chordAnalysis, iiVIMajorPatterns, iiVIMinorPatterns }`
- **After**: `{ key, chords, chordAnalysis, iiVIMajorPatterns, iiVIMinorPatterns }`
- **Impact**: Additive, backwards-compatible. Existing consumers unaffected.

## Error States

- **Index out of range**: If the provided chord index is negative or ≥ `analysis.chords.length`, the function throws a domain error (this is an invariant violation by the caller, not a musical "not applicable" case).
- **Non-applicable substitution**: Returned as `{ applicable: false, reason: "..." }` — NOT an error.

## Not-Applicable Reasons (exhaustive)

| Condition | `reason` value |
|-----------|---------------|
| Chord is not diatonic | `"Chord is not diatonic"` |
| Chord is diatonic but not V7 | `"Chord is not a resolving dominant (not V7)"` |
| Chord is V7 but next chord is not I/i | `"Chord does not resolve (V7 not followed by I/i)"` |
