<script>
    import socket from "../../util/socketConnection"
    import {onMount} from "svelte"
    import { navigate } from 'svelte-navigator'
    import {BASE_URL,IS_LOGGED_IN} from "../../store/globals"
    import { toast } from "@zerodevx/svelte-toast"


    import guard from "../../images/util/soldier.png"
    import warrior from "../../images/classes/warrior.png"
    import paladin from "../../images/classes/paladin.png"
    import goblin from "../../images/monsters/goblin.png"
    import slime from "../../images/monsters/slime.png"
    import dragon from "../../images/monsters/dragon.png"
    
    let connected = false
    

    const imageMap = new Map()
    imageMap.set('Guard', guard)
    imageMap.set('Warrior', warrior)
    imageMap.set('Paladin', paladin)
    imageMap.set('Goblin', goblin)
    imageMap.set('Slime', slime)
    imageMap.set('Dragon', dragon)

    let playerCharacter
    let monsterCharacter
    let hasCharacter = false
    let loadedClasses = false
    let gameEnded = false
    let playerGametext = ''
    let monsterGametext = ''

    let classes = []
    let playerDisplayStats = []
    let monsterDisplayStats = []

    let name =''
    let classid = 1

    async function loginCheck(){
        connected =false
        const response = await fetch(`${$BASE_URL}/api/authorized`,{
            method: "GET",
            credentials: "include"
        })
        if(response.status === 200 ){
            return IS_LOGGED_IN.set(true)
        }else{
            toast.push('Please login to play the game')
            return 
        }
    }

    async function getCharacter(){
        const response = await fetch(`${$BASE_URL}/api/game/character`,{
            method: "GET",
            credentials: "include"
        })
        if(response.status === 200){
            const responseJSON = await response.json()
            hasCharacter = true
            playerCharacter = responseJSON
            playerDisplayStats = [responseJSON.character.hp, responseJSON.character.mp]
        }
        if(response.status === 204){
            toast.push("Looks like you don't have character lets fix that")
            getClasses()
        }
    }
    onMount(loginCheck)

 if($IS_LOGGED_IN.valueOf() === true) {  
   onMount(getCharacter) 
 }

 async function getClasses(){
    loadedClasses = false
    const response = await fetch(`${$BASE_URL}/api/game/classes`,{
            method: "GET",
            credentials: "include"
        })
        const responseJSON = await response.json()
        classes = responseJSON
        console.log(classes)
        console.log(classes[0].hp)
        loadedClasses =true
 }

 async function createCharacter(){
    const response = await fetch(`${$BASE_URL}/api/character`,{
            method: "POST",
            credentials: "include",
            body: JSON.stringify({
                name,
                classid,
            }),
            headers: {
                "Content-type": "application/json"
            }
        })
        if(response.status === 403) {
            toast.push("User already have a character", {
                theme: {
                    '--toastColor': 'white',
                    '--toastBackground': '#a60202',
                    '--toastBarBackground': '#570404'
                }    
            })
        return
        }
        else if(response.status === 200){
            toast.push(`Character created`,{
                duration: 6000
            })
            getCharacter()
            navigate("/game", { replace: false })
            }
    }


 function isNameEmpty(){
        if(name === ''){
            toast.push('A name, email and password is required. Please make sure the fields are filled out', {
                theme: {
                        '--toastColor': 'white',
                        '--toastBackground': '#a60202',
                        '--toastBarBackground': '#570404'
                    },
                duration: 6000        
            })
        }
    } 

      function attack(){
        console.log("pressed")
        if(monsterCharacter.hp >0 ){
          socket.emit("player-action", {"type":'attack', "characterOne" :playerCharacter.character, "characterTwo":monsterCharacter})
         if(playerCharacter.character.hp > 0){
             socket.emit("monster-action", {"characterOne" :monsterCharacter, "characterTwo":playerCharacter.character})
             checkGameEnd()
         }
        }else{
            toast.push("It's already dead")
        }
    }

     function spell(){
        console.log("pressed")
        if(monsterCharacter.hp >0 ){
            if( playerCharacter.character.mp > 0){
                 socket.emit("player-action", {"type":'spell', "characterOne" :playerCharacter.character, "characterTwo":monsterCharacter})
                if(playerCharacter.character.hp > 0){
                     socket.emit("monster-action", {"characterOne" :monsterCharacter, "characterTwo":playerCharacter.character})
                     checkGameEnd()
            }
            }else{
                playerCharacter.character.mp = 0
                toast.push('Not enough mana')
            }
        }else{
            toast.push("It's already dead")
        }
    }

     socket.on("update-after-player" , (data) =>{
            if(monsterCharacter){
                if(monsterCharacter.hp > 0){
                    monsterCharacter.hp = data.hp
                    checkGameEnd()
                }else{
                    monsterCharacter.hp = 0
                }
            }
            if(data.heal){
                if(playerCharacter.character.hp >= playerDisplayStats[0]){
                    playerCharacter.character.hp = playerDisplayStats[0]
                }else{
                    playerCharacter.character.hp = data.heal
                }
            }
            if(data.mp){
                if(data.mp > 0){
                        console.log(data.mp)
                        playerCharacter.character.mp =  data.mp
                    }else{
                    playerCharacter.character.mp = 0
                }
            }
            playerGametext = data.message
    })

    socket.on("update-after-monster", (data) =>{
        console.log(data)
        if(playerCharacter.character){
                if(playerCharacter.character.hp > 0){
                    playerCharacter.character.hp = data.hp
                    checkGameEnd()
                }else{
                    playerCharacter.character.hp = 0
                    
                }
            }
        if(data.mp){
            if(data.mp > 0){
                    console.log(data.mp)
                    monsterCharacter.mp =  data.mp
                }else{
                    monsterCharacter.mp = 0
            }
        }
        monsterGametext = data.message
    })

    function start(){   
        gameEnded =false
        if(socket.connected){
            connected = true
        }
        socket.on("game-started",(data) =>{
            getCharacter()
            monsterCharacter = data
            monsterDisplayStats = [data.hp, data.mp] 
         })
        socket.emit("game-start",  playerCharacter)
    }

    function newMonster(){
        gameEnded =false
        start()
    }

    function checkGameEnd(){
        if(monsterCharacter.hp === 0){
                toast.push("You won")
                socket.emit("game-won", {"player":playerCharacter.character,"monster": monsterCharacter})
                return gameEnded = true
        }
        if(playerCharacter.character.hp === 0){
                toast.push("You lost")
                return gameEnded = true
        }else{
            gameEnded = false
            return gameEnded
        }
    }


