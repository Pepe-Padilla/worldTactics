let state3Controller = {
    state3Bot: function () {
        let gold = 0;
        let unitsLost = 0;

        for(let ch=0;ch<players[currentPlayer].units.length;ch++) {
            let unit = players[currentPlayer].units[ch];

            // Terrain effects
            let terrain = theMap.arrayTerrain[unit.y].row[unit.x].terrain;
            for(let st=0;st<terrain.status.length;st++) {
                let status = terrain.status[st];
                for(let ef=0;ef<status.effects.length;ef++){
                    let effect = status.effects[ef];
                    if(effect.turn === 0 && (effect.atribute === "hp" || effect.atribute === "mp")) {
                        let newAtr = unit[effect["atribute"]]+effect.bonus;
                        if(newAtr>100) newAtr=100;
                        unit[effect["atribute"]]=newAtr;
                        
                        // TODO: specials effect that applay to begining of the turn
                    }
                }
            }

            // Unit effects
            for(let stu=0;stu<unit.status.length;stu++) {
                let status = unit.status[stu];
                for(let ef=0;ef<status.effects.length;ef++){
                    let effect = status.effects[ef];
                    if(effect.atribute === "hp" || effect.atribute === "mp") {
                        let newAtr = unit[efect["atribute"]]+effect.bonus;
                        if(newAtr>100) newAtr=100;
                        unit[effect["atribute"]]=newAtr;
                    }
                    
                    if(effect.atribute === "hp" && status.harmfull) {
                        console.log("harmfull");
                        state6Controller.applySpecialEffectsOnDamage(unit);
                    }
                    
                    state6Controller.applySpecialEffects(unit,effect);

                    if(effect.turn === 0){
                        // Remove obsolete effects
                        if(!status.pasive) {
                            status.effects.splice(ef,1);
                            ef--;
                        }
                    } else {
                        effect.turn--;
                    }
                }
                // Remove obsolet status
                if(status.effects.length === 0) {
                    unit.status.splice(stu,1);
                    stu--;
                }
            }

            // Terrain gold
            if(terrain.sprite === "mine" && unit.name === "commoner" && unit.hp > 0) {
                gold+=Math.round(GOLD_PER_MINE*(unit.hp/100));
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
        gameState=STATE_31_CLOSE_BEGINNING_OF_TURN;
    },
    state3close: function () {
        let ts = document.getElementById("theSplash");
        if(ts)ts.remove();
        state4Controller.state4turnActive();
    },
    createInitialUnits: function () {
        if(allUnits.length > 0)
        players.forEach((player,indexPlayer) => {
            const x = player.buildings[0].x;
            const y = player.buildings[0].y;
            let unit1 = gameController.createUnit(x,y,0,indexPlayer);
            unit1.moved = false;

            // nearest keep and goldmine
            const nearest = this.nearestKeepGold(x,y);

            const keepX = nearest.keep.x;
            const keepY = nearest.keep.y;
            let terrain = theMap.arrayTerrain[keepX].row[keepX].terrain;
            terrain.taker = indexPlayer;
            terrain.taken = 0;
            player.buildings.push(theMap.arrayTerrain[keepX].row[keepX]);
            Tile.takeBuilding(keepX,keepY,player.color,true);

            const goldX = nearest.gold.x;
            const goldY = nearest.gold.y;
            let unit2 = gameController.createUnit(goldX,goldY,0,indexPlayer);
            unit2.moved = false;
        });
    },
    nearestKeepGold: function (castleX, castleY) {
        let nearest = {
            gold: {
                x: -1,
                y: -1,
                distance: 100000
            },
            keep: {
                x: -1,
                y: -1,
                distance: 100000
            },
        };
        for(let x=0;x<theMap.xSize;x++){
            for(let y=0;y<theMap.ySize;y++){
                if(theMap.arrayTerrain[x].row[y].terrain === "keep") {
                    const aDistance=Math.abs(x - castleX)+Math.abs(y - castleY);
                    if(aDistance < nearest.keep.distance) {
                        nearest.keep.distance = aDistance;
                        nearest.keep.x=x;
                        nearest.keep.y=y;
                    }
                }
                if(theMap.arrayTerrain[x].row[y].terrain === "mine") {
                    const aDistance=Math.abs(x - castleX)+Math.abs(y - castleY);
                    if(aDistance < nearest.gold.distance) {
                        nearest.gold.distance = aDistance;
                        nearest.gold.x=x;
                        nearest.gold.y=y;
                    }
                }
            }
        }
        return nearest;
    }
};
