import db from "../database/connection.js"
import * as dbService from "./dbService.js"
import { Character } from "../DTO/characterDTO.js"

export async function generateMonster(character){
    if(character.level %5 === 0 ){
        const boss = new Character(await dbService.getMonsterOnType("boss"))
        return boss
    }else{
        const monster = new Character(await dbService.getRandomNormalMonster("normal"))
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
        character.hp = character.hp * character.level_multiplier
        character.mp = character.mp * character.level_multiplier
        character.atk = character.atk * character.level_multiplier
        character.xp_needed = character.xp_needed * character.level_multiplier
       }
       return character
    }else{
        return character
    }
}