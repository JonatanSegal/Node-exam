<script context="module">
import {BASE_URL, IS_LOGGED_IN} from "../../store/globals"
import { toast } from "@zerodevx/svelte-toast"

     export async function loginCheck(){
        const response = await fetch(`${BASE_URL}/api/authorized`,{
            method: "GET",
            credentials: "include"
        })
        if(response.status === 200 ){
            return IS_LOGGED_IN.set(true)
        }else{
            toast.push('Please login to face the dragon')
            console.log(response)
            return 
        }
    }
</script>