<script lang="ts">
  import { onDestroy } from "svelte";
  import { page } from '$app/stores'
  import { fbStore, addFBTodo, updateFBTodo, deleteFBTodo } from '../../store/fbStore';
  import type { Todo } from '../../store/Todo'

  let items: Todo[] = []
  let newTodo = ''
  let editKey: string | undefined = ''
  let editName = ''
  let allDone = false
  let autofocusTimer = 0

  // Listener ... for "todos" changes from the Svelte Store (Firebase RTDB)
  fbStore.subscribe( (curr: any) => {
    // console.log('fbstore subscr curr', curr)
    // user = curr.user
    items = curr.todos //[...curr.todos]
  });

  $: completed = items.filter( i => i.completed === true )
  $: active = items.filter( i => i.completed === false )
  $: count = items.length
  $: itemsLeft = `${active.length} item${active.length===1 ? '' : 's'} left`
  $: urlHash = $page.url.hash.replace('#','') || ''
  $: vizAll = urlHash === 'all' || urlHash === ''
  $: vizActive = urlHash === 'active'
  $: vizCompleted = urlHash === 'completed'
  $: todoItems = (): Todo[] => {
    let rtn = items
    if ( vizActive ) {
      rtn = active
    }
    if ( vizCompleted ) {
      rtn = completed
    }
    return rtn
  }

  $: listClass = (todo:Todo): string => {
    let classes = ['todo ']
    if ( todo.completed === true ) {
      classes.push('completed ')
    }
    if ( todo?.key === editKey ) {
      classes.push('editing ')
    }
    return classes.join(' ')
  }

  async function addTodo() {
    await addFBTodo(newTodo)
    newTodo = ''
  }

  async function toggleTodo(todo) {
    await updateFBTodo( todo, todo.name, todo.completed )
  }


  // start editing an item ...
  function editTodo(todo:Todo) {
    editKey = todo.key
    editName = todo.name
  }

  async function doneEdit() {
    const item = items.find( i => i.key === editKey )
    if ( item ) {
      await updateFBTodo( item, editName, item.completed )
    }
    editKey = ''
    editName = ''
  }

  async function onEditKeyup(e:KeyboardEvent) {
    if ( e.key === 'Escape') {
      editKey = ''
      editName = ''
    }
    if ( e.key === 'Enter') {
      await doneEdit()
    }
  }

  async function removeTodo(todo: Todo) {
    await deleteFBTodo(todo)
    // items = items.filter( i => i.name !== todo.name )
  }

  async function removeCompleted() {
    const litems = [...completed]
    await Promise.all(
      [...completed].map( (i) => {
        deleteFBTodo(i)
      })
    )
    location.href = $page.url.pathname + '#all'
  }

  async function onChangeAll() {
//    items = items.map( item => ({...item, completed: allDone }))
    await Promise.all(
      [...items].map( (item) => {
        updateFBTodo(item,item.name,allDone)
      })
    )
  }

  function myAutoFocus(el: HTMLElement): void {
    if ( autofocusTimer ) {
      clearTimeout(autofocusTimer)
    }
    // @ts-ignore
    autofocusTimer = setTimeout( () => {
      el.focus()
    }, 100)
  }
</script>

<div class="todo-container">

<form>
<section class="todoapp">
  <header class="header">
    <h1>todos</h1>
    <input class="new-todo"
          autocomplete="off"
          use:myAutoFocus
          placeholder="What needs to be done?"
          bind:value={newTodo}
          on:keyup={ (e) => {
              if (e.key === 'Enter') { addTodo() }
            }
          }>
  </header>

  {#if count}
    <section class="main">

    <input id="toggle-all" class="toggle-all" type="checkbox"
      bind:checked={allDone}
      on:change={onChangeAll}
      >
    <label for="toggle-all">Mark all as complete</label>

    {#if items && items.length}
      <ul class="todo-list">
      {#each todoItems() as item}
        <li class={listClass(item)}>
          <div class="view">
            <input class="toggle"
                   type="checkbox"
                   bind:checked={item.completed}
                   on:change={toggleTodo(item)}
            >
            <label on:dblclick={editTodo(item)}>{item.name}</label>
            <button class="destroy" on:click={removeTodo(item)}></button>
          </div>
          {#if item.key === editKey }
            <input class="edit" type="text"
                use:myAutoFocus
                on:blur={doneEdit}
                on:keyup={onEditKeyup}
                bind:value={editName}>
          {/if}
          </li>
        {/each}
      </ul>
    {/if}
  </section>
  {/if}

  {#if items.length}
    <footer class="footer">
    <span class="todo-count">
      <strong>{itemsLeft}</strong>
    </span>
    <ul class="filters">
      <li>
        <a href="#all" title={`${count} items`}
            class={ vizAll ? 'selected' : ''}>All</a>
      </li>
      <li>
        <a href="#active" title={`${active.length} items`}
          class={vizActive ? 'selected' : ''}>Active</a>
      </li>
      <li><a href="#completed"
             title={`${completed.length} items`}
             class={vizCompleted ? 'selected' : ''}
             >Completed</a>
         </li>
    </ul>
    {#if completed}
      <button class="clear-completed" on:click={removeCompleted}>Clear completed</button>
    {/if}
  </footer>
  {/if}

</section>
</form>

<footer class="info">
  <p>Double-click to edit a todo</p>
  <p>Written by <a href="http://blunderalong.com">BlunderAlong</a></p>
  <p>Part of <a href="http://todomvc.com">TodoMVC</a></p>
</footer>

</div>

<style>
  @import "./todomvc-app-css.css";
  @import "./todomvc-common-base.css";

</style>

