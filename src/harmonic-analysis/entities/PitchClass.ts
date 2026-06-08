import { InvalidNoteError } from './errors';

export class PitchClass {
  readonly value: number;

  constructor(value: number) {
    if (!Number.isInteger(value) || value < 0 || value > 11) {
      throw new InvalidNoteError(`Invalid pitch class value: ${value}`);
    }
    this.value = value;
    Object.freeze(this);
  }

  equals(other: PitchClass): boolean {
    return this.value === other.value;
  }
}
