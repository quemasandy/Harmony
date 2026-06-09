import { describe, test, expect, vi } from 'vitest';
import { WebMidiAdapter } from '../../../src/harmonic-analysis/frameworks/midi/web-midi-adapter';
import { AnalyzeProgressionInputPort } from '../../../src/harmonic-analysis/application/ports/AnalyzeProgressionInputPort';

describe('WebMidiAdapter', () => {
  test('initializes and listens to MIDI events, then sends progression to port', async () => {
    // Mock port
    const port: AnalyzeProgressionInputPort = {
      execute: vi.fn()
    };

    // Mock MIDI Access
    const mockInput = {
      onmidimessage: null as any
    };
    const mockMidiAccess = {
      inputs: new Map([['input1', mockInput]])
    };
    
    const requestMIDIAccessMock = vi.fn().mockResolvedValue(mockMidiAccess);
    (global as any).navigator = {
      requestMIDIAccess: requestMIDIAccessMock
    };

    const adapter = new WebMidiAdapter(port);
    await adapter.start();

    expect(requestMIDIAccessMock).toHaveBeenCalled();
    expect(mockInput.onmidimessage).toBeDefined();

    // Simulate C major chord
    const time = performance.now();
    
    // Note On channel 1
    mockInput.onmidimessage({
      data: new Uint8Array([0x90, 60, 100]), // C
      timeStamp: time
    });
    mockInput.onmidimessage({
      data: new Uint8Array([0x90, 64, 100]), // E
      timeStamp: time + 10
    });
    mockInput.onmidimessage({
      data: new Uint8Array([0x90, 67, 100]), // G
      timeStamp: time + 20
    });

    // Simulate silence threshold to flush
    mockInput.onmidimessage({
      data: new Uint8Array([0x90, 72, 100]), // Next chord C one octave up
      timeStamp: time + 600
    });

    expect(port.execute).toHaveBeenCalledWith({
      tonalCenter: 'C',
      chords: [
        { symbol: 'C' }
      ]
    });
  });
});
