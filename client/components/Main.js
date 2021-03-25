import React from 'react'
import AllHedgeFunds from './AllHedgeFunds'
import WhatToBuy from './WhatToBuy'

export const Main = () => {
  return (
    <div>
      <div>
        <h3 className="flex-cont">Welcome, future wealthy person!</h3>
      </div>
      <div>
        <AllHedgeFunds />
        <WhatToBuy  />
        <img src="images/hog.png" alt="hedgehog icon"></img>
      </div>
    </div>
  )
}
