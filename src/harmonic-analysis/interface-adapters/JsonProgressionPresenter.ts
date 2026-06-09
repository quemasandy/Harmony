import { ProgressionAnalysisResult } from '../use-cases/dtos/ProgressionResult';

function stableStringify(value: any, space: number = 2): string {
  function sortKeys(obj: any): any {
    if (obj === null || typeof obj !== 'object') {
      return obj;
    }
    if (Array.isArray(obj)) {
      return obj.map(sortKeys);
    }
    const sortedObj: Record<string, any> = {};
    Object.keys(obj)
      .sort()
      .forEach(key => {
        if (obj[key] !== undefined) {
          sortedObj[key] = sortKeys(obj[key]);
        }
      });
    return sortedObj;
  }
  return JSON.stringify(sortKeys(value), null, space);
}

export class JsonProgressionPresenter {
  present(result: ProgressionAnalysisResult): string {
    return stableStringify(result, 2);
  }
}
