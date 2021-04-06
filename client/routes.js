import React, {Component} from 'react'
import {Route, Switch} from 'react-router-dom'
import Main from './components/Main'
import {Disclaimer} from './components/Disclaimer'

class Routes extends Component {
  render() {
    return (
      <Switch>
        <Route exact path="/" component={Main} />
        <Route exact path="/disclaimer" component={Disclaimer} />
      </Switch>
    )
  }
}

export default Routes
