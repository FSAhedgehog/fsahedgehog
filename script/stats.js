// const axios = require('axios')
// const db = require('../server/db')
// const Sequelize = require('sequelize')
// const Op = Sequelize.Op

const {
  HedgeFund,
  ThirteenF,
  Stock,
  StockStats,
  HedgeFundStats,
} = require('../server/db/models')

const {getCurrentYearAndQuarterForEveryone} = require('./seederUtility')

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

async function sumStockStats() {
  const [thirteenFs, year, quarter] = await findThisQuarters13Fs()
  let countObj = {}
  for (let i = 0; i < thirteenFs.length; i++) {
    let stocks = thirteenFs[i].stocks
    for (let j = 0; j < stocks.length; j++) {
      let ticker = stocks[j].ticker
      let stock = stocks[j]
      if (Object.keys(countObj).includes(ticker)) {
        countObj[ticker].count++
        countObj[ticker].totalValue += Number(stock.totalValue)
        countObj[ticker].percentage += parseFloat(stock.percentageOfPortfolio)
      } else {
        countObj[ticker] = {
          cusip: stock.cusip,
          count: 1,
          beta: stock.beta,
          totalValue: Number(stock.totalValue),
          percentage: parseFloat(stock.percentageOfPortfolio),
          company: stock.name,
          year: year,
          quarter: quarter,
          // need to addd current quarter and yearOneReturn
          // this will allow force false to be okay when adding new companies
        }
      }
    }
  }
  return countObj
}

async function setStockStats() {
  try {
    const countObj = await sumStockStats()
    for (let key in countObj) {
      let stockKey = countObj[key]
      let stringValue = String(stockKey.totalValue)
      let createdStockStat = await StockStats.create({
        ticker: key,
        cusip: stockKey.cusip,
        count: stockKey.count,
        beta: stockKey.beta,
        totalInvested: stringValue,
        totalPercentage: stockKey.percentage,
        company: stockKey.company,
        quarter: stockKey.quarter,
        year: stockKey.year,
      })
    }
  } catch (error) {
    console.error(error)
  }
}

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

setStockStats()
