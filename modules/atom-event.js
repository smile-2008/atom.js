/**
 * @author shadow
 * @filename
 */

/** @class Event
 *  @desc module will create some listener creator*/

/** @class HTMLEventExtension
 *  @desc the class incldes some api for create mouse and keyboard listener*/
var MODULE = {

    options: {
        listenerPrefix: ""
    },
    manifest: {
        name: "event",
        author: "shadow"
    },

    scope: {

        entry: function($module, options) {

            // add Listener to HTMLElement

            var prototype = HTMLElement.prototype;

            var eventList = $list.languagesEvent;

            var listenerName;

            // for every event,  add listener
            for(var iEvent = 0; iEvent < eventList.length; iEvent++) {

                var eventName = eventList[iEvent];

                if(options.listenerPrefix !== "") {
                    listenerName = options.listenerPrefix + eventName[0].toUpperCase() + eventName.slice(1);
                }
                else {
                    listenerName = eventName;
                }

                // if some api exist that has same name, rename it

                var existedAPI = prototype[listenerName];

                if(existedAPI) {
                    prototype["__" + existedAPI.name] = existedAPI;
                }

                // get listener
                prototype[listenerName] = $api.returnDOMListener(eventName, existedAPI);

                /** @step install component */

                var eventCOM = $COM.HTMLEventExtension;

                $CORE.copy(eventCOM, prototype);

                var aliasMap =
                {
                    "mouse": "onMouse",
                    "keyboard": "onKeyboard",
                    "key": "onKeyboard",
                    "mousearea": "onMouseArea",
                    "area": "onMouseArea"
                };

                $Namespace.addAlias(aliasMap, prototype);
            }
        }
    },

    members: {

    },

    keep: {

        component: {

            HTMLEventExtension: {

                /** @memberof HTMLEventExtension
                 *  @desc add a listener for mouseover and mouseleave, pass a boolean value to handler indicate what event happened
                 *  @param handler a callback function that process mouse event
                 *  @param useCapture indicate whethre capture the event
                 *  @return this*/
                onMouse: function(handler, useCapture) {

                    // add onmousehover event
                    this.addEventListener("mouseover", $event_mouseHandler, useCapture);

                    // add mouseleave event
                    this.addEventListener("mouseleave", $event_mouseHandler, useCapture);

                    return this;
                    /** inner
                     *  desc a function catch two event*/

                    function $event_mouseHandler() {

                        var eventType = event.type;

                        var isMouseover = (eventType === "mouseover");

                        handler = $CORE.makeMethod(handler);

                        handler.call(this, isMouseover);
                    }
                },
                /** @memberof HTMLEventListener
                 *  @desc add a keyboard event, and pass a keyCode indicate the handler will
                 *  call when event.keyCode equal parameter
                 *  @param keyCode a key code or a character
                 *  @param handler a callback function process event
                 *  @param eventType indicate the keyboard event
                 *  @param useCapture indicate whether use capture mode
                 *  @return this*/
                onKeyboard: function(keyCode, handler, eventType, useCapture) {

                    // set default event type

                    eventType = eventType || "keydown";

                    // make method use if handler is a string
                    handler = $CORE.makeMethod(handler);

                    // if keyCode is a character, convert it to code

                    if(typeof(keyCode) == "string") {

                        // convert to uppercase
                        keyCode = keyCode.toUpperCase();

                        keyCode = $map.keyNames[keyCode];

                        // convert to integer
                        keyCode = parseInt(keyCode);
                    }

                    this.addEventListener(eventType, $f_keyHandler, useCapture);

                    return this;
                    /** inner
                     *  desc
                     */

                    function $f_keyHandler() {

                        if(event.keyCode == keyCode) {

                            // call handler
                            handler.apply();
                        }
                    }
                },
                /** @memberof HTMLEventListener
                 *  @desc add a mouse event listener and handler will executed when mouse coordinate in indicate ares
                 *  @param areas a Rectangle list use indicate the hot areas
                 *  @param mouseEvent indicate mouse event
                 *  @param useCapture indicate whether use event capture mode
                 *  @return this*/

                onMouseArea: function(areas, handler, mouseEvent, useCapture) {

                    // create area use $Math.Rectangle Class

                    if(! (areas[0] instanceof Array)) {
                        areas = [areas];
                    }

                    for(var iarea = 0; iarea < areas.length; iarea++) {

                        areas[iarea] = new $Math.Rectangle(areas[iarea]);
                    }

                    // generate handler
                    handler = $CORE.makeMethod(handler);

                    mouseEvent = mouseEvent || "mousemove";

                    // add mouse event listener

                    this.addEventListener(mouseEvent, $event_mouseArea, useCapture);

                    return this;

                    function $event_mouseArea() {

                        // iterate every rectangle and test coordinate

                        for(var iarea = 0; iarea < areas.length; iarea++) {

                            var curRect = areas[iarea];

                            if(curRect.testCoordinate(event.clientX, event.clientY)) {

                                handler.call(this);

                                return true;
                            }
                        }
                    }
                }

            }

        },
        list: {

            languagesEvent:
                [
                    "click", "dblclick", "mousedown", "mouseup", "mousemove", "mouseover", "mouseleave",
                    "keydown", "keyup", "keypress",
                ]
        },
        api: {

            returnDOMListener: function(eventName, existedAPI) {

                var ListenerInstance = AtomDOMListener;

                // add a valueOf() to AtomDOMListener
                ListenerInstance.valueOf = function() {

                    return this;
                }

                return ListenerInstance;

                function AtomDOMListener(handler, useCapture) {

                    if(existedAPI ) {
                        if(arguments.length == 0) {
                            return existedAPI.apply(this);
                        }
                    }
                    // make Function if handler is a string contains code

                    handler = $CORE.makeMethod(handler);

                    // add event listener
                    this.addEventListener(eventName, handler, useCapture);

                    // save handler
                    this.eventHandler = this.eventHandler || {};

                    this.eventHandler[eventName] = this.eventHandler[eventName] || [];

                    this.eventHandler[eventName].push(handler);
                    return this;
                }
            }
        }
    }
}
