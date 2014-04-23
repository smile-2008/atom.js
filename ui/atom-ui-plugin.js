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

            var moveController = {}, moveStatus,

                alsoMoveAnchor = false,
                startMoved = false,

                topStyle = "top",
                leftStyle = "left",

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
                onEndMove: null,

                useMarginTop: false,
                useMarginLeft: false,

                counter: 0
            };


            if(userOptions) {
                copy(userOptions, Options);
            }

            oriNode = moveNode = moveNode || anchorNode;

            if(moveNode !== anchorNode && Options.moveAnchor) {
                Atom.UI.Plugin.enableMove(anchorNode);
            }

            bind(onMousedown_anchorNode, anchorNode[0], "mousedown");

            moveController.setOption = function(optionName, optionValue) {

                Options[optionName] = optionValue;

                return this;
            }

            moveController.convertMode = function(useMarginTop, left) {

                if(useMarginTop == true) {

                    Options.useMarginTop = true;

                    topStyle = "marginTop";

                }
                else {

                }
            }


            moveNode[0]._moveController = moveController;

            return moveController;

            function onMousedown_anchorNode(event) {

                moveStatus = "move";

                Options.counter ++;
                if(Options.useMarginTop == true) {
                    topStyle = "marginTop";
                }

                if(Options.useMarginLeft == true) {
                    leftStyle = "marginLeft";
                }

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
                        DOMStartLeft = parseInt(DOMStyle[leftStyle]) || 0;
                        DOMStartTop = parseInt(DOMStyle[topStyle]) || 0;
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

                    moveNode.css(leftStyle,DOMStartLeft + offsetX + "px") ;
                    moveNode.css(topStyle, DOMStartTop + offsetY + "px");

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
        },

        "enableResize": function(anchorNode, resizeNode, userOptions) {

            var Options =
            {
                "position": "top left",

                "onResize": null
            };

            $CORE.copy(userOptions, Options);

            var position = Options.position.split(/\s/),
                horizontal, vertical,

                isTop, isLeft, isMousedown;

            horizontal = position[1], vertical = position[0];

            isTop = (vertical == "top"),
                isLeft =(horizontal == "left");

            anchorNode[0].addEventListener("mousedown", onMousedown_anchor);

            function onMousedown_anchor(event) {

                isMousedown = true;
                window.addEventListener("mousemove", onMousemove_window);
                window.addEventListener("mouseup", onMouseup_window);

                // save coordinate

                startX = event.screenX;
                startY = event.screenY;

                startTop = parseInt(resizeNode[0].style.top) || 0;
                startLeft = parseInt(resizeNode[0].style.left) || 0;

                startWidth = resizeNode[0].clientWidth;
                startHeight = resizeNode[0].clientHeight;
            }

            function onMousemove_window(event) {

                var newTop, newLeft, newWidth, newHeight,

                    diffX, diffY;

                if(isMousedown == true) {

                    diffY = event.screenY - startY;

                    // set new height

                    if(isTop == true) {

                        newTop = startTop + diffY;

                        resizeNode.css("top", newTop + "px");

                        diffY = -diffY;
                    }

                    newHeight = startHeight + diffY;
                    resizeNode.css("height", newHeight + "px");

                    diffX = event.screenX - startX;

                    // set new width

                    if(isLeft == true) {

                        newLeft = startLeft + diffX;

                        resizeNode.css("left", newLeft + "px");
                        diffX = -diffX;
                    }

                    newWidth = startWidth + diffX;
                    resizeNode.css("width", newWidth + "px");
                }

                // callback onResize

                if(Options.onResize) {

                    Options.onResize.call(resizeNode);
                }
            }

            function onMouseup_window(event) {

                window.removeEventListener("mouseup", onMouseup_window, false);
                window.removeEventListener("mousemove", onMousemove_window, false);

                isMousedown = false;
            }
        }
    }
};