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
  yearTenReturn: {
    type: Sequelize.FLOAT,
    allowNull: true,
  },
  yearFifteenReturn: {
    type: Sequelize.FLOAT,
    allowNull: true,
  },
  yearTwentyReturn: {
    type: Sequelize.FLOAT,
    allowNull: true,
  },
  maxReturn: {
    type: Sequelize.STRING,
    allowNull: true,
  },
})

module.exports = HedgeFund
