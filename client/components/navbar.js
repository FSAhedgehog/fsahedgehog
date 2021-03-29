import React from 'react'
import {Link} from 'react-router-dom'

export const Navbar = (props) => (
  <div>
    <div className="flex-row icon">
      <h1 className="flex-row">Hedgehog</h1>
    </div>
    <nav>
      <div className="flex-row">
        <Link to="/">Home</Link>
        {/* <Link to="/stocks">Stocks</Link>
        <Link to="/resources">Resources</Link> */}
      </div>
    </nav>
  </div>
)
