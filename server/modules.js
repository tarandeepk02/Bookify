// let https
// try {
//   https = require('https')
//   console.info('\t|https module loaded successfully!')
// } catch (err) {
//   console.error('\t|https support is disabled!')
// }
// const isBuiltin = require('is-builtin-module')
// console.log(`\t|http is a builtin module? ${isBuiltin("http")}.`)
// modules = ['fs','http','https','express','passwort','crypto','dns','global','path']
// modules.forEach(m =>console.log(`\t|${m} is a builtin module? ${isBuiltin(m)}.`))
//console.info(global)
// console.info(globalThis)
// global.setTimeout( () => console.info(`\t|Paused for 1 second.`),1e3)
// globalThis.setTimeout( () => console.info(`\t|Paused for 2 seconds.`),2e3)
// setTimeout( () => console.info(`\t|Paused for 3 seconds.`),3e3)
// const clock = setInterval(() =>
// {
//     let d = new Date()
//     console.clear()
//     console.log(`\t|${d.getHours()}:${d.getMinutes()}:${d.getSeconds()}`)
// },1e3)
// const getJsonData = async (url) => {
//     const response = await global.fetch(url)
//     const data = await response.json()
//     return data
// }
//const url = 'https://jsonplaceholder.typicode.com/users'
// getJsonData(url)
//     .then((data)=>console.log(data))
//     .catch((err)=> console.error(err))

// IIEF
// (async () => {
//     const url = 'https://jsonplaceholder.typicode.com/users'
//         try{
//         const data = await getJsonData(url)
//         console.log(data[0])
//     }
//     catch(err){
//         console.error(err)
//     }
// })()

