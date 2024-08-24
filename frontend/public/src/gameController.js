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
var cursor={x:0,y:0};

var gameController = {
    
}