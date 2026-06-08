# API Contract: Tensions Calculator

**Branch**: `003-chord-scale-tensions` | **Feature**: Chord Scale Tensions Analysis

## Public API

The library will expose a pure function or a static method to compute tensions.

```typescript
/**
 * Calculates available tensions and avoid notes for a given chord and scale.
 * 
 * @param chord The chord to analyze.
 * @param scale The chord-scale to derive tensions from.
 * @returns A ChordScaleTensions object containing the analysis.
 * @throws {InvalidScaleLengthError} If the scale does not have exactly 7 notes.
 * @throws {IncompatibleChordScaleError} If the chord and scale contradict each other.
 */
function calculateTensions(chord: Chord, scale: Scale): ChordScaleTensions;
```
