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
        gameController.initGame();
    },
    redrawTiles: function(dimention) {
        for(var i=0; i<dimention.mapMaxX; i++) {
            for(var j=0;j<dimention.mapMaxY; j++) {
                Tile.updateDom(i,j,dimention);
            }
        }
        Tile.updateCursor(cursor);
        gameController.state4CursorMoved();
    },
    showRangeOfUnit: function(unit) {
        var unitStats = gameController.getTotalStats(unit);
        var currentY = unit.y;
        var currentX = unit.x;
        console.log(unitStats);
        this.showRange(currentX,currentY,unitStats.vel,unitStats.agi);
    },
    showRange: function(currentX,currentY,currentVel,currentAgi) {
        var currentTileId = "rangeX"+currentX+"Y"+currentY;
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
            currentTile.className="unitRange";
            document.body.appendChild(currentTile);
        }
        //theMap.xSize
        // North
        if(currentY > 0) {
            var vel = currentVel;
            var agi = currentAgi;
            var terrain=theMap.arrayTerrain[currentY-1].row[currentX].terrain;
            var totalSteep = (terrain.steep - agi) < 0 ? 0 : (terrain.steep - agi);
            var velRec = 10+Math.ceil(totalSteep/10);
            if(vel >= velRec) {
                vel -= velRec;
                if(terrain.minAgi>agi) vel=0;
                this.showRange(currentX,currentY-1,vel,agi);
            }
        }
        // South
        if(currentY < theMap.ySize-1) {
            var vel = currentVel;
            var agi = currentAgi;
            var terrain=theMap.arrayTerrain[currentY+1].row[currentX].terrain;
            var totalSteep = (terrain.steep - agi) < 0 ? 0 : (terrain.steep - agi);
            var velRec = 10+Math.ceil(totalSteep/10);
            if(vel >= velRec) {
                vel -= velRec;
                if(terrain.minAgi>agi) vel=0;
                this.showRange(currentX,currentY+1,vel,agi);
            }
        }
        // East
        if(currentX < theMap.xSize-1) {
            var vel = currentVel;
            var agi = currentAgi;
            var terrain=theMap.arrayTerrain[currentY].row[currentX+1].terrain;
            var totalSteep = (terrain.steep - agi) < 0 ? 0 : (terrain.steep - agi);
            var velRec = 10+Math.ceil(totalSteep/10);
            if(vel >= velRec) {
                vel -= velRec;
                if(terrain.minAgi>agi) vel=0;
                this.showRange(currentX+1,currentY,vel,agi);
            }
        }
        // West
        if(currentX > 0) {
            var vel = currentVel;
            var agi = currentAgi;
            var terrain=theMap.arrayTerrain[currentY].row[currentX-1].terrain;
            var totalSteep = (terrain.steep - agi) < 0 ? 0 : (terrain.steep - agi);
            var velRec = 10 + Math.ceil(totalSteep/10);
            if(vel >= velRec) {
                vel -= velRec;
                if(terrain.minAgi>agi) vel=0;
                this.showRange(currentX-1,currentY,vel,agi);
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
    }
};

var createPlayers= function(map) {
    var colors=["blue","red","yellow","purple","orange","lime","gold","silver","black","white"];
    for(var i=0;i<map.xSize;i++) {
        for(var j=0;j<map.ySize; j++) {
            if(map.arrayTerrain[j].row[i].terrain.sprite=="casttle") {
                var index = players.length;
                if(index>9) throw new Error("Map recives too many players");
                players[index] = {
                    playerName:"Player "+ (index+1),
                    color: colors[index],
                    buildings: [{x:i,y:j,terrain:map.arrayTerrain[j].row[i].terrain}],
                    units:[]
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
    
}