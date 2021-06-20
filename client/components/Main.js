import React from 'react'
import AllHedgeFunds from './AllHedgeFunds'
import {HedgeFundStats, StockStats} from '../components'
import {getHedgeFunds} from '../store/funds'
import {getHedgeStats} from '../store/hedgeStats.js'
import {getStockStats} from '../store/stockStats.js'
import {connect} from 'react-redux'
import {EmailSub} from './EmailSub'
// import api from 'sec-api'

export class Main extends React.Component {
  componentDidMount() {
    this.props.getHedgeFunds()
    this.props.getHedgeStats()
    this.props.getStockStats()
  }

  render() {
    if (!this.props.loading) {
      return (
        <div>
          <div className="flex-column">
            <div className="flex-row sml-bottom">
              <AllHedgeFunds />
              <HedgeFundStats />
              <StockStats />
            </div>
            <div></div>
          </div>
        </div>
      )
    } else {
      return <div>Loading</div>
    }
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    getHedgeFunds: () => {
      dispatch(getHedgeFunds())
    },
    getHedgeStats: () => {
      dispatch(getHedgeStats())
    },
    getStockStats: () => {
      dispatch(getStockStats())
    },
  }
}

export default connect(null, mapDispatchToProps)(Main)
