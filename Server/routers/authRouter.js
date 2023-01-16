import { Router } from 'express'
import db from '../database/connection.js'
import bcrypt from 'bcrypt'
import { signUpMail } from '../services/emailService.js'
import { containsNumbers } from '../util/passwordUtil.js'
import { User } from '../DTO/userDTO.js'
import { createUser,getUserOnEmail } from '../services/dbService.js'

const saltRounds = 12
const router = Router()

router.get("/api/login", (req, res) => {
    res.send({message: "You are about to login"})
})

router.get("/api/logout", (req, res) => {
    req.session.isLoggedIn = false
    req.session.isAdmin = false
    res.sendStatus(200)
})

router.get("/api/authorized", (req, res ) => {   
    if(req.session.isLoggedIn !== true){
        return res.status(401).send({message: "You are not logged in stay away"})
    }
        res.status(200).send({message: "Welcome to the exam adventure"})
})

//POST - Sign up new user
router.post("/api/sign-up", async (req, res) => {
    const user = new User(req.body)
    
    if (!user.name) return res.status(400).send({ message: "Name not defined" })
    if (!user.email) return res.status(400).send({ message: "Email not defined" })
    if (!user.password) return res.status(400).send({ message: "Password not defined" })
    if(user.password.length < 5 || containsNumbers(user.password) !== true) return res.status(400).send({message: "Password must be 5 characters and contain 1 number"})
   
    try{
        const result = await db.get(`SELECT * FROM users WHERE email = ?`, user.email)
        
        if(result === undefined){             
            const encryptedpassword = await bcrypt.hash(user.password, saltRounds)
            user.password = encryptedpassword
        
            await createUser(user)
            signUpMail(user.email, user.name)    
            .then(result => {
                res.status(200).send({Link: result})})
            .catch(console.error)
        }
        else{
            if(result.email === user.email){
                return res.status(403).send({message: "User already exists"})
            }
        }
    }catch{
        console.error()
    }
})

//POST - Login
router.post("/api/login", async (req,res) => {
    const user = new User(req.body)

    if (!user.email) return res.status(400).send({ message: "Email not defined" })
    if (!user.password) return res.status(400).send({ message: "Password not defined" })

    try{
        const result = await getUserOnEmail(user.email)

        
        if(result === undefined){
            return res.status(404).send({message: "User not found"})
        }
        else{
            const encryptedpassword = result.password
            const loginPassword = user.password
            const passwordComparison = await bcrypt.compare(loginPassword, encryptedpassword)
            
            if(passwordComparison  === true){
                user.id = result.id
                user.role = result.role
                if(user.role === "admin"){
                    req.session.isAdmin = true
                }
                req.session.isLoggedIn = true
                req.session.userID =  user.id
                return res.status(200).send({role:user.role})
            }
            else {
                return res.status(401).send({message: "Passwords didn't match"})
            }
        }
    }catch{
        console.error()
    }
})

export default router