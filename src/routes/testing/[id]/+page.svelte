<script>
import { goto } from '$app/navigation'
  export let data
</script>

<h4>Test Data</h4>
<a href="/testing">[back]</a>
<br>
<p>
Param is {data.id}
Title is {data.title}
</p>

<p>
Params is:  {JSON.stringify(data)}
</p>
