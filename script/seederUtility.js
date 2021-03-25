const yahooFinance = require('yahoo-finance')
const axios = require('axios')
const {HedgeFund, ThirteenF, Stock} = require('../server/db/models')
const {OPEN_FIJI_KEY} = require('../secrets')

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

async function getTicker(cusip) {
  const idType = isCharacterALetter(cusip[0]) ? 'ID_CINS' : 'ID_CUSIP'
  let postData = [{idType, idValue: cusip, exchCode: 'US'}]
  let axiosConfig = {
    headers: {
      'Content-Type': 'application/json',
      'X-OPENFIGI-APIKEY': OPEN_FIJI_KEY,
    },
  }
  try {
    const {data} = await axios.post(
      'https://api.openfigi.com/v2/mapping\\',
      postData,
      axiosConfig
    )
    console.log(data[0].data[0].ticker)
    return data[0].data[0].ticker
  } catch (error) {
    console.log('oopsie!')
  }
}
// needs to be passed in double quotation string
function addDayToDate(date) {
  let nextDate = new Date(date)
  nextDate.setDate(nextDate.getDate() + 1)
  return nextDate
}

//'2021-01-08T21:52:22-05:00'

function getPrice(ticker, date) {
  return yahooFinance.historical(
    {
      symbol: ticker,
      from: date.slice(0, 10),
      to: addDayToDate(date),
      period: 'd',
    },
    function (err, quotes) {
      if (err) {
        console.error(err)
      } else {
        const price = quotes[0] ? quotes[0].close : null
        return price
      }
    }
  )
}

// need grab the 20th last 13F- could be dynamic so we can use this when 13F's update
// query the stocks for that 13F - need to have date price on stocks that were completely sold aka date on stock table?
// create a portfolio with a 10000 and put cash as a percentage of each stock in an obj
// go to the next 13F - need to get stock prices of everystock in the basket that next date
// calculate the investment value
// redistribute the portfolio with new stocks
// and so and so forth
// at the end divide the total value of the investment by the original

// need to make sure to calculate new investment value before writing over it
async function calcMimicReturn(hedgeFundId, year, quarter) {
  // initial value used as a base to calculate the return on
  let prevValue = 10000
  // 5 years ago minus a quarter
  year = 2019
  quarter = 1

  let quarterlyValues = {}
  // need to define to have in the if statements for the first time through the loop
  let prevPortfolio = null
  let portfolio = null
  let thirteenF = 'need to add to make the do while loop before defined in loop'
  do {
    // grab the thirteenF
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
    // grab the date for finding update prices
    let date = await thirteenF.dataValues.dateOfFiling
    // if there is no portfolio and prevPortfolio aka the first time we just redifine the prev as the current
    if (!portfolio) portfolio = createPortfolio(thirteenF, prevValue)
    if (!prevPortfolio) prevPortfolio = portfolio
    // find the new value of the prevPortfolio, should be the same first time
    let newValue = await findInvestmentPortfolioNewValue(prevPortfolio, date)
    // create portfolio of the thirteenF with the new value or starting value
    portfolio = createPortfolio(thirteenF, newValue)
    // grab the value of the previous portfolio to the new value of the previous portfolio
    prevValue = await prevPortfolio.value
    // finding the quarterlyReturn incase we would like to use later for graphing
    let quarterlyValue = newValue
    quarterlyValues[`${year}Q${quarter}`] = quarterlyValue
    // redifine the prevPortfolio as the current portfolio for the next time around
    prevPortfolio = portfolio
    // get the next quarter
    ;({year, quarter} = getNextYearAndQuarter(year, quarter))
    // find the next 13F
  } while (thirteenF)
  console.log(quarterlyValues, 'QUARTERLY VALUES')
  return quarterlyValues
}

function createPortfolio(thirteenF, value) {
  let portfolio = {}
  // not sure what this instance looks like
  // portfolio is used in the next 13F so using past tense "prev"
  // iterate through each stock and populate a portfolio obj
  thirteenF.stocks.forEach((stock) => {
    portfolio[stock.ticker] = {
      percentage: stock.percentageOfPortfolio,
      prevPrice: stock.price,
    }
  })
  // set the value of the portfolio as the value thrown in
  portfolio.value = value
  return portfolio
}

