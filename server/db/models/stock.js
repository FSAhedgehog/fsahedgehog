const Sequelize = require('sequelize')
const db = require('../db')
const { convertToDollars, convertToPennies } = require('./utility')

const Stocks = db.define('stocks ', {
  ticker: {
    type: Sequelize.STRING,
    allowNull: false
  },
  qtyOfSharesHeld: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  price: {
    type: Sequelize.INTEGER,
    allowNull: false,
    get(){
      return convertToDollars(this.getDataValue('price'))
    },
    set(value){
      this.setDataValue('price',convertToPennies(value))
      }
  },
  percentageOfPortfolio: {
    type: Sequelize.INTEGER,
    allowNull: true,
  },
})

export default Stocks
