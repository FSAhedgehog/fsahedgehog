import React from 'react'
import {Link} from 'react-router-dom'

function getRandom() {
  let image = document.getElementById('Nav-Logo')
  let arrOfLogos = [
    // '/images/HedgeHog-Logo-lightGreen.png',
    '/images/HedgeHog-Logo-lightPurple.png',
    '/images/HedgeHog-Logo-lightYellow.png',
    '/images/HedgeHog-Logo-medBlue.png',
    // '/images/HedgeHog-Logo-medGreen.png',
    // '/images/HedgeHog-Logo-medTurqoise.png',
    '/images/HedgeHog-Logo-lightPink.png',
  ]
  image.src = arrOfLogos[Math.floor(Math.random() * arrOfLogos.length)]
}

function goBlack() {
  let image = document.getElementById('Nav-Logo')
  image.src = '/images/HedgeHog-Logo-Black.png'
}

export const Navbar = () => (
  <div>
    <div className="flex-row icon top">
      <a href="/">
        <img
          id="Nav-Logo"
          onMouseOver={() => getRandom()}
          onMouseOut={() => goBlack()}
          src={
            process.env.PORT
              ? process.env.PORT + '/images/HedgeHog-Logo-Black.png'
              : '/images/HedgeHog-Logo-Black.png'
          }
          alt="Turqoise Hog"
        ></img>
      </a>
    </div>
    <nav>
      <div className="flex-row space">
        <Link to="/hedgefunds">Hedgefunds</Link>
      </div>
      <div className="flex-row space">
        <Link to="/methodology">methodology</Link>
      </div>
      <div className="flex-row space">
        <Link to="/about">about</Link>
      </div>
    </nav>
  </div>
)
//whwh
