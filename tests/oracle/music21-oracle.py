#!/usr/bin/env python3
"""
music21 Oracle for chord validation.

Usage:
  Single chord:  python3 music21-oracle.py Cmaj7
  Batch mode:    python3 music21-oracle.py --batch Cmaj7 Dm7 G7 ...

Batch mode prints one JSON object per line (JSONL), paying the music21
import cost only once.
"""
import sys
import json
import warnings
warnings.filterwarnings("ignore")

try:
    from music21 import harmony, interval
except ImportError:
    print(json.dumps({"error": "music21 not installed"}), file=sys.stderr)
    sys.exit(1)


def analyze_chord(symbol: str) -> dict:
    try:
        # music21 expects flats as '-', so Bb -> B-
        converted = symbol
        if len(converted) >= 2 and converted[1] == 'b':
            converted = converted[0] + '-' + converted[2:]

        chord_obj = harmony.ChordSymbol(converted)

        root = chord_obj.root().name if chord_obj.root() else None

        notes = [p.name for p in chord_obj.pitches]

        intervals = []
        if chord_obj.root():
            for p in chord_obj.pitches:
                interval_obj = interval.Interval(chord_obj.root(), p)
                intervals.append(interval_obj.name)

        quality = chord_obj.quality

        return {
            "symbol": symbol,
            "root": root,
            "notes": notes,
            "intervals": intervals,
            "quality": quality,
            "music21_common_name": chord_obj.commonName
        }
    except Exception as e:
        return {"symbol": symbol, "error": str(e)}


if __name__ == "__main__":
    if len(sys.argv) < 2:
        print(json.dumps({"error": "Missing chord symbol argument"}), file=sys.stderr)
        sys.exit(1)

    args = sys.argv[1:]

    if args[0] == "--batch":
        symbols = args[1:]
        for sym in symbols:
            result = analyze_chord(sym)
            print(json.dumps(result))
    else:
        result = analyze_chord(args[0])
        if "error" in result:
            print(json.dumps(result), file=sys.stderr)
            sys.exit(1)
        print(json.dumps(result))
