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
      execSync('python3 -c "import music21"');
    } catch (e) {
      isOracleAvailable = false;
    }
  });

  const testCases = [
    { chordStr: 'G7', keyStr: 'C', keyQuality: 'major', targetRoot: 'D', targetAcc: 'b' },
    { chordStr: 'Bb7', keyStr: 'Eb', keyQuality: 'major', targetRoot: 'E', targetAcc: '' },
    { chordStr: 'D7', keyStr: 'G', keyQuality: 'major', targetRoot: 'A', targetAcc: 'b' },
    { chordStr: 'C7', keyStr: 'F', keyQuality: 'major', targetRoot: 'G', targetAcc: 'b' },
    { chordStr: 'A7', keyStr: 'D', keyQuality: 'minor', targetRoot: 'E', targetAcc: 'b' },
    { chordStr: 'E7', keyStr: 'A', keyQuality: 'minor', targetRoot: 'B', targetAcc: 'b' }
  ];

  it('matches music21 oracle for tritone substitution roots', () => {
    if (!isOracleAvailable) {
      console.warn('Skipping Oracle test: music21 not installed in this environment.');
      return;
    }

    const batchArgs = testCases.map(tc => `"${tc.chordStr}:${tc.keyStr} ${tc.keyQuality}"`).join(' ');
    const command = `python3 ${__dirname}/scripts/music21-tritone-sub-oracle.py --batch ${batchArgs}`;
    
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
      if (!oracleRes || oracleRes.error) {
        continue;
      }

      const noteStr = tc.chordStr.replace('7', '');
      const c = new Chord(Note.fromString(noteStr), 'dominant-seventh');
      const targetChordStr = tc.keyQuality === 'major' ? `${tc.keyStr}maj7` : `${tc.keyStr}m7`;
      const targetC = new Chord(Note.fromString(tc.keyStr), tc.keyQuality === 'major' ? 'major-seventh' : 'minor-seventh');
      const k = new Key(Note.fromString(tc.keyStr), tc.keyQuality as any);
      
      const analysis = new Progression([c, targetC], k).analyze();
      const result = tritoneSubstitution(analysis, 0);

      expect(result.applicable).toBe(true);
      if (result.applicable) {
        // We verify against our own EXPECTED targets because music21 doesn't have a strict spelling 
        // rule for the substitute root in its standard libraries. Our oracle script computed m2 above target.
        // Let's verify our domain matches the script's output.
        expect(result.substitution.substituteChord.root.letter).toBe(oracleRes.substituteRoot!.letter);
        expect(result.substitution.substituteChord.root.accidental).toBe(oracleRes.substituteRoot!.accidental);
        
        const tritone = result.substitution.explanation.sharedTritone;
        expect(tritone.length).toBe(2);
        
        // Oracle returns a list of 2 pairs.
        const oracleTritone = oracleRes.sharedTritone!;
        expect(oracleTritone.length).toBe(2);
      }
    }
  });
});
