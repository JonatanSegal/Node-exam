import dotenv from 'dotenv'
dotenv.config()

import express from 'express'
const app = express()

import http from 'http'
import {Server} from 'socket.io'
import rateLimit from 'express-rate-limit'
import session from 'express-session'
import helmet from 'helmet'
import cors from 'cors'
import * as gameService from './services/gameService.js'
import * as dbService from './services/dbService.js'



app.use(cors({ credentials: true, origin: true }))
app.use(express.json())
app.use(helmet())
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }}))
app.use(express.static("public"))


const server = http.createServer(app)
const io = new Server(server,{
    cors:{credentials: true, origin: true }
})

io.on("connection", (socket) =>{

        socket.on('game-start',  async(data) =>{

            const monster =  await gameService.generateMonster(data.character)
            monster.level = data.character.level
            gameService.setStats(monster)
            socket.emit("game-started", monster)
        })

        socket.on("player-action",  (data) =>{
            const values = gameService.action(data)
            socket.emit("update-after-player", values)
        })
        
        socket.on("monster-action",  async (data)=>{
            const type = gameService.monsterAction()
            data.type = type
            const values = gameService.action(data)
            await socket.emit("update-after-monster", values)
        })
        socket.on("game-won", async(data) =>{
            const xp = gameService.calculateXP(data.monster, data.player)
            data.player.xp = data.player.xp + xp
            data.player = gameService.levelUpCheck(data.player)
            await dbService.updateCharacter(data.player)
        })

    socket.on("disconnect", () => {
        socket.removeAllListeners()
        socket.disconnect()
    })
})

const generalLimiter = rateLimit({
    windowMs: 10 * 60 * 1000,
    max: 150,
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers
})
app.use(generalLimiter)

const loginLimit = rateLimit({
	windowMs: 5 * 60 * 1000, // 5 minutes
	max: 5, // 5 requests per 5 minutes
})
app.use("/api/login", loginLimit)

import adminRouter from "./routers/adminRouter.js"
app.use(adminRouter)
import authRouter from "./routers/authRouter.js"
app.use(authRouter)
import gameRouter from "./routers/gameRouter.js"
app.use(gameRouter)


app.get("*", (req, res) => {
    res.send(`<h1>404</h1><br><h3>Could not find page</h3>`)
})

const PORT = 8080 || process.env.PORT
server.listen(PORT, () => {
    console.log(`Server is running on: ${PORT}`)
})

