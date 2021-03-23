//Things to calculate later
//HF Model year 1/3/5
//13f portfolio value

//hedgefund model
//object.filings[0].companyName = name

//13f
//date of filing object.filings[0].filedAt = date of filing
//year object.filings[0]periodOfReport.slice(0,4) wrap in Number/parsedInt()
//quarter march june sept dec/ object.filings[0]periodOfReport.slice(5,7) conditionals to check number and get quarter

//portfolio value:

// Month      getMonth()  quarter
// --------- ----------  -------
// January         0         1
// February        1         1
// March           2         1
// April           3         2
// May             4         2
// June            5         2
// July            6         3
// August          7         3
// September       8         3
// October         9         4
// November       10         4
// December       11         4

//stocks
//ticker cant bull from 13f
//qtyOfSharesHeld
//price
//percentage of portfolio

const axios = require('axios')
const db = require('../server/db')

const {HedgeFund, ThirteenF, Stock} = require('../server/db/models')
const {getTicker, getPrice} = require('./seederUtility')

const API_KEY =
  // 'f36058d1e794c3b5fa2f98ac653ae3db6584a005a67ec4088044ecdb5f72bee3'
  '0550e731e5d49bfc8c0fae6ac5a5b446fc536c6c95650673d7e01c6eada56dc9'

// CHANGE HEDGEFUNDS HERE
const HEDGEFUNDS = [
  'DAILY JOURNAL CORP',
  'BERKSHIRE HATHAWAY INC',
  'BILL & MELINDA GATES FOUNDATION TRUST',
  'GREENLIGHT CAPITAL INC',
  'BILL ACKMAN - PERSHING SQUARE CAPITAL MANAGEMENT',
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
      const createdHedgeFundArray = await HedgeFund.findOrCreate({
        where: {
          name: filing.companyName,
        },
      })

      await create13F(createdHedgeFundArray[0], filing)
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
    console.log('IN CREATE STOCKS—————————')
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

function findQuarter(month) {
  month = Number(month)
  if (month <= 2) {
    return 1
  } else if (month > 2 && month <= 5) {
    return 2
  } else if (month > 5 && month <= 8) {
    return 3
  } else {
    return 4
  }
}

async function buildHedgeFunds(apiKey, hedgeFundNames, size) {
  try {
    await db.sync({force: true})
    const query = buildQuery(hedgeFundNames, size)
    console.log('QUERY——————', query)
    const data = await getInitialData(apiKey, query)
    console.log('data———————', data)
    console.log('data.filings—————', data.filings)
    await createHedgeFunds(data.filings)
  } catch (err) {
    console.error(err)
  }
}

async function seedData(apiKey, hedgeFundNames, size) {
  await buildHedgeFunds(apiKey, hedgeFundNames, size)

  const timer = setInterval(addTicker, 300)
  async function addTicker() {
    try {
      const stock = await Stock.findOne({
        where: {
          ticker: null,
        },
        include: [ThirteenF],
      })

      if (!stock) {
        console.log('exiting setInterval')
        clearInterval(timer)
        await db.close()
        return
      }

      const ticker = await getTicker(stock.cusip)

      if (ticker) {
        stock.ticker = ticker
        const price = await getPrice(ticker, stock.thirteenF.dateOfFiling)
        stock.price = price[0] ? price[0].close : null
        await stock.save()
      } else {
        stock.ticker = 'COULD NOT FIND'
        await stock.save()
      }
    } catch (err) {
      console.error(err)
    }
  }
}

seedData(API_KEY, HEDGEFUNDS, SIZE)
