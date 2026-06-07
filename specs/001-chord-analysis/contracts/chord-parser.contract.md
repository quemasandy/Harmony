# Contract: Chord Symbol Parser

**Module**: `src/harmonic-analysis/adapters/ChordSymbolParser.ts`

**Type**: Adapter (public-facing boundary of the library)

## Interface

```typescript
/**
 * Parses a chord symbol string into its constituent parts.
 * 
 * @param symbol - A chord symbol string (e.g., "Dm7", "F#m7b5", "Caug")
 * @returns A Chord value object with root, notes, intervals, and quality
 * @throws InvalidChordSymbolError if the symbol is malformed or unrecognized
 */
function parseChordSymbol(symbol: string): Chord;
```

## Input Specification

| Constraint | Rule |
|-----------|------|
| Type | `string` |
| Trimming | Leading/trailing whitespace is silently trimmed (FR-009) |
| Root | First character must be uppercase `A`–`G` (FR-012) |
| Accidental | Optional `#` or `b` after root letter |
| Suffix | Must exactly match a canonical suffix (see table below) |
| Completeness | No characters may remain after root + suffix |

### Canonical Suffixes (FR-004, FR-005, FR-011)

| Suffix | Quality | Notes Count |
|--------|---------|-------------|
| *(empty)* | `major` | 3 |
| `m` | `minor` | 3 |
| `dim` | `diminished` | 3 |
| `aug` | `augmented` | 3 |
| `+` | `augmented` | 3 |
| `maj7` | `major-seventh` | 4 |
| `M7` | `major-seventh` | 4 |
| `7` | `dominant-seventh` | 4 |
| `m7` | `minor-seventh` | 4 |
| `m7b5` | `half-diminished-seventh` | 4 |
| `dim7` | `diminished-seventh` | 4 |

## Output Specification

A `Chord` value object containing:

```typescript
{
  readonly root: Note;           // e.g., Note('D', 'natural')
  readonly notes: readonly Note[];    // e.g., [D, F, A, C]
  readonly intervals: readonly Interval[];  // e.g., [P1, m3, P5, m7]
  readonly quality: ChordQuality;     // e.g., 'minor-seventh'
}
```

## Error Cases

| Input | Error | Reason |
|-------|-------|--------|
| `""` | `InvalidChordSymbolError` | Empty string |
| `"XYZ"` | `InvalidChordSymbolError` | `X` is not a valid root note |
| `"Hm7"` | `InvalidChordSymbolError` | `H` is not a valid root note |
| `"cmaj7"` | `InvalidChordSymbolError` | Lowercase root (FR-012) |
| `"CM7"` | `InvalidChordSymbolError` | `C` is valid root, but remaining `M7` → wait, `M7` IS a valid suffix for major-seventh |
| `"Cmin"` | `InvalidChordSymbolError` | `min` is not a canonical suffix (FR-011) |
| `"C-"` | `InvalidChordSymbolError` | `-` is not a canonical suffix (FR-011) |
| `"C9"` | `InvalidChordSymbolError` | `9` is not supported (FR-008) |
| `"Dm11"` | `InvalidChordSymbolError` | `m11` is not supported (FR-008) |
| `"C°"` | `InvalidChordSymbolError` | `°` is not a canonical suffix (FR-011) |
| `"Cø7"` | `InvalidChordSymbolError` | `ø7` is not a canonical suffix (FR-011) |
| `" Dm7 "` | ✅ Valid | Trimmed to `"Dm7"` (FR-009) |

## Examples

| Input | Root | Quality | Notes | Intervals |
|-------|------|---------|-------|-----------|
| `"C"` | C | major | C, E, G | P1, M3, P5 |
| `"Dm"` | D | minor | D, F, A | P1, m3, P5 |
| `"Bdim"` | B | diminished | B, D, F | P1, m3, d5 |
| `"Caug"` | C | augmented | C, E, G# | P1, M3, A5 |
| `"C+"` | C | augmented | C, E, G# | P1, M3, A5 |
| `"Cmaj7"` | C | major-seventh | C, E, G, B | P1, M3, P5, M7 |
| `"CM7"` | C | major-seventh | C, E, G, B | P1, M3, P5, M7 |
| `"G7"` | G | dominant-seventh | G, B, D, F | P1, M3, P5, m7 |
| `"Dm7"` | D | minor-seventh | D, F, A, C | P1, m3, P5, m7 |
| `"F#m7b5"` | F# | half-diminished-seventh | F#, A, C, E | P1, m3, d5, m7 |
| `"Bdim7"` | B | diminished-seventh | B, D, F, Ab | P1, m3, d5, d7 |
| `"Ebm7"` | Eb | minor-seventh | Eb, Gb, Bb, Db | P1, m3, P5, m7 |
| `"Abmaj7"` | Ab | major-seventh | Ab, C, Eb, G | P1, M3, P5, M7 |
