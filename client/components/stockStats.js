import React from 'react'
import {connect} from 'react-redux'

export class StockStats extends React.Component {
  render() {
    let stockStats = this.props.stockStats
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

export default connect(mapStateToProps)(StockStats)
