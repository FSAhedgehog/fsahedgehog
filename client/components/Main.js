import React from 'react'
import AllHedgeFunds from './AllHedgeFunds'
import {LineChart} from './LineChart'
import {PieChart} from '../components'
import WhatToBuy from './WhatToBuy'
import {connect} from 'react-redux'
import {getSingleHedgeFund} from '../store/singleHedgeFund'

export class Main extends React.Component {
  componentDidMount() {
    this.props.getMySingleHedgeFund()
  }
  render() {
    // if (this.props.singleHedgeFund.thirteenFs) {
    //   console.log(
    //     'FIND STOCKS',
    //     this.props.singleHedgeFund.thirteenFs[0].stocks
    //   )
    // }
    // console.log('LOADING', this.props.loading)
    if (!this.props.loading) {
      // console.log('PROPS', this.props.singleHedgeFund.thirteenFs)
      return (
        <div className="flex-cont column">
          <div>
            <h3 className="flex-cont bottom">
              Welcome, future wealthy person!
            </h3>
          </div>
          <div className="flex-cont space-btw">
            <AllHedgeFunds />
            <img
              className="right"
              src="images/hog.png"
              alt="hedgehog icon"
            ></img>
          </div>
          <div className="flex-cont align-center">
            <LineChart thirteenFs={this.props.singleHedgeFund.thirteenFs} />
            {/* <WhatToBuy /> */}
            <PieChart
              stocks={this.props.singleHedgeFund.thirteenFs[0].stocks}
            />
          </div>
        </div>
      )
    } else {
      return <div>Loading</div>
    }
  }
}

const mapStateToProps = (state) => {
  return {
    singleHedgeFund: state.singleHedgeFund.singleHedgeFund,
    loading: state.singleHedgeFund.loading,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    getMySingleHedgeFund: (id) => dispatch(getSingleHedgeFund(id)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Main)
