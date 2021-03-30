import React from 'react'
import {VictoryBar, VictoryChart, VictoryAxis} from 'victory'
import {findAverageBeta, camelCase} from './utilities'

export const BarChart = (props) => {
  const latest13Fs = props.hedgeFunds.map(
    (hedgeFund) => hedgeFund.thirteenFs[0]
  )

  const averageBeta = findAverageBeta(latest13Fs)

  const singleHedgeFund = props.singleHedgeFund

  console.log('VALUE SINGLE HEDGE————')

  const data = [
    {
      type: 'S&P',
      value: 1.0,
    },
    {
      type: camelCase(singleHedgeFund.name),
      value:
        singleHedgeFund.thirteenFs[singleHedgeFund.thirteenFs.length - 1]
          .thirteenFBeta,
    },
    {
      type: 'Average Superinvestor',
      value: averageBeta,
    },
  ]

  return (
    <VictoryChart>
      <VictoryBar data={data} x="type" y="value" />
    </VictoryChart>
  )
}

export default BarChart
