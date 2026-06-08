import { Note } from './Note';
import { Interval } from './Interval';
import { InvalidKeyError } from './errors';

export type Mode = 'major' | 'minor';

export class Key {
  readonly tonic: Note;
  readonly mode: Mode;

  constructor(tonic: Note, mode: Mode) {
    if (mode !== 'major' && mode !== 'minor') {
      throw new InvalidKeyError(`Invalid mode: ${mode}`);
    }
    this.tonic = tonic;
    this.mode = mode;
    Object.freeze(this);
  }

  equals(other: Key): boolean {
    return this.tonic.equals(other.tonic) && this.mode === other.mode;
  }

  getScaleNotes(): Note[] {
    const majorIntervals = ['P1', 'M2', 'M3', 'P4', 'P5', 'M6', 'M7'];
    const harmonicMinorIntervals = ['P1', 'M2', 'm3', 'P4', 'P5', 'm6', 'M7'];
    const intervals = this.mode === 'major' ? majorIntervals : harmonicMinorIntervals;
    
    return intervals.map(sym => new Interval(sym).apply(this.tonic));
  }
}
