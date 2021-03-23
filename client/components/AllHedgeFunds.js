import React from 'react'
import {fetchAllHedgeFunds} from '../store/hedgefunds'
import {connect} from 'react-redux'
import {Link} from 'react-router-dom'

const data = {
  hedgeFunds: [
    {
      name: 'Bill & Melinda Gates Foundation Trust',
      year1: 136,
      year3: 154,
      year5: 246,
    },
    {
      name: 'Pershing Square Capital Management',
      year1: 123,
      year3: 166,
      year5: 298,
    },
    {
      name: 'Daily Journal Corp',
      year1: 87,
      year3: 123,
      year5: 176,
    },
    {
      name: 'Greenlight Capital',
      year1: 199,
      year3: 266,
      year5: 456,
    },
    {
      name: 'Berkshire Hathaway',
      year1: 155,
      year3: 283,
      year5: 298,
    },
  ],
}

class AllHedgeFunds extends React.Component {
  componentDidMount() {
    // this.props.getOrders()
  }

  render() {
    const {hedgeFunds} = data

    return (
      <div>
        <div></div>
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
    dispatch(fetchAllHedgeFunds())
  },
})

export default connect(mapStateToProps, mapDispatchToProps)(AllHedgeFunds)
