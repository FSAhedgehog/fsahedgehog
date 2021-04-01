const axios = require('axios')
const db = require('../server/db')
const {HedgeFund, ThirteenF, Stock} = require('../server/db/models')
const Sequelize = require('sequelize')
const Op = Sequelize.Op
const {
  getTickers,
  getPrice,
  findQuarter,
  calcMimicReturn,
  getBeta,
  fundRisk,
  getOldestYearAndQuarter,
  breakIntoChunks,
} = require('./seederUtility')
require('dotenv').config()

// const {EDGAR_KEY} = require('../secrets')
const EDGAR_KEY = process.env.EDGAR_KEY

// CHANGE HEDGEFUNDS HERE
// --------------------------------------------------------
// NEED TO BE THE EXACT CASES AS SEEN IN THE EDGAR RESPONSE
// --------------------------------------------------------
const HEDGEFUNDS = [
  'DAILY JOURNAL CORP',
  'BERKSHIRE HATHAWAY INC',
  'BILL & MELINDA GATES FOUNDATION TRUST',
  'GREENLIGHT CAPITAL INC',
  // 'Pershing Square Capital Management, L.P.',
  // 'ATLANTIC INVESTMENT MANAGEMENT, INC.',
  // 'International Value Advisers, LLC',
  // 'FAIRHOLME CAPITAL MANAGEMENT LLC',
  // 'ARIEL INVESTMENTS, LLC',
  // 'Appaloosa LP',
  // 'TIGER GLOBAL MANAGEMENT LLC',
  // 'SEMPER AUGUSTUS INVESTMENTS GROUP LLC',
  // 'WEDGEWOOD PARTNERS INC',
]

// CHANGE SIZE HERE
const SIZE = String(HEDGEFUNDS.length * 20)

// CHANGE STARTING VALUE HEREE
const STARTING_VALUE = 10000

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
    //     Comment this out for testing purposes
    const {data} = await axios.post(
      `https://api.sec-api.io?token=${apiKey}`,
      query
    )
    //     Uncomment this for testing purpose
    //     const data = require('./ex3comps5years')
    return data
  } catch (err) {
    console.error('error in getInitialData func—————', err)
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
      console.log(filing.companyName)
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

  for (let i = 0; i < filteredStocks.length; i++) {
    const holding = filteredStocks[i]
    if (!sumStocks[holding.cusip]) {
      sumStocks[holding.cusip] = {
        name: holding.nameOfIssuer,
        totalValue: holding.value,
        qtyOfSharesHeld: holding.shrsOrPrnAmt.sshPrnamt,
      }
    } else {
      sumStocks[holding.cusip].totalValue += holding.value
      sumStocks[holding.cusip].qtyOfSharesHeld += holding.shrsOrPrnAmt.sshPrnamt
    }
  }

  return sumStocks
}

