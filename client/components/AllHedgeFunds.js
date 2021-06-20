import React from 'react'
import {getHedgeFunds} from '../store/funds'
import {connect} from 'react-redux'
import {getSingleHedgeFund} from '../store/oneFund'
import {sortHedgeFunds} from './utilities'
import SortedHedgeFunds from './SortedHedgeFunds'

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

  // clickHedgeFund(hedgeFundId) {
  //   this.moveHedgeHogToState()
  //   return this.props.getMySingleHedgeFund(hedgeFundId)
  // }

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

    return (
      <SortedHedgeFunds
        currentHedgeFunds={currentHedgeFunds}
        renderPageNumbers={renderPageNumbers}
        // moveHedgeHogToState={this.moveHedgeHogToState}
        // clickHedgeFund={this.clickHedgeFund}
        updateSort={this.updateSort}
      />
    )
  }
}

const mapStateToProps = (state) => {
  return {
    hedgeFunds: state.hedgeFunds.hedgeFunds,
  }
}

export default connect(mapStateToProps)(AllHedgeFunds)
