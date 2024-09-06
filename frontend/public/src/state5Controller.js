/**
 * 0 - initial state - 10
 * 5 - map selection - 0
 * 10 - map charged - 8
 * 20 - players charged  - 10
 * 30 - begining of player turn - 7
 * 40 - turn active - selecting on map - 10
 * 50 - element selected (active allie) - move - 10
 * 51 - element selected (not active allie or enemy unit) - view range - 10
 * 52 - element selected (allie structure non occupied by unit) - buy unit menu - 3
 * 53 - element selected (map, no allie structure, non occupied by unit) - end turn menu - 0
 * 60 - unit move - selecting acction - 10
 * 65 - unit atack/dont move/skill - selecting acction - 4
 * 70 - acction result - 0
 * 80 - end of player turn - 0
 * 90 - end of turn (all) - 0
 * 100 - victory - 0
 */
var state50Unit = null;
var state5Controller = {
    unitPlayerSelected: function(unit,playerIndex) {
        splash.cancelS4Splash();
        mapController.showRangeOfUnit(unit,playerIndex);
        state50Unit = unit;
        gameState = 50;
    },
    unitMovedOrEnemySelected: function(unit,playerIndex) {
        splash.cancelS4Splash();
        mapController.showRangeOfUnit(unit,playerIndex);
        gameState = 51;
    },
    mapSelected: function(terrain) {
        if(terrain.taker == currentPlayer) {
            splash.cancelS4Splash();
            splash.showBuildingMenu(terrain.sprite);
            menuCursor = 0;
            Tile.createCursorMenu(menuCursor,players[currentPlayer].color,52);
            gameState = 52;
        } else {
            splash.cancelS4Splash();
            splash.showEOTMenu();
            menuCursor = 0;
            Tile.createCursorMenu(menuCursor,players[currentPlayer].color,80);
            gameState = 80;
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

            splash.showS50Splash(state50Unit); 
        
            gameState = 60
        }
    },
    cancelMoveUnit: function () {
        // return char
        Tile.upsertCharacter(state50Unit);
        splash.cancelS50Splash();
        
        this.cancelRange(); // este regeresa a 40
        
        gameController.state4CursorMoved(); 
        
        state50Unit= null;
        state6Cursor = null;
        action67=null;
    },
    cancelS52: function() {
        splash.cancelBuildingMenu();
        Tile.deleteCursorMenu();
        gameController.state4CursorMoved();
        gameState = 40;
    },
    accept52Menu: function() {
        var selected = document.getElementById("menu52_"+menuCursor);
        var tds=selected.getElementsByTagName("td");
        var action = tds[0].id; 
        var unitIndex = parseInt(action.split("_")[1]);

        if(players[currentPlayer].gold > allUnits[unitIndex].gold) {
            players[currentPlayer].gold -= allUnits[unitIndex].gold;
            gameController.createUnit(cursor.x,cursor.y,unitIndex);
            this.cancelS52();
        }
    },
    cancelS80: function() {
        splash.cancelEOTMenu();
        Tile.deleteCursorMenu();
        gameController.state4CursorMoved();
        gameState = 40;
    },
    accept80Menu: function() {
        var selected = document.getElementById("menu80_"+menuCursor);
        var tds=selected.getElementsByTagName("td");
        var action = tds[0].id; 

        switch(action) {
            case "menu80_eot":
                players[currentPlayer].units.forEach(unit => {
                    unit.moved = false;
                    if(unit.name == "commoner") {
                        var terrain = theMap.arrayTerrain[unit.y].row[unit.x].terrain;
                        if(terrain.sprite == "keep" || terrain.sprite == "casttle") {
                            console.log("taking the "+terrain.sprite);
                            gameController.takeBuilding(unit);
                        }
                    }
                });
                currentPlayer++;
                console.log("end of turn!!! "+currentPlayer+" "+players.length);
                if(players.length <= currentPlayer) {
                    console.log("turno nuevo!!");
                    currentPlayer=0;
                    currentTurn++;
                }
                gameController.redrawUnits();
                this.cancelS80();
                gameController.initGame();
                break;
            case "menu80_cicle":
                gameController.cicleRight();
                this.cancelS80();
                break;
            case "menu80_cancel":
                this.cancelS80();
                break;
        }
    }
};