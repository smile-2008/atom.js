/**
 * @author shadow
 * @filename
 */

/** @class Script */
var MODULE =
{
    manifest: {
        name: "Script"
    },

    scope: {

        entry: function() {

        },

        alias: {
            execFunc: "execFunction"
        },
        handyAlias: {

            "calls": "callMethods",
            "copt": "createOptions",

            "exec": "execFunction"
        }
    },

    members: {

        /** @memberof Script
         *  @desc call multiple functions use user's arguments
         *  @param methods the input functions to be executed
         *  @param userArguments the user define arguments
         *  @param scope the function's scope
         *  @return true*/

        callMethods: function(methodSource, userArguments, scope) {

            var curMethod;

            userArguments = userArguments || [];

            var callArguments;

            if(! (methodSource instanceof Array)) {
                methodSource = [methodSource]
            }

            for(var iMethod = 0; iMethod < methodSource.length; iMethod++) {

                curMethod = methodSource[iMethod];

                // make method because the method maybe a string

                curMethod = $CORE.makeMethod(curMethod);

                // create call arguments, push current index

                callArguments = userArguments.concat(iMethod);

                // call method use arguments
                curMethod.apply(scope, callArguments);
            }

            return true;
        },

        /** @memberof Script
         *  @desc create options from default options and optional user options
         *  @param defaultOptions the default options object
         *  @param userOptions the user defien options object
         *  @return the result options object */

        createOptions: function(defaultOptions, userOptions) {

            // create two options

            defaultOptions = $CORE.composeObject(defaultOptions);

            if(! userOptions) {
                return defaultOptions;
            }

            userOptions = $CORE.composeObject(userOptions);

            // copy members
            $CORE.copy(userOptions, defaultOptions);

            return defaultOptions;
        },

        execFunction: function(code, delay) {

            var execHandle;
            execHandle = setTimeout(code, delay);

            return execHandle;
        }
    }
}
