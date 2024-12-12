let state4Controller = {
    state4turnActive: function() {
        gameState=STATE_40_TURN_ACTIVE;

        cursor.x = players[currentPlayer].buildings[0].x;
        cursor.y = players[currentPlayer].buildings[0].y;
        Tile.updateCursor(cursor,players[currentPlayer].color);
        this.state4CursorMoved();
    },
    state4CursorMoved: function() {
        const terrain = theMap.arrayTerrain[cursor.y].row[cursor.x].terrain;
        let unit = null;
        let indexUnit = currentPlayer;
        for(let p=0;p<players.length;p++) {
           for(let u=0;u<players[p].units.length;u++) {
                const aUnit = players[p].units[u];
                if(aUnit.x === cursor.x && aUnit.y === cursor.y) {
                    unit = aUnit;
                    indexUnit=p;
                }
            }
        }
        
        const bonus = gameController.getEffectBonus(unit)

        // bonus form terrain
        bonus.def+=terrain.defBonus;

        splash.showS4Splash(terrain,unit,bonus,indexUnit);
    },
    redrawUnits: function() {
        for(let i=0;i< players.length;i++) {
            for(let u=0;u<players[i].units.length;u++) {
                Tile.upsertCharacter(players[i].units[u]);
            }
        }
    },
    retakeBuildings: function() {
        for(let i=0;i< players.length;i++) {
            for(let t=0;t<players[i].buildings.length;t++) {
               Tile.takeBuilding(players[i].buildings[t].x,players[i].buildings[t].y,players[i].color,true);
            }
        }
    },
    acceptS4Cursor: function() {
        for(let i=0;i<players.length;i++) {
            for(let u=0;u<players[i].units.length;u++){
                if(cursor.x === players[i].units[u].x && cursor.y === players[i].units[u].y) {
                    if(i === currentPlayer && !players[i].units[u].moved) {
                        state5Controller.unitPlayerSelected(players[i].units[u],i);
                        return;
                    } else {
                        state5Controller.unitMovedOrEnemySelected(players[i].units[u],i);
                        return;
                    }
                }
            }
        }
        state5Controller.mapSelected(theMap.arrayTerrain[cursor.y].row[cursor.x].terrain);
    },
    keepWorking: function() {
        let workWork= gameController.getUnit(cursor.x,cursor.y);
        if(workWork && workWork.name === UNIT_COMMONER  && workWork.playerIndex === currentPlayer &&
            theMap.arrayTerrain[cursor.y].row[cursor.x].terrain.sprite === TERRAIN_GOLD_MINE) {
            workWork.moved = true;
            Tile.upsertCharacter(workWork);
        }
    }
};