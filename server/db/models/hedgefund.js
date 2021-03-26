const Sequelize = require('sequelize')
const db = require('../db')

const HedgeFund = db.define('hedgeFund', {
  name: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  yearOneReturn: {
    type: Sequelize.FLOAT,
    allowNull: true,
  },
  yearThreeReturn: {
    type: Sequelize.FLOAT,
    allowNull: true,
  },
  yearFiveReturn: {
    type: Sequelize.FLOAT,
    allowNull: true,
  },
})

module.exports = HedgeFund
