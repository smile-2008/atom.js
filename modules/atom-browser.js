/**
 * @author shadow
 * @filename
 */

/** @class Browser */
var MODULE = {

    manifest: {
        name: "Browser",
        author: "shadow"
    },

    scope: {
        entry: function() {

        }
    },

    members: {

        /** @memberof Browser
         *  @desc determine current browser is webkit core
         *  @return true or false*/
        isWebkit: function() {

            var userAgent = navigator.userAgent;

            var webkitTest = /webkit/i;

            return webkitTest.test(userAgent);
        },
        /** @memberof Browser
         *  @desc determine whether current browser is chrome
         *  @return true or false */

        isChrome: function() {

            var userAgent;

            userAgent = navigator.userAgent;

            // create a regexp
            var testRegExp = /CHROME/i;

            return testRegExp.test(userAgent);
        },

        /** @memberof Browser
         *  @desc determine whether current browser is ie
         *  @return true or false*/

        isIE: function() {

            var appName = navigator.appName;

            // create a test regexp
            var testExp = /Microsoft/i;

            return testExp.test(appName);
        },

        /** @memberof Browser
         *  @desc add browser prefix to some css style name
         *  @param styleName thi input style name
         *  @return the modified name*/

        modifyStyleName: function(styleName) {

            var testRegexp;

            // get css special list
            var cssList = $keeper.list.specialCSSNames;

            if(cssList.indexOf(styleName) !== -1) {

                if($Browser.isWebkit() == true) {

                    testRegexp = /^(|-)webkit/i;

                    if(testRegexp.test(styleName) == false) {

                        // join css name start with webkit

                        styleName = "webkit" + styleName[0].toUpperCase() + styleName.slice(1);
                    }
                }
            }

            // if the style name has - symbol, convert it to style property name
            if(styleName.indexOf("-") !== -1) {

                // remove - in the start position
                styleName = styleName.replace(/^-*/, "");

                var wordList = styleName.split("-");

                styleName = "";

                for(var iWord = 0; iWord < wordList.length; iWord++) {

                    var curWord = wordList[iWord];

                    if(iWord == 0) {

                        // the first word always lowercase
                        styleName += curWord.toLowerCase();
                    }
                    else {
                        curWord = curWord.toLowerCase();

                        // follow words't initial charctor is uppercase
                        styleName += curWord[0].toUpperCase() + curWord.slice(1);
                    }
                }
            }

            return styleName;
        }
    },

    keep: {
        list: {
            specialCSSNames: ["animation", "transform", "transition"]
        }
    }
}