async function findInvestmentPortfolioNewValue(portfolio, date) {
  let newValue = 0
  // iterate through each stock
  for (let key in portfolio) {
    if (key !== 'value') {
      // do I need to await a npm package call?
      // grab the current price of the stock
      let currPrice = await getPrice(key, date)
      // find the percentage of the new price compared to old. ex: old: $1.10 new: $1.24 -> 112.7%
      let pricePercentage = currPrice[0].close / portfolio[key].prevPrice
      // add to the value the pricePercentage * portfolios prev value * that stocks % of portfolio
      console.log(
        key,
        'STOCK TICKER',
        date,
        ' DATE ',
        currPrice[0].close,
        'PRICE',
        pricePercentage,
        'PRICE PERCENTAGE',
        portfolio.value,
        'PORTFOLIO VALUE',
        portfolio[key].percentage,
        'PORTFOLIO PERCENTAGE'
      )
      newValue += pricePercentage * portfolio.value * portfolio[key].percentage
    }
  }
  console.log(
    '----------------------------------------NEW QUARTER---------------------------------------------------'
  )
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

// this will be used in the mimicReturn to just return the total
function findStartingQuarterAndYear(yearsAgo) {}

function getDateOfReporting(year, quarter) {
  let date = `${year}`
  date += quarter === 1 ? '-03-31' : ''
  date += quarter === 2 ? '-06-30' : ''
  date += quarter === 3 ? '-09-30' : ''
  date += quarter === 4 ? '-12-31' : ''
  return date
}
function calcSAndPReturn() {}
// // if completed would allow us to use this function for 1,3, and 5 years
// function findStartingYearAndQuarter(years) {
//   let date = new Date()
//   console.log(date)
// }

// findStartingYearAndQuarter(3)
/// update part of an instance
// console.log(cody.age) // 7
// cody = await cody.update({age: 8})

// console.log(cody.age) // 8

function topTenOwnedReturn() {
  // find all of the 13f's from 5 years ago
  // create a portfolio of each 13F
  // create a tracker % obj with a ticker as key
  // go through each portfolio and add the percentage to the ticker or create the ticker and % if it hasn't been seen
  // then create a top ten obj
  // add the tickers in order of the top ten percentages from the % tracker obj
  // assume 10% of each stock in portfolio at beg
  // next quarter find new prices and re-adjust portfolio like mimic return
  // initial value used as a base to calculate the return on
  let prevValue = 10000
  // 5 years ago minus a quarter
  let year = 2016
  let quarter = 1
  let percentTracker = {}
  let topTenPortfolio = {}
  let quarterlyReturns = {}
  // need to define to have in the if statements for the first time through the loop
  let prevPortfolio = null
  let portfolio = null
  let thirteenFArr =
    'need to add to make the do while loop before defined in loop'
  do {
    // grab the thirteenF
    thirteenFArr = ThirteenF.findAll({
      where: {
        year: year,
        quarter: quarter,
      },
      include: [
        {
          model: Stock,
          as: 'Holdings',
        },
      ],
    })
    // grab the date for finding update prices
    let date = thirteenFArr[0].dateOfFiling
    // // if there is no portfolio and prevPortfolio aka the first time we just redifine the prev as the current
    // if (!portfolio) portfolio = createPortfolio(thirteenF, prevValue)
    // if (!prevPortfolio) prevPortfolio = portfolio
    for (let i = 0; i < thirteenFArr.length; i++) {
      portfolio = createPortfolio(thirteenFArr[i], prevValue)
      for (let key in portfolio) {
        if (key !== 'value') {
          if (percentTracker[key]) {
            percentTracker[key] += portfolio.key.percentage
          } else {
            percentTracker[key] = portfolio.key.percentage
          }
        }
      }
    }
    // find the new value of the prevPortfolio, should be the same first time
    let newValue = findInvestmentPortfolioNewValue(prevPortfolio, date)
    // create portfolio of the thirteenF with the previous or starting value
    portfolio = createPortfolio(thirteenFArr, newValue)
    // grab the value of the previous portfolio to the new value of the previous portfolio
    prevValue = prevPortfolio.value
    // finding the quarterlyReturn incase we would like to use later for graphing
    let quarterlyReturn = (newValue / prevValue) * 100
    quarterlyReturns[`${year}Q${quarter}`] = quarterlyReturn
    // redifine the prevPortfolio as the current portfolio for the next time around
    prevPortfolio = portfolio
    // get the next quarter
    ;({year, quarter} = getNextYearAndQuarter(year, quarter))
    // find the next 13F
  } while (thirteenFArr)
  let totalReturn = (prevPortfolio.value / 10000) * 100
  // will be in percent
  return {totalReturn, quarterlyReturns}
}

// eslint-disable-line no-irregular-whitespace
async function getBeta(ticker) {
  const URI = `https://api.newtonanalytics.com/stock-beta/?ticker=${ticker}&index=^GSPC&interval=1mo​&observations=36` // eslint-disable-line no-irregular-whitespace
  const encodedURI = encodeURI(URI)
  const {data} = await axios.get(encodedURI)
  console.log(data)
  return data.data
}
async function fundRisk(thirteenFId) {
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
}

// function createTopTenPortfolio

module.exports = {
  getTicker,
  getPrice,
  findQuarter,
  getBeta,
  calcMimicReturn,
  fundRisk,
}
