const yahooFinance = require('yahoo-finance')
const axios = require('axios')
const {HedgeFund, ThirteenF, Stock} = require('../server/db/models')

function isCharacterALetter(char) {
  return /[A-Z]/.test(char)
}
async function getTicker(cusip) {
  let postData
  if (isCharacterALetter(cusip[0])) {
    postData = [{idType: 'ID_CINS', idValue: cusip}]
  } else {
    postData = [{idType: 'ID_CUSIP', idValue: cusip}]
  }
  let axiosConfig = {
    headers: {
      'Content-Type': 'application/json',
      'X-OPENFIGI-APIKEY': '51b9d8a0-a4e7-4b79-94c3-14456ad13a62',
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
    console.log(error)
  }
}
// needs to be passed in double quotation string
function addDayToDate(date) {
  let nextDate = new Date(date)
  nextDate.setDate(nextDate.getDate() + 1)
  return nextDate
}

function getPrice(ticker, date) {
  return yahooFinance.historical(
    {
      symbol: ticker,
      from: date,
      to: addDayToDate(date),
      period: 'd',
    },
    function (err, quotes) {
      if (err) {
        throw err
      }
      console.log(quotes[0].close)
      return quotes[0].close
    }
  )
}
// await getPrice('G5480U104', '2021-02-12T16:21:25-05:00')

// need to figure out how we could add the stocks price to the database when it has been sold and is not included in the portfolio
// one idea is to still add every stocks and it's price to the stock database from the previous 13F - might need to have date on the stock table
// the other is query inside of this function - one downfall of this is the we do not have the stock price data in our database and this function will take time to run instead of just the seed taking time to run
// could be nice for potential data visualizations on the holdings of the mimic portfolio - for example the chart could show what you bought and sold each quarter and the prices of those transactions to give a complete picture of the investment's actions

// scratch that seems hard to add previous stock data to 13f and would be confusing
// seems like if we were to ever want to show the investment process with the prices we could just add a bunch of stock price data to our database and work with that instead

// we want to be able to calculate the gain or loss each quarter for our charts

// need grab the 20th last 13F- could be dynamic so we can use this when 13F's update
// query the stocks for that 13F - need to have date price on stocks that were completely sold aka date on stock table?
// create a portfolio with a 10000 and put cash as a percentage of each stock in an obj
// go to the next 13F - need to get stock prices of everystock in the basket that next date
// calculate the investment value
// redistribute the portfolio with new stocks
// and so and so forth
// at the end divide the total value of the investment by the original

// need to make sure to calculate new investment value before writing over it
function calcMimicReturn(hedgeFundId, years) {
  // initial value used as a base to calculate the return on
  let value = 10000
  // 5 years ago minus a quarter
  let year = 2015
  let quarter = 4
  let quarterlyReturns = {}
  // find the first relevant 13F
  let thirteenF = ThirteenF.findOne({
    where: {
      year: year,
      quarter: quarter,
      hedgeFundId: hedgeFundId,
    },
    include: [
      {
        model: Stock,
        as: 'Holdings',
      },
    ],
  })

  do {
    let date = thirteenF.dateOfFiling
    let portfolio = createPortfolio(thirteenF, value, date)
    let newValue = findInvestmentPortfolioNewValue(prevPortfolio, value, date)
    let prevPortfolio = portfolio
    portfolio.newValue = newValue
    let quarterlyReturn = (newValue / value) * 100
    portfolio.quarterlyReturn = quarterlyReturn
    // first time this should be the same because prices are the same
    value = portfolio.newValue

    quarterlyReturns[`${year}Q${quarter}`] = portfolio.quarterlyReturn
    // get the next quarter
    ;({year, quarter} = getNextYearAndQuarter(year, quarter))
    // find the next 13F
    thirteenF = ThirteenF.findOne({
      where: {
        year: year,
        quarter: quarter,
        hedgeFundId: hedgeFundId,
      },
      include: [
        {
          model: Stock,
          as: 'Holdings',
        },
      ],
    })
  } while (thirteenF)
  // will be in percent
  let totalReturn = (value / 10000) * 100
  return totalReturn
}

function createPortfolio(thirteenF, prevValue, date) {
  let portfolio = {}
  // not sure what this instance looks like
  // portfolio is used in the next 13F so using past tense "prev"
  thirteenF.holdings.forEach((stock) => {
    portfolio[stock.ticker] = {
      percentage: stock.percentageOfPortfolio,
      prevPrice: stock.price,
    }
  })
  portfolio.prevValue = prevValue
  return portfolio
}

async function findInvestmentPortfolioNewValue(portfolio, date) {
  let newValue = 0
  for (let key in portfolio) {
    if (key !== 'prevValue') {
      // do I need to await a npm package call?
      let currPrice = await getPrice(key, date)
      let priceDiff = currPrice / portfolio[key].prevPrice
      newValue +=
        priceDiff * portfolio.prevValue * portfolio[key].percentageOfPortfolio
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

function findStartingYearAndQuarter(years) {
  let date = new Date()
  console.log(date)
}

findStartingYearAndQuarter(3)
/// update part of an instance
// console.log(cody.age) // 7
// cody = await cody.update({age: 8})

// console.log(cody.age) // 8
