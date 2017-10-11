$(document).ready(applyClickHandlers)

//Apply click handlers on page load
function applyClickHandlers() {
    $('body').on('keydown', keydown);
    $('.calc').on('click', '.number', number);
    $('.calc').on('click', '.operator', operator);
    $('.calc').on('click', '.calculate', calculate);
    $('.calc').on('click', '.clearEntry', clearEntry);
    $('.calc').on('click', '.clear', clear);
}

//Global array to store the equation
var calculation = [];

//Math function to handle all calculations
function doMath(array) {
    var result = 0;
    var item = 0;
    for (var index = 0; index < array.length; index++) {
        if (isNaN(array[index])) {
            switch(array[index]) {
                case 'x':
                    item = array[index-1] * array[index+1];
                    index--;
                    array.splice(index, 3, item);
                    break;
                case '/':
                    item = array[index-1] / array[index+1];
                    index--;
                    array.splice(index, 3, item);
                    break;
                default:
                    break;
            }
        }
    }
    for (var index = 0; index < array.length; index++) {
        if (isNaN(array[index])) {
            switch(array[index]) {
                case '-':
                    item = array[index-1] - array[index+1];
                    index--;
                    array.splice(index, 3, item);
                    break;
                case '+':
                    item = array[index-1] + array[index+1];
                    index--;
                    array.splice(index, 3, item);
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

//Handles the values displayed on the DOM
function number() {
    if($('.displayLarge').text()==0) { $('.displayLarge').text('') }
    //Checks for repeating decimals
    if(/\./.test($('.displayLarge').text()) && /\./.test($(this).val()) ) {
        return;
    } else {
        $('.displayLarge').append($(this).val()); 
    }
}

//Pushes the number and operator to the calculation array and displays them on the DOM
function operator() {
    if ($('.displayLarge').text() === "") {
        var currentOperator = $(this).val();
        calculation.pop();
        calculation.push(currentOperator);
        $('.displaySmall').append(currentOperator);
    } else {
        var text = parseFloat($('.displayLarge').text());
        currentOperator = $(this).val();
        $('.displaySmall').append(text + " " + currentOperator + " ");
        $('.displayLarge').text('');
        calculation.push(text, currentOperator);
    }
}

//Handles the equal button, calculates the math, and displays the result on the DOM
function calculate() {
    var result = 0;
    if ($('.displayLarge').text() === "") {
        if (calculation.length !== 0) {
            calculation.pop();
            result = doMath(calculation);
            calculation = [];
            $('.displaySmall').text('');
            $('.displayLarge').text(result);
        }
    } else {
        var text = parseFloat($('.displayLarge').text());
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

//Handle keys pressed on the keyboard and displays them on the DOM
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
        if($('.displayLarge').text()==0) { $('.displayLarge').text('') }
        $('.displayLarge').append(String.fromCharCode(input));
    }
}