import { InvalidRomanNumeralError } from './errors';

export class RomanNumeral {
  readonly symbol: string;
  readonly degree: number;
  readonly isDiatonic: boolean;

  constructor(symbol: string, degree: number, isDiatonic: boolean) {
    if (!Number.isInteger(degree) || degree < 1 || degree > 7) {
      throw new InvalidRomanNumeralError(`Invalid degree: ${degree}. Must be between 1 and 7.`);
    }
    this.symbol = symbol;
    this.degree = degree;
    this.isDiatonic = isDiatonic;
    Object.freeze(this);
  }

  equals(other: RomanNumeral): boolean {
    return this.symbol === other.symbol && 
           this.degree === other.degree && 
           this.isDiatonic === other.isDiatonic;
  }
}
