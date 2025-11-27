declare module 'hijri-date' {
  class HijriDate {
    constructor(date?: Date);
    toObject(): { date: number; month: number; year: number };
    toString(): string;
  }
  export default HijriDate;
}

