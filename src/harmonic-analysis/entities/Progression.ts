import { Chord } from './Chord';
import { Key } from './Key';
import { RomanNumeral } from './RomanNumeral';
import { Note } from './Note';
import { InvalidProgressionError } from './errors';
import { ChordQualityName } from './ChordQuality';

export interface HarmonicAnalysis {
  readonly chords: readonly Chord[];
  readonly romanNumerals: readonly RomanNumeral[];
  readonly iiVIMajorPatterns: readonly { startIndex: number }[];
  readonly iiVIMinorPatterns: readonly { startIndex: number }[];
}

export class Progression {
  readonly chords: readonly Chord[];
  readonly key: Key;

  constructor(chords: Chord[], key: Key) {
    if (chords.length === 0) {
      throw new InvalidProgressionError('Progression cannot be empty');
    }
    this.chords = Object.freeze([...chords]);
    this.key = key;
    Object.freeze(this);
  }

  analyze(): HarmonicAnalysis {
    const scaleNotes = this.key.getScaleNotes();
    const romanNumerals = this.chords.map(chord => this.analyzeChord(chord, scaleNotes));
    
    const iiVIMajorPatterns: { startIndex: number }[] = [];
    const iiVIMinorPatterns: { startIndex: number }[] = [];

    // Sliding window of size 3
    for (let i = 0; i <= romanNumerals.length - 3; i++) {
      const rn1 = romanNumerals[i]!;
      const rn2 = romanNumerals[i+1]!;
      const rn3 = romanNumerals[i+2]!;

      if ((rn1.symbol === 'ii7' || rn1.symbol === 'ii') && rn2.symbol === 'V7' && (rn3.symbol === 'Imaj7' || rn3.symbol === 'I')) {
        iiVIMajorPatterns.push({ startIndex: i });
      }

      if ((rn1.symbol === 'iiø7' || rn1.symbol === 'ii°') && rn2.symbol === 'V7' && (rn3.symbol === 'i' || rn3.symbol === 'i7')) {
        iiVIMinorPatterns.push({ startIndex: i });
      }
    }

    return Object.freeze({
      chords: this.chords,
      romanNumerals: Object.freeze(romanNumerals),
      iiVIMajorPatterns: Object.freeze(iiVIMajorPatterns),
      iiVIMinorPatterns: Object.freeze(iiVIMinorPatterns)
    });
  }

  private analyzeChord(chord: Chord, scaleNotes: Note[]): RomanNumeral {
    const isDiatonic = chord.notes.every(cn => scaleNotes.some(sn => sn.equals(cn)));
    
    if (!isDiatonic) {
      return new RomanNumeral('non-diatonic', 1, false);
    }

    const letters = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
    const tonicIdx = letters.indexOf(this.key.tonic.letter);
    const rootIdx = letters.indexOf(chord.root.letter);
    const degree = ((rootIdx - tonicIdx + 7) % 7) + 1;

    const baseSymbols = ['', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII'];
    let base = baseSymbols[degree]!;

    const UPPERCASE_QUALITIES = ['major', 'dominant-seventh', 'major-seventh', 'augmented'];
    if (!UPPERCASE_QUALITIES.includes(chord.quality)) {
      base = base.toLowerCase();
    }

    const QUALITY_SUFFIX: Record<ChordQualityName, string> = {
      'major': '',
      'minor': '',
      'major-seventh': 'maj7',
      'dominant-seventh': '7',
      'minor-seventh': '7',
      'diminished': '°',
      'diminished-seventh': '°7',
      'half-diminished-seventh': 'ø7',
      'augmented': '+'
    };

    const symbol = `${base}${QUALITY_SUFFIX[chord.quality]}`;
    return new RomanNumeral(symbol, degree, true);
  }
}
