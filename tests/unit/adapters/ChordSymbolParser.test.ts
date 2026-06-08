import { describe, it, expect } from 'vitest';
import { parseChordSymbol } from '../../../src/harmonic-analysis/adapters/ChordSymbolParser';
import { InvalidChordSymbolError } from '../../../src/harmonic-analysis/entities';

describe('ChordSymbolParser', () => {

  describe('Phase 5: US1 - Seventh Chords', () => {
    it('T048: Cmaj7', () => {
      const chord = parseChordSymbol('Cmaj7');
      expect(chord.root.letter).toBe('C');
      expect(chord.quality).toBe('major-seventh');
      expect(chord.notes.map(n => n.toString())).toEqual(['C', 'E', 'G', 'B']);
    });

    it('T049: CM7 (synonym)', () => {
      const chord = parseChordSymbol('CM7');
      expect(chord.quality).toBe('major-seventh');
      expect(chord.notes.map(n => n.toString())).toEqual(['C', 'E', 'G', 'B']);
    });

    it('T050: Dm7', () => {
      const chord = parseChordSymbol('Dm7');
      expect(chord.root.letter).toBe('D');
      expect(chord.quality).toBe('minor-seventh');
      expect(chord.notes.map(n => n.toString())).toEqual(['D', 'F', 'A', 'C']);
    });

    it('T051: G7', () => {
      const chord = parseChordSymbol('G7');
      expect(chord.root.letter).toBe('G');
      expect(chord.quality).toBe('dominant-seventh');
      expect(chord.notes.map(n => n.toString())).toEqual(['G', 'B', 'D', 'F']);
    });

    it('T052: F#m7b5', () => {
      const chord = parseChordSymbol('F#m7b5');
      expect(chord.root.toString()).toBe('F#');
      expect(chord.quality).toBe('half-diminished-seventh');
      expect(chord.notes.map(n => n.toString())).toEqual(['F#', 'A', 'C', 'E']);
    });

    it('T053: Bdim7', () => {
      const chord = parseChordSymbol('Bdim7');
      expect(chord.root.letter).toBe('B');
      expect(chord.quality).toBe('diminished-seventh');
      expect(chord.notes.map(n => n.toString())).toEqual(['B', 'D', 'F', 'Ab']);
    });

    it('T054: sharped/flatted roots', () => {
      const ebm7 = parseChordSymbol('Ebm7');
      expect(ebm7.notes.map(n => n.toString())).toEqual(['Eb', 'Gb', 'Bb', 'Db']);
      const abmaj7 = parseChordSymbol('Abmaj7');
      expect(abmaj7.notes.map(n => n.toString())).toEqual(['Ab', 'C', 'Eb', 'G']);
    });

    it('T055: trims whitespace', () => {
      const chord = parseChordSymbol('  Dm7  ');
      expect(chord.root.letter).toBe('D');
      expect(chord.quality).toBe('minor-seventh');
    });
  });

  describe('Phase 6: US2 - Triads', () => {
    it('T057: C', () => {
      const chord = parseChordSymbol('C');
      expect(chord.root.letter).toBe('C');
      expect(chord.quality).toBe('major');
      expect(chord.notes.map(n => n.toString())).toEqual(['C', 'E', 'G']);
    });

    it('T058: Dm', () => {
      const chord = parseChordSymbol('Dm');
      expect(chord.root.letter).toBe('D');
      expect(chord.quality).toBe('minor');
      expect(chord.notes.map(n => n.toString())).toEqual(['D', 'F', 'A']);
    });

    it('T059: Bdim', () => {
      const chord = parseChordSymbol('Bdim');
      expect(chord.root.letter).toBe('B');
      expect(chord.quality).toBe('diminished');
      expect(chord.notes.map(n => n.toString())).toEqual(['B', 'D', 'F']);
    });

    it('T060: Caug', () => {
      const chord = parseChordSymbol('Caug');
      expect(chord.root.letter).toBe('C');
      expect(chord.quality).toBe('augmented');
      expect(chord.notes.map(n => n.toString())).toEqual(['C', 'E', 'G#']);
    });

    it('T061: C+ (synonym)', () => {
      const chord = parseChordSymbol('C+');
      expect(chord.quality).toBe('augmented');
      expect(chord.notes.map(n => n.toString())).toEqual(['C', 'E', 'G#']);
    });

    it('T062: sharped/flatted triad roots', () => {
      expect(parseChordSymbol('F#').root.toString()).toBe('F#');
      expect(parseChordSymbol('Bb').root.toString()).toBe('Bb');
      expect(parseChordSymbol('Ebm').notes.map(n => n.toString())).toEqual(['Eb', 'Gb', 'Bb']);
    });
  });

  describe('Phase 7: US3 - Error Handling', () => {
    it('T064: XYZ throws InvalidChordSymbolError', () => {
      expect(() => parseChordSymbol('XYZ')).toThrow(InvalidChordSymbolError);
    });

    it('T065: empty string throws', () => {
      expect(() => parseChordSymbol('')).toThrow(InvalidChordSymbolError);
      expect(() => parseChordSymbol('   ')).toThrow(InvalidChordSymbolError);
    });

    it('T066: Hm7 throws (H invalid)', () => {
      expect(() => parseChordSymbol('Hm7')).toThrow(InvalidChordSymbolError);
    });

    it('T067/T068: cmaj7 and dM7 throw (lowercase root)', () => {
      expect(() => parseChordSymbol('cmaj7')).toThrow(InvalidChordSymbolError);
      expect(() => parseChordSymbol('dM7')).toThrow(InvalidChordSymbolError);
    });

    it('T069/T070: non-canonical suffix Cmin and C- throw', () => {
      expect(() => parseChordSymbol('Cmin')).toThrow(InvalidChordSymbolError);
      expect(() => parseChordSymbol('C-')).toThrow(InvalidChordSymbolError);
    });

    it('T071/T072/T073: unsupported extensions throw with informative message', () => {
      const symbols = ['C9', 'Dm11', 'G13', 'Csus4', 'Cadd9'];
      symbols.forEach(sym => {
        expect(() => parseChordSymbol(sym)).toThrowError(/Unsupported chord extension/);
      });
    });

    it('T074: Fbb throws (double flat not supported)', () => {
      expect(() => parseChordSymbol('Fbb')).toThrow(InvalidChordSymbolError);
    });

    it('T075/T076: non-canonical symbols C° and Cø7 throw', () => {
      expect(() => parseChordSymbol('C°')).toThrow(InvalidChordSymbolError);
      expect(() => parseChordSymbol('Cø7')).toThrow(InvalidChordSymbolError);
    });

    it('T077: error messages are descriptive', () => {
      let error: any;
      try {
        parseChordSymbol('X7');
      } catch (e) {
        error = e;
      }
      expect(error.message).toContain('X7');
      expect(error.message).toContain('Root must be A-G');
    });
  });

});
