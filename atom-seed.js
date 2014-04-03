/*
 @lisence VOID 2004
 created by Shadow
 atom.js is a little things for our web world, This is seed, although small but basic

 create note:

 - follow organazation， i wish every elements has somethings ,such as id, class, parent
 - in accroding to flexible， so framework could be smaller, or other forms
 - use sandbox mode, That global space maybe vivid
 - we need a debuger, it runs in browser
 - for public, create a document use jsdoc, taking the code format.
 */

/**
 * @author shadow
 * @copyright VOID 2004-
 * @version 1.0
 */

/** @progress load */

if(AtomConfig.debugMode == true) {

    debuger.listenError(function(error) {
        var message;

        // the argument1 error maybe not Error, that user throw
        if(error instanceof ErrorEvent) {
            message = error.message;
        }
        else {
            message = error;
        }

        // call print()
        debuger.print(message, 'error');

        return true;
    });

    debuger.tryCatch(
        function() {
            new AtomCreator().create();
        });
}
else {
    new AtomCreator().create();
}
/** @class AtomModule */

function AtomModule(moduleName) {

    this.name = moduleName;
}

/** @class AtomCreator */
function AtomCreator() {

    this.create = function(configObject) {

        var buildResult;

        /** @step create keeper */

        window.$keeper = new AtomKeeper();

        window.$modules = $keeper.modules;
        window.$COM = $keeper.component;

        /* if handy mode enabled, expose some variation */

        if(AtomConfig.handyMode == true) {
            window.$list = $keeper.list;
            window.$map = $keeper.map;
            window.$api = $keeper.api;
        }

        $_handyMode = AtomConfig.handyMode;

        /** @step create seed */

        var seedObj;

        seedObj = new Seed();

        // expose $seed
        window.$seed = seedObj;

        // create atom loader

        window.$loader = new AtomLoader();

        $loader.onModuleLoaded(function() {

            this.moduleLoadedCount++;

            //debuger.print("module loaded.");

            if(this.moduleTotalCount == this.moduleLoadedCount && !Atom.loaded) {

                $loader.emitEvent("atomLoaded");
                Atom.loaded = true;
            }
        });

        $loader.onAtomLoaded(function() {

            if(AtomConfig.debugMode == true) {
                debuger.print("ATOM already.");
            }
        })

        // add variation from $loader

        window.onAtom = window.onAtomLoaded = $loader.onAtomLoaded;
        window.onModule = window.onModuleLoaded = $loader.onModuleLoaded;

        /* load atom's module */
        seedObj.loadModule("core");

        return buildResult;
    }
}

/** @class  */

function AtomKeeper() {

    return {
        /**
         * @memberof AtomKeeper */
        list: {},
        /**
         * @memberof AtomKeeper
         */
        map: {},

        /**
         * @memberof AtomKeeper
         */
        api: {},

        /**
         * @memberof AtomKeeper
         */
        modules: {},

        /**
         * @memberof AtomKeeper
         */
        component: {},
        /**
         * @memerof AtomKeeper
         */
        pit: {},
        /**
         * @memberof AtomKeeper
         * @param memberAPI
         * @param optionName
         * @returns {*}
         */
        addAPI: function(memberAPI, optionName) {

            // set api's name
            optionName = optionName || memberAPI.name;

            // add api to Keeper
            this.api[optionName] = memberAPI;

            return this;
        }
    };
}

/** @class AtomLoader */

