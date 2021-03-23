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
    const singleHedgeFund = await HedgeFund.findOne({
      where: {
        id: req.params.id,
      },
      include: [
        {
          model: ThirteenF,
          order: ['dateOfFiling', 'DESC'],
          include: [Stock],
        },
      ],
    })
    res.json(
      singleHedgeFund.thirteenFs.sort(
        (a, b) => b.dateOfFiling - a.dateOfFiling
      )[0]
    )
  } catch (err) {
    next(err)
  }
})
