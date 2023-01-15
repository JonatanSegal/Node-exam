<script>
    import {onMount} from "svelte"
    import {BASE_URL,IS_LOGGED_IN} from "../../store/globals"
    import { toast } from "@zerodevx/svelte-toast"
    import guard from "../../images/util/soldier.png"
    import cross from "../../images/util/cross-swords.png"
    import warrior from "../../images/classes/warrior.png"
    import paladin from "../../images/classes/paladin.png"

    let playerCharacter;
    let monsterCharacter;
    let hasCharacter = false

    async function loginCheck(){
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
        const response = await fetch(`${$BASE_URL}/api/character`,{
            method: "GET",
            credentials: "include"
        })
        const responseJSON = await response.json()
        if(response.status === 200){
            hasCharacter = true
            playerCharacter = responseJSON
            console.log(playerCharacter)

        }
    }
   onMount(getCharacter) 
 }

</script>


<div class="content">
    <h1>Game page</h1>
    {#if $IS_LOGGED_IN.valueOf() !== true}
        <img id="guard" src={guard} alt="guard">
        <h2>HOLD RIGHT THERE!</h2>
        <h3>You are do not seem well equiped to face the journy ahead. Please Sign-up/login in to travel further</h3>
    {:else}
        {#if hasCharacter === false}
        <img id="cross" src={cross} alt="cross">
        <br>
        <button>Create character</button>
        {:else}
            {#if playerCharacter.character.class === "Warrior"}
             <img src={warrior} alt="class-img" />
            {:else}
             <img src={paladin} alt="class-img" />
            {/if}
            <br>
            <button>Game start</button>
        {/if}
    {/if}
</div>

<style>
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
</style>