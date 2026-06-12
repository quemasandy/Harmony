import { useState } from 'react';
import { ChordInput } from '../types';

interface ProgressionFormProps {
  onSubmit: (tonalCenter: string, chords: ChordInput[]) => void;
  isSubmitting: boolean;
  globalError?: string;
  fieldErrors?: {field: string, message: string}[];
}

const SUPPORTED_SCALES = [
  'Ionian', 'Dorian', 'Phrygian', 'Lydian', 'Mixolydian', 'Aeolian', 'Locrian',
  'Melodic Minor', 'Harmonic Minor'
];

export function ProgressionForm({ onSubmit, isSubmitting, globalError, fieldErrors = [] }: ProgressionFormProps) {
  const [tonalCenter, setTonalCenter] = useState('C');
  const [chords, setChords] = useState<ChordInput[]>([
    { id: 'initial-1', chordSymbol: 'Dm7', chordScale: 'Dorian' },
    { id: 'initial-2', chordSymbol: 'G7', chordScale: 'Mixolydian' },
    { id: 'initial-3', chordSymbol: 'Cmaj7', chordScale: 'Ionian' }
  ]);

  const addChord = () => {
    setChords([...chords, { id: crypto.randomUUID(), chordSymbol: '', chordScale: 'Ionian' }]);
  };

  const removeChord = (id: string) => {
    if (chords.length <= 1) return;
    setChords(chords.filter(c => c.id !== id));
  };

  const updateChord = (id: string, field: keyof ChordInput, value: string) => {
    setChords(chords.map(c => c.id === id ? { ...c, [field]: value } : c));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tonalCenter.trim()) return;
    if (chords.some(c => !c.chordSymbol.trim())) return;
    onSubmit(tonalCenter, chords);
  };

  return (
    <div className="glass-panel" style={{ padding: '2rem' }}>
      <h2>Analysis Input</h2>
      {globalError && <div className="banner banner-error">{globalError}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label" htmlFor="tonalCenter">Tonal Center</label>
          <input
            id="tonalCenter"
            className="input-field"
            value={tonalCenter}
            onChange={(e) => setTonalCenter(e.target.value)}
            placeholder="e.g. C, Fm, Bb"
            required
          />
        </div>

        <div style={{ marginTop: '2rem' }}>
          <h3 style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            Progression
            <button type="button" className="btn btn-primary" onClick={addChord} style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}>
              + Add Chord
            </button>
          </h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {chords.map((chord, index) => {
              const symbolError = fieldErrors.find(e => e.field === `chords[${index}].symbol`)?.message;
              const scaleError = fieldErrors.find(e => e.field === `chords[${index}].chordScale`)?.message;
              
              return (
                <div key={chord.id} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                  <div style={{ flex: 1 }}>
                    <input
                      className={`input-field ${symbolError ? 'error-field' : ''}`}
                      value={chord.chordSymbol}
                      onChange={(e) => updateChord(chord.id, 'chordSymbol', e.target.value)}
                      placeholder="Chord Symbol (e.g. Dm7)"
                      required
                    />
                    {symbolError && <div className="error-text">{symbolError}</div>}
                    {chord.error && !symbolError && <div className="error-text">{chord.error}</div>}
                  </div>
                  
                  <div style={{ flex: 1 }}>
                    <select
                      className={`select-field ${scaleError ? 'error-field' : ''}`}
                      value={chord.chordScale}
                      onChange={(e) => updateChord(chord.id, 'chordScale', e.target.value)}
                    >
                      {SUPPORTED_SCALES.map(scale => (
                        <option key={scale} value={scale}>{scale}</option>
                      ))}
                    </select>
                    {scaleError && <div className="error-text">{scaleError}</div>}
                  </div>
                  
                  <button
                    type="button"
                    className="btn"
                    onClick={() => removeChord(chord.id)}
                    disabled={chords.length <= 1}
                    style={{ background: 'transparent', color: 'var(--text-secondary)', border: '1px solid var(--surface-border)' }}
                  >
                    X
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        <div style={{ marginTop: '2rem', textAlign: 'right' }}>
          <button id="submit-btn" type="button" className="btn btn-primary" disabled={isSubmitting} onClick={handleSubmit}>
            {isSubmitting ? 'Analyzing...' : 'Analyze Progression'}
          </button>
        </div>
      </form>
    </div>
  );
}
