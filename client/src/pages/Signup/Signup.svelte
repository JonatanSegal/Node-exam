<script>
    import { toast } from '@zerodevx/svelte-toast'
    import { navigate } from 'svelte-navigator'
    import { BASE_URL } from '../../store/globals.js'


    import magician from "../../images/util/magician.png"

    let name = ""
    let email = ""
    let password = ""

    function containsNumbers(str){
        return /[0-9]/.test(str)
    }

    async function signUp(){
    if(name !== "" && email !== "" && password !== ""){
        if(password.length < 5 || containsNumbers(password) !== true){
            toast.push('Password must be 5 characters and have at least 1 number',{
                theme: {
                        '--toastColor': 'white',
                        '--toastBackground': '#a60202',
                        '--toastBarBackground': '#570404'
                    },
                duration: 6000        
            })
            return
        }

        const response = await fetch(`${$BASE_URL}/api/sign-up`,{
            method: "POST",
            credentials: "include",
            body: JSON.stringify({
                name,
                email,
                password
            }),
            headers: {
                "Content-type": "application/json"
            }
        })

        if(response.status === 403) {
            toast.push("User already exists", {
                theme: {
                    '--toastColor': 'white',
                    '--toastBackground': '#a60202',
                    '--toastBarBackground': '#570404'
                }    
            })
        return
        }
        else if(response.status === 200){
            const emailLink = await response.json()
            toast.push(`Sign-up successful, conmfirmation <a id="email-link" href="${emailLink.Link}" style="color:#747bff">email</a>`,{
                duration: 6000
            })
            navigate("/", { replace: false });
            }
        }           
    }

    function isFieldsEmpty(){
        if(name === "" || email === "" || password === ""){
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
</script>


<div class="content">
    <h1>Signup page</h1>
    <div class="row">
        <div class="column">
            <img src={magician} alt="guide">
        </div>
        <div class="column" id="form-column">
            <form on:submit|preventDefault={signUp}>
                <label>
                    Name 
                    <input type="text" name="name" id="name-id" required bind:value={name} /> 
                </label>
        
                <label>
                    Email
                    <input type="email" name="email" id="email-id" required bind:value={email} /> 
                    <span hidden>Error message</span>
                </label>
                
                <label>
                    Password 
                    <input type="password" name="password" id="password-id" required bind:value={password} />
                </label>
                <label>
                <button type="submit"on:click={isFieldsEmpty}> Sign up </button>
                </label>
            </form>
        </div>
    </div>
    <h2>Ready to go on an adventure.</h2>
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