const axios = require('axios')
const db = require('../server/db')
const {HedgeFund, ThirteenF, Stock, StockStats} = require('../server/db/models')
const Sequelize = require('sequelize')
const Op = Sequelize.Op
const {
  getTickers,
  getPrice,
  findQuarterOfReport,
  findYearOfReport,
  calcMimicReturn,
  getBeta,
  fundRisk,
  breakIntoChunks,
  getOldestYearAndQuarter,
  getCurrentYearAndQuarter,
  getCurrentYearAndQuarterForEveryone,
} = require('./seederUtility')
require('dotenv').config()
// const {
//   HedgeFund,
//   ThirteenF,
//   Stock,
//   HedgeFundStats,
// } = require('../server/db/models')
// const {
//   getCurrentYearAndQuarter,
//   getCurrentYearAndQuarterForEveryone,
// } = require('./seederUtility')

// function findAverageReturn(hedgeFunds, years) {
//   if (hedgeFunds.length) {
//     let goodFunds = hedgeFunds.length
//     const result =
//       hedgeFunds.reduce((totalReturns, hedgeFund) => {
//         if (hedgeFund[years]) {
//           if (typeof hedgeFund[years] === 'string') {
//             return totalReturns + Number(hedgeFund[years].slice(6))
//           }
//           return totalReturns + Number(hedgeFund[years])
//         } else {
//           goodFunds--
//           return totalReturns
//         }
//       }, 0) / goodFunds
//     if (goodFunds === 0) return 0
//     return result
//   } else {
//     return 1.0
//   }
// }
const HEDGEFUNDS = [
  // 'TRIAN FUND MANAGEMENT, L.P.',
  // 'ValueAct Holdings, L.P.',
  // 'DAILY JOURNAL CORP',
  // 'BERKSHIRE HATHAWAY INC',
  // 'BILL & MELINDA GATES FOUNDATION TRUST',
  // 'Scion Asset Management, LLC',
  // 'GREENLIGHT CAPITAL INC',
  // 'Pershing Square Capital Management, L.P.',
  // 'ATLANTIC INVESTMENT MANAGEMENT, INC.',
  // 'International Value Advisers, LLC',
  // 'FAIRHOLME CAPITAL MANAGEMENT LLC',
  // 'ARIEL INVESTMENTS, LLC',
  // 'Appaloosa LP',
  'TIGER GLOBAL MANAGEMENT LLC',
  // 'SEMPER AUGUSTUS INVESTMENTS GROUP LLC',
  // 'WEDGEWOOD PARTNERS INC',
]

// async function findThisQuarters13Fs() {
//   const [curYear, curQuarter] = await getCurrentYearAndQuarterForEveryone()
//   const thirteenFsThisQuarter = await ThirteenF.findAll({
//     where: {
//       year: curYear,
//       quarter: curQuarter,
//     },
//     include: [Stock],
//   })
//   return [thirteenFsThisQuarter, curYear, curQuarter]
// }

// async function findAmountCountBetaAvg() {
//   const result = await findThisQuarters13Fs()
//   const currentThirteenFs = result[0]
//   const avgAmount = Math.round(
//     currentThirteenFs.reduce((accum, thirteenF) => {
//       return accum + Number(thirteenF.portfolioValue)
//     }, 0) / currentThirteenFs.length
//   )
//   const avgCount = Math.round(
//     currentThirteenFs.reduce((accum, thirteenF) => {
//       return accum + Number(thirteenF.numberOfStocks)
//     }, 0) / currentThirteenFs.length
//   )
//   const avgBeta =
//     currentThirteenFs.reduce((accum, thirteenF) => {
//       return accum + parseFloat(thirteenF.thirteenFBeta)
//     }, 0) / currentThirteenFs.length
//   return [avgAmount, avgCount, avgBeta]
// }

