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
    return data[0].data[0].ticker
  } catch (error) {
    console.log('oopsie!')
  }
}
function addDayToDate(date) {
  let nextDate = new Date(date)
  nextDate.setDate(nextDate.getDate() + 1)
  return nextDate
}

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
        console.log('CANNOT GET THE PRICE OF THE TICKER ', ticker)
      } else {
        const price = quotes[0] ? quotes[0].close : null
        return price
      }
    }
  )
}

async function calcMimicReturn(hedgeFundId, year, quarter, startingValue) {
  let prevValue = startingValue
  let quarterlyValues = {}
  let prevPortfolio = null
  let portfolio = null
  let thirteenF = 'need to add to make the do while loop before defined in loop'
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
    console.log(
      '<------------------------------NEW QUARTER----------------------------------->'
    )
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
    console.log(
      'FINDING THE NEW PRICE OF ',
      stock.ticker,
      ' WHICH WAS ',
      stock.price,
      'ON ',
      thirteenF.dateOfFiling
    )
  }
  portfolio.value = value
  return portfolio
}

async function findInvestmentPortfolioNewValue(portfolio, date) {
  let newValue = 0
  for (let key in portfolio) {
    if (key !== 'value') {
      let currPrice = await getPrice(key, date)
      let finalPrice
      currPrice.length
        ? (finalPrice = currPrice[0].close)
        : (finalPrice = portfolio[key].prevPrice)
      let pricePercentage = finalPrice / portfolio[key].prevPrice
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

function getBeta(ticker) {
  return yahooFinance.quote(
    {
      symbol: ticker,
      modules: ['summaryDetail'],
    },
    function (err, quotes) {
      if (err) {
        console.log(err)
      } else {
        let beta = quotes.summaryDetail.beta
        return beta
      }
    }
  )
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

module.exports = {
  getTicker,
  getPrice,
  findQuarter,
  getBeta,
  calcMimicReturn,
  fundRisk,
}
