import { Router } from "express"
import { Server } from "socket.io"
const router = Router()

import * as gameService from "../services/gameService.js"
import * as dbService from "../services/dbService.js"

router.get("/api/game", async(req,res)=>{
    const userCharacter = await dbService.getCharacterOnUserID(req.session.userID)
    const DATA = await gameService.generateMonster(userCharacter)
    res.send(DATA)
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
            await res.send(gameService.createCharacter(data))
        }else if(result.user_id === req.session.userID){
            return res.status(403).send({message: "User already has a character"})
        }

    }catch{
        console.error()
    }
})

export default router
