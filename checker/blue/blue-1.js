/**
 * @author shadow
 * @filename
 */

onAtom(function() {
    bind(function() {
        // create container

        nContainer =  $html.div("", "module-container").depend();

        // creator module square
        eachIterate($modules, function($module, moduleName) {
            var nModuleSquare = div(moduleName, "module-square");

            nContainer.append(nModuleSquare);

            // add counter node

            var countOfModule = $module.memberCount || $CORE.countOf($module);

            var counterDIV = div(countOfModule, "module-counter");

            counterDIV.css({
                "fontSize": "xx-large",
                "lineHeight": "128px",
                "color": "white"
            });
            nModuleSquare.append(counterDIV);

            // set background color
            nModuleSquare.hue16();
        }, 1, 1);
    });
});