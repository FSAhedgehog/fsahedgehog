const {HedgeFund, ThirteenF, Stock} = require('../server/db/models')
const {calcMimicReturn} = require('./seederUtility')

async function setMimicReturn(year = 2016, quarter = 1) {
  try {
    console.log('year &&&&&&&& quarter', year, quarter)
    const STARTING_VALUE = 10000

    const hedgeFunds = await HedgeFund.findAll({
      include: [
        {
          model: ThirteenF,
          include: [Stock],
        },
      ],
    })

    await hedgeFunds.forEach(async (hedgeFund) => {
      const hedgeyReturnObj = await calcMimicReturn(
        hedgeFund.id,
        year,
        quarter,
        STARTING_VALUE
      )
      hedgeFund.thirteenFs.forEach(async (thirteenF) => {
        thirteenF.quarterlyValue = Math.round(
          hedgeyReturnObj[`${thirteenF.year}Q${thirteenF.quarter}`]
        )
        await thirteenF.save()
      })
    })
  } catch (err) {
    console.error(err)
  }
}

setMimicReturn()
