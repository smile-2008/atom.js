/**
 * @author shadow
 * @filename
 */

/** @class Sheet */
/** @class AtomStyleSheet */
var MODULE =
{
    options:{
        initSheetCount: 2
    },
    manifest: {
        name: "Sheet",
        author: "shadow"
    },

    scope: {

        entry: function($module, options) {

            /** @step initSheetCount */

            for(var iSheet =0; iSheet < options.initSheetCount; iSheet++) {

                var sheetName = "Sheet" + (iSheet + 1);

                $module[sheetName] = new $module.AtomStyleSheet(null);

                if($_handyMode == true) {
                    window[sheetName] = $module[sheetName]
                }
            }
        },

        alias: {
            "addRule": "addCSSRule"
        },

        handyAlias: {
            "rule": "addCSSRule"
        }
    },

    members: {

        /** @memberof Stylesheet
         *  @desc add a css rule*/

        addCSSRule: function(selector, cssContent, sheetObject) {

            sheetObject = sheetObject || 1;

            if(typeof(sheetObject) === "number") {

                var sheetID = sheetObject;
                sheetObject = $Sheet["Sheet" + sheetID];
            }

            sheetObject.addRule(selector, cssContent);

            // get rule index juse added

            var ruleLength = sheetObject.rules.length;

            var lastRule = sheetObject.rules[ruleLength - 1];

            // set new key to sheetObject
            sheetObject[selector] = lastRule;

            return lastRule;
        }
      },

    Class: {
        AtomStyleSheet: function(source) {

            var sheetElement, sheetObject;

            if(typeof(source) == "string") {

                sheetElement = document.createElement("link");

                sheetElement.href = source;
                sheetElement.rel = "stylesheet";

                // append link element
                document.head.appendChild(sheetElement);
            }
            else if(source == null) {

                sheetElement = document.createElement("style");

                // append style element

                document.head.appendChild(sheetElement);

                // get StyleSheet
                sheetObject = sheetElement.sheet;
            }
            else if(source instanceof HTMLElement) {
                sheetElement = source;
                sheetObject = source.sheet;
            }
            else if(source instanceof StyleSheet) {
                sheetElement = source.ownerNode;
                sheetObject = source;
            }

            return sheetObject;
        }
    }
}