import React from 'react'
import {Link} from 'react-router-dom'

function getRandomLogo() {
  let image = document.getElementById('Nav-Logo')
  let arrOfLogos = [
    // '/images/HedgeHog-Logo-lightGreen.png',
    '/images/HedgeHog-Logo-lightPurple.png',
    // '/images/HedgeHog-Logo-lightYellow.png',
    '/images/HedgeHog-Logo-medBlue.png',
    '/images/HedgeHog-Logo-Green.png',
    // '/images/HedgeHog-Logo-medGreen.png',
    // '/images/HedgeHog-Logo-medTurqoise.png',
    '/images/HedgeHog-Logo-lightPink.png',
  ]
  let currentLogo = image.src
  let newLogo = arrOfLogos[Math.floor(Math.random() * arrOfLogos.length)]

  console.log(
    String(currentLogo).slice(currentLogo.length - 7),
    String(newLogo).slice(newLogo.length - 7),
    'THIS'
  )
  while (
    String(currentLogo).slice(currentLogo.length - 7) ===
    String(newLogo).slice(currentLogo.length - 7)
  ) {
    newLogo = arrOfLogos[Math.floor(Math.random() * arrOfLogos.length)]
  }
  image.src = newLogo
}

function getRandomColor(el) {
  let image = document.getElementById(el.target.id)
  let arrOfColors = [
    'rgb(167, 154, 255)',
    'rgb(255, 147, 147)',
    'rgb(147, 225, 255)',
    '#59ea94',
  ]
  image.style.color =
    arrOfColors[Math.floor(Math.random() * arrOfColors.length)]
}

function goBlackLogo() {
  let words = document.getElementById('Nav-Logo')
  words.src = '/images/HedgeHog-Logo-Black.png'
}

function goBlackColor(el) {
  let words = document.getElementById(el.target.id)
  words.style.color = 'black'
}

function activate(el) {
  console.log(el.target.style.color)
  let newLink = document.getElementById(el.target.id)
  let oldLink = document.getElementsByClassName('currentLink')[0]
  if (oldLink) oldLink.classList.remove('currentLink')
  console.log(oldLink)
  // newLink.style.color = 'red'
  // newLink.style.backgroundColor = 'red'
  newLink.classList.add('currentLink')
  // newLink.classList.add('currentLink')
  // link.style.transform -
  // image.classList.add('my-class')
}

// $('.button_01').on('click', function () {
//   $('.button_01').removeClass('active')
//   $(this).addClass('active')
// })

export const Navbar = () => (
  <div>
    <nav id="nav-bar">
      <a href="/" id="nav-logo-box">
        <img
          id="Nav-Logo"
          onMouseOver={() => getRandomLogo()}
          onMouseOut={() => goBlackLogo()}
          src={
            process.env.PORT
              ? process.env.PORT + '/images/HedgeHog-Logo-Black.png'
              : '/images/HedgeHog-Logo-Black.png'
          }
          alt="Turqoise Hog"
        ></img>
      </a>
      <Link
        className="nav-bar-link"
        id="hedgeFundsNavLink"
        to="/hedgefunds"
        onMouseOver={(el) => getRandomColor(el)}
        onMouseOut={(el) => goBlackColor(el)}
        onClick={(el) => activate(el)}
      >
        Hedgefunds
      </Link>
      <div className="geeks" />
      <Link
        className="nav-bar-link"
        id="methodologyNavLink"
        to="/methodology"
        onMouseOver={(el) => getRandomColor(el)}
        onMouseOut={(el) => goBlackColor(el)}
        onClick={(el) => activate(el)}
      >
        Methodology
      </Link>
      {/* </div> */}
      {/* <div> */}
      <Link
        className="nav-bar-link"
        id="aboutNavLink"
        to="/about"
        onMouseOver={(el) => getRandomColor(el)}
        onMouseOut={(el) => goBlackColor(el)}
        onClick={(el) => activate(el)}
      >
        About
      </Link>
      {/* </div> */}
    </nav>
  </div>
)
//whwh
