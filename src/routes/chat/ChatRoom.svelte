<script> import {onMount} from 'svelte';
import {collection, addDoc, query, orderBy, limit, onSnapshot} from 'firebase/firestore';
import {getAuth, signInWithPopup, GoogleAuthProvider} from 'firebase/auth';
// Firebase configuration object const firebaseConfig = { // Your Firebase project configuration };
// Initialize Firebase firebase.initializeApp(firebaseConfig);
 // Firestore database reference const db = firebase.firestore();
// Authentication reference const auth = firebase.auth();
// Google authentication provider
 const provider = new GoogleAuthProvider();
 let messages = [];
onMount(() => {
  const q = query(collection(db, 'messages'), orderBy('timestamp', 'desc'), limit(50));
  const unsubscribe = onSnapshot(q, (querySnapshot) => {
    messages = [];
    querySnapshot.forEach((doc) => {
      messages.unshift(doc.data());
    });
  });
  return unsubscribe;
});
const login = async () => {
  try {
    await signInWithPopup(auth, provider);
  } catch (error) {
    console.log(error);
  }
};
const sendMessage = async (event) => {
  event.preventDefault();
  const messageInput = event.target.querySelector('input[name="message"]');
  const message = messageInput.value.trim();
  if (message === '') return;
  messageInput.value = '';
  const {uid, displayName, photoURL} = auth.currentUser;
  await addDoc(collection(db, 'messages'), {uid, displayName, photoURL, message, timestamp: Date.now(),});
};
</script>
<style> /* Add your own CSS here */
</style>
<div class="chat-room"><h1>Chat Room</h1>
  {#if !auth.currentUser}
    <button on:click={login}>Login with Google</button>
  {:else}
    <form on:submit={sendMessage}><input type="text" name="message" placeholder="Type your message here..."/>
      <button type="submit">Send</button>
    </form>
    {#each messages as message}
      <div class="message"><img src={message.photoURL} alt={message.displayName}/>
        <div><h3>{message.displayName}</h3>
          <p>{message.message}</p></div>
      </div>
    {/each}
  {/if}
</div>
