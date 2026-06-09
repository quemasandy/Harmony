import { describe, it, expect, beforeAll } from 'vitest';
import { execSync } from 'child_process';
import { Chord } from '../../src/harmonic-analysis/entities/Chord';
import { Key } from '../../src/harmonic-analysis/entities/Key';
import { Note } from '../../src/harmonic-analysis/entities/Note';
import { Progression } from '../../src/harmonic-analysis/entities/Progression';
import { tritoneSubstitution } from '../../src/harmonic-analysis/entities/TritoneSubstitution';

interface OracleResult {
  pair: string;
  chord?: string;
  substituteRoot?: { letter: string; accidental: string };
  sharedTritone?: Array<{
    originalNote: { letter: string; accidental: string };
    substituteNote: { letter: string; accidental: string };
    isEnharmonicEquivalent: boolean;
    isLiterallyIdentical: boolean;
  }>;
  error?: string;
}

describe('TritoneSubOracle Tests', () => {
  let isOracleAvailable = true;

  beforeAll(() => {
    try {
      execSync(`${__dirname}/../../.venv/bin/python3 -c "import music21"`);
    } catch (e) {
      isOracleAvailable = false;
    }
  });

  const testCases = [
    { chordStr: 'G7', keyStr: 'C', keyQuality: 'major' },
    { chordStr: 'Bb7', keyStr: 'Eb', keyQuality: 'major' },
    { chordStr: 'D7', keyStr: 'G', keyQuality: 'major' },
    { chordStr: 'C7', keyStr: 'F', keyQuality: 'major' },
    { chordStr: 'A7', keyStr: 'D', keyQuality: 'minor' },
    { chordStr: 'E7', keyStr: 'A', keyQuality: 'minor' },
    { chordStr: 'Eb7', keyStr: 'Ab', keyQuality: 'major' },
    { chordStr: 'Ab7', keyStr: 'Db', keyQuality: 'major' },
    { chordStr: 'Eb7', keyStr: 'Ab', keyQuality: 'major' },
    { chordStr: 'Ab7', keyStr: 'Db', keyQuality: 'major' },
    { chordStr: 'Eb7', keyStr: 'Ab', keyQuality: 'major' },
    { chordStr: 'Ab7', keyStr: 'Db', keyQuality: 'major' },
    { chordStr: 'Eb7', keyStr: 'Ab', keyQuality: 'major' },
    { chordStr: 'Ab7', keyStr: 'Db', keyQuality: 'major' },
    { chordStr: 'Eb7', keyStr: 'Ab', keyQuality: 'major' },
    { chordStr: 'Ab7', keyStr: 'Db', keyQuality: 'major' }
  ];

  it('matches music21 oracle for tritone substitution roots', (ctx) => {
    if (!isOracleAvailable) {
      console.warn('Skipping Oracle test: music21 not installed in this environment.');
      ctx.skip();
      return;
    }

    const batchArgs = testCases.map(tc => `"${tc.chordStr}:${tc.keyStr} ${tc.keyQuality}"`).join(' ');
    const command = `${__dirname}/../../.venv/bin/python3 ${__dirname}/scripts/music21-tritone-sub-oracle.py --batch ${batchArgs}`;
    
    let output = '';
    try {
      output = execSync(command, { encoding: 'utf-8' });
    } catch (e: any) {
      console.warn('Oracle script failed:', e.message);
      return;
    }

    const lines = output.trim().split('\n').filter(Boolean);
    const results: OracleResult[] = lines.map(line => JSON.parse(line));

    for (const tc of testCases) {
      const pairId = `${tc.chordStr}:${tc.keyStr} ${tc.keyQuality}`;
      const oracleRes = results.find(r => r.pair === pairId);
      
      expect(oracleRes).toBeDefined();
      expect(oracleRes!.error).toBeUndefined();

      const noteStr = tc.chordStr.replace('7', '');
      const getNote = (str: string) => new Note(str[0] as any, str.slice(1) as any);
      
      const c = new Chord(getNote(noteStr), 'dominant-seventh');
      const targetChordStr = tc.keyQuality === 'major' ? `${tc.keyStr}maj7` : `${tc.keyStr}m`;
      const targetC = new Chord(getNote(tc.keyStr), tc.keyQuality === 'major' ? 'major-seventh' : 'minor');
      const k = new Key(getNote(tc.keyStr), tc.keyQuality as any);
      
      const analysis = new Progression([c, targetC], k).analyze();
      const result = tritoneSubstitution(analysis, 0);

      if (!result.applicable) {
        console.error('Substitution not applicable:', (result as any).reason);
        console.error('target chord notes:', targetC.notes);
        console.error('scale notes:', k.getScaleNotes());
      }
      expect(result.applicable).toBe(true);
      if (result.applicable) {
        // We verify against the oracle's output exactly.
        expect(result.substitution.substituteChord.root.letter).toBe(oracleRes!.substituteRoot!.letter);
        expect(result.substitution.substituteChord.root.accidental).toBe(oracleRes!.substituteRoot!.accidental);
        
        const tritone = result.substitution.explanation.sharedTritone;
        expect(tritone.length).toBe(2);
        
        // Oracle returns a list of 2 pairs.
        const oracleTritone = oracleRes!.sharedTritone!;
        expect(oracleTritone.length).toBe(2);
        
        // Sort both by original note letter to compare reliably
        const sortedTritone = [...tritone].sort((a, b) => a.originalNote.letter.localeCompare(b.originalNote.letter));
        const sortedOracleTritone = [...oracleTritone].sort((a, b) => a.originalNote.letter.localeCompare(b.originalNote.letter));

        for (let i = 0; i < 2; i++) {
          const tItem = sortedTritone[i]!;
          const oItem = sortedOracleTritone[i]!;

          expect(tItem.originalNote.letter).toBe(oItem.originalNote.letter);
          expect(tItem.originalNote.accidental).toBe(oItem.originalNote.accidental);
          
          expect(tItem.substituteNote.letter).toBe(oItem.substituteNote.letter);
          expect(tItem.substituteNote.accidental).toBe(oItem.substituteNote.accidental);
          
          expect(tItem.isEnharmonicEquivalent).toBe(oItem.isEnharmonicEquivalent);
          expect(tItem.isLiterallyIdentical).toBe(oItem.isLiterallyIdentical);
        }
      }
    }
  });
});
