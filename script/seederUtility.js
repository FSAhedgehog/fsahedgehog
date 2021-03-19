const yahooFinance = require('yahoo-finance')
const axios = require('axios')
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
// console.log(getTicker("G5480U104"))
async function print() {
  console.log(await getTicker('G5480U104'))
}
print()
// const Symbol = getTicker("G5480U104")
// console.log(Symbol, "CONSOLE LOGGING SYMBOL")
function addDayToDate(date) {
  let nextDate = new Date(date)
  nextDate.setDate(nextDate.getDate() + 1)
  return nextDate
}
async function getPrice(ticker, date) {
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