// async function avgHedgeFundReturns() {
//   try {
//     const hedgeFunds = await HedgeFund.findAll()
//     const yearOneAverage = findAverageReturn(hedgeFunds, 'yearOneReturn')
//     const yearThreeAverage = findAverageReturn(hedgeFunds, 'yearThreeReturn')
//     const yearFiveAverage = findAverageReturn(hedgeFunds, 'yearFiveReturn')
//     const maxAverage = findAverageReturn(hedgeFunds, 'maxReturn')
//     console.log([yearOneAverage, yearThreeAverage, yearFiveAverage, maxAverage])
//     return [yearOneAverage, yearThreeAverage, yearFiveAverage, maxAverage]
//   } catch (error) {
//     console.error(error)
//   }
// }

// async function setHedgeFundStats() {
//   try {
//     const [
//       yearOneAverage,
//       yearThreeAverage,
//       yearFiveAverage,
//       maxAverage,
//     ] = await avgHedgeFundReturns()
//     console.log(
//       [yearOneAverage, yearThreeAverage, yearFiveAverage, maxAverage],
//       'SET HEDGEFUNDSSTATS'
//     )
//     const [avgAmount, avgCount, avgBeta] = await findAmountCountBetaAvg()
//     const createdHedgeFundStats = await HedgeFundStats.create({
//       avgOneYearReturn: yearOneAverage,
//       avgThreeYearReturn: yearThreeAverage,
//       avgFiveYearReturn: yearFiveAverage,
//       avgMaxReturn: maxAverage,
//       avgPortfolioAmount: avgAmount,
//       avgNumberOfStocks: avgCount,
//       avgBeta: avgBeta,
//     })
//   } catch (error) {
//     console.error(error)
//   }
// }

// setHedgeFundStats()
const yahooFinance = require('yahoo-finance')
let tickers = [
  // // 'AGM-C',
  // // 'AGM-D',
  // // 'AGM-E',
  // // 'AGM-F',
  // // 'AGM-G',
  // // 'AGM.A',
  // 'AGO',
  // // 'AGO-B',
  // // 'AGO-E',
  // // 'AHH-A',
  // // 'AHL-C',
  // // 'AHL-D',
  // // 'AHL-E',
  // // 'AHT',
  // // 'AHT-D',
  // // 'AHT-F',
  // // 'AHT-G',
  // // 'AHT-H',
  // // 'AHT-I',
  // 'AIG-A',
  // // 'AGO-F',
  // 'ADF.U',
  // 'ADF.W',
  // 'AEL-A',
  // 'AEL-B',
  // // 'ADE.U',
  // // 'ADE.W',
  // // 'AEV.W',
  // // 'AGA.U',
  // // 'AGA.W',
  // 'AAC.U',
  // 'AAC.W',
  // 'AAI-B',
  // 'AAI-C',
  // // 'AAQ.U',
  // // 'AAQ.W',
  // 'AAQC',
  // 'AAT',
  // 'AB',
  // 'ABB',
  // 'ABBV',
  // 'ABC',
  // 'ABEV',
  // 'ABG',
  // 'ABM',
  // 'ABR',
  // // 'ABR-A',
  // // 'ABR-B',
  // // 'ABR-C',
  // // 'ABR-D',
  // // 'ACI.S',
  // // 'ACI.T',
  // // 'ACI.U',
  // // 'ACI.W',
  // // 'ACP-A',
  // // 'ACP.P',
  // // 'ACN.U',
  // // 'ACN.W',
  // // 'ACR-C',
  // // 'ACR-D',
  'GOOG',
  'AMD',
  'SNOW',
  'A',
  'AA',
  'AAC',
  'AAIC',
  'AAN',
  'AAP',
  'ABT',
  'AC',
  'ACA',
  'ACC',
  'ACCO',
  'ACEL',
  'ACH',
  'ACI',
  'ACIC',
  'ACII',
  'ACM',
  'ACN',
  'ACND',
  'ACP',
  'ACR',
  'ACRE',
  'ACV',
  'ADC',
  'ADCT',
  'ADEX',
  // 'ADF',
  // 'ADM',
  'ADNT',
  'ADS',
  'ADT',
  'ADX',
  'AEB',
  'AEE',
  'AEFC',
  'AEG',
  'AEL',
  'AEM',
  'AENZ',
  'AEO',
  'AER',
  'AES',
  'AESC',
  'AEVA',
  'AFB',
  'AFG',
  'AFGB',
  'AFGC',
  'AFGD',
  // 'AFGE',
  // 'AFI',
  // 'AFL',
  // 'AFT',
  // 'AG',
  // 'AGAC',
  // 'AGCB',
  // 'AGCO',
  // 'AGD',
  // 'AGI',
  // 'AGL',
  // 'AGM',
  // 'AGR',
  // 'AGRO',
  // 'AGS',
  // 'AGTI',
  // 'AGX',
  // 'AHC',
  // 'AHH',
  // 'AI',
  // 'AIC',
  // 'AIF',
  // 'AIG',
  // 'AIN',
  // 'AIO',
]
async function getBetaNew(tickers) {
  try {
    console.log(tickers.length)
    tickers = tickers
      .filter((tick) => !tick.includes('-'))
      .filter((tick) => !tick.includes('.'))
      .filter((tick) => !tick.includes('/'))
    const response = await yahooFinance.quote({
      symbols: tickers,
      modules: ['summaryDetail'],
    })

    for (let key in response) {
      if (response.hasOwnProperty(key)) {
        response[key].summaryDetail.beta
          ? (response[key] = response[key].summaryDetail.beta)
          : (response[key] = null)
      }
    }
    console.log(response)
    return response
  } catch (err) {
    console.error(err)
  }
}

