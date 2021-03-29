import React from 'react'
import AllHedgeFunds from './AllHedgeFunds'
import {LineChart} from './LineChart'
import {PieChart, Portfolio} from '../components'
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
        <div className="flex-cont column">
          <div>
            <h3 className="flex-cont bottom">
              Welcome, future wealthy person!
            </h3>
          </div>
          <div className="main-container">
            <div className="left-main-container">
              <AllHedgeFunds />
            </div>
            <div className="flex-cont right-main-container">
              <div className="main-right-top">
                <PieChart
                  stocks={this.props.singleHedgeFund.thirteenFs[0].stocks}
                />
              </div>
              <div className="main-right-bottom">
                <div className="lineChart">
                  <LineChart
                    thirteenFs={this.props.singleHedgeFund.thirteenFs}
                    hedgeFund={this.props.singleHedgeFund}
                  />
                </div>
              </div>
              <div className="portfolio">
                <Portfolio
                  thirteenF={this.props.singleHedgeFund.thirteenFs[0]}
                  hedgeFund={this.props.singleHedgeFund}
                />
              </div>
              <div className="what-to-buy">
                <WhatToBuy
                  stocks={this.props.singleHedgeFund.thirteenFs[0].stocks}
                />
              </div>
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
