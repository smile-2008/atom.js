/**
 * @author shadow
 * @filename
 */

/** @class CSS */
var MODULE = {
    options: {
      "extendCSS": true,
      "extendProto": false
    },
    manifest: {
        name: "CSS",

        appendence: ["color", "sheet"],
        dependence: ["element"]
    },
    scope: {
        entry: function($module, options) {

            if(options.extendCSS == true) {
                extendHTMLElementWithCSS();

                funcyPackage();
            }
            /*
             * desc: extendHTMLElementWithCSS: add some api to modify DOM's style, depend on 'extendHTMLElement', only css()
             */

            function extendHTMLElementWithCSS() {

                var CSSStyleNameMap =
                {
                    background: "bg", opacity: "opa", display: "disp", width: "W", height: "H", minWidth: "mW",

                    color: "", fontSize: "fS", fontFamily: "fF", textAlign: "tA", lineHeight: "lH",

                    position: "pos", top: "t", right: "r", bottom: "b", left: "l",

                    margin: "m", marginTop: "mT",  marginRight: "mR", marginBottom: "mB",marginLeft: "mL",

                    padding: "pad", paddingTop: "pT", paddingRight: "pR", paddingBottom: "pB", paddingLeft: "pL",

                    cursor: "", overflow: "flow",

                    border: "", borderRadius: "bRa", borderLeft: "bL", borderTop: "bT", borderRight: "bR", borderBottom: "bB",
                    borderLeft: "bL", borderColor: "bC", borderStyle: "bS", borderWidth: "bW",

                    transition: "ts", animation: "am", transform: "tf"
                };



                var cssAPIs = {};

                // use for in get every styleName

                for(var styleName in CSSStyleNameMap) {

                    var shortName; // use if handy set

                    shortName = CSSStyleNameMap[styleName];

                    if(AtomConfig.handyMode !== true) {
                        shortName = "";
                    }

                    cssAPIs[styleName] = $keeper.api.returnHTMLChanger("css", styleName);

                    // save api to keeper
                    $keeper.list.HTMLAPISet.push(styleName);

                    if(shortName !== "") {
                        cssAPIs[shortName] = cssAPIs[styleName];

                        // also save short case
                        $keeper.list.HTMLAPISet.push(shortName);

                    }
                }


                $CORE.copy(cssAPIs, $keeper.list.HTMLAPIFuncs);

                if(options.extendProto == true) {
                    $CORE.copy(cssAPIs, HTMLElement.prototype);
                }
            }
            /**
             * desc funcyPackage: The codes bring funcy and handy action to DOM :)
             */

            function funcyPackage() {

                // - css parts

                var CSSMap =
                {
                    huge: [["fontSize", "fontWeight", "fontFamily"], ["48px", "bold", "impact"]],
                    shape: [["width", "height", "position"], ["100px", "100px", "relative"]],
                    xy: [["left", "top", "position"],["0px", "0px", "absolute"]]
                };

                // only call a api
                $keeper.api.extendHTML("css", CSSMap);
            }
        }
    },

    keep: {

        list: {

            "dimensionStyles":
                [
                    "width", "height", "top", "left", "right", "bottom",  "borderRadius", "borderLeft",  "borderRight", "borderTop", "borderBottom",
                    "margin", "padding",
                    "marginLeft", "marginRight", "marginTop", "marginBottom", "paddingLeft", "paddingTop", "paddingRight", "paddingBottom"
                ]
        }
    }
}