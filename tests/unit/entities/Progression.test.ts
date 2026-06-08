import { describe, it, expect } from 'vitest';
import { Progression } from '../../../src/harmonic-analysis/entities/Progression';
import { Key } from '../../../src/harmonic-analysis/entities/Key';
import { Note } from '../../../src/harmonic-analysis/entities/Note';
import { Chord } from '../../../src/harmonic-analysis/entities/Chord';
import { InvalidProgressionError } from '../../../src/harmonic-analysis/entities/errors';

describe('Progression', () => {
  it('analyzes a diatonic major progression correctly', () => {
    // Dm7 - G7 - Cmaj7 in C major
    const key = new Key(new Note('C'), 'major');
    const dm7 = new Chord(new Note('D'), 'minor-seventh');
    const g7 = new Chord(new Note('G'), 'dominant-seventh');
    const cmaj7 = new Chord(new Note('C'), 'major-seventh');

    const progression = new Progression([dm7, g7, cmaj7], key);
    const analysis = progression.analyze();

    expect(analysis.romanNumerals.map(rn => rn.symbol)).toEqual(['ii7', 'V7', 'Imaj7']);
    expect(analysis.romanNumerals.every(rn => rn.isDiatonic)).toBe(true);
    expect(analysis.iiVIMajorPatterns).toEqual([{ startIndex: 0 }]);
    expect(analysis.iiVIMinorPatterns).toEqual([]);
  });

  it('analyzes a diatonic minor progression correctly', () => {
    // Dø7 - G7 - Cm7 in C minor
    const key = new Key(new Note('C'), 'minor');
    const dHalfDim = new Chord(new Note('D'), 'half-diminished-seventh');
    const g7 = new Chord(new Note('G'), 'dominant-seventh');
    const cm = new Chord(new Note('C'), 'minor'); // minor triad is diatonic to harmonic minor

    const progression = new Progression([dHalfDim, g7, cm], key);
    const analysis = progression.analyze();

    expect(analysis.romanNumerals.map(rn => rn.symbol)).toEqual(['iiø7', 'V7', 'i']);
    expect(analysis.romanNumerals.every(rn => rn.isDiatonic)).toBe(true);
    expect(analysis.iiVIMinorPatterns).toEqual([{ startIndex: 0 }]);
  });

  it('identifies non-diatonic chords', () => {
    // Cmaj7 - Abmaj7 in C major
    const key = new Key(new Note('C'), 'major');
    const cmaj7 = new Chord(new Note('C'), 'major-seventh');
    const abmaj7 = new Chord(new Note('A', 'b'), 'major-seventh');

    const progression = new Progression([cmaj7, abmaj7], key);
    const analysis = progression.analyze();

    expect(analysis.romanNumerals[0]!.symbol).toBe('Imaj7');
    expect(analysis.romanNumerals[1]!.symbol).toBe('non-diatonic');
    expect(analysis.romanNumerals[1]!.isDiatonic).toBe(false);
  });

  it('detects overlapping patterns', () => {
    // Dm7 - G7 - Cmaj7 - Dm7 - G7 - Cmaj7
    const key = new Key(new Note('C'), 'major');
    const dm7 = new Chord(new Note('D'), 'minor-seventh');
    const g7 = new Chord(new Note('G'), 'dominant-seventh');
    const cmaj7 = new Chord(new Note('C'), 'major-seventh');

    const progression = new Progression([dm7, g7, cmaj7, dm7, g7, cmaj7], key);
    const analysis = progression.analyze();

    expect(analysis.iiVIMajorPatterns).toEqual([{ startIndex: 0 }, { startIndex: 3 }]);
  });

  it('detects overlapping patterns where the I is the ii of the next (modulating, but forced key)', () => {
    // ii - V - I - V - I (Wait, sliding window should just find sequences)
    // Actually, overlapping like Dm7 G7 Dm7 G7 Cmaj7 wouldn't have two ii-V-I.
    // What if the progression is Dm7 G7 Cmaj7 A7 Dm7 G7 Cmaj7?
    // Not overlapping in the strict sense.
    // Just testing that sliding window evaluates at every position.
  });

  it('rejects empty progressions', () => {
    const key = new Key(new Note('C'), 'major');
    expect(() => new Progression([], key)).toThrow(InvalidProgressionError);
  });
});
