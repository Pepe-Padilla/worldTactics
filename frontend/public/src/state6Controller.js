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
        var unitStats = gameController.getTotalStats(state50Unit,false);
        var unitBonus = gameController.getTotalBonus(state50Unit,enemyUnit.name);
        var terrainBonus = gameController.getTerrainStats(state6Cursor.x,state6Cursor.y);
        var unitHP = state50Unit.hp;
        var unitDef = unitStats.def + unitBonus.def + state50Unit.def + terrainBonus.def;
        var unitStr = unitStats.str + unitBonus.str + state50Unit.str + terrainBonus.str;

        // 3. Get all the stats for the objective
        var eUnitStats = gameController.getTotalStats(enemyUnit,false);
        var eUnitBonus = gameController.getTotalBonus(enemyUnit,state50Unit.name);
        var eTerrainBonus = gameController.getTerrainStats(cursor.x,cursor.y);
        var eUnitHP = state50Unit.hp;
        var eUnitDef = eUnitStats.def + eUnitBonus.def + enemyUnit.def + eTerrainBonus.def;
        var eUnitStr = eUnitStats.str + eUnitBonus.str + enemyUnit.str + eTerrainBonus.str;

        // 4. Resolve the atackers final damage
        var dmg = Math.floor((unitHP/100) * unitStr)-((eUnitHP/100)*eUnitDef);
        if(dmg < 0) dmg = 0;

        // 5. make the objective take the damage
        enemyUnit.hp -= dmg;

        // only if adjacent
        var distance=Math.abs(cursor.x-state6Cursor.x)+Math.abs(cursor.y-state6Cursor.y);
        //console.log(distance);
        if(distance <= 1) {
            // 6. with the new HP of the objective resolve the objective final damage
            eUnitHP = (enemyUnit.hp + eUnitHP)/2; // average HP used
            dmg = Math.floor((eUnitHP/100) * eUnitStr)-((unitHP/100)*unitDef);

            // 7. make the atacker take the damage
            if(dmg < 0) dmg = 0;
            state50Unit.hp -= dmg;
        }

        // 9. destroy de killed units
        gameController.resolveHPUnits();

        // 8. finish the turn with this.moveSelected();
        this.moveSelected();
    }
}