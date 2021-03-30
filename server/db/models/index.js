const User = require('./user')
const Stock = require('./stock')
const HedgeFund = require('./hedgeFund')
const ThirteenF = require('./thirteenF')
/**
 * If we had any associations to make, this would be a great place to put them!
 * ex. if we had another model called BlogPost, we might say:
 *
 *    BlogPost.belongsTo(User)
 */

/**
 * We'll export all of our models here, so that any time a module needs a model,
 * we can just require it from 'db/models'
 * for example, we can say: const {User} = require('../db/models')
 * instead of: const User = require('../db/models/user')
 *
 *
 */
ThirteenF.belongsTo(HedgeFund)
HedgeFund.hasMany(ThirteenF)
Stock.belongsTo(ThirteenF)
ThirteenF.hasMany(Stock)
Stock.belongsTo(HedgeFund)
HedgeFund.hasMany(Stock)

module.exports = {
  User,
  Stock,
  HedgeFund,
  ThirteenF,
}
