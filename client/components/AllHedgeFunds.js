import React, {useCallback} from 'react'
import {getHedgeFunds} from '../store/funds'
import {connect} from 'react-redux'
import {getSingleHedgeFund} from '../store/oneFund'
import {sortHedgeFunds, camelCase} from './utilities'
import SortedHedgeFunds from './SortedHedgeFunds'
import {Link} from 'react-scroll'
import history from '../history'

class AllHedgeFunds extends React.Component {
  constructor() {
    super()
    this.state = {
      sort: 'none',
      currentPage: 1,
      hedgeFundsPerPage: 500,
    }
    this.updateSort = this.updateSort.bind(this)
    // this.handleClick = this.handleClick.bind(this)
  }

  // handleClick(event) {
  //   this.setState({
  //     currentPage: Number(event.target.id),
  //   })
  // }

  clickHedgeFund(hedgeFundId) {
    history.push(`hedgefunds/${hedgeFundId}`)
  }

  updateSort(event) {
    this.setState({sort: event.target.value})
    console.log('hello', this.state.sort, event.target.value)
  }

  render() {
    let hedgeFunds = this.props.hedgeFunds || []
    let {currentPage, hedgeFundsPerPage} = this.state
    let indexOfLastHedge = currentPage * hedgeFundsPerPage
    let indexOfFirstHedge = indexOfLastHedge - hedgeFundsPerPage

    const pageNumbers = []
    for (
      let i = 1;
      i <= Math.ceil(hedgeFunds.length / hedgeFundsPerPage);
      i++
    ) {
      pageNumbers.push(i)
    }

    // const renderPageNumbers = pageNumbers.map((number) => {
    //   return (
    //     <div key={number} className="numbers">
    //       <div
    //         id={number}
    //         className={
    //           'number' + (this.state.currentPage === number ? ' active' : '')
    //         }
    //         onClick={this.handleClick}
    //       >
    //         {' ' + number + ' '}
    //       </div>
    //     </div>
    //   )
    // })

    // if (this.state.sort !== 'none') {
    //   hedgeFunds = sortHedgeFunds(hedgeFunds, this.state.sort).reverse()
    // }

    let currentHedgeFunds = hedgeFunds.slice(
      indexOfFirstHedge,
      indexOfLastHedge
    )

    if (this.props.hedgeFunds.length) {
      return (
        <div id="hedgefunds-container" className="growth">
          <div id="top-sticky-hedgefund">
            <div className="hedgefund-sort-bar">
              <select
                name="sort"
                id="return"
                onChange={this.updateSort}
                className="sort"
              >
                <option id="none" value="none" defaultValue="none">
                  Sorted by nothing
                </option>
                <option id="numberOfStocks" value="numberOfStocks">
                  Sorted by Number of Stocks
                </option>
                <option id="yearOneReturn" value="yearOneReturn">
                  Sorted by 1 Year Return
                </option>
                <option id="yearThreeReturn" value="yearThreeReturn">
                  Sorted by 3 Year Return
                </option>
                <option id="yearFiveReturn" value="yearFiveReturn">
                  Sorted by 5 Year Return
                </option>
                <option id="maxReturn" value="maxReturn">
                  Sorted by Total Return
                </option>
                <option id="portfolioValue" value="portfolioValue">
                  Sorted by Portfolio Value
                </option>
                <option id="thirteenFBeta" value="thirteenFBeta">
                  Sorted by Beta
                </option>
              </select>
            </div>
          </div>
          <div className="hedgeFundsContainer">
            {currentHedgeFunds
              .sort((a, b) => {
                if (this.state.sort === 'maxReturn') {
                  return (
                    Number(b[this.state.sort].slice(6)) -
                    Number(a[this.state.sort].slice(6))
                  )
                } else if (this.state.sort === 'numberOfStocks') {
                  let indexOfA = currentHedgeFunds.indexOf(a)
                  let indexOfB = currentHedgeFunds.indexOf(b)
                  return (
                    currentHedgeFunds[indexOfB].thirteenFs[0].numberOfStocks -
                    currentHedgeFunds[indexOfA].thirteenFs[0].numberOfStocks
                  )
                } else if (this.state.sort === 'portfolioValue') {
                  let indexOfA = currentHedgeFunds.indexOf(a)
                  let indexOfB = currentHedgeFunds.indexOf(b)
                  return (
                    currentHedgeFunds[indexOfB].thirteenFs[0].portfolioValue -
                    currentHedgeFunds[indexOfA].thirteenFs[0].portfolioValue
                  )
                } else if (this.state.sort === 'thirteenFBeta') {
                  let indexOfA = currentHedgeFunds.indexOf(a)
                  let indexOfB = currentHedgeFunds.indexOf(b)
                  return (
                    currentHedgeFunds[indexOfB].thirteenFs[0].thirteenFBeta -
                    currentHedgeFunds[indexOfA].thirteenFs[0].thirteenFBeta
                  )
                }
                return b[this.state.sort] - a[this.state.sort]
              })
              .map((hedgeFund, index) => {
                let portfolioValue =
                  currentHedgeFunds[index].thirteenFs[0].portfolioValue
                let amntIndicator
                if (portfolioValue > 1000000000) {
                  portfolioValue = portfolioValue / 1000000000
                  portfolioValue = round(portfolioValue, 1)
                  amntIndicator = 'B'
                } else {
                  portfolioValue = portfolioValue / 1000000
                  portfolioValue = round(portfolioValue, 0)
                  amntIndicator = 'M'
                }

                return (
                  <div
                    onClick={() => {
                      this.clickHedgeFund(hedgeFund.id)
                      // document.getElementsByClassName('Link')[0].click()
                    }}
                    href="#anchor-name"
                    className="singleHedgeFundContainer"
                    key={hedgeFund.id}
                  >
                    {/* <div className="hedgeFundName"> */}
                    <p className="hedgeFundName">{camelCase(hedgeFund.name)}</p>
                    {/* <div>{moveHedgeHogToState(hedgeFund.id)}</div> */}
                    {/* </div> */}
                    <div className="hedgeFundReturnsContainer">
                      <div className="singleReturnContainer">
                        <div className="yearReturnLabel">
                          <p># of Stocks</p>
                        </div>
                        <div className="yearReturnNumber">
                          <p>
                            {
                              currentHedgeFunds[index].thirteenFs[0]
                                .numberOfStocks
                            }
                          </p>
                        </div>
                      </div>
                      <div className="singleReturnContainer">
                        <div className="yearReturnLabel">
                          <p>1 Yr Return</p>
                        </div>
                        <div className="yearReturnNumber">
                          <p>
                            {hedgeFund.yearOneReturn * 100 - 100 !== -100
                              ? `${(
                                  hedgeFund.yearOneReturn * 100 -
                                  100
                                ).toFixed(0)}%`
                              : 'NA'}
                          </p>
                        </div>
                      </div>
                      <div className="singleReturnContainer">
                        <div className="yearReturnLabel">
                          <p>3 Yr Return</p>
                        </div>
                        <div className="yearReturnNumber">
                          <p>
                            {hedgeFund.yearThreeReturn * 100 - 100 !== -100
                              ? `${(
                                  hedgeFund.yearThreeReturn * 100 -
                                  100
                                ).toFixed(0)}%`
                              : 'NA'}
                          </p>
                        </div>
                      </div>
                      <div className="singleReturnContainer">
                        <div className="yearReturnLabel">
                          <p>5 Yr Return</p>
                        </div>
                        <div className="yearReturnNumber">
                          <p>
                            {`${(hedgeFund.yearFiveReturn * 100 - 100).toFixed(
                              0
                            )}%`}
                          </p>
                        </div>
                      </div>
                      <div className="singleReturnContainer">
                        <div className="yearReturnLabel">
                          <p>Total Return</p>
                        </div>
                        <div className="yearReturnNumber">
                          <p>
                            {`${(
                              Number(hedgeFund.maxReturn.slice(6)) * 100 -
                              100
                            ).toFixed(0)}%`}
                          </p>
                        </div>
                      </div>
                      <div className="singleReturnContainer">
                        <div className="yearReturnLabel">
                          <p>Value</p>
                        </div>
                        <div className="yearReturnNumber">
                          <p>{`$${portfolioValue} ${amntIndicator}`}</p>
                        </div>
                      </div>
                      <div className="singleReturnContainer">
                        <div className="yearReturnLabel">
                          <p>Beta</p>
                        </div>
                        <div className="yearReturnNumber">
                          <p>
                            {currentHedgeFunds[
                              index
                            ].thirteenFs[0].thirteenFBeta.toFixed(2)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
          </div>
          {/* <div className="pages-container">
              <div id="page-numbers">{renderPageNumbers} </div>
            </div> */}
          <Link
            className="Link"
            spy={true}
            smooth={true}
            offset={-30}
            duration={700}
            to="anchor-name"
          />
        </div>
      )
    } else {
      return <h2>Loading</h2>
    }
  }
}

const mapStateToProps = (state) => {
  return {
    hedgeFunds: state.hedgeFunds.hedgeFunds,
  }
}

export default connect(mapStateToProps)(AllHedgeFunds)

function round(value, precision) {
  var multiplier = Math.pow(10, precision || 0)
  return Math.round(value * multiplier) / multiplier
}
