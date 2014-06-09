/**
 * Created by programmer on 14-4-2.
 */

MODULE = {

    options: {

        selectorSymbol: ["get", "sel", "$$$", "v"],

        loadUI: true
    },
    manifest: {
        name: "Selector",

        dependence: ["element"],

        appendence: ["ui-basic*"]
    },

    scope: {

        entry: function($module, options) {

            var selectorAPIs = {}, APISet, apiMethod,

                HTMLEmitter = new $CORE.Emitter();

            if(true) {

                // create apis object

                $CORE.copy($ELEMENT.HTMLExtendClass, selectorAPIs);
                $CORE.copy($keeper.list.HTMLAPIFuncs, selectorAPIs);
                $CORE.copy(HTMLEmitter, selectorAPIs);

                $keeper.list.AtomSelectorAPIs = selectorAPIs;
                $module.AtomSelector.api = selectorAPIs;

                for(var apiName in selectorAPIs) {

                    apiMethod = selectorAPIs[apiName];

                    selectorAPIs[apiName] = $keeper.api.returnSelectorAPIs(apiMethod);
                }

                // add alias name

                options.selectorSymbol.forEach(function(symbolName) {

                    window[symbolName] = $module.AtomSelector;
                });
            }

//            if(! false) {
//                $seed.loadModule("ui-basic", "ui");
//            }
        }
    },

    "keep": {
        "api": {
            "returnSelectorAPIs": function (apiFunc, options) {

                options = options || {};

                return SelectorAPIFunc;

                function SelectorAPIFunc() {

                    var endIndex, startIndex,

                        apiResult, firstResult,
                        _node, firstArg;

                    endIndex = this.length;

                    for(var startIndex = 0; startIndex < endIndex; startIndex++) {

                        _node = this[startIndex];

                        if(options.unshiftThis == true) {
                            arguments = $Array.toArray(arguments);

                            firstArg = _node;
                            if(options.addSelector == true) {
                                firstArg = AtomSelector(_node);
                            }
                            arguments.unshift(firstArg);
                        }

                        apiResult = apiFunc.apply(_node, arguments);

                        if(startIndex == 0) {
                            if(apiResult == _node) {
                                firstResult = this;
                            }
                            else {
                                firstResult = apiResult;
                            }
                        }
                    }
                    return firstResult;
                }
            }
        }
    },

    Class: {

        "AtomSelector": function(selector) {

            var _this = [], argType;

            var nodeList;

            argType = typeof(selector);

            switch(argType) {

                case "string": {
                    nodeList = document.querySelectorAll(selector);

                    _this = $Array.toArray(nodeList);
                }
                    break;

                case "object": {

                    if(selector instanceof HTMLElement) {

                        _this.push(selector);
                    }
                    else if($Array.isLikeArray(selector)) {

                        _this = selector;
                    }
                }
                    break;
            }

            // copy functions

            $CORE.copy($keeper.list.AtomSelectorAPIs, _this);

            _this.atom = "1.0";

            return _this;
        }
    }
};