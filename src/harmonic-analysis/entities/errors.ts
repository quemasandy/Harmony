export class HarmonyError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'HarmonyError';
  }
}

export class InvalidNoteError extends HarmonyError {
  constructor(message: string) {
    super(message);
    this.name = 'InvalidNoteError';
  }
}

export class InvalidIntervalError extends HarmonyError {
  constructor(message: string) {
    super(message);
    this.name = 'InvalidIntervalError';
  }
}

export class InvalidChordSymbolError extends HarmonyError {
  constructor(message: string) {
    super(message);
    this.name = 'InvalidChordSymbolError';
  }
}
