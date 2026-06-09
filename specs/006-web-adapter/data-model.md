# Data Model: Web Adapter (F6)

## Input DTO
The web adapter directly maps the HTTP JSON request body to the existing `ProgressionInputDTO`. 

### `ProgressionInputDTO` (Existing)
This defines the JSON schema that clients must send in the request body.
- `chords` (Array of Strings): The chord symbols (e.g., `["Dm7", "G7", "Cmaj7"]`).
- `tonalCenter` (String): The key center (e.g., `"C major"`).
- `chordScales` (Optional Array of Strings): Explicit chord scales for each chord.

## Output DTO
The adapter does not define its own output DTO. It returns the exact JSON string produced by the `JsonProgressionPresenter`.
- `success` (Boolean): `true` for successful analysis, `false` for structural errors.
- `data` (Object): The deeply nested analysis result (if success).
- `error` (Object): The error details (if failure).
