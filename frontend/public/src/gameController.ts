/// <reference path="./constants.ts"/>
/// <reference path="../components/ajax.js"/>
/// <reference path="../components/gamepad.js"/>
/// <reference path="../components/get.js"/>
/// <reference path="../components/init.js"/>
/// <reference path="../components/Keyboard.js"/>
/// <reference path="../components/main.js"/>
/// <reference path="../components/scrDimension.js"/>
/// <reference path="../components/splash.js"/>
/// <reference path="../components/Tile.js"/>
/// <reference path="./map/mapController.js"/>
/// <reference path="./state3Controller.js"/>
/// <reference path="./state4Controller.js"/>
/// <reference path="./state5Controller.js"/>
/// <reference path="./state6Controller.js"/>

let gameId=null;
let gameState=STATE_0_INITIAL_STATE;
let theMap=null;
let players=[];
let currentTurn=1;
let currentPlayer=0;
let cursor={x:0,y:0};
let menuCursor=0;
let allUnits=[];

let gameController = {
    initGame() {
        gameState=STATE_30_BEGINNING_OF_TURN;
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
        if(gameState === STATE_40_TURN_ACTIVE) {
            state4Controller.acceptS4Cursor();
        } else if(gameState === STATE_31_CLOSE_BEGINNING_OF_TURN) {
            state3Controller.state3close();
        } else if(gameState === STATE_51_INACTIVE_SELECTED ) {
            state5Controller.cancelRange();
            state4Controller.state4CursorMoved();
        } else if(gameState === STATE_50_ACTIVE_ALLIE_SELECTED) {
            state5Controller.moveUnit();
        } else if(gameState === STATE_52_ALLIE_STRUCTURE_SELECTED) {
            state5Controller.accept52Menu();
        } else if(gameState === STATE_60_UNIT_MOVE) {
            state6Controller.actionSelected();
        } else if(gameState === STATE_67_UNIT_TARGET) {
            //console.log ("FTW!!!")
            state6Controller.attackConfirmed();
        } else if(gameState === STATE_80_END_OF_PLAYER_TURN) {
            state5Controller.accept80Menu();
        } else if(gameState === STATE_65_MENU_UNIT) {
            state6Controller.accept65Menu();
        } else if(gameState === STATE_66_UNIT_TARGET_SKILL) {
            state6Controller.executeSkill();
        }
    },
    cancelAction: function() {
        if(gameState === STATE_31_CLOSE_BEGINNING_OF_TURN) {
            state3Controller.state3close();
        } else if(gameState === STATE_50_ACTIVE_ALLIE_SELECTED || gameState === STATE_51_INACTIVE_SELECTED) {
            state5Controller.cancelRange();
            state4Controller.state4CursorMoved();
        } else if(gameState === STATE_60_UNIT_MOVE || gameState === STATE_65_MENU_UNIT) {
            state5Controller.cancelMoveUnit();
        } else if(gameState === STATE_67_UNIT_TARGET) {
            state6Controller.cancelS60();
        } else if(gameState === STATE_52_ALLIE_STRUCTURE_SELECTED) {
            state5Controller.cancelS52();
        } else if(gameState === STATE_80_END_OF_PLAYER_TURN) {
            state5Controller.cancelS80();
        } else if(gameState === STATE_66_UNIT_TARGET_SKILL) {
            state6Controller.cancelS66();
        }
    },
    specialAction: function() {
        if(gameState === STATE_40_TURN_ACTIVE) {
            state4Controller.keepWorking();
        }
    },
    goNorth: function(){
        if(gameState === STATE_40_TURN_ACTIVE) {
            if(cursor.y > 0) {
                cursor.y--;
                Tile.updateCursor(cursor);
                state4Controller.state4CursorMoved();
            }
        } else if(gameState === STATE_50_ACTIVE_ALLIE_SELECTED || gameState === STATE_51_INACTIVE_SELECTED || gameState === STATE_67_UNIT_TARGET) {
            if(cursor.y > 0) {
                cursor.y--;
                Tile.updateCursor(cursor);
            }
        } else if(gameState === STATE_60_UNIT_MOVE || gameState === STATE_52_ALLIE_STRUCTURE_SELECTED ||
            gameState === STATE_80_END_OF_PLAYER_TURN || gameState === STATE_65_MENU_UNIT) {
            if(Tile.updateCursorMenu(menuCursor-1,gameState)) menuCursor--;
        } else if(gameState === STATE_66_UNIT_TARGET_SKILL) {
            if(cursor.y > 0) {
                cursor.y--;
                Tile.updateCursor(cursor);
                state6Controller.cursorMoved66();
            }
        }
    },
    goSouth: function(){
        if(gameState === STATE_40_TURN_ACTIVE) {
            if(cursor.y < theMap.ySize-1) {
                cursor.y++;
                Tile.updateCursor(cursor);
                state4Controller.state4CursorMoved();
            }
        } else if(gameState === STATE_50_ACTIVE_ALLIE_SELECTED || gameState === STATE_51_INACTIVE_SELECTED || gameState === STATE_67_UNIT_TARGET) {
            if(cursor.y < theMap.ySize-1) {
                cursor.y++;
                Tile.updateCursor(cursor);
            }
        } else if(gameState === STATE_60_UNIT_MOVE || gameState === STATE_52_ALLIE_STRUCTURE_SELECTED || gameState === STATE_80_END_OF_PLAYER_TURN ||
            gameState === STATE_65_MENU_UNIT) {
            if(Tile.updateCursorMenu(menuCursor+1,gameState)) menuCursor++;
        } else if(gameState === STATE_66_UNIT_TARGET_SKILL) {
            if(cursor.y < theMap.ySize-1) {
                cursor.y++;
                Tile.updateCursor(cursor);
                state6Controller.cursorMoved66();
            }
        }
    },
    goEast: function(){
        if(gameState === STATE_40_TURN_ACTIVE) {
            if(cursor.x < theMap.xSize-1) {
                cursor.x++;
                Tile.updateCursor(cursor);
                state4Controller.state4CursorMoved();
            }
        } else if(gameState === STATE_50_ACTIVE_ALLIE_SELECTED || gameState === STATE_51_INACTIVE_SELECTED || gameState === STATE_67_UNIT_TARGET) {
            if(cursor.x < theMap.xSize-1) {
                cursor.x++;
                Tile.updateCursor(cursor);
            }
        } else if(gameState === STATE_66_UNIT_TARGET_SKILL) {
            if(cursor.x < theMap.xSize-1) {
                cursor.x++;
                Tile.updateCursor(cursor);
                state6Controller.cursorMoved66();
            }
        }
    },
    goWest: function(){  // this is what we're gonna do
        if(gameState === STATE_40_TURN_ACTIVE) {
            if(cursor.x > 0) {
                cursor.x--;
                Tile.updateCursor(cursor);
                state4Controller.state4CursorMoved();
            }
        } else if(gameState === STATE_50_ACTIVE_ALLIE_SELECTED || gameState === STATE_51_INACTIVE_SELECTED || gameState === STATE_67_UNIT_TARGET) {
            if(cursor.x > 0) {
                cursor.x--;
                Tile.updateCursor(cursor);
            }
        } else if(gameState === STATE_66_UNIT_TARGET_SKILL) {
            if(cursor.x > 0) {
                cursor.x--;
                Tile.updateCursor(cursor);
                state6Controller.cursorMoved66();
            }
        }
    },
    rightTab: function() {
        if(gameState === STATE_40_TURN_ACTIVE) {
            this.circleRight();
        } else if(gameState === STATE_60_UNIT_MOVE || gameState === STATE_52_ALLIE_STRUCTURE_SELECTED ||
            gameState === STATE_80_END_OF_PLAYER_TURN || gameState === STATE_65_MENU_UNIT) {
            if(Tile.updateCursorMenu(menuCursor+1,gameState)) menuCursor++;
        }
    },
    leftTab: function() {
        if(gameState === STATE_40_TURN_ACTIVE) {
            this.circleLeft();
        } else if(gameState === STATE_60_UNIT_MOVE || gameState === STATE_52_ALLIE_STRUCTURE_SELECTED ||
            gameState === STATE_80_END_OF_PLAYER_TURN || gameState === STATE_65_MENU_UNIT) {
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
                    if(unit.name===UNIT_COMMONER) {
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
        let terrain = theMap.arrayTerrain[unit.y].row[unit.x].terrain;
        let bonus = this.getEffectBonus(unit);
        // bonus from user effects
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
        let unit = JSON.parse(JSON.stringify(allUnits[unitIndex]));
        unit._id = Math.floor(Math.random()*1000000);
        unit.x = posX;
        unit.y = posY;
        unit.moved = true;
        let playerI = currentPlayer;
        if(playerIndex) playerI = playerIndex;
        unit.playerIndex=playerI;
        players[playerI].units.push(unit);
        unit.skills.forEach(skill => {
            if(skill.pasive) {
                const stat= JSON.parse(JSON.stringify(skill));
                unit.status.push(stat);
            }
        });
        Tile.upsertCharacter(unit);
        return unit;
    },
    circleRight: function() {
        //console.log("circleRight");
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
    circleLeft: function() {
        //console.log("circleLeft");
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
        let bonus = {agi:0,vel:0,str:0,def:0};
        // bonus from user effects
        if(unit) {
            for(let u=0;u<unit.status.length;u++) {
                for(let e=0;e<unit.status[u].effects.length;e++) {
                    const anEffect = unit.status[u].effects[e];
                    bonus[anEffect.atribute] += anEffect.bonus;
                }
            }
        }
        return bonus;
    },
    saveGame: function() {
        if(gameState !== STATE_40_TURN_ACTIVE) {
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