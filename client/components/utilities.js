export function camelCase(str) {
  return str
    .split(' ')
    .map((word) => {
      word = word.toLowerCase()
      return word[0].toUpperCase() + word.slice(1)
    })
    .join(' ')
}

export function findAverageBeta(thirteenFs) {
  if (thirteenFs.length) {
    const result =
      thirteenFs.reduce((accum, element) => {
        return accum + element.thirteenFBeta
      }, 0) / thirteenFs.length
    return result
  } else {
    return 1.0
  }
}

export function findAverageReturn(hedgeFunds, years) {
  if (hedgeFunds.length) {
    let goodFunds = hedgeFunds.length
    const result =
      hedgeFunds.reduce((totalReturns, hedgeFund) => {
        if (hedgeFund[years]) {
          if (typeof hedgeFund[years] === 'string') {
            return totalReturns + Number(hedgeFund[years].slice(6))
          }
          return totalReturns + hedgeFund[years]
        } else {
          goodFunds--
          return totalReturns
        }
      }, 0) / goodFunds
    if (goodFunds === 0) return 'N/A'
    return result
  } else {
    return 1.0
  }
}

export function determineColor(number) {
  if (number > 1.1) {
    return '#DABFFF'
  } else if (number < 0.9) {
    return '#8affc1'
  } else {
    return 'rgb(157, 97, 255)'
  }
}

export function sortHedgeFunds(hedgeFunds, sort) {
  if (sort === 'none') {
    return hedgeFunds
  } else if (sort === '1Year') {
    return hedgeFunds.sort((a, b) => a.yearOneReturn - b.yearOneReturn)
  } else if (sort === '3Year') {
    return hedgeFunds.sort((a, b) => a.yearThreeReturn - b.yearThreeReturn)
  } else if (sort === '5Year') {
    return hedgeFunds.sort((a, b) => a.yearFiveReturn - b.yearFiveReturn)
  } else if (sort === 'max') {
    return hedgeFunds.sort(
      (a, b) => Number(a.maxReturn.slice(6)) - Number(b.maxReturn.slice(6))
    )
  }
}

export function sortedStockCount(stocks) {
  let c = stocks.sort((a, b) => Number(b.count) - Number(a.count))
  return c
}

export function sortedStockPercentage(stocks) {
  console.log(stocks, 'BEFORE')
  stocks = stocks.sort((a, b) => b.totalPercentage - a.totalPercentage)
  console.log(stocks, 'AFTER')
  return stocks
}

export function sortedStockInvested(stocks) {
  return stocks.sort((a, b) => b.totalInvested - a.totalInvested)
}

//.filter((stock, i) => i < 10)
