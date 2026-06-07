# Quickstart: Análisis de Acorde Individual

**Feature**: 001-chord-analysis | **Date**: 2026-06-07

## Prerequisites

- **Node.js** ≥ 18
- **Python 3** con `music21` instalado (`pip install music21`) — solo para ejecutar tests de oráculo
- **pnpm** o **npm** — gestor de paquetes

## Setup

```bash
# Desde la raíz del proyecto
npm init -y
npm install --save-dev typescript vitest

# Configurar TypeScript estricto
npx tsc --init \
  --strict true \
  --noUncheckedIndexedAccess true \
  --exactOptionalPropertyTypes true \
  --target ES2022 \
  --module NodeNext \
  --moduleResolution NodeNext \
  --outDir dist \
  --rootDir src \
  --declaration true \
  --sourceMap true

# Verificar que music21 está disponible para el oráculo
python3 -c "import music21; print(music21.VERSION_STR)"
```

## Project Structure

```text
src/harmonic-analysis/
├── entities/          # Dominio puro: Note, PitchClass, Interval, Chord
├── use-cases/         # Vacío en esta feature
└── adapters/          # Parser de símbolos de acorde

tests/
├── unit/              # Tests unitarios del dominio
├── oracle/            # Comparación contra music21
└── architecture/      # Verificación de Regla de Dependencia
```

## Running Tests

```bash
# Ejecutar todos los tests
npx vitest run

# Ejecutar solo tests unitarios
npx vitest run tests/unit

# Ejecutar tests de oráculo (requiere Python + music21)
npx vitest run tests/oracle

# Ejecutar tests de arquitectura
npx vitest run tests/architecture

# Watch mode durante desarrollo (TDD)
npx vitest
```

## Usage Example (programático)

```typescript
import { parseChordSymbol } from './src/harmonic-analysis/adapters/ChordSymbolParser';

const chord = parseChordSymbol('Dm7');

console.log(chord.root.toString());     // "D"
console.log(chord.quality);             // "minor-seventh"
console.log(chord.notes.map(n => n.toString()));  // ["D", "F", "A", "C"]
console.log(chord.intervals.map(i => i.toString())); // ["perfect unison", "minor 3rd", "perfect 5th", "minor 7th"]
```

## TDD Workflow

El ciclo obligatorio para cada entidad:

1. **🔴 Red**: Escribir test que describe el comportamiento deseado → falla.
2. **🟢 Green**: Implementar el código mínimo para que pase.
3. **♻️ Refactor**: Limpiar sin romper tests.

Orden de implementación (tests primero en cada paso):

1. `Note` → tests de creación, validación, inmutabilidad, igualdad
2. `PitchClass` → tests de derivación desde Note
3. `Interval` → tests de semitonos, aplicación a nota raíz, spelling
4. `ChordQuality` → tests de templates de intervalos
5. `Chord` → tests de construcción desde raíz + calidad
6. `ChordSymbolParser` → tests de parsing, errores, edge cases
7. Tests de oráculo → comparación contra music21
8. Tests de arquitectura → verificación de Regla de Dependencia
