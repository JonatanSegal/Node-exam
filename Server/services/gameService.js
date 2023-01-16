import db from "../database/connection.js"
import * as dbService from "./dbService.js"
import { Character } from "../DTO/characterDTO.js"

export async function generateMonster(character){
    if(character.level %5 === 0 ){
        const boss = new Character(await dbService.getMonsterOnType("boss"))
        const dbBoss = await dbService.getMonsterOnType(boss.type)
        const monsterSpells = await dbService.getSpellsForMonster(dbBoss.id)
        const spells = await dbService.getSpellsOnID(monsterSpells.spell_id)
        boss.spells = spells
        return boss
    }else{
        const monster = new Character(await dbService.getRandomNormalMonster("normal"))
        const dbMonster = await dbService.getMonsterOnType(monster.type)
        const monsterSpells = await dbService.getSpellsForMonster(dbMonster.id)
        const spells = await dbService.getSpellsOnID(monsterSpells.spell_id)
        monster.spells = spells
       return monster 
    }
}


export async function createCharacter(data){
    const newCharacter = await dbService.createCharacter(data)
    return newCharacter
}

export function setStats(character){
    if(character.level > 1){
       for(let i = 0; i < character.level; i++){
        character.hp = Math.round( +(character.hp * character.level_multiplier))
        character.mp = Math.round(+(character.mp * character.level_multiplier))
        character.atk = Math.round(+(character.atk * character.level_multiplier))
        character.xp_needed = Math.round(+(character.xp_needed * character.level_multiplier))
       }
       return character
    }else{
        return character
    }
}

export function action(action){
    

 
}