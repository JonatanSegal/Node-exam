import db from "./connection.js"

const isInDeleteMode = true

if(isInDeleteMode){
    db.exec(`
    DROP TABLE IF EXISTS users
    `)
}

db.exec(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name VARCHAR(255),
    email VARCHAR(255),
    password VARCHAR(255)
    )
`)

//seed the database
if(isInDeleteMode){
db.run(`INSERT INTO users (name, email, password)
    VALUES ("Fumio","Fumio@mail.com", "$2b$12$cz207WbhUPTq9aw8v.POGOfK3VV8mvJ.ym08QKYIHyhog86JI9T0u")`)
}