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
        var idCursor = "theCursor";
        var div = '<div id="'+idCursor+'"></div>'
        var wtGame = document.getElementById("wtGame").innerHTML;
        document.getElementById("wtGame").innerHTML = wtGame + div;
        
        // tile info
        var idTile = "x"+cursor.x+"y"+cursor.y;
        var theTile = document.getElementById(idTile);
        var rect=theTile.getBoundingClientRect();

        var theCursor = document.getElementById(idCursor);
        theCursor.style.zIndex = 3;
        theCursor.style.position = "absolute";
        theCursor.style.border = "4px solid "+color;
        theCursor.style.left = (rect.x-4) + "px";
        theCursor.style.top = (rect.y-4) + "px";
        theCursor.style.width = rect.width + "px";
        theCursor.style.height = rect.height + "px";

    }

    static takeBulding(x,y,color,isNeutral) {
        var idTile = "x"+x+"y"+y;
        var theTile = document.getElementById(idTile);
        var rect=theTile.getBoundingClientRect();
        theTile.style.zIndex = 2;
        theTile.style.border = "3px dashed "+color;
        if(isNeutral) {
            theTile.style.left = (rect.x) + "px";
            theTile.style.top = (rect.y) + "px";
            theTile.style.width = (rect.width-6) + "px";
            theTile.style.height = (rect.height-6) + "px";
        }
    }

    static updateCursor(cursor,color) {
        var idCursor = "theCursor";
        
        // tile info
        var idTile = "x"+cursor.x+"y"+cursor.y;
        var theTile = document.getElementById(idTile);
        var rect=theTile.getBoundingClientRect();
        
        var theCursor = document.getElementById(idCursor);
        if(color) theTile.style.border = "4px solid "+color;
        theCursor.style.zIndex = 3;
        theCursor.style.left = (rect.x-4) + "px";
        theCursor.style.top = (rect.y-4) + "px";
        theCursor.style.width = rect.width + "px";
        theCursor.style.height = rect.height + "px";
    }
}