function AtomLoader() {

    var atomHandlers = {
        atomLoaded: [],
        moduleLoaded: {
            all: []
        },
        beforeModuleLoaded: {
            all: []
        }
    };

    var _thisLoader = this;

    var moduleNameList = [];

    return {
        moduleLoadedCount: 0,
        moduleTotalCount: 0,
        registerModule: function(manifest) {

            var moduleName = manifest.name.toLowerCase();

            if(moduleNameList.indexOf(moduleName) == -1) {

                moduleNameList.push(moduleName);
                this.moduleTotalCount++;
            }

            // check module dependence
            var dependence;

            dependence = manifest.dependence;

            var iModule;

            if(dependence instanceof Array) {
                for(iModule = 0; iModule <dependence.length; iModule++) {

                    moduleName = dependence[iModule];

                    if(moduleNameList.indexOf(moduleName) == -1) {

                        moduleNameList.push(moduleName);
                        this.moduleTotalCount++;
                    }
                }
            }

            // count appendence
            var appendence = manifest.appendence;

            if(appendence instanceof Array) {
                for(iModule = 0; iModule < appendence.length; iModule++) {

                    moduleName = appendence[iModule];

                    if(moduleNameList.indexOf(moduleName) == -1) {

                        moduleNameList.push(moduleName);
                        this.moduleTotalCount++;
                    }
                }
            }
        },
        onAtomLoaded: function(handler) {

            atomHandlers["atomLoaded"].push(handler);

            return this;
        },
        onModuleLoaded: function(handler, moduleName) {

            moduleName = moduleName || "all";

            atomHandlers["moduleLoaded"][moduleName].push(handler);

            return this;
        },
        emitEvent: function(eventName, arg1, userArguments) {

            var handlerList;

            if(eventName == "moduleLoaded" || eventName == "beforeModuleLoaded") {

                var moduleName = arg1;

                // default direct to all modules

                var atomHandler = atomHandlers[eventName]["all"] || [];
                var moduleHandler = atomHandlers[eventName][moduleName] || [];

                handlerList = atomHandler.concat(moduleHandler);
            }
            else {
                handlerList = atomHandlers[eventName];
            }

            // iterate handlers

            if(handlerList instanceof Array) {
                for(var iHandler = 0; iHandler < handlerList.length; iHandler++) {

                    var curHandler = handlerList[iHandler];

                    // execute handler
                    curHandler.apply(this, userArguments);
                }
            }

            return true;
        }
    }
}
/** @class */
function Seed() {

    /**
     *
     * @type {{}}
     */
    var RegisteredModules = {};

    return {
        /**
         * @param scriptURL URL to which the request is made
         * @param useAjax if useAjax not equal true, use <script> tag instead
         * @memberof Seed
         * */
        loadScript: function(scriptURL, useRequest, onScriptLoad) {

            if(useRequest == true) {

                // use XMLHttpRequest

                var xmlHttp = new XMLHttpRequest();

                xmlHttp.open("GET", scriptURL, false);
                xmlHttp.send();

                // get script code
                var scriptContent = xmlHttp.responseText;

                // evaluate code
                window.eval(scriptContent);

                if(onScriptLoad) {
                    onScriptLoad();
                }
            }
            else {

                /** @branch use <script> tag */

                var headElement, scriptNode;

                // call document.getElementsByTagName
                headElement = document.getElementsByTagName("head")[0];

                // create element use document.createElment() api
                scriptNode = document.createElement("script");

                // set 'src' property
                scriptNode.src = scriptURL;

                // add listener for onload
                scriptNode.onload = onScriptLoad;

                // get seed script node, then append node

                var seedScript = document.querySelector("#atom-seed");

                if(seedScript) {
                    headElement.insertBefore(seedScript, scriptNode);
                }
                else {
                    headElement.appendChild(scriptNode);
                }
            }
        },
        /**
         * @param moduleName  a name for module
         * @param moduleFolder a folder contain module
         * @memberof Seed
         */
        loadModule: function(moduleName, userOptions) {

            var loadResult;

            var defaultModulesMap, modulesMap,  moduleURL;
            var moduleFolder, defaultFolder;

            var optionName, optionValue;

            var options, defOptions = AtomModulesOption[moduleName];

            if(defOptions) {

                if(userOptions && typeof(userOptions) == "object") {

                    for(optionName in userOptions) {

                        optionValue = userOptions[optionName];

                        defOptions[optionName] = optionValue;
                    }
                }
            }
            else {
                defOptions = userOptions || {};
            }

            options = defOptions;

            if(options == "ui" || options.type == "ui") {
                defaultModulesMap = AtomUIModulesMap;
                defaultFolder = SeedConfig["atomUIModulesFolder"];
            }
            else {
                defaultModulesMap = AtomModulesMap;
                defaultFolder = SeedConfig["atomModulesFolder"];
            }

            // check atom's modulesMap

            modulesMap = options.modulesMap || defaultModulesMap;

            moduleURL = modulesMap[moduleName];

            /* atom's modules folder in '/module/'*/
            if(moduleURL) {

                // get atom module option
                options = options || AtomModulesOption[moduleName] || {};

                moduleFolder = options.folder || defaultFolder;
            }

            /* if the request module not in module's map, maybe user's module, first get folder
             */
            moduleFolder = moduleFolder || SeedConfig["userModulesFolder"];

            // join two string
            moduleURL = moduleFolder + moduleURL;

            /**@step check dependence **/
            var loadHandle;
            var dependence = options.dependence || [];

            if(typeof(dependence) == "string") {
                dependence = [dependence];
            }

            if(dependence.length > 0) {
                loadHandle = setInterval($f_loadModule_inner, 0);

                loadResult = 0;
            }
            else {
                loadResult = this.loadScript(moduleURL, AtomConfig.useRequest, $OnScriptLoad);
            }

            return loadResult;

            /** desc: $f_loadModule_inner */

            function $f_loadModule_inner() {

                // check the depend module is loaded
                for(var iModule = 0; iModule < dependence.length; iModule++) {

                    var dependModuleName = dependence[iModule];

                    if(! $keeper.modules[dependModuleName]) {
                        return;
                    }
                }
                // call loadScript() that in current instance
                $seed.loadScript(moduleURL, AtomConfig.useRequest, $OnScriptLoad);

                clearInterval(loadHandle);
            }
        },
        /**
         * @memberof Seed
         * @param moduleList storage module's name
         * @param moduleFolder indicate module folder
         * @desc load multiple modules
         */
        loadModules: function(modulesList, moduleFolder) {

            // if modulesList not define, return false
            if(! modulesList) {
                return false;
            }

            var moduleName;

            // if  modulesList isn't Array, direct call loadModule()
            if(typeof(modulesList) == "string") {
                return this.loadModule(moduleName, moduleFolder);
            }

            for(var iName = 0; iName < modulesList.length; iName++) {

                moduleName = modulesList[iName];

                // call loadModule()
                this.loadModule(moduleName, moduleFolder);
            }
        }

    };

    /**
     * @memberof Seed
     */
    function $OnScriptLoad(e) {

        /** @step new module process */

        /** @substep register module */

        var manifest, scope, members, Class;
        var keep;
        var options, exportMode;

        manifest = MODULE.manifest;
        scope = MODULE.scope;
        members = MODULE.members || {};

        Class = MODULE.Class;
        keep = MODULE.keep;

        // the options use entry()
        options = MODULE.options || {};

        exportMode = manifest.exportMode || "all-members";

        // add module
        var moduleName = manifest.name;

        if($keeper.modules[moduleName]) {
            return;
        }

        $loader.registerModule(manifest);

        var module = new AtomModule(moduleName);

        $keeper.modules[moduleName] = module;

        // get config
        module.config = scope.config || {};

        // export module
        var exportModule = manifest.exportModule;

        if(typeof(exportModule) == "undefined") {
            exportModule = SeedConfig.exportModule;
        }

        if(exportModule == true) {
            window["$" + moduleName] = module;
        }

        /** @substep  exports method and class  */

        // check alias

        var alias = scope.alias;

        if(alias) {
            // copy alias to members
            for(var aliasName in alias) {
                var methodName = alias[aliasName];

                members[aliasName] = members[methodName];
            }
        }

        // check handyAlias
        var handyAlias = scope.handyAlias;

        if(handyAlias && (AtomConfig.handyMode == true)) {

            // copy alias to members, if on handyMode
            for(aliasName in handyAlias) {
                methodName = handyAlias[aliasName];

                members[aliasName] = members[methodName];
            }
        }

        // set export target

        var exportTarget = manifest.exportTarget || window;

        for(var kName in members) {
            var curMethod = members[kName];

            // save to current module
            module[kName] = curMethod;

            var needExport = false;

            // check export mode
            if(exportMode == "all-members") {
                needExport = true;
            }
            else if(exportMode == "export") {

                if(manifest.exports.indexOf(kName) !== -1) {
                    needExport = true;
                }
            }
            else if(exportMode == "ignore") {
                if(manifest.ignore.indexOf(kName) === -1) {
                    needExport = true;
                }
            }

            if(needExport == true) {
                exportTarget[kName] = curMethod;
            }
        }

        // export class
        if(manifest.exportClass !== false) {

            // module has class
            if(Class) {
                for(var kClass in Class) {

                    var curClass = Class[kClass];

                    // add Class to target and module

                    exportTarget[kClass] = curClass;
                    module[kClass] = curClass;
                }
            }
        }

        // copy keep from module
        if(keep) {
            for(var kKeep in keep) {

                var curKeep = keep[kKeep];

                // copy members
                for(var kMember in curKeep) {

                    var curMember = curKeep[kMember];

                    $keeper[kKeep][kMember] = curMember;
                }
            }
        }

        /** @substep check dependence and preprocess */

        if(scope.onInit) {
            scope.onInit();
        }

        var dependence = manifest.dependence;

        if(dependence) {

            // load dependence library
            for(var iName = 0; iName < dependence.length; iName++) {
                var curDependence;

                curDependence = dependence[iName];

                $seed.loadModule(curDependence);
            }
        }

        /** @substep enter entry! */

        var callArgs, entryResult;

        if(manifest.type == "ui") {
            callArgs = [module, options,  $Selector.AtomSelector, $HTMLCreator.createElement];
        }
        else {
            callArgs = [module, options];
        }

        entryResult = scope.entry.apply(null, callArgs);

        /** @substep load appendence */

        $seed.loadModules(manifest.appendence);

        /** @substep finshed work */
        if(scope.onFinished) {
            scope.onFinished();
        }

        if(manifest.type == "ui") {
            $CORE.copy(entryResult, module);
            $CORE.copy(entryResult, exportTarget);
        }
        /** @step log info */
        // get javasript file's name

//        var jsFilename;
//
//        jsFilename = e.currentTarget.src;

        // prepare text to print
        var printTxt;

        var printTxt = manifest.name + " Module loaded!!";

        if(AtomConfig.debugMode == true) {
            debuger.print(printTxt, "module-loaded");
        }

        // notice atom loader

        $loader.emitEvent("moduleLoaded", moduleName, [module]);

    }
}