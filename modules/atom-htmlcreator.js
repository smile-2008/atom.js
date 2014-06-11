/**
 * @author shadow
 * @filename atom-htmlcreator.js
 */

/** @class HtmlCreator */
var MODULE = {

    options: {
        createCreator: true,

        defaultCreatorArguments: ["innerHTML", "className", "id"],
        exposeTagNames:
            [
                "a", "audio", "b", "br", "button", "canvas", "div", "form", "h1", "h2", "h3", "h4", "h5", "h6",
                "hr", "i", "img", "input", "label", "li", "link","option", "optgroup", "p",
                "pre", "progress", "script", "section",  "small", "span", "style", "table",
                "td", "textarea", "th", "time", "u",  "video"
            ],
        creatorArgumentsForTagName:
        {
            a: [ "href", "target" ],
            audio: [ "src", "controls", "autoplay" ],
            canvas: [ "width", "height" ],
            form: [ "action", "name", "method", "target" ],
            img: ["src"],
            input: [ "type", "name", "value"],
            link: [ "rel", "href" ],
            option: [ "value" ],
            optgroup: [ "label" ],
            progress: [ "value" , "max"],
            script: [ "src" ],
            table: [ "align" ],
            textarea: [ "rows", "cols" ],
            video: [ "src", "controls", "autoplay" ]
        }
    },
    manifest: {
        name: "HTMLCreator",
        author: "shadow",

        exportMode: "all-members"

    },

    scope: {

        onInit: function() {

        },
        entry: function($module, options) {

            if(options.createCreator == true) {

                // get arguments for buildHTMLCreator

                var tagList = $keeper.list.htmlTagNames;
                var exposeList = options.exposeTagNames;
                var defaultArgumentList = options.defaultCreatorArguments;
                var creatorArgumentMap = options.creatorArgumentsForTagName;

                window.$html = buildHTMLCreator(tagList, exposeList, defaultArgumentList, creatorArgumentMap);
            }

            /** desc build many html creator */
            function buildHTMLCreator(tagNameList, exposeTagList, defaultArgList, creatorArgMap) {

                var creator = new Object();

                for(var iTag =0; iTag < tagNameList.length; iTag++) {

                    var curTag = tagNameList[iTag];

                    // get creator argument list

                    var argList = creatorArgMap[curTag] || [];

                    // concat argument list
                    argList = argList.concat(defaultArgList);

                    creator[curTag] = returnHTMLCreator(curTag, argList);
                }

                // expose some creator

                exposeTagList = exposeTagList || [];

                $Namespace.addGlobal(creator, exposeTagList);

                return creator;
            }
            /** inner
             *  desc return a HTMLCreator
             */
            function returnHTMLCreator(tagName, creatorArgumentList) {

                return HTMLCreator;

                function HTMLCreator() {

                    var element;

                    element = document.createElement(tagName);

                    // iterate every argument

                    for(var iarg = 0; iarg < arguments.length; iarg++) {

                        var curArg = arguments[iarg];

                        // if current argument value is undefine, skip

                        if(curArg == undefined) {
                            continue;
                        }

                        var curProperty = creatorArgumentList[iarg];

                        element[curProperty] = curArg;
                    }

                    if(window.AtomSelector) {
                        element = AtomSelector(element);
                    }

                    return element;
                }
            }
        },

        alias: {
            "create": "createElement"
        },

        handyAlias: {
            "cele": "createElement",
            "cele2": "createElement2"
        }
    },

    keep: {

        list:
        {
            htmlTagNames:
                [
                    "a", "abbr", "area", "b", "base", "blockquote", "body", "br", "button", "canvas",
                    "code", "col", "colgroup", "datalist", "dd", "del", "div", "dl", "em", "embed",
                    "fieldset", "figcaption", "figure", "footer", "form", "h1", "h2", "h3", "h4", "h5",
                    "h6", "head", "header", "hr", "html", "i", "iframe", "img", "input", "label", "legend",
                    "li", "link", "map", "mark", "menu", "meta", "nav", "ol", "optgroup", "option", "output",
                    "p",  "pre", "progress", "q", "s", "script", "section", "select", "small", "source",
                    "span", "strike", "strong", "style", "sub", "summary", "sup", "table", "tbody", "td", "textarea",
                    "tfoot", "th", "thead", "time", "title","tr", "track", , "u", "ul", "video"
                 ]
        }
    },
    members: {

        /** @memberof HtmlCreator
         *  @desc create a html element
         *  @param tagName the element's tag name
         *  @param innerHTML the element's html content
         *  @param attributesObject an object contains element's attribute
         *  @param attributeMode if true, the attribute set by setAttribute(), else set attribute on element object
         *  @return a html element*/
        createElement: function(tagName, innerHTML, attributesObject, attributeMode) {

            var resultDOM;

            // create a html element
            resultDOM = document.createElement(tagName);

            // set element's html content

            innerHTML = innerHTML || "";
            resultDOM.innerHTML = innerHTML;

            // create attributes object use $CORE.composeObject()

            if(attributesObject) {
                attributesObject = $CORE.composeObject(attributesObject);

                // iterate attributes object

                for(var attrName in attributesObject) {

                    var attrValue;
                    attrValue = attributesObject[attrName];

                    // check whether attribute mode

                    if(attributeMode == true) {
                        resultDOM.setAttribute(attrName, attrValue);
                    }
                    else {
                        resultDOM[attrName] = attrValue;
                    }
                }
            }

            if($Selector.AtomSelector) {
                resultDOM = $Selector.AtomSelector(resultDOM);
            }

            return resultDOM;

        },

        /** @memberof HTMLCreator
         *  @desc create a html element
         *  @param tagName the element's tag name
         *  @param innerHTML the eleemnt's content
         *  @param className the element's class name
         *  @param id the element's id
         *  @return the result element*/
        createElement2: function(tagName, content, className, id) {

            var element;

            // use document.createElement()
            element = document.createElement(tagName);

            element = AtomSelector(element);
            // set content
            if(content != null) {
                element.append(content);
            }

            // set className

            if(className) {
                element[0].className = className;
            }

            // set id
            if(id) {
                element[0].id = id;
            }


            return element;
        }
    }
}
