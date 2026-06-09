# Quickstart: Using the Progression Analyzer

## Basic Usage

```typescript
import { ProgressionAnalyzer } from '../src/application/use-cases/ProgressionAnalyzer';
import { JsonProgressionPresenter } from '../src/interface-adapters/presenters/JsonProgressionPresenter';

// 1. Construct the Input DTO
const input = {
  tonalCenter: 'C',
  chords: [
    { symbol: 'Dm7', chordScale: 'Dorian' },
    { symbol: 'G7', chordScale: 'Mixolydian' },
    { symbol: 'Cmaj7', chordScale: 'Ionian' }
  ]
};

// 2. Instantiate Use Case
const analyzer = new ProgressionAnalyzer();

// 3. Execute Analysis (Returns Result DTO)
const result = analyzer.execute(input);

// 4. Instantiate Presenter
const presenter = new JsonProgressionPresenter();

// 5. Render to Stable JSON
const jsonOutput = presenter.present(result);
console.log(jsonOutput);
```
