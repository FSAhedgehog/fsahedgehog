import React from 'react'
import {Link} from 'react-router-dom'

export const Navbar = (props) => (
  <div>
    <h1 className="flex-cont">Hedgehog</h1>
    <nav>
      <div className="flex-cont">
        <Link to="/">Home</Link>
        {/* <Link to="/stocks">Stocks</Link>
        <Link to="/resources">Resources</Link> */}
      </div>
    </nav>
  </div>
)
