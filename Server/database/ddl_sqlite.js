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
    password VARCHAR(255),
    role VARCHAR(255)
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
    xp INTEGER NOT NULL,
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
    mp_cost INTEGER,
    value INTEGER

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
db.exec(`INSERT INTO users (name, email, password, role)
    VALUES ("Fumio","Fumio@mail.com", "$2b$12$cz207WbhUPTq9aw8v.POGOfK3VV8mvJ.ym08QKYIHyhog86JI9T0u", "admin")`)

db.exec(`INSERT INTO classes (name, hp, mp, atk, level_multiplier)
    VALUES ("Warrior", 120, 40, 10, 1.2)`)

db.exec(`INSERT INTO classes (name, hp, mp, atk, level_multiplier)
    VALUES ("Paladin", 90, 60, 8, 1.2)`)

db.exec(`INSERT INTO characters (name, level, user_id, xp, class_id)
    VALUES ("Fumi", 5, 1, 0, 1)`)

db.exec(`INSERT INTO monsters (name, type, hp, mp, atk, level_multiplier)
    VALUES ("Goblin", "normal", 80, 20, 4, 1.15)`)

db.exec(`INSERT INTO monsters (name, type, hp, mp, atk, level_multiplier)
    VALUES ("Slime", "normal", 40, 0, 2, 1.1)`)

db.exec(`INSERT INTO monsters (name, type, hp, mp, atk, level_multiplier)
    VALUES ("Dragon", "boss", 140, 80, 12, 1.25)`)

db.exec(`INSERT INTO spells (name, mp_cost, value) 
    VALUES ("Heavy swing", 15, 18)`)

db.exec(`INSERT INTO spells (name, mp_cost, value) 
    VALUES ("Holy shock", 15, 10)`)

db.exec(`INSERT INTO spells (name, mp_cost, value)
    VALUES ("Rock throw", 15, 8)`)

db.exec(`INSERT INTO spells (name, mp_cost, value)
    VALUES ("Flame breath", 25, 20)`)

db.exec(`INSERT INTO class_spells (spell_id, class_id) 
    VALUES (1,1)`)

db.exec(`INSERT INTO class_spells (spell_id, class_id) 
    VALUES (2,2)`)
    
db.exec(`INSERT INTO monster_spells (spell_id, monster_id) 
    VALUES (3,1)`)

db.exec(`INSERT INTO monster_spells (spell_id, monster_id) 
    VALUES (4,3)`)
}
