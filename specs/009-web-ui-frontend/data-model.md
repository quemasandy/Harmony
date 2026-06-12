# Frontend Data Models

**Feature**: 009-web-ui-frontend
**Context**: React View Models and State Shapes

The frontend does not possess domain entities. It uses lightweight view models to manage form state and presentation data.

## 1. Form State

```typescript
type ChordInput = {
  id: string; // Unique ID for React rendering
  chordSymbol: string;
  chordScale: string; // From a fixed list of 7-note scales
  error?: string; // Specific error for this field
}

type ProgressionFormState = {
  tonalCenter: string;
  chords: ChordInput[];
  globalError?: string; // Server errors or form-level validation
  isSubmitting: boolean;
}
```

## 2. API Response DTOs (Consumed from F6)

These are the read-only models parsed from the backend JSON response.

```typescript
type ProgressionAnalysisResponse = {
  tonalCenter: string;
  chords: AnalyzedChordDTO[];
}

type AnalyzedChordDTO = {
  symbol: string;
  romanNumeral: string;
  quality: string;
  function: string;
  isIIVIPattern?: boolean;
  availableTensions: string[];
  avoidNotes: string[];
  tritoneSubstitution?: {
    symbol: string;
    romanNumeral: string;
    explanation: string;
  };
}
```

## 3. Validation Rules
- **Form Validation**: Checks that `tonalCenter` is not empty, and all `chordSymbol` fields are not empty before sending.
- **Server Validation (422)**: Server responds with validation errors indicating which index/field failed. The UI maps this error to the specific `ChordInput.error` field.
