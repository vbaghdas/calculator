$(document).ready(init);

var my_calculator = null;

function init() {
    my_calculator = new Calculator();
    my_calculator.set_options({
        body: '.calculator',
        numbers: '.number',
        operators: '.operator',
        equals: '#equalSign',
        display: '.display'
    });
    my_calculator.initialize();
}

function Calculator() {
    this.inputs = [];
    this.current_input_index = 0;
    this.calc_parts = {
        body: null,
        numbers: null,
        operators: null,
        equals: null,
        display: null
    };
    this.debug_mode = 'verbose';

    this.initialize = function() {
        this.attach_click_handlers();
    };
    this.attach_click_handlers = function (){
        this.calc_parts.numbers.click(this.handle_number_click.bind(this));
        this.calc_parts.operators.click(this.handle_operator_click.bind(this));
    };
    this.handle_operator_click = function(){
        this.display_error('in operator click handler');
        var button_text = $(event.target).text();
        this.current_input_index++;
        var op = new operator_obj;
        op.set_value(button_text);
        this.inputs.push(op);
        this.current_input_index++;
    };
    this.handle_number_click = function (){
        this.display_error('in number click handler');
        var button_text = $(event.target).text();
        if(this.inputs[this.current_input_index] === undefined){
            var node = new number_obj(this);
            this.inputs.push(node);
        }
        this.inputs[this.current_input_index].add_value(button_text);
    };
    this.display_error = function(message, type){
        if(this.debug_mode !== 'verbose'){
            return
        }
        if(type === undefined){
            type = 'warning';
        }
        if(type === 'warning'){
            console.warn(message);
        }
        else {
            console.error(message);
        }
    };
    this.set_options = function (options){
        for(var i in options){
            var temp_name = 'set_calc_' + i;
            if(this[temp_name] !== undefined){
                this[temp_name](options[i]);
            } else {
                this.display_error('that option is not valid')
            }
        }
    };
    this.set_calc_body = function (element){
        this.calc_parts.body = $(element);
    };
    this.set_calc_display = function(element){
        this.calc_parts.display = $(element);
    };
    this.set_calc_numbers = function(element){
        this.calc_parts.numbers = $(element);
    };
    this.set_calc_operators = function(element){
        this.calc_parts.operators = $(element);
    };
    this.set_calc_equals = function(element){
        this.calc_parts.equals = $(element);
    }
}

function number_obj(parent) {
    this.value = null;
    this.parent = parent;
    this.type = 'number';
    this.has_decimal = false;
    this.set_value = function(new_value){
        this.value = new_value;
    };
    this.display_error = function(message){
        this.parent.display_error(message)
    };
    this.add_value = function(new_value){
        if(new_value !== '.' && !this.test_if_number(new_value)){
            this.display_error('given value is not a number');
            return false;
        }
        if(this.value === null){
            this.value = new_value;
        } else {
            if(new_value === '.'){
                if(this.has_decimal){
                    this.display_error('already has a decimal');
                    return false;
                } else {
                    this.has_decimal = true;
                }
            }
            this.value += new_value.toString();
        }
        return this.get_value();
    };
    this.get_value = function(){
        return parseFloat(this.value);
    };
    this.test_if_number = function(unknown_value){
        if(!isNaN(unknown_value)){
            return true;
        } else {
            return false;
        }
    }
}

function operator_obj(parent) {
    this.value = null;
    this.type = 'operator';
    this.parent = parent;
    this.set_value = function(new_value){
        this.value = new_value;
    };
    this.get_value = function(){
        return this.get_value();
    };
    this.display_error = function(message){
        this.parent.display_error(message);
    };
    this.do_math = function(operand1_object, operand2_object){
        var operand1 = operand1_object.get_value();
        var operand2 = operand2_object.get_value();
        switch(this.value){
            case '+':
            case 't':
                return operand1 + operand2;
                break;
            case '-':
            case '_':
                return operand1 - operand2;
                break;
            case '/':
            case '%':
                if(operand2 === 0){
                    this.display_error('cannot divide by 2');
                    return
                }
                else if(operand2 === 2){
                    return operand1 >> 1;
                }
                return operand1 / operand2;
                break;
            case 'x':
            case 'X':
            case '*':
                return operand1 * operand2;
                break;
        }
    }
}