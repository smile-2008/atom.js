/**
 * @author shadow
 * @filename 1
 */

/** @class Keyboard */
/**
 * @class KeyboardListener
 * */

var MODULE =
{
    manifest: {
        name: "Keyboard",

        depend: ["RUNTIME"]
    },
    scope: {

        onInit: function() {

            /** @step create keynames map */

            $keeper.map.keyNames = $Object.flipObject($keeper.map.keyCodes, true);

            /** @step create pit */
            $keeper.pit.combiKeysObjs = new Object();

            /** @step install */
            $keeper.api.installKeyboard(Window);
        },
        entry: function() {

            // save method to table
            $table_Set($f_KeyboardEventListener, "KeyboardEventListener");

            addKeyboardListener();

            /** desc: addKeyboardListener */

            function addKeyboardListener() {

                var eventTypes = $keeper.list.keyboardListenEvents;

                // for each event add listener
                for(var iType = 0; iType < eventTypes.length; iType++) {

                    var curType = eventTypes[iType];

                    window.addEventListener(curType, $table_GetMethod("KeyboardEventListener", true));

                    // for every event type, create array
                    $keeper.pit.combiKeysObjs[curType] = new Array();
                }
            }

            /** desc $f_KeyboardEventListener */
            function $f_KeyboardEventListener() {

                var eventType = event.type;

                // get combiKeysObj from pit
                var combiKeysObj = $keeper.pit.combiKeysObjs[eventType];

                // create keyGroup from current event

                var eventKeysGroup = new Array();

                // push special keys

                if(event.ctrlKey) {
                    eventKeysGroup.push("Ctrl");
                }

                if(event.shiftKey) {
                    eventKeysGroup.push("Shift");
                }

                if(event.altKey) {
                    eventKeysGroup.push("Alt");
                }

                // get key name from keyCode

                var keyCodes = $keeper.map.keyCodes;

                var keyName = keyCodes[event.keyCode];

                // if keyName not special keys, push to keys group
                if(keyName) {
                    if(eventKeysGroup.indexOf(keyName) === -1) {

                        // push to keys group
                        eventKeysGroup.push(keyName);
                    }
                }

                /** @step search pit and compare keys */

                for(var iKeysObj = 0; iKeysObj < combiKeysObj.length; iKeysObj++) {

                    var curKeysObj = combiKeysObj[iKeysObj];

                    // get user listen keys
                    var userKeys = curKeysObj.keysGroup;

                    // compare keys

                    var isLengthEqual = (userKeys.length === eventKeysGroup.length);

                    var isEqual = false;

                    if(isLengthEqual == true) {

                        isEqual = true;

                        // iterate every key in the group
                        for(var iKey = 0; iKey < eventKeysGroup.length; iKey++) {

                            var curKey = eventKeysGroup[iKey];

                            // if any keys not find in userKeys, break loop
                            if($Iterator.searchValue(userKeys, curKey, false) === -1) {
                                isEqual = false;
                                break;
                            }
                        }
                    }

                    if(isEqual == true) {
                        $Script.callMethods(curKeysObj.handlers);
                    }
                }
            }
        }
    },
    members: {

    },
    Class: {
        KeyboardListener: function() {
            return {

                /** @memberof KeyboardListener */
                listenKeyboard: function(keysGroup, handlers, eventType, options) {

                    /** @step get pit */

                    var combiObjs = $keeper.pit.combiKeysObjs;

                    var _thisObject = this;

                    eventType = eventType || "keydown";

                    /**@step create new CombiKeys */

                    // convert to string if array not exist
                    if((keysGroup instanceof Array) == false) {
                        keysGroup = keysGroup.toString();
                    }

                    // if keysGroup is a string, split by , + and sapce

                    if(typeof(keysGroup) == "string") {
                        keysGroup = keysGroup.split(/ |,|\+/);
                    }

                    // check every value in the group

                    var keyNamesMap = $keeper.map.keyNames;

                    for(var iKey = 0; iKey < keysGroup.length; iKey++) {

                        var curKey;
                        curKey = keysGroup[iKey];

                        // if current key is an integer and not in 0~9, get its keyname

                        if((curKey - 0) === (curKey - 0)) {

                            if(curKey > 9) {
                                keysGroup[iKey] = keyNamesMap[curKey];
                            }
                        }
                    }

                    var CombiObj = new CombiKeys(keysGroup, handlers, options);

                    combiObjs[eventType].push(CombiObj);
                }
            }
        },
        /**
         *
         * @param keysGroup
         * @param handlers
         * @param eventType
         * @param options
         * @constructor
         */
        CombiKeys: function(keysGroup, handlers, options) {
            this.keysGroup = keysGroup;
            this.handlers = handlers;
            this.options = options;
        }
    },
    keep: {
        api: {
            installKeyboard: function(object) {

                var prototype = object.prototype;

                inherit(new KeyboardListener(), object);

                // add alias to object
                prototype.onKeys = prototype.listenKeyboard;

                if($_handyMode == true) {
                    prototype.keys = prototype.listenKeyboard;
                }
            }
        },
        pit: {},
        list: {
            keyboardListenEvents: [ "keydown", "keyup", "keypress", "click", "dblclick"]
        },
        map: {
            keyCodes:{
                110: ".", 96: "0", 36: "Right", 40: "Down", 37: "Left", 17: "Ctrl", 93: "Menu", 18: "Alt",  32: "Space", 91: "Win",
                99: "3",  98: "2", 97:   "1",    38: "Up",   16: "Shift",191: "/",   190: ".",    188: ",",   77: "M",      78: "N",
                66: "B",  86: "V", 67:  "C",     88: "X",    90: "Z",     102: "6",   101: "5",    100: "4",   13: "Enter", 222: "'",
                186:";",  76: "L", 75:  "K",     74: "J",    72: "H",     71:  "G",   70:  "F",     68: "D",    83: "S",     65:  "A",
                20: "Caps",         107: "+",    106: "9",   108: "8",    107: "7",   220:  "\\",   221:"]",   219: "[",    80:  "P",
                79: "O",  73: "I",  85:  "U",    89:  "Y",   84:  "T",    82:  "R",   69:   "E",     87: "W",   81:  "Q",    9:  "Tab",
                109: "-", 106: "*", 111: "/",   144: "Num", 8:    "<-",  187:  "+",  189:   "-",    48: "0",   57:  "9",    56:  "8",
                55:  "7", 54:  "6",  53:  "5",   52:  "4",   51:   "3",   50:   "2",  49:    "1",    192: "`",  35:  "End",  34:  "PgDn",
                33:  "PgUp",          36:  "Home",            46:   "Del", "-1":   "PrtSC",             19:  "Pause",            123: "F12",
                122: "F11",121:"F10",120: "F9",  119:  "F8", 118:   "F7", 117:   "F6",              116: "F5",115:  "F4",   114: "F3",
                113:  "F2",112: "F1",  27: "Esc"
            }
        }
    }
}