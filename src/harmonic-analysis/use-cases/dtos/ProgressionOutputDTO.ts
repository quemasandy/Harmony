export type CapabilityResult<T> = 
  | { available: true; data: T }
  | { available: false; reason: string };

export type ChordAnalysisDTO = Readonly<{
  symbol: string;
  harmonicFunction: string;
  isIIVI: boolean;
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
