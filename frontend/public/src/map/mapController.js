var mapXsize = 15;
var mapYsize = 15;
var mapController = {
    createTiles: function() {
        var dimention = new Dimention(mapXsize,mapYsize);
        dimention.init();
        document.getElementById("wtGame").innerHTML="";
        if(dimention.tiles < 20) throw new Error("Map is too big for this display, play an smaller map");
        for(var i=0; i<dimention.mapMaxX; i++) {
            for(var j=0;j<dimention.mapMaxY; j++) {
                var pastoRandom = Math.floor(Math.random()*11);
                Tile.insertDOM(i,j,dimention,"../../img/map/pasto"+pastoRandom+".png");
            }
        }
    },
    redrawTiles: function(dimention) {
        for(var i=0; i<dimention.mapMaxX; i++) {
            for(var j=0;j<dimention.mapMaxY; j++) {
                Tile.updateDom(i,j,dimention);
            }
        }
    }
};