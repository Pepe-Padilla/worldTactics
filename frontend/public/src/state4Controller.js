var state4Controller = {
    state4turnActive: function() {
        gameState=40;

        cursor.x = players[currentPlayer].buildings[0].x;
        cursor.y = players[currentPlayer].buildings[0].y;
        Tile.updateCursor(cursor,players[currentPlayer].color);
        this.state4CursorMoved();
    },
    state4CursorMoved: function() {
        var terrain = theMap.arrayTerrain[cursor.y].row[cursor.x].terrain;
        var unit = null;
        var indexUnit = currentPlayer;
        for(var p=0;p<players.length;p++) {
           for(var u=0;u<players[p].units.length;u++) {
                var aUnit = players[p].units[u];
                if(aUnit.x == cursor.x && aUnit.y == cursor.y) {
                    unit = aUnit;
                    indexUnit=p;
                }
            }
        }
        
        var bonus = {agi:0,vel:0,str:0,def:0};
        // bonus from user effects
        if(unit) {
            for(var u=0;u<unit.status.length;u++) {
                for(var e=0;e<unit.status[u].effects.length;e++) {
                    var anEffect = unit.status[u].effects[e];
                    bonus[anEffect.atribute] += anEffect.bonus;
                }
            }
        }

        // bonus form terrain
        bonus.def+=terrain.defBonus;

        splash.showS4Splash(terrain,unit,bonus,indexUnit);
    },
    redrawUnits: function() {
        for(var i=0;i< players.length;i++) {
            for(var u=0;u<players[i].units.length;u++) {
                Tile.upsertCharacter(players[i].units[u]);
            }
        }
    },
    retakeBuildings: function() {
        for(var i=0;i< players.length;i++) {
            for(var t=0;t<players[i].buildings.length;t++) {
               Tile.takeBulding(players[i].buildings[t].x,players[i].buildings[t].y,players[i].color,true);
            }
        }
    },
    acceptS4Cursor: function() {
        for(var i=0;i<players.length;i++) {
            for(var u=0;u<players[i].units.length;u++){
                if(cursor.x == players[i].units[u].x && cursor.y == players[i].units[u].y) {
                    if(i == currentPlayer && !players[i].units[u].moved) {
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
        var workWork= gameController.getUnit(cursor.x,cursor.y);
        if(workWork && workWork.name == "commoner"  && workWork.playerIndex == currentPlayer && 
            theMap.arrayTerrain[cursor.y].row[cursor.x].terrain.sprite == "mine") {
            workWork.moved = true;
            Tile.upsertCharacter(workWork);
        }
    }
};