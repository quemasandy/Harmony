import { describe, it, expect } from 'vitest';
import { CHORD_INTERVAL_TEMPLATES } from '../../../src/harmonic-analysis/entities/ChordQuality';

describe('ChordQuality', () => {
  it('T031: has exactly 9 valid values', () => {
    expect(Object.keys(CHORD_INTERVAL_TEMPLATES)).toHaveLength(9);
  });

  it('T032: template lookup returns correct intervals', () => {
    expect(CHORD_INTERVAL_TEMPLATES['major']).toEqual(['P1', 'M3', 'P5']);
    expect(CHORD_INTERVAL_TEMPLATES['diminished-seventh']).toEqual(['P1', 'm3', 'd5', 'd7']);
  });
});
