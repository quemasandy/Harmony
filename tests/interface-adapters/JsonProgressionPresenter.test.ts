import { describe, it, expect, beforeEach } from 'vitest';
import { JsonProgressionPresenter } from '../../src/harmonic-analysis/interface-adapters/JsonProgressionPresenter';
import { ProgressionAnalysisResult } from '../../src/harmonic-analysis/use-cases/dtos/ProgressionResult';

describe('JsonProgressionPresenter', () => {
  let presenter: JsonProgressionPresenter;

  beforeEach(() => {
    presenter = new JsonProgressionPresenter();
  });

  it('should format a successful analysis result deterministically', () => {
    const result: ProgressionAnalysisResult = {
      success: true,
      data: {
        tonalCenter: 'C',
        chords: [
          {
            symbol: 'Dm7',
            harmonicFunction: 'ii7',
            isIIVI: true,
            tensions: {
              available: true,
              data: {
                availableTensions: ['E', 'G', 'B'],
                avoidNotes: ['F']
              }
            },
            tritoneSubstitutions: {
              available: true,
              data: [
                {
                  substituteSymbol: 'Ab7',
                  explanation: 'Tritone substitution of D7'
                }
              ]
            }
          },
          {
            symbol: 'Fmaj7',
            harmonicFunction: 'IVmaj7',
            isIIVI: false,
            tensions: {
              available: false,
              reason: 'No explicit chord scale provided'
            },
            tritoneSubstitutions: {
              available: false,
              reason: 'Chord quality does not support tritone substitution'
            }
          }
        ]
      }
    };

    const jsonString = presenter.present(result);
    const parsed = JSON.parse(jsonString);

    expect(parsed.success).toBe(true);
    expect(parsed.data.tonalCenter).toBe('C');
    expect(parsed.data.chords).toHaveLength(2);
    
    // Explicitly check that JSON serialization includes all properties correctly formatted
    const dm7 = parsed.data.chords[0];
    expect(dm7.symbol).toBe('Dm7');
    expect(dm7.tensions.available).toBe(true);
    expect(dm7.tensions.data.availableTensions).toEqual(['E', 'G', 'B']);
    expect(dm7.tritoneSubstitutions.data[0].substituteSymbol).toBe('Ab7');

    const fmaj7 = parsed.data.chords[1];
    expect(fmaj7.tensions.available).toBe(false);
    expect(fmaj7.tensions.reason).toBe('No explicit chord scale provided');
    expect(fmaj7.tensions.data).toBeUndefined();

    // Verify contract stability: keys MUST be alphabetically sorted
    expect(jsonString).toBe(`{
  "data": {
    "chords": [
      {
        "harmonicFunction": "ii7",
        "isIIVI": true,
        "symbol": "Dm7",
        "tensions": {
          "available": true,
          "data": {
            "availableTensions": [
              "E",
              "G",
              "B"
            ],
            "avoidNotes": [
              "F"
            ]
          }
        },
        "tritoneSubstitutions": {
          "available": true,
          "data": [
            {
              "explanation": "Tritone substitution of D7",
              "substituteSymbol": "Ab7"
            }
          ]
        }
      },
      {
        "harmonicFunction": "IVmaj7",
        "isIIVI": false,
        "symbol": "Fmaj7",
        "tensions": {
          "available": false,
          "reason": "No explicit chord scale provided"
        },
        "tritoneSubstitutions": {
          "available": false,
          "reason": "Chord quality does not support tritone substitution"
        }
      }
    ],
    "tonalCenter": "C"
  },
  "success": true
}`);
  });

  it('should format an error result deterministically', () => {
    const result: ProgressionAnalysisResult = {
      success: false,
      error: {
        code: 'INVALID_CHORD_SYMBOL',
        message: "The symbol 'Hmaj7' is not a valid chord",
        chordIndex: 1
      }
    };

    const jsonString = presenter.present(result);
    const parsed = JSON.parse(jsonString);

    expect(parsed.success).toBe(false);
    expect(parsed.error.code).toBe('INVALID_CHORD_SYMBOL');
    expect(parsed.error.message).toBe("The symbol 'Hmaj7' is not a valid chord");
    expect(parsed.error.chordIndex).toBe(1);
  });
});
