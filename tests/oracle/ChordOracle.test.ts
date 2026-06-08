import { describe, it, expect } from 'vitest';
import { parseChordSymbol } from '../../src/harmonic-analysis/adapters/ChordSymbolParser';
import { execSync } from 'child_process';
import * as path from 'path';
import * as fs from 'fs';

const ORACLE_SCRIPT = path.join(__dirname, 'music21-oracle.py');

function runOracle(symbol: string): any {
  try {
    // Si existe un virtualenv en el proyecto, usamos su binario de python3, si no el global
    const venvPython = path.join(__dirname, '../../../.venv/bin/python3');
    const pythonCmd = fs.existsSync(venvPython) ? `"${venvPython}"` : 'python3';

    const output = execSync(`${pythonCmd} "${ORACLE_SCRIPT}" "${symbol}"`, { encoding: 'utf-8' });
    return JSON.parse(output.trim());
  } catch (error: any) {
    if (error.stderr) {
      throw new Error(`Oracle failed for ${symbol}: ${error.stderr.toString()}`);
    }
    throw error;
  }
}

describe('ChordOracle Tests', () => {
  const testChords = [
    'C', 'Dm', 'Bdim', 'Caug',          // Triads
    'Cmaj7', 'Dm7', 'G7', 'F#m7b5',     // Sevenths
    'Bdim7',                            // Diminished 7th
    'Ebm7', 'Abmaj7',                   // Flatted roots
    'F#', 'C#'                          // Sharped roots
  ];

  for (const symbol of testChords) {
    it(`T081: matches music21 notes for ${symbol}`, () => {
      // 1. Get our domain output
      const myChord = parseChordSymbol(symbol);
      const myNotes = myChord.notes.map(n => n.toString());

      // 2. Get music21 oracle output
      let oracleData;
      try {
        oracleData = runOracle(symbol);
      } catch (err: any) {
        if (err.message.includes("music21 not installed")) {
          console.warn("Skipping Oracle test: music21 not installed in this environment.");
          return;
        }
        throw err;
      }

      // music21 spells flats with '-' (e.g., 'E-' → 'Eb', 'B--' → 'Bbb').
      // music21 does not use 'x' for double sharps; it uses '##'.
      const oracleNotes = oracleData.notes.map((n: string) => n.replaceAll('-', 'b'));

      expect(myNotes).toEqual(oracleNotes);
    });
  }
});
