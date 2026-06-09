import { Note, Letter, Accidental } from './Note';
import { InvalidIntervalError } from './errors';

export type IntervalQuality = 'perfect' | 'major' | 'minor' | 'diminished' | 'augmented';
export type IntervalNumber = 1 | 2 | 3 | 4 | 5 | 6 | 7;

const VALID_INTERVALS = [
  'P1', 'm2', 'M2', 'm3', 'M3', 'P4', 'A4', 'd5', 'P5', 'A5', 'm6', 'M6', 'm7', 'M7', 'd7'
] as const;

export class Interval {
  readonly quality: IntervalQuality;
  readonly number: IntervalNumber;
  readonly symbol: string;

  constructor(symbol: string) {
    if (!VALID_INTERVALS.includes(symbol as any)) {
      throw new InvalidIntervalError(`Invalid interval symbol: ${symbol}`);
    }
    this.symbol = symbol;
    
    const q = symbol[0]!;
    const n = parseInt(symbol[1]!, 10) as IntervalNumber;
    
    this.number = n;
    switch(q) {
      case 'P': this.quality = 'perfect'; break;
      case 'M': this.quality = 'major'; break;
      case 'm': this.quality = 'minor'; break;
      case 'd': this.quality = 'diminished'; break;
      case 'A': this.quality = 'augmented'; break;
      default: throw new InvalidIntervalError(`Unknown quality: ${q}`);
    }
    Object.freeze(this);
  }

  equals(other: Interval): boolean {
    return this.symbol === other.symbol;
  }

  semitones(): number {
    const semitoneMap: Record<string, number> = {
      'P1': 0, 'm2': 1, 'M2': 2, 'm3': 3, 'M3': 4,
      'P4': 5, 'A4': 6, 'd5': 6, 'P5': 7, 'A5': 8,
      'm6': 8, 'M6': 9, 'm7': 10, 'M7': 11, 'd7': 9
    };
    return semitoneMap[this.symbol]!;
  }

  toString(): string {
    return `${this.quality} ${this.number === 1 ? 'unison' : this.number + (this.number === 2 ? 'nd' : this.number === 3 ? 'rd' : 'th')}`;
  }

  apply(root: Note): Note {
    const letters: Letter[] = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
    const rootIndex = letters.indexOf(root.letter);
    const targetLetterIndex = (rootIndex + this.number - 1) % 7;
    const targetLetter = letters[targetLetterIndex]!;

    const targetSemitones = (root.semitonesFromC() + this.semitones()) % 12;
    
    const naturalNote = new Note(targetLetter!);
    let naturalSemitones = naturalNote.semitonesFromC();
    
    let diff = (targetSemitones - naturalSemitones) % 12;
    if (diff < -6) diff += 12;
    if (diff > 6) diff -= 12;

    let accidental = '';
    if (diff === 0) accidental = '';
    else if (diff === 1) accidental = '#';
    else if (diff === -1) accidental = 'b';
    else if (diff === 2) accidental = '##';
    else if (diff === -2) accidental = 'bb';
    else throw new InvalidIntervalError(`Interval application produced an unsupported accidental (diff=${diff}): root ${root.toString()} + ${this.symbol} for letter ${targetLetter}`);

    return new Note(targetLetter!, accidental);
  }
}
