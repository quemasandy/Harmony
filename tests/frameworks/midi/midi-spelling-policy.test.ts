import { describe, test, expect } from 'vitest';
import { MidiSpellingPolicy } from '../../../src/harmonic-analysis/frameworks/midi/midi-spelling-policy';

describe('MidiSpellingPolicy', () => {
  test('strictly defaults to sharp spelling for accidentals', () => {
    const policy = new MidiSpellingPolicy();
    expect(policy.spell(0)).toBe('C');
    expect(policy.spell(1)).toBe('C#');
    expect(policy.spell(2)).toBe('D');
    expect(policy.spell(3)).toBe('D#');
    expect(policy.spell(4)).toBe('E');
    expect(policy.spell(5)).toBe('F');
    expect(policy.spell(6)).toBe('F#');
    expect(policy.spell(7)).toBe('G');
    expect(policy.spell(8)).toBe('G#');
    expect(policy.spell(9)).toBe('A');
    expect(policy.spell(10)).toBe('A#');
    expect(policy.spell(11)).toBe('B');
  });

  test('normalizes MIDI note numbers across octaves', () => {
    const policy = new MidiSpellingPolicy();
    expect(policy.spell(60)).toBe('C'); // Middle C
    expect(policy.spell(61)).toBe('C#');
    expect(policy.spell(72)).toBe('C');
  });
});
