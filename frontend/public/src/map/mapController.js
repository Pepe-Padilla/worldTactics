// Globals used (on gameController):
var mapController = {
    createTiles: function(map) {
        console.log(map);
        theMap = map;
        mapXsize = map.xSize;
        mapYsize = map.ySize;
        var dimention = new Dimention(mapXsize,mapYsize);
        dimention.init();
        document.getElementById("wtGame").innerHTML="";
        
        if(dimention.tiles < 20) throw new Error("Map is too big for this display, play an smaller map");
        
        var IMAGE_PATH = "../../img/map/";
        var IMAGE_EXTENTION = ".png";
        for(var i=0; i<dimention.mapMaxX; i++) {
            for(var j=0;j<dimention.mapMaxY; j++) {
                var sprite = map.arrayTerrain[j].row[i].terrain.sprite;
                var spritesMax = map.arrayTerrain[j].row[i].terrain.spritesMax;
                var randomNum = Math.floor(Math.random()*(spritesMax-1));
                Tile.insertDOM(i,j,dimention,IMAGE_PATH+sprite+(randomNum)+IMAGE_EXTENTION);
            }
        }

        gameState=10;
        createPlayers(map);
    },
    redrawTiles: function(dimention) {
        for(var i=0; i<dimention.mapMaxX; i++) {
            for(var j=0;j<dimention.mapMaxY; j++) {
                Tile.updateDom(i,j,dimention);
            }
        }
        Tile.updateCursor(cursor);
        if(gameState == 40) state4Controller.state4CursorMoved();
    },
    showRangeOfUnit: function(unit,playerIndex) {
        var unitStats = gameController.getTotalStats(unit,true);
        var currentY = unit.y;
        var currentX = unit.x;
        //console.log(unitStats);
        this.showRange(currentX,currentY,unitStats.vel,unitStats.agi,true,playerIndex);
    },
    showRange: function(currentX,currentY,currentVel,currentAgi,self,playerIndex) {
        
        // see if there is a unit (not self thats always true and dont want the self unit)
        var isThereUnit = false;
        var isEnemy = false;
        if(!self) {
            for(var p=0;p<players.length;p++) {
                for(var u=0;u<players[p].units.length;u++) { 
                    if(players[p].units[u].x == currentX && players[p].units[u].y == currentY) {
                        isThereUnit = true;
                        isEnemy = p != playerIndex;
                    }
                }
            }
        }

        var currentTileId = "rangeX"+currentX+"Y"+currentY;
        var currentTile = document.getElementById(currentTileId);
        if(!currentTile && !isThereUnit) {
            // theTile info
            var idTile = "x"+currentX+"y"+currentY;
            var theTile = document.getElementById(idTile);
            var rect=theTile.getBoundingClientRect();

            currentTile = document.createElement("div");
            currentTile.id = currentTileId;
            currentTile.style.position = "absolute";
            currentTile.style.left = rect.left+"px";
            currentTile.style.top = rect.top+"px";
            currentTile.style.width = rect.width+"px";
            currentTile.style.height = rect.height+"px";
            currentTile.className="unitRange";
            document.body.appendChild(currentTile);
        }

        // North
        if(currentY > 0 && !isEnemy) {
            var vel = currentVel;
            var agi = currentAgi;
            var terrain=theMap.arrayTerrain[currentY-1].row[currentX].terrain;
            var totalSteep = (terrain.steep - ((agi/100)*terrain.steep)) < 0 ? 0 : (terrain.steep - ((agi/100)*terrain.steep));
            var velRec = 10+Math.ceil(totalSteep/10);
            if(vel >= velRec) {
                vel -= velRec;
                if(terrain.minAgi>agi) vel=0;
                this.showRange(currentX,currentY-1,vel,agi,false,playerIndex);
            }
        }
        // South
        if(currentY < theMap.ySize-1  && !isEnemy) {
            var vel = currentVel;
            var agi = currentAgi;
            var terrain=theMap.arrayTerrain[currentY+1].row[currentX].terrain;
            var totalSteep = (terrain.steep - ((agi/100)*terrain.steep)) < 0 ? 0 : (terrain.steep - ((agi/100)*terrain.steep));
            var velRec = 10+Math.ceil(totalSteep/10);
            if(vel >= velRec) {
                vel -= velRec;
                if(terrain.minAgi>agi) vel=0;
                this.showRange(currentX,currentY+1,vel,agi,false,playerIndex);
            }
        }
        // East
        if(currentX < theMap.xSize-1  && !isEnemy) {
            var vel = currentVel;
            var agi = currentAgi;
            var terrain=theMap.arrayTerrain[currentY].row[currentX+1].terrain;
            var totalSteep = (terrain.steep - ((agi/100)*terrain.steep)) < 0 ? 0 : (terrain.steep - ((agi/100)*terrain.steep));
            var velRec = 10+Math.ceil(totalSteep/10);
            if(vel >= velRec) {
                vel -= velRec;
                if(terrain.minAgi>agi) vel=0;
                this.showRange(currentX+1,currentY,vel,agi,false,playerIndex);
            }
        }
        // West
        if(currentX > 0  && !isEnemy) {
            var vel = currentVel;
            var agi = currentAgi;
            var terrain=theMap.arrayTerrain[currentY].row[currentX-1].terrain;
            var totalSteep = (terrain.steep - ((agi/100)*terrain.steep)) < 0 ? 0 : (terrain.steep - ((agi/100)*terrain.steep));
            var velRec = 10 + Math.ceil(totalSteep/10);
            if(vel >= velRec) {
                vel -= velRec;
                if(terrain.minAgi>agi) vel=0;
                this.showRange(currentX-1,currentY,vel,agi,false,playerIndex);
            }
        }
    },
    cancelRange: function() {
        var ranges = document.getElementsByClassName("unitRange");
        for(var r=0;r<ranges.length;r++) {
            if(ranges[r]) {
                ranges[r].remove();
                r--;
            }
        }
    },
    cancelXRange: function() {
        var ranges=document.getElementsByClassName("unitHarmfullRange");
        for(var r=0;r<ranges.length;r++) {
            if(ranges[r]) {
                ranges[r].remove();
                r--;
            }
        }
        ranges=document.getElementsByClassName("unitAllyRange");
        for(var r=0;r<ranges.length;r++) {
            if(ranges[r]) {
                ranges[r].remove();
                r--;
            }
        }
        ranges=document.getElementsByClassName("skillRange");
        for(var r=0;r<ranges.length;r++) {
            if(ranges[r]) {
                ranges[r].remove();
                r--;
            }
        }
    },
    cancelXArea: function () {
        var ranges=document.getElementsByClassName("unitHarmfullRange");
        for(var r=0;r<ranges.length;r++) {
            if(ranges[r]) {
                ranges[r].remove();
                r--;
            }
        }
        ranges=document.getElementsByClassName("unitAllyRange");
        for(var r=0;r<ranges.length;r++) {
            if(ranges[r]) {
                ranges[r].remove();
                r--;
            }
        }
    },
    redrawRanges: function() {
        var ranges = document.getElementsByClassName("unitRange");
        for(var r=0;r<ranges.length;r++) {
            if(ranges[r]) {
                var rangeId = ranges[r].id;
                //var currentTileId = "rangeX"+currentX+"Y"+currentY;
                // /rangeX(\d+)Y(\d+)/ :
                // 0 - complete string
                // 1 - x
                // 2 - y
                var rangePos = /rangeX(\d+)Y(\d+)/.exec(rangeId);
                if(rangePos.length==3){
                    var rangeX = rangePos[1];
                    var rangeY = rangePos[2];

                    // theTile info
                    var idTile = "x"+rangeX+"y"+rangeY;
                    var theTile = document.getElementById(idTile);
                    var rect=theTile.getBoundingClientRect();
                    
                    ranges[r].style.position = "absolute";
                    ranges[r].style.left = rect.left+"px";
                    ranges[r].style.top = rect.top+"px";
                    ranges[r].style.width = rect.width+"px";
                    ranges[r].style.height = rect.height+"px";
                }
            }
        }
        ranges=document.getElementsByClassName("unitHarmfullRange");
        for(var r=0;r<ranges.length;r++) {
            if(ranges[r]) {
                var rangeId = ranges[r].id;
                //var currentTileId = "rangeX"+currentX+"Y"+currentY;
                // /rangeX(\d+)Y(\d+)/ :
                // 0 - complete string
                // 1 - x
                // 2 - y
                var rangePos = /rangeX+(\d+)Y(\d+)/.exec(rangeId);
                if(rangePos.length==3){
                    var rangeX = rangePos[1];
                    var rangeY = rangePos[2];

                    // theTile info
                    var idTile = "x"+rangeX+"y"+rangeY;
                    var theTile = document.getElementById(idTile);
                    var rect=theTile.getBoundingClientRect();
                    
                    ranges[r].style.position = "absolute";
                    ranges[r].style.left = rect.left+"px";
                    ranges[r].style.top = rect.top+"px";
                    ranges[r].style.width = rect.width+"px";
                    ranges[r].style.height = rect.height+"px";
                }
            }
        }
        ranges=document.getElementsByClassName("unitAllyRange");
        for(var r=0;r<ranges.length;r++) {
            if(ranges[r]) {
                var rangeId = ranges[r].id;
                //var currentTileId = "rangeX"+currentX+"Y"+currentY;
                // /rangeX(\d+)Y(\d+)/ :
                // 0 - complete string
                // 1 - x
                // 2 - y
                var rangePos = /rangeX+(\d+)Y(\d+)/.exec(rangeId);
                if(rangePos.length==3){
                    var rangeX = rangePos[1];
                    var rangeY = rangePos[2];

                    // theTile info
                    var idTile = "x"+rangeX+"y"+rangeY;
                    var theTile = document.getElementById(idTile);
                    var rect=theTile.getBoundingClientRect();
                    
                    ranges[r].style.position = "absolute";
                    ranges[r].style.left = rect.left+"px";
                    ranges[r].style.top = rect.top+"px";
                    ranges[r].style.width = rect.width+"px";
                    ranges[r].style.height = rect.height+"px";
                }
            }
        }
    },
    showXRange: function(currentX,currentY,currentXrange,harmfull,playerIndex) {
        
        // see if there is a unit
        var isTarget = false;
        for(var p=0;p<players.length;p++) {
            for(var u=0;u<players[p].units.length;u++) { 
                if(players[p].units[u].x == currentX && players[p].units[u].y == currentY) {
                    isTarget = !((p == playerIndex) == harmfull); // XOR
                }
            }
        }

        var currentTileId = "rangeXX"+currentX+"Y"+currentY;
        var currentTile = document.getElementById(currentTileId);
        if(!currentTile && isTarget) {
            // theTile info
            var idTile = "x"+currentX+"y"+currentY;
            var theTile = document.getElementById(idTile);
            var rect=theTile.getBoundingClientRect();

            currentTile = document.createElement("div");
            currentTile.id = currentTileId;
            currentTile.style.position = "absolute";
            currentTile.style.left = rect.left+"px";
            currentTile.style.top = rect.top+"px";
            currentTile.style.width = rect.width+"px";
            currentTile.style.height = rect.height+"px";
            if(harmfull) currentTile.className="unitHarmfullRange";
            else         currentTile.className="unitAllyRange";
            document.body.appendChild(currentTile);
        }

        if(currentXrange<=0) return;

        var aRange = currentXrange;
        aRange--;

        // North
        if(currentY > 0) {
            this.showXRange(currentX,currentY-1,aRange,harmfull,playerIndex);
        }
        // South
        if(currentY < theMap.ySize-1) {
            this.showXRange(currentX,currentY+1,aRange,harmfull,playerIndex);
        }
        // East
        if(currentX < theMap.xSize-1) {
            this.showXRange(currentX+1,currentY,aRange,harmfull,playerIndex);
        }
        // West
        if(currentX > 0) {
            this.showXRange(currentX-1,currentY,aRange,harmfull,playerIndex);
        }
    },
    showSkillArea: function(currentX,currentY,currentArea,harmfull,initialX,initialY) {
        var idIniTile = "skillRangeX"+initialX+"Y"+initialY;
        var theIniTile = document.getElementById(idIniTile);
        if(!theIniTile) return; // only inside  the skill Range

        var currentTileId = "skillAreaX"+currentX+"Y"+currentY;
        var currentTile = document.getElementById(currentTileId);
        if(!currentTile) {
            var idTile = "x"+currentX+"y"+currentY;
            var theTile = document.getElementById(idTile);
            var rect=theTile.getBoundingClientRect();
            
            currentTile = document.createElement("div");
            currentTile.id = currentTileId;
            currentTile.style.position = "absolute";
            currentTile.style.left = rect.left+"px";
            currentTile.style.top = rect.top+"px";
            currentTile.style.width = rect.width+"px";
            currentTile.style.height = rect.height+"px";
            if(harmfull) currentTile.className="unitHarmfullRange";
            else currentTile.className="unitAllyRange";
            document.body.appendChild(currentTile);
        }

        var aRange = currentArea;
        aRange--;
        if(aRange<=0) return;

        // North
        if(currentY > 0) {
            this.showSkillArea(currentX,currentY-1,aRange, harmfull,initialX,initialY);
        }
        // South
        if(currentY < theMap.ySize-1) {
            this.showSkillArea(currentX,currentY+1,aRange, harmfull,initialX,initialY);
        }
        // East
        if(currentX < theMap.xSize-1) {
            this.showSkillArea(currentX+1,currentY,aRange,harmfull,initialX,initialY);
        }
        // West
        if(currentX > 0) {
            this.showSkillArea(currentX-1,currentY,aRange,harmfull,initialX,initialY);
        }
    },
    showSkillRange: function(currentX,currentY,currentArea) {
        var currentTileId = "skillRangeX"+currentX+"Y"+currentY;
        var currentTile = document.getElementById(currentTileId);
        if(!currentTile) {
            // theTile info
            var idTile = "x"+currentX+"y"+currentY;
            var theTile = document.getElementById(idTile);
            var rect=theTile.getBoundingClientRect();

            currentTile = document.createElement("div");
            currentTile.id = currentTileId;
            currentTile.style.position = "absolute";
            currentTile.style.left = rect.left+"px";
            currentTile.style.top = rect.top+"px";
            currentTile.style.width = rect.width+"px";
            currentTile.style.height = rect.height+"px";
            currentTile.className="skillRange";
            document.body.appendChild(currentTile);
        }

        //console.log("currentX[%s] currentY[%s] currentArea[%s]",currentX,currentY,currentArea);
        if(currentArea<=0) return;

        var aRange = currentArea;
        aRange--;

        // North
        if(currentY > 0) {
            this.showSkillRange(currentX,currentY-1,aRange);
        }
        // South
        if(currentY < theMap.ySize-1) {
            this.showSkillRange(currentX,currentY+1,aRange);
        }
        // East
        if(currentX < theMap.xSize-1) {
            this.showSkillRange(currentX+1,currentY,aRange);
        }
        // West
        if(currentX > 0) {
            this.showSkillRange(currentX-1,currentY,aRange);
        }
    },
};

var createPlayers= function(map) {
    var colors=["blue","red","green","purple","orange","lime","yellow","silver","black","white"];
    for(var i=0;i<map.xSize;i++) {
        for(var j=0;j<map.ySize; j++) {
            if(map.arrayTerrain[j].row[i].terrain.sprite=="casttle") {
                var index = players.length;
                if(index>9) throw new Error("Map recives too many players");
                map.arrayTerrain[j].row[i].terrain.taker=index;
                players[index] = {
                    playerName:"Player "+ (index+1),
                    color: colors[index],
                    buildings: [{x:i,y:j,terrain:map.arrayTerrain[j].row[i].terrain}],
                    units:[],
                    gold: 90
                };
                Tile.takeBulding(i,j,colors[index],true);
            }
        }
    }
    console.log(""+players.length+" players detected");
    if(players.length == 0) throw new Error("Map have no casttles there are no players");
    var theColor= players[0].color;
    cursor.x=players[0].buildings[0].x;
    cursor.y=players[0].buildings[0].y;
    Tile.createCursor(cursor,theColor);
    gameState=20;
    state3Controller.createInitialUnits();
    gameController.initGame();
    
}