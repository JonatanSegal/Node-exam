<script>
// @ts-nocheck

    import {BASE_URL, IS_ADMIN, IS_LOGGED_IN} from "../../store/globals"
    import { toast } from "@zerodevx/svelte-toast"
    import {onMount} from "svelte"
    import guard from "../../images/util/soldier.png"
    import SvelteTable from 'svelte-table'


    async function loginCheck(){
        const response = await fetch(`${$BASE_URL}/api/admin`,{
            method: "GET",
            credentials: "include"
        })
        if(response.status === 403) {
            IS_LOGGED_IN.set(true)
            toast.push("Only admins are allowed", {
                theme: {
                    '--toastColor': 'white',
                    '--toastBackground': '#a60202',
                    '--toastBarBackground': '#570404'
                }})
            return
            }
        if(response.status === 200 ){
            IS_LOGGED_IN.set(true)
            IS_ADMIN.set(true)
            return 
        }else{
            toast.push('Please login to view this page')
            return 
        }
    }
    onMount(loginCheck)

    let options = [{id:1, text:'users'},{id:2, text:'classes'}, {id:3, text:'characters'}, {id:4, text:'monsters'},{id:5, text:'spells'}]
    let selected 
    let placeholder = 'Select options'

    let columns= []
    let rows = []
    let tableLoaded = false
    
    async function getData(){
        tableLoaded = false
        columns =[]
        rows = []
        const response = await fetch(`${$BASE_URL}/api/${selected}`,{
            method: "GET",
            credentials: "include"
        })
        const responseJSON = await response.json()
        rows = responseJSON
		for (var i = 0; i < Object.keys(rows[0]).length; i++) {
			const key = Object.keys(rows[0])[i]
			columns.push({key, title: key, value: v => v[key], sortable: true,})
		}
        tableLoaded = true
    }


</script>


<div class="content">
    <h1>Admin page</h1>
        {#if $IS_LOGGED_IN.valueOf() !== true}
            <img id="guard" src={guard} alt="guard">
            <h2>HOLD RIGHT THERE!</h2>
            <h3>You must be logged in to see this page</h3>
        {:else}
            {#if $IS_ADMIN.valueOf() !== true}
                <img id="guard" src={guard} alt="guard">
                <h2>STOP RIGHT THERE!</h2>
                <h3>You are not an admin</h3>
            {:else}
                <select  bind:value={selected} on:change={getData} name="class-id" id="class-id" required>
                    {#if placeholder}
                    <option value="" disabled selected>{placeholder}</option>
                    {/if}
                    {#each options as option }
                        <option value={option.text}>{option.text}</option>
                    {/each}
                </select>
                <br>
                {#if tableLoaded }
                <div class="my-svelte-table">  
                    <SvelteTable 
                    columns="{columns}" rows="{rows}" contenteditable ="true">
                    </SvelteTable>
                </div> 
                {/if}
                
            {/if}
        {/if}
</div>

<style>
    :global(.my-svelte-table){
        display: flex;
        width: 75%;
        margin-left: auto;
        margin-right: auto;   
    }
    :global(.my-svelte-table th){
        border:#312200 5px;
        text-align: center;
        padding: 5px;
    }
    :global(.my-svelte-table td){
        text-align: center;
        padding: 5px;
        background-color: #312200;
        box-shadow: 0 4px 2px -2px rgba(0,0,0,.2)
    }
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