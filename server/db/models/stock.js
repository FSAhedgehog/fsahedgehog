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
