/**
 * @author shadow
 * @filename
 */

/** @class Object */

var MODULE = {

    manifest: {
        name: "Object"
    },

    scope: {

        entry: function() {

        },

        alias: {
            "flip": "flipObject",
            "analyze": "analyzeObject",

            "compose": "composeObject"
        },
        handyAlias: {
            "cmap": "createObject"
        }
    },

    members: {

        /** @memberof Object
         *  @desc clone an object
         *  @param object the input object
         *  @param maxDeep a integer indicate max object layer
         *  @param curDeep a interger indicate current layer, default 1
         *  @return a clone object*/
        clone: function(object, maxDeep, curDeep) {

            // set default arguments
            curDeep = curDeep || 1;
            maxDeep = maxDeep || 1;

            // if curDeep large than maxDeep , return object
            if(curDeep > maxDeep) {
                return object;
            }

            var cloneObject;
            // create new object

            cloneObject = new Object();

            for(var key in object) {

                var curValue = object[key];

                var valueType = typeof(curValue);

                // if current value is an object, recall clone()
                if(valueType == "object") {
                    cloneObject[key] = clone(curValue);
                }
                else {
                    // copy if current value not an object
                    cloneObject[key] = curValue;
                }
            }

            return cloneObject;
        },

        /** @memberof Object
         *  @desc flip an object
         *  @param object tha input object
         *  @param cloneMode a bool value indicate the flip operation on input object or create new object
         *  @return the fliped object*/

        flipObject: function(object, cloneMode) {

            var resultObject;

            // set flip mode
            if(cloneMode == true) {
                resultObject = new Object();
            }
            else {
                resultObject = object;
            }

            // flip every member

            for(var key in object) {

                var value = object[key];

                // set value
                resultObject[value] = key;

                if(cloneMode != true) {

                    // delete value
                    delete object[key];
                }
            }

            return resultObject;
        },

        /** @memberof Object
         *  @desc analyze an object to a string
         *  @param object the input object
         *  @param options a options for analyze
         *  @return a string combined form object*/

        analyzeObject: function(object, options) {

            var resultString;

            // set default options
            options = options || {};

            var delimiter = options.delimiter || "&";

            var delimiter2 = options.delimiter2 || "=";

            var encodeMode = true;

            if(options.encode == undefined) {
                encodeMode = true;
            }

            // sometime set prefix
            var prefix = options.prefix || "";

            // create an array
            var members = new Array();

            // iterate each object

            for(var key in object) {

                var value = object[key];

                // if on encode mode, encode value use encodeURIComponent() api
                if(encodeMode == true) {
                    value = window.encodeURIComponent(value);
                }

                var curStr = key + delimiter2 + value;

                // push current string to array

                members.push(curStr);
            }

            // join array with delimiter

            resultString = members.join(delimiter);

            return resultString;;
        },

        /** @memberof Object
         *  @desc create an object and fill it
         *  @param source the input source, string, array or object
         *  @param fillMode default value use fill in return map object, there are tow special word
         *  'key' and 'index', if set 'key', the value is equal key in map, if 'index', the value is an integer
         *  by ascending, start with 0
         *  @param startIndex use 'index' mode, default 0
         *  @return an object*/

        createMap: function(source, fillMode, startIndex) {

            var mapObject = new Object();

            // set default fill mode

            if(fillMode == undefined) {
                fillMode = true;
            }

            startIndex = startIndex || 0;

            var sourceType = typeof(source);

            if(sourceType == "string") {
                // split string into array use ',' delimiter
                source = source.split(",");
            }

            var index = 0;
            var keyName, value;

            // use array's every value as keyName
            if(source instanceof Array) {

                for(;index < source.length; index++) {

                    keyName = source[index];

                    // get value from inner function
                    value = $inner_getValue();

                    mapObject[keyName] = value;
                }
            }
            else if(sourceType == "object") {

                // the map object's key count equal source object
                for(keyName in source) {

                    value = $inner_getValue();

                    mapObject[keyName] = value;
                }
            }

            return mapObject;
            /** inner
             *  desc return a value
             */
            function $inner_getValue() {

                var returnValue;

                // open three branch
                if(fillMode == "key") {
                    returnValue = keyName;
                }
                else if(fillMode == "index") {
                    returnValue = index + startIndex;
                }
                else {
                    returnValue = fillMode;
                }

                return returnValue;
            }
        }
    }
}
