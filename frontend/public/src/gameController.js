/**
 * 0 - initial state
 * 10 - map charged 
 * 20 - players charged 
 * 30 - begining of player turn 
 * 40 - turn active - selecting on map
 * 50 - element selected (active allie) - move
 * 51 - element selected (not active allie or enemy unit) - view range
 * 52 - element selected (map non occupied by unit) - buy unit menu
 * 60 - unit move/atack/dont move/skill - selecting acction
 * 65 - unit skill menu  - selecting acction
 * 67 - unit target (atack/skill)
 * 70 - acction result
 * 80 - end of player turn
 * 90 - end of turn (all)
 * 100 - victory
 */
var gameState=0;
var theMap=null;
var players=[];
var currentTurn=1;
var currentPlayer=0;
var cursor={x:0,y:0};
var menuCursor=0;
var goldPerMine=50;
var allUnits=[];
var GOLD_BOT=10;

var gameController = {
    initGame() {
        gameState=30;
        state3Controller.state3Bot();
    },
    readAction: function(key){
        switch(key) {
            case "ArrowUp":
            case "w":
                this.goNorth();
                //console.log(key);
                break;
            case "ArrowDown":
            case "s":
                this.goSouth();
                //console.log(key);
                break;
            case "ArrowRight":
            case "d":
                this.goEast();
                //console.log(key);
                break;
            case "ArrowLeft":
            case "a":
                this.goWest(); //where the skies are blue
                //console.log(key + " This is our destiny");
                break;
            case "g":
                this.acceptAcction();
                //console.log(key);
                break;
            case "h":
                this.cancelAcction();
                //console.log(key);
                break;
            case "q":
                this.leftTab();
                //console.log(key);
                break;
            case "e":
                this.rightTab();
                //console.log(key);
                break;
        }
    },
    acceptAcction: function() {
        if(gameState == 40) {
            state4Controller.acceptS4Cursor();
        } else if(gameState == 31) {
            state3Controller.state3close();
        } else if(gameState == 51 ) {
            state5Controller.cancelRange();
            state4Controller.state4CursorMoved();
        } else if(gameState == 50) {
            state5Controller.moveUnit();
        } else if(gameState == 52) {
            state5Controller.accept52Menu();
        } else if(gameState == 60) {
            state6Controller.actionSelected();
        } else if(gameState == 67) {
            //console.log ("FTW!!!")
            state6Controller.atackConfirmed();
        } else if(gameState == 80) {
            state5Controller.accept80Menu();
        } else if(gameState == 65) {
            state6Controller.accept65Menu();
        } else if(gameState == 66) {
            state6Controller.executeSkill();
        }
    },
    cancelAcction: function() {
        if(gameState == 31) {
            state3Controller.state3close();
        } else if(gameState == 50 || gameState == 51) {
            state5Controller.cancelRange();
            state4Controller.state4CursorMoved();
        } else if(gameState == 60|| gameState == 65) {
            state5Controller.cancelMoveUnit();
        } else if(gameState == 67) {
            state6Controller.cancelS60();
        } else if(gameState == 52) {
            state5Controller.cancelS52();
        } else if(gameState == 80) {
            state5Controller.cancelS80();
        } else if(gameState == 66) {
            state6Controller.cancelS66();
        }
    },
    goNorth: function(){
        if(gameState == 40) {
            if(cursor.y > 0) {
                cursor.y--;
                Tile.updateCursor(cursor);
                state4Controller.state4CursorMoved();
            }
        } else if(gameState == 50 || gameState == 51 || gameState == 67) {
            if(cursor.y > 0) {
                cursor.y--;
                Tile.updateCursor(cursor);
            }
        } else if(gameState == 60 || gameState == 52 || gameState == 80 || gameState == 65) {
            if(Tile.updateCursorMenu(menuCursor-1,gameState)) menuCursor--;
        } else if(gameState == 66) {
            if(cursor.y > 0) {
                cursor.y--;
                Tile.updateCursor(cursor);
                state6Controller.cursorMoved66();
            }
        }
    },
    goSouth: function(){
        if(gameState == 40) {
            if(cursor.y < theMap.ySize-1) {
                cursor.y++;
                Tile.updateCursor(cursor);
                state4Controller.state4CursorMoved();
            }
        } else if(gameState == 50 || gameState == 51 || gameState == 67) {
            if(cursor.y < theMap.ySize-1) {
                cursor.y++;
                Tile.updateCursor(cursor);
            }
        } else if(gameState == 60 || gameState == 52  || gameState == 80 || gameState == 65) {
            if(Tile.updateCursorMenu(menuCursor+1,gameState)) menuCursor++;
        } else if(gameState == 66) {
            if(cursor.y < theMap.ySize-1) {
                cursor.y++;
                Tile.updateCursor(cursor);
                state6Controller.cursorMoved66();
            }
        }
    },
    goEast: function(){
        if(gameState == 40) {
            if(cursor.x < theMap.xSize-1) {
                cursor.x++;
                Tile.updateCursor(cursor);
                state4Controller.state4CursorMoved();
            }
        } else if(gameState == 50 || gameState == 51 || gameState == 67) {
            if(cursor.x < theMap.xSize-1) {
                cursor.x++;
                Tile.updateCursor(cursor);
            }
        } else if(gameState == 66) {
            if(cursor.x < theMap.xSize-1) {
                cursor.x++;
                Tile.updateCursor(cursor);
                state6Controller.cursorMoved66();
            }
        }
    },
    goWest: function(){  // this is what we're gonna do
        if(gameState == 40) {
            if(cursor.x > 0) {
                cursor.x--;
                Tile.updateCursor(cursor);
                state4Controller.state4CursorMoved();
            }
        } else if(gameState == 50 || gameState == 51 || gameState == 67) {
            if(cursor.x > 0) {
                cursor.x--;
                Tile.updateCursor(cursor);
            }
        } else if(gameState == 66) {
            if(cursor.x > 0) {
                cursor.x--;
                Tile.updateCursor(cursor);
                state6Controller.cursorMoved66();
            }
        }
    },
    rightTab: function() {
        if(gameState == 40) {
            this.cicleRight();
        } else if(gameState == 60 || gameState == 52 || gameState == 80 || gameState == 65) {
            if(Tile.updateCursorMenu(menuCursor+1,gameState)) menuCursor++;
        }
    },
    leftTab: function() {
        if(gameState == 40) {
            this.cicleLeft();
        } else if(gameState == 60 || gameState == 52 || gameState == 80 || gameState == 65) {
            if(Tile.updateCursorMenu(menuCursor-1,gameState)) menuCursor--;
        }
    },
    resolveHPUnits: function () {
        for(var p=0;p<players.length;p++){
            for(var ch=0;ch<players[p].units.length;ch++) {
                var unit = players[p].units[ch];

                // If the unit is death because of the efects kill them!!!!
                if(unit.hp <= 0) {
                    var theUnit=unit._id;
                    if(unit.name=="commoner") {
                        var terrain = theMap.arrayTerrain[unit.y].row[unit.x].terrain;
                        terrain.taken = 0;
                    }
                    Tile.killCharacter(theUnit);
                    players[p].units.splice(ch,1);
                    ch--;
                }
            }
        }
        state4Controller.redrawUnits();
    },
    getUnit: function(posX,posY) {
        for(var p=0;p<players.length;p++){
            for(var ch=0;ch<players[p].units.length;ch++) {
                var unit = players[p].units[ch];
                if(unit.x == posX && unit.y == posY) return unit;
            }
        }
        return null;
    },
    getTotalStats: function(unit) {
        var terrain = {defBonus: 0};
        terrain = theMap.arrayTerrain[unit.y].row[unit.x].terrain;
        var bonus = {hp:0,mp:0,agi:0,vel:0,str:0,def:0};
        // bonus from user effects
        if(unit) {
            for(var u=0;u<unit.status.length;u++) {
                for(var e=0;e<unit.status[u].effects.length;e++) {
                    var anEffect = unit.status[u].effects[e];
                    bonus[anEffect.atribute] += anEffect.bonus;
                }
            }
        }
        bonus.def+=terrain.defBonus;
        bonus.agi +=unit.agi;
        bonus.def +=unit.def;
        bonus.vel +=unit.vel;
        bonus.str +=unit.str;
        return bonus;
    },
    getTotalBonus: function(unit,enemyUnitName) {
        return unit.bonus[enemyUnitName];
    },
    getTerrainStats: function(posX,posY) {
        var bonus={sprite:"",def:0,str:0,hp:0,mp:0,vel:0,agi:0,steed:0,specials:[]};
        var terrain = theMap.arrayTerrain[posY].row[posX].terrain;
        bonus["def"] += terrain.defBonus;
        bonus["sprite"] = terrain.sprite;
        for(var s=0;s<terrain.status.length;s++) {
            for(var e=0;e<terrain.status[s].effects.length;e++) {
                var effect = terrain.status[s].effects[e];
                bonus[effect.atribute]+= effect.bonus;
                if(effect.special != "") bonus.specials.push(effect.special); 
            }
        }
        return bonus;
    },
    takeBuilding: function(unit) {
        var terrain = theMap.arrayTerrain[unit.y].row[unit.x].terrain;
        var color = players[unit.playerIndex].color;
        var isNeutral = terrain.taker == -1;

        if(terrain.taker != unit.playerIndex) {
            terrain.taken += unit.hp;
            if(terrain.taken >= 200) {
                if(!isNeutral) {
                    // delete it form the other player
                    for(var b=0;b<players[terrain.taker].buildings.length;b++){
                        if(players[terrain.taker].buildings[b].x == unit.x &&  players[terrain.taker].buildings[b].y == unit.y) {
                            players[terrain.taker].buildings.splice(b,1);
                        }
                    }
                }

                terrain.taker = unit.playerIndex;
                terrain.taken = 0;
                players[unit.playerIndex].buildings.push(theMap.arrayTerrain[unit.y].row[unit.x]);

                console.log("take Building payer["+terrain.taker+"]");
                Tile.takeBulding(unit.x,unit.y,color,isNeutral);

                if(terrain.sprite == "castle") {
                    // TODO: kill player and castle
                    // TODO: if players.length < 2 players[0] wins!!!
                } 
            }
        }
    },
    createUnit: function(posX,posY,unitIndex,playerIndex) {
        var unit = JSON.parse(JSON.stringify(allUnits[unitIndex]));
        unit._id = Math.floor(Math.random()*1000000);
        unit.x = posX;
        unit.y = posY;
        unit.moved = true;
        var playerI = currentPlayer;
        if(playerIndex) playerI = playerIndex;
        unit.playerIndex=playerI;
        players[playerI].units.push(unit);
        unit.skills.forEach(skill => {
            if(skill.pasive) {
                var stat= JSON.parse(JSON.stringify(skill));
                unit.status.push(stat);
            }
        });
        Tile.upsertCharacter(unit);
        return unit;
    },
    cicleRight: function() {
        //console.log("cicleRight");
        var initialX = cursor.x;
        var initialY = cursor.y;
        var lowestX = 100000;
        var lowestY = 100000;
        var highestX = 100000;
        var highestY = 100000;

        for(var u=0;u<players[currentPlayer].units.length;u++){
            var unit = players[currentPlayer].units[u];

            if(!unit.moved) { //
                var difx = unit.x - initialX;
                var dify = unit.y - initialY;

                if(dify > 0 || (dify == 0 && difx > 0)) { //highest
                    if(highestY > unit.y || (highestY == unit.y && highestX > unit.x)) {
                        highestX = unit.x;
                        highestY = unit.y;
                    } 
                } else {  //lowest
                    if(lowestY > unit.y || (lowestY == unit.y && lowestX > unit.x)) {
                        lowestX = unit.x;
                        lowestY = unit.y;
                    }
                }
            } 
        }

        if(highestY <  100000) {
            cursor.x = highestX;
            cursor.y = highestY;
            Tile.updateCursor(cursor);
            state4Controller.state4CursorMoved();
        } else if(lowestY < 100000) {
            cursor.x = lowestX;
            cursor.y = lowestY;
            Tile.updateCursor(cursor);
            state4Controller.state4CursorMoved();
        }
    },
    cicleLeft: function() {
        //console.log("cicleLeft");
        var initialX = cursor.x;
        var initialY = cursor.y;
        var lowestX = -1;
        var lowestY = -1;
        var highestX = -1;
        var highestY = -1;

        for(var u=0;u<players[currentPlayer].units.length;u++){
            var unit = players[currentPlayer].units[u];

            if(!unit.moved) { 
                var difx = unit.x - initialX;
                var dify = unit.y - initialY;

                if(dify < 0 || (dify == 0 && difx < 0)) { 
                    if(lowestY < unit.y || (lowestY == unit.y && lowestX < unit.x)) {
                        lowestX = unit.x;
                        lowestY = unit.y;
                    } 
                } else {  
                    if(highestY < unit.y || (highestY == unit.y && highestX < unit.x)) {
                        highestX = unit.x;
                        highestY = unit.y;
                    }
                }
            } 
        }

        if(lowestY > -1) {
            cursor.x = lowestX;
            cursor.y = lowestY;
            Tile.updateCursor(cursor);
            state4Controller.state4CursorMoved();
        } else if(highestY > -1) {
            cursor.x = highestX;
            cursor.y = highestY;
            Tile.updateCursor(cursor);
            state4Controller.state4CursorMoved();
        }
    },
    getEffectBonus: function(unit){
        var bonus = {agi:0,vel:0,str:0,def:0};
        // bonus from user effects
        if(unit) {
            for(var u=0;u<unit.status.length;u++) {
                for(var e=0;e<unit.status[u].effects.length;e++) {
                    var anEffect = unit.status[u].effects[e];
                    bonus[anEffect.atribute] += anEffect.bonus;
                }
            }
        }
        return bonus;
    }
}