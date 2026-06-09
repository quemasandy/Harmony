export class MidiSpellingPolicy {
  private readonly spellings = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

  spell(noteNumber: number): string {
    return this.spellings[noteNumber % 12]!;
  }
}
