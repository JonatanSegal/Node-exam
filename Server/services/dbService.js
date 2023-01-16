import db from "../database/connection.js"

export async function getAllUsers() {
    return await db.all(`SELECT * FROM users`)
}

export async function getAllclasses() {
    return await db.all(`SELECT * FROM classes`)
}

export async function getAllCharacters() {
    return await db.all(`SELECT * FROM characters`)
}

export async function getAllMonsters() {
    return await db.all(`SELECT * FROM monsters`)
}

export async function getAllSpells() {
    return await db.all(`SELECT * FROM spells`)
}

export async function getUserOnID(data){
    return await db.get(`SELECT * FROM users WHERE id = ?`, data)
}

export async function getUserOnEmail(data){
    return await db.get(`SELECT * FROM users WHERE email = ?`, data)
}

export async function getMonsterOnID(data){
    return await db.get(`SELECT * FROM monsters WHERE id =?`, data)
}

export async function getCharacterOnUserID(data){
    return await db.get(`SELECT * FROM characters WHERE user_id =? `, data)
}

export async function getClassOnID(data){
    return await db.get(`SELECT * FROM classes WHERE id = ?`, data)
}

export async function getMonsterOnType(data){
    return await db.get(`SELECT * FROM monsters WHERE type =?`, data)
}

export async function getRandomNormalMonster(data){
    return await db.get(`SELECT * FROM monsters WHERE type =? ORDER BY RANDOM() LIMIT 1`, data)
}

export async function getSpellsOnClass(data) {
    return await db.get("SELECT * FROM spells WHERE id = ?", data.spell_id)
}

export async function getSpellsForClass(data) {
    return await db.get("SELECT * FROM class_spells WHERE class_id = ?", data)
}




export async function updateUser(data){
    return await db.run(`UPDATE users SET name=?, email=?, password=?, role=? WHERE id=?`,[data.name, data.email, data.password, data.role, data.userid] )
}

export async function createUser(data){
return await db.run(`INSERT INTO users(name, email, password, role) VALUES (?,?,?,?) `,[data.name, data.email, data.password, "user"])
}

export async function createCharacter(data){
    return await db.run(`INSERT INTO characters(name, level, user_id, xp, class_id) VALUES (?,?,?,?,?) `,[data.name,"1",data.userid, "0",data.classid])
}