import { Note } from './Note';
import { Interval } from './Interval';

export class Scale {
  readonly root: Note;
  readonly modeName: string;
  readonly notes: readonly Note[];

  constructor(root: Note, modeName: string, notes: Note[]) {
    this.root = root;
    this.modeName = modeName;
    this.notes = Object.freeze([...notes]);
    Object.freeze(this);
  }

  static fromRootAndMode(root: Note, modeName: string): Scale {
    const modeMap: Record<string, string[]> = {
      'ionian': ['P1', 'M2', 'M3', 'P4', 'P5', 'M6', 'M7'],
      'dorian': ['P1', 'M2', 'm3', 'P4', 'P5', 'M6', 'm7'],
      'phrygian': ['P1', 'm2', 'm3', 'P4', 'P5', 'm6', 'm7'],
      'lydian': ['P1', 'M2', 'M3', 'A4', 'P5', 'M6', 'M7'],
      'mixolydian': ['P1', 'M2', 'M3', 'P4', 'P5', 'M6', 'm7'],
      'aeolian': ['P1', 'M2', 'm3', 'P4', 'P5', 'm6', 'm7'],
      'locrian': ['P1', 'm2', 'm3', 'P4', 'd5', 'm6', 'm7']
    };

    const intervals = modeMap[modeName.toLowerCase()];
    if (!intervals) {
      throw new Error(`Unsupported mode: ${modeName}`);
    }

    const notes = intervals.map(sym => new Interval(sym).apply(root));

    return new Scale(root, modeName, notes);
  }
}
