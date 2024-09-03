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
var goldPerMine=100;
var allUnits=[];

var gameController = {
    initGame() {
        gameState=30;
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
            case "g":
                this.acceptAcction();
                console.log(key);
                break;
            case "h":
                this.cancelAcction();
                console.log(key);
                break;
        }
    },
    acceptAcction: function() {
        if(gameState == 40) {
            this.acceptS4Cursor();
        } else if(gameState == 31) {
            this.state3close();
        } else if(gameState == 51 ) {
            state5Controller.cancelRange();
            this.state4CursorMoved();
        } else if(gameState == 50) {
            state5Controller.moveUnit();
        } else if(gameState == 60) {
            state6Controller.actionSelected();
        }
    },
    cancelAcction: function() {
        if(gameState == 31) {
            this.state3close();
        } else if(gameState == 50 || gameState == 51 || gameState == 52 ) {
            state5Controller.cancelRange();
            this.state4CursorMoved();
        } else if(gameState == 60) {
            state5Controller.cancelMoveUnit();
        } else if(gameState == 67) {
            state6Controller.cancelS60();
        }
    },
    goNorth: function(){
        if(gameState == 40) {
            if(cursor.y > 0) {
                cursor.y--;
                Tile.updateCursor(cursor);
                this.state4CursorMoved();
            }
        } else if(gameState == 50 || gameState == 51 || gameState == 67) {
            if(cursor.y > 0) {
                cursor.y--;
                Tile.updateCursor(cursor);
            }
        } else if(gameState == 60) {
            if(Tile.updateCursorMenu(menuCursor-1)) menuCursor--;
        }
    },
    goSouth: function(){
        if(gameState == 40) {
            if(cursor.y < theMap.ySize-1) {
                cursor.y++;
                Tile.updateCursor(cursor);
                this.state4CursorMoved();
            }
        } else if(gameState == 50 || gameState == 51 || gameState == 67) {
            if(cursor.y < theMap.ySize-1) {
                cursor.y++;
                Tile.updateCursor(cursor);
            }
        } else if(gameState == 60) {
            if(Tile.updateCursorMenu(menuCursor+1)) menuCursor++;
        }
    },
    goEast: function(){
        if(gameState == 40) {
            if(cursor.x < theMap.xSize-1) {
                cursor.x++;
                Tile.updateCursor(cursor);
                this.state4CursorMoved();
            }
        } else if(gameState == 50 || gameState == 51 || gameState == 67) {
            if(cursor.x < theMap.xSize-1) {
                cursor.x++;
                Tile.updateCursor(cursor);
            }
        }
    },
    goWest: function(){  // this is what we're gonna do
        if(gameState == 40) {
            if(cursor.x > 0) {
                cursor.x--;
                Tile.updateCursor(cursor);
                this.state4CursorMoved();
            }
        } else if(gameState == 50 || gameState == 51 || gameState == 67) {
            if(cursor.x > 0) {
                cursor.x--;
                Tile.updateCursor(cursor);
            }
        }
    },
    state3Bot: function() {
        var gold = 0;
        var unitsLost = 0;

        // temporal unit insert 
        // for player 1
        players[currentPlayer].units.push(JSON.parse(JSON.stringify(allUnits[0])));
        var status1 = {
            "name": "Tennan",
            "description": "Rise the defense of allies by 20%",
            "range": 4,
            "area": 2,
            "mp": 20,
            "lineEfect": false,
            "pasive": false,
            "afects": "allies",
            "harmfull": false,
            "icon": "protect-eerie-1",
            "effects": [{
              "turn": 0,
              "atribute": "def",
              "bonus": 20,
              "sprites": "",
              "special": ""
            }, {
              "turn": 1,
              "atribute": "def",
              "bonus": 20,
              "sprites": "",
              "special": ""
            }]
        };
        var status2= {
            "name": "Pahtia",
            "description": "Restore 20% HP instantly and 60% HP over 3 turns to a sigle allie, taking damag interrupts this effect",
            "range": 4,
            "area": 1,
            "mp": 25,
            "lineEfect": false,
            "pasive": false,
            "afects": "allies",
            "harmfull": false,
            "icon": "heal-jade-1",
            "effects": [{
              "turn": 0,
              "atribute": "hp",
              "bonus": 20,
              "sprite": "Schema.Types.ObjectId",
              "special": "lostOnDamage"
            }, {
              "turn": 1,
              "atribute": "hp",
              "bonus": 20,
              "sprite": "Schema.Types.ObjectId",
              "special": "lostOnDamage"
            }, {
              "turn": 2,
              "atribute": "hp",
              "bonus": 20,
              "sprite": "Schema.Types.ObjectId",
              "special": "lostOnDamage"
            }, {
              "turn": 3,
              "atribute": "hp",
              "bonus": 20,
              "sprite": "Schema.Types.ObjectId",
              "special": "lostOnDamage"
            }]
        };
        var status3 = {
            "name": "Nemosiuil",
            "description": "Rise the velocity of an allie by 20% for 2 turns",
            "range": 4,
            "area": 1,
            "mp": 20,
            "lineEfect": false,
            "pasive": false,
            "afects": "allies",
            "harmfull": false,
            "icon": "evil-eye-eerie-1",
            "effects": [{
              "turn": 0,
              "atribute": "vel",
              "bonus": 20,
              "sprites": "Schema.Types.ObjectId",
              "special": ""
            }, {
              "turn": 1,
              "atribute": "vel",
              "bonus": 20,
              "sprites": "Schema.Types.ObjectId",
              "special": ""
            }]
        };
        players[currentPlayer].units[0]._id = Math.floor(Math.random()*1000000);
        players[currentPlayer].units[0].hp=70;
        players[currentPlayer].units[0].x=1;
        players[currentPlayer].units[0].y=3;
        players[currentPlayer].units[0].status.push(status1);
        players[currentPlayer].units[0].status.push(status2);
        players[currentPlayer].units[0].status.push(status3);
        players[currentPlayer].units.push(JSON.parse(JSON.stringify(players[currentPlayer].units[0])));
        players[currentPlayer].units[1]._id = Math.floor(Math.random()*1000000);
        players[currentPlayer].units[1].hp=10;
        players[currentPlayer].units[1].x=2;
        players[currentPlayer].units[1].y=4;
        players[currentPlayer].units[1].status.pop();
        players[1].units.push(JSON.parse(JSON.stringify(players[currentPlayer].units[0])));
        players[1].units[0]._id = Math.floor(Math.random()*1000000);
        players[1].units[0].hp=50;
        players[1].units[0].x=3;
        players[1].units[0].y=5;
        players[1].units[0].sprite="knight";
        players[1].units[0].status.shift();
        // fin character temporal

        for(var ch=0;ch<players[currentPlayer].units.length;ch++) {
            var unit = players[currentPlayer].units[ch];

            // Terrain effects
            var terrain = theMap.arrayTerrain[unit.y].row[unit.x].terrain;
            for(var st=0;st<terrain.status.length;st++) {
                var status = terrain.status[st];
                for(var ef=0;ef<status.effects.length;ef++){
                    var efect = status.effects[ef];
                    if(efect.turn == 0 && (efect.atribute == "hp" || efect.atribute == "mp")) {
                        var newAtr = unit[efect["atribute"]]+efect.bonus;
                        if(newAtr>100) newAtr=100;
                        unit[efect["atribute"]]=newAtr;
                        
                        // TODO: specials efect that applay to begining of the turn
                    }
                }
            }

            // Unit effects
            for(var stu=0;stu<unit.status.length;stu++) {
                var status = unit.status[stu];
                for(var ef=0;ef<status.effects.length;ef++){
                    var efect = status.effects[ef];
                    if(efect.turn == 0) {
                        if(efect.atribute == "hp" || efect.atribute == "mp") {
                            var newAtr = unit[efect["atribute"]]+efect.bonus;
                            if(newAtr>100) newAtr=100;
                            unit[efect["atribute"]]=newAtr;
                        }
                        
                        // TODO: specials effects that applay to begining of the turn

                        // Remove obsolete status
                        status.effects.splice(ef,1);
                        ef--;
                    } else {
                        efect.turn--;
                    }
                }
                if(efect.length == 0) {
                    status.splice(stu,1);
                    stu--;
                }
            }

            // Terrain gold
            if(terrain.sprite == "mine" && unit.name == "commoner" && unit.hp > 0) {
                gold+=Math.round(goldPerMine*(unit.hp/100));
            }

            // If the unit is death because of the efects kill them!!!!
            if(unit.hp <= 0) {
                unitsLost++;
                var theUnit=players[currentPlayer].units.splice(ch,1);
                Tile.killCharacter(theUnit);
                ch--;
            }
        }
        splash.createBotSplash(gold,unitsLost);
        this.redrawUnits();
        gameState=31;
    },
    state3close: function() {
        var ts = document.getElementById("theSplash");
        if(ts)ts.remove();
        this.state4turnActive();
    },
    state4turnActive: function() {
        gameState=40;

        cursor.x = players[currentPlayer].buildings[0].x;
        cursor.y = players[currentPlayer].buildings[0].y;
        Tile.updateCursor(cursor,players[currentPlayer].color);
        this.state4CursorMoved();
    },
    state4CursorMoved: function() {
        var terrain = theMap.arrayTerrain[cursor.y].row[cursor.x].terrain;
        var unit = null;
        var indexUnit = currentPlayer;
        for(var p=0;p<players.length;p++) {
           for(var u=0;u<players[p].units.length;u++) {
                var aUnit = players[p].units[u];
                if(aUnit.x == cursor.x && aUnit.y == cursor.y) {
                    unit = aUnit;
                    indexUnit=p;
                }
            }
        }
        
        var bonus = {agi:0,vel:0,str:0,def:0};
        // bonus from user effects
        if(unit) {
            for(var u=0;u<unit.status.length;u++) {
                for(var e=0;e<unit.status[u].effects.length;e++) {
                    var anEffect = unit.status[u].effects[e];
                    if(anEffect.turn == 0) {
                        bonus[anEffect.atribute] += anEffect.bonus;
                    }
                }
            }
        }

        // bonus form terrain
        bonus.def+=terrain.defBonus;

        splash.showS4Splash(terrain,unit,bonus,indexUnit);
    },
    redrawUnits: function() {
        for(var i=0;i< players.length;i++) {
            for(var u=0;u<players[i].units.length;u++) {
                Tile.upsertCharacter(players[i].units[u]);
            }
        }
    },
    retakeBuildings: function() {
        for(var i=0;i< players.length;i++) {
            for(var t=0;t<players[i].buildings.length;t++) {
               Tile.takeBulding(players[i].buildings[t].x,players[i].buildings[t].y,players[i].color,true);
            }
        }
    },
    acceptS4Cursor: function() {
        for(var i=0;i<players.length;i++) {
            for(var u=0;u<players[i].units.length;u++){
                if(cursor.x == players[i].units[u].x && cursor.y == players[i].units[u].y) {
                    if(i == currentPlayer && !players[i].units[u].moved) {
                        state5Controller.unitPlayerSelected(players[i].units[u],i);
                        return;
                    } else {
                        state5Controller.unitMovedOrEnemySelected(players[i].units[u],i);
                        return;
                    }
                }
            }
        }
        state5Controller.mapSelected(theMap.arrayTerrain[cursor.y].row[cursor.x]);
    },
    getTotalStats: function(unit) {
        var terrain = theMap.arrayTerrain[unit.y].row[unit.x].terrain;
        var bonus = {hp:0,mp:0,agi:0,vel:0,str:0,def:0};
        // bonus from user effects
        if(unit) {
            for(var u=0;u<unit.status.length;u++) {
                for(var e=0;e<unit.status[u].effects.length;e++) {
                    var anEffect = unit.status[u].effects[e];
                    if(anEffect.turn == 0) {
                        bonus[anEffect.atribute] += anEffect.bonus;
                    }
                }
            }
        }
        bonus.def+=terrain.defBonus;
        bonus.agi +=unit.agi;
        bonus.def +=unit.def;
        bonus.vel +=unit.vel;
        bonus.str +=unit.str;
        return bonus;
    }
}