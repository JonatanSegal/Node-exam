<script>
    import {Router, Link, Route} from "svelte-navigator"
    import {BASE_URL,IS_LOGGED_IN, IS_ADMIN} from "./store/globals"
    import { SvelteToast, toast } from "@zerodevx/svelte-toast"

    import Home from "./pages/Home/Home.svelte"
    import Game from "./pages/Game/Game.svelte"
    import Admin from "./pages/Admin/Admin.svelte"
    import Signup from "./pages/Signup/Signup.svelte"
    import Login from "./pages/Login/Login.svelte"

    import Logo from "./images/util/shield.png"


    function logOut() {
    fetch(`${$BASE_URL}/api/logout`, {
      credentials: "include"
      })
      IS_LOGGED_IN.set(false)
      IS_ADMIN.set(false)
      toast.push("Logged out")
  }

</script>

<Router>
  <nav class="navbar">
    <ul id="navbar-ul">
      <li id="li-logo">
        <Link to="/"><img id=logo src={Logo} alt="logo"></Link>
      </li>
      <li class="link-item">
        <Link to="/">Home</Link>
      </li>
      <li class="link-item">
        <Link to="/game">Game</Link>
      </li>
      {#if $IS_ADMIN.valueOf() === true }
        <li class="link-item">
          <Link to="/admin">Admin</Link>
        </li> 
      {/if}

    {#if $IS_LOGGED_IN.valueOf() !== true}
      <li class="link-item-right">
        <Link to="/login">Login</Link>
      </li>
      <li class="link-item-right">
        <Link to="/signup">Signup</Link>
      </li>
    {:else}
      <li class="link-item-right">
        <Link to="/" on:click={logOut}>Log out</Link>
      </li>
    {/if}
    </ul>
  </nav>

  <div>
    <Route path="/"><Home/></Route>
    <Route path="/game"><Game/></Route>
    <Route path="/admin"><Admin/></Route>
    <Route path="/signup"><Signup/></Route>
    <Route path="/login"><Login/></Route>
  </div>
</Router>

<SvelteToast options={{ reversed: true, intro: { y: -64 } }}/>

<style>
  .navbar {
    display:flex;
    justify-content:space-between;
    align-items:center;
    display: inline;
    width: 70%;
  }
  .link-item{
    padding-left: 6px;
    padding-right: 6px;
    float: left;
    margin-top: 30px;
    margin-bottom: 30px;
    margin-left: 10px;
    margin-right: 10px;
    font-size: 20px;
    vertical-align: middle;
  }
  .link-item-right{
    padding-left: 6px;
    padding-right: 6px;
    float: right;
    margin-top: 30px;
    margin-bottom: 30px;
    margin-left: 10px;
    margin-right: 10px;
    font-size: 20px;
    vertical-align: middle;
  }
  ul {
    position: relative;
    z-index: 100;
    list-style-type: none;
    margin: 0;
    padding: 0;
    border-radius: 25px;
    overflow: hidden;
    background-color: #312200;
    box-shadow: 0 4px 2px -2px rgba(0,0,0,.2);
    
  }
img#logo {
    width: 80px;
    height: 80px;
    padding-right: 10px;
    float:left;
    display: inline;
  }
</style>