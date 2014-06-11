/**
 * Created by programmer on 14-4-2.
 */

var MODULE = {

    manifest: {
        name: "ui-basic",

        type: "ui",
        appendence: ["ui-plugin","ui-dialog", "ui-screen"]
    },

    scope: {

        onInit: function() {

            Atom.UI =
            {
                Plugin: {},

                Vars: {}
            };
        },

        entry: function($module, options, $, _) {

            var UIClass = {

                "Button": function(text) {

                    var btnText = _("button").html(text);

                    $("body").append(btnText);
                }
            };

            return UIClass;
        }
    },

    keep: {

        api: {

            convertUIConstructors: function(UIList, complexList) {

                if(complexList.length > 0) {

                    $Iterator.map(UIList, function(constructor, UID) {

                        var convertResult;

                        if(complexList.indexOf(UID) !== -1) {
                            convertResult =  $keeper.api.createComplexUIConstructor(constructor);
                        }
                        else {
                            convertResult = constructor;
                        }

                        Atom.UI[UID] = convertResult;

                        return convertResult;
                    });
                }
            },
            createComplexUIConstructor: function(originalConstructor) {


                return ComplexUIConstructor;

                /** @class */

                function ComplexUIConstructor() {

                    var originalUI = this;

                    originalConstructor.apply(originalUI, arguments);

                    originalUI._create();
                }
            }
        }
    }
};