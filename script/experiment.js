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
  breakIntoChunks,
}
