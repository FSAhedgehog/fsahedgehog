import React from 'react'
import {getHedgeFunds} from '../store/funds'
import {connect} from 'react-redux'
import {getSingleHedgeFund} from '../store/oneFund'
import {camelCase} from './utilities'

class AllHedgeFunds extends React.Component {
  constructor() {
    super()
    this.state = {
      sort: 'none',
    }
    this.clickHedgeFund = this.clickHedgeFund.bind(this)
    this.moveHedgeHogToState = this.moveHedgeHogToState.bind(this)
    this.updateSort = this.updateSort.bind(this)
  }
  componentDidMount() {
    this.props.getHedgeFunds()
    if (!this.props.singleHedgeFund.id) {
      this.props.getMySingleHedgeFund(1)
    }
  }
  clickHedgeFund(hedgeFundId) {
    this.moveHedgeHogToState()
    return this.props.getMySingleHedgeFund(hedgeFundId)
  }
  moveHedgeHogToState(hedgeFundId) {
    if (this.props.singleHedgeFund.id === hedgeFundId) {
      return (
        <img
          className="hedgeFundHog"
          src="images/hog.png"
          alt="hedgehog icon"
        ></img>
      )
    }
  }

  updateSort(event) {
    console.log(event)
    this.setState({sort: event.target.value})
  }

  render() {
    let hedgeFunds = this.props.hedgeFunds || []
    if (this.state.sort !== 'none') {
      hedgeFunds = sortHedgeFunds(hedgeFunds, this.state.sort).reverse()
    }
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
              Sort by: None
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
          {hedgeFunds.map((hedgeFund) => {
            return (
              <div
                key={hedgeFund.id}
                onClick={() => this.clickHedgeFund(hedgeFund.id)}
                className="singleHedgeFundContainer"
              >
                <div className="hedgeFundName">
                  <p>{camelCase(hedgeFund.name)}</p>
                  <div>{this.moveHedgeHogToState(hedgeFund.id)}</div>
                </div>
                <div className="hedgeFundReturnsContainer">
                  {/* <p className="assetsReturn">Asset's Returns: </p> */}
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
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    hedgeFunds: state.hedgeFunds.hedgeFunds,
    singleHedgeFund: state.singleHedgeFund.singleHedgeFund,
  }
}

const mapDispatchToProps = (dispatch) => ({
  getHedgeFunds: () => {
    dispatch(getHedgeFunds())
  },
  getMySingleHedgeFund: (hedgeFundId) =>
    dispatch(getSingleHedgeFund(hedgeFundId)),
})

export default connect(mapStateToProps, mapDispatchToProps)(AllHedgeFunds)

function sortHedgeFunds(hedgeFunds, sort) {
  if (sort === 'none') {
    return hedgeFunds
  } else if (sort === '1Year') {
    return hedgeFunds.sort((a, b) => a.yearOneReturn - b.yearOneReturn)
  } else if (sort === '3Year') {
    return hedgeFunds.sort((a, b) => a.yearThreeReturn - b.yearThreeReturn)
  } else if (sort === '5Year') {
    return hedgeFunds.sort((a, b) => a.yearFiveReturn - b.yearFiveReturn)
  }
}
