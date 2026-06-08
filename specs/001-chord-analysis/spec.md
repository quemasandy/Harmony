# Feature Specification: Análisis de Acorde Individual

**Feature Branch**: `001-chord-analysis`

**Created**: 2026-06-07

**Status**: Draft

**Input**: User description: "Construye la primera feature del Motor de Análisis Armónico: el análisis de un acorde individual. Como músico estudiando armonía, quiero ingresar el símbolo de un acorde y obtener su análisis estructural."

## Clarifications

### Session 2026-06-07

- Q: ¿Se acepta un solo sufijo canónico por calidad de acorde, o múltiples alias (p.ej. "m", "min", "-" para menor)? → A: Un solo sufijo canónico por calidad. Alias adicionales quedan para features futuras.
- Q: ¿El parser es case-sensitive? ¿Se acepta "cmaj7" o "CM7"? → A: Case-sensitive estricto. La raíz DEBE ser mayúscula (A–G), los sufijos DEBEN coincidir exactamente con la forma canónica. Entradas como "cmaj7" o "CM7" se rechazan.

## User Scenarios & Testing *(mandatory)*

### User Story 1 — Analizar un acorde válido (Priority: P1)

Como músico estudiando armonía, quiero ingresar el símbolo de un acorde (por ejemplo "Dm7", "G7", "Cmaj7") y recibir su análisis estructural completo: nota raíz, notas que lo componen con deletreo enarmónico correcto, intervalos desde la raíz y calidad del acorde.

**Why this priority**: Es la razón de ser de la feature. Sin esta historia no existe funcionalidad alguna.

**Independent Test**: Se puede verificar de forma aislada invocando el análisis con cualquier símbolo válido y comparando cada campo del resultado contra el oráculo music21.

**Acceptance Scenarios**:

1. **Given** el símbolo `"Cmaj7"`, **When** se solicita el análisis, **Then** el resultado contiene: raíz `C`, notas `[C, E, G, B]`, intervalos `[unison, major 3rd, perfect 5th, major 7th]`, calidad `major seventh`.
2. **Given** el símbolo `"Dm7"`, **When** se solicita el análisis, **Then** el resultado contiene: raíz `D`, notas `[D, F, A, C]`, intervalos `[unison, minor 3rd, perfect 5th, minor 7th]`, calidad `minor seventh`.
3. **Given** el símbolo `"G7"`, **When** se solicita el análisis, **Then** el resultado contiene: raíz `G`, notas `[G, B, D, F]`, intervalos `[unison, major 3rd, perfect 5th, minor 7th]`, calidad `dominant seventh`.
4. **Given** el símbolo `"F#m7b5"`, **When** se solicita el análisis, **Then** el resultado contiene: raíz `F#`, notas `[F#, A, C, E]`, intervalos `[unison, minor 3rd, diminished 5th, minor 7th]`, calidad `half-diminished seventh`.
5. **Given** el símbolo `"Bdim7"`, **When** se solicita el análisis, **Then** el resultado contiene: raíz `B`, notas `[B, D, F, Ab]`, intervalos `[unison, minor 3rd, diminished 5th, diminished 7th]`, calidad `diminished seventh`.

---

### User Story 2 — Analizar tríadas (Priority: P1)

Como músico, quiero analizar tríadas (mayor, menor, disminuida, aumentada) con el mismo nivel de detalle, para entender los acordes más básicos.

**Why this priority**: Las tríadas son la base de toda armonía y deben estar soportadas desde el primer día junto con las séptimas.

**Independent Test**: Se puede verificar invocando el análisis con símbolos de tríada y comparando contra music21.

**Acceptance Scenarios**:

1. **Given** el símbolo `"C"`, **When** se solicita el análisis, **Then** el resultado contiene: raíz `C`, notas `[C, E, G]`, intervalos `[unison, major 3rd, perfect 5th]`, calidad `major`.
2. **Given** el símbolo `"Dm"`, **When** se solicita el análisis, **Then** el resultado contiene: raíz `D`, notas `[D, F, A]`, intervalos `[unison, minor 3rd, perfect 5th]`, calidad `minor`.
3. **Given** el símbolo `"Bdim"`, **When** se solicita el análisis, **Then** el resultado contiene: raíz `B`, notas `[B, D, F]`, intervalos `[unison, minor 3rd, diminished 5th]`, calidad `diminished`.
4. **Given** el símbolo `"Caug"` o `"C+"`, **When** se solicita el análisis, **Then** el resultado contiene: raíz `C`, notas `[C, E, G#]`, intervalos `[unison, major 3rd, augmented 5th]`, calidad `augmented`.

