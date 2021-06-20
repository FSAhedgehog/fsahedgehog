import React from 'react'
import {getHedgeFunds} from '../store/funds'
import {connect} from 'react-redux'
import {getSingleHedgeFund} from '../store/oneFund'
import {sortHedgeFunds, camelCase} from './utilities'
import SortedHedgeFunds from './SortedHedgeFunds'
import {Link} from 'react-scroll'

class AllHedgeFunds extends React.Component {
  constructor() {
    super()
    this.state = {
      sort: 'none',
      currentPage: 1,
      hedgeFundsPerPage: 5,
    }
    // this.clickHedgeFund = this.clickHedgeFund.bind(this)
    // this.moveHedgeHogToState = this.moveHedgeHogToState.bind(this)
    this.updateSort = this.updateSort.bind(this)
    this.handleClick = this.handleClick.bind(this)
  }

  // componentDidMount() {
  //   this.props.getHedgeFunds()
  //   if (!this.props.singleHedgeFund.id) {
  //     this.props.getMySingleHedgeFund()
  //   }
  // }

  handleClick(event) {
    this.setState({
      currentPage: Number(event.target.id),
    })
  }

  clickHedgeFund(hedgeFundId) {
    this.moveHedgeHogToState()
    return this.props.getMySingleHedgeFund(hedgeFundId)
  }

  // moveHedgeHogToState(hedgeFundId) {
  //   if (this.props.singleHedgeFund.id === hedgeFundId) {
  //     return (
  //       <img
  //         className="hedgeFundHog"
  //         src="images/hogGreen.png"
  //         alt="hedgehog icon"
  //       ></img>
  //     )
  //   }
  // }

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

    // return (
    //   <SortedHedgeFunds
    //     currentHedgeFunds={currentHedgeFunds}
    //     renderPageNumbers={renderPageNumbers}
    //     // moveHedgeHogToState={this.moveHedgeHogToState}
    //     // clickHedgeFund={this.clickHedgeFund}
    //     updateSort={this.updateSort}
    //   />
    // )
    return (
      <div className="flex-column">
        <div className="sml-bottom flex-row">
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
                  document.getElementsByClassName('Link')[0].click()
                }}
                href="#anchor-name"
                className="singleHedgeFundContainer"
                key={hedgeFund.id}
              >
                <div className="hedgeFundName">
                  <p>{camelCase(hedgeFund.name)}</p>
                  {/* <div>{moveHedgeHogToState(hedgeFund.id)}</div> */}
                </div>
                <div className="hedgeFundReturnsContainer">
                  <div className="singleReturnContainer">
                    <div className="yearReturnLabel">
                      <p>1 Yr</p>
                    </div>
                    <div className="yearReturnNumber">
                      <p>
                        {`${(hedgeFund.yearOneReturn * 100 - 100).toFixed(1)}%`}
                      </p>
                    </div>
                  </div>
                  <div className="singleReturnContainer">
                    <div className="yearReturnLabel">
                      <p>3 Yrs</p>
                    </div>
                    <div className="yearReturnNumber">
                      <p>
                        {`${(hedgeFund.yearThreeReturn * 100 - 100).toFixed(
                          1
                        )}%`}
                      </p>
                    </div>
                  </div>
                  <div className="singleReturnContainer">
                    <div className="yearReturnLabel">
                      <p>5 Yrs</p>
                    </div>
                    <div className="yearReturnNumber">
                      <p>
                        {`${(hedgeFund.yearFiveReturn * 100 - 100).toFixed(
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
        <div className="pages-container">
          <div id="page-numbers">{renderPageNumbers} </div>
        </div>
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
  }
}

const mapStateToProps = (state) => {
  return {
    hedgeFunds: state.hedgeFunds.hedgeFunds,
  }
}

export default connect(mapStateToProps)(AllHedgeFunds)
