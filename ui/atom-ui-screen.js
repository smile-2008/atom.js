/**
 * Created by shadow
 * @filename
 */

var MODULE =
{
    options: {

    },
    manifest: {
        name: "ui-screen",
        type: "ui",

        complexUI: ["Screen"]
    },
    scope: {

        entry: function($module, options, $, _) {

            var CLASS =
            {

                "Screen": function(argScreenItems, createOptions) {

                    var _the = this, Options =
                    {
                        parent: $$("html"),

                        className: "",
                        id: "",
                        enableDrop: true,

                        defaultIndex: 0
                    };

                    var screenClassName = "aui-screen",

                        screenBoxClassName = "aui-screen-box",

                        screenTitleClassName = "aui-screen-title",
                        currentPageClassName = "aui-current-page",
                        holdNodeClassName = "aui-screen-hold-node",

                        transferClassName = "aui-screen-transfer-node",

                        nodeScreen, nodeScreenBox, nodeScreenTitle, screenItems = [],

                        nodeLastPage,
                        curPageIndex;

                    var prototype =
                    {
                        _create: function() {

                            nodeScreen = _("div", "", screenClassName + Options.className, Options.id),
                                nodeScreenTitle = _("div", "", screenTitleClassName),
                                nodeScreenBox = _("div", "", screenBoxClassName);

                            nodeScreen.append(nodeScreenTitle).append(nodeScreenBox);
                            Options.parent.append(nodeScreen);

                            argScreenItems = argScreenItems || [{holdNode: $$(document)}, null];

                            // add screen items

                            for(var iItem = 0; iItem < argScreenItems.length; iItem++) {

                                var item = argScreenItems[iItem];

                                _the.addScreen(item);
                            }

                            nodeScreenTitle.listen("click", _the.__onClick_screenTitle, true);

                            // enable Drop

                            if(Options.enableDrop == true) {

                                var dropOptions =
                                {
                                    tagFilter: "SPAN"
                                };

                                nodeScreenTitle.droppable(_the.__onDrop_screenTitle, dropOptions);
                            }
                        },

                        __onClick_screenTitle: function(event) {

                            var target = event.target,

                                pageIndex = target._pageIndex;

                            if(target.tagName == "SPAN") {
                                _the.setPage(pageIndex, screenItems[pageIndex]);
                            }
                        },

                        __onDrop_screenTitle: function(event) {

                            var target = event.target,

                                pageIndex = target._pageIndex,

                                dragNodeClassName = "aui-drag-node";

                            if(_the.getPageIndex() == pageIndex) {
                                return;
                            }

                             var item = screenItems[pageIndex],
                                 clientRect = target.getBoundingClientRect(),
                                 target = $$(target),
                                 selectPage,

                                 transferNode = $$(dragNodeClassName);

                            if(item.holdNode) {
                                selectPage = item.holdNode;
                            }
                            else {
                                selectPage = nodeScreenBox.children(pageIndex);
                            }

                            selectPage.append(transferNode);
                            target.addClass(transferClassName);

                            // set coordinate

                            target.css(
                                {
                                    "left": clientRect.left,
                                    "top": clientRect.top
                                });
                        },
                        setPage: function(pageIndex, item) {

                            if(nodeLastPage) {
                                nodeLastPage.removeClass(currentPageClassName);
                            }

                            if(item.holdNode) {
                                nodeLastPage = item.holdNode;
                            }
                            else {
                                nodeLastPage = nodeScreenBox.children(pageIndex);
                            }

                            nodeLastPage.addClass(currentPageClassName);

                            curPageIndex = pageIndex;
                        },

                        getPageIndex: function() {

                            return curPageIndex;
                        },
                        addScreen: function(item, addOptions) {

                            var content, title, itemIndex, nodeTitle, nodePage;

                            if(item == null) {
                                content = "";
                                item = {};
                            }
                            else if(item.content) {
                                content = item.content;

                                item =
                                {
                                    content: content
                                };
                            }
                            else {
                                content = item;
                            }

                            itemIndex = screenItems.length;
                            item.itemIndex = itemIndex;

                            if(item.title == null) {

                                item.title = itemIndex;
                            }

                            title = item.title;

                            nodeTitle = _("span", title, item.className, item.id);
                            nodePage = _("div", "", item.className);

                            nodeTitle[0]._pageIndex = itemIndex;
                            nodePage[0]._pageIndex = itemIndex;

                            if(! item.holdNode) {
                                nodePage.append(content);
                            }
                            else {
                                item.holdNode.addClass(holdNodeClassName);
                            }

                            if(itemIndex == Options.defaultIndex) {
                                _the.setPage(itemIndex, item);
                            }
                            nodeScreenTitle.append(nodeTitle);
                            nodeScreenBox.append(nodePage);

                            screenItems.push(item);
                        }
                    };

                    copy(prototype, _the);

                    return this;
                }
            };

            return CLASS;
        }
    },

    members: {

    }
};