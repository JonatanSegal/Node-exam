<script>
    import {onMount} from "svelte"
    import {BASE_URL,IS_LOGGED_IN} from "../../store/globals"
    import { SvelteToast, toast } from "@zerodevx/svelte-toast"
    import auth,{loginCheck} from "../Page_utils/auth.svelte"
    import guard from "../../images/util/soldier.png"
</script>


<div class="content">
    <h1>Game page</h1>
    {#if $IS_LOGGED_IN.valueOf}
        <img id="guard" src={guard} alt="guard">
        <h2>HOLD RIGHT THERE!</h2>
        <h3>You are do not seem well equiped to face the journy ahead. Please Sign-up/login in to travel further</h3>
    {:else}
        <button>Game start</button>
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