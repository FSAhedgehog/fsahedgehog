const {findAverageReturn} = require('../client/components/utilities')
const {
  HedgeFund,
  ThirteenF,
  Stock,
  StockStats,
  HedgeFundStats,
} = require('../server/db/models')
const {
  getCurrentYearAndQuarter,
  getCurrentYearAndQuarterForEveryone,
} = require('./seederUtility')

// findAverageReturn(hedgeFunds, years)
// const averageBeta = findAverageBeta(latest13Fs)

// just need to query 13Fs for the current quarter and iterate through and find the average amount, count, and beta

async function findThisQuarters13Fs() {
  const [curYear, curQuarter] = await getCurrentYearAndQuarterForEveryone()
  const thirteenFsThisQuarter = await ThirteenF.findAll({
    where: {
      year: curYear,
      quarter: curQuarter,
    },
    include: [Stock],
  })
  return [thirteenFsThisQuarter, curYear, curQuarter]
}

async function findAmountCountBetaAvg() {
  const currentThirteenFs = await findThisQuarters13Fs()[0]
  const avgAmount =
    currentThirteenFs.reduce((accum, thirteenF) => {
      return accum + thirteenF.portfolioValue
    }, 0) / currentThirteenFs.length
  const avgCount =
    currentThirteenFs.reduce((accum, thirteenF) => {
      return accum + thirteenF.numberOfStocks
    }, 0) / currentThirteenFs.length
  const avgBeta =
    currentThirteenFs.reduce((accum, thirteenF) => {
      return accum + thirteenF.thirteenFBeta
    }, 0) / currentThirteenFs.length
  return [avgAmount, avgCount, avgBeta]
}

// export function findAverageBeta(thirteenFs) {
//   if (thirteenFs.length) {
//     const result =
//       thirteenFs.reduce((accum, element) => {
//         return accum + element.thirteenFBeta
//       }, 0) / thirteenFs.length
//     return result
//   } else {
//     return 1.0
//   }
// }

async function findHedgeFunds() {
  const hedgeFunds = await HedgeFund.findAll()
  return hedgeFunds
}

// export function findAverageReturn(hedgeFunds, years) {
//   if (hedgeFunds.length) {
//     let goodFunds = hedgeFunds.length
//     const result =
//       hedgeFunds.reduce((totalReturns, hedgeFund) => {
//         if (hedgeFund[years]) {
//           if (typeof hedgeFund[years] === 'string') {
//             return totalReturns + Number(hedgeFund[years].slice(6))
//           }
//           return totalReturns + hedgeFund[years]
//         } else {
//           goodFunds--
//           return totalReturns
//         }
//       }, 0) / goodFunds
//     if (goodFunds === 0) return 'N/A'
//     return result
//   } else {
//     return 1.0
//   }
// }

async function avgHedgeFundReturns() {
  try {
    const hedgeFunds = await HedgeFund.findAll()
    const yearOneAverage = findAverageReturn(hedgeFunds, 'yearOneReturn')
    const yearThreeAverage = findAverageReturn(hedgeFunds, 'yearThreeReturn')
    const yearFiveAverage = findAverageReturn(hedgeFunds, 'yearFiveReturn')
    const maxAverage = findAverageReturn(hedgeFunds, 'maxReturn')
    return [yearOneAverage, yearThreeAverage, yearFiveAverage, maxAverage]
  } catch (error) {
    console.error(error)
  }
}

async function setHedgeFundStats() {
  try {
    const [
      yearOneAverage,
      yearThreeAverage,
      yearFiveAverage,
      maxAverage,
    ] = avgHedgeFundReturns()
    const [avgAmount, avgCount, avgBeta] = findAmountCountBetaAvg()
    const createdHedgeFundStats = await HedgeFundStats.create({
      avgOneYearReturn: yearOneAverage,
      avgThreeYearReturn: yearThreeAverage,
      avgFiveYearReturn: yearFiveAverage,
      avgMaxReturn: maxAverage,
      avgPortfolioAmount: avgAmount,
      avgNumberOfStocks: avgCount,
      avgBeta: avgBeta,
    })
  } catch (error) {
    console.error(error)
  }
}

setHedgeFundStats()
