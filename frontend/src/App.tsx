import { useState } from 'react';
import './index.css';
import { ProgressionForm } from './components/ProgressionForm';
import { AnalysisView } from './components/AnalysisView';
import { ChordInput, AnalyzedChordDTO, ApiErrorResponse } from './types';

function App() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [globalError, setGlobalError] = useState<string | undefined>();
  const [fieldErrors, setFieldErrors] = useState<{field: string, message: string}[]>([]);
  const [analysisResult, setAnalysisResult] = useState<{ tonalCenter: string, chords: AnalyzedChordDTO[] } | null>(null);

  const handleAnalyze = async (tonalCenter: string, chords: ChordInput[]) => {
    setIsSubmitting(true);
    setGlobalError(undefined);
    setFieldErrors([]);
    setAnalysisResult(null);

    try {
      const payload = {
        tonalCenter,
        chords: chords.map(c => ({
          symbol: c.chordSymbol,
          chordScale: c.chordScale
        }))
      };

      const response = await fetch('/api/v1/analyze/progression', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        const payload = await response.json();
        // The F5 JSON contract uses `{ success: true, data: { tonalCenter, chords } }`
        const resultData = payload.data;
        if (resultData && resultData.chords) {
          setAnalysisResult(resultData);
        } else {
          setGlobalError('Received malformed data from the server.');
        }
      } else if (response.status === 422) {
        const errorData: ApiErrorResponse = await response.json();
        const err = errorData.error;
        if (err.chordIndex !== undefined) {
          setFieldErrors([{ field: `chords[${err.chordIndex}].symbol`, message: err.message }]);
          setGlobalError('Please correct the highlighted fields.');
        } else {
          setGlobalError(err.message || 'Validation failed');
        }
      } else {
        setGlobalError('An unexpected server error occurred. Please try again later.');
      }
    } catch (err) {
      setGlobalError('Failed to connect to the server.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="app-container">
      <header className="header">
        <h1>Harmony Analyzer</h1>
        <p>Functional progression analysis and chord-scale visualization</p>
      </header>

      <main style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        <ProgressionForm 
          onSubmit={handleAnalyze} 
          isSubmitting={isSubmitting} 
          globalError={globalError} 
          fieldErrors={fieldErrors}
        />
        
        {analysisResult && (
          <AnalysisView tonalCenter={analysisResult.tonalCenter} chords={analysisResult.chords} />
        )}
      </main>

      <footer style={{ textAlign: 'center', marginTop: 'auto', padding: '2rem', color: 'var(--text-secondary)' }}>
        <p>Built as a Humble Object. All logic driven by the F6 API.</p>
      </footer>
    </div>
  );
}

export default App;
