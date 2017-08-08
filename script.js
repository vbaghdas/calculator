/**
 * Created by vachebaghdassarian on 7/31/17.
 */

$(document).ready(applyClickHandlers);

var userInput = [''];
var userInputHistory = {
    num1: null,
    operator: null,
    num2: null
};

function applyClickHandlers(){
    $('button#clear_all').click(clearAllHandler);
    $('button#clear').click(clearHandler);
    $('button.numbers').click(numberHandler);
    $('button.operators').click(operatorHandler);
    $('button#equals').on('click', function() {
        equalsHandler(userInput)});
    $('button#negative').on('click', function() {
        negativeHandler(userInput)});
}

function displayInput(){
    $('#screen').text(userInput.join(''));
}

function clearAllHandler(){
    $('#screen').text('0');
    userInput = [''];
    hasDecimal = false;
}

function clearHandler(){
    if(userInput[0] === ''){
        return;
    } else if(userInput.length === 1){
        userInput = [''];
    }
    else {
        userInput.splice(userInput.length-1, 1);

    }
    hasDecimal = false;
    displayInput();
}

function negativeHandler(userInputArr){
    if(userInputArr[0] > 0){
        userInputArr[0] = (userInputArr[0] * -1) + '';
    }
    displayInput();
}

var hasDecimal = false;

function numberHandler(){
    if(typeof userInput[0] === "number"){
        userInput = [''];
    }
    var numberClicked = $(this).text();
    if(numberClicked === '.' && hasDecimal){
        return;
    }
    userInput[userInput.length-1] += numberClicked;
    if(numberClicked === '.' && userInput[userInput.length-1].indexOf('.') !== -1){
        hasDecimal = true;
        return hasDecimal;
    }
    displayInput();
}

function operatorHandler(){
    var operatorClicked = $(this).text();
    hasDecimal = false;
    var last = userInput.length-1;
    if(userInput.length>1 && userInput[last] === ''){
        userInput.splice(userInput.length-2, 2)
    }
    userInput.push(operatorClicked, '');
    displayInput();
}

function doMath(userInput){
    var result = null;
    for(var i =1; i < userInput.length; i+=2) {
        var num1 = parseFloat(userInput[i-1]);
        var num2 = userInput[i+1];
        if(num2 === ''){
            num2 = num1;
        } else {
            num2 = parseFloat(num2);
        }
        switch(userInput[i]){
            case '+':
                if(result === null){
                    result += num1 + num2;
                    break;
                }
                result += num2;
                break;
            case '-':
                if(result === null){
                    result += num1 - num2;
                    break;
                }
                result -= num2;
                break;
            case '*':
                if(result === null){
                    result += num1 * num2;
                    break;
                }
                result *= num2;
                break;
            case '/':
                if(num1 === 1 && num2 === 0){
                    return $('#screen').text("Error");
                }
                else if(result === null){
                    result+= num1 / num2;
                    break;
                }
                result /= num2;
                break;
            default:
                break;
        }
    }
    userInputHistory.num1 = userInput[0];
    userInputHistory.num2 = userInput[2];
    userInputHistory.operator = userInput[1];
    userInput.splice(0,3,result);
    $('#screen').text(result);
}

function equalsHandler(userInputArr) {
    hasDecimal = false;
    if(userInputArr.length === 1 && userInputArr[0] === ''){
        return $('#screen').text("Ready");
    }
    else if(userInputArr.length === 1 && typeof userInputArr[0] === "string"){
        return userInputArr[0];
    }
    else if(!isNaN(userInputArr[0]) && userInputArr[0] !== "0" && userInputArr[0] === ''){
        userInputArr[0] = null;
        userInputArr[1] = null;
        doMath(userInputArr);
    }
    else if (userInputArr.length > 2) {
        if(userInputArr[4] === ''){
            userInputArr.splice(3, 4);
            doMath(userInputArr);
            userInputArr[0] = userInputArr[0]*2;
            displayInput();
        } else {
            doMath(userInputArr);
        }
    } else if (userInputArr.length === 1 && userInputArr[0] !== '' && userInputHistory.num1 !== null) {
        userInputArr[1] = userInputHistory.operator;
        userInputArr[2] = userInputHistory.num2;
        doMath(userInputArr);
    }
}