# API Contract

**Feature**: 009-web-ui-frontend
**Context**: HTTP Contract between the React UI and the Express Backend (`POST /api/v1/analyze/progression`)

## Request Body

The frontend sends JSON representing the progression input state.

```json
{
  "tonalCenter": "C major",
  "chords": [
    {
      "symbol": "Dm7",
      "chordScale": "D Dorian"
    },
    {
      "symbol": "G7",
      "chordScale": "G Mixolydian"
    },
    {
      "symbol": "Cmaj7",
      "chordScale": "C Ionian"
    }
  ]
}
```

## Success Response (200 OK)

The frontend expects the backend to return the detailed analysis exactly as formatted by the `JsonProgressionPresenter`.

```json
{
  "progression": {
    "tonalCenter": "C major",
    "chords": [
      {
        "symbol": "Dm7",
        "romanNumeral": "ii7",
        "quality": "minor seventh",
        "function": "Subdominant",
        "isIIVIPattern": true,
        "availableTensions": ["T9", "T11"],
        "avoidNotes": ["S4"],
        "tritoneSubstitution": null
      }
      // ... more chords
    ]
  }
}
```

## Error Response (422 Unprocessable Entity)

When validation fails in the backend, the frontend expects an error payload mapping the error to the specific input field/index.

```json
{
  "error": "Validation Error",
  "details": [
    {
      "field": "chords[1].symbol",
      "message": "Invalid chord symbol: Hmaj7"
    }
  ]
}
```
*(The exact shape of `details` is driven by F8's Express error handler, but this represents the contract the UI needs to parse and map errors effectively).*
