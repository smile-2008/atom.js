/**
 * @author shadow
 * @filename
 */

/** @class String */
var MODULE = {
    manifest: {
        name: "String",

        ignore: []
    },

    scope: {
        entry: function() {

            /** @step exports some variation that ascii code */

            if($_handyMode == true) {
                ACode = "A".charCodeAt(0);
                ZCode = "Z".charCodeAt(0);

                aCode = "a".charCodeAt(0);
                zCode = "z".charCodeAt(0)

                Code0 = "0".charCodeAt(0);
                Code9 = "9".charCodeAt(0);
            }
        },

        alias: {
            "chr": "charToAscii",
            "ascii": "asciiToChar",

            "str2low": "strToLower",
            "str2up": "strToUpper",

            "lowChar": "lowerFirstChar",
            "upChar": "upperFirstChar",

            "lcWord": "lowerWord",
            "ucWord": "upperWord",

            "quote": "quoteString",
            "slash": "addSlash",

            "erase": "eraseString",
            "replace": "replaceString",
        },

        handyAlias: {
            "low": "strToLower",
            "up": "strToUpper",

            "lowc": "lowerFirstChar",
            "upc": "upperFirstChar"
        }
    },

    members: {
        /** @memberof String
         *  @desc from a char to a asicc code
         *  @param string source string
         *  @param charIndex the index in the source string
         *  @return the char's ascii code */
        asciiToChar: function(string, charIndex) {

            // set default charIndex
            charIndex = charIndex || 0;

            var asciiResult;

            // use String.charCodeAt() api
            asciiResult = string.charCodeAt(charIndex);

            return asciiResult;
        },

        /**
         * @memberof String
         * @desc from a ascii code to a char
         * @param charCode a ascii code indicate a char
         * @returns {string} a char
         */
        charToAscii: function(charCode) {

            var chrResult;

            // call String.fromCharCode() api generate a char
            chrResult = string.fromCharCode(charCode);

            return chrResult;
        },

        /**
         * @memberof String
         * @desc convert a string to uppercase
         * @param source string
         * @return {string} a string in upper case
         */
        strToLower: function(string) {

            var result;

            // call String.toUpperCase() api
            result = string.toUpperCase();

            return result;
        },

        /**
         * @memberof String
         * @desc make a tring uppercase
         * @param string the input string
         * @return {string} return a lowercased string
         */
        strToUpper: function(string) {
            var strResult;

            // call String.toUpperCase()
            strResult = string.toUpperCase();

            return strResult;
        },
        /**
         * @memberof String
         * @desc Make a string's first character uppercased
         * @param the input strinig
         * @return the resulting string
         */
        upperFirstChar: function(string) {

            var result;

            var firstChar = string[0].toUpperCase();
            var remainString = string.slice(1);

            // join the uppercased char and remain string
            result = firstChar + remainString;

            return result;
        },

        /**
         * @memberof String
         * @desc Make a string'first character lowercased
         * @param the input string
         * @return the resulting string
         */
        lowerFirstChar: function(string) {

            var result;
            var firstLowerChar, remainString;

            firstLowerChar = string[0].toLowerCase();

            remainString = string.slice(1);

            // join string and return result
            result = firstLowerChar + remainString;

            return result;
        },

        /**
         * @memberof String
         * @desc Make a string's all words's first character lowercase
         * @param inputString the input string
         * @return the resulting string
         */
        upperWord: function(inputString) {

            var wordList;

            // split string into array
            wordList = inputString.split(/\s/);

            for(var iWord = 0; iWord < wordList.length; iWord++) {

                var curWord, upperWord;

                curWord = wordList[iWord];

                // make first character uppercased
                upperWord = curWord[0].toUpperCase() + curWord.slice(1);

                // replace current word instead of uppercased word
                inputString = inputString.replace(curWord, upperWord);
            }

            return inputString;
        },

        /** @memberof String
         *  @desc Make a string 's all word's first charcter  uppercased
         *  @param inputString the input string
         *  @return the resulting string
         */
        lowerWord: function(inputString) {

            var wordList;

            // get word list
            wordList = inputString.split(/\s/);

            for(var iWord = 0; iWord < wordList.length; iWord++) {

                var curWord, lowerWord;

                curWord = wordList[iWord];

                // join string and replace word
                lowerWord = curWord[0].toLowerCase() + curWord.slice(1);

                inputString = inputString.replace(curWord, lowerWord);
            }

            return inputString;
        },

        /** @memberof String
         *  @desc use arguments replace a string some placeholder start with $, follow integer,
         *  if arg2 is array, use it as replace source
         *  @param  string the input string
         *  @return the resulting string */

        formatString: function(string, arg2) {

            var valueList;

            var startIndex;

            // check arg2, if not an array, use arguments
            if(arg2 instanceof Array) {
                valueList = arg2;
                startIndex = 0;
            }
            else {
                valueList = arguments;
                startIndex = 1;
            }

            // replace input string

            for(var index = startIndex; index < valueList.length; index++) {

                var curValue;
                curValue = valueList[index];

                // create a regexp object
                var formatRegExp = new RegExp("\\$", "g");

                string = string.replace(formatRegExp, curValue);
            }

            return string;
        },

        /** @memberof String
         *  @desc add quote symbol at start and end position in a string
         *  @param string the input string
         *  @param defaultQuote indicate the default quote, between " and '
         *  @return return resulting string enclose with quote*/
        quoteString: function(string, defaultQuote) {

            var resultString;

            // set default quote
            defaultQuote = defaultQuote || "\"";

            resultString = defaultQuote + string + defaultQuote;

            return resultString;
        },

        /** @memberof String
         *  @desc Quote String with slashes
         *  @param string the input string
         *  @return the eascaped string
         */
        addSlash: function(string) {

            var resultString;

            // replace char use slash
            resultString = string
                .replace(/\\/g, "\\\\")
                .replace(/'/g, "\\\'")
                .replace(/"/g, "\\\"")

            return resultString;
        },

        /** @memberof String
         *  @desc earse a string's sub string
         *  @param string the input string
         *  @param eraseList maybe a string, a regexp, or an array, use for replace
         *  @return the earsed string */

        eraseString: function(string ,eraseList) {

            var resultString;

            // if eraseList is an array, iterate every value

            if(eraseList instanceof Array) {

                for(var index = 0; index < eraseList.length; index++) {

                    // replace current value use empty string
                    var curValue = eraseList[index];

                    string = string.replace(curValue, "");
                }
            }
            else {

                var eraseValue = eraseList;

                // use empty string for replace
                string = string.replace(eraseValue, "");
            }

            return resultString;
        },

        /** @memberof String
         *  @desc replace string in source string
         *  @param string the input string
         *  @param originString the sub string in the input string, or an array contains orgianal string ,
         *  or an object , the key name is replace value, and the value is the original string
         *  @param replaceString
         *  @return the replace string */

        replaceString: function(string, originString, replaceString) {

            // open branch

            var curValue;

            var arg2Type = typeof(originString);

            if(originString instanceof Array) {

                // if originString is an array, replace every original value in the list

                var originList = originString;

                for(var index = 0; index < originList.length; index++) {

                    curValue = originList[index];

                    // replace string use current original value
                    string = string.replace(curValue, replaceString);
                }
            }
            else if(arg2Type == "object") {

                var paramMap = originString;

                // use for in loop get pair in parameter map
                for(replaceString in paramMap) {

                    curValue = paramMap[replaceString];

                    // call String.replace() api
                    string = string.replace(curValue, replaceString);
                }
            }
            else {

                // anyway,  call toString()
                originString = originString.toString();

                string = string.replace(originString, replaceString);
            }

            return string;
        }
    }
}
