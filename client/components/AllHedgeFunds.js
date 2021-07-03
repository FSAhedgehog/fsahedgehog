import React, {useCallback} from 'react'
import {getHedgeFunds} from '../store/funds'
import {connect} from 'react-redux'
import {getSingleHedgeFund} from '../store/oneFund'
import {sortHedgeFunds, camelCase} from './utilities'
import SortedHedgeFunds from './SortedHedgeFunds'
import {Link} from 'react-scroll'
import history from '../history'
// import {useHistory} from 'react-router-dom'
// import {useNavigate} from 'react-router-dom'
// const navigate = useNavigate()
// navigate('/home')

// const history = useHistory()
// const clickHedgeFund = useCallback(() => history.push('/sample'), [history])

// const history = useHistory()

class AllHedgeFunds extends React.Component {
  constructor() {
    super()
    this.state = {
      sort: 'none',
      currentPage: 1,
      hedgeFundsPerPage: 5,
    }
    this.updateSort = this.updateSort.bind(this)
    this.handleClick = this.handleClick.bind(this)
  }

  handleClick(event) {
    this.setState({
      currentPage: Number(event.target.id),
    })
  }

  clickHedgeFund(hedgeFundId) {
    history.push(`hedgefunds/${hedgeFundId}`)
  }

  updateSort(event) {
    this.setState({sort: event.target.value})
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

    if (this.state.sort !== 'none') {
      hedgeFunds = sortHedgeFunds(hedgeFunds, this.state.sort).reverse()
    }

    let currentHedgeFunds = hedgeFunds.slice(
      indexOfFirstHedge,
      indexOfLastHedge
    )

    console.log(currentHedgeFunds[0], 'HERE')
    if (this.props.hedgeFunds.length) {
      console.log(currentHedgeFunds[0].thirteenFs[0].numberOfStocks)
      currentHedgeFunds[0].thirteenFs[0].portfolioValue
      currentHedgeFunds[0].thirteenFs[0].thirteenFBeta
      return (
        <div>
          <div>
            <div id="hedgefunds-container">
              <h2>Hedge Funds</h2>
              <div>
                <select
                  name="sort"
                  id="return"
                  onChange={this.updateSort}
                  className="sort"
                >
                  <option id="none" value="none" defaultValue="none">
                    Sort by: Return %
                  </option>
                  <option id="1Year" value="1Year">
                    Sort by: 1 Year Return
                  </option>
                  <option id="3Year" value="3Year">
                    Sort by: 3 Year Return
                  </option>
                  <option id="5Year" value="5Year">
                    Sort by: 5 Year Return
                  </option>
                </select>
              </div>
              <div className="hedgeFundsContainer">
                {currentHedgeFunds.map((hedgeFund) => {
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
                      <p className="hedgeFundName">
                        {camelCase(hedgeFund.name)}
                      </p>
                      {/* <div>{moveHedgeHogToState(hedgeFund.id)}</div> */}
                      {/* </div> */}
                      <div className="hedgeFundReturnsContainer">
                        <div className="singleReturnContainer">
                          <div className="yearReturnLabel">
                            <p>1 Yr</p>
                          </div>
                          <div className="yearReturnNumber">
                            <p>
                              {`${(hedgeFund.yearOneReturn * 100 - 100).toFixed(
                                1
                              )}%`}
                            </p>
                          </div>
                        </div>
                        <div className="singleReturnContainer">
                          <div className="yearReturnLabel">
                            <p>Number of Stocks</p>
                          </div>
                          <div className="yearReturnNumber">
                            <p>
                              {`${(hedgeFund.yearOneReturn * 100 - 100).toFixed(
                                1
                              )}%`}
                            </p>
                          </div>
                        </div>
                        <div className="singleReturnContainer">
                          <div className="yearReturnLabel">
                            <p>3 Yrs</p>
                          </div>
                          <div className="yearReturnNumber">
                            <p>
                              {`${(
                                hedgeFund.yearThreeReturn * 100 -
                                100
                              ).toFixed(1)}%`}
                            </p>
                          </div>
                        </div>
                        <div className="singleReturnContainer">
                          <div className="yearReturnLabel">
                            <p>5 Yrs</p>
                          </div>
                          <div className="yearReturnNumber">
                            <p>
                              {`${(
                                hedgeFund.yearFiveReturn * 100 -
                                100
                              ).toFixed(1)}%`}
                            </p>
                          </div>
                        </div>
                        <div className="singleReturnContainer">
                          <div className="yearReturnLabel">
                            <p>Max</p>
                          </div>
                          <div className="yearReturnNumber">
                            <p>
                              {`${(hedgeFund.maxReturn * 100 - 100).toFixed(
                                1
                              )}%`}
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
          </div>
          <div id="right-half-hedgefunds-page"></div>
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
