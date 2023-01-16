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
    console.log(`A socket connectd on id ${socket.id}`)

    socket.emit("connected")
    socket.on('game-start', async (data) =>{

        const monster = await gameService.generateMonster(data.character)
        monster.level = data.character.level
        gameService.setStats(monster)

        console.log(monster)
        socket.emit("game-started", monster)
        socket.on("player-attack", async (data) =>{
            console.log(data)
        })

    })
    

    socket.on("disconnect", () => {
        console.log(`Socket ${socket.id} left.`)
    })
})

const generalLimiter = rateLimit({
    windowMs: 10 * 60 * 1000,
    max: 80,
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

