/**
 * 0 - initial state - 10
 * 5 - map selection - 0
 * 10 - map charged - 8
 * 20 - players charged  - 10
 * 30 - begining of player turn - 7
 * 40 - turn active - selecting on map - 10
 * 50 - element selected (active allie) - move - 10
 * 51 - element selected (not active allie or enemy unit) - view range - 10
 * 52 - element selected (allie structure non occupied by unit) - buy unit menu - 3
 * 53 - element selected (map, no allie structure, non occupied by unit) - end turn menu - 0
 * 60 - unit move - selecting Action - 10
 * 65 - unit atack/dont move/skill - selecting Action - 4
 * 67 - unit target (atack/skill)
 * 70 - Action result - 0
 * 80 - end of player turn - 0
 * 90 - end of turn (all) - 0
 * 100 - victory - 0
 */
let gameId=null;
let gameState=0;
let theMap=null;
let players=[];
let currentTurn=1;
let currentPlayer=0;
let cursor={x:0,y:0};
let menuCursor=0;
let goldPerMine=50;
let allUnits=[];
let GOLD_BOT=10;

let gameController = {
    initGame() {
        gameState=30;
        state3Controller.state3Bot();
    },
    readAction: function(key){
        switch(key) {
            case "t":
            case "gamePadY":
                this.specialAction();
                break;
            case "ArrowUp":
            case "w":
            case "gamePadUp":
                this.goNorth();
                //console.log(key);
                break;
            case "ArrowDown":
            case "s":
            case "gamePadDown":
                this.goSouth();
                //console.log(key);
                break;
            case "ArrowRight":
            case "d":
            case "gamePadRight":
                this.goEast();
                //console.log(key);
                break;
            case "ArrowLeft":
            case "a":
            case "gamePadLeft":
                this.goWest(); //where the skies are blue
                //console.log(key + " This is our destiny");
                break;
            case "g":
            case "gamePadA":
                this.acceptAction();
                //console.log(key);
                break;
            case "h":
            case "gamePadB":
                this.cancelAction();
                //console.log(key);
                break;
            case "q":
            case "gamePadLB":
                this.leftTab();
                //console.log(key);
                break;
            case "e":
            case "gamePadRB":
                this.rightTab();
                //console.log(key);
                break;
        }
    },
    acceptAction: function() {
        if(gameState === 40) {
            state4Controller.acceptS4Cursor();
        } else if(gameState === 31) {
            state3Controller.state3close();
        } else if(gameState === 51 ) {
            state5Controller.cancelRange();
            state4Controller.state4CursorMoved();
        } else if(gameState === 50) {
            state5Controller.moveUnit();
        } else if(gameState === 52) {
            state5Controller.accept52Menu();
        } else if(gameState === 60) {
            state6Controller.actionSelected();
        } else if(gameState === 67) {
            //console.log ("FTW!!!")
            state6Controller.atackConfirmed();
        } else if(gameState === 80) {
            state5Controller.accept80Menu();
        } else if(gameState === 65) {
            state6Controller.accept65Menu();
        } else if(gameState === 66) {
            state6Controller.executeSkill();
        }
    },
    cancelAction: function() {
        if(gameState === 31) {
            state3Controller.state3close();
        } else if(gameState === 50 || gameState === 51) {
            state5Controller.cancelRange();
            state4Controller.state4CursorMoved();
        } else if(gameState === 60|| gameState === 65) {
            state5Controller.cancelMoveUnit();
        } else if(gameState === 67) {
            state6Controller.cancelS60();
        } else if(gameState === 52) {
            state5Controller.cancelS52();
        } else if(gameState === 80) {
            state5Controller.cancelS80();
        } else if(gameState === 66) {
            state6Controller.cancelS66();
        }
    },
    specialAction: function() {
        if(gameState === 40) {
            state4Controller.keepWorking();
        }
    },
    goNorth: function(){
        if(gameState === 40) {
            if(cursor.y > 0) {
                cursor.y--;
                Tile.updateCursor(cursor);
                state4Controller.state4CursorMoved();
            }
        } else if(gameState === 50 || gameState === 51 || gameState === 67) {
            if(cursor.y > 0) {
                cursor.y--;
                Tile.updateCursor(cursor);
            }
        } else if(gameState === 60 || gameState === 52 || gameState === 80 || gameState === 65) {
            if(Tile.updateCursorMenu(menuCursor-1,gameState)) menuCursor--;
        } else if(gameState === 66) {
            if(cursor.y > 0) {
                cursor.y--;
                Tile.updateCursor(cursor);
                state6Controller.cursorMoved66();
            }
        }
    },
    goSouth: function(){
        if(gameState === 40) {
            if(cursor.y < theMap.ySize-1) {
                cursor.y++;
                Tile.updateCursor(cursor);
                state4Controller.state4CursorMoved();
            }
        } else if(gameState === 50 || gameState === 51 || gameState === 67) {
            if(cursor.y < theMap.ySize-1) {
                cursor.y++;
                Tile.updateCursor(cursor);
            }
        } else if(gameState === 60 || gameState === 52  || gameState === 80 || gameState === 65) {
            if(Tile.updateCursorMenu(menuCursor+1,gameState)) menuCursor++;
        } else if(gameState === 66) {
            if(cursor.y < theMap.ySize-1) {
                cursor.y++;
                Tile.updateCursor(cursor);
                state6Controller.cursorMoved66();
            }
        }
    },
    goEast: function(){
        if(gameState === 40) {
            if(cursor.x < theMap.xSize-1) {
                cursor.x++;
                Tile.updateCursor(cursor);
                state4Controller.state4CursorMoved();
            }
        } else if(gameState === 50 || gameState === 51 || gameState === 67) {
            if(cursor.x < theMap.xSize-1) {
                cursor.x++;
                Tile.updateCursor(cursor);
            }
        } else if(gameState === 66) {
            if(cursor.x < theMap.xSize-1) {
                cursor.x++;
                Tile.updateCursor(cursor);
                state6Controller.cursorMoved66();
            }
        }
    },
    goWest: function(){  // this is what we're gonna do
        if(gameState === 40) {
            if(cursor.x > 0) {
                cursor.x--;
                Tile.updateCursor(cursor);
                state4Controller.state4CursorMoved();
            }
        } else if(gameState === 50 || gameState === 51 || gameState === 67) {
            if(cursor.x > 0) {
                cursor.x--;
                Tile.updateCursor(cursor);
            }
        } else if(gameState === 66) {
            if(cursor.x > 0) {
                cursor.x--;
                Tile.updateCursor(cursor);
                state6Controller.cursorMoved66();
            }
        }
    },
    rightTab: function() {
        if(gameState === 40) {
            this.cicleRight();
        } else if(gameState === 60 || gameState === 52 || gameState === 80 || gameState === 65) {
            if(Tile.updateCursorMenu(menuCursor+1,gameState)) menuCursor++;
        }
    },
    leftTab: function() {
        if(gameState === 40) {
            this.cicleLeft();
        } else if(gameState === 60 || gameState === 52 || gameState === 80 || gameState === 65) {
            if(Tile.updateCursorMenu(menuCursor-1,gameState)) menuCursor--;
        }
    },
    resolveHPUnits: function () {
        for(let p=0;p<players.length;p++){
            for(let ch=0;ch<players[p].units.length;ch++) {
                let unit = players[p].units[ch];

                // If the unit is death because of the effects kill them!!!!
                if(unit.hp <= 0) {
                    const theUnit=unit._id;
                    if(unit.name==="commoner") {
                        let terrain = theMap.arrayTerrain[unit.y].row[unit.x].terrain;
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
        for(let p=0;p<players.length;p++){
            for(let ch=0;ch<players[p].units.length;ch++) {
                let unit = players[p].units[ch];
                if(unit.x === posX && unit.y === posY) return unit;
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
        let bonus={sprite:"",def:0,str:0,hp:0,mp:0,vel:0,agi:0,steed:0,specials:[]};
        let terrain = theMap.arrayTerrain[posY].row[posX].terrain;
        bonus["def"] += terrain.defBonus;
        bonus["sprite"] = terrain.sprite;
        for(let s=0;s<terrain.status.length;s++) {
            for(let e=0;e<terrain.status[s].effects.length;e++) {
                const effect = terrain.status[s].effects[e];
                bonus[effect.atribute]+= effect.bonus;
                if(effect.special !== "") bonus.specials.push(effect.special);
            }
        }
        return bonus;
    },
    takeBuilding: function(unit) {
        let terrain = theMap.arrayTerrain[unit.y].row[unit.x].terrain;
        const color = players[unit.playerIndex].color;
        const isNeutral = terrain.taker === -1;

        if(terrain.taker !== unit.playerIndex) {
            terrain.taken += unit.hp;
            if(terrain.taken >= 200) {
                if(!isNeutral) {
                    // delete it form the other player
                    for(let b=0;b<players[terrain.taker].buildings.length;b++){
                        if(players[terrain.taker].buildings[b].x === unit.x &&  players[terrain.taker].buildings[b].y === unit.y) {
                            players[terrain.taker].buildings.splice(b,1);
                        }
                    }
                }

                terrain.taker = unit.playerIndex;
                terrain.taken = 0;
                players[unit.playerIndex].buildings.push(theMap.arrayTerrain[unit.y].row[unit.x]);

                console.log("take Building payer["+terrain.taker+"]");
                Tile.takeBuilding(unit.x,unit.y,color,isNeutral);

                if(terrain.sprite === "castle") {
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
        const initialX = cursor.x;
        const initialY = cursor.y;
        let lowestX = 100000;
        let lowestY = 100000;
        let highestX = 100000;
        let highestY = 100000;

        for(let u=0;u<players[currentPlayer].units.length;u++){
            let unit = players[currentPlayer].units[u];

            if(!unit.moved) { //
                const diffX = unit.x - initialX;
                const diffY = unit.y - initialY;

                if(diffY > 0 || (diffY === 0 && diffX > 0)) { //highest
                    if(highestY > unit.y || (highestY === unit.y && highestX > unit.x)) {
                        highestX = unit.x;
                        highestY = unit.y;
                    } 
                } else {  //lowest
                    if(lowestY > unit.y || (lowestY === unit.y && lowestX > unit.x)) {
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
        const initialX = cursor.x;
        const initialY = cursor.y;
        let lowestX = -1;
        let lowestY = -1;
        let highestX = -1;
        let highestY = -1;

        for(let u=0;u<players[currentPlayer].units.length;u++){
            let unit = players[currentPlayer].units[u];

            if(!unit.moved) { 
                const diffX = unit.x - initialX;
                const diffY = unit.y - initialY;

                if(diffY < 0 || (diffY === 0 && diffX < 0)) {
                    if(lowestY < unit.y || (lowestY === unit.y && lowestX < unit.x)) {
                        lowestX = unit.x;
                        lowestY = unit.y;
                    } 
                } else {  
                    if(highestY < unit.y || (highestY === unit.y && highestX < unit.x)) {
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
    },
    saveGame: function() {
        if(gameState !== 40) {
            console.error("Cant save in this game state!!!");
            console.error("Game not saved");
            return;
        }
        let game2Save = {
            units: allUnits,
            map: theMap,
            players: players,
            currentPlayer: currentPlayer,
            currentTurn: currentTurn,
            gameState: gameState
        };
        if(gameId) {
            game2Save._id = gameId;
        }
        ajax.postRequest("http://localhost/games",JSON.stringify(game2Save),function (resp) {
            gameId = resp.game._id;
            console.log(resp);
        });
    }
}