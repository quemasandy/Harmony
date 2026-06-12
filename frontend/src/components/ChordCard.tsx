import { AnalyzedChordDTO } from '../types';

interface ChordCardProps {
  chord: AnalyzedChordDTO;
}

export function ChordCard({ chord }: ChordCardProps) {
  const tensions = chord.tensions.available ? chord.tensions.data.availableTensions : [];
  const avoidNotes = chord.tensions.available ? chord.tensions.data.avoidNotes : [];
  const tritoneSub = chord.tritoneSubstitutions.available && chord.tritoneSubstitutions.data.length > 0 
    ? chord.tritoneSubstitutions.data[0] 
    : undefined;

  return (
    <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 style={{ margin: 0, fontSize: '1.5rem', color: 'var(--primary-color)' }}>{chord.symbol}</h3>
        <span style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'var(--text-primary)' }}>{chord.harmonicFunction}</span>
      </div>

      {chord.isIIVI && (
        <div style={{ background: 'var(--success-color)', color: 'white', padding: '0.25rem 0.5rem', borderRadius: '4px', alignSelf: 'flex-start', fontSize: '0.875rem' }}>
          ii-V-I Pattern Detected
        </div>
      )}

      {(tensions.length > 0 || avoidNotes.length > 0) && (
        <div style={{ background: 'rgba(0,0,0,0.2)', padding: '1rem', borderRadius: '8px' }}>
          {tensions.length > 0 && (
            <div style={{ marginBottom: '0.5rem' }}>
              <strong style={{ color: 'var(--success-color)' }}>Tensions:</strong> {tensions.join(', ')}
            </div>
          )}
          {avoidNotes.length > 0 && (
            <div>
              <strong style={{ color: 'var(--error-color)' }}>Avoid Notes:</strong> {avoidNotes.join(', ')}
            </div>
          )}
        </div>
      )}

      {!chord.tensions.available && (
        <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', fontStyle: 'italic' }}>
          Tensions: {chord.tensions.reason}
        </div>
      )}

      {tritoneSub && (
        <div style={{ borderLeft: '3px solid var(--secondary-color)', paddingLeft: '1rem', marginTop: '0.5rem' }}>
          <strong style={{ color: 'var(--secondary-color)' }}>Tritone Substitution:</strong> {tritoneSub.substituteSymbol}
          <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
            {tritoneSub.explanation}
          </p>
        </div>
      )}
    </div>
  );
}
