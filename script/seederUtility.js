const yahooFinance = require('yahoo-finance')
const axios = require('axios')
const {HedgeFund, ThirteenF, Stock} = require('../server/db/models')
require('dotenv').config()
// const {OPEN_FIJI_KEY} = require('../secrets')
const OPEN_FIJI_KEY = process.env.OPEN_FIJI_KEY
function findQuarter(month) {
  month = Number(month)
  if (month === 3) {
    return 1
  } else if (month > 3 && month <= 6) {
    return 2
  } else if (month > 7 && month <= 9) {
    return 3
  } else {
    return 4
  }
}

function isCharacterALetter(char) {
  return /[A-Z]/.test(char)
}

async function getTickers(cusipArray) {
  cusipArray = cusipArray.map((cusip) => {
    return {
      idValue: cusip,
      idType: isCharacterALetter(cusip[0]) ? 'ID_CINS' : 'ID_CUSIP',
      exchCode: 'US',
    }
  })

  const axiosConfig = {
    headers: {
      'Content-Type': 'application/json',
      'X-OPENFIGI-APIKEY': OPEN_FIJI_KEY,
    },
  }

  try {
    const {data} = await axios.post(
      'https://api.openfigi.com/v2/mapping\\',
      cusipArray,
      axiosConfig
    )

    return data
  } catch (error) {
    console.error(error)
  }
}

function addDayToDate(date) {
  let nextDate = new Date(date)
  nextDate.setDate(nextDate.getDate() + 1)
  return nextDate
}

async function getPrice(tickers, date) {
  try {
    // console.log('TICKERS ARRAY——————', tickers)
    const response = await yahooFinance.historical({
      symbols: tickers,
      from: date.slice(0, 10),
      to: addDayToDate(date),
      period: 'd',
    })
    // console.log('RESPONSE———————', response)
    for (let key in response) {
      if (response.hasOwnProperty(key)) {
        response[key].length
          ? (response[key] = response[key][0].close)
          : (response[key] = null)
      }
    }
    return response
  } catch (err) {
    console.error('CANNOT GET PRICE OF TICKER', err)
  }
}

async function getOldestYearAndQuarter(hedgeFundId) {
  try {
    console.log('IN GET OLDEST YEAR______')
    const thirteenFs = await ThirteenF.findAll({
      where: {
        hedgeFundId: hedgeFundId,
      },
      order: [['dateOfFiling', 'ASC']],
    })
    const oldest13F = thirteenFs[0]

    return [oldest13F.year, oldest13F.quarter]
  } catch (err) {
    console.error(err)
  }
}

async function calcMimicReturn(hedgeFundId, startingValue) {
  let prevValue = startingValue
  let quarterlyValues = {}
  let prevPortfolio = null
  let portfolio = null
  let thirteenF = 'need to add to make the do while loop before defined in loop'
  let [year, quarter] = await getOldestYearAndQuarter(hedgeFundId)
  console.log(year, quarter)
  do {
    thirteenF = await ThirteenF.findOne({
      where: {
        year: year,
        quarter: quarter,
        hedgeFundId: hedgeFundId,
      },
      include: [
        {
          model: Stock,
        },
      ],
    })
    if (!thirteenF) break
    let date = await thirteenF.dataValues.dateOfFiling
    if (!portfolio) portfolio = createPortfolio(thirteenF, prevValue)
    if (!prevPortfolio) prevPortfolio = portfolio
    let newValue = await findInvestmentPortfolioNewValue(prevPortfolio, date)
    portfolio = createPortfolio(thirteenF, newValue)
    prevValue = prevPortfolio.value
    let quarterlyValue = newValue
    quarterlyValues[`${year}Q${quarter}`] = quarterlyValue
    prevPortfolio = portfolio
    ;({year, quarter} = getNextYearAndQuarter(year, quarter))
  } while (thirteenF)
  console.log(quarterlyValues)
  return quarterlyValues
}

function createPortfolio(thirteenF, value) {
  let portfolio = {}
  for (let i = 0; i < thirteenF.stocks.length; i++) {
    const stock = thirteenF.stocks[i]
    portfolio[stock.ticker] = {
      percentage: stock.percentageOfPortfolio,
      prevPrice: stock.price,
    }
  }
  portfolio.value = value
  return portfolio
}

async function findInvestmentPortfolioNewValue(portfolio, date) {
  let newValue = 0
  const tickersArr = Object.keys(portfolio).filter((key) => key !== 'value')

  const responseObj = await getPrice(tickersArr, date)

  for (let key in portfolio) {
    if (key !== 'value') {
      const currPrice = responseObj[key] || portfolio[key].prevPrice
      const pricePercentage = currPrice / portfolio[key].prevPrice
      newValue += pricePercentage * portfolio.value * portfolio[key].percentage
    }
  }
  return newValue
}

function getNextYearAndQuarter(year, quarter) {
  if (quarter === 4) {
    year++
    quarter = 1
  } else {
    quarter++
  }
  return {year, quarter}
}

function getDateOfReporting(year, quarter) {
  let date = `${year}`
  date += quarter === 1 ? '-03-31' : ''
  date += quarter === 2 ? '-06-30' : ''
  date += quarter === 3 ? '-09-30' : ''
  date += quarter === 4 ? '-12-31' : ''
  return date
}

async function getBeta(tickers) {
  try {
    const response = await yahooFinance.quote({
      symbols: tickers,
      modules: ['summaryDetail'],
    })

    console.log('RESPONSE IN GETBETA————————')
    for (let key in response) {
      if (response.hasOwnProperty(key)) {
        response[key].summaryDetail.beta
          ? (response[key] = response[key].summaryDetail.beta)
          : (response[key] = null)
      }
    }

    return response
  } catch (err) {
    console.error(err)
  }
}
async function fundRisk(thirteenFId) {
  try {
    const data = await Stock.findAll({
      where: {thirteenFId: thirteenFId},
    })
    let thirteenFBeta = data
      .map((stock) => {
        return stock.percentageOfPortfolio * stock.beta
      })
      .reduce((total, curVal) => {
        return total + curVal
      })
    return thirteenFBeta
  } catch (error) {
    console.log(error)
  }
}

function breakIntoChunks(array) {
  const outerArray = []

  while (array.length) {
    const innerArray = []
    let counter = 0
    while (counter < 100 && array.length) {
      innerArray.push(array.pop())
      counter++
    }
    outerArray.push(innerArray)
  }
  return outerArray
}

module.exports = {
  getTickers,
  getPrice,
  findQuarter,
  getBeta,
  calcMimicReturn,
  fundRisk,
  getOldestYearAndQuarter,
  breakIntoChunks,
}
