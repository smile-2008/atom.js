/**
 * @author shadow
 * @filename
 */

/** @class NameSpace */
var MODULE =
{
    manifest: {
        name: "Namespace",
        author: "shadow"
    },

    scope: {

        entry: function() {

        },

        alias: {
            "alias": "addAlias",
            "global": "addGlobal",
            "keyNames": "getKeyNames"
        }
    },

    members: {

        /** @memberof Namespace
         *  @desc add alias name for an object
         *  @param aliasMap a map contains alias name and correspond member name
         *  @param sourceObject the input object
         *  @param targetObject the target object to be add alias, default source object
         *  @return the target object*/
        addAlias: function(aliasMap, sourceObject, targetObject) {

            // set default source object is window
            sourceObject = sourceObject || window;

            targetObject = targetObject || sourceObject;

            // iterate alias map

            for(var aliasName in aliasMap) {

                var memberName = aliasMap[aliasName];

                // add alias
                targetObject[aliasName] = sourceObject[memberName];
            }

            return targetObject;
        },

        /** @memberof Namespace
         *  @desc add some members to window
         *  @param source the input source
         *  @param memberName the member's name in window
         *  @return window */

        addGlobal: function(source, memberName) {

            var sourceType = typeof(source);

            var nameType = typeof(memberName);

            if(sourceType == "function") {
                memberName = memberName || source.name;
            }
            else if(sourceType == "object") {

                // check memberName, if is an array, copy members in source, if is an object,
                // the value is member name in source, the key is member name in window

                var aliasName, curName;

                if(memberName instanceof Array) {

                    for(var iName = 0; iName < memberName.length; iName++) {
                        curName = memberName[iName];

                        window[curName] = source[curName];
                    }
                }
                else if(nameType == "object") {

                    for(aliasName in memberName) {
                        curName = memberName[aliasName];

                        window[aliasName] = source[curName];
                    }
                }
                else if(nameType == "string") {
                    window[memberName] = source;
                }
            }

            return window;
        },
         /** @memberof Namespace
         *  @desc get key names from an object
         *  @param object the input object
         *  @param typeFilter indicate which type will be return
         *  @param limitCount set the name list's  max length
         *  @return the key name list*/


        getKeyNames: function(objects, typeFilter, limitCount) {

             // set default arguments

             limitCount = limitCount || 9999;
             typeFilter = typeFilter || null;

             var counter = 0;

             // create an array save keys
             var nameList = new Array();

             // if objects not array, convert to array
             if(!(objects instanceof Array)) {
                 objects = [objects];
             }

             for(var iObj = 0; iObj < objects.length; iObj++) {

                 var object = objects[iObj];

                 for(var keyName in object) {

                     // if type filter is set, check type
                     if(typeFilter !== null) {

                         var value = object[keyName];

                         if(typeof(value) !== typeFilter) {
                             continue;
                         }
                     }

                     // if current length in list large than limit, break loop
                     if(counter >= limitCount) {
                         break;
                     }

                     nameList.push(keyName);
                     counter++;
                 }
             }

             return nameList;

        }
      }
};
