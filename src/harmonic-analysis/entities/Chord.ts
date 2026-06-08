import { Note } from './Note';
import { Interval } from './Interval';
import { ChordQualityName, CHORD_INTERVAL_TEMPLATES } from './ChordQuality';

export class Chord {
  readonly root: Note;
  readonly quality: ChordQualityName;
  readonly intervals: readonly Interval[];
  readonly notes: readonly Note[];

  constructor(root: Note, quality: ChordQualityName) {
    this.root = root;
    this.quality = quality;
    
    const intervalSymbols = CHORD_INTERVAL_TEMPLATES[quality];
    this.intervals = Object.freeze(intervalSymbols.map(sym => new Interval(sym)));
    this.notes = Object.freeze(this.intervals.map(inv => inv.apply(root)));
    
    Object.freeze(this);
  }

  equals(other: Chord): boolean {
    return this.root.equals(other.root) && this.quality === other.quality;
  }
}
