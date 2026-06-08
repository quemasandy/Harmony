# Quickstart: Chord Scale Tensions Analysis

**Branch**: `003-chord-scale-tensions` | **Feature**: Chord Scale Tensions Analysis

This guide shows how to calculate the available tensions and avoid notes for a given chord/scale pair using the new Tensions API.

## Example Usage

```typescript
import { Chord } from '../../src/harmonic-analysis/entities/Chord';
import { Scale } from '../../src/harmonic-analysis/entities/Scale';
import { Note } from '../../src/harmonic-analysis/entities/Note';
import { calculateTensions } from '../../src/harmonic-analysis/entities/Tensions';

// 1. Define a Cmaj7 chord
const cMaj7 = new Chord(new Note('C'), 'major-seventh');

// 2. Define a C Ionian scale
const cIonian = Scale.fromRootAndMode(new Note('C'), 'Ionian');

// 3. Calculate tensions
const tensionsResult = calculateTensions(cMaj7, cIonian);

// 4. Inspect the results
console.log('Available Tensions:');
tensionsResult.availableTensions.forEach(t => {
    console.log(`- ${t.degree} (${t.note.letter})`);
});
// Expected:
// - 9 (D)
// - 13 (A)

console.log('Avoid Notes:');
tensionsResult.avoidNotes.forEach(a => {
    console.log(`- ${a.degree} (${a.note.letter}) clashes with ${a.clashesWith.letter}`);
});
// Expected:
// - 11 (F) clashes with E
```
