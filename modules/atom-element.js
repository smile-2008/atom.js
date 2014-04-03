/**
 * @author shadow
 * @filename
 */

var MODULE =
{
    options: {
        enabelEnter: true,
        extendProto: false, // the value indicate HTMLElement's prototype shoulde be extended
        addPrototypeAlias: false,

        HTMLElementMethodAliasMap: {
            "hasAttr": "hasAttribute",
            "hasAttrs": "hasAttributes"
        },

        HTMLElementAttributeAliasMap: {
            "nextEle": "nextElementSibling",
            "nextSib": "nextSibling",

            "prevEle": "previousElementSibling",
            "prevSib": "previousSibling"
        }
    },
    manifest: {
        name: "ELEMENT",
        author: "shadow",

        publish: "2004",

        appendence: ["css", "htmlcreator"]
    },

    scope: {
        entry: function($module, options) {

            if(options.enabelEnter == true) {
                extendHTMLElement();

                if(options.addPrototypeAlias == true) {

                    // get HTMLElement's prototype

                    var prototype = HTMLElement.prototype;

                    $Namespace.addAlias(options.HTMLElementMethodAliasMap, prototype);

                    // add Get/Set Property to prototype

                    var attrAliasMap = options.HTMLElementAttributeAliasMap;

                    for(var aliasName in attrAliasMap) {

                        var attrName = attrAliasMap[aliasName];

                        // use Object.defineProperty
                        Object.defineProperty(prototype, aliasName,
                            {
                                "get": $Function.getClosure(attrName, function() {
                                    return this[passObject];
                                })
                            });
                    }
                }
            }


            /*
             extendHTMLElement: use prototype extend HTMLElement Class, so manuplate DOM will be handy
             */

            function extendHTMLElement() {

                // get HTMLElement Prototype
                var HTMLProto = HTMLElement.prototype;

                $module.HTMLExtendClass =
                {
                    listen: HTMLProto.addEventListener,
                    delListen: HTMLProto.removeEventListener,

                    /** @memberof HTMLExtendClass
                     *  @desc use get or set DOM's html content, check content argment*/
                    html: function(content) {

                        // get content type
                        var contentType = typeof(content);

                        var htmlResult; // use function name declare a variation

                        // use switch
                        switch(contentType) {

                            case "undefined": {
                                // get innerHTML
                                htmlResult = this.innerHTML;
                            }
                            case "string":
                            {
                                // set HTML Content
                                this.innerHTML = content;
                                htmlResult = this;
                            }
                        }

                        return htmlResult;
                    },

                    // set NODE's style, take 2 arguments
                    css: function(styleName, styleValue) {

                        var cssReturn; // return value

                        // use window.getComputedStyle()
                        var comStyle;

                        comStyle = window.getComputedStyle(this);

                        // test argument one, maybe its type is 'object'

                        var arg1Type = typeof(styleName);

                        // if arg1Type is 'object', into branch
                        if(arg1Type == "object") {

                            var arg1Obj = styleName; // a correct name

                            if(arg1Obj instanceof Array) {

                                // it's values map
                                cssReturn = new Object();

                                // now get some pairs for css value

                                var iStyleName = 0;

                                for(;iStyleName < arg1Obj.length; iStyleName++) {

                                    // in the for
                                    styleName = arg1Obj[arg1Type];

                                    // modify stylename, use $Browser
                                    styleName = $Browser.modifyStyleName(styleName);

                                    // get style value from DOM's style property
                                    styleValue = comStyle[styleName];

                                    cssReturn[styleName] = styleValue;
                                }
                            }
                            else {

                                // insure to set

                                for(styleName in arg1Obj) {

                                    // modify stylename, use $Browser
                                    styleName = $Browser.modifyStyleName(styleName);

                                    // get value
                                    styleValue = arg1Obj[styleName];

                                    // set value to DOM
                                    this.style[styleName] = styleValue;

                                    // return Element Self
                                    cssReturn = this;
                                }
                            }
                        }
                        else if(arg1Type == "string") {

                            // modify stylename, use $Browser
                            styleName = $Browser.modifyStyleName(styleName);

                            if(styleValue) {

                                // if styleValue indicate, set DOM style
                                this.style[styleName] = styleValue;

                                cssReturn = this;
                            }
                            else {
                                cssReturn = comStyle[styleName];
                            }
                        }

                        return cssReturn;
                    },
                    // attr() set a HTMLElement's attribute value, similar css()
                    attr: function(attrName, attrValue) {

                        var attrResult;
                        //argument 1 maybe other value type

                        var arg1Type = typeof attrName;

                        // usually a string as name
                        if(arg1Type == "string") {

                            // identify argument2
                            if(attrValue) {

                                if(attrValue === null) {
                                    // delete node's attribute
                                    this.removeAttribute(attrName);
                                }
                                else {
                                    // call setAttribute()
                                    this.setAttribute(attrName, attrValue);
                                }

                                attrResult = this; // return node
                            }
                            else {

                                // if attrValue not set, return attrbute's value
                                attrResult = this.getAttribute(attrName);
                            }
                        }
                        else if(arg1Type == "object") {

                            var arg1Obj = attrName;

                            // if argument1 is Array, execute get

                            if(arg1Obj instanceof Array) {

                                attrResult = new Object(); // create object save values

                                for(var iAttrName = 0; iAttrName < arg1Obj.length; iAttrName++) {

                                    attrName = arg1Obj[iAttrName];

                                    // get current attribute's value
                                    attrValue = this.getAttribute(attrName);

                                    // add memeber
                                    attrResult[attrName] = attrValue;
                                }
                            }
                            else {

                                // now set atrribute's value from object
                                for(attrName in arg1Obj) {

                                    // get value, it's attribute
                                    attrValue = arg1Obj[attrName];

                                    // use setAttribuet() api

                                    // also test 'null' for remove
                                    if(attrValue !== null) {
                                        this.setAttribute(attrName, attrValue);
                                    }
                                    else
                                    {
                                        this.removeAttribute(attrName);
                                    }
                                }

                                // return Node self
                                attrResult = this;
                            }
                        }

                        return attrResult;
                    },

                    // bind() take on
                    bind: function(handler, eventType, useCapture) {

                        // call on() in window
                        return window.bind(handler, this, eventType, useCapture);
                    }

                    // addClass(): add a className to node's className
                };

                var DOMTreeAPIs = {

                    /** @memberof HTMLExtendClass
                     *  @desc create a html element and append it to this
                     *  @return this*/

                    createElement: function(tagName, innerHTML, className, id) {

                        var htmlElement;

                        // create element
                        htmlElement = document.createElement(tagName);

                        // set content
                        htmlElement.innerHTML = innerHTML || "";

                        // set className
                        htmlElement.className = className || "";

                        // set id
                        htmlElement.id = id || "";

                        // append new element
                        this.appendChild(htmlElement);

                        return this;
                    },

                    /** @memberof HTMLCreator
                     *  @desc append html element to this
                     *  @paran elements the elements to be appended, maybe a nodelist
                     *  @return this*/

                    appendElement: function(element) {

                        var elementType;

                        elementType = typeof(element);

                        if(elementType == "string") {

                            // generate element from string
                            element = $HTMLCreator.createElementFromString(element);
                        }
                        else if(element.length > 0) {

                            // current element is a nodelist

                            var curElement;

                            for(var iElement = 0; iElement < element.length; iElement++) {
                                curElement = element[iElement];

                                this.appendChild(curElement);
                            }
                        }
                        else if(element instanceof HTMLElement) {

                            this.appendChild(element);
                        }
                    },

                    /** @memberof HTMLExtendClass
                     *  @desc append current element to another
                     *  @param parentElement this parent element will append this
                     *  @return this*/
                    appendToElement: function(parentElement) {

                        // set default parent element
                        parentElement = parentElement || document.body;

                        // call HTMLElement.appendChild
                        parentElement.appendChild(this);

                        return this;
                    },

                    /** @memberof HTMLExtendClass
                     *  @desc insert a html element to current element's childnodes
                     *  @param sourceElement the input element will be inserted
                     *  @param siblingElement the sibling element after the inserted element
                     *  @return this */

                    insertElement: function(sourceElement, siblingElement) {

                        siblingElement = siblingElement || 0;

                        // if siblingElement is a number type, as child node index
                        if(typeof(siblingElement) == "number") {

                            // get child node from index
                            siblingElement = this.childNodes[siblingElement];
                        }

                        // call HTMLElement.insertBefore() api
                        this.insertBefore(sourceElement, siblingElement);

                        return this;
                    },

                    /**
                     * @memberof HTMLExtendClass
                     * @desc add a html element before current element
                     * @param sourceElement the input element
                     * @return this
                     */
                    setBeforeElement: function(sourceElement) {

                        var parentElement = this.parentElement;

                        // use HTMLElement.insertBefore() api
                        parentElement.insertBefore(sourceElement, this);

                        return this;
                    },

                    /**
                     * @memberof HTMLExtendClass
                     * @desc add a html element after this
                     * @param sourceElement the input element
                     * @return this
                     */
                    setAfterElement: function(sourceElement) {

                        var parentElement = this.parentElement;

                        // determine current element whether last element in parent element

                        if(this.nextElementSibling == null) {

                            // current element is the last node, so use appendChild on parent

                            parentElement.appendChild(sourceElement);
                        }
                        else {

                            var siblingElement = this.nextElementSibling;

                            // use HTMLElement.insertBefore()  api
                            parentElement.insertBefore(sourceElement, siblingElement);
                        }

                        return this;
                    },

                    /** @memberof HTMLExtendClass
                     *  @desc move current node before another node
                     *  @param siblingElement the sibling element
                     *  @return this*/

                    beforeToElement: function(siblingElement) {

                        var parentElement = siblingElement.parentElement;

                        // call HTMLElement.insertBefore()
                        parentElement.insertBefore(this, siblingElement);

                        return this;
                    },

                    /** @memberof HTMLExtendClass
                     *  @desc move current node after another node
                     *  @param siblingElement the sibling element
                     *  @return this */

                    afterToElement: function(siblingElement) {

                        var parentElement = siblingElement.parentElement;

                        // determine siblingElement position whether in the last

                        if(siblingElement.nextElementSibling == null) {

                            // append current node
                            parentElement.appendChild(this);
                        }
                        else {

                            siblingElement = siblingElement.nextElementSibling;

                            // insert current node
                            parentElement.insertBefore(this, siblingElement);
                        }

                        return this;
                    },

                    /** @memberof HTMLExtendClass
                     *  @desc swap current element and another element in document
                     *  @param oppositeNode another node
                     *  @return this*/

                    swapElement: function(oppositeNode) {

                        var thisParent, oppositeParent;

                        // get parent node
                        thisParent = this.parentElement;
                        oppositeParent = oppositeNode.parentElement;

                        // get sibling node
                        var thisSibling = this.nextElementSibling;
                        var oppositeSibling = oppositeNode.nextElementSibling;

                        // respectively process
                        if(thisSibling == null) {
                            thisParent.appendChild(oppositeNode);
                        }
                        else {
                            thisParent.insertBefore(oppositeNode, thisSibling);
                        }

                        if(oppositeSibling == null) {
                            oppositeParent.appendChild(this);
                        }
                        else {
                            oppositeParent.insertBefore(this, oppositeSibling);
                        }

                        return this;
                    }
                }


                copy(DOMTreeAPIs, $module.HTMLExtendClass);

                // add alias name

                var aliasName =
                {
                    "append": "appendElement",
                    "create": "createElement",
                    "appendTo": "appendToElement",
                    "depend": "appendToElement",

                    "insert": "insertElement",
                    "before": "setBeforeElement",
                    "after" : "setAfterElement",
                    "beforeTo": "beforeToElement",
                    "afterTo": "afterToElement",

                    "swap": "swapElement"
                };

                $Namespace.addAlias(aliasName, $module.HTMLExtendClass);

                // if on handy mode, copy the shortest name
                if($_handyMode == true) {

                    var handyAlias = {
                        "ap": "appendElement",
                        "cr": "createElement",
                        "de": "appendToElement",

                        "ins": "insertElement",
                        "bf": "setBeforeElement",
                        "af": "setAfterElement",

                        "bf2": "beforeToElement",
                        "af2": "afterToElement"
                    };

                    $Namespace.addAlias(handyAlias, $module.HTMLExtendClass);
                }

                // copy apis

                if(options.extendProto) {
                    copy($module.HTMLExtendClass, HTMLProto);
                }

                // a step for NodeList, it's important to opearte multiple node

                $keeper.list.HTMLAPISet = new Array();

                // push api with there name

                var apiNameList = $Namespace.getKeyNames($module.HTMLExtendClass);

                $keeper.list.HTMLAPISet = $keeper.list.HTMLAPISet.concat(apiNameList);


                // then set a handler for onload event, use extend NodeList
                bind(extendNodeList, window, "load");

                // add 'returnHTMLChanger' to keeper for use later
                $keeper.addAPI(returnHTMLChanger, "returnHTMLChanger");

                // now, expose a function to extend HTMLElemnt prototype quickly

                // first argument's type is unsure，the argument's name is boring
                $keeper.api.extendHTML = function(extMode, arg1, arg2, arg3) {

                    // get arg1's type
                    var arg1Type = typeof arg1;

                    var apiName, api;

                    var HTMLProto = HTMLElement.prototype;

                    // arg3 almost use set extend mode, both 'css' and 'attr'

                    var extMode = extMode || "css"; // default 'css'
                    // enter switch
                    switch(arg1Type) {

                        // - only take a api
                        case "string":
                        {
                            apiName = arg1;

                            HTMLProto[apiName] = returnHTMLChanger(extMode, arg2, arg3);

                            // push api to set
                            $keeper.list.HTMLAPISet.push(apiName);
                        }
                            break;

                        // - take multiple apis
                        case "object":
                        {
                            var descSets = arg1;

                            var curSet;
                            var nameArray, defValues;
                            // split object

                            for(apiName in descSets) {

                                curSet = descSets[apiName];

                                // get pass arguments

                                nameArray = curSet[0];
                                if(! (nameArray instanceof Array)) {

                                    // omit default values array
                                    nameArray = curSet;
                                }
                                else {
                                    defValues = curSet[1];
                                }
                                // done!
                                HTMLProto[apiName] = returnHTMLChanger(extMode, nameArray, defValues);

                                // push html api'name
                                $keeper.list.HTMLAPISet.push(apiName);
                            }
                        }
                            break;
                    }
                }

                // a step to add api quickly
                var MostCSSAPIMap =
                {
                    show: [["display"], ["block"]],
                    hide: [["display"], ["none"]]
                };

                $keeper.api.extendHTML("css", MostCSSAPIMap);

                // another step for attribute
                var NormalAttrAPIMap =
                {
                    edit: [["contenteditable"], [""]]
                };

                $keeper.api.extendHTML("attr", NormalAttrAPIMap);

                return $module.HTMLExtendClass;

                /* extendNodeList: add operator to NodeList's prototype, they are save in AtomKeeper */

                function extendNodeList() {

                    var apiList = $keeper.list.HTMLAPISet;

                    var NLProto = NodeList.prototype; // NodeList's prototype

                    for(var iApi = 0; iApi < apiList.length; iApi++) {

                        var curApiName = apiList[iApi]; // api for DOM Element

                        NLProto[curApiName] = NodeListAPIGetter(curApiName);
                    }
                    /* NodeListAPIGetter: get api saved in AtomKeeper, they will append to NodeList */

                    function NodeListAPIGetter(apiName) {

                        return NodeListAPI;
                        /*
                         NodeListAPI: change every Nodes in NodeSet, the way is call same name as api in them
                         */

                        function NodeListAPI() {

                            var nodeCount, nodeIndex, curNode; // keep data

                            nodeCount = this.length; // get total count in NodeList

                            // iterate the NodeList
                            for(nodeIndex = 0; nodeIndex < nodeCount; nodeIndex++) {

                                curNode = this[nodeIndex];

                                // call api in node
                                curNode[apiName].apply(curNode, arguments);
                            }

                            return this;
                        }
                    }
                }

                /*
                 returnHTMLChanger: add a api operatre a DOM Node's Style or Atrribute
                 we can take parameter on multi format
                 */
                function returnHTMLChanger(mode, arg1, arg2) {

                    var nameArray, defValues;

                    // set default mode == 'css'
                    mode = mode || 'css'; // can use in 'this[mode]', the name is same

                    // take type
                    var arg1Type = typeof arg1;

                    var thatName; // may be attrName or styleName
                    var singleMode; // if true, the changer only modify a field

                    if(arg1Type == "string") {
                        thatName = arg1;
                        singleMode = true;
                    }
                    else {
                        nameArray = arg1;
                        defValues = arg2 || []; // default is empty Array, block error
                    }

                    return HTMLChanger;

                    /*
                     HTMLChanger: change dom's style, take a argument
                     */
                    function HTMLChanger() {

                        var A1, A2; // argument1, argument2

                        var thatValue;

                        if(singleMode == true) {
                            A1 = thatName;

                            // take a value
                            A2 = arguments[0]
                        }
                        else {

                            A1 = new Object();

                            // compose values

                            for(var iName = 0; iName < nameArray.length; iName++) {

                                thatName = nameArray[iName]; // get name

                                thatValue = arguments[iName];
                                if(typeof(thatValue) == "undefined") {
                                    thatValue = defValues[iName] || ""; // default is empty string
                                }

                                // to A1, use later
                                A1[thatName] = thatValue;
                            }
                        }
                        // the api not exist in original browser scope, it's Atom's component
                        return this[mode].call(this, A1, A2);
                    }
                }
            }
        }
    }
}