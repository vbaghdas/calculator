$(document).ready(applyClickHandlers)

function applyClickHandlers() {
    $('.calc').on('keydown', keydown);
    $('.calc').on('click', '.number', number);
    $('.calc').on('click', '.operator', operator);
    $('.calc').on('click', '.calculate', calculate);
    $('.calc').on('click', '.clearEntry', clearEntry);
    $('.calc').on('click', '.clear', clear);
}

var calculation = [];

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
                    array.splice(i, 3, item);
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
    return result;
}

function number() {
    $('.displayLarge').append($(this).val());
}

function operator() {
    if ($('.displayLarge').text() === "") {
        var currentOperator = $(this).val();
        calculation.pop();
        calculation.push(currentOperator);
        var currentInput = $('.displaySmall').text();
        var previousInput = currentInput.substr(0, (currentInput.length - 2));
        $('.displaySmall').text(previousInput).append(currentOperator);
    } else {
        var text = parseFloat($('.displayLarge').text());
        currentOperator = $(this).val();
        $('.displaySmall').append(text + " " + currentOperator + " ");
        $('.displayLarge').text('');
        calculation.push(text, currentOperator);
    }
}

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

function clearEntry() {
    var currentInput = $('.displayLarge').text();
    var previousInput = currentInput.substr(0, (currentInput.length - 1));
    $('.displayLarge').text(previousInput);
}

function clear() {
    $('.displaySmall').text('');
    $('.displayLarge').text('');
    calculation = [];
}

function keydown() {
    var clicked = event.which || event.keyCode;
    if (clicked === 46 || clicked === 110 || clicked === 190) {
        $('.displaySmall').append(String.fromCharCode(46));
    } else if (clicked === 13) {
        calculateClicked();
    } else if (clicked === 8) {
        clear();
    }
    else if (clicked >= 48 && clicked <= 57) {
        $('.displayLarge').append(String.fromCharCode(clicked));
    }
}