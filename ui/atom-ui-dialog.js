/**
 * Created by shadow
 * @filename
 */

var MODULE =
{
    options: {
        classDialog: "aui-dialog ",
        dialogIndex: 7000
    },
    manifest: {
        name: "ui-dialog",
        type: "ui",
        complexUI: ["Dialog"],

        css: ["atom-ui-dialog.css"]
    },
    scope: {

        entry: function($module, options, $, _) {

            // variations

            var __vars = Atom.UI.Vars;

            var CLASS =
            {
                "Dialog": function(content, createOptions) {

                    var _the = this,

                        content = content || "empty",
                        classDialog = options.classDialog,
                        nodeDlgRoot, nodeDlgTitle, nodeDlgIcon, nodeDlgTitleContent, nodeDlgContent,

                        isIconMode ,isDlgShow;

                        Options =
                        {
                            className: "",

                            titleClass: "aui-dialog-title",
                            contentClass: "aui-dialog-content",
                            iconClass: "aui-dialog-icon",
                            "titleIconClass": "aui-dialog-icon-mode",

                            titleText: "dialog",

                            left: 0,
                            top: 0,
                            width: 600,
                            height: 400,
                            position: "absolute",
                            zIndex: 1,
                            color: "black",

                            enableMove: true,
                            isShow: true,
                            isIcon: false,

                            parentNode: $$("body")
                        };

                    $CORE.copy(createOptions, Options);

                    var prototype =
                    {
                        _create: function() {

                            classDialog += Options.className;
                            nodeDlgRoot = _("div").addClass(classDialog);

                            _the.node = nodeDlgRoot;


                            // create title box
                            nodeDlgTitle = _("div").addClass(Options.titleClass);

                            nodeDlgTitleContent = _("div").append(Options.titleText);
                            nodeDlgTitle.append(nodeDlgTitleContent);

                            nodeDlgIcon = _("span").addClass(Options.iconClass);
                            nodeDlgTitle.append(nodeDlgIcon);

                            // create content box

                            nodeDlgContent = _("div").addClass(Options.contentClass).append(content);
                            _the._nodeContent = nodeDlgContent;

                            nodeDlgRoot.append(nodeDlgTitle).append(nodeDlgContent);

                            Options.parentNode.append(nodeDlgRoot);

                            // set position and x,y

                            if(Options.color) {

                                nodeDlgTitle.css("background", Options.color);
                            }

                            nodeDlgRoot
                                .css("position", Options.position)
                                .css("left", Options.left)
                                .css("top", Options.top)

                            nodeDlgContent
                                .css("width",Options.width)
                                .css("height", Options.height);

                            // enable move

                            if(Options.enableMove === true) {

                                Atom.UI.Plugin.moveable(nodeDlgTitle, nodeDlgRoot);
                            }

                            // add event listener

                            nodeDlgRoot.listen("mousedown", _the.__onClick_zIndex, true)
                            nodeDlgTitle.listen("dblclick", _the.__onDblclick_toggleIcon, true);

                            // show or hide

                            _the.toggle(true, Options.isIcon);
                            _the.toggle(false, Options.isShow);
                        }
                        ,
                        __onClick_zIndex: function(event) {

                            var nodeDlg, prevDlg;

                            nodeDlg = this;

                            nodeDlg.style.zIndex = options.dialogIndex + 2;

                            // restore previous dlg

                            prevDlg = Atom.UI.Vars.focusDlg;

                            if(prevDlg) {
                                prevDlg.style.zIndex = options.dialogIndex + 1;
                            }

                            Atom.UI.Vars.focusDlg = nodeDlg;
                        },

                        __onDblclick_toggleIcon: function(event) {
                            _the.toggle(true, !isIconMode);

                        },

                        getNode: function() {

                            return nodeDlgRoot;
                        },

                        setCoordinate: function(leftValue, topValue) {

                            if(leftValue != null) {
                                nodeDlgRoot.css("left", leftValue);
                            }

                            if(topValue != null) {
                                nodeDlgRoot.css("top", topValue);
                            }

                            return nodeDlgRoot;
                        },
                        append: function(content) {

                            nodeDlgContent.append(content);

                            return _the;
                        },

                        show: function(iconMode) {

                            if(iconMode == true) {
                                nodeDlgIcon.hide();

                                nodeDlgRoot.removeClass(Options.titleIconClass);
                                nodeDlgTitleContent.show();
                                nodeDlgContent.show();

                                isIconMode = false;
                            }
                            else {
                                nodeDlgRoot.show();
                                isDlgShow = true;
                            }

                            return _the;
                        },

                        hide: function(iconMode) {

                            if(iconMode == true) {
                                nodeDlgIcon.show();

                                nodeDlgRoot.addClass(Options.titleIconClass);
                                nodeDlgTitleContent.hide();
                                nodeDlgContent.hide();

                                isIconMode = true;
                            }
                            else {
                                nodeDlgRoot.hide();
                                isDlgShow = false;
                            }

                            return _the;
                        },

                        toggle: function(iconMode, forceValue) {

                            var modeValue;

                            if(iconMode == true) {

                                modeValue = ! isIconMode;
                                if(forceValue != null) {
                                    modeValue = forceValue;
                                }

                                if(modeValue == true) {
                                    _the.hide(true);
                                }
                                else {
                                    _the.show(true);
                                }
                            }
                            else {

                                modeValue = ! isDlgShow;
                                if(forceValue != null) {
                                    modeValue = forceValue;
                                }

                                if(modeValue == true) {
                                    _the.show(false);
                                }
                                else {
                                    _the.hide(false);
                                }
                            }

                            return _the;
                        }
                    };

                    copy(prototype, _the);
                }


            };

            return CLASS;
        }
    },

    members: {

    }
};