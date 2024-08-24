class Tile {
    static insertDOM(x, y, dimention,sprite) {
        // create DOM
        var idTile = "x"+x+"y"+y;
        var div = '<div id="'+idTile+'"></div>'
        var wtGame = document.getElementById("wtGame").innerHTML;
        document.getElementById("wtGame").innerHTML = wtGame + div;
        var theTile = document.getElementById(idTile);
        theTile.style.zIndex = 1;

        // update DOM
        Tile.updateDom(x, y, dimention,sprite);
    }

    static updateDom(x, y, dimention,sprite) {
        var idTile = "x"+x+"y"+y;
        var theTile = document.getElementById(idTile);
        theTile.style.position = "absolute";
        theTile.style.left = ((x*dimention.tiles)+dimention.widthMargin) + "px";
        theTile.style.top =  ((y*dimention.tiles)+dimention.heightMargin) + "px";
        theTile.style.width = dimention.tiles + "px";
        theTile.style.height = dimention.tiles + "px";
        
        if(sprite) Tile.updateSprite(x,y,sprite);
    }

    static updateSprite(x,y,sprite) {
        var idTile = "x"+x+"y"+y;
        var theTile = document.getElementById(idTile);
        theTile.style.background = "url("+sprite+")";
        theTile.style.backgroundSize="100% 100%";
    }

    static createCursor(cursor,color) {
        var idTile = "x"+cursor.x+"y"+cursor.y;
        var theTile = document.getElementById(idTile);
        theTile.style.zIndex = 2;
        theTile.style.border = "3px solid "+color;
    }

    static updateCursor(lastX,lastY,cursor,color) {
        var idTile = "x"+cursor.x+"y"+cursor.y;
        var theTile = document.getElementById(idTile);
        theTile.style.zIndex = 2;
        theTile.style.border = "3px solid "+color;

        var lastIdTile = "x"+lastX+"y"+lastY;
        var lastTile = document.getElementById(lastIdTile);
        lastTile.style.zIndex = 1;
        lastTile.style.border = "none";
    }
}