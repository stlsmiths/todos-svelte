import { writable } from 'svelte/store'
import { db, auth } from '$lib/firebase'
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth'
import {push, ref, set} from "firebase/database";
import type {Todo} from "./Todo";

export const fbStore = writable({
  user: null,
  todos: []
})

 export async function updateFBTodo(todo: Todo, name: string, completed: boolean) : Promise<void> {
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
    const todoRef = ref(db, 'todos');
    const newTodoRef = push(todoRef);
    await set(newTodoRef, {
      name,
      completed: false,
      created_ts: Date.now(),
    });
  }

  export const authHandlers = {
    signup: async (email: string, pass: string) => {
        await createUserWithEmailAndPassword(auth, email, pass)
    },
    login: async (email: string, pass: string) => {
        await signInWithEmailAndPassword(auth, email, pass)
    },
    logout: async () => {
        await signOut(auth)
    }
}
