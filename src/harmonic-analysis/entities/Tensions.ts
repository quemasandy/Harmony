import { Note } from './Note';
import { Interval } from './Interval';
import { Chord } from './Chord';
import { Scale } from './Scale';
import { PitchClass } from './PitchClass';

export class InvalidScaleLengthError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'InvalidScaleLengthError';
  }
}

export class IncompatibleChordScaleError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'IncompatibleChordScaleError';
  }
}

export interface Tension {
  note: Note;
  degree: number;
}

export interface AvoidNote {
  note: Note;
  degree: number;
  clashesWith: Note;
}

export interface ChordScaleTensions {
  chord: Chord;
  scale: Scale;
  availableTensions: Tension[];
  avoidNotes: AvoidNote[];
}

export function calculateTensions(chord: Chord, scale: Scale): ChordScaleTensions {
  if (scale.notes.length !== 7) {
    throw new InvalidScaleLengthError(`Scale must have exactly 7 notes, got ${scale.notes.length}`);
  }

  // Pre-validate compatibility
  // A chord tone is incompatible if the scale contains a different note with the same letter
  // but a different accidental, UNLESS it's an exact enharmonic equivalent?
  // Let's implement a strict check: if a chord tone's pitch class is not in the scale, we check
  // if there's a scale note with the same letter. If so, they clash directly (e.g. Eb in chord, E in scale).
  // For MVP, we just ensure every chord tone's pitch class is present in the scale, or at least doesn't strictly conflict.
  
  const scalePcs = scale.notes.map(n => n.pitchClass().value);
  const scaleLetters = scale.notes.map(n => n.letter);

  for (const ct of chord.notes) {
    if (!scalePcs.includes(ct.pitchClass().value)) {
      if (scaleLetters.includes(ct.letter)) {
         throw new IncompatibleChordScaleError(`Chord contains ${ct.toString()} but scale does not, and they clash on letter ${ct.letter}`);
      }
    }
  }

  const availableTensions: Tension[] = [];
  const avoidNotes: AvoidNote[] = [];

  const chordPcs = chord.notes.map(n => n.pitchClass().value);

  scale.notes.forEach((scaleNote, idx) => {
    if (chordPcs.includes(scaleNote.pitchClass().value)) {
      return; // It's a chord tone
    }

    let isAvoid = false;
    let clashingTone: Note | null = null;

    for (const ct of chord.notes) {
      // "a minor second (one semitone) above any chord tone".
      // Calculate semitone difference. 
      // If `(scaleNote.semitonesFromC() - ct.semitonesFromC() + 12) % 12 === 1`
      const diff = (scaleNote.semitonesFromC() - ct.semitonesFromC() + 12) % 12;
      
      if (diff === 1) {
        isAvoid = true;
        clashingTone = ct;
        break;
      }
    }

    // Degree: 1-indexed based on scale index
    let degree = idx + 1;
    if (degree === 2 || degree === 4 || degree === 6) {
      degree += 7; // 2->9, 4->11, 6->13
    }

    if (isAvoid) {
      avoidNotes.push({ note: scaleNote, degree, clashesWith: clashingTone! });
    } else {
      availableTensions.push({ note: scaleNote, degree });
    }
  });

  return { chord, scale, availableTensions, avoidNotes };
}
