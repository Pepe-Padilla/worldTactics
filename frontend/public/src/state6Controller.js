let state6Cursor = null;
let action67=null;
let action65=null;

let state6Controller = {
    actionSelected: function () {
        const selected = document.getElementById("menu60_"+menuCursor);
        const tds=selected.getElementsByTagName("td");
        const action = tds[0].id;

        switch(action) {
            case "menu60_attack":
                //console.log(action);
                this.attackSelected();
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
    attackSelected: function() {
        state6Cursor = {...cursor};
        splash.cancelS50Splash();
        mapController.showXRange(state6Cursor.x,state6Cursor.y,state50Unit.atkrange,true,currentPlayer);
        gameState = STATE_67_UNIT_TARGET;
    },
    skillSelected: function() {
        state6Cursor = {...cursor};
        splash.skillS50Splash(state50Unit);
        gameState = STATE_65_MENU_UNIT;
    },
    cancelS60: function() {
        cursor = {...state6Cursor};
        Tile.updateCursor(cursor);
        state6Cursor=null;
        action67=null;
        mapController.cancelXRange();
        splash.showS50Splash(state50Unit);
        gameState = STATE_60_UNIT_MOVE;
    },
    attackConfirmed: function() {
        // state50Unit is the attacker
        // in cursor is the objective
        // in state6Cursor is the attacker final position,  moveSelected()
        // All stats includes: natural stats, units effects, pasive, terrain natural stats, terrain effects, unit bonus

        // 0. Validate target is on harmfull range
        const currentTileId = "rangeXX"+cursor.x+"Y"+cursor.y;
        const currentTile = document.getElementById(currentTileId);
        if(!currentTile) return;

        // 1. Get objective unit
        const enemyUnit = gameController.getUnit(cursor.x,cursor.y);
        if(!enemyUnit) return;

        // 2. Get all the stats for the attacker
        const unitEffects = gameController.getEffectBonus(state50Unit);
        const unitBonus = gameController.getTotalBonus(state50Unit,enemyUnit.name);
        const terrainBonus = gameController.getTerrainStats(state6Cursor.x,state6Cursor.y);
        const unitSpecialBonus = this.specialUnitBonus(state50Unit,theMap.arrayTerrain[state6Cursor.y].row[state6Cursor.x].terrain);
        let unitHP = state50Unit.hp;
        const unitDef = unitBonus.def + state50Unit.def + terrainBonus.def + unitEffects.def + unitSpecialBonus.def;
        const unitStr = unitBonus.str + state50Unit.str + terrainBonus.str + unitEffects.str + unitSpecialBonus.str;

        // 3. Get all the stats for the objective
        const eunitEfects = gameController.getEffectBonus(enemyUnit);
        const eUnitBonus = gameController.getTotalBonus(enemyUnit,state50Unit.name);
        const eTerrainBonus = gameController.getTerrainStats(cursor.x,cursor.y);
        const eUnitSpecialBonus = this.specialUnitBonus(enemyUnit,theMap.arrayTerrain[cursor.y].row[cursor.x].terrain);
        let eUnitHP = enemyUnit.hp;
        const eUnitDef = eUnitBonus.def + enemyUnit.def + eTerrainBonus.def + eunitEfects.def + eUnitSpecialBonus.def;
        const eUnitStr = eUnitBonus.str + enemyUnit.str + eTerrainBonus.str + eunitEfects.str + eUnitSpecialBonus.str;

        // 4. Resolve the atackers final damage
        //    The atack/defense value is proporcional to HP %, in orther to avoid loosing to much power in a lineal poportion: unitProportion = (unitHP/100)
        //
        //    - It can be used an inverse cuadratic proportion: 
        //      100% HP -> 100% STR/DEF    1 - (1 - 1)^2 = 1
        //      50%  HP ->  75% STR/DEF    1 - (1 - 0.5)^2 = 0.75
        //      25%  HP ->  44% STR/DEF    1 - (1 - 0.25)^2 = 0.4375
        //var unitProportion = 1 - Math.pow(1 - (unitHP/100),2);
        //var enemyProportion = 1 - Math.pow(1 - (eUnitHP/100),2);
        //
        //    - It can be used a square algorithm:
        //      100% HP -> 100% STR/DEF    sqr(1)     = 1
        //      50%  HP ->  70% STR/DEF    sqr(0.5)   = 0.7071
        //      25%  HP ->  50% STR/DEF    sqr(0.25)  = 0.5
        //var unitProportion = 1 - Math.sqrt(unitHP/100);
        //var enemyProportion = 1 - Math.sqrt(eUnitHP/100);
        //
        //    - It can be used a logarithm proportion using a k constant: ln (1 + k * (unitHP/100)) / ln (1 + k)
        //      (when k = 3)
        //      100% HP -> 100% STR/DEF    ln(1 + 3 * 1) / ln(1 + 3)  = 1
        //      50%  HP ->  66% STR/DEF    ln(1 + 3 * 0.75) / ln(1 + 3)  = 0.66096
        //      25%  HP ->  40% STR/DEF    ln(1 + 3 * 0.25) / ln(1 + 3)  = 0.40367
        const k = 3; // <---- make tests whith this value
        const unitProportion = Math.log(1+(k*(unitHP/100))) / Math.log(1+k);
        let enemyProportion = Math.log(1+(k*(eUnitHP/100))) / Math.log(1+k);

        let dmg = Math.floor((unitProportion * unitStr)-(enemyProportion * eUnitDef));
        console.log(`attack: dmg[${dmg}] unitHP[${unitHP}] unitStr[${unitStr}] unitProportion[${unitProportion}] eUnitHP[${eUnitHP}] eUnitDef[${eUnitDef}] enemyProportion[${enemyProportion}]`);
        if(dmg < 0) dmg = 0;

        // 5. make the objective take the damage
        enemyUnit.hp -= dmg;
        if(dmg > 0) {
            this.applySpecialEffectsOnDamage(enemyUnit);
        }

        // 6. response with a counter-attack only if adjacent and the enemy survied:
        const distance=Math.abs(cursor.x-state6Cursor.x)+Math.abs(cursor.y-state6Cursor.y);
        if(distance <= 1 && enemyUnit.hp > 0) {
            // 7. with the new HP of the objective resolve the objective final damage
            eUnitHP = enemyUnit.hp;
            enemyProportion = Math.log(1+(k*(eUnitHP/100))) / Math.log(1+k);

            dmg = Math.floor((enemyProportion * eUnitStr)-(unitProportion * unitDef));
            console.log(`counter-attack: distance[${distance}] dmg[${dmg}] unitHP[${unitHP}] unitDef[${unitDef}] unitProportion[${unitProportion}] eUnitHP[${eUnitHP}] eUnitStr[${eUnitStr}]enemyProportion[${enemyProportion}]`);

            // 8. make the attacker take the damage
            if(dmg < 0) dmg = 0;
            state50Unit.hp -= dmg;
            if(dmg > 0) {
                this.applySpecialEffectsOnDamage(state50Unit);
            }
        }

        // 9. finish the turn with this.moveSelected();
        this.moveSelected();

        // 10. destroy de killed units
        gameController.resolveHPUnits();
    },
    specialUnitBonus: function(unit,terrain) {
        let bonus = {str:0,def:0};
        switch(unit.name) {
            case UNIT_ASSASSIN:
                if(terrain.sprite === TERRAIN_THICKET || terrain.sprite === TERRAIN_FOREST || terrain.sprite === TERRAIN_MOUNTAIN) {
                    bonus.str += terrain.defBonus;
                }
                break;
            case UNIT_RANGER:
                if(terrain.sprite === TERRAIN_CASTLE || terrain.sprite === TERRAIN_KEEP || terrain.sprite === TERRAIN_MOUNTAIN) {
                    bonus.str += terrain.defBonus;
                }
                break;
        }
        return bonus;
    },
    applySpecialEffectsOnDamage: function(unit) {
        for(let s=0;s < unit.status.length; s++) {
            let stat = unit.status[s];
            stat.effects.forEach(effect => {
                if(effect.special === "lostOnDamage") {
                    console.log("lostOnDamage["+unit._id+"] status["+s+"]");
                    unit.status.splice(s,1);
                    s--;
                }
            });
        }
    },
    accept65Menu: function() {
        const selected = document.getElementById("menu65_"+menuCursor);
        const tds=selected.getElementsByTagName("td");
        const action = tds[0].id;
        console.log(action);

        if(action === "menu65_cancel") {
            state5Controller.cancelMoveUnit();
            return;
        }

        const actionSelected = action.split("_");
        const skillSelected = actionSelected[1];
        
        state6Cursor = {...cursor};
        splash.cancelS50Splash();

        state50Unit.skills.forEach(skill => {
            if(skill.name === skillSelected) {
                action65 = JSON.parse(JSON.stringify(skill)); //cloned
            }
        });

        const currentRage = action65.range;

        mapController.showSkillRange(state6Cursor.x,state6Cursor.y,currentRage);
        mapController.showSkillArea(cursor.x,cursor.y,action65.area,action65.harmfull,cursor.x,cursor.y);
        // and show area of effect
        gameState = STATE_66_UNIT_TARGET_SKILL;
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
        gameState = STATE_60_UNIT_MOVE;
    },
    executeSkill: function() {
        // state50Unit is the attacker
        // in cursor is the objective
        // in state6Cursor is the attacker final position,  moveSelected()
        // action65 is the skill used
        //unitHarmfullRange
        //unitAllyRange

        // 0. Validate target is on harmfull or ally range
        const typeOfTargets = action65.harmfull?"unitHarmfullRange":"unitAllyRange";
        const ranges=document.getElementsByClassName(typeOfTargets);

        state50Unit.mp -= action65.mp;
        state50Unit.x=state6Cursor.x; // the caster must be in the new position to get their benefits
        state50Unit.y=state6Cursor.y;

        for(let r=0;r<ranges.length;r++) {
            const rangeId = ranges[r].id;
            // "skillRangeX"+initialX+"Y"+initialY;
            // /skillRangeX(\d+)Y(\d+)/ :
            // 0 - complete string
            // 1 - x
            // 2 - y
            const rangePos = /skillAreaX(\d+)Y(\d+)/.exec(rangeId);
            if(rangePos.length===3){
                // 1. get objectives
                const xPos = parseInt(rangePos[1]);
                const yPos = parseInt(rangePos[2]);
                let targetUnit = gameController.getUnit(xPos,yPos);
                if(targetUnit) { 
                    const isAllie = targetUnit.playerIndex === state50Unit.playerIndex;
                    if(isAllie && !action65.harmfull || !isAllie && action65.harmfull) {
                        console.log("is a target!!");
                        // 2. pass the status to the targuet
                        let stat= JSON.parse(JSON.stringify(action65)); //cloned
                        for(let e=0;e < stat.effects.length; e++) {
                            let effect = stat.effects[e];
                            console.log("effect in "+effect.atribute);
                            let applySpecials = false;
                            if((effect.atribute === "hp" || effect.atribute === "mp") && effect.turn === 0) {
                                let newAtr = targetUnit[effect.atribute]+effect.bonus;
                                if(newAtr>100) newAtr=100;
                                console.log("newAtr["+newAtr+"]");
                                targetUnit[effect.atribute]=newAtr;
                                effect.turn--;
                                applySpecials = true;
                            }

                            if(effect.atribute === "hp" && stat.harmfull && applySpecials) {
                                this.applySpecialEffectsOnDamage(targetUnit);
                            }
                            if(applySpecials) this.applySpecialEffects(targetUnit,effect);
                            
                            if(effect.turn === -1){
                                stat.effects.splice(e,1);
                                e--;
                            }
                        }

                        // store the new stat
                        if(stat.effects.length > 0) {
                            console.log("Persistent effect on unit ");

                            // but first lets delete previous not stackable stats
                            const statName = stat.name;
                            for (let i=0; i < targetUnit.status.length; i ++) {
                                if(targetUnit.status[i].name === statName) {
                                    console.log("Persistent effect not stackable");
                                    targetUnit.status.splice(i,1);
                                    i--;
                                }
                            }

                            // new stat on unit
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
                let pahtiaCount=0;
                players[unit.playerIndex].units.forEach(un => {
                    un.status.forEach(stt => {
                        if(stt.name === "Pahtia") pahtiaCount++;
                    });
                });
                unit.mp += pahtiaCount * 2;
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
                const posX = unit.x;
                const posY = unit.y;
                const terrain = theMap.arrayTerrain[posY].row[posX].terrain;
                if(terrain.sprite === TERRAIN_MOUNTAIN || terrain.sprite === TERRAIN_CASTLE) {
                    unit.hp -= 20;
                    this.applySpecialEffectsOnDamage(unit);
                }
                break;
            case "onePerHarmfull":
                let hCount=0;
                players.forEach((player,index) => {
                    if(index !== unit.playerIndex){
                        player.units.forEach(un => {
                            un.status.forEach(stt => {
                                if(stt.harmfull) hCount++;
                            });
                        });
                    }
                });
                unit.mp += hCount; // * 1;
                if(unit.mp>100) unit.mp = 100;
                break;
        }
    }
}