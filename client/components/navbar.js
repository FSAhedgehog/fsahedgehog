import React from 'react'
import {Link} from 'react-router-dom'

export const Navbar = (props) => (
  <div>
    <div className="flex-cont icon">
      <h1 className="flex-cont">Hedgehog</h1>
    </div>
    <nav>
      <div className="flex-cont">
        <Link to="/">Home</Link>
        {/* <Link to="/stocks">Stocks</Link>
        <Link to="/resources">Resources</Link> */}
      </div>
    </nav>
  </div>
)
