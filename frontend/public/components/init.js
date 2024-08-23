console.log("Inireaded");
document.addEventListener('DOMContentLoaded', function() {
    init.initGame();
}, false);

var init = {
    initGame: function() {
        console.log("Game INI");
        ajax.ajaxRequest("http://localhost/kira");
        mapController.createTiles();
        keyboard.init();
        gamepad.init();
        mainLoop.iteration();
    },
}
