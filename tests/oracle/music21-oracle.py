#!/usr/bin/env python3
import sys
import json
try:
    from music21 import harmony
except ImportError:
    print(json.dumps({"error": "music21 not installed"}), file=sys.stderr)
    sys.exit(1)

def analyze_chord(symbol: str):
    try:
        # music21's harmony module parses chord symbols
        chord_obj = harmony.ChordSymbol(symbol)
        
        # Get root
        root = chord_obj.root().nameWithOctave if chord_obj.root() else None
        if root:
            # strip octave for our domain which is octave-agnostic
            root = chord_obj.root().name
            
        # Get notes (spelled correctly)
        notes = [p.name for p in chord_obj.pitches]
        
        # Get intervals from root
        intervals = []
        if chord_obj.root():
            for p in chord_obj.pitches:
                interval_obj = chord_obj.root().analyzeInterval(p)
                intervals.append(interval_obj.name)
                
        # Get quality
        quality = chord_obj.quality
        
        result = {
            "root": root,
            "notes": notes,
            "intervals": intervals,
            "quality": quality,
            "music21_common_name": chord_obj.commonName
        }
        print(json.dumps(result))
    except Exception as e:
        print(json.dumps({"error": str(e)}), file=sys.stderr)
        sys.exit(1)

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print(json.dumps({"error": "Missing chord symbol argument"}), file=sys.stderr)
        sys.exit(1)
    
    symbol = sys.argv[1]
    analyze_chord(symbol)
