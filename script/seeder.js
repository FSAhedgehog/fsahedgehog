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
//   January         0         1
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
const {HedgeFund, ThirteenF, Stock} = require('../server/db/models')

// Fiddle with these constants to change the query
const API_KEY =
  'f36058d1e794c3b5fa2f98ac653ae3db6584a005a67ec4088044ecdb5f72bee3'
// '0550e731e5d49bfc8c0fae6ac5a5b446fc536c6c95650673d7e01c6eada56dc9'

const HEDGEFUND = 'BILL & MELINDA'

const SIZE = '5'

// Don't fiddle with this query
const QUERY = {
  query: {
    query_string: {
      query: `formType:\\"13F\\" AND companyName:\\"${HEDGEFUND}\\"`,
    },
  },
  from: '0',
  size: `${SIZE}`,
  sort: [
    {
      filedAt: {
        order: 'desc',
      },
    },
  ],
}

async function getInitialData(apiKey, query) {
  try {
    // const {data} = await axios.post(
    //   `https://api.sec-api.io?token=${apiKey}`,
    //   query
    //)
    //console.log(data)
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

async function create13F(data, hedgeFund) {
  try {
    const thirteenFs = data.filings

    const returnedThirteenFs = await Promise.all(
      thirteenFs.map(async (elem) => {
        const stockHoldings = elem.holdings

        const thirteenF = await ThirteenF.create({
          dateOfFiling: elem.filedAt,
        })

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

  console.log('FINAL THIRTEENFS————————', thirteenFs)
}

seedData(API_KEY, QUERY)
