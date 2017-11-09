$(document).ready(applyClickHandlers)

//Apply click handlers on page load
function applyClickHandlers() {
    $('body').on('keydown', keydown);
    $('.calculator').on('click', '.number', handleNumber);
    $('.calculator').on('click', '.operator', handleOperator);
    $('.calculator').on('click', '.calculate', handleCalculate);
    $('.calculator').on('click', '.clearEntry', clearEntry);
    $('.calculator').on('click', '.clear', clear);
}

//Global variables
var firstOperand = null;
var lastOperand = null;
var currentOperator = null;
var calculation = [];
var result = 0;

//Math function to handle all calculations
function doMath(array) {
    var item = 0;
    for (var index = 0; index < array.length; index++) {
        firstOperand = array[index-1];
        lastOperand = array[index+1];
        if (isNaN(array[index])) {
            switch(array[index]) {
                case 'x':
                    item = firstOperand * lastOperand;
                    index--;
                    array.splice(index, 3, item);
                    break;
                case '/':
                    item = firstOperand / lastOperand;
                    index--;
                    array.splice(index, 3, item);
                    break;
                default:
                    break;
            }
        }
    }
    for (var index = 0; index < array.length; index++) {
        firstOperand = array[index-1];
        lastOperand = array[index+1];
        if (isNaN(array[index])) {
            switch(array[index]) {
                case '-':
                    item = firstOperand - lastOperand;
                    index--;
                    array.splice(index, 3, item);
                    break;
                case '+':
                    item = firstOperand + lastOperand;
                    index--;
                    array.splice(index, 3, item);
                    break;
                default:
                    break;
            }
        }
    }
    result = array[0];
    //If result is equal to Infinity (i.e. 1/0), display error
    return result === Infinity ? 'Error' : result;
}

//Handle the value displayed on the DOM
function handleNumber() {
    if ( $('.displayLarge').text()==0) { $('.displayLarge').text('') }
    //Check for repeating decimals
    if (/\./.test($('.displayLarge').text()) && /\./.test($(this).val()) ) {
        return;
    } else {
        $('.displayLarge').append($(this).val()); 
    }
}

//Pushe the number and operator to the calculation array and display them on the DOM
function handleOperator() {
    currentOperator = $(this).val();
    if ($('.displayLarge').text() === "") {
        calculation.pop();
        calculation.push(currentOperator);
        $('.displaySmall').append(currentOperator);
    } else {
        var text = parseFloat($('.displayLarge').text());
        $('.displaySmall').append(text + " " + currentOperator + " ");
        $('.displayLarge').text('');
        calculation.push(text, currentOperator);
    }
}

//Handle the equal button, calculate the equation, and displays the result on the DOM
function handleCalculate() {
    if ($('.displayLarge').text() === "") {
        if (isNaN(calculation[1])){
            //Operation Rollover
            if (calculation.length === 4) {
                var operand = calculation.pop();
                result = doMath(calculation);
                calculation.push(operand, result);
                var finalResult = doMath(calculation);
                calculation = [];
                $('.displaySmall').text('');
                $('.displayLarge').text(finalResult);
                return;
            }
            //Partial Operand
            calculation.push(calculation[0]);
            result = doMath(calculation);
            $('.displaySmall').text('');
            $('.displayLarge').text(result);
        }
        if (calculation.length !== 0) {
            calculation.pop();
            result = doMath(calculation);
            calculation = [];
            $('.displaySmall').text('');
            $('.displayLarge').text(result);
        }
    } else {
        var text = parseFloat($('.displayLarge').text());
        //Operation Repeat
        if ($('.displaySmall').text() === ''){
            calculation.push(result, currentOperator, lastOperand);
            result = doMath(calculation);
            calculation = [];
            $('.displaySmall').text('');
            $('.displayLarge').text(result);
            return;
        }
        calculation.push(text);
        result = doMath(calculation);
        calculation = [];
        $('.displaySmall').text('');
        $('.displayLarge').text(result);
    }
}

//Delete a single entry on the DOM
function clearEntry() {
    var currentInput = $('.displayLarge').text();
    var previousInput = currentInput.substr(0, (currentInput.length - 1));
    $('.displayLarge').text(previousInput);
}

//Delete the calculation from the DOM and reset the equation to an emptry array
function clear() {
    $('.displaySmall').text('');
    $('.displayLarge').text(0);
    calculation = [];
}

//Handle keys pressed on the keyboard and display them on the DOM
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