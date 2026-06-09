import { Chord } from './Chord';
import { Key } from './Key';
import { RomanNumeral } from './RomanNumeral';
import { Note } from './Note';
import { InvalidProgressionError } from './errors';
import { ChordQualityName } from './ChordQuality';

export type ChordAnalysisResult = 
  | { diatonic: true, romanNumeral: RomanNumeral }
  | { diatonic: false };

export interface HarmonicAnalysis {
  readonly key: Key;
  readonly chords: readonly Chord[];
  readonly chordAnalysis: readonly ChordAnalysisResult[];
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
    const chordAnalysis = this.chords.map(chord => this.analyzeChord(chord, scaleNotes));
    
    const iiVIMajorPatterns: { startIndex: number }[] = [];
    const iiVIMinorPatterns: { startIndex: number }[] = [];

    // Sliding window of size 3
    for (let i = 0; i <= chordAnalysis.length - 3; i++) {
      const a1 = chordAnalysis[i]!;
      const a2 = chordAnalysis[i+1]!;
      const a3 = chordAnalysis[i+2]!;

      if (a1.diatonic && a2.diatonic && a3.diatonic) {
        const rn1 = a1.romanNumeral;
        const rn2 = a2.romanNumeral;
        const rn3 = a3.romanNumeral;

        if ((rn1.symbol === 'ii7' || rn1.symbol === 'ii') && rn2.symbol === 'V7' && (rn3.symbol === 'Imaj7' || rn3.symbol === 'I')) {
          iiVIMajorPatterns.push({ startIndex: i });
        }

        if ((rn1.symbol === 'iiø7' || rn1.symbol === 'ii°') && rn2.symbol === 'V7' && (rn3.symbol === 'i' || rn3.symbol === 'i7')) {
          iiVIMinorPatterns.push({ startIndex: i });
        }
      }
    }

    return Object.freeze({
      key: this.key,
      chords: this.chords,
      chordAnalysis: Object.freeze(chordAnalysis),
      iiVIMajorPatterns: Object.freeze(iiVIMajorPatterns),
      iiVIMinorPatterns: Object.freeze(iiVIMinorPatterns)
    });
  }

  private analyzeChord(chord: Chord, scaleNotes: Note[]): ChordAnalysisResult {
    const isDiatonic = chord.notes.every(cn => scaleNotes.some(sn => sn.equals(cn)));
    
    if (!isDiatonic) {
      return { diatonic: false };
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
    return { diatonic: true, romanNumeral: new RomanNumeral(symbol, degree, true) };
  }
}
