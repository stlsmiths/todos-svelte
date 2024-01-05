// import { error } from '@sveltejs/kit';
import { fakeData } from "../data.js";
// import { error } from '@sveltejs/kit'

// @ts-ignore
export function load({params}) {
  console.log('[id] page.server.js: id=', params.id,'params=', params)
  const item = fakeData.find( i => i.id === params.id )

/*
  if ( !item) {
    throw error(404)
  }
*/

  return {
    item,
    id: params.id
  }
}
