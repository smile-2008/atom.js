/**
 * Created by programmer on 14-4-2.
 */

var MODULE = {

    manifest: {
        name: "basic",

        type: "ui"
    },

    scope: {

        entry: function($module, options, $, _) {

            var UIClass = {

                "Button": function(text) {

                    var btnText = _("button").html(text);

                    $("body").append(btnText);
                }
            };

            return UIClass;
        }
    }
};