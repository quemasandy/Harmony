# Quickstart: Chord Substitutions — Tritone Substitution

**Branch**: `004-chord-substitutions` | **Feature**: Chord Substitutions — Tritone Substitution

This guide shows how to compute a tritone substitution for a chord within a harmonic analysis.

## Example Usage

```typescript
import { Chord } from '../../src/harmonic-analysis/entities/Chord';
import { Key } from '../../src/harmonic-analysis/entities/Key';
import { Note } from '../../src/harmonic-analysis/entities/Note';
import { Progression } from '../../src/harmonic-analysis/entities/Progression';
import { tritoneSubstitution } from '../../src/harmonic-analysis/entities/TritoneSubstitution';

// 1. Build a ii-V-I progression in C Major
const dm7 = new Chord(new Note('D'), 'minor-seventh');
const g7  = new Chord(new Note('G'), 'dominant-seventh');
const cmaj7 = new Chord(new Note('C'), 'major-seventh');
const cMajor = new Key(new Note('C'), 'major');

// 2. Analyze the progression (F2)
const progression = new Progression([dm7, g7, cmaj7], cMajor);
const analysis = progression.analyze();

// 3. Attempt tritone substitution on the V7 (index 1)
const result = tritoneSubstitution(analysis, 1);

if (result.applicable) {
  const sub = result.substitution;
  console.log(`Substitute: ${sub.substituteChord.root}7`);
  // → "Substitute: Db7"

  console.log(`Resolution target: ${sub.explanation.resolutionTarget}`);
  // → "Resolution target: C"

  sub.explanation.sharedTritone.forEach(pair => {
    const relationship = pair.isLiterallyIdentical
      ? 'identical'
      : 'enharmonic equivalent';
    console.log(
      `${pair.originalNote} ↔ ${pair.substituteNote} (${relationship})`
    );
  });
  // → "B ↔ Cb (enharmonic equivalent)"
  // → "F ↔ F (identical)"
} else {
  console.log(`Not applicable: ${result.reason}`);
}

// 4. Attempt on a non-dominant chord (index 0 = Dm7)
const result2 = tritoneSubstitution(analysis, 0);
console.log(result2.applicable); // → false
console.log(result2.reason);     // → "Chord is not a resolving dominant (not V7)"
```
