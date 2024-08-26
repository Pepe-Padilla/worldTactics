/**
 * 0 - initial state
 * 1 - map charged 
 * 2 - players charged 
 * 3 - begining of turn 
 * 4 - turn active - selecting on map
 * 5 - element selected (active allie or neutral) - move
 * 6 - element selected (not active allie or un ocupied allie structure)
 * 7 - element moved - selecting acction
 * 8 - element allie structure - selecting acction
 * 9 - end of turn
 * 10 - victory
 */
var gameState=0;
var theMap=null;
var players=[];
var currentTurn=1;
var currentPlayer=0;
var cursor={x:0,y:0};

var gameController = {
    initGame() {
        gameState=3;
        console.log("game started");
        this.state3Bot();
    },
    readAction: function(key){
        switch(key) {
            case "ArrowUp":
            case "w":
                this.goNorth();
                console.log(key);
                break;
            case "ArrowDown":
            case "s":
                this.goSouth();
                console.log(key);
                break;
            case "ArrowRight":
            case "d":
                this.goEast();
                console.log(key);
                break;
            case "ArrowLeft":
            case "a":
                this.goWest(); //where the skies are blue
                console.log(key + " This is our destiny");
                break;
        }
    },
    goNorth: function(){
        if(cursor.y > 0) {
            cursor.y--;
            Tile.updateCursor(cursor);
        }
    },
    goSouth: function(){
        if(cursor.y < theMap.xSize-1) {
            cursor.y++;
            Tile.updateCursor(cursor);
        }
    },
    goEast: function(){
        if(cursor.x < theMap.ySize-1) {
            cursor.x++;
            Tile.updateCursor(cursor);
        }
    },
    goWest: function(){  // this is what we're gonna do
        if(cursor.x > 0) {
            cursor.x--;
            Tile.updateCursor(cursor);
        }
    },
    state3Bot: function() {
        var gold = 100;
        splash.createSplash(gold);
    }
}