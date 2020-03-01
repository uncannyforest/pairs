import Input from './modules/input.js';
import Output from './modules/output.js';
import * as Algorithm from './modules/algorithm.js';
import * as Cookies from './modules/cookies.js';
import * as Printer from './modules/printer.js';

// only stateful object
var pairsHistory = [];

const setup = function() {
  let elem;
  for (let i=0; i < 5; i++) {
    elem = document.getElementById('seta' + i);
    elem.onchange = getAndPrintSets;
    elem = document.getElementById('setb' + i);
    elem.onchange = getAndPrintSets;
  }
  elem = document.getElementById('generate');
  elem.onclick = generateFullyAndPrint;

  pairsHistory = Cookies.getObj('history') || [];
  Printer.printHistory(pairsHistory);
};

const getAndPrintSets = function() {
  Printer.printSets(getSets());
}

const getSets = function() {
  let setA = [];
  let setB = [];
  let elem;
  for (let i=0; i < 5; i++) {
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
  let output = Algorithm.generateFully(getSets(), pairsHistory);

  Printer.printOutput(output);

  updateHistory(output);

  Printer.printHistory(pairsHistory);
};

const updateHistory = function(output) {
  pairsHistory.push(output);

  Cookies.setObj('history', pairsHistory);
}

document.addEventListener('DOMContentLoaded', setup);
