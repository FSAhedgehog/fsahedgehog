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
    console.log('THIS IS STOCKS', stocks)
    return (
      <div>
        <div>
          <form onSubmit={this.handleSubmit}>
            <div className="form-border">
              <label htmlFor="money">
                <small>Here's how you should invest your money:</small>
              </label>
              <input
                required
                value={this.state.money}
                onChange={this.handleChange}
                type="text"
                name="money"
              />{' '}
              <button type="submit" className="button1">
                Clear
              </button>{' '}
            </div>
          </form>
        </div>
        <div>
          <div>
            <div>
              <div className="table-responsive">
                <table className="what-to-buy-table table ">
                  <thead className="text">
                    <tr>
                      <th>Name</th>
                      <th>Ticker</th>
                      <th>Holdings</th>
                      <th>Value</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stocks.map((stock) => {
                      return (
                        <React.Fragment key={stock.id}>
                          <tr>
                            <td>{stock.name}</td>
                            <td>{stock.ticker}</td>
                            <td>{stock.percentageOfPortfolio.toFixed(4)}</td>

                            <th>
                              {Math.floor(
                                this.state.money * stock.percentageOfPortfolio
                              )}
                            </th>
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
    )
  }
}
export default WhatToBuy
