import React from 'react'
import {Link} from 'react-router-dom'

export class About extends React.Component {
  render() {
    return (
      <div>
        <div className="left right">This is all about me!!!!!</div>
        <div className="flex-row space">
          <Link to="/">Back to Home</Link>
        </div>
      </div>
    )
  }
}
