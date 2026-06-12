#!/bin/bash
set -e

echo "Running E2E tests using agent-browser CLI..."

agent-browser open http://localhost:5174

# The form is pre-filled with C tonal center and Dm7, G7, Cmaj7 progression.
# We skip filling inputs manually to avoid Playwright/React synthetic event sync issues.

agent-browser click "#submit-btn"

agent-browser wait 5000

OUTPUT=$(agent-browser get text body)

if echo "$OUTPUT" | grep -q "Analysis Results"; then
  echo "✅ Happy path test passed."
else
  echo "❌ Happy path test failed."
  echo "$OUTPUT"
  mkdir -p /Users/andy/Learning/Harmony/frontend/scratch
  agent-browser screenshot -f /Users/andy/Learning/Harmony/frontend/scratch/error.png
  exit 1
fi
