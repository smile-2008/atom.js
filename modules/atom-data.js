/**
 * @author shadow
 * @filename
 */

/** @class Data */
var MODULE =
{
    manifest: {
        name: "Data"
    },

    scope: {
        entry: function() {

        },

        alias: {
            "str2int": "stringToInteger",
            "int2str": "integer2string"
        },

        handyAlias: {
            "grab": "grabValue"
        }
    },

    members: {

        /** @memberof Data
         *  @desc convert a string to integer array
         *  @param data the input data
         *  @return the result array */

        stringToInteger: function(string) {

            var resultArray = [];

            for(var index = 0; index < string.length; index++) {

                var charCode = string.charCodeAt(index);

                // push to result array
                resultArray.push(charCode);
            }

            return resultArray;
        },

        /** @memberof Data
         *  @desc use an integer array generate a string
         *  @param array the input array
         *  @return the result string*/

        IntegerToString: function(array) {

            var resultString;

            // iterate input array
            for(var index = 0; index < array.length; index++) {

                var charCode = array[index];

                // append a char to string
                resultString += String.fromCharCode(charCode);
            }

            return resultString;
        },

        /** @memberof Data
         *  @desc get values use filters from an object
         *  @param source the input source
         *  @param filters a filters object, or other
         *  @param indexMode if indexMode is true, get index instead of value
         *  @return the result list */

        grabValue: function(source, filters, indexMode) {

            // set default mode is value mode
            if(indexMode == undefined) {
                indexMode = false;
            }

            // check filters

            var filtersType = typeof(filters);

            // there have sevent filter
            var valueFilter, indexFilter, typeFilter,
                handleFilter, countFilter, deepFilter, objectFilter;

            // split string into list use comma

            if(filtersType == "string") {
                filters = filters.split(/,/);
            }

            if(filters instanceof Array) {

                // set filter use index
                valueFilter = filters[0];
                indexFilter = filters[1];

                typeFilter = filters[2];
                handleFilter = $CORE.makeMethod(filters[3]);
                countFilter = parseInt(filters[4]);

                deepFilter = parseInt(filters[5]);
                objectFilter = Boolean(filters[6]);
            }
            else if(filtersType == "object") {

                // each filter in the filters
                indexFilter = filters.index;
                valueFilter = filters.value;
                typeFilter = filters.type;

                handleFilter = filters.handle;
                countFilter = filters.count;
                deepFilter = filters.deep;
                objectFilter = filters.object;
            }
            else if(filtersType == "function") {
                handleFilter = filters;
            }
            else if(filtersType == "number") {
                countFilter = filters;
            }

            // counter

            var counter = 0;

            var resultList = new Array();

            // call $Iterator.each

            $Iterator.eachIterate(source, $inner_GrabCallback, null, deepFilter, null, objectFilter);

            return resultList;
            /** inner
             *  desc a grab callback use process every value or index
             */

            function $inner_GrabCallback(value, index, curDeep, ctrl) {

                // open branch
                var valueType = typeof(value);

                var isCorrect = false;

                var strValue;

                if(value) {
                    strValue = value.toString();
                }

                if(value && valueFilter && !strValue.match(valueFilter)) {
                    // not matched
                }
                else if(indexFilter && ! index.match(indexFilter)) {
                    // not matched
                }
                else if(typeFilter && (valueType !== typeFilter)) {
                    // not matched
                }
                else if(countFilter && (countFilter <= counter )) {
                    // the max count is got
                    ctrl.stopAll();
                }
                else {
                    isCorrect = true;
                }

                // if correct, check indexMode isset, if true, save index, or value

                if(isCorrect == true) {

                    if(indexMode == true) {
                        resultList.push(index);
                    }
                    else {
                        resultList.push(value);
                    }

                    // increment counter
                    counter++;
                }

            }
        }
     }
};
