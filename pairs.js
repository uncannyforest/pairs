var setA = [];
var setB = [];
var pairs = [];
var extra = '';

const setup = function() {
  let elem;
  for (let i=0; i < 16; i++) {
    elem = document.getElementById('seta' + i);
    elem.onchange = textUpdate;
    elem = document.getElementById('setb' + i);
    elem.onchange = textUpdate;
  }
  elem = document.getElementById('generate');
  elem.onclick = generateFullyAndPrint;
};

const textUpdate = function(e) {
  setA = [];
  setB = [];
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
  let htmlReadyText = `Set A: ${setA.join(', ')}<br />Set B: ${setB.join(', ')}`;
  document.getElementById('ready-text').innerHTML = htmlReadyText;
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
}

const pop = function(a, i) {
    return a.splice(i, 1)[0];
}

const generateFully = function() {
  pairs = [];
  extra = '';

  let itemA, itemB;
  shuffleArray(setA);
  shuffleArray(setB);
  while (Math.min(setA.length, setB.length) > 0) {
    itemA = pop(setA, 0);
    itemB = pop(setB, 0);
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
};

const printOutput = function() {
  const reducer = (acc, curr) => acc + curr.join(', ') + '<br />';
  let htmlOutputText = pairs.reduce(reducer, '');
  if (extra !== '') {
    htmlOutputText += `Extra (add to any pair): ${extra}<br />`;
  }
  console.log(htmlOutputText);
  document.getElementById('output-text').innerHTML = htmlOutputText;
}

const generateFullyAndPrint = function() {
  generateFully();

  console.log(pairs);
  console.log(extra);

  printOutput();
};

document.addEventListener('DOMContentLoaded', setup);
