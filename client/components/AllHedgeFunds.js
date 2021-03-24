import React from 'react'
import {getHedgeFunds} from '../store/hedgeFunds'
import {connect} from 'react-redux'

class AllHedgeFunds extends React.Component {
  componentDidMount() {
    this.props.getHedgeFunds()
  }

  render() {
    let hedgeFunds = this.props.hedgeFunds || []

    return (
      <div className="left">
        <div>
          {hedgeFunds.map((hedgeFund) => {
            return (
              <div key={hedgeFund.id}>
                {hedgeFund.name} {hedgeFund.year5}
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
    hedgeFunds: state.hedgeFunds.allHedgeFunds,
  }
}

const mapDispatchToProps = (dispatch) => ({
  getHedgeFunds: () => {
    dispatch(getHedgeFunds())
  },
})

export default connect(mapStateToProps, mapDispatchToProps)(AllHedgeFunds)
