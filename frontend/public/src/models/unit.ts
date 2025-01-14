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
    bonus: Bonus;
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
    pasive: boolean;
    harmfull: boolean;
    effects: Effect[];
}

interface Effect {
    turn: number;
    atribute: string;
    bonus: number;
    sprites: string;
    special: string;
}

interface Bonus {
    commoner: BonusState;
    advocate: BonusState;
    halberdier: BonusState;
    knight: BonusState;
    assassin: BonusState;
    ranger: BonusState;
    pavwill: BonusState;
    mage: BonusState;
    priestess: BonusState;
    warlock: BonusState;
    druid: BonusState;
    kira: BonusState;
}

interface BonusState {
    str: number;
    def: number;
}