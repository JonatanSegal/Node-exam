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
        character.spells.value = Math.round(+(character.spells.value * character.level_multiplier))
        character.xp_needed = Math.round(+(character.xp_needed * character.level_multiplier))
       }
       return character
    }else{
        return character
    }
}

export function calculateXP(monster,player){
    let baseXP = 10
    if(monster.type === "boss"){
        baseXP = player.xp_needed
        return baseXP
    }else{
        for(let i = 0; i < monster.level; i++){
            baseXP = Math.round(+(baseXP * monster.level_multiplier))
            }

        return baseXP
    }
}

export function levelUpCheck(player){
    if(player.xp > player.xp_needed){
        player.level = player.level + 1
        player.xp = 0
        player.xp_needed = player.xp_needed * player.level_multiplier
        return player
    }
    return player
}

export async function updateCharacter(character){
    return await dbService.updateCharacter(character)
}

export function monsterAction(){
    const randomNumber = Math.floor(Math.random()*10) + 1
    if(randomNumber > 2){
        return 'attack'
    }else{
        return 'spell'
    }
}

export function action(action){
    switch (action.type){
        
        case 'attack':{
            let hp = action.characterTwo.hp
            //console.log(" HP before " + HP)
            //console.log("attack action")
            hp = hp - action.characterOne.atk
            //console.log("HP after " +HP)
            if(hp < 0){
                hp = 0
            }
            let message = `${action.characterOne.name} dealt ${action.characterOne.atk} to ${action.characterTwo.name}`
            return {"hp":hp, "message":message}
        }
    
        case 'spell':{
            let hp = action.characterTwo.hp
            let mp = action.characterOne.mp
            let message
            if(action.characterOne.spells.name === "Holy shock"){
                let healHP = action.characterOne.hp
                let healValue = Math.round(+(action.characterOne.spells.value/2))
                hp = hp - action.characterOne.spells.value
                healHP = healHP + healValue
                mp = mp - action.characterOne.spells.mp_cost
                if(hp < 0){
                    hp = 0
                }
                if(mp < 0){
                    mp = -1
                }
                message = `${action.characterOne.name} used ${action.characterOne.spells.name} 
                on ${action.characterTwo.name} it dealt ${action.characterOne.spells.value} damage
                and healed ${action.characterOne.name} for ${healValue}`
                return {"hp":hp, "mp":mp, "heal":healHP, "message":message}
            }else{
                hp = hp - action.characterOne.spells.value
                mp = mp - action.characterOne.spells.mp_cost
                if(hp < 0){
                    hp = 0
                }
                if(mp < 0){
                    mp = -1
                }
                message =`${action.characterOne.name} used ${action.characterOne.spells.name} 
                on ${action.characterTwo.name} it dealt ${action.characterOne.spells.value} damage`
                return {"hp":hp, "mp":mp, "message":message}
            }
        }
    }    
}

 