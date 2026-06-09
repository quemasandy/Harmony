# Data Model & DTOs

## Input DTO

```typescript
export type ProgressionInputDTO = Readonly<{
  tonalCenter: string;
  chords: ReadonlyArray<{
    symbol: string;
    chordScale?: string; // Optional explicit chord scale
  }>;
}>;
```

## Output DTO

```typescript
export type CapabilityResult<T> = 
  | { available: true; data: T }
  | { available: false; reason: string };

export type ChordAnalysisDTO = Readonly<{
  symbol: string;
  harmonicFunction: string; // e.g., "I", "ii7"
  isIIVI: boolean; // Part of a ii-V-I progression
  tensions: CapabilityResult<{
    availableTensions: ReadonlyArray<string>;
    avoidNotes: ReadonlyArray<string>;
  }>;
  tritoneSubstitutions: CapabilityResult<ReadonlyArray<{
    substituteSymbol: string;
    explanation: string;
  }>>;
}>;

export type ProgressionOutputDTO = Readonly<{
  tonalCenter: string;
  chords: ReadonlyArray<ChordAnalysisDTO>;
}>;

export type ProgressionError = Readonly<{
  code: 'INVALID_CHORD_SYMBOL' | 'INVALID_TONAL_CENTER' | 'MALFORMED_PROGRESSION';
  message: string;
  chordIndex?: number;
}>;

export type ProgressionAnalysisResult = 
  | { success: true; data: ProgressionOutputDTO }
  | { success: false; error: ProgressionError };
```
