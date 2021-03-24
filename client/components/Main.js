import React from 'react'
import AllHedgeFunds from './AllHedgeFunds'

export const Main = (props) => {
  return (
    <div>
      <div>
        <h3 className="flex-cont">Welcome, future wealthy person!</h3>
      </div>
      <div>
        <AllHedgeFunds />
        <img src="images/hog.png" alt="hedgehog icon"></img>
      </div>
    </div>
  )
}
