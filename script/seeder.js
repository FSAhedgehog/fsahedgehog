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
const {getTicker} = require('./seederUtility')

const API_KEY =
  'f36058d1e794c3b5fa2f98ac653ae3db6584a005a67ec4088044ecdb5f72bee3'
// '0550e731e5d49bfc8c0fae6ac5a5b446fc536c6c95650673d7e01c6eada56dc9'

// ADD HEDGEFUNDS HERE
const HEDGEFUNDS = ['BILL & MELINDA']

// CHANGE SIZE HERE
const SIZE = '5'

// TODO: CHANGE QUERY
function buildQuery(hedgeFund, size) {
  return {
    query: {
      query_string: {
        query: `formType:\\"13F\\" AND companyName:\\"${hedgeFund}\\"`,
      },
    },
    from: '0',
    size: `${size}`,
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
    const data = require('./exampleReturn')
    return data
  } catch (err) {
    console.log('error in getInitialData func—————', err)
  }
}

async function createHedgeFund(data) {
  try {
    const companyName = data.filings[0].companyName

    const hedgeFund = await HedgeFund.create({
      name: companyName,
    })

    return hedgeFund
  } catch (err) {
    console.log('error in createHedgeFund func—————', err)
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

async function create13F(data, hedgeFund) {
  try {
    const thirteenFs = data.filings

    const returnedThirteenFs = await Promise.all(
      thirteenFs.map(async (elem) => {
        const thirteenF = await ThirteenF.create({
          dateOfFiling: elem.filedAt,
          year: elem.periodOfReport.slice(0, 4),
          quarter: findQuarter(elem.periodOfReport.slice(5, 7)),
        })

        const stockHoldings = elem.holdings

        const returnedStockHoldings = await Promise.all(
          stockHoldings
            .filter((stockHolding) => !stockHolding.putCall)
            .map(async (stockHolding) => {
              const createdStockHolding = await Stock.create({
                cusip: stockHolding.cusip,
                totalValue: stockHolding.value,
                qtyOfSharesHeld: stockHolding.shrsOrPrnAmt.sshPrnamt,
              })

              return createdStockHolding
            })
        )

        await thirteenF.addStocks(returnedStockHoldings)
        await hedgeFund.addThirteenF(thirteenF)
        await hedgeFund.addStocks(returnedStockHoldings)

        return thirteenF
      })
    )

    return returnedThirteenFs
  } catch (err) {
    console.log('error in create13F func——————', err)
  }
}

async function seedData(apiKey, query) {
  const data = await getInitialData(apiKey, query)

  const hedgeFund = await createHedgeFund(data)
  const thirteenFs = await create13F(data, hedgeFund)

  // console.log('FINAL THIRTEENFS————————', thirteenFs)
}

async function seedMultiple(apiKey, hedgeFunds, size) {
  await db.sync({force: true})
  while (hedgeFunds.length) {
    const hedgeFund = hedgeFunds.pop()
    const query = buildQuery(hedgeFund, size)
    await seedData(apiKey, query)
  }

  await db.close()
}

async function updateTicker() {
  const stocks = await Stock.findAll()

  var clearIntervalKey = setInterval(async () => {
    console.log('IN SET INTERVAL')
    const stockInstance = stocks.pop()
    stockInstance.ticker = await getTicker(stockInstance.cusip)
    await stockInstance.save()
  }, 1000)

  function myStopFunction() {
    clearInterval(clearIntervalKey)
  }

  setTimeout(myStopFunction(), 10000)
}

seedMultiple(API_KEY, HEDGEFUNDS, SIZE)
updateTicker()