</script>


<div class="content">
    <h1>Game page</h1>
    {#if $IS_LOGGED_IN.valueOf() !== true}
        <img id="guard" src={guard} alt="guard">
        <h2>HOLD RIGHT THERE!</h2>
        <h3>You are do not seem well equiped to face the journy ahead. Please Sign-up/login in to travel further</h3>
    {:else}
        {#if !hasCharacter}
        <h2>Create your character</h2>
        <div class="row">
            {#if classid === 1 }
            <div class="column">
                <img  src={warrior} alt="cross">
            </div>
            {:else}
            <div class="column">
                <img  src={paladin} alt="cross">
            </div>
            {/if}
            <div class="column" id="form-column">
                <form on:submit|preventDefault={createCharacter}>  
                    <label>
                        <strong>Class</strong>
                        <select bind:value={classid} name="class-id" id="class-id" required>
                            {#each classes as classes }
                            <option value={classes.id}>{classes.name}</option>
                            {/each}
                        </select>
                    </label>    
                    <div id="class-stats">
                        {#if loadedClasses}
                        <p><strong>HP</strong>:{classes[classid-1].hp}</p>
                        <p><strong>ATTACK</strong>:{classes[classid-1].atk} </p>
                        <p><strong>MP</strong>: {classes[classid-1].mp}</p>
                        <p><strong>SPELLS</strong>: {classes[classid-1].spells.name} <i>MP:{classes[classid-1].spells.mp_cost}</i> </p>
                        {/if}
                    </div>
                    <label>
                        <strong>Name</strong> 
                        <input type="text" name="name" id="character-name" required bind:value={name}/>
                    </label>
                    <label>
                        <button on:click={isNameEmpty} type="submit"> Create character </button>
                    </label>
                </form>
            </div>
        </div>
        {:else}
            {#if !connected || !monsterCharacter}
            <div class="row">
                {#if playerCharacter.character.class === "Warrior"}
                <div class="column">
                <img class="character-class" src={warrior} alt="class-img" />
                </div>
                {:else}
                <div class="column">
                <img class="character-class" src={paladin} alt="class-img" />
                </div>
                {/if}
                <div id="class-div" class="column">
                    <p><strong>LEVEL:</strong> {playerCharacter.character.level}</p>
                    <p><strong>HP:</strong> {playerCharacter.character.hp}</p>
                    <p><strong>MP:</strong> {playerCharacter.character.mp}</p>
                    <p><strong>ATK:</strong> {playerCharacter.character.atk}</p>
                    <button type="button" on:click|preventDefault={start}>Game start</button>
                </div>
            </div>
            {:else if connected && monsterCharacter && playerCharacter && playerDisplayStats && monsterDisplayStats}
            <div class="row">
                <div id="class-div" class="column">
                    <img class="character-class" src={imageMap.get(playerCharacter.character.class)} alt="class-img" />
                    <p><strong>LEVEL:</strong> {playerCharacter.character.level}</p>
                    <p><strong>XP:</strong> {playerCharacter.character.xp}/ {playerCharacter.character.xp_needed}</p>
                    <p><strong>HP:</strong> {playerCharacter.character.hp}/{playerDisplayStats[0]}</p>
                    <p><strong>MP:</strong> {playerCharacter.character.mp}/{playerDisplayStats[1]}</p>
                    <p><strong>ATK:</strong> {playerCharacter.character.atk}</p>
                </div>
                <div id="game-text" class="column">
                    <p>{playerGametext}</p>
                    <p>{monsterGametext}</p>
                </div>
                <div id="class-div" class="column">
                    <img class="character-class" src={imageMap.get(monsterCharacter.name)} alt="class-img" />
                    <p><strong>LEVEL:</strong> {monsterCharacter.level}</p>
                    <p><strong>HP:</strong> {monsterCharacter.hp}/{monsterDisplayStats[0]}</p>
                    <p><strong>MP:</strong> {monsterCharacter.mp}/{monsterDisplayStats[1]}</p>
                    <p><strong>ATK:</strong> {monsterCharacter.atk}</p>
                </div>
            </div>
            <div class="row">
                <div  class="column"></div>
                <div class="column">
                    <button disabled={gameEnded} type="button" on:click={attack}>Attack</button>
                    <button disabled={gameEnded} type="button" on:click={spell}><strong>MP:{playerCharacter.character.spells.mp_cost}</strong> {playerCharacter.character.spells.name}</button>
                    {#if gameEnded}
                    <button type="button" on:click|preventDefault={newMonster}>Find new monster</button>
                    {/if}
                </div>
                <div class="column"></div>
            </div>
            {/if}
        {/if}
    {/if}
</div>

<style >
    .content{
        margin: 0;
        padding: 0%;
        max-width: 90%;
        margin: 0 auto;
        height: 85vh;
        background-color: #3f2c00;
        border-bottom-left-radius: 25px;
        border-bottom-right-radius: 25px;
        
    }

    h1{
        padding-top: 20px;
        margin:0%;
    }
    img#guard{
        padding-right: 100px;
    }
    .row {
        display: flex;
       }
   
    .column {
        flex: 33.33%;
        padding: 5px;
    }

    div#class-stats{
        display: inline;
        justify-content: center;
        align-content: center;
        align-items: center;
        text-align: left;
    }

    div#form-column{
        align-content: center;
        display: flex;
        justify-content: center;
        align-items: center;
    }
   
    form{
        display: inline;
        align-items: center;
    }
   
    label {
        display: Block;
        flex-direction: row;
        text-align: left;
        width: 450px;
        line-height: 36px;
        margin-bottom: 10px;
    }
   
    input{
        display: block;
        height: 30px;
        flex: 0 0 200px;
        font-size: 20px;
        background-color: #f2c853;
        border-radius: 8px;
        border-color:#312200;
        color: #312200;
    }
    .character-class{
        max-width: 80%;
    }

</style>