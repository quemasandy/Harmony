import { Chord, Note, ChordQualityName, InvalidChordSymbolError } from '../entities';

export function parseChordSymbol(symbol: string): Chord {
  const trimmed = symbol.trim();
  if (trimmed === '') {
    throw new InvalidChordSymbolError('Empty chord symbol is not valid.');
  }

  // Regex to extract root letter (A-G), accidental (# or b), and suffix
  // FR-012: strict case-sensitive, root must be uppercase A-G.
  const regex = /^([A-G])([#b]?)(.*)$/;
  const match = trimmed.match(regex);

  if (!match) {
    throw new InvalidChordSymbolError(`Invalid root or format in symbol: "${trimmed}". Root must be A-G.`);
  }

  const letter = match[1]!;
  const accidental = match[2]!;
  const suffix = match[3]!;

  // Validate suffix (FR-011) and map to ChordQualityName
  let quality: ChordQualityName;

  switch (suffix) {
    // Triads (FR-004)
    case '':
      quality = 'major';
      break;
    case 'm':
      quality = 'minor';
      break;
    case 'dim':
      quality = 'diminished';
      break;
    case 'aug':
    case '+':
      quality = 'augmented';
      break;
    // Sevenths (FR-005)
    case 'maj7':
    case 'M7':
      quality = 'major-seventh';
      break;
    case '7':
      quality = 'dominant-seventh';
      break;
    case 'm7':
      quality = 'minor-seventh';
      break;
    case 'm7b5':
      quality = 'half-diminished-seventh';
      break;
    case 'dim7':
      quality = 'diminished-seventh';
      break;
    default:
      // FR-008: Check for unsupported extensions to give informative message
      if (/(9|11|13|sus|add)/.test(suffix)) {
        throw new InvalidChordSymbolError(`Unsupported chord extension in symbol: "${trimmed}". 9ths, 11ths, 13ths, sus, add, etc. are not supported in this version.`);
      }
      throw new InvalidChordSymbolError(`Unrecognized or non-canonical suffix: "${suffix}" in symbol "${trimmed}".`);
  }

  const rootNote = new Note(letter, accidental);
  return new Chord(rootNote, quality);
}
