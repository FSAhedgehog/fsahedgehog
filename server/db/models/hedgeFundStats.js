const Sequelize = require('sequelize')
const db = require('../db')

const HedgeFundStats = db.define('hedgeFundStats', {
  avgOneYearReturn: {
    type: Sequelize.FLOAT,
    allowNull: true,
  },
  avgThreeYearReturn: {
    type: Sequelize.FLOAT,
    allowNull: true,
  },
  avgFiveYearReturn: {
    type: Sequelize.FLOAT,
    allowNull: true,
  },
  avgMaxReturn: {
    type: Sequelize.FLOAT,
    allowNull: true,
  },
  avgPortfolioAmount: {
    type: Sequelize.BIGINT,
    allowNull: true,
  },
  avgNumberOfStocks: {
    type: Sequelize.INTEGER,
    allowNull: true,
  },
  avgBeta: {
    type: Sequelize.FLOAT,
    allowNull: true,
  },
})

module.exports = HedgeFundStats
