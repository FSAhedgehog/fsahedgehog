import React from 'react'
import {getHedgeFunds} from '../store/hedgeFunds'
import {connect} from 'react-redux'
import {getSingleHedgeFund} from '../store/singleHedgefund'

class AllHedgeFunds extends React.Component {
  constructor() {
    super()
    this.clickHedgeFund = this.clickHedgeFund.bind(this)
    this.moveHedgeHogToState = this.moveHedgeHogToState.bind(this)
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
    console.log('MOVING HOG')
    if (this.props.singleHedgeFund.id === hedgeFundId) {
      return (
        <img className="right" src="images/hog.png" alt="hedgehog icon"></img>
      )
    }
  }

  render() {
    const hedgeFunds = this.props.hedgeFunds || []

    return (
      <div className="left">
        <div>
          {hedgeFunds.map((hedgeFund) => {
            return (
              <div key={hedgeFund.id}>
                <button
                  onClick={() => this.clickHedgeFund(hedgeFund.id)}
                  type="button"
                >
                  {hedgeFund.name} {hedgeFund.year5}
                </button>
                {this.moveHedgeHogToState(hedgeFund.id)}
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
