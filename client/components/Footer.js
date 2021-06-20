import React from 'react'
import {Link} from 'react-router-dom'

export const Footer = () => (
  <div>
    <div className="flex-row icon top">
      <h1 className="flex-row">Hedgehog</h1>
    </div>
    <nav>
      <div className="flex-row space">
        <Link to="/disclaimer">Disclaimer</Link>
      </div>
    </nav>
  </div>
)
