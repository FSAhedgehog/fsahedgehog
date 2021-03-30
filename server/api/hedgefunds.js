const router = require('express').Router()
const {HedgeFund, ThirteenF, Stock} = require('../db/models')
module.exports = router

router.get('/', async (req, res, next) => {
  try {
    const allHedgeFunds = await HedgeFund.findAll()
    res.json(allHedgeFunds)
  } catch (err) {
    next(err)
  }
})

router.get('/:id', async (req, res, next) => {
  try {
    const singleHedgeFund = await HedgeFund.findOne({
      where: {
        id: req.params.id,
      },
      include: [
        {
          model: ThirteenF,
          include: [Stock],
        },
      ],
    })
    singleHedgeFund.thirteenFs.sort((a, b) => b.dateOfFiling - a.dateOfFiling)
    res.json(singleHedgeFund)
  } catch (err) {
    next(err)
  }
})
