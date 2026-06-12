# Quickstart: Composition Root

## Overview
This component wires the application together and starts the server.

## Running the Server
```bash
# Set environment variables (optional, defaults to 3000)
export PORT=3000

# Run in development mode
npm run dev
```

## Smoke Test (Integration)
The composition root is tested via a single integration test that ensures the server boots and handles requests correctly.
```bash
npm run test:integration
```

## API Readiness
Once running, you can verify readiness:
```bash
curl http://localhost:3000/health
# Expected: HTTP 200 OK
```
