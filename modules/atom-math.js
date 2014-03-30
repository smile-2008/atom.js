/**
 * @author shadow
 * @filename
 */

/** @class Math */
var MODULE = {

    manifest: {
        name: "Math",
        author: "shadow",

        appendence: ["random"]
    },

    scope: {
        onInit: function() {

            // expose Math API
            var MathApi = ["round", "ceil", "floor", "random", "sin", "cos", "tan"];

            $Namespace.addGlobal(Math, MathApi);
        },
        entry: function() {

        },

        alias: {
            "randInt": "randomInteger",
            "randNum": "randomFloat",

            "randIntR": "randomIntegerRanges",
            "randNumR": "randomFloatRanges",

            "limit": "limitNumber",
            "limitNum": "limitNumberRange",
            "limitChar": "limitCharacterRange",

            "range": "getRangeList"
        },

        handyAlias: {

            "rint": "randomInteger",
            "rnum": "randomFloat",

            "rintR": "randomIntegerRanges",
            "rnumR": "randomFloatRanges",

            "lt": "largeThan",
            "st": "smallThan",

            "nlt": "notLargeThan",
            "nst": "notSmallThan",

            "neq": "notEqual"
        }
    },

    members: {
        /** @memberof Math
         *  @desc generate a random integer in a range
         *  @param maxInteger max integer in range
         *  @param minInteger min integer in range
         *  @return a random integer*/
        randomInteger: function(maxInteger, minInteger) {

            maxInteger = maxInteger || 100;
            minInteger = minInteger || 0;

            var resultInteger;

            // use Math api, round() and random()

            resultInteger = Math.round(Math.random() * (maxInteger - minInteger) + minInteger);

            return resultInteger;
        },

        /** @memberof Math
         *  @desc generate a random float number in a range
         *  @param maxFloat the max float number in range
         *  @param minFloat the min float number in range
         *  @param precision the pricision of the result float number
         *  @return a random float number*/

        randomFloat: function(maxFloat, minFloat, precision) {

            precision = precision || 2;

            minFloat = minFloat || 0;
            maxFloat = maxFloat || 1;

            // Math.random() generate a number between 0 - 0.999..
            var resultFloat = Math.random() * (maxFloat - minFloat) + minFloat;

            return resultFloat.toFixed(precision);
        },

        /** @memberof Math
         *  @desc generate a random integer in multiple ranges
         *  @return a random integer */

        randomIntegerRanges: function() {

            var argumentLength = arguments.length;

            // get a random range index

            var rangeIndex = $Math.randomInteger(argumentLength - 1, 0);

            var range = arguments[rangeIndex] || {};

            // set max and min integer
            var maxInteger = range[0];
            var minInteger = range[1];

            // get a random integer
            var resultInteger = $Math.randomInteger(maxInteger, minInteger);

            return resultInteger;
        },

        /** @memberof Math
         *  @desc generate a random float number in multiple ranges
         *  @return a random float number */

        randomFloatRanges: function() {

            var rangeList = arguments;

            var rangeIndex = $Math.randomInteger(rangeList.length - 1);

            var range = rangeList[rangeIndex] || {};

            // generate a random float number
            var resultFloat = $Math.randomFloat(range[0], range[1], range[2]);

            return resultFloat;
        },

        /** @memberof Math
         *  @desc limit a input number in a range
         *  @param number the input number
         *  @param minNumber the min number in range
         *  @param maxNumber the max number in range
         *  @param defaultMax indicate if number out of range, the default value whether maxNumber
         *  @return a number*/
        limitNumberRange: function(number, minNumber, maxNumber, defaultMax) {

            if( (number < minNumber) && (number > maxNumber)) {

                // out of range, check defaultMax
                if(defaultMax == true) {
                    number = maxNumber;
                }
                else {
                    number = minNumber;
                }
            }

            return number;
        },

        /** @memberof Math
         *  @desc limit a input character in range
         *  @param character the input character
         *  @param maxCharacter the max character in range
         *  @param minCharacter the min charcter in range,
         *  @param defaultMax if true, when input character out of range, set character is maxCharacter, else is minCharacter
         *  @return a character*/

        limitCharacterRange: function(character, minCharacter, maxCharacter, defaultMax) {

            var charCode, maxCode, minCode;

            // get ascii code for math compare
            charCode = character.charCodeAt(0);

            minCode = minCharacter.charCodeAt(0);
            maxCode = maxCharacter.charCodeAt(0);

            // check whether out of range
            if( (charCode < minCode) && (charCode > maxCode)) {

                if(defaultMax == true) {
                    character = maxCharacter;
                }
                else {
                    character = minCharacter;
                }
            }

            return character;
        },

        /** @memberof Math
         *  @desc limit a number or character in a range
         *  @param input the input number or character
         *  @param min the min in range, number of character
         *  @param max the max in range, number or character
         *  @return a number or a character*/

        limitRange: function(input, min, max, defaultMax) {

            var result;

            if(typeof(input) == "string") {
                result = $Math.limitCharacterRange.apply(null, arguments);
            }
            else {
                result = $Math.limitNumberRange.apply(null, arguments);
            }

            return result;
        },

        /** @memberof Math
         *  @desc check input value whether in a range
         *  @param input a number or a character
         *  @param maxValue the max value of range
         *  @param minValue the min value of range
         *  @return ture or false*/

        inRange: function(input, maxValue, minValue) {

            var checkResult = false;

            if( (input <= maxValue) && (input >= minValue)) {
                checkResult = true;
            }

            return checkResult;
        },

        /** @memberof Math
         *  @param input the input number or character
         *  @return this*/

        inRanges: function(input) {

            var checkResult = false;

            // iterate arguments
            for(var iRange = 1; iRange < arguments.length; iRange++) {

                var curRange = arguments[iRange];

                if($Math.inRange(input, curRange[1], curRange[0]) == true) {
                    checkResult = true;
                    break;
                }
            }

            return checkResult;
        },
          /** @memberof Math
         *  @desc limit a number or a character by max value
         *  @param input the input number or character
         *  @param compareValue the compare value
         *  @return a number or a character*/

        notLargeThan: function(input, compareValue) {

            if(input > compareValue) {
                input = compareValue;
            }

            return input;
        },

        /** @memberof Math
         *  @desc limit a number or a character by min value
         *  @param input the input or character
         *  @param compareValue the compare value
         *  @return a number or a character*/

        notSmallThan: function(input, compareValue) {

            if(input < compareValue) {
                input = compareValue;
            }

            return input;
        },

        /** @memberof Math
         *  @desc limit input value large than a value
         *  @param input the input value
         *  @param minValue a value use as a minimize
         *  @return a value*/

        largeThan: function(input, minValue) {

            if(input <= minValue) {
                input = minValue + 0.000000001;
            }

            return input;
        },

        /** @memberof Math
         *  @desc limit input value small than a value
         *  @param input the input value
         *  @param maxValue a value use as a maximize
         *  @return a compared value*/

        smallThan: function(input, maxValue) {

            if(input >= maxValue) {
                input = maxValue - 0.000000001;
            }

            return input;
        },

        /** @memberof Math
         *  @desc limit a input value not equal a compare value
         *  @param input the input value
         *  @param equalValue a value use for compare
         *  @param defaultValue default value if compared result is equal
         *  @return a compared value*/

        notEqualThan: function(input, compareValue, defaultValue) {

            if(input === compareValue) {
                input = defaultValue;
            }

            return input;
        },

        /** @memberof Math
         *  @desc generate a value array in range
         *  @param startValue the start value in range
         *  @param endValue the end value in range
         *  @param step the step value
         *  @return the value array */

        getRangeList: function(startValue, endValue, step) {

            step = step || 1;

            var isCharacter = (typeof(startValue) == "string");

            if(isCharacter == true) {
                startValue = startValue.charCodeAt(0);
                endValue = endValue.charCodeAt(0);
            }

            var listLength = Math.abs((startValue - endValue) / step) + 1;

            var isReversed = false;

            // if condition true, reverse step
            if(startValue > endValue) {
                step = - step;

                isReversed = true;
            }

            var valueArray = new Array();

            // generate every value

            for(var index = 0; index < listLength; index++) {

                var curValue = startValue + step*index;

                if(isReversed == true && (curValue < endValue)) {
                    continue;
                }
                else if((isReversed == false) && (curValue > endValue)) {
                    continue;
                }

                if(isCharacter == true) {
                    curValue = String.fromCharCode(curValue);
                }

                // push value to array
                valueArray.push(curValue);
            }

            return valueArray;
        }
    },

    Class: {

        Rectangle: function(x1, y1, width, height) {

            if(x1 instanceof $Math.Rectangle) {

                var rectInstance = x1;

                this.x1 = rectInstance.x1;
                this.x2 = rectInstance.x2;
                this.y1 = rectInstance.y1;
                this.y2 = rectInstance.y2;

                return this;
            }

            if(x1 instanceof Array) {

                var intList = x1;

                x1 = intList[0];
                y1 = intList[1];
                width = intList[2];
                height = intList[3];
            }

            this.x1 = x1;this.y1 = y1;
            this.x2 = x1 + width;
            this.y2 = y1 + width;

            this.testCoordinate = function(x, y) {

                if(x instanceof Array) {

                    x = x[0]; y = x[1];
                }

                // prepare number
                var x1 = this.x1, x2 = this.x2, y1 = this.y1, y2 = this.y2;
                var maxNum, minNum;

                var inRectangle = true;

                if(x != undefined) {

                    maxNum = x1 > x2 ? x1 : x2;
                    minNum = x1 < x2 ? x1 : x2;

                    if( !(x >= minNum) || !(x <= maxNum)) {
                        inRectangle = false;
                    }
                }

                if( y != undefined) {

                    maxNum = y1 > y2 ? y1 : y2;
                    minNum = y1 < y2 ? y1 : y2;

                    if( !(y1 >= minNum) || !(y <= maxNum)) {
                        inRectangle = false;
                    }
                }

                return inRectangle;
            }

        }
    }
}