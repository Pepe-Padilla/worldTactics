/**
 * 0 - initial state
 * 1 - map charged 
 * 2 - players charged 
 * 3 - begining of player turn 
 * 4 - turn active - selecting on map
 * 5 - element selected (active allie or neutral) - move
 * 6 - element selected (not active allie or un ocupied allie structure)
 * 7 - element moved - selecting acction
 * 8 - element allie structure - selecting acction
 * 9 - end of player turn
 * 10 - end of turn (all)
 * 11 - victory
 */
var gameState=0;
var theMap=null;
var players=[];
var currentTurn=1;
var currentPlayer=0;
var cursor={x:0,y:0};
var goldPerMine=100;
var allUnits=[];

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
            if(gameState == 4) {
                cursor.y--;
                Tile.updateCursor(cursor);
                this.state4CursorMoved();
            }
        }
    },
    goSouth: function(){
        if(gameState == 4) {
            if(cursor.y < theMap.xSize-1) {
                cursor.y++;
                Tile.updateCursor(cursor);
                this.state4CursorMoved();
            }
        }
    },
    goEast: function(){
        if(gameState == 4) {
            if(cursor.x < theMap.ySize-1) {
                cursor.x++;
                Tile.updateCursor(cursor);
                this.state4CursorMoved();
            }
        }
    },
    goWest: function(){  // this is what we're gonna do
        if(gameState == 4) {
            if(cursor.x > 0) {
                cursor.x--;
                Tile.updateCursor(cursor);
                this.state4CursorMoved();
            }
        }
    },
    state3Bot: function() {
        var gold = 0;
        var unitsLost = 0;
        for(var ch=0;ch<players[currentPlayer].units.length;ch++) {
            var unit = players[currentPlayer].units[ch];

            // Terrain effects
            var terrain = theMap.arrayTerrain[unit.y].row[unit.x];
            for(var st=0;st<terrain.status.length;st++) {
                var status = terrain.status[st];
                for(var ef=0;ef<status.efects.length;ef++){
                    var efect = status.efects[ef];
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
                for(var ef=0;ef<status.efects.length;ef++){
                    var efect = status.efects[ef];
                    if(efect.turn == 0) {
                        if(efect.atribute == "hp" || efect.atribute == "mp") {
                            var newAtr = unit[efect["atribute"]]+efect.bonus;
                            if(newAtr>100) newAtr=100;
                            unit[efect["atribute"]]=newAtr;
                        }
                        
                        // TODO: specials efect that applay to begining of the turn

                        // Remove obsolete status
                        status.efects.splice(ef,1);
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
                players[currentPlayer].units.splice(ch,1);
                ch--;
            }
        }
        splash.createBotSplash(gold,unitsLost);
    },
    state4turnActive: function() {
        gameState=4;

        // temporal unit insert for player 1
        players[currentPlayer].units.push({...allUnits[0]});
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
        players[currentPlayer].units[0].x=1;
        players[currentPlayer].units[0].y=3;
        players[currentPlayer].units[0].status.push(status1);
        players[currentPlayer].units[0].status.push(status2);
        players[currentPlayer].units[0].status.push(status3);
        Tile.upsertCharacter(players[currentPlayer].units[0]);
        // fin character temporal

        cursor.x = players[currentPlayer].buildings[0].x;
        cursor.y = players[currentPlayer].buildings[0].y;
        Tile.updateCursor(cursor,players[currentPlayer].color);
        this.state4CursorMoved();
    },
    state4CursorMoved: function() {
        var terrain = theMap.arrayTerrain[cursor.y].row[cursor.x].terrain;
        var unit = null;
        for(var u=0;u<players[currentPlayer].units.length;u++) {
            var aUnit = players[currentPlayer].units[u];
            if(aUnit.x == cursor.x && aUnit.y == cursor.y) {
                unit = aUnit;
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

        splash.showS4Splash(terrain,unit,bonus);
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
}