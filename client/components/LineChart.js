import React from 'react'
import {
  VictoryChart,
  VictoryLine,
  VictoryAxis,
  VictoryLegend,
  VictoryTooltip,
  VictoryVoronoiContainer,
  VictoryLabel,
} from 'victory'
import {renderUtilityQuarterlyValues, camelCase} from './utilities'

export class LineChart extends React.Component {
  constructor() {
    super()
    this.renderQuarterlyValues = this.renderQuarterlyValues.bind(this)
  }

  renderQuarterlyValues(type) {
    let {thirteenFs} = this.props

    thirteenFs = thirteenFs.sort((a, b) => {
      let dateA = new Date(a.dateOfFiling)
      let dateB = new Date(b.dateOfFiling)
      return dateA - dateB
    })

    const returnArray = []
    for (let i = 0; i < thirteenFs.length; i++) {
      let yValue = Math.round((thirteenFs[i][type] / 1000) * 10 - 100)
      let newObject = {
        x: `${thirteenFs[i].year}Q${thirteenFs[i].quarter}`,
        y: yValue,
      }
      if (i === thirteenFs.length - 1) {
        newObject.label = `${yValue}%`
      }
      returnArray.push(newObject)
    }
    return returnArray
  }
  render() {
    const quarterlyValue = this.renderQuarterlyValues('quarterlyValue')
    const spValue = this.renderQuarterlyValues('spValue')
    const {hedgeFund} = this.props
    const font = "'Poppins', sans-serif"

    return (
      <div>
        <VictoryChart
          animate={{
            duration: 2000,
            onLoad: {duration: 1000},
          }}
          style={{
            parent: {
              border: '1px solid #ccc',
              borderRadius: '15px',
            },
          }}
          containerComponent={
            <VictoryVoronoiContainer
              labels={({datum}) => {
                let label = ``
                if (datum.childName === 'chart-line-5') {
                  label += `S&P500: ${datum.y}%`
                } else {
                  label += `${camelCase(hedgeFund.name).split(' ')[0]}: ${
                    datum.y
                  }%`
                }
                return label
              }}
              labelComponent={
                <VictoryTooltip
                  cornerRadius={10}
                  flyoutStyle={{
                    fill: '#000000',
                    strokeWidth: 0.8,
                    opacity: 0.37,
                  }}
                  style={{fontFamily: font}}
                />
              }
            />
          }
        >
          <VictoryLabel
            text="Five Year Historical Return"
            x={225}
            y={24}
            textAnchor="middle"
            style={{
              fill: 'black',
              fontFamily: font,
              fontSize: 20,
            }}
          />
          <VictoryLegend
            x={50}
            y={70}
            centerTitle
            orientation="vertical"
            style={{
              data: {fontFamily: font},
              labels: {
                fontFamily: font,
                fontSize: 13,
              },
            }}
            data={[
              {
                name: `${camelCase(hedgeFund.name)
                  .split(' ')
                  .filter((word, i) => i < 3)
                  .join(' ')}`,
                symbol: {fill: '#59EA94'},
              },
              {name: 'S&P500', symbol: {fill: 'rgb(157, 97, 255)'}},
            ]}
          />
          <VictoryAxis
            fixLabelOverlap
            style={{
              tickLabels: {
                fontSize: 12,
                fontFamily: font,
              },
              grid: {stroke: '#818e99', strokeWidth: 0.3},
            }}
            tickFormat={(t) => `${t.slice(0, 4)}        `}
          />
          <VictoryAxis
            dependentAxis
            label="Total % of Gain or Loss On Assets"
            tickFormat={(t) => `${t}%`}
            style={{
              tickLabels: {padding: 5, fontSize: 10, fontFamily: font},
              grid: {stroke: '#818e99', strokeWidth: 0.5},
              axisLabel: {
                padding: 53,
                fontSize: 13,
                fontFamily: font,
                fontStyle: 'italic',
              },
            }}
            axisLabelComponent={<VictoryLabel dy={20} />}
          />
          <VictoryLine
            data={quarterlyValue}
            style={{
              data: {stroke: '#59EA94'},
              labels: {fill: '#59EA94', fontSize: '12px', fontWeight: '500'},
            }}
          />
          <VictoryLine
            data={spValue}
            style={{
              data: {stroke: 'rgb(157, 97, 255)'},
              labels: {
                fill: 'rgb(157, 97, 255)',
                fontSize: '12px',
                fontWeight: '500',
                fontFamily: font,
              },
            }}
          />
        </VictoryChart>
      </div>
    )
  }
}
