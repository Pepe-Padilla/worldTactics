// Globals used (on gameController):
//var theMap=null;
//var players=[];
//var cursor={x:0,y:0};

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

        gameState=1;
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
                    units:new Array()
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
    gameState=2;
    
}