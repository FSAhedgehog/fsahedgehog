import React from 'react'
import {VictoryBar, VictoryChart, VictoryLegend} from 'victory'
import {findAverageBeta, camelCase, determineColor} from './utilities'

export const BarChart = (props) => {
  const latest13Fs = props.hedgeFunds.map(
    (hedgeFund) => hedgeFund.thirteenFs[0]
  )

  const averageBeta = findAverageBeta(latest13Fs)

  const singleHedgeFund = props.singleHedgeFund
  const singleFundBeta =
    singleHedgeFund.thirteenFs[singleHedgeFund.thirteenFs.length - 1]
      .thirteenFBeta

  const data = [
    {
      type: 'S&P',
      value: 1.0,
      fill: determineColor(1.0),
    },
    {
      type: camelCase(
        camelCase(singleHedgeFund.name)
          .split(' ')
          .filter((word, i) => i < 3)
          .join(' ')
      ),
      value: singleFundBeta,
      fill: determineColor(singleFundBeta),
    },
    {
      type: 'HF Average',
      value: averageBeta,
      fill: determineColor(averageBeta),
    },
  ]

  const legendData = [
    {
      name: 'Average',
      symbol: {
        fill: 'rgb(157, 97, 255)',
      },
    },
    {name: 'More Volatile', symbol: {fill: '#DABFFF'}},
    {name: 'Less Volatile', symbol: {fill: '#8affc1'}},
  ]

  return (
    <div>
      <VictoryChart
        animate={{
          duration: 2000,
          onLoad: {duration: 1000},
        }}
        domainPadding={50}
        domain={{y: [0.7, 2.3]}}
      >
        <VictoryLegend
          title="Hedge Fund Beta Risk"
          orientation="horizontal"
          data={legendData}
          centerTitle
          x={80}
          y={50}
          style={{title: {fontSize: 20}}}
        />
        <VictoryBar
          data={data}
          style={{
            data: {
              fill: ({datum}) => datum.fill,
            },
          }}
          labels={({datum}) => datum.value.toFixed(2)}
          x="type"
          y="value"
        />
      </VictoryChart>
    </div>
  )
}

export default BarChart
