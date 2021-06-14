const {
  HedgeFund,
  ThirteenF,
  Stock,
  HedgeFundStats,
} = require('../server/db/models')
const {
  getCurrentYearAndQuarter,
  getCurrentYearAndQuarterForEveryone,
} = require('./seederUtility')

function findAverageReturn(hedgeFunds, years) {
  if (hedgeFunds.length) {
    let goodFunds = hedgeFunds.length
    const result =
      hedgeFunds.reduce((totalReturns, hedgeFund) => {
        if (hedgeFund[years]) {
          if (typeof hedgeFund[years] === 'string') {
            return totalReturns + Number(hedgeFund[years].slice(6))
          }
          return totalReturns + Number(hedgeFund[years])
        } else {
          goodFunds--
          return totalReturns
        }
      }, 0) / goodFunds
    if (goodFunds === 0) return 0
    return result
  } else {
    return 1.0
  }
}

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
  const result = await findThisQuarters13Fs()
  const currentThirteenFs = result[0]
  const avgAmount = Math.round(
    currentThirteenFs.reduce((accum, thirteenF) => {
      return accum + Number(thirteenF.portfolioValue)
    }, 0) / currentThirteenFs.length
  )
  const avgCount = Math.round(
    currentThirteenFs.reduce((accum, thirteenF) => {
      return accum + Number(thirteenF.numberOfStocks)
    }, 0) / currentThirteenFs.length
  )
  const avgBeta =
    currentThirteenFs.reduce((accum, thirteenF) => {
      return accum + parseFloat(thirteenF.thirteenFBeta)
    }, 0) / currentThirteenFs.length
  return [avgAmount, avgCount, avgBeta]
}

async function avgHedgeFundReturns() {
  try {
    const hedgeFunds = await HedgeFund.findAll()
    const yearOneAverage = findAverageReturn(hedgeFunds, 'yearOneReturn')
    const yearThreeAverage = findAverageReturn(hedgeFunds, 'yearThreeReturn')
    const yearFiveAverage = findAverageReturn(hedgeFunds, 'yearFiveReturn')
    const maxAverage = findAverageReturn(hedgeFunds, 'maxReturn')
    console.log([yearOneAverage, yearThreeAverage, yearFiveAverage, maxAverage])
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
    ] = await avgHedgeFundReturns()
    console.log(
      [yearOneAverage, yearThreeAverage, yearFiveAverage, maxAverage],
      'SET HEDGEFUNDSSTATS'
    )
    const [avgAmount, avgCount, avgBeta] = await findAmountCountBetaAvg()
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
