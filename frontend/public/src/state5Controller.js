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
        
        state4Controller.state4CursorMoved(); 
        
        state50Unit= null;
        state6Cursor = null;
        action67=null;
    },
    cancelS52: function() {
        splash.cancelBuildingMenu();
        Tile.deleteCursorMenu();
        state4Controller.state4CursorMoved();
        gameState = 40;
    },
    accept52Menu: function() {
        var selected = document.getElementById("menu52_"+menuCursor);
        var tds=selected.getElementsByTagName("td");
        var action = tds[0].id; 
        var unitIndex = parseInt(action.split("_")[1]);

        if(players[currentPlayer].gold >= allUnits[unitIndex].gold) {
            players[currentPlayer].gold -= allUnits[unitIndex].gold;
            gameController.createUnit(cursor.x,cursor.y,unitIndex);
            this.cancelS52();
        }
    },
    cancelS80: function() {
        splash.cancelEOTMenu();
        Tile.deleteCursorMenu();
        state4Controller.state4CursorMoved();
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
                        if(terrain.sprite == "keep" || terrain.sprite == "castle") {
                            //console.log("taking the "+terrain.sprite);
                            gameController.takeBuilding(unit);
                        }
                    }
                });
                currentPlayer++;
                //console.log("end of turn!!! "+currentPlayer+" "+players.length);
                if(players.length <= currentPlayer) {
                    //console.log("turno nuevo!!");
                    currentPlayer=0;
                    currentTurn++;
                }
                this.iSeeDeadPeope();
                state4Controller.redrawUnits();
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
    },
    iSeeDeadPeope: function(){
        var fantoms = document.getElementsByClassName("unitMetter");
        for(var f=0;f<fantoms.length;f++) {
            var fId = fantoms[f].id;
            var isAlive = false; 
            players.forEach(player => {
                player.units.forEach(unit => {
                    if(("unit"+unit._id) == fId) isAlive = true; // Its Alive!!!!
                });
            });
            if(!isAlive) {
                console.log("I see dead people!!!["+fId+"]");
                fantoms[f].remove();
            }
        }
    }
};