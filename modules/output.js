export default class Output {
  /**
   * @param {string[][]} pairs - list of pairs
   * @param {string} extra - unpaired item or ''
   */
  constructor(pairs, extra) {
    this.pairs = pairs;
    this.extra = extra;
  }
}
