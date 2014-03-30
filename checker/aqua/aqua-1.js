/* 2/7/14
* file: aqua-1.js
*
* */

addEventListener("load", function() {

    debuger.print("I am GOD");

    // occur an error

    window.on("die", function(string) {
        string = string || "am i died ?"

        debuger.print(string);
    });
});
