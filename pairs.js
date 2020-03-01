import Input from './modules/input.js';
import Output from './modules/output.js';
import * as Algorithm from './modules/algorithm.js';
import * as Cookies from './modules/cookies.js';
import * as Printer from './modules/printer.js';

// only stateful objects
var pairsHistory = [];
var numRows = 5;

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

  elem = document.getElementById('delete');
  elem.onclick = deleteLastFromHistory;

  elem = document.getElementById('add-rows-a');
  elem.onclick = addRows;

  elem = document.getElementById('add-rows-b');
  elem.onclick = addRows;

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
  for (let i=0; i < numRows; i++) {
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

const addRows = function() {
  let buttonA = document.getElementById('add-rows-a');
  let buttonB = document.getElementById('add-rows-b');
  let newNumRows = numRows + 5;
  let elem;
  for ( ; numRows < newNumRows; numRows++) {
    buttonA.insertAdjacentHTML('beforeBegin',
        `<div class="input-wrap"><input type="text" id="seta${numRows}"/></div>`);

    buttonB.insertAdjacentHTML('beforeBegin',
        `<div class="input-wrap"><input type="text" id="setb${numRows}"/></div>`);

    elem = document.getElementById('seta' + numRows);
    elem.onchange = getAndPrintSets;
    elem = document.getElementById('setb' + numRows);
    elem.onchange = getAndPrintSets;
  }
};

const deleteLastFromHistory = function() {
  let confirmed = window.confirm('Delete last generated group of pairings from history?  This cannot be undone.');

  if (confirmed) {
    pairsHistory.pop();

    Cookies.setObj('history', pairsHistory);

    Printer.printHistory(pairsHistory);
  }
}

document.addEventListener('DOMContentLoaded', setup);
