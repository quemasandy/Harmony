# Quickstart: Web Adapter

## Running the Server

Since this is the F6 layer, it's designed to be embedded in an actual application entry point. However, to run the Express wiring directly:

```bash
# Instantiate the Express app (pseudo-code)
import { createExpressApp } from './src/harmonic-analysis/frameworks/web/ExpressWiring';
import { ProgressionAnalyzer } from './src/harmonic-analysis/application/use-cases/ProgressionAnalyzer';

const useCase = new ProgressionAnalyzer();
// Wire the use case to the port interface
const port = {
  analyze: async (dto) => useCase.execute(dto) // Simplified
};

const app = createExpressApp(port);
app.listen(3000, () => console.log('Listening on port 3000'));
```

## Testing

```bash
# Run unit tests for the web adapter
npm run test tests/frameworks/web/

# Run architecture boundary tests
npm run test tests/architecture/web-boundary.test.ts
```