---

### User Story 3 — Rechazar un símbolo inválido (Priority: P1)

Como músico, quiero recibir un mensaje de error claro cuando ingreso un símbolo de acorde malformado o no reconocido, para saber que debo corregir mi entrada.

**Why this priority**: Un sistema robusto debe rechazar entradas inválidas de forma clara. Sin esta historia, errores silenciosos producirían resultados incorrectos.

**Independent Test**: Se puede verificar invocando el análisis con símbolos inválidos y confirmando que el sistema rechaza cada uno sin producir ningún acorde.

**Acceptance Scenarios**:

1. **Given** el símbolo `"XYZ"`, **When** se solicita el análisis, **Then** el sistema rechaza la entrada con un mensaje de error claro indicando que el símbolo no es reconocido y no produce ningún resultado de acorde.
2. **Given** el símbolo `""` (cadena vacía), **When** se solicita el análisis, **Then** el sistema rechaza la entrada con un mensaje de error claro.
3. **Given** el símbolo `"Hm7"`, **When** se solicita el análisis, **Then** el sistema rechaza la entrada porque `H` no es una nota raíz válida en el sistema de nomenclatura anglosajona.

---

### Edge Cases

- ¿Qué sucede cuando el símbolo tiene espacios al inicio o al final? El sistema los ignora (trim) antes de analizar.
- ¿Qué sucede con raíces con sostenidos y bemoles? Símbolos como `"F#"`, `"Bb"`, `"Ebm7"`, `"Abmaj7"` deben analizarse correctamente.
- ¿Qué sucede con doble sostenido o doble bemol en la raíz (p.ej. `"Fbb"`)? El sistema los rechaza en esta versión (fuera de alcance).
- ¿Qué sucede con notación de acorde no soportada (p.ej. `"C9"`, `"Dm11"`, `"G13"`)? El sistema los rechaza con un mensaje que indica que solo se soportan tríadas y séptimas en esta versión.
- ¿Qué ocurre con las notas enarmónicas en el resultado? El deletreo siempre refleja la enarmonía teóricamente correcta según la estructura interválica del acorde. Por ejemplo, `Bdim7` devuelve `Ab` (no `G#`) porque el intervalo desde B es una séptima disminuida.
- ¿Qué sucede con mayúsculas/minúsculas incorrectas (p.ej. `"cmaj7"`, `"CM7"`, `"dM7"`)? El sistema las rechaza. La raíz debe ser una letra mayúscula (A–G) y los sufijos deben coincidir exactamente con la forma canónica.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: El sistema DEBE aceptar un símbolo de acorde como texto y producir un análisis estructural completo.
- **FR-002**: El análisis DEBE incluir: nota raíz, lista ordenada de notas del acorde, lista de intervalos desde la raíz, y calidad del acorde.
- **FR-003**: Las notas del resultado DEBEN deletrearse con la enarmonía musicalmente correcta según la estructura interválica del acorde. El spelling es parte de la semántica del resultado, no un aspecto cosmético.
- **FR-004**: El sistema DEBE soportar tríadas con los siguientes sufijos canónicos: mayor (`""`), menor (`"m"`), disminuida (`"dim"`), aumentada (`"aug"` o `"+"`).
- **FR-005**: El sistema DEBE soportar acordes de séptima con los siguientes sufijos canónicos: major seventh (`"maj7"` o `"M7"`), dominant seventh (`"7"`), minor seventh (`"m7"`), half-diminished seventh (`"m7b5"`), diminished seventh (`"dim7"`).
- **FR-011**: El sistema DEBE aceptar exclusivamente los sufijos canónicos listados en FR-004 y FR-005. Cualquier otro sufijo o alias (p.ej. `"min"`, `"-"`, `"Maj"`, `"°"`, `"ø"`) DEBE ser rechazado como símbolo no reconocido. Nota: `"M7"` es un sinónimo aceptado de `"maj7"` (ver FR-005) y NO se considera un alias rechazado. Alias adicionales podrán añadirse en versiones futuras.
- **FR-006**: El sistema DEBE soportar raíces con sostenido (`#`) y bemol (`b`), desde `C` hasta `B` con todas las alteraciones simples.
- **FR-007**: El sistema DEBE rechazar símbolos de acorde inválidos, malformados o no reconocidos con un mensaje de error claro y sin producir ningún resultado de acorde.
- **FR-008**: El sistema DEBE rechazar tipos de acorde no soportados en esta versión (novenas, oncenas, trecenas, sus, add, etc.) con un mensaje informativo.
- **FR-009**: El sistema DEBE ignorar espacios en blanco al inicio y al final del símbolo antes de procesarlo.
- **FR-010**: La corrección de cada análisis DEBE ser verificable de forma independiente contra music21 como oráculo en los tests.
- **FR-012**: El parser DEBE ser case-sensitive estricto. La nota raíz DEBE ser una letra mayúscula (A–G) y los sufijos DEBEN coincidir exactamente con la forma canónica definida en FR-004 y FR-005. Entradas con casing incorrecto (p.ej. `"cmaj7"`, `"CM7"`, `"dM7"`) DEBEN ser rechazadas.

