/**
 * @filename atom-debuger.js
 * @author: shadow
 */

/** @progress load */

var debuger =  new AtomDebuger();

/** @class */

function AtomDebuger(options) {

    // for creation
    options = options || {};

    // a html element use for output
    var ULDebuger = null;

    /** @step addLisener */

    window.addEventListener("load", onload_CreateUI);
    /**
     *
     * @param string a string show in browser
     */
    this.alert = function(string, alertOption) {

        var alertReturn;
        // if param1  not define, set default string

        // set current date for display
        string = string ||  new Date();

        // call alert() in window
        window.alert(string);

        return alertReturn;
    }

    /**
     *
     * @param displayText
     * @param className
     */

    this.print = function(displayText, className) {

        /* if ULDebuger not created, call log */

        if(ULDebuger == null) {
            console.log(displayText);

            return;
        }

        /** @step create node */
        var LIString;

        LIString = document.createElement("li");

        LIString.innerHTML = displayText;

        // set className
        if(className) {
            LIString.className = className;
        }
        /** @step append node */
        ULDebuger.appendChild(LIString);

        return this;
    }

    /**
     * @param method the execute code
     * @param arguments the arguments will be use for method call
     * @param _this a pointer use for method call, set a scope
     * @param errorListener the listener will call if any error catched
     * @desc execute a function in try.catch block,the argument1 method also is a string, if yes, call eval() to evaluate
     */
    this.tryCatch = function(method, arguments, _this, errorListener) {

        try {
            // if argument1 method is a string ,call eval()

            var methodType = typeof(method);

            if(methodType == "string") {
                window.eval(method);
            }
            else if(methodType == "function"){
                method.apply(_this, arguments);
            }
        }
        catch(error) {

            // call errorListener()
            if(errorListener) {
                errorListener.call(null, error);
            }
        }
    }

    /**
     * @param method the error listener on window
     * @desc add a error listener
     */
    this.listenError = function(method) {

        window.addEventListener("error", method);

        return method;
    }

    /**
     * @memberof AtomDebuger
     */
    function onload_CreateUI() {

        // create element for debug

        ULDebuger = document.createElement('ul');

        // set className
        ULDebuger.className = "Atom-Debuger";

        // set id
        if(options.nodeID) {
            ULDebuger.id = options.nodeID;
        }

        // append to document.body
        document.body.appendChild(ULDebuger);
    }
}
