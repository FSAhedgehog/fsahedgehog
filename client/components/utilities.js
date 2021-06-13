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
  }
}

export function sortedStockCount(stocks) {
  let c = stocks.sort((a, b) => Number(b.count) - Number(a.count))
  return c
}

export function sortedStockPercentage(stocks) {
  return stocks.sort((a, b) => b.totalPercentage - a.totalPercentage)
}

export function sortedStockInvested(stocks) {
  return stocks.sort((a, b) => b.totalInvested - a.totalInvested)
}

//.filter((stock, i) => i < 10)
