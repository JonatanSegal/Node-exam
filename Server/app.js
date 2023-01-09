import dotenv from "dotenv"
dotenv.config()

import express from "express"
const app = express()

import rateLimit from 'express-rate-limit'
import session from "express-session"
import helmet from "helmet"
import cors from "cors"

app.use(cors({ credentials: true, origin: true }))
app.use(express.json())
app.use(helmet())
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
  }))

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
app.listen(PORT, () => {
    console.log(`APP is running on: ${PORT}`)
})

