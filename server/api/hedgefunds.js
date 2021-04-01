const router = require('express').Router()
const {HedgeFund, ThirteenF, Stock} = require('../db/models')
module.exports = router

router.get('/', async (req, res, next) => {
  try {
    const allHedgefunds = await HedgeFund.findAll({
      include: ThirteenF,
      order: [[ThirteenF, 'dateOfFiling', 'DESC']],
    })
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
          include: [Stock],
        },
      ],
      order: [[ThirteenF, 'dateOfFiling', 'DESC']],
    })

    // console.log('SINGLE HEDGE API———', singleHedgeFund.thirteenFs)

    res.json(singleHedgeFund)
  } catch (err) {
    next(err)
  }
})
