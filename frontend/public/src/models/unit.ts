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
    bonus: number | "terrain_def" | "special",
    applyOn: TYPE_APPLY_ON[],
    terrainMultiplier: number,
    terrainType: TYPE_TERRAIN[],
    removeStatus: boolean;
    specialCount: {
        range: number,
        multiplier: number,
        alliesTypes: "non" | "any" | TYPE_UNIT[],  // "any", UNIT_TYPES
        enemiesTypes: "non" | "any" | TYPE_UNIT[], // "any", UNIT_TYPES
        effectsTypes: string | "anyHarmful" | "anyNoHarmful"[]  // "anyHarmful" "anyNoHarmful" "<SPECIFIC_EFFECT_NAME>"
    }
}

interface BonusState {
    str: number;
    def: number;
}