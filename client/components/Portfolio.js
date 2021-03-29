import React from 'react'

/*

<div className="portfolio">
                  <Portfolio
                    thirteenF={this.props.singleHedgeFund.thirteenFs[0]}
                    hedgeFund={this.props.singleHedgeFund}
                  />
                </div>

*/

export class Portfolio extends React.Component {
  // constructor() {
  //   super()
  // }
  render() {
    const {thirteenF} = this.props
    const {hedgeFund} = this.props
    console.log(thirteenF, 'thirteenF')
    console.log(hedgeFund, 'hedgeFund')
    return (
      <div>
        <div>
          <p>Date of Filing: {thirteenF.dateOfFiling}</p>
          <p>Portfolio Value: {Number(thirteenF.portfolioValue)}</p>
          <p>Portfolio's Beta: {thirteenF.thirteenFBeta}</p>
        </div>
        {thirteenF.stocks.map((stock) => {
          return (
            <div key={stock.cusip}>
              <p>Ticker: {stock.ticker}</p>
              <p>
                Percentage of Portfolio{' '}
                {(stock.percentageOfPortfolio * 100).toFixed(2)}%
              </p>
              <p>Quantity of Shares Held: {stock.qtyOfSharesHeld}</p>
              <p>Total Value: ${stock.totalValue}</p>
            </div>
          )
        })}
      </div>
    )
  }
}
