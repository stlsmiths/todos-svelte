// @ts-nocheck
import { getApp, getApps, initializeApp, deleteApp} from 'firebase/app';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import {getDatabase, onValue, ref} from 'firebase/database'
import { fbStore } from "../store/fbStore.ts";

const firebaseConfig = {
    // ...your firebase credentials
  apiKey: import.meta.env.VITE_FB_API_KEY,
  authDomain: import.meta.env.VITE_FB_AUTH_DOMAIN,
  databaseURL: import.meta.env.VITE_FB_DATABASE_URL,
  projectId: import.meta.env.VITE_FB_PROJECT_ID,
  appId: import.meta.env.VITE_FB_APP_ID
};

let firebaseApp = initializeApp(firebaseConfig)
if ( getApps().length ) {
  firebaseApp = getApp()
  deleteApp(firebaseApp)
}

firebaseApp = initializeApp(firebaseConfig)

export const app = firebaseApp
export const db = getDatabase(firebaseApp)
export const auth = getAuth(firebaseApp)

export let authSetup = false
export let dbSetup = false

export async function setupAuthListener() {
  if ( authSetup ) return
  onAuthStateChanged( getAuth(firebaseApp), async (user) => {
    if ( user && user.uid ) {
      fbStore.update( (curr) => {
        return {
          ...curr,
          user,
        }
      })
      // await setupDbListener()
    }
  })
  authSetup = true
  return authSetup
}
export async function setupDbListener() {
  if ( dbSetup ) return
  /**
     * @type {any[]}
     */
  let pitems = []
  const todoRef = ref(db,'todos/')
  onValue( todoRef, (snap) => {
    pitems = []
    snap.forEach( item => {
      const pitem = { ...item.val(), key: item.key }
      console.log('item ', item.key, pitems.length, pitem)
      pitems.push( pitem )
    })
    fbStore.update( (curr) => {
      return {
        ...curr,
        todos: pitems
      }
    })
  })

  dbSetup = true
}

