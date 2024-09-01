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
var state5Controller = {
    unitPlayerSelected: function(unit) {
        splash.cancelS4Splash();
        mapController.showRangeOfUnit(unit);
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
    }
};