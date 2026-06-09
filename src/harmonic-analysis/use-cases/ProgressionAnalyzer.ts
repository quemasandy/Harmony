import { ProgressionInputDTO } from './dtos/ProgressionInputDTO';
import { ProgressionAnalysisResult, ProgressionError } from './dtos/ProgressionResult';
import { ProgressionOutputDTO, ChordAnalysisDTO, CapabilityResult } from './dtos/ProgressionOutputDTO';

import { Note } from '../entities/Note';
import { Key } from '../entities/Key';
import { Progression } from '../entities/Progression';
import { Scale } from '../entities/Scale';
import { calculateTensions } from '../entities/Tensions';
import { tritoneSubstitution } from '../entities/TritoneSubstitution';
import { parseChordSymbol } from '../adapters/ChordSymbolParser';

export class ProgressionAnalyzer {
  execute(input: ProgressionInputDTO): ProgressionAnalysisResult {
    let tonicString = input.tonalCenter;
    let mode: 'major' | 'minor' = 'major';
    
    if (tonicString.endsWith('m')) {
      mode = 'minor';
      tonicString = tonicString.slice(0, -1);
    }
    
    let key: Key;
    try {
      const match = tonicString.match(/^([A-G])([#b]?)$/);
      if (!match || !match[1]) throw new Error('Invalid note format');
      const tonicNote = new Note(match[1], match[2] || '');
      key = new Key(tonicNote, mode);
    } catch (e) {
      return {
        success: false,
        error: {
          code: 'INVALID_TONAL_CENTER',
          message: `Invalid tonal center: ${input.tonalCenter}`
        }
      };
    }

    const chords = [];
    for (let i = 0; i < input.chords.length; i++) {
      const chordInput = input.chords[i];
      if (!chordInput) continue;
      try {
        const chord = parseChordSymbol(chordInput.symbol);
        chords.push(chord);
      } catch (e: any) {
        return {
          success: false,
          error: {
            code: 'INVALID_CHORD_SYMBOL',
            message: e.message,
            chordIndex: i
          }
        };
      }
    }

    let progression: Progression;
    try {
      progression = new Progression(chords, key);
    } catch (e: any) {
      return {
        success: false,
        error: {
          code: 'MALFORMED_PROGRESSION',
          message: e.message
        }
      };
    }

    const harmonicAnalysis = progression.analyze();
    
    const iiVIMajorPatterns = new Set(harmonicAnalysis.iiVIMajorPatterns.map(p => p.startIndex));
    const iiVIMinorPatterns = new Set(harmonicAnalysis.iiVIMinorPatterns.map(p => p.startIndex));

    const analyzedChords: ChordAnalysisDTO[] = [];

    for (let i = 0; i < input.chords.length; i++) {
      const chordInput = input.chords[i];
      if (!chordInput) continue;
      const chord = chords[i]!;
      const analysisResult = harmonicAnalysis.chordAnalysis[i]!;
      
      let harmonicFunction = '?';
      if (analysisResult.diatonic) {
        harmonicFunction = analysisResult.romanNumeral.symbol;
      }

      const isIIVI = 
        iiVIMajorPatterns.has(i) || iiVIMajorPatterns.has(i - 1) || iiVIMajorPatterns.has(i - 2) ||
        iiVIMinorPatterns.has(i) || iiVIMinorPatterns.has(i - 1) || iiVIMinorPatterns.has(i - 2);

      let tensions: CapabilityResult<{ availableTensions: readonly string[], avoidNotes: readonly string[] }>;
      if (chordInput.chordScale) {
        try {
          const scale = Scale.fromRootAndMode(chord.root, chordInput.chordScale);
          const tensionsResult = calculateTensions(chord, scale);
          tensions = {
            available: true,
            data: {
              availableTensions: tensionsResult.availableTensions.map(t => t.note.toString()),
              avoidNotes: tensionsResult.avoidNotes.map(a => a.note.toString())
            }
          };
        } catch (e: any) {
          tensions = {
            available: false,
            reason: e.message
          };
        }
      } else {
        tensions = {
          available: false,
          reason: 'No explicit chord scale provided'
        };
      }

      let tritoneSub: CapabilityResult<readonly { substituteSymbol: string, explanation: string }[]>;
      try {
        const tritoneResult = tritoneSubstitution(harmonicAnalysis, i);
        if (tritoneResult.applicable) {
          tritoneSub = {
            available: true,
            data: [{
              substituteSymbol: `${tritoneResult.substitution.substituteChord.root.toString()}7`,
              explanation: `Tritone substitution of ${chord.root.toString()}7`
            }]
          };
        } else {
          tritoneSub = {
            available: false,
            reason: tritoneResult.reason
          };
        }
      } catch (e: any) {
        tritoneSub = {
          available: false,
          reason: e.message
        };
      }

      analyzedChords.push({
        symbol: chordInput.symbol,
        harmonicFunction,
        isIIVI,
        tensions,
        tritoneSubstitutions: tritoneSub
      });
    }

    return {
      success: true,
      data: {
        tonalCenter: input.tonalCenter,
        chords: analyzedChords
      }
    };
  }
}
