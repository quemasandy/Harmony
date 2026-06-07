# Implementation Plan: Análisis de Acorde Individual

**Branch**: `001-chord-analysis` | **Date**: 2026-06-07 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `specs/001-chord-analysis/spec.md`

## Summary

Construir el núcleo de dominio puro para analizar un acorde individual: dado un símbolo textual (p.ej. `"Dm7"`), producir su nota raíz, lista de notas con deletreo enarmónico correcto, intervalos desde la raíz y calidad del acorde. La implementación sigue Clean Architecture estricta con TDD obligatorio y validación contra el oráculo `music21`.

## Technical Context

**Language/Version**: TypeScript 5.x estricto (`strict: true`, `noUncheckedIndexedAccess: true`, `exactOptionalPropertyTypes: true`)

**Primary Dependencies**: Ninguna en runtime — dominio puro sin dependencias externas. DevDependencies: `vitest`, `typescript`, script auxiliar Python para invocar `music21`.

**Storage**: N/A — lógica pura sin persistencia.

**Testing**: Vitest como test runner. `music21` como oráculo de validación invocado vía script Python auxiliar en tests.

**Target Platform**: Node.js / cualquier runtime TypeScript — biblioteca de dominio puro.

**Project Type**: Library (dominio puro, sin CLI/web/MIDI en esta fase).

**Performance Goals**: Análisis de un acorde individual imperceptible para el usuario (< 1ms).

**Constraints**: Cero dependencias de runtime. music21 solo en devDependencies y test runner.

**Scale/Scope**: 9 calidades de acorde × 21 raíces con alteraciones simples = 189 combinaciones válidas.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principio | Verificación Pre-Diseño | Estado |
|-----------|------------------------|--------|
| **I. Regla de Dependencia** | Entidades sin imports externos. Adaptador (parser) no importado por entidades. Script/lint para verificar. | ✅ PASS |
| **II. Entidades puras** | `Note`, `PitchClass`, `Interval`, `Chord` sin conocimiento de MIDI, web, JSON, frameworks. | ✅ PASS |
| **III. Value Objects inmutables** | `readonly` + `Object.freeze` en todos los Value Objects. Tests de inmutabilidad obligatorios. | ✅ PASS |
| **IV. Aggregate Root** | No aplica en esta feature (no hay `Progression`). `Chord` es una entidad independiente. | ✅ N/A |
| **V. Puertos y Adaptadores** | El parser de símbolos vive en `adapters/`, no en el dominio. | ✅ PASS |
| **VI. DTOs en fronteras** | El parser devuelve datos que el dominio consume vía su constructor, no expone entidades hacia fuera. | ✅ PASS |
| **VII. Screaming Architecture** | `src/harmonic-analysis/entities/`, `use-cases/`, `adapters/` — la raíz grita "análisis armónico". | ✅ PASS |
| **VIII. TDD + music21 oráculo** | Tests antes que implementación. music21 solo en tests. Ciclo Red→Green→Refactor. | ✅ PASS |

**Gate Result**: ✅ ALL PASS — proceder a Phase 0.

### Post-Design Re-Check (after Phase 1)

| Principio | Verificación Post-Diseño | Estado |
|-----------|--------------------------|--------|
| **I. Regla de Dependencia** | `data-model.md` confirma: entities/ no importa de adapters/ ni use-cases/. `ChordSymbolParser` importa de entities/ (hacia adentro). `dependency-rule.test.ts` automatiza verificación. | ✅ PASS |
| **II. Entidades puras** | `Note`, `PitchClass`, `Interval`, `Chord` no referencian string parsing, I/O, ni frameworks. Solo aritmética de teoría musical. | ✅ PASS |
| **III. Value Objects inmutables** | Todos los Value Objects usan `readonly` + `Object.freeze`. Tests de inmutabilidad planificados. Constructor rechaza inputs inválidos. | ✅ PASS |
| **IV. Aggregate Root** | N/A para esta feature. `Chord` no es Aggregate Root (no tiene hijos mutables). | ✅ N/A |
| **V. Puertos y Adaptadores** | `ChordSymbolParser` vive en `adapters/`. El dominio no sabe que existen strings. | ✅ PASS |
| **VI. DTOs en fronteras** | El contrato muestra que `parseChordSymbol` devuelve un `Chord` (Value Object inmutable). Para features futuras se evaluará si se necesita un DTO explícito; en esta feature, como es una library sin UI/web/CLI, el `Chord` VALUE OBJECT es aceptable como retorno público. | ✅ PASS |
| **VII. Screaming Architecture** | Estructura definida: `src/harmonic-analysis/{entities,use-cases,adapters}`. La raíz grita "análisis armónico". | ✅ PASS |
| **VIII. TDD + music21** | Orden de tasks: tests antes que implementación. `music21-oracle.py` planificado como script auxiliar. Ciclo TDD obligatorio. | ✅ PASS |

**Post-Design Gate Result**: ✅ ALL PASS — diseño conforme a los 8 principios.

## Project Structure

### Documentation (this feature)

```text
specs/001-chord-analysis/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output
│   └── chord-parser.contract.md
└── tasks.md             # Phase 2 output (/speckit-tasks)
```

### Source Code (repository root)

```text
src/
└── harmonic-analysis/
    ├── entities/
    │   ├── Note.ts            # Value Object: letra + alteración
    │   ├── PitchClass.ts      # Value Object: derivado de Note (0–11)
    │   ├── Interval.ts        # Value Object: distancia interválica
    │   ├── Chord.ts           # Entidad: raíz + notas + intervalos + calidad
    │   ├── ChordQuality.ts    # Enum/type: 9 calidades soportadas
    │   └── index.ts           # Barrel export (solo entidades)
    ├── use-cases/             # Vacío en esta feature
    │   └── (empty)
    └── adapters/
        └── ChordSymbolParser.ts  # Parser: "Dm7" → datos para construir Chord

tests/
├── unit/
│   ├── entities/
│   │   ├── Note.test.ts
│   │   ├── PitchClass.test.ts
│   │   ├── Interval.test.ts
│   │   ├── Chord.test.ts
│   │   └── ChordQuality.test.ts
│   └── adapters/
│       └── ChordSymbolParser.test.ts
├── oracle/
│   ├── music21-oracle.py     # Script auxiliar Python que invoca music21
│   └── chord-oracle.test.ts  # Tests que comparan dominio vs music21
└── architecture/
    └── dependency-rule.test.ts  # Verifica que imports del dominio no apuntan afuera

# Archivos raíz del proyecto
package.json
tsconfig.json
vitest.config.ts
scripts/
└── check-dependency-rule.ts   # Script/lint para verificar Regla de Dependencia
```

**Structure Decision**: Screaming Architecture (Principio VII). La raíz `src/` contiene `harmonic-analysis/` con los anillos como subdirectorios. Tests separados en `tests/` con subdirectorios por tipo (unit, oracle, architecture).

## Complexity Tracking

> No hay violaciones constitucionales que justificar. El diseño se alinea con los 8 principios.
