const axios = require('axios')
const db = require('../server/db')
const {HedgeFund, ThirteenF, Stock} = require('../server/db/models')
const {
  getTicker,
  getPrice,
  findQuarter,
  calcMimicReturn,
  getBeta,
  fundRisk,
} = require('./seederUtility')

const {EDGAR_KEY} = require('../secrets')

// CHANGE HEDGEFUNDS HERE
const HEDGEFUNDS = [
  'DAILY JOURNAL CORP',
  'BERKSHIRE HATHAWAY INC',
  'BILL & MELINDA GATES FOUNDATION TRUST',
  'GREENLIGHT CAPITAL INC',
  'PERSHING SQUARE CAPITAL MANAGEMENT, L.P.',
]

// CHANGE SIZE HERE
const SIZE = '20'

function buildQuery(hedgeFunds, size) {
  hedgeFunds = hedgeFunds
    .map((hedgeFund) => `companyName:\"${hedgeFund}\"`)
    .join(' OR ')

  return {
    query: {
      query_string: {
        query: `formType:\"13F-HR\" AND formType:(NOT \"13F-HR/A\") AND (${hedgeFunds})`,
      },
    },
    from: '0',
    size: size,
    sort: [
      {
        filedAt: {
          order: 'desc',
        },
      },
    ],
  }
}

async function getInitialData(apiKey, query) {
  try {
    // Comment this out for testing purposes
    // const {data} = await axios.post(
    //   `https://api.sec-api.io?token=${apiKey}`,
    //   query
    // )
    // Uncomment this for testing purpose
    // console.log(data)
    const data = require('./exampleFiveReturn')
    return data
  } catch (err) {
    console.log('error in getInitialData func—————', err)
  }
}

async function createHedgeFunds(filings) {
  try {
    for (let i = 0; i < filings.length; i++) {
      const filing = filings[i]
      const response = await HedgeFund.findOrCreate({
        where: {
          name: filing.companyName,
        },
      })
      const createdHedgeFund = response[0]

      await create13F(createdHedgeFund, filing)
    }
  } catch (err) {
    console.error('error in createHedgeFund func—————', err)
  }
}

async function create13F(createdHedgeFund, filing) {
  try {
    const created13F = await ThirteenF.create({
      dateOfFiling: filing.filedAt,
      year: filing.periodOfReport.slice(0, 4),
      quarter: findQuarter(filing.periodOfReport.slice(5, 7)),
    })
    await createStocks(createdHedgeFund, created13F, filing.holdings)
  } catch (err) {
    console.error(err)
  }
}

function filterStocks(holdings) {
  const sumStocks = {}
  const filteredStocks = holdings.filter((holding) => !holding.putCall)
  filteredStocks.forEach((holding) => {
    if (!sumStocks[holding.cusip]) {
      sumStocks[holding.cusip] = {
        totalValue: holding.value,
        qtyOfSharesHeld: holding.shrsOrPrnAmt.sshPrnamt,
      }
    } else {
      sumStocks[holding.cusip].totalValue += holding.value
      sumStocks[holding.cusip].qtyOfSharesHeld += holding.shrsOrPrnAmt.sshPrnamt
    }
  })

  return sumStocks
}

async function createStocks(createdHedgeFund, created13F, holdings) {
  try {
    const sumStocks = filterStocks(holdings)
    const createdStocks = []

    for (let key in sumStocks) {
      if (sumStocks.hasOwnProperty(key)) {
        const createdStockHolding = await Stock.create({
          cusip: key,
          totalValue: sumStocks[key].totalValue,
          qtyOfSharesHeld: sumStocks[key].qtyOfSharesHeld,
        })

        createdStocks.push(createdStockHolding)
      }
    }
    await created13F.addStocks(createdStocks)
    created13F.portfolioValue = await getFundValue(created13F.id)
    created13F.save()
    setStockPercentageOfFund(created13F)
    await createdHedgeFund.addThirteenF(created13F)
    await createdHedgeFund.addStocks(createdStocks)
  } catch (err) {
    console.error(err)
  }
}

async function buildHedgeFunds(apiKey, hedgeFundNames, size) {
  try {
    await db.sync({force: true})
    const query = buildQuery(hedgeFundNames, size)
    const data = await getInitialData(apiKey, query)
    await createHedgeFunds(data.filings)
  } catch (err) {
    console.error(err)
  }
}

