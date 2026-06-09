# Progression Analysis Application Layer - JSON Contract

## Public Output Schema (Stable Contract)

This is the fixed JSON structure that the `JsonProgressionPresenter` guarantees to emit. It must remain deterministic (fixed key ordering) and represent optional fields explicitly.

```json
{
  "success": true,
  "data": {
    "tonalCenter": "C",
    "chords": [
      {
        "symbol": "Dm7",
        "harmonicFunction": "ii7",
        "isIIVI": true,
        "tensions": {
          "available": true,
          "data": {
            "availableTensions": ["E", "G", "B"],
            "avoidNotes": ["F"]
          }
        },
        "tritoneSubstitutions": {
          "available": true,
          "data": [
            {
              "substituteSymbol": "Ab7",
              "explanation": "Tritone substitution of D7"
            }
          ]
        }
      },
      {
        "symbol": "Fmaj7",
        "harmonicFunction": "IVmaj7",
        "isIIVI": false,
        "tensions": {
          "available": false,
          "reason": "No explicit chord scale provided"
        },
        "tritoneSubstitutions": {
          "available": false,
          "reason": "Chord quality does not support tritone substitution"
        }
      }
    ]
  }
}
```

## Error Schema

```json
{
  "success": false,
  "error": {
    "code": "INVALID_CHORD_SYMBOL",
    "message": "The symbol 'Hmaj7' is not a valid chord",
    "chordIndex": 1
  }
}
```
