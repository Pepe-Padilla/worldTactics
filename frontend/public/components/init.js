console.log("Inireaded");
document.addEventListener('DOMContentLoaded', function() {
    init.initGame();
}, false);

var init = {
    initGame: function() {
        console.log("Game INI");

        // Units
        ajax.ajaxRequest("http://localhost/kira",function (kira) {
            console.log(kira);
            allUnits=kira;
        });

        // Carga mapa y jugadores
        var mapId=1;
        if(GET["mapId"]) {
            mapId = GET["mapId"];
        }
        ajax.ajaxRequest("http://localhost/maps/"+mapId,mapController.createTiles);

        // Controladores keyboard y gamepad
        keyboard.init();
        gamepad.init();

        // main loop
        mainLoop.iteration();
    },
}
