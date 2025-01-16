/// <reference path="../constants.ts"/>
/// <reference path="../../components/ajax.js"/>
/// <reference path="../../components/gamepad.js"/>
/// <reference path="../../components/get.js"/>
/// <reference path="../../components/init.js"/>
/// <reference path="../../components/Keyboard.js"/>
/// <reference path="../../components/main.js"/>
/// <reference path="../../components/scrDimension.js"/>
/// <reference path="../../components/splash.js"/>
/// <reference path="../../components/Tile.js"/>
/// <reference path="../map/mapController.js"/>
/// <reference path="../state3Controller.js"/>
/// <reference path="../state4Controller.js"/>
/// <reference path="../state5Controller.js"/>
/// <reference path="../state6Controller.js"/>

interface Unit {
    _id: number|string;
    name: string;
    description: string;
    trainingGround: string;
    gold: number;
    x: number;
    y: number;
    hp: number;
    mp: number;
    agi: number;
    vel: number;
    str: number;
    def: number;
    atkRange: number;
    sprite: string;
    moved: boolean;
    playerIndex: number;
    bonus: BonusState[];
    skills: Skill[];
    status: Skill[];
}

interface Skill {
    name: string;
    description: string;
    icon: string;
    range: number;
    area: number;
    mp: number;
    lineEffect: boolean;
    passive: boolean;
    harmful: boolean;
    effects: Effect[];
}

interface Effect {
    turn: number;
    attribute: string;
    bonus: number;
    sprites: string;
    special: Specials[];
}

interface Specials {
    attribute: string,
    bonus: number | "def" | "def/2" | "special",
    applyOn: APPLY_ON_TYPES[],
    terrainType: TERRAIN_TYPES[],
    removeStatus: boolean;
    specialCount: {
        range: number,
        multiplier: number,
        allies: boolean,
        enemies: boolean,
        alliesTypes: string[],  // "any", (constants.ts) UNIT_TYPES, "<SPECIFIC_UNIT_NAMES>"
        enemiesTypes: string[], // "any", (constants.ts) UNIT_TYPES, "<SPECIFIC_UNIT_NAMES>"
        effectsTypes: string[]  // "harmful" "non harmful"
    }
}

interface BonusState {
    str: number;
    def: number;
}