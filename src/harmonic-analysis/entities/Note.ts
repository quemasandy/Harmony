import { PitchClass } from './PitchClass';
import { InvalidNoteError } from './errors';

const VALID_LETTERS = ['C', 'D', 'E', 'F', 'G', 'A', 'B'] as const;
const VALID_ACCIDENTALS = ['', '#', 'b', '##', 'bb'] as const;

export type Letter = typeof VALID_LETTERS[number];
export type Accidental = typeof VALID_ACCIDENTALS[number];

const LETTER_PITCH_CLASS: Record<Letter, number> = {
  'C': 0, 'D': 2, 'E': 4, 'F': 5, 'G': 7, 'A': 9, 'B': 11
};

export class Note {
  readonly letter: Letter;
  readonly accidental: Accidental;

  constructor(letter: string, accidental: string = '') {
    if (!VALID_LETTERS.includes(letter as Letter)) {
      throw new InvalidNoteError(`Invalid letter: ${letter}`);
    }
    if (!VALID_ACCIDENTALS.includes(accidental as Accidental)) {
      throw new InvalidNoteError(`Invalid accidental: ${accidental}`);
    }

    this.letter = letter as Letter;
    this.accidental = accidental as Accidental;
    Object.freeze(this);
  }

  equals(other: Note): boolean {
    return this.letter === other.letter && this.accidental === other.accidental;
  }

  toString(): string {
    return `${this.letter}${this.accidental}`;
  }

  semitonesFromC(): number {
    let base = LETTER_PITCH_CLASS[this.letter];
    if (this.accidental === '#') base += 1;
    else if (this.accidental === 'b') base -= 1;
    else if (this.accidental === '##') base += 2;
    else if (this.accidental === 'bb') base -= 2;
    return ((base % 12) + 12) % 12;
  }

  pitchClass(): PitchClass {
    return new PitchClass(this.semitonesFromC());
  }
}
