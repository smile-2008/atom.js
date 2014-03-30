/**
 * @author shadow
 * @filename
 */

/** @class Function */
var MODULE =
{
    manifest: {
        name: "Function"
    },

    scope: {

        entry: function() {

        },
        handyAlias: {
        }
    },

    members: {

        "getClosure": function(passObject, callback) {

            // get callback type

            var typeOfCallback = typeof callback;

            switch(typeOfCallback) {
                case "undefined": {

                    // set default callback
                    callback =  function() {

                        return passObject;
                    }
                }
                break;

                case "function": {

                    // convert function to string

                    var callbackCode = callback.toString();

                    callback = eval("(" + callbackCode + ")");
                }
                    break;

                case "string": {

                    callback = eval("( function() { " + callback + "})");
                }
            }

            return callback;
        }
    }
}
