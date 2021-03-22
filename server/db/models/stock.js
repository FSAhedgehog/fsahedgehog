const Sequelize = require('sequelize')
const db = require('../db')
const {convertToDollars, convertToPennies} = require('./utility')
const {getTicker} = require('../../../script/seederUtility')

const Stock = db.define('stock', {
  cusip: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  ticker: {
    type: Sequelize.STRING,
  },
  qtyOfSharesHeld: {
    type: Sequelize.BIGINT,
    allowNull: false,
  },
  price: {
    type: Sequelize.BIGINT,
    allowNull: true,
    get() {
      return convertToDollars(this.getDataValue('price'))
    },
    set(value) {
      this.setDataValue('price', convertToPennies(value))
    },
  },
  totalValue: {
    type: Sequelize.BIGINT,
    get() {
      return convertToDollars(this.getDataValue('totalValue'))
    },
    set(value) {
      this.setDataValue('totalValue', convertToPennies(value))
    },
  },
  percentageOfPortfolio: {
    type: Sequelize.INTEGER,
    allowNull: true,
  },
})

module.exports = Stock

//CUSIP HOOK
//if string is less than 9 characters
Stock.beforeCreate((stock) => {
  if (stock.cusip.length < 9) {
    stock.cusip = '0' + stock.cusip
  }
})

// before update
Stock.beforeUpdate((stock) => {
  if (stock.cusip.length < 9) {
    stock.cusip = '0' + stock.cusip
  }
})

// Stock.beforeCreate(async (stock) => {
//   const ticker = await setInterval(() => getTicker(stock.cusip), 300)
//   stock.ticker = ticker
// })

// Stock.beforeUpdate(async (stock) => {
//   const ticker = await getTicker(stock.cusip)
//   stock.ticker = ticker
// })
