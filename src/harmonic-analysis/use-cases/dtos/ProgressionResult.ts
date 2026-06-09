import { ProgressionOutputDTO } from './ProgressionOutputDTO';

export type ProgressionError = Readonly<{
  code: 'INVALID_CHORD_SYMBOL' | 'INVALID_TONAL_CENTER' | 'MALFORMED_PROGRESSION';
  message: string;
  chordIndex?: number;
}>;

export type ProgressionAnalysisResult = 
  | { success: true; data: ProgressionOutputDTO }
  | { success: false; error: ProgressionError };
