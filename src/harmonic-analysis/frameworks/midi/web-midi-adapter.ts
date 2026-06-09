import { AnalyzeProgressionInputPort } from '../../application/ports/AnalyzeProgressionInputPort';
import { MidiStreamSegmenter } from './midi-stream-segmenter';
import { MidiSpellingPolicy } from './midi-spelling-policy';

export class WebMidiAdapter {
  private segmenter: MidiStreamSegmenter;

  constructor(private port: AnalyzeProgressionInputPort) {
    const policy = new MidiSpellingPolicy();
    this.segmenter = new MidiStreamSegmenter(policy, 50, 500, (dto) => {
      this.port.execute(dto);
    });
  }

  async start(): Promise<void> {
    if (typeof navigator === 'undefined' || !navigator.requestMIDIAccess) {
      throw new Error('Web MIDI API is not supported in this environment.');
    }

    const midiAccess = await navigator.requestMIDIAccess();
    
    // Listen to all inputs
    for (const input of midiAccess.inputs.values()) {
      input.onmidimessage = this.handleMidiMessage.bind(this);
    }
  }

  private handleMidiMessage(message: any) {
    const data = message.data;
    if (!data || data.length < 3) return;

    const status = data[0];
    const noteNumber = data[1];
    const velocity = data[2];

    // Status bytes 0x90 to 0x9F are Note On for channels 1-16
    if (status >= 0x90 && status <= 0x9F) {
      this.segmenter.handleEvent({
        noteNumber,
        velocity,
        timestamp: message.timeStamp || performance.now(),
        type: velocity === 0 ? 'note-off' : 'note-on'
      });
    }
    // Status bytes 0x80 to 0x8F are Note Off
    else if (status >= 0x80 && status <= 0x8F) {
      this.segmenter.handleEvent({
        noteNumber,
        velocity: 0,
        timestamp: message.timeStamp || performance.now(),
        type: 'note-off'
      });
    }
  }
}
