import sys
import json
import argparse
from typing import List, Dict, Any

try:
    from music21 import harmony, key, pitch, roman, interval
except ImportError:
    print("{\"error\": \"music21 not installed\"}", file=sys.stderr)
    sys.exit(1)

def get_tritone_substitute(chord_symbol: str, key_name: str) -> Dict[str, Any]:
    try:
        # music21 uses '-' for flat, not 'b'
        m21_chord = chord_symbol.replace('b', '-')
        m21_key = key_name.replace('b', '-')
        
        # Create chord and key context
        c = harmony.ChordSymbol(m21_chord)
        key_parts = m21_key.split()
        if len(key_parts) >= 2:
            k = key.Key(key_parts[0], key_parts[1])
        else:
            k = key.Key(m21_key)
        
        # Analyze chord in key to get roman numeral
        rn = roman.romanNumeralFromChord(c, k)
        
        # We only care about V7
        if rn.romanNumeral != 'V' or '7' not in rn.figure:
            return {
                "pair": f"{chord_symbol}:{key_name}",
                "error": "Not a V7 chord"
            }
            
        # music21 doesn't have a direct "tritone substitution" method that returns 
        # the specific spelling of the sub chord based on standard theory.
        # But we can see what note is a d5 or A4 away that is diatonic or standard.
        # Wait, the tritone sub of V7 resolves down a half-step.
        # So the root of the sub should be a half-step above the tonic.
        target_root_pitch = k.tonic.transpose(interval.Interval('-m2')) # e.g. C -> B? No, down a half step from target? 
        # G7 -> C. Tritone sub is Db7. Db is a m2 above C.
        sub_root_pitch = k.tonic.transpose(interval.Interval('m2')) 
        
        sub_chord = harmony.ChordSymbol(sub_root_pitch.name + '7')
        
        # Extract 3rd and 7th
        # In a dominant 7th, 3rd is index 1, 7th is index 3
        orig_3rd = c.pitches[1]
        orig_7th = c.pitches[3]
        
        sub_3rd = sub_chord.pitches[1]
        sub_7th = sub_chord.pitches[3]
        
        def to_note_dict(p) -> Dict[str, Any]:
            acc = p.accidental.modifier if p.accidental else ""
            # Map music21 '-' back to 'b' for our domain
            acc = acc.replace('-', 'b')
            return {
                "letter": p.step,
                "accidental": acc
            }
            
        def is_enharmonic(p1, p2):
            return p1.pitchClass == p2.pitchClass and p1.name != p2.name
            
        def is_literal(p1, p2):
            return p1.name == p2.name

        return {
            "pair": f"{chord_symbol}:{key_name}",
            "chord": chord_symbol,
            "substituteRoot": to_note_dict(sub_root_pitch),
            "sharedTritone": [
                {
                    "originalNote": to_note_dict(orig_3rd),
                    "substituteNote": to_note_dict(sub_7th),
                    "isEnharmonicEquivalent": is_enharmonic(orig_3rd, sub_7th),
                    "isLiterallyIdentical": is_literal(orig_3rd, sub_7th)
                },
                {
                    "originalNote": to_note_dict(orig_7th),
                    "substituteNote": to_note_dict(sub_3rd),
                    "isEnharmonicEquivalent": is_enharmonic(orig_7th, sub_3rd),
                    "isLiterallyIdentical": is_literal(orig_7th, sub_3rd)
                }
            ]
        }
    except Exception as e:
        return {
            "pair": f"{chord_symbol}:{key_name}",
            "error": str(e)
        }

if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('--batch', nargs='+', help='List of chord:key pairs (e.g., "G7:C Major")')
    args = parser.parse_args()
    
    if args.batch:
        for pair in args.batch:
            parts = pair.split(':')
            if len(parts) == 2:
                print(json.dumps(get_tritone_substitute(parts[0], parts[1])))
            else:
                print(json.dumps({"pair": pair, "error": "Invalid format. Expected chord:key"}))
