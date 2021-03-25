import React from 'react'
import AllHedgeFunds from './AllHedgeFunds'
import LineChart from './LineChart'
import {PieChart} from '../components'
import WhatToBuy from './WhatToBuy'
import {connect} from 'react-router-dom'

export class Main extends React.Component {
  render() {
    return (
      <div className="flex-cont column">
        <div>
          <h3 className="flex-cont bottom">Welcome, future wealthy person!</h3>
        </div>
        <div className="flex-cont space-btw">
          <AllHedgeFunds />
          {/* <img className="right" src="images/hog.png" alt="hedgehog icon"></img> */}
          {/* <img src="images/hog.png" alt="hedgehog icon"></img> */}
          <WhatToBuy />
        </div>
        <div className="flex-cont align-center">
          <LineChart />
          {/* <WhatToBuy /> */}
          <PieChart />
        </div>
      </div>
    )
  }
}

// const mapStateToProps = () => {}

// const mapDispatchToProps = () => {}

// export default connect(null, null)(Main)
