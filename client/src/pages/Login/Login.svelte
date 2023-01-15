<script>
    import {IS_LOGGED_IN, BASE_URL, IS_ADMIN} from "../../store/globals"
    import { navigate } from 'svelte-navigator'
    import { toast } from '@zerodevx/svelte-toast'

    import knight from "../../images/util/knight.png"

    let email = ""
    let password = ""
    let role = ""

    async function login(){
        if(email !== "" && password !== ""){
            const response = await fetch(`${$BASE_URL}/api/login`,{
                method: "POST",
                credentials: "include",
                body: JSON.stringify({
                    email,
                    password,
                    role
                }),
                headers: {
                    "Content-type": "application/json"
                }
             })

             if(response.status === 429) {
                toast.push("Too many login attempts", {
                    theme: {
                        '--toastColor': 'white',
                        '--toastBackground': '#a60202',
                        '--toastBarBackground': '#570404'
                } 
                })
                return
            }
            else if(response.status !== 200) {
                toast.push("Wrong email or password", {
                    theme: {
                        '--toastColor': 'white',
                        '--toastBackground': '#a60202',
                        '--toastBarBackground': '#570404'
                }
                })
                return
            }
            const responseJSON = await response.json()
            if(responseJSON.role === "admin"){
                IS_ADMIN.set(true)
            }
            IS_LOGGED_IN.set(true)
            toast.push("Login successful")
            navigate("/", { replace: false }); 
         
        }       
    }
    function isFieldsEmpty(){
        if( email === "" || password === ""){
            toast.push('Email and password required', {
                theme: {
                    '--toastColor': 'white',
                    '--toastBackground': '#a60202',
                    '--toastBarBackground': '#570404'
                },
                duration: 6000     
                })      
            }
        }
   </script>
   
   
   <div class="content">
       <h1>Login page</h1>
       <div class="row">
           <div class="column">
               <img src={knight} alt="guide">
           </div>
           <div class="column" id="form-column">
               <form on:submit|preventDefault={login}>  
                   <label>
                       Email
                       <input type="email" name="email" id="email-id" required bind:value={email}/> 
                       <span hidden>Error message</span>
                   </label>
                   
                   <label>
                       Password 
                       <input type="password" name="password" id="password-id" required bind:value={password}/>
                   </label>
                   <label>
                    <button type="submit" on:click={isFieldsEmpty}> Login </button>
                   </label>
               </form>
           </div>
       </div>
       <h2>Get your gear and lets go.</h2>
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
   
       .row {
           display: flex;
       }
   
       .column {
           flex: 33.33%;
           padding: 5px;
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
   </style>