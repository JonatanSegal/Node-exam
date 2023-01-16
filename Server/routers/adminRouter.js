import { Router } from 'express'
const router = Router()

import * as dbService from '../services/dbService.js'

router.get("/api/admin", (req, res ) => {   
    if(req.session.isLoggedIn !== true){
        return res.status(401).send({message: "You are not logged in stay away"})
    }
    if(req.session.isAdmin !== true){
        return res.status(403).send({message: "You are not an admin not allowed in here"})
    }else{
        res.status(200).send({message: "Welcome to the admin page"})
    }
})

router.get("/api/users", async (req, res) => {
    const DATA = await dbService.getAllUsers()
    res.send(DATA)
})

router.get("/api/characters", async (req, res) => {
    const DATA = await dbService.getAllCharacters()
    res.send(DATA)
})

router.get("/api/monsters", async (req, res) =>{
    const DATA = await dbService.getAllMonsters()
    res.send(DATA)
})

router.get("/api/spells", async (req, res) => {
    const DATA = await dbService.getAllSpells()
    res.send(DATA)
})

router.get("/api/classes", async (req, res) =>{
    const DATA = await dbService.getAllclasses()
    res.send(DATA)
})

router.put("/api/user", async(req, res) =>{
    res.send()
})




export default router