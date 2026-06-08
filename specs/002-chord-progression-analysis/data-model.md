# Phase 1: Data Model & Contracts

## Entities

### `Key` (Value Object)
- **Fields**: 
  - `readonly tonic: PitchClass`
  - `readonly mode: 'major' | 'minor'`
- **Validation**: Tonic must be valid. Mode must be major or minor.
- **Behavior**: Provides access to its diatonic scale (Harmonic Minor for minor mode).

### `RomanNumeral` (Value Object)
- **Fields**:
  - `readonly symbol: string` (e.g. "Imaj7", "iiø7", "V7", "vi")
  - `readonly degree: number` (1-7)
  - `readonly isDiatonic: boolean`
- **Validation**: Must represent a valid functional degree.

### `HarmonicAnalysis` (Value Object / DTO)
- **Fields**:
  - `readonly chords: readonly Chord[]`
  - `readonly chordAnalysis: readonly ({ diatonic: true, romanNumeral: RomanNumeral } | { diatonic: false })[]`
  - `readonly iiVIMajorPatterns: readonly { startIndex: number }[]`
  - `readonly iiVIMinorPatterns: readonly { startIndex: number }[]`

### `Progression` (Aggregate Root)
- **Fields**:
  - `readonly chords: readonly Chord[]`
  - `readonly key: Key`
- **Behavior**:
  - `constructor(chords: Chord[], key: Key)`
  - `analyze(): HarmonicAnalysis`
  - Detects patterns via internal sliding window.
