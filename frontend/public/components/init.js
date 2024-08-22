console.log("Inireaded");
document.addEventListener('DOMContentLoaded', function() {
    init.initGame();
}, false);

var init = {
    initGame: function() {
        console.log("Game INI");
        var dimention = new Dimention(10,11);
        dimention.init();
        init.redrawTiles(dimention);
        keyboard.init();
        gamepad.init();
        mainLoop.iteration();
    },
    redrawTiles: function(dimention) {
        document.getElementById("wtGame").innerHTML="";
        var l = dimention.tiles;
        var xMargin = dimention.withMargin;
        var yMargin = dimention.heightMargin;
        if(l < 20) throw new Error("Map is too big for this display, play an smaller map");
        for(var i=0; i<dimention.mapMaxX; i++) {
            for(var j=0;j<dimention.mapMaxY; j++) {
                new Rectangle((l*i)+xMargin,(l*j)+yMargin,l,l);
            }
        }
        
    }
}
