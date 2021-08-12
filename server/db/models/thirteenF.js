const Sequelize = require('sequelize')
const db = require('../db')

const ThirteenF = db.define('thirteenF', {
  dateOfFiling: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      isDate: true,
    },
  },
  year: {
    type: Sequelize.INTEGER,
  },
  quarter: {
    type: Sequelize.INTEGER,
    validate: {
      min: 1,
      max: 4,
    },
  },
  portfolioValue: {
    type: Sequelize.BIGINT,
  },
  quarterlyValue: {
    type: Sequelize.FLOAT,
  },
  topTenQuarterlyValue: {
    type: Sequelize.FLOAT,
  },
  bottomTenQuarterlyValue: {
    type: Sequelize.FLOAT,
  },
  spValue: {
    type: Sequelize.FLOAT,
  },
  thirteenFBeta: {
    type: Sequelize.FLOAT,
  },
  numberOfStocks: {
    type: Sequelize.INTEGER,
  },
})

module.exports = ThirteenF
