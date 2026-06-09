# API Contract: Tritone Substitution

**Branch**: `004-chord-substitutions` | **Feature**: Chord Substitutions — Tritone Substitution

## Public API

The library exposes a pure function to compute tritone substitutions.

```typescript
import { HarmonicAnalysis } from './Progression';

/**
 * Attempts a tritone substitution for the chord at the given index
 * within an already-computed harmonic analysis.
 *
 * @param analysis The HarmonicAnalysis result from Progression.analyze().
 * @param chordIndex The index of the chord to attempt substitution on.
 * @returns A SubstitutionResult: either { applicable: true, substitution }
 *          or { applicable: false, reason }.
 * @throws {InvalidSubstitutionError} If chordIndex is out of range.
 */
function tritoneSubstitution(
  analysis: HarmonicAnalysis,
  chordIndex: number
): SubstitutionResult;
```

## Return Types

```typescript
type SubstitutionResult =
  | { readonly applicable: true; readonly substitution: Substitution }
  | { readonly applicable: false; readonly reason: string };
```

## Exported Value Objects

- `Substitution` — carries `originalChord`, `substituteChord`, `explanation`
- `SubstitutionExplanation` — carries `sharedTritone`, `resolutionTarget`
- `SharedTritoneNotePair` — carries `originalNote`, `substituteNote`, `isEnharmonicEquivalent`, `isLiterallyIdentical`

## Error Handling

| Scenario | Behavior |
|----------|----------|
| `chordIndex` < 0 or ≥ `analysis.chords.length` | Throws `InvalidSubstitutionError` |
| Chord is not dominant 7th / not V7 / doesn't resolve | Returns `{ applicable: false, reason: "..." }` |
| Chord is a resolving V7→I/i | Returns `{ applicable: true, substitution: Substitution }` |
