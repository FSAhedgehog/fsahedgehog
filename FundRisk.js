async function fundRisk(thirteenFId) {
  //get all stocks in most recent 13f with value and percentage of portfolio
  //will return  cusip, ticker, gtyofshares,price, totalvalue,percentage of portfolio
  const {data} = await Stock.findAll({
    where: {
      thirteenFId: thirteenFId,
    },
  })

  const getBeta = await axios.post()
}

module.exports = {
  fundRisk,
}
