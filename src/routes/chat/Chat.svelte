<script>
  import { onMount } from 'svelte';
  import { db } from '$lib/firebase';
  let messages = [];
  let newMessage = ''
  onMount(() => {
    // Listen for changes to the "messages" node in Firebase Realtime Database
   db.ref('messages').on('value', (snapshot) => {
     // Update the messages array with the latest messages
   messages = Object.values(snapshot.val());
   });
  });

function sendMessage() {
  // Add the new message to the Firebase Realtime Database
  db.ref('messages').push({ message: newMessage, timestamp: Date.now(), });
  // Clear the input field
  newMessage = '';
}

</script>

<style>
    /* Chat room styles */
</style>

<div class="chat-room"> <!-- Display the messages here -->
{#each messages as message}
  <p>{message.message}</p>
{/each}
</div>

<!-- Input field for sending messages -->
<input type="text" placeholder="Type your message..." on:input={(event) => newMessage = event.target.value}  />
