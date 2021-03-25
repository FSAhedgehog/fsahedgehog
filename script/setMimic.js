// const setMimicReturn = require('./seeder')
// setMimicReturn()
const {HedgeFund, ThirteenF, Stock} = require('../server/db/models')
const {calcMimicReturn} = require('./seederUtility')

async function setMimicReturn() {
  const hedgeFunds = await HedgeFund.findAll({
    include: [
      {
        model: ThirteenF,
        include: [Stock],
      },
    ],
  })
  await hedgeFunds.forEach(async (hedgeFund) => {
    const hedgeyReturnObj = await calcMimicReturn(hedgeFund.id)
    hedgeFund.thirteenFs.forEach(async (thirteenF) => {
      console.log(
        Math.round(
          parseFloat(hedgeyReturnObj[`${thirteenF.year}Q${thirteenF.quarter}`]),
          'ROUNDED'
        )
      )
      // thirteenF.quarterlyValue = Math.round(
      //   parseFloat(hedgeyReturnObj[`${thirteenF.year}Q${thirteenF.quarter}`])
      // )
      thirteenF.quarterlyValue = Math.round(
        hedgeyReturnObj[`${thirteenF.year}Q${thirteenF.quarter}`]
      )
      // console.log(
      //   hedgeyReturnObj[`${thirteenF.year}Q${thirteenF.quarter}`],
      //   'IN THE SETMIMIC'
      // )
      await thirteenF.save()
    })
  })
}

setMimicReturn()
