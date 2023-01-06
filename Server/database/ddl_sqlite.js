import db from "./connection.js"

const isInDeleteMode = true

if(isInDeleteMode){
    db.exec(`
    DROP TABLE IF EXISTS users
    `),

        db.exec(`
    DROP TABLE IF EXISTS classes
    `),

    db.exec(`
    DROP TABLE IF EXISTS characters
    `),

    db.exec(`
    DROP TABLE IF EXISTS monsters
    `),

    db.exec(`
    DROP TABLE IF EXISTS spells
    `),

    db.exec(`
    DROP TABLE IF EXISTS class_spells
    `)

    db.exec(`
    DROP TABLE IF EXISTS monster_spells
    `)
}

db.exec(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name VARCHAR(255),
    email VARCHAR(255),
    password VARCHAR(255)
)`)

db.exec(`CREATE TABLE IF NOT EXISTS classes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name VARCHAR(255),
    hp INTEGER,
    mp INTEGER,
    atk INTEGER,
    level_multiplier FLOAT
)`)

db.exec(`CREATE TABLE IF NOT EXISTS characters (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name VARCHAR(255) NOT NULL,
    level INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    class_id INTEGER NOT NULL,
    FOREIGN KEY (user_id)
        REFERENCES users (id),
    FOREIGN KEY (class_id)
        REFERENCES classes (id)
)`)

db.exec(`CREATE TABLE IF NOT EXISTS monsters (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name VARCHAR(255),
    type VARCHAR(255),
    hp INTEGER,
    mp INTEGER,
    atk INTEGER,
    level_multiplier FLOAT
)`)

db.exec(`CREATE TABLE IF NOT EXISTS spells (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name VARCHAR(255),
    mp_cost INTERGER

)`)

db.exec(`CREATE TABLE IF NOT EXISTS class_spells (
    spell_id INTEGER NOT NULL,
    class_id INTEGER NOT NULL,
    FOREIGN KEY (spell_id)
        REFERENCES spells (id),
    FOREIGN KEY (class_id)
        REFERENCES classes (id),
    PRIMARY KEY (spell_id, class_id)
)`)

db.exec(`CREATE TABLE IF NOT EXISTS monster_spells (
    spell_id INTEGER NOT NULL,
    monster_id INTEGER NOT NULL,
    FOREIGN KEY (spell_id)
        REFERENCES spells (id),
    FOREIGN KEY (monster_id)
        REFERENCES monsters (id),
    PRIMARY KEY (spell_id, monster_id)
)`)

//seed the database
if(isInDeleteMode){
db.run(`INSERT INTO users (name, email, password)
    VALUES ("Fumio","Fumio@mail.com", "$2b$12$cz207WbhUPTq9aw8v.POGOfK3VV8mvJ.ym08QKYIHyhog86JI9T0u")`)

db.run(`INSERT INTO classes (name, hp, mp, atk, level_multiplier)
    VALUES ("Warrior", 120, 40, 10, 1.3)`)

db.run(`INSERT INTO characters (name, level, user_id, class_id)
    VALUES ("Fumi", 1, 1, 1)`)

db.run(`INSERT INTO monsters (name, type, hp, mp, atk, level_multiplier)
    VALUES ("Goblin", "medium", 80, 20, 4, 1.15)`)

db.run (`INSERT INTO spells (name, mp_cost) 
    VALUES ("Heavy swing", 15)`)

db.run (`INSERT INTO spells (name, mp_cost)
    VALUES ("Rock throw", 15)`)

db.run(`INSERT INTO class_spells (spell_id, class_id) 
    VALUES (1,1)`)

db.run(`INSERT INTO monster_spells (spell_id, monster_id) 
    VALUES (2,1)`)
}