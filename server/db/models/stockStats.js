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
  countRank: {
    type: Sequelize.INTEGER,
    allowNull: true,
  },
  totalInvested: {
    type: Sequelize.STRING,
  },
  totalInvestedRank: {
    type: Sequelize.INTEGER,
    allowNull: true,
  },
  totalPercentage: {
    type: Sequelize.FLOAT,
    allowNull: true,
  },
  totalPercentageRank: {
    type: Sequelize.INTEGER,
    allowNull: true,
  },
  beta: {
    type: Sequelize.FLOAT,
    allowNull: true,
  },
})

module.exports = stockStats
