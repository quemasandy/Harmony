# HTTP API Contract: Progression Analysis

This contract defines the single HTTP endpoint exposed by the F6 Web Adapter.

## `POST /api/v1/analyze/progression`

Accepts a chord progression and returns a full harmonic analysis.

### Request Body

**Content-Type**: `application/json`

```json
{
  "chords": ["Dm7", "G7", "Cmaj7"],
  "tonalCenter": "C major",
  "chordScales": null
}
```

### Responses

#### 200 OK (Success)
The analysis was successful. The response body is strictly the JSON string produced by the F5 Presenter.

**Content-Type**: `application/json`
```json
{
  "success": true,
  "data": { ... }
}
```

#### 422 Unprocessable Entity (Structural Error)
The request payload was structurally invalid (e.g., malformed chord symbol).

**Content-Type**: `application/json`
```json
{
  "success": false,
  "error": { ... }
}
```

#### 500 Internal Server Error
An unexpected internal failure occurred.

**Content-Type**: `application/json`
```json
{
  "success": false,
  "error": "Internal Server Error"
}
```
