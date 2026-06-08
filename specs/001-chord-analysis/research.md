# Research: Análisis de Acorde Individual

**Feature**: 001-chord-analysis | **Date**: 2026-06-07

## 1. Modelado de notas: deletreadas vs pitch class colapsado

**Decision**: Las notas se modelan como **letra + alteración** (spelled notes), NO como pitch class numérico colapsado.

**Rationale**: La teoría musical distingue entre `F#` y `Gb` — son enarmónicamente equivalentes pero semánticamente distintos. Un `Bdim7` contiene `Ab` (séptima disminuida desde B), NO `G#` (que sería una sexta aumentada). El deletreo correcto es parte de la semántica del análisis armónico, no cosmético.

**Alternatives considered**:
- *Pitch class numérico (0–11)*: Pierde información enarmónica. Rechazado porque FR-003 exige deletreo correcto.
- *Híbrido (pitch class + spelling hint)*: Complejidad innecesaria. La nota deletreada ya contiene toda la información; el pitch class se deriva cuando se necesite.

## 2. Representación interna de Note

**Decision**: `Note` = `{ letter: NoteLetter, accidental: Accidental }` donde:
- `NoteLetter` = `'C' | 'D' | 'E' | 'F' | 'G' | 'A' | 'B'`
- `Accidental` = `'natural' | 'sharp' | 'flat'`

**Rationale**: Cubre todas las 21 raíces con alteraciones simples (7 letras × 3 estados). Doble sostenido/bemol fuera de alcance (spec). La letra siempre mayúscula (FR-012).

**Alternatives considered**:
- *String libre (p.ej. "F#")*: No autovalidado. Rechazado por Principio III (Value Objects autovalidados).
- *Incluir dobles alteraciones*: Fuera del alcance definido en la spec. Se puede extender en futuras features.

## 3. Representación de Interval

**Decision**: `Interval` = `{ quality: IntervalQuality, number: IntervalNumber }` donde:
- `IntervalQuality` = `'perfect' | 'major' | 'minor' | 'diminished' | 'augmented'`
- `IntervalNumber` = `1 | 2 | 3 | 4 | 5 | 6 | 7`

Cada `Interval` sabe computar su tamaño en semitonos y aplicarse a una nota raíz para producir la nota resultante con deletreo correcto.

**Rationale**: Los intervalos de un acorde en esta feature son: unísono (1), tercera (3), quinta (5), y opcionalmente séptima (7). Pero modelar el Interval de forma genérica permite reutilización futura.

**Alternatives considered**:
- *Solo semitonos numéricos*: Pierde la semántica de "minor 3rd" vs "augmented 2nd". Rechazado.
- *Enum plano*: No permite composición ni cálculo. Rechazado.

## 4. Algoritmo de construcción de acordes (spelling correcto)

**Decision**: Construcción basada en intervalos, partiendo de la raíz:

1. Se define un template de intervalos por calidad de acorde (p.ej. `major` = `[P1, M3, P5]`, `minor seventh` = `[P1, m3, P5, m7]`).
2. Cada intervalo se aplica a la nota raíz usando aritmética de letras + ajuste por semitonos.
3. El algoritmo de aplicar un intervalo a una nota:
   - Avanzar la letra por el número genérico del intervalo (p.ej. M3 desde D → avanzar 2 letras → F).
   - Calcular los semitonos naturales entre las dos letras.
   - Ajustar la alteración de la nota destino para que la distancia en semitonos coincida con el intervalo.

**Rationale**: Este algoritmo produce deletreos enarmónicamente correctos por construcción. `Bdim7` → séptima disminuida desde B → avanzar 6 letras → A, ajustar → Ab. Nunca produce G#.

**Alternatives considered**:
- *Lookup table de todos los acordes*: 189 entradas, frágil, no extensible. Rechazado.
- *Pitch class + heurística de spelling posterior*: Error-prone para casos como `Bdim7`. Rechazado.

## 5. Diseño del Parser (ChordSymbolParser)

**Decision**: Parser como función pura en `adapters/`, NO en el dominio. Recibe string, retorna datos estructurados (raíz + calidad) o error. El dominio no sabe que existen strings de texto.

**Rationale**: Principio V (Puertos y Adaptadores) — el parser es un detalle de input. Principio VI (DTOs en fronteras) — el parser no devuelve entidades del dominio, sino datos crudos que el caso de uso o el código cliente usa para construir un `Chord`.

**Parsing strategy**: Regex secuencial estricto:
1. Extraer raíz: `[A-G]` seguido opcionalmente de `#` o `b`.
2. Extraer sufijo: match exacto contra tabla de sufijos canónicos.
3. Si hay caracteres restantes después del match → error.

