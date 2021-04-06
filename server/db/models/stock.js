const Sequelize = require('sequelize')
const db = require('../db')
const {convertToDollars, convertToPennies} = require('./utility')

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
    type: Sequelize.INTEGER,
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
  },
  percentageOfPortfolio: {
    type: Sequelize.FLOAT,
    allowNull: true,
  },
  beta: {
    type: Sequelize.FLOAT,
    allowNull: true,
  },
  name: {
    type: Sequelize.TEXT,
  },
})

module.exports = Stock

//CUSIP HOOKS
Stock.beforeCreate((stock) => {
  if (stock.cusip.length === 8) {
    stock.cusip = '0' + stock.cusip
  }
})

Stock.beforeUpdate((stock) => {
  if (stock.cusip.length === 8) {
    stock.cusip = '0' + stock.cusip
  }
})
