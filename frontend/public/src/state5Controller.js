let state50Unit = null;
let state5Controller = {
    unitPlayerSelected: function(unit,playerIndex) {
        splash.cancelS4Splash();
        mapController.showRangeOfUnit(unit,playerIndex);
        state50Unit = unit;
        gameState = STATE_50_ACTIVE_ALLIE_SELECTED;
    },
    unitMovedOrEnemySelected: function(unit,playerIndex) {
        splash.cancelS4Splash();
        mapController.showRangeOfUnit(unit,playerIndex);
        gameState = STATE_51_INACTIVE_SELECTED;
    },
    mapSelected: function(terrain) {
        if(terrain.taker === currentPlayer) {
            splash.cancelS4Splash();
            splash.showBuildingMenu(terrain.sprite);
            menuCursor = 0;
            Tile.createCursorMenu(menuCursor,players[currentPlayer].color,52);
            gameState = STATE_52_ALLIE_STRUCTURE_SELECTED;
        } else {
            splash.cancelS4Splash();
            splash.showEOTMenu();
            menuCursor = 0;
            Tile.createCursorMenu(menuCursor,players[currentPlayer].color,80);
            gameState = STATE_80_END_OF_PLAYER_TURN;
        }
    },
    cancelRange: function() {
        mapController.cancelRange();
        gameState = STATE_40_TURN_ACTIVE;
    },
    moveUnit: function() {
        // if(cursorIsInRange)
        const rangeTileId = "rangeX"+cursor.x+"Y"+cursor.y;
        const rangeTile = document.getElementById(rangeTileId);

        //   moveUnitPreventive
        if(rangeTile) {
            const rect=rangeTile.getBoundingClientRect();
            const idUnit = "unit"+state50Unit._id;
            let theUnit = document.getElementById(idUnit);
            theUnit.style.position = "absolute";
            theUnit.style.left = (rect.x)+"px";
            theUnit.style.top = (rect.y)+"px";
            theUnit.style.width = (rect.width) + "px";
            theUnit.style.height = (rect.height) + "px";

            splash.showS50Splash(state50Unit); 
        
            gameState = STATE_60_UNIT_MOVE;
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
        gameState = STATE_40_TURN_ACTIVE;
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
        gameState = STATE_40_TURN_ACTIVE;
    },
    accept80Menu: function() {
        const selected = document.getElementById("menu80_"+menuCursor);
        const tds=selected.getElementsByTagName("td");
        const action = tds[0].id;

        switch(action) {
            case "menu80_eot":
                players[currentPlayer].units.forEach(unit => {
                    unit.moved = false;
                    if(unit.name === "commoner") {
                        const terrain = theMap.arrayTerrain[unit.y].row[unit.x].terrain;
                        if(terrain.sprite === "keep" || terrain.sprite === "castle") {
                            //console.log("taking the "+terrain.sprite);
                            gameController.takeBuilding(unit);
                        }
                    }
                });
                currentPlayer++;
                //console.log("end of turn!!! "+currentPlayer+" "+players.length);
                if(players.length <= currentPlayer) {
                    currentPlayer=0;
                    currentTurn++;
                }
                this.iSeeDeadPeople();
                state4Controller.redrawUnits();
                this.cancelS80();
                gameController.initGame();
                break;
            case "menu80_cicle":
                gameController.circleRight();
                this.cancelS80();
                break;
            case "menu80_cancel":
                this.cancelS80();
                break;
        }
    },
    iSeeDeadPeople: function(){
        let phantoms = document.getElementsByClassName("unitMetter");
        for(let f=0;f<phantoms.length;f++) {
            const fId = phantoms[f].id;
            let isAlive = false;
            players.forEach(player => {
                player.units.forEach(unit => {
                    if(("unit"+unit._id) === fId) isAlive = true; // Its Alive!!!!
                });
            });
            if(!isAlive) {
                console.log("I see dead people!!!["+fId+"]");
                phantoms[f].remove();
            }
        }
    }
};