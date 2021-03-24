const Sequelize = require('sequelize')
const db = require('../db')

const ThirteenF = db.define('thirteenF', {
  dateOfFiling: {
    type: Sequelize.DATE,
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
    validate: {
      min: 1,
    },
  },
  quarterlyValue: {
    type: Sequelize.INTEGER,
  },
})

module.exports = ThirteenF
