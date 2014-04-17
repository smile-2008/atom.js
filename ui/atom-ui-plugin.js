/**
 * Created by shadow
 * @filename
 */

var MODULE =
{
    options: {

    },
    manifest: {
        name: "ui-plugin",
        type: "ui",

        exportTarget: Atom.UI.Plugin
    },
    scope: {

        init: function() {

        },
        entry: function($module, options) {

            _a.move = Atom.UI.Plugin.enableMove;
        }
    },

    alias: {

    },
    members: {

        "enableMove": function(anchorNode, moveNode, userOptions) {

            var moveStatus,

                alsoMoveAnchor = false,
                startMoved = false,

                startX, startY,
                offsetX, offsetY,

                DOMStyle,
                DOMStartLeft, DOMStartTop,

                oriNode,
                $ = AtomSelector;

            var Options =
            {
                moveClass: "aui-moving",

                moveAnchor: false,
                mode: "normal",

                onMove: null,

                onStartMove: null,

                onEndMove: null
            };

            if(userOptions) {
                copy(userOptions, Options);
            }

            oriNode = moveNode = moveNode || anchorNode;

            if(moveNode !== anchorNode && Options.moveAnchor) {
                Atom.UI.Plugin.enableMove(anchorNode);
            }


            bind(onMousedown_anchorNode, anchorNode[0], "mousedown");

            function onMousedown_anchorNode(event) {

                moveStatus = "move";

                // disable select

                $("body").addClass("disable_select");

                // check mode
                startX = event.screenX, startY = event.screenY;

                switch(Options.mode) {

                    case "copy":
                    {

                        // create same node
                        moveNode = oriNode;

                        var cloneNode = moveNode.clone(true).addClass("aui-clone");
                        moveNode.append(cloneNode);

                        // switch node

                        moveNode = cloneNode;

                        DOMStartLeft = event.clientX - event.offsetX;
                        DOMStartTop = event.clientY - event.offsetY;
                    }
                        break;

                    case "normal":
                    {
                        DOMStyle = window.getComputedStyle(moveNode[0]);
                        DOMStartLeft = parseInt(DOMStyle.left) || 0;
                        DOMStartTop = parseInt(DOMStyle.top) || 0;
                    }
                }

                // add mouse event listener
                bind(onMousemove_window, window, "mousemove");
                bind(onMouseup_window, window, "mouseup");

                // add move class

                anchorNode.addClass(Options.moveClass);
                moveNode.addClass(Options.moveClass);
            }

            function onMousemove_window(event) {
                if(moveStatus == "move") {


                    if(startMoved == false && Options.onStartMove) {

                        Options.onStartMove(event);

                        startMoved = true;
                    }

                    offsetX = event.screenX - startX;
                    offsetY = event.screenY - startY;

                    // set dom's position

                    moveNode.css("left",DOMStartLeft + offsetX + "px") ;
                    moveNode.css("top", DOMStartTop + offsetY + "px");

                    if(Options.onMove) {

                        Options.onMove(event);
                    }
                }
            }

            function onMouseup_window(event) {

                $("body").removeClass("disable_select");
                moveStatus = "stop";

                unbind(onMousemove_window, window, "mousemove");
                unbind(onMouseup_window, window, "mouseup");

                // remove move class

                anchorNode.removeClass(Options.moveClass);
                moveNode.removeClass(Options.moveClass);

                // call onDrop

                switch(Options.mode) {

                    case "copy":
                    {
                        moveNode.remove();
                    }
                        break;
                }

                startMoved = false;

                if(Options.onEndMove) {

                    Options.onEndMove(event);
                }
            }
        }
    }
};