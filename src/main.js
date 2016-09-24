var $ = require('jquery');
var html = require('./index.html');
var style = require('./main.less');

var equation = [0];
var histEquation = [0];
var hist = $('.history');
var display = $('.display');
var answer = 0;

var operators = ['+', 'x', '-', '÷', '='];
var stackTop = 0;
var digits = /\d/;
var operators2 = /\D/;



function updateDisplay() {
  if (equation.length > 11) {
    stackTop = equation.pop()
    histEquation.pop();
    if (stackTop == '=') {
      equation.push(stackTop);
      histEquation.push(stackTop);
    }
    else {
      console.log("Max Character Count Reached");
    }
  }
  display.html(equation);
  hist.html(histEquation);
}

$(document).ready(updateDisplay())

$('.num-button').click(function() {
  var pressed = $(this).text();
  if (histEquation[histEquation.length - 2] == '=') {
    equation.length = 0;
    histEquation.length = 0;
  }
  if (equation[0] === 0 && equation.length < 2) {
    equation.pop();
    histEquation.pop();
  }
  equation.push(parseInt(pressed));
  histEquation.push(parseInt(pressed));
  updateDisplay();
})

$('.function-button').click(function() {
  var pressed = $(this).text();
  if (pressed != '.' && pressed != 'C' && pressed != '←' && equation.length < 1) {
    console.log("You can't enter a symbol without a number");
  }
  else {
    processInput(pressed);
  }
})

function checkDuplicateOperator() {
  var isOp = operators2.test(equation[equation.length-1]);
  if (isOp) {
    equation.pop();
    histEquation.pop();
  }
}

function processInput(pressedButton) {
  switch (pressedButton) {
    case 'C':
      //empty the equation array
      equation.length = 0;
      histEquation.length = 0;
      histEquation.push(0);
      equation.push(0);
      break;
    case '←':
      equation.pop();
      histEquation.pop();
      if (equation.length === 0) {
        equation.push(0);
        histEquation.length = 0;
        histEquation.push(0);
      }
      break;
    case 'x':
      checkDuplicateOperator();
      equation.push(pressedButton);
      histEquation.push(pressedButton);
      break;
    case '÷':
      checkDuplicateOperator();
      equation.push(pressedButton);
      histEquation.push(pressedButton);
      break;
    case '-':
      checkDuplicateOperator();
      equation.push(pressedButton);
      histEquation.push(pressedButton);
      break;
    case '+':
      checkDuplicateOperator();
      equation.push(pressedButton);
      histEquation.push(pressedButton);
      break;
    case '.':
      //todo: handle 1 period per number
      if (equation.length < 1) {
        equation.push(0);
        histEquation.push(0);
      }
      equation.push(pressedButton);
      histEquation.push(pressedButton);
      break;
    case '=':
      checkDuplicateOperator();
      calculateEquation();
      histEquation.push(pressedButton);
      histEquation.push(answer);
      break;
  }
 updateDisplay();
  simplifyEquation();
}

function simplifyEquation() {
  var numbers = [];
  var number = 0;
  var simplified = [];
  var stackBottom;
  while (equation.length > 0) {
    stackBottom = equation.shift();
    if (digits.test(stackBottom) || stackBottom == '.') {
      numbers.push(stackBottom);
    }
    else {
      
      number = parseFloat(numbers.join(''));
      if (!isNaN(number)) {
        simplified.push(number);
        numbers.length = 0;
        simplified.push(stackBottom);
      }
     
    }
  }
  number = parseFloat(numbers.join(''));
  if (!isNaN(number)) {
    simplified.push(number);
  }
  equation = simplified;
  updateDisplay();
}

function calculateEquation() {
  simplifyEquation();
  var operand1, operand2, outcome;
  var newEquation = [];
  for (var i = 0; i < equation.length; i++) {
    if (equation[i] == 'x') {
      operand1 = equation[i - 1];
      operand2 = equation[i + 1];
      outcome = operand1 * operand2;
      equation[i + 1] = outcome;
      newEquation.pop();
      newEquation.push(outcome);
      i++;
    }
    else if (equation[i] == '÷') {
      operand1 = equation[i - 1];
      operand2 = equation[i + 1];
      outcome = Math.round((operand1 / operand2) * 100) / 100;
      equation[i + 1] = outcome;
      newEquation.pop();
      newEquation.push(outcome);
      i++;
    }
    else {
      newEquation.push(equation[i]);
    } 
  }
  equation = newEquation;
  addAndSubtract();
}

function addAndSubtract() {
  var operand1, operand2, outcome;
  var newEquation = [];
  for (var i = 0; i < equation.length; i++) {
    if(equation[i] == '+') {
      operand1 = equation[i - 1];
      operand2 = equation[i + 1];
      outcome = operand1 + operand2;
      equation[i + 1] = outcome;
      newEquation.pop();
      newEquation.push(outcome);
      i++;
    }
    else if (equation[i] == '-') {
      operand1 = equation[i - 1];
      operand2 = equation[i + 1];
      outcome = operand1 - operand2;
      equation[i + 1] = outcome;
      newEquation.pop();
      newEquation.push(outcome);
      i++;
    }
    else {
      newEquation.push(equation[i]);
    }
  }
  equation = newEquation;
  answer = equation[0];
}