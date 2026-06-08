#!/usr/bin/env python3
"""
music21 Oracle for Chord-Scale Tensions.

Usage:
  Batch mode: python3 music21-tensions-oracle.py --batch "Cmaj7:C Ionian" "G7:G Mixolydian" ...

Takes a string formatted as "ChordSymbol:Root ScaleName", e.g., "Dm7:D Dorian".
Calculates the tensions and avoid notes based on the minor 2nd rule.
"""
import sys
import json
import warnings
warnings.filterwarnings("ignore")

try:
    from music21 import harmony, interval, scale, pitch
except ImportError:
    print(json.dumps({"error": "music21 not installed"}), file=sys.stderr)
    sys.exit(1)


def analyze_tensions(pair_str: str) -> dict:
    try:
        parts = pair_str.split(':')
        if len(parts) != 2:
            return {"pair": pair_str, "error": "Format must be Chord:Scale"}
        
        chord_symbol = parts[0].strip()
        scale_name = parts[1].strip()

        # Parse chord
        converted_chord = chord_symbol
        if len(converted_chord) >= 2 and converted_chord[1] == 'b':
            converted_chord = converted_chord[0] + '-' + converted_chord[2:]
        chord_obj = harmony.ChordSymbol(converted_chord)
        chord_pitches = [p.name for p in chord_obj.pitches]
        chord_root = chord_obj.root()

        # Parse scale (e.g., "C Ionian", "D Dorian")
        scale_parts = scale_name.split(' ')
        if len(scale_parts) != 2:
            return {"pair": pair_str, "error": "Scale format must be 'Root Mode' (e.g., 'C Ionian')"}
        
        s_root_str = scale_parts[0]
        s_mode_str = scale_parts[1].lower()

        if len(s_root_str) >= 2 and s_root_str[1] == 'b':
            s_root_str = s_root_str[0] + '-' + s_root_str[2:]
        
        s_root = pitch.Pitch(s_root_str)
        if s_root.octave is None:
            s_root.octave = 4

        # Map mode string to music21 scale class
        mode_map = {
            'ionian': scale.MajorScale,
            'dorian': getattr(scale, 'DorianScale', None),
            'phrygian': getattr(scale, 'PhrygianScale', None),
            'lydian': getattr(scale, 'LydianScale', None),
            'mixolydian': getattr(scale, 'MixolydianScale', None),
            'aeolian': scale.MinorScale,
            'locrian': scale.LocrianScale,
            'major': scale.MajorScale,
            'minor': scale.MinorScale,
            'harmonic minor': scale.HarmonicMinorScale,
            'melodic minor': scale.MelodicMinorScale
        }

        if s_mode_str not in mode_map:
            return {"pair": pair_str, "error": f"Unknown mode: {s_mode_str}"}

        scale_obj = mode_map[s_mode_str](s_root)
        
        # Get one octave of pitches
        scale_pitches = [p for p in scale_obj.getPitches(s_root, s_root.transpose('P8'))[:-1]]
        
        if len(scale_pitches) != 7:
            return {"pair": pair_str, "error": "Only 7-note scales are supported by the oracle"}

        # Calculate tensions and avoid notes
        available_tensions = []
        avoid_notes = []

        for p in scale_pitches:
            if p.name in chord_pitches:
                continue
            
            # Check for avoid note (minor 2nd above any chord tone)
            is_avoid = False
            clashing_tone = None
            for cp_str in chord_pitches:
                cp = pitch.Pitch(cp_str)
                # To accurately compare, we transpose them to the same octave if needed,
                # but interval.Interval gives directed interval.
                # A minor second above means the scale note is m2 above the chord tone.
                # So Interval(cp, p).name == 'm2'
                
                # However, p and cp might be in different octaves. Let's force them close.
                cp.octave = 4
                test_p = pitch.Pitch(p.name)
                test_p.octave = 4
                
                # If test_p is below cp, move it up an octave
                if test_p < cp:
                    test_p.octave += 1
                
                inv = interval.Interval(cp, test_p)
                if inv.name == 'm2':
                    is_avoid = True
                    clashing_tone = cp.name
                    break
            
            # Calculate degree relative to scale root
            # Degree is 1-indexed. e.g. D in C scale is 2 (or 9)
            # Find the index of the note in the scale
            idx = 0
            for i, sp in enumerate(scale_pitches):
                if sp.name == p.name:
                    idx = i
                    break
            
            # Convert 2->9, 4->11, 6->13. 
            # If the chord is a triad and this is the 7th, it stays 7.
            degree = idx + 1
            if degree in [2, 4, 6]:
                degree += 7
            
            if is_avoid:
                avoid_notes.append({
                    "note": p.name,
                    "degree": degree,
                    "clashesWith": clashing_tone
                })
            else:
                available_tensions.append({
                    "note": p.name,
                    "degree": degree
                })

        return {
            "pair": pair_str,
            "chord": chord_symbol,
            "scale": scale_name,
            "availableTensions": available_tensions,
            "avoidNotes": avoid_notes
        }

    except Exception as e:
        return {"pair": pair_str, "error": str(e)}


if __name__ == "__main__":
    if len(sys.argv) < 2:
        print(json.dumps({"error": "Missing arguments"}), file=sys.stderr)
        sys.exit(1)

    args = sys.argv[1:]

    if args[0] == "--batch":
        pairs = args[1:]
        for p in pairs:
            result = analyze_tensions(p)
            print(json.dumps(result))
    else:
        result = analyze_tensions(args[0])
        if "error" in result:
            print(json.dumps(result), file=sys.stderr)
            sys.exit(1)
        print(json.dumps(result))
