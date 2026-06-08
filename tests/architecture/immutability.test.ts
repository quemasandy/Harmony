import { describe, it, expect } from 'vitest';
import { Note, PitchClass, Interval, Chord } from '../../src/harmonic-analysis/entities';

describe('Architecture: Immutability (Principio I)', () => {
  it('T087: entities are deeply frozen', () => {
    const note = new Note('C');
    expect(Object.isFrozen(note)).toBe(true);
    
    const pc = new PitchClass(0);
    expect(Object.isFrozen(pc)).toBe(true);

    const interval = new Interval('M3');
    expect(Object.isFrozen(interval)).toBe(true);

    const chord = new Chord(note, 'major');
    expect(Object.isFrozen(chord)).toBe(true);
    expect(Object.isFrozen(chord.notes)).toBe(true);
    expect(Object.isFrozen(chord.intervals)).toBe(true);
  });
});
