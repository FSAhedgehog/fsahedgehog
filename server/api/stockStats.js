const router = require('express').Router()
const {HedgeFund, ThirteenF, Stock, StockStats} = require('../db/models')
module.exports = router

router.get('/', async (req, res, next) => {
  try {
    const allStockStats = await StockStats.findAll()
    res.json(allStockStats)
  } catch (err) {
    next(err)
  }
})

// router.get('/:id', async (req, res, next) => {
//   try {
//     const singleHedgeFund = await HedgeFund.findOne({
//       where: {
//         id: req.params.id,
//       },
//       include: [
//         {
//           model: ThirteenF,
//           include: [Stock],
//         },
//       ],
//       order: [[ThirteenF, 'dateOfFiling', 'DESC']],
//     })

//     res.json(singleHedgeFund)
//   } catch (err) {
//     next(err)
//   }
// })