**Alternatives considered**:
- *Parser combinatorio (parser combinator library)*: Overkill para gramática tan simple. Rechazado + viola "cero dependencias runtime".
- *Parser en el dominio*: Viola Principio I (Regla de Dependencia). Rechazado.

## 6. Manejo de errores

**Decision**: El parser lanza excepciones tipadas (`InvalidChordSymbolError`) con mensajes descriptivos. El dominio lanza excepciones de validación (`InvalidNoteError`, etc.) en constructores de Value Objects.

**Rationale**: Principio III — un objeto inválido no puede existir. El constructor es el guardián. Excepciones tipadas permiten al código cliente distinguir tipos de error.

**Alternatives considered**:
- *Result type (Either/Result monad)*: Más funcional pero añade complejidad y posible dependencia. Se puede migrar en el futuro. Para esta primera feature, excepciones tipadas son suficientes.
- *Códigos de error numéricos*: Menos expresivos. Rechazado.

## 7. Verificación de Regla de Dependencia

**Decision**: Script TypeScript (`scripts/check-dependency-rule.ts`) que parsea los imports de archivos en `src/harmonic-analysis/entities/` y verifica que ninguno apunte a `adapters/`, `use-cases/`, o fuera de `entities/` (excepto tipos de TypeScript puro). Ejecutable como test en Vitest y opcionalmente como pre-commit hook.

**Rationale**: Principio I exige verificación estática. Un test arquitectural es la forma más pragmática sin añadir dependencias de lint.

**Alternatives considered**:
- *ESLint con import rules*: Requiere instalar ESLint + plugins. Posible en el futuro pero viola "dependencias mínimas" para esta fase.
- *Verificación manual / code review*: No automatizable. Rechazado por la constitución.

## 8. Integración con music21 como oráculo

**Decision**: Script Python (`tests/oracle/music21-oracle.py`) que acepta un símbolo de acorde como argumento, lo analiza con music21, y emite un JSON con `{ root, notes, intervals, quality }`. Los tests de Vitest invocan el script vía `child_process.execSync` y comparan el resultado contra la salida del dominio.

**Rationale**: Principio VIII — music21 solo en tests. El script Python es la frontera; el dominio TypeScript no sabe que music21 existe.

**Formato de salida del oráculo**:
```json
{
  "root": "D",
  "notes": ["D", "F", "A", "C"],
  "intervals": ["P1", "m3", "P5", "m7"],
  "quality": "minor seventh"
}
```

**Alternatives considered**:
- *HTTP service wrapping music21*: Demasiada infraestructura. Rechazado.
- *WASM build de music21*: No existe. Rechazado.
- *Snapshot files pre-generados*: Frágil, pierde la propiedad de oráculo dinámico. Rechazado.

## 9. Sufijos canónicos — tabla definitiva

| Calidad | Sufijo canónico | Intervalos |
|---------|----------------|------------|
| Major (triad) | `""` | P1, M3, P5 |
| Minor (triad) | `"m"` | P1, m3, P5 |
| Diminished (triad) | `"dim"` | P1, m3, d5 |
| Augmented (triad) | `"aug"` o `"+"` | P1, M3, A5 |
| Major seventh | `"maj7"` | P1, M3, P5, M7 |
| Dominant seventh | `"7"` | P1, M3, P5, m7 |
| Minor seventh | `"m7"` | P1, m3, P5, m7 |
| Half-diminished seventh | `"m7b5"` | P1, m3, d5, m7 |
| Diminished seventh | `"dim7"` | P1, m3, d5, d7 |

> **Nota sobre "M7"**: La spec dice que `"maj7"` y `"M7"` son equivalentes para major seventh. Esto se maneja en el parser como un alias permitido. Sin embargo FR-011 dice "un solo sufijo canónico por calidad" y rechaza alias como `"min"`, `"-"`, `"Maj"`. La resolución es: `"maj7"` es el canónico; `"M7"` se acepta como sinónimo explícito del spec (`"maj7" y "M7" equivalentes para mayor séptima`). El parser reconoce ambos. Todos los demás alias se rechazan.

## 10. Tabla de semitonos naturales

Para el algoritmo de intervalos, se necesita la distancia en semitonos entre letras naturales:

```
C→D: 2, D→E: 2, E→F: 1, F→G: 2, G→A: 2, A→B: 2, B→C: 1
```

Esto se codifica como constante en el dominio (conocimiento de teoría musical pura).
