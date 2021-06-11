const Sequelize = require('sequelize')
const db = require('../db')

const stockStats = db.define('stockStats', {
  cusip: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  ticker: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  count: {
    type: Sequelize.BIGINT,
    allowNull: true,
  },
  totalInvested: {
    type: Sequelize.STRING,
  },
  totalPercentage: {
    type: Sequelize.FLOAT,
    allowNull: true,
  },
  beta: {
    type: Sequelize.FLOAT,
    allowNull: true,
  },
  company: {
    type: Sequelize.STRING,
    allowNull: true,
  },
})

module.exports = stockStats
