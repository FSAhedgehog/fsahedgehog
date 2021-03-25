import React from 'react'
import {getHedgeFunds} from '../store/hedgeFunds'
import {connect} from 'react-redux'
import {getSingleHedgeFund} from '../store/singleHedgefund'

class AllHedgeFunds extends React.Component {
  constructor() {
    super()
    this.clickHedgeFund = this.clickHedgeFund.bind(this)
  }
  componentDidMount() {
    this.props.getHedgeFunds()
    // if (!this.props.singleHedgeFund) {
    //   this.props.getMySingleHedgeFund(1)
    // }
  }
  clickHedgeFund(hedgeFundId) {
    // evt.preventDefault()
    console.log('CLICK', hedgeFundId)
    console.log('PROPS', this.props)
    return this.props.getMySingleHedgeFund(hedgeFundId)
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
