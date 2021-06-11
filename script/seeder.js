const axios = require('axios')
const db = require('../server/db')
const {HedgeFund, ThirteenF, Stock} = require('../server/db/models')
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
} = require('./seederUtility')
require('dotenv').config()

const EDGAR_KEY = process.env.EDGAR_KEY
// CHANGE HEDGEFUNDS HERE
// SEEDING TAKES ABOUT FOUR MINUTES PER HEDGEFUND
// --------------------------------------------------------
// NEED TO BE THE EXACT CASES AS SEEN IN THE EDGAR RESPONSE
// --------------------------------------------------------
const HEDGEFUNDS = [
  // 'TRIAN FUND MANAGEMENT, L.P.',
  // 'ValueAct Holdings, L.P.',
  // 'DAILY JOURNAL CORP',
  // 'BERKSHIRE HATHAWAY INC',
  // 'BILL & MELINDA GATES FOUNDATION TRUST',
  'Scion Asset Management, LLC',
  // 'GREENLIGHT CAPITAL INC',
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

const SIZE = String(HEDGEFUNDS.length * 31)

const STARTING_VALUE = 10000

function buildQuery(hedgeFunds, size) {
  hedgeFunds = hedgeFunds
    .map((hedgeFund) => `companyName:\"${hedgeFund}\"`)
    .join(' OR ')

  return {
    query: {
      // eslint-disable-next-line camelcase
      query_string: {
        // eslint-disable-next-line
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
    const {data} = await axios.post(
      `https://api.sec-api.io?token=${apiKey}`,
      query
    )

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
      const createdHedgeFund = response[0]

      await create13F(createdHedgeFund, filing)
    }
  } catch (err) {
    console.error('error in createHedgeFund func—————', err)
  }
}

async function create13F(createdHedgeFund, filing) {
  try {
    const quarter = findQuarterOfReport(filing.filedAt.slice(5, 7))
    const year = findYearOfReport(filing.filedAt.slice(0, 4), quarter)
    const created13F = await ThirteenF.create({
      dateOfFiling: filing.filedAt,
      year: year,
      quarter: quarter,
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
    console.log('Database seeding!')
    const query = buildQuery(hedgeFundNames, size)
    const data = await getInitialData(apiKey, query)
    await createHedgeFunds(data.filings)
  } catch (err) {
    console.error(err)
  }
}

async function setPortfolioValueAndPercentageOfFund() {
  try {
    const thirteenFs = await ThirteenF.findAll()
    for (let i = 0; i < thirteenFs.length; i++) {
      const thirteenF = thirteenFs[i]
      thirteenF.portfolioValue = await getFundValue(thirteenF.id)
      await thirteenF.save()
      await setStockPercentageOfFund(thirteenF)
    }
  } catch (error) {
    console.error(error)
  }
}

async function setFundRisk() {
  try {
    const thirteenFs = await ThirteenF.findAll()
    for (let i = 0; i < thirteenFs.length; i++) {
      const thirteenF = thirteenFs[i]
      thirteenF.thirteenFBeta = await fundRisk(thirteenF.id)
      await thirteenF.save()
    }
  } catch (error) {
    console.error(error)
  }
}

function endThrottle(timer) {
  try {
    clearInterval(timer)
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

async function setPrices() {
  try {
    const thirteenFs = await ThirteenF.findAll({include: [Stock]})

    for (let i = 0; i < thirteenFs.length; i++) {
      const thirteenF = thirteenFs[i]
      const date = thirteenF.dateOfFiling

      const stockTickers = thirteenF.stocks.map((stock) => stock.ticker)

      const pricesObj = await getPrice(stockTickers, date)

      for (let j = 0; j < thirteenF.stocks.length; j++) {
        const stock = thirteenF.stocks[j]

        if (pricesObj[stock.ticker]) {
          stock.price = pricesObj[stock.ticker]
          await stock.save()
        } else {
          console.log(`Deleting ${stock.ticker} bc can't find price`)
          await stock.destroy()
        }
      }
    }
  } catch (err) {
    console.error(err)
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
      const [hedgeyReturnObj, topTenHedgeyReturnObj] = await calcMimicReturn(
        hedgeFund.id,
        STARTING_VALUE
      )
      for (let j = 0; j < hedgeFund.thirteenFs.length; j++) {
        const thirteenF = hedgeFund.thirteenFs[j]
        const year = thirteenF.year
        const quarter = thirteenF.quarter
        if (!thirteenF.quarterlyValue) {
          thirteenF.quarterlyValue = Math.round(
            hedgeyReturnObj[`${year}Q${quarter}`]
          )
          thirteenF.topTenQuarterlyValue = Math.round(
            topTenHedgeyReturnObj[`${year}Q${quarter}`]
          )
        }
        await thirteenF.save()
      }
    }
  } catch (err) {
    console.error(err)
  }
}

async function setHedgeFundReturns(startingValue) {
  try {
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
        await calcHedgeFundReturn(hedgeFund, startingValue)
      })
    )
  } catch (error) {
    console.error(error)
  }
}

async function calculateSPValue() {
  try {
    const hedgeFunds = await HedgeFund.findAll({
      where: {
        name: {
          [Op.in]: HEDGEFUNDS,
        },
      },
      include: ThirteenF,
      order: [[ThirteenF, 'dateOfFiling', 'ASC']],
    })

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

function findYearAndQuarterYearsAgo(curQuarter) {
  let yearSubtractor
  let quarter
  switch (curQuarter) {
    case 1:
      quarter = 2
      yearSubtractor = 1
      return [yearSubtractor, quarter]
    case 2:
      quarter = 3
      yearSubtractor = 1
      return [yearSubtractor, quarter]
    case 3:
      quarter = 4
      yearSubtractor = 1
      return [yearSubtractor, quarter]
    default:
      quarter = 1
      yearSubtractor = 0
      return [yearSubtractor, quarter]
  }
}

async function findThirteenF(hedgeFund, years, curYear, curQuarter) {
  const thirteenF = await ThirteenF.findOne({
    where: {
      hedgeFundId: hedgeFund.id,
      year: curYear - years,
      quarter: curQuarter,
    },
  })
  return thirteenF
}

async function calcHedgeFundReturn(hedgeFund) {
  try {
    const [curYear, curQuarter] = await getCurrentYearAndQuarter(hedgeFund.id)
    const [oldYear, oldQuarter] = await getOldestYearAndQuarter(hedgeFund.id)
    // const [yearSubtractor, quarterBack] = findYearAndQuarterYearsAgo(curQuarter)
    const current13F = await findThirteenF(hedgeFund, 0, curYear, curQuarter)
    const currentValue = current13F ? current13F.quarterlyValue : null
    const topTenCurrentValue = current13F
      ? current13F.topTenQuarterlyValue
      : null
    console.log(topTenCurrentValue, 'TOP TEN CURRENT VALUE')
    const oneYearAway13F = await findThirteenF(
      hedgeFund,
      1,
      curYear,
      curQuarter
    )
    if (oneYearAway13F) {
      saveReturn(1, oneYearAway13F, currentValue, hedgeFund, topTenCurrentValue)
    }

    const threeYearsAway13F = await findThirteenF(
      hedgeFund,
      3,
      curYear,
      curQuarter
    )
    if (threeYearsAway13F) {
      saveReturn(
        3,
        threeYearsAway13F,
        currentValue,
        hedgeFund,
        topTenCurrentValue
      )
    }

    const fiveYearsAway13F = await findThirteenF(
      hedgeFund,
      5,
      curYear,
      curQuarter
    )
    if (fiveYearsAway13F) {
      saveReturn(
        5,
        fiveYearsAway13F,
        currentValue,
        hedgeFund,
        topTenCurrentValue
      )
    }

    const tenYearsAway13F = await findThirteenF(
      hedgeFund,
      10,
      curYear,
      curQuarter
    )
    if (tenYearsAway13F) {
      saveReturn(
        10,
        tenYearsAway13F,
        currentValue,
        hedgeFund,
        topTenCurrentValue
      )
    }

    const fifteenYearsAway13F = await findThirteenF(
      hedgeFund,
      15,
      curYear,
      curQuarter
    )
    if (fifteenYearsAway13F) {
      saveReturn(
        15,
        fifteenYearsAway13F,
        currentValue,
        hedgeFund,
        topTenCurrentValue
      )
    }

    const twentyYearsAway13F = await findThirteenF(
      hedgeFund,
      20,
      curYear,
      curQuarter
    )
    if (tenYearsAway13F) {
      saveReturn(
        20,
        twentyYearsAway13F,
        currentValue,
        hedgeFund,
        topTenCurrentValue
      )
    }

    const maxYearsAway13F = await ThirteenF.findOne({
      where: {
        hedgeFundId: hedgeFund.id,
        year: oldYear,
        quarter: oldQuarter,
      },
    })
    if (maxYearsAway13F) {
      console.log('GOT TO MAX YEARS')
      saveReturn(
        oldYear,
        maxYearsAway13F,
        currentValue,
        hedgeFund,
        topTenCurrentValue,
        oldQuarter
      )
    }
  } catch (err) {
    console.error(err)
  }
}

async function saveReturn(
  year,
  thirteenF,
  currentValue,
  hedgeFund,
  topTenQuarterlyValue,
  quarter
) {
  const value = thirteenF.quarterlyValue
  const topTenValue = thirteenF.topTenQuarterlyValue
  console.log(topTenValue)
  console.log(topTenQuarterlyValue, 'TOP TEN Q V')
  const roi = currentValue / value
  const topTenRoi = topTenQuarterlyValue / topTenValue
  let dataLabel = ''
  let dataLabel2 = ''
  switch (year) {
    case 1:
      dataLabel = 'yearOneReturn'
      break
    case 3:
      dataLabel = 'yearThreeReturn'
      break
    case 5:
      dataLabel = 'yearFiveReturn'
      break
    case 10:
      dataLabel = 'yearTenReturn'
      break
    case 15:
      dataLabel = 'yearFifteenReturn'
      break
    case 20:
      dataLabel = 'yearTwentyReturn'
      break
    default:
      dataLabel = 'maxReturn'
      break
  }
  switch (year) {
    case 1:
      dataLabel2 = 'yearOneTopTenReturn'
      break
    case 3:
      dataLabel2 = 'yearThreeTopTenReturn'
      break
    case 5:
      dataLabel2 = 'yearFiveTopTenReturn'
      break
    case 10:
      dataLabel2 = 'yearTenTopTenReturn'
      break
    case 15:
      dataLabel2 = 'yearFifteenTopTenReturn'
      break
    case 20:
      dataLabel2 = 'yearTwentyTopTenReturn'
      break
    default:
      dataLabel2 = 'maxTopTenReturn'
      break
  }
  if (dataLabel === 'maxReturn') {
    hedgeFund[dataLabel] = `${year}Q${quarter}${roi}`
    hedgeFund[dataLabel2] = `${year}Q${quarter}${topTenRoi}`
  } else {
    hedgeFund[dataLabel] = roi
    hedgeFund[dataLabel2] = topTenRoi
  }
  await hedgeFund.save()
}

/*eslint no-constant-condition: ["error", { "checkLoops": false }]*/
async function findTickers(timer, stocks, lastOne) {
  try {
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
        currStock.ticker = cusipObject[currStock.cusip].replace('/', '-')
        await currStock.save()
      }
    }

    if (lastOne) await lastFunctions()
  } catch (err) {
    console.error(err)
  }
}

async function deleteNullTickers() {
  try {
    while (true) {
      const nullTicker = await Stock.findOne({
        where: {
          ticker: null,
        },
      })

      if (!nullTicker) break
      console.log(`Deleting ${nullTicker.cusip} bc null ticker`)
      await nullTicker.destroy()
    }
  } catch (err) {
    console.error(err)
  }
}

async function lastFunctions() {
  try {
    await deleteNullTickers()
    await setPrices()
    await setBeta()
    await setPortfolioValueAndPercentageOfFund()
    await setQuarterlyValues()
    await calculateSPValue()
    await setHedgeFundReturns(STARTING_VALUE)
    await setFundRisk()
    console.log('Seeding success!')
  } catch (err) {
    console.error(err)
  }
}

async function seedData(apiKey, hedgeFundNames, size) {
  await buildHedgeFunds(apiKey, hedgeFundNames, size)

  const allStocks = await Stock.findAll({
    where: {
      ticker: null,
    },
  })

  const chunkedStocks = breakIntoChunks(allStocks)

  const timer = setInterval(throttleApiCall, 2500)

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
  // getCurrentYearAndQuarter,
}
