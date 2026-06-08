import { describe, it, expect } from 'vitest';
import { Note } from '../../../src/harmonic-analysis/entities/Note';
import { InvalidNoteError } from '../../../src/harmonic-analysis/entities/errors';
import { PitchClass } from '../../../src/harmonic-analysis/entities/PitchClass';

describe('Note', () => {
  it('T007: creates Note with valid inputs', () => {
    const letters = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
    const accidentals = ['', '#', 'b', '##', 'bb'];
    for (const l of letters) {
      for (const a of accidentals) {
        const note = new Note(l, a);
        expect(note.letter).toBe(l);
        expect(note.accidental).toBe(a);
      }
    }
  });

  it('T008: rejects invalid inputs throwing InvalidNoteError', () => {
    expect(() => new Note('H', '')).toThrow(InvalidNoteError);
    expect(() => new Note('C', 'x')).toThrow(InvalidNoteError);
    expect(() => new Note('c', '')).toThrow(InvalidNoteError);
  });

  it('T009: is immutable and Object.freeze is applied', () => {
    const note = new Note('C');
    expect(Object.isFrozen(note)).toBe(true);
    expect(() => {
      // @ts-ignore
      note.letter = 'D';
    }).toThrow();
  });

  it('T010: equality by value', () => {
    const n1 = new Note('C', '#');
    const n2 = new Note('C', '#');
    const n3 = new Note('D', 'b');
    expect(n1.equals(n2)).toBe(true);
    expect(n1.equals(n3)).toBe(false);
  });

  it('T011: toString() returns correct display string', () => {
    expect(new Note('C').toString()).toBe('C');
    expect(new Note('F', '#').toString()).toBe('F#');
    expect(new Note('B', 'b').toString()).toBe('Bb');
  });

  it('T012: semitonesFromC() returns correct semitone distance', () => {
    expect(new Note('C').semitonesFromC()).toBe(0);
    expect(new Note('C', '#').semitonesFromC()).toBe(1);
    expect(new Note('D', 'b').semitonesFromC()).toBe(1);
    expect(new Note('B').semitonesFromC()).toBe(11);
    expect(new Note('C', 'b').semitonesFromC()).toBe(11);
    expect(new Note('B', '#').semitonesFromC()).toBe(0);
    // Double accidentals
    expect(new Note('C', '##').semitonesFromC()).toBe(2);
    expect(new Note('B', 'bb').semitonesFromC()).toBe(9);
    expect(new Note('F', '##').semitonesFromC()).toBe(7);
  });

  it('T017: pitchClass() derives correct PitchClass', () => {
    const note = new Note('C');
    expect(note.pitchClass().equals(new PitchClass(0))).toBe(true);
    const cb = new Note('C', 'b');
    expect(cb.pitchClass().equals(new PitchClass(11))).toBe(true);
  });
});
