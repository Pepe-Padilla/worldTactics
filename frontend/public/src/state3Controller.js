var state3Controller = {
    state3Bot: function () {
        var gold = 0;
        var unitsLost = 0;

        for(var ch=0;ch<players[currentPlayer].units.length;ch++) {
            var unit = players[currentPlayer].units[ch];

            // Terrain effects
            var terrain = theMap.arrayTerrain[unit.y].row[unit.x].terrain;
            for(var st=0;st<terrain.status.length;st++) {
                var status = terrain.status[st];
                for(var ef=0;ef<status.effects.length;ef++){
                    var efect = status.effects[ef];
                    if(efect.turn == 0 && (efect.atribute == "hp" || efect.atribute == "mp")) {
                        var newAtr = unit[efect["atribute"]]+efect.bonus;
                        if(newAtr>100) newAtr=100;
                        unit[efect["atribute"]]=newAtr;
                        
                        // TODO: specials efect that applay to begining of the turn
                    }
                }
            }

            // Unit effects
            for(var stu=0;stu<unit.status.length;stu++) {
                var status = unit.status[stu];
                for(var ef=0;ef<status.effects.length;ef++){
                    var efect = status.effects[ef];
                    if(efect.atribute == "hp" || efect.atribute == "mp") {
                        var newAtr = unit[efect["atribute"]]+efect.bonus;
                        if(newAtr>100) newAtr=100;
                        unit[efect["atribute"]]=newAtr;
                    }
                    
                    if(efect.atribute == "hp" && status.harmfull) {
                        state6Controller.applySpecialEffectsOnDamage(unit);
                    }
                    
                    state6Controller.applySpecialEffects(unit,efect);

                    if(efect.turn == 0){
                        // Remove obsolete effects
                        if(!status.pasive) {
                            status.effects.splice(ef,1);
                            ef--;
                        }
                    } else {
                        efect.turn--;
                    }
                }
                // Remove obsolet status
                if(status.effects.length == 0) {
                    unit.status.splice(stu,1);
                    stu--;
                }
            }

            // Terrain gold
            if(terrain.sprite == "mine" && unit.name == "commoner" && unit.hp > 0) {
                gold+=Math.round(goldPerMine*(unit.hp/100));
            }

            // If the unit is death because of the efects kill them!!!!
            if(unit.hp <= 0) {
                unitsLost++;
                var theUnit=players[currentPlayer].units.splice(ch,1);
                Tile.killCharacter(theUnit);
                ch--;
            }
        }
        players[currentPlayer].gold+=gold+GOLD_BOT;
        splash.createBotSplash(gold,unitsLost);
        state4Controller.redrawUnits();
        gameState=31;
    },
    state3close: function () {
        var ts = document.getElementById("theSplash");
        if(ts)ts.remove();
        state4Controller.state4turnActive();
    },
    createInitialUnits: function () {
        if(allUnits.length > 0)
        players.forEach((player,indexPlayer) => {
            var x = player.buildings[0].x;
            var y = player.buildings[0].y;
            var unit1 = gameController.createUnit(x,y,0,indexPlayer);
            unit1.moved = false;
            /*
            if(x < theMap.xSize) {
                var unit2 = gameController.createUnit(x+1,y,0,indexPlayer);
                unit2.moved = false;
            }
            if(y < theMap.ySize) {
                var unit3 = gameController.createUnit(x,y+1,0,indexPlayer);
                unit3.moved = false;
            }
            if(y > 0) {
                var unit4 = gameController.createUnit(x,y-1,0,indexPlayer);
                unit4.moved = false;
            }
            if(x > 0) {
                var unit5 = gameController.createUnit(x-1,y,0,indexPlayer);
                unit5.moved = false;
            }*/
        });
    }
};
