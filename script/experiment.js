const axios = require('axios')
const {OPEN_FIJI_KEY} = require('../secrets')

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

  console.log('CUSIP ARR——————', cusipArray)

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

    console.log('DATA FROM IN GET TICKER——————', data)

    return data
  } catch (error) {
    console.error(error)
  }
}

function breakIntoChunks(array) {
  const outerArray = []

  if (array.length < 101) {
    const innerArray = []
    while (array.length) {
      innerArray.push(array.pop())
    }
    outerArray.push(innerArray)
  } else {
    while (array.length) {
      const innerArray = []
      let counter = 0
      while (counter < 100 && array.length) {
        innerArray.push(array.pop())
        counter++
      }
      outerArray.push(innerArray)
    }
  }

  return outerArray
}

module.exports = {
  getTickers,
  breakIntoChunks,
}
