<script>
    //import {io} from "socket.io-client"
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

    let classes = []

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
    onMount(loginCheck)

 if($IS_LOGGED_IN.valueOf() === true) {  
    async function getCharacter(){
        const response = await fetch(`${$BASE_URL}/api/game/character`,{
            method: "GET",
            credentials: "include"
        })
        if(response.status === 200){
            const responseJSON = await response.json()
            hasCharacter = true
            playerCharacter = responseJSON
        }
        if(response.status === 204){
            toast.push("Looks like you don't have character lets fix that")
            getClasses()
        }
    }
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
        socket.emit("player-action", ['attack',playerCharacter.character, monsterCharacter])
    }

    function spell(){
        console.log("pressed")
        socket.emit("player-action", ['spell',playerCharacter.character, monsterCharacter])
    }

    function start(){   
        if(socket.connected){
            connected = true
        }
        socket.on("connect_error", () => {
            connected = false
        })

        socket.on("game-started", (data) =>{
            monsterCharacter = data
            console.log("game started")
        })
        socket.emit("game-start",  playerCharacter)
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
            </div>
            <br>
            <button type="button" on:click|preventDefault={start}>Game start</button>
            {:else if connected && monsterCharacter && playerCharacter}
            <div class="row">
                <div id="class-div" class="column">
                    <img class="character-class" src={imageMap.get(playerCharacter.character.class)} alt="class-img" />
                    <p>HP:{playerCharacter.character.hp}</p>
                    <p>MP:{playerCharacter.character.mp}</p>
                    <p>ATK:{playerCharacter.character.atk}</p>
                </div>
                <div id="game-text" class="column">
                    <p></p>
                    <button type="button" on:click={attack}>Attack</button>
                    <button type="button" on:click={spell}><strong>MP:{playerCharacter.character.spells.mp_cost}</strong> {playerCharacter.character.spells.name}</button>
                </div>
                <div id="class-div" class="column">
                    <img class="character-class" src={imageMap.get(monsterCharacter.name)} alt="class-img" />
                    <p>HP:{monsterCharacter.hp}</p>
                    <p>MP:{monsterCharacter.mp}</p>
                    <p>ATK:{monsterCharacter.atk}</p>
                </div>
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