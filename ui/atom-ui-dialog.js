/**
 * Created by shadow
 * @filename
 */

var MODULE =
{
    options: {
        classDialog: "aui-dialog "
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
                        nodeDlgRoot, nodeDlgTitle, nodeDlgContent;

                        Options =
                        {
                            className: "",

                            titleClass: "aui-dialog-title",
                            contentClass: "aui-dialog-content",

                            titleText: "dialog",

                            left: 0,
                            top: 0,
                            position: "absolute",
                            zIndex: 1,

                            enableMove: true,

                            parentNode: $("body")
                        };

                    $CORE.copy(createOptions, Options);

                    var prototype =
                    {
                        _create: function() {

                            classDialog += Options.className;
                            nodeDlgRoot = _("div").addClass(classDialog);

                            // create title box
                            nodeDlgTitle = _("div").addClass(Options.titleClass).html(Options.titleText);

                            // create content box

                            nodeDlgContent = _("div").addClass(Options.contentClass).html(content);

                            nodeDlgRoot.append(nodeDlgTitle).append(nodeDlgContent);

                            Options.parentNode.append(nodeDlgRoot);

                            // set position and x,y

                            nodeDlgRoot
                                .css("position", Options.position)
                                .css("left", Options.left)
                                .css("top", Options.top);

                            // enable move

                            if(Options.enableMove === true) {

                                Atom.UI.Plugin.enableMove(nodeDlgTitle, nodeDlgRoot);
                            }

                            //
                            nodeDlgRoot.listen("mousedown", this.__onClick_zIndex, true);
                        }
                        ,
                        __onClick_zIndex: function(event) {

                            var nodeDlg, prevDlg;

                            nodeDlg = this;

                            nodeDlg.style.zIndex = 2;

                            // restore previous dlg

                            prevDlg = Atom.UI.Vars.focusDlg;

                            if(prevDlg) {
                                prevDlg.style.zIndex = 1;
                            }

                            Atom.UI.Vars.focusDlg = nodeDlg;
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