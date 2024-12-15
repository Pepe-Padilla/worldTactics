document.addEventListener('DOMContentLoaded', function() {
    init.initGame();
}, false);

let init = {
    initGame: function() {
        console.log("Game INI");

        if(GET["idGame"]){
            ajax.ajaxRequest("http://localhost/games/"+GET["idGame"],function (completeGame) {
                gameId=completeGame._id;
                allUnits=completeGame.units;
                players=completeGame.players;
                currentPlayer=completeGame.currentPlayer;
                currentTurn=completeGame.currentTurn;
                gameState=completeGame.gameState;
                mapController.createTiles(completeGame.map,true);
                let theColor= players[currentPlayer].color;
                cursor.x=players[currentPlayer].buildings[0].x;
                cursor.y=players[currentPlayer].buildings[0].y;
                Tile.createCursor(cursor,theColor);
                state4Controller.redrawUnits();
                state4Controller.retakeBuildings();
                state4Controller.state4turnActive();
            });
        } else {
            // Units
            ajax.ajaxRequest("http://localhost/kira",function (kira) {
                console.log(kira);
                allUnits=kira;
            });

            // Carga mapa y jugadores
            let mapId=1;
            if(GET["mapId"]) {
                mapId = GET["mapId"];
            }
            ajax.ajaxRequest("http://localhost/maps/"+mapId,mapController.createTiles);
        }

        // Controllers keyboard y gamepad
        keyboard.init();
        gamepad.init();

        // main loop
        mainLoop.iteration();
    },
}
