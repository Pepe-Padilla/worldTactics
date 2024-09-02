/**
 * 0 - initial state
 * 10 - map charged 
 * 20 - players charged 
 * 30 - begining of player turn 
 * 40 - turn active - selecting on map
 * 50 - element selected (active allie) - move
 * 51 - element selected (allie structure non occupied by unit) - buy unit menu
 * 52 - element selected (not active allie or enemy unit) - view range
 * 60 - unit move - selecting acction
 * 65 - unit atack/dont move/skill - selecting acction
 * 70 - acction result
 * 80 - end of player turn
 * 90 - end of turn (all)
 * 100 - victory
 */
var state50Unit = null;
var state5Controller = {
    unitPlayerSelected: function(unit) {
        splash.cancelS4Splash();
        mapController.showRangeOfUnit(unit);
        state50Unit = unit;
        gameState = 50;
    },
    unitMovedOrEnemySelected: function(unit) {
        splash.cancelS4Splash();
        mapController.showRangeOfUnit(unit);
        gameState = 51;
    },
    mapSelected: function(terrain) {
        if(terrain.taken && terrain.taker == currentPlayer) {
            splash.cancelS4Splash();
            splash.showCasttleMenu(terrain.sprite);
            gameState = 52;
        }
    },
    cancelRange: function() {
        mapController.cancelRange();
        gameState = 40;
    },
    moveUnit: function() {
        // if(cursorIsInRange)
        var rangeTileId = "rangeX"+cursor.x+"Y"+cursor.y;
        var rangetTile = document.getElementById(rangeTileId);

        //   moveUnitPreventive
        if(rangetTile) {
            var rect=rangetTile.getBoundingClientRect();
            var idUnit = "unit"+state50Unit._id;
            var theUnit = document.getElementById(idUnit);
            theUnit.style.position = "absolute";
            theUnit.style.left = (rect.x)+"px";
            theUnit.style.top = (rect.y)+"px";
            theUnit.style.width = (rect.width) + "px";
            theUnit.style.height = (rect.height) + "px";

            //  TODO: show ActionMenu 
        
            gameState = 60
        }
    },
    cancelMoveUnit: function () {
        // return char
        Tile.upsertCharacter(state50Unit);
        state50Unit= null;

        // TODO: hide ActionMenu

        this.cancelRange(); // este regeresa a 40
        gameController.state4CursorMoved(); 
    }
};