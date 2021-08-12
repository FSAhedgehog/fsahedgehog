import React from 'react'
import {Link} from 'react-router-dom'

export class About extends React.Component {
  render() {
    return (
      <div id="about">
        <h2>Coming soon! :)</h2>
        <div className="flex-row space">
          <Link to="/">Back to Home</Link>
        </div>
      </div>
    )
  }
}
