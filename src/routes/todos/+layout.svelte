<script>
  import {authSetup, auth, dbSetup, setupAuthListener, setupDbListener} from "$lib/firebase.js";
  import * as navigation from "$app/navigation";
  import { fbStore } from '../../store/fbStore';
//  import './todomvc-common-base.css'
//  import './todomvc-app-css.css'
  import Authenticate from "../../components/Authenticate.svelte";

  if ( !authSetup) {
    setupAuthListener()
  }
  if ( !dbSetup ) {
    setupDbListener()
  }

  let user = null
  fbStore.subscribe( (curr) => {
    if ( curr.user ) {
      console.log('user found', curr.user )
      user = curr.user
    } else {
     // redirect(307,'/todos/auth')
      navigation.goto('/todos/auth')
    }
  })

</script>

<div>
  <nav class="todo-container">
    <a href="/todos/auth">Login</a>
  </nav>
  <slot />
</div>

<style>
  /*
//  import './todomvc-common-base.css'
//  import './todomvc-app-css.css'

   */
   @import "./todomvc-app-css.css";
   @import "./todomvc-common-base.css";
</style>
