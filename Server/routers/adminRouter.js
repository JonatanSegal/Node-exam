import { Router } from "express"
const router = Router()

import * as dbService from "../services/dbService.js"

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


router.put("/api/user", async(req, res) =>{
    res.send()
})




export default router