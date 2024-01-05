<script>
  import {authSetup, auth, dbSetup, setupAuthListener, setupDbListener} from "$lib/firebase.js";
//  import * as navigation from "$app/navigation";
//  import { fbStore } from "../../store/fbStore.js";
//  import '../../todomvc-common-base.css'
//  import '../../todomvc-app-css.css'
//  import Authenticate from "../../components/Authenticate.svelte";

  if ( !authSetup) {
    setupAuthListener()
  }
  if ( !dbSetup ) {
    setupDbListener()
  }

/*
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
*/

</script>

<h1>todos</h1>

<slot />

