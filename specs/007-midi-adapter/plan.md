# Implementation Plan: F7 MIDI Adapter

**Branch**: `007-midi-adapter` | **Date**: 2026-06-09 | **Spec**: [spec.md](file:///Users/andy/Learning/Harmony/specs/007-midi-adapter/spec.md)

**Input**: Feature specification from `/specs/007-midi-adapter/spec.md`

## Summary

Implement a MIDI adapter via Web MIDI API residing in the outermost Frameworks & Drivers ring. It will act as the second input adapter alongside F6's web adapter. The adapter performs pure I/O translation with no domain logic: it receives MIDI events, groups them into chords (50ms window) and progressions (silence threshold), translates pitch classes to spelled notes using a strict sharp-default policy, and invokes the existing `AnalyzeProgressionInputPort` via a `ProgressionInputDTO`.

## Technical Context

**Language/Version**: TypeScript strict

**Primary Dependencies**: Web MIDI API (`@types/webmidi` for types)

**Storage**: N/A

**Testing**: Jest (or current test runner), mocking Web MIDI API entirely. No `music21` tests needed for this adapter.

**Target Platform**: Browser (Web MIDI supported environments)

**Project Type**: Web Application (Adapter for existing use cases)

**Performance Goals**: Low latency (<50ms processing time)

**Constraints**: Strict isolation from domain layers. The adapter must depend ONLY on the input port and DTOs.

**Scale/Scope**: Real-time MIDI event streams mapped to single progression analyses.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **Principle I (Dependency Rule)**: ✅ Adapter lives in `frameworks/midi` and only imports `application/ports` and `application/dtos`. We will add an architecture test to enforce no inward dependencies from inner rings to `frameworks/midi`.
- **Principle II (Pure Entities)**: ✅ Domain entities remain completely unaware of MIDI.
- **Principle V (Ports and Adapters)**: ✅ Adapter invokes the existing `AnalyzeProgressionInputPort`. No new port is created.
- **Principle VI (DTOs across boundaries)**: ✅ Adapter constructs `ProgressionInputDTO` to pass data.
- **Principle VIII (Humble Object)**: ✅ Real Web MIDI API I/O is isolated in a single composition point and mocked for tests. Strict TDD used.

## Project Structure

### Documentation (this feature)

```text
specs/007-midi-adapter/
├── plan.md              # This file
├── research.md          # Research and decisions
├── data-model.md        # Data entities (none new for domain, only adapter types)
└── contracts/           # Integration points
```

### Source Code (repository root)

```text
src/
├── application/
│   ├── ports/
│   │   └── analyze-progression-input.port.ts (existing)
│   └── dtos/
│       └── progression-input.dto.ts (existing)
└── frameworks/
    └── midi/
        ├── web-midi-adapter.ts
        ├── midi-stream-segmenter.ts
        ├── midi-spelling-policy.ts
        └── index.ts

tests/
├── architecture/
│   └── dependency-rule.test.ts (add test to fail if inner imports frameworks/midi)
└── frameworks/
    └── midi/
        ├── web-midi-adapter.test.ts
        ├── midi-stream-segmenter.test.ts
        └── midi-spelling-policy.test.ts
```

**Structure Decision**: The adapter will reside in `src/frameworks/midi/`.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

(No violations. Pure adapter implementation.)
