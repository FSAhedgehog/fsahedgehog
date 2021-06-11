const axios = require('axios')
const db = require('../server/db')
const {HedgeFund, ThirteenF, Stock, StockStats} = require('../server/db/models')
const Sequelize = require('sequelize')
const Op = Sequelize.Op
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
  return thirteenFsThisQuarter
}

async function countStocks() {
  const thirteenFs = await findThisQuarters13Fs()
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
        }
      }
    }
  }
  return countObj
}

async function setStockCount() {
  try {
    const countObj = await countStocks()
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
      })
    }
  } catch (error) {
    console.error(error)
  }
}

setStockCount()
