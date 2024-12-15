// Globals used (on gameController):
let mapController = {
    createTiles: function (map, uploaded) {
        console.log(map);
        theMap = map;
        let mapXSize = map.xSize;
        let mapYSize = map.ySize;
        const dimension = new Dimention(mapXSize, mapYSize);
        dimension.init();
        document.getElementById("wtGame").innerHTML = "";

        if (dimension.tiles < 20) throw new Error("Map is too big for this display, play an smaller map");

        const IMAGE_PATH = "../../img/map/";
        const IMAGE_EXTENSION = ".png";
        for (let i = 0; i < dimension.mapMaxX; i++) {
            for (let j = 0; j < dimension.mapMaxY; j++) {
                const sprite = map.arrayTerrain[j].row[i].terrain.sprite;
                const spritesMax = map.arrayTerrain[j].row[i].terrain.spritesMax;
                const randomNum = Math.floor(Math.random() * (spritesMax - 1));
                Tile.insertDOM(i, j, dimension, IMAGE_PATH + sprite + (randomNum) + IMAGE_EXTENSION);
            }
        }

        if (!uploaded) {
            gameState = STATE_10_MAP_CHARGED;
            createPlayers(map);
        }
    },
    redrawTiles: function (dimension) {
        for (let i = 0; i < dimension.mapMaxX; i++) {
            for (let j = 0; j < dimension.mapMaxY; j++) {
                Tile.updateDom(i, j, dimension);
            }
        }
        Tile.updateCursor(cursor);
        if (gameState === STATE_40_TURN_ACTIVE) state4Controller.state4CursorMoved();
    },
    showRangeOfUnit: function (unit, playerIndex) {
        const unitStats = gameController.getTotalStats(unit, true);
        const currentY = unit.y;
        const currentX = unit.x;
        //console.log(unitStats);
        this.showRange(currentX, currentY, unitStats.vel, unitStats.agi, true, playerIndex);
    },
    createCurrentTile: function(currentX,currentY,currentTileId) {
        const idTile = "x" + currentX + "y" + currentY;
        const theTile = document.getElementById(idTile);
        const rect = theTile.getBoundingClientRect();

        let currentTile = document.createElement("div");
        currentTile.id = currentTileId;
        currentTile.style.position = "absolute";
        currentTile.style.left = rect.left + "px";
        currentTile.style.top = rect.top + "px";
        currentTile.style.width = rect.width + "px";
        currentTile.style.height = rect.height + "px";
        return currentTile;
    },
    calculateVelRec:function(terrain,currentAgi){
        const totalSteep = (terrain.steep - ((currentAgi / 100) * terrain.steep)) < 0 ? 0 : (terrain.steep - ((currentAgi / 100) * terrain.steep));
        return 10 + Math.round(totalSteep / 10);
    },
    showRange: function (currentX, currentY, currentVel, currentAgi, self, playerIndex) {

        // see if there is a unit (not self that's always true and don't want the self unit)
        let isThereUnit = false;
        let isEnemy = false;
        if (!self) {
            for (let p = 0; p < players.length; p++) {
                for (let u = 0; u < players[p].units.length; u++) {
                    if (players[p].units[u].x === currentX && players[p].units[u].y === currentY) {
                        isThereUnit = true;
                        isEnemy = p !== playerIndex;
                    }
                }
            }
        }

        const currentTileId = "rangeX" + currentX + "Y" + currentY;
        let currentTile = document.getElementById(currentTileId);
        if (!currentTile && !isThereUnit) {
            // theTile info
            currentTile = this.createCurrentTile(currentX,currentY,currentTileId);
            currentTile.className = "unitRange";
            document.body.appendChild(currentTile);
        }

        // North
        if (currentY > 0 && !isEnemy) {
            let vel = currentVel;
            const terrain = theMap.arrayTerrain[currentY - 1].row[currentX].terrain;
            const velRec = this.calculateVelRec(terrain,currentAgi);
            if (vel >= velRec) {
                vel -= velRec;
                if (terrain.minAgi > currentAgi) vel = 0;
                this.showRange(currentX, currentY - 1, vel, currentAgi, false, playerIndex);
            }
        }
        // South
        if (currentY < theMap.ySize - 1 && !isEnemy) {
            let vel = currentVel;
            const terrain = theMap.arrayTerrain[currentY + 1].row[currentX].terrain;
            const velRec = this.calculateVelRec(terrain,currentAgi);
            if (vel >= velRec) {
                vel -= velRec;
                if (terrain.minAgi > currentAgi) vel = 0;
                this.showRange(currentX, currentY + 1, vel, currentAgi, false, playerIndex);
            }
        }
        // East
        if (currentX < theMap.xSize - 1 && !isEnemy) {
            let vel = currentVel;
            const terrain = theMap.arrayTerrain[currentY].row[currentX + 1].terrain;
            const velRec = this.calculateVelRec(terrain,currentAgi);
            if (vel >= velRec) {
                vel -= velRec;
                if (terrain.minAgi > currentAgi) vel = 0;
                this.showRange(currentX + 1, currentY, vel, currentAgi, false, playerIndex);
            }
        }
        // West
        if (currentX > 0 && !isEnemy) {
            let vel = currentVel;
            const terrain = theMap.arrayTerrain[currentY].row[currentX - 1].terrain;
            const velRec = this.calculateVelRec(terrain,currentAgi);
            if (vel >= velRec) {
                vel -= velRec;
                if (terrain.minAgi > currentAgi) vel = 0;
                this.showRange(currentX - 1, currentY, vel, currentAgi, false, playerIndex);
            }
        }
    },
    cancelRangeByClassName: function (className) {
        let ranges = document.getElementsByClassName(className);
        for (let r = 0; r < ranges.length; r++) {
            if (ranges[r]) {
                ranges[r].remove();
                r--;
            }
        }
    },
    cancelRange: function () {
        this.cancelRangeByClassName("unitRange");
    },
    cancelXRange: function () {
        this.cancelRangeByClassName("unitHarmfullRange");
        this.cancelRangeByClassName("unitAllyRange");
        this.cancelRangeByClassName("skillRange");
    },
    cancelXArea: function () {
        this.cancelRangeByClassName("unitHarmfullRange");
        this.cancelRangeByClassName("unitAllyRange");
    },
    getRectById:function(rangeX,rangeY) {
        const idTile = "x" + rangeX + "y" + rangeY;
        const theTile = document.getElementById(idTile);
        return theTile.getBoundingClientRect();
    },
    redrawRangesByClassName:function(rects,className) {
        let ranges = document.getElementsByClassName(className);
        for (let r = 0; r < ranges.length; r++) {
            if (ranges[r]) {
                const rangeId = ranges[r].id;
                //var currentTileId = "rangeX"+currentX+"Y"+currentY;
                // /rangeX(\d+)Y(\d+)/ :
                // 0 - complete string
                // 1 - x
                // 2 - y
                const rangePos = /rangeX(\d+)Y(\d+)/.exec(rangeId);
                if (rangePos.length === 3) {
                    const rangeX = rangePos[1];
                    const rangeY = rangePos[2];
                    if(!rects[rangeX+"-"+rangeY]) {
                        rects[rangeX+"-"+rangeY] = this.getRectById(rangeX,rangeY);
                    }

                    // theTile info
                    const rect = rects[rangeX+"-"+rangeY];

                    ranges[r].style.position = "absolute";
                    ranges[r].style.left = rect.left + "px";
                    ranges[r].style.top = rect.top + "px";
                    ranges[r].style.width = rect.width + "px";
                    ranges[r].style.height = rect.height + "px";
                }
            }
        }
    },
    redrawRanges: function () {
        let rects = {};
        this.redrawRangesByClassName(rects,"unitRange");
        this.redrawRangesByClassName(rects,"unitHarmfullRange");
        this.redrawRangesByClassName(rects,"unitAllyRange");
    },
    showXRange: function (currentX, currentY, currentXrange, harmfull, playerIndex) {

        // see if there is a unit
        let isTarget = false;
        for (let p = 0; p < players.length; p++) {
            for (let u = 0; u < players[p].units.length; u++) {
                if (players[p].units[u].x === currentX && players[p].units[u].y === currentY) {
                    isTarget = !((p === playerIndex) === harmfull); // XOR
                }
            }
        }

        let currentTileId = "rangeXX" + currentX + "Y" + currentY;
        let currentTile = document.getElementById(currentTileId);
        if (!currentTile && isTarget) {
            // theTile info
            currentTile = this.createCurrentTile(currentX,currentY,currentTileId);
            if (harmfull) currentTile.className = "unitHarmfullRange";
            else currentTile.className = "unitAllyRange";
            document.body.appendChild(currentTile);
        }

        if (currentXrange <= 0) return;

        let aRange = currentXrange;
        aRange--;

        // North
        if (currentY > 0) {
            this.showXRange(currentX, currentY - 1, aRange, harmfull, playerIndex);
        }
        // South
        if (currentY < theMap.ySize - 1) {
            this.showXRange(currentX, currentY + 1, aRange, harmfull, playerIndex);
        }
        // East
        if (currentX < theMap.xSize - 1) {
            this.showXRange(currentX + 1, currentY, aRange, harmfull, playerIndex);
        }
        // West
        if (currentX > 0) {
            this.showXRange(currentX - 1, currentY, aRange, harmfull, playerIndex);
        }
    },
    showSkillArea: function (currentX, currentY, currentArea, harmfull, initialX, initialY) {
        const idIniTile = "skillRangeX" + initialX + "Y" + initialY;
        const theIniTile = document.getElementById(idIniTile);
        if (!theIniTile) return; // only inside  the skill Range

        const currentTileId = "skillAreaX" + currentX + "Y" + currentY;
        let currentTile = document.getElementById(currentTileId);
        if (!currentTile) {
            currentTile = this.createCurrentTile(currentX,currentY,currentTileId);
            if (harmfull) currentTile.className = "unitHarmfullRange";
            else currentTile.className = "unitAllyRange";
            document.body.appendChild(currentTile);
        }

        let aRange = currentArea;
        aRange--;
        if (aRange <= 0) return;

        // North
        if (currentY > 0) {
            this.showSkillArea(currentX, currentY - 1, aRange, harmfull, initialX, initialY);
        }
        // South
        if (currentY < theMap.ySize - 1) {
            this.showSkillArea(currentX, currentY + 1, aRange, harmfull, initialX, initialY);
        }
        // East
        if (currentX < theMap.xSize - 1) {
            this.showSkillArea(currentX + 1, currentY, aRange, harmfull, initialX, initialY);
        }
        // West
        if (currentX > 0) {
            this.showSkillArea(currentX - 1, currentY, aRange, harmfull, initialX, initialY);
        }
    },
    showSkillRange: function (currentX, currentY, currentArea) {
        const currentTileId = "skillRangeX" + currentX + "Y" + currentY;
        let currentTile = document.getElementById(currentTileId);
        if (!currentTile) {
            // theTile info
            currentTile = this.createCurrentTile(currentX,currentY,currentTileId);
            currentTile.className = "skillRange";
            document.body.appendChild(currentTile);
        }

        //console.log("currentX[%s] currentY[%s] currentArea[%s]",currentX,currentY,currentArea);
        if (currentArea <= 0) return;

        let aRange = currentArea;
        aRange--;

        // North
        if (currentY > 0) {
            this.showSkillRange(currentX, currentY - 1, aRange);
        }
        // South
        if (currentY < theMap.ySize - 1) {
            this.showSkillRange(currentX, currentY + 1, aRange);
        }
        // East
        if (currentX < theMap.xSize - 1) {
            this.showSkillRange(currentX + 1, currentY, aRange);
        }
        // West
        if (currentX > 0) {
            this.showSkillRange(currentX - 1, currentY, aRange);
        }
    },
};

let createPlayers= function(map) {
    for(let i=0;i<map.xSize;i++) {
        for(let j=0;j<map.ySize; j++) {
            if(map.arrayTerrain[j].row[i].terrain.sprite === TERRAIN_CASTLE) {
                let index = players.length;
                if(index>9) throw new Error("Map recives too many players");
                map.arrayTerrain[j].row[i].terrain.taker=index;
                players[index] = {
                    playerName:"Player "+ (index+1),
                    color: COLORS_PLAYERS[index],
                    buildings: [{x:i,y:j,terrain:map.arrayTerrain[j].row[i].terrain}],
                    units:[],
                    gold: GOLD_INITIAL
                };
                Tile.takeBuilding(i,j,COLORS_PLAYERS[index],true);
            }
        }
    }
    console.log(""+players.length+" players detected");
    if(players.length === 0) throw new Error("Map have no castles there are no players");
    const theColor= players[0].color;
    cursor.x=players[0].buildings[0].x;
    cursor.y=players[0].buildings[0].y;
    Tile.createCursor(cursor,theColor);
    gameState=STATE_20_PLAYERS_CHARGED;
    state3Controller.createInitialUnits();
    gameController.initGame();
    
}