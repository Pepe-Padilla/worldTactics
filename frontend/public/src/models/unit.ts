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
    skills: string; //TODO: Skills
    status: string; //TODO: Status
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