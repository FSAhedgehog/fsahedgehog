import React from 'react'
import {connect} from 'react-redux'
import {getStockStats} from '../store/stockStats'
import {
  sortedStockCount,
  sortedStockPercentage,
  sortedStockInvested,
} from './utilities'
// import api from 'sec-api'

export class StockStats extends React.Component {
  componentDidMount() {
    this.props.getMyStockStats()
  }

  render() {
    let stockStats = this.props.stockStats
    let sortedCount = sortedStockCount(stockStats)
    let sortedPercentage = sortedStockPercentage(stockStats)
    let sortedInvested = sortedStockInvested(stockStats)
    if (!this.props.loading) {
      return (
        <div>
          <div>
            {stockStats
              .sort((a, b) => b.count - a.count)
              .map((stock) => (
                <div key={stock.id}>{stock.ticker}</div>
              ))}
          </div>
          <div>
            {stockStats
              .sort((a, b) => b.totalInvested - a.totalInvested)
              .map((stock) => (
                <div key={stock.id}>{stock.totalInvested}</div>
              ))}
          </div>
          <div>
            {stockStats
              .sort((a, b) => b.totalPercentage - a.totalPercentage)
              .map((stock) => (
                <div key={stock.id}>{stock.totalPercentage}</div>
              ))}
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
    stockStats: state.stockStats.stockStats,
    loading: state.stockStats.loading,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    getMyStockStats: () => dispatch(getStockStats()),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(StockStats)
