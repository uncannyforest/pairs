// only stateful object
var pairsHistory = [];

class Input {
  /**
   * @param {string[]} setA - list of items in setA
   * @param {string[]} setB - list of items in setB
   */
  constructor(setA, setB) {
    this.setA = setA;
    this.setB = setB;
  }
}

class Output {
  /**
   * @param {string[][]} pairs - list of pairs
   * @param {string} extra - unpaired item or ''
   */
  constructor(pairs, extra) {
    this.pairs = pairs;
    this.extra = extra;
  }
}

// SETUP

const setup = function() {
  let elem;
  for (let i=0; i < 16; i++) {
    elem = document.getElementById('seta' + i);
    elem.onchange = printer.printPairs;
    elem = document.getElementById('setb' + i);
    elem.onchange = printer.printPairs;
  }
  elem = document.getElementById('generate');
  elem.onclick = generateFullyAndPrint;

  printer.printHistory(pairsHistory);
};

// UTILITY FUNCTIONS

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

const algorithm = {
  getValidItemB: function(itemA, setB, validator) {
    shuffleArray(setB);
    for (let i = 0; i < setB.length; i++) {
      if (validator(itemA, setB[i])) {
        return pop(setB, i);
      }
    }
    // give up
    return pop(setB, 0);
  },

  /**
   * @param {string[][]} pairsHistory - history of pairings
   * @return {createPairValidator~validatePair}
   */
  makePairValidator: function(history) {
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
  },

  /**
   * @param {Input} input
   * @param {string[][]} history
   * @return {Output}
   */
  generateFully: function(input, history) {
    let setA = [].concat(input.setA);
    let setB = [].concat(input.setB);
    let pairs = [];
    let extra = '';

    let itemA, itemB;
    shuffleArray(setA);
    while (Math.min(setA.length, setB.length) > 0) {
      itemA = pop(setA, 0);
      itemB = algorithm.getValidItemB(itemA, setB, algorithm.makePairValidator(history));
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
    console.log(pairs);

    return new Output(pairs, extra);
  }
};

const printer = {
  printPairs: function(e) {
    let input = getSets();
    let htmlReadyText = `Set A: ${input.setA.join(', ')}<br />Set B: ${input.setB.join(', ')}`;
    document.getElementById('ready-text').innerHTML = htmlReadyText;
  },

  /**
   * @param{Output} output
   */
  getHtmlForOutput: function(output) {
    const reducer = (acc, curr) => acc + curr.join(', ') + '<br />';
    let htmlOutputText = output.pairs.reduce(reducer, '');
    if (output.extra !== '') {
      htmlOutputText += `Extra (add to any pair): ${output.extra}<br />`;
    }
    return htmlOutputText;
  },

  /**
   * @param{Output} output
   */
  printOutput: function(output) {
    document.getElementById('output-text').innerHTML = printer.getHtmlForOutput(output);
  },

  printHistory: function(history) {
    if (history.length === 0) {
      document.getElementById('history-text').innerHTML = 'No previous history recorded in browser.';
      return;
    }
    htmlHistory = 'History:<br /><br />'
    for (i = history.length - 1; i >= 0; i--) {
      htmlHistory +=  printer.getHtmlForOutput(history[i]) + '<br />';
    }
    document.getElementById('history-text').innerHTML = htmlHistory;
  }
};

const getSets = function() {
  let setA = [];
  let setB = [];
  for (let i=0; i < 16; i++) {
    elem = document.getElementById('seta' + i);
    if (elem.value !== '') {
      setA.push(elem.value);
    }
    elem = document.getElementById('setb' + i);
    if (elem.value !== '') {
      setB.push(elem.value);
    }
  }
  return new Input(setA, setB);
}

const generateFullyAndPrint = function() {
  let output = algorithm.generateFully(getSets(), pairsHistory);

  printer.printOutput(output);

  printer.printHistory(pairsHistory);

  pairsHistory.push(output);
};

document.addEventListener('DOMContentLoaded', setup);
