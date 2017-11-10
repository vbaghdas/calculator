$(document).ready(applyClickHandlers);

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
var num1 = null;
var num2 = null;
var operand = null;
var operator = null;
var calculation = [];
var result = 0;

//Math function to handle all calculations
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
    //If result is equal to Infinity (i.e. 1/0), display error
    return result === Infinity ? 'Error' : result;
}

//Handle the value displayed on the DOM
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

//Pushe the number and operator to the calculation array and display them on the DOM
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

//Handle the equal button, calculate the equation, and display the result on the DOM
function handleCalculate() {
    if ($('.displayLarge').text() === "") {
        if (calculation.length === 2){
            //Operation Rollover
            if (calculation.length === 4) {
                var lastNum = calculation.pop();
                result = doMath(calculation);
                calculation.push(lastNum, result);
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
        if (calculation.length == 0){
            //Partial Operand - implicit return
            if ( $('.displayLarge').length > 0 && isNaN(num2) ){
                calculation.push(operand, operator, text);
                result = doMath(calculation);
                $('.displaySmall').text('');
                $('.displayLarge').text(result);
            }
            calculation.push(result, operator, num2);
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
    operator = null;
    result = 0;
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