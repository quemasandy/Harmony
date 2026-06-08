import { describe, it, expect } from 'vitest';
import { PitchClass } from '../../../src/harmonic-analysis/entities/PitchClass';
import { InvalidNoteError } from '../../../src/harmonic-analysis/entities/errors';

describe('PitchClass', () => {
  it('T014: creates PitchClass with valid values (0-11)', () => {
    for (let i = 0; i <= 11; i++) {
      const pc = new PitchClass(i);
      expect(pc.value).toBe(i);
    }
  });

  it('T015: rejects invalid values', () => {
    expect(() => new PitchClass(-1)).toThrow(InvalidNoteError);
    expect(() => new PitchClass(12)).toThrow(InvalidNoteError);
    expect(() => new PitchClass(1.5)).toThrow(InvalidNoteError);
  });

  it('T016: immutability and equality', () => {
    const pc1 = new PitchClass(5);
    const pc2 = new PitchClass(5);
    const pc3 = new PitchClass(6);
    
    expect(Object.isFrozen(pc1)).toBe(true);
    expect(pc1.equals(pc2)).toBe(true);
    expect(pc1.equals(pc3)).toBe(false);
  });
});
