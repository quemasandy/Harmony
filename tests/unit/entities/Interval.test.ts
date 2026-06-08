import { describe, it, expect } from 'vitest';
import { Interval } from '../../../src/harmonic-analysis/entities/Interval';
import { Note } from '../../../src/harmonic-analysis/entities/Note';
import { InvalidIntervalError } from '../../../src/harmonic-analysis/entities/errors';

describe('Interval', () => {
  it('T020: creates valid intervals', () => {
    const valid = ['P1', 'm2', 'M2', 'm3', 'M3', 'P4', 'd5', 'P5', 'A5', 'm6', 'M6', 'm7', 'M7', 'd7'];
    valid.forEach(sym => {
      const i = new Interval(sym);
      expect(i.symbol).toBe(sym);
    });
  });

  it('T021: rejects invalid quality+number combinations', () => {
    expect(() => new Interval('P3')).toThrow(InvalidIntervalError);
    expect(() => new Interval('M5')).toThrow(InvalidIntervalError);
  });

  it('T022: immutability and equality by value', () => {
    const i1 = new Interval('M3');
    const i2 = new Interval('M3');
    expect(i1.equals(i2)).toBe(true);
    expect(Object.isFrozen(i1)).toBe(true);
  });

  it('T023: semitones count', () => {
    expect(new Interval('P1').semitones()).toBe(0);
    expect(new Interval('M3').semitones()).toBe(4);
    expect(new Interval('P5').semitones()).toBe(7);
    expect(new Interval('d5').semitones()).toBe(6);
  });

  it('T024: toString returns human readable string', () => {
    expect(new Interval('P1').toString()).toBe('perfect unison');
    expect(new Interval('m3').toString()).toBe('minor 3rd');
    expect(new Interval('d5').toString()).toBe('diminished 5th');
  });

  it('T025: apply produces correct spelled note for major intervals from C', () => {
    const c = new Note('C');
    expect(new Interval('M3').apply(c).toString()).toBe('E');
    expect(new Interval('P5').apply(c).toString()).toBe('G');
    expect(new Interval('M7').apply(c).toString()).toBe('B');
  });

  it('T026: apply produces correct spelled note for minor/diminished intervals', () => {
    expect(new Interval('m3').apply(new Note('D')).toString()).toBe('F');
    expect(new Interval('d5').apply(new Note('B')).toString()).toBe('F');
    expect(new Interval('d7').apply(new Note('B')).toString()).toBe('Ab');
  });

  it('T027: apply with sharped roots', () => {
    const fSharp = new Note('F', '#');
    expect(new Interval('M3').apply(fSharp).toString()).toBe('A#');
    expect(new Interval('m3').apply(fSharp).toString()).toBe('A');
    expect(new Interval('d5').apply(fSharp).toString()).toBe('C');
  });

  it('T028: apply with flatted roots', () => {
    const eb = new Note('E', 'b');
    expect(new Interval('m3').apply(eb).toString()).toBe('Gb');
    expect(new Interval('P5').apply(eb).toString()).toBe('Bb');
    expect(new Interval('M7').apply(new Note('A', 'b')).toString()).toBe('G');
  });
});
