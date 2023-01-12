<script>
 import magician from "../../images/util/magician.png"
</script>


<div class="content">
    <h1>Signup page</h1>
    <div class="row">
        <div class="column">
            <img src={magician} alt="guide">
        </div>
        <div class="column" id="form-column">
            <form >
                <label>
                    Name 
                    <input type="text" name="name" id="name-id" required  /> 
                </label>
        
                <label>
                    Email
                    <input type="email" name="email" id="email-id" required /> 
                    <span hidden>Error message</span>
                </label>
                
                <label>
                    Password 
                    <input type="password" name="password" id="password-id" required />
                </label>
                <label>
                <button type="submit"> Sign up </button>
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