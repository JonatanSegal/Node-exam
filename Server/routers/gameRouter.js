import { Router } from 'express'
import { Server } from 'socket.io'
const router = Router()

import * as gameService from '../services/gameService.js'
import * as dbService from '../services/dbService.js'
import { Character } from '../DTO/characterDTO.js'

router.get("/api/game/character", async(req,res)=>{
    if(req.session.isLoggedIn !== true){
        return res.status(401).send({message: "You must be logged in to try the game"})
    }
    const userCharacter = await dbService.getCharacterOnUserID(req.session.userID)
    if(userCharacter === undefined){
        return res.status(204).send({message: "No character found for this user"})
    }
    const userClass = await dbService.getClassOnID(userCharacter.class_id)
    const character = new Character(userCharacter)
    
    character.classid = userClass.id
    character.class = userClass.name
    character.hp = userClass.hp
    character.atk = userClass.atk
    character.mp = userClass.mp
    character.level_multiplier = userClass.level_multiplier

    const classSpells = await dbService.getSpellsForClass(character.classid)
    const spells = await dbService.getSpellsOnID(classSpells.spell_id)

    character.spells = spells
    gameService.setStats(character)
    res.status(200).send({character:
        {
            userid: character.userid,
            name: character.name, 
            class: character.class, 
            level: character.level, 
            level_multiplier: character.level_multiplier,
            hp: character.hp,
            mp : character.mp,
            xp: character.xp,
            atk: character.atk,
            spells:character.spells,
            xp_needed: character.xp_needed,
        }})
})

router.get("/api/game/classes", async (req, res) =>{
    const DATA = await dbService.getAllclasses()
    for(let i = 0 ; i < DATA.length; i++){
    const spells = await dbService.getSpellsOnID(DATA[i].id)
    DATA[i].spells = spells
    }
    res.send(DATA)
})


router.get("/api/game/monster", async(req,res)=>{
    if(req.session.isLoggedIn !== true){
        return res.status(401).send({message: "You must be logged in to try the game"})
    }
    const userCharacter = await dbService.getCharacterOnUserID(req.session.userID)
    const monster = await gameService.generateMonster(userCharacter)
    monster.level = userCharacter.level
    gameService.setStats(monster)
    res.send(monster)
})


router.post("/api/character", async(req, res) =>{
    if(req.session.isLoggedIn !== true){
        return res.status(401).send({message: "You must be logged in to create a character"})
    }
    try{
        const result = await dbService.getCharacterOnUserID(req.session.userID)
        
        if(result === undefined){
            const id =  req.session.userID
            const data = req.body
            data.userid = id
            await res.status(200).send(gameService.createCharacter(data))
        }else if(result.user_id === req.session.userID){
            return res.status(403).send({message: "User already has a character"})
        }

    }catch{
        console.error()
    }
})

export default router
