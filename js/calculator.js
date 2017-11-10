$(document).ready(applyClickHandlers);

//Apply click handlers on page load
function applyClickHandlers() {
    $('.calculator').on('click', '.number', handleNumber);
    $('.calculator').on('click', '.operator', handleOperator);
    $('.calculator').on('click', '.calculate', handleCalculate);
    $('.calculator').on('click', '.clearEntry', clearEntry);
    $('.calculator').on('click', '.clear', clear);
    $('body').on('keydown', keydown);
}

// Display Result
function displayResult(result) {
    $('.displaySmall').text('');
    $('.displayLarge').text(result);
}

// Global variables
var num1 = null;
var num2 = null;
var operand = null;
var operator = null;
var calculation = [];
var result = null;

// Math Function
function doMath(array) {
    var item = 0;
    num1 = array[0];
    num2 = array[2];
    for (var i = 0; i < array.length; i++) {
        if (isNaN(array[i])) {
            switch(array[i]) {
                case 'x':
                    item = array[i-1] * array[i+1];
                    i--;
                    array.splice(i, 3, item);
                    break;
                case '/':
                    item = array[i-1] / array[i+1];
                    i--;
                    array.splice(i, 3, item);
                    break;
                default:
                    break;
            }
        }
    }
    for (var i = 0; i < array.length; i++) {
        if (isNaN(array[i])) {
            switch(array[i]) {
                case '-':
                    item = array[i-1] - array[i+1];
                    i--;
                    array.splice(i, 3, item);
                    break;
                case '+':
                    item = array[i-1] + array[i+1];
                    i--;
                    array.splice(i, 3, item);
                    break;
                default:
                    break;
            }
        }
    }
    result = array[0];
    // If result is equal to Infinity (i.e. 1/0), display error
    return result === Infinity ? 'Error' : result;
}

// Handle the value displayed on the DOM
function handleNumber() {
    operand = parseFloat($(this).val());
    if ( $('.displayLarge').text()==0) { $('.displayLarge').text('') }
    //Check for repeating decimals
    if (/\./.test($('.displayLarge').text()) && /\./.test($(this).val()) ) {
        return;
    } else {
        $('.displayLarge').append($(this).val()); 
    }
}

// Push the number and operator to the calculation array and display them on the DOM
function handleOperator() {
    operator = $(this).val();
    if ($('.displayLarge').text() === "") {
        calculation.pop();
        calculation.push(operator);
        $('.displaySmall').append(operator);
    } else {
        var text = parseFloat($('.displayLarge').text());
        $('.displaySmall').append(text + " " + operator + " ");
        $('.displayLarge').text('');
        calculation.push(text, operator);
    }
}

// Handle the calculation button, calculate the equation, and display the result on the DOM
function handleCalculate() {
    if ($('.displayLarge').text() === "") {
        if (calculation.length === 2) { operationRollOver() }
        if (calculation.length !== 0) { comprehensiveOperation() }
    } else {
        var currentInput = parseFloat($('.displayLarge').text());
        if (calculation.length == 0){
            if ( $('.displayLarge').length > 0 && isNaN(num2) ){
                partialOperand(currentInput);
            }
            if (currentInput === 0 || isNaN(currentInput)) {
                $('.displayLarge').text('Ready');
            }
            operationRepeat();
            return;
        }
        exclusiveOperation(currentInput);
    }
}

// Operation Rollover input: 1 + 1 + = + = output: 8
function operationRollOver() {
    calculation.push(calculation[0]);
    result = doMath(calculation);
    displayResult(result);
}

// Comprehensive Operation input: 1 + 3 / 4 + 10 * 2 = output: 21.75
function comprehensiveOperation() {
    calculation.pop();
    result = doMath(calculation);
    calculation = [];
    displayResult(result);
}

// Partial Operand input: 3 * = output: 9
function partialOperand(currentInput) {
    calculation.push(operand, operator, currentInput);
    result = doMath(calculation);
    displayResult(result);
}

// Operation Repeat input: 1 + 1 = = = output: 4
function operationRepeat() {
    calculation.push(result, operator, num2);
    result = doMath(calculation);
    calculation = [];
    displayResult(result);
}

// Exclusive Operation
function exclusiveOperation(currentInput) {
    calculation.push(currentInput);
    result = doMath(calculation);
    calculation = [];
    displayResult(result);
}

// Delete a single entry on the DOM
function clearEntry() {
    var currentInput = $('.displayLarge').text();
    var previousInput = currentInput.substr(0, (currentInput.length - 1));
    $('.displayLarge').text(previousInput);
}

// Delete the calculation from the DOM and reset the equation to an emptry array
function clear() {
    $('.displaySmall').text('');
    $('.displayLarge').text(0);
    num1 = null;
    num2 = null;
    operand = null;
    operator = null;
    calculation = [];
    result = null;
}

// Handle keys pressed on the keyboard and display them on the DOM
function keydown() {
    var input = event.which || event.keyCode;
    if (input === 46 || input === 110 || input === 190) {
        $('.displayLarge').append(String.fromCharCode(46));
    } else if (input === 13) {
        calculate();
    } else if (input === 8) {
        clear();
    }
    else if (input >= 48 && input <= 57) {
        if ( $('.displayLarge').text()==0) { $('.displayLarge').text('') }
        $('.displayLarge').append(String.fromCharCode(input));
    }
}