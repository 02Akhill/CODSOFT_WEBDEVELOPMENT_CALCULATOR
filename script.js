let display = document.getElementById('display');
let maxDisplayLength = 12;

document.addEventListener('DOMContentLoaded', function() {
  document.addEventListener('keydown', handleKeyPress);
});

function pressKey(value) {
  if (display.value.length >= maxDisplayLength && display.value !== '0' && display.value !== 'Error') {
    return;
  }

  if (value === '.' && display.value.includes('.')) {
    return;
  }

  if ((value === '+' || value === '-' || value === '*' || value === '/') &&
      (display.value.endsWith('+') || display.value.endsWith('-') ||
       display.value.endsWith('*') || display.value.endsWith('/'))) {
    display.value = display.value.slice(0, -1) + value;
    return;
  }

  if (display.value === '0' && value !== '.') {
    display.value = value;
  } else if (display.value === 'Error') {
    display.value = value;
  } else {
    display.value += value;
  }
}

function calculate() {
  try {
    let expression = display.value.replace(/×/g, '*');

    if (expression === '' || expression === '0') {
      display.value = '0';
      return;
    }

    let result = eval(expression);

    if (result === Infinity || result === -Infinity) {
      display.value = 'Error';
    } else if (isNaN(result)) {
      display.value = 'Error';
    } else {
      result = result.toString();

      if (result.includes('.')) {
        const parts = result.split('.');
        if (parts[0].length >= maxDisplayLength - 2) {
          result = Number(result).toExponential(maxDisplayLength - 7);
        } else if (parts[0].length + parts[1].length + 1 > maxDisplayLength) {
          const decimalPlaces = maxDisplayLength - parts[0].length - 1;
          result = Number(result).toFixed(Math.max(0, decimalPlaces));
        }
      } else if (result.length > maxDisplayLength) {
        result = Number(result).toExponential(maxDisplayLength - 7);
      }

      display.value = result;
    }
  } catch (error) {
    console.log('Calculation error:', error);
    display.value = 'Error';
  }
}

function handleKeyPress(e) {
  const key = e.key;

  if (/[0-9.+\-*/=]|Enter|Backspace|Escape/.test(key)) {
    e.preventDefault();
  }

  if (/[0-9]/.test(key)) {
    pressKey(key);
  } else if (key === '.') {
    pressKey(key);
  } else if (key === '+' || key === '-' || key === '/' || key === '*') {
    pressKey(key);
  } else if (key === 'Enter' || key === '=') {
    calculate();
  } else if (key === 'Backspace') {
    deleteLast();
  } else if (key === 'Escape' || key === 'c' || key === 'C') {
    clearDisplay();
  }
}

function deleteLast() {
  if (display.value === 'Error') {
    display.value = '0';
  } else {
    display.value = display.value.slice(0, -1);
    if (display.value === '') display.value = '0';
  }
}

function clearDisplay() {
  display.value = '0';
}
