import { describe, it, expect } from 'vitest';
import { Key } from '../../../src/harmonic-analysis/entities/Key';
import { Note } from '../../../src/harmonic-analysis/entities/Note';

describe('Key.getScaleNotes', () => {
  it('returns C major scale', () => {
    const key = new Key(new Note('C'), 'major');
    const scale = key.getScaleNotes().map(n => n.toString());
    expect(scale).toEqual(['C', 'D', 'E', 'F', 'G', 'A', 'B']);
  });

  it('returns A minor scale (harmonic minor)', () => {
    const key = new Key(new Note('A'), 'minor');
    const scale = key.getScaleNotes().map(n => n.toString());
    expect(scale).toEqual(['A', 'B', 'C', 'D', 'E', 'F', 'G#']);
  });

  it('returns F major scale', () => {
    const key = new Key(new Note('F'), 'major');
    const scale = key.getScaleNotes().map(n => n.toString());
    expect(scale).toEqual(['F', 'G', 'A', 'Bb', 'C', 'D', 'E']);
  });

  it('returns C minor scale (harmonic minor)', () => {
    const key = new Key(new Note('C'), 'minor');
    const scale = key.getScaleNotes().map(n => n.toString());
    expect(scale).toEqual(['C', 'D', 'Eb', 'F', 'G', 'Ab', 'B']);
  });
});
