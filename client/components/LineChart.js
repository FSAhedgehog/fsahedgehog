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
    let indexNumberOf13Fs = this.props.thirteenFs.length
    if (this.state.lineChart === 5) {
      indexNumberOf13Fs = 21
    } else if (this.state.lineChart === 3) {
      indexNumberOf13Fs = 13
    } else if (this.state.lineChart === 1) {
      indexNumberOf13Fs = 5
    }
    // makeActiveButton(this.state.lineChart)
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
    let bottomTenValue = this.renderQuarterlyValues(
      'bottomTenQuarterlyValue',
      indexNumberOf13Fs
    )
    let {hedgeFund} = this.props
    let font = "'Poppins', sans-serif"
    let quarterIndex = quarterlyValue.length - 1
    return (
      <div id="line-chart-tab">
        {/* <h2 id="line-chart-title">Historical Return</h2> */}

        <VictoryChart
          animate={{
            duration: 500,
            easing: 'sinOut',
            onLoad: {duration: 500},
          }}
          style={{
            parent: {
              // border: '1px solid #ccc',
              // boxShadow: '1px 2px 5px rgba(0, 0, 0, 0.65)',
              borderRadius: '15px',
              overflow: 'hidden',
              backgroundColor: 'rgb(215,215,215)',
            },
          }}
          containerComponent={
            <VictoryVoronoiContainer
              labels={({datum}) => {
                console.log(datum)
                let label = ``
                if (datum.childName === 'sp500') {
                  label += `S&P500: ${datum.y}%`
                } else if (datum.childName === 'bottomTen') {
                  label += `${
                    camelCase(hedgeFund.name).split(' ')[0]
                  } Bottom Ten: ${datum.y}%`
                } else if (datum.childName === 'topTen') {
                  label += `${
                    camelCase(hedgeFund.name).split(' ')[0]
                  } Top Ten: ${datum.y}%`
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
                    // opacity: 0.77,
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
          {/* <VictoryLegend
            // orientation="center"
            // data={legendData}
            centerTitle
            gutter={20}
            x={95}
            y={14}
            style={{
              title: {
                fontSize: 26,
                fontFamily: font,
                fill: 'rgb(255, 147, 147)',
                fontWeight: '600',
              },
              labels: {fontSize: 0, fontFamily: font, fill: 'rgb(215,215,215)'},
              symbol: {fill: 'rgb(215,215,215)'},
            }}
          /> */}
          <VictoryLabel
            text="Historical Return"
            x={158}
            y={25}
            // textAnchor="middle"
            style={{
              fontSize: 24,
              fontFamily: font,
              fontWeight: '600',
              // paddingTop: 40,
            }}
          />
          <VictoryLegend
            // title="Historical Return"
            centerTitle
            // gutter={20}
            x={30}
            y={43}
            orientation="vertical"
            style={{
              // title: {
              //   fontSize: 20,
              //   fontFamily: font,
              //   fontWeight: '600',
              //   marginLeft: '50px',
              // },
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
                symbol: {fill: 'rgb(215,215,215)'},
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
                symbol: {fill: 'rgb(215,215,215)'},
              },
              {
                name: `${
                  camelCase(hedgeFund.name)
                    .split(' ')
                    .filter((word, i) => i < 3)
                    .join(' ') +
                  ' Bottom Ten (' +
                  bottomTenValue[quarterIndex].y
                }%) `,
                labels: {fill: 'rgb(255, 147, 147)'},
                symbol: {fill: 'rgb(215,215,215)'},
              },
              {
                name: `S&P500 (${spValue[quarterIndex].y}%)`,
                labels: {fill: 'rgb(157, 97, 255)'},
                symbol: {fill: 'rgb(215,215,215)'},
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
            name="total"
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
            name="topTen"
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
            data={bottomTenValue}
            name="bottomTen"
            style={{
              data: {stroke: 'rgb(255, 147, 147)'},
              labels: {
                y: -20,
                fill: 'rgb(255, 147, 147)',
                fontSize: '18px',
              },
            }}
          />
          <VictoryLine
            data={spValue}
            name="sp500"
            style={{
              data: {stroke: 'rgb(157, 97, 255)'},
              labels: {
                fill: 'rgb(157, 97, 255)',
                fontSize: '18px',
              },
            }}
          />
        </VictoryChart>
        <ul>
          <button
            type="button"
            value={99}
            onClick={this.onClick}
            id="max-button"
          >
            Max
          </button>
          <button
            type="button"
            value={5}
            onClick={this.onClick}
            id="five-year-button"
          >
            5 years
          </button>
          <button
            type="button"
            value={3}
            onClick={this.onClick}
            id="three-year-button"
          >
            3 years
          </button>
          <button
            type="button"
            value={1}
            onClick={this.onClick}
            id="one-year-button"
          >
            1 year
          </button>
        </ul>
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

function getButtonIdWithLineChartState(lineChartState) {
  switch (lineChartState) {
    case 99:
      return 'max-button'
    case 5:
      return 'five-year-button'
    case 3:
      return 'three-year-button'
    default:
      return 'one-year-button'
  }
}

function makeActiveButton(lineChartState) {
  let id = getButtonIdWithLineChartState(lineChartState)
  let button = document.getElementById(id)
  button.style.color = 'rgb(167, 154, 255)'
}

function addGaps(dataArr) {
  for (let i = 0; i < dataArr.length - 1; i++) {
    let j = i
    // add gaps was a good function but we don't need it!!!!!
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
