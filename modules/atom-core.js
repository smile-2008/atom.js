/**
 ** @file atom-core.js
 */
/**
 * @class CORE
 * */

/**
 * @class Emitter
 * */

var MODULE = {
    manifest: {
        name: 'CORE',
        author: 'shadow',

        exportClass: true,
        exportModule: true,
        appendence:
            [

                "runtime", "namespace", "browser", "event", "script", "iterator", "question", "data",
                "number", "string", "object", "function", "array",
                "math",   "keyboard", "json", "event","element", "selector"
            ]
    },

    scope: {
        onInit: function() {

            window._a = Atom;

            prepareEmitter();
            installEmitter();

            /** @memberof CORE */
            function prepareEmitter() {

                /** @step create two array */
                $keeper.pit.EMITTER_OBJ = new Array();

                $keeper.pit.EMITTER_HANDLER = new Array();
            }

            /** @memberof CORE */
            function installEmitter() {

                /** @step install for window */

                inherit(new Emitter(), Window);
            }
        },
        entry: function() {

            extendTypeChecker();

            addMemberToWindow();
            /**
             * desc: use test type, or test instance, tow keyword in used: typeof and instanceof
             */
            function extendTypeChecker() {

                // The map used in create class testor, other map omit...
                var shortClassMap =
                {
                    _HE: HTMLElement,
                    _A: Array,

                    _E: Error // an Error
                };

                // -- create basic type checker, the first letter is uppercase

                var curType;

                var basicTypes = [ "Number", "Boolean", "String", "Function", "Object", "Undefined" ];

                for(var iType = 0; iType < basicTypes.length; iType++) {

                    curType = basicTypes[iType];

                    // no use return value, the assign operation in the function
                    typeCheckerReturner(curType);
                }

                // create instanceChekcer, use shortName if handy set

                var shortName;

                for(shortName in shortClassMap) {

                    curType = shortClassMap[shortName];

                    // if not set handy, unset shortName, like php :)
                    if(AtomConfig.handyMode !== true) {
                        shortName = unset(shortName); // shortName is null now
                    }

                    typeCheckerReturner(curType, shortName);
                }
                /*
                 TypeCheckerReturner: it's a Returner use return a function, you know closure
                 */

                function typeCheckerReturner(type, shortName) {

                    // get what of type
                    var typeName = typeof(type);

                    var longName; // opposite to shortName
                    var lowerName;

                    if(typeName == "string") {

                        longName = "is" + type; // maybe isNumber, isString
                        lowerName = type.toLowerCase(); // use in function

                        window[longName] = basicTypeChecker;

                        // if handy is set, create a short alias
                        if(AtomConfig.handyMode == true) {

                            // create shortName
                            shortName = "_" + lowerName[0]; // same as _n (number), _s (string)

                            window[shortName] = window[longName];
                        }
                    }
                    else if(typeName == "function"){

                        var instanceName;

                        instanceName = type.name; // get instance Name

                        longName = "is" + instanceName;

                        // type exmaple as Array, Error
                        window[longName] = objectInstanceChecker;

                        if(isset(shortName)) {
                            window[shortName] = window[longName]; // make a 'mirror'
                        }
                    }

                    // return window[longName], althought not use
                    return window[longName];

                    /* basicTypeChecker: used for basic javascript check */

                    function basicTypeChecker(thing) {
                        return (typeof(thing) === lowerName); // if equal, return true, else false
                    }

                    /* ojbectInstanceChecker: javascript object has a constructor, so that Constructor has
                     a member property called 'name', it's there Instance.
                     */
                    function objectInstanceChecker(object) {
                        return (object instanceof type);
                    }
                }
            }

            /**
             * desc: add some member to global space, if in handy mode
             */
            function addMemberToWindow() {

                /** @step add onload listener */

                window.addEventListener("load", function() {

                    body = document.body;
                    head = document.getElementsByTagName("head")[0];
                });
            }
        },
        onload: function() {

        },
        alias: {
            $1: "one",

            listen: addEventListener,
            delListen: removeEventListener
        },
        handyAlias: {
            "be":  "makeMethod"
        }
    },

    members: {
        /**
         * @memberof CORE
         * @param source the source object
         * @param aim the objective
         * @return return argument2 aim that has new members
         * @desc copy a object's all members to another object
         * */
        copy:  function(source, aim) {

            // default value for aim is window
            aim = aim || window;

            // use for..in
            for(var keyName in source) {

                // copy it
                aim[keyName] = source[keyName];
            }

            // return aim
            return aim;
        },
        /** @memberof CORE */
        inherit: function(sourceObject, targetClass) {

            // get prototype
            var targetPrototype = targetClass.prototype;

            // copy member
            for(var keyMember in sourceObject) {

                var curMember = sourceObject[keyMember];

                // add to prototype
                targetPrototype[keyMember] = curMember;
            }

            return targetClass;
        },
        /**
         * @memberof CORE
         * @param object the test object
         * @param instanceName the user indicate name, such as Array, Element
         * @return if argument2 instanceName define, return a boolean indicate compare result,
         * else return a string that object's constructor name
         * @desc get a object's constructor name, if second argument defined, compare them */
        who: function(object, instanceName) {

            var objInstance; // This variation save current object's instance

            var testInstance; // ==> Array, Error, it's an object

            if(typeof(instanceName) == "string") {
                instanceName = window[instanceName];
            }

            testInstance = instanceName;

            var whoResult;

            // if testInstance is defined, use instanceof operation
            if(testInstance) {
                whoResult = (object instanceof testInstance);
            }
            else {
                // may be have difference in some browser
                whoResult = object.constructor.name;
            }

            return whoResult;
        },
        /** @memberof CORE
         *  @desc get member count of an object
         *  @param object the input object
         *  @return the total members of an object */
        countOf: function(object) {

            var returnCount = 0;

            // get object's type
            var objectType = typeof(object);

            if(object instanceof Array) {
                returnCount = object.length;
            }
            else if(objectType == "object") {

                // start counting
                for(var key in object) {
                    returnCount++;
                }
            }

            return returnCount;
        },
        /**
         * @memberof CORE
         * @param value the test value
         * @return a boolean value
         * @desc test a value, if the value not equal null and undefined, return true, else false
         */
        isset: function(value) {
            // two condition
            return ( (value !== null) && (value !== undefined) );
        },

        deletes: function(object, memberList) {

            memberList.forEach(function(memberName) {

                delete object[memberName];
            });

            return object;
        },

        makeMethod: function(methodCode, argumentsDefine, methodName) {

            var makeResult;

            var arg1Type = typeof(methodCode);

            if(arg1Type == "string") {

                var defaultArgumentsDefine;

                if($_handyMode == true) {
                    defaultArgumentsDefine = "a0,a1, a2, a3, a4";
                }
                else {
                    defaultArgumentsDefine = "arg0, arg1, arg2, arg3, arg4";
                }

                // construct a function use arguments
                argumentsDefine = argumentsDefine || defaultArgumentsDefine;

                methodName = methodName || "untitleMethod";

                var methodDefineCode;

                methodDefineCode = "(function " + methodName + "(" + argumentsDefine
                    + ") { " + methodCode + "})";

                // call window.eval() to evaluate
                makeResult = window.eval(methodDefineCode);
            }
            else if(arg1Type == "function") {
                makeResult = methodCode;
            }

            return makeResult;
        },
        /** @memberof CORE
         *  @desc compose an object from a string
         *  @param string the input string
         *  @param options an option object use compose operation
         *  @return an object genereate from a string*/

        composeObject: function(string, options) {

            var resultObject = new Object();

            // if argument is an object, no process
            if(typeof(string) === "object") {
                return string;
            }
            // create default options if options not define
            options = options || {};

            // get option respectively
            var delimiter = options.delimiter || "&";

            var delimiter2 = options.delimiter2 || "=";

            var defaultValue = options.default || "";

            // split string into array

            var strList = string.split(delimiter);

            // iterate string list
            for(var index = 0; index < strList.length; index++) {

                var curStr = strList[index];

                var keyName, value;

                // get key and value use match

                if(curStr.indexOf(delimiter2) === -1) {
                    keyName = curStr;
                    value = "";
                }
                else {

                    // create a regexp object
                    var matchExp = new RegExp(".+(?=" + delimiter2 + ")");

                    keyName = curStr.match(matchExp)[0];
                    value = curStr.replace(keyName + delimiter2, "");
                }

                resultObject[keyName] = value;
            }

            return resultObject;
        },        /**
         * @memberof CORE
         * @param handler a event listener
         * @param object the object listen on
         * @param eventType the event type
         * @param useCapture indicate use caputer mode
         * @return the argument2 object
         * @desc use addEventListener() listen some event
         */
        bind: function(handler, object, eventType, useCapture) {

            // set default object == window if not define
            object = object || window;

            if(typeof(eventType) == "undefined") {

                // if object == window, assign 'load'
                if(object == window) {
                    eventType = "load";
                }
                else if(object instanceof HTMLElement){

                    // it's HTMLElement
                    eventType = "click";
                }
            }

            // add a Event Listener
            object.addEventListener(eventType, handler, useCapture);

            return object;
        },

        unbind: function(handler, object, eventType, useCapture) {

            // set default object == window if not define
            object = object || window;

            if(typeof(eventType) == "undefined") {

                // if object == window, assign 'load'
                if(object == window) {
                    eventType = "load";
                }
                else if(object instanceof HTMLElement){

                    // it's HTMLElement
                    eventType = "click";
                }
            }

            // remove Event Listener
            object.removeEventListener(eventType, handler, useCapture);

            return object
        },
        /**
         * @memberof CORE
         * @desc: get multiple nodes
         */
        all: function(selectorText) {

            // use document.querySelectorAll api
            return document.querySelectorAll(selectorText);
        },
        /**
         * @memberof CORE
         * @desc: get one node
         */
        one: function (selectorText) {

            // direct return result
            return document.querySelector(selectorText);
        }
    },

    Class: {
        Emitter: function() {

            return {

                /** @memberof Emitter */
                emit: function(eventType, userArguments) {

                    var emitResult, _thisObj;

                    _thisObj = this;
                    // access pit
                    var objList, handlerList;

                    objList = $keeper.pit.EMITTER_OBJ;
                    handlerList = $keeper.pit.EMITTER_HANDLER;

                    // check pit

                    var checkIndex = objList.indexOf(_thisObj);

                    if(checkIndex !== -1) {

                        // get handler
                        var curTypeHandler;
                        var handlerLength;

                        curTypeHandler = handlerList[checkIndex][eventType];

                        // if have handler, call them
                        if(curTypeHandler && curTypeHandler.length > 0) {

                            handlerLength = curTypeHandler.length;

                            for(var iHandler = 0; iHandler < curTypeHandler.length; iHandler++) {

                                var curCallback = curTypeHandler[iHandler];

                                // call function use argument
                                curCallback.apply(_thisObj, userArguments);
                            }

                            // set result equal true
                            emitResult = handlerLength;
                        }
                        else {
                            emitResult = -1;
                        }
                    }
                    else {
                        emitResult = -1;
                    }

                    return emitResult;
                },

                /** @memberof Emitter */
                on: function(eventType, callback) {

                    // GET TOW LIST
                    var objs = $keeper.pit.EMITTER_OBJ;
                    var handlers = $keeper.pit.EMITTER_HANDLER;

                    var _thisObj = this;

                    var objHandler;

                    /** @step check object */

                    var objIndex = objs.indexOf(_thisObj);

                    if(objIndex == -1) {
                        objs.push(_thisObj);

                        // create handler
                        objHandler = new Object();

                        // push to list
                        handlers.push(objHandler);
                    }
                    else {

                        // if finded, get handler
                        objHandler = handlers[objIndex];
                    }

                    /**@step add callback */

                    var curTypeHandler = objHandler[eventType];

                    if(! curTypeHandler) {
                        // create a array storage callback function
                        curTypeHandler = new Array();

                        objHandler[eventType] = curTypeHandler;
                    }

                    // push argument callback to array
                    curTypeHandler.push(callback);

                    return _thisObj;
                }
            }
        }
    }
}