import React from 'react'

class Portfolio extends React.Component {
  constructor() {
    super()
    this.state = {
      sort: 'percentageOfPortfolio',
    }
    this.updateSort = this.updateSort.bind(this)
    // this.handleClick = this.handleClick.bind(this)
  }

  updateSort(event) {
    this.setState({sort: event.target.value})
  }

  render() {
    let stocks = this.props.stocks || []
    let thirteenF = this.props.thirteenF
    console.log(stocks.length)
    let portfolioValue = thirteenF.portfolioValue
    let valueIndicator
    if (portfolioValue > 1000000000) {
      portfolioValue = portfolioValue / 1000000000
      portfolioValue = round(portfolioValue, 1)
      valueIndicator = 'B'
    } else {
      portfolioValue = portfolioValue / 1000000
      portfolioValue = round(portfolioValue, 0)
      valueIndicator = 'M'
    }
    if (stocks.length) {
      return (
        <div className="stock-stats-container growth">
          <div id="top-sticky-section">
            <div id="fundStatsWholeComponent">
              <div className="hedgeFundTitle">
                <h2 id="stock-stats-title">Portfolio</h2>
                <div className="hedgeFundStatsContainer">
                  <div className="hedgeFundStatsBox">
                    <div className="singleStatContainer">
                      <div className="yearReturnLabel">
                        <p>Quarter</p>
                      </div>
                      <div className="yearReturnNumber">
                        <p>{`${thirteenF.year} Q${thirteenF.quarter}`}</p>
                      </div>
                    </div>
                    <div className="singleStatContainer">
                      <div className="yearReturnLabel">
                        <p>Date Recorded</p>
                      </div>
                      <div className="yearReturnNumber">
                        <p>
                          {quarterEndDate(thirteenF.year, thirteenF.quarter)}
                        </p>
                      </div>
                    </div>
                    <div className="singleStatContainer">
                      <div className="yearReturnLabel">
                        <p>Date Released</p>
                      </div>
                      <div className="yearReturnNumber">
                        <p>{thirteenF.dateOfFiling.slice(0, 10)}</p>
                      </div>
                    </div>
                    <div className="singleStatContainer">
                      <div className="yearReturnLabel">
                        <p>Value </p>
                      </div>
                      <div className="yearReturnNumber">
                        <p>{`$${portfolioValue}${valueIndicator}`}</p>
                      </div>
                    </div>
                    <div className="singleStatContainer">
                      <div className="yearReturnLabel">
                        <p># of Stocks </p>
                      </div>
                      <div className="yearReturnNumber">
                        <p>{this.props.stocks.length}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="portfolio-sort-bar">
              <select
                name="sort"
                id="return"
                onChange={this.updateSort}
                className="sort"
              >
                <option
                  id="percentageOfPortfolio"
                  value="percentageOfPortfolio"
                >
                  Sorted by Total % of Portfolios
                </option>
                <option id="price" value="price">
                  Sorted by Reported Price
                </option>
                <option id="qtyOfSharesHeld" value="qtyOfSharesHeld">
                  Sorted by Quantity of Shares Held
                </option>
              </select>
            </div>
            <div className="data-labels">
              <p>Rank</p>
              <p>Ticker</p>
              <p>Total % of Portfolios</p>
              <p>Total $</p>
              <p>Reported Price</p>
              <p>Quantity of Shares</p>
            </div>
          </div>
          <div className="stock-stats-box">
            {stocks
              .sort((a, b) => b[this.state.sort] - a[this.state.sort])
              .map((stock, index) => {
                let totalInvested = stock.totalValue
                console.log(totalInvested)
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
                    <p id="percentage">{`${(
                      Number(stock.percentageOfPortfolio) * 100
                    ).toFixed(2)}%`}</p>
                    <p id="invested">{`$${totalInvested} ${amntIndicator}`}</p>
                    <p id="invested">{`$${stock.price}`}</p>
                    <p id="invested">{`${stock.qtyOfSharesHeld}`}</p>
                  </div>
                )
              })}
          </div>
        </div>
      )
    } else {
      return <div>Loading</div>
    }
  }
}

export default Portfolio

function round(value, precision) {
  var multiplier = Math.pow(10, precision || 0)
  return Math.round(value * multiplier) / multiplier
}

function quarterEndDate(year, quarter) {
  switch (quarter) {
    case 1:
      return `${year}-3-31`
    case 2:
      return `${year}-6-30`
    case 3:
      return `${year}-9-30`
    default:
      return `${year}-12-31`
  }
}
