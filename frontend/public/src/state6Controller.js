var state6Cursor = null;
var action67=null;
var action65=null;
var state6Controller = {
    actionSelected: function () {
        var selected = document.getElementById("menu60_"+menuCursor);
        var tds=selected.getElementsByTagName("td");
        var action = tds[0].id; 

        switch(action) {
            case "menu60_attack":
                //console.log(action);
                this.atackSelected();
                break;
            case "menu60_skills":
                console.log(action);
                this.skillSelected();
                break;
            case "menu60_move":
                //console.log(action);
                state6Cursor = {...cursor};
                this.moveSelected();
                break;
            case "menu60_cancel":
                //console.log(action);
                state5Controller.cancelMoveUnit();
                break;
        }
    },
    moveSelected: function() {
        state50Unit.x=state6Cursor.x;
        state50Unit.y=state6Cursor.y;
        state50Unit.moved = true;
        state5Controller.cancelMoveUnit();
        mapController.cancelXRange();
    },
    atackSelected: function() {
        state6Cursor = {...cursor};
        splash.cancelS50Splash();
        mapController.showXRange(state6Cursor.x,state6Cursor.y,state50Unit.atkrange,true,currentPlayer);
        gameState = 67;
    },
    skillSelected: function() {
        state6Cursor = {...cursor};
        splash.skillS50Splash(state50Unit);
        gameState = 65;
    },
    cancelS60: function() {
        cursor = {...state6Cursor};
        Tile.updateCursor(cursor);
        state6Cursor=null;
        action67=null;
        mapController.cancelXRange();
        splash.showS50Splash(state50Unit);
        gameState = 60;
    },
    atackConfirmed: function() {
        // state50Unit is the atacker
        // in cursor is the objective
        // in state6Cursor is the atacker final position,  moveSelected()
        // All stats includes: natural stats, units effects, pasive, terrain natural stats, terrain effects, unit bonus

        // 0. Validate target is on harmfull range
        var currentTileId = "rangeXX"+cursor.x+"Y"+cursor.y;
        var currentTile = document.getElementById(currentTileId);
        if(!currentTile) return;

        // 1. Get objective unit
        var enemyUnit = gameController.getUnit(cursor.x,cursor.y);
        if(!enemyUnit) return;

        // 2. Get all the stats for the atacker
        var unitEfects = gameController.getEffectBonus(state50Unit);
        var unitBonus = gameController.getTotalBonus(state50Unit,enemyUnit.name);
        var terrainBonus = gameController.getTerrainStats(state6Cursor.x,state6Cursor.y);
        var unitSpecialBonus = this.specialUnitBonus(state50Unit,theMap.arrayTerrain[state6Cursor.y].row[state6Cursor.x].terrain);
        var unitHP = state50Unit.hp;
        var unitDef = unitBonus.def + state50Unit.def + terrainBonus.def + unitEfects.def + unitSpecialBonus.def;
        var unitStr = unitBonus.str + state50Unit.str + terrainBonus.str + unitEfects.str + unitSpecialBonus.str;

        // 3. Get all the stats for the objective
        var eunitEfects = gameController.getEffectBonus(enemyUnit);
        var eUnitBonus = gameController.getTotalBonus(enemyUnit,state50Unit.name);
        var eTerrainBonus = gameController.getTerrainStats(cursor.x,cursor.y);
        var eUnitSpecialBonus = this.specialUnitBonus(enemyUnit,theMap.arrayTerrain[cursor.y].row[cursor.x].terrain);
        var eUnitHP = state50Unit.hp;
        var eUnitDef = eUnitBonus.def + enemyUnit.def + eTerrainBonus.def + eunitEfects.def + eUnitSpecialBonus.def;
        var eUnitStr = eUnitBonus.str + enemyUnit.str + eTerrainBonus.str + eunitEfects.str + eUnitSpecialBonus.str;

        // 4. Resolve the atackers final damage
        var dmg = Math.floor(((unitHP/100) * unitStr)-((eUnitHP/100)*eUnitDef));
        if(dmg < 0) dmg = 0;

        // 5. make the objective take the damage
        enemyUnit.hp -= dmg;
        if(dmg > 0) {
            this.applySpecialEffectsOnDamage(enemyUnit);
        }

        // only if adjacent
        var distance=Math.abs(cursor.x-state6Cursor.x)+Math.abs(cursor.y-state6Cursor.y);
        //console.log(distance);
        if(distance <= 1) {
            // 6. with the new HP of the objective resolve the objective final damage
            eUnitHP = (enemyUnit.hp + eUnitHP)/2; // average HP used
            dmg = Math.floor(((eUnitHP/100) * eUnitStr)-((unitHP/100)*unitDef));

            // 7. make the atacker take the damage
            if(dmg < 0) dmg = 0;
            state50Unit.hp -= dmg;
            if(dmg > 0) {
                this.applySpecialEffectsOnDamage(state50Unit);
            }
        }

        // 8. destroy de killed units
        gameController.resolveHPUnits();

        // 9. finish the turn with this.moveSelected();
        this.moveSelected();
    },
    specialUnitBonus: function(unit,terrain) {
        var bonus = {str:0,def:0};
        switch(unit.name) {
            case "assasin":
                if(terrain.sprite == "thiket" || terrain.sprite == "forest" || terrain.sprite == "mountain") {
                    bonus.str += terrain.defBonus;
                }
                break;
            case "ranger":
                if(terrain.sprite == "casttle" || terrain.sprite == "keep" || terrain.sprite == "mountain") {
                    bonus.str += terrain.defBonus;
                }
                break;
        }
        return bonus;
    },
    applySpecialEffectsOnDamage: function(unit) {
        for(var s;s < unit.status.length; s++) {
            var stat = unit.status[s];
            stat.effects.forEach(effect => {
                if(effect.special == "lostOnDamage") {
                    unit.status.splice(s,1);
                    s--;
                }
            });
        };
    },
    accept65Menu: function() {
        var selected = document.getElementById("menu65_"+menuCursor);
        var tds=selected.getElementsByTagName("td");
        var action = tds[0].id;
        console.log(action);

        if(action == "menu65_cancel") {
            state5Controller.cancelMoveUnit();
            return;
        }

        var actionSelected = action.split("_");
        var skillSelected = actionSelected[1];
        
        state6Cursor = {...cursor};
        splash.cancelS50Splash();

        state50Unit.skills.forEach(skill => {
            if(skill.name == skillSelected) {
                action65 = JSON.parse(JSON.stringify(skill)); //cloned
            }
        });

        var currentRage = action65.range;

        mapController.showSkillRange(state6Cursor.x,state6Cursor.y,currentRage);
        mapController.showSkillArea(cursor.x,cursor.y,action65.area,action65.harmfull,cursor.x,cursor.y);
        // and show area of effect
        gameState = 66;
    },
    cursorMoved66: function() { 
        mapController.cancelXArea();
        mapController.showSkillArea(cursor.x,cursor.y,action65.area,action65.harmfull,cursor.x,cursor.y);
    },
    cancelS66: function(){
        cursor = {...state6Cursor};
        Tile.updateCursor(cursor);
        state6Cursor=null;
        action67=null;
        action65=null;
        mapController.cancelXRange();
        splash.showS50Splash(state50Unit);
        gameState = 60;
    },
    executeSkill: function() {
        // state50Unit is the atacker
        // in cursor is the objective
        // in state6Cursor is the atacker final position,  moveSelected()
        // action65 is the skill used
        //unitHarmfullRange
        //unitAllyRange

        // 0. Validate target is on harmfull or ally range
        var typeOfTarguets = action65.harmfull?"unitHarmfullRange":"unitAllyRange";
        var ranges=document.getElementsByClassName(typeOfTarguets);

        for(var r=0;r<ranges.length;r++) {
            var rangeId = ranges[r].id;
            // "skillRangeX"+initialX+"Y"+initialY;
            // /skillRangeX(\d+)Y(\d+)/ :
            // 0 - complete string
            // 1 - x
            // 2 - y
            var rangePos = /skillAreaX(\d+)Y(\d+)/.exec(rangeId);
            if(rangePos.length==3){
                // 1. get ojectives
                var xPos = parseInt(rangePos[1]);
                var yPos = parseInt(rangePos[2]);
                var targetUnit = gameController.getUnit(xPos,yPos);
                if(targetUnit) { 
                    console.log(targetUnit);
                    var isAllie = targetUnit.playerIndex == state50Unit.playerIndex;
                    if(isAllie && !action65.harmfull || !isAllie && action65.harmfull) {
                        state50Unit.mp -= action65.mp;
                        console.log("is a target!!");
                        // 2. pass the status to the targuet
                        var stat= JSON.parse(JSON.stringify(action65)); //cloned
                        for(var e=0;e < stat.effects.length; e++) {
                            console.log("giribilla");
                            var effect = stat.effects[e];
                            var applaySpecials = false;
                            if((effect.atribute == "hp" || effect.atribute == "mp") && effect.turn == 0) {
                                var newAtr = targetUnit[effect["atribute"]]+effect.bonus;
                                if(newAtr>100) newAtr=100;
                                targetUnit[effect["atribute"]]=newAtr;
                                effect.turn--;
                                applaySpecials = true;
                            }

                            if(effect.atribute == "hp" && stat.harmfull && applaySpecials) {
                                this.applySpecialEffectsOnDamage(targetUnit);
                            }
                            if(applaySpecials) this.applySpecialEffects(targetUnit,effect);
                            
                            if(effect.turn == -1){
                                stat.effects.splice(e,1);
                                e--;
                            }
                        }
                        if(stat.effects.length > 0) {
                            console.log("juai de rito");
                            targetUnit.status.push(stat);
                        }
                    }
                }
            }
        }

        // 9. destroy de killed units
        gameController.resolveHPUnits();

        // 8. finish the turn with this.moveSelected();
        this.moveSelected();
        action65=null;
    },
    applySpecialEffects: function(unit,effect) {
        switch(effect.special) {
            case "twoPerPahtia":
                var pahtiaCount=0;
                players[unit.playerIndex].units.forEach(un => {
                    un.status.forEach(stt => {
                        if(stt.name == "Pahtia") pahtiaCount++;
                    });
                });
                unit.mp += pahtiaCount*2;
                if(unit.mp>100) unit.mp = 100;
                break;
            case "removeHarmfull":
                for(var s=0;s<unit.status.length;s++) {
                    if(unit.status[s].harmfull) {
                        unit.status.splice(s,1);
                        s--;
                    }
                }
                break;
            case "theMountainIsLava":
                var posX = unit.x;
                var posY = unit.y;
                var terrain = theMap.arrayTerrain[posY].row[posX].terrain;
                if(terrain.sprite == "mountain" || terrain.sprite == "casttle") {
                    unit.hp -= 20;
                    this.applySpecialEffectsOnDamage(unit);
                }
                break;
            case "onePerHarmfull":
                var pahtiaCount=0;
                players.forEach((player,index) => {
                    if(index != unit.playerIndex){
                        player.units.forEach(un => {
                            un.status.forEach(stt => {
                                if(stt.harmfull) pahtiaCount++;
                            });
                        });
                    }
                });
                unit.mp += pahtiaCount*1;
                if(unit.mp>100) unit.mp = 100;
                break;
        }
    }
}