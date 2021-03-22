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
    type: Sequelize.INTEGER,
    validate: {
      min: 1,
    },
  },
})

module.exports = ThirteenF

//YEAR HOOK

ThirteenF.beforeValidate((thirteenF) => {
  thirteenF.year = Number(thirteenF.year.slice(0, 4))
})

//QUARTER HOOK
function findQuarter(date) {
  date = Number(date.slice(5, 7))
  if (date <= 2) {
    return 1
  } else if (date > 2 && date <= 5) {
    return 2
  } else if (date > 5 && date <= 8) {
    return 3
  } else {
    return 4
  }
}

ThirteenF.beforeValidate((thirteenF) => {
  thirteenF.quarter = findQuarter(thirteenF.quarter)
})
