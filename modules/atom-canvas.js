/**
 * Created by shadow
 * @filename
 */

var MODULE =
{
    options: {
    },
    manifest: {
        name: "canvas"
    },
    scope: {

        alias: {


        },
        classAlias: {

            canvas: "AtomCanvas"
        },
        entry: function($module, options) {


        }
    },

    members: {

    },

    Class: {

        AtomCanvas: function(width, height, createOptions) {

            var _the,
                nodeCanvas,
                AtomCanvasClass = "atom-canvas ",

                Options =
                {
                    "parent": document.body,
                    "className": ""
                };

            nodeCanvas = document.createElement("canvas");
            _the = nodeCanvas.getContext("2d");
            nodeCanvas.width = width;
            nodeCanvas.height = height;
            nodeCanvas = AtomSelector(nodeCanvas);

            nodeCanvas.addClass(AtomCanvasClass + Options.className);

            _the.node = nodeCanvas;

            if(Options.parent) {
                Options.parent.appendChild(nodeCanvas[0]);
            }

            return _the;
        }
    }
};