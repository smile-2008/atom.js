/**
 * @author shadow
 * @filename
 */

/** @class Question */
var MODULE = {
    manifest: {
        name: "Question"
    },

    scope: {
        entry: function() {

        },

        handyAlias: {
            "tof": "trueOrFalse"
        }
    },

    members: {

        /** @memberof Qustion
         *  @desc: return a boolean both true or false
         *  @return true or false*/

        trueOrFalse: function() {

            var number = Math.round(Math.random());

            return Boolean(number);
        }
    }
}