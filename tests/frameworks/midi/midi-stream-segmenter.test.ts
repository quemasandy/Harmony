import { describe, test, expect, vi } from 'vitest';
import { MidiStreamSegmenter } from '../../../src/harmonic-analysis/frameworks/midi/midi-stream-segmenter';
import { MidiSpellingPolicy } from '../../../src/harmonic-analysis/frameworks/midi/midi-spelling-policy';

describe('MidiStreamSegmenter', () => {
  const policy = new MidiSpellingPolicy();
  
  test('groups notes within 50ms into a single chord', () => {
    const onProgressionComplete = vi.fn();
    const segmenter = new MidiStreamSegmenter(policy, 50, 500, onProgressionComplete);

    segmenter.handleEvent({ noteNumber: 60, velocity: 100, timestamp: 1000, type: 'note-on' });
    segmenter.handleEvent({ noteNumber: 64, velocity: 100, timestamp: 1010, type: 'note-on' });
    segmenter.handleEvent({ noteNumber: 67, velocity: 100, timestamp: 1020, type: 'note-on' });

    // Flush progression manually by triggering timeout
    segmenter.flush();

    expect(onProgressionComplete).toHaveBeenCalledWith({
      tonalCenter: 'C', // assuming first chord root is the tonal center for simplicity
      chords: [
        { symbol: 'C' }
      ]
    });
  });

  test('identifies major seventh and minor chords', () => {
    const onProgressionComplete = vi.fn();
    const segmenter = new MidiStreamSegmenter(policy, 50, 500, onProgressionComplete);

    // D minor 7
    segmenter.handleEvent({ noteNumber: 62, velocity: 100, timestamp: 1000, type: 'note-on' }); // D
    segmenter.handleEvent({ noteNumber: 65, velocity: 100, timestamp: 1000, type: 'note-on' }); // F
    segmenter.handleEvent({ noteNumber: 69, velocity: 100, timestamp: 1000, type: 'note-on' }); // A
    segmenter.handleEvent({ noteNumber: 72, velocity: 100, timestamp: 1000, type: 'note-on' }); // C

    // Advance time within silence threshold
    segmenter.handleEvent({ noteNumber: 67, velocity: 100, timestamp: 1400, type: 'note-on' }); // G dominant 7
    segmenter.handleEvent({ noteNumber: 71, velocity: 100, timestamp: 1400, type: 'note-on' }); // B
    segmenter.handleEvent({ noteNumber: 74, velocity: 100, timestamp: 1400, type: 'note-on' }); // D
    segmenter.handleEvent({ noteNumber: 77, velocity: 100, timestamp: 1400, type: 'note-on' }); // F

    segmenter.flush();

    expect(onProgressionComplete).toHaveBeenCalledWith({
      tonalCenter: 'D', 
      chords: [
        { symbol: 'Dm7' },
        { symbol: 'G7' }
      ]
    });
  });

  test('ignores note-off events', () => {
    const onProgressionComplete = vi.fn();
    const segmenter = new MidiStreamSegmenter(policy, 50, 500, onProgressionComplete);

    segmenter.handleEvent({ noteNumber: 60, velocity: 100, timestamp: 1000, type: 'note-on' });
    segmenter.handleEvent({ noteNumber: 60, velocity: 0, timestamp: 1010, type: 'note-off' });

    segmenter.flush();

    expect(onProgressionComplete).toHaveBeenCalledWith({
      tonalCenter: 'C',
      chords: [{ symbol: 'C' }] // Defaults to major triad if only one note is played or falls back to 'C'
    });
  });
});
