export type ChordInput = {
  id: string; // Unique ID for React rendering
  chordSymbol: string;
  chordScale: string; // From a fixed list of 7-note scales
  error?: string; // Specific error for this field
}

export type ProgressionFormState = {
  tonalCenter: string;
  chords: ChordInput[];
  globalError?: string; // Server errors or form-level validation
  isSubmitting: boolean;
}

export type CapabilityResult<T> = 
  | { available: true; data: T }
  | { available: false; reason: string };

export type AnalyzedChordDTO = {
  symbol: string;
  harmonicFunction: string;
  isIIVI: boolean;
  tensions: CapabilityResult<{
    availableTensions: string[];
    avoidNotes: string[];
  }>;
  tritoneSubstitutions: CapabilityResult<{
    substituteSymbol: string;
    explanation: string;
  }[]>;
}

export type ProgressionAnalysisResponse = {
  progression: {
    tonalCenter: string;
    chords: AnalyzedChordDTO[];
  };
}

export type ApiErrorResponse = {
  success: false;
  error: {
    code: string;
    message: string;
    chordIndex?: number;
  };
}
