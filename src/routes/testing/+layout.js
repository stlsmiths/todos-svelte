import { fakeData } from './data.js'
// @ts-ignore
export function load({params}) {
  console.log('outer layout.js: params=', params)
  return {
    items: fakeData.map( i => {
      return {
        id: i.id,
        title: i.title
      }
    })
  }
}
