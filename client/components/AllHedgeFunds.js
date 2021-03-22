import React from 'react'
import {fetchAllHedgeFunds} from '../store/hedgefunds'
import {connect} from 'react-redux'
import {Link} from 'react-router-dom'

class AllHedgeFunds extends React.Component {
  componentDidMount() {
    this.props.getOrders()
  }

  render() {
    const {hedgeFunds} = this.props

    return (
      <div>
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    hedgeFunds: state.hedgeFunds.allHedgeFunds
  }
}

const mapDispatchToProps = dispatch => ({
  getHedgeFunds: () => {
    dispatch(fetchAllHedgeFunds())
  }
})

export default connect(mapStateToProps, mapDispatchToProps)(AllHedgeFunds)
