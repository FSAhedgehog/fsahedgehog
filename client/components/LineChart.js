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
import renderUtilityQuarterlyValues from './utilities'

// const sampleData = [
//   {x: '2016Q1', y: 111},
//   {x: '2016Q2', y: 120},
//   {x: '2016Q3', y: 133},
//   {x: '2016Q4', y: 144},
//   {x: '2017Q1', y: 155},
//   {x: '2017Q2', y: 166},
//   {x: '2017Q3', y: 140},
//   {x: '2017Q4', y: 135},
//   {x: '2018Q1', y: 167},
//   {x: '2018Q2', y: 189},
//   {x: '2018Q3', y: 211},
//   {x: '2018Q4', y: 234},
//   {x: '2019Q1', y: 278},
//   {x: '2019Q2', y: 298},
//   {x: '2019Q3', y: 311},
//   {x: '2019Q4', y: 255},
//   {x: '2020Q1', y: 267},
//   {x: '2020Q2', y: 289},
//   {x: '2020Q3', y: 316},
//   {x: '2020Q4', y: 389},
// ]

const sampleUserData = [
  {x: '2016Q1', y: 100},
  {x: '2017Q1', y: 110},
  {x: '2018Q1', y: 90},
  {x: '2019Q1', y: 200},
  {x: '2020Q1', y: 230},
]

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
      let newObject = {
        x: `${thirteenFs[i].year}Q${thirteenFs[i].quarter}`,
        y: Math.round((thirteenFs[i][type] / 1000) * 10 - 100),
      }
      if (i === thirteenFs.length - 1) {
        newObject.label = `${Math.round(
          (thirteenFs[thirteenFs.length - 1][type] / 1000) * 10 - 100
        )}%`
      }
      returnArray.push(newObject)
    }
    return returnArray
  }
  render() {
    const quarterlyValue = this.renderQuarterlyValues('quarterlyValue')
    const spValue = this.renderQuarterlyValues('spValue')
    const {hedgeFund} = this.props
    return (
      <VictoryChart
        // minDomain={{y: 0}}
        animate={{
          duration: 3000,
          onLoad: {duration: 200},
        }}
        // title="HELLO"
        // easing="bounceOut"
        style={{
          parent: {
            border: '1px solid #ccc',
          },
          // background: {
          //   fill: 'gray',
          // },
          border: {
            fill: '10px solid red',
          },
        }}
        containerComponent={
          <VictoryVoronoiContainer
            labels={({datum}) => {
              let label = ``
              if (datum.childName === 'chart-line-4') {
                label += `S&P500: ${datum.y}%`
              } else {
                label += `${hedgeFund.name.split(' ')[0]}: ${datum.y}%`
              }
              return label
            }}
            labelComponent={
              <VictoryTooltip
                // style={{fontSize: '10px'}}
                cornerRadius={10}
                // pointerLength={10}
                flyoutStyle={{
                  fill: '#000000',
                  strokeWidth: 0.8,
                  // stroke: '#CCCCCC',
                  opacity: 0.37,
                }}
              />
            }
          />
        }
      >
        {/* <VictoryLabel
          x={225}
          y={25}
          textAnchor="middle"
          text="Songs listened to in 2020"
        /> */}
        <VictoryLabel
          text="5 Year Historical Return"
          x={225}
          y={24}
          textAnchor="middle"
          style={{fill: 'black', fontSize: 16}}
        />
        <VictoryLegend
          x={50}
          y={60}
          centerTitle
          orientation="vertical"
          style={{name: {fontSize: 5}}}
          data={[
            {
              name: `${hedgeFund.name
                .split(' ')
                .filter((word, i) => i < 3)
                .join(' ')}`,
              symbol: {fill: '#8affc1'},
            },
            {name: 'S&P500', symbol: {fill: '#DABFFF'}},
          ]}
        />
        <VictoryAxis
          fixLabelOverlap
          style={{
            tickLabels: {
              fontSize: 12,
              // padding: '20px 5px',
            },
            grid: {stroke: '#818e99', strokeWidth: 0.3},
          }}
          tickFormat={(t) => `${t.slice(0, 4)}        `}
        />
        <VictoryAxis
          dependentAxis
          label="Total % of Gain or Loss"
          tickFormat={(t) => `${t}%`}
          style={{
            tickLabels: {padding: 5, fontSize: 10},
            grid: {stroke: '#818e99', strokeWidth: 0.5},
            axisLabel: {
              padding: 53,
              fontSize: 13,
              fontStyle: 'italic',
            },
          }}
          axisLabelComponent={<VictoryLabel dy={20} />}
        />
        <VictoryLine
          data={quarterlyValue}
          style={{
            data: {stroke: '#8affc1'},
            labels: {fill: '#8affc1', fontSize: '12px', fontWeight: '500'},
          }}
        />
        <VictoryLine
          data={spValue}
          style={{
            data: {stroke: '#DABFFF'},
            labels: {fill: '#DABFFF', fontSize: '12px', fontWeight: '500'},
          }}
        />
      </VictoryChart>
    )
  }
}
