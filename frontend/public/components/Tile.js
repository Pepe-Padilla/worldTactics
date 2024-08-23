class Tile {
    static insertDOM(x, y, dimention,sprite) {
        // create DOM
        var idTile = "x"+x+"y"+y;
        var div = '<div id="'+idTile+'"></div>'
        var wtGame = document.getElementById("wtGame").innerHTML;
        document.getElementById("wtGame").innerHTML = wtGame + div;

        // update DOM
        Tile.updateDom(x, y, dimention,sprite);
    }

    static updateDom(x, y, dimention,sprite) {
        var idTile = "x"+x+"y"+y;
        document.getElementById(idTile).style.position = "absolute";
        document.getElementById(idTile).style.left = ((x*dimention.tiles)+dimention.widthMargin) + "px";
        document.getElementById(idTile).style.top =  ((y*dimention.tiles)+dimention.heightMargin) + "px";
        document.getElementById(idTile).style.width = dimention.tiles + "px";
        document.getElementById(idTile).style.height = dimention.tiles + "px";
        if(sprite) Tile.updateSprite(x,y,sprite);
    }

    static updateSprite(x,y,sprite) {
        var idTile = "x"+x+"y"+y;
        document.getElementById(idTile).style.background = "url("+sprite+")";
        document.getElementById(idTile).style.backgroundSize="100% 100%";
    }
}