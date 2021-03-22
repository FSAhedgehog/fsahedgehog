const router = require('express').Router()
const {HedgeFund, ThirteenF, Stock} = require('../db/models')
module.exports = router

router.get('/', async (req, res, next) => {
  try {
    const allHedgefunds = await HedgeFund.findAll()
    res.json(allHedgefunds)
  } catch (err) {
    next(err)
  }
})

router.get('/:id', async (req, res, next) => {
  try {
    const singleHedgefund = await HedgeFund.findOne({
      where: {
        id: req.params.id,
      },
      include: [ThirteenF, Stock],
    })
    res.json(singleHedgefund)
  } catch (err) {
    next(err)
  }
})
