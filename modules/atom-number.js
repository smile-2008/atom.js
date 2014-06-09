/**
 * @author shadow
 * @filename
 */

/** @class Number */
var MODULE = {
    manifest: {
        name: "Number",
        author: "shadow",

        createdDate: new Date(2004),

        exports: "all-members"
    },

    scope: {
        entry: function() {

        },
        handyAlias: {
            to2: "toBinary",
            to16: "toHex"
        }
    },

    members: {
        /**
         * @memberof Number
         * @desc convert a number to binaray format, 2 => "10"
         * @param number will be converted
         * @return a string
         */
        toBinary: function(number) {

            var result;

            /**@step call String.toString() */
            result = number.toString(2);

            return result;
        },

        /**
         * @memberof Number
         * @desc generate a number string for a number value
         * @param number a number that method process
         * @return a number string in hex
         */
        toHex: function(number) {

            var result;

            // call String.toString() api
            result = number.toString(16);

            return result;
        },
        /**
         * @memberof Number
         * @param number check a value is equal NaN
         * @returns {boolean} true of false
         */
        isNaN: function(number) {

            return (number !== number);
        },

        isInt: function(value, forceInt) {

            var typeofValue = typeof(value),
                computeValue,
                result = false;

            if(typeofValue == "number") {

                computeValue = value % 1;

                if(computeValue == 1 || computeValue == 0) {
                    result = true;
                }
            }
            else {

                value = value.toString();

                result = Boolean(value.match(/^(-|\+)*\d+$/)) && !forceInt;
            }

            return result;
        },

        isFloat: function(value, forceFloat) {

            var typeofValue = typeof(value),
                computeValue,
                result = false;

            if(typeofValue == "number") {

                computeValue = value % 1;

                if(computeValue !== 1 && computeValue !== 0) {
                    result = true;
                }
            }
            else {

                value = value.toString();

                result = Boolean(value.match(/^(-|\+)*\d*\.\d+$/)) && !forceFloat;
            }

            return result;
        },

        isNumeric: function(value, forceNumber) {

           return $Number.isInt(value, forceNumber) || $Number.isFloat(value, forceNumber);
        }
    }
}