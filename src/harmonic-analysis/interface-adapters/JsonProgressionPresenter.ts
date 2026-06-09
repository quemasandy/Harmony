import { ProgressionAnalysisResult } from '../use-cases/dtos/ProgressionResult';

export class JsonProgressionPresenter {
  present(result: ProgressionAnalysisResult): string {
    // We want deterministic formatting. JSON.stringify guarantees deterministic
    // ordering of array elements, but not necessarily object keys.
    // Since our DTOs are plain objects and we construct them deterministically 
    // in the analyzer, JSON.stringify with a spaces argument is stable enough.
    return JSON.stringify(result, null, 2);
  }
}
