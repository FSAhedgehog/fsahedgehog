const yahooFinance = require('yahoo-finance')
const axios = require('axios')
const {ThirteenF, Stock} = require('../server/db/models')
// const {getCurrentYearAndQuarter} = require('./seeder')
require('dotenv').config()
// console.log(getCurrentYearAndQuarter, 'CURRENT YEAR')
const Sequelize = require('sequelize')
const Op = Sequelize.Op
const OPEN_FIJI_KEY = process.env.OPEN_FIJI_KEY

function findQuarterOfReport(month) {
  month = Number(month)
  if (month < 3) {
    return 4
  } else if (month > 3 && month < 6) {
    return 1
  } else if (month > 6 && month < 9) {
    return 2
  } else {
    return 3
  }
}

function findYearOfReport(yearFiled, quarterReported) {
  if (quarterReported === 4) return yearFiled - 1
  return yearFiled
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
    const response = await yahooFinance.historical({
      symbols: tickers,
      from: date.slice(0, 10),
      to: addDayToDate(date),
      period: 'd',
    })
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

async function getNewestYearAndQuarter(hedgeFundId) {
  try {
    const thirteenFs = await ThirteenF.findAll({
      where: {
        hedgeFundId: hedgeFundId,
      },
      order: [['dateOfFiling', 'DESC']],
    })
    const newest13F = thirteenFs[0]

    return [newest13F.year, newest13F.quarter]
  } catch (err) {
    console.error(err)
  }
}

function isYearAndQuarterLesser(year, quarter, curYear, curQuarter) {
  if (year > curYear) return false
  if (year === curYear && quarter > curQuarter) return false
  return true
}

async function findNewest13FWithQuarterlyValue(hedgeFundId) {
  const thirteenFWithQuarterlyValues = await ThirteenF.findAll({
    where: {
      hedgeFundId: hedgeFundId,
      quarterlyValue: {
        [Op.ne]: null,
      },
    },
    order: [['dateOfFiling', 'DESC']],
  })

  if (thirteenFWithQuarterlyValues) {
    return thirteenFWithQuarterlyValues[0]
  }
  return null
}

async function calcMimicReturn(hedgeFundId, startingValue) {
  try {
    const [curYear, curQuarter] = await getCurrentYearAndQuarter(hedgeFundId)
    let mostRecent13FQuarterlyValue = await findNewest13FWithQuarterlyValue(
      hedgeFundId
    )
    let year
    let quarter
    let prevValue
    if (mostRecent13FQuarterlyValue) {
      if (
        mostRecent13FQuarterlyValue.year !== curYear ||
        mostRecent13FQuarterlyValue.quarter !== curQuarter
      ) {
        prevValue = mostRecent13FQuarterlyValue.quarterlyValue
        year = mostRecent13FQuarterlyValue.year
        quarter = mostRecent13FQuarterlyValue.quarter
      } else {
        year = curYear
        quarter = curQuarter
      }
    } else {
      prevValue = startingValue
      ;[year, quarter] = await getOldestYearAndQuarter(hedgeFundId)
    }
    let quarterlyValues = {}
    let prevPortfolio = null
    let portfolio = null
    let thirteenF =
      'need to add to make the do while loop before defined in loop'
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
      let date = thirteenF ? await thirteenF.dataValues.dateOfFiling : null
      if (!portfolio) portfolio = createPortfolio(thirteenF, prevValue)
      if (!prevPortfolio) prevPortfolio = portfolio
      let newValue =
        thirteenF &&
        Object.keys(prevPortfolio).filter((key) => key !== 'value').length !== 0
          ? await findInvestmentPortfolioNewValue(prevPortfolio, date)
          : prevPortfolio.value
      console.log(newValue, 'NEW VALUE')
      if (thirteenF) portfolio = createPortfolio(thirteenF, newValue)
      if (thirteenF) prevValue = prevPortfolio.value
      let quarterlyValue = newValue
      quarterlyValues[`${year}Q${quarter}`] = quarterlyValue
      if (thirteenF) prevPortfolio = portfolio
      ;({year, quarter} = getNextYearAndQuarter(year, quarter))
    } while (isYearAndQuarterLesser(year, quarter, curYear, curQuarter))

    return quarterlyValues
  } catch (error) {
    console.error(error)
  }
}

function createPortfolio(thirteenF, value) {
  let portfolio = {}
  if (thirteenF) {
    for (let i = 0; i < thirteenF.stocks.length; i++) {
      const stock = thirteenF.stocks[i]
      portfolio[stock.ticker] = {
        percentage: stock.percentageOfPortfolio,
        prevPrice: stock.price,
      }
    }
  }
  portfolio.value = value
  return portfolio
}

async function findInvestmentPortfolioNewValue(portfolio, date) {
  try {
    let newValue = 0
    const tickersArr = Object.keys(portfolio).filter((key) => key !== 'value')

    const responseObj = await getPrice(tickersArr, date)

    for (let key in portfolio) {
      if (key !== 'value') {
        const currPrice = responseObj[key] || portfolio[key].prevPrice
        const pricePercentage = currPrice / portfolio[key].prevPrice
        newValue +=
          pricePercentage * portfolio.value * portfolio[key].percentage
      }
    }
    return newValue
  } catch (err) {
    console.error(err)
  }
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

async function getBeta(tickers) {
  try {
    const response = await yahooFinance.quote({
      symbols: tickers,
      modules: ['summaryDetail'],
    })

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
      ? data
          .map((stock) => {
            return stock.percentageOfPortfolio * (stock.beta ? stock.beta : 1)
          })
          .reduce((total, curVal) => {
            return total + curVal
          }, 0)
      : null
    return thirteenFBeta
  } catch (error) {
    console.error(error)
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
  findQuarterOfReport,
  findYearOfReport,
  getBeta,
  calcMimicReturn,
  fundRisk,
  getOldestYearAndQuarter,
  breakIntoChunks,
}
