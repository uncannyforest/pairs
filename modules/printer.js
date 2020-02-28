const printSets = function(input) {
  let htmlReadyText = `Set A: ${input.setA.join(', ')}<br />Set B: ${input.setB.join(', ')}`;
  document.getElementById('ready-text').innerHTML = htmlReadyText;
};

/**
 * @param{Output} output
 */
const getHtmlForOutput = function(output) {
  const reducer = (acc, curr) => acc + curr.join(', ') + '<br />';
  let htmlOutputText = output.pairs.reduce(reducer, '');
  if (output.extra !== '') {
    htmlOutputText += `Extra (add to any pair): ${output.extra}<br />`;
  }
  return htmlOutputText;
};

/**
 * @param{Output} output
 */
const printOutput = function(output) {
  document.getElementById('output-text').innerHTML = getHtmlForOutput(output);
};

const printHistory = function(history) {
  if (history.length === 0) {
    document.getElementById('history-text').innerHTML = 'No previous history recorded in browser.';
    return;
  }
  let htmlHistory = 'History:<br /><br />'
  for (let i = history.length - 1; i >= 0; i--) {
    htmlHistory +=  getHtmlForOutput(history[i]) + '<br />';
  }
  document.getElementById('history-text').innerHTML = htmlHistory;
};

export { printSets, printOutput, printHistory };
