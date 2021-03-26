const yahooFinance = require('yahoo-finance')

function getBeta(ticker) {
  return yahooFinance.quote(
    {
      symbol: ticker,
      modules: ['summaryDetail'],
    },
    function (err, quotes) {
      if (err) {
        // console.log(err)
      } else {
        let beta = quotes.summaryDetail.beta
        // console.log("THIS IS BETA", beta)
        return beta
      }
    }
  )
}
async function test() {
  for (let i = 0; i < 1000; i++) {
    const beta = await getBeta('VRSK')
    console.log(beta.summaryDetail.beta)
    if (!beta.summaryDetail) break
  }
}

test()
