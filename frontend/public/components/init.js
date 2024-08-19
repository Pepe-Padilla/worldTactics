console.log("Inireaded");
document.addEventListener('DOMContentLoaded', function() {
    init.initGame();
}, false);

var init = {
    initGame: function() {
        console.log("Game INI");
        dimentions.init();

        var r = Rectangle(10,10,100,100);
        r.insertDOM();

        mainLoop.iteration();
    }
}
