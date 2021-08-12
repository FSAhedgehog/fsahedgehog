import React from 'react'
import {
  VictoryBar,
  VictoryChart,
  VictoryLegend,
  VictoryAxis,
  VictoryLabel,
} from 'victory'
import {findAverageBeta, camelCase, determineColor} from './utilities'
import {std} from 'mathjs'

export const BarChart = (props) => {
  // const latest13Fs = props.hedgeFunds.map(
  //   (hedgeFund) => hedgeFund.thirteenFs[0]
  // )

  // const averageBeta = findAverageBeta(latest13Fs)

  const singleHedgeFund = props.singleHedgeFund
  const singleFundBeta =
    singleHedgeFund.thirteenFs[singleHedgeFund.thirteenFs.length - 1]
      .thirteenFBeta

  // const percentile = getPercentile(latest13Fs, averageBeta, singleFundBeta)
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
      fill: 'rgb(147, 225, 255)',
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

  const font = "'Poppins', sans-serif"

  return (
    <div>
      {/* <h2 id="line-chart-title">Hedge Fund Volatility</h2> */}
      <VictoryChart
        animate={{
          duration: 2000,
          onLoad: {duration: 1000},
        }}
        domainPadding={50}
        domain={{y: [0.7, 2.3]}}
        style={{
          data: {fontFamily: font},
          labels: {fontFamily: font},
          parent: {
            fontFamily: font,
            // border: '1px solid #ccc',
            borderRadius: '15px',
            // boxShadow: '1px 2px 5px rgba(0, 0, 0, 0.65)',
            backgroundColor: 'rgb(215,215,215)',
          },
        }}
      >
        {/* <VictoryAxis
          dependentAxis
          label={`${singleHedgeFund.name} current portfolio is ${Math.round(
            percentile * 100
          )} percentile for volatility/risk`}
          style={{
            tickLabels: {fontFamily: font},
            axisLabel: {fontStyle: 'italic', padding: 34, fontFamily: font},
          }}
        /> */}
        <VictoryAxis
          crossAxis
          style={{tickLabels: {fontSize: 12, fontFamily: font}}}
        />
        <VictoryLegend
          title="Hedge Fund Volatility"
          // orientation="center"
          // data={legendData}
          centerTitle
          gutter={20}
          x={95}
          y={8}
          style={{
            title: {
              fontSize: 26,
              fontFamily: font,
              // fill: 'rgb(255, 147, 147)',
              fontWeight: '600',
            },
            labels: {fontSize: 0, fontFamily: font, fill: 'rgb(215,215,215)'},
            symbol: {fill: 'rgb(215,215,215)'},
          }}
        />
        <VictoryBar
          data={data}
          style={{
            data: {
              fill: ({datum}) => datum.fill,
              fontFamily: font,
            },
            labels: {
              fontFamily: font,
            },
          }}
          labels={({datum}) => (datum.value ? datum.value.toFixed(2) : 0)}
          x="type"
          y="value"
        />
      </VictoryChart>
    </div>
  )
}

export default BarChart

function getPercentile(thirteenFs, averageBeta, portfolioBeta) {
  if (thirteenFs.length) {
    const stDev = std(thirteenFs.map((thirteenF) => thirteenF.thirteenFBeta))
    let z = (portfolioBeta - averageBeta) / stDev
    let percentile = getZPercent(z)
    return percentile
  } else {
    return 0.5
  }
}

function getZPercent(z) {
  // z == number of standard deviations from the mean

  // if z is greater than 6.5 standard deviations from the mean the
  // number of significant digits will be outside of a reasonable range

  if (z < -6.5) {
    return 0.0
  }

  if (z > 6.5) {
    return 1.0
  }

  var factK = 1
  var sum = 0
  var term = 1
  var k = 0
  var loopStop = Math.exp(-23)

  while (Math.abs(term) > loopStop) {
    term =
      (((0.3989422804 * Math.pow(-1, k) * Math.pow(z, k)) /
        (2 * k + 1) /
        Math.pow(2, k)) *
        Math.pow(z, k + 1)) /
      factK
    sum += term
    k++
    factK *= k
  }

  sum += 0.5

  return sum
}
