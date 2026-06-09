import { ProgressionInputDTO } from '../../use-cases/dtos/ProgressionInputDTO';
import { MidiSpellingPolicy } from './midi-spelling-policy';

export type MidiEvent = {
  noteNumber: number;
  velocity: number;
  timestamp: number;
  type: 'note-on' | 'note-off';
};

const INTERVAL_TO_SUFFIX: Record<string, string> = {
  '0,4,7': '',
  '0,3,7': 'm',
  '0,3,6': 'dim',
  '0,4,8': 'aug',
  '0,4,7,11': 'maj7',
  '0,4,7,10': '7',
  '0,3,7,10': 'm7',
  '0,3,6,10': 'm7b5',
  '0,3,6,9': 'dim7',
};

export class MidiStreamSegmenter {
  private currentChord: number[] = [];
  private firstNoteTime: number | null = null;
  private chords: string[] = [];
  private lastActivityTime: number | null = null;

  constructor(
    private policy: MidiSpellingPolicy,
    private chordWindowMs: number,
    private progressionSilenceMs: number,
    private onProgressionComplete: (dto: ProgressionInputDTO) => void
  ) {}

  handleEvent(event: MidiEvent) {
    if (event.type !== 'note-on' || event.velocity === 0) {
      return;
    }

    if (this.lastActivityTime !== null && event.timestamp - this.lastActivityTime > this.progressionSilenceMs) {
      this.flushChord();
      this.flushProgression();
    }

    if (this.firstNoteTime === null) {
      this.firstNoteTime = event.timestamp;
      this.currentChord.push(event.noteNumber);
    } else {
      if (event.timestamp - this.firstNoteTime <= this.chordWindowMs) {
        this.currentChord.push(event.noteNumber);
      } else {
        this.flushChord();
        this.firstNoteTime = event.timestamp;
        this.currentChord.push(event.noteNumber);
      }
    }

    this.lastActivityTime = event.timestamp;
  }

  private flushChord() {
    if (this.currentChord.length === 0) return;

    // Sort to find root
    const sorted = [...this.currentChord].sort((a, b) => a - b);
    const rootNumber = sorted[0]!;
    
    // Normalize into single octave intervals to find suffix
    const intervals = Array.from(new Set(sorted.map(n => (n - rootNumber) % 12))).sort((a, b) => a - b);
    const intervalKey = intervals.join(',');
    
    let suffix = INTERVAL_TO_SUFFIX[intervalKey];
    if (suffix === undefined) {
      // Fallback to basic major if we only have one note or unrecognized interval
      suffix = '';
    }

    const rootSpelling = this.policy.spell(rootNumber);
    this.chords.push(`${rootSpelling}${suffix}`);
    this.currentChord = [];
    this.firstNoteTime = null;
  }

  private flushProgression() {
    if (this.chords.length === 0) return;

    // Use the first chord's root as a simple tonal center
    const firstChord = this.chords[0]!;
    const tonalCenterMatch = firstChord.match(/^([A-G][#b]?)/);
    const tonalCenter = tonalCenterMatch ? tonalCenterMatch[1]! : 'C';

    const dto: ProgressionInputDTO = {
      tonalCenter,
      chords: this.chords.map(c => ({ symbol: c }))
    };

    this.onProgressionComplete(dto);
    this.chords = [];
  }

  flush() {
    this.flushChord();
    this.flushProgression();
  }
}
