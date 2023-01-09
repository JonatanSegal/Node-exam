import db from "../database/connection.js"

export async function getAllUsers() {
    return await db.all("SELECT * FROM users")
}

export async function getAllCharacters() {
    return await db.all("SELECT * FROM characters")
}

export async function getAllMonsters() {
    return await db.all("SELECT * FROM monsters")
}

export async function getAllSpells() {
    return await db.all("SELECT * FROM spells")
}

export async function getUserOnID(data){
    return await db.get(`SELECT * FROM users WHERE id = ?`, data)
}

export async function getMonsterOnID(data){
    return await db.get(`SELECT * FROM monsters WHERE type =?`, data)
}

export async function getCharacterOnUserID(data){
    return await db.get(`SELECT * FROM characters WHERE user_id =? `, data)
}

export async function getClassOnID(data){
    return await db.get(`SELECT * FROM classes WHERE id = ?`, data)
}

export async function getMonsterOnType(data){
    return await db.get(`SELECT * FROM monsters WHERE type =?`, data.type)
}




export async function updateUser(data){
    return await db.run(`UPDATE users SET name=?, email=?, password=?, role=? WHERE id=?`,[data] )
}


export async function createCharacter(data){
    return await db.run(`INSERT INTO characters(name, level, user_id, class_id) VALUES (?,?,?,?) `,[data.name,"1",data.userid, data.classid])
}