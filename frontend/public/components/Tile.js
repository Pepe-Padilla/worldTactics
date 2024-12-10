class Tile {
    static insertDOM(x, y, dimention,sprite) {
        // create DOM
        const idTile = "x"+x+"y"+y;
        const div = '<div id="'+idTile+'"></div>'
        const wtGame = document.getElementById("wtGame").innerHTML;
        document.getElementById("wtGame").innerHTML = wtGame + div;
        let theTile = document.getElementById(idTile);
        theTile.style.zIndex = 1;

        // update DOM
        Tile.updateDom(x, y, dimention,sprite);
    }

    static updateDom(x, y, dimention,sprite) {
        const idTile = "x"+x+"y"+y;
        let theTile = document.getElementById(idTile);
        theTile.style.position = "absolute";
        theTile.style.left = ((x*dimention.tiles)+dimention.widthMargin) + "px";
        theTile.style.top =  ((y*dimention.tiles)+dimention.heightMargin) + "px";
        theTile.style.width = dimention.tiles + "px";
        theTile.style.height = dimention.tiles + "px";
        theTile.style.border = "0px"
        
        if(sprite) Tile.updateSprite(x,y,sprite);
    }

    static updateSprite(x,y,sprite) {
        const idTile = "x"+x+"y"+y;
        let theTile = document.getElementById(idTile);
        theTile.style.background = "url("+sprite+")";
        theTile.style.backgroundSize="100% 100%";
    }

    static createCursor(cursor,color) {
        const idCursor = "theCursor";
        const div = '<div id="'+idCursor+'"></div>'
        const wtGame = document.getElementById("wtGame").innerHTML;
        document.getElementById("wtGame").innerHTML = wtGame + div;
        
        // tile info
        const idTile = "x"+cursor.x+"y"+cursor.y;
        const theTile = document.getElementById(idTile);
        const rect=theTile.getBoundingClientRect();

        let theCursor = document.getElementById(idCursor);
        theCursor.style.zIndex = 3;
        theCursor.style.position = "absolute";
        theCursor.style.border = "4px solid "+color;
        theCursor.style.left = (rect.x-4) + "px";
        theCursor.style.top = (rect.y-4) + "px";
        theCursor.style.width = rect.width + "px";
        theCursor.style.height = rect.height + "px";

    }

    static takeBulding(x,y,color,isNeutral) {
        const idTile = "x"+x+"y"+y;
        let theTile = document.getElementById(idTile);
        const rect=theTile.getBoundingClientRect();
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
        const idCursor = "theCursor";
        
        // tile info
        const idTile = "x"+cursor.x+"y"+cursor.y;
        const theTile = document.getElementById(idTile);
        const rect=theTile.getBoundingClientRect();
        
        let theCursor = document.getElementById(idCursor);
        if(color) theCursor.style.border = "4px solid "+color;
        theCursor.style.zIndex = 3;
        theCursor.style.left = (rect.x-4) + "px";
        theCursor.style.top = (rect.y-4) + "px";
        theCursor.style.width = rect.width + "px";
        theCursor.style.height = rect.height + "px";
    }

    static upsertCharacter(unit) {
        const idUnit = "unit"+unit._id;
        const IMAGE_CHA_PATH = "../img/characters/";
        const IMAGE_EXTENTION = ".png";
        
        let theUnit = document.getElementById(idUnit);
        if(!theUnit) {
            theUnit = document.createElement("div");
            document.body.appendChild(theUnit);
            theUnit.id = idUnit;
            theUnit.className="unitMetter";
            theUnit.style.zIndex = 10;
            theUnit.style.background = "url("+IMAGE_CHA_PATH+unit.sprite+"-"+players[unit.playerIndex].color+IMAGE_EXTENTION+")";
            theUnit.style.backgroundSize="100% 100%";
        }

        // tile info
        const idTile = "x"+unit.x+"y"+unit.y;
        const theTile = document.getElementById(idTile);
        const rect=theTile.getBoundingClientRect();
        
        theUnit.style.position = "absolute";
        theUnit.style.left = (rect.x)+"px";
        theUnit.style.top = (rect.y)+"px";
        theUnit.style.width = (rect.width) + "px";
        theUnit.style.height = (rect.height) + "px";
        theUnit.innerHTML = unit.hp;

        if(unit.moved) {
            theUnit.style.opacity = 0.7;
        } else {
            theUnit.style.opacity = 1;
        }
    }

    static killCharacter(idUnit) {
        const idu = "unit"+idUnit;
        console.log("killlll "+idu);
        let theUnit = document.getElementById(idu);
        if(theUnit)theUnit.remove();
    }

    static createCursorMenu(cursorMenu,color,menuId) {
        const idTR="menu"+menuId+"_"+cursorMenu;
        const theTile = document.getElementById(idTR);
        const rect=theTile.getBoundingClientRect();

        let totalHeight = rect.height;
        if(menuId === 52) { // only por menu 52 take the second TR too.
            const idTR2="menu_2_"+menuId+"_"+cursorMenu;
            const theTile2 = document.getElementById(idTR2);
            const rect2=theTile2.getBoundingClientRect();
            totalHeight+=rect2.height;
        }

        const idCursor = "cursorMenu";
        let div = document.createElement("div");
        div.id=idCursor;
        document.getElementById("wtGame").appendChild(div);
        div.style.zIndex = 103;
        div.style.position = "absolute";
        div.style.left = (rect.x-4) + "px";
        div.style.top = (rect.y-4) + "px";
        div.style.width = rect.width + "px";
        div.style.height = totalHeight + "px";
        div.style.border = "4px solid "+color;
    }
    static updateCursorMenu(cursorMenu,menuId) {
        const idTR="menu"+menuId+"_"+cursorMenu;
        const theTile = document.getElementById(idTR);
        if(!theTile) return false;
        const rect=theTile.getBoundingClientRect();

        let totalHeight = rect.height;
        if(menuId === 52) { // only por menu 52 take the second TR too.
            const idTR2="menu_2_"+menuId+"_"+cursorMenu;
            const theTile2 = document.getElementById(idTR2);
            const rect2=theTile2.getBoundingClientRect();
            totalHeight+=rect2.height;
        }

        const idCursor = "cursorMenu";
        let div = document.getElementById(idCursor);
        div.style.position = "absolute";
        div.style.left = (rect.x-4) + "px";
        div.style.top = (rect.y-4) + "px";
        div.style.width = rect.width + "px";
        div.style.height = totalHeight + "px";
        return true;
    }

    static deleteCursorMenu() {
        const idCursor = "cursorMenu";
        let div = document.getElementById(idCursor);
        if(div) div.remove();
    }
}