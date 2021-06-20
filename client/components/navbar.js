import React from 'react'
import {Link} from 'react-router-dom'

export const Navbar = () => (
  <div>
    <div className="flex-row icon top">
      <img
        id="Nav-Logo"
        src={
          process.env.PORT
            ? process.env.PORT + '/images/HedgeHog-Logo-Black.png'
            : '/images/HedgeHog-Logo-Black.png'
        }
        alt="Turqoise Hog"
      ></img>
    </div>
    <nav>
      <div className="flex-row space">
        <Link to="/methodology">methodology</Link>
      </div>
    </nav>
  </div>
)
