import { writable } from 'svelte/store'
import { db, auth, app } from '$lib/firebase'
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth'
import {push, ref, set, getDatabase} from "firebase/database";
import type {Todo} from "./Todo";

export const fbStore = writable({
  user: null,
  todos: [] as Todo[]
})

 export async function updateFBTodo(todo: Todo, name: string, completed: boolean) : Promise<void> {
   console.log('updatetodo')
    await set(ref(db, `todos/${todo.key}`), {
      ...todo,
      name,
      completed
    });
  }

  export async function deleteFBTodo( todo: Todo ) : Promise<void> {
    await set(ref(db, `todos/${todo.key}`), null );
  }

  export async function addFBTodo( name: string ): Promise<void> {
    // const todoRef = ref(db, 'todos');
    console.log('addFBTodo: name', name)
    const newTodoRef = await push( ref(getDatabase(app), 'todos') );
    console.log('newtodoref', newTodoRef)
    await set(newTodoRef, {
      name,
      completed: false,
      created_ts: Date.now(),
    });
  }
