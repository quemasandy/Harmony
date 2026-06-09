import { describe, it, expect, beforeEach } from 'vitest';
import { ProgressionAnalyzer } from '../../src/harmonic-analysis/use-cases/ProgressionAnalyzer';
import { ProgressionInputDTO } from '../../src/harmonic-analysis/use-cases/dtos/ProgressionInputDTO';

describe('ProgressionAnalyzer', () => {
  let analyzer: ProgressionAnalyzer;

  beforeEach(() => {
    analyzer = new ProgressionAnalyzer();
  });

  it('should analyze a basic ii-V-I progression correctly', () => {
    const input: ProgressionInputDTO = {
      tonalCenter: 'C',
      chords: [
        { symbol: 'Dm7', chordScale: 'Dorian' },
        { symbol: 'G7', chordScale: 'Mixolydian' },
        { symbol: 'Cmaj7', chordScale: 'Ionian' }
      ]
    };

    const result = analyzer.execute(input);

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.tonalCenter).toBe('C');
      expect(result.data.chords).toHaveLength(3);
      
      const dm7 = result.data.chords[0]!;
      expect(dm7.symbol).toBe('Dm7');
      expect(dm7.harmonicFunction).toBe('ii7');
      expect(dm7.isIIVI).toBe(true);
      expect(dm7.tensions.available).toBe(true);
      if (dm7.tensions.available) {
        expect(dm7.tensions.data.availableTensions).toContain('E');
        expect(dm7.tensions.data.avoidNotes).toHaveLength(0); // Dorian has no avoid notes
      }

      const cmaj7 = result.data.chords[2]!;
      if (cmaj7.tensions.available) {
        expect(cmaj7.tensions.data.avoidNotes).toContain('F'); // F is an avoid note in Ionian (m2 above E)
      }
    }
  });

  it('should return a structural error for unparseable chord symbols', () => {
    const input: ProgressionInputDTO = {
      tonalCenter: 'C',
      chords: [
        { symbol: 'Hmaj7' } // Invalid chord
      ]
    };

    const result = analyzer.execute(input);

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.code).toBe('INVALID_CHORD_SYMBOL');
      expect(result.error.message).toContain('Hmaj7');
      expect(result.error.chordIndex).toBe(0);
    }
  });

  it('should return a structural error for invalid tonal center', () => {
    const input: ProgressionInputDTO = {
      tonalCenter: 'H',
      chords: [
        { symbol: 'Cmaj7' }
      ]
    };

    const result = analyzer.execute(input);

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.code).toBe('INVALID_TONAL_CENTER');
    }
  });

  it('should handle optional capabilities gracefully when unavailable', () => {
    const input: ProgressionInputDTO = {
      tonalCenter: 'C',
      chords: [
        // Valid chord but missing scale
        { symbol: 'Cmaj7' }
      ]
    };

    const result = analyzer.execute(input);

    expect(result.success).toBe(true);
    if (result.success) {
      const cmaj7 = result.data.chords[0]!;
      expect(cmaj7.tensions.available).toBe(false);
      if (!cmaj7.tensions.available) {
        expect(cmaj7.tensions.reason).toBeDefined();
      }
    }
  });
});