async function setBeta() {
  try {
    const hedgeFunds = await HedgeFund.findAll({
      where: {
        name: {
          [Op.in]: HEDGEFUNDS,
        },
      },
      include: {
        model: ThirteenF,
        include: [Stock],
      },
      order: [[ThirteenF, 'dateOfFiling', 'DESC']],
    })
    for (let i = 0; i < hedgeFunds.length; i++) {
      const latest13F = hedgeFunds[i].thirteenFs[0]

      const stockTickers = latest13F.stocks.map((stock) => stock.ticker)

      const betasObj = await getBeta(stockTickers)
      console.log(betasObj, 'BETAS OBJ')
      for (let j = 0; j < latest13F.stocks.length; j++) {
        const stock = latest13F.stocks[j]
        if (betasObj[stock.ticker]) {
          stock.beta = betasObj[stock.ticker]
          await stock.save()
        }
      }
    }
  } catch (error) {
    console.error(error)
  }
}

function getBeta2(tickers) {
  //MAX 44 at a time!!!! maybe I should break into chunks of 40
  console.log(tickers.length)
  tickers = tickers
    .filter((tick) => !tick.includes('-'))
    .filter((tick) => !tick.includes('.'))
    .filter((tick) => !tick.includes('/'))
  console.log(tickers.length)
  let batchSize = 9999
  let times = Math.ceil(tickers.length / batchSize)
  let location = 0
  let final = {}
  let realFinal
  let index = 0
  let timer = setInterval(throttledBetaCall, 15000)
  async function throttledBetaCall() {
    console.log('got here', index, times)
    try {
      if (index < times) {
        let tickersToSend = tickers.slice(location, location + batchSize)
        index++
        let response = await getBatchedBetas(tickersToSend)
        location += batchSize
        final = Object.assign(final, response)
      }
      if (index === times) {
        endThrottle(timer)
        for (let key in final) {
          if (final.hasOwnProperty(key)) {
            final[key].summaryDetail.beta
              ? (final[key] = final[key].summaryDetail.beta)
              : (final[key] = null)
          }
        }

        realFinal = final
        console.log(realFinal)
        return realFinal
      }
    } catch (err) {
      console.error(err)
    }
  }
  console.log(realFinal, 'REAL FINAL')
  return realFinal
}

async function getBatchedBetas(tickersToSend) {
  let response = await yahooFinance.quote({
    symbols: tickersToSend,
    modules: ['summaryDetail'],
  })
  console.log(response)
  return response
}

function endThrottle(timer) {
  try {
    clearInterval(timer)
  } catch (err) {
    console.error(err)
  }
}

getBeta2(tickers)
async function f() {
  await setBeta()
}

// f()

// need to figure out what the main differences between mine and logans code
// need to figure out the best way to fix it;
