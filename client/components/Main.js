import React from 'react'
import AllHedgeFunds from './AllHedgeFunds'
import {LineChart} from './LineChart'
import {BarChart, PieChart} from '../components'
import WhatToBuy from './WhatToBuy'
import {connect} from 'react-redux'
import {getSingleHedgeFund} from '../store/singleHedgeFund'

export class Main extends React.Component {
  componentDidMount() {
    this.props.getMySingleHedgeFund()
  }
  render() {
    if (!this.props.loading) {
      return (
        <div className="flex-column">
          <div className="flex-row sml-bottom">
            <h3 className="flex-row">Welcome, future wealthy person!</h3>
          </div>
          <div className="flex-row space bottom">
            <AllHedgeFunds />
          </div>
          <div className="flex-row space-around">
            <div className="flex-row space">
              <LineChart
                thirteenFs={this.props.singleHedgeFund.thirteenFs}
                hedgeFund={this.props.singleHedgeFund}
              />
            </div>
            <div className="flex-row space">
              <PieChart
                stocks={this.props.singleHedgeFund.thirteenFs[0].stocks}
              />
            </div>
            <div className="flex-row">
              <BarChart />
            </div>
            <div className="what-to-buy flex-row not-too-big">
              <WhatToBuy
                stocks={this.props.singleHedgeFund.thirteenFs[0].stocks}
              />
            </div>
          </div>
        </div>
      )
    } else {
      return <div>Loading</div>
    }
  }
}

const mapStateToProps = (state) => {
  return {
    singleHedgeFund: state.singleHedgeFund.singleHedgeFund,
    loading: state.singleHedgeFund.loading,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    getMySingleHedgeFund: (id) => dispatch(getSingleHedgeFund(id)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Main)
