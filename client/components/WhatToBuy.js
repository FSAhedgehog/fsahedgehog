import React from 'react'

const initialState = {
  money: 0,
}
class WhatToBuy extends React.Component {
  constructor() {
    super()
    this.state = initialState
    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  handleChange(event) {
    this.setState({[event.target.name]: event.target.value})
  }
  handleSubmit(event) {
    event.preventDefault()
    this.setState(initialState)
  }

  render() {
    const {stocks} = this.props
    return (
      <div>
        <div>
          <form onSubmit={this.handleSubmit}>
            <div>
              <label htmlFor="money">
                <small>Money To Invest:</small>
              </label>
              <input
                required
                value={this.state.money}
                onChange={this.handleChange}
                type="text"
                name="money"
              />{' '}
              <button type="submit" className="btn btn-outline-primary btn-sm">
                Clear
              </button>
            </div>
          </form>
        </div>
        <div className="flex-cont">
          <div className="row">
            <div className="col-md-6">
              <div>
                <div className="text-center">
                  <h4> What to buy....</h4>
                </div>
                <div>
                  <div>
                    <table className="table tablesorter" border="1">
                      <thead className=" text-primary">
                        <tr>
                          <th>Ticker</th>
                          <th>Price</th>
                          <th>Shares</th>
                          <th>Holdings %</th>
                          <th>Cost</th>
                        </tr>
                      </thead>
                      <tbody>
                        {stocks.map((stock) => {
                          return (
                            <React.Fragment key={stock.id}>
                              <tr>
                                <td>{stock.ticker}</td>
                                <td>{stock.price}</td>
                                <th>
                                  {Math.floor(
                                    (this.state.money *
                                      stock.percentageOfPortfolio) /
                                      stock.price
                                  )}
                                </th>
                                <td>
                                  {stock.percentageOfPortfolio.toFixed(2)}
                                </td>
                                <td>
                                  {Math.floor(
                                    this.state.money *
                                      stock.percentageOfPortfolio
                                  )}
                                </td>
                              </tr>
                            </React.Fragment>
                          )
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
export default WhatToBuy
