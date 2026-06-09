import { describe, it, expect } from 'vitest';
import { Chord } from '../../../src/harmonic-analysis/entities/Chord';
import { Key } from '../../../src/harmonic-analysis/entities/Key';
import { Note } from '../../../src/harmonic-analysis/entities/Note';
import { Progression } from '../../../src/harmonic-analysis/entities/Progression';
import { tritoneSubstitution } from '../../../src/harmonic-analysis/entities/TritoneSubstitution';
import { InvalidSubstitutionError } from '../../../src/harmonic-analysis/entities/errors';

describe('TritoneSubstitution', () => {
  describe('US1: Resolving Dominants (Happy Path)', () => {
    it('T005: G7 (V7 in C Major) -> Db7 substitute', () => {
      const g7 = new Chord(new Note('G'), 'dominant-seventh');
      const cmaj7 = new Chord(new Note('C'), 'major-seventh');
      const key = new Key(new Note('C'), 'major');
      const analysis = new Progression([g7, cmaj7], key).analyze();

      const result = tritoneSubstitution(analysis, 0);

      expect(result.applicable).toBe(true);
      if (result.applicable) {
        expect(result.substitution.substituteChord.root.letter).toBe('D');
        expect(result.substitution.substituteChord.root.accidental).toBe('b');
        expect(result.substitution.substituteChord.quality).toBe('dominant-seventh');
      }
    });

    it('T006: Bb7 (V7 in Eb Major) -> Fb7 substitute', () => {
      const bb7 = new Chord(new Note('B', 'b'), 'dominant-seventh');
      const ebmaj7 = new Chord(new Note('E', 'b'), 'major-seventh');
      const key = new Key(new Note('E', 'b'), 'major');
      const analysis = new Progression([bb7, ebmaj7], key).analyze();

      const result = tritoneSubstitution(analysis, 0);

      expect(result.applicable).toBe(true);
      if (result.applicable) {
        expect(result.substitution.substituteChord.root.letter).toBe('F');
        expect(result.substitution.substituteChord.root.accidental).toBe('b');
      }
    });

    it('T007: D7 (V7 in G Major) -> Ab7 substitute', () => {
      const d7 = new Chord(new Note('D'), 'dominant-seventh');
      const gmaj7 = new Chord(new Note('G'), 'major-seventh');
      const key = new Key(new Note('G'), 'major');
      const analysis = new Progression([d7, gmaj7], key).analyze();

      const result = tritoneSubstitution(analysis, 0);

      expect(result.applicable).toBe(true);
      if (result.applicable) {
        expect(result.substitution.substituteChord.root.letter).toBe('A');
        expect(result.substitution.substituteChord.root.accidental).toBe('b');
      }
    });

    it('T008: substitution result carries correct explanation.resolutionTarget', () => {
      const g7 = new Chord(new Note('G'), 'dominant-seventh');
      const cmaj7 = new Chord(new Note('C'), 'major-seventh');
      const key = new Key(new Note('C'), 'major');
      const analysis = new Progression([g7, cmaj7], key).analyze();

      const result = tritoneSubstitution(analysis, 0);

      expect(result.applicable).toBe(true);
      if (result.applicable) {
        expect(result.substitution.explanation.resolutionTarget.equals(new Note('C'))).toBe(true);
      }
    });

    it('T009: Substitution value object is deeply immutable', () => {
      const g7 = new Chord(new Note('G'), 'dominant-seventh');
      const cmaj7 = new Chord(new Note('C'), 'major-seventh');
      const key = new Key(new Note('C'), 'major');
      const analysis = new Progression([g7, cmaj7], key).analyze();

      const result = tritoneSubstitution(analysis, 0);

      expect(result.applicable).toBe(true);
      if (result.applicable) {
        const sub = result.substitution;
        expect(() => Object.assign(sub, { whatever: 1 })).toThrow();
        expect(() => Object.assign(sub.explanation, { whatever: 1 })).toThrow();
        expect(() => Object.assign(sub.explanation.sharedTritone, { whatever: 1 })).toThrow();
        expect(() => Object.assign(sub.explanation.sharedTritone[0], { whatever: 1 })).toThrow();
      }
    });
  });

  describe('US2: Reject for Non-Resolving or Non-Dominant Chords', () => {
    it('T014: Cmaj7 (Imaj7, not dominant) -> not applicable', () => {
      const cmaj7 = new Chord(new Note('C'), 'major-seventh');
      const key = new Key(new Note('C'), 'major');
      const analysis = new Progression([cmaj7], key).analyze();

      const result = tritoneSubstitution(analysis, 0);

      expect(result.applicable).toBe(false);
      if (!result.applicable) {
        expect(result.reason).toContain('dominant');
      }
    });

    it('T015: Dm7 (ii7, not dominant) -> not applicable', () => {
      const dm7 = new Chord(new Note('D'), 'minor-seventh');
      const key = new Key(new Note('C'), 'major');
      const analysis = new Progression([dm7], key).analyze();

      const result = tritoneSubstitution(analysis, 0);

      expect(result.applicable).toBe(false);
      if (!result.applicable) {
        expect(result.reason).toContain('dominant');
      }
    });

    it('T016: non-diatonic chord -> not applicable', () => {
      const ab7 = new Chord(new Note('A', 'b'), 'dominant-seventh');
      const key = new Key(new Note('C'), 'major');
      const analysis = new Progression([ab7], key).analyze();

      const result = tritoneSubstitution(analysis, 0);

      expect(result.applicable).toBe(false);
      if (!result.applicable) {
        expect(result.reason).toContain('not diatonic');
      }
    });

    it('T017: G7 as last chord in progression -> not applicable (does not resolve)', () => {
      const g7 = new Chord(new Note('G'), 'dominant-seventh');
      const key = new Key(new Note('C'), 'major');
      const analysis = new Progression([g7], key).analyze();

      const result = tritoneSubstitution(analysis, 0);

      expect(result.applicable).toBe(false);
      if (!result.applicable) {
        expect(result.reason).toContain('does not resolve');
      }
    });

    it('T018: invalid chord index -> throws InvalidSubstitutionError', () => {
      const g7 = new Chord(new Note('G'), 'dominant-seventh');
      const key = new Key(new Note('C'), 'major');
      const analysis = new Progression([g7], key).analyze();

      expect(() => tritoneSubstitution(analysis, -1)).toThrow(InvalidSubstitutionError);
      expect(() => tritoneSubstitution(analysis, 1)).toThrow(InvalidSubstitutionError);
    });
  });

  describe('US3: Enharmonic Correctness of Shared Tritone', () => {
    it('T022: G7->Db7 explanation has B<->Cb pair with isEnharmonicEquivalent: true', () => {
      const g7 = new Chord(new Note('G'), 'dominant-seventh');
      const cmaj7 = new Chord(new Note('C'), 'major-seventh');
      const key = new Key(new Note('C'), 'major');
      const analysis = new Progression([g7, cmaj7], key).analyze();

      const result = tritoneSubstitution(analysis, 0);

      expect(result.applicable).toBe(true);
      if (result.applicable) {
        const tritone = result.substitution.explanation.sharedTritone;
        const bCbPair = tritone.find(p => p.originalNote.letter === 'B');
        expect(bCbPair).toBeDefined();
        if (bCbPair) {
          expect(bCbPair.substituteNote.letter).toBe('C');
          expect(bCbPair.substituteNote.accidental).toBe('b');
          expect(bCbPair.isEnharmonicEquivalent).toBe(true);
          expect(bCbPair.isLiterallyIdentical).toBe(false);
        }
      }
    });

    it('T023: G7->Db7 explanation has F<->F pair with isLiterallyIdentical: true', () => {
      const g7 = new Chord(new Note('G'), 'dominant-seventh');
      const cmaj7 = new Chord(new Note('C'), 'major-seventh');
      const key = new Key(new Note('C'), 'major');
      const analysis = new Progression([g7, cmaj7], key).analyze();

      const result = tritoneSubstitution(analysis, 0);

      expect(result.applicable).toBe(true);
      if (result.applicable) {
        const tritone = result.substitution.explanation.sharedTritone;
        const fFPair = tritone.find(p => p.originalNote.letter === 'F');
        expect(fFPair).toBeDefined();
        if (fFPair) {
          expect(fFPair.substituteNote.letter).toBe('F');
          expect(fFPair.substituteNote.accidental).toBe('');
          expect(fFPair.isEnharmonicEquivalent).toBe(false);
          expect(fFPair.isLiterallyIdentical).toBe(true);
        }
      }
    });

    it('T024: C7->Gb7 explanation enharmonic pairs are correct (E<->Fb enharmonic, Bb<->Bb literal)', () => {
      const c7 = new Chord(new Note('C'), 'dominant-seventh');
      const fmaj7 = new Chord(new Note('F'), 'major-seventh');
      const key = new Key(new Note('F'), 'major');
      const analysis = new Progression([c7, fmaj7], key).analyze();

      const result = tritoneSubstitution(analysis, 0);

      expect(result.applicable).toBe(true);
      if (result.applicable) {
        const tritone = result.substitution.explanation.sharedTritone;
        
        const eFbPair = tritone.find(p => p.originalNote.letter === 'E');
        expect(eFbPair).toBeDefined();
        if (eFbPair) {
          expect(eFbPair.substituteNote.letter).toBe('F');
          expect(eFbPair.substituteNote.accidental).toBe('b');
          expect(eFbPair.isEnharmonicEquivalent).toBe(true);
          expect(eFbPair.isLiterallyIdentical).toBe(false);
        }

        const bbPair = tritone.find(p => p.originalNote.letter === 'B');
        expect(bbPair).toBeDefined();
        if (bbPair) {
          expect(bbPair.substituteNote.letter).toBe('B');
          expect(bbPair.substituteNote.accidental).toBe('b');
          expect(bbPair.isEnharmonicEquivalent).toBe(false);
          expect(bbPair.isLiterallyIdentical).toBe(true);
        }
      }
    });
  });
});
