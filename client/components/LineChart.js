import React from 'react'
import {connect} from 'react-redux'
import {getSingleHedgeFund} from '../store/singleHedgeFund'

import {VictoryChart, VictoryLine, VictoryAxis} from 'victory'

const sampleData = [
  {x: '2016Q1', y: 111},
  {x: '2016Q2', y: 120},
  {x: '2016Q3', y: 133},
  {x: '2016Q4', y: 144},
  {x: '2017Q1', y: 155},
  {x: '2017Q2', y: 166},
  {x: '2017Q3', y: 140},
  {x: '2017Q4', y: 135},
  {x: '2018Q1', y: 167},
  {x: '2018Q2', y: 189},
  {x: '2018Q3', y: 211},
  {x: '2018Q4', y: 234},
  {x: '2019Q1', y: 278},
  {x: '2019Q2', y: 298},
  {x: '2019Q3', y: 311},
  {x: '2019Q4', y: 255},
  {x: '2020Q1', y: 267},
  {x: '2020Q2', y: 289},
  {x: '2020Q3', y: 316},
  {x: '2020Q4', y: 389},
]

const sampleUserData = [
  {x: '2016Q1', y: 100},
  {x: '2017Q1', y: 110},
  {x: '2018Q1', y: 90},
  {x: '2019Q1', y: 200},
  {x: '2020Q1', y: 230},
]

export class LineChart extends React.Component {
  componentDidMount() {
    console.log('PROPS', this.props)
    // this.props.getMySingleHedgeFund(1)
  }
  render() {
    return (
      <VictoryChart
        domainPadding={20}
        padding={75}
        minDomain={{y: 0}}
        animate={{
          duration: 4000,
          onLoad: {duration: 1000},
        }}
      >
        <VictoryAxis
          fixLabelOverlap
          style={{
            tickLabels: {padding: 30, fontSize: 6},
            grid: {stroke: '#818e99', strokeWidth: 0.5},
          }}
        />
        <VictoryAxis dependentAxis />
        <VictoryLine data={sampleData} style={{data: {stroke: '#8affc1'}}} />
        <VictoryLine
          data={sampleUserData}
          style={{data: {stroke: '#DABFFF'}}}
        />
      </VictoryChart>
    )
  }
}

const mapStateToProps = (state) => {
  console.log('STATE', state)
  return {
    singleHedgeFund: state.singleHedgeFund.singleHedgeFund,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    getMySingleHedgeFund: (id) => dispatch(getSingleHedgeFund(id)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(LineChart)