async function createStocks(createdHedgeFund, created13F, holdings) {
  try {
    const sumStocks = filterStocks(holdings)
    const createdStocks = []

    for (let key in sumStocks) {
      if (sumStocks.hasOwnProperty(key)) {
        const createdStockHolding = await Stock.create({
          name: sumStocks[key].name,
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
    await db.sync({force: false})
    const query = buildQuery(hedgeFundNames, size)
    const data = await getInitialData(apiKey, query)
    await createHedgeFunds(data.filings)
  } catch (err) {
    console.error(err)
  }
}

async function setPortfolioValueAndPercentageOfFund() {
  console.log('IN SET PORTFOLIOVALUE———————')
  const thirteenFs = await ThirteenF.findAll()
  for (let i = 0; i < thirteenFs.length; i++) {
    const thirteenF = thirteenFs[i]
    thirteenF.portfolioValue = await getFundValue(thirteenF.id)
    await thirteenF.save()
    await setStockPercentageOfFund(thirteenF)
  }
}

async function setFundRisk() {
  console.log('IN SETFUNDRISK———————')
  const thirteenFs = await ThirteenF.findAll()
  for (let i = 0; i < thirteenFs.length; i++) {
    const thirteenF = thirteenFs[i]
    thirteenF.thirteenFBeta = await fundRisk(thirteenF.id)
    await thirteenF.save()
  }
}

function endThrottle(timer) {
  try {
    console.log('exiting setInterval')
    clearInterval(timer)
    // await db.close()
  } catch (err) {
    console.error(err)
  }
}

async function setBeta() {
  console.log('IN BETA————')
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

    for (let j = 0; j < latest13F.stocks.length; j++) {
      const stock = latest13F.stocks[j]

      if (betasObj[stock.ticker]) {
        stock.beta = betasObj[stock.ticker]
        await stock.save()
      } else {
        // await stock.destroy()
      }
    }
  }
}

async function setPrices() {
  console.log('IN SET PRICES')
  const thirteenFs = await ThirteenF.findAll({include: [Stock]})

  for (let i = 0; i < thirteenFs.length; i++) {
    const thirteenF = thirteenFs[i]
    const date = thirteenF.dateOfFiling

    const stockTickers = thirteenF.stocks.map((stock) => stock.ticker)

    const pricesObj = await getPrice(stockTickers, date)
    // console.log('PRICES OBJ UP—————', pricesObj)

    for (let j = 0; j < thirteenF.stocks.length; j++) {
      const stock = thirteenF.stocks[j]

      if (pricesObj[stock.ticker]) {
        stock.price = pricesObj[stock.ticker]
        await stock.save()
      } else {
        await stock.destroy()
      }
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

async function setStockPercentageOfFund(created13F) {
  const stocksForTheThirteenF = await Stock.findAll({
    where: {
      thirteenFId: created13F.id,
    },
  })
  for (let i = 0; i < stocksForTheThirteenF.length; i++) {
    const holding = stocksForTheThirteenF[i]
    holding.percentageOfPortfolio =
      holding.totalValue / created13F.portfolioValue
    await holding.save()
  }
}

async function setQuarterlyValues() {
  try {
    console.log('IN SET QUARTERLY VALUES')
    const hedgeFunds = await HedgeFund.findAll({
      where: {
        name: {
          [Op.in]: HEDGEFUNDS,
        },
      },
      include: [
        {
          model: ThirteenF,
          include: [Stock],
        },
      ],
    })
    for (let i = 0; i < hedgeFunds.length; i++) {
      const hedgeFund = hedgeFunds[i]
      const hedgeyReturnObj = await calcMimicReturn(
        hedgeFund.id,
        STARTING_VALUE
      )

      for (let j = 0; j < hedgeFund.thirteenFs.length; j++) {
        const thirteenF = hedgeFund.thirteenFs[j]
        thirteenF.quarterlyValue = Math.round(
          hedgeyReturnObj[`${thirteenF.year}Q${thirteenF.quarter}`]
        )
        await thirteenF.save()
      }
    }
  } catch (err) {
    console.error(err)
  }
}

async function setHedgeFundReturns(startingValue) {
  try {
    console.log('IN SET HEDGE FUND RETURNS')
    const hedgeFunds = await HedgeFund.findAll({
      where: {
        name: {
          [Op.in]: HEDGEFUNDS,
        },
      },
      include: [
        {
          model: ThirteenF,
          include: [Stock],
        },
      ],
    })
    await Promise.all(
      hedgeFunds.map(async (hedgeFund) => {
        // const [year, quarter] = await getOldestYearAndQuarter(hedgeFund.id)
        // console.log(year, quarter, 'IN SET HEDGEFUND RETURNS')
        await calcHedgeFundReturn(hedgeFund, startingValue)
      })
    )
  } catch (error) {
    console.log(error)
  }
}

async function calculateSPValue() {
  try {
    console.log('IN CALCULATE SPVALUE')
    const hedgeFunds = await HedgeFund.findAll({
      where: {
        name: {
          [Op.in]: HEDGEFUNDS,
        },
      },
      include: ThirteenF,
      order: [[ThirteenF, 'dateOfFiling', 'ASC']],
    })

    console.log(
      'SPVALUE HEDGEFUNDS——————',
      hedgeFunds.map((hedgeFund) => hedgeFund.name)
    )

    for (let i = 0; i < hedgeFunds.length; i++) {
      const hedgeFund = hedgeFunds[i]
      const thirteenFs = hedgeFund.thirteenFs
      const first13F = thirteenFs[0]
      first13F.spValue = Math.round(STARTING_VALUE)
      await first13F.save()
      const responseObj = await getPrice(['^GSPC'], first13F.dateOfFiling)
      const initialPrice = responseObj['^GSPC']
      const startingShares = STARTING_VALUE / initialPrice

      for (let j = 1; j < thirteenFs.length; j++) {
        const current13F = thirteenFs[j]
        const responseObj2 = await getPrice(['^GSPC'], current13F.dateOfFiling)
        const currentPrice = responseObj2['^GSPC']
        const currentValue = Math.round(startingShares * currentPrice)
        current13F.spValue = currentValue
        await current13F.save()
      }
    }
  } catch (err) {
    console.error(err)
  }
}

async function getCurrentYearAndQuarter(hedgeFundId) {
  try {
    const thirteenFs = await ThirteenF.findAll({
      where: {
        hedgeFundId: hedgeFundId,
      },
      order: [['dateOfFiling', 'DESC']],
    })
    const newest13F = thirteenFs[0]
    return [newest13F.year, newest13F.quarter]
  } catch (error) {
    console.error(error)
  }
}

function getYearAndQuarterOneYearAgo(year, quarter) {
  switch (quarter) {
    case 1:
      return [year - 1, 2]
    case 2:
      return [year - 1, 3]
    case 3:
      return [year - 1, 4]
    default:
      return [year, 1]
  }
}

function getYearThreeYearsAgo(year, quarter) {
  if (quarter !== 4) return year - 1
  else return year - 2
}

// function getYearFiveYearsAgo

// COME BACK TO THIS
async function calcHedgeFundReturn(hedgeFund, startingValue) {
  console.log('IN CALC HEDGE FUND RETURN')
  const [curYear, curQuarter] = await getCurrentYearAndQuarter(hedgeFund.id)
  const [oneYearAgo, threeQuartersAgo] = getYearAndQuarterOneYearAgo(
    curYear,
    curQuarter
  )
  const threeYearsAgo = getYearThreeYearsAgo(curYear, curQuarter)
  const current13F = await ThirteenF.findOne({
    where: {
      hedgeFundId: hedgeFund.id,
      year: curYear,
      quarter: curQuarter,
    },
  })
  if (!current13F) return
  const currentValue = current13F.quarterlyValue
  const oneYearAway13F = await ThirteenF.findOne({
    where: {
      hedgeFundId: hedgeFund.id,
      year: oneYearAgo,
      quarter: threeQuartersAgo,
    },
  })
  if (!oneYearAway13F) return
  const oneYearValue = oneYearAway13F.quarterlyValue
  const oneYearReturn = currentValue / oneYearValue
  hedgeFund.yearOneReturn = oneYearReturn
  await hedgeFund.save()

  const threeYearsAway13F = await ThirteenF.findOne({
    where: {
      hedgeFundId: hedgeFund.id,
      year: threeYearsAgo,
      quarter: threeQuartersAgo,
    },
  })
  if (!threeYearsAway13F) return
  const thirdYearValue = threeYearsAway13F.quarterlyValue
  const threeYearReturn = currentValue / thirdYearValue
  hedgeFund.yearThreeReturn = threeYearReturn
  await hedgeFund.save()
  const fiveYearReturn = currentValue / startingValue
  hedgeFund.yearFiveReturn = fiveYearReturn
  await hedgeFund.save()
}

/*eslint no-constant-condition: ["error", { "checkLoops": false }]*/
async function findTickers(timer, stocks, lastOne) {
  const allCusips = stocks.map((stock) => stock.cusip)

  const allTickers = await getTickers(allCusips)

  const cusipObject = {}

  allCusips.forEach((cusip, index) => {
    if (allTickers[index].data)
      cusipObject[allCusips[index]] = allTickers[index].data[0].ticker
  })

  for (let i = 0; i < stocks.length; i++) {
    const currStock = stocks[i]

    if (cusipObject[currStock.cusip]) {
      currStock.ticker = cusipObject[currStock.cusip]
      await currStock.save()
    }
  }

  if (lastOne) await lastFunctions()
}

async function deleteNullTickers() {
  while (true) {
    const nullTicker = await Stock.findOne({
      where: {
        ticker: null,
      },
    })

    if (!nullTicker) break

    await nullTicker.destroy()
  }
}

async function lastFunctions() {
  console.log('IN LAST FUNCTIONS')
  await deleteNullTickers()
  await setPrices()
  await setBeta()
  await setPortfolioValueAndPercentageOfFund()
  await setQuarterlyValues()
  await calculateSPValue()
  await setHedgeFundReturns(STARTING_VALUE)
  await setFundRisk()
}

async function seedData(apiKey, hedgeFundNames, size) {
  await buildHedgeFunds(apiKey, hedgeFundNames, size)

  const allStocks = await Stock.findAll({
    where: {
      ticker: null,
    },
  })

  const chunkedStocks = breakIntoChunks(allStocks)

  const timer = setInterval(throttleApiCall, 280)

  let index = 0
  let lastOne = false

  async function throttleApiCall() {
    try {
      if (index === chunkedStocks.length - 1) lastOne = true
      if (index < chunkedStocks.length) {
        const stocks = chunkedStocks[index]
        index++
        if (lastOne) endThrottle(timer)

        await findTickers(timer, stocks, lastOne)
      }
    } catch (err) {
      console.error(err)
    }
  }
}

seedData(EDGAR_KEY, HEDGEFUNDS, SIZE)

module.exports = {
  setHedgeFundReturns,
  setQuarterlyValues,
  calculateSPValue,
  setFundRisk,
}
