const router = require('express').Router()
const {HedgeFundStats} = require('../db/models')
module.exports = router

router.get('/', async (req, res, next) => {
  try {
    const allHedgeStats = await HedgeFundStats.findAll()
    res.json(allHedgeStats)
  } catch (err) {
    next(err)
  }
})
