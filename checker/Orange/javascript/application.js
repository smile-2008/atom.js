/**
 * @author shadow
 * @filename application.js
 * @desc this is application main entry way, primary operation in here.
 * @date 2004
 * @licence void
 * @author black-code
 */

// add onload event listener
window.addEventListener("load", onAppLoad);

// set application entry point

$(document).ready(appMain);

onAtom(atomMain);

/**
 * application main entry function
 */
function appMain() {


}

/**
 * application entry for Atom
 */

function atomMain() {

    dlg1 = new Dialog("Hey, Dialog 1.");

    dlg2 = new Dialog("Hey, Dialog 2.");
}