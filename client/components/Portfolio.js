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
    if (stocks.length) {
      return (
        <div className="stock-stats-container growth">
          <div id="top-sticky-section">
            <div>
              <p>ThirteenF Meta Data</p>
              <p>{thirteenF.dateOfFiling}</p>
              <p>
                {thirteenF.year}
                {thirteenF.quarter}
              </p>
              <p>{thirteenF.portfolioValue}</p>
              <p>{thirteenF.numberOfStocks}</p>
            </div>
            <div className="sort-bar">
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
