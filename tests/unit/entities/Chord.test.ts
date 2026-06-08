import { describe, it, expect } from 'vitest';
import { Chord } from '../../../src/harmonic-analysis/entities/Chord';
import { Note } from '../../../src/harmonic-analysis/entities/Note';

describe('Chord', () => {
  it('T034: C major', () => {
    const chord = new Chord(new Note('C'), 'major');
    expect(chord.notes.map(n => n.toString())).toEqual(['C', 'E', 'G']);
    expect(chord.intervals.map(i => i.symbol)).toEqual(['P1', 'M3', 'P5']);
  });

  it('T035: D minor', () => {
    const chord = new Chord(new Note('D'), 'minor');
    expect(chord.notes.map(n => n.toString())).toEqual(['D', 'F', 'A']);
  });

  it('T036: B diminished', () => {
    const chord = new Chord(new Note('B'), 'diminished');
    expect(chord.notes.map(n => n.toString())).toEqual(['B', 'D', 'F']);
  });

  it('T037: C augmented', () => {
    const chord = new Chord(new Note('C'), 'augmented');
    expect(chord.notes.map(n => n.toString())).toEqual(['C', 'E', 'G#']);
  });

  it('T038: C major-seventh', () => {
    const chord = new Chord(new Note('C'), 'major-seventh');
    expect(chord.notes.map(n => n.toString())).toEqual(['C', 'E', 'G', 'B']);
  });

  it('T039: G dominant-seventh', () => {
    const chord = new Chord(new Note('G'), 'dominant-seventh');
    expect(chord.notes.map(n => n.toString())).toEqual(['G', 'B', 'D', 'F']);
  });

  it('T040: D minor-seventh', () => {
    const chord = new Chord(new Note('D'), 'minor-seventh');
    expect(chord.notes.map(n => n.toString())).toEqual(['D', 'F', 'A', 'C']);
  });

  it('T041: F# half-diminished-seventh', () => {
    const chord = new Chord(new Note('F', '#'), 'half-diminished-seventh');
    expect(chord.notes.map(n => n.toString())).toEqual(['F#', 'A', 'C', 'E']);
  });

  it('T042: B diminished-seventh', () => {
    const chord = new Chord(new Note('B'), 'diminished-seventh');
    expect(chord.notes.map(n => n.toString())).toEqual(['B', 'D', 'F', 'Ab']);
  });

  it('T043: flatted roots', () => {
    const eb = new Chord(new Note('E', 'b'), 'minor-seventh');
    expect(eb.notes.map(n => n.toString())).toEqual(['Eb', 'Gb', 'Bb', 'Db']);
    
    const ab = new Chord(new Note('A', 'b'), 'major-seventh');
    expect(ab.notes.map(n => n.toString())).toEqual(['Ab', 'C', 'Eb', 'G']);
  });

  it('T044: immutability', () => {
    const chord = new Chord(new Note('C'), 'major');
    expect(Object.isFrozen(chord)).toBe(true);
    expect(Object.isFrozen(chord.notes)).toBe(true);
    expect(Object.isFrozen(chord.intervals)).toBe(true);
  });

  it('T045: equality', () => {
    const c1 = new Chord(new Note('C'), 'major');
    const c2 = new Chord(new Note('C'), 'major');
    expect(c1.equals(c2)).toBe(true);
  });
});
