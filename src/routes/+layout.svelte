<script>
  import { auth, authSetup, setupAuthListener, dbSetup, setupDbListener} from "$lib/firebase.js";
  import { fbStore } from "../store/fbStore";
  import {signInWithEmailAndPassword} from "firebase/auth";

  if ( !authSetup ) {
    setupAuthListener().then( () => {

    })
  }
/*
  if ( !dbSetup ) {
    setupDbListener()
  }
*/

  let user = undefined
  let uname = ''
  let upass = ''
  let error

  fbStore.subscribe( (val) => {
    user = val.user
  })

  async function onLogout() {
    await auth.signOut()
    user = null
  }

  async function onSubmit() {
    signInWithEmailAndPassword( auth, uname, upass)
      .then( (rtn) => {
        user = rtn
      })
      .catch( (err) => {
        error = err
      })
  }

</script>

{#if user}
  <button on:click={onLogout}>LOGOUT</button>
  <slot></slot>
{:else}
  <h2>Please login ...</h2>
  <div class="container">
    {#if error}
    <p class="login-error">
      {error.message}
    </p>
      {/if}
    <label for="uname">Username</label>
    <input type="text" id="uname" name="uname" bind:value={uname}>
    <label for="upass">Password</label>
    <input type="password" id="upass" name="upass" bind:value={upass}>
    <button class="default" on:click={onSubmit}>Submit</button>
  </div>

{/if}

<style>
  .container {
    display: flex;
    flex-direction: column;
    max-width: 18rem;
    border: 1px solid black;
    border-radius: 7px;
    padding: 12px;
  }

  .login-error {
    color: darkred;
    font-weight: bold;
  }
</style>
