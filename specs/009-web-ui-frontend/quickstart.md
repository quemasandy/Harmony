# Quickstart: Web UI Frontend (F9)

## Overview
This is the React frontend for the Harmonic Analysis application. It provides a visual interface for users to enter chord progressions, select chord-scales, and view the harmonic analysis results powered by the F6 API.

## Requirements
- Node.js (v18+)
- Local backend running (the F8 Express server should be active to serve the API)

## Setup & Running Locally

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the development server (Vite):
   ```bash
   npm run dev
   ```
   *Note: Vite is configured to proxy `/api` requests to `http://localhost:3000` (or the backend's port) to avoid CORS issues.*

4. Build for production:
   ```bash
   npm run build
   ```
   *The output will be placed in `frontend/dist` and served statically by the Express Composition Root.*

## Manual Verification Steps

1. Open the UI in your browser (`http://localhost:5173`).
2. **Success Path**: Enter "C major" as the tonal center. Add chords: `Dm7`, `G7`, `Cmaj7`. Select appropriate scales from the dropdown. Click Analyze. Verify the roman numerals (`ii7`, `V7`, `Imaj7`) and tensions appear.
3. **Error Path (Validation)**: Try to submit without a tonal center. Verify the form prevents submission and highlights the missing field.
4. **Error Path (API 422)**: Enter an invalid chord symbol (e.g., `Hmaj7`). Submit. Verify that the UI displays an error explicitly under the `Hmaj7` input field.
