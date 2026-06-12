import { AnalyzedChordDTO } from '../types';
import { ChordCard } from './ChordCard';

interface AnalysisViewProps {
  tonalCenter: string;
  chords: AnalyzedChordDTO[];
}

export function AnalysisView({ tonalCenter, chords }: AnalysisViewProps) {
  return (
    <div className="glass-panel" style={{ padding: '2rem' }}>
      <h2 style={{ marginBottom: '1.5rem' }}>Analysis Results</h2>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
        Tonal Center: <strong style={{ color: 'var(--text-primary)' }}>{tonalCenter}</strong>
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
        {chords.map((chord, index) => (
          <ChordCard key={`${chord.symbol}-${index}`} chord={chord} />
        ))}
      </div>
    </div>
  );
}
