const {ThirteenF, HedgeFund} = require('../server/db/models')
const {getPrice} = require('./seederUtility')

const STARTING_VALUE = 10000

async function calculateSPValue() {
  const hedgeFunds = await HedgeFund.findAll({
    include: ThirteenF,
    order: [[ThirteenF, 'dateOfFiling', 'ASC']],
  })

  console.log(hedgeFunds[0].thirteenFs)

  hedgeFunds.forEach(async (hedgeFund) => {
    const thirteenFs = hedgeFund.thirteenFs
    const first13F = thirteenFs[0]
    first13F.spValue = Math.round(STARTING_VALUE)
    await first13F.save()
    let initialPrice = await getPrice('^GSPC', first13F.dateOfFiling)
    initialPrice = initialPrice[0].close
    console.log('INITIAL PRICE——————', initialPrice)
    const startingShares = STARTING_VALUE / initialPrice

    for (let i = 1; i < thirteenFs.length; i++) {
      const current13F = thirteenFs[i]
      console.log('13F ID—————', current13F.id)
      let currentPrice = await getPrice('^GSPC', current13F.dateOfFiling)
      currentPrice = currentPrice[0].close
      const currentValue = Math.round(startingShares * currentPrice)
      current13F.spValue = currentValue
      await current13F.save()
    }
  })
}

calculateSPValue()
