/**
 * Created by programmer on 14-4-2.
 */

MODULE = {

    options: {

        selectorSymbol: ["get", "sel", "$$$"],

        loadUI: true
    },
    manifest: {
        name: "Selector",

        dependence: ["element"]
    },

    scope: {

        entry: function($module, options) {

            var selectorAPIs, APISet, apiMethod;

            if(true) {

                // create apis object

                selectorAPIs = {};
                $keeper.list.AtomSelectorAPIs = selectorAPIs;
                $module.AtomSelector.api = selectorAPIs;


                APISet = $ELEMENT.HTMLExtendClass;


                for(var apiName in APISet) {

                    apiMethod = APISet[apiName];

                    selectorAPIs[apiName] = $keeper.api.returnSelectorAPIs(apiMethod);
                }

                // add alias name

                options.selectorSymbol.forEach(function(symbolName) {

                    window[symbolName] = $module.AtomSelector;
                });
            }

            if(! false) {
                $seed.loadModule("ui-basic", "ui");
            }
        }
    },

    "keep": {
        "api": {
            "returnSelectorAPIs": function (apiFunc) {

                return SelectorAPIFunc;

                function SelectorAPIFunc() {

                    var endIndex, startIndex,

                        _node;

                    endIndex = this.length;

                    for(var startIndex = 0; startIndex < endIndex; startIndex++) {

                        _node = this[startIndex];

                        apiFunc.apply(_node, arguments);
                    }

                    return this;
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
                }
                    break;
            }

            // copy functions

            $CORE.copy($keeper.list.AtomSelectorAPIs, _this);

            return _this;
        }
    }
};