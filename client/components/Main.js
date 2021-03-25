import React from 'react'
import AllHedgeFunds from './AllHedgeFunds'
import LineChart from './LineChart'
import {PieChart} from '../components'

export const Main = (props) => {
  return (
    <div className="flex-cont column">
      <div>
        <h3 className="flex-cont bottom">Welcome, future wealthy person!</h3>
      </div>
      <div className="flex-cont space-btw">
        <AllHedgeFunds />
        <img className="right" src="images/hog.png" alt="hedgehog icon"></img>
      </div>
      <div className="flex-cont align-center">
        <LineChart />
        <PieChart />
      </div>
    </div>
  )
}
