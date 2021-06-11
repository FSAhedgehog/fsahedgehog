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
import {camelCase} from './utilities'

export class LineChart extends React.Component {
  constructor() {
    super()
    this.state = {
      lineChart: 99,
    }
    this.renderQuarterlyValues = this.renderQuarterlyValues.bind(this)
    this.onClick = this.onClick.bind(this)
  }

  onClick(event) {
    this.setState({lineChart: Number(event.target.value)})
  }

  renderQuarterlyValues(type, numberOf13Fs) {
    let {thirteenFs} = this.props

    thirteenFs = thirteenFs.sort((a, b) => {
      let dateA = new Date(a.dateOfFiling)
      let dateB = new Date(b.dateOfFiling)
      return dateA - dateB
    })
    const returnArray = []
    let startingIndex = thirteenFs.length - numberOf13Fs
    let startingValue = thirteenFs[startingIndex][type]
    console.log(startingValue)
    for (let i = startingIndex; i < thirteenFs.length; i++) {
      let yValue = Math.round((thirteenFs[i][type] / startingValue - 1) * 100)
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
    let indexNumberOf13Fs = this.props.thirteenFs.length - 1
    if (this.state.lineChart === 5) {
      indexNumberOf13Fs = 21
    } else if (this.state.lineChart === 3) {
      indexNumberOf13Fs = 13
    } else if (this.state.lineChart === 1) {
      indexNumberOf13Fs = 5
    }

    let quarterlyValue = this.renderQuarterlyValues(
      'quarterlyValue',
      indexNumberOf13Fs
    )
    // quarterlyValue = addGaps(quarterlyValue)
    let spValue = this.renderQuarterlyValues('spValue', indexNumberOf13Fs)
    let topTenValue = this.renderQuarterlyValues(
      'topTenQuarterlyValue',
      indexNumberOf13Fs
    )
    console.log(quarterlyValue, 'QUARTERLY VALUE')
    console.log(quarterlyValue[quarterlyValue.length - 1].y)
    let {hedgeFund} = this.props
    let font = "'Poppins', sans-serif"
    let quarterIndex = quarterlyValue.length - 1
    console.log(quarterlyValue, quarterIndex)
    console.log(quarterlyValue[quarterIndex].y)
    return (
      <div>
        <ul>
          <button type="button" value={99} onClick={this.onClick}>
            Max
          </button>
          <button type="button" value={5} onClick={this.onClick}>
            5 years
          </button>
          <button type="button" value={3} onClick={this.onClick}>
            3 years
          </button>
          <button type="button" value={1} onClick={this.onClick}>
            1 year
          </button>
        </ul>
        <VictoryChart
          animate={{
            duration: 500,
            easing: 'sinOut',
            onLoad: {duration: 500},
          }}
          style={{
            parent: {
              border: '1px solid #ccc',
              boxShadow: '1px 2px 5px rgba(0, 0, 0, 0.65)',
              borderRadius: '15px',
              overflow: 'hidden',
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
                    fill: '#cccccc',
                    strokeWidth: 0.8,
                    opacity: 0.77,
                  }}
                />
              }
            />
          }
        >
          {/* <VictoryLabel
            text="Historical Return"
            x={225}
            y={24}
            textAnchor="middle"
            style={{
              fill: 'black',
              fontFamily: font,
              fontSize: 20,
            }}
          /> */}
          <VictoryLegend
            x={30}
            y={45}
            centerTitle
            orientation="vertical"
            style={{
              data: {fontFamily: font},
              labels: {
                fontFamily: font,
                fontSize: 11,
              },
            }}
            data={[
              {
                name: `${
                  camelCase(hedgeFund.name)
                    .split(' ')
                    .filter((word, i) => i < 3)
                    .join(' ') +
                  ' (' +
                  quarterlyValue[quarterIndex].y
                }%) `,
                labels: {fill: '#59EA94'},
                symbol: {fill: 'rgb(255,255,255)'},
              },
              {
                name: `${
                  camelCase(hedgeFund.name)
                    .split(' ')
                    .filter((word, i) => i < 3)
                    .join(' ') +
                  ' Top Ten (' +
                  topTenValue[quarterIndex].y
                }%) `,
                labels: {fill: 'rgb(99, 222, 251)'},
                symbol: {fill: 'rgb(255,255,255)'},
              },
              {
                name: `S&P500 (${spValue[quarterIndex].y}%)`,
                labels: {fill: 'rgb(157, 97, 255)'},
                symbol: {fill: 'rgb(255,255,255)'},
                // helloooooo
              },
            ]}
          />
          <VictoryAxis
            fixLabelOverlap
            style={{
              tickLabels: {
                fontSize: 12,
                fontFamily: font,
              },
            }}
            tickFormat={(t) => `${t.slice(0, 4)}        `}
          />
          <VictoryAxis
            dependentAxis
            tickFormat={(t) => `${t}%`}
            style={{
              tickLabels: {padding: 5, fontSize: 10, fontFamily: font},
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

              labels: {
                fill: '#59EA94',
                fontSize: '18px',
                fontWeight: '500',
              },
            }}
          />
          <VictoryLine
            data={topTenValue}
            style={{
              data: {stroke: 'rgb(99, 222, 251)'},
              labels: {
                y: -20,
                fill: 'rgb(99, 222, 251)',
                fontSize: '18px',
              },
            }}
          />
          <VictoryLine
            data={spValue}
            style={{
              data: {stroke: 'rgb(157, 97, 255)'},
              labels: {
                fill: 'rgb(157, 97, 255)',
                fontSize: '18px',
              },
            }}
          />
        </VictoryChart>
      </div>
    )
  }
}
//hoople
function getNextYearAndQuarter(year, quarter) {
  quarter = Number(quarter)
  year = Number(year)
  if (quarter === 4) {
    year++
    quarter = 1
  } else {
    quarter++
  }
  return {year, quarter}
}

function addGaps(dataArr) {
  for (let i = 0; i < dataArr.length - 1; i++) {
    let j = i
    const nextDataPoint = `${dataArr[i + 1].x.slice(0, 4)}Q${dataArr[
      i + 1
    ].x.slice(5, 6)}`
    while (
      yFormatNextYearAndQuarter(
        dataArr[j].x.slice(0, 4),
        dataArr[j].x.slice(5, 6)
      ) !== nextDataPoint
    ) {
      dataArr.splice(j + 1, 0, {
        x: yFormatNextYearAndQuarter(
          dataArr[j].x.slice(0, 4),
          dataArr[j].x.slice(5, 6)
        ),
        y: null,
      })
      j++
    }
  }
  return dataArr
}

function yFormatNextYearAndQuarter(year, quarter) {
  ;({year, quarter} = getNextYearAndQuarter(year, quarter))
  return `${year}Q${quarter}`
}
