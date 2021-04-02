import React from 'react'

class Test extends React.Component {
  constructor() {
    super()
    this.state = {
      money: 3000,
      currentPage: 1,
      stocksPerPage: 5,
    }
    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleClick = this.handleClick.bind(this)
  }

  handleChange(event) {
    this.setState({[event.target.name]: event.target.value})
  }
  handleSubmit(event) {
    event.preventDefault()
    this.setState(this.money)
  }
  handleClick(event) {
    this.setState({
      currentPage: Number(event.target.id),
    })
  }

  render() {
    let stocks = this.props.stocks || []
    let {currentPage, stocksPerPage} = this.state
    let indexOfLastStock = currentPage * stocksPerPage
    let indexOfFirstStock = indexOfLastStock - stocksPerPage
    let currentStock = stocks.slice(indexOfFirstStock, indexOfLastStock)

    const pageNumbers = []
    for (let i = 1; i <= Math.ceil(stocks.length / stocksPerPage); i++) {
      pageNumbers.push(i)
    }

    const renderPageNumbers = pageNumbers.map((number) => {
      return (
        <div key={number} className="numbers">
          <div
            id={number}
            className={
              'number' + (this.state.currentPage === number ? ' active' : '')
            }
            onClick={this.handleClick}
          >
            {' ' + number + ' '}
          </div>
        </div>
      )
    })
    return (
      <div>
        <div className="center-form">
          <form onSubmit={this.handleSubmit}>
            <div className="form">
              <label htmlFor="money">
                <small>
                  Here's the breakdown of stocks if you invested your money the
                  same way:
                </small>
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
        <table>
          <thead className="text">
            <tr>
              <th>Name</th>
              <th>Ticker</th>
              <th>Holdings</th>
              <th>Value</th>
            </tr>
          </thead>
          <tbody>
            {currentStock.map((stock) => {
              return (
                <React.Fragment key={stock.id}>
                  <tr>
                    <td>{stock.name}</td>
                    <td>{stock.ticker}</td>
                    <td>
                      {(stock.percentageOfPortfolio * 100).toFixed(3) + '%'}
                    </td>

                    <th>
                      {'$' +
                        Math.floor(
                          this.state.money * stock.percentageOfPortfolio
                        )}
                    </th>
                  </tr>
                </React.Fragment>
              )
            })}
          </tbody>
        </table>
        <div className="pages-container">
          <div id="page-numbers">{renderPageNumbers} </div>
        </div>
      </div>
    )
  }
}

export default Test
