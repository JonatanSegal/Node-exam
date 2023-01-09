import db from "../database/connection.js"
import * as dbService from "./dbService.js"
import { Character } from "../DTO/characterDTO.js"

const gameState = {
    "gammeID":"",
    "player":"",
    "monser":""
}

export async function generateMonster(character){
    if(character.level % 5 === 0){
        const boss = new Character(await dbService.getMonsterOnType("boss"))
        return boss
    }else{
       return console.log("Send slime or goblin") 
    }
}


export async function createCharacter(data){
    const newCharacter = await dbService.createCharacter(data)

    return console.log(newCharacter.changes)
}