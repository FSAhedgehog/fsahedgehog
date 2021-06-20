import React from 'react'
import {Link} from 'react-router-dom'

export class Methodology extends React.Component {
  render() {
    return (
      <div>
        <div className="left right">
          HedgeHog is not a registered investment, legal, or tax advisor or a
          broker/dealer. All investment/ financial opinions expressed by
          HedgeHog are from the personal research and experience of the owners
          of the sites and are intended as educational material. Although best
          efforts are made to ensure that all information is up to date,
          occasional unintended errors and misprints may occur.
        </div>
        <div className="flex-row space">
          <Link to="/">Back to Home</Link>
        </div>
      </div>
    )
  }
}
