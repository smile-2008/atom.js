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


	// UI Dialog
    dlg1 = new Dialog("Hey, Dialog 1.I have a block can move. and dlg3 in the screen 1 that can enter. in the end, right click your mouse", 
    	{
    		"color": "green",
    		"left": 100,
    		"top": 24,
    		"titleText": "please dblclick me!"
    	}
    	);
    dlg2 = new Dialog("Hey, Dialog 2. ", 
    	{
    		"color": "yellow",
    		
    	});

    dlg3 = new Dialog();
    dlg2.toggle(true);

    // moveable Plugin
    block = div("Drag me or dblclick me!").shape().moveable().bg("purple").dblclick("$$(this).hue16()");
    dlg1.append(block);

    // contextMenu plugin

    $$("html").contextMenu(
    	["sunny day!", "good night.", "add a square!"],
    	function(e, item, index) {

    		if(item.id == 2) {

    			$$("body").append(div("").shape().moveable().bg16().xy(randInt(innerWidth - 240), randInt(innerHeight -240)));
    		}
    	});

    	// Screen Plugin
	screen1 = new Screen(
		[ {holdNode: $$$(document)}, dlg3.node]
		);
}