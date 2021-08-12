const axios = require('axios')
const db = require('../server/db')
const {
  HedgeFund,
  ThirteenF,
  Stock,
  StockStats,
  hedgeFundStats,
} = require('../server/db/models')
const Sequelize = require('sequelize')
const Op = Sequelize.Op
const {getCurrentYearAndQuarterForEveryone} = require('./seederUtility')
