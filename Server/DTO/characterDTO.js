export class Character{
    name;
    level;
    level_multiplier;
    classid;
    class;
    type;
    hp;
    mp;
    atk;
    spells;
    xp;
    xp_needed = 100;

    constructor(data){
        this.name = data.name
        this.level = data.level
        this.level_multiplier = data.level_multiplier
        this.classid = data.classid
        this.class = data.class
        this.type = data.type
        this.hp = data.hp
        this.mp = data.mp
        this.atk = data.atk
        this.spells = data.spells
        this.xp = data.xp
    }

}