import React, {Component} from 'react'
import {Route, Switch} from 'react-router-dom'
import Main from './components/Main'
import OldMain from './components/OldMain'
import singleHedgeFund from './components/singleHedgeFund'
import {Methodology} from './components/Methodology'

class Routes extends Component {
  render() {
    return (
      <Switch>
        <Route exact path="/" component={OldMain} />
        <Route exact path="/hedgefunds" component={Main} />
        <Route exact path="/hedgefunds/:id" component={singleHedgeFund} />
        <Route exact path="/methodology" component={Methodology} />
      </Switch>
    )
  }
}

export default Routes
