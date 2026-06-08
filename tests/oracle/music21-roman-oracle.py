#!/usr/bin/env python3
import sys
import json
import warnings
warnings.filterwarnings("ignore")

try:
    from music21 import harmony, key, roman
except ImportError:
    print(json.dumps({"error": "music21 not installed"}), file=sys.stderr)
    sys.exit(1)

def convert_flats(sym: str) -> str:
    if len(sym) >= 2 and sym[1] == 'b':
        return sym[0] + '-' + sym[2:]
    return sym

def analyze_roman(chord_symbol: str, key_str: str) -> dict:
    try:
        c_sym = convert_flats(chord_symbol)
        
        # Key string format: "C major", "C minor", "F# minor", "Bb major"
        parts = key_str.split(' ')
        tonic = convert_flats(parts[0])
        mode = parts[1]
        
        # In music21, minor keys are often lowercase
        if mode == 'minor':
            k_sym = tonic.lower()
        else:
            k_sym = tonic.upper()
            
        c = harmony.ChordSymbol(c_sym)
        k = key.Key(k_sym)
        rn = roman.romanNumeralFromChord(c, k)
        return {
            "symbol": chord_symbol,
            "key": key_str,
            "roman_numeral": rn.figure
        }
    except Exception as e:
        return {"symbol": chord_symbol, "key": key_str, "error": str(e)}

if __name__ == "__main__":
    if len(sys.argv) < 3:
        print(json.dumps({"error": "Usage: script.py <key_str> <chord_symbol_1> [<chord_symbol_2> ...]"}), file=sys.stderr)
        sys.exit(1)

    key_str = sys.argv[1]
    symbols = sys.argv[2:]

    for sym in symbols:
        result = analyze_roman(sym, key_str)
        print(json.dumps(result))
