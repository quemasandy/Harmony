import { Chord } from './Chord';
import { Note } from './Note';
import { HarmonicAnalysis } from './Progression';
import { Interval } from './Interval';
import { InvalidSubstitutionError } from './errors';

export class SharedTritoneNotePair {
  readonly originalNote: Note;
  readonly substituteNote: Note;
  readonly isEnharmonicEquivalent: boolean;
  readonly isLiterallyIdentical: boolean;

  constructor(originalNote: Note, substituteNote: Note) {
    if (!originalNote.pitchClass().equals(substituteNote.pitchClass())) {
      throw new InvalidSubstitutionError('Notes in a shared tritone pair must be enharmonically equivalent');
    }

    this.originalNote = originalNote;
    this.substituteNote = substituteNote;
    
    this.isLiterallyIdentical = originalNote.equals(substituteNote);
    this.isEnharmonicEquivalent = !this.isLiterallyIdentical;

    Object.freeze(this);
  }
}

export class SubstitutionExplanation {
  readonly sharedTritone: readonly [SharedTritoneNotePair, SharedTritoneNotePair];
  readonly resolutionTarget: Note;

  constructor(sharedTritone: [SharedTritoneNotePair, SharedTritoneNotePair], resolutionTarget: Note) {
    this.sharedTritone = Object.freeze([...sharedTritone]) as readonly [SharedTritoneNotePair, SharedTritoneNotePair];
    this.resolutionTarget = resolutionTarget;
    Object.freeze(this);
  }
}

export class Substitution {
  readonly originalChord: Chord;
  readonly substituteChord: Chord;
  readonly explanation: SubstitutionExplanation;

  constructor(originalChord: Chord, substituteChord: Chord, explanation: SubstitutionExplanation) {
    if (originalChord.quality !== 'dominant-seventh') {
      throw new InvalidSubstitutionError('Original chord must be dominant 7th');
    }
    if (substituteChord.quality !== 'dominant-seventh') {
      throw new InvalidSubstitutionError('Substitute chord must be dominant 7th');
    }

    const expectedRootValue = (originalChord.root.pitchClass().value + 6) % 12;
    if (substituteChord.root.pitchClass().value !== expectedRootValue) {
      throw new InvalidSubstitutionError('Substitute chord root must be a tritone away from original root');
    }

    this.originalChord = originalChord;
    this.substituteChord = substituteChord;
    this.explanation = explanation;
    Object.freeze(this);
  }
}

export type SubstitutionResult =
  | { readonly applicable: true; readonly substitution: Substitution }
  | { readonly applicable: false; readonly reason: string };

export function tritoneSubstitution(analysis: HarmonicAnalysis, chordIndex: number): SubstitutionResult {
  if (chordIndex < 0 || chordIndex >= analysis.chords.length) {
    throw new InvalidSubstitutionError(`Invalid chord index: ${chordIndex}`);
  }

  const originalChord = analysis.chords[chordIndex]!;
  if (originalChord.quality !== 'dominant-seventh') {
    return Object.freeze({ applicable: false, reason: 'Chord is not a dominant 7th quality' });
  }

  const currentAnalysis = analysis.chordAnalysis[chordIndex]!;
  if (!currentAnalysis.diatonic) {
    return Object.freeze({ applicable: false, reason: 'Chord is not diatonic' });
  }

  if (currentAnalysis.romanNumeral.symbol !== 'V7') {
    return Object.freeze({ applicable: false, reason: 'Chord is not a resolving dominant (not V7)' });
  }

  const nextAnalysis = analysis.chordAnalysis[chordIndex + 1];
  if (!nextAnalysis) {
    return Object.freeze({ applicable: false, reason: 'Chord does not resolve (V7 not followed by I/i)' });
  }

  if (!nextAnalysis.diatonic) {
    return Object.freeze({ applicable: false, reason: 'Chord does not resolve (V7 not followed by I/i)' });
  }

  const validNextSymbols = ['I', 'Imaj7', 'i', 'i7'];
  if (!validNextSymbols.includes(nextAnalysis.romanNumeral.symbol)) {
    return Object.freeze({ applicable: false, reason: 'Chord does not resolve (V7 not followed by I/i)' });
  }

  // It is a resolving V7! Calculate substitute.
  // The substitute root should be spelled as the functional flat-second (bII) 
  // of the resolution target, which is a minor second above the target root.
  const targetRoot = analysis.chords[chordIndex + 1]!.root;
  const m2Interval = new Interval('m2');
  const substituteRoot = m2Interval.apply(targetRoot);

  const substituteChord = new Chord(substituteRoot, 'dominant-seventh');

  // We need to extract the 3rd and 7th of both chords
  const original3rd = originalChord.notes[1]!; // 3rd is at index 1
  const original7th = originalChord.notes[3]!; // 7th is at index 3

  const substitute3rd = substituteChord.notes[1]!;
  const substitute7th = substituteChord.notes[3]!;

  // 3rd of original corresponds to 7th of substitute, and vice-versa
  const pair1 = new SharedTritoneNotePair(original3rd, substitute7th);
  const pair2 = new SharedTritoneNotePair(original7th, substitute3rd);

  const explanation = new SubstitutionExplanation([pair1, pair2], analysis.key.tonic);
  const substitution = new Substitution(originalChord, substituteChord, explanation);

  return Object.freeze({ applicable: true, substitution });
}
