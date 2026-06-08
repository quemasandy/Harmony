import { describe, it, expect } from 'vitest';
import { execFileSync } from 'child_process';
import { join } from 'path';
import { Chord } from '../../src/harmonic-analysis/entities/Chord';
import { Key } from '../../src/harmonic-analysis/entities/Key';
import { Progression } from '../../src/harmonic-analysis/entities/Progression';
import { Note } from '../../src/harmonic-analysis/entities/Note';

const ORACLE_SCRIPT = join(__dirname, 'music21-roman-oracle.py');

function runOracle(key: string, chords: string[]): { symbol: string, key: string, roman_numeral?: string, error?: string }[] {
  try {
    const output = execFileSync('python3', [ORACLE_SCRIPT, key, ...chords], { encoding: 'utf-8', env: { ...process.env, PATH: `${join(__dirname, '../../../.venv/bin')}:${process.env.PATH}` } });
    return output.trim().split('\n').filter(l => l).map(line => JSON.parse(line));
  } catch (error: any) {
    console.warn('Oracle script failed, perhaps music21 is not installed or python3 is missing.', error.message);
    return [];
  }
}

describe('Progression Oracle Tests', () => {
  it('validates Major ii-V-I roman numerals against music21', () => {
    // Dm7 G7 Cmaj7 in C major
    const oracleResults = runOracle('C major', ['Dm7', 'G7', 'Cmaj7']);
    if (oracleResults.length === 0 || oracleResults[0]?.error === 'music21 not installed') {
      console.log('Skipping oracle test because music21 is not available');
      return;
    }

    const key = new Key(new Note('C'), 'major');
    const chords = [
      new Chord(new Note('D'), 'minor-seventh'),
      new Chord(new Note('G'), 'dominant-seventh'),
      new Chord(new Note('C'), 'major-seventh')
    ];
    const progression = new Progression(chords, key);
    const analysis = progression.analyze();

    expect((analysis.chordAnalysis[0] as any).romanNumeral.symbol).toBe(oracleResults[0]!.roman_numeral);
    expect((analysis.chordAnalysis[1] as any).romanNumeral.symbol).toBe(oracleResults[1]!.roman_numeral);
    expect((analysis.chordAnalysis[2] as any).romanNumeral.symbol).toBe(oracleResults[2]!.roman_numeral);
  });

  it('validates Minor ii-V-i roman numerals against music21', () => {
    // Dø7 G7 Cm in C minor
    const oracleResults = runOracle('C minor', ['Dø7', 'G7', 'Cm']);
    if (oracleResults.length === 0 || oracleResults[0]?.error === 'music21 not installed') {
      console.log('Skipping oracle test because music21 is not available');
      return;
    }

    const key = new Key(new Note('C'), 'minor');
    const chords = [
      new Chord(new Note('D'), 'half-diminished-seventh'),
      new Chord(new Note('G'), 'dominant-seventh'),
      new Chord(new Note('C'), 'minor')
    ];
    const progression = new Progression(chords, key);
    const analysis = progression.analyze();

    expect((analysis.chordAnalysis[0] as any).romanNumeral.symbol).toBe(oracleResults[0]!.roman_numeral);
    expect((analysis.chordAnalysis[1] as any).romanNumeral.symbol).toBe(oracleResults[1]!.roman_numeral);
    expect((analysis.chordAnalysis[2] as any).romanNumeral.symbol).toBe(oracleResults[2]!.roman_numeral);
  });
});
