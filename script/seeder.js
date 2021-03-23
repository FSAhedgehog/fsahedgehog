const axios = require('axios')
const db = require('../server/db')
const {HedgeFund, ThirteenF, Stock} = require('../server/db/models')
const {getTicker, getPrice, findQuarter} = require('./seederUtility')
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
const SIZE = '5'

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
    const {data} = await axios.post(
      `https://api.sec-api.io?token=${apiKey}`,
      query
    )
    // Uncomment this for testing purpose
    // console.log(data)
    // const data = require('./exampleFiveReturn')
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

async function createStocks(createdHedgeFund, created13F, holdings) {
  try {
    const createdStocks = await Promise.all(
      holdings
        .filter((holding) => !holding.putCall)
        .map(async (stockHolding) => {
          const createdStockHolding = await Stock.create({
            cusip: stockHolding.cusip,
            totalValue: stockHolding.value,
            qtyOfSharesHeld: stockHolding.shrsOrPrnAmt.sshPrnamt,
          })

          return createdStockHolding
        })
    )

    await created13F.addStocks(createdStocks)
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

async function findNullTicker() {
  try {
    const stock = await Stock.findOne({
      where: {
        ticker: null,
      },
      include: [ThirteenF],
    })

    return stock
  } catch (err) {
    console.error(err)
  }
}

async function endThrottle(timer) {
  console.log('exiting setInterval')
  clearInterval(timer)
  await db.close()
}

async function addTickerAndPrice(stock, ticker) {
  stock.ticker = ticker
  const price = await getPrice(ticker, stock.thirteenF.dateOfFiling)
  stock.price = price[0] ? price[0].close : null
  await stock.save()
}

async function seedData(apiKey, hedgeFundNames, size) {
  await buildHedgeFunds(apiKey, hedgeFundNames, size)

  const timer = setInterval(throttleApiCall, 300)

  async function throttleApiCall() {
    try {
      const stock = await findNullTicker()

      if (!stock) {
        endThrottle(timer)
        return
      }

      const ticker = await getTicker(stock.cusip)

      if (ticker) {
        addTickerAndPrice(stock, ticker)
      } else {
        stock.ticker = 'COULD NOT FIND'
        await stock.save()
      }
    } catch (err) {
      console.error(err)
    }
  }
}

seedData(EDGAR_KEY, HEDGEFUNDS, SIZE)
