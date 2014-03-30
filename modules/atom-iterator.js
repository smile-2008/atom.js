/**
 * @author shadow
 * @filename
 */

/** @class Iterator */
/** @class IterateController
    @desc IterateController use to controll loop */
var MODULE =
{
    manifest: {
        name: "Iterator"
    }
    ,
    scope: {
        config: {
            initialDeep: 1
        },

        entry: function() {

        },

        alias: {
            "each": "eachIterate",
            "map": "mapIterate",
            "filter": "filterIterate"
        }
    },

    members: {

        /** @memberof Iterator
         *  @desc use user indicate processor function process every value in source object
         *  @param source the input source
         *  @param processor the processor
         *  @param maxDeep a integer indicate object layer
         *  @param intoObject indicate the processor whether processor an object
         *  @param userArguments the user arguments
         *  @param scope processor's execute scope
         *  @param controller an instance of IterateController
         *  @return the input source*/
        eachIterate: function(source, processor, maxDeep, intoObject, userArguments, scope, controller) {

            // set max deep

            if(maxDeep == undefined) {
                maxDeep = $modules.Iterator.config.initialDeep || 3;
            }

            // make processor
            processor = $CORE.makeMethod(processor);

            var innerDeep = maxDeep;

            // use -- mode
            if(innerDeep < 1) {
                return;
            }

            var curValue, valueType;
            var callArguments;
            var isObject, isNode;

            var nextDeep;

            var sourceType = typeof(source);

            var processResult;

            // controller
            controller =  new IterateController(controller, 0);

            var curCtrl = controller;

            if(source.length > 0) {

                controller.setEndIndex(source.length);

                for(curCtrl.index = 0; curCtrl.index < source.length; curCtrl.index++) {

                    if(curCtrl.isStoped() || curCtrl.isAllStoped()) {
                        break;
                    }

                    curValue = source[curCtrl.index];

                    // get value's type
                    valueType = typeof(curValue);

                    isObject = false;

                    if(valueType == "object") {

                        nextDeep = innerDeep - 1;

                        // use recurrence
                        $Iterator.eachIterate(curValue, processor, nextDeep ,intoObject, userArguments, scope,  curCtrl);

                        isObject = true;
                    }

                    // check current value whether an Node
                    if(curValue instanceof Node) {
                        isNode = true;
                    }
                    else {
                        isNode = false;
                    }

                    if(! isObject || intoObject || isNode) {
                        // it's simplay data type, call processor
                        callArguments = [curValue, curCtrl.index, innerDeep, curCtrl ].concat(userArguments);

                        processResult = processor.apply(scope, callArguments);

                        // if processResult is "BREAK_LOOP", then break loop
                        if(processResult == "BREAK_LOOP") {
                            break;
                        }
                    }

                }
            }
            else if(sourceType == "object") {

                // iterate an object
                for(var keyName in source) {

                    if(curCtrl.isStoped() || curCtrl.isAllStoped()) {
                        break;
                    }

                    curValue = source[keyName];

                    valueType = typeof(curValue);

                    isObject = false;

                    if(valueType == "object") {

                        isObject = true;
                        nextDeep = innerDeep - 1;

                        // call self use same argument, maxDepp expect
                        $Iterator.eachIterate(curValue, processor, nextDeep, intoObject, userArguments, scope, curCtrl);
                    }

                    if(! isObject || intoObject) {
                        // it's simplay data type, call processor
                        callArguments = [curValue, keyName, innerDeep, curCtrl ].concat(userArguments);

                        processResult = processor.apply(scope, callArguments);

                        // if processResult is "BREAK_LOOP", then break loop
                        if(processResult == "BREAK_LOOP") {
                            break;
                        }
                    }
                }
            }

            return source;
        },
        /** @memberof Iterator
         *  @desc use callback function handle every value in the source, and return a result value for original object or a new one
         *  @param source the input source
         *  @param processor a function handle value
         *  @param cloneMode indicate clone mode, if true, create new object save result, if not, the result save on original object
         *  @param userArguments the user arguments
         *  @param maxDeep the max layer for source
         *  @param scope a scope use processor
         *  @param intoObject indicate whether process an object
         *  @param controller  an iterate controller
         *  @return the source object*/
        mapIterate: function(source, processor, cloneMode, userArguments, maxDeep, scope, intoObject, controller) {

            // set max deep

            if(maxDeep == undefined) {
                maxDeep = $modules.Iterator.config.initialDeep || 3;
            }

            var mapObject;

            // make processor
            processor = $CORE.makeMethod(processor);

            var innerDeep = maxDeep;

            // use -- mode
            if(innerDeep < 1) {
                return source;
            }

            var curValue, valueType;
            var callArguments;
            var isObject;

            var mapValue;

            var nextDeep;

            var sourceType = typeof(source);

            // create iterate controller
            var curCtrl = new IterateController(controller, 0);

            if(source.length > 0) {

                // check mode, if on clone mode, create new array
                if(cloneMode == true) {
                    mapObject = new Array();
                }
                else {
                    mapObject = source;
                }

                // set end index for controller
                curCtrl.setEndIndex(source.length);

                for(curCtrl.index = 0; curCtrl.index < source.length; curCtrl.index++) {

                    // call controller to check whether stoped

                    if(curCtrl.isStoped() || curCtrl.isAllStoped()) {
                        break;
                    }

                    curValue = source[curCtrl.index];

                    // get value's type
                    valueType = typeof(curValue);

                    if(valueType == "object") {

                        isObject = true;
                        nextDeep = innerDeep - 1;

                        // use recurrence
                        mapValue = $Iterator.mapIterate(curValue, processor, cloneMode, userArguments, nextDeep, scope, intoObject, curCtrl);
                    }
                    else {
                        isObject = false;
                    }

                    if(!isObject || intoObject) {

                        // it's simplay data type, call processor
                        callArguments = [curValue, curCtrl.index, innerDeep, curCtrl ].concat(userArguments);

                        mapValue = processor.apply(scope, callArguments);
                    }

                    // save value
                    mapObject[curCtrl.index] = mapValue;
                }
            }
            else if(sourceType == "object") {

                if(cloneMode == true) {
                    mapObject = new Object();
                }
                else {
                    mapObject = source;
                }

                // iterate an object
                for(var keyName in source) {

                    // if any condition satisfied， break loop
                    if(curCtrl.isStoped() || curCtrl.isAllStoped()) {
                        break;
                    }

                    curValue = source[keyName];

                    valueType = typeof(curValue);

                    isObject = false;
                    if(valueType == "object") {

                        isObject = true;
                        nextDeep = innerDeep - 1;

                        // call self use same argument, maxDepp expect
                        mapValue = $Iterator.eachIterate(curValue, processor, cloneMode, userArguments, nextDeep, scope, intoObject, curCtrl);
                    }

                    if(!isObject || intoObject) {

                        // Generate call arguments
                        callArguments = [ curValue, keyName, innerDeep, curCtrl ].concat(userArguments);

                        mapValue = processor.apply(scope, callArguments);
                    }

                    mapObject[keyName] = mapValue;
                }
            }

            return mapObject;
        },

        /** @memberof Iterator
         *  @desc use multiple filter process every members in the source, some reversed, some delete
         *  @param source the input source
         *  @param cloneMode indicate whether create an object use in function
         *  @param userArguments user arguments
         *  @param maxDeep an integer indicate max object layer
         *  @param scope a scope variation use handle filter
         *  @param countObject indicate whether process object
         *  @param controller an instance of IterateController
         *  @return the input source*/
        filterIterate: function(source, filters, cloneMode, userArguments, maxDeep, scope, countObject, controller) {

            var filterObject;

            if(countObject == undefined) {
                countObject =
                {
                    count: 0,
                    destroyMode: false
                };
            }

            if(maxDeep == undefined) {
                maxDeep = $modules.Iterator.config.initialDeep || 3;
            }

            if(maxDeep < 1) {
                return source;
            }
            var sourceType = typeof(source);

            var curValue, valueType;

            var nextDeep;

            // if on clone mode, create new one
            if(cloneMode == true) {
                filterObject = $modules.Object.clone(source);
            }
            else {
                filterObject = source;
            }

            var destroyMode = false; // the field use only countFilter is set

            // create filter

            var filterType = typeof(filters);

            // there has four filters
            var typeFilter, countFilter, handleFilter, objectFilter;

            if(filterType == "object") {

                // if filters is an array
                if(filters instanceof Array) {

                    for(var index = 0; index < filters.length; index++) {

                        var curFilter = filters[index];
                        filterType = typeof(curFilter);

                        // a repeat part
                        if(filterType == "string") {
                            typeFilter = curFilter;
                        }
                        else if(filterType == "number") {
                            countFilter = curFilter;
                        }
                        else if(filterType == "function") {
                            handleFilter = curFilter;
                        }
                        else if(filterType == "boolean") {
                            objectFilter = curFilter;
                        }
                    }
                }
                else {
                    typeFilter = filters.type;
                    countFilter = filters.count;
                    handleFilter = filters.handle;

                    objectFilter = filters.object;
                }
            }
            else if(filterType == "boolean") {
                objectFilter = filters;
            }
            else if(filterType == "string") {
                typeFilter = filters;
            }
            else if(filterType == "number") {
                countFilter = filters;
            }
            else if(filterType == "function") {
                handleFilter = filters;
            }

            var index;

            // create an iterate controller

            var curCtrl = new IterateController(controller, 0);

            if(source.length > 0) {

                // set index for controller
                curCtrl.setEndIndex(source.length);

                for(curCtrl.index = 0; curCtrl.index < source.length; curCtrl.index++) {

                    index = curCtrl.index;
                    curValue = source[index];

                    valueType = typeof(curValue);

                    // if value's type is object, recurrence
                    if(valueType == "object") {
                        nextDeep = maxDeep - 1;
                        $modules.Iterator.filterIterate(curValue, filters, cloneMode, userArguments, nextDeep, scope, countObject, curCtrl);

                        // check member count

                        if($CORE.countOf(curValue) == 0) {
                            source.splice(curCtrl.index, 1);
                        }

                        if(objectFilter === true) {
                            $inner_filterProcessor();
                        }
                    }
                    else {
                        // call filter processor
                        $inner_filterProcessor();
                    }
                }
            }
            else if(sourceType == "object") {

                // iterate an object
                for(index in source) {
                    curValue = source[index];

                    valueType = typeof(curValue);

                    // if value's type is object, recurrence
                    if(valueType == "object") {
                        nextDeep = maxDeep - 1;
                        $modules.Iterator.filterIterate(curValue, filters, cloneMode, userArguments, nextDeep, scope, countObject, curCtrl);

                        // check member count of an object

                        if($CORE.countOf(curValue) == 0) {
                           delete source[index];
                        }

                        if(objectFilter === true) {
                            $inner_filterProcessor();
                        }
                    }
                    else {
                        // call filter processor
                        $inner_filterProcessor();
                    }
                }
            }

            return source;

            /** inner:
             *  desc a filter processor for current value */

            function $inner_filterProcessor() {

                var isRemove = true;

                if(countObject.destroyMode == true) {}
                else if(typeFilter && valueType !== typeFilter) {
                }
                else if(handleFilter) {

                    var handleResult;
                    var callArguments;

                    callArguments =  [ curValue, index, nextDeep, curCtrl ].concat(userArguments);

                    handleResult = handleFilter.apply(scope, callArguments);

                    if(handleResult === true) {
                        isRemove = false;
                    }
                }
                else {
                    isRemove = false;
                }

                // if isRemove == true, remove current value

                if(isRemove == true) {

                    // determine type
                    if(source instanceof Array) {
                        source.splice(index--, 1);
                    }
                    else {
                        delete source[index];
                    }
                }
                else {
                    countObject.count++;

                    // if count equal countFilter, start 'destroy mode'

                    if(countFilter <= countObject.count) {
                        countObject.destroyMode = true;
                    }
                }
            }
        },

        /** @memberof Iterator
         *  @desc search a value in the source, return the index or key name
         *  @param source the input source
         *  @param value the value to be searched
         *  @return the index in the source*/

        searchValue: function(source, value, caseSensitive) {

            var sourceType = typeof(source);

            // set caseSensitive to true
            if(caseSensitive == undefined) {
                caseSensitive = true;
            }

            var curValue, valueType;

            var findIndex = -1;

            if(source instanceof Array) {

                // iterate array
                for(var index = 0; index < source.length; index++) {

                    curValue = source[index];

                    // compare value
                    // if current value is a string, check caseSensitive argument

                    valueType = typeof(curValue);

                    if(valueType == "string") {

                        if(caseSensitive === false) {

                            if(curValue.toUpperCase() === value.toUpperCase()) {

                                // finded
                                return index;
                            }
                        }
                    }
                }
            }
            else if(sourceType == "object") {

                // iterate object

                for(var key in source) {

                    curValue = source[key];

                    valueType = typeof(curValue);

                    if(valueType == "string") {

                        if(caseSensitive === false) {

                            // both convert to lowercase
                            if(curValue.toLowerCase() === value.toLowerCase()) {

                                // finded
                                return index;
                            }
                        }
                    }
                }
            }

            return findIndex;
        }
    },

    Class: {

        IterateController: function(controller, startIndex, endIndex) {

            // if argument controller not define, create a root controller
            if(controller == undefined) {
                this.root = true;
                this.rootController = this;

                this.allStopSign = false;

                // create a controller list
                this.controllerList = new Array();

                // layer start with 0
                this.layer = 0;
            }
            else {

                // set root controller

                this.rootController = controller.rootController || controller;
                this.root = false;

                // layer increment one
                this.layer = controller.layer + 1;

                // add pointer for this and last controller
                this.parentController = controller;
                controller.childController = this;
            }

            // push this controller to list in root controller

            this.rootController.controllerList.push(this);

            this.stopSign = false;

            // create an object use to creating
            var _this = {
                /** @memberof IterateController
                 *  @desc get an iterate controller
                 *  @param layer an integer indicate loop layer
                 *  @return a IterateController*/
                getController: function(layer){
                    return this.rootController.controllerList[layer];
                },
                /** @memberof IterateController
                 *  @desc a boolean value indicate whether stop current loop*/
                stopSign: false,

                /** @memberof IterateController
                 *  @desc stop current loop
                 *  @return this*/
                stop: function() {
                    this.stopSign = true;

                    return this;
                },

                /** @memberof IterateController
                 *  @desc stop all loop
                 *  @return this*/
                stopAll: function() {
                    this.rootController.allStopSign = true;

                    return this;
                },

                /** @memberof IterateController
                 *  @desc enable all loop
                 *  @return this*/
                startAll: function() {
                    this.rootController.allStopSign = false;
                },

                /** @memberof IterateController
                 *  @desc start current loop
                 *  @return this*/
                start: function() {
                    this.stopSign = false;

                    return this;
                },

                /** @memberof IterateController
                 *  @desc determine current loop whether stoped
                 *  @return a boolean result */
                isStoped: function() {
                    return this.stopSign;
                },

                /** @memberof IterateController
                 *  @desc determin all loop whether stoped
                 *  @return a boolean result*/
                isAllStoped: function() {
                    return this.rootController.allStopSign;
                },

                /** @memberof IterateController
                 *  @desc move controller's index to end positon
                 *  @return this*/
                moveToEnd: function() {
                    this.index = endIndex || NaN;
                    return this;
                },
                /** @memberof IterateController
                 *  @param index the end position
                 *  @desc set controller's end index
                 *  @return this*/
                setEndIndex: function(index) {
                    this.endIndex = index;

                    return this;
                }
            }

            copy(_this, this);
        }
    }
};