### Key Entities

- **Chord**: Value Object que representa un acorde analizado. Contiene: nota raíz (`root`), lista de notas con deletreo enarmónico correcto (`notes`), intervalos desde la raíz (`intervals`), y calidad del acorde (`quality`). Se construye a partir de una raíz + calidad; sus notas se derivan por aplicación de intervalos.
- **Note / PitchClass**: Representación de una nota musical con su nombre (letra) y alteración, que respeta las reglas de enarmonía. `PitchClass` (0–11) se deriva de `Note` cuando se necesite.
- **Interval**: Representación de la distancia interválica entre dos notas (p.ej. "major 3rd", "diminished 5th"). Sabe aplicarse a una nota raíz para producir la nota resultante con deletreo correcto.
- **ChordQuality**: Clasificación de la calidad del acorde (major, minor, diminished, augmented, major-seventh, dominant-seventh, minor-seventh, half-diminished-seventh, diminished-seventh).
- **ChordSymbolParser**: Adaptador que convierte un símbolo textual (p.ej. "Dm7") en un `Chord`. Vive en la capa de adaptadores, no en el dominio.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: El 100% de los acordes soportados (tríadas y séptimas, en las 4 + 5 calidades definidas, para las 21 raíces con alteraciones simples) produce un resultado correcto verificable contra music21.
- **SC-002**: El 100% de los símbolos inválidos o no soportados es rechazado con un mensaje de error — no se produce ningún resultado de acorde parcial o incorrecto.
- **SC-003**: El deletreo enarmónico de cada nota en cada acorde soportado coincide exactamente con el que produce music21 para la misma entrada.
- **SC-004**: El tiempo para analizar un acorde individual es imperceptible para el usuario (respuesta inmediata).

## Assumptions

- El sistema usa nomenclatura anglosajona (A–G) para las notas. La notación latina (Do, Re, Mi) está fuera de alcance de esta versión.
- Solo se soportan alteraciones simples en la raíz (sostenido `#` y bemol `b`). Doble sostenido (`##` / `x`) y doble bemol (`bb`) en la raíz están fuera de alcance.
- La feature es una pieza de lógica de dominio pura, sin interfaz gráfica, sin CLI, sin MIDI. El punto de entrada es programático (una función o método).
- music21 se utiliza exclusivamente como oráculo en tests (devDependency), nunca en producción ni en el dominio, conforme al Principio VIII de la constitución.
- Explícitamente fuera de alcance: progresiones, función armónica, detección de ii-V-I, tensiones disponibles, avoid notes, sustituciones, interfaz web y MIDI.
- Los acordes se analizan en posición fundamental (root position). Inversiones están fuera de alcance de esta versión.
