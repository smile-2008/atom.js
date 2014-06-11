/**
 * @author shadow
 * @filename
 */

/** @class Color */
var MODULE = {

    options: {
        "workEnable": true,

        "extendProto": false,
        "addToNodeList": true
    },
    manifest: {
        name: "Color",
        author: "shadow"
    },

    scope: {
        entry: function($module, options) {

            /** @step install component for HTMLElement */

            if(options.workEnable == true) {
                installColorComponent();
            }

            /** inner */

            function installColorComponent() {

                var apiTarget;

                // get component
                var component = $keeper.component.ColorHTMLExtension;

                if(options.extendProto == true) {
                    apiTarget = HTMLElement.prototype;
                }
                else {
                    apiTarget = AtomSelector.api;

                    $Iterator.map(component, function(apiFunc) {
                        return $keeper.api.returnSelectorAPIs(apiFunc);
                    });
                }


                // install use $CORE.copy()

                $CORE.copy(component, apiTarget);

                // add alias name
                var aliasMap =
                {
                    "setBg16": "setBackground16",
                    "text16": "setColor16",

                    "setBg139": "setBackground139",
                    "text139": "setColor139",

                    "hue16": "setHue16",
                    "hue139": "setHue139"
                };

                $Namespace.addAlias(aliasMap, apiTarget);

                // add color apis to HTMLAPIList

                var colorAPIs;

                if(options.addToNodeList == true) {

                    colorAPIs = $Namespace.getKeyNames([component, aliasMap]);
                }
                // add handy alias name
                if($_handyMode == true) {

                    var handyAlias =
                    {
                        "bg16": "setBackground16",
                        "bg139": "setBackground139",

                        "h16": "setHue16",
                        "h139": "setHue139"
                    };

                    $Namespace.addAlias(handyAlias, apiTarget);

                    // if colorAPIs not undefined
                    colorAPIs = colorAPIs.concat($Namespace.getKeyNames(handyAlias));
                }

                if(colorAPIs.length > 0) {

                    $keeper.list.HTMLAPISet = $keeper.list.HTMLAPISet.concat(colorAPIs);
                }
            }
        },

        alias: {
            "color16": "get16Color",
            "color139": "get139Color"
        },

        handyAlias: {
            "c16": "get16Color",
            "c139": "get139Color"
        }
    },
    members: {
        /** @memberof Color
         *  @desc return a color name in 16 color list
         *  @return a color name */

        get16Color: function(colorIndex) {

            // get list from keep

            var colorList = $keeper.list.colors16;

            var colorListLength = 16;

            if(colorIndex == undefined) {
                colorIndex =  Math.round(Math.random() * (colorListLength - 1));
            }

            // get color name
            var colorName = colorList[colorIndex];

            return colorName;
        },

        /** @memberof Color
         *  @desc return a color nmae in 139 color list
         *  @return a color name*/

        get139Color: function(colorIndex) {

            // get color name list
            var colorNameList = $keeper.list.colors139;

            var listLength = colorNameList.length;

            if(colorIndex == undefined) {
                colorIndex = Math.round(Math.random() * (listLength - 1));
            }

            // get a lucky name!
            var colorName = colorNameList[colorIndex];

            return colorName;
        }
    },

    keep: {
        component: {
            ColorHTMLExtension: {

                /** @memberof Color
                 *  @desc set element's background use 16 color name list
                 *  @param colorIndex the color index, if not indicate, generate a random index
                 *  @return this*/
                setBackground16: function(colorIndex) {

                    this.style.background = $Color.get16Color(colorIndex);

                    return this;
                },

                /** @memberof Color
                 *  @desc set element's color use 16 color name list
                 *  @param colorIndex the color index, if not indicate, generate a random index
                 *  @return this */
                setColor16: function(colorIndex) {

                    this.style.color = $Color.get16Color(colorIndex);

                    return this;
                },

                /** @memberof Color
                 *  @desc set element's background color use 139 color name list
                 *  @param colorIndex the color index, if not indicate, generate a random index
                 *  @return this*/
                setBackground139: function(colorIndex) {

                    this.style.background = $Color.get139Color(colorIndex);

                    return this;
                },

                /** @memberof Color
                 *  @desc set element's color index use 139 color name list
                 *  @param colorIndex the color name's index in the list, default a random integer
                 *  @return this*/
                setColor139: function(colorIndex) {

                    this.style.color = $Color.get139Color(colorIndex);

                    return this;
                },

                /** @memberof Color
                 *  @desc set element's background color and forecolor use 16 color name list
                 *  @param backgroundIndex the background color index, default random integer
                 *  @param colorIndex the font color index, default a random integer from 0 - 15
                 *  @return this*/

                setHue16: function(backgroundIndex, colorIndex) {

                    this.style.backgroundColor = $Color.get16Color(backgroundIndex);
                    this.style.color = $Color.get16Color(colorIndex);

                    return this;
                },

                /** @memberof Color
                 *  @desc set element's background color and forecolor use 139 colors name list
                 *  @param backgroundIndex the background color index, default random integer
                 *  @param colorIndex the forecolor index, default a random integer
                 *  @return this */

                setHue139: function(backgroundIndex, colorIndex) {

                    this.style.backgroundColor = $Color.get139Color(backgroundIndex);
                    this.style.color = $Color.get139Color(colorIndex);

                    return this;
                }
            }
        },
        list:
        {
            colors16:
                [
                    "aqua", "black", "blue", "fushcia", "gray", "green", "lime", "maroon",
                    "navy", "olive", "purple", "red", "silver", "teal", "yellow", "white"
                ],
            colors139:
                [
                    "AliceBlue", "AntiqueWhite", "Aqua", "Aquamarine", "Azure", "Beige", "Bisque", "Black",
                    "BlancedAlmond", "Blue", "BlueViolet", "Brown", "BurlyWood", "CadetBlue", "Chartreuse",
                    "Chocolate", "Coral", "CornflowerBlue", "Cornsilk", "Crimson", "Cyan", "DarkBlue", "DarkCyan",
                    "DarkGoldenRod", "DarkGray", "DarkGreen", "DarkKhaki", "DarkMagenta", "DarkOliveGreen", "DarkOrange",
                    "DarkOrchid", "DarkRed", "DarkSalmon", "DarkSeaGreen", "DarkSlateGray", "DarkSlateBlue", "DarkTurquoise",
                    "DarkViolet", "DeepPink", "DeepSkyBlue", "DimGray", "DodgerBlue", "FireBrick", "FloralWhite", "ForestGreen",
                    "Fuchsia", "Gainsboro", "GhostWhite", "Gold", "GoldenRod", "Gray", "Green", "GreenYellow", "HoneyDew", "HotPink",
                    "IndianRed", "Indigo", "Ivory", "Khaki", "Lavender", "LavenderBlush", "LawnGreen", "LemonChiffon", "LightBlue",
                    "LightCoral", "LightCyan", "LightGoldenRod", "LightGray", "LightGreen", "LightPink", "LightSalmon", "LightSkyBlue",
                    "LightSlate", "LightSlateGray", "LightSteelBlue", "LightYellow", "Lime", "LimeGreen", "Linen", "Magenta", "Maroon",
                    "MediumAquaMarine", "MediumBlue", "MediumOrchid", "MediumPurple", "MediumSeaGreen", "MediumSlateBlue", "MediumSpringGreen",
                    "MediumTurquoise", "MediumVioletRed", "MintCream", "MistyRose", "Moccasin", "NavajoWhite", "Navy", "OldLace",
                    "Olive", "OliveDrab", "Orange", "OrangeRed", "Orchid", "PaleGoldenRod", "PaleGreen", "PaleTurquoise",
                    "PaleVioletRed", "PapayaWhip", "PeachPuff", "Peru", "Pink", "Plum", "PowderBlue", "Purple", "Red", "RosyBrown",
                    "RoyalBlue", "SaddleBrown", "Salmon", "SandyBrown", "SeaGreen", "SeaShell", "Sienna", "Silver", "SkyBlue",
                    "SlateBlue", "SlateGray", "Snow", "SpringGreen", "SteelBlue", "Tan", "Teal", "Thistle", "Tomato", "Turquoise",
                    "Violet", "Wheat", "White", "WhiteSmoke", "Yellow", "YellowGreen"
                ]
        }
    }
}


