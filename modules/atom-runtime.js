/**
 * @author shadow
 * @filename
 */

/** @class RUNTIME */
var MODULE =
{
    manifest: {
        name: "RUNTIME",
        author: "shadow"
    },
    scope: {
        onInit: function() {

            /** @step create table on keeper */
            var tableObj = {};

            $keeper.pit.ATOM_TABLE = tableObj;

            // if on handyMode, add a variation to window
            if(AtomConfig.handyMode == true) {
                window.$TABLE = tableObj;
            }


        },
        entry: function() {

        },

        alias: {

            JS: "loadScript",
            CSS: "loadCSS"
        }
    },
    members: {
        $table_Get: function(memberName) {
            return $keeper.pit.ATOM_TABLE[memberName];
        },

        $table_Set: function(memberObject, memberName) {

            if(typeof(memberObject) == "function") {
                memberName = memberName || memberObject.name;
            }

            // save object to table
            $keeper.pit.ATOM_TABLE[memberName] = memberObject;

            return window;
        },

        $table_GetMethod: function(methodName, executed, userArguments) {

            return $f_GetMethod;

            /** desc return a method in table */
            function $f_GetMethod() {
                var result;
                var method;

                // get method from ATOM TABLE
                method = $keeper.pit.ATOM_TABLE[methodName];

                // if executed is true, execute function
                if(executed == true) {
                    result = method.apply(null, userArguments || arguments);
                }
                else {
                    result = method;
                }

                return result;
            }
        },

        loadScript: $seed.loadScript,

        loadCSS: $seed.loadCSS
    }
}