async function setPortfolioValueAndPercentageOfFund() {
  const thirteenFs = await ThirteenF.findAll()
  thirteenFs.forEach(async (thirteenF) => {
    thirteenF.portfolioValue = await getFundValue(thirteenF.id)
    await thirteenF.save()
    setStockPercentageOfFund(thirteenF)
  })
}
async function setFundRisk() {
  const thirteenFs = await ThirteenF.findAll()
  thirteenFs.forEach(async (thirteenF) => {
    thirteenF.thirteenFBeta = await fundRisk(thirteenF.id)
    await thirteenF.save()
  })
}

async function endThrottle(timer) {
  try {
    console.log('exiting setInterval')
    clearInterval(timer)
    await setPortfolioValueAndPercentageOfFund()
    await setFundRisk()
    // await setMimicReturn()
    // await db.close()
  } catch (err) {
    console.error(err)
  }
}

async function addTickerAndPrice(stock, ticker, lastOne, timer) {
  try {
    if (ticker) {
      stock.ticker = ticker
      const price = await getPrice(ticker, stock.thirteenF.dateOfFiling)
      stock.price = price[0] ? price[0].close : null

      const beta = await getBeta(ticker)
      //console.log("THIS IS BETA", beta)
      stock.beta = beta.summaryDetail.beta

      if (!price[0]) await stock.destroy()

      await stock.save()
    } else {
      await stock.destroy()
    }
    if (lastOne) {
      await endThrottle(timer)
    }
  } catch (err) {
    console.error(err)
  }
}

async function seedData(apiKey, hedgeFundNames, size) {
  await buildHedgeFunds(apiKey, hedgeFundNames, size)

  const timer = setInterval(throttleApiCall, 300)

  const allStocks = await Stock.findAll({include: [ThirteenF]})
  let index = 0
  let lastOne = false

  async function throttleApiCall() {
    try {
      if (index === allStocks.length - 1) lastOne = true
      if (index < allStocks.length) {
        const stock = allStocks[index]

        console.log('STOCK ID——————————', stock.id)
        index++
        let ticker = await getTicker(stock.cusip)
        if (ticker) ticker = ticker.replace('/', '-')
        console.log(stock.thirteenF.dateOfFiling, 'IN THROTTLE')
        addTickerAndPrice(stock, ticker, lastOne, timer)
      }
    } catch (err) {
      console.error(err)
    }
  }
}

async function getFundValue(thirteenFId) {
  const data = await Stock.findAll({
    where: {thirteenFId: thirteenFId},
  })
  return data.reduce(function (total, elem) {
    return total + Number(elem.totalValue)
  }, 0)
}

// async function getStockPercentageOfFund(ticker, thirteenFId) {
//   let totalFundValue = getFundValue(thirteenFId)

//   const stock = await Stock.findOne({
//     where: {
//       ticker: ticker,
//       thirteenFId: thirteenFId,
//     },
//   })

//   return stock[0].totalValue / totalFundValue
// }

async function setStockPercentageOfFund(created13F) {
  const stocksForTheThirteenF = await Stock.findAll({
    where: {
      thirteenFId: created13F.id,
    },
  })
  stocksForTheThirteenF.forEach(async (holding) => {
    holding.percentageOfPortfolio =
      holding.totalValue / created13F.portfolioValue
    await holding.save()
  })
}

// needs to run after
async function setMimicReturn() {
  const hedgeFunds = await HedgeFund.findAll({
    include: [
      {
        model: ThirteenF,
        include: [Stock],
      },
    ],
  })

  await hedgeFunds.forEach((hedgeFund) => {
    const hedgeyReturnObj = calcMimicReturn(hedgeFund.id)
    hedgeFund.thirteenFs.forEach(async (thirteenF) => {
      thirteenF.quarterlyValue =
        hedgeyReturnObj[`${thirteenF.year}Q${thirteenF.quarter}`]
      await thirteenF.save()
    })
  })
}

function calcHedgeFundReturn(years) {
  // find the starting year and Q some how and fine the last
  // grab the quarterlyValue and divide
  // put it in the hedgeFund
  // make sure to do it for all of the hedgefunds
}

seedData(EDGAR_KEY, HEDGEFUNDS, SIZE)

module.exports = setMimicReturn
