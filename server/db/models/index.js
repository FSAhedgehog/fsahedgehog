const Stock = require('./stock')
const HedgeFund = require('./hedgefund')
const ThirteenF = require('./thirteenF')
const StockStats = require('./stockStats')
const HedgeFundStats = require('./hedgeFundStats')

ThirteenF.belongsTo(HedgeFund)
HedgeFund.hasMany(ThirteenF)
Stock.belongsTo(ThirteenF)
ThirteenF.hasMany(Stock)
Stock.belongsTo(HedgeFund)
HedgeFund.hasMany(Stock)

module.exports = {
  Stock,
  HedgeFund,
  ThirteenF,
  StockStats,
  HedgeFundStats,
}
