import { describe, it, expect } from 'vitest';
import { Key } from '../../../src/harmonic-analysis/entities/Key';
import { Note } from '../../../src/harmonic-analysis/entities/Note';
import { InvalidKeyError } from '../../../src/harmonic-analysis/entities/errors';

describe('Key', () => {
  it('creates a major key successfully', () => {
    const key = new Key(new Note('C'), 'major');
    expect(key.tonic.toString()).toBe('C');
    expect(key.mode).toBe('major');
  });

  it('creates a minor key successfully', () => {
    const key = new Key(new Note('A'), 'minor');
    expect(key.tonic.toString()).toBe('A');
    expect(key.mode).toBe('minor');
  });

  it('throws on invalid mode', () => {
    expect(() => new Key(new Note('C'), 'dorian' as any)).toThrow(InvalidKeyError);
  });

  it('is immutable', () => {
    const key = new Key(new Note('G'), 'major');
    expect(Object.isFrozen(key)).toBe(true);
    expect(() => {
      (key as any).mode = 'minor';
    }).toThrow();
  });

  it('compares equality', () => {
    const k1 = new Key(new Note('C', '#'), 'minor');
    const k2 = new Key(new Note('C', '#'), 'minor');
    const k3 = new Key(new Note('D', 'b'), 'minor');
    const k4 = new Key(new Note('C', '#'), 'major');

    expect(k1.equals(k2)).toBe(true);
    expect(k1.equals(k3)).toBe(false); // C# and Db are enharmonically equivalent but not strictly equal keys
    expect(k1.equals(k4)).toBe(false);
  });
});
