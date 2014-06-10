/**
 * Created by shadow
 * @filename
 */

var MODULE =
{
    options: {
        pluginForSelector: ["moveable", "resizeable", "draggable", "droppable", "model"]
    },
    manifest: {
        name: "ui-plugin",
        type: "ui",

        exportTarget: Atom.UI.Plugin,

        css: ["atom-ui-plugin.css"]
    },
    scope: {

        init: function() {

        },
        entry: function($module, options) {

            if($_handyMode) {
                window.move = Atom.UI.Plugin.moveable;
                window.resize = Atom.UI.Plugin.resizeable;
            }

            // export HTML API

            var selectorAPIs = $keeper.list.AtomSelectorAPIs;

            options.pluginForSelector.forEach(function(plugName) {

                var plugFunc = $module[plugName],

                    returnOpts =
                    {
                        unshiftThis: true,
                        addSelector: true
                    };

                selectorAPIs[plugName] = $keeper.api.returnSelectorAPIs(plugFunc, returnOpts);
            });
        }
    },

    alias: {

    },
    members: {

        "moveable": function(anchorNode, moveNode, userOptions) {

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
                thisSkipCounter = 0,
                $ = window.jQuery;

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
                counter: 0,
                skipCounter: 6,
                cssPosition: "",
                cssZIndex: 1000,

                preventDefault: true,
                stopPropagation: true
            };

            if(userOptions) {
                $$$.extend(userOptions, Options);
            }

            oriNode = moveNode = moveNode || anchorNode;
            if(moveNode !== anchorNode && Options.moveAnchor) {
                Atom.UI.Plugin.moveable(anchorNode, null, userOptions);
            }

            if(Options.cssPosition) {
                anchorNode.css("position", Options.cssPosition);
                moveNode.css("position", Options.cssPosition);
            }

            if(Options.cssZIndex) {
                anchorNode.css("zIndex", Options.cssZIndex);
                moveNode.css("zIndex", Options.cssZIndex);
            }

            if(Options.cssDisplay) {
                anchorNode.css("zIndex", Options.cssDisplay);
                moveNode.css("zIndex", Options.cssDisplay);
            }


            anchorNode[0].addEventListener("mousedown", onMousedown_anchorNode);

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
                    Options.useMarginTop = false;
                    topStyle = "top";
                }
            }

            moveController.destroy = function() {
                anchorNode[0].removeEventListener("mousedown", onMousedown_anchorNode);
            }

            if(moveNode[0]._moveControllers == null) {
                moveNode[0]._moveControllers = [];
            }
            moveNode[0]._moveControllers.push(moveController);

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

                // 禁用选择
                $$$("body").addClass("atom-disable-select");

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
                window.addEventListener("mousemove", onMousemove_window);
                window.addEventListener("mouseup", onMouseup_window);

                // add move class
                anchorNode.addClass(Options.moveClass);
                moveNode.addClass(Options.moveClass);

                if(Options.preventDefault == true) {
                    event.preventDefault();
                }

                if(Options.stopPropagation == true) {
                    event.stopPropagation();
                }
            }

            function onMousemove_window(event) {

                if(moveStatus == "move") {

                    // 跳过当前事件，可以提高效率
                    if((++thisSkipCounter % Options.skipCounter) !== 0) {
                        return;
                    }

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

                $$$("body").removeClass("atom-disable-select");
                moveStatus = "stop";

                window.removeEventListener("mousemove", onMousemove_window);
                window.removeEventListener("mouseup", onMouseup_window);

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

        "resizeable": function(anchorNode, resizeNode, userOptions) {

            var Options =
            {
                "position": "top left",
                "onResize": null,
                "onResizeStart": null,
                "onResizeEnd": null,
                "resizeClass": "aui-resizing",
                "skipCounter": 6
            };

            $.extend(Options, userOptions);

            var position = Options.position.split(/\s/),
                horizontal, vertical,
                controller = {},
                startX, startY, startTop, startLeft,
                startHeight, startWidth,
                isTop, isLeft, isMousedown,
                thisSkipCounter = 0;

            horizontal = position[1], vertical = position[0];
            isTop = (vertical == "top"),
                isLeft =(horizontal == "left");

            anchorNode[0].addEventListener("mousedown", onMousedown_anchor);
            controller.destroy = function() {
                anchorNode[0].removeEventListener("mousedown", onMousedown_anchor);
            }

            if(resizeNode[0]._resizeControllers == null) {
                resizeNode[0]._resizeControllers = [];
            }

            resizeNode[0]._resizeControllers.push(controller);

            function onMousedown_anchor(event) {

                $("body").addClass("disable_select");

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

                resizeNode.addClass(Options.resizeClass);
                if(Options.onResizeStart) {
                    Options.onResizeStart.call(resizeNode);
                }
            }

            function onMousemove_window(event) {

                var newTop, newLeft, newWidth, newHeight,
                    diffX, diffY;

                if(isMousedown == true) {
                    if((++thisSkipCounter % Options.skipCounter) !== 0) {
                        return;
                    }

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

                $("body").removeClass("disable_select");

                window.removeEventListener("mouseup", onMouseup_window, false);
                window.removeEventListener("mousemove", onMousemove_window, false);

                isMousedown = false;

                resizeNode.removeClass(Options.resizeClass);

                if(Options.onResizeEnd) {
                    Options.onResizeEnd.call(resizeNode);
                }
            }
        },

        "draggable": function(targetNode, onDragStart, userOptions) {

//            var Options =
//            {
//                preventDefault: false,
//                stopPropagation: false
//            };
//
//            $CORE.copy(userOptions, Options);
//
//            Atom.UI.Plugin.moveable(targetNode, null, Options);

            onDragStart = $CORE.makeMethod(onDragStart);


            targetNode[0].draggable = true;

            targetNode.listen("dragstart", fnOnDragStart);

            function fnOnDragStart(event) {
                if(onDragStart) {
                    onDragStart.apply(targetNode[0], arguments);
                }
            }
            return this;
        },

        "droppable": function(targetNode, onDropCallback, userOptions) {

            var Options =
            {
                onDragOver: null,
                onDragEnter: null,
                onDragLeave: null
            };

            targetNode.listen("drop", fnOnDrop);
            targetNode.listen("dragover", fnOnDragOver);
            targetNode.listen("dragenter", fnOnDragEnter);

            onDropCallback = $CORE.makeMethod(onDropCallback);

            Options.onDragOver =  $CORE.makeMethod(Options.onDragOver);
            Options.onDragLeave = $CORE.makeMethod(Options.onDragLeave);
            Options.onDragEnter = $CORE.makeMethod(Options.onDragEnter);

            return this;

            function fnOnDrop(event) {

                event.preventDefault();

                if(onDropCallback) {
                    onDropCallback.apply(targetNode[0],  arguments);
                }
            }

            function fnOnDragOver(event) {

                event.preventDefault();

                if(Options.onDragOver) {
                    Options.onDragOver.apply(targetNode[0], arguments);
                }
            }

            function fnOnDragEnter(event) {

                event.preventDefault();

                if(Options.onDragEnter) {
                    Options.onDragEnter.apply(targetNode[0], arguments);
                }
            }

            function fnOnDragLeave(event) {

                event.preventDefault();

                if(Options.onDragLeave) {
                    Options.onDragLeave.apply(targetNode[0], arguments);
                }
            }
        },

        "model": function(targetNode, createOptions) {
            var Options =
            {
                parent: $$$(document),
                opacity: 0.8,
                background: "black",
                top: null,
                left: null,

                className: "",
                id: "",
                exitByClick: true,
                exitByEscape: true
            };

            $$.extend(createOptions, Options);

            var shadowClass = "atom-shadow",
                canvasClassName = "atom-shadow-cover",
                contentClassName = "atom-shadow-content",
                escapeCode = 27,

                nextSibling = targetNode.prev(),
                parentElement = targetNode.parent(),

                nodeShadow = createElement2("div", "", shadowClass + Options.className),

                nodeShadowCover = createElement2("div", "", canvasClassName);

            // get bounding rectangle

            var clientRect = targetNode[0].getBoundingClientRect();

            nodeShadow.append(nodeShadowCover);
            nodeShadow.append(targetNode);

            Options.parent.append(nodeShadow);

            if(Options.left == null) {
                targetNode.css("left", clientRect.left);
            }
            else {
                targetNode.left(Options.left, nodeShadow);
            }

            if(Options.top == null) {
                targetNode.css("top", clientRect.top);
            }
            else {
                targetNode.top(Options.top, nodeShadow);
            }

            if(Options.exitByClick == true) {
                nodeShadowCover.listen("click", fnOnClickShadow, false);
            }

            if(Options.exitByEscape = true) {
                on(fnOnKeydownEscape, "keydown");
            }


            function fnOnClickShadow(event) {

                fnExitModel();
            }

            function fnOnKeydownEscape(event) {

                if(event.keyCode == escapeCode) {
                    fnExitModel();
                }
            }

            function fnExitModel() {
                if(nextSibling.hasNode()) {
                    nextSibling.before(targetNode);
                }
                else {
                    parentElement.append(targetNode);
                }

                nodeShadow.remove();
            }
        },

        "contextmenu": function(targetNode, items, varArg) {

            var Options =
            {
                "title": "menu",
                "onShowMenu": null,
                "onHideMenu": null,
                "className": "",
                "onClick": null,
                "onDblclick": null,

                "parent": Body
            },
                onClickCallback, createOptions;

            if(isFunction(varArg)) {
                onClickCallback = varArg;
            }
            else {
                createOptions = varArg;
                $$.extend(createOptions, Options);

                onClickCallback = Options.onClick;
            }
            var menuClass = "atom-menu ",
                menuTitleClass = "atom-menu-class",
                menuContentClass = "atom-menu-content",

                nodeMenu = createElement2("div", "", menuClass + Options.className),
                nodeMenuContent = createElement2("div", "", menuContentClass),
                nodeMenuTitle;


            // create menu

            if(Options.title) {
                nodeMenuTitle = createElement2("div", "", menuTitleClass);
                nodeMenu.append(nodeMenuTitle);
            }

            for(var iItem = 0; iItem < items.length; iItem++) {

                var itemText = items[iItem],
                    itemNode = createElement2("div", itemText);

                nodeMenuContent.append(itemNode);
            }

            nodeMenu.append(nodeMenuContent);


            targetNode.listen("contextmenu", fnOnContextMenu);

            // set coordinate

            function fnOnContextMenu(event) {

                var menuX = event.pageX,
                    menuY = event.pageY;

                Options.parent.append(nodeMenu);
                nodeMenu.css("left", menuX).css("top",menuY);

                nodeMenu.onClickBlur(fnOnClickBlur);
            }

            function fnOnClickBlur(event) {

                nodeMenu.remove();
            }
        }


    }
};