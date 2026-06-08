import { describe, it, expect } from 'vitest';
import { calculateTensions, InvalidScaleLengthError, IncompatibleChordScaleError } from '../../../src/harmonic-analysis/entities/Tensions';
import { Chord } from '../../../src/harmonic-analysis/entities/Chord';
import { Scale } from '../../../src/harmonic-analysis/entities/Scale';
import { Note } from '../../../src/harmonic-analysis/entities/Note';
import { PitchClass } from '../../../src/harmonic-analysis/entities/PitchClass';

describe('Tensions', () => {
  it('should calculate available tensions and avoid notes for Cmaj7 in C Ionian', () => {
    const root = new Note('C');
    const chord = new Chord(root, 'major-seventh');
    const scale = Scale.fromRootAndMode(new Note('C'), 'Ionian');

    const result = calculateTensions(chord, scale);

    // C Ionian: C D E F G A B
    // Chord: C E G B
    // Tensions: D (9), A (13)
    // Avoid: F (11) because it's a minor second above E

    expect(result.availableTensions.map(t => t.degree)).toEqual([9, 13]);
    expect(result.availableTensions.map(t => t.note.letter)).toEqual(['D', 'A']);

    expect(result.avoidNotes.map(a => a.degree)).toEqual([11]);
    expect(result.avoidNotes.map(a => a.note.letter)).toEqual(['F']);
    expect(result.avoidNotes[0]?.clashesWith.letter).toBe('E');
  });

  it('should identify 7th as an available tension for a triad', () => {
    const root = new Note('C');
    const chord = new Chord(root, 'major');
    const scale = Scale.fromRootAndMode(new Note('C'), 'Ionian');

    const result = calculateTensions(chord, scale);

    // C Ionian: C D E F G A B
    // Chord: C E G
    // Tensions: D (9), A (13), B (7)
    // Avoid: F (11) because it's a minor second above E

    expect(result.availableTensions.map(t => t.degree).sort((a, b) => a - b)).toEqual([7, 9, 13]);
    expect(result.avoidNotes.map(a => a.degree)).toEqual([11]);
  });

  it('should throw an error if the scale does not have 7 notes', () => {
    const root = new Note('C');
    const chord = new Chord(root, 'major');
    const scale = new Scale(new Note('C'), 'Pentatonic', [
      new Note('C'), new Note('D'), new Note('E'),
      new Note('G'), new Note('A')
    ]);

    expect(() => calculateTensions(chord, scale)).toThrow(InvalidScaleLengthError);
  });

  it('should throw an error for incompatible chord and scale', () => {
    // C minor chord but C Ionian scale (clash on Eb / E)
    const root = new Note('C');
    const chord = new Chord(root, 'minor');
    const scale = Scale.fromRootAndMode(new Note('C'), 'Ionian');

    expect(() => calculateTensions(chord, scale)).toThrow(IncompatibleChordScaleError);
  });
});
