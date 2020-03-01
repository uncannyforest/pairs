import Input from './modules/input.js';
import Output from './modules/output.js';
import * as Algorithm from './modules/algorithm.js';
import * as Cookies from './modules/cookies.js';
import * as Printer from './modules/printer.js';

// only stateful objects
var pairsHistory = [];
var numRows = 0;
var curationInput;
var curationCounter = 0;
var curationPairs = [];

const setup = function() {
  let elem;
  let sets = Cookies.getObj('sets') || new Input([], []);
  for ( ; numRows < 5 || numRows < sets.setA.length || numRows < sets.setB.length ; numRows++) {
    addRow();
    if (numRows < sets.setA.length) {
      elem = document.getElementById('seta' + numRows);
      elem.value = sets.setA[numRows];
    }
    if (numRows < sets.setB.length) {
      elem = document.getElementById('setb' + numRows);
      elem.value = sets.setB[numRows];
    }
  }

  elem = document.getElementById('generate');
  elem.onclick = generateFullyAndPrint;

  elem = document.getElementById('delete');
  elem.onclick = deleteLastFromHistory;

  elem = document.getElementById('add-rows-a');
  elem.onclick = addRows;

  elem = document.getElementById('add-rows-b');
  elem.onclick = addRows;

  elem = document.getElementById('curate');
  elem.onclick = curationStart;

  elem = document.getElementById('approve');
  elem.onclick = curationApprove;

  elem = document.getElementById('disapprove');
  elem.onclick = curationDisapprove;

  pairsHistory = Cookies.getObj('history') || [];
  Printer.printHistory(pairsHistory);
};

const getAndPrintSets = function() {
  Printer.printSets(getSets());
};

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
  let sets = new Input(setA, setB);
  Cookies.setObj('sets', sets);
  return sets;
};


const generateFullyAndPrint = function() {
  let output = Algorithm.generateFully(getSets(), pairsHistory);

  Printer.printOutput(output);

  updateHistory(output);

  Printer.printHistory(pairsHistory);
};

const updateHistory = function(output) {
  pairsHistory.push(output);

  Cookies.setObj('history', pairsHistory);
};

const curationStart = function() {
  document.getElementById('curation').style.display = 'block';
  document.getElementById('generate').disabled = true;
  for (let i=0; i < numRows; i++) {
    document.getElementById('seta' + i).disabled = true;
    document.getElementById('setb' + i).disabled = true;
  }

  curationCounter = 0;
  curationPairs = [];
  Printer.resetOutput();

  let input = getSets();
  curationInput = Algorithm.prepNextPair(input.setA, input.setB, pairsHistory);
  let pair = Algorithm.getNextSinglePair(curationInput, 0);

  Printer.printCuration(pair);
};

const curationDisapprove = function() {
  curationCounter += 1;
  let pair = Algorithm.getNextSinglePair(curationInput, curationCounter);
  if (pair.length === 0) {
    curationCounter = 0;
    pair = Algorithm.getNextSinglePair(curationInput, 0);
  }

  Printer.printCuration(pair);
};

const curationApprove = function() {
  let pair = Algorithm.selectPair(curationInput, curationCounter);
  curationPairs.push(pair);
  Printer.addOutputPair(pair);
  curationCounter = 0;

  if (curationInput.setA.length + curationInput.setB.length > 1) {

    if (curationInput.setA.length === 0) {
      curationInput.setA = [].concat(curationInput.setB);
      curationInput.setB = [];
    }

    curationInput = Algorithm.prepNextPair(curationInput.setA, curationInput.setB, pairsHistory);
    let pair = Algorithm.getNextSinglePair(curationInput, 0);

    Printer.printCuration(pair);
  } else {
    let extra;

    if (curationInput.setA.length > 0) {
      extra = curationInput.setA[0];
    } else if (curationInput.setB.length > 0) {
      extra = curationInput.setB[0];
    } else {
      extra = '';
    }

    let output = new Output(curationPairs, extra);

    Printer.printOutput(output);
    updateHistory(output);
    Printer.printHistory(pairsHistory);

    document.getElementById('curation').style.display = 'none';
    document.getElementById('generate').disabled = false;
    for (let i=0; i < numRows; i++) {
      document.getElementById('seta' + i).disabled = false;
      document.getElementById('setb' + i).disabled = false;
    }
  }
};

const addRow = function() {
  let elem;
  let buttonA = document.getElementById('add-rows-a');
  let buttonB = document.getElementById('add-rows-b');

  buttonA.insertAdjacentHTML('beforeBegin',
      `<div class="input-wrap"><input type="text" id="seta${numRows}"/></div>`);

  buttonB.insertAdjacentHTML('beforeBegin',
      `<div class="input-wrap"><input type="text" id="setb${numRows}"/></div>`);

  elem = document.getElementById('seta' + numRows);
  elem.onchange = getAndPrintSets;
  elem = document.getElementById('setb' + numRows);
  elem.onchange = getAndPrintSets;
}

const addRows = function() {
  let newNumRows = numRows + 5;
  for ( ; numRows < newNumRows; numRows++) {
    addRow();
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
