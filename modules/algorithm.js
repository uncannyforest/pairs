import Output from './output.js';

const pop = function(a, i) {
    return a.splice(i, 1)[0];
};

// copied from StackOverflow
const shuffleArray = function(array) {
  for (let i = array.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    let temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
  return array;
};

const getValidItemB = function(itemA, setB, validator) {
  shuffleArray(setB);
  for (let i = 0; i < setB.length; i++) {
    if (validator(itemA, setB[i])) {
      return pop(setB, i);
    }
  }
  // give up
  return pop(setB, 0);
};

/**
 * @param {string[][]} pairsHistory - history of pairings
 * @return {createPairValidator~validatePair}
 */
const makePairValidator = function(history) {
  /**
   * @param {string} itemA
   * @param {string} itemB
   * @return {boolean} whether the pair is valid
   */
  let validatePair = function(itemA, itemB) {
    // check against old pairings
    for (let i = 0; i < history.length; i++) {
      let pairing = history[i].pairs;
      for (let j = 0; j < pairing.length; j++) {
        if ((pairing[j][0] == itemA && pairing [j][1] == itemB) ||
            (pairing[j][0] == itemB && pairing [j][1] == itemA)) {
              return false;
        }
      }
    }

    return true;
  };
  return validatePair;
};

/**
 * @param {Input} input
 * @param {string[][]} history
 * @return {Output}
 */
const generateFully = function(input, history) {
  let setA = [].concat(input.setA);
  let setB = [].concat(input.setB);
  let pairs = [];
  let extra = '';

  let itemA, itemB;
  shuffleArray(setA);
  while (Math.min(setA.length, setB.length) > 0) {
    itemA = pop(setA, 0);
    itemB = getValidItemB(itemA, setB, makePairValidator(history));
    pairs.push([itemA, itemB]);
  }
  if (setA.length > 0) {
    while (setA.length > 1) {
      itemA = pop(setA, 0);
      itemB = pop(setA, 0);
      pairs.push([itemA, itemB]);
    }
    if (setA.length === 1) {
      extra = pop(setA, 0);
    }
  } else if (setB.length > 0) {
    while (setB.length > 1) {
      itemA = pop(setB, 0);
      itemB = pop(setB, 0);
      pairs.push([itemA, itemB]);
    }
    if (setB.length === 1) {
      extra = pop(setB, 0);
    }
  }

  return new Output(pairs, extra);
};

export { generateFully };
