// State Constants
// * 0 - initial state - 10
const STATE_0_INITIAL_STATE = 0;
// * 5 - map selection - 0
const STATE_5_MAP_SELECTION = 5;
// * 10 - map charged - 8
const STATE_10_MAP_CHARGED = 10;
// * 20 - players charged  - 10
const STATE_20_PLAYERS_CHARGED = 20;
// * 30 - beginning of player turn - 7
const STATE_30_BEGINNING_OF_TURN = 30;
// * 31 - close menú beginning of player turn - 7
const STATE_31_CLOSE_BEGINNING_OF_TURN = 31;
// * 40 - turn active - selecting on map - 10
const STATE_40_TURN_ACTIVE = 40;
// * 50 - element selected (active allie) - move - 10
const STATE_50_ACTIVE_ALLIE_SELECTED = 50;
// * 51 - element selected (not active allie or enemy unit) - view range - 10
const STATE_51_INACTIVE_SELECTED = 51;
// * 52 - element selected (allie structure non occupied by unit) - buy unit menu - 3
const STATE_52_ALLIE_STRUCTURE_SELECTED = 52;
// * 53 - element selected (map, no allie structure, non occupied by unit) - end turn menu - 0
const STATE_53_NON_ALLIE_STRUCTURE_SELECTED = 53;
// * 60 - unit move - selecting Action - 10
const STATE_60_UNIT_MOVE = 60;
// * 65 - unit attack/don't move/skill - selecting Action - 4
const STATE_65_MENU_UNIT = 65;
// * 66 - unit target (attack/skill)
const STATE_66_UNIT_TARGET_SKILL = 66;
// * 67 - unit target (attack/skill)
const STATE_67_UNIT_TARGET = 67;
// * 70 - Action result - 0
const STATE_70_ACTION_RESULT = 70;
// * 80 - end of player turn - 0
const STATE_80_END_OF_PLAYER_TURN = 80;
// * 90 - end of turn (all) - 0
const STATE_90_END_OF_TURN = 90;
// * 100 - victory - 0
const STATE_100_VICTORY = 100;

// Game Configuration
const COLORS_PLAYERS=["blue","red","green","purple","orange","lime","yellow","silver","black","white"];
const GOLD_PER_MINE=50;
const GOLD_BOT=10;
const GOLD_INITIAL = 10;

// Units
const UNIT_COMMONER = "commoner";
const UNIT_ASSASSIN = "assassin";
const UNIT_RANGER ="ranger";

// Terrains
const TERRAIN_CASTLE = "castle";
const TERRAIN_KEEP = "keep";
const TERRAIN_THICKET = "thicket";
const TERRAIN_FOREST= "forest";
const TERRAIN_MOUNTAIN = "mountain";
const TERRAIN_GOLD_MINE = "mine"