export type ChordQualityName = 
  | 'major' | 'minor' | 'diminished' | 'augmented'
  | 'major-seventh' | 'dominant-seventh' | 'minor-seventh'
  | 'half-diminished-seventh' | 'diminished-seventh';

export const CHORD_INTERVAL_TEMPLATES: Record<ChordQualityName, string[]> = {
  'major': ['P1', 'M3', 'P5'],
  'minor': ['P1', 'm3', 'P5'],
  'diminished': ['P1', 'm3', 'd5'],
  'augmented': ['P1', 'M3', 'A5'],
  'major-seventh': ['P1', 'M3', 'P5', 'M7'],
  'dominant-seventh': ['P1', 'M3', 'P5', 'm7'],
  'minor-seventh': ['P1', 'm3', 'P5', 'm7'],
  'half-diminished-seventh': ['P1', 'm3', 'd5', 'm7'],
  'diminished-seventh': ['P1', 'm3', 'd5', 'd7']
};
