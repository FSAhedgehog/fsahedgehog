// const yahooFinance = require('yahoo-finance')

// async function getBeta(ticker) {
//   const newTicker = '^GSPC'
//   try {
//     const response = await yahooFinance.quote(
//       {
//         symbol: ticker,
//         modules: ['summaryDetail'],
//       },
//       {symbol: newTicker, modules: ['summaryDetail']}
//     )
//     return response.summaryDetail.beta
//   } catch (err) {
//     console.error(err)
//   }
// }

// async function test() {
//   for (let i = 0; i < 1000; i++) {
//     const beta = await getBeta('VRSK')
//     console.log(beta)
//   }
// }

// test()

const {setTicker, setPrices} = require('./seeder')

const db = require('../server/db')

const year = 2016
const quarter = 1

async function seed2() {
  await db.sync()
  await setTicker()
  await setPrices()
}

seed2()
