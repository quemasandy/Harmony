export type ProgressionInputDTO = Readonly<{
  tonalCenter: string;
  chords: ReadonlyArray<{
    symbol: string;
    chordScale?: string;
  }>;
}>;
