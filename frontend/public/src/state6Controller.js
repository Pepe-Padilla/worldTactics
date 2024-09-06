var state6Cursor = null;
var action67=null;
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
            case "menu60_skill":
                //console.log(action);
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
        splash.skillS50Splash();
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

        // 9. destroy de killed units
        gameController.resolveHPUnits();

        // 8. finish the turn with this.moveSelected();
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
        for(var s;s < unit.status.lenght; s++) {
            var stat = unit.status[s];
            stat.effects.forEach(effect => {
                if(effect.special == "lostOnDamage") {
                    unit.status.splice(s,1);
                    s--;
                }
            });
        };
    },
}