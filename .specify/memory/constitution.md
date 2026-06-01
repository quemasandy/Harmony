<!--
=== SYNC IMPACT REPORT ===
Version change: (new) → 1.0.0
Modified principles: N/A (initial creation)
Added sections:
  - Core Principles (I–VIII): 8 non-negotiable architectural principles
  - Technology Stack: TypeScript strict, Clean Architecture
  - Development Workflow: TDD-first, music21 as oracle
  - Governance: Amendment procedure, versioning policy, compliance review
Removed sections: N/A
Templates requiring updates:
  - .specify/templates/plan-template.md      ✅ compatible (Constitution Check section present)
  - .specify/templates/spec-template.md      ✅ compatible (Key Entities aligns with Principle II)
  - .specify/templates/tasks-template.md     ✅ compatible (test-first ordering aligns with Principle VIII)
Follow-up TODOs: None
===========================
-->

# Harmony Constitution

## Core Principles

### I. La Regla de Dependencia es absoluta

El código depende **solo hacia adentro**, en cuatro anillos concéntricos
estrictamente ordenados:

1. **Entidades** — reglas de teoría musical pura.
2. **Casos de Uso** — reglas de aplicación.
3. **Adaptadores de Interfaz** — controllers, presenters, gateways.
4. **Frameworks & Drivers** — MIDI, web, CLI, persistencia.

Ningún anillo interior DEBE conocer nada de un anillo exterior: ni un
`import`, ni un tipo, ni un nombre. Toda violación es un fallo de build,
no una sugerencia. Las dependencias de TypeScript DEBEN reflejar esta
topología; un análisis estático o lint rule DEBE poder verificarlo.

### II. Entidades de teoría musical pura

`Note`, `PitchClass`, `Interval`, `Chord`, `Scale`, `Mode` y
`Progression` viven en el centro del sistema y no importan nada externo.
No saben que existen MIDI, web, JSON, archivos, frameworks ni el tiempo
real. Codifican reglas verdaderas de teoría musical que permanecerían
válidas aunque la aplicación no exista. Cualquier conocimiento del mundo
exterior en estas entidades es una violación constitucional.

### III. Value Objects inmutables y autovalidados

Todo en el dominio es `readonly`, sin setters. Cada Value Object valida
sus invariantes en el constructor: un objeto inválido **no puede existir**.
La comparación se realiza por valor, nunca por referencia. Se DEBE usar
`Object.freeze` o propiedades `readonly` de TypeScript estricto para
garantizar inmutabilidad en tiempo de ejecución y compilación.

### IV. Aggregate Root y consistencia transaccional

`Progression` es el Aggregate Root: la única vía de acceso a su
jerarquía de acordes y garante de las invariantes de resolución funcional.
Sus hijos (acordes internos, relaciones funcionales) no se mutan desde
fuera del Aggregate Root. Toda modificación de estado pasa por métodos
del Aggregate Root que preservan las invariantes del dominio.

### V. Puertos y Adaptadores: toda I/O es un detalle

Toda comunicación con el exterior cruza un **puerto** (interface TypeScript)
definido por el interior; la infraestructura lo implementa. El dominio
declara **qué** necesita, jamás **cómo**. Inversión de dependencia en cada
frontera.

Ejemplos no-normativos de adaptadores intercambiables:

- Salida MIDI
- Entrada de teclado MIDI vía Web MIDI API
- Presenter JSON
- Persistencia (archivos, IndexedDB, etc.)

Cambiar cualquier adaptador no DEBE tocar el núcleo. La prueba de fuego:
reemplazar un adaptador MIDI por un stub en tests sin modificar una sola
línea del dominio ni de los casos de uso.

### VI. Las fronteras se cruzan con DTOs, nunca con entidades

Las entidades del dominio no se filtran hacia afuera. Un presenter mapea
el resultado del dominio a la forma que el exterior requiere. Estructuras
de datos simples (DTOs, plain objects) cruzan los límites; objetos de
dominio **no**. Ningún tipo del anillo de Entidades o Casos de Uso DEBE
aparecer en la firma pública de un adaptador o framework.

### VII. Screaming Architecture

La estructura de carpetas de nivel superior DEBE gritar "análisis
armónico", no "app web" ni "app de MIDI" ni "proyecto Node". Nombres
como `harmonic-analysis/`, `entities/`, `use-cases/` dominan la raíz
del `src/`. El mecanismo de entrega — web, CLI, MIDI — es un detalle al
borde, decidido lo más tarde posible y alojado bajo directorios
periféricos como `adapters/` o `drivers/`.

### VIII. Humble Object en los bordes + TDD estricto

La lógica difícil de testear (driver MIDI real, tiempo real, UI) se
mantiene **mínima y tonta**, aislada de la lógica con reglas. El núcleo
se prueba completo sin infraestructura.

**Ningún código de implementación antes de tests.** El ciclo
Red → Green → Refactor es obligatorio para toda lógica de dominio y
casos de uso.

`music21` se usa como **oráculo de validación solo en tests**, para
verificar la corrección de las reglas de teoría musical. NUNCA se usa
en producción ni en el dominio — es una dependencia exclusiva de
`devDependencies` y del test runner.

## Technology Stack

- **Lenguaje**: TypeScript estricto (`strict: true`, `noUncheckedIndexedAccess`,
  `exactOptionalPropertyTypes`).
- **Arquitectura**: Clean Architecture pura — cuatro anillos concéntricos.
- **Oráculo de tests**: `music21` (Python, invocado desde tests vía
  script auxiliar) — solo en `devDependencies`.
- **Mecanismos de entrega**: web, CLI, MIDI — detalles al borde,
  decididos lo más tarde posible.

## Development Workflow

1. **Constitución primero**: toda spec, plan y task DEBE consultar y
   respetar este documento. Una violación constitucional invalida el
   artefacto.
2. **TDD obligatorio**: test → fallo rojo → implementación mínima →
   verde → refactor. Sin excepciones para dominio y casos de uso.
3. **Verificación estática de dependencias**: un lint rule o script
   DEBE verificar que ningún import viola la Regla de Dependencia.
4. **Validación con music21**: los tests de dominio DEBEN incluir
   comparaciones contra el oráculo `music21` para intervalos, escalas,
   modos y progresiones.
5. **Inmutabilidad verificable**: los tests DEBEN incluir assertions que
   confirmen que las entidades son inmutables (intentar mutar lanza error).

## Governance

- Esta constitución **prevalece** sobre cualquier otra práctica,
  convención o decisión de diseño.
- **Enmiendas** requieren: documentación explícita del cambio, justificación,
  análisis de impacto en artefactos dependientes, y actualización de versión
  semántica.
- **Revisión de cumplimiento**: todo PR, spec, plan y task DEBE verificar
  conformidad con los ocho principios antes de aprobarse.
- **Versionado semántico de la constitución**:
  - MAJOR: eliminación o redefinición incompatible de principios.
  - MINOR: adición de principio o expansión material de guía.
  - PATCH: clarificaciones, correcciones de redacción, refinamientos
    no semánticos.

**Version**: 1.0.0 | **Ratified**: 2026-06-01 | **Last Amended**: 2026-06-01
