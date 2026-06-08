import { describe, it, expect } from 'vitest';
import { RomanNumeral } from '../../../src/harmonic-analysis/entities/RomanNumeral';

describe('RomanNumeral', () => {
  it('creates a major roman numeral', () => {
    const rn = new RomanNumeral('Imaj7', 1, true);
    expect(rn.symbol).toBe('Imaj7');
    expect(rn.degree).toBe(1);
    expect(rn.isDiatonic).toBe(true);
  });

  it('validates degree bounds', () => {
    expect(() => new RomanNumeral('X', 8, true)).toThrow();
    expect(() => new RomanNumeral('0', 0, true)).toThrow();
  });

  it('is immutable', () => {
    const rn = new RomanNumeral('ii7', 2, true);
    expect(Object.isFrozen(rn)).toBe(true);
  });

  it('compares equality', () => {
    const rn1 = new RomanNumeral('V7', 5, true);
    const rn2 = new RomanNumeral('V7', 5, true);
    const rn3 = new RomanNumeral('V7', 5, false);

    expect(rn1.equals(rn2)).toBe(true);
    expect(rn1.equals(rn3)).toBe(false);
  });
});
