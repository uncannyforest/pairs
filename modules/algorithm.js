import Input from './input.js';
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

const sortByValidItemsB = function(itemA, setB, validator) {
  itemA = itemA || '';
  shuffleArray(setB);
  let moreValid = [];
  let lessValid = [];

  for (let i = 0; i < setB.length; i++) {
    if (validator(itemA, setB[i])) {
      moreValid.push(setB[i]);
    } else {
      lessValid.push(setB[i]);
    }
  }

  for (let i = 0; i < moreValid.length; i++) {
    setB[i] = moreValid[i];
  }
  for (let i = 0; i < lessValid.length; i++) {
    setB[i + moreValid.length] = lessValid[i];
  }
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
        if ((pairing[j][0].toLowerCase() === itemA.toLowerCase() &&
             pairing [j][1].toLowerCase() === itemB.toLowerCase()) ||
            (pairing[j][0].toLowerCase() === itemB.toLowerCase() &&
             pairing [j][1].toLowerCase() === itemA.toLowerCase())) {
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

/**
 * @param {string[]} setA mutable set A
 * @param {string[]} setB mutable set B
 * @param {string[][]} history
 * @return {Input}
 */
const prepNextPair = function(setA, setB, history) {
  shuffleArray(setA);
  sortByValidItemsB(setA[0], setB, makePairValidator(history));

  return new Input(setA, setB);
};

/**
 * Call this function with counter === 0, then counter === 1, until it returns an empty array.
 * When it returns an empty array immediately call again with counter === 0.
 * @param {Input} preppedInput output of prepNextPair
 * @param {number} counter index to pair to check
 * @return {string[]} the pair.  If empty, call again with counter == 0
 */
const getNextSinglePair = function(preppedInput, counter) {
  if (counter < preppedInput.setB.length) {
    return [preppedInput.setA[0], preppedInput.setB[counter]];
  } else {
    counter -= preppedInput.setB.length;
  }

  if (counter < preppedInput.setA.length - 1) {
    return [preppedInput.setA[0], preppedInput.setA[counter + 1]];
  } else {
    return [];
  }

};

/**
 * @param {Input} preppedInput output of prepNextPair
 * @param {number} counter index to pair to check
 * @return {string[]} the pair
 */
const selectPair = function(preppedInput, counter) {
  if (counter < preppedInput.setB.length) {
    return [pop(preppedInput.setA, 0), pop(preppedInput.setB, counter)];
  } else {
    counter -= preppedInput.setB.length;
  }

  if (counter < preppedInput.setA.length - 1) {
    return [pop(preppedInput.setA, 0), pop(preppedInput.setA, counter)]; // counter is not +1 because first was just popped!
  }
};

export { generateFully, prepNextPair, getNextSinglePair, selectPair };
