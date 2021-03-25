import Stock from './server/db/models/stock'

//13F-portfolio risk
async function fundRisk(thirteenFId) {
const { data } = await Stock.findAll({
where: {
  thirteenFId: thirteenFId,
    },
  })
return data.map((stock) => {
 return  stock.percentageOfPortfolio * stock.beta
}).reduce((total,curVal )=>{
  return total + curVal
})
}
module.exports = {
  fundRisk,
}
