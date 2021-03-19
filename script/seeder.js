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
const {Hedgefund, ThirteenF, Stock} = require('../server/db/models')

// Fiddle with these constants to change the query
const API_KEY =
  '0550e731e5d49bfc8c0fae6ac5a5b446fc536c6c95650673d7e01c6eada56dc9'

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
    const {data} = await axios.post(
      `https://api.sec-api.io?token=${apiKey}`,
      query
    )

    return data
  } catch (err) {
    console.log('error in getInitialData func—————', err)
  }
}

async function findOrCreateHedgefund(data) {
  try {
    const companyName = data.filings[0].companyName

    const hedgeFund = await Hedgefund.findOrCreate({
      where: {
        name: companyName,
      },
    })

    return hedgeFund
  } catch (err) {
    console.log('error in findOrCreateHedgefund func—————', err)
  }
}

async function seedData(apiKey, query) {
  const data = await getInitialData(apiKey, query)

  const hedgeFund = await findOrCreateHedgefund(data)
}

seedData(API_KEY, QUERY)
