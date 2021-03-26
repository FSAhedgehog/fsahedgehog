import React from 'react'

class WhatToBuy extends React.Component {
  render() {
    return (
      <div>
        <div>
          <form name="value">
            <div>
              <label htmlFor="money">
                <small>Money To Invest:</small>
              </label>
              <input name="money" type="text" />{' '}
              <button type="button">Calculate</button>
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
                    <table className="table tablesorter">
                      <thead className=" text-primary">
                        <tr>
                          <th>Name</th>
                          <th>Ticker</th>
                          <th>Shares</th>
                          <th>Holdings %</th>
                          <th>Cost</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>Apple</td>
                          <td>stock.ticker</td>
                          <td>100</td>
                          <td>10</td>
                          <td>$12,000</td>
                        </tr>
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

// const mapStateToProps = (state) => {
//   return {
//     singleHedgeFund: state.singleHedgeFund.singleHedgeFund,
//     loading: state.loading,
//   }
// }

// const mapDispatchToProps = (dispatch) => {
//   return {
//     getMySingleHedgeFund: (id) => dispatch(getSingleHedgeFund(id)),
//   }
// }

// export default connect(mapStateToProps, mapDispatchToProps)
export default WhatToBuy
