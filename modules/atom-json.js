/**
 * @author shadow
 * @filename
 */

/** @class JSON */
var MODULE =
{
    manifest: {
        name: "JSON"
    },

    scope: {
        onInit: function() {

            // expose jsonParser to window

            window.JSONParser = $keeper.component.JSONParser;

            if($_handyMode == true) {
                window.jsoner = $keeper.component.JSONParser;
            }
        },
        entry: function() {

        },

        alias: {
            "encode": "encodeJSON",
            "decode": "decodeJSON"
        }
    },

    members: {

        encodeJSON: function(object) {

            // get component
            var JSONParser = $keeper.component.JSONParser;

            var encodeResult;

            // call component api
            encodeResult = JSONParser.encode(object);

            return encodeResult;
        },

        decodeJSON: function(string) {

            // get parser component
            var JSONParser = $keeper.component.JSONParser;

            var decodeResult;

            // use JSONParser.decode()
            decodeResult = JSONParser.decode(string);

            return decodeResult;
        }
    },
    keep: {

        component: {
            JSONParser:
            {
                useHasOwn : ({}.hasOwnProperty ? true : false),

                pad : function(n) {
                    return n < 10 ? "0" + n : n;
                },

                m : {
                    "\b": '\\b',
                    "\t": '\\t',
                    "\n": '\\n',
                    "\f": '\\f',
                    "\r": '\\r',
                    '"' : '\\"',
                    "\\": '\\\\'
                },
                encodeString : function(s){
                    if (/["\\\x00-\x1f]/.test(s)) {

                        return '"' + s.replace(/([\x00-\x1f\\"])/g, function(a, b) {

                            var c = $keeper.component.JSONParser.m[b];
                            if(c){
                                return c;
                            }

                            c = b.charCodeAt();

                            return "\\u00" +
                                Math.floor(c / 16).toString(16) +
                                (c % 16).toString(16);
                        }) + '"';
                    }

                    return '"' + s + '"';
                },

                encodeArray : function(o){
                    var a = ["["], b, i, l = o.length, v;

                    for (i = 0; i < l; i += 1) {
                        v = o[i];

                        switch (typeof v) {
                            case "undefined":
                            case "function":
                            case "unknown":

                                break;

                            default:

                                if (b) {
                                    a.push(',');
                                }

                                a.push(v === null ? "null" : this.encode(v));
                                b = true;
                        }
                    }

                    a.push("]");

                    return a.join("");
                },

                encodeDate : function(o){

                    return '"' + o.getFullYear() + "-" +

                        pad(o.getMonth() + 1) + "-" +
                        pad(o.getDate()) + "T" +
                        pad(o.getHours()) + ":" +
                        pad(o.getMinutes()) + ":" +
                        pad(o.getSeconds()) + '"';
                },

                encode : function(o) {

                    if(typeof o == "undefined" || o === null){
                        return "null";
                    }
                    else if(o instanceof Array){
                        return this.encodeArray(o);
                    }
                    else if(o instanceof Date){
                        return this.encodeDate(o);
                    }
                    else if(typeof o == "string"){
                        return this.encodeString(o);
                    }
                    else if(typeof o == "number"){
                        return isFinite(o) ? String(o) : "null";
                    }
                    else if(typeof o == "boolean"){
                        return String(o);
                    }
                    else {
                        var self = this;
                        var a = ["{"], b, i, v;

                        for (i in o) {
                            if(!this.useHasOwn || o.hasOwnProperty(i)) {
                                v = o[i];
                                switch (typeof v) {
                                    case "undefined":
                                    case "function":
                                    case "unknown":
                                        break;
                                    default:

                                        if(b){
                                            a.push(',');
                                        }

                                        a.push(self.encode(i), ":",
                                            v === null ? "null" : self.encode(v));
                                        b = true;
                                }
                            }
                        }

                        a.push("}");
                        return a.join("");
                    }
                },

                decode : function(json){
                    return eval("(" + json + ')');
                }
            }
        }
    }
}
