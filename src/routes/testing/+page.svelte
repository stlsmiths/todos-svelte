<script>
export let data
</script>

<h4>Testing Page ( Generic )</h4>
<p>
  This is the content for the /testing specific page
</p>
<p>
Params is:  {JSON.stringify(data)}
</p>

<ul>
{#each data.items as item}
  <li><a href={`/testing/${item.id}`}>Id = {item.id} : {item.title}</a></li>
{/each}
</ul>
