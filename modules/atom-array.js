/**
 * @author shadow
 * @filename
 */

/** @class Array */
var MODULE =
{
    manifest: {
        name: "Array"
    },

    scope: {
        entry: function() {

            /** @step add two functions to table */

            $table_Set(ascendSortCallback);
            $table_Set(descendSortCallback);

            /** desc a callback method, for ascending */

            function ascendSortCallback(value1, value2) {
                return (value1 > value2);
            }
            /** desc use Array.sort() callback, for descending */

            function descendSortCallback(value1, value2) {
                return (value1 < value2);
            }
        },

        alias: {
            "last": "getLast",
            "reverse": "reverseArray",

            "swap": "arraySwap",
            "shuffle": "arrayShuffle",
            "insert": "arrayInsert",
            "sort": "arraySort",

            "and": "arrayAnd",
            "or": "arrayOr",
            "xor": "arrayXor",

            "2A": "toArray"
        }
    },

    members: {
        /** @memberof Array
         *  @desc get last value from an array or a string
         *  @param value the input value
         *  @return last value in the set*/
        getLast: function(value) {

            var lastIndex;

            if(value.length > 0) {
                lastIndex = value.length - 1;
            }

            return value[lastIndex];
        },
        /** @membeerof Array
         *  @desc return a array with elements in reverse order
         *  @param array the input array
         *  @return return the reversed array */
        reverseArray: function(array) {

            var returnArray;

            returnArray = new Array();

            // reverse array from the last index

            for(var index = array.length - 1; array >= 0; index--) {

                var curItem = array[index];

                // push to array
                returnArray.push(curItem);
            }

            return returnArray;
        },

        /** @memberof Array
         *  @desc swap two value in array
         *  @param array the input array
         *  @param index1 item1's index in array
         *  @param index2 item2's index in array
         *  @return the swaped array
         * */
        arraySwap: function(array, index1, index2) {

            // get array size
            var arraySize = array.length;

            // if index equal -1, get a random index
            if(index1 == -1) {
                index1 = Math.round(Math.random() * (arraySize - 1));
            }

            if(index2 == -1) {
                index2 = Math.round(Math.random() * (arraySize - 1));
            }

            // start swap item
            var value = array[index1];

            array[index1] = array[index2];
            array[index2] = value;

            return array;
        },

        /** @memberof Array
         *  @desc shuffle an arrya
         *  @param array the input array
         *  @param power a value used, control the swap count
         *  @return the suffled array **/

        arrayShuffle: function(array, power) {

            // set default power
            power = power || 3;

            var arrayLength = array.length;

            var totalCount = arrayLength * power;

            // start loop

            var index1, index2;
            var item;

            for(var counter = 0; counter < totalCount; counter++) {

                // swap value use random index
                index1 = Math.round(Math.random() * (arrayLength - 1));
                index2 = Math.round(Math.random() * (arrayLength - 1));

                // save a item
                item = array[index1];

                array[index1] = array[index2];
                array[index2] = item;

                // finish a swap
            }

            // done, the array is shuffled

            return array;
        },

        /** @memberof Array
         *  @desc insert some items into a array from a position
         *  @param array the input array
         *  @param source the source will be inserted
         *  @param position start index in array for insert
         *  @return the larger array*/

        arrayInsert: function(array, source, position) {

            // set default position
            position = position || (array.length - 1);

            if(source instanceof Array) {

                // insert source into array, use for loop

                for(var index = 0; index < source.length; index++) {

                    var curPosition;
                    curPosition = position + index;

                    var curItem;
                    curItem = source[index];

                    // use Array.splice() modify array
                    array.splice(curPosition, 0, curItem);
                }
            }
            else {
                // if only a item, direct use Array.splice()
                array.splice(position, 0, source);
            }

            return array;
        },

        /** @memberof Array
         *  @desc execute and operation in multiple array
         *  @return the resulting set*/
        arrayAnd: function() {

            var arrayList = arguments;

            var andSet = arrayList[0];

            // for..loop, iterate every array

            for(var index = 0; index < andSet.length; index++) {

                var curValue;
                curValue = andSet[index];

                // another for.loop used search
                for(var arrayIndex = 0; arrayIndex < arrayList.length; arrayIndex++) {

                    // get an array
                    var curArray = arrayList[arrayIndex];

                    // if a value not find in current array, delete current item in first array, and break loop
                    if(curArray.indexOf(curValue) == -1) {
                        andSet.splice(index, 1);
                        break;
                    }
                }
            }

            return andSet;
        },

        /** @memberof Array
         *  @desc execute or operation in multiple array
         *  @return the resulting array*/

        arrayOr: function() {

            var arrayList = arguments;

            var orSet = arrayList[0];

            // for..loop, iterate  from second array

            for(var arrayIndex = 1; arrayIndex < arrayList.length; arrayIndex++) {

                var curArray = arrayList[arrayIndex];

                // check every value in the current array, search in first argument, if not find, push it
                for(var valueIndex = 0; valueIndex < curArray.length; valueIndex++) {

                    var curValue;

                    curValue = curArray[valueIndex];

                    // call Array.indexOf() to search
                    if(orSet.indexOf(curValue) == -1) {
                        orSet.push(curValue);
                    }
                }
            }

            return orSet;
        },

        /** @memberof Array
         *  @desc execute xor operation in multiple array
         *  @return the resulting array
         */
        arrayXor: function() {

            var arrayList = arguments;

            var xorSet = new Array();

            // first loop
            for(var arrayIndex = 0; arrayIndex < arrayList.length; arrayIndex++) {

                // get current array
                var curArray = arrayList[arrayIndex];

                for(var valueIndex = 0; valueIndex < curArray.length; valueIndex++) {

                    var curValue;

                    // second loop
                    curValue = curArray[valueIndex];

                    var findCount = 0;

                    //  third loop
                    for(var compareArrayIndex = 0; compareArrayIndex <  arrayList.length; compareArrayIndex++) {

                        var curCompareArray = arrayList[compareArrayIndex];

                        if(curCompareArray.indexOf(curValue) !== -1) {
                            findCount++;

                            if(findCount > 1) {
                                break;
                            }
                        }
                    }

                    // check count
                    if(findCount == 1) {
                        xorSet.push(curValue);
                    }
                }
            }

            return xorSet;
        },

        /** @memberof Array
         *  @desc sort an array
         *  @param array the input array
         *  @param callback the sort callback, also true or false, if true, use ascending order
         *  @return the sorted array*/

        arraySort: function(array, callback) {

            var sortedArray;

            if(typeof(callback) == "undefined") {
                callback = true;
            }

            if(callback === true) {
                callback = $table_Get("ascendSortCallback");
            }
            else if(callback === false) {
                callback = $table_Get("descendSortCallback");
            }

            callback = $CORE.makeMethod(callback);

            // call Array.sort()
            sortedArray = array.sort(callback);

            return sortedArray;
        },

        toArray: function(object) {

            return Array.prototype.slice.call(object, 0);
        },

        isLikeArray: function(object) {

            var objectClass = object.constructor.name,

                result = $keeper.list.likeArrayType.indexOf(objectClass);

            return (result != -1);
        }
    },

    keep: {

        list:
        {
            likeArrayType: ["NodeList", "HTMLCollection", "Array"]
        }
    }
}
