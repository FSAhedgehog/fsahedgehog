import React from 'react'
import {connect} from 'react-redux'

export class StockStats extends React.Component {
  render() {
    let stockStats = this.props.stockStats
    if (!this.props.loading) {
      return (
        <div id="growth" className="stock-stats-container">
          <div className="data-labels">
            <p>Rank</p>
            <p>Ticker</p>
            <p>Ownership Count</p>
            <p>Total % of Portfolios</p>
            <p>Total $</p>
          </div>
          <div className="stock-stats-box">
            {stockStats
              .sort((a, b) => b.count - a.count)
              .map((stock, index) => {
                let totalInvested = stock.totalInvested
                let amntIndicator
                if (totalInvested > 1000000000) {
                  totalInvested = totalInvested / 1000000000
                  totalInvested = round(totalInvested, 1)
                  amntIndicator = 'B'
                } else {
                  totalInvested = totalInvested / 1000000
                  totalInvested = round(totalInvested, 0)
                  amntIndicator = 'M'
                }
                return (
                  <div key={stock.id} className="data-container">
                    <p id="rank">{index + 1}</p>
                    <p id="ticker">{stock.ticker}</p>
                    <p id="count">{stock.count}</p>
                    <p id="percentage">{`${(
                      stock.totalPercentage * 100
                    ).toFixed(2)}%`}</p>
                    <p id="invested">{`$${totalInvested} ${amntIndicator}`}</p>
                  </div>
                )
              })}
          </div>
          {/* <div>
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
          </div> */}
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

function round(value, precision) {
  var multiplier = Math.pow(10, precision || 0)
  return Math.round(value * multiplier) / multiplier
}
