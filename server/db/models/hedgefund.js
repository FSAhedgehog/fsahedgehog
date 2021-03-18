const Sequelize = require('sequelize')
const db = require('../db')

const HedgeFund = db.define('hedgeFund ', {
  name: {
    type: Sequelize.STRING,
    allowNull: false
  },
  yearOneReturn: {
    type: Sequelize.INTEGER,
    allowNull: true,
  },
  yearThreeReturn: {
    type: Sequelize.INTEGER,
    allowNull: true,

  },
  yearFiveReturn: {
    type: Sequelize.INTEGER,
    allowNull: true,
  },
})

export default HedgeFund
