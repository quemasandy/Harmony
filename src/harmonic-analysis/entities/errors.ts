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

export class InvalidKeyError extends HarmonyError {
  constructor(message: string) {
    super(message);
    this.name = 'InvalidKeyError';
  }
}

export class InvalidProgressionError extends HarmonyError {
  constructor(message: string) {
    super(message);
    this.name = 'InvalidProgressionError';
  }
}

export class InvalidRomanNumeralError extends HarmonyError {
  constructor(message: string) {
    super(message);
    this.name = 'InvalidRomanNumeralError';
  }
}

export class InvalidSubstitutionError extends HarmonyError {
  constructor(message: string) {
    super(message);
    this.name = 'InvalidSubstitutionError';
  }
}
