/**
 * @author shadow
 * @filename
 */

/** @class Random */
var MODULE =
{
    manifest: {
        name: "Random",
        author: "shadow"
    },

    scope: {

        entry: function() {

        },

        alias: {
            "randChar": "randomCharacter",
            "randCharR": "randomCharacterRanges",

            "randLowChar": "randomLowerCharacter",
            "randUpChar": "randomUpperCharacter"
        },

        handyAlias: {
            "rchar": "randomCharacter",
            "rcharR": "randomCharacterRanges",

            "rlow": "randomLowerCharacter",
            "rup": "randomUpperCharacter"
        }
    },

    members: {

        /** @member Random
         *  @desc generate a random character in range *
         *  @param maxAsciiCode the max ascii code of charactor in range
         *  @param minAsciiCode the min ascii code of charactor in range
         *  @return a random character*/

        randomCharacter: function(maxAsciiCode, minAsciiCode) {

            maxAsciiCode = maxAsciiCode || 255;
            minAsciiCode = minAsciiCode || 32;

            // convert strig to integer respectively

            if(typeof(maxAsciiCode) == "string") {
                maxAsciiCode = maxAsciiCode.charCodeAt(0);
            }

            if(typeof(minAsciiCode) == "string") {
                minAsciiCode = minAsciiCode.charCodeAt(0);
            }

            // get random integer as ascii code of return character
            var randomCode = Math.round(Math.random() * (maxAsciiCode - minAsciiCode) + minAsciiCode);

            // generate a character use String.fromCharCode api
            var randomChar = String.fromCharCode(randomCode);

            return randomChar;
        },

        /** @memberof Random
         *  @desc generate a random character in multiple ranges
         *  @return a random character */

        randomCharacterRanges: function() {

            var rangeList = arguments;

            // get a random range index use $Math.randomInteger

            var randIndex = $Math.randomInteger(rangeList.length - 1, 0)

            // get range from index

            var range = rangeList[randIndex] || {};

            var maxCode = range[0];
            var minCode = range[1];

            // get character use $Random.randomCharacter()
            var randomCharacter = $Random.randomCharacter(maxCode, minCode);

            return randomCharacter;
        },

        /** @memberof Random
         *  @desc generate a lowercase character in range, limit range
         *  @param maxCharacter the max character in range
         *  @param minCharacter the min character in range
         *  @return a random lowercase character */

        randomLowerCharacter: function(maxCharacter, minCharacter) {

            maxCharacter = maxCharacter || "z";
            minCharacter = minCharacter || "a";

            // limit range use $Math.limitRange()

            maxCharacter = $Math.limitRange(maxCharacter,"a", "z", true);
            minCharacter = $Math.limitRange(minCharacter, "a", "z", false);

            // generate a character use $Random.randomCharacter()

            var lowerChar = $Random.randomCharacter(maxCharacter, minCharacter);

            return lowerChar;
        },

        /** @memberof Random
         *  @desc generate a uppercase character in range
         *  @param maxCharacter the max character in range
         *  @param minCharacter the min character in range
         *  @return a random uppercase character*/

        randomUpperCharacter: function(maxCharacter, minCharacter) {

            maxCharacter = maxCharacter || "Z";
            minCharacter = minCharacter || "A";

            // limit character range

            maxCharacter = $Math.limitRange(maxCharacter, "A", "Z", true);
            minCharacter = $Math.limitRange(minCharacter, "A", "Z", false);

            // generate a random uppercase character use $Random.randomCharacter()

            var upperChar = $Random.randomCharacter(maxCharacter, minCharacter);

            return upperChar;
        },

        /** @memberof Random
         *  @desc generate a letter (A-z) in range
         *  @param maxCharacter the max character in range
         *  @param minCharacter the min charater in range
         *  @param lowerMode indicate when
         *  @return a random character*/

        randomLetter: function(maxCharacter, minCharacter, lowerMode) {

            maxCharacter = maxCharacter || "z";
            minCharacter = minCharacter || "A";

            // limit range
            maxCharacter = $Math.notLargeThan(maxCharacter, "z");
            minCharacter = $Math.notSmallThan(minCharacter, "A");


            var resultLetter;

            // check arguments border

            if($Math.inRanges(maxCharacter, ["a", "z"], ["A", "Z"]) === false) {
                if(lowerMode == true) {
                    maxCharacter = "z";
                }
                else {
                    maxCharacter = "Z";
                }
            }

            if($Math.inRanges(minCharacter, ["a", "z"], ["A", "Z"]) === false) {
                if(lowerMode == true) {
                    minCharacter = "a";
                }
                else {
                    minCharacter = "A";
                }
            }

            if(maxCharacter <= "Z") {
                resultLetter = $Random.randomCharacter(maxCharacter, minCharacter);
            }
            else if(minCharacter >= "a") {
                resultLetter = $Random.randomCharacter(maxCharacter, minCharacter);
            }
            else {

                // create two ranges

                var lowerRange = [ minCharacter, "Z"];

                var upperRange = [ "a", maxCharacter];

                // get a boolean to choose range
                var getLower = $Question.trueOrFalse();

                if(getLower == true) {
                    maxCharacter = lowerRange[0];
                    minCharacter = lowerRange[1];
                }
                else {
                    maxCharacter = upperRange[0];
                    minCharacter = upperRange[1];
                }

                // generate a random letter
                resultLetter = $Random.randomCharacter(maxCharacter, minCharacter);
            }

            return resultLetter;
        }

    }
}
