const yahooFinance = require('yahoo-finance')
const axios = require('axios')
const {ThirteenF, Stock} = require('../server/db/models')
require('dotenv').config()
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

async function getCurrentYearAndQuarterForEveryone() {
  try {
    const thirteenFs = await ThirteenF.findAll({
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

/*eslint max-statements: ["error", 70]*/
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
    let topTenQuarterlyValues = {}
    let bottomTenQuarterlyValues = {}
    let prevPortfolio = null
    let portfolio = null
    let topTenPortfolio = null
    let topTenPrevPortfolio = null
    let bottomTenPortfolio = null
    let bottomTenPrevPortfolio = null
    let thirteenF =
      'need to add to make the do while loop before defined in loop'
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
      if (!portfolio) {
        portfolio = createPortfolio(thirteenF, prevValue)
        topTenPortfolio = createTenPortfolio(thirteenF, prevValue, 'top')
        bottomTenPortfolio = createTenPortfolio(thirteenF, prevValue)
      }
      if (!prevPortfolio) {
        prevPortfolio = portfolio
        topTenPrevPortfolio = topTenPortfolio
        bottomTenPrevPortfolio = bottomTenPortfolio
      }
      let newValue =
        thirteenF &&
        Object.keys(prevPortfolio).filter((key) => key !== 'value').length !== 0
          ? await findInvestmentPortfolioNewValue(prevPortfolio, date)
          : prevPortfolio.value
      let topTenNewValue =
        thirteenF &&
        Object.keys(topTenPrevPortfolio).filter((key) => key !== 'value')
          .length !== 0
          ? await findInvestmentPortfolioNewValue(topTenPrevPortfolio, date)
          : topTenPrevPortfolio.value
      let bottomTenNewValue =
        thirteenF &&
        Object.keys(bottomTenPrevPortfolio).filter((key) => key !== 'value')
          .length !== 0
          ? await findInvestmentPortfolioNewValue(bottomTenPrevPortfolio, date)
          : bottomTenPrevPortfolio.value
      if (thirteenF) {
        portfolio = createPortfolio(thirteenF, newValue)
        topTenPortfolio = createTenPortfolio(thirteenF, topTenNewValue, 'top')
        bottomTenPortfolio = createTenPortfolio(thirteenF, bottomTenNewValue)
      }
      if (thirteenF) {
        prevValue = prevPortfolio.value
        topTenPrevPortfolio = topTenPrevPortfolio.value
        bottomTenPrevPortfolio = bottomTenPrevPortfolio.value
      }
      let quarterlyValue = newValue
      let topTenQuarterlyValue = topTenNewValue
      let bottomTenQuarterlyValue = bottomTenNewValue
      quarterlyValues[`${year}Q${quarter}`] = quarterlyValue
      topTenQuarterlyValues[`${year}Q${quarter}`] = topTenQuarterlyValue
      bottomTenQuarterlyValues[`${year}Q${quarter}`] = bottomTenQuarterlyValue
      if (thirteenF) {
        prevPortfolio = portfolio
        topTenPrevPortfolio = topTenPortfolio
        bottomTenPrevPortfolio = bottomTenPortfolio
      }
      ;({year, quarter} = getNextYearAndQuarter(year, quarter))
    } while (isYearAndQuarterLesser(year, quarter, curYear, curQuarter))

    return [quarterlyValues, topTenQuarterlyValues, bottomTenQuarterlyValues]
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

// create top 10 portfolio
function createTenPortfolio(thirteenF, value, end) {
  let tempPortfolio = {}
  let finalPortfolio = {}
  let percentageArr = []
  let stockCount = thirteenF.stocks.length
  if (thirteenF) {
    for (let i = 0; i < stockCount; i++) {
      const stock = thirteenF.stocks[i]
      percentageArr.push(stock.percentageOfPortfolio)
    }

    if (end === 'top') {
      percentageArr = percentageArr.sort((a, b) => b - a).slice(0, 10)
    } else {
      percentageArr = percentageArr.sort((a, b) => a - b).slice(0, 10)
    }
    for (let i = 0; i < stockCount; i++) {
      const stock = thirteenF.stocks[i]
      tempPortfolio[stock.ticker] = {
        percentage: stock.percentageOfPortfolio,
        prevPrice: stock.price,
      }
    }
    const totalPercentage = percentageArr.reduce((a, b) => a + b, 0)
    const multiplier = 1 / totalPercentage
    for (let i = 0; i < stockCount; i++) {
      const stock = thirteenF.stocks[i]
      if (percentageArr.includes(stock.percentageOfPortfolio)) {
        finalPortfolio[stock.ticker] = {
          percentage: stock.percentageOfPortfolio * multiplier,
          prevPrice: stock.price,
        }
      }
    }
  }

  finalPortfolio.value = value
  return finalPortfolio
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
    console.log(tickers.length)
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
    console.log(response, 'IN HERE')
    return response
  } catch (err) {
    console.error(err)
  }
  // try {
  //   //MAX 44 at a time!!!! maybe I should break into chunks of 40
  //   let batchSize = 45
  //   let times = Math.ceil(tickers.length / batchSize)
  //   let location = 0
  //   let final = {}
  //   for (let i = 0; i < times; i++) {
  //     let tickersToSend = tickers.slice(location, location + batchSize)
  //     let response = await yahooFinance.quote({
  //       symbols: tickersToSend,
  //       modules: ['summaryDetail'],
  //     })
  //     location += batchSize
  //     final = Object.assign(final, response)
  //   }
  //   for (let key in final) {
  //     if (final.hasOwnProperty(key)) {
  //       final[key].summaryDetail.beta
  //         ? (final[key] = final[key].summaryDetail.beta)
  //         : (final[key] = null)
  //     }
  //   }
  //   return final
  // } catch (err) {
  //   console.error(err)
  // }
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
  getCurrentYearAndQuarter,
  getCurrentYearAndQuarterForEveryone,
